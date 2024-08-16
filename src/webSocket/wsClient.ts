import { BACKEND_HOST_LOCAL_WS, BACKEND_HOST_PROD_WS } from "@/constant";

const NODE_ENV = process.env.NODE_ENV;

let ws: WebSocket | null = null;

let maxReconnectTimes: number = 5;
let wsUrl: string = "";
let needReconnect: boolean = true;
let lockReconnect = false;

const initWs = (config: any) => {
    console.log("初始化相关配置");
    // 根据生产环境配置ws地址
    if (NODE_ENV === "development") {
        wsUrl = BACKEND_HOST_LOCAL_WS + config.token;
    } else {
        wsUrl = BACKEND_HOST_PROD_WS + config.token;
    }
    maxReconnectTimes = 5;
    createWs();
};

const createWs = () => {
    if (wsUrl === "") {
        return;
    }
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("ws连接成功");
        ws?.send("heart beat");
        maxReconnectTimes = 5;
        setInterval(() => {
            if (ws != null && ws.readyState === WebSocket.OPEN) {
                console.log("发送心跳消息");
                ws.send("heart beat");
            }
        }, 5000);
    };

    // 从服务器接受到消息的回调函数
    ws.onmessage = (e) => {
        console.log("收到服务端消息", e.data);
    };

    ws.onclose = () => {
        console.log("ws连接关闭");
        reconnect()
    }

    ws.onerror = () => {
        console.log("客户端连接失败重连");
        reconnect();
    };

    const reconnect = () => {
        if (!needReconnect) {
            console.log("连接断开无需重连");
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
                console.log("重连中");
                createWs();
                maxReconnectTimes--;
                lockReconnect = false;
            }, 5000);
        } else {
            console.log("重连次数已用完");
        }
    };
};



const closeWs = () => {
    console.log("WebSocket连接已关闭");
    needReconnect = false;
    ws?.close();
};

export default {
    initWs,
    closeWs,
};