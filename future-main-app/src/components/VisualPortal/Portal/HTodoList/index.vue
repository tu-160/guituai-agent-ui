<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-todoList">
      <template v-if="list.length">
        <a class="item" v-for="(item, i) in list" :key="i">
          <span class="name com-hover" @click="goDetail(item)">{{ item.fullName }}</span>
          <span class="time">{{ dayjs(item.creatorTime).format('YYYY-MM-DD') }}</span>
        </a>
      </template>
      <div class="portal-common-noData" v-else>
        <future-empty />
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import { getFlowTodoList } from '@/api/onlineDev/portal';
  import { useRouter } from 'vue-router';
  import { encryptByBase64 } from '@/utils/cipher';
  import dayjs from 'dayjs';

  const props = defineProps(['activeData']);
  const list = ref<any[]>([]);
  const router = useRouter();

  function initData() {
    getFlowTodoList(props.activeData.type || 1).then(res => {
      list.value = res.data?.list?.length ? res.data.list.slice(0, 7) : [];
    });
  }
  function goDetail(item) {
    let config = JSON.stringify({ ...item, operatorId: item.id, opType: props.activeData.type });
    router.push('/workFlowDetail?config=' + encodeURIComponent(encryptByBase64(config)));
  }

  onMounted(() => initData());
</script>
