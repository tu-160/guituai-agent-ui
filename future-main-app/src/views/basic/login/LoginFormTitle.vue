<template>
  <div>
    <a-image class="login-logo" :src="apiUrl + getSysConfig.loginIcon" :fallback="loginLogo" :preview="false" v-if="getSysConfig && getSysConfig.loginIcon" />
    <img class="login-logo" :src="loginLogo" v-else />
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Image as AImage } from 'ant-design-vue';
  import { useAppStore } from '@/store/modules/app';
  import { useGlobSetting } from '@/hooks/setting';
  import loginLogo from '@/assets/images/login_logo.png';

  const appStore = useAppStore();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);

  const getSysConfig = computed(() => appStore.getSysConfigInfo);
</script>
