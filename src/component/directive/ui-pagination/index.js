paginationNav.$inject = ["$timeout"];
export function paginationNav(timeout) {
    /*
        <div ng-if="PAGE_TOTAL>1">
            <div class="page-wrap">
                <pagination-nav total="PAGE_TOTAL" change-page="changePage()" cur="PAGE_CURRENT_NUM"></pagination-nav>
            </div>
        </div>
    */
    return {
        restrict: "ECMA",
        scope: {
            total: "=",
            changePage: "&",
            cur: "=",
            sizeOptions:"="
        },
        template: `
            <ul class="pagination clearfix">
                <li ng-class="{'disabled':prevDis}"><a ng-click="prev()" class="prev"><i class="icon-aw-angle-double-left"></i></a></li>
                <li  ng-class="{'active':cur==item}" ng-repeat="item in totalNum"><a ng-click="goTo(item)">{{item}}</a></li>
                <li ng-class="{'disabled':nextDis}"><a ng-click="next()" class="next"><i class="icon-aw-angle-double-right"></i></a></li>
            </ul>
        `,
        link: function(scope, element, attrs) {
            var self = scope;

            function initPage() {
                //if(sizeOptions)
                console.log(scope.sizeOptions)
                if (self.total > 10) {
                    self.totalNum = [];
                    self.cur = self.cur * 1;
                    if (self.cur > 5) {
                        if (self.total - self.cur > 5) {
                            self.totalNum = [];
                            for (let i = self.cur - 4; i < self.cur + 6; i++) {
                                self.totalNum.push(i);
                            }
                        } else {
                            self.totalNum = [];
                            for (let i = self.total - 9; i < self.total + 1; i++) {
                                self.totalNum.push(i);
                            }
                        }
                    } else {
                        self.totalNum = [];
                        for (let i = 1; i < 11; i++) {
                            self.totalNum.push(i);
                        }
                    }
                } else {
                    self.totalNum = [];
                    for (let i = 1; i < self.total + 1; i++) {
                        self.totalNum.push(i)
                    }
                }

                if (self.cur == 1) {
                    self.prevDis = true;
                } else {
                    self.prevDis = false;
                }
                if (self.cur == self.total) {
                    self.nextDis = true;
                } else {
                    self.nextDis = false;
                }
            }
            initPage();
            self.goTo = function(num) {
                self.cur = num * 1;
                
                timeout(function(){
                    self.changePage();
                },0)
                if (self.cur == 1) {
                    self.prevDis = true;
                } else {
                    self.prevDis = false;
                }
                if (self.cur == self.total) {
                    self.nextDis = true;
                } else {
                    self.nextDis = false;
                }
            }
            self.prev = function() {
                if (self.cur == 1) {
                    return;
                }
                self.cur = self.cur * 1
                self.cur -= 1;
                self.goTo(self.cur);
            }
            self.next = function() {
                if (self.cur >= self.total) {
                    return;
                }
                self.cur = self.cur * 1
                self.cur += 1;
                self.goTo(self.cur);
            }
        }
    };
};
