<template>
  <section class="common-pane">
    <ScrollContainer class="config-content">
      <a-form :colon="false" layout="vertical" :model="formConf" class="config-form">
        <a-form-item label="执行数据接口">
          <select-interface
            :value="formConf.formId"
            :title="formConf.formName"
            :templateJson="formConf.templateJson"
            :fieldOptions="formFieldsOptions"
            :sourceType="3"
            :allowClear="false"
            @change="onFormIdChange"
            @fieldChange="onRelationFieldChange" />
        </a-form-item>
      </a-form>
    </ScrollContainer>
  </section>
</template>
<script lang="ts" setup>
  import { ScrollContainer } from '@/components/Container';
  import { SelectInterface } from '@/components/Interface';

  defineOptions({ name: 'dataInterfaceNode', inheritAttrs: false });
  const props = defineProps(['formConf', 'integrateType', 'formFieldsOptions', 'getFormFieldList']);

  function onFormIdChange(id, item) {
    if (id && props.formConf.formId === id) return;
    if (!id) return handleNull();
    if (props.formConf.formId === id) return;
    props.formConf.formName = item.fullName;
    props.formConf.formId = id;
    props.formConf.templateJson = (item.templateJson || []).map(o => ({ ...o, sourceType: 1, relationField: '' }));
  }
  function handleNull() {
    props.formConf.formName = '';
    props.formConf.formId = '';
    props.formConf.templateJson = [];
  }
  function onRelationFieldChange(val, row) {
    if (!val) return;
    let list = props.formFieldsOptions.filter(o => o.id === val);
    if (!list.length) return;
    let item = list[0];
    row.isSubTable = item.__config__ && item.__config__.isSubTable ? item.__config__.isSubTable : false;
  }
</script>
