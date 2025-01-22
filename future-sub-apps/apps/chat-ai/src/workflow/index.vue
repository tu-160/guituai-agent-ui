<script setup lang="ts">
import { nextTick, onMounted, provide, reactive, ref, toRefs, h } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRoute } from 'vue-router';

import { G0003, G0004 } from '@/api/modules/a4';
import router from '@/router';
import { type IDialog, useDialogAsideStore } from '@/store/modules/useDialogAsideStore';
import LogicFlow, { EventType } from '@logicflow/core';
import { Control } from '@logicflow/extension';
import { getTeleport } from '@logicflow/vue-node-registry';
import {message, Modal} from 'ant-design-vue';

import registerBezierEdge from './common/edge';
import NodeDrawer from './common/node-drawer.vue';
import Nodepanel from './common/node-panel.vue';
import registerAllNode, { getAllNodesPropertyDataDefault, getAllNodesPropertyView } from './nodes/index';
import { notConnectMessage } from './nodes/internal/node-registry';
import '@logicflow/core/es/index.css';
import '@logicflow/extension/es/index.css';
import embedModal from '@/components/embed-modal/index.vue';
import debugModal from './debug/index.vue';

import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

const route = useRoute();
const routeParams = route.query;

interface IComponent {
  downstream: string[]; // 下游的component_name
  obj: any;
  upstream: string[]; // 上游的component_name
}

interface IDsl {
  answer: any[];
  components: {
    [key: string]: IComponent;
  };
  graph: {
    edges: any[];
    nodes: any[];
  };
  history: any[];
  messages: any[];
  path: any[];
  reference: any[];
}

interface IFlowData {
  id?: string;
  title: string;
  dsl: IDsl;
}
// const WorkflowKeys = {
//   'template-node': 'Template',
//   'concentrator-node': 'Concentrator',
//   'switch-node': 'Switch',
//   'keyword-node': 'KeywordExtract',
//   'rewrite-node': 'RewriteQuestion',
//   'relevant-node': 'Relevant',
//   'message-node': 'Message',
//   'categorize-node': 'Categorize',
//   'answer-node': 'Answer',
//   'generate-node': 'Generate',
//   'start-node': 'begin',
// };
const containerRef = ref<HTMLDivElement>();
const mainDomRef = ref<HTMLDivElement>();
const TeleportContainer = getTeleport();
const nodePropertyView = {} as any;

const embedModalRef = ref();
const debugModalRef = ref();

function callOpenEmbedModal() {
  embedModalRef.value.showModal();
}

const callDebugModal = (data: any): void => {
  debugModalRef.value.setDebugInitParam(data);
  debugModalRef.value.showDrawer();
}


// 获取所有节点的属性弹窗
Object.assign(nodePropertyView, getAllNodesPropertyView());

// 流程编排
function useBizFlow() {
  const modelRt = reactive({
    flowId: '999',
    lf: {} as InstanceType<typeof LogicFlow>,
    currentNodeInfo: {} as any,
    currentId: '',
    currentbizComponentInfo: {} as IComponent['obj'],
    openDrawer: false,
    flowData: {
      id: '',
      title: '',
      dsl: {
        answer: [],
        components: {},
        graph: {
          edges: [],
          nodes: [],
        },
        history: [],
        messages: [],
        path: [],
        reference: [],
      },
    } as IFlowData,
  });
  // type WorkflowKeyType = keyof typeof WorkflowKeys;

  // 获取节点业务数据KEY
  const getBizComponentKey = (nodeInfo: any) => {

    // return `${nodeInfo.type}:${nodeInfo.id}`;
    // const type = nodeInfo.type as WorkflowKeyType;
    // const key = WorkflowKeys[type] || nodeInfo.type;
    const key = nodeInfo.type;
    if(key==="begin") {
      return key;
    }
    return `${key}:${nodeInfo.id}`;
  };

  const createBizComponentInfo = (nodeInfo: any) => {

    const key = getBizComponentKey(nodeInfo);
    if (!modelRt.flowData.dsl.components[key]) {
      modelRt.flowData.dsl.components[key] = {
        downstream: [],
        upstream: [],
        obj: getAllNodesPropertyDataDefault(nodeInfo.type),
      };
    }
    return modelRt.flowData.dsl.components[key];
  };

  // 获取业务数据
  const getBizComponents = (nodesInfo: any) => {
    const key = getBizComponentKey(nodesInfo);
    return modelRt.flowData.dsl.components[key];
  };

  /**
   * 更新节点中的顺序关系信息
   * @param edgeInfo
   */
  const updateComponentRelations = (lf: LogicFlow, edgeInfo: any) => {
    const graphData: any = lf.getGraphData();
    let sourceFlowNodeInfo: any = null;
    let sourceBizNodeInfo: any = null;
    let targetFlowNodeInfo: any = null;
    let targetBizNodeInfo: any = null;
    graphData.nodes.forEach((i: any) => {
      if (i.id === edgeInfo.sourceNodeId) {
        sourceFlowNodeInfo = i;
        sourceBizNodeInfo = getBizComponents(i);
      }
      if (i.id === edgeInfo.targetNodeId) {
        targetFlowNodeInfo = i;
        targetBizNodeInfo = getBizComponents(i);
      }
      //     lf.setProperties(data.sourceNodeId, {
      //       frontend_status: '1', //0配置错误，1配置正常
      //     });
    });

    if (sourceBizNodeInfo && targetBizNodeInfo) {
      sourceBizNodeInfo.downstream = sourceBizNodeInfo.downstream ?? [];
      targetBizNodeInfo.upstream = targetBizNodeInfo.upstream ?? [];

      sourceBizNodeInfo.downstream.push(getBizComponentKey(targetFlowNodeInfo));
      targetBizNodeInfo.upstream.push(getBizComponentKey(sourceFlowNodeInfo));
    }
  };

  const deleteComponentRelation = (lf: LogicFlow, data: any) => {

    const graphData: any = lf.getGraphData();
    let sourceFlowNodeInfo: any = null;
    let sourceBizNodeInfo: any = null;
    let targetFlowNodeInfo: any = null;
    let targetBizNodeInfo: any = null;
    graphData.nodes.forEach((i: any) => {
      if (i.id === data.sourceNodeId) {
        sourceFlowNodeInfo = i;
        sourceBizNodeInfo = getBizComponents(i);
      }
      if (i.id === data.targetNodeId) {
        targetFlowNodeInfo = i;
        targetBizNodeInfo = getBizComponents(i);
      }
    });

    let targetNode = getBizComponentKey(targetFlowNodeInfo);
    let sourceNode = getBizComponentKey(sourceFlowNodeInfo);
    let index = sourceBizNodeInfo.downstream.indexOf(targetNode);
    if (index > -1) { // 从源节点上移除与目标节点的关系
      sourceBizNodeInfo.downstream.splice(index, 1);
    }
    index = targetBizNodeInfo.upstream.indexOf(sourceNode);
    if (index > -1) { // 从目标节点上移除与源节点的关系
      targetBizNodeInfo.upstream.splice(index, 1);
    }
  }

  const createLF = () => {

    LogicFlow.use(Control);
    // 创建流程编排实例
    const lf = new LogicFlow({
      textEdit: false,
      adjustEdge: false,
      adjustEdgeStartAndEnd: false,
      background: {
        backgroundColor: '#f5f6f7',
      },
      grid: {
        size: 10,
        type: 'dot',
        config: {
          color: '#DEE0E3',
          thickness: 1,
        },
      },
      keyboard: {
        enabled: true,
      },
      isSilentMode: false,
      container: containerRef.value as HTMLElement,
      // width: elementWidth,
      height: mainDomRef.value?.clientHeight,
    });

    // 设置主题
    lf.setTheme({
      bezier: {
        stroke: '#afafaf',
        strokeWidth: 1,
      },
      arrow: {
        offset: 4, // 箭头垂线长度
        verticalLength: 2, // 箭头底线长度
      },
    });

    // 注册边和节点
    registerBezierEdge(lf);
    registerAllNode(lf);

    // 获取所有节点的属性弹窗
    Object.assign(nodePropertyView, getAllNodesPropertyView());

    // 注册事件
    lf.on(EventType.GRAPH_RENDERED, ({ graphModel }: { graphModel: any }) => {
      modelRt.flowId = graphModel.flowId!;
    });

    // 节点点击事件及添加事件
    lf.on(`${EventType.NODE_DND_ADD},${EventType.NODE_CLICK}`, ({ data }: any) => {

      const key = getBizComponentKey(data);
      if (!modelRt.flowData.dsl.components[key]) {
        createBizComponentInfo(data);
      }
    });
    // 节点删除事件
    lf.on(EventType.NODE_DELETE, ({ data }) => {
      const key = getBizComponentKey(data);
      if (modelRt.flowData.dsl.components.hasOwnProperty(key)) {
        delete modelRt.flowData.dsl.components[key]
      }

      console.log('EDGE_DELETE', data);
    });

    // 节点点击事件
    lf.on(EventType.NODE_CLICK, ({ data }: any) => {

      modelRt.currentNodeInfo = data;
      modelRt.currentId = getBizComponentKey(data);
      const bizInfo = modelRt.flowData.dsl.components[modelRt.currentId]?.obj;
      console.log('bizInfo', bizInfo);
      if (bizInfo) modelRt.currentbizComponentInfo = bizInfo;
      modelRt.openDrawer = true;
    });

    // 线添加事件
    lf.on(EventType.EDGE_ADD, ({ data }) => {
      updateComponentRelations(lf, data);
      console.log('EDGE_ADD', data);
    });

    // 线删除事件
    lf.on(EventType.EDGE_DELETE, ({ data }) => {

      deleteComponentRelation(lf, data);

      console.log('EDGE_DELETE', data);
    });

    // 错误反馈事件
    lf.on(EventType.CONNECTION_NOT_ALLOWED, (data) => {
      if (data.msg) {
        // message.error(data.msg);
        Modal.warning({
          title: t('message.hint'),
          content: h('div', {}, [
            h('p', notConnectMessage),
          ]),
        });
      }
    });

    const initflowJson = {
      nodes: [
        {
          id: '',
          type: 'begin',
          x: (mainDomRef.value?.clientHeight || 0) / 2,
          y: (mainDomRef.value?.clientWidth || 0) / 3,
          properties: {
            variables: [],
            desc: '',
          },
        },
      ],
    };

    const initDsl = (nodes: any[]) => {

      for (const node of nodes) {
        createBizComponentInfo(node);
      }
    };
    const initNodes = async () => {

      if (routeParams.id) {

        const testParams = {
          canvas_id: routeParams.id,
        };
        if (Object.keys(routeParams).length > 0) {

          const res = await G0003(testParams);
          modelRt.flowData = { ...res.data };
          const nodes = res?.data?.dsl?.graph?.nodes;
          initDsl(nodes);
          lf.render(res?.data?.dsl?.graph);
        }
      } else {

        initDsl(initflowJson.nodes);
        lf.render(initflowJson);
        if (routeParams.title) {
          modelRt.flowData.title = routeParams.title as string;
        }
      }
    };

    initNodes();
    // 渲染节点，若是新建的节点默认一个开始节点
    modelRt.lf = lf;
  };

  const getLFData = () => {
    const data = modelRt.lf.getGraphData() as any;
    modelRt.flowData.dsl.graph = data;
    return data;
  };

  const fetchSave = async () => {
    debugger
    const parmas = modelRt.flowData;
    parmas.dsl.graph = getLFData();
    if (parmas.id === null || parmas.id === '') {
      delete parmas.id;
    }
    // 提取业务组件的KEY 放到path 中
    // if (parmas.dsl.components) {
    //   parmas.dsl.path = Object.keys(parmas.dsl.components).map((key) => {
    //     return [key];
    //   });
    // }
    await G0004(parmas).then((res) => {
      modelRt.flowData = { ...res.data };
      message.success(t('flow.saved'));
    });
  };

  const init = async () => {
    await nextTick();
    createLF();
  };

  onMounted(init);
  return { modelRt, getLFData, fetchSave, createBizComponentInfo };
}

const { modelRt, getLFData, fetchSave } = useBizFlow();
const { lf, currentNodeInfo } = toRefs(modelRt);

// provide只会执行一次，所以要保证提供的根对象的引用不会改变
provide('logicFlowInstance', lf);
provide('currentNodeInfo', currentNodeInfo);
const toPage = (name?: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
  if (!name) return;
  router.push({ name, params: params || {}, query: query || {} });
};

const dialogAsideStore = useDialogAsideStore();
const getRun = () => {
  if (modelRt.flowData.id === null || modelRt.flowData.id === '') {
    return message.error(t('flow.noSaved'));
  }
  const dialog: IDialog = {
    id: '',
    name: '',
    icon: '',
    avatar: '',
    description: '',
  };
  dialog.url = 'Chat';
  dialog.id = modelRt.flowData.id as string;
  dialog.name = modelRt.flowData.title as string;
  dialogAsideStore.setCurrentDialog(dialog);
  console.log('dialog', dialogAsideStore.currentDialog?.id);
  toPage(dialog.url, { id: dialog.id });
};
</script>

<template>
  <div ref="mainDomRef" class="workflow-container h-[calc(100vh-64px)] w-full">
    <div class="workflow-toolbar">
      <a-button @click="getRun">{{t('flow.run')}}</a-button>
      <a-button @click="callDebugModal(modelRt.flowData)">{{t('flow.debug')}}</a-button>
      <debugModal ref="debugModalRef"></debugModal>
      <a-button type="primary" @click="fetchSave">{{t('flow.save')}}</a-button>
      <a-button @click="callOpenEmbedModal">{{t('chat.embedModalTitle')}}</a-button>
      <embedModal ref="embedModalRef"></embedModal>
      <a-button danger @click="toPage('Flow')">{{t('flow.close')}}</a-button>
      <a-button v-if="false" type="primary" @click="getLFData">ID</a-button>
    </div>
    <div class="relative flex h-full w-full">
      <div class="panel-container">
        <Nodepanel :lf="modelRt.lf" class="ml-auto" />
      </div>
      <div id="graph" ref="containerRef" class="viewport"></div>
    </div>
    <NodeDrawer v-slot="{ close }" v-model:open="modelRt.openDrawer" :lf="modelRt.lf">
      <template v-if="modelRt.currentNodeInfo.type">
        <component :is="nodePropertyView[modelRt.currentNodeInfo.type]" v-model:data="modelRt.currentbizComponentInfo" :close="close" :lf="modelRt.lf" />
      </template>
    </NodeDrawer>
    <TeleportContainer :flow-id="modelRt.flowId" />
  </div>
</template>

<style lang="scss">
.workflow-container {
  @apply bg-[#f5f6f7];
}

.workflow-toolbar {
  @apply flex h-10 w-full items-center justify-end gap-2 px-6;
}

.custom-vue-node-content {
  @apply flex h-full w-full items-center justify-center;
}

.viewport {
  @apply h-0 w-full flex-1;
}

.panel-container {
  @apply z-10 h-full w-[220px] bg-[#f5f6f7] py-8;
}
</style>
