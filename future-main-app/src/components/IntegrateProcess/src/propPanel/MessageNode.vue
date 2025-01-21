<template>
  <section class="common-pane">
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form">
        <a-form-item label="接收人">
          <future-users-select v-model:value="formConf.msgUserIds" placeholder="请选择" multiple />
        </a-form-item>
        <a-form-item label="通知内容">
          <div class="ant-form-item-label"><label class="ant-form-item-no-colon">发送配置</label></div>
          <msg-modal :value="formConf.msgId" :title="formConf.msgName" messageSource="3" @change="(val, data) => onMsgChange(val, data)" />
          <div class="ant-form-item-label mt-12px"><label class="ant-form-item-no-colon">参数设置</label></div>
          <a-table :data-source="formConf.templateJson" :columns="msgTemplateJsonColumns" size="small" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'msgTemplateName'">
                <p class="link-text" @click="goMsgDetail(record.templateId)">{{ record.msgTemplateName }}</p>
              </template>
              <template v-if="column.key === 'paramJson'">
                <div class="parameter-box" :title="item.field + '(' + item.fieldName + ')'" v-for="(item, index) in record.paramJson" :key="index">
                  {{ item.field }}({{ item.fieldName }})
                </div>
              </template>
              <template v-if="column.key === 'field'">
                <future-select
                  v-model:value="item.relationField"
                  placeholder="请选择"
                  :options="formFieldsOptions"
                  allowClear
                  showSearch
                  :fieldNames="{ label: 'label', options: 'options1' }"
                  optionLabelProp="label"
                  class="!w-170px"
                  :class="{ '!mt-8px': index > 0 }"
                  @change="onRelationFieldChange($event, item)"
                  v-for="(item, index) in record.paramJson"
                  :key="index" />
              </template>
            </template>
            <template #emptyText>
              <p class="leading-60px">暂无数据</p>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </ScrollContainer>
    <MsgTemplateDetail @register="registerDetail" />
  </section>
</template>
<script lang="ts" setup>
  import { ScrollContainer } from '@/components/Container';
  import { useModal } from '@/components/Modal';
  import MsgModal from '@/components/FlowProcess/src/propPanel/components/MsgModal.vue';
  import MsgTemplateDetail from '@/components/FlowProcess/src/propPanel/components/MsgTemplateDetail.vue';

  defineOptions({ name: 'messageNode', inheritAttrs: false });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'getFormFieldList']);
  const [registerDetail, { openModal: openDetailModal }] = useModal();
  const msgTemplateJsonColumns = [
    { width: 50, title: '序号', align: 'center', customRender: ({ index }) => index + 1 },
    { title: '模板名称', dataIndex: 'msgTemplateName', key: 'msgTemplateName', width: 140 },
    { title: '参数名称', dataIndex: 'paramJson', key: 'paramJson' },
    { title: '参数值', dataIndex: 'field', key: 'field', width: 190 },
  ];

  function onMsgChange(val, row) {
    if (!val) {
      props.formConf.msgId = '';
      props.formConf.msgName = '';
      props.formConf.templateJson = [];
      return;
    }
    if (props.formConf.msgId === val) return;
    props.formConf.msgId = val;
    props.formConf.msgName = row.fullName;
    props.formConf.templateJson = row.templateJson || [];
  }
  function onRelationFieldChange(val, row) {
    if (!val) return;
    let list = props.formFieldsOptions.filter(o => o.id === val);
    if (!list.length) return;
    let item = list[0];
    row.isSubTable = item.__config__ && item.__config__.isSubTable ? item.__config__.isSubTable : false;
  }
  function goMsgDetail(id) {
    openDetailModal(true, { id });
  }
</script>
