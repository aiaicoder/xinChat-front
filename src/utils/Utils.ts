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
export default {isEmpty, getAreaInfo, formatDate}