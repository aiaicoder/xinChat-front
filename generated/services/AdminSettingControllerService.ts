/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse } from '../models/BaseResponse';
import type { SysSettingDTO } from '../models/SysSettingDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSettingControllerService {
    /**
     * getSysSetting
     * @returns BaseResponse OK
     * @throws ApiError
     */
    public static getSysSettingUsingGet2(): CancelablePromise<BaseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/setting/getSysSetting',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateSysSetting
     * @param sysSettingDto sysSettingDTO
     * @returns BaseResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateSysSettingUsingPost1(
        sysSettingDto: SysSettingDTO,
    ): CancelablePromise<BaseResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/setting/saveSysSetting',
            body: sysSettingDto,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
