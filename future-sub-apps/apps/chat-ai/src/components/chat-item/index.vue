<script setup lang="ts">
import { computed, onMounted, onUpdated, reactive, ref } from 'vue';

import { Icon } from '@future-core/icons';
import { Avatar } from '@future-core/shadcn-ui';

import hljs from 'highlight.js';
import { BrainCircuit, User } from 'lucide-vue-next';
import { marked } from 'marked';

import 'highlight.js/styles/a11y-light.min.css';

const props = defineProps<{
  content: string;
  modelValue?: boolean;
  role: 'assistant' | 'user'; // assistant: 机器人, user: 用户
  showCursor?: boolean;
  waiting?: boolean;
}>();

const render = new marked.Renderer();
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
  extensions: {
    renderers: {
      code: (code: any) => {
        // const s =
        //   '"<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;Hello World!&quot;</span>)"';
        const t = hljs.highlight(code.text, { language: 'javaScript' }).value;
        return `<pre class='code'><code class='language ${code.lang}'>${t}</code></pre>`;
      },
    },
    childTokens: {},
  },
});

const html = computed(() => {
  if (props.role === 'user') return props.content;
  return marked(props.content);
});

function getLastTextNode(dom?: HTMLElement) {
  if (!dom) return null;
  const nodes = dom.childNodes;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (node?.nodeType === Node.TEXT_NODE && node.nodeValue && /\S/.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replaceAll(/\s+$/g, '');
      return node;
    } else if (node?.nodeType === Node.ELEMENT_NODE) {
      const textNode: any = getLastTextNode(node as HTMLElement);
      if (textNode) {
        return textNode;
      }
    }
  }
  return null;
}

const contentDomRef = ref<HTMLDivElement>();
const pos = reactive({ x: 0, y: 0 });
function updateCursor() {
  const dom = contentDomRef.value;
  if (!dom) return;
  const lastText = getLastTextNode(dom);
  const textNode = document.createTextNode('\u200B');
  if (lastText) {
    lastText.parentElement?.append(textNode);
  } else {
    dom?.append(textNode);
  }
  const domRect = dom.getBoundingClientRect();

  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, 0);
  const rect = range.getBoundingClientRect();
  pos.x = rect.left - domRect.left;
  pos.y = rect.top - domRect.top;
  textNode.remove();
}

onMounted(updateCursor);
onUpdated(updateCursor);
</script>

<template>
  <div class="conversation-item flex w-full gap-2">
    <div class="w-[40px]">
      <Avatar v-if="props.role === 'assistant'">
        <BrainCircuit />
      </Avatar>
    </div>
    <template v-if="!waiting">
      <div :class="`bg-${props.role}-msg`" class="relative flex-1 items-start rounded-sm">
        <div class="msg relative h-full max-w-full p-2">
          <div ref="contentDomRef" class="markdown block text-left" v-html="html"></div>
          <div v-show="showCursor" class="f-cursor"></div>
        </div>
      </div>
    </template>
    <template v-if="waiting">
      <div class="flex flex-1 items-center justify-start">
        <Icon class="ml-2 text-lg text-[hsl(var(--accent-color))]" icon="svg-spinners:bars-scale-middle" />
      </div>
    </template>
    <div class="w-[40px]">
      <Avatar v-if="props.role === 'user'">
        <User />
      </Avatar>
    </div>
  </div>
</template>

<style lang="scss">
.markdown code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  white-space: break-spaces;
  background-color: hsl(var(--muted));
  border-radius: 6px;
}

.bg-assistant-msg {
  @apply bg-muted/80;
}

.bg-user-msg {
  @apply flex justify-end;

  .msg {
    @apply flex items-center justify-end rounded-sm bg-sky-50/80 p-2;
  }
}

.f-cursor {
  position: absolute;
  top: calc(v-bind('pos.y') * 1px);
  left: calc(v-bind('pos.x') * 1px);
  width: 8px;
  height: 18px;
  content: '';
  background-color: #635f5f;
  opacity: 0;
  transform: translate3d(3px);
  animation: toggle 0.6s infinite;
}

@keyframes toggle {
  30% {
    opacity: 1;
  }
}
</style>
