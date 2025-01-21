// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'tableTextType';
  }

  return (
    (t.prototype.createTarget = function () {
      this.target = $(
        `<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        字段类型\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">\n        <option value="" >默认(文本)</option>\n        <option value="text" >文本</option>\n <option value="sequence" >序号</option>\n       <option value="barcode" >条形码</option>\n        <option value="qrcode" >二维码</option>\n    <option value="image" >图片</option>\n        </select>\n        </div>\n    </div>`,
      );
      this.target.on('change', '.auto-submit', function () {
        const val = $(this).val();
        if (val === 'barcode') {
          $('.qrcode-config').addClass('hidden');
          $('.barcode-config').removeClass('hidden');
        } else {
          $('.barcode-config').addClass('hidden');
        }
        if (val === 'qrcode') {
          $('.qrcode-config').addClass('hidden');
          $('.qrcode-config').removeClass('hidden');
        } else {
          $('.qrcode-config').addClass('hidden');
        }
        if (['barcode', 'qrcode', 'image'].includes(val)) {
          $('.image-config').removeClass('hidden');
        } else {
          $('.image-config').addClass('hidden');
        }
      });
      return this.target;
    }),
    (t.prototype.getValue = function () {
      var t = this.target.find('select').val();
      if (t) return t;
    }),
    (t.prototype.setValue = function (t) {
      this.target.find('select').val(t);
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
