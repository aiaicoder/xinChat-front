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
    // debugger
    message.forEach((msg) => {
        //@ts-ignore
        const contactId = msg.contactType == 1 ? msg.contactId : msg.sendUserId;
        // @ts-ignore
        const noReadCount = chatSessionCountMap[contactId] || 0;
        if (!noReadCount) {
            // @ts-ignore
            chatSessionCountMap[contactId] = 1;
        } else {
            // @ts-ignore
            chatSessionCountMap[contactId] = noReadCount + 1;
        }
        objectStore.put(msg)
    });
    // for (const item in chatSessionCountMap) {
    //     // @ts-ignore
    //     const noReadCount = chatSessionCountMap[item]
    //     await ChatSessionModel.updateNoReadCount(item, noReadCount);
    // }
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


async function addUnreadMessage(message: Object[]): Promise<void> {
    const allMessages = await getAllMessages();
    // 找出 message 数组中不存在于 allMessages 的消息
    // @ts-ignore
    const newMessages = message.filter(msg => !allMessages.some(existingMsg => existingMsg.messageId === msg.messageId));
    await saveChatMessages(newMessages);
}

async function getMessageById(messageId: string): Promise<Object> {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
        const request = objectStore.get(messageId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}


/**
 * 根据 sessionId 分页查询消息
 * @param {string} sessionId - 会话ID
 * @param {number} pageNo - 当前页数
 * @param {number} maxMessageId - 最大消息ID
 * @returns {Promise<{messages: Object[], currentPage: number, messageCount: number}>} - 返回消息列表、当前页数和当前页的消息数量
 */
async function getChatMessage(sessionId: string, pageNo: number, maxMessageId: number): Promise<{
    messages: Object[];
    currentPage: number;
    messageCount: number
}> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const index = objectStore.index('SessionIndex');
    // 固定的 pageSize
    const pageSize = 15; // 每页显示4条消息
    // 计算起始位置
    const startId = (pageNo - 1) * pageSize;
    const endId = startId + pageSize;
    if (!maxMessageId) {
        maxMessageId = Number.MAX_SAFE_INTEGER;
    }
    return new Promise((resolve, reject) => {
        const messages: Object[] = [];
        let count = 0;
        let messageCount = 0;
        // 开始查询
        const query = index.openCursor(IDBKeyRange.only(sessionId), 'prev'); // 查询特定的sessionId
        query.onsuccess = (event) => {
            // @ts-ignore
            const cursor = event.target.result;
            if (cursor) {
                // 检查主键是否小于等于maxMessageId
                if (cursor.primaryKey <= maxMessageId) {
                    if (count >= startId && count < endId) {
                        messages.push(cursor.value);
                        messageCount++; // 增加消息计数器
                    }
                    count++;
                    cursor.continue();
                } else {
                    // 当主键超出maxMessageId时，结束遍历
                    cursor.done;
                }
            } else {
                resolve({messages, currentPage: pageNo, messageCount});
            }
        };

        query.onerror = (event) => {
            // @ts-ignore
            reject(event.target.error);
        };
    });
}

async function updateMessage(message: Object): Promise<void> {
    // @ts-ignore
    const messageById = await getMessageById(message.messageId);

    //console.log(messageById)
    // @ts-ignore
    messageById.messageContent = message.messageContent;
    // @ts-ignore
    messageById.status = message.status;
    await saveChatMessage(messageById)
}





export default {
    saveChatMessages,
    getAllMessages,
    addUnreadMessage,
    getMessageById,
    saveChatMessage,
    getChatMessage,
    updateMessage
}