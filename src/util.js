function getDataList(datastr) {
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
  export default getDataList;