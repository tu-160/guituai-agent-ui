class YmBusinessData {
  data: any = { layout: { value: 'horizontal' } };
  constructor() {}

  // 设置业务属性参数
  setValue(elementId: string, value: any) {
    if (this.data[elementId]) {
      this.data[elementId] = { ...this.data[elementId], ...value };
    } else {
      this.data[elementId] = { ...value };
    }
  }

  getValue(elementId: string = '', key: string = '') {
    if (elementId && key) return (this.data[elementId] && this.data[elementId][key]) || '';
    if (elementId && !key) return this.data[elementId] || '';
    return this.data || {};
  }
}

export default YmBusinessData;
