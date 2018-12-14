let componentModule = angular.module("componentModule", []);
//下拉控制table栏的指令
componentModule.directive("setting", [function(){
    return {
        restrict: "E",
        scope:{
            titleData:"=",
            siteTitle:"=",
            searchTearm:"&",
            tableData:"="
        },
        template:`<div class='dropdown show-title'>
                    <button type='button' class='btn btn-renovat dropdown-toggle'>
                      <i class='icon-aw-gear'></i>
                    </button>
                    <ul class='dropdown-menu'>
                        <li ng-repeat='title in titleData track by $index' ng-if="!title.isShow">
                          <div class='checkbox'>
                            <label>
                               <input type='checkbox' ng-model='title.value' ng-change='isShowTitle($index,title)' ng-disabled='title.disable'/>
                               <i class='iconfont'></i>
                               <span>{{'cn.'+title.name|translate}}</span>
                            </label>
                          </div>
                        </li>
                    </ul>
                  </div>`,
        link: function(scope,ele){
            $(ele).find(".dropdown-toggle").on("click",function(e){
                $(this).parent().toggleClass("open");
                e.stopPropagation();
                e.preventDefault();
            });
            $(ele).find(".dropdown-menu").on("click",function(e){
                if(e.target.className=="checkbox"||$(e.target).closest(".checkbox").length>0){e.stopPropagation();}
            });
            $("html").on("click",function(e){
                $(ele).find(".dropdown").removeClass("open");
            });
            //第一次进来没有数据
            if(!sessionStorage[scope.siteTitle]&&scope.siteTitle!=undefined){
                sessionStorage.setItem(scope.siteTitle,JSON.stringify(scope.titleData));
            }
            scope.isShowTitle=function(index,title){
                var postData = {
                    tableData:scope.tableData,
                    titleData:scope.titleData
                };
                var currentSession=JSON.parse(sessionStorage[scope.siteTitle]);
                currentSession[index].value=title.value;
                sessionStorage.setItem(scope.siteTitle,JSON.stringify(currentSession));
                if(scope.tableData){
                    scope.searchTearm({obj:postData});
                }
            };
        }
    };
}]);

componentModule.directive("emptyTip", ["$translate",function(translate){
    return {
        restrict: "EA",
        scope:{
            "emptyType":"=",
            "tipId":"="
        },
        link: function(scope, element){
            var p = document.createElement("div");
            p.id = scope.tipId || "tip-msg";
            var ele = element[0].parentNode.getElementsByTagName("tbody")[0];

            var setEmptyTip = function(){
                if(!document.getElementById(p.id)){
                    element[0].parentNode.appendChild(p);
                }
                document.getElementById(p.id).innerHTML = translate.instant("cn.common.empty");
            };

            scope.$watch(function(){
                return ele.getElementsByTagName("tr").length;
            },function(len){
                if(len){
                    if(document.getElementById(p.id)){
                        document.getElementById(p.id).innerHTML= "";
                        $("#"+p.id).addClass("hide");
                    }
                }else{
                    if(scope.emptyType && ele.getElementsByTagName("tr").length==0){
                        setEmptyTip();
                    }
                    $("#"+p.id).removeClass("hide");
                }
            });

            scope.$watch(function(){
                return scope.emptyType;
            },function(val) {
                if(val && ele.getElementsByTagName("tr").length==0){
                    setEmptyTip();
                }
            });
        }
    };
}]);
componentModule.directive("loadingData",[function(){
    return {
        restrict: "EA",
        scope:{
            data:"="
        },
        template:`<div>
                    <p ng-if='noData'>{{'cn.common.empty'|translate}}</p>
                </div>`,
        link:function(scope){
            //$(".global-loading").addClass("hide");
            scope.$watch(function(){
                return scope.data;
            },function(data){
                scope.noData = false;
                scope.failedData = false;
                if(data){
                    if(data instanceof Array && data.length == 0){
                        scope.noData = true;
                    }else{
                        scope.noData=false;
                    }
                }else{
                    scope.noData = false;
                }
            });
        }
    };
}]);


componentModule.directive("loading", ["$http","APILOADING","$timeout",function($http,APILOADING,$timeout){
    return {
        restrict:"EA",
        // template:`<div class="global-loading" ng-class="{'shows':apiLoading}">
        //     <i class="loading-icon"></i>
        //     <span>数据加载中</span>
        // </div>`,
        template:`<div class="global-loading" ng-class="{'shows':apiLoading}">
            <div class="la-square-jelly-box la-2x">
                <div></div>
                <div></div>
            </div>
        </div>`,
        scope:{},
        link:function(scope,ele,attr,ctrl){
            var time = null;
            scope.$watch(function() {
                return $http.pendingRequests;
            },function(ne,old) {
                if(ne.length > 0) {
                    if(time){$timeout.cancel(time)};
                    time = $timeout(function() {
                        var pendingLists = angular.copy(ne);
                        var num = 0;
                        pendingLists.forEach(item=> {
                            for(var i=0;i<APILOADING.exclude.length;i++) {
                                var cur = new RegExp(APILOADING.exclude[i]);
                                if(cur.test(item.url)) {
                                    num += 1;
                                    break;
                                }
                            }
                        })
                        if(pendingLists.length>num) {
                            scope.apiLoading = true;
                            let _height = $(window).height();
                            $(ele).find(".global-loading").css('minHeight',_height);
                        }else {
                            scope.apiLoading = false;
                        }
                    },0)
                }else {
                    scope.apiLoading = false;
                }
            },true);
            scope.$on("$routeChangeStart",function() {
                if($http.pendingRequests.length>0) {
                    $http.pendingRequests = [];
                }
            });
        }
    }
}]);
componentModule.directive("markdownEditor", ["$http","APILOADING","$timeout",function($http,APILOADING,$timeout){
    return {
        restrict:"EA",
        template:`
            <div id="my-editormd" >
            <textarea id="my-editormd-markdown-doc" name="my-editormd-markdown-doc" style="display:none;"></textarea>
            <textarea id="my-editormd-html-code" name="my-editormd-html-code" style="display:none;"></textarea>
            </div>`,
        scope:{
            key:"@",
            edit:"=",
            data:"=",
            current:"=",
            change:"&"
        },
        link:function(scope,ele,attr,ctrl){
            var self = scope;
            var option = {
                //width   : "90%",
                height  : 640,
                markdown:scope.data,
                //readOnly        : true,
                syncScrolling : "single",
                path    : "/frontend_static/editor/lib/",//注意2：你的路径
                saveHTMLToTextarea : true,//注意3：这个配置，方便post提交表单
                imageUpload       : true,
                imageFormats      : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL    : window.GLOBALCONFIG.APIHOST.AILAB+"/v1/photoUpload",
                autoLoadModules : false,
                crossDomainUpload:false,
                toolbarAutoFixed:false,
                tex:true
            }
            if(scope.change){
                option.onchange = function(){
                    var _this = this;
                    scope.change({context:_this});
                    scope.$apply();
                }
            }
            if(!scope.edit){
                option.syncScrolling = "single";
            }
            $timeout(function(){
                if(scope.edit==1){
                    self.current.instan = editormd.markdownToHTML("my-editormd",option)
                }else{
                    self.current.instan = editormd("my-editormd",option);
                }
            },500)
        }
    }
}])
.directive("paginationNav", [function(){
    return {
        restrict: "ECMA",
        scope:{
            total:"=",
            datainit:"&",
            cur:"=",
            type:"@"
        },
        template:`
            <ul class="pagination clearfix" id="pageNum">
                <li ng-class="{'disabled':prevDis}"><a ng-click="prev()" class="prev"><i class="icon-aw-angle-double-left"></i></a></li>
                <li  ng-class="{'active':cur==item}" ng-repeat="item in totalNum"><a ng-click="goTo(item)">{{item}}</a></li>
                <li ng-class="{'disabled':nextDis}"><a ng-click="next()" class="next"><i class="icon-aw-angle-double-right"></i></a></li>
            </ul>
        `,
        link: function(scope, element, attrs){
            var self = scope;
                function initPage(){
                    if(self.total>10){
                        self.totalNum = [];
                        self.cur = self.cur*1;
                        if(self.cur>5){
                            if(self.total-self.cur>5){
                                self.totalNum = [];
                                for(let i=self.cur-4;i<self.cur+6;i++){
                                    self.totalNum.push(i);
                                }
                            }else{
                                self.totalNum = [];
                                for(let i=self.total-9;i<self.total+1;i++){
                                    self.totalNum.push(i);
                                }
                            }
                        }else{
                            self.totalNum = [];
                            for(let i=1;i<11;i++){
                                self.totalNum.push(i);
                            }
                        }
                    }else{
                        self.totalNum = [];
                        for(let i=1;i<self.total+1;i++){
                            self.totalNum.push(i)
                        }
                    }

                    if(self.cur==1){
                        self.prevDis = true;
                    }else{
                        self.prevDis = false;
                    }
                    if(self.cur==self.total){
                        self.nextDis = true;
                    }else{
                        self.nextDis = false;
                    }
                }
                initPage();
                self.goTo = function(num){
                    self.cur = num*1;
                    self.datainit({cur:self.cur});
                    if(self.cur==1){
                        self.prevDis = true;
                    }else{
                        self.prevDis = false;
                    }
                    if(self.cur==self.total){
                        self.nextDis = true;
                    }else{
                        self.nextDis = false;
                    }

                }
                self.prev = function(){
                    if(self.cur==1){
                        return;
                    }
                    self.cur = self.cur*1
                    self.cur-=1;
                    self.goTo(self.cur);
                }
                self.next = function(){
                    if(self.cur>=self.total){
                        return;
                    }
                    self.cur = self.cur*1
                    self.cur+=1;
                    self.goTo(self.cur);
                }
        }
    };
}])
.directive("fitScreen", ["$timeout",function($timeout){
    return {
        restrict: "ECMA",
        link: function(scope, element, attrs){
            function insertCss(){
                let screenHeight = $(window).height()
                let headerHeight = parseInt($(".inner").eq(0).css("height"))
                let footerHeight = parseInt($("footer").eq(0).css("height"))

                $(".main").eq(0).css("min-height",screenHeight-headerHeight-footerHeight)
            }
            insertCss()
            window.onresize = function(){
                insertCss()
            }
        }
    };
}])
.directive("timePick", [function(){
    return {
        restrict: "ECMA",
        scope: {
            model: "=",
            formname: "="
        },
        template:`<div class="input-group date form_date">
                <input class="form-control" name="{{formname}}" type="text" required readOnly
                       ng-model="model" placeholder="{{'cn.traincourse.placeholder.day'|translate}}"
                       autocomplete="off">
                <span class="input-group-addon calendar-cont">
                    <span class="glyphicon glyphicon-calendar fa fa-calendar"></span>
                </span>
            </div>
        `,
        link:function(scope,ele){
            var instan = ele.find('.form_date').datetimepicker({
                language: "zh-CN",
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2, 
                // minuteStep:5,
                minView:2,
                forceParse: 0,
                startDate:new Date(),
                format: "yyyy-mm-dd",
                pickerPosition: "bottom-left",
            });
            scope.model = moment().format('YYYY-MM-DD')
        }
    }
}])

export default componentModule.name;