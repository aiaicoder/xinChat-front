/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse } from '../models/BaseResponse';
import type { GroupInfoQueryRequest } from '../models/GroupInfoQueryRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminGroupInfoControllerService {
    /**
     * dismissGroup
     * @param groupId groupId
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static dismissGroupUsingGet(
        groupId?: string,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/groupInfo/dismissGroup/groupId',
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
     * loadGroupInfo
     * @param groupInfoQueryRequest groupInfoQueryRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static loadGroupInfoUsingPost(
        groupInfoQueryRequest: GroupInfoQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/groupInfo/loadGroup/page',
            body: groupInfoQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
