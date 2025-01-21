<template>
  <a-collapse-panel>
    <template #header>标签设置</template>
    <a-form-item label="风格类型" v-if="showType === 'pc'">
      <future-radio v-model:value="activeData.type" :options="typeOptions" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-form-item label="选项卡位置" v-if="showType === 'pc'">
      <future-radio v-model:value="activeData.tabPosition" :options="positionOptions" optionType="button" button-style="solid" class="right-radio" />
    </a-form-item>
    <a-divider>标签页配置</a-divider>
    <div class="options-list">
      <draggable v-model="activeData.children" :animation="300" group="selectItem" handle=".option-drag" itemKey="name">
        <template #item="{ element, index }">
          <div class="select-item">
            <div class="select-line-icon option-drag">
              <i class="icon-ym icon-ym-darg" />
            </div>
            <future-i18n-input class="flex-1" v-model:value="element.title" v-model:i18n="element.titleI18nCode" placeholder="标签名称" />
            <FutureIconPicker class="!w-130px" v-model:value="element.icon" v-show="showType === 'pc'" />
            <div class="close-btn select-line-icon" @click="delItem(index, element)">
              <i class="icon-ym icon-ym-btn-clearn" />
            </div>
          </div>
        </template>
      </draggable>
      <div class="add-btn">
        <a-button type="link" preIcon="icon-ym icon-ym-btn-add" @click="addItem">添加标签页</a-button>
      </div>
    </div>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { buildBitUUID } from '@/utils/uuid';
  import draggable from 'vuedraggable';

  const props = defineProps(['activeData', 'showType']);
  const typeOptions = [
    { id: '', fullName: '默认' },
    { id: 'card', fullName: '选项卡' },
  ];
  const positionOptions = [
    { id: 'top', fullName: '顶部' },
    { id: 'left', fullName: '左侧' },
    { id: 'right', fullName: '右侧' },
    { id: 'bottom', fullName: '底部' },
  ];
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  function delItem(index, item) {
    let list = props.activeData.children;
    let length = list.length;
    if (length < 2) return createMessage.warning('最后一项不能删除');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '删除后不能撤销，确定要删除吗?',
      onOk: () => {
        if (props.activeData.active === item.name) {
          let nextTab = list[index + 1] || list[index - 1];
          if (nextTab) props.activeData.active = nextTab.name;
        }
        props.activeData.children.splice(index, 1);
      },
    });
  }
  function addItem() {
    const uuid = buildBitUUID();
    props.activeData.children.push({
      title: 'New Tab ' + uuid,
      titleI18nCode: '',
      name: uuid,
      icon: '',
      children: [],
    });
  }
</script>
