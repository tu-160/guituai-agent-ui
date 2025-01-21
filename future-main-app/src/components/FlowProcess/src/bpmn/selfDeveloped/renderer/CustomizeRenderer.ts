import { typeConfig } from '../../config';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import {
  bpmnEnd,
  bpmnExclusive,
  bpmnInclusive,
  bpmnLabel,
  bpmnParallel,
  bpmnStart,
  bpmnSubFlow,
  bpmnTask,
  typeConfluence,
  typeSubFlow,
} from '../../config/variableName';

/**
 * svg重画bpmn节点
 */
export default (parentNode: any, element: any, futureFlowInfo: any) => {
  let type = element.type; // 获取到类型
  let data = futureFlowInfo?.flowNodes[element.id];
  let wnType = element.wnType || data?.type;
  if (typeConfig && typeConfig[type]) {
    if (wnType === typeSubFlow) type = bpmnSubFlow;
    let { renderer } = typeConfig[type];
    let { icon, iconColor, rendererName, background, titleColor, attr, bodyDefaultText } = renderer;
    //  直接修改元素的宽高
    element['width'] = wnType === typeConfluence ? 1 : element.isPreview ? 1 : attr.width;
    element['height'] = wnType === typeConfluence ? 1 : element.isPreview ? 1 : attr.height;
    let nodeName = element.nodeName || data?.nodeName || rendererName;
    let nodeContent = element.elementBodyName || data?.content || bodyDefaultText;
    if (element.nodeState) {
      if (element.nodeState == 'state-past') {
        titleColor = 'linear-gradient(90deg, #AEEFC2 0%, #4ED587 100%)';
        iconColor = '#25a210';
      }
      if (element.nodeState == 'state-curr') {
        titleColor = 'linear-gradient(90deg, #C0EDF8 0%, #A6DEF8 100%)';
        iconColor = '#1eaceb';
      }
      if (element.nodeState == 'state-coming') {
        titleColor = 'linear-gradient(90deg, #CED1D5 0%, #CBCBCC 100%);';
        iconColor = '#4c4c58';
      }
      nodeContent = element.nodeContent;
    }
    let foreignObject: any = svgCreate('foreignObject', {
      width: wnType === typeConfluence ? 0 : element.isPreview ? 1 : attr.width,
      height: wnType === typeConfluence ? 0 : element.isPreview ? 1 : attr.height,
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
    // label改为按钮
    if (type === bpmnLabel) {
      foreignObject.innerHTML = `
      <div class="node-container"  >
        <div class='label-node-container'>＋</div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 条件分支
    if (type === bpmnInclusive) {
      // 合流 展示一个点
      if (element.wnType === typeConfluence) {
        foreignObject.innerHTML = `
        <div class="node-container start-node-container node-selfDeveloped" style="background:${background}" >
          <div class='node-top-container'>
            <span>合流</span>
          </div>
        </div>`;
        svgAppend(parentNode, foreignObject);
        return parentNode;
      } else
        foreignObject.innerHTML = `
      <div class="node-container start-node-container node-selfDeveloped" style="background:${background}" >
        <div class='node-top-container'>
          <span>添加条件</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 并行分支
    if (type === bpmnParallel) {
      foreignObject.innerHTML = `
      <div class="node-container start-node-container node-selfDeveloped" style="background:${background}" >
        <div class='node-top-container'>
          <span>${rendererName}</span>
        </div>
     </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
    // 选择分支
    if (type === bpmnExclusive) {
      foreignObject.innerHTML = `
      <div class="node-container start-node-container node-selfDeveloped" style="background:${background}" >
        <div class='node-top-container'>
          <span>${rendererName}</span>
        </div>
      </div>`;
      svgAppend(parentNode, foreignObject);
      return parentNode;
    }
  }
};
