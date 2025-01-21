<template>
  <div class="h-full">
    <CodeMirrorEditor :value="getValue" @change="handleValueChange" :mode="mode" :readonly="readonly" ref="editorRef" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { isString } from '@/utils/is';
  import { MODE } from './typing';

  const props = defineProps({
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: {
      type: String as PropType<MODE>,
      default: MODE.JSON,
      validator(value: any) {
        // 这个值必须匹配下列字符串中的一个
        return Object.values(MODE).includes(value);
      },
    },
    readonly: { type: Boolean },
    autoFormat: { type: Boolean, default: true },
  });
  defineExpose({ insert });
  const emit = defineEmits(['change', 'update:value', 'format-error']);
  const editorRef = ref(null);

  const getValue = computed(() => {
    const { value, mode, autoFormat } = props;
    if (!autoFormat || mode !== MODE.JSON) {
      return value as string;
    }
    let result = value;
    if (isString(value)) {
      try {
        result = JSON.parse(value);
      } catch (e) {
        emit('format-error', value);
        return value as string;
      }
    }
    return JSON.stringify(result, null, 2);
  });

  function handleValueChange(v) {
    emit('update:value', v);
    emit('change', v);
  }
  function insert(val, hasBrackets = false) {
    (editorRef.value as any)?.insert(val, hasBrackets);
  }
</script>
