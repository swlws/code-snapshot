function runStack(n) {
  if (n === 0) return 100;

  return runStack.bind(null, n - 1);
}

// 蹦床函数
// 解决函数调用栈溢出的问题
function t(fn) {
  while (fn && fn instanceof Function) {
    fn = fn();
  }
  return fn;
}

const f = t(runStack(50000));
console.log(f);
