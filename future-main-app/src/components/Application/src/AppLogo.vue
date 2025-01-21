<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <template v-if="showTitle">
      <a-image
        class="login-logo"
        :src="apiUrl + getSysConfig.navigationIcon"
        :fallback="logoImg"
        :preview="false"
        v-if="getSysConfig && getSysConfig.navigationIcon" />
      <img class="login-logo" :src="logoImg" v-else />
    </template>
    <template v-else>
      <a-image
        class="login-logo"
        :src="apiUrl + getSysConfig.workLogoIcon"
        :fallback="futureImg"
        :preview="false"
        v-if="getSysConfig && getSysConfig.workLogoIcon" />
      <img :src="futureImg" v-else />
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref, ref } from 'vue';
  import { Image as AImage } from 'ant-design-vue';
  import { useGo } from '@/hooks/web/usePage';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PageEnum } from '@/enums/pageEnum';
  import { useAppStore } from '@/store/modules/app';
  import { useGlobSetting } from '@/hooks/setting';
  import logoImg from '@/assets/images/future2.png';
  import futureImg from '@/assets/images/future.png';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const appStore = useAppStore();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const go = useGo();

  const getAppLogoClass = computed(() => [prefixCls, props.theme, { 'collapsed-show-title': unref(getCollapsedShowTitle) }]);
  const getSysConfig = computed(() => appStore.getSysConfigInfo);

  function goHome() {
    go(PageEnum.BASE_HOME);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      transition: all 0.5s;
      line-height: normal;
    }
    :deep(.ant-image),
    .login-logo {
      width: auto;
      height: 100%;
      .login-logo {
        width: auto;
        height: 100%;
      }
    }
  }
</style>
