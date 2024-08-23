import {useLoginUserStore} from "@/stores/UseLoginUserStore";

const dbName = "chatDB";
const sessionsStoreName = "sessions";
const messagesStoreName = "messages";
const uerStoreName = "userSetting";
let db: IDBDatabase;

// 打开或创建数据库
const request = indexedDB.open(dbName, 2); // 版本号为2

request.onupgradeneeded = function (event) {
    // @ts-ignore
    const db = event.target.result;
    console.log("Database created or opened successfully.sessions")
    if (!db.objectStoreNames.contains(sessionsStoreName)) {
        const objectStore = db.createObjectStore(sessionsStoreName, {keyPath: "sessionId", autoIncrement: false});
        objectStore.createIndex("userContactIndex", ["userId", "contactId"], {unique: false});
    }
    if (!db.objectStoreNames.contains(messagesStoreName)) {
        const objectStore = db.createObjectStore(messagesStoreName, {keyPath: "messageId", autoIncrement: false});
        objectStore.createIndex("SessionIndex", "sessionId", {unique: false});
    }
    if (!db.objectStoreNames.contains(uerStoreName)) {
        db.createObjectStore(uerStoreName, {keyPath: "userId", autoIncrement: false});
    }
};

request.onsuccess = function (event) {
    // @ts-ignore
    db = event.target.result;
};

request.onerror = function (event) {
    console.error("Error opening IndexedDB database.", event);
};


async function saveChatSessions(session: Object[]): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([sessionsStoreName], "readwrite");
    const objectStore = transaction.objectStore(sessionsStoreName);
    session.forEach((sess) => {
        if (!Reflect.has(session, 'noReadCount')) {
            // @ts-ignore
            sess.noReadCount = 0;
        }
        if (!Reflect.has(session, 'status')) {
            // @ts-ignore
            sess.status = 1;
        }
        if (!Reflect.has(session, 'topType')) {
            // @ts-ignore
            sess.topType = 0;
        }
        objectStore.put(sess); // 使用 put 方法
    });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}


async function saveChatSession(session: Object): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([sessionsStoreName], "readwrite");
    const objectStore = transaction.objectStore(sessionsStoreName);
    if (!Reflect.has(session, 'noReadCount')) {
        // @ts-ignore
        session.noReadCount = 0;
    }
    if (!Reflect.has(session, 'status')) {
        // @ts-ignore
        session.status = 1;
    }
    if (!Reflect.has(session, 'topType')) {
        // @ts-ignore
        session.topType = 0;
    }
    objectStore.put(session); // 使用 put 方法
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(); // 移除 Event 参数
        transaction.onerror = (event: Event) => reject((event.target as IDBTransaction).error);
    });
}


async function getAllSessions(): Promise<Object[]> {
    const transaction = db.transaction([sessionsStoreName], "readonly");
    const objectStore = transaction.objectStore(sessionsStoreName);

    return new Promise((resolve, reject) => {
        const cursorRequest = objectStore.openCursor();
        const sessions: Object[] = [];

        cursorRequest.onsuccess = (event) => {
            // @ts-ignore
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.status === 1) {
                    sessions.push(cursor.value);
                }
                cursor.continue();
            } else {
                resolve(sessions);
            }
        };

        cursorRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}


async function getSessionByUserIdAndContactId(contactId: string): Promise<Object | void> {
    const useLogin = useLoginUserStore();
    if (!db) {
        throw new Error("Database is not open.");
    }
    const transaction = db.transaction([sessionsStoreName], "readonly"); // 使用 readonly 模式
    const objectStore = transaction.objectStore(sessionsStoreName);
    const index = objectStore.index("userContactIndex");
    const userId = useLogin.loginUser.id;

    return new Promise((resolve, reject) => {
        const cursorRequest = index.openCursor(IDBKeyRange.only([userId, contactId])); // 使用索引进行查询
        // @ts-ignore
        let result;
        cursorRequest.onsuccess = (event) => {
            // @ts-ignore
            const cursor = event.target.result;
            if (cursor) {
                result = cursor.value;
                cursor.continue();
            } else {
                // @ts-ignore
                resolve(result); // 结束时返回结果
            }
        };
        cursorRequest.onerror = () => reject(cursorRequest.error);
    });
}


async function updateNoReadCount(contactId: string, noReadCount: number): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const session = await getSessionByUserIdAndContactId(contactId);
    if (!session) {
        return;
    }
    //@ts-ignore
    session.noReadCount += noReadCount; // 更新 noReadCount
    // 保存更新后的会话
    await saveChatSession(session);
    console.log("Session updated successfully.");
}

async function getSessionBySessionId(sessionId: string): Promise<Object> {
    const transaction = db.transaction(sessionsStoreName, 'readonly');
    const objectStore = transaction.objectStore(sessionsStoreName);
    return new Promise((resolve, reject) => {
        const request = objectStore.get(sessionId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

//选中session后清空未读消息
async function clearNoReadCount(sessionId: string): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    const session = await getSessionBySessionId(sessionId);
    if (!session) {
        return;
    }
    //@ts-ignore
    session.noReadCount = 0; // 更新 noReadCount
    // 保存更新后的会话
    await saveChatSession(session);
    console.log("Session updated successfully.");
}

//更新会话状态
async function update(item: Object, currentSessionId: string): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    // 异步获取旧会话信息
    //@ts-ignore
    const oldSession = await getSessionBySessionId(item.sessionId);
    // 检查是否获取到了会话信息
    if (!oldSession) {
        throw new Error("Session not found.");
    }
    // 更新会话信息
    //@ts-ignore
    if (item.lastMessage) {
        //@ts-ignore
        oldSession.lastMessage = item.lastMessage;
    }
    //@ts-ignore
    if (item.lastMessageTime) {
        //@ts-ignore
        oldSession.lastMessageTime = item.lastMessageTime;
    }
    //@ts-ignore
    if (item.contactName) {
        //@ts-ignore
        oldSession.contactName = item.contactName;
    }
    //@ts-ignore
    if (item.memberCount != null) {
        //@ts-ignore
        oldSession.memberCount = item.memberCount;
    }
    // 未选中当前session增加未读消息
    //@ts-ignore
    if (oldSession.sessionId != currentSessionId) {
        //@ts-ignore
        oldSession.noReadCount += 1;
    }
    // 保存更新后的会话
    await saveChatSession(oldSession);
    console.log("Session updated successfully.");
}


async function updateAll(item: Object): Promise<void> {
    if (!db) {
        throw new Error("Database is not open.");
    }
    //因为是proxy代理对象不能直接存进indexDb只能先转成字符串，然后再转回对象
    const normalString = JSON.stringify(item)
    item = JSON.parse(normalString)
    // 保存更新后的会话
    await saveChatSession(item);
    console.log("Session updated successfully.");
}


export default {
    saveChatSessions,
    getAllSessions,
    getSessionByUserIdAndContactId,
    saveChatSession,
    clearNoReadCount,
    updateAll,
    update,
    updateNoReadCount
}