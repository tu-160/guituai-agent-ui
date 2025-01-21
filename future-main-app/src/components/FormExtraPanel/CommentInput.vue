<template>
  <div :class="getWrapperClass">
    <div class="comment-input-placeholder" v-if="!commentActive" @click="showCommentInput">请输入</div>
    <div v-if="commentActive">
      <a-textarea
        v-model:value="dataForm.text"
        class="comment-input-wrapper-content"
        placeholder="请输入"
        :autoSize="{ minRows: 4, maxRows: 4 }"
        :maxlength="500"
        showCount
        ref="textRef"
        @input="handleContentChange" />
      <template v-if="dataForm.image.length">
        <div class="comment-img-list">
          <div class="img-item" v-for="(item, i) in dataForm.image" :key="i">
            <img :src="apiUrl + item.url" class="img-item" @click="handlePreview(i)" />
            <div class="badge" @click.stop="handleImgRemove(i)">
              <i class="icon-ym icon-ym-nav-close"></i>
            </div>
          </div>
        </div>
      </template>
      <future-upload-file ref="uploadFileRef" v-model:value="dataForm.file" :limit="9" detailed class="comment-upload-file" />
      <div class="comment-input-wrapper-actions">
        <div class="actions-left">
          <a-tooltip title="选择@用户">
            <i class="icon-ym icon-ym-roll-call" @click="openSelectUser()"></i>
          </a-tooltip>
          <a-upload
            v-model:file-list="state.imgList"
            accept="image/*"
            :show-upload-list="false"
            multiple
            :max-count="9"
            :action="getAction"
            :headers="getHeaders"
            :before-upload="beforeUpload"
            @change="handleChange">
            <a-tooltip title="上传图片">
              <i class="icon-ym icon-ym-comment-img"></i>
            </a-tooltip>
          </a-upload>
          <a-tooltip title="上传附件">
            <i class="icon-ym icon-ym-comment-file" @click="uploadFile"></i>
          </a-tooltip>
          <a-popover placement="topLeft" trigger="click" overlayClassName="emoji-popover" v-model:open="state.popoverVisible">
            <a-tooltip title="表情">
              <i class="icon-ym icon-ym-emoji"></i>
            </a-tooltip>
            <template #content>
              <div class="emojiBox">
                <ul class="emoji">
                  <li v-for="(item, i) in state.emojiList" :key="i" @click="handleSelectEmoji(item)">
                    <img :src="'/resource/emoji/' + item.url" />
                  </li>
                </ul>
              </div>
            </template>
          </a-popover>
        </div>
        <div>
          <a-button @click="hideCommentInput" class="mr-10px">取消</a-button>
          <a-button type="primary" @click="sendComment" :disabled="getSubmitDisabled" :loading="btnLoading">发送</a-button>
        </div>
      </div>
    </div>
    <FlowUserModal :taskId="taskId" @register="registerUserSelectModal" @confirm="handleSelectUser" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, computed, nextTick } from 'vue';
  import { useModal } from '@/components/Modal';
  import FlowUserModal from './modal/FlowUserModal.vue';
  import emojiJson from '@/layouts/default/header/components/chat/emoji.json';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { Upload as AUpload } from 'ant-design-vue';
  import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
  import { createImgPreview } from '@/components/Preview/index';
  import { createComment } from '@/api/workFlow/template';

  interface State {
    commentActive: boolean;
    imgList: UploadFile[];
    emojiList: any[];
    popoverVisible: boolean;
    imgUploading: boolean;
    dataForm: any;
    selectionStart: number;
    selectForm: string;
    btnLoading: boolean;
  }

  const props = defineProps({
    inner: { type: Boolean, default: false },
    taskId: { type: [String, Number], default: '' },
    replyId: { type: String, default: '' },
  });
  const emit = defineEmits(['hideCommentInput', 'reload']);
  const state = reactive<State>({
    commentActive: false,
    imgList: [],
    emojiList: emojiJson,
    popoverVisible: false,
    imgUploading: false,
    dataForm: {
      text: '',
      file: [],
      image: [],
    },
    selectionStart: 0,
    selectForm: '',
    btnLoading: false,
  });
  const { commentActive, dataForm, btnLoading } = toRefs(state);
  const [registerUserSelectModal, { openModal: openUserSelectModal }] = useModal();
  const { createMessage } = useMessage();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const uploadFileRef = ref<any>(null);
  const textRef = ref<any>(null);

  const getAction = computed(() => globSetting.uploadUrl + '/annexpic');
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));
  const getWrapperClass = computed(() => {
    return [
      'comment-input-wrapper',
      {
        'comment-input-wrapper-inner': props.inner,
        'comment-input-wrapper-active': state.commentActive,
      },
    ];
  });
  const getSubmitDisabled = computed(() => !state.dataForm.text);

  function showCommentInput() {
    state.commentActive = true;
    nextTick(() => {
      textRef.value?.focus();
    });
  }
  function hideCommentInput() {
    state.commentActive = false;
    clearAll();
    if (props.inner) emit('hideCommentInput');
  }
  function clearAll() {
    state.btnLoading = false;
    state.dataForm.text = '';
    state.imgList = [];
    state.dataForm.image = [];
    state.dataForm.file = [];
  }
  function sendComment() {
    state.btnLoading = true;
    let query = {
      text: state.dataForm.text,
      file: JSON.stringify(state.dataForm.file),
      image: JSON.stringify(state.dataForm.image),
      taskId: props.taskId,
      replyId: props.replyId,
    };
    createComment(query)
      .then(() => {
        state.btnLoading = false;
        clearAll();
        emit('reload');
      })
      .catch(() => {
        state.btnLoading = false;
      });
  }
  function handleContentChange(e) {
    if (e.data !== '@') return;
    state.selectForm = 'input';
    state.selectionStart = e.target.selectionStart;
    openUserSelectModal(true, {});
  }
  function openSelectUser() {
    state.selectForm = 'btn';
    state.selectionStart = -1;
    openUserSelectModal(true, {});
  }
  function handleSelectUser(data) {
    if (!data || !data.length) return;
    let addContent = state.selectForm === 'btn' ? '@' : '';
    for (let i = 0; i < data.length; i++) {
      let str = (i > 0 ? '@' : '') + `{${data[i].fullName}}`;
      addContent += str;
    }
    if (state.selectionStart === -1) {
      state.dataForm.text += addContent;
      textRef.value.focus();
    } else {
      let oldValue = state.dataForm.text;
      let rangeIndex = state.selectionStart + addContent.length;
      state.dataForm.text = oldValue.slice(0, state.selectionStart) + addContent + oldValue.slice(state.selectionStart);
      setTimeout(() => {
        textRef.value.focus();
        textRef.value?.resizableTextArea?.textArea?.setSelectionRange(rangeIndex, rangeIndex);
      }, 50);
    }
  }
  // 选择表情
  function handleSelectEmoji(item) {
    state.dataForm.text += item.alt;
    state.popoverVisible = false;
    textRef.value.focus();
  }
  function beforeUpload(file) {
    const isTopLimit = state.dataForm.image.length >= 9;
    if (isTopLimit) {
      createMessage.error(`最多可以上传9张图片`);
      return AUpload.LIST_IGNORE;
    }
    const isRightSize = file.size < 10 * 1024 * 1024;
    if (!isRightSize) {
      createMessage.error(`图片大小超过10MB`);
      return AUpload.LIST_IGNORE;
    }
    let isAccept = new RegExp('image/*').test(file.type);
    if (!isAccept) {
      createMessage.error(`请上传图片`);
      return AUpload.LIST_IGNORE;
    }
    return isRightSize && isAccept;
  }
  function handleChange({ file }: UploadChangeParam) {
    if (file.status === 'uploading') return (state.imgUploading = true);
    if (file.status === 'error') {
      state.imgUploading = false;
      state.imgList = state.imgList.filter(o => o.uid != file.uid);
      createMessage.error('上传失败');
      return;
    }
    if (file.status === 'done') {
      state.imgUploading = false;
      if (file.response.code === 200) {
        const isTopLimit = state.dataForm.image.length >= 9;
        if (isTopLimit) {
          createMessage.error(`最多可以上传9张图片`);
          return false;
        }
        state.dataForm.image.push({
          name: file.name,
          fileId: file.response.data.name,
          url: file.response.data.url,
        });
      } else {
        state.imgList = state.imgList.filter(o => o.uid != file.uid);
        createMessage.error(file.response.msg);
      }
    }
  }
  function handleImgRemove(index) {
    state.dataForm.image.splice(index, 1);
    state.imgList.splice(index, 1);
  }
  function handlePreview(index) {
    const imageList = state.dataForm.image.map(o => apiUrl.value + o.url);
    createImgPreview({ imageList: imageList, index });
  }
  function uploadFile() {
    if (state.dataForm.file.length >= 9) return createMessage.error('最多可以上传9个文件');
    uploadFileRef.value?.uploadFile();
  }
</script>
