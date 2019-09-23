
<template>
    <div class="tab-content">
        <div class="detail-row">
            <div class="detail-title">
                <router-link v-bind:to="'/experiment/dataset'" class="an-close">
                    <i class="icon-aw-mail-reply"></i>
                </router-link>
                <span>{{detailInfo.dataset_name}}{{$t("cn.common.detail")}}</span>
            </div>
            <div class="detail-info">
                <h5 class="config-detail-title">{{$t('cn.configmanage.detailInfo.basicInfo')}}</h5>
                <form name="descForm" class="model-form data-set-desc">
                    <div class="control-group">
                        <textarea class="form-controls" :data-vv-as="$t('cn.configmanage.detailInfo.basicInfo')" v-validate="'required|max:1000'" v-model="detailInfo.dataset_summary" 
                        name="decrtxt" :placeholder="$t('cn.courselist.placeholder.decr')"></textarea>
                        <div class="error">
                            <span v-show="errors.has('decrtxt')" class="help is-danger">{{ errors.first('decrtxt') }}</span>
                        </div>
                    </div>
                </form>
                <button type="button" class="btn btn-primary" @click="confirm">{{$t('cn.action.ok')}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    data() {
        return {
            detailInfo:{
                dataset_summary:'',
                dataset_name:""
            }
        }
    },
    props: ["detailProps"],
    methods:{
        ...mapActions('dataSetMag',[
            "dataSetDetail",
            "editDataSet"
        ]),
        init(){
            this.dataSetDetail(this.detailProps.id).then((res)=>{
                if(res&&res.result){
                    this.detailInfo.dataset_summary = res.result.dataset_summary?res.result.dataset_summary.replace(new RegExp("<br>", "gm"), "\n").replace(new RegExp("<br>",'gm'), "\r"):'';
                    this.detailInfo.dataset_name = res.result.dataset_name;
                }
            })
        },
        confirm(){
            let _this = this
            _this.$validator.validateAll().then((result)=>{
                if(result){
                    let postData = {
                        id:_this.detailProps.id,
                        data:{
                            "dataset_summary":_this.detailInfo.dataset_summary.replace(new RegExp("\n", "gm"), "<br>"),
                        } 
                    }
                    _this.editDataSet(postData).then(()=>{
                    })
                } 
            })
        }
    },
    mounted() {
        this.init()
    },
}
</script>


  

