/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse } from '../models/BaseResponse';
import type { UserBeautyAddRequest } from '../models/UserBeautyAddRequest';
import type { UserBeautyQuery } from '../models/UserBeautyQuery';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUserBeautyControllerService {
    /**
     * addUser
     * @param userBeautyAddRequest userBeautyAddRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static addUserUsingPost2(
        userBeautyAddRequest: UserBeautyAddRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/userBeauty/addUserBeauty',
            body: userBeautyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteUserBeauty
     * @param id id
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static deleteUserBeautyUsingGet1(
        id: number,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/userBeauty/deleteUserBeauty',
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
     * loadBeautyList
     * @param userBeautyQuery userBeautyQuery
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static loadBeautyListUsingPost1(
        userBeautyQuery: UserBeautyQuery,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/userBeauty/loadBeautyList/page',
            body: userBeautyQuery,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
