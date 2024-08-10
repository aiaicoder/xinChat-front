const isEmpty = (value: any) => {
    return value === undefined || value === null || value === ''
}


const getAreaInfo = (data: string) => {
    if (isEmpty(data)) {
        return '-'
    }
    return data.replace(",", " ")
}
export default {isEmpty, getAreaInfo}