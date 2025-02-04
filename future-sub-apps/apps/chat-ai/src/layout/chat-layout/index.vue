<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRoute, useRouter } from 'vue-router';

// import { Icon } from '@future-core/icons';
import {
  Avatar,
  Button,
  Collapsible,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  Skeleton,
} from '@future-core/shadcn-ui';

import LayoutContent from '@/layout/content/index.vue';
import { type IDialog, type IConversation, useDialogAsideStore } from '@/store/modules/useDialogAsideStore';
import { useUserStore } from '@/store/modules/useUserStore';
import { Modal } from 'ant-design-vue';
import { AudioWaveform, ChevronRight, ChevronsLeft, ChevronsRight, Grid2x2, Grid2x2Plus, History, MoreHorizontal, Trash2, User } from 'lucide-vue-next';

import FHistory from './history/index.vue';

import { i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const dialogAsideStore = useDialogAsideStore();
const userStore = useUserStore();

/**
 * 基础逻辑处理
 */
function useBaseLogic(dialogAsideStore: any, userStore: any) {
  // 状态
  // 前置状态
  const preState = {
    dialogLoadingPResolve: null as any,
  };

  const state = ref({
    team: {
      name: i18n.global.t('application.title'),
      logo: AudioWaveform,
      plan: i18n.global.t('application.desctiption'),
    },
    dialogLoadingP: new Promise((resolve) => {
      preState.dialogLoadingPResolve = resolve;
    }),
    normalDialog: [] as IDialog[],
    recentDialog: [] as IDialog[],
    recentConversationList: [] as IConversation[],
  });
  // 开放函数
  const logout = () => {
    if (userStore.getUserInfo.userName) {
      Modal.confirm({
        title: i18n.global.t('common.tip_title'),
        content: i18n.global.t('common.quitsys'),
        okText: i18n.global.t('common.ok'),
        cancelText: i18n.global.t('common.cancel'),
        async onOk() {
          userStore.resetState();
          userStore.openLoginModal();
        },
      });
    } else {
      userStore.resetState();
      userStore.openLoginModal();
    }
  };

  // 内部调用函数
  const initFunc = async () => {
    // if (!userStore.getUserInfo.userName) {
    //   userStore.openLoginModal();
    // }
    // 初始化页面数据
    await dialogAsideStore.getDialogList();
    state.value.normalDialog = dialogAsideStore.normalDialogList;
    state.value.recentDialog = dialogAsideStore.recentDialogList;
    state.value.recentConversationList = dialogAsideStore.recentConversationList;

    // 默认第一个为激活状态
    if (state.value.normalDialog.length > 0 && state.value.normalDialog[0]) {
      dialogAsideStore.setCurrentDialog(state.value.normalDialog[0]);
    }
    preState.dialogLoadingPResolve();
  }

  initFunc();
  return {
    state,
    logout,
  };
}

const { state: baseState, logout } = useBaseLogic(dialogAsideStore, userStore);

/**
 * 页面跳转处理
 */
function useToPage() {
  const router = useRouter();
  const route = useRoute();

  // 当前窗口跳转
  const toPage = (name?: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    if (!name) return;
    router.push({ name, params: params || {}, query: query || {} });
  };

  // 打开窗口
  const openPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    const href = router.resolve({ name, params: params || {}, query: query || {} });
    window.open(href.href, '_blank');
  };

  // 智能体对话跳转
  const toDialogPage = (dialog: IDialog) => {
    dialogAsideStore.setCurrentDialog(dialog);
    toPage(dialog.url, { id: dialog.id });
  };

  const toSessionDialogPage = (dialog: IConversation) => {
    dialogAsideStore.setCurrentDialog(dialog);

    toPage(dialog.url, {id: dialog.id, dialog_id: dialog.dialog_id, user_id: dialog.user_id, message: dialog.message});
  };

  // 首次加载打开内容页
  const initPage = async (state: Ref<any>) => {
    // 如果没有激活的对话，则打开第一个对话
    if (route.params.id || route.name !== 'Chat') {
      return;
    }
    await state.value.dialogLoadingP;
    const activeDialog = state.value.normalDialog[0];
    toPage(activeDialog.url, { id: activeDialog.id });
  };

  return {
    toPage,
    toDialogPage,
    toSessionDialogPage,
    openPage,
    initPage,
  };
}

const { toPage, toDialogPage, toSessionDialogPage, openPage, initPage } = useToPage();
initPage(baseState);
</script>

<template>
  <SidebarProvider v-slot="{ toggleSidebar, state }">
    <Sidebar collapsible="icon">
      <!-- 侧边栏-头 -->
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg">
                  <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <component :is="baseState.team.logo" class="size-4" />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ baseState.team.name }}</span>
                    <span class="truncate text-xs">{{ baseState.team.plan }}</span>
                  </div>
                  <!-- History class="ml-auto" @click="dialogAsideStore.triggerHistoryBtn()" / -->
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <!-- 侧边栏-体 -->
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible v-for="item in baseState.normalDialog" :key="item.name" :default-open="item.isActive" as-child class="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :is-active="item.isActive" :tooltip="item.name" size="lg" @click="toDialogPage(item)">
                    <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <!-- <Icon :icon="item.icon" class="size-4" /> -->
                      <a-avatar :src="item.icon" />
                    </div>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ item.name }}</span>
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>

            <Collapsible v-if="dialogAsideStore.loadingStatus.dialogLoading">
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton size="lg">
                    <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Skeleton class="h-full w-full rounded-full" />
                    </div>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <Skeleton class="h-8 w-[230px]" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            {{i18n.global.t('chat_index.recentlyUsed')}}
            <ChevronRight class="ml-auto rotate-90 transition-transform duration-200" />
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in baseState.recentConversationList" :key="item.id">
              <!-- SidebarMenuButton :is-active="item.isActive" as-child size="lg" @click="toDialogPage(item)" -->
              <SidebarMenuButton as-child size="lg" @click="toSessionDialogPage(item)">
                <a href="javascript:void(0);">
<!--                  <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                    &lt;!&ndash; <Icon :icon="item.icon || 'carbon:logo-ibm'" class="size-4" /> &ndash;&gt;
                    <a-avatar :src="item.icon" />
                  </div>-->
                  <span>{{ item.name }}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu class="items-center">
                <DropdownMenuTrigger as-child>
                  <SidebarMenuAction class="size-8" show-on-hover>
                    <MoreHorizontal :size="32" />
                    <span class="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-48 rounded-lg" side="bottom">
                  <DropdownMenuItem @click="dialogAsideStore.removeRecentDialog(item)">
                    <Trash2 class="text-muted-foreground" />
                    <span>{{i18n.global.t('chat_index.remvoeConver')}}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem v-if="dialogAsideStore.loadingStatus.dialogLoading">
              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Skeleton class="h-full w-full rounded-full" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton class="h-8 w-[230px]" />
                </div>
              </SidebarMenuButton>

              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Skeleton class="h-full w-full rounded-full" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton class="h-8 w-[230px]" />
                </div>
              </SidebarMenuButton>

              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Skeleton class="h-full w-full rounded-full" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <Skeleton class="h-8 w-[230px]" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <!-- 导航 -->
      <nav class="mt-auto grid gap-1 p-2">
        <div v-if="state === 'expanded'" class="flex items-center gap-2">
          <Button variant="outline" @click="toPage('Square')">
            <Grid2x2 class="mr-2 h-4 w-4" color="hsl(var(--primary))" />
            <span class="truncate font-semibold"> {{i18n.global.t('chat_index.agentPlaza')}} </span>
          </Button>
          <div class="line h-full w-[1px] border-l border-solid"></div>
          <Button variant="outline" @click="openPage('admin')">
            <Grid2x2Plus class="mr-2 h-4 w-4" color="hsl(var(--primary))" />
            <span class="truncate font-semibold"> {{i18n.global.t('chat_index.manageAgent')}} </span>
          </Button>
        </div>

        <SidebarMenuButton v-if="state === 'collapsed'" class="border border-solid" size="lg" :tooltip="t('chat_index.agentPlaza')" @click="toPage('Square')">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Grid2x2 class="size-5" color="hsl(var(--primary))" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold"> {{ t('chat_index.agentPlaza') }} </span>
          </div>
        </SidebarMenuButton>

        <SidebarMenuButton v-if="state === 'collapsed'" class="border border-solid" size="lg" :tooltip="t('chat_index.createAgent')" @click="openPage('Createbot')">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Grid2x2Plus class="size-5" color="hsl(var(--primary))" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold"> {{ t('chat_index.createAgent') }} </span>
          </div>
        </SidebarMenuButton>
      </nav>

      <!-- 侧边栏-脚 -->
      <SidebarFooter class="bg-sidebar-footer" @click="toggleSidebar()">
        <ChevronsLeft v-show="state === 'expanded'" class="mx-auto" />
        <ChevronsRight v-show="state === 'collapsed'" class="mx-auto" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <!-- 内容区 -->
    <SidebarInset>
      <ResizablePanelGroup direction="horizontal">
        <template v-if="dialogAsideStore.toggleBtnStatus.history">
          <FHistory
            :history-session-list="dialogAsideStore.sessionList"
            :loading="dialogAsideStore.loadingStatus.historySessionLoading"
            class="cursor-pointer"
            @close="dialogAsideStore.triggerHistoryBtn()"
            @del="(session: any) => dialogAsideStore.delSession(session)"
            @to-session="(session: any) => dialogAsideStore.openSession(session)"
          />
          <ResizableHandle :disabled="true" />
        </template>
        <ResizablePanel class="relative flex h-lvh max-h-screen min-h-screen flex-col">
          <header
            class="flex h-[--chat-nav-height] shrink-0 items-center gap-2 border-b border-solid transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
          >
            <div class="flex items-center gap-2 px-4">{{ dialogAsideStore.currentDialog?.name }}</div>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button class="ml-auto mr-2 h-12 w-12 rounded-full text-xs" size="icon" variant="secondary">
                  <Avatar>
                    <User />
                  </Avatar>
                  <span class="sr-only"> {{ t('chat_index.userInfoSwitch') }}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{{ userStore.getUserInfo.userName || t('login.noLogin') }}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <!-- <DropdownMenuItem>设置</DropdownMenuItem>
                <DropdownMenuItem>支持</DropdownMenuItem>
                <DropdownMenuSeparator /> -->
                <DropdownMenuItem @click="logout"> {{ userStore.getUserInfo.userName ? t('header.logout') : t('header.signin') }} </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div class="flex h-0 min-h-0 w-full flex-1 flex-col">
            <LayoutContent />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarInset>
  </SidebarProvider>
</template>
