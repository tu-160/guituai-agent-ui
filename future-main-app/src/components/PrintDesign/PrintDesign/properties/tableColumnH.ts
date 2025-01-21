// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'tableColumnHeight';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      const hidden = !['barcode', 'qrcode', 'image'].includes(i.tableTextType) ? 'hidden' : '';
      return (
        (this.target = $(
          `<div class="hiprint-option-item image-config ${hidden}">\n        <div class="hiprint-option-item-label">\n        单元格高度\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="text" placeholder="条形码、二维码以及图片有效" class="auto-submit" >\n        </div>\n    </div>`,
        )),
        this.target
      );
    }),
    (t.prototype.getValue = function () {
      var t = this.target.find('input').val();
      if (t) return t.toString();
    }),
    (t.prototype.setValue = function (t) {
      this.target.find('input').val(t);
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
