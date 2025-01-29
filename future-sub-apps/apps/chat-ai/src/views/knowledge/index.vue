<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, useRouter } from 'vue-router';

import { ScrollArea } from '@future-core/shadcn-ui';

import { K00004, K0001, K0002 } from '@/api/modules/a3';
import BaseContainer from '@/components/base-container/index.vue';
import { useUserStore } from '@/store/modules/useUserStore';
import { CalendarOutlined, DeleteOutlined, EllipsisOutlined, FileTextOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Form, message, Modal } from 'ant-design-vue';
import { i18n } from "@/locales/i18n";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue?: boolean;
}>();
const labelCol = { span: 6 };
const wrapperCol = { span: 16 };
const userStore = useUserStore();
const useForm = Form.useForm;
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
const modelRef = reactive<{ knowledgeList: KnowledgeListItem[] }>({
  knowledgeList: [],
});

const modelRt = reactive({
  spinning: false,
  searchParam: '',
  isModalOpen: false,
  name: '',
});

const getKnowledgeList = async () => {
  modelRt.spinning = true;
  const params = {
    page: 1,
    page_size: 150,
    orderby: 'create_time',
    desc: 'True',
    keywords: '',
  };
  await K0001(params)
    .then((res) => {
      modelRef.knowledgeList = res.data.kbs;
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以要加1
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const deleteAgent = (item: any) => {
  Modal.confirm({
    title: t('common.tip_title'),
    content: t('common.deleteModalTitle'),
    okText: t('common.ok'),
    cancelText: t('common.cancel'),
    async onOk() {
      await K0002({ kb_id: item.id })
        .then(() => {
          message.success(t('message.operated'));
          getKnowledgeList();
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

interface useInfo {
  userAccount: string;
  userId: string;
  userName: string;
}
const modelUserInfo: useInfo = reactive({
  userAccount: '',
  userId: '',
  userName: '',
});
const router = useRouter();

// 当前窗口跳转
const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
  router.push({ name, params: params || {}, query: query || {} });
};

const openModal = () => {
  modelRt.isModalOpen = true;
};
const modelRy = reactive({
  name: '',
});
// 表单校验
const { validate, validateInfos } = useForm(
  modelRy,
  reactive({
    name: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
  }),
);
const handleCancel = () => {};
const handleOk = () => {

  validate()
    .then(async () => {

      const params = {
        name: modelRy.name,
      };

      const searchParams = {
        page: 1,
        page_size: 150,
        orderby: 'create_time',
        desc: 'True',
        keywords: modelRy.name,
      };

      let isExist: boolean = false;

      await K0001(searchParams)
          .then((res) => {

            modelRef.knowledgeList = res.data.kbs;
            if(modelRef.knowledgeList.length > 0) {
              isExist = true;
            }
          })
          .catch((error) => {
            console.log(error)
          });

      if(isExist) {
        Modal.confirm({
          title: t('common.tip_title'),
          content: t('flow.nameExisted'),
          cancelText: t('common.close'),
          okButtonProps: { style: { display: 'none' } },
        });
        return;
      }

      await K00004(params)
        .then(() => {
          message.success(t('message.operated'));
          modelRt.isModalOpen = false;
          getKnowledgeList();
        })
        .catch(() => {
          message.error(t('message.failed'));
        });
    })
    .catch((error) => {
      console.log('error', error);
    });
};
onMounted(() => {
  const userInfo = userStore.getUserInfo;
  Object.assign(modelUserInfo, userInfo);
  getKnowledgeList();
});
</script>

<template>
  <BaseContainer>
    <div class="panel h-full w-full flex-1">
      <ScrollArea class="flex h-full">
        <ASpin :spinning="modelRt.spinning" size="large">
          <div class="pl-15 pr-15 pb-18 flex items-start justify-between p-0" style="padding: 0 60px 72px">
            <!-- div>
              <span class="text-3xl font-semibold leading-9 text-gray-900">{{t('knowledgeList.welcome')}}, {{ modelUserInfo.userName }}</span>
              <p class="text-base font-normal leading-6 text-gray-600">{{t('knowledgeList.description')}}</p>
            </--div -->
            <a-space>
              <a-input v-model:value="modelRt.searchParam" :placeholder="t('knowledgeList.searchKnowledgePlaceholder')">
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
              <a-button class="flex items-center" type="primary" @click="openModal">
                <template #icon>
                  <PlusOutlined />
                </template>
                {{t('common.create')}}
              </a-button>
            </a-space>
          </div>
          <div class="pl-10 pr-10">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 2xl:grid-cols-5">
              <div v-for="(item, index) in modelRef.knowledgeList || []" :key="index">
                <a-card class="m-0 cursor-pointer rounded-lg border border-gray-200 p-0 shadow-sm">
                  <!-- div class="flex h-64 flex-col justify-between" @click="toPage('Dataset', { id: item.id }, { id: item.id })" -->
                  <div class="flex h-40 flex-col justify-between" @click="toPage('Dataset', { id: item.id }, { id: item.id })">
                    <div class="flex justify-between">
                      <a-avatar class="flex h-8 w-8 items-center justify-center text-base">
                        <template #icon><UserOutlined /></template>
                      </a-avatar>
                      <div class="delete___BGyWn inline-block">
                        <a-dropdown :trigger="['click']" @click.stop>
                          <EllipsisOutlined class="h-6 cursor-pointer text-3xl text-gray-500" />
                          <template #overlay>
                            <a-menu>
                              <a-menu-item key="0" @click="deleteAgent(item)">
                                <div>
                                  <span style="vertical-align: middle">{{t('common.delete')}}</span>
                                  <DeleteOutlined style="margin-left: 8px; vertical-align: middle" />
                                </div>
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </div>
                    </div>
                    <div class="">
                      <span class="break-all text-2xl font-semibold text-gray-900">{{ item.name }}</span>
                    </div>
                    <div>
                      <div class="pb-0.5">
                        <div class="align-middle">
                          <FileTextOutlined class="mr-2.5 align-middle" style="font-size: 18px" />
                          <span class="align-middle" style="font-size: 12px; font-weight: 600; color: #000000a6"> {{ item.doc_num }} {{t('knowledgeList.doc')}} </span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="align-middle">
                          <CalendarOutlined class="mr-2.5 align-middle" style="font-size: 18px" />
                          <span class="align-middle" style="font-size: 12px; font-weight: 600; color: #000000a6">{{ formatTimestamp(item.update_time) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-card>
              </div>
            </div>
          </div>
        </ASpin>
      </ScrollArea>

      <a-modal v-model:open="modelRt.isModalOpen" :cancel-text="t('common.cancel_button')" :ok-text="t('common.confirm')" :title="t('knowledgeList.createKnowledgeBase')" @cancel="handleCancel" @ok="handleOk">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label="t('knowledgeDetails.name')" name="name" v-bind="validateInfos.name">
            <a-input v-model:value="modelRy.name" :placeholder="t('knowledgeDetails.namePlaceholder')" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </BaseContainer>
</template>
<style></style>
