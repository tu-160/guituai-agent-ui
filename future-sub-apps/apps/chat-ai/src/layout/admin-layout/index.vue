<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, type Router, useRoute, useRouter } from 'vue-router';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@future-core/shadcn-ui';

import LayoutContent from '@/layout/content/index.vue';
import knowledgeContent from '@/layout/knowledge-content/index.vue';
import { useUserStore } from '@/store/modules/useUserStore';
import { message, Modal } from 'ant-design-vue';
import { CircleUser, Menu, Package2 } from 'lucide-vue-next';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

const route = useRoute();
const router = useRouter();
// 获取 userStore
const userStore = useUserStore();
const getActiveClass = (path: string) => {
  const regex = new RegExp(`^${path}(/.*)?$`);
  return regex.test(route.path)
    ? 'text-foreground hover:text-foreground w-max border-b-2 border-solid border-current leading-[56px] transition-colors'
    : 'text-muted-foreground hover:text-foreground w-max leading-[56px] transition-colors';
};

const getLeftActiveClass = (path: string) => {
  return route.path === path ? 'hover:text-foreground' : 'text-muted-foreground hover:text-foreground';
};

interface useInfo {
  userAccount: string;
  userId: string;
  userName: string;
}
const modelRt: useInfo = reactive({
  userAccount: '',
  userId: '',
  userName: '',
});
const loginOut = () => {
  if (modelRt.userName) {
    Modal.confirm({
      title: t('message.hint'),
      content: t('common.quitsys'),
      okText: t('common.ok'),
      cancelText: t('common.cancel'),
      async onOk() {
        userStore.resetState();
        userStore.openLoginModal();
        message.success(t('message.operated'));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  } else {
    userStore.resetState();
    userStore.openLoginModal();
  }
};

function isKnowledgeSubPath(path: any) {
  const regex = /^\/knowledge\/.+/;
  return regex.test(path);
}

onMounted(() => {
  const userInfo = userStore.getUserInfo;
  Object.assign(modelRt, userInfo);
});

function usePage(router: Router) {
  // 当前窗口跳转
  const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    router.push({ name, params: params || {}, query: query || {} });
  };
  return { toPage };
}
const { toPage } = usePage(router);
</script>

<template>
  <div class="flex h-lvh min-h-screen w-full flex-col">
    <header class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
      <nav class="hidden h-14 flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a class="flex h-14 w-max items-center gap-2 text-2xl font-semibold md:text-base" href="/admin/mybot">
          <Package2 class="h-6 w-6" />
          <span class="sr-only">{{ t('chat_index.agentCenter') }} </span>
          <span>{{ t('chat_index.agentCenter') }}</span>
        </a>
        <a :class="getActiveClass('/admin/mybot')" href="javaScript:void(0)" @click="toPage('Mybot')"> {{ t('chat_index.conventionalAgentCenter') }} </a>
        <a :class="getActiveClass('/admin/flow')" href="javaScript:void(0)" @click="toPage('Flow')"> {{ t('chat_index.advancedAgentCenter') }} </a>
        <a :class="getActiveClass('/knowledge')" href="javaScript:void(0)" @click="toPage('Knowledge')"> {{ t('header.knowledgeBase') }} </a>
        <!-- <a class="text-foreground hover:text-foreground w-max border-b-2 border-solid border-current leading-[56px] transition-colors" href="/admin/mybot">
          通用智能体
        </a>
        <a class="text-muted-foreground hover:text-foreground w-max leading-[56px] transition-colors" href="/test1"> 高阶智能体 </a>
        <a class="text-muted-foreground hover:text-foreground w-max leading-[56px] transition-colors" href="/knowledge"> 知识库 </a>
        <a class="text-muted-foreground hover:text-foreground w-max leading-[56px] transition-colors" href="/test2"> 文件管理 </a> -->
      </nav>
      <Sheet>
        <SheetTrigger as-child>
          <Button class="shrink-0 md:hidden" size="icon" variant="outline">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <a class="flex items-center gap-2 text-lg font-semibold" href="/admin/mybot">
              <Package2 class="h-6 w-6" />
              <span class="sr-only">{{ t('chat_index.agentCenter') }}</span>
            </a>
            <a :class="getLeftActiveClass('/admin/mybot')" href="/admin/mybot"> {{ t('chat_index.conventionalAgentCenter') }} </a>
            <a :class="getLeftActiveClass('#')" href="#"> {{t('chat_index.advancedAgentCenter')}} </a>
            <a :class="getLeftActiveClass('/knowledge')" href="/knowledge"> {{t('header.knowledgeBase')}} </a>
            <a :class="getLeftActiveClass('#')" href="#"> Customers </a>
            <a :class="getLeftActiveClass('#')" href="#"> {{t('header.fileManager')}} </a>
            <!-- <a class="hover:text-foreground" href="#"> 通用智能体 </a>
            <a class="text-muted-foreground hover:text-foreground" href="#"> 高阶智能体 </a>
            <a class="text-muted-foreground hover:text-foreground" href="/knowledge"> 知识库 </a>
            <a class="text-muted-foreground hover:text-foreground" href="#"> Customers </a>
            <a class="text-muted-foreground hover:text-foreground" href="#"> 文件管理 </a> -->
          </nav>
        </SheetContent>
      </Sheet>
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form class="ml-auto flex-1 sm:flex-initial"></form>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button class="rounded-full" size="icon" variant="secondary">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ modelRt.userName || t('login.noLogin') }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <!-- <DropdownMenuItem>设置</DropdownMenuItem>
            <DropdownMenuItem>支持</DropdownMenuItem>
            <DropdownMenuSeparator /> -->
            <DropdownMenuItem @click="loginOut()">{{ modelRt.userName ? t('setting.quit') : t('login.login') }}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <main v-if="!isKnowledgeSubPath(route.path)" class="layout-main flex flex-1">
      <LayoutContent />
    </main>
    <main v-else style="display: flex; height: calc(100vh - 64px - 2px); overflow: auto; background: rgb(255 255 255); border-radius: 8px">
      <knowledgeContent />
    </main>
  </div>
</template>

<style lang="scss">
.layout-main {
  height: calc(100vh - 64px - 2px);
}
</style>
