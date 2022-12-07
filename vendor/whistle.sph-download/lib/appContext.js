let globalConfig = {};

exports.set = function set (key,value) {
  globalConfig[key] = value;
};
exports.get = function get(key){
  return globalConfig[key];
}