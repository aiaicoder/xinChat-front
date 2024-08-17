import ChatSessionModel from "@/db/ChatSessionModel";

const dbName = "chatDB";
const storeName = "messages";

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


async function saveChatMessages(message: Object[]): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const chatSessionCountMap = {};
    message.forEach((msg) => {
        //@ts-ignore
        const contactId = msg.contactType == 1 ? msg.contactId : msg.sendUserId;
        // @ts-ignore
        const noReadCount = chatSessionCountMap[contactId] || 0;
        if (!noReadCount){
            // @ts-ignore
            chatSessionCountMap[contactId] = 1;
        }else {
            // @ts-ignore
            chatSessionCountMap[contactId] = noReadCount + 1;
        }
        objectStore.put(msg); // 使用 put 方法
    });
    for (const item in chatSessionCountMap){
        // @ts-ignore
        const noReadCount = chatSessionCountMap[item]
        await ChatSessionModel.updateNoReadCount(item, noReadCount);
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}

async function saveChatMessage(message: Object): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    objectStore.put(message); // 使用 put 方法
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}


async function getAllMessages(): Promise<Object[]> {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export default {
    saveChatMessages,
    getAllMessages,
    saveChatMessage
}