/**
 * 时间转化函数
 */
export function translateTime(input) {
    var d = new Date(input);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() <10 ? "0" + d.getDate() : "" + d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return  year+ "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

/**
 * 深度拷贝对象数组
 */
export function deepCopyObjArray(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === "object" ? deepCopyObjArray(source[item]) : source[item];
    }
    return sourceCopy;
}
/**
* 将秒数换成时分秒格式
* 作者：何亮
*/
export  function formatSeconds(value,type) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "";
    if(type == 'en_US'){
        result = "" + parseInt(secondTime) + "second";

        if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "minute" + result;
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + "hour" + result;
        }
    }else{
        result = "" + parseInt(secondTime) + "秒";

        if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "分" + result;
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + "小时" + result;
        }
    }
    return result;
}
