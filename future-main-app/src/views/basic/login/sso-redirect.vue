<template>
  <div class="box" v-loading="loading"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { PageEnum } from '@/enums/pageEnum';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';

  defineOptions({ name: 'ssoRedirect' });

  const loading = ref(true);
  const userStore = useUserStore();

  function init() {
    const route = useRoute();
    const router = useRouter();
    const token = route.query.token;
    const redirect = route.query.redirect;
    if (!token) return;
    userStore.updateToken(token as string);
    nextTick(() => {
      router.replace((redirect as string) || PageEnum.BASE_HOME);
      loading.value = false;
    });
  }

  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .box {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
