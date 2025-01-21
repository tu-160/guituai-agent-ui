<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="设置依次审批顺序" :width="400" @ok="handleSubmit" destroyOnClose class="approvers-sort-modal">
    <div class="approvers-sort-body">
      <ScrollContainer class="list" v-loading="loading">
        <draggable v-model="list" :animation="300" group="selectItem" handle=".option-drag" itemKey="id">
          <template #item="{ element }">
            <div class="selected-item selected-item-user">
              <div class="selected-item-main">
                <a-avatar :size="36" :src="apiUrl + element.headIcon" class="selected-item-headIcon" />
                <div class="selected-item-text">
                  <p class="name">{{ element.fullName }}</p>
                  <p class="organize" :title="element.organize">{{ element.organize }}</p>
                </div>
                <div class="option-drag">
                  <i class="icon-ym icon-ym-darg" />
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </ScrollContainer>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  import { ScrollContainer } from '@/components/Container';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import { getSelectedList } from '@/api/permission/user';

  const emit = defineEmits(['register', 'confirm']);
  const [registerModal, { closeModal }] = useModalInner(init);
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const list = ref<any[]>([]);
  const loading = ref<boolean>(false);

  function init(data) {
    if (!data.ids || !data.ids.length) return;
    loading.value = true;
    list.value = [];
    getSelectedList(data.ids).then(res => {
      list.value = res.data.list || [];
      loading.value = false;
    });
  }
  function handleSubmit() {
    const ids = list.value.map(o => o.id + '--user');
    emit('confirm', ids);
    closeModal();
  }
</script>
<style lang="less">
  .approvers-sort-modal {
    .ant-modal-body > .scrollbar {
      padding: 20px;
    }
    .approvers-sort-body {
      .list {
        height: 360px;
        font-size: 14px;
        border: 1px solid @border-color-base;
        border-radius: @border-radius-base;
        .selected-item {
          width: 100%;
          padding: 0px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          &.selected-item-user {
            &:last-child {
              .selected-item-main {
                border-bottom-color: transparent;
              }
            }
            .selected-item-main {
              border-bottom: 1px solid @border-color-base1;
              display: flex;
              align-items: center;
              height: 50px;
              width: 100%;
              box-sizing: border-box;
            }
            .selected-item-headIcon {
              flex-shrink: 0;
            }
            .selected-item-text {
              min-width: 0;
              flex: 1;
              margin-left: 10px;
              .name {
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                margin-bottom: 2px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .organize {
                height: 17px;
                line-height: 17px;
                color: #999999;
                font-size: 12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          &:hover {
            background-color: @selected-hover-bg;
          }
          span {
            max-width: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .option-drag {
            cursor: move;
            color: #606266;
            .icon-ym-darg {
              font-size: 20px;
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
