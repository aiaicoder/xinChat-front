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
    if (!Reflect.has(userInfo, 'noReadCount')) {
        // @ts-ignore
        userInfo.noReadCount = 0;
    }
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}


async function getUserSetting(userId: string): Promise<Object> {
    const transaction = db.transaction(uerStoreName, 'readonly');
    const objectStore = transaction.objectStore(uerStoreName);
    return new Promise((resolve, reject) => {
        const request = objectStore.get(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


async function updateNoReadCount(userId: string, noReadCountValue: any, isAdd: boolean): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const userSetting = await getUserSetting(userId);
    if (!userSetting) {
        return;
    }
    //@ts-ignore
    if (!userSetting.noReadCount && isAdd) {
        //@ts-ignore
        userSetting.noReadCount += noReadCountValue;
        await saveUserSetting(userSetting);
    } else {
        //@ts-ignore
        userSetting.noReadCount = noReadCountValue;
        await saveUserSetting(userSetting);
    }
}



async function removeNoReadCount(userId: string): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const userSetting = await getUserSetting(userId);
    if (!userSetting) {
        return;
    }
    //@ts-ignore
    if (!userSetting.noReadCount) {
        return
    } else {
        //@ts-ignore
        userSetting.noReadCount = 0;
        await saveUserSetting(userSetting);
    }

}

export default {
    saveUserSetting,
    getUserSetting,
    updateNoReadCount,
    removeNoReadCount
}