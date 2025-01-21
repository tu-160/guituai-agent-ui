// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'paperNumberFormat';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      if (i.paperNumberDisabled) return null;
      return (
        (this.target = $(
          `<div class="hiprint-option-item hiprint-option-item-row">\n        <div class="hiprint-option-item-label">\n        页码格式\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="text" placeholder="\${paperNo}-\${paperCount}" class="auto-submit">\n        </div>\n    </div>`,
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
