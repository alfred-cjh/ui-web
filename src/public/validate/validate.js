import Vue from "vue";
import VeeValidate, {Validator} from "vee-validate";
import locale from "./local";

const config = {
    errorBagName: "errors", // change if property conflicts.
    delay: 50,
    locale: "zh_CN",
    messages: null,
    strict: true,
    events: 'input|change'
};

Vue.use(VeeValidate,config);    
if(localStorage.language == "zh"){
    Validator.localize("zh",locale);
}else if(localStorage.language == "en_US"){
    Validator.localize("en");
}
// Validator.localize("zh",locale);

// 修改默认错误提示
const dict = {
    zh: {
        messages: {required: (name) => `${name}不能为空`},
    } // name接受alias的值.
};
Validator.localize(dict);

// 自定义validate 
Validator.extend("mobile", {
    getMessage: () => $_I18n.t('cn.validate.mobile'),
    validate: value => value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
});

//数字
Validator.extend("limit_num", {
    getMessage: () => $_I18n.t('cn.validate.limit_num'),
    validate: value => /^[0-9]+$/.test(value)
});

// 自定义validate 
Validator.extend("password", {
    getMessage: () => $_I18n.t('cn.validate.password'),
    validate: value => /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@._:,\/\-\^\%])[0-9a-zA-Z!@._:,\/\-\^\%]{6,20}$/.test(value)
});



// 自定义validate(固定电话)
Validator.extend('vali_phone', {
    getMessage: () => $_I18n.t('cn.validate.vali_phone'),
    validate: value => /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)
});

// 自定义validate(只允许大小写字母、汉字、数字)
Validator.extend('vali_name_str', {
    getMessage: () => $_I18n.t('cn.validate.vali_name_str'),
    validate: value => /^([A-Za-z0-9\u4e00-\u9fa5]+)$/.test(value)
});

// 自定义validate(只允许大小写字母、数字)
Validator.extend('vali_name_number', {
    getMessage: () => $_I18n.t('cn.validate.vali_name_number'),
    validate: value => /^([A-Za-z0-9]+)$/.test(value)
});

// 自定义validate(邮箱)
Validator.extend('email', {
    getMessage: () => $_I18n.t('cn.validate.email'),
    validate: value => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)
});

//自定义大小写字母、数字和汉字和特殊字符·  2-30(姓名)
Validator.extend("limit_name_2_30", {
    getMessage: () => $_I18n.t('cn.validate.limit_name_2_30'),
    validate: value => /^([A-Za-z0-9\u4e00-\u9fa5\s\,\.\'\!\@\#\$\%\^\&\*\·]{2,30})$/.test(value)
});

// 自定义validate(只限制长度2-255)
Validator.extend('nameLen', {
    getMessage: () => $_I18n.t('cn.validate.nameLen'),
    validate: value => /^(.{2,255})$/.test(value)
});

