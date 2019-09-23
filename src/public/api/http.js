import {
    Notification
} from 'element-ui';
import Vue from 'vue';
import axios from 'axios';
import store from '../store'
//import message from '@/public/common/common-tmpl/delete-list-message.vue'
// Notification({
//     title: '提示',
//     message: '这是一条不会自动关闭的消息',
//     duration: 0
// });

Vue.prototype.$_ajax = axios;
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    var awstackAliyun,awstackUser;
    if (config.url.indexOf("awstack-aliyun") > -1) {
        awstackAliyun = config.url.split("awstack-aliyun");
        config.url = window.GLOBALCONFIG.APIHOST.ALIYUN + awstackAliyun[1];
    }else if(config.url.indexOf("awstack-user") > -1){
        awstackUser = config.url.split("awstack-user");
        config.url = window.GLOBALCONFIG.APIHOST.BASE + awstackUser[1];
    }

    var auth_token = localStorage.$AUTH_TOKEN;
    config.headers["X-Auth-Token"] = auth_token;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

axios.interceptors.response.use(function (res) {
    // Do something with response data
    if (/\.html/.test(res.config.url)) {
        return res;
    }
    if (res.config.url.indexOf("kaptcha") > -1) {
        return res;
    }
    // 下载组织机构模板
    if (res.config.url.indexOf("orgs/template") > -1 && res.config.method == "get") {
        return res.data;
    }
    // 下载用户模板
    if (res.config.url.indexOf("users/template") > -1 && res.config.method == "get") {
        return res.data;
    }
    //流文件判断
    if(res.config.responseType=="arraybuffer"){
        return res.data;
    }
    //下载相关
    if ((res.config.url.indexOf("reportFile") > -1 ||
        res.config.url.indexOf("reports?flag=true") > -1 ||
        res.config.url.indexOf("answer") > -1 ||
        res.config.url.indexOf("guidefile") > -1 ||
        res.config.url.indexOf("lab/code") > -1 ||
        res.config.url.indexOf("studentReport") > -1 ||
        res.config.url.indexOf("outline/download") > -1 ||
        res.config.url.indexOf("/preview") > -1 ||
        res.config.url.indexOf("/code/") > -1
    ) && res.config.method == "get") {
        return res.data;
    }
    if ((
        res.config.url.indexOf("/preview") > -1
    ) && res.config.method == "post") {
        return res.data;
    }
    //登录失败错误处理--start
    if (res.data.code == "01030701") {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01030701",
            timestamp: (new Date()).valueOf()
        })
        return res.data;
    }
    //用户名或密码错误
    if (res.data.code == "01010404") {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01010404",
            timestamp: (new Date()).valueOf()
        })
        return res.data;
    }
    // 验证码失效
    if (res.data.code == "01090301") {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01090301",
            timestamp: (new Date()).valueOf()
        })
        return res.data;
    }
    // 验证码错误
    if (res.data.code == "01010408") {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01010408",
            timestamp: (new Date()).valueOf()
        })
        return res.data;
    }
    //登录超时
    if (res.data.code == "01030700"&&res.config.url.indexOf("/v1/logout")<0) {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01030700",
            timestamp: (new Date()).valueOf()
        })
        //Notification({title: '提示',message: '登录超时,请重新登录',duration: 0});
        return res.data;
    }
    //当前用户不具有任何角色
    if (res.data.code == "01010410") {
        store.commit('loginTimeOut', {
            "key": 1,
            username: "",
            error: "01010410",
            timestamp: (new Date()).valueOf()
        })
        return res.data;
    }
    //注销用户
    if (res.data.code == "01030700"&&res.config.url.indexOf("/v1/logout")>-1) {
        return res.data;
    }
    if (res.data.code != 0) {
        let messageList = res.data.msg.split(";");
        let _html = [];
        messageList.forEach(item=>{
            _html.push(`<li>${item}</li>`)
        })
        _html = `<ul>${_html.join("")}</ul>`;

        Notification({
            //title: $_I18n.t("cn.action.error"),
            //message: res.data.msg,
            message: _html,
            duration: 5000,
            type: "error",
            dangerouslyUseHTMLString: true,
            customClass: "error"
        });
        //许可认证失败,跳转到首页
        if (res.data.code == "01160305" || res.data.code == "01160306") {
            setInterval(function(){
                if(localStorage && localStorage.userId != -1){
                    localStorage.clear();
                    $cookies.remove('LIB_LOGINED');
                    $cookies.remove('LIB_AUTH_TOKEN');
                    window.location.href = "/#/page/welcome";
                }
            }, 2000);
        }
        return res.data;
    };
    if (res.config.method.toUpperCase() != "GET") {
        if(res.config.url.indexOf("/env") > -1&&res.config.url.indexOf("/course/labtask") > -1){//准备实验环境
            Notification({
                title: '',
                message: $_I18n.t("cn.code.expermentIn"),
                duration: 3000,
                type: "success",
                customClass: "success"
            });
        }else if(res.config.url.indexOf("/reset") > -1&&res.config.url.indexOf("/course/labtaskenv") > -1){//准备实验环境
            Notification({
                title: '',
                message: $_I18n.t("cn.code.experimentRb"),
                duration: 3000,
                type: "success",
                customClass: "success"
            });
        }else{
            Notification({
                title: '',
                message: $_I18n.t("cn.code.0"),
                duration: 3000,
                type: "success",
                customClass: "success"
            });
        }
        return res.data;
    }
    return res.data;
}, function (error) {
    // Do something with response error
    Notification({
        //title: error.message,
        message: error.message,
        duration: 5000,
        type: "error",
        customClass: "error"
    });
    return error;
});
export default axios