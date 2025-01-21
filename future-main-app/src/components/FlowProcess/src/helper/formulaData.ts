const formulaData = [
  {
    id: 'maths',
    fullName: '数学函数',
    desc: '',
    children: [
      {
        id: 'SUM',
        fullName: 'SUM',
        desc: `<ul class="formula-desc-wrapper">
        <li><span class="formula-name">SUM</span>函数可以获取一组数值的总和</li>
        <li>用法：<span class="formula-name">SUM</span>(数值1,数值2,...)</li>
        <li>示例：<span class="formula-name">SUM</span>(语文成绩，数学成绩)返回两门课程总分</li>
        </ul>`,
      },
      {
        id: 'SUBTRACT',
        fullName: 'SUBTRACT',
        desc: `<ul class="formula-desc-wrapper">
        <li><span class="formula-name">SUBTRACT</span>函数可以返回数值相减</li>
        <li>用法：<span class="formula-name">SUBTRACT</span>(被减数,减数)</li>
        <li>示例：<span class="formula-name">SUBTRACT</span>(总收入，总支出)返回收支总利润</li>
        </ul>`,
      },
      {
        id: 'PRODUCT',
        fullName: 'PRODUCT',
        desc: `<ul class="formula-desc-wrapper">
        <li><span class="formula-name">PRODUCT</span>函数可以获取一组数值的乘积</li>
        <li>用法：<span class="formula-name">PRODUCT</span>(数值1,数值2,...)</li>
        <li>示例：<span class="formula-name">PRODUCT</span>(单价，数量)获取总价，即单价和数量的乘积</li>
        </ul>`,
      },
      {
        id: 'DIVIDE',
        fullName: 'DIVIDE',
        desc: `<ul class="formula-desc-wrapper">
        <li><span class="formula-name">DIVIDE</span>函数可以返回数值相除</li>
        <li>用法：<span class="formula-name">DIVIDE</span>(被除数,除数)</li>
        <li>示例：<span class="formula-name">DIVIDE</span>(总价，单价)获取数量，即总价除单价</li>
        </ul>`,
      },
      {
        id: 'COUNT',
        fullName: 'COUNT',
        desc: `<ul class="formula-desc-wrapper">
        <li><span class="formula-name">COUNT</span>函数可以获取参数的数量</li>
        <li>用法：<span class="formula-name">COUNT</span>(值,值,...)</li>
        <li>示例：<span class="formula-name">COUNT</span>(小王,小李)返回2,即人员数量</li>
        </ul>`,
      },
    ],
  },
];

export default formulaData;
