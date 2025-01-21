<template>
  <div class="future-bpmnContainer" ref="bpmnContainer"></div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, markRaw, ref, unref, computed, nextTick, onUnmounted } from 'vue';
  import { defaultXml, selfDefaultXml } from './helper/defaultXml';
  import {
    typeConfluence,
    typeGateway,
    bpmnStart,
    bpmnSequenceFlow,
    bpmnGateway,
    typeEnd,
    bpmnLabel,
    bpmnTask,
    bpmnEnd,
    bpmnInclusive,
    bpmnExclusive,
  } from './config/variableName';
  import { getExternalLabelMid } from 'bpmn-js/lib/util/LabelUtil';
  import { NodeUtils } from './utils/nodeUtil';
  import { useMessage } from '@/hooks/web/useMessage';
  import { conversionWnType, typeConfig } from './config';
  import BpmnModeler from './modeler';
  import FutureModeler from './selfDeveloped/modeler';
  import customTranslate from './translate';
  import AutoPlaceModule from 'bpmn-js/lib/features/auto-place';
  import minimapModule from 'diagram-js-minimap';
  import 'bpmn-js/dist/assets/diagram-js.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  import 'diagram-js-minimap/assets/diagram-js-minimap.css';
  import { BPMNTreeBuilder } from './utils/constructTreeUtil';
  import { DEFAULT_DISTANCE } from './autoPlace/YmAutoPlaceUtil';
  import { is } from 'bpmn-js/lib/util/ModelUtil';
  import type { PropType } from 'vue';

  interface State {
    futureData: any;
    element: any;
    bpmn: any;
  }

  const props = defineProps({
    flowNodes: {
      type: Object,
      default: () => ({}),
    },
    flowXml: {
      type: String,
      default: '',
    },
    nodeList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    type: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['viewSubFlow']);

  defineExpose({ getElement, getBpmn });

  const state = reactive<State>({
    futureData: {},
    element: {},
    bpmn: null,
  });
  const customTranslateModule = {
    translate: ['value', customTranslate],
  };
  const bpmnContainer = ref(null);
  const { createMessage } = useMessage();
  let elementClickId: any = null;
  let nodeMap: any = new Map();
  if (props.nodeList?.length > 0) {
    for (let i = 0; i < props.nodeList?.length; i++) {
      nodeMap.set(props.nodeList[i].nodeCode, props.nodeList[i]);
    }
  }

  // 禁用画布操作处理
  const getAdditionalModules = computed(() => {
    if (!props.disabled) {
      if (props.type === 1) return { bendpoints: ['value', ''], move: ['value', ''] };
      return { labelEditingProvider: ['value', ''] };
    }
    const data = {
      bendpoints: ['value', ''], // 禁止拖动线
      contextPadProvider: ['value', ''], // 禁止点击节点出现contextPad
      labelEditingProvider: ['value', ''], // 禁止双击节点出现label编辑框
      move: ['value', ''], //禁止节点拖动
    };
    return data;
  });

  // 初始化bpmn模拟器
  function initBpmn() {
    const container: any = unref(bpmnContainer);
    const Modeler = props.type == 1 ? FutureModeler : BpmnModeler;
    state.bpmn = markRaw(
      new Modeler({
        container,
        // 添加控制板
        propertiesPanel: {
          parent: '#properties',
        },
        //键盘快捷键
        keyboard: {
          bindTo: document,
        },
        additionalModules: [
          AutoPlaceModule,
          minimapModule, //小地图
          customTranslateModule, // 翻译
          unref(getAdditionalModules),
        ],
        flowInfo: {
          flowNodes: props.flowNodes,
          nodeList: nodeMap,
          isPreview: props.isPreview,
        },
      }),
    );
    state.futureData = state.bpmn.get('futureData');
    state.futureData.setValue('global', {});
    for (let key in props.flowNodes) {
      state.futureData.setValue(key, props.flowNodes[key]);
    }
    const modeling: any = state.bpmn.get('modeling');
    handleInitListeners(state.bpmn, modeling);
    const xml = props.flowXml ? getRealXml(props.flowXml) : props.type === 1 ? selfDefaultXml : defaultXml;
    state.bpmn.importXML(xml).then(() => {
      handleFlowState(modeling);
    });
    if (props.isPreview || props.disabled) state.bpmn.get('keyboard').unbind();
  }
  function handleInitListeners(bpmn, modeling) {
    const eventBus: any = bpmn.get('eventBus');
    // 监听新增元素
    bpmn.on('shape.added', ({ element }) => {
      handleShapeAdded(element);
    });
    // 监听点击事件
    eventBus.on('element.click', ({ element }) => {
      handleElementClick(element);
    });
    eventBus.on('custom.message', e => {
      createMessage.warning(e?.context || '');
    });
    if (props.isPreview) return;
    // 监听节点选中
    bpmn.on('selection.changed', e => {
      handleSelectionChanged(e);
    });
    // 监听新建线条
    bpmn.on('connection.added', e => {
      handleConnectionAdded(e, modeling);
    });
    // 监听移除元素
    bpmn.on('shape.removed', ({ element }) => {
      handleShapeRemoved(element);
    });
    bpmn.on('copyPaste.copyElement', ({ element }) => {
      element.type === bpmnStart && createMessage.warning('流程发起节点不能复制');
    });
    // 监听事件，自定义删除规则
    eventBus.on('commandStack.canExecute', e => {
      handleCommandStackCanExecute(e, modeling);
    });
    eventBus.on('commandStack.elements.move.postExecuted', e => {
      handleCommandMovePostExecuted(e, modeling);
    });
    eventBus.on('commandStack.connection.reconnect.postExecuted', e => {
      handleCommandReconnectPostExecuted(e, modeling);
    });
  }
  function handleShapeAdded(element) {
    element.offset = 0;
    if (element.type === 'label' || !element.id) return;
    let data: any = {
      nodeId: element.id,
      type: getWnType(element),
    };
    if (element.wnName) data.nodeName = element.wnName;
    let currentData = state.futureData.getValue(element.id);
    element.wnType = data.type;
    if (currentData) {
      state.futureData.setValue(element.id, { ...currentData });
    } else {
      //全局属性开启签名后，新增的节点默认开启
      if (element.wnType == 'approver') data.hasSign = state.futureData.getValue('global', 'hasSign') || false;
      state.futureData.setValue(element.id, { ...data });
    }
    state.element = element;
  }
  function handleSelectionChanged(e) {
    let element = e.newSelection[0];
    if (element && props.type === 1) {
      if (element.type === bpmnSequenceFlow && !(element.source?.type === bpmnInclusive || element.source?.type === bpmnExclusive))
        return (state.element = undefined);
      if (element.type === bpmnGateway) return (state.element = undefined);
      if (element.source?.wnType === typeConfluence && element.target?.wnType === typeConfluence) return (state.element = undefined);
    }

    state.element = element;
  }
  function handleConnectionAdded(e, modeling) {
    nextTick(() => {
      if (props.type === 1) {
        const { element } = e;
        let waypoint = element.waypoints[element.waypoints.length - 1];
        let labelCenter = getExternalLabelMid(element);
        labelCenter = {
          x: waypoint.original?.x ? waypoint.original.x + 31 : waypoint.x + 31,
          y: element.target.y - (element.target.y - element.source.y - element.source.height) / 2 - 8,
        };
        if (element.target.wnType === typeConfluence) {
          if (element.source.x > element.target.x) {
            labelCenter = {
              x: element.source.x + 31 + element.source.width / 2,
              y: (element.waypoints[1].y + element.waypoints[0].y) / 2 - 14,
            };
          } else {
            labelCenter = {
              x: element.source.x + element.source.width / 2 + 31,
              y: (element.waypoints[1].y + element.waypoints[0].y) / 2 - 14,
            };
          }
        }
        if (element.source.wnType === typeConfluence) {
          labelCenter = {
            x: labelCenter.x,
            y: element.target.y - (element.target.y - element.source.y - element.source.height) / 2,
          };
        }
        if (element.target.wnType === typeEnd) {
          labelCenter = {
            x: labelCenter.x,
            y: element.target.y - (element.target.y - element.source.y - element.source.height) / 2 - 8,
          };
        }
        if (element.source.wnType != typeGateway) {
          element.businessObject.x = 10;
          // 说明不是分流网关 不显示其样式
          modeling.createLabel(element, labelCenter, {
            id: element.businessObject.id + '_label',
            businessObject: element.businessObject,
            text: 'label',
            di: element.di,
            y: 0,
          });
        }
      }
    });
  }
  function handleShapeRemoved(element) {
    if (state.futureData.getValue(element.id)) delete state.futureData.data[element.id];
  }
  function handleElementClick(element) {
    if (element.wnType == 'subFlow' && props.isPreview && nodeMap.get(element.id)?.type) return emit('viewSubFlow', element.id);
    // 清除上一次选中的元素颜色
    if (elementClickId) {
      let marker = document.querySelector<HTMLElement>('marker');
      let oldElementNode = document.querySelector<HTMLElement>(`g.djs-element[data-element-id=${elementClickId.id}] .djs-visual `)!;
      let oldPath = oldElementNode?.querySelector('path');
      if (oldPath) oldPath.setAttribute('style', `stroke: #A2B9D5;marker-end:url(#${marker?.id}); visibility: visible;`);
    }
    if (element.type == bpmnSequenceFlow && !props.isPreview) {
      let elementNode = document.querySelector<HTMLElement>(`g.djs-element[data-element-id=${element.id}] .djs-visual `)!;
      if (elementNode) {
        let path = elementNode.querySelector('path');
        if (
          (path && !(element.source.type === bpmnInclusive || element.source.type === bpmnExclusive) && props.type === 1) ||
          (element.source?.type === bpmnInclusive && element.target?.type === bpmnInclusive)
        ) {
        } else if (path) {
          elementClickId = element; // 记录上一次点击的元素 取消点击后需要清除选中颜色。
          path.setAttribute('style', `stroke: rgb(24,131,255);marker-end:url(#${'bpmnSequenceFlowActiveId'}); visibility: visible;`);
        }
      }
    }
  }
  /**
   * autoLayoutDel 获取偏移坐标的子元素 如遇到坐标重新计算偏移坐标
   * （如果下一个元素不是网关则入栈遍历获取到相同偏移量的组别进行统一偏移）
   */
  function handleDeleteGateway(gateway: any, delElement: any, type: 'gateway' | 'task') {
    let elementRegistry: any = state.bpmn.get('elementRegistry');
    let modeling: any = state.bpmn.get('modeling');
    let allElements = elementRegistry.getAll();
    let newGateway: any = [];
    let treeBuilder = new BPMNTreeBuilder(allElements);
    if (type === 'gateway') {
      let confluenceElement = elementRegistry.get(gateway.id + '_confluence');
      let sourceList = NodeUtils.getLastElementList(confluenceElement, allElements).filter(i => i.id != delElement.id);
      let targetList = NodeUtils.getNextElementList(confluenceElement, allElements);
      let elementList = treeBuilder.getElementsByGateway(gateway); // 通过分流元素获取所有的分流 合流网关内部的所有元素
      modeling.removeElements([gateway, confluenceElement]);
      modeling.connect(sourceList[0], targetList[0]);
      modeling.moveElements(elementList, { x: 0, y: -(DEFAULT_DISTANCE + typeConfig[bpmnGateway].renderer.attr.height) });
      autoLayoutDel(targetList[0]);
    } else {
      let h = delElement.y - (gateway.y + DEFAULT_DISTANCE + gateway.height);
      autoLayoutDel(delElement, [], h);
    }
    while (newGateway.length > 0) {
      let childrenMaxY: number = -Infinity,
        h: number = 0;
      let gateway: any = newGateway.shift();
      let lastElementList: any = NodeUtils.getLastElementList(gateway, elementRegistry.getAll());
      lastElementList.map((item: any) => {
        if (item.y > childrenMaxY) {
          childrenMaxY = Number(item.y) || 0;
        }
      });
      if (gateway.y - childrenMaxY != DEFAULT_DISTANCE) {
        h = gateway.y - (childrenMaxY + DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height);
      }
      let nextlist = NodeUtils.getNextElementList(gateway, elementRegistry.getAll());
      autoLayoutDel(nextlist[0], [gateway], h);
    }
    function autoLayoutDel(element: any, oldList?: any[], currentHeight?: number) {
      let queue: any = [element];
      let childrenMaxY: number = -Infinity,
        h: number = 0,
        groupList: any = [];
      while (queue.length > 0) {
        let current: any = queue.shift();
        if (currentHeight) {
          groupList = oldList || [];
          h = currentHeight;
        } else {
          let lastElementList: any = NodeUtils.getLastElementList(current, elementRegistry.getAll());
          lastElementList.map((item: any) => {
            if (item.y > childrenMaxY) childrenMaxY = Number(item.y) || 0;
          });
          if (!h && current.y - childrenMaxY != DEFAULT_DISTANCE) {
            h = current.y - (childrenMaxY + DEFAULT_DISTANCE + typeConfig[bpmnTask].renderer.attr.height);
          }
        }
        if (current.wnType === typeGateway) {
          groupList.push(current);
          let l = treeBuilder.getElementsByGateway(current) || [];
          l.map((item: any) => {
            groupList.push(elementRegistry.get(item.id));
          });
          let confluenceElement = elementRegistry.get(current.id + '_confluence');
          groupList.push(confluenceElement);
          if (confluenceElement.outgoing && confluenceElement.outgoing.length > 0) {
            confluenceElement.outgoing.map((item: any) => {
              let nextElement = item.target;
              queue.push(nextElement);
            });
          }
        } else if (current.wnType === typeConfluence) {
          newGateway.push(current);
          continue;
        } else {
          groupList.push(current);
          if (current.outgoing && current.outgoing.length > 0) {
            current.outgoing.map((item: any) => {
              let nextElement = item.target;
              queue.push(nextElement);
            });
          }
        }
      }
      if (groupList && groupList.length > 0) {
        let list: any = [];
        groupList.map((item: any) => {
          let element = elementRegistry.get(item.id);
          list.push(element);
        });
        modeling.moveElements(list, { x: 0, y: -h });
      }
    }
  }
  function onAutoPosition() {
    let elementRegistry: any = state.bpmn.get('elementRegistry');
    let modeling: any = state.bpmn.get('modeling');
    let allElements = elementRegistry.getAll();
    let treeBuilder = new BPMNTreeBuilder(allElements); // 实例化工具类
    let bpmnTree = treeBuilder.constructTree(); // 构建树状数据结构
    let visited: any = new Map(); // 用于防止重复访问
    treeBuilder.calculateVirtualWidth(bpmnTree); // 计算虚拟宽度
    treeBuilder.traverseTreeBFS(bpmnTree, node => {
      node?.offset && node.x != node.offset.x && visited.set(node.id, node);
    });
    treeBuilder.formatCanvas(Array.from(visited.values()), modeling, elementRegistry);
  }
  function handleCommandStackCanExecute(e, modeling) {
    if (e.command == 'elements.delete') {
      e.defaultPrevented = true;
      const elements = e.context.elements;
      const hasStartElement = elements.some(o => o.type == bpmnStart);
      hasStartElement && createMessage.warning('流程发起节点不能删除');
      elements.some(o => o.wnType == typeGateway) && createMessage.warning('流程网关节点不能删除');
      const newElements = elements.filter(o => {
        if (props.type === 1) return o.type != bpmnStart && o.type != bpmnLabel && o.type != bpmnSequenceFlow && o.wnType != typeGateway;
        return o.type != bpmnStart;
      });
      if (props.type === 1) {
        if (newElements?.length === 1) {
          let element = newElements[0];
          let incoming = element.incoming;
          let outgoing = element.outgoing;
          let source = element.incoming[0].source;
          let target = element.outgoing[0].target;
          if (element.type === bpmnTask) {
            if (source.type === bpmnStart && target.type === bpmnEnd) {
              createMessage.warning('请确保至少包含一个任务节点');
              return false;
            }
            if (incoming[0]?.source?.wnType === typeGateway && outgoing[0]?.target?.wnType === typeGateway) {
              createMessage.warning('由于存在分支，无法删除该元素');
              return false;
            }
            if (source.wnType === typeConfluence && target.wnType === typeGateway) {
              createMessage.warning('无法删除该节点，前后节点不能同时存在分支');
              return false;
            }
            if (incoming[0]?.source?.wnType === typeGateway && outgoing[0]?.target?.wnType === typeConfluence) {
              let sourceElement = incoming[0]?.source;
              let length = sourceElement?.outgoing?.length || 0;
              if (length >= 2) modeling.removeConnection(incoming[0]);
              if (length <= 2) handleDeleteGateway(sourceElement, element, 'gateway');
              modeling.removeElements(newElements);
            } else {
              modeling.removeElements(newElements);
              handleDeleteGateway(source, target, 'task');
            }
          }
        }
        onAutoPosition();
        return;
      } else {
        elements.map((element: any) => {
          let source = element.incoming[0]?.source;
          let target = element.outgoing[0]?.target;
          if (source?.type === bpmnStart && target?.type === bpmnEnd) {
            modeling.removeConnection(element.outgoing[0]);
            modeling.removeConnection(element.incoming[0]);
            modeling.removeElements(newElements);
            return false;
          }
        });
      }
      nextTick(() => {
        modeling.removeElements(newElements);
      });
    }
    if (e.command == 'shape.delete') {
      let element = e.context.shape;
      let source = element.incoming[0]?.source;
      let target = element.outgoing[0]?.target;
      if (source?.type === bpmnStart && target?.type === bpmnEnd) {
        modeling.removeConnection(element.outgoing[0]);
        modeling.removeConnection(element.incoming[0]);
        modeling.removeShape(element);
        return;
      }
      nextTick(() => {
        modeling.removeShape(element);
      });
    }
  }
  function handleCommandMovePostExecuted(e, modeling) {
    let elementRegistry: any = state.bpmn.get('elementRegistry');
    if (e.command === 'elements.move' && props.type === 1) {
      let allConnections = e.context.closure.allConnections;
      allConnections &&
        Object.values(allConnections).map((connection: any) => {
          if (connection.label) {
            // 只适应简流
            let newConnect = elementRegistry.get(connection.id);
            modeling.moveElements([connection.label], {
              x: 0,
              y: newConnect.source.y + newConnect.source.height + 40 - newConnect.label.y,
            });
          }
        });
    }
  }
  function handleCommandReconnectPostExecuted(e: any, modeling: any) {
    if (props.type === 1 && e?.context?.connection && e?.context?.newSource) {
      let connection = e.context.connection;
      let newSource = e.context.newSource;
      connection.label &&
        modeling.moveElements([connection.label], {
          x: newSource.x + newSource.width / 2 - 14 - connection.labels[0].x,
          y: newSource.y + newSource.height + 40 - connection.labels[0].y,
        });
    }
    if (e.command === 'connection.reconnect' && e.context?.newSource?.id === e.context?.newTarget?.id) {
      modeling.removeConnection(e.context.connection);
    }
  }
  function getRealXml(xml) {
    return new XMLSerializer().serializeToString(NodeUtils.autoDelGateWay(xml, props.type));
  }
  /**
   * 获取wnType 新建时取element中的wnType,编辑时取数据中的wnType
   * @param element  节点
   */
  function getWnType(element) {
    const type = state.futureData.getValue(element.id, 'type');
    return element.wnType ? element.wnType : type ? type : conversionWnType[element.type];
  }
  function getElement() {
    return state.element;
  }
  function getBpmn() {
    return state.bpmn;
  }
  function handleFlowState(modeling) {
    if (!props.isPreview) return;
    let connectList = state.bpmn
      .get('elementRegistry')
      .getAll()
      .filter((element: any) => is(element, 'bpmn:SequenceFlow') && element?.type != 'label');
    connectList.map((connect: any) => {
      let source = connect.source;
      let target = connect.target;
      if (nodeMap && nodeMap.has(source?.id) && nodeMap.has(target?.id)) {
        if (nodeMap.get(source.id)?.type === '0' && nodeMap.get(target.id)?.type === '0') {
          let waypoints: any = connect.waypoints || [];
          modeling.removeConnection(connect);
          let lineElement = modeling.connect(source, target);
          modeling?.updateProperties(lineElement, {});
          modeling.updateWaypoints(lineElement, waypoints);
        }
      }
    });
  }
  onMounted(() => {
    initBpmn();
  });
  onUnmounted(() => {
    state.bpmn?.destroy();
  });
</script>
<style lang="less">
  @import url('./style/index.less');
</style>
