
uiBubble.$inject = ["$timeout", "$translate"];
export function uiBubble($timeout, $translate){
    return {
        restrict: "E",
        replace: true,
        template: `<div class="page-alert-list" ng-class="{'show-dash-alert':BubbleList}">
            <div ng-repeat='item in BubbleList track by $index' class="alert"
                ng-class="{
                    'building':'alert-building',
                    'success':'alert-success',
                    'warning':'alert-warning',
                    'error':'alert-error',
                    false:'alert-error'
                }[item.type]"
            >
              <button type="button" class="alert-close" ng-click="BubbleClear(item,$index)">
                <i class="icon-aw-wrong"></i>
              </button>
              <div class="alert-title"></div>
              <div>
                  <span ng-bind="item.msg"></span>
                  <i ng-show="item.type=='building'" class="icon-aw-refresh aw-spin"></i>
              </div>
            </div>
        </div>`,
        link: function (scope) {
            scope.BubbleList = [];
            scope.$on("ui-tag-bubble",function(e,data){
                data.msg = $translate.instant("cn.code."+data.code);
                if(data.id){
                    scope.BubbleList = scope.BubbleList.filter(item=>item.id!=data.id);
                }
                data.type = data.type || "error";
                scope.BubbleList.unshift(data);

                if (data.keep) {
                    return;
                } else {
                    $timeout(function () {
                        let numFlag;
                        scope.BubbleList.filter((item, index) => {
                            if (!item.keep) {
                                numFlag = index;
                            }
                        });
                        scope.BubbleList.splice(numFlag, 1);
                    }, 5000);
                };
            });
            scope.BubbleClear = function (item, index) {
                scope.BubbleList.splice(index, 1);
            };
        }
    };
};

