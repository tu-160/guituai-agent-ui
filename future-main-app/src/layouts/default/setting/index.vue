<template>
  <div @click="openDrawer(true)">
    <i class="icon-ym icon-ym-header-config"></i>
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import SettingDrawer from './SettingDrawer';
  import { useDrawer } from '@/components/Drawer';

  export default defineComponent({
    name: 'SettingButton',
    components: { SettingDrawer },
    setup() {
      const [register, { openDrawer }] = useDrawer();

      return {
        register,
        openDrawer,
      };
    },
  });
</script>
