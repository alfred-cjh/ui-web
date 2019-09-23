import Vue from "vue";
import VueRouter from "vue-router";
import {router} from "./route/route";

import {zh_CN} from "./i18n/zh_CN";
import {en_US} from "./i18n/en_US";
// import './http';
import "./validate/validate";
import Element from "element-ui";
import Vuex from "vuex";
import store from "@/public/store";
import VueI18n from "vue-i18n";
//import focus from '../common/common-tmpl/directive';
import promiseFinally from 'promise.prototype.finally';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
// 设置语言
let lang = localStorage.language?(localStorage.language == 'zh'?zhLocale:enLocale):zhLocale;
locale.use(lang)
promiseFinally.shim();
Vue.use(Element, { size: "small", zIndex: 3000 });
Vue.use(Vuex);
Vue.use(VueI18n); // 通过插件的形式挂载

// 全局注册page-query
import pageQuery from '@/public/common-tmpl/page-query.vue'
Vue.use(pageQuery);
Vue.component('page-query', pageQuery);

router.beforeEach((to,from,next)=>{
    //store.state.currentMenu = to.meta.keyword
    store.commit("updatePathTitle",{"key":to.meta.keyword});
    store.commit("updateCurrentMenu",{"key":to.meta.parent});
    if(localStorage.keywordList&&localStorage.keywordList!='null'){
        let keywordList = JSON.parse(localStorage.keywordList);
        let link = JSON.parse(localStorage.menus)[0].href?JSON.parse(localStorage.menus)[0].href:JSON.parse(localStorage.menus)[0].child[0].href;
        if(keywordList.indexOf(to.meta.keyword)>-1){
            next()
        }else{
            next({
                path:link
            })
        }
    }else{
        next();
    }
});

const i18n = new VueI18n({
    locale: localStorage.language?(localStorage.language== 'zh'?'zh-CN':'en-US'):"zh-CN",    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
        "zh-CN": zh_CN,   // 中文语言包
        "en-US": en_US    // 英文语言包
    }
});
window.$_I18n = i18n;

Vue.use(VueRouter);

new Vue({router,i18n,store}).$mount("#app");

 