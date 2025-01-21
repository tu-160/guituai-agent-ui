<script setup lang="ts">
import { reactive, ref } from 'vue';

import { Button, Dialog, DialogContent } from '@future-core/shadcn-ui';

import { Form } from 'ant-design-vue';

const useForm = Form.useForm;
const labelCol = { span: 24 };
const wrapperCol = { span: 24 };

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = !isOpen.value;
};

const modelRef = reactive({
  loginName: '',
  password: '',
});
const { validate, validateInfos } = useForm(
  modelRef,
  reactive({
    loginName: [
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
    .then((res) => {
      console.log(res, toRaw(modelRef));
    })
    .catch((error) => {
      console.log('error', error);
    });
};
</script>

<template>
  <Button @click="openModal"> 1Edit Profile111 </Button>

  <Dialog :modal="false" :open="isOpen" disable-close @update:open="() => openModal">
    <DialogContent
      :modal="true"
      :open="isOpen"
      :show-close="false"
      class="border-border left-0 right-0 top-[20vh] mx-auto flex max-h-[80%] w-[650px] flex-col border sm:max-w-[650px]"
    >
      <div class="flex items-center justify-center">
        <div class="w-full max-w-xl">
          <div class="flex flex-col gap-6 md:flex-row">
            <!-- 二维码部分 -->
            <div class="flex w-full items-center justify-center md:w-1/2">
              <div class="mx-auto w-full max-w-sm rounded-full p-4">
                <!-- 这里放置实际的二维码图片 -->
                <img alt="QR Code" class="h-auto max-w-full" src="https://s21.ax1x.com/2024/11/14/pAgBx4P.png" />
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
              <!-- <form class="mt-6">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700" for="username">用户名</label>
                  <input
                    id="username"
                    autocomplete="off"
                    class="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="请输入用户名"
                    type="text"
                  />
                </div>
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700" for="password">密码</label>
                  <input
                    id="password"
                    autocomplete="off"
                    class="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="请输入密码"
                    type="password"
                  />
                </div>
                <div class="flex justify-center md:justify-start">
                  <button
                    class="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-medium leading-5 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                  >
                    登录
                  </button>
                </div>
                <div class="mt-4 text-center md:text-left">
                  <p class="text-sm text-gray-500">还没有账号？<a class="font-medium text-blue-600 hover:underline" href="#">立即注册</a></p>
                </div>
              </form> -->

              <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="账号" v-bind="validateInfos.loginName">
                  <a-input v-model:value="modelRef.loginName" placeholder="请录入" />
                </a-form-item>
                <a-form-item label="密码" v-bind="validateInfos.password">
                  <a-input v-model:value="modelRef.password" placeholder="请录入" />
                </a-form-item>
                <div class="flex justify-center md:justify-start">
                  <button
                    class="w-full rounded-md bg-blue-600 px-6 py-3 text-sm font-medium leading-5 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                    @click.prevent="onSubmit"
                  >
                    登录
                  </button>
                </div>
                <div class="mt-4 text-right">
                  <p class="text-sm text-gray-500">还没有账号？<a class="font-medium text-blue-600 hover:underline" href="">立即注册</a></p>
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
<style scoped>
.qr-code {
  position: relative;
  width: 227.9px;
  height: 227.56px;
  background: #f4f4f4;
  margin: auto;
  margin-bottom: 10px px;
  margin-top: 40px;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.qrcode-img {
  width: 100%;
  height: 100%;
}
</style>
