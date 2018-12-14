var UIModule = angular.module("UIModule", []);

UIModule.directive("monitorAreaStack", ["monitorCache", function (monitorCache){
    return {
        restrict: "E",
        replace: false,
        scope: {
            data: "=",
            chartTitle: "="
        },
        template: "<div class='monitor-chart-size'></div>",
        link: function (scope, element) {
            scope.$watch(function(){
                return scope.data
            }, function (val) {
                if (val) {
                    scope.xAxisData = [];
                    scope.yAxisData = [];
                    _.forEach(val.hostMonitorValDTOs, function (item) {
                        scope.xAxisData.push(item.x);
                        scope.yAxisData.push(item.y);
                    });
                    if (scope.xAxisData.length == 0 || scope.yAxisData.length == 0) {
                        scope.xAxisData = [0,0,0,0,0];
                        scope.yAxisData = [0,0,0,0,0];
                    }
                    monitorCache[scope.chartTitle] = echarts.init(element[0].querySelector("div"));
                    monitorCache[scope.chartTitle].clear();
                    var option = {
                        title: {
                            text: scope.chartTitle,
                            textStyle:{
                                color:"#666666",
                                fontSize:14
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            // formatter: '{c}%'
                        },
                        legend: {
                            icon: 'rect', //设置图例的图形形状，circle为圆，rect为矩形
                            itemWidth: 14, //图例标记的图形宽度[ default: 25 ]
                            itemHeight: 7, //图例标记的图形高度。[ default: 14 ]
                            data:scope.data.x_data,
                            bottom:-5,
                        },
                        grid: {
                            left: '3%',
                            right: '6%',
                            bottom: '9%',
                            containLabel: true
                        },
                        toolbox: {
                            feature: {
                            }
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: scope.data.series[0].time,
                            axisLine: {
                                lineStyle: {
                                    color: '#7991ab'
                                 }
                             },
                             axisLabel: {  
                                // interval: 0,  
                                formatter:function(value)  
                                {  
                                    return value.replace(" ","\n");  
                                }  
                            },
                        },
                        yAxis: [
                            {
                                splitLine:{show: false},
                                type : 'value',
                                 axisLine: {
                                     show: false,
                                 },
                                 axisTick: {
                                     show: false
                                 },
                             },
                             {
                                splitLine:{show: false},
                                type : 'value',
                                 axisLine: {
                                     show: false,
                                 },
                                 axisTick: {
                                     show: false
                                 },
                                 axisLabel: {  
                                    formatter: '{value} %'  
                                },  
                             },
                        ],
                        series:scope.data.series
                    };
                    monitorCache[scope.chartTitle].setOption(option);
                }
            },true);
            window.onresize = function () {
                for (let key in monitorCache) {
                    monitorCache[key].resize("auto", "auto");
                    scope.$apply();
                }
            };
        }
    }
}]).value("monitorCache", {});
UIModule.directive("pieChart", ["monitorCache", function (monitorCache){
    return {
        restrict: "E",
        replace: false,
        scope: {
            data: "=",
        },
        template: "<div class='resview-chart-size'></div>",
        link: function (scope, element) {
            scope.$watch("data", function (val) {
                if (val) {
                    scope.xAxisData = [];
                    scope.yAxisData = [];
                    _.forEach(val.hostMonitorValDTOs, function (item) {
                        scope.xAxisData.push(item.x);
                        scope.yAxisData.push(item.y);
                    });
                    if (scope.xAxisData.length == 0 || scope.yAxisData.length == 0) {
                        scope.xAxisData = [0,0,0,0,0];
                        scope.yAxisData = [0,0,0,0,0];
                    }
                    monitorCache[scope.data.chartTitle] = echarts.init(element[0].querySelector("div"));
                    monitorCache[scope.data.chartTitle].clear();
                    var option = {
                        title: [{
                            text:scope.data.total,
                            left: '49%',
                            top: "46%",
                            textAlign: 'center',
                            textBaseline: 'middle',
                            textStyle: {
                                fontWeight: 'normal',
                                color: '#666666',
                                fontSize: 30
                            }
                        },{
                            text:scope.data.chartTitle,
                            left: '49%',
                            top: '57%',
                            textAlign: 'center',
                            textBaseline: 'middle',
                            textStyle: {
                                fontWeight: 'normal',
                                color: '#666666',
                                fontSize: 14
                            }
                        }],
                        series: [
                            {
                                name:'',
                                type:'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                hoverAnimation:false,
                                data:scope.data.chartData,
                            }
                        ],
                        color:scope.data.colorList
                    };
                    monitorCache[scope.data.chartTitle].setOption(option);
                }
            },true);
            // window.onresize = function () {
            //     for (let key in monitorCache) {
            //         monitorCache[key].resize("auto", "auto");
            //         scope.$apply();
            //     }
            // };
        }
    }
}]).value("monitorCache", {});
UIModule.directive("changeNum", [function () {
    return {
        restrict: "E",
        scope: {
            number: "=",
            addnum: "=",
            pattern: "=",
            names: "=",
            createtrainform: "=",
            mydesc: "="
        },
        template: `<button type='button' class='minus-button' ng-disabled='number<=1'>-</button>
        <input  class='type-number' name='{{names}}' ng-model='number' ng-maxlength='4' required ng-pattern='pattern'/>
        <button type='button' class='add-button'>+</button>
        <div class='error' ng-messages="createtrainform[names].$error">
        <span class='error' ng-message='pattern'>{{mydesc}}</span>
        <span class='error' ng-message='required'>必填项</span>
        <span class='error' ng-message='maxlength'>最大长度为4位</span>
        </div>`
        ,
        link: function (scope, element) {
            $(element).find(".add-button").click(function () {
                if (scope.number) {
                    scope.number = (scope.number * 10 + scope.addnum*10)/10;
                } else {
                    scope.number = 1;
                }
                scope.$apply();
            });
            $(element).find(".minus-button").click(function () {
                if (scope.number && scope.number != 1) {
                    scope.number = (scope.number*10 - scope.addnum*10)/10;
                } else {
                    scope.number = 1;
                }
                scope.$apply();
            });
            $(element).find(".type-number").focus(function () {
                $(this).keydown(function (e) {
                    if (!((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105) || event.which == 110 || event.which == 37 || event.which == 39 || event.which == 190 || event.which == 8 || event.which == 9 || event.which == 110)) {
                        event.preventDefault();
                    }
                });
            });
        }
    };
}]);
UIModule.directive("modalDialog",["$window","$timeout",function($window,$timeout){
    return {
        restrict:"C",
        link:function(scope,ele){
            scope.$watch(function(){
                return $(ele).find(".modal-common").outerHeight();
            },function(ne,old){
                if(!ne){
                    return;
                }
                if(ne!=old){
                    let winH = $(window).outerHeight();
                    let eleH = $(ele).find(".modal-common").outerHeight();
                    if(eleH-winH>=0){
                        $(ele).parent(".modal").addClass("modal-absolute")
                    }else{
                        $(ele).parent(".modal").removeClass("modal-absolute")
                    }
                }
                $(window).on("resize",function(){
                    let winH = $(window).outerHeight();
                    let eleH = $(ele).find(".modal-common").outerHeight();
                    if(eleH-winH>=0){
                        $(ele).parent(".modal").addClass("modal-absolute")
                    }else{
                        $(ele).parent(".modal").removeClass("modal-absolute")
                    }
                })
            })
        }
    }
}]);
UIModule.directive("pane", [function () {
    return {
        require: "?ngModel",
        restrict: "E",
        transclude: true,
        scope: {
            animation: "=",
            detailData: "="

        },
        template: "<div class= 'animateContent {{animation}} '>" +
            "<div class='detailInner'>" +
            "<ng-transclude></ng-transclude>" +
            "</div>" +
            "</div>" +
            "<div class='animate-backup'></div>"
        /*,
                link: function(scope, element, attrs) {
                    console.log(scope.test)

                }*/
    };
}]);
UIModule.directive("quotaBar", ["$timeout", function ($timeout) {
    return {
        restrict: "A",
        replace: true,
        transclude: true,
        scope: {
            bardata: "="
        },
        template: function (elem) {
            if (elem[0].id == ""){
                return "<div>\
                            <div class=\"left\">{{bardata.title}}</div>\
                            <div class=\"right\">{{\"cn.common.inUsed\"|translate}}  <span class=\"value progress-bar-{{barTypePluginFunc(percent)}}\" >{{bardata.inUsed}}</span>/{{bardata.total}}</div>\
                            <div class=\"progress active width\">\
                                <div class=\"progress-bar progress-bar-{{barTypePluginFunc(percent)}} \" aria-valuenow=\"used\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (inUsepercent?(inUsepercent < 100 ? inUsepercent : 100):0) + \'%\'}\"></div>\
                                <div ng-if=\"bardata.beAdded\" class=\"progress-bar progress-bar-{{barTypePluginFunc(percent,'add')}} \" aria-valuenow=\"added\" title=\"已添加：{{bardata.beAdded}}\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (addpercent?(addpercent < 100 ? addpercent : 100):0) + \'%\'}\"></div>\
                            </div>\
                        </div>";
            }
            else if (elem[0].id.indexOf("userQuota") > -1) {
                return "<div>\
                            <div class=\"userTableStyle\">  <span class=\"value progress-bar-{{barTypePluginFunc(percent)}}\" >{{bardata.inUsed}}</span>/{{bardata.total}}{{bardata.unit}}</div>\
                            <div class=\"progress active width\" title=\"已使用：{{bardata.inUsed}}/{{bardata.total}}{{bardata.unit}} {{bardata.label}}\">\
                                <div class=\"progress-bar progress-bar-{{barTypePluginFunc(percent)}} \" aria-valuenow=\"used\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (inUsepercent?(inUsepercent < 100 ? inUsepercent : 100):0) + \'%\'}\"></div>\
                            </div>\
                        </div>";
            } else if (elem[0].id.indexOf("custerQuota") > -1) {
                return "<div>\
                            <div class=\"userTableStyle\">  <span class=\"value progress-bar-{{barTypePluginFunc(percent)}}\" >{{bardata.inUsed}}</span>/{{bardata.hard}}/{{bardata.total}}{{bardata.unit}}</div>\
                            <div class=\"progress custer-progress active width\" title=\"已使用量：{{bardata.inUsed}}{{bardata.unit}}&#10配额总量：{{bardata.hard}}{{bardata.unit}}&#10实际资源总量：{{bardata.total}}{{bardata.unit}} \">\
                                <div class=\"progress-bar progress-bar-{{barTypePluginFunc(percent,'sd')}} \" aria-valuenow=\"used\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (inUsepercent?(inUsepercent < 100 ? inUsepercent : 100):0) + \'%\'}\"></div>\
                                <div class=\"progress-bar progress-bar-{{barTypePluginFunc(hartPercent_)}} \" aria-valuenow=\"hard\"  aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (hartPercent?(hartPercent < 100 ? hartPercent : 100):0) + \'%\'}\"></div>\
                            </div>\
                        </div>";
            } else if (elem[0].id == "setting") {
                return "<div>\
                            <div class=\"left\">{{bardata.title}}</div>\
                            <div class=\"right\">{{bardata.subtitle}}  <span class=\"value progress-bar-{{barTypePluginFunc(percent)}}\" >{{bardata.inUsed}}</span>/{{bardata.total}}</div>\
                            <div class=\"progress active width\">\
                                <div class=\"progress-bar progress-bar-{{barTypePluginFunc(percent)}} \" aria-valuenow=\"used\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (inUsepercent?(inUsepercent < 100 ? inUsepercent : 100):0) + \'%\'}\"></div>\
                                <div ng-if=\"bardata.beAdded\" class=\"progress-bar progress-bar-{{barTypePluginFunc(percent,'add')}} \" aria-valuenow=\"added\" title=\"已添加：{{bardata.beAdded}}\" aria-valuemin=\"0\" aria-valuemax=\"bardata.total\" ng-style=\"{width: (addpercent?(addpercent < 100 ? addpercent : 100):0) + \'%\'}\"></div>\
                            </div>\
                        </div>";
            }
        },
        link: function (scope) {
            scope.$watch(function () {
                return scope.bardata;
            }, function (bardata) {
                if (bardata) {
                    scope.used = 0;
                    scope.added = 0;
                    scope.hard = 0;
                    var totalPercent = ((scope.bardata.inUsed + scope.bardata.beAdded) / scope.bardata.total * 100).toFixed(1);
                    scope.percent = totalPercent <= 100 ? totalPercent : 100;
                    scope.inUsepercent = (scope.bardata.inUsed / scope.bardata.total * 100).toFixed(1);
                    var beAdd_percent = (scope.bardata.beAdded / scope.bardata.total * 100).toFixed(1);
                    scope.addpercent = beAdd_percent <= 100 - scope.inUsepercent ? beAdd_percent : 100 - scope.inUsepercent;
                    scope.hartPercent_ = scope.bardata.total?(scope.bardata.hard/scope.bardata.total)*100:100;
                    scope.hartPercent = ((scope.bardata.hard-scope.bardata.inUsed )/ scope.bardata.total * 100)-0.1;
                    if(scope.bardata.inUsed>scope.bardata.hard){
                        scope.hartPercent = 0.1;
                    }else if(scope.bardata.hard>scope.bardata.total){
                        scope.hartPercent = 100-(scope.bardata.inUsed / scope.bardata.total * 100)-0.1;
                    }
                    $timeout(function () {
                        scope.used = scope.bardata.inUsed || 0;
                        scope.added = scope.bardata.beAdded || 0;
                        scope.hard = scope.bardata.hard || 0;
                    }, 300);
                }
            }, true);
            scope.barTypePluginFunc = function (percent, type) {
                if (percent <= 30) {
                    return type ? "DarkgreenLight" : "green";
                } else if (percent > 30 && percent <= 70) {
                    return type ? "blueDark" : "blue";
                } else if (percent > 70 && percent <= 90) {
                    return type ? "yellow" : "yellowDark";
                }else if(percent > 90){
                    return type ? "red" : "redDark";
                }
            };
            // scope.barTypePluginFunc = function (percent, type) {
            //     if (percent <= 30) {
            //         return type ? "DarkgreenLight" : "green";
            //     } else if (percent > 30 && percent <= 50) {
            //         return type ? "blueDark" : "blue";
            //     } else if (percent > 50 && percent <= 65) {
            //         return type ? "blue" : "blueDark";
            //     } else if (percent > 65 && percent <= 75) {
            //         return type ? "orangeDark" : "orange";
            //     } else if (percent > 75 && percent <= 85) {
            //         return type ? "orange" : "orangeDark";
            //     } else if (percent > 85 && percent <= 95) {
            //         return type ? "redDark" : "red";
            //     } else if (percent > 95) {
            //         return type ? "red" : "redDark";
            //     }
            // };
        }
    };
}]);
UIModule.directive("barGraph", ["$timeout", function ($timeout) {
    return {
        restrict:"EA",
        replace:true,
        scope: {
            bardata: "="
        },
        template:`
                <div class="progress width" title="已使用：{{bardata.inUsed}}/{{bardata.total}}{{bardata.unit}} {{bardata.label}}">
                    <div class="progress-bar progress-bar-{{barTypePluginFunc(inUsepercent)}}" ng-style="{width: (inUsepercent?(inUsepercent < 100 ? inUsepercent : 100):0) + '%'}"></div>
                </div>
                `,
        link:function(scope){
            scope.inUsepercent = 0;
            scope.barTypePluginFunc = function (percent, type) {
                if (percent <= 30) {
                    return type ? "DarkgreenLight" : "green";
                } else if (percent > 30 && percent <= 70) {
                    return type ? "blueDark" : "blue";
                } else if (percent > 70 && percent <= 90) {
                    return type ? "yellow" : "yellowDark";
                }else if(percent > 90){
                    return type ? "red" : "redDark";
                }
            };
            scope.$watch(function () {
                return scope.bardata;
            }, function (bardata) {
                if (bardata) {
                    scope.inUsepercent = (scope.bardata.inUsed / scope.bardata.total * 100).toFixed(1)?(scope.bardata.inUsed / scope.bardata.total * 100).toFixed(1):0;
                }
            }, true);
        }
    }
}])
UIModule.directive("toggleNav", [function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            if (document.body.offsetWidth <= 1365) {
                $("body").removeClass("layoutopen").addClass("closed");
            } else {
                $("body").addClass("layoutopen").removeClass("closed");
            }
            element.find(".toggle-icon").on("click", function() {
                $("body").toggleClass("layoutopen");
                $("body").toggleClass("closed");
            });
        }
    };
}]);
UIModule.directive("swiper", ["$timeout",function($timeout) {
    return {
        restrict: "EA",
        scope:{
            data:"=",
        },
        template:`
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" ng-repeat="item in data track by item.id"><img ng-src="{{item.url}}" alt=""></div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
        </div>
        `,
        link: function(scope, element) {
            $timeout(function(){
                var mySwiper = new Swiper('.swiper-container', {
                    autoplay: 5000,//可选选项，自动滑动
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    prevButton:'.swiper-button-prev',
                    nextButton:'.swiper-button-next'
                })
            },500)

        }
    };
}]);

export default UIModule.name;
