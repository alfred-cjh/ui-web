<template>
  <aside>
    <h5 class="menu-title clearFix">
        <i class="icon-aw-jkgl"></i>
        <span class="title-name">左侧菜单标题</span>
    </h5>
    <ul class="menu-level-1">
        <li v-for="item in sideMenu.sideMenuList" v-bind:key="item.active" v-bind:class="{'has-child':item.child.length>0,'level2-active':sideMenu.activeSubMenu==item.keywords}">
            <router-link v-bind:to="item.href" v-if="item.href" :class="{'active':$route.meta.heighlightword == item.keywords}" exact>
                <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
            </router-link>
            <a v-if="!item.href" v-on:click="toggle(item)">
                <span ><i v-bind:class="item.icon"></i><b>{{item.text}}</b></span>
                <i class="icon-arrow"></i>
            </a>
            <ul class="menu-level-2" v-if="item.child.length>0">
                <li v-for="subItem in item.child" v-bind:key="subItem.active">
                    <router-link v-bind:to="subItem.href" v-if="subItem.href" :class="{'sub-active':$route.meta.heighlightword == subItem.keywords}" exact>
                    <span>{{subItem.text}}</span>
                    </router-link>
                </li>
            </ul>
        </li>
    </ul>
  </aside>
</template>
<script>
export default {
    data: function () {
        return {
            count: 0,
            sideMenu: {
                sideMenuList: [
                    {
                        keywords:"overview",
                        text:"一级菜单1",
                        href:"/overview",
                        active:"overview",
                        icon:"icon-aw-gk0",
                        child:[]
                    },
                    {
                        keywords:"asset",
                        text:"一级菜单2",
                        href:"",
                        active:"asset",
                        icon:"icon-aw-gk0",
                        child:[
                            {
                                keywords:"ecs",
                                text:"二级菜单1",
                                href:"/asset/ecs",
                                active:"ecs",
                            },
                            {
                                keywords:"images",
                                text:"二级菜单2",
                                href:"/asset/images",
                                active:"images",
                            },
                            {
                                keywords:"resourceGroup",
                                text:"二级菜单3",
                                href:"/asset/resourceGroup",
                                active:"resourceGroup",
                            },
                            {
                                keywords:"deploymentSet",
                                text:"二级菜单4",
                                href:"/asset/deploymentSet",
                                active:"deploymentSet",
                            }
                        ]
                    },
                    {
                        keywords:"volumes",
                        text:"一级菜单3",
                        href:"",
                        active:"volumes",
                        icon:"icon-aw-information",
                        child:[
                            {
                                keywords:"disk",
                                text:"云盘",
                                href:"/volumes/disk",
                                active:"disk",
                            },
                            {
                                keywords:"snapshot",
                                text:"快照",
                                href:"/volumes/snapshot",
                                active:"snapshot",
                            }
                        ]
                    },
                ], //当前左侧菜单数据
                activeSubMenu: "", //当前左侧菜单打开的二级菜单的位置
                sideMentTitle: "", //当前左侧菜单标题
                subMenuTitle: "", //当前页面在右侧显示的标题
                menuKeyword: ""
            }
        }
    },
    methods:{
        toggle:function(item){
            if(this.sideMenu.activeSubMenu==item.keywords){
                this.sideMenu.activeSubMenu=false;
            }else{
                this.sideMenu.activeSubMenu=item.keywords;
            }
        },
    },
    mounted(){
        this.sideMenu.activeSubMenu = this.$store.state.currentMenu;
    },
    watch:{
        getCurrentMenu:function(val){
            console.log(val)
            this.sideMenu.activeSubMenu = val;
        }
    },
    computed:{
        getCurrentMenu() {
            return this.$store.state.currentMenu;
        }
    }
}
</script>


  
