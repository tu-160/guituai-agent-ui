<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import {
  List as AList,
  ListItem as AListItem,
  ListItemMeta as AListItemMeta,
  Avatar as AAvatar,
  Dropdown as ADropdown,
  Menu as AMenu,
  MenuItem as AMenuItem,
} from "ant-design-vue";

import { EllipsisOutlined } from "@ant-design/icons-vue";
import type { ListSize } from "ant-design-vue/es/list";

const props = defineProps({
  data: {
    type: [Array, Function],
    default: () => ({}),
  },
  defaultData: {},
});

// 处理组件属性
function useProps() {
  const defaultConfig = {
    split: false,
    size: "small" as ListSize,
  };

  const computeFinalProps = computed(() => {
    const attr = useAttrs();
    return {
      ...defaultConfig,
      ...props,
      ...attr,
      dataSource: props.data as Array<any>,
    };
  });

  return {
    computeFinalProps,
  };
}

 
const { computeFinalProps } = useProps();
</script>

<template>
  <AList class="future-list" v-bind="computeFinalProps">
    <template #renderItem="{ item, index }">
      <AListItem>
        <div class="future-list-item">
          <div class="future-list-item-avatar"></div>
          <div class="future-list-item-content">
            <h4 class="future-list-item-content-title">
              {{ item.title }}
            </h4>
            <div class="future-list-item-content-desc">
              {{ item.dateStr }}
            </div>
          </div>
          <div class="future-list-item-action">
            <ADropdown :trigger="['click']">
              <div class="icon-btn more" :class="{ 'active': index === 1}">
                <EllipsisOutlined />
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;">1st menu item</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">2nd menu item</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">3rd menu item</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </ADropdown>
          </div>
        </div>
      </AListItem>
    </template>
  </AList>
</template>

<style lang="less">
.btn-hover {
  &:hover {
    background-color: #ddeaff;
  }
}

.future-list {
  &--avatar {
    &__center {
      margin-top: auto;
      margin-bottom: auto;
    }
  }

  .ant-list-item-meta-avatar {
    margin-top: auto;
    margin-bottom: auto;
  }

  .ant-list-item {
    .btn-hover();
  }

  .action-btn {
    position: absolute;
  }
}

.future-list-item {
  display: flex;
  width: 100%;

  &-avatar {
    width: 20px;
    height: 20px;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin-top: auto;
    margin-bottom: auto;
  }

  &-content {
    flex: 1;
    margin-left: 16px;
    max-width: calc(100% - 60px);

    &-title {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &-desc {
      font-size: 14px;
      font-weight: 400;
    }
  }

  &-action {
    margin-top: auto;
    margin-bottom: auto;
    display: none;
  }

  &:hover {
    .future-list-item-action {
      display: block;
    }
  }
}

.icon-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 6px;

  &:hover {
    background-color: #f0f0f0;
  }
}

.active {
  display: block !important;
}
</style>
