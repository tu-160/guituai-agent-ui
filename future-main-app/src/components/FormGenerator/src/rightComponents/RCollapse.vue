<template>
  <a-form-item label="是否手风琴" v-if="showType === 'pc'">
    <a-switch v-model:checked="activeData.accordion" />
  </a-form-item>
  <a-divider>面板配置</a-divider>
  <div class="options-list">
    <draggable v-model="activeData.__config__.children" :animation="300" group="selectItem" handle=".option-drag" itemKey="uuid">
      <template #item="{ element, index }">
        <div class="select-item">
          <div class="select-line-icon option-drag">
            <i class="icon-ym icon-ym-darg" />
          </div>
          <future-i18n-input v-model:value="element.title" v-model:i18n="element.titleI18nCode" placeholder="面板名称" />
          <div class="close-btn select-line-icon" @click="delItem(index)">
            <i class="icon-ym icon-ym-btn-clearn" />
          </div>
        </div>
      </template>
    </draggable>
    <div class="add-btn">
      <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addItem" class="!px-0">添加面板</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { inject, computed } from 'vue';
  import draggable from 'vuedraggable';
  import { buildBitUUID } from '@/utils/uuid';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ inheritAttrs: false });
  const props = defineProps(['activeData']);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const getShowType: (() => string | undefined) | undefined = inject('getShowType');
  const showType = computed(() => (getShowType as () => string | undefined)());

  function addItem() {
    const uuid = buildBitUUID();
    props.activeData.__config__.children.push({
      title: '新面板' + uuid,
      titleI18nCode: '',
      name: uuid,
      __config__: {
        futureKey: 'collapseItem',
        children: [],
      },
    });
  }
  function delItem(index) {
    const list = props.activeData.__config__.children;
    if (list.length < 2) return createMessage.warning('最后一项不能删除');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '删除后不能撤销，确定要删除吗?',
      onOk: () => {
        props.activeData.__config__.children.splice(index, 1);
      },
    });
  }
</script>
