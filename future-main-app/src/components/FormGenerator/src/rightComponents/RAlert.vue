<template>
  <a-form-item label="提示文本">
    <future-i18n-input v-model:value="activeData.title" v-model:i18n="activeData.titleI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="辅助文本">
    <future-i18n-input v-model:value="activeData.description" v-model:i18n="activeData.descriptionI18nCode" placeholder="请输入" />
  </a-form-item>
  <a-form-item label="样式效果">
    <div class="type-list">
      <div class="type-list-item" :class="{ active: activeData.type === item.id }" v-for="(item, i) in typeList" :key="i" @click="activeData.type = item.id">
        <a-alert :message="item.fullName" :type="item.id" :closable="false" />
      </div>
    </div>
  </a-form-item>
  <a-form-item label="提示图标">
    <a-switch v-model:checked="activeData.showIcon" />
  </a-form-item>
  <a-form-item label="提示可关闭">
    <a-switch v-model:checked="activeData.closable" />
  </a-form-item>
  <a-form-item label="按钮文字" v-if="activeData.closable">
    <future-i18n-input v-model:value="activeData.closeText" v-model:i18n="activeData.closeTextI18nCode" :maxlength="10" placeholder="请输入" />
  </a-form-item>
</template>
<script lang="ts" setup>
  defineOptions({ inheritAttrs: false });
  defineProps(['activeData']);
  const typeList = [
    { id: 'success', fullName: '成功提示' },
    { id: 'info', fullName: '消息提示' },
    { id: 'warning', fullName: '警告提示' },
    { id: 'error', fullName: '错误提示' },
  ];
</script>
<style lang="less" scoped>
  .type-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .type-list-item {
      width: 110px;
      margin-bottom: 10px;
      cursor: pointer;
      &:last-child,
      &:nth-last-child(2) {
        margin-bottom: 0;
      }
      .ant-alert {
        text-align: center;
      }
      &.active {
        .ant-alert {
          border: 1px solid #999;
        }
      }
    }
  }
</style>
