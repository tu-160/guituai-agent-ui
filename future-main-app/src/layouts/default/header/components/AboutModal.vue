<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="关于平台" :footer="null" :width="400" class="about-modal">
    <div class="about-modal-main">
      <a-image class="about-logo" :src="apiUrl + getSysConfig.logoIcon" :fallback="logoImg" :preview="false" v-if="getSysConfig && getSysConfig.logoIcon" />
      <img class="about-logo" :src="logoImg" v-else />
      <div>
        <p class="title">
          <a href="https://www.futuresoft.com" target="_blank">{{ getSysConfig.sysName }}</a>
        </p>
        <p>版本：{{ getSysConfig.sysVersion }}</p>
        <p>作者：直方软件</p>
        <p>广州市直方信息科技有限公司出品</p>
      </div>
    </div>
    <p class="about-modal-main-tip">解放90%重复性的代码编写工作，让你更加专注于业务和体验！</p>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useAppStore } from '@/store/modules/app';
  import { useGlobSetting } from '@/hooks/setting';
  import logoImg from '@/assets/images/future.png';

  const [registerModal] = useModalInner();
  const appStore = useAppStore();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);

  const getSysConfig = computed(() => appStore.getSysConfigInfo);
</script>
<style lang="less">
  .about-modal {
    .scrollbar {
      padding: 0 0 40px 0 !important;
    }
    .about-modal-main {
      display: flex;
      align-items: center;
      height: 150px;
      padding: 0 30px;
      line-height: 24px;
      .about-logo {
        display: inline-block;
        width: 95px;
        height: 95px;
        line-height: 95px;
        text-align: center;
        border-radius: 10px;
        color: #fff;
        margin-right: 30px;
      }
    }
    .about-modal-main-tip {
      font-size: 12px;
      padding-left: 30px;
      margin: 0;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      a {
        color: @text-color;
      }
    }
  }
</style>
