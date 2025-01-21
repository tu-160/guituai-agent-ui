<template>
  <div :class="`${prefixCls}`" v-loading="loading">
    <process-main ref="bpmnContainer" v-bind="getBindValue" @addVersion="handleAddVersion" />
    <div class="right-container">
      <PropPanel v-bind="getBindValue" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed, unref, ref, provide } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { validate } from './bpmn/utils/bpmnlint';
  import { NodeUtils } from './bpmn/utils/nodeUtil';
  import ProcessMain from './Main.vue';
  import PropPanel from './propPanel/index.vue';

  interface State {
    loading: boolean;
    flowList: any[];
    activeConf: any;
    defaultData: any;
    formFieldList: any;
    errorList: any[];
  }
  provide('bpmn', () => unref(getBpmn));
  defineExpose({ getData, handleSelectNode });
  const emit = defineEmits(['addVersion']);
  const props = defineProps(['flowInfo', 'flowState', 'versionList', 'type' /* 0：bpmn 1：自研*/]);
  const { prefixCls } = useDesign('basic-process');
  const bpmnContainer: any = ref(null);
  const state = reactive<State>({
    loading: false,
    flowList: [],
    activeConf: {},
    defaultData: {},
    formFieldList: [],
    errorList: [],
  });
  const { loading } = toRefs(state);
  const getBpmn = computed(() => unref(bpmnContainer)?.getBpmn());
  const getElement = computed(() => unref(bpmnContainer)?.getElement());
  const getBindValue = computed(() => ({ ...props, element: unref(getElement), bpmn: unref(getBpmn) }));
  async function getData() {
    handleVerificationConnect(); // 校验所有的连线是否存在bpmn2:conditionExpression 标签
    return new Promise(resolve => {
      state.errorList = [];
      let root = unref(getBpmn).get('canvas').getRootElement();
      let registry = unref(getBpmn).get('elementRegistry');
      // 对元素的校验
      const res = validate(registry, root);
      if (res) {
        const element = res.element;
        // 没有节点
        if (!element) setErrorList(res.message);
        // 节点验证
        if (element?.length) element.map((item: any) => setErrorList(item.error));
      }
      // 流程自定义校验
      let saveXMLPromise = unref(getBpmn).saveXML({ format: true });
      saveXMLPromise.then((data: any) => {
        if (data) {
          let futureData = unref(getBpmn).get('futureData');
          let node: any = {};
          let allElement: any[] = unref(getBpmn)
            .get('elementRegistry')
            .filter((o: any) => o.type != 'bpmn:Process')
            .map((o: any) => o.id);
          Object.keys(futureData.data).map(key => {
            const item = futureData.data[key];
            //全局属性规则验证
            if (key === 'global') {
              if (item.errorRule == 2 && !item.errorRuleUser.length) setErrorList('请选择异常处理人', 'global', '全局属性');
              if (item.fileConfig.on && !item.fileConfig.templateId) setErrorList('请选择归档模板', 'global', '全局属性');
              node[key] = item;
            }
            if (allElement.includes(key)) {
              const title = item.nodeName + key;
              if (item.type == 'start') {
                if (!item.formId) setErrorList('请选择流程表单', key, title);
              } else if (item.type == 'approver') {
                if (!item.nodeName) setErrorList('请输入节点名称', key, title);
                if (item.assigneeType == 6 && !item.approvers.length) setErrorList('请设置审批人', key, title);
                if (item.assigneeType == 4 && !item.formField) setErrorList('请选择表单字段', key, title);
                if (item.assigneeType == 5 && !item.approverNodeId) setErrorList('请选择节点', key, title);
                if (item.assigneeType == 9 && !item.interfaceConfig.interfaceId) setErrorList('请选择接口模板', key, title);
                if (item.hasAutoApprover) {
                  if (!item.autoAuditRule.conditions.length) setErrorList('请选择同意规则配置', key, title);
                  if (!item.autoRejectRule.conditions.length) setErrorList('请选择拒绝规则配置', key, title);
                }
              } else if (item.type == 'subFlow') {
                if (!item.nodeName) setErrorList('请输入子流程名称', key, title);
                if (!item.approvers?.length) setErrorList('请设置发起人', key, title);
                if (!item.flowId) setErrorList('请选择子流程表单', key, title);
              } else if (item.type == 'connect') {
                if (item.conditions?.length) {
                  outer: for (let i = 0; i < item.conditions.length; i++) {
                    const e = item.conditions[i];
                    for (let j = 0; j < e.groups.length; j++) {
                      const child = e.groups[j];
                      if (!child.field || !child.symbol) {
                        setErrorList('请完善条件组数据', key, title);
                        break outer;
                      }
                    }
                  }
                }
              }
              node[key] = item;
            }
          });
          let query = {};
          if (props.type === 1) node = handleGatewayTypeSetted(node);
          const flowXml = props.type != 1 ? handleAutoCreateGateWay(data, futureData) : encodeURIComponent(data.xml);
          if (!state.errorList?.length) query = { flowXml, flowNodes: node };
          resolve({ errorList: convertArrayToTree(state.errorList), data: query });
        }
      });
    });
  }
  /**
   * 设置验证的数组errorList
   * @param errorMessage 异常消息
   * @param elementId 节点
   * @param title 节点名称+节点id
   */
  function setErrorList(errorMessage, elementId = '', title = '流程建模') {
    state.errorList.push({ errorMessage, elementId, title });
  }
  /**
   * 将errorList转成树
   * @param list  errorList
   */
  function convertArrayToTree(list) {
    let newList: any[] = [];
    list.map(item => {
      const index = newList.findIndex(o => o.elementId === item.elementId);
      if (index !== -1) {
        newList[index].children.push({ errorMessage: item.errorMessage });
      } else {
        newList.push({ title: item.title, elementId: item.elementId, children: [{ errorMessage: item.errorMessage }] });
      }
    });
    return newList;
  }
  /**
   * 选中节点
   * @param elementId 节点id
   */
  function handleSelectNode(elementId) {
    const elementRegistry: any = unref(getBpmn).get('elementRegistry');
    const selection: any = unref(getBpmn).get('selection');
    let element = elementRegistry.get(elementId);
    selection.select(element);
  }
  /**
   * 自动生成网关
   * @param data 节点id
   */
  function handleAutoCreateGateWay(data: any, futureData: any) {
    let elementRegistry = unref(getBpmn).get('elementRegistry');
    return NodeUtils.autoCreateGateWay(data.xml, elementRegistry, futureData);
  }
  /**
   * 校验连线
   * @param xml
   */
  function handleVerificationConnect() {
    let bpmn = unref(getBpmn);
    return NodeUtils.verificationConnect(bpmn);
  }
  function handleGatewayTypeSetted(node: any) {
    return NodeUtils.gatewayTypeSetted(unref(getBpmn), node);
  }
  function handleAddVersion() {
    emit('addVersion');
  }
</script>
