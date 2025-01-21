<template>
  <a-tabs v-model:activeKey="activeKey" class="userInfo-tabs">
    <a-tab-pane key="1" tab="账户信息">
      <a-row>
        <a-col :span="12">
          <a-form :colon="false" labelAlign="right" :labelCol="{ style: { width: '100px' } }" class="pt-10px">
            <a-form-item label="账户">
              <a-input v-model:value="form.account" readonly />
            </a-form-item>
            <a-form-item label="所属组织">
              <a-input v-model:value="form.organize" readonly />
            </a-form-item>
            <a-form-item label="直属主管">
              <a-input v-model:value="form.manager" readonly />
            </a-form-item>
            <a-form-item label="岗位">
              <a-input v-model:value="form.position" readonly />
            </a-form-item>
            <a-form-item label="职级">
              <a-input v-model:value="form.ranks" readonly />
            </a-form-item>
            <a-form-item label="角色">
              <a-input v-model:value="form.roleId" readonly />
            </a-form-item>
            <a-form-item label="注册时间">
              <a-input v-model:value="getCreatorTime" readonly />
            </a-form-item>
            <a-form-item label="上次登录">
              <a-input v-model:value="getPrevLogTime" readonly />
            </a-form-item>
            <a-form-item label="入职日期">
              <a-input v-model:value="getEntryDate" readonly />
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane key="2" tab="个人资料">
      <a-form
        :colon="false"
        labelAlign="right"
        :model="form2"
        :rules="state.form2Rule"
        ref="form2ElRef"
        :labelCol="{ style: { width: '100px' } }"
        class="pt-10px">
        <a-row>
          <a-col :span="12">
            <a-form-item label="姓名" name="realName">
              <a-input v-model:value="form2.realName" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别">
              <future-select v-model:value="form2.gender" :options="genderOptions" placeholder="请选择" :fieldNames="{ value: 'enCode' }" showSearch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="民族">
              <future-select v-model:value="form2.nation" :options="nationOptions" placeholder="请选择" showSearch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="籍贯">
              <a-input v-model:value="form2.nativePlace" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="证件类型">
              <future-select v-model:value="form2.certificatesType" :options="certificatesTypeOptions" placeholder="请选择" showSearch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="证件号码">
              <a-input v-model:value="form2.certificatesNumber" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="文化程度">
              <future-select v-model:value="form2.education" :options="educationOptions" placeholder="请选择" showSearch />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出生年月">
              <future-date-picker v-model:value="form2.birthday" placeholder="请选择" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办公电话">
              <a-input v-model:value="form2.telePhone" :maxlength="20" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办公座机">
              <a-input v-model:value="form2.landline" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号码">
              <a-input v-model:value="form2.mobilePhone" :maxlength="20" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电子邮箱">
              <a-input v-model:value="form2.email" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="紧急联系">
              <a-input v-model:value="form2.urgentContacts" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="紧急电话">
              <a-input v-model:value="form2.urgentTelePhone" :maxlength="50" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="通讯地址">
              <a-input v-model:value="form2.postalAddress" :maxlength="300" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="自我介绍">
              <future-textarea v-model:value="form2.signature" :maxlength="300" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label=" ">
              <a-button type="primary" @click="handleSubmit">保存</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-tab-pane>
    <a-tab-pane key="3" tab="个人签名">
      <a-row class="sign-list" :gutter="40">
        <a-col :span="6" class="sign-item add-sign">
          <div class="sign-item-main">
            <a-dropdown trigger="click">
              <i class="add-icon icon-ym icon-ym-btn-add" @click.prevent></i>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="openSignModal">在线签名</a-menu-item>
                  <a-menu-item key="3">
                    <a-upload :showUploadList="false" accept="image/*" :before-upload="beforeUpload">
                      <div>图片上传</div>
                    </a-upload>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-col>
        <a-col :span="6" class="sign-item" :key="i" v-for="(item, i) in state.signList">
          <div :class="item.isDefault ? 'sign-item-main active' : 'sign-item-main'">
            <img :src="item.signImg" alt="" class="sign-img" />
            <div class="icon-checked" v-if="item.isDefault">
              <check-outlined />
            </div>
            <div v-if="!item.isDefault" class="add-button">
              <a-button size="small" @click="delSign(item.id)" class="mr-10px">删除</a-button>
              <a-button size="small" type="primary" @click="updateDefault(item.id, item.signImg)">设为默认</a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane key="4" tab="审批常用语" class="!p-0px">
      <BasicTable @register="registerTable">
        <template #tableTitle>
          <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()">{{ t('common.addText') }}</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'enabledMark'">
            <a-tag :color="record.enabledMark == 1 ? 'success' : 'error'">{{ record.enabledMark == 1 ? '启用' : '禁用' }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record)" />
          </template>
        </template>
      </BasicTable>
    </a-tab-pane>
  </a-tabs>
  <!-- <SignModal ref="signModalRef" submitOnConfirm @confirm="getSign" /> -->
</template>

<script setup lang="ts">
  // import { updateUserInfo, getSignList, deleteSign, updateDefaultSign, createSign } from '@/api/permission/userSetting';
  import { reactive, toRefs, ref, computed, onMounted, unref } from 'vue';
  import { useBaseStore } from '@/store/modules/base';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from '@/hooks/web/useMessage';
  import type { FormInstance } from 'ant-design-vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  // import SignModal from '@/components/Future/Sign/src/SignModal.vue';
  import { CheckOutlined } from '@ant-design/icons-vue';
  // import { getBase64WithFile } from '@/components/Future/Upload/src/helper';
  // import { getCommonWordsList, delCommonWords } from '@/api/system/commonWords';
  import { BasicTable, useTable, TableAction, BasicColumn, ActionItem } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';

  interface State {
    activeKey: string;
    educationOptions: any[];
    certificatesTypeOptions: any[];
    genderOptions: any[];
    nationOptions: any[];
    signList: any[];
    form: any;
    form2: any;
    form2Rule: any;
  }

  const props = defineProps({
    user: { type: Object, default: () => ({}) },
  });
  const emit = defineEmits(['updateInfo']);
  const baseStore = useBaseStore();
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const form2ElRef = ref<FormInstance>();
  const signModalRef = ref(null);
  const { t } = useI18n();
  const state = reactive<State>({
    activeKey: '1',
    educationOptions: [],
    certificatesTypeOptions: [],
    genderOptions: [],
    nationOptions: [],
    signList: [],
    form: {},
    form2: {
      realName: '',
      signature: '',
      gender: 1,
      nation: '',
      nativePlace: '',
      certificatesType: '',
      certificatesNumber: '',
      education: '',
      birthday: null,
      telePhone: '',
      landline: '',
      mobilePhone: '',
      email: '',
      urgentContacts: '',
      urgentTelePhone: '',
      postalAddress: '',
    },
    form2Rule: {
      realName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    },
  });
  const { activeKey, form, form2, educationOptions, certificatesTypeOptions, genderOptions, nationOptions } = toRefs(state);
  const columns: BasicColumn[] = [
    { title: '常用语', dataIndex: 'commonWordsText' },
    { title: '使用次数', dataIndex: 'usesNum', width: 80, align: 'center' },
    { title: '状态', dataIndex: 'enabledMark', width: 80, align: 'center' },
  ];
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    api: undefined,
    searchInfo: { commonWordsType: 1 },
    columns,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
    },
  });

  const getCreatorTime = computed(() => (state.form.creatorTime ? formatToDateTime(state.form.creatorTime, 'YYYY-MM-DD HH:mm:ss') : ''));
  const getEntryDate = computed(() => (state.form.entryDate ? formatToDateTime(state.form.entryDate, 'YYYY-MM-DD HH:mm:ss') : ''));
  const getPrevLogTime = computed(() => (state.form.prevLogTime ? formatToDateTime(state.form.prevLogTime, 'YYYY-MM-DD HH:mm:ss') : ''));

  async function getOptions() {
    const educationRes = (await baseStore.getDictionaryData('Education')) as any;
    state.educationOptions = educationRes;
    const certificateTypeRes = (await baseStore.getDictionaryData('certificateType')) as any;
    state.certificatesTypeOptions = certificateTypeRes;
    const sexRes = (await baseStore.getDictionaryData('sex')) as any;
    state.genderOptions = sexRes;
    const nationRes = (await baseStore.getDictionaryData('Nation')) as any;
    state.nationOptions = nationRes;
  }
  function getInfo() {
    state.form = props.user;
    for (let key of Object.keys(state.form2)) {
      state.form2[key] = state.form[key];
    }
  }
  function getSign() {
    // getSignList().then(res => {
    //   state.signList = res.data || [];
    // });
  }
  async function handleSubmit() {
    try {
      const values = await form2ElRef.value?.validate();
      if (!values) return;
      // updateUserInfo(state.form2).then(res => {
      //   createMessage.success(res.msg);
      //   emit('updateInfo');
      //   userStore.setUserInfo({ userName: state.form2.realName });
      // });
    } catch (_) {}
  }
  function openSignModal() {
    const signRef = unref(signModalRef) as any;
    signRef?.openModal();
  }
  function beforeUpload(file: File) {
    const isAccept = new RegExp('image/*').test(file.type);
    if (!isAccept) {
      createMessage.error(`请上传图片`);
      return;
    }
    if (file.size / 1024 > 500) {
      createMessage.error('操作失败，图片大小超出500K');
      return;
    }
    // getBase64WithFile(file).then(({ result: thumbUrl }) => {
    //   addSign(thumbUrl);
    // });
    return false;
  }
  function addSign(signImg) {
    const query = {
      signImg: signImg,
      isDefault: 0,
    };
    // createSign(query).then(res => {
    //   createMessage.success(res.msg);
    //   getSign();
    // });
  }
  function updateDefault(id, signImg) {
    // updateDefaultSign(id)
    //   .then(res => {
    //     createMessage.success(res.msg);
    //     userStore.setUserInfo({ signImg: signImg });
    //     getSign();
    //   })
    //   .catch(_ => {
    //     getSign();
    //   });
  }
  function delSign(id) {
    // deleteSign(id).then(res => {
    //   createMessage.success(res.msg);
    //   getSign();
    // });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('common.editText'),
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        label: t('common.delText'),
        color: 'error',
        modelConfirm: {
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, commonWordsType: 1 });
  }
  function handleDelete(id) {
    // delCommonWords(id).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
  }

  onMounted(() => {
    getOptions();
    getInfo();
    getSign();
  });
</script>
<style lang="less">
  .userInfo-tabs {
    .sign-list {
      .sign-item .sign-item-main .icon-checked {
        border: 16px solid @primary-color;
        border-left: 16px solid transparent !important;
        border-top: 16px solid transparent !important;
      }
    }
    .ant-tabs-nav {
      margin: 0;
    }
  }
</style>
<style lang="less" scoped>
  html[data-theme='dark'] {
    .sign-list .sign-item .sign-item-main {
      background-color: #fff;
    }
  }
  .userInfo-tabs {
    height: 100%;
    .ant-tabs-tabpane {
      padding: 10px;
      overflow-x: hidden;
    }
  }
  :deep(.ant-tabs-content-holder) {
    height: calc(100% - 64px);
    overflow: auto;
  }
  .sign-list {
    padding: 20px 50px 0;
    .sign-item {
      margin-bottom: 20px;
      .sign-item-main {
        position: relative;
        height: 160px;
        background-color: @app-content-background;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        overflow: hidden;
        .icon-checked {
          display: block;
          width: 16px;
          height: 16px;
          border-bottom-right-radius: 10px;
          position: absolute;
          right: -1px;
          bottom: -1px;
          .anticon-check {
            position: absolute;
            top: -1px;
            left: -1px;
            font-size: 14px;
            color: #fff;
          }
        }
        &.active {
          border: 1px solid @primary-color;
          box-shadow: 0 0 6px rgba(6, 58, 108, 0.26);
          color: @primary-color;
        }
        &:hover {
          .add-button {
            display: flex;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            background-color: rgba(157, 158, 159, 0.8);
            justify-content: center;
            align-items: center;
          }
        }
        .add-button {
          position: absolute;
          display: none;
        }
        .add-icon {
          font-size: 50px;
          color: @text-color-secondary;
        }
        .sign-img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
