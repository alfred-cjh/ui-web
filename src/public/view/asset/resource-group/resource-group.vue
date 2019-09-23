<template>
    <div class="page-inner">
        <div class="table-action">
            <button type="button" class="btn btn-primary" @click="createItem">
                <i class="icon-aw-add-to2"></i>{{$t('cn.action.create')}}
            </button>
            <button type="button" class="btn btn-info" @click="editItem" :disabled="!bth_check.canEdit">
                {{$t('cn.action.edit')}}
            </button>
            <button type="button" class="btn btn-info" @click="deleteItem" :disabled="!bth_check.canDel">
                {{$t('cn.action.del')}}
            </button>
            <div class="pull-right">
                <el-select clearable popper-class="status-dropdown" v-model="filterValue" filterable  :placeholder="$t('cn.action.choose')" class="status-select" size="small" @change='filterChange'>
                    <el-option
                        v-for="item in filterList"
                        :title="item.text"
                        :key="item.id"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="search-box">
                    <form name="searchForm" novalidate @submit.prevent="applyGlobalSearch()">
                        <button class="btn" type="submit" :disabled="false">
                            <i class="icon-aw-search"></i>
                        </button>
                        <input type="text" class="form-control" autocomplete="off" maxlength="128" :placeholder="$t('cn.action.search')" name="searchTerm" v-model="globalSearchTerm"/>
                    </form>
                </div>
                <el-tooltip class="item" effect="dark" :content="$t('cn.tabelTips.refreshList')" placement="top">
                    <button class="btn btn-renovat btn-search" @click="refresh()">
                        <i class="icon-aw-refresh"></i>
                    </button>
                </el-tooltip>
            </div>
        </div>

        <div class="table-content">
            <el-table ref="multipleTable" 
                :data="dataList" 
                @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="40"> </el-table-column>
                <el-table-column prop="name" :label="$t('cn.resourceGroup.dataTitles.name')" >
                    
                </el-table-column>
                <el-table-column prop="tag" :label="$t('cn.resourceGroup.dataTitles.tag')">
                    <template slot-scope="scope">
                        <span :title='scope.row.tag'>{{scope.row.tag}}</span>
                    </template>
                 </el-table-column>
                <el-table-column prop="id" :label="$t('cn.resourceGroup.dataTitles.id')">
                    <template slot-scope="scope">
                        <span :title='scope.row.id'>{{scope.row.id}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="number" :label="$t('cn.resourceGroup.dataTitles.number')"> </el-table-column>
                <el-table-column prop="member" :label="$t('cn.resourceGroup.dataTitles.member')"> </el-table-column>
                <el-table-column prop="status" :label="$t('cn.resourceGroup.dataTitles.status')"> 
                    <template slot-scope="scope"><span :title="scope.row.status">{{ scope.row.status }}</span></template>
                </el-table-column>
            </el-table>
            <div v-if="pageInstan.showPage">
                <page-query v-if="pageInstan.showPage" :currentPage="pageInstan.currentPage" :total="pageInstan.Total" :pageSize="pageInstan.pageSize" @handleSizeChangeSub="handleSizeChange" @handleCurrentChangeSub="handleCurrentChange"></page-query>
            </div>
        </div>

        <el-dialog
            :visible.sync="deleteDialogVisible"
            custom-class="small-dialog delete-dialog"
            center
            :close-on-click-modal="false">
            <span>{{$t('cn.action.deleteTips')}}</span>
            <div slot="footer">
                <button class="btn btn-warning" type="button" :disabled="deleteItemDisabled" @click="confirm">{{$t('cn.action.ok')}}</button>
                <button class="btn btn-default" type="button"  @click="deleteDialogVisible = false">{{$t('cn.action.cancel')}}</button>
            </div>
        </el-dialog>

        <option-resource-group @updataMsg='updataWrap' :editData='editData' v-if='editData.optionWrap'></option-resource-group>
        <!-- <detail-page :props="hasRouteQuery">
            <detail-data :detailProps="{id:$route.query.id,name:$route.query.name}" v-if='hasRouteQuery'></detail-data>
        </detail-page> -->
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import optionResourceGroup from './option-resource-group.vue' 

export default {
    data(){
        return {
            hasRouteQuery:0,
            multipleSelection: [],
            editData:{
                opentype:'',
                optionWrap:false,
                content:this.multipleSelection
            },
            dataList:[],
            deleteDialogVisible:false,
            // page
            globalSearchTerm:'',
            filterValue:"",
            pageInstan:{//表格分页参数
                showPage:false,//是否显示分页
                Total:'',//分页总数
                currentPage:1,//当前页
                pageSize:10,//每页显示多少条
                pageSizes:[10, 20, 50, 100]//设置每页显示多少条下拉框数据
            },
            bth_check:{
                canEdit:false,
                canDel:false,
            },
            filterList:[
                {
                    id:1,
                    value:"name",
                },
                {
                    id:2,
                    value:"tag"
                },
                {
                    id:3,
                    value:"id"
                }
            ],
            num:0,
            timeIn:'',
            deleteItemDisabled:false,
            currentRole:"",
        }
    },
    components: {
        optionResourceGroup
    },
    methods:{
        ...mapActions('ResourceGroup',[
            "getItemList",
            "delItem"
        ]),
        initData(){
            // let oData = {
            //     offset:this.pageInstan.currentPage ,
            //     limit:this.pageInstan.pageSize,
            //     filter:this.globalSearchTerm
            // }
            // this.getItemList(oData).then((res)=>{
            //     if(res&&res.result){
            //         this.dataList = res.result;
            //         this.dataList = [
            //             {
            //                 "name":"test",
            //                 "tag":"标签",
            //                 "id":"daskd23213",
            //                 "number":"110",
            //                 "member":"sohu,baidu",
            //                 "status":"运行",
            //             },
            //             {
            //                 "name":"test",
            //                 "tag":"标签",
            //                 "id":"daskd232135",
            //                 "number":"110",
            //                 "member":"sohu,baidu",
            //                 "status":"运行",
            //             },
            //             {
            //                 "name":"test",
            //                 "tag":"标签",
            //                 "id":"daskd232134",
            //                 "number":"110",
            //                 "member":"sohu,baidu",
            //                 "status":"运行",
            //             }
            //         ]
            //         this.pageInstan.Total = 20;
            //         //this.pageInstan.Total = res.total;
            //         this.pageInstan.showPage = true;//判断数据是否为空 为空则不显示分页
            //         this.optionData(this.dataList)
            //     }
            // })
            this.dataList = [
                {
                    "name":"test",
                    "tag":"标签",
                    "id":"daskd23213",
                    "number":"110",
                    "member":"sohu,baidu",
                    "status":"运行",
                },
                {
                    "name":"test",
                    "tag":"标签",
                    "id":"daskd232135",
                    "number":"110",
                    "member":"sohu,baidu",
                    "status":"运行",
                },
                {
                    "name":"test",
                    "tag":"标签",
                    "id":"daskd232134",
                    "number":"110",
                    "member":"sohu,baidu",
                    "status":"运行",
                }
            ]
            this.pageInstan.Total = 20;
            //this.pageInstan.Total = res.total;
            this.pageInstan.showPage = true;//判断数据是否为空 为空则不显示分页
        },
        optionData(data){
            data.forEach(function(item){
                item.createtime = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss"); 
            })   
        },
        
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if(this.multipleSelection.length>=1){
                this.bth_check.canDel = true;
                this.bth_check.canEdit = true;
            }else{
                this.bth_check.canDel = false;
                this.bth_check.canEdit = false;
            }
        },
        createItem(){
            this.editData={
                opentype:'create',
                optionWrap:true,
                content:this.multipleSelection
            }
        },
        editItem(item){
            this.editData={
                opentype:'edit',
                optionWrap:true,
                content:[item]
            }
        },
        deleteItem(){
            this.deleteDialogVisible = true
        },
        confirm(){
            let _this = this;
            this.deleteDialogVisible = false;
            let option = [];
            this.multipleSelection.forEach(element => {
                option.push(element.dataset_id);
            });
            this.deleteItemDisabled = true;
            this.delItem({dataset_ids:option}).then(()=>{
                this.initData()
            }).finally(function(){
                _this.deleteItemDisabled = false;
            })
        },
        updataWrap(val){
            this.editData.optionWrap = val.flag
            this.initData()
        },
        //刷新
        refresh(){
            this.globalSearchTerm = ''
            this.pageInstan.pageSize = 10
            this.pageInstan.currentPage = 1
            this.initData()
        },
        // 搜索
        applyGlobalSearch(){
            this.initData()
        },
        filterChange(){
            this.initData()
        },
        //切换页码组，每页展示多少条
        handleSizeChange(val) {
            this.pageInstan.pageSize = val;
            this.initData();
        },
        //切换页码
        handleCurrentChange(val) {
            this.pageInstan.currentPage = val;
            this.initData('','pageOne');
        },
    },
    computed:{
        bth_check(){
            if(this.multipleSelection.length>=1){
                return {
                    canDel:true,
                }
            }else{
                return {
                    canDel:false,
                }
            }
        }
    },
    watch:{
        $route(){
            this.hasRouteQuery = this.$route.query.id?1:0;
        }
    },
    mounted(){
        this.initData();
        this.hasRouteQuery = this.$route.query.id?1:0;
        this.filterList.forEach(item=>{
            item.text = this.$i18n.t('cn.resourceGroup.dataTitles.'+item.value);
        })
    }
}
</script>
