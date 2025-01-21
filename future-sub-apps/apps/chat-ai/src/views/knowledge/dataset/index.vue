<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';

import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  DictItems,
  parser_configCommon,
  parserComponentShow,
  default_raptor_value,
  type ParserConfig,
  type ParserConfigCommon,
  parserDescriptions,
  type RaptorConfig,
} from '@/utils/Dictionary';
import { K0004, K0006, K0007, k0008, K0009, K00010, K0011 } from '@/api/modules/a3';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  InboxOutlined,
  PlayCircleTwoTone,
  PlusOutlined,
  SearchOutlined,
  StopTwoTone,
  SyncOutlined,
  ToolOutlined,
} from '@ant-design/icons-vue';
import { Form, message, Modal, type TableProps } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps<{
  modelValue?: boolean;
}>();
const route = useRoute();

// 时间戳转换为日月年时分秒
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
interface DataType {
  id: any;
  name: any;
  chunk_num: any;
  create_time: any;
  status: any;
  progress: any;
}

const modelRt = reactive({
  searchParam: '',
  spinning: false,
  columns: [
    {
      title: t('knowledgeDetails.name'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: t('knowledgeDetails.chunkNumber'),
      dataIndex: 'chunk_num',
      key: 'chunk_num',
    },
    {
      title: t('knowledgeDetails.uploadDate'),
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: t('knowledgeDetails.chunkMethod'),
      key: 'analytical',
      dataIndex: 'analytical',
    },
    {
      title: t('knowledgeDetails.enabled'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('knowledgeDetails.parsingStatus'),
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: '',
      key: 'action1',
      width: 50,
    },
    {
      title: t('common.action'),
      dataIndex: 'operation',
      key: 'operation',
      width: 200,
    },
  ],
  data: [],
  pagination: {
    total: 200,
    current: 1,
    pageSize: 10,
  },
  formState: [],
  isModalOpen1: false,
  isModalOpen2: false,
  isModalOpen3: false,
  isOpenAutoKeywordAndQuestion: false,
  id: '',
  parserList: [],
  name: '',
  oldName: '',
  selectList: [] as DataType[],
});

type Key = number | string;

const rowSelection: TableProps['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: DataType[]) => {
    modelRt.selectList = selectedRows;
  },
};

// 设置图标
const getIconSrc = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const iconMap: { [key: string]: string } = {
    doc: '/img/doc.png',
    docx: '/img/doc.png',
    xlsx: '/img/execl.png',
    xls: '/img/execl.png',
    jpg: '/img/Jpg.png',
    pdf: '/img/Pdf.png',
    png: '/img/Png.png',
    tiff: '/img/Tiff.png',
    zip: '/img/Zip.png',
  };
  return iconMap[ext] || '/img/unknownFile.png'; // 默认图标
};

// 初始查询
const searchDataSet = async () => {
  modelRt.spinning = true;
  const query = route.query;
  const params = {
    id: query.id,
    page: modelRt.pagination.current,
    page_size: modelRt.pagination.pageSize,
    orderby: 'create_time',
    desc: 'True',
  };
  await K0004(params)
    .then((res) => {
      modelRt.data = res.data?.docs;
      modelRt.pagination.total = res.data?.total;
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
};

// 表格分页
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  modelRt.pagination.current = pag?.current;
  modelRt.pagination.pageSize = pag?.pageSize;
  searchDataSet();
};
interface Data {
  status: string;
  id: string; // 或者 number，根据实际情况调整
}

// 启用/停用
const changeSwitch = async (data: Data) => {
  const status = data.status === '1' ? 0 : 1;
  const params = {
    doc_id: data.id,
    status,
  };
  modelRt.spinning = true;
  await K0006(params)
    .then(() => {
      message.success(t('message.operated'));
      modelRt.spinning = false;
    })
    .catch(() => {
      modelRt.spinning = false;
    });
  await searchDataSet();
};

const formRef1 = ref();
const formRef2 = ref();
const name = ref();
const useForm = Form.useForm;

const labelCol = { span: 6 };
const wrapperCol = { span: 16 };

const modelRef = reactive({
  name: '',
  avatar: [] as string[],
  description: '',
  language: '',
  permission: '',
  parser_id: '',
  doc_id: '',
  pagerank: 0,
  parser_config: {
    chunk_token_num: 1024,
    auto_keywords: 0, // 自动关键词
    auto_questions: 0, // 自动问题
    delimiter: '',
    html4excel: false,
    layout_recognize: false,
    raptor: {
      use_raptor: false,
      max_cluster: 64,
      max_token: 256,
      prompt: '',
      random_seed: '',
      threshold: '',
    },
  },
});
// 表单校验
const { validate, validateInfos } = useForm(
  modelRef,
  reactive({
    'parser_config.delimiter': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    'parser_config.raptor.use_raptor': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
    'parser_config.raptor.prompt': [
      {
        required: true,
        message: t('common.required'),
      },
    ],
  }),
);

// 解析方法
const openAnalysisDetalis = (list: object) => {
  modelRt.isModalOpen1 = true;
  modelRt.isOpenAutoKeywordAndQuestion = isOpenAutoword[list.parser_id as keyof typeof isOpenAutoword];
  modelRef.doc_id = list.id;
  Object.assign(modelRef, list);
};

const isOpenAutoword = {
  naive: true,
  manual: true,
  paper: true,
  book: true,
  laws: true,
  presentation: true,
  one: true,
};

// 用于根据解析方法的改变还确定是打开自动提示词和自动问题生成两个属性的设置
const parserChange = (value: string, option: any) => {
  modelRt.isOpenAutoKeywordAndQuestion = isOpenAutoword[value as keyof typeof isOpenAutoword];
};

// 编辑
const openEdit = (list: any) => {
  modelRt.id = list.id;
  modelRt.oldName = list.name;
  modelRt.isModalOpen2 = true;
};

// 编辑表单校验
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: t('common.pleaseInput') }],
};

// 解析方法提交
const handleOk1 = () => {
  validate()
    .then(async () => {
      await k0008(modelRef)
        .then(() => {
          message.success(t('message.operated'));
          modelRt.isModalOpen1 = false;
          searchDataSet();
        })
        .catch(() => {
          message.success(t('message.failed'));
        });
    })
    .catch((error) => {
      console.log('error', error);
    });
};

const handleCancel2 = () => {
  modelRt.isModalOpen2 = false;
  formRef2.value.resetFields();
};

// 编辑提交
const handleOk2 = () => {
  formRef2.value
    .validate()
    .then(async () => {
      const fileExtension = modelRt.oldName.split('.').pop() || '';
      const params = {
        doc_id: modelRt.id,
        name: `${modelRt.name}.${fileExtension}`,
      };
      await K0009(params).then(() => {
        message.success(t('message.operated'));
        handleCancel2();
      });
    })
    .catch(() => {
      modelRt.isModalOpen2 = false;
    });
};

// 删除操作
const deleDataset = (item: any) => {
  Modal.confirm({
    title: t('common.tip_title'),
    content: t('common.deleteModalTitle'),
    okText: t('common.ok'),
    cancelText: t('common.cancel'),
    async onOk() {
      const docId: string[] = [];
      docId.push(item.id);
      await K00010({ doc_id: docId })
        .then(() => {
          message.success(t('message.operated'));
          searchDataSet();
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

// 解析方法首字母转换
const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 轮询-查询方法
const UnconsciousQuery = async () => {
  const query = route.query;
  const params = {
    id: query.id,
    page: modelRt.pagination.current,
    page_size: modelRt.pagination.pageSize,
    orderby: 'create_time',
    desc: 'True',
  };
  await K0004(params)
    .then((res) => {
      modelRt.data = res.data?.docs;
      modelRt.pagination.total = res.data?.total;
    })
    .catch(() => {});
};

let pollingInterval: null | number = null;

// 轮询-5秒一次
const startPolling = () => {
  pollingInterval = window.setInterval(UnconsciousQuery, 5000); // 每 5 秒轮询一次
};

// 停止轮询
const stopPolling = () => {
  if (pollingInterval !== null) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const addFile = () => {
  modelRt.isModalOpen3 = true;
};

const fileList = ref<any[]>([]);

const beforeUpload = (file: File) => {
  const isLt1M = file.size <= 100 * 1024 * 1024; // 检查文件大小是否小于等于 1MB
  if (!isLt1M) {
    message.error(`文件 ${file.name} 大小超过 100MB!`);
  }
  return isLt1M;
};

const customRequest = (options: any) => {
  const file = options.file as File;
  // 创建 FileReader 对象
  const reader = new FileReader();
  // 文件读取完成后的回调函数
  reader.addEventListener('load', (e) => {
    const base64 = e.target?.result as string;
    modelRef.avatar.push(base64);
    fileList.value.push(file);
  });
  reader.readAsDataURL(file);
};

const handleChange = (info: any) => {
  // 处理文件上传状态变化
  switch (info.file.status) {
    case 'done': {
      message.success(`${info.file.name}` + t('message.uploaded'));
      break;
    }
    case 'error': {
      message.error(`${info.file.name}` + t('chat.uploadFailed'));
      break;
    }
    case 'removed': {
      // 文件被移除时，从 fileList 和 modelRef.avatar 中移除
      const index = fileList.value.indexOf(info.file);
      if (index !== -1) {
        fileList.value.splice(index, 1);
        modelRef.avatar.splice(index, 1);
      }
      break;
    }
  }
};

const handleRemove = (file: File) => {
  console.log('文件移除', file);
};

const clearFileList = () => {
  fileList.value = [];
};
const handleCancel3 = () => {
  modelRt.isModalOpen3 = false;
  clearFileList();
};

const handleOk3 = async () => {
  if (fileList.value.length === 0) {
    return message.error(t('message.pleaseUploaded'));
  } else {
    const query = route.query;
    const formData = new window.FormData();
    formData.append('kb_id', query.id as string);
    console.log('fileList', fileList.value);
    fileList.value.forEach((file) => {
      formData.append('file', file);
    });
    await K0011(formData)
      .then(() => {
        message.success(t('message.operated'));
        searchDataSet();
        modelRt.isModalOpen3 = false;
        clearFileList();
      })
      .catch(() => {});
  }
};

const qy = async () => {
  const promises = modelRt.selectList.map(async (item) => {
    const params = {
      doc_id: item.id,
      status: 1,
    };
    try {
      await K0006(params);
      return true; // 操作成功
    } catch {
      message.error(t('message.failed'));
      return false; // 操作失败
    }
  });

  const results = await Promise.all(promises);
  const allSuccess = results.every(Boolean);

  if (allSuccess) {
    message.success(t('message.operated'));
    searchDataSet();
  }
};
const jy = async () => {
  const promises = modelRt.selectList.map(async (item) => {
    const params = {
      doc_id: item.id,
      status: 0,
    };
    try {
      await K0006(params);
      return true; // 操作成功
    } catch {
      message.error(t('message.failed'));
      return false; // 操作失败
    }
  });

  const results = await Promise.all(promises);
  const allSuccess = results.every(Boolean);

  if (allSuccess) {
    message.success(t('message.operated'));
    searchDataSet();
  }
};
const qd = async () => {
  const ids = modelRt.selectList.map((item) => item.id);
  const params = {
    doc_ids: ids,
    run: 1,
  };
  await K0007(params)
    .then(() => {
      message.success(t('message.operated'));
      searchDataSet();
    })
    .catch(() => {
      return message.error(t('message.failed'));
    });
};
const qx = async () => {
  const ids = modelRt.selectList.map((item) => item.id);
  const params = {
    doc_ids: ids,
    run: 2,
  };
  await K0007(params)
    .then(() => {
      message.success(t('message.operated'));
      searchDataSet();
    })
    .catch(() => {
      return message.error(t('message.failed'));
    });
};
const sc = () => {
  Modal.confirm({
    title: t('common.tip_title'),
    content: t('common.deleteModalTitle'),
    okText: t('common.ok'),
    cancelText: t('common.cancel'),
    async onOk() {
      const ids = modelRt.selectList.map((item) => item.id);
      await K00010({ doc_id: ids })
        .then(() => {
          message.success(t('message.operated'));
          searchDataSet();
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

// interface ITEM {
//   id: string;
//   progress: number;
//   run: string;
// }

const runQD = async (id: string) => {
  // stopPolling(); // 关闭轮询--模拟数据用 接口接上后去除
  const ids = [];
  ids.push(id);
  const params = {
    doc_ids: ids,
    run: 1,
  };
  await K0007(params)
    .then(async () => {
      message.success(t('message.operated'));
      await searchDataSet();
      // --模拟数据用 接口接上后去除
      // const itemToUpdate = modelRt.data.find((item: ITEM) => item.id === id) as ITEM | undefined;
      // if (itemToUpdate) {
      //   itemToUpdate.progress = 0.004_118_23;
      //   itemToUpdate.run = '1';
      // }
    })
    .catch(() => {
      message.error(t('message.failed'));
    });
};
const runClose = async (id: string) => {
  const ids = [];
  ids.push(id);
  const params = {
    doc_ids: ids,
    run: 2,
  };
  await K0007(params)
    .then(async () => {
      message.success(t('message.operated'));
      await searchDataSet();
      // --模拟数据用 接口接上后去除
      // const itemToUpdate = modelRt.data.find((item: ITEM) => item.id === id) as ITEM | undefined;
      // if (itemToUpdate) {
      //   itemToUpdate.progress = 0;
      //   itemToUpdate.run = '2';
      // }
    })
    .catch(() => {
      message.error(t('message.failed'));
    });
};
const downFile = async (list: DataType) => {
  const bseApi = '';
  const downloadUrl = `${bseApi}/api/v1/document/get/${list.id}`;
  await fetch(downloadUrl, {
    headers: {
      authorization: localStorage.getItem('TOKEN_') || '',
    },
  })
    .then(async (response) => {
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = list.name; // 设置下载文件的名字
      a.click();
      a.remove();
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  searchDataSet();
  startPolling();
});

onUnmounted(() => {
  stopPolling(); // 组件卸载时停止轮询
});
</script>

<template>
  <div class="panel h-full w-full flex-1 bg-white">
    <div class="p-7 pb-0 pt-7">
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">{{t('knowledgeDetails.dataset')}}</p>
      <p>😉 {{t('knowledgeDetails.datasetDescription')}}</p>
      <a-divider dashed style="margin: 24px 0; border-block-start: 1px solid rgba(5, 5, 5, 0.06)" />
      <div class="my-2.5 flex h-8 items-center justify-between py-6">
        <a-dropdown :disabled="modelRt.selectList.length === 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="qy">
                <CheckCircleTwoTone style="vertical-align: middle; margin-right: 8px" two-tone-color="#52c41a" />
                <span style="vertical-align: middle">{{t('knowledgeDetails.enabled')}}</span>
              </a-menu-item>
              <a-menu-item key="2" @click="jy">
                <StopTwoTone style="vertical-align: middle; margin-right: 8px" two-tone-color="#f81d22" />
                <span style="vertical-align: middle">{{t('knowledgeDetails.disabled')}}</span>
              </a-menu-item>
              <a-menu-item key="3" @click="qd">
                <PlayCircleTwoTone style="vertical-align: middle; margin-right: 8px" two-tone-color="#52c41a" />
                <span style="vertical-align: middle">{{t('knowledgeDetails.start')}}</span>
              </a-menu-item>
              <a-menu-item key="4" @click="qx">
                <CloseCircleTwoTone style="vertical-align: middle; margin-right: 8px" two-tone-color="#f81d22" />
                <span style="vertical-align: middle">{{t('knowledgeDetails.runningStatus2')}}</span>
              </a-menu-item>
              <a-menu-item key="5" @click="sc">
                <DeleteOutlined style="vertical-align: middle; margin-right: 8px" />
                <span style="vertical-align: middle">{{t('common.delete')}}</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            {{t('knowledgeDetails.bulk')}}
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-space>
          <a-input v-model:value="modelRt.searchParam" :placeholder="t('knowledgeDetails.searchFiles')">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-button type="primary" @click="addFile">
            <template #icon>
              <PlusOutlined style="vertical-align: middle" />
            </template>
            <span style="vertical-align: middle">{{t('knowledgeDetails.addFile')}}</span>
          </a-button>
        </a-space>
      </div>
      <div>
        <ASpin :spinning="modelRt.spinning" size="large">
          <a-table
            :columns="modelRt.columns"
            :data-source="modelRt.data"
            :pagination="modelRt.pagination"
            :row-key="(record: any) => record.id"
            :row-selection="rowSelection"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <img :src="getIconSrc(record.name)" alt="" class="my-1.25 mx-1.5 inline-block h-6 w-6 align-middle" />
                <a-tooltip placement="top">
                  <template #title>
                    <span>{{ record.name }}</span>
                  </template>
                  <a style="color: #1677ff" @click="downFile(record)">
                    {{ record.name }}
                  </a>
                </a-tooltip>
              </template>
              <template v-if="column.key === 'create_time'">
                {{ formatTimestamp(record.create_time) }}
              </template>
              <template v-if="column.key === 'analytical'">
                <span v-if="record.parser_id === 'naive'">General</span>
                <span v-else>{{ capitalizeFirstLetter(record.parser_id) }}</span>
              </template>
              <template v-if="column.key === 'status'">
                <a-switch :checked="record.status === '1'" @click="() => changeSwitch(record)" />
              </template>
              <template v-if="column.key === 'progress'">
                <a-tag v-if="record.run === '0' && record.progress === 0" color="green">{{t('knowledgeDetails.runningStatus0')}}</a-tag>
                <a-tag v-else-if="record.run === '2' && record.progress === 0" color="warning">{{t('knowledgeDetails.runningStatus2')}}</a-tag>
                <a-tag v-else-if="record.run === '1' && record.progress === 0" color="error">{{t('knowledgeDetails.runningStatus4')}}</a-tag>
                <a-tag v-else-if="record.run === '1' && record.progress !== 0 && record.progress < 1" color="cyan">
                  {{t('knowledgeDetails.runningStatus1')}} {{ (record.progress * 100).toFixed(2) }}%
                </a-tag>
                <a-tag v-else-if="record.run === '3' && record.progress === 1" color="blue">{{t('knowledgeDetails.runningStatus3')}}</a-tag>
              </template>
              <template v-if="column.key === 'action1'">
                <PlayCircleTwoTone
                  v-if="record.run === '0' && record.progress === 0"
                  style="font-size: 18px; vertical-align: middle; margin-right: 8px"
                  two-tone-color="#52c41a"
                  @click="runQD(record.id)"
                />
                <CloseCircleTwoTone
                  v-else-if="record.run === '1' && record.progress !== 0 && record.progress < 1"
                  style="font-size: 18px; vertical-align: middle; margin-right: 8px"
                  two-tone-color="#fba554"
                  @click="runClose(record.id)"
                />
                <SyncOutlined v-else :style="{ fontSize: '18px', verticalAlign: 'middle', color: '#52c41a' }" @click="runQD(record.id)" />
              </template>
              <template v-if="column.key === 'operation'">
                <a-space>
                  <a-dropdown :disabled="record.run === '1' && record.progress !== 0 && record.progress < 1">
                    <a-button type="text">
                      <template #icon>
                        <ToolOutlined :style="{ verticalAlign: 'middle' }" />
                      </template>
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="openAnalysisDetalis(record)">
                          <a href="javascript:;">{{t('knowledgeDetails.chunkMethod')}}</a>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>

                  <a-button :disabled="record.run === '1' && record.progress !== 0 && record.progress < 1" type="text" @click="openEdit(record)">
                    <template #icon>
                      <EditOutlined :style="{ verticalAlign: 'middle' }" />
                    </template>
                  </a-button>
                  <a-button :disabled="record.run === '1' && record.progress !== 0 && record.progress < 1" type="text" @click="deleDataset(record)">
                    <template #icon>
                      <DeleteOutlined :style="{ verticalAlign: 'middle' }" />
                    </template>
                  </a-button>
                  <a-button :disabled="record.run === '1' && record.progress !== 0 && record.progress < 1" type="text" @click="downFile(record)">
                    <template #icon>
                      <DownloadOutlined :style="{ verticalAlign: 'middle' }" />
                    </template>
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </ASpin>
      </div>
    </div>
    <div>
      <a-modal v-model:open="modelRt.isModalOpen1" :cancel-text="t('common.cancel_button')" :ok-text="t('common.confirm')" :title="t('knowledgeDetails.chunkMethod')" @ok="handleOk1">
        <a-form ref="formRef1" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item>
            <template #label> {{t('knowledgeDetails.chunkMethod')}} </template>
            <a-select v-model:value="modelRef.parser_id" :options="DictItems" @change="parserChange" />
          </a-form-item>
          <a-divider />
          <a-form-item v-if="modelRt.isOpenAutoKeywordAndQuestion">
            <template #label>
              {{t('knowledgeDetails.autoKeywords')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeDetails.autoKeywordsTip')}} </span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.auto_keywords" :max="10" :min="0" :step="1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.auto_keywords" :max="10" :min="0" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="modelRt.isOpenAutoKeywordAndQuestion">
            <template #label>
              {{t('knowledgeDetails.autoQuestions')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeDetails.autoQuestionsTip')}} </span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.auto_questions" :max="10" :min="0" :step="1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.auto_questions" :max="10" :min="0" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <template #label>
              {{t('knowledgeConfiguration.chunkTokenNumber')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.chunkTokenNumberTip')}} </span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.chunk_token_num" :max="2048" :min="0" :step="1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.chunk_token_num" :max="2048" :min="0" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label="t('knowledgeDetails.delimiter')" v-bind="validateInfos['parser_config.delimiter']">
            <a-input v-model:value="modelRef.parser_config.delimiter" :placeholder="t('common.pleaseInput')" />
          </a-form-item>
          <a-divider />
          <a-form-item :label-col="{ span: 10 }">
            <template #label>
              {{t('knowledgeConfiguration.useRaptor')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.useRaptorTip')}} </span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-switch v-model:checked="modelRef.parser_config.raptor.use_raptor" />
          </a-form-item>
          <a-form-item v-if="modelRef.parser_config.raptor.use_raptor" v-bind="validateInfos['parser_config.raptor.prompt']">
            <template #label>
              {{t('knowledgeConfiguration.prompt')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.promptTip')}}</span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-textarea v-model:value="modelRef.parser_config.raptor.prompt" :rows="4" />
          </a-form-item>
          <a-form-item v-if="modelRef.parser_config.raptor.use_raptor">
            <template #label>
              {{t('knowledgeConfiguration.maxToken')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.maxTokenTip')}}</span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.raptor.max_token" :max="2048" :min="0" :step="1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.raptor.max_token" :max="2048" :min="0" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="modelRef.parser_config.raptor.use_raptor">
            <template #label>
              {{t('knowledgeConfiguration.threshold')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.thresholdTip')}}</span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.raptor.threshold" :max="1" :min="0" :step="0.1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.raptor.threshold" :max="1" :min="0" :step="0.1" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="modelRef.parser_config.raptor.use_raptor">
            <template #label>
              {{t('knowledgeConfiguration.maxCluster')}}
              <a-tooltip placement="top">
                <template #title>
                  <span> {{t('knowledgeConfiguration.maxClusterTip')}}</span>
                </template>
                <QuestionCircleOutlined style="margin-left: 8px" />
              </a-tooltip>
            </template>
            <a-row>
              <a-col :span="18">
                <a-slider v-model:value="modelRef.parser_config.raptor.max_cluster" :max="1024" :min="0" :step="1" />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="modelRef.parser_config.raptor.max_cluster" :max="1024" :min="0" style="margin-left: 16px" />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item v-if="modelRef.parser_config.raptor.use_raptor" :label="t('knowledgeConfiguration.randomSeed')">
            <a-row>
              <a-col :span="18">
                <a-input-number v-model:value="modelRef.parser_config.raptor.random_seed" :min="0" style="width: 100%" />
              </a-col>
              <a-col :span="6">
                <a-button style="margin-left: 16px" type="primary">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div>
      <a-modal v-model:open="modelRt.isModalOpen2" :cancel-text="t('common.cancel_button')" :ok-text="t('common.confirm')" :title="t('common.rename')" @cancel="handleCancel2" @ok="handleOk2">
        <a-form ref="formRef2" :label-col="labelCol" :model="modelRt" :rules="rules" :wrapper-col="wrapperCol">
          <a-form-item ref="name" :label="t('knowledgeDetails.name')" name="name">
            <a-input v-model:value="modelRt.name" :placeholder="t('common.namePlaceholder')" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div>
      <a-modal v-model:open="modelRt.isModalOpen3" :cancel-text="t('common.cancel_button')" :ok-text="t('common.confirm')" :title="t('fileManager.uploadFile')" @cancel="handleCancel3" @ok="handleOk3">
        <a-upload-dragger
          :before-upload="beforeUpload"
          :custom-request="customRequest"
          :file-list="fileList"
          :multiple="true"
          @change="handleChange"
          @remove="handleRemove"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">{{t('knowledgeDetails.uploadTitle')}}</p>
          <p class="ant-upload-hint">{{t('knowledgeDetails.uploadDescription')}}</p>
        </a-upload-dragger>
      </a-modal>
    </div>
  </div>
</template>
<style>
.ant-modal div[aria-hidden='true'] {
  display: none !important;
}
</style>
