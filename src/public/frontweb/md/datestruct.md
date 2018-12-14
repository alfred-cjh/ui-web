
####本规范基于目前AWcloud和AIstack两个产品的业务形态整理的比较通用的开发规范，产品目前主要的业务逻辑都是基于某个表格进行增删改等操作，本规范主要用来引导前端开发人员按此类风格进行开发，使得业务代码风格保持一致

### 1.按钮
主要约定 `新建`，`编辑`，`删除`，`更多操作` 四种通用按钮，包括按钮的HTML,CSS和JavaScript的事件定义

![](./md/images/md-button.jpg)

```html
<button type="button" ng-click="createItem()" class="btn btn-primary">
    <i class="icon-aw-add-to2"></i>新建路径
</button>
<button type="button" ng-disabled="!canEdit" ng-click="editItem()" class="btn btn-info">
    <i class="icon-aw-modify"></i>编辑
</button>
<button type="button" ng-disabled="!canDel" ng-click="deleteItem(checkedItems)" class="btn btn-info">
  <i class="icon-aw-delete"></i>删除
</button>
<div class="dropdown">
    <button type="button" class="btn btn-info dropdown-toggle" ng-disabled="!canMoreOpt" data-toggle="dropdown">更多操作
        <i class="icon-aw-angle-down-1"></i>
    </button>
    <ul class="dropdown-menu">
        <li>
            <button>按钮一</button>
        </li>
        <li>
            <button>按钮二</button>
        </li>
    </ul>
</div>
```

- 按钮一律使用 `button` 标签，class类名必须加上基类 `.btn`，且按钮内必须添加对应操作的 `icon`。
- `更多操作` 的下拉列表中的 `button` 按钮可不用添加基类`.btn`
- 使用 `canMoreOpt` 变量名控制 `更多操作` 按钮是否可用
- `新建` 按钮事件方法名为 `createItem`                  
- `编辑` 功能的页面如果与新建页面相同可复用新建事件方法，否则 `编辑` 事件方法名为`editItem`                     
- 使用 `canEdit` 变量名控制 `编辑` 按钮是否可用
- `删除` 按钮事件方法名为 `deleteItem` 
- 使用 `canDel` 变量名控制 `删除` 按钮是否可用     



### 2.搜索框
主要约定搜索框，刷新按钮的HTML和JavaScript事件方法名

![](./md/images/md-search.jpg)

```html 
<div class="pull-right">
    <div class="search-box">
        <form name="searchForm" novalidate ng-keyup="applyGlobalSearch()">
            <button class="btn" type="submit" ng-disabled="searchForm.$invalid">
                <i class="icon-aw-search"></i>
            </button>
            <input type="text" class="form-control" autocomplete="off" maxlength="128" name="searchTerm" ng-model="globalSearchTerm"/>
        </form>
    </div>
    <button class="btn btn-renovat btn-search" ng-click="refresh()">
        <i class="icon-aw-refresh"></i>
    </button>
</div>
```
- `搜索` 事件方法名为 `applyGlobalSearch`，文本框内变量名为 `globalSearchTerm`,
- `刷新` 事件方法名为 `refresh`

### 3.表格
主要约定：
- 表格HTML和CSS
- 表格初始化事件方法名
- 表格无数据时使用的指令
- 表格的全选框的模板ID命名

![](./md/images/md-table.jpg)

```html
<div class="table-content">
    <table ng-table="tableParams" class="table">
        <colgroup>
            <col width="4%">
            <col width="32%">
            <col width="32%">
            <col width="32%">
        </colgroup>
        <tr ng-repeat="item in $data">
            <td header="'tableParamsbox.html'">
            <label class="checkbox">
                <input type="checkbox" ng-model="checkboxes.items[item.id]" />
                <i class="iconfont"></i>
            </label>
            </td>
            <td data-title="dataTitles.name" sortable="'pathName'">{{item.pathName}}</td>
            <td data-title="dataTitles.decr" sortable="'routeDescription'"><span class="word-break">{{item.routeDescription}}</span></td>
            <td data-title="dataTitles.createTime" sortable="'createTime'"><span class="word-break">{{item.createTime}}</span></td>
        </tr>
        <tr ng-if="$data.length==0">
            <td colspan="4">
                <loading-data data="$data"></loading-data>
            </td>
        </tr>
    </table>
</div>
<script type="text/ng-template" id="tableParamsbox.html">     
    <label class="checkbox">
        <input type="checkbox" ng-model="checkboxes.checked" class="select-all" value="" /> 
        <i class="iconfont"></i>
    </label>
</script>
```
```javascript


.controller("demoCtrl", ["$scope", "pathlistSrv", "$uibModalInstance","$translate","modalCom","TableCom", 
    function($scope, Srv, $uibModalInstance,$translate,modalCom,TableCom) {
    ...
    function initList() {
        Srv.getItemList().then(function(res) {
            if (res && res.data && res.data.data) {
                self.tableData = res.data.data;
                ...
                ...
                //实例化ngTable组件
                TableCom.init(self, "tableParams", self.tableData, "id", 10)
                //清除监听
                if (self.watched) {
                    self.watched();
                }
                self.watched = watchCheck(self);
            }
        })
        //搜索框初始化
        self.globalSearchTerm = "";
    }
    initList()
}])


```


- 表格的class基类为 `.table`, `ngTable` 组件变量名默认为 `tableParams`, 如果同一页面有多个 `ngTable` 的实例，则实例名称的命名规则为 `table+{模块名}`,
- 表格初始化方法名为 `initList` ，如果同一页面有多个 `ngTable` 的实例，初始化方法名命名规则为 `{模块名}+initList`
- 当表格无数据时使用统一的指令`<loading-data data="$data"></loading-data>`
- 表格全选框模板ID命名规则为`{ngTable实例名称}+box`



### 4.弹出层
主要约定弹出层实例的初始化方法

首先在controller中引入`弹出层` 组件的服务 `modalCom` ，然后调用组件方法

```javascript
.controller("demoCtrl", ["$scope", "pathlistSrv", "$uibModalInstance","$translate","modalCom", 
    function($scope, Srv, $uibModalInstance,$translate,modalCom) {
    ...
    //新建事件方法
    self.createItem = function(type) {
        /**弹出层实例化方法
            demoCreate.html:弹出层实例的HTML模板URL
            demoCreateCtrl:弹出层实例的controller
        */
        modalCom.init('demoCreate.html', 'demoCreateCtrl', {
            //使用弹出层实例创建某个资源成功后执行的回调函数
            refresh: function() {
                return self.refresh
            },
            //弹出层实例的上下文
            context: function() {
                return self;
            },
            //弹出层类型，(可选)
            type: function() {
                return type;
            }
        })
    }
}])

```


### 5.删除类弹出层
主要约定删除类弹出层的使用方法

![](./md/images/md-delete.jpg)

```javascript
//删除事件方法
self.deleteItem = function(checkedItems) {
    ...
    ...
    let content = {
        //弹出框内的提示信息
        msg: $translate.instant("cn.pathstage.delItem"),
        type: "warning",
        //删除后的回调函数名
        func: "confirmDeleteItem"
    };
    ...
    ...
    self.$emit("ui-tag-alert", content);
};

//删除成功后的回调函数
self.confirmDeleteItem = function() {
    ...
    ...
    Srv.delItem(data).then(() => {
        initList();
    });
};
```

### 6.服务的命名规则
主要约定 `获取列表`，`新建`，`编辑`，`删除` 四类服务接口的方法名

```javascript
.service("demoSrv", ["$http" ,function ($http) {
    let static_url = "ailab-manager/v1/";
    return {
        getItemList: function () {
            return $http({
                method: "GET",
                url: 'test.com'
            });
        },
        createItem: function (data) {
            return $http({
                method: "POST",
                url: 'test.com'
                data:data
            });
        },
        editItem: function (data) {
            return $http({
                method: "PUT",
                url: 'test.com'
                data:data
            });
        },
        delItem: function () {
            return $http({
                method: "delete",
                url: 'test.com'
            });
        }
    }
}])

```
- 获取列表的服务方法名为 `getItemList`
- 创建资源实例的服务方法名为 `createItem`
- 编辑资源实例的服务方法名为 `editItem`
- 删除资源实例的服务方法名为 `delItem`


### 7.表单校验错误提示书写规范
主要约定错误提示的HTML和CSS

![](./md/images/md-input.jpg)

```html
<form name="createForm">
    <div class="control-group">
        <label class="control-label">
            <span class="red">*</span>{{'cn.pathlist.dataTitles.name'|translate}}：
        </label>
        <div class="controls">  
            <input class="form-controls" name="name" 
                ng-model="create.pathName" 
                placeholder="{{'cn.pathlist.placeholder.name'|translate}}"
                ng-maxlength="50" 
                required
                ng-pattern='/^([1-9]\d{0,3}|10000)$/'
                />
                <div ng-messages="(FormValid ||createForm.name.$dirty) && createForm.name.$error">
                    <span class="error" ng-message="required">{{'cn.errors.required'|translate}}</span>
                    <span class="error" ng-message="maxlength">{{'cn.errors.maxlength255'|translate}}</span>
                    <span class="error" ng-message="minlength">{{'cn.errors.minlength255'|translate}}</span>
                    <span class="error" ng-message="pattern">{{'cn.errors.limit_1_10000'|translate}}</span>
                </div>
        </div>
    </div> 
</form>

```

- 提示信息以`div`标签包括所有错误提示信息，不同的提示信息用`span`标签管理，`span`标签上添加`.error`基类


