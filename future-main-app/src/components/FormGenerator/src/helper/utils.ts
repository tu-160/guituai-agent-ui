/**
 * 将用户输入的连续单个数字合并为一个数
 * @param {Array} expressions - 记录计算表达式的数组
 * @returns {Array} 新的数组
 */
export const mergeNumberOfExps = expressions => {
  const res: any = [];
  const isNumChar = n => /^[\d|\.]$/.test(n);
  for (let i = 0; i < expressions.length; i++) {
    if (i > 0 && isNumChar(expressions[i - 1]) && isNumChar(expressions[i])) {
      res[res.length - 1] += expressions[i];
      continue;
    }
    res.push(expressions[i]);
  }
  return res;
};
/**
 * 校验表达式是否符合计算法则
 * @param {Array} expressions - 合并数字后的表达式数组
 * @returns {Boolean}
 */
export const validExp = (expressions, mergeNum = true) => {
  const temp = mergeNum ? mergeNumberOfExps(expressions) : expressions;
  const arr = temp.filter(t => !'()'.includes(t));
  // 去括号后 length应该为奇数  并且第一个字符和最后一个字符应该为数字而非计算符号
  if (temp.length % 2 === 0 || arr.length % 2 === 0 || Number.isNaN(+arr[0]) || Number.isNaN(+arr[arr.length - 1])) {
    return false;
  }
  for (let i = 0; i < arr.length - 1; i += 2) {
    if (typeof +arr[i] !== 'number' || !Number.isNaN(+arr[i + 1])) return false;
  }
  return true;
};
/**
 * 中缀转后缀（逆波兰 Reverse Polish Notation）
 * @param {Array} exps - 中缀表达式数组
 */
export const toRPN = exps => {
  const s1: any[] = []; // 符号栈
  const s2: any[] = []; // 输出栈
  const getTopVal = stack => (stack.length > 0 ? stack[stack.length - 1] : null);
  const levelCompare = (c1, c2) => {
    const getIndex = c => ['+-', '×÷', '()'].findIndex(t => t.includes(c));
    return getIndex(c1) - getIndex(c2);
  };
  exps.forEach(t => {
    if (typeof t === 'string' && Number.isNaN(Number(t))) {
      // 是符号
      if (t === '(') {
        s1.push(t);
      } else if (t === ')') {
        let popVal;
        do {
          popVal = s1.pop();
          popVal !== '(' && s2.push(popVal);
        } while (s1.length && popVal !== '(');
      } else {
        let topVal = getTopVal(s1);
        if (!topVal) {
          // s1 为空 直接push
          s1.push(t);
        } else {
          while (topVal && topVal !== '(' && levelCompare(topVal, t) >= 0) {
            // 优先级 >= t 弹出到s2
            s2.push(s1.pop());
            topVal = getTopVal(s1);
          }
          s1.push(t);
        }
      }
      return;
    }
    s2.push(t); // 数字直接入栈
  });
  while (s1.length) {
    s2.push(s1.pop());
  }
  return s2;
};
/**
 * 计算后缀表达式的值
 * @param {Array} rpnExps - 后缀表达式
 */
export const calcRPN = rpnExps => {
  rpnExps = rpnExps.concat();
  const calc = (x, y, type) => {
    let a1 = Number(x),
      a2 = Number(y);
    switch (type) {
      case '+':
        return a1 + a2;
      case '-':
        return a1 - a2;
      case '×':
        return a1 * a2;
      case '÷':
        return a1 / a2;
    }
  };
  for (let i = 2; i < rpnExps.length; i++) {
    if ('+-×÷'.includes(rpnExps[i])) {
      let val = calc(rpnExps[i - 2], rpnExps[i - 1], rpnExps[i]);
      rpnExps.splice(i - 2, 3, val);
      i = i - 2;
    }
  }
  return rpnExps[0];
};
