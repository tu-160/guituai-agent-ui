<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="todo-box-body">
      <router-link
        class="item"
        :style="{ width: 100 / (activeData.option.rowNumber || 3) + '%' }"
        :class="{ 'item-border': activeData.option.showBorder }"
        :to="item.urlAddress"
        v-for="(item, index) in list"
        :key="index"
        v-show="!item.noShow">
        <i :class="item.icon" :style="{ background: item.iconBgColor }"></i>
        <div class="text">
          <p
            class="num"
            :style="{
              'font-size': activeData.option.valueFontSize + 'px',
              'font-weight': activeData.option.valueFontWeight ? 'bolder' : 'normal',
              color: activeData.option.valueFontColor,
            }">
            {{ item.num }}
          </p>
          <p
            class="name"
            :style="{
              'font-size': activeData.option.labelFontSize + 'px',
              'font-weight': activeData.option.labelFontWeight ? 'bolder' : 'normal',
              color: activeData.option.labelFontColor,
            }">
            {{ item.fullName }}
          </p>
        </div>
      </router-link>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import { getFlowTodoCount } from '@/api/onlineDev/portal';

  const props = defineProps(['activeData']);
  const list = ref<any[]>([]);

  function initData() {
    const query = {
      flowToSignType: [],
      flowTodoType: [],
      flowDoingType: [],
      flowDoneType: [],
      flowCirculateType: [],
    };
    list.value.map(ele => {
      query[ele.id + 'Type'] = ele.category;
    });
    getFlowTodoCount(query).then(res => {
      list.value.forEach(ele => {
        if (ele.id == 'flowToSign') ele.num = res.data.flowToSign || 0;
        if (ele.id == 'flowTodo') ele.num = res.data.flowTodo || 0;
        if (ele.id == 'flowDoing') ele.num = res.data.flowDoing || 0;
        if (ele.id == 'flowDone') ele.num = res.data.flowDone || 0;
        if (ele.id == 'flowCirculate') ele.num = res.data.flowCirculate || 0;
      });
    });
  }

  onMounted(() => {
    list.value = props.activeData.option.defaultValue;
    initData();
  });
</script>
<style lang="less" scoped>
  .todo-box-body {
    display: flex;
    flex-wrap: wrap;
    .item-border {
      box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
      transition: all 0.3s;
      &:hover {
        position: relative;
        z-index: 1;
        box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
      }
    }
    .item {
      height: 141px;
      display: flex;
      align-items: center;
      overflow: hidden;
      i {
        width: 56px;
        height: 56px;
        margin-right: 14px;
        border-radius: 50%;
        color: #fff;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        line-height: 56px;
        font-size: 30px;
        margin-left: 30px;
        flex-shrink: 0;
      }
      .text {
        display: inline-block;
        height: 56px;
        .num {
          font-size: 20px;
          line-height: 36px;
        }
        .name {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
</style>
