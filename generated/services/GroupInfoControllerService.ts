/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddOrRemoveGroupMemberRequest } from '../models/AddOrRemoveGroupMemberRequest';
import type { BaseResponse } from '../models/BaseResponse';
import type { GroupInfoQueryRequest } from '../models/GroupInfoQueryRequest';
import type { SaveGroupRequest } from '../models/SaveGroupRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GroupInfoControllerService {
    /**
     * 添加或者移除群聊成员
     * @param addOrRemoveGroupMemberRequest addOrRemoveGroupMemberRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static addOrRemoveGroupMemberUsingPost(
        addOrRemoveGroupMemberRequest: AddOrRemoveGroupMemberRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/addOrRemoveGroupMember',
            body: addOrRemoveGroupMemberRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 解散群聊
     * @param groupId groupId
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static dismissGroupUsingPost(
        groupId?: string,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/dismissGroup',
            query: {
                'groupId': groupId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获得群聊信息
     * @param groupInfoQueryRequest groupInfoQueryRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static getGroupInfoUsingPost(
        groupInfoQueryRequest: GroupInfoQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/getGroupInfo',
            body: groupInfoQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获得群聊信息
     * @param groupInfoQueryRequest groupInfoQueryRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static getGroupInfoChatUsingPost(
        groupInfoQueryRequest: GroupInfoQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/getGroupInfoChat',
            body: groupInfoQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 退出群聊
     * @param groupId groupId
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static leaveGroupUsingPost(
        groupId?: string,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/leaveGroup',
            query: {
                'groupId': groupId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 获取自己的群聊
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static loadMyGroupUsingPost(): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/loadMyGroup',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 创建或者修改群组
     * @param saveGroupRequest saveGroupRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static saveGroupUsingPost(
        saveGroupRequest: SaveGroupRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/group/saveGroup',
            body: saveGroupRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
