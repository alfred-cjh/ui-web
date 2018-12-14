
uiAlert.$inject = ["$rootScope"];
export function uiAlert($rootScope){
    return {
        restrict: "E",
        replace: true,
        scope:{

        },
        template: `<div class="delete-wrap" ng-show="uiTagAlert">
            <div class="delete-alert" ng-class="{'delete-show':uiTagAlert}">
              <div class="alert"
                ng-class="{
                    'warning':'alert-warning',
                    'success':'alert-success',
                    'danger':'alert-danger'
                }[type]"
              >
                <button type="button" class="close" ng-click="AlertClose()">
                  <span>×</span>
                  <span class="sr-only">Close</span>
                </button>
                <div class="del-cont"><span>{{message}}</span></div>
                <div class="btn-item">
                  <button type='button' class='btn' ng-click='AlertConfirm()'
                    ng-class="{
                        'warning':'btn-warning',
                        'success':'btn-primary',
                        'danger':'btn-danger'
                    }[type]"
                  >确定</button>
                  <button type='button' class='btn btn-default' ng-click="AlertClose()">取消</button>
                </div>
              </div>
            </div>
        </div>`,
        link: function (scope) {
            let context, recData;
            $rootScope.$on("ui-tag-alert", function (e, data) {
                scope.uiTagAlert = true;
                scope.message = data.msg;
                scope.type = data.type || "success";
                context = e.targetScope;
                recData = data;
            });
            scope.AlertClose = function () {
                context = null;
                recData = null;
                scope.uiTagAlert = false;
            };
            scope.AlertConfirm = function () {
                context[recData.func]();
                context = null;
                recData = null;
                scope.uiTagAlert = false;
            };
        }
    };
};

