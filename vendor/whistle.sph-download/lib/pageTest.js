let allDataArray =[];
for(var i = 0; i < 20;i++){
    allDataArray.push(i+'a');
}

console.log(allDataArray.length);
for(var i = 0; i < allDataArray.length;i++){
    if('1a'==allDataArray[i]){
        allDataArray.splice(i,1);
        i--;
    }
}

console.log(allDataArray);

Array.prototype.indexOf = function(val) { 
    for (var i = 0; i < this.length; i++) { 
        if (this[i] == val) return i; 
    } 
    return -1; 
}; 
Array.prototype.remove = function(val) { 
    var index = this.indexOf(val); 
    if (index > -1) { 
        this.splice(index, 1); 
    } 
};

allDataArray.remove('19a');
console.log(allDataArray);
// for(var i = 0; i < allDataArray.length;i++){
//    console.log(allDataArray[i])
// }

//数组数据
var valArray = [2,2,2,3,4,5,2,6,7];
//删除的值
var delVal = 2;
//删除元素
for(var i=0; i<valArray.length; i++){
    //数据比对
    if(valArray[i] == delVal){
        //删除值
        valArray.splice(i,1);
        //下标递减
        i--;
    }
}
//输出日志
console.log("valArray=%s",JSON.stringify(valArray));    //输出：valArray=[3,4,5,6,7]


// var number=1;
// var size=20;
// var start = (number-1)*size;
// var end = start+size;
// console.log('s:',start,end);
// if(start>allDataArray.length){
//     start=allDataArray.length-1;
// }
// if(end>allDataArray.length){
//     end=allDataArray.length-1;
// }
// console.log(start, end)
// for(var i = start; i < end; i++){
//     //console.log(i)
//     console.log(allDataArray[i]);
// }

// allDataArray.slice(1,1);
// console.log('s:---slice')
// for(var i = start; i < end; i++){
//     //console.log(i)
//     console.log(allDataArray[i]);
// }