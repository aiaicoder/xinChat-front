/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse } from '../models/BaseResponse';
import type { UpdatePasswordRequest } from '../models/UpdatePasswordRequest';
import type { UserLoginRequest } from '../models/UserLoginRequest';
import type { UserQueryRequest } from '../models/UserQueryRequest';
import type { UserRegisterRequest } from '../models/UserRegisterRequest';
import type { UserUpdateMyRequest } from '../models/UserUpdateMyRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * checkCode
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static checkCodeUsingGet1(): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/checkCode',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getLoginUser
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getLoginUserUsingGet1(): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get/login',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * test
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static testUsingGet1(): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/get/test',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserVoByPage
     * @param userQueryRequest userQueryRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserVoByPageUsingPost1(
        userQueryRequest: UserQueryRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/list/page/vo',
            body: userQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 用户登录
     * @param userLoginRequest userLoginRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static userLoginUsingPost1(
        userLoginRequest: UserLoginRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/login',
            body: userLoginRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * userLogout
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static userLogoutUsingPost1(): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/logout',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 用户注册
     * @param userRegisterRequest userRegisterRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static userRegisterUsingPost1(
        userRegisterRequest: UserRegisterRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register',
            body: userRegisterRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * 重置密码
     * @param userRegisterRequest userRegisterRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static resetPasswordUsingPost1(
        userRegisterRequest: UserRegisterRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/resetPassword',
            body: userRegisterRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateMyUser
     * @param userUpdateMyRequest userUpdateMyRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateMyUserUsingPost1(
        userUpdateMyRequest: UserUpdateMyRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/update/my',
            body: userUpdateMyRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updatePassword
     * @param updatePasswordRequest updatePasswordRequest
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static updatePasswordUsingPost1(
        updatePasswordRequest: UpdatePasswordRequest,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/updatePassword',
            body: updatePasswordRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}