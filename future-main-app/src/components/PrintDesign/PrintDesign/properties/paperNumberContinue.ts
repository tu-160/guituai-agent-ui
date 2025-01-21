// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'paperNumberContinue';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      if (i.paperNumberDisabled) return null;
      return (
        (this.target = $(
          `<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        页码续排\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">\n        <option value="true" >续排</option>\n        <option value="reset" >重排</option>\n        </select>\n        </div>\n    </div>`,
        )),
        this.target
      );
    }),
    (t.prototype.getValue = function () {
      return 'true' == this.target.find('select').val();
    }),
    (t.prototype.setValue = function (t) {
      this.target.find('select').val((t == void 0 || t ? 'true' : 'reset').toString());
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
