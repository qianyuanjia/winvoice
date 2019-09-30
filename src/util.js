export function getDataList(datastr) {
    var sourceList = datastr.split(/,|，/mg) || [];
    var newlist = [];
    var num, flag, last;
    for (var j = 0; j < sourceList.length; j++) {
      num = sourceList[j].replace(/(-|\+)$/,'');
      last = sourceList[j].substr(-1);
      if (last === '+' || last === '-') {
        flag = last;
      } else {
        flag = '';
      }
      newlist.push({
        num: num,
        flag: flag,
        idx:j+1,
      });
    }
    return newlist;
  }
  export function isIos(){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
     if(window.location.href.indexOf("?mobile")<0){
      try{
       if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
        return true;
       }else{
        return false;
       }
      }catch(e){}
     }
    }else if( u.indexOf('iPad') > -1){
        return true;
    }else{
        return false;
    }
};