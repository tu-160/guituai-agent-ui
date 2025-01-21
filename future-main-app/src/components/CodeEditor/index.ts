import { withInstall } from '@/utils';
import codeEditor from './src/CodeEditor.vue';
import monacoEditor from './src/monacoEditor/MonacoEditor.vue';
import jsonPreview from './src/json-preview/JsonPreview.vue';

export const CodeEditor = withInstall(codeEditor);
export const MonacoEditor = withInstall(monacoEditor);
export const JsonPreview = withInstall(jsonPreview);

export * from './src/typing';
