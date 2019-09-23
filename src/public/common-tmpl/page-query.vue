<template>
    <div class="pagination-com" v-if="show">
         <!-- <button type="button" :disabled="status.firstPage" class="btn-prev" @click="goStart()"><i class="el-icon el-icon-d-arrow-left"></i></button> -->
        <el-pagination  background  @size-change="handleSizeChange"   @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, slot,prev" :total="total">
           <button type="button" :disabled="status.firstPage" class="btn-prev" @click="goStart()"><i class="el-icon el-icon-d-arrow-left"></i></button>
        </el-pagination><el-pagination  background  @size-change="handleSizeChange"   @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes"  :page-size="pageSize" layout="pager,next,slot" :total="total">
            <button type="button" :disabled="status.lastPage" class="btn-next" @click="goEnd()"><i class="el-icon el-icon-d-arrow-right"></i></button>
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            status:{
                firstPage:true,
                lastPage:true
            },
            show:true
        }
    },
    props: {
        pageSize: {
            type: Number,
            default: 10
        },
        pageSizes:{
            type: Array,
            default:function () {
                return [10,20,50]
            }
        },
        total: {
            type: Number,
            default: 1
        },
        currentPage:{
            type: Number,
            default: 1
        }
    },
    methods: {
        //每页展示条数
        handleSizeChange(val) {
            //事件传递
            this.$emit('handleSizeChangeSub', val);
            this.comFun(val);
        },
        //当前页
        handleCurrentChange(val) {
            //事件传递
            this.$emit('handleCurrentChangeSub', val);
            this.show = false;
            if(val == 1){
                this.status.firstPage = true;
            }else{
                this.status.firstPage = false;
            }
            if(val == Math.ceil(Number(this.total / this.pageSize))){
                this.status.lastPage = true;
            }else{
                this.status.lastPage = false;
            }
            // this.status.firstPage = false;
            this.$nextTick(() =>{
                this.show = true;
            })
            
        },
        goStart(){
            this.show = false;
            this.$emit('handleCurrentChangeSub', 1);
            this.$nextTick(() =>{
                this.show = true;
            })
        },
        goEnd(){
            this.show = false;
            this.$emit('handleCurrentChangeSub', Math.ceil(Number(this.total / this.pageSize)));
            this.$nextTick(() =>{
                this.show = true;
            })
        },
        // 初始化
        init(){
            if(Math.ceil(Number(this.total / this.pageSize))>1){
                // console.log(321);
                // this.$set(this.status,'lastPage',false)
                this.status.lastPage = false
            }
        },
        comFun(val){
            this.show = false;
            // 每次设置pagesize会将 currentpage赋值为1；
            /**
             * 判断currentpage为1时 将首尾的状态做改变
             */
            if(this.currentPage == 1){
                this.$nextTick(() => {
                    this.status.firstPage = true
                })
                if(this.total>val){ //判断是否只有一页
                    this.$nextTick(() => {
                        this.status.lastPage = false
                    })
                }else{
                    this.status.lastPage = true 
                }
            }else{
                this.$nextTick(() => {
                    this.status.firstPage = false
                })
            }
            this.$nextTick(() =>{
                this.show = true;
            })
        }
    },
    computed: {
        pageTotal() {
            return this.total;
        },
        // 检测是否获取到无数据
        initBack() {
            return this.total / this.pageSize < this.currentPage;
        },
        pageCurrent(){
            return this.currentPage
        }
    },
    created () {
        this.init();
    },
    watch: {
        pageTotal(val) {
        // 存在记录但未获取到数据时, 重新请求
            if (this.initBack) {
                this.currentPage = 1;
                this.$emit('handleCurrentChangeSub',1);
            }
            if(val<this.pageSize){
                this.show = false;
                this.status.firstPage = true;
                this.status.lastPage = true;
                this.$nextTick(() =>{
                    this.show = true;
                })
            }
        },
        currentPage(val) {
            this.show = false;
            if(val == 1){
                this.$nextTick(() => {
                    this.status.firstPage = true
                })
            }else{
                this.$nextTick(() => {
                    this.status.firstPage = false
                })
            }
            if(val == Math.ceil(Number(this.total / this.pageSize))){
                this.$nextTick(() => {
                    this.status.lastPage = true
                })
            }else{
                this.$nextTick(() => {
                    this.status.lastPage = false
                })
            }
            this.$nextTick(() =>{
                this.show = true;
            })
        },
        pageSize(val,oldval){
            if(val != oldval){
                this.comFun(val)
            }
        },
    },
}
</script>

