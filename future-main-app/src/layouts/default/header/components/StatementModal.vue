<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="官方声明" :footer="null" :width="400" class="about-modal">
    <div class="about-modal-main">
      FUTURE是对外开放性体验产品，平台内所有数据为我司虚构的测试数据，是随机生成非敏感数据，所以严禁任何人在FUTURE平台上修改数据内容、扭曲数据目的、传播或售卖测试数据，特此警告。
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '@/components/Modal';

  const [registerModal] = useModalInner();
</script>
