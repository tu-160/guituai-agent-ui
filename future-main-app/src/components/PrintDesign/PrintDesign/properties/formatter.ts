// @ts-nocheck
export default (function () {
  function t() {
    this.name = 'formatter';
  }

  return (
    (t.prototype.createTarget = function (_t, i) {
      const hidden = i.cType === 'images' ? 'hidden' : '';
      var t = `<div class="hiprint-option-item hiprint-option-item-row ${hidden}">\n        <div class="hiprint-option-item-label">格式化函数</div>\n        <div class="hiprint-option-item-field">\n        <textarea style="height:80px;" placeholder="function(title,value,options,templateData,target){}" class="auto-submit"></textarea>\n        </div>\n    </div>`;
      this.target = $(t);
      return this.target;
    }),
    (t.prototype.getValue = function () {
      var t = this.target.find('textarea').val();
      if (t) return t;
    }),
    (t.prototype.setValue = function (t) {
      this.target.find('textarea').val(t ? t.toString() : null);
    }),
    (t.prototype.destroy = function () {
      this.target.remove();
    }),
    t
  );
})();
