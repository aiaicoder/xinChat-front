import {ElMessageBox} from "element-plus";

// @ts-ignore
const confirm = ({message, okfun, showCancelBtn = true, okText = '确定'}) => {
    // @ts-ignore
    ElMessageBox.confirm(message, "提示", {
        "close-on-click-modal": false,
        confirmButtonText: okText,
        cancelButtonText: '取消',
        showCancelButton: showCancelBtn,
        type: 'info',
    }).then(() => {
        if (okfun) {
            okfun()
        }
    }).catch(() => {
    })
}
export default confirm;