<template>
  <div :class="[prefixCls, { fullscreen }]">
    <!-- a-form-item-rest避免点击label触发图片上传 -->
    <a-form-item-rest>
      <Upload
        name="file"
        multiple
        @change="handleChange"
        :action="getAction"
        :before-upload="beforeUpload"
        :showUploadList="false"
        accept=".jpg,.jpeg,.gif,.png,.webp">
        <a-button type="link" v-bind="{ ...getButtonProps }">
          {{ t('component.upload.imgUpload') }}
        </a-button>
      </Upload>
    </a-form-item-rest>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { Upload } from 'ant-design-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useGlobSetting } from '@/hooks/setting';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { getToken } from '@/utils/auth';
  import { urlToBase64 } from '@/utils/file/base64Conver';
  // import { checkImgType, getBase64WithFile } from '@/components/Future/Upload/src/helper';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['uploading', 'done', 'error', 'insert'],
    setup(props, { emit }) {
      let uploading = false;

      const { uploadUrl, apiUrl } = useGlobSetting();
      const { createMessage } = useMessage();
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });
      const getAction = computed(() => uploadUrl + '/annexpic');
      const getHeaders = computed(() => ({ Authorization: getToken() as string }));

      function beforeUpload(file: File) {
        // if (!checkImgType(file)) {
        //   createMessage.error('请上传图片');
        //   return false;
        // }

        console.log('getBase64WithFile');
        // getBase64WithFile(file).then(({ result: thumbUrl }) => {
        //   emit('insert', thumbUrl);
        // });
        return false;
      }
      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        const url = file?.response?.data?.url;
        const name = file?.name;
        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          urlToBase64(apiUrl + url).then(base64 => {
            emit('done', name, base64);
          });
          uploading = false;
        } else if (status === 'error') {
          emit('error');
          uploading = false;
        }
      }

      return {
        prefixCls,
        handleChange,
        beforeUpload,
        getAction,
        getHeaders,
        t,
        getButtonProps,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
