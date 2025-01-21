// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'paperNumberDisabled';
  }

  return (
    (t.prototype.createTarget = function () {
      this.target = $(
        `<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        显示页码\n        </div>\n        <div class="hiprint-option-item-field">\n        <select class="auto-submit">\n        <option value="" >显示</option>\n        <option value="true" >隐藏</option>\n        </select>\n        </div>\n    </div>`,
      );
      this.target.on('change', '.auto-submit', function () {
        $('.hiprint-printPaper').click();
      });
      return this.target;
    }),
    (t.prototype.getValue = function () {
      if ('true' == this.target.find('select').val()) return !0;
    }),
    (t.prototype.setValue = function (t) {
      this.target.find('select').val((null == t ? '' : t).toString());
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
