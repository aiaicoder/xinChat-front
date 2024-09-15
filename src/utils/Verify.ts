const regs = {
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    number: /^\+?[1-9][0-9]*$/,
    password: /^[a-zA-Z\d]{8,32}$/,
    nickname: /^[a-zA-Z0-9_-]{4,16}$/,
    username: /^[a-zA-Z0-9_-]{4,16}$/,
}

const verify = (rule: any, value: any, reg: any, callback: any) => {
    if (value) {
        console.log(value)
        if (reg.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message))
        }
    } else {
        callback()
    }
}

export default {
    email: (rule: any, value: any, callback: any) => {
        verify(rule, value, regs.email, callback)
    },
    number: (rule: any, value: any, callback: any) => {
        verify(rule, value, regs.number, callback)
    },
    password: (rule: any, value: any, callback: any) => {
        verify(rule, value, regs.password, callback)
    },
    nickname: (rule: any, value: any, callback: any) => {
        verify(rule, value, regs.nickname, callback)
    },
    username: (rule: any, value: any, callback: any) => {
        verify(rule, value, regs.username, callback)
    }
}