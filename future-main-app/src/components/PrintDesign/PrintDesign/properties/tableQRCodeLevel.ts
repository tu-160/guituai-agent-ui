// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'tableQRCodeLevel';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      const hidden = i.tableTextType !== 'qrcode' ? 'hidden' : '';
      return (
        (this.target = $(
          `<div class="hiprint-option-item qrcode-config ${hidden}">\n        <div class="hiprint-option-item-label">\n        二维码容错率\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">\n        <option value="" >默认</option>\n        <option value="1" >7% L</option>\n        <option value="0" >15% M</option>\n        <option value="3" >25% Q</option>\n        <option value="2" >30% H</option>\n        </select>\n        </div>\n    </div>`,
        )),
        this.target
      );
    }),
    (t.prototype.getValue = function () {
      var t = this.target.find('select').val();
      return parseInt(t || 0);
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
