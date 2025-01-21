<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('sys.login.forgetFormTitle')" @ok="handleSubmit">
    <a-form :colon="false" :labelCol="{ style: { width: '80px' } }" :model="dataForm" :rules="dataRule" ref="formElRef">
      <a-form-item label="旧密码" name="oldPassword">
        <a-input-password v-model:value="dataForm.oldPassword" placeholder="旧密码" />
      </a-form-item>
      <a-form-item label="新密码" name="password">
        <a-input-password v-model:value="dataForm.password" placeholder="新密码" />
      </a-form-item>
      <a-form-item label="重复密码" name="password2">
        <a-input-password v-model:value="dataForm.password2" placeholder="重复密码" />
      </a-form-item>
      <a-form-item label="验证码" name="code">
        <a-row>
          <a-col :span="17">
            <a-input v-model:value="dataForm.code" placeholder="验证码" />
          </a-col>
          <a-col :span="6" :offset="1" style="height: 32px">
            <img alt="点击切换验证码" title="点击切换验证码" :src="apiUrl + codeImg" @click="initCodeImg" class="cursor-pointer" />
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  /*import { getSysConfig } from '@/api/system/sysConfig';*/
  // import { updatePassword } from '@/api/permission/userSetting';
  import { useGlobSetting } from '@/hooks/setting';
  import type { FormInstance } from 'ant-design-vue';
  import { encryptByMd5 } from '@/utils/cipher';
  import { useUserStore } from '@/store/modules/user';

  interface State {
    baseForm: any;
    dataForm: any;
    codeImg: string;
    timestamp: number;
    dataRule: any;
  }

  const userStore = useUserStore();
  const validatePass = (_rule, value) => {
    //是否包含数字
    const containsNumbers = /[0-9]+/;
    //是否包含小写字符
    const includeLowercaseLetters = /[a-z]+/;
    //是否包含大写字符
    const includeUppercaseLetters = /[A-Z]+/;
    //是否包含字符
    const containsCharacters = /\W/;
    //是否包含下划线
    const includeUnderline = /_/;
    if (!value) return Promise.reject('新密码不能为空');
    if (state.baseForm.passwordStrengthLimit == 1) {
      if (state.baseForm.passwordLengthMin && value.length < state.baseForm.passwordLengthMinNumber)
        return Promise.reject('新密码长度不能小于' + state.baseForm.passwordLengthMinNumber + '位');
      if (state.baseForm.containsNumbers && !containsNumbers.test(value)) return Promise.reject('新密码必须包含数字');
      if (state.baseForm.includeLowercaseLetters && !includeLowercaseLetters.test(value)) return Promise.reject('新密码必须包含小写字母');
      if (state.baseForm.includeUppercaseLetters && !includeUppercaseLetters.test(value)) return Promise.reject('新密码必须包含大写字母');
      if (state.baseForm.containsCharacters && !containsCharacters.test(value) && !includeUnderline.test(value)) return Promise.reject('新密码必须包含字符');
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
  var validatePass2 = (_rule, value) => {
    if (value !== state.dataForm.password) {
      return Promise.reject('两次密码输入不一致');
    } else {
      return Promise.resolve();
    }
  };
  const state = reactive<State>({
    baseForm: {
      passwordStrengthLimit: 0,
      passwordLengthMin: false,
      passwordLengthMinNumber: 0,
      containsNumbers: false,
      includeLowercaseLetters: false,
      includeUppercaseLetters: false,
      containsCharacters: false,
    },
    dataForm: {
      id: '',
      account: '',
      oldPassword: '',
      password: '',
      password2: '',
      code: '',
    },
    codeImg: '',
    timestamp: 0,
    dataRule: {
      oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
      password: [{ required: true, validator: validatePass, trigger: 'blur' }],
      password2: [
        { required: true, message: '重复密码不能为空', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' },
      ],
      code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
    },
  });
  const { dataForm, codeImg, dataRule } = toRefs(state);
  const formElRef = ref<FormInstance>();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);

  function init(data) {
    resetForm();
    state.dataForm.id = data.id;
    state.dataForm.account = data.account;
    initData();
    initCodeImg();
  }
  function initData() {
    changeLoading(true);
    // getSysConfig()
    //   .then(res => {
    //     state.baseForm = res.data;
    //     state.baseForm.passwordLengthMin = !!state.baseForm.passwordLengthMin;
    //     state.baseForm.containsNumbers = !!state.baseForm.containsNumbers;
    //     state.baseForm.includeLowercaseLetters = !!state.baseForm.includeLowercaseLetters;
    //     state.baseForm.includeUppercaseLetters = !!state.baseForm.includeUppercaseLetters;
    //     state.baseForm.containsCharacters = !!state.baseForm.containsCharacters;
    //     changeLoading(false);
    //   })
    //   .catch(() => {
    //     changeLoading(false);
    //   });
  }
  function initCodeImg() {
    state.timestamp = Math.random();
    state.codeImg = `/api/file/ImageCode/${state.timestamp}`;
  }
  function resetForm() {
    state.dataForm = {
      id: '',
      account: '',
      oldPassword: '',
      password: '',
      password2: '',
      code: '',
    };
  }
  async function handleSubmit() {
    try {
      const values = await formElRef.value?.validate();
      if (!values) return;
      changeOkLoading(true);
      let query = {
        oldPassword: encryptByMd5(state.dataForm.oldPassword),
        password: encryptByMd5(state.dataForm.password),
        code: state.dataForm.code,
        timestamp: state.timestamp,
      };
      // updatePassword(query)
      //   .then(res => {
      //     changeOkLoading(false);
      //     closeModal();
      //     createMessage.success(res.msg).then(() => {
      //       userStore.resetToken();
      //     });
      //   })
      //   .catch(() => {
      //     changeOkLoading(false);
      //   });
    } catch (_) {}
  }
</script>
