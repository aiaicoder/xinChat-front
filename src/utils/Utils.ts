import moment from "moment";
import 'moment/locale/zh-cn.js'
const isEmpty = (value: any) => {
    return value === undefined || value === null || value === ''
}


const getAreaInfo = (data: string) => {
    if (isEmpty(data)) {
        return '-'
    }
    return data.replace(",", " ")
}

const formatDate = (timestamp: number) => {
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

const size2Str = (limit :any) => {
    let size = ""
    if (limit < 0.1 * 1024){
        size = limit.toFixed(2) + "B"
    } else if (limit < 0.1 * 1024 * 1024){
        size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 0.1 * 1024 * 1024 * 1024){
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }
    const sizeStr = size + "" //转成字符串
    const index = sizeStr.indexOf(".") //获取小数点处的索引
    const dou = sizeStr.substring(index + 1,2) //获取小数点后两位的值
    if (dou == "00"){ //如果小数点后第二位0，省略之
        return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2)
    }
    return sizeStr
    
}
export default {isEmpty, getAreaInfo, formatDate,size2Str}