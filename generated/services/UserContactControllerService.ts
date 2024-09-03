/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyAddRequest } from '../models/ApplyAddRequest';
import type { ApplyDealRequest } from '../models/ApplyDealRequest';
import type { ApplyQueryRequest } from '../models/ApplyQueryRequest';
import type { BaseResponse } from '../models/BaseResponse';
import type { ContactDelRequest } from '../models/ContactDelRequest';
import type { LoadUserContactRequest } from '../models/LoadUserContactRequest';
import type { UserSearchRequest } from '../models/UserSearchRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserContactControllerService {
    /**
     * 发送申请
     * @param applyAddRequest applyAddRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static applyAddUsingPost(
        applyAddRequest: ApplyAddRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/applyAdd',
            body: applyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * blackContact
     * @param contactDelRequest contactDelRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static blackContactUsingPost(
        contactDelRequest: ContactDelRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/blackContact',
            body: contactDelRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * dealWithApply
     * @param applyDealRequest applyDealRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static dealWithApplyUsingPost(
        applyDealRequest: ApplyDealRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/dealWithApply',
            body: applyDealRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * delContact
     * @param contactDelRequest contactDelRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static delContactUsingPost(
        contactDelRequest: ContactDelRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/delContact',
            body: contactDelRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getContactInfo
     * @param contactId contactId
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getContactInfoUsingGet(
        contactId?: string,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/userContact/getContactInfo',
            query: {
                'contactId': contactId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getContactUserInfo
     * @param contactId contactId
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getContactUserInfoUsingGet(
        contactId?: string,
    ): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/userContact/getContactUserInfo',
            query: {
                'contactId': contactId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 加载申请
     * @param applyAddRequest applyAddRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static loadApplyAddUsingPost(
        applyAddRequest: ApplyQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/loadApplyAdd',
            body: applyAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * loadContact
     * @param loadUserContact loadUserContact
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static loadContactUsingPost(
        loadUserContact: LoadUserContactRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/loadContact',
            body: loadUserContact,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 搜索好友或群组
     * @param userSearchRequest userSearchRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static searchUsingPost(
        userSearchRequest: UserSearchRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/userContact/search',
            body: userSearchRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
