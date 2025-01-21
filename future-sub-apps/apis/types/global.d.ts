import type { ComponentPublicInstance, ComponentRenderProxy, FunctionalComponent, VNode, VNodeChild, PropType as VuePropType } from 'vue';

declare global {
  declare type Recordable<T = any> = Record<string, T>;
  const __APP_INFO__: {
    lastBuildTime: string;
    pkg: {
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
      name: string;
      version: string;
    };
  };
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  declare type Nullable<T> = null | T;
  declare type NonNullable<T> = T extends null | undefined ? never : T;
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  declare type Indexable<T = any> = {
    [key: string]: T;
  };
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  declare type TimeoutHandle = ReturnType<typeof setTimeout>;
  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  declare interface WheelEvent {
    path?: EventTarget[];
  }

  declare interface ViteEnv {
    VITE_BUILD_COMPRESS: 'brotli' | 'gzip' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_CDN: string;
    VITE_DROP_CONSOLE: boolean;
    VITE_GENERATE_UI: string;
    VITE_GLOB_APP_SHORT_NAME: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_PORT: number;
    VITE_PROXY: [string, string][];
    VITE_PUBLIC_PATH: string;
    VITE_USE_CDN: boolean;
    VITE_USE_PWA: boolean;
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  declare function parseInt(s: number | string, radix?: number): number;

  declare function parseFloat(string: number | string): number;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }

  // vue
  declare type PropType<T> = VuePropType<T>;
  declare type VueNode = JSX.Element | VNodeChild;
}

declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
