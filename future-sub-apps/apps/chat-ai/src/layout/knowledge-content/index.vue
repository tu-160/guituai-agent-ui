<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';

import { h, onMounted, reactive, ref, watch } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRoute, useRouter } from 'vue-router';

import { K0003 } from '@/api/modules/a3';
import LayoutContent from '@/layout/content/index.vue';
import { useUserStore } from '@/store/modules/useUserStore';
import { AimOutlined, FileZipOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue?: boolean;
}>();

const userStore = useUserStore();

const items = reactive([
  {
    key: '1',
    icon: () => h(FileZipOutlined),
    label: t('knowledgeDetails.dataset'),
    title: t('knowledgeDetails.dataset'),
    path: 'Dataset',
  },
  {
    key: '2',
    icon: () => h(AimOutlined),
    label: t('knowledgeDetails.testing'),
    title: t('knowledgeDetails.testing'),
    path: 'Testing',
  },
  {
    key: '3',
    icon: () => h(SettingOutlined),
    label: t('knowledgeDetails.configuration'),
    title: t('knowledgeDetails.configuration'),
    path: 'Configuration',
  },
]);

const router = useRouter();
const route = useRoute();
// 当前窗口跳转
const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
  router.push({ name, params: params || {}, query: query || {} });
};
const handleClick: MenuProps['onClick'] = (e) => {
  const query: LocationQueryRaw = route.query;
  const params: RouteParamsGeneric = route.params;
  const path = e.item?.path;
  toPage(path, params, query);
};

// 根据当前路由更新 selectedKeys
const updateSelectedKeys = () => {
  const currentPath = route.name;
  const selectedItem = items.find((item) => item.path === currentPath);
  userStore.selectedKeys = selectedItem ? [selectedItem.key] : ['1'];
};

const modelRt = reactive({
  spinning: false,
});
interface KnowledgeListItem {
  avatar: string;
  chunk_num: any;
  description: string;
  doc_num: any;
  embd_id: string;
  id: string;
  language: string;
  name: string;
  nickname: string;
  parser_id: string;
  permission: string;
  tenant_avatar: string;
  token_num: any;
  update_time: any;
}
const modelRef: KnowledgeListItem = reactive({
  avatar: '',
  chunk_num: '',
  description: '',
  doc_num: '',
  embd_id: '',
  id: '',
  language: '',
  name: '',
  nickname: '',
  parser_id: '',
  permission: '',
  tenant_avatar: '',
  token_num: '',
  update_time: '',
});

const getKnowledgeList = async (params: any) => {
  modelRt.spinning = true;
  await K0003(params)
    .then((res) => {
      Object.assign(modelRef, res.data);
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
};
interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<{
    breadcrumbName: string;
    path: string;
  }>;
}
const basePath = '/knowledge';
const routers = ref<Route[]>([]);

const routresChange = () => {
  routers.value = route.matched.map((record) => ({
    path: record.path,
    breadcrumbName: (record.meta.breadcrumbName as string) || record.meta?.title?.toString() || 'Unknown',
  }));
};
routresChange();
onMounted(() => {
  updateSelectedKeys();
  const params = route.query;
  if (Object.keys(params).length > 0) {
    getKnowledgeList(route.query);
  }
});
watch(
  () => route.path,
  () => {
    routresChange();
  },
);
</script>

<template>
  <div class="flex h-full w-full">
    <div class="flex max-w-[288px] flex-col pb-6 pl-6 pr-6 pt-8">
      <ASpin :spinning="modelRt.spinning" size="large">
        <div class="pb-5 text-center">
          <a-space direction="vertical" style="gap: 8px">
            <a-avatar :size="64" src="" />
            <div class="text-base font-bold leading-6 text-gray-900">{{ modelRef.name }}</div>
          </a-space>
          <div class="mb-5"></div>
        </div>
        <div class="bg-size-10 h-0.5 bg-gradient-to-r from-gray-200 via-gray-200 to-transparent bg-repeat-x"></div>
        <div class="pt-2">
          <a-menu
            id="dddddd"
            v-model:selected-keys="userStore.selectedKeys"
            :items="items"
            mode="inline"
            style="width: 240px; border: none; font-size: 16px; font-weight: 600"
            @click="handleClick"
          />
        </div>
      </ASpin>
    </div>
    <div class="flex h-full flex-1 flex-col overflow-x-auto bg-gray-100 p-4">
      <div>
        <a-breadcrumb :routes="routers">
          <template #itemRender="{ route, paths }">
            <span v-if="routers.indexOf(route) === routers.length - 1">
              {{ route.breadcrumbName }}
            </span>
            <router-link v-else :to="`${basePath}/${paths.join('/')}`">
              {{ route.breadcrumbName }}
            </router-link>
          </template>
        </a-breadcrumb>
        <br />
      </div>
      <div class="content___kPak3">
        <LayoutContent />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-\[288px\] {
  max-width: 288px;
}
.bg-size-10 {
  background-size: 10px 2px;
}
.content___kPak3 {
  margin-top: 16px;
  flex: 1 1;
}
</style>
