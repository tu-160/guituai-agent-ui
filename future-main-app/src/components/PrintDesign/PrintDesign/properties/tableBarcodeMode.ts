// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'tableBarcodeMode';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      const hidden = i.tableTextType !== 'barcode' ? 'hidden' : '';
      return (
        (this.target = $(
          `<div class="hiprint-option-item barcode-config ${hidden}">\n        <div class="hiprint-option-item-label">\n        条形码格式\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">\n         <option value="" >默认(CODE128A)</option>\n         <option value="CODE128A" >CODE128A</option>\n        <option value="CODE128B" >CODE128B</option>\n        <option value="CODE128C" >CODE128C</option>\n        <option value="CODE39" >CODE39</option>\n        <option value="EAN-13" >EAN-13</option>\n        <option value="EAN-8" >EAN-8</option>\n        <option value="EAN-5" >EAN-5</option>\n        <option value="EAN-2" >EAN-2</option>\n        <option value="UPC（A）" >UPC（A）</option>\n        <option value="ITF" >ITF</option>\n        <option value="ITF-14" >ITF-14</option>\n        <option value="MSI" >MSI</option>\n            <option value="MSI10" >MSI10</option>\n            <option value="MSI11" >MSI11</option>\n            <option value="MSI1010" >MSI1010</option>\n            <option value="MSI1110" >MSI1110</option>\n            <option value="Pharmacode" >Pharmacode</option>\n        </select>\n        </div>\n    </div>`,
        )),
        this.target
      );
    }),
    (t.prototype.getValue = function () {
      var t = this.target.find('select').val();
      return t || void 0;
    }),
    (t.prototype.setValue = function (t) {
      this.target?.find('select').val(t);
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
