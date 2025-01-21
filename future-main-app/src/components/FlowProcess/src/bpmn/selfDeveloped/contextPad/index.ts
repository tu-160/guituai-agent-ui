// @ts-nocheck 过滤ts校验
import { attr as domAttr, query as domQuery, classes as domClasses, domify as domify, delegate as domDelegate, event as domEvent } from 'min-dom';
import { assign, forEach, isArray } from 'min-dash';
import { escapeCSS } from 'diagram-js/lib/util/EscapeUtil';
import contextPad from 'diagram-js/lib/features/context-pad/ContextPad';
import { bpmnGateway, bpmnTask, bpmnLabel, typeGateway } from '../../config/variableName';

var entrySelector = '.entry';

function addClasses(element: any, classNames: any) {
  var classes = domClasses(element);
  classNames = isArray(classNames) ? classNames : classNames.split(/\s+/g);
  classNames.forEach(function (cls: any) {
    classes.add(cls);
  });
}

class YmContextPad extends contextPad {
  constructor(canvas: any, config: any, eventBus: any, overlays: any) {
    super(canvas, config, eventBus, overlays);
  }
  // 打开节点右侧面板
  open(target: any, force: any) {
    this.close();
    if (!(target.type === bpmnLabel || target.wnType === typeGateway || target.type === bpmnTask)) return;
    if (!force && this.isOpen(target)) return;

    this._updateAndOpen(target);
  }
  isShown() {
    return this.isOpen();
  }
  arrowOpen(target: any) {
    var entries = this.getEntries(target),
      arrow = this.getArrow(target),
      html = arrow.html;

    let container = domify('<div class="rightArrow" id="rightArrow"></div>');
    html.appendChild(container);
    domClasses(html).add('open');

    this._current = {
      target: target,
      entries: entries,
      pad: arrow,
    };
    this._eventBus.fire('contextPad.open', { current: this._current });
  }
  getArrow(target: any) {
    if (this.isOpen()) {
      return this._current.pad;
    }
    var self = this;
    var overlays = this._overlays;
    var html = domify('<div class="ymArrow"></div>');
    var position = this._getPosition(target);
    domDelegate.bind(html, entrySelector, 'click', function (event) {
      self.trigger('click', event);
    });
    let newPosition = {
      position: {
        top: position.position.top + target.height / 2,
        left: position.position.left,
      },
    };
    var overlaysConfig = assign({ html: html }, this._overlaysConfig, newPosition);
    var overlaysConfig1 = assign({ html: html }, this._overlaysConfig, position);
    domDelegate.bind(html, '.rightArrow', 'click', function (event) {
      self._updateAndOpen(target);
      self.trigger('click', event);
    });
    domDelegate.bind(html, entrySelector, 'dragstart', function (event) {
      self.trigger('dragstart', event);
    });
    domEvent.bind(html, 'mousedown', function (event: any) {
      event.stopPropagation();
    });
    var activeRootElement = this._canvas.getRootElement();
    this._overlayId = overlays.add(activeRootElement, 'context-pad', overlaysConfig);
    var arrow = overlays.get(this._overlayId);
    this._eventBus.fire('contextPad.create', { target: target, pad: arrow });
    return arrow;
  }
  getPad(target: any) {
    if (this.isOpen()) return this._current.pad;
    var self = this;
    var overlays = this._overlays;
    let width = 32 + (target.type === bpmnLabel ? 84 * 5 : 84);
    if (target.type === bpmnTask) width = 32;
    let contextPad = 'djs-context-pad-future';
    if (target.type === bpmnTask) contextPad = 'djs-context-pad';
    var html = domify(`<div class=${contextPad} style="width:${width}px;border-radius: 8px;"></div>`);
    var position = this._getPosition(target);
    var overlaysConfig = assign(
      {
        html: html,
      },
      this._overlaysConfig,
      position,
    );
    domDelegate.bind(html, entrySelector, 'click', function (event) {
      self.trigger('click', event);
    });
    domDelegate.bind(html, entrySelector, 'dragstart', function (event) {
      self.trigger('dragstart', event);
    });
    // stop propagation of mouse events
    domEvent.bind(html, 'mousedown', function (event: any) {
      event.stopPropagation();
    });
    var activeRootElement = this._canvas.getRootElement();
    this._overlayId = overlays.add(activeRootElement, 'context-pad', overlaysConfig);
    var pad = overlays.get(this._overlayId);
    this._eventBus.fire('contextPad.create', {
      target: target,
      pad: pad,
    });
    return pad;
  }
  // 重写父类contextPad样式
  _updateAndOpen(target: any) {
    var entries = this.getEntries(target),
      pad = this.getPad(target),
      html = pad.html,
      image;
    forEach(entries, (entry: any, id: any) => {
      let textClass = ['svgText'];
      let entryClass = ['entry'];
      let groupClass = ['group'];
      if (target.type === bpmnTask) {
        entryClass.push('taskEntry');
        groupClass.push('taskGroup');
      }
      if (!entry?.disable && String(entry?.disable) === 'false') {
        entryClass = ['entry-disabled'];
      }
      let classAttribute = entryClass.join(' ');
      let groupClassAttribute = groupClass.join(' ');
      let textAttribute = textClass.join(' ');
      let grouping = 'default',
        control = domify(entry.html || `<div class="${classAttribute}" draggable="true"></div>`),
        container;

      let svg = domify(entry.html || target.type === bpmnTask ? '' : `<span class="${textAttribute}">${entry.title}</span>`);
      control.appendChild(svg);
      domAttr(control, 'data-action', id);
      container = domQuery('[data-group=' + escapeCSS(grouping) + ']', html);
      if (!container) {
        container = domify(`<div class="${groupClassAttribute}"></div>`);
        domAttr(container, 'data-group', grouping);
        if (Object.keys(entries).length > 1 && target?.type === bpmnLabel) {
          let content = '增加节点后可能会导致下面节点配置的数据传递规则失效';
          let contentDiv = domify(`<div class="djs-context-pad-future-content"></div>`);
          let text = domify(`<span class="djs-context-pad-future-text">${content}</span>`);
          contentDiv.appendChild(text);
          html.appendChild(contentDiv);
          addClasses(contentDiv, 'icon-ym icon-ym-generator-alert');
        }
        html.appendChild(container);
      }
      container.appendChild(control);
      if (entry.className) addClasses(control, entry.className);
      if (entry.title) domAttr(control, 'title', entry.title);
      if (entry.imageUrl) {
        image = domify('<img>');
        domAttr(image, 'src', entry.imageUrl);
        image.style.width = '100%';
        image.style.height = '100%';
        control.appendChild(image);
      }
    });
    domClasses(html).add('open');
    this._current = {
      target: target,
      entries: entries,
      pad: pad,
    };
    this._eventBus.fire('contextPad.open', { current: this._current });
  }
}
YmContextPad.$inject = ['canvas', 'config.contextPad', 'eventBus', 'overlays'];
export default YmContextPad;
