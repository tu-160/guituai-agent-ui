import { PropType } from 'vue';

export type Theme = 'vs' | 'hc-black' | 'vs-dark';
export type FoldingStrategy = 'auto' | 'indentation';
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter';
export type LineNumbersType = 'on' | 'off' | 'relative' | 'interval' | ((lineNumber: number) => string);
export type WordWrapType = 'off' | 'on' | 'wordWrapColumn' | 'bounded';
export interface Options {
  automaticLayout: boolean; // 自适应布局
  foldingStrategy: FoldingStrategy; // 折叠方式  auto | indentation
  renderLineHighlight: RenderLineHighlight; // 行亮
  lineNumbers: LineNumbersType; // 显示行号
  wordWrap: WordWrapType;
  selectOnLineNumbers: boolean;
  minimap: {
    // 关闭小地图
    enabled: boolean;
  };
  readOnly: boolean; // 只读
  fontSize: number; // 字体大小
  scrollBeyondLastLine: boolean; // 取消代码后面一大段空白
  overviewRulerBorder: boolean; // 不要滚动条的边框
}

export const defaultOptions: Options = {
  automaticLayout: true,
  foldingStrategy: 'indentation',
  renderLineHighlight: 'all',
  lineNumbers: 'on',
  wordWrap: 'on',
  selectOnLineNumbers: true,
  minimap: {
    enabled: false,
  },
  readOnly: false,
  fontSize: 14,
  scrollBeyondLastLine: false,
  overviewRulerBorder: false,
};

export const editorProps = {
  modelValue: {
    type: String as PropType<string>,
    default: null,
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  language: {
    type: String as PropType<string>,
    default: 'javascript',
  },
  theme: {
    type: String as PropType<Theme>,
    validator(value: string): boolean {
      return ['vs', 'hc-black', 'vs-dark'].includes(value);
    },
    default: 'vs',
  },
  options: {
    type: Object as PropType<Options>,
    default: () => defaultOptions,
  },
};
