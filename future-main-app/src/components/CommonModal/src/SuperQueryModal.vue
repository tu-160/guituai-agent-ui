<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.superQuery')"
    :okText="t('common.queryText')"
    @ok="handleSubmit"
    destroyOnClose
    class="future-super-query-modal future-condition-modal">
    <template #insertFooter>
      <a-space :size="10" class="float-left">
        <a-button @click="addPlan">保存方案</a-button>
        <a-popover placement="bottom" trigger="click" overlayClassName="plan-popover" v-model:open="popoverVisible">
          <a-button>方案选择<DownOutlined /></a-button>
          <template #content>
            <div class="plan-list" v-if="planList.length">
              <div class="plan-list-item" v-for="(item, i) in planList" :key="i" @click="selectPlan(item)">
                <p class="plan-list-name">{{ item.fullName }} </p>
                <i class="icon-ym icon-ym-nav-close" @click.stop="delPlan(item.id, i)"></i>
              </div>
            </div>
            <div class="noData-txt" v-else>暂无数据</div>
          </template>
        </a-popover>
      </a-space>
    </template>
    <ConditionMain ref="conditionMainRef" isSuperQuery class="super-query-main" />
    <BasicModal v-bind="$attrs" @register="registerFormModal" title="保存方案" @ok="handleFormSubmit">
      <BasicForm @register="registerForm" />
    </BasicModal>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed, unref, nextTick, ref } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { getAdvancedQueryList, delAdvancedQuery, create, update } from '@/api/system/advancedQuery';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { useRoute } from 'vue-router';
  import ConditionMain from '@/components/ColumnDesign/src/components/ConditionMain.vue';

  interface State {
    planList: any[];
    conditionList: any[];
    popoverVisible: boolean;
    fieldOptions: any[];
    matchLogic: string;
  }
  const emit = defineEmits(['register', 'superQuery']);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  const [registerFormModal, { openModal: openFormModal, closeModal: closeFormModal, setModalProps: setFormModalProps }] = useModal();
  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: [
      {
        field: 'fullName',
        label: '方案名称',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
    ],
  });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const route = useRoute();
  const conditionMainRef = ref();

  const state = reactive<State>({
    planList: [],
    conditionList: [
      { logic: 'and', groups: [{ field: '', symbol: '', futureKey: '', fieldValueType: 2, fieldValue: undefined, fieldValueFutureKey: '', cellKey: +new Date() }] },
    ],
    popoverVisible: false,
    fieldOptions: [],
    matchLogic: 'and',
  });
  const { planList, popoverVisible } = toRefs(state);

  const getCurrMenuId = computed(() => (route.meta.modelId as string) || '');

  function init(data) {
    state.popoverVisible = false;
    changeLoading(true);
    state.fieldOptions = cloneDeep(data.columnOptions);
    conditionMainRef.value?.init({ conditionList: state.conditionList, matchLogic: state.matchLogic, fieldOptions: state.fieldOptions });
    getPlanList();
  }
  function getPlanList() {
    if (!unref(getCurrMenuId)) return changeLoading(false);
    getAdvancedQueryList(unref(getCurrMenuId)).then(res => {
      state.planList = res.data.list;
      changeLoading(false);
    });
  }
  function addPlan() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return;
    state.conditionList = values.conditionList || [];
    state.matchLogic = values.matchLogic;
    if (!state.conditionList.length) return createMessage.error('请添加条件');
    openFormModal();
    nextTick(() => {
      resetFields();
    });
  }
  function delPlan(id, i) {
    delAdvancedQuery(id).then(res => {
      createMessage.success(res.msg);
      state.planList.splice(i, 1);
    });
  }
  function selectPlan(item) {
    state.matchLogic = item.matchLogic;
    state.conditionList = item.conditionJson ? JSON.parse(item.conditionJson) : [];
    conditionMainRef.value?.updateConditionList({ conditionList: state.conditionList, matchLogic: state.matchLogic });
    state.popoverVisible = false;
  }
  async function handleFormSubmit() {
    const values = await validate();
    if (!values) return;
    const fullName = values.fullName;
    const boo = state.planList.some(o => o.fullName === fullName);
    if (!boo) return savePlan(fullName);
    const list = state.planList.filter(o => o.fullName === fullName);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `${list[0].fullName}已存在, 是否覆盖方案?`,
      onOk: () => {
        savePlan(fullName, list[0].id);
      },
    });
  }
  function savePlan(fullName, id = '') {
    setFormModalProps({ confirmLoading: true });
    const query = {
      id,
      fullName,
      moduleId: unref(getCurrMenuId),
      matchLogic: state.matchLogic,
      conditionJson: JSON.stringify(state.conditionList),
    };
    const formMethod = query.id ? update : create;
    formMethod(query)
      .then(res => {
        closeFormModal();
        setFormModalProps({ confirmLoading: false });
        createMessage.success(res.msg);
        getPlanList();
      })
      .catch(() => {
        setFormModalProps({ confirmLoading: false });
      });
  }
  function handleSubmit() {
    const values = conditionMainRef.value?.confirm();
    if (!values) return;
    state.conditionList = values.conditionList || [];
    state.matchLogic = values.matchLogic;
    const query = {
      matchLogic: state.matchLogic,
      conditionList: state.conditionList,
    };
    let str = JSON.stringify(query);
    if (!state.conditionList.length) str = '';
    emit('superQuery', str);
    closeModal();
  }
</script>
