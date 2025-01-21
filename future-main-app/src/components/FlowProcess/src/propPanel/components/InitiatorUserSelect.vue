<template>
  <div :class="[$attrs.class, 'select-tag-list']" v-if="buttonType === 'button'">
    <a-button preIcon="icon-ym icon-ym-btn-add" @click="openSelectModal">{{ modalTitle }}</a-button>
    <div class="tags">
      <a-tag class="!mt-10px" :closable="!disabled" v-for="(item, i) in options" :key="item.id" @close="onTagClose(i)">{{ item.fullName }}</a-tag>
    </div>
  </div>
  <a-select v-bind="getSelectBindValue" v-model:value="innerValue" :options="options" @change="onChange" @click="openSelectModal" v-else />
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    :width="800"
    class="transfer-modal"
    @ok="handleSubmit"
    centered
    destroyOnClose
    :maskClosable="false"
    :keyboard="false">
    <template #closeIcon>
      <ModalClose :canFullscreen="false" @cancel="handleCancel" />
    </template>
    <div class="transfer__body">
      <div class="transfer-pane left-pane">
        <div class="transfer-pane__tool">
          <a-input-search :placeholder="t('common.enterKeyword')" allowClear v-model:value="pagination.keyword" @search="handleSearch" />
        </div>
        <div class="transfer-pane__body transfer-pane__body-tab">
          <div class="custom-title">全部数据</div>
          <ScrollContainer v-loading="loading && pagination.currentPage === 1" ref="infiniteBody">
            <div v-for="item in ableList" :key="item.id" class="selected-item selected-item-user" @click="handleNodeClick(item)">
              <div class="selected-item-main">
                <a-avatar :size="36" :src="apiUrl + item.headIcon" class="selected-item-headIcon" />
                <div class="selected-item-text">
                  <p class="name">{{ item.fullName }}</p>
                  <p class="organize" :title="item.organize">{{ item.organize }}</p>
                </div>
              </div>
            </div>
            <future-empty v-if="!ableList.length" />
          </ScrollContainer>
        </div>
      </div>
      <div class="transfer-pane right-pane">
        <div class="transfer-pane__tool">
          <span>已选</span>
          <span class="remove-all-btn" @click="removeAll">清空列表</span>
        </div>
        <div class="transfer-pane__body">
          <ScrollContainer>
            <div v-for="(item, i) in selectedData" :key="i" class="selected-item selected-item-user">
              <div class="selected-item-main">
                <a-avatar :size="36" :src="apiUrl + item.headIcon" class="selected-item-headIcon" />
                <div class="selected-item-text">
                  <p class="name">{{ item.fullName }}</p>
                  <p class="organize" :title="item.organize">{{ item.organize }}</p>
                </div>
                <delete-outlined class="delete-btn" @click="removeData(i)" />
              </div>
            </div>
            <future-empty v-if="!selectedData.length" />
          </ScrollContainer>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { getUserInfoList } from '@/api/permission/user';
  import { getSubFlowUserList } from '@/api/workFlow/template';
  import { Form, Modal as AModal } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { computed, ref, unref, watch, reactive, nextTick } from 'vue';
  import { ScrollContainer, ScrollActionType } from '@/components/Container';
  import ModalClose from '@/components/Modal/src/components/ModalClose.vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useAttrs } from '@/hooks/core/useAttrs';
  import { cloneDeep, pick } from 'lodash-es';

  defineOptions({ name: 'CandidateUserSelect', inheritAttrs: false });
  const props = defineProps({
    value: { type: [String, Array] as PropType<String | string[]> },
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择' },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
    size: String,
    buttonType: { type: String as PropType<'' | 'select' | 'button' | undefined>, default: 'select' },
    modalTitle: { type: String, default: '添加发起人' },
    flowId: { type: String, default: '' },
    nodeCode: { type: String, default: '' },
    formData: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['update:value', 'change', 'labelChange']);
  const attrs: any = useAttrs({ excludeDefaultKeys: false });
  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const visible = ref(false);
  const innerValue = ref<string | any[] | undefined>([]);
  const pagination = reactive({
    keyword: '',
    currentPage: 1,
    pageSize: 20,
  });
  const finish = ref<boolean>(false);
  const infiniteBody = ref<Nullable<ScrollActionType>>(null);
  const ableList = ref<any[]>([]);
  const options = ref<any[]>([]);
  const loading = ref(false);
  const selectedData = ref<any[]>([]);
  const formItemContext = Form.useInjectFormItemContext();

  const getSelectBindValue = computed(() => ({
    ...pick(props, ['placeholder', 'disabled', 'size', 'allowClear']),
    fieldNames: { label: 'fullName', value: 'id' },
    open: false,
    mode: props.multiple ? 'multiple' : '',
    showSearch: false,
    showArrow: true,
    class: unref(attrs).class ? 'w-full ' + unref(attrs).class : 'w-full',
  }));

  watch(
    () => props.value,
    () => {
      setValue();
    },
    { immediate: true },
  );

  function setValue() {
    if (!props.value || !props.value.length) {
      innerValue.value = props.multiple ? [] : undefined;
      options.value = [];
      selectedData.value = [];
      emit('labelChange', '');
      return;
    }
    const ids = props.multiple ? (props.value as any[]) : [props.value];
    getUserInfoList(unref(ids)).then(res => {
      const selectedList: any[] = res.data.list;
      const innerIds = selectedList.map(o => o.id);
      innerValue.value = props.multiple ? innerIds : innerIds[0];
      options.value = cloneDeep(selectedList);
      selectedData.value = cloneDeep(selectedList);
      const labels = selectedData.value.map(o => o.fullName).join();
      emit('labelChange', labels);
    });
  }
  function onChange(_val, option) {
    selectedData.value = option ?? [];
    handleSubmit();
  }
  function onTagClose(i) {
    selectedData.value.splice(i, 1);
    handleSubmit();
  }
  function openSelectModal() {
    if (props.disabled) return;
    visible.value = true;
    pagination.keyword = '';
    pagination.currentPage = 1;
    ableList.value = [];
    finish.value = false;
    nextTick(() => {
      bindScroll();
      handleSearch();
      setValue();
    });
  }
  function handleCancel() {
    visible.value = false;
  }
  function handleSearch() {
    ableList.value = [];
    pagination.currentPage = 1;
    finish.value = false;
    getAbleList();
  }
  function bindScroll() {
    const bodyRef = infiniteBody.value;
    const vBody = bodyRef?.getScrollWrap();
    vBody?.addEventListener('scroll', () => {
      if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 200 && !loading.value && !finish.value) {
        pagination.currentPage += 1;
        getAbleList();
      }
    });
  }
  function handleNodeClick(data) {
    const boo = selectedData.value.some(o => o.id === data.id);
    if (boo) return;
    props.multiple ? selectedData.value.push(data) : (selectedData.value = [data]);
  }
  function removeAll() {
    selectedData.value = [];
  }
  function removeData(index: number) {
    selectedData.value.splice(index, 1);
  }
  function handleSubmit() {
    const ids = unref(selectedData).map(o => o.id);
    options.value = unref(selectedData);
    innerValue.value = props.multiple ? ids : ids[0];
    if (props.multiple) {
      emit('update:value', ids);
      emit('change', ids, unref(options));
    } else {
      emit('update:value', ids[0]);
      emit('change', ids[0], unref(options)[0]);
    }
    formItemContext.onFieldChange();
    handleCancel();
  }
  function getAbleList() {
    loading.value = true;
    const query = {
      ...pagination,
      ...props.formData,
      nodeCode: props.nodeCode,
    };
    getSubFlowUserList(props.flowId, query).then(res => {
      if (res.data.list.length < pagination.pageSize) finish.value = true;
      ableList.value = [...ableList.value, ...res.data.list];
      loading.value = false;
    });
  }
</script>
