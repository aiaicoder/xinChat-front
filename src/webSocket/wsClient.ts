import {BACKEND_HOST_LOCAL_WS, BACKEND_HOST_PROD_WS} from '@/constant';
import ChatSessionModel from '@/db/ChatSessionModel';
import chatMessageModel from '@/db/ChatMessageModel';
import ChatMessageModel from '@/db/ChatMessageModel';
import userSettingModel from '@/db/UserSettingModel';
import {useLoginUserStore} from '@/stores/UseLoginUserStore';
import EventBus from '../main'

const NODE_ENV = process.env.NODE_ENV;

let ws: WebSocket | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let maxReconnectTimes: number = 5;
let wsUrl: string = '';
let needReconnect: boolean = true;
let lockReconnect = false;

const initWs = (config: any) => {
    console.log('初始化相关配置');
    // 根据生产环境配置ws地址
    if (NODE_ENV === 'development') {
        wsUrl = BACKEND_HOST_LOCAL_WS + config.token;
    } else {
        wsUrl = BACKEND_HOST_PROD_WS + config.token;
    }
    maxReconnectTimes = 5;
    createWs();
};

const createWs = () => {
    if (wsUrl === '') {
        return;
    }
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('ws连接成功');
        ws?.send('heart beat');
        maxReconnectTimes = 5;

        if (heartbeatInterval !== null) {
            clearInterval(heartbeatInterval); // 清除已存在的定时器
        }

        heartbeatInterval = setInterval(() => {
            if (ws != null && ws.readyState === WebSocket.OPEN) {
                console.log('发送心跳消息');
                ws.send('heart beat');
            }
        }, 5000);
    };

    // 从服务器接受到消息的回调函数
    ws.onmessage = (e) => {
        const useLogin = useLoginUserStore();
        console.log('收到服务端消息', e.data);
        const message = JSON.parse(e.data);
        const messageType = message.messageType;
        switch (messageType) {
            case 0:
                // 保存会话信息
                ChatSessionModel.saveChatSessions(message.extendData.chatSessionList).then(() =>
                    console.log('保存消息成功')
                );
                // 更新聊天记录
                chatMessageModel.saveChatMessages(message.extendData.chatMessageList).then(() =>
                    console.log('消息保存成功')
                );
                // 更新联系人申请数
                userSettingModel.updateNoReadCount(useLogin.loginUser.id, message.extendData.applyCount).then(() =>
                    console.log('联系人更新成功')
                );
                break;
            case 2:
                if (message.sendUserId == useLogin.loginUser.id && message.contactType == 1) {
                    break;
                }
                // eslint-disable-next-line no-case-declarations
                const sessionInfo = {};
                if (message.extendData && typeof message.extendData === 'object') {
                    Object.assign(sessionInfo, message.extendData);
                } else {
                    Object.assign(sessionInfo, message);
                    if (message.contactType == 0 && message.contactType != 1) {
                        // @ts-ignore
                        sessionInfo.contactName = message.sendUserName;
                    }
                    // @ts-ignore
                    sessionInfo.lastReceiveTime = message.sendTime;
                }
                // @ts-ignore
                ChatSessionModel.update(sessionInfo, localStorage.getItem('currentSessionId')).then(() =>
                    console.log('保存会话成功')
                );
                ChatMessageModel.saveChatMessage(message).then(() => {
                    ChatSessionModel.getSessionByUserIdAndContactId(message.sendUserId).then(r => {
                            // @ts-ignore
                            if (r.status === 0) {
                                // @ts-ignore
                                r.status = 1
                                // @ts-ignore
                                r.topType =0
                                // @ts-ignore
                                ChatSessionModel.saveChatSession(r).then()
                            }
                            message.extendData = r
                            EventBus.emit('reloadMessage', message)
                        }
                    );
                });
                break;
            // ... 其他 case
        }
    };

    ws.onclose = () => {
        console.log('ws连接关闭');
        reconnect();
    };

    ws.onerror = () => {
        console.log('客户端连接失败重连');
        reconnect();
    };

    const reconnect = () => {
        if (!needReconnect) {
            console.log('连接断开无需重连');
            return;
        }
        if (ws != null) {
            ws.close();
        }
        if (lockReconnect) {
            return;
        }
        lockReconnect = true;
        if (maxReconnectTimes > 0) {
            setTimeout(() => {
                console.log('重连中');
                createWs();
                maxReconnectTimes--;
                lockReconnect = false;
            }, 5000);
        } else {
            console.log('重连次数失败');
        }
    };
};

const closeWs = () => {
    console.log('WebSocket连接已关闭');
    needReconnect = false;
    ws?.close();
};

export default {
    initWs,
    closeWs,
};
