/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse } from '../models/BaseResponse';
import type { MessageBaseRequest } from '../models/MessageBaseRequest';
import type { MessageSendRequest } from '../models/MessageSendRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatControllerService {
    /**
     * downloadFile
     * @param messageId messageId
     * @returns any OK
     * @throws ApiError
     */
    public static downloadFileUsingGet1(
        messageId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/msg/download',
            query: {
                'messageId': messageId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 撤回消息
     * @param messageBaseRequest messageBaseRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static recallMessageUsingPost1(
        messageBaseRequest: MessageBaseRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/msg/recall',
            body: messageBaseRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 发送消息
     * @param messageSendRequest messageSendRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendMessageUsingPost1(
        messageSendRequest: MessageSendRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/msg/sendMessage',
            body: messageSendRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 发送文件
     * @param file file
     * @param biz
     * @param messageId
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadFileUsingPost2(
        file: Blob,
        biz?: string,
        messageId?: number,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/msg/upload',
            query: {
                'biz': biz,
                'messageId': messageId,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
