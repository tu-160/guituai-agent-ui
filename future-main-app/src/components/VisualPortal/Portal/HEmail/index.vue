<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-email">
      <template v-if="list.length">
        <div class="item" v-for="(item, i) in list" :key="i">
          <router-link :to="'/emailDetail?id=' + item.id">
            <span class="name com-hover">{{ item.fullName }}</span>
          </router-link>
          <span class="time">{{ toDateText(item.creatorTime) }}</span>
        </div>
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
  import { getEmailList } from '@/api/onlineDev/portal';
  import { toDateText } from '@/utils/future';

  defineProps(['activeData']);
  const list = ref<any[]>([]);

  function initData() {
    getEmailList().then(res => {
      list.value = res.data.list?.length ? res.data.list.slice(0, 7) : [];
    });
  }

  onMounted(() => initData());
</script>
