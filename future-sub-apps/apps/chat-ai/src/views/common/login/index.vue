<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';

import { provide, reactive, ref } from 'vue';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@future-core/shadcn-ui';

import { C0006 } from '@/api/modules/a2';
import { useUserStore } from '@/store/modules/useUserStore';
import { encryptPassword } from '@/utils/EncryptionUtils';
import { Form, message } from 'ant-design-vue';

const useForm = Form.useForm;
const labelCol = { span: 24 };
const wrapperCol = { span: 24 };
const signLabelCol = { span: 6 };
const signWrapperCol = { span: 18 };
// 获取 userStore
const userStore = useUserStore();
// const isOpen = ref(false);

// const openModal = () => {
//   isOpen.value = !isOpen.value;
// };

const id = '';

provide('DISMISSABLE_MODAL_ID', id);

const modelRef = reactive({
  nickname: '',
  password: '',
});
const { validate, validateInfos } = useForm(
  modelRef,
  reactive({
    account: [
      {
        required: true,
        message: '必录项',
      },
    ],
    password: [
      {
        required: true,
        message: '必录项',
      },
    ],
  }),
);
const onSubmit = () => {
  validate()
    .then(() => {
      const params = {
        nickname: modelRef.nickname,
        password: encryptPassword(modelRef.password),
      };
      userStore.logIn(params);
    })
    .catch((error) => {
      console.log('error', error);
    });
};
const signFormRef = ref();

const modelRt = reactive({
  show: false,
  signLogin: false,
  nickname: '',
  password: '',
  password2: '',
  email: '',
});

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    // eslint-disable-next-line prefer-promise-reject-errors, unicorn/no-useless-promise-resolve-reject
    return Promise.reject('请重新输入密码!');
  } else if (value === modelRt.password) {
    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
    return Promise.resolve();
  } else {
    // eslint-disable-next-line prefer-promise-reject-errors, unicorn/no-useless-promise-resolve-reject
    return Promise.reject('两次密码不一致!');
  }
};

const rules: Record<string, Rule[]> = {
  nickname: [{ required: true, message: '请录入用户名', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请录入密码', trigger: ['blur', 'change'] }],
  password2: [{ validator: validatePass2, trigger: 'change' }],
  email: [{ required: true, type: 'email', message: '邮箱格式错误', trigger: ['blur', 'change'] }],
};

const onSign = () => {
  signFormRef.value.validate().then(async () => {
    modelRt.signLogin = true;
    const params = {
      nickname: modelRt.nickname,
      password: encryptPassword(modelRt.password),
      email: modelRt.email,
    };
    await C0006(params)
      .then(() => {
        message.success('注册成功！');
        signFormRef.value.resetFields();
        modelRt.signLogin = false;
        modelRt.show = !modelRt.show;
      })
      .catch((error) => {
        message.error(error);
        modelRt.signLogin = false;
      });
  });
};

const signOrLogin = () => {
  modelRt.show = !modelRt.show;
};

// watch(
//   () => userStore.showLoginModal,
//   (newValue) => {
//     if (newValue) {
//       openModal();
//     }
//   },
// );
</script>
<template>
  <Dialog :modal="false" :open="userStore.showLoginModal" disable-close @update:open="() => userStore.openLoginModal">
    <DialogContent
      :modal="true"
      :open="userStore.showLoginModal"
      :show-close="false"
      class="border-border left-0 right-0 top-[20vh] mx-auto flex max-h-[80%] w-[650px] flex-col border sm:max-w-[650px]"
    >
      <DialogTitle class="text-left" />
      <DialogDescription />
      <div v-if="!modelRt.show" class="flex items-center justify-center">
        <div class="w-full max-w-xl">
          <div class="flex flex-col gap-6 md:flex-row">
            <!-- 二维码部分 -->
            <div class="flex w-full items-center justify-center md:w-1/2">
              <div class="mx-auto w-full max-w-sm rounded-full p-4">
                <!-- 这里放置实际的二维码图片 -->
                <!-- <img alt="QR Code" class="h-auto max-w-full" src="https://bpic.588ku.com/element_origin_min_pic/19/04/09/5964d9f6a2c5d844c5a4070e31216fed.jpg" /> -->
                <!-- active:正常;expired:过期;loading:等待;scanned:已扫描; -->
                <div class="mx-8 h-auto max-w-full">
                  <a-qrcode status="active" value="https://bpic.588ku.com/element_origin_min_pic/19/04/09/5964d9f6a2c5d844c5a4070e31216fed.jpg" />
                </div>

                <!-- 二维码下面的两行文字 -->
                <div class="mt-4 text-center">
                  <p class="text-lg font-semibold">欢迎使用微信登录</p>
                  <p class="text-sm text-gray-600">请使用手机微信扫码登录</p>
                </div>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="hidden md:block md:h-auto md:w-1 md:border-l md:border-gray-300"></div>

            <!-- 表单部分 -->
            <div class="w-full md:w-1/2">
              <h2 class="text-center text-xl font-semibold text-gray-900 md:text-left">欢迎登录</h2>
              <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="账号" v-bind="validateInfos.nickname">
                  <a-input v-model:value="modelRef.nickname" placeholder="请录入" />
                </a-form-item>
                <a-form-item label="密码" v-bind="validateInfos.password">
                  <a-input-password v-model:value="modelRef.password" placeholder="请录入" />
                </a-form-item>
                <div class="flex justify-center md:justify-start">
                  <a-button :loading="userStore.loginLoading" class="w-full" type="primary" @click="onSubmit">登录</a-button>
                </div>
                <div class="mt-4 text-right">
                  <p class="text-sm text-gray-500">还没有账号？<a class="font-medium text-blue-600 hover:underline" @click="signOrLogin">立即注册</a></p>
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="modelRt.show" class="flex items-center justify-center">
        <div class="w-full max-w-xl">
          <div class="flex flex-col gap-6 md:flex-row">
            <div class="flex w-full items-center justify-center md:w-1/2">
              <div class="mx-auto w-full max-w-sm rounded-full p-4">
                <div class="mt-4 text-center">
                  <p class="text-lg font-semibold">已有账号？</p>
                  <a-button class="w-full" ghost type="primary" @click="signOrLogin">返回登录</a-button>
                </div>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="hidden md:block md:h-auto md:w-1 md:border-l md:border-gray-300"></div>

            <!-- 表单部分 -->
            <div class="w-full md:w-1/2">
              <h2 class="text-center text-xl font-semibold text-gray-900 md:text-left">欢迎注册</h2>
              <a-form ref="signFormRef" :label-col="signLabelCol" :model="modelRt" :rules="rules" :wrapper-col="signWrapperCol">
                <a-form-item label="用户名" name="nickname">
                  <a-input v-model:value="modelRt.nickname" placeholder="请录入" />
                </a-form-item>
                <a-form-item has-feedback label="密码" name="password">
                  <a-input v-model:value="modelRt.password" autocomplete="off" type="password" />
                </a-form-item>
                <a-form-item has-feedback label="确认密码" name="password2">
                  <a-input v-model:value="modelRt.password2" autocomplete="off" type="password" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                  <a-input v-model:value="modelRt.email" placeholder="请录入" />
                </a-form-item>
                <div class="flex justify-center md:justify-start">
                  <!-- <button
                    class="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-medium leading-5 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                    @click.prevent="onSign"
                  >
                    注册
                  </button> -->
                  <a-button :loading="modelRt.signLogin" class="w-full" type="primary" @click="onSign">注册</a-button>
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
