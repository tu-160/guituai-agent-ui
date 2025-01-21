<template>
  <HeaderContainer :formConf="formConf" />
  <a-form :colon="false" :model="formConf" class="config-content" layout="vertical">
    <a-form-item label="实例标题">
      <future-radio v-model:value="formConf.titleType" :options="titleTypeOptions" />
      <future-input class="!mt-12px" v-model:value="formConf.defaultContent" readonly v-if="formConf.titleType == 0" />
      <a-auto-complete
        class="!mt-12px"
        v-model:value="formConf.titleContent"
        :options="titleContentOptions"
        placeholder="请输入"
        allowClear
        @select="handleSelect"
        v-else />
    </a-form-item>
    <a-form-item label="流程设置">
      <a-checkbox v-model:checked="formConf.hasSign">启用签名</a-checkbox>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasRevoke">允许撤销</a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasComment" @change="onHasCommentChange">允许评论</a-checkbox>
      </div>
      <div class="mt-10px" v-if="formConf.hasComment">
        <a-checkbox v-model:checked="formConf.hasCommentDeletedTips">显示评论已被删除提示</a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasSignFor">审批任务是否签收</a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasAloneConfigureForms" @change="onHasAloneConfigureFormsChange">允许审批节点独立配置表单</a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasContinueAfterReject">
          拒绝后允许流程继续流转审批<BasicHelp :text="['允许时：审批拒绝继续流转，直至流程结束，', '以最后节点的审批为流程的最终审批结果。']" />
        </a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.hasInitiatorPressOverdueNode">允许发起人对当前逾期节点进行催办</a-checkbox>
      </div>
    </a-form-item>
    <a-form-item label="审批人自动审批规则">
      <a-checkbox v-model:checked="formConf.autoSubmitConfig.adjacentNodeApproverRepeated">相邻节点审批人重复</a-checkbox>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.autoSubmitConfig.ApproverHasApproval">审批人审批过该流程</a-checkbox>
      </div>
      <div class="mt-10px">
        <a-checkbox v-model:checked="formConf.autoSubmitConfig.initiatorApproverRepeated">发起人与审批人重复</a-checkbox>
      </div>
    </a-form-item>
    <a-form-item label="流程撤回规则">
      <future-select v-model:value="formConf.recallRule" :options="recallRuleOptions" />
    </a-form-item>
    <a-form-item label="异常处理">
      <template #label>异常处理<BasicHelp text="子流程发起节点人员异常时遵循该规则" /></template>
      <future-select v-model:value="formConf.errorRule" :options="errorRuleOptions" @change="formConf.errorRuleUser = []" />
      <future-user-select v-model:value="formConf.errorRuleUser" buttonType="button" multiple class="mt-10px" v-if="formConf.errorRule === 2" />
    </a-form-item>
    <a-form-item label="流程归档">
      <a-checkbox class="leading-32px" v-model:checked="formConf.fileConfig.on">开启归档（流程审批结束后自动归档）</a-checkbox>
      <template v-if="formConf.fileConfig.on">
        <div class="mt-10px">
          <a-button @click="handleFile">归档设置</a-button>
        </div>
        <div class="file-info" v-if="formConf.fileConfig.templateId">
          <span> {{ getPermissionTitle }}</span>
          <i class="icon-ym icon-ym-delete" @click="handleRemove"></i>
        </div>
      </template>
    </a-form-item>
    <a-form-item label="全局变量">
      <a-button class="w-full" @click="handleOpenParameterModal">设置全局变量</a-button>
    </a-form-item>
  </a-form>
  <FileModal @register="registerModal" @confirm="onFileConfirm" />
  <ParameterModal @register="registerParameterModal" @confirm="onParameterConfirm" />
</template>
<script lang="ts" setup>
  import HeaderContainer from './components/HeaderContainer.vue';
  import FileModal from './components/FileModal.vue';
  import ParameterModal from './components/ParameterModal.vue';
  import { useModal } from '@/components/Modal';
  import { computed, reactive, watch } from 'vue';
  import { errorRuleOptions } from '../helper/define';

  interface State {
    temporaryContent: string;
  }

  const state = reactive<State>({
    temporaryContent: '',
  });
  const titleTypeOptions = [
    { id: 0, fullName: '默认' },
    { id: 1, fullName: '自定义' },
  ];
  const recallRuleOptions = [
    { fullName: '不允许撤回', id: 1 },
    { fullName: '发起节点允许撤回', id: 2 },
    { fullName: '所有节点允许撤回', id: 3 },
  ];
  const emit = defineEmits(['register', 'reload']);
  defineOptions({ inheritAttrs: false });
  const props = defineProps(['formConf', 'usedFormItems', 'updateFutureData', 'updateAllNodeFormOperates']);
  const [registerModal, { openModal: openFileModal }] = useModal();
  const [registerParameterModal, { openModal: openParameterModal }] = useModal();

  const titleContentOptions = computed(() => {
    const sysOptions = [
      { id: '@flowFullName', fullName: '流程名称' },
      { id: '@flowFullCode', fullName: '流程编码' },
      { id: '@launchUserName', fullName: '发起用户名' },
      { id: '@launchTime', fullName: '发起时间' },
    ];
    const fields = props.usedFormItems.filter(o => ['input', 'inputNumber', 'textarea'].includes(o.__config__.futureKey));
    const options = [...sysOptions, ...fields].map(o => ({ value: o.id, label: o.id + '(' + o.fullName + ')' }));
    return options;
  });
  const getPermissionTitle = computed(() => {
    const type = props.formConf.fileConfig.permissionType;
    return type == 2 ? '流程发起人可查看' : type == 3 ? '最后节点审批人可查看' : '当前流程所有人可查看';
  });

  watch(
    () => props.formConf,
    () => {
      props.updateFutureData(props.formConf);
    },
    { deep: true, immediate: true },
  );
  watch(
    () => props.formConf.titleContent,
    val => {
      state.temporaryContent = val;
    },
  );

  function handleSelect(value) {
    state.temporaryContent += '{' + value + '}';
    props.formConf.titleContent = state.temporaryContent;
  }
  function handleFile() {
    openFileModal(true, { fileConfig: props.formConf.fileConfig });
  }
  function onFileConfirm(data) {
    props.formConf.fileConfig = data || {};
  }
  function handleRemove() {
    props.formConf.fileConfig = {
      on: true,
      permissionType: 1,
      path: '',
      pathName: '',
      templateId: '',
    };
  }
  /**
   * 允许审批节点独立配置表单改变对审批节点表单清空
   */
  function onHasAloneConfigureFormsChange() {
    props.formConf.hasAloneConfigureForms == false && props.updateAllNodeFormOperates(true, true);
  }
  function onHasCommentChange() {
    if (props.formConf.hasComment == false) props.formConf.hasCommentDeletedTips = false;
  }
  function handleOpenParameterModal() {
    openParameterModal(true, { parameterList: props.formConf.globalParameterList || [] });
  }
  function onParameterConfirm(data) {
    props.formConf.globalParameterList = data || [];
  }
</script>
