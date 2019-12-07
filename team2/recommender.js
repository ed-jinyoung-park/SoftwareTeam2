var SVDJS = require('svd-js');
var math = require('mathjs');

var a = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [1,0,1,0,0],
  [1,1,1,1,0],
  [1,1,1,1,0],
  [0,0,0,0,0]
    ];

var b = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [1,0,1,0,0],
      [1,1,1,1,0],
      [1,1,1,1,0],
      [0,0,0,0,0]
    ];

var svd_q_a=math.sum(SVDJS.SVD(a).q);
var svd_q_b=math.sum(SVDJS.SVD(b).q);

console.log(svd_q_a);
console.log(svd_q_b);

