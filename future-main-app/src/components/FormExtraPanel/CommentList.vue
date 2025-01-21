<template>
  <div class="form-extra-comment">
    <ScrollContainer v-loading="loading" ref="infiniteBody" class="form-extra-comment-main">
      <div class="form-extra-comment-list">
        <div v-for="(item, i) in list" :key="i" class="form-extra-comment-item">
          <div class="form-extra-comment-item-main">
            <a-avatar :size="24" :src="apiUrl + item.creatorUserHeadIcon" class="comment-avatar" />
            <div class="comment-content">
              <div class="comment-head">
                <p class="username">
                  {{ item.creatorUser }}
                  <span v-if="item.replyUser">
                    <span class="replay-separate">回复</span>
                    {{ item.replyUser }}
                    <a-tooltip>
                      <template #title>
                        <div v-html="item.replyText"></div>
                      </template>
                      <i class="icon-ym icon-ym-chat"></i>
                    </a-tooltip>
                  </span>
                </p>
              </div>
              <p class="comment-text" v-html="item.isDel == 2 ? '该评论已被删除' : item.text"></p>
              <div class="comment-other" v-if="item.isDel != 2 && (item.imageList?.length || item.fileList?.length)">
                <div class="comment-img-list" v-if="item.imageList?.length">
                  <img
                    :src="apiUrl + cItem.url"
                    class="comment-img-item"
                    v-for="(cItem, ci) in item.imageList"
                    :key="ci"
                    @click="handlePreview(item.imageList, ci)" />
                </div>
                <div class="comment-file-List" v-if="item.fileList?.length">
                  <future-upload-file v-model:value="item.fileList" detailed disabled />
                </div>
              </div>
              <div class="comment-actions">
                <span class="time">{{ item.creatorTime }}</span>
                <div v-if="item.isDel != 2">
                  <a-popconfirm title="确定删除该评论？" @confirm="handleDel(item.id)" v-if="item.isDel == 1">
                    <a-button type="link" color="error">删除</a-button>
                  </a-popconfirm>
                  <a-button type="link" class="ml-10px" @click="handleReply(item, i)">回复</a-button>
                </div>
              </div>
            </div>
          </div>
          <CommentInput inner :taskId="taskId" :replyId="item.id" v-if="item.commentActive" @hideCommentInput="item.commentActive = false" @reload="init" />
        </div>
      </div>
      <future-empty v-if="!list.length" />
    </ScrollContainer>
    <div class="form-extra-comment-list-footer">
      <CommentInput :taskId="taskId" @reload="init" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getCommentList, delComment } from '@/api/workFlow/template';
  import { ref, reactive, toRefs, onMounted } from 'vue';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGlobSetting } from '@/hooks/setting';
  import { createImgPreview } from '@/components/Preview/index';
  import CommentInput from './CommentInput.vue';
  import emojiJson from '@/layouts/default/header/components/chat/emoji.json';
  import { formatToDateTime } from '@/utils/dateUtil';

  interface State {
    list: any[];
    loading: boolean;
    listQuery: any;
  }

  const props = defineProps({
    taskId: { type: [String, Number], default: '' },
  });

  const { createMessage } = useMessage();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const state = reactive<State>({
    list: [],
    loading: false,
    listQuery: {
      currentPage: 1,
      pageSize: 100000,
      sort: 'desc',
      sidx: '',
    },
  });
  const { list, loading } = toRefs(state);

  function handleReply(item, index) {
    item.commentActive = true;
    for (let i = 0; i < state.list.length; i++) {
      if (i != index) state.list[i].commentActive = false;
    }
  }
  function handleDel(id) {
    delComment(id).then(res => {
      createMessage.success(res.msg);
      init();
    });
  }
  function handlePreview(list, index) {
    const imageList = list.map(o => apiUrl.value + o.url);
    createImgPreview({ imageList: imageList, index });
  }
  function replaceEmoji(str) {
    if (!str) return '';
    //替换表情符号为图片
    let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, item => {
      let obj = '';
      for (let i = 0; i < emojiJson.length; i++) {
        let row = emojiJson[i];
        if (row.alt == item) {
          obj = `<img src="/resource/emoji/${row.url}" class="comment-text-emoji" />`;
          break;
        }
      }
      return obj || str;
    });
    str = replacedStr;
    return str;
  }
  function init() {
    if (!props.taskId) return;
    state.loading = true;
    const query = { ...state.listQuery, taskId: props.taskId };
    getCommentList(query)
      .then(res => {
        const list = res.data.list.map(o => ({
          ...o,
          text: replaceEmoji(o.text),
          replyText: replaceEmoji(o.replyText),
          fileList: o.file ? JSON.parse(o.file) : [],
          imageList: o.image ? JSON.parse(o.image) : [],
          creatorTime: formatToDateTime(o.creatorTime),
        }));
        state.list = list;
        state.loading = false;
      })
      .catch(() => {
        state.loading = false;
      });
  }

  onMounted(() => {
    init();
  });
</script>
