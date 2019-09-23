
<template>
   <div>
        <el-dialog :title="$t('cn.resourceGroup.dialog.createResourceGroup')" :visible.sync='editData.optionWrap'
        custom-class="normal-dialog" center :append-to-body='true' :close-on-click-modal="false">
            <form name="createItemForm" class="model-form">
                <div class="control-group">
                    <label class="control-label">
                        <span class="red">*</span>{{$t('cn.resourceGroup.dialog.tag')}}：</label>
                    <div class="controls">
                        <input class="form-controls" :data-vv-as="$t('cn.resourceGroup.dialog.tag')" v-validate="'required|max:200'" name="desc" 
                        v-model="formData.tag" :placeholder="$t('cn.resourceGroup.placeholder.tag')"/>
                        <div class="error">
                            <span v-show="errors.has('desc')" class="error">{{ errors.first('desc') }}</span>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">
                        <span class="red">*</span>{{$t('cn.resourceGroup.dialog.name')}}：</label>
                    <div class="controls">
                        <input class="form-controls" :data-vv-as="$t('cn.resourceGroup.dialog.name')" v-validate="'required|nameLen'" 
                        v-model="formData.name" name="name" type="text" :placeholder="$t('cn.resourceGroup.placeholder.name')" >
                        <div class="error">
                            <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                        </div>
                    </div>
                </div>
            </form>
            <div slot="footer">
                <button class="btn btn-primary" type="button" :disabled="instanItemDisabled"  @click="confirm">{{$t('cn.action.ok')}}</button>
                <button class="btn btn-default" type="button"  @click="close">{{$t('cn.action.cancel')}}</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    data() {
        return {
            formData:{
                "dataset_desc": "",
                "dataset_name": "",
                "pvc_name": "",
                "pvc_size": ''
            },
            instanItemDisabled:false
        }
    },
    // this.$i18n.t()
    props: ["editData"],
    methods:{
        ...mapActions('ResourceGroup',[
            "createItem"
        ]),
        confirm:function(){
            let _this = this
            _this.$validator.validateAll().then((result)=>{
                if(result){
                    _this.instanItemDisabled = true;
                    if(_this.editData.opentype=='create'){
                        let postData = _this.formData
                        _this.createItem(postData).then(()=>{
                            _this.$emit('updataMsg',{'flag':false,'type':'create','name':_this.formData.dataset_name});
                        }).finally(function(){
                            _this.instanItemDisabled = false;
                        })
                    }
                }
            })
        },
        close:function(){
            this.$emit('updataMsg',{'flag':false,'type':'del'});
        }
    },
    mounted(){
        if(this.editData.opentype=='edit'){
            this.formData = {
                "dataset_desc": this.editData.content[0].dataset_desc,
                "dataset_name": this.editData.content[0].dataset_name,
                "pvc_name": this.editData.content[0].pvc_name,
                "pvc_size": this.editData.content[0].pvc_size
            }
        }
    }
}
</script>




  

