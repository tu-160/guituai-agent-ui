<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { K0005, K0013 } from '@/api/modules/a3';
import { QuestionCircleOutlined, RightSquareTwoTone } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { i18n } from "@/locales/i18n";
const t = i18n.global.t;

defineProps<{
  modelValue?: boolean;
}>();
const labelCol = { span: 24 };
const wrapperCol = { span: 24 };
const modelRef = reactive({
  doc_ids: [],
  similarity_threshold: 0.2,
  vector_similarity_weight: 0.7,
  rerank_id: '',
  top_k: 1024,
  question: '',
  page: 1,
  size: 10,
});

interface Model {
  available: boolean;
  create_date: string;
  create_time: number;
  fid: string;
  llm_name: string;
  max_tokens: number;
  model_type: string;
  status: string;
  tags: string;
  update_date: string;
  update_time: number;
}

interface Option {
  value: string;
  label: string;
  available: boolean;
  create_date?: string;
  create_time?: number;
  fid?: string;
  llm_name?: string;
  max_tokens?: number;
  model_type?: string;
  status?: string;
  tags?: string;
  update_date?: string;
  update_time?: number;
}

interface Result {
  label: string;
  options: Option[];
}

const modelRt = reactive<{ rerankList: Result[] }>({
  rerankList: [],
});
const activeKey = ref([]);

const processData = (data: Record<string, Model[]>): Result[] => {
  const result: Result[] = [];

  for (const [provider, models] of Object.entries(data)) {
    // 过滤出 model_type 为 "rerank" 的模型
    const rerankModels = models.filter((model) => model.model_type === 'rerank' && model.available);

    if (rerankModels.length > 0) {
      const options: Option[] = rerankModels.map((model) => ({
        value: model.llm_name,
        label: model.llm_name,
        available: model.available,
        create_date: model.create_date,
        create_time: model.create_time,
        fid: model.fid,
        llm_name: model.llm_name,
        max_tokens: model.max_tokens,
        model_type: model.model_type,
        status: model.status,
        tags: model.tags,
        update_date: model.update_date,
        update_time: model.update_time,
      }));

      result.push({
        label: provider,
        options,
      });
    }
  }

  return result;
};

const getRerankList = async () => {
  await K0005({}).then((res) => {
    const resData = res.data;
    modelRt.rerankList = processData(resData);
  });
};

const handleOk = async () => {
  await K0013(modelRef)
    .then(() => {
      message.success(t('message.operated'));
    })
    .catch(() => {
      message.error(t('message.failed'));
    });
};
onMounted(() => {
  getRerankList();
});
</script>

<template>
  <div class="mt-4 h-full w-full flex-1 bg-white">
    <div class="flex h-full flex-1 bg-[#f7f8fa]" style="gap: 16px">
      <div class="w-[350px] overflow-auto bg-white p-5">
        <div><b>检索测试</b></div>
        <p>最后一步！ 成功后，剩下的就交给AI吧。</p>
        <a-divider style="margin: 24px 0; border-block-start: 1px solid rgba(5, 5, 5, 0.06)" />
        <div>
          <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item>
              <template #label>
                相似度阈值
                <a-tooltip placement="top">
                  <template #title>
                    <span>
                      我们使用混合相似度得分来评估两行文本之间的距离。 它是加权关键词相似度和向量余弦相似度。
                      如果查询和块之间的相似度小于此阈值，则该块将被过滤掉。
                    </span>
                  </template>
                  <QuestionCircleOutlined style="margin-left: 8px" />
                </a-tooltip>
              </template>
              <a-slider v-model:value="modelRef.similarity_threshold" :max="1" :min="0" :step="0.1" />
            </a-form-item>
            <a-form-item>
              <template #label>
                关键字相似度权重
                <a-tooltip placement="top">
                  <template #title>
                    <span>
                      我们使用混合相似性评分来评估两行文本之间的距离。它是加权关键字相似性和矢量余弦相似性或rerank得分（0〜1）。两个权重的总和为1.0。
                    </span>
                  </template>
                  <QuestionCircleOutlined style="margin-left: 8px" />
                </a-tooltip>
              </template>
              <a-slider v-model:value="modelRef.vector_similarity_weight" :max="1" :min="0" :step="0.1" />
            </a-form-item>
            <a-form-item>
              <template #label>
                Rerank模型
                <a-tooltip placement="top">
                  <template #title>
                    <span> 如果是空的。它使用查询和块的嵌入来构成矢量余弦相似性。否则，它使用rerank评分代替矢量余弦相似性 </span>
                  </template>
                  <QuestionCircleOutlined style="margin-left: 8px" />
                </a-tooltip>
              </template>
              <a-select v-model:value="modelRef.rerank_id" :options="modelRt.rerankList" />
            </a-form-item>
            <a-form-item v-if="modelRef.rerank_id" label="Top-K">
              <a-slider v-model:value="modelRef.top_k" :max="2048" :min="0" :step="1" />
            </a-form-item>
            <a-form-item label="测试文本">
              <a-textarea v-model:value="modelRef.question" :rows="4" />
            </a-form-item>
          </a-form>
          <div style="display: flex; justify-content: end">
            <a-button :disabled="!modelRef.question || true" size="small" type="primary" @click="handleOk">测试</a-button>
          </div>
        </div>
      </div>
      <div class="flex flex-1 flex-col justify-between overflow-auto bg-white p-5 sm:p-8">
        <a-collapse v-model:active-key="activeKey" accordion>
          <template #expandIcon="{ isActive }">
            <RightSquareTwoTone :rotate="isActive ? 90 : 0" :style="{ fontSize: '20px' }" two-tone-color="#7f56d9" />
          </template>
          <a-collapse-panel key="1" header="0/0选定的文件" />
        </a-collapse>
      </div>
    </div>
  </div>
</template>
