import moment from "moment";

moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MM月DD日',
        LLL: 'YYYY年MM月DD日Ah点mm分',
        LLLL: 'YYYY年MM月DD日ddddAh点mm分',
        l: 'YYYY-M-D',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH:mm',
        llll: 'YYYY年M月D日dddd HH:mm'
    },
})
const isEmpty = (value: any) => {
    return value === undefined || value === null || value === ''
}


const getAreaInfo = (data: string) => {
    if (isEmpty(data)) {
        return '-'
    }
    return data.replace(",", " ")
}

const formatDate = (timestamp: any) => {
    if (typeof timestamp === "string"){
        timestamp = Number.parseInt(timestamp)
    }
    const timestampTime = moment(timestamp);
    const days = Number.parseInt(moment().format("YYYYMMDD")) - Number.parseInt(timestampTime.format("YYYYMMDD"));
    if (days === 0) {
        return timestampTime.format("HH:mm")
    } else if (days == 1) {
        return "昨天"
    } else if (days >= 2 && days < 7) {
        return timestampTime.format("dddd")
    } else {
        return timestampTime.format("YY/MM/DD")
    }
}

const size2Str = (limit: any) => {
    let size = ""
    if (limit < 0.1 * 1024) {
        size = limit.toFixed(2) + "B"
    } else if (limit < 0.1 * 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }
    const sizeStr = size + "" //转成字符串
    const index = sizeStr.indexOf(".") //获取小数点处的索引
    const dou = sizeStr.substring(index + 1, 2) //获取小数点后两位的值
    if (dou == "00") { //如果小数点后第二位0，省略之
        return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2)
    }
    return sizeStr

}
export default {isEmpty, getAreaInfo, formatDate, size2Str}