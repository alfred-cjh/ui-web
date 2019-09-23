import VueRouter from "vue-router";
import mainMenu from "../common-tmpl/index.vue";


const subView = { template: "<router-view></router-view>" };


//资源组
import ResourceGroup from "../view/asset/resource-group/resource-group.vue"


const routes = [
    {
        path:"/",
        component:mainMenu,
        redirect: '/asset/resourceGroup',
        children: [
            {
                path: "/asset",
                component: subView,
                redirect: '/asset/resourceGroup',
                children:[
                    {
                        path: "resourceGroup",
                        name: "resourceGroup",//路由别名，全局唯一，建议和keyword保持一致
                        component: ResourceGroup,
                        meta:{
                            parent:"asset",
                            keyword:"resourceGroup",
                            heighlightword:"resourceGroup"
                        }
                    }
                ]
            }
        ]
    }
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
});
export {router};
