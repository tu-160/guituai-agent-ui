import { i18n } from "@/locales/i18n";

import { provide, inject, onMounted, reactive, type Ref } from 'vue';

import { K0005 } from '@/api/modules/a3';

export interface ILlm {
    frequency_penalty?: number;
    llm_id: string;
    max_tokens?: number;
    message_history_window_size?: number;
    presence_penalty?: number;
    temperature?: number;
    top_p?: number;
}

export interface Model1 {
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

export interface Option {
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

export interface Result {
    label: string;
    options: Option[];
}

export var modelRy = reactive<{ rerankList: Result[], chatList: Result[]
    , embeddingList: Result[]
    , ttsList: Result[]
    , image2textList: Result[]
    , speech2textList: Result[] }>({
    rerankList: [],
    chatList: [],
    embeddingList: [],
    ttsList: [],
    image2textList: [],
    speech2textList: [],
});

export const processData = (data: Record<string, Model1[]>, type: string): Result[] => {
    const result: Result[] = [];

    for (const [provider, models] of Object.entries(data)) {
        // 过滤出 model_type 为 "rerank" 的模型
        const rerankModels = models.filter((model) => model.model_type === type && model.available);

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

// export const getRerankList = async () => {
//     await K0005({}).then((res) => {
//         const resData = res.data;
//         modelRy.rerankList = processData(resData, "rerank");
//     });
// };

export async function getModelList () {
    try {
        // 使用 await 等待 K0005 的 Promise 解析
        const res = await K0005({});
        modelRy.rerankList = processData(res.data, 'rerank');
        modelRy.chatList = processData(res.data, 'chat');
        modelRy.embeddingList = processData(res.data, 'embedding');
        modelRy.ttsList = processData(res.data, 'tts');
        modelRy.image2textList = processData(res.data, 'image2text');
        modelRy.speech2textList = processData(res.data, 'speech2text');
    } catch (error) {
        console.error("Failed to fetch rerank list", error);
    }
    return modelRy;
};
