<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { type LocationQueryRaw, type RouteParamsGeneric, type Router, useRouter } from 'vue-router';

import { ScrollArea } from '@future-core/shadcn-ui';

import {G0001, G0002, G0004} from '@/api';
import BaseContainer from '@/components/base-container/index.vue';
import {CalendarOutlined, DeleteOutlined, EllipsisOutlined, PlusOutlined, UserOutlined} from '@ant-design/icons-vue';
import { Form, message, Modal } from 'ant-design-vue';
import { format } from 'date-fns';
import { loadLanguageAsync, i18n } from "@/locales/i18n";

const t = i18n.global.t;

defineProps<{
  modelValue?: boolean;
}>();

const router = useRouter();

function useBizList() {
  const modelRef = reactive({
    spinning: {
      global: false,
    },
    dataList: [] as any[],
  });

  const fetchData = async () => {
    modelRef.spinning.global = true;
    const res = await G0001({}).finally(() => (modelRef.spinning.global = false));
    modelRef.dataList = res.data;
  };

  const fetchDel = (item: any) => {
    Modal.confirm({
      title: t('common.tip_title'),
      content: t('common.deleteModalTitle'),
      okText: t('common.ok'),
      cancelText: t('common.cancel'),
      onOk() {
        G0002({ canvas_id: item.id })
          .then(() => {
            message.success(t('message.operated'));
            fetchData();
          })
          .catch(() => {
            message.error(t('message.failed'));
          });
      },
    });
  };

  onMounted(fetchData);
  return { modelRef, fetchData, fetchDel };
}
const { modelRef, fetchDel } = useBizList();

function usePage(router: Router) {
  // 当前窗口跳转
  const toPage = (name: string, params?: RouteParamsGeneric, query?: LocationQueryRaw) => {
    router.push({ name, params: params || {}, query: query || {} });
  };
  return { toPage };
}
const { toPage } = usePage(router);

const modelRt = reactive({
  spinning: false,
  searchParam: '',
  isModalOpen: false,
  name: '',
});
const modelRy = reactive({
  title: '',
});
const useForm = Form.useForm;
const { validate, validateInfos } = useForm(
  modelRy,
  reactive({
    title: [
      {
        required: true,
        message: t('common.required'),
      },
    ],
  }),
);
const addCreateflow = () => {
  modelRt.isModalOpen = true;
};
const handleCancel = () => {};

const handleOk = () => {
  validate()
    .then(async () => {
      let isExist: boolean = false;
      await G0001({ title: modelRy.title }).then((res) => {
        if(res.data.length > 0) {
          isExist = true;
        }
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

      const createParams = {
        title: modelRy.title,
        dsl: {
          answer: [],
          components: {
            begin: {
              downstream: [],
              upstream: [],
              obj: {
                component_name: 'Begin',
                params: {
                  prologue: '\u4f60\u597d\uff01\u6211\u662f\u4f60\u7684\u52a9\u7406\uff0c\u6709\u4ec0\u4e48\u53ef\u4ee5\u5e2e\u5230\u4f60\u7684\u5417\uff1f'
                }
              }
            }
          },
          graph: {
            edges: [],
            nodes: [
              {
                id: 'a5d595cf-382b-4b81-96b3-08ec25bb207f',
                type: 'begin',
                x: 360,
                y: 570,
                properties: {
                  variables: [],
                  desc: '',
                  width: 220,
                  height: 40,
                  rawWidth: 220,
                  rawHeight: 40,
                  component_id: 'begin:a5d595cf-382b-4b81-96b3-08ec25bb207f',
                  data: {
                    key: 'Begin',
                    label: '\u5f00\u59cb_0',
                    value: 'a5d595cf-382b-4b81-96b3-08ec25bb207f',
                    form: {
                      component_name: 'Begin',
                      params: {
                        prologue: '\u4f60\u597d\uff01\u6211\u662f\u4f60\u7684\u52a9\u7406\uff0c\u6709\u4ec0\u4e48\u53ef\u4ee5\u5e2e\u5230\u4f60\u7684\u5417\uff1f'
                      }
                    }
                  }
                }
              }
            ],
          },
          history: [],
          messages: [],
          path: [],
          reference: [],
        }
      }
      let createResp: any;
      await G0004(createParams).then((res) => {
        createResp = {...res.data};
      });

      toPage('Createflow', { title: modelRy.title, id: createResp.id }, { title: modelRy.title, id: createResp.id });
    })
    .catch((error) => {
      console.log('error', error);
    });
};
</script>

<template>
  <BaseContainer>
    <div class="panel h-full w-full flex-1">
      <ScrollArea class="flex h-full">
        <ASpin :spinning="modelRef.spinning.global" size="large">
          <div class="flex items-start px-6">
            <span class="ml-auto"></span>
            <a-button class="flex items-center" type="primary" @click="addCreateflow">
              <template #icon>
                <PlusOutlined />
              </template>
              {{ t('common.create') }}
            </a-button>

          </div>

          <div class="box-border grid grid-cols-1 gap-4 overflow-auto p-10 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <div v-for="(item, index) in modelRef.dataList" :key="index">
              <a-card
                class="m-0 w-full cursor-pointer rounded-lg border border-gray-200 p-0 shadow-sm"
                @click.prevent="toPage('Createflow', { id: item.id }, { id: item.id })"
              >
                <div class="flex h-40 flex-col justify-between">
                  <div class="flex justify-between">
                    <a-avatar class="flex h-8 w-8 items-center justify-center text-base">
                      <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <div class="delete___BGyWn inline-block" @click.stop>
                      <a-dropdown :trigger="['click']">
                        <EllipsisOutlined class="h-6 cursor-pointer text-3xl text-gray-500" />
                        <template #overlay>
                          <a-menu>
                            <a-menu-item key="0" @click="fetchDel(item)">
                              <div>
                                <span style="vertical-align: middle">{{ t('common.delete') }}</span>
                                <DeleteOutlined style="margin-left: 8px; vertical-align: middle" />
                              </div>
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                  </div>
                  <div>
                    <span class="break-all text-2xl font-semibold text-gray-900">{{ item.title }}</span>
                  </div>
                  <div @click="toPage('Createflow', { id: item.id, title: item.title }, { id: item.id, title: item.title })">
                    <div class="flex items-center gap-2">
                      <CalendarOutlined class="text-xl leading-3" />
                      <span> {{ format(item.update_time, 'yyyy/MM/dd HH:mm:ss') }}</span>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
        </ASpin>
      </ScrollArea>

      <a-modal v-model:open="modelRt.isModalOpen" :cancel-text="t('common.cancel_button')" :ok-text="t('common.confirm')" :title="t('flow.createAdvanced')" @cancel="handleCancel" @ok="handleOk">
        <a-form>
          <a-form-item :label="t('flow.name')" name="title" v-bind="validateInfos.title">
            <a-input v-model:value="modelRy.title" :placeholder="t('flow.nameMessage')" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </BaseContainer>
</template>
