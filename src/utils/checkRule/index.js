
export const checkMobile = (rule, value, callback) => {
    const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
    if(!reg.test(value)) return callback(new Error("请填写正确的手机号码"));
    callback();
}