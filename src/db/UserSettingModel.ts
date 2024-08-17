import ChatSessionModel from "@/db/ChatSessionModel";

const dbName = "chatDB";
const uerStoreName = "userSetting";

let db: IDBDatabase;

// 打开或创建数据库
const request = indexedDB.open(dbName, 2); // 版本号为2


request.onsuccess = function (event) {
    // @ts-ignore
    db = event.target.result;
};

request.onerror = function (event) {
    console.error("Error opening IndexedDB database.", event);
};


async function saveUserSetting(userInfo: Object): Promise<void> {
    const transaction = db.transaction([uerStoreName], "readwrite");
    const objectStore = transaction.objectStore(uerStoreName);
    objectStore.put(userInfo); // 使用 put 方法
    if (!Reflect.has(userInfo, 'noReadCount')){
        // @ts-ignore
        userInfo.noReadCount = 0;
    }
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}



async function getUserSetting(userId: string): Promise<Object[]> {
    const transaction = db.transaction(uerStoreName, 'readonly');
    const objectStore = transaction.objectStore(uerStoreName);
    return new Promise((resolve, reject) => {
        const request = objectStore.get(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateNoReadCount(userId: string, noReadCount: number): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const userSetting = await getUserSetting(userId);
    if (!userSetting) {
        return;
    }
    if (noReadCount === 0){
        return;
    }
    if (noReadCount) {
        //@ts-ignore
        userSetting.noReadCount = noReadCount; // 更新 noReadCount
        // 保存更新后的会话
        await saveUserSetting(userSetting);
    } else {
        //清空未读条数
        noReadCount = 0;
        //@ts-ignore
        userSetting.noReadCount = noReadCount; // 更新 noReadCount
        await saveUserSetting(userSetting);
    }
    console.log("Session updated successfully.");
}

export default {
    saveUserSetting,
    getUserSetting,
    updateNoReadCount
}