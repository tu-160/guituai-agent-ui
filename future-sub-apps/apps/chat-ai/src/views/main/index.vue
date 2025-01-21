<script setup lang="ts">
import { Button } from '@future-core/shadcn-ui';

const onSubmit = (values: any) => {
  console.log(values);
};
</script>

<template>
  <form class="w-2/3 space-y-6" @submit="onSubmit">
    <Button type="submit"> Submit </Button>
  </form>
</template>
