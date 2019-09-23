<template>
    <div>
        <headerMenu :logourl="logourl" @updateRegion="reload"></headerMenu>
        <div class="main">
            <sideMenu></sideMenu>
            <div class="main-content">
                <div class="path-title" v-if="!$route.meta.showBcn">
                    <h2>{{menuText}}</h2>
                </div>
                <router-view v-if="isRouterAlive"></router-view>
            </div>
        </div>
        <footerMenu></footerMenu>
    </div>
</template>
<script>
import sideMenu from './side.vue'
import headerMenu from './header.vue'
import footerMenu from './footer.vue'
import {mapGetters} from 'vuex'
export default {
    components: {  footerMenu, sideMenu ,headerMenu},
    computed:mapGetters([
        'pathTitle'
    ]),
    data(){
        return {
            isRouterAlive:true,
            logourl:null,
            menuText:""
        }
    },
    provide (){
        return {
            reload:this.reload
        }
    },
    methods:{
        reload (){
            this.isRouterAlive = false
            this.$nextTick(function(){
                this.isRouterAlive = true
            })
        },

    },
    mounted(){
        document.title = this.$i18n.t('cn.menu.'+this.pathTitle);
        this.menuText = this.$t('cn.menu.'+this.pathTitle);
    },
    watch:{
        pathTitle(){
            document.title = this.$i18n.t('cn.menu.'+this.pathTitle);
            if(this.pathTitle=="courselist"&&localStorage.currentRole){
                if(localStorage.currentRole&&localStorage.currentRole!="null"&&(JSON.parse(localStorage.currentRole).roleId==3||JSON.parse(localStorage.currentRole).roleId==4)){
                    document.title= this.$t("cn.menu.courselistStudent");
                }
            }
            this.menuText = this.$t('cn.menu.'+this.pathTitle);
            if(this.pathTitle=="courselist"&&localStorage.currentRole){
                if(localStorage.currentRole&&localStorage.currentRole!="null"&&(JSON.parse(localStorage.currentRole).roleId==3||JSON.parse(localStorage.currentRole).roleId==4)){
                    this.menuText= this.$t("cn.menu.courselistStudent");
                }
            }
        }
    }
            
}
</script>





