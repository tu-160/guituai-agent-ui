// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'imageHeight';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      const hidden = i.cType !== 'images' ? 'hidden' : '';
      this.target = $(
        `<div class="hiprint-option-item ${hidden}">\n        <div class="hiprint-option-item-label">\n        图片高度\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="number" value="100" step="1" min="0" class="auto-submit"/>\n        </div>\n    </div>`,
      );
      return this.target;
    }),
    // 获取值
    (t.prototype.getValue = function () {
      var t = this.target.find('input').val();
      if (t) return parseFloat(t.toString());
    }),
    // 设置值
    (t.prototype.setValue = function (t) {
      //  t: options 对应键的值
      this.target.find('input').val(t);
    }),
    // 销毁 DOM
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
