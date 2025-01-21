<template>
  <a-collapse-panel>
    <template #header>数值设置</template>
    <a-form-item label="显示">
      <a-switch v-model:checked="activeData.option.seriesLabelShow" />
    </a-form-item>
    <template v-if="activeData.option.seriesLabelShow">
      <template v-if="activeData.futureKey == 'pieChart' && showType == 'pc'">
        <a-form-item label="显示位置">
          <future-radio
            v-model:value="activeData.option.seriesLabelPosition"
            :options="labelPositionList"
            optionType="button"
            button-style="solid"
            class="right-radio" />
        </a-form-item>
        <a-form-item label="显示内容">
          <future-checkbox
            v-model:value="activeData.option.seriesLabelShowInfo"
            :options="labelShowList"
            optionType="button"
            button-style="solid"
            class="right-radio" />
        </a-form-item>
      </template>
      <template v-if="showType == 'pc'">
        <a-form-item label="字体大小">
          <a-input-number v-model:value="activeData.option.seriesLabelFontSize" placeholder="请输入" :min="12" :max="25" />
        </a-form-item>
        <a-form-item label="字体加粗">
          <a-switch v-model:checked="activeData.option.seriesLabelFontWeight" />
        </a-form-item>
      </template>
      <a-form-item label="字体颜色">
        <future-color-picker v-model:value="activeData.option.seriesLabelColor" size="small" />
      </a-form-item>
      <a-form-item label="背景色" v-if="showType == 'pc'">
        <future-color-picker v-model:value="activeData.option.seriesLabelBgColor" size="small" />
      </a-form-item>
    </template>
  </a-collapse-panel>
</template>
<script lang="ts" setup>
  defineProps(['activeData', 'showType']);
  const labelPositionList = [
    { fullName: '外侧', id: 'outside' },
    { fullName: '内侧', id: 'inside' },
  ];
  const labelShowList = [
    { fullName: '数值', id: 'count' },
    { fullName: '百分比', id: 'percent' },
  ];
</script>
