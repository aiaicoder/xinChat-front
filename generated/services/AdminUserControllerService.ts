/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminUserUpdateRequest } from '../models/AdminUserUpdateRequest';
import type { BaseResponse } from '../models/BaseResponse';
import type { UserAddRequest } from '../models/UserAddRequest';
import type { UserQueryRequest } from '../models/UserQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUserControllerService {
    /**
     * addUser
     * @param userAddRequest userAddRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserUsingPost1(
        userAddRequest: UserAddRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/user/add',
            body: userAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserById
     * @param id id
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getUserByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/user/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getUserVoById
     * @param id id
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getUserVoByIdUsingGet(
        id?: number,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/user/get/vo',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * forceKickOut
     * @param userId userId
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static forceKickOutUsingGet(
        userId?: string,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/user/kickOut',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserByPage
     * @param userQueryRequest userQueryRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserByPageUsingPost(
        userQueryRequest: UserQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/user/list/page',
            body: userQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateUserStatus
     * @param userUpdateRequest userUpdateRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateUserStatusUsingPost(
        userUpdateRequest: AdminUserUpdateRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/user/updateStatus',
            body: userUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
