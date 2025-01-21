<template>
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      :fullscreen="fullscreen"
      @uploading="handleImageUploading"
      @done="handleDone"
      @insert="handleInsertImg"
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled" />
    <textarea :id="tinymceId" ref="elRef" :style="{ visibility: 'hidden' }" v-if="!initOptions.inline"></textarea>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/charmap';
  import 'tinymce/plugins/imagetools';
  import 'tinymce/plugins/help';
  import 'tinymce/plugins/quickbars';
  import 'tinymce/plugins/importcss';
  import 'tinymce/plugins/toc';
  import 'tinymce/plugins/emoticons';

  import { defineComponent, computed, nextTick, ref, unref, watch, onDeactivated, onBeforeUnmount } from 'vue';
  import ImgUpload from './ImgUpload.vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '@/hooks/core/onMountedOrActivated';
  import { useDesign } from '@/hooks/web/useDesign';
  import { isNumber } from '@/utils/is';
  import { useLocale } from '@/locales/useLocale';
  import { useAppStore } from '@/store/modules/app';
  import { useDebounceFn } from '@vueuse/core';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: () => ({}),
    },
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    toolbar: {
      type: [String, Array] as PropType<string | string[]>,
      default: toolbar,
    },
    plugins: {
      type: [String, Array] as PropType<string | string[]>,
      default: plugins,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'FutureEditor',
    components: { ImgUpload },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:value', 'inited', 'init-error'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<Nullable<Editor>>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');

      const appStore = useAppStore();

      const debounceUpdateEditor = useDebounceFn(updateEditor, 300);

      const tinymceContent = computed(() => props.value);

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        return ['zh_CN', 'en_US'].includes(lang) ? lang : 'zh_CN';
      });

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins, placeholder } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          menubar: 'file edit insert view format table',
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: true,
          paste_data_images: true, // 允许粘贴图像
          auto_focus: undefined,
          skin: skinName.value,
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css: publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          setup: (editor: Editor) => {
            editorRef.value = editor;
            editor.on('init', e => initSetup(e));
          },
          deprecation_warnings: false,
          placeholder,
        };
      });

      const disabled = computed(() => {
        const { options } = props;
        const getDisabled = (options && Reflect.get(options, 'readonly')) || attrs.disabled;
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getDisabled ? 'readonly' : 'design');
        }
        return !!getDisabled || false;
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        },
      );
      watch(
        () => editorRef.value,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        },
      );
      watch(
        () => appStore.getDarkMode,
        () => {
          updateEditor();
        },
      );
      watch(
        () => props.placeholder,
        () => {
          debounceUpdateEditor();
        },
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destroy();
      });

      onDeactivated(() => {
        destroy();
      });

      function destroy() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector!);
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce
          .init(unref(initOptions))
          .then(editor => {
            emit('inited', editor);
          })
          .catch(err => {
            emit('init-error', err);
          });
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.value || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (editor && typeof val === 'string' && val !== prevVal && val !== editor.getContent({ format: attrs.outputFormat })) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val || '', prevVal);
          },
          {
            immediate: true,
          },
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:value', content);
          emit('change', content);
        });

        editor.on('FullscreenStateChanged', e => {
          fullscreen.value = e.state;
        });
      }

      function handleInsertImg(url: string) {
        const editor = unref(editorRef);
        if (!editor || !url) {
          return;
        }
        editor.execCommand('mceInsertContent', false, `<img src="${url}"/>`);
        const content = editor?.getContent() ?? '';
        setValue(editor, content);
      }

      function handleImageUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
        const content = editor?.getContent() ?? '';
        setValue(editor, content);
      }

      function handleDone(name: string, url: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const content = editor?.getContent() ?? '';
        const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
        setValue(editor, val);
      }

      function getUploadingImgName(name: string) {
        return `[uploading:${name}]`;
      }
      function updateEditor() {
        destroy();
        initEditor();
      }

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        handleInsertImg,
        handleImageUploading,
        handleDone,
        editorRef,
        fullscreen,
        disabled,
      };
    },
  });
</script>

<style lang="less" scoped></style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
