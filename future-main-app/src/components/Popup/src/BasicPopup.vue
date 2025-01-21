<template>
  <div :class="getWrapperClass" v-if="openRef">
    <PopupHeader v-bind="getProps" @close="onClose" @ok="handleOk">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </PopupHeader>
    <div :class="prefixCls + '-body'">
      <ScrollContainer :style="getScrollContentStyle" v-loading="getLoading" :loading-tip="loadingText || t('common.loadingText')">
        <div :style="getBodyStyle">
          <slot></slot>
        </div>
      </ScrollContainer>
    </div>
  </div>
</template>
<script lang="ts">
  import type { PopupInstance, PopupProps } from './typing';
  import type { CSSProperties } from 'vue';
  import { defineComponent, ref, computed, watch, unref, nextTick, getCurrentInstance } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isFunction, isNumber } from '@/utils/is';
  import { deepMerge } from '@/utils';
  import PopupHeader from './components/PopupHeader.vue';
  import { ScrollContainer } from '@/components/Container';
  import { basicProps } from './props';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useAttrs } from '@/hooks/core/useAttrs';

  export default defineComponent({
    components: { ScrollContainer, PopupHeader },
    inheritAttrs: false,
    props: basicProps,
    emits: ['open-change', 'ok', 'close', 'register'],
    setup(props, { emit }) {
      const openRef = ref(false);
      const fullScreenRef = ref(false);
      const attrs: any = useAttrs({ excludeDefaultKeys: false });
      const propsRef = ref<Partial<Nullable<PopupProps>>>(null);

      const { t } = useI18n();
      const { prefixCls } = useDesign('basic-popup');

      const popupInstance: PopupInstance = {
        setPopupProps: setPopupProps,
        emitOpen: undefined,
      };

      const instance = getCurrentInstance();

      instance && emit('register', popupInstance, instance.uid);

      const getMergeProps = computed((): PopupProps => {
        return deepMerge(props, unref(propsRef)) as any;
      });

      const getProps = computed((): PopupProps => {
        const opt = {
          ...unref(attrs),
          ...unref(getMergeProps),
          open: unref(openRef),
        };
        return opt as unknown as PopupProps;
      });

      const getBindValues = computed((): PopupProps => {
        return {
          ...attrs,
          ...unref(getProps),
        };
      });
      const getWrapperClass = computed(() => {
        return [
          prefixCls,
          unref(attrs).class,
          {
            'fullscreen-popup': !!unref(fullScreenRef),
          },
        ];
      });

      const getBodyStyle = computed((): CSSProperties => {
        const { width, zIndex } = unref(getProps);
        return {
          zIndex,
          width: !width ? '100%' : isNumber(width) ? `${width}px` : width,
          margin: '0 auto',
        };
      });
      const getScrollContentStyle = computed((): CSSProperties => {
        return {
          position: 'relative',
          height: `100%`,
        };
      });

      const getLoading = computed(() => {
        return !!unref(getProps)?.loading;
      });

      watch(
        () => props.open,
        (newVal, oldVal) => {
          if (newVal !== oldVal) openRef.value = newVal;
        },
        { deep: true },
      );

      watch(
        () => openRef.value,
        open => {
          nextTick(() => {
            if (open) fullScreenRef.value = !!props.defaultFullscreen;
            emit('open-change', open);
            instance && popupInstance.emitOpen?.(open, instance.uid);
          });
        },
      );

      // Cancel event
      async function onClose(e: Recordable) {
        const { closeFunc } = unref(getProps);
        emit('close', e);
        if (closeFunc && isFunction(closeFunc)) {
          const res = await closeFunc();
          openRef.value = !res;
          return;
        }
        openRef.value = false;
      }

      function setPopupProps(props: Partial<PopupProps>): void {
        // Keep the last setPopupProps
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
        if (Reflect.has(props, 'open')) {
          openRef.value = !!props.open;
        }
        if (Reflect.has(props, 'defaultFullscreen')) {
          fullScreenRef.value = !!props.defaultFullscreen;
        }
      }

      function handleOk() {
        emit('ok');
      }

      return {
        openRef,
        onClose,
        t,
        prefixCls,
        getMergeProps: getMergeProps as any,
        getBodyStyle,
        getScrollContentStyle,
        getProps: getProps as any,
        getWrapperClass,
        getLoading,
        getBindValues,
        handleOk,
      };
    },
  });
</script>
<style lang="less">
  @header-height: 60px;
  @prefix-cls: ~'@{namespace}-basic-popup';
  @prefix-cls-body: ~'@{namespace}-basic-popup-body';

  .@{prefix-cls} {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: @component-background;
    z-index: 300;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &.full-popup {
      .@{prefix-cls-body}{
        & > .scrollbar {
         & > .scrollbar__bar {
             display: none !important;
         }
         & > .scrollbar__wrap {
           & > .scrollbar__view {
            height: 100%;
            overflow: hidden;
            padding: 0;
            & > div{
              height: 100%;
            }
          }
         }
        }
      }
    }
    &.fullscreen-popup{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }
    .word-form{
      margin-bottom: 0;
    }

    .@{prefix-cls-body} {
      flex: 1;
      height: calc(100% - @header-height);
      padding: 0;
      background-color: @component-background;
      overflow: hidden;

       & > .scrollbar > .scrollbar__wrap {
        margin-bottom: 0 !important;
        & > .scrollbar__view {
          padding: 10px 0;
        }
      }

      > .scrollbar > .scrollbar__bar.is-horizontal {
        display: none;
      }
    }
  }
</style>
