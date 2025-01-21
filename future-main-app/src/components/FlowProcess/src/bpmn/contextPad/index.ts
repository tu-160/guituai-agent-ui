// @ts-nocheck 过滤ts校验
import { attr as domAttr, query as domQuery, classes as domClasses, domify as domify, delegate as domDelegate, event as domEvent } from 'min-dom';
import { assign, forEach, isArray } from 'min-dash';
import { escapeCSS } from 'diagram-js/lib/util/EscapeUtil';
import contextPad from 'diagram-js/lib/features/context-pad/ContextPad';
import { bpmnTask } from '../config/variableName';

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
    if (!force && this.isOpen(target)) return;
    this.close();
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

    // stop propagation of mouse events
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
    var html = domify('<div class="djs-context-pad"></div>');
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

    this._overlayId = overlays?.add(activeRootElement, 'context-pad', overlaysConfig);

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
      let grouping = 'default',
        control = domify(entry.html || '<div class="entry" draggable="true"></div>'),
        container;
      let svg = domify(entry.html || `<span class='svgText'>${entry.title}</span>`);
      control.appendChild(svg);
      domAttr(control, 'data-action', id);
      container = domQuery('[data-group=' + escapeCSS(grouping) + ']', html);
      if (!container) {
        container = domify('<div class="group"></div>');
        domAttr(container, 'data-group', grouping);
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

    if (target) {
      /**
       * 任务节点，开始节点，只能有一个出线，否则无法显示。
       *
       * */
      // if (target.type === 'bpmn:UserTask') {
      //   if (target.outgoing?.length > 0) return;
      // }
    }
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
