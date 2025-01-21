<template>
  <MenuItem :key="itemKey">
    <span class="flex items-center">
      <i :class="icon" class="mr-1" />
      <span>{{ text }}</span>
    </span>
  </MenuItem>
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue';

  import { defineComponent } from 'vue';

  import { propTypes } from '@/utils/propTypes';

  export default defineComponent({
    name: 'DropdownMenuItem',
    components: { MenuItem: Menu.Item },
    props: {
      itemKey: propTypes.string,
      text: propTypes.string,
      icon: propTypes.string,
    },
  });
</script>
