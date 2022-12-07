let filterSet = new Set();
let allDataArray = [];
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
exports.remove = function (val) {
  allDataArray.remove(val);
  // 只删除数组元素，已加载标记不处理
};

exports.add = function (text,url) {
  text = typeof text === 'string' ? text.trim() : '';
  if (!text) {
    return;
  }
  if (!filterSet.has(text)) {
    console.log('----加入数组')
    allDataArray.push(url);
  }
  filterSet.add(text);
};
exports.has = function (text) {
  text = typeof text === 'string' ? text.trim() : '';
  if (!text) {
    return true;
  }
  return filterSet.has(text);
};
exports.clear = function () {
  filterSet.clear();
  allDataArray = [];
};
exports.page = function page(number, size) {
  if (!size) {
    size = 10;
  }
  if (number < 1) {
    number = 1;
  }
  console.log('set size is ',filterSet.size);
  for(var item of filterSet){
    console.log('------'+item)
  }
  var start = (number - 1) * size;
  var end = start + size;

  if (start > allDataArray.length) {
    start = allDataArray.length - 1;
  }
  if (end > allDataArray.length) {
    end = allDataArray.length - 1;
  }
  console.log('分页信息：', start, end)
  var data = [];
  for (var i = start; i < end; i++) {
    var d = allDataArray[i];
    if (d) {
      data.push(d);
    }
  }
  return data;
};

exports.all = function all() {
  return allDataArray;
};