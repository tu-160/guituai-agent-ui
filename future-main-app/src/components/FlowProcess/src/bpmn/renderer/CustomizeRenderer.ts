import { typeConfig } from '../config';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { bpmnEnd, bpmnStart, bpmnSubFlow, bpmnTask, typeSubFlow } from '../config/variableName';

/**
 * svg重画bpmn节点
 */
export default (parentNode: any, element: any, futureFlowInfo: any) => {
  let data = futureFlowInfo?.flowNodes[element.id];
  let nodeMap = futureFlowInfo?.nodeList;
  let isPreview = futureFlowInfo?.isPreview;
  let type = element.type; // 获取到类型
  if (typeConfig && typeConfig[type]) {
    if (data?.type === typeSubFlow) type = bpmnSubFlow;
    if (element.wnType === typeSubFlow) type = bpmnSubFlow;
    let { renderer } = typeConfig[type];
    let { icon, iconColor, rendererName, background, titleColor, attr, bodyDefaultText } = renderer;
    //  直接修改元素的宽高
    element['width'] = attr.width;
    element['height'] = attr.height;
    let nodeName = element.nodeName || data?.nodeName || rendererName;
    let nodeContent = element.elementBodyName || nodeMap.get(element.id)?.userName || data?.content || bodyDefaultText;

    if (isPreview) {
      if (nodeMap.get(element.id)?.type) {
        if (nodeMap.get(element.id)?.type === '0') {
          titleColor = 'linear-gradient(90deg, #AEEFC2 0%, #4ED587 100%)';
          iconColor = '#25a210';
        }
        if (nodeMap.get(element.id)?.type === '1') {
          titleColor = 'linear-gradient(90deg, #C0EDF8 0%, #A6DEF8 100%)';
          iconColor = '#1eaceb';
        }
      } else {
        titleColor = 'linear-gradient(90deg, #CED1D5 0%, #CBCBCC 100%);';
        iconColor = '#4c4c58';
      }
    }

    let foreignObject: any = svgCreate('foreignObject', {
      width: attr.width,
      height: attr.height,
      class: type === bpmnStart || type === bpmnEnd ? 'begin-or-end-node' : 'task-node',
    });
    // 开始节点
    if (type === bpmnStart) {
      foreignObject.innerHTML = `
      <div class="node-container start-node-container" style="background:${background}" >
        <div class='node-top-container'>
          <i class="${icon}" style="color:${iconColor}"></i>
          <span>${nodeName}</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 审批节点
    if (type === bpmnTask) {
      foreignObject.innerHTML = `
      <div class="node-container" style="background:${background}" >
        <div class='node-top-container' style="background:${titleColor};">
          <i class="${icon}" style="color:${iconColor}"></i>
          <span>${nodeName}</span>
        </div>
        <div class='node-bottom-container'>
          <span>${nodeContent}</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 子流程节点
    if (type === bpmnSubFlow) {
      foreignObject.innerHTML = `
      <div class="node-container" style="background:${background}" >
        <div class='node-top-container' style="background:${titleColor}">
          <i class="${icon}" style="color:${iconColor}"></i>
          <span>${nodeName}</span>
        </div>
        <div class='node-bottom-container'>
          <span>${nodeContent}</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 结束节点
    if (type === bpmnEnd) {
      foreignObject.innerHTML = `
      <div class="node-container end-node-container" style="background:${background}" >
        <div class='node-top-container'>
          <i class="${icon}" style="color:${iconColor}"></i>
          <span>${nodeName}</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
  }
};
