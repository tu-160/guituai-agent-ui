<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRouter } from 'vue-router';

import { Icon } from '@future-core/icons';
import { Avatar, ScrollArea } from '@future-core/shadcn-ui';

import { D0003, D0004 } from '@/api/modules/a2';
import BaseContainer from '@/components/base-container/index.vue';
import { message, Modal } from 'ant-design-vue';
import { Plus } from 'lucide-vue-next';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

defineProps<{
  modelValue?: boolean;
}>();

interface PublicListItem {
  id: string;
  name: string;
  icon: string;
  avatar: string;
  description: string;
}
const modelRef = reactive<{ publicList: PublicListItem[] }>({
  publicList: [],
});
const modelRt = reactive({
  spinning: false,
});

const getPublicList = async () => {
  try {
    modelRt.spinning = true;
    const res = await D0004({});
    modelRef.publicList = res.data.private_data;
    modelRt.spinning = false;
  } catch (error) {
    console.error('查询失败', error);
    modelRt.spinning = false;
  }
};

/**
 * 页面跳转处理
 */
function useToPage() {
  const router = useRouter();

  // 当前窗口跳转
  const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    router.push({ name, params: params || {}, query: query || {} });
  };

  // 打开窗口
  const openPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    const href = router.resolve({ name, params: params || {}, query: query || {} });
    window.open(href.href, '_blank');
  };

  return {
    toPage,
    openPage,
  };
}

const { toPage } = useToPage();

// const editAgent = (item: any) => {
//   const query = {
//     dialog_id: item.id,
//   };
//   toPage('Createbot', {}, query);
// };

const deleteAgent = (item: any) => {
  Modal.confirm({
    title: t('message.hint'),
    content: t('chat_index.deleteAgentMessageTip', {'name': item.name}),
    okText: t('common.ok'),
    cancelText: t('common.cancel'),
    async onOk() {
      await D0003({ dialog_id: item.id })
        .then(() => {
          message.success(t('message.operated'));
          getPublicList();
        })
        .catch(() => {
          message.error(t('message.failed'));
        });
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

onMounted(() => {
  getPublicList();
});
</script>

<template>
  <BaseContainer>
    <ASpin :spinning="modelRt.spinning" size="large">
      <ScrollArea class="2xl:px-40">
        <div class="square-container">
          <div class="mt-4 grid grid-cols-3 gap-4 2xl:grid-cols-4">
            <div class="square-card group !border-2 border-dashed hover:border-blue-500" @click="toPage('Createbot')">
              <Avatar class="h-14 w-14 text-xs">
                <Plus :size="36" class="group-hover:text-blue-500" />
              </Avatar>
              <span class="pl-2 group-hover:text-blue-500">{{ t('chat_index.createAgent') }}</span>
            </div>
            <!-- <Avatar class="h-14 w-14 text-xs">
           <Codesandbox :size="36" />
          </Avatar> -->
            <div v-for="(i, index) in modelRef.publicList || []" :key="index" class="square-card group">
              <!-- <a-avatar :size="48" :src="i.icon" /> -->
              <Avatar class="h-14 w-14 text-xs">
                <!-- <Codesandbox :size="36" /> -->
                <a-avatar :size="48" :src="i.icon" />
              </Avatar>
              <span class="flex-grow pl-2">{{ i.name }}</span>
              <!-- <div class="flex gap-2">
              <PencilLine class="cursor-pointer rounded p-1 hover:bg-gray-200" @click="editAgent(i)" />
              <Trash2 class="cursor-pointer rounded p-1 hover:bg-gray-200" @click="deleteAgent(i)" />
            </div> -->
              <div class="absolute right-2 top-1/2 -mt-4 flex h-8 w-14 items-center gap-2">
                <Icon
                  class="hidden size-8 rounded-sm p-1 hover:bg-slate-100 group-hover:block"
                  icon="lucide:edit-3"
                  @click.stop="() => toPage('Createbot', { dialog_id: i.id }, { dialog_id: i.id })"
                />
                <Icon class="hidden size-8 rounded-sm p-1 hover:bg-slate-100 group-hover:block" icon="lucide:trash-2" @click.stop="deleteAgent(i)" />
              </div>
            </div>
          </div>
          <div class="h-8"></div>
        </div>
      </ScrollArea>
    </ASpin>
  </BaseContainer>
</template>

<style lang="scss">
.square-container {
  @apply p-2;
}

.square-title {
  @apply mt-2 text-lg font-bold text-gray-700;
}

.square-card {
  @apply flex h-20 w-full max-w-96 cursor-pointer items-center gap-2 rounded-lg border bg-white p-4 hover:shadow-md;
  @apply relative;
}

.square-card > div {
  @apply flex gap-2; /* 让图标部分靠右 */
}

.category-item {
  @apply flex h-10 w-auto cursor-pointer items-center justify-center rounded-lg bg-gray-50 p-4 text-gray-700 shadow-sm;
  @apply hover:bg-sky-100 active:bg-sky-500;
}

.agent-cart {
  @apply flex h-32 w-full max-w-96 cursor-pointer items-start gap-2 rounded-lg border bg-white p-4 hover:shadow-md;
}
</style>
