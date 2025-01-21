<template>
  <div class="qrcode-form enter-x">
    <div class="qrcode-title">{{ t('sys.login.qrCodeTip') }}</div>
    <div class="qrcode-content">
      <QRCode :value="qrCodeText" :size="240" :bordered="false" bgColor="#ffffff" color="#000" />
      <div class="qrcode-mask" v-if="qrCodeStatus !== 'active'">
        <div class="qrcode-mask-main" v-loading="qrCodeStatus === 'loading'">
          <div class="qrcode-scanned" v-if="qrCodeStatus === 'scanned'">
            <div class="qrcode-icon">
              <CheckOutlined />
            </div>
            <p class="qrcode-tip">{{ t('sys.login.scanSuccessful') }}</p>
            <p class="qrcode-tip">{{ t('sys.login.confirmLogin') }}</p>
          </div>
          <div class="qrcode-expired" v-if="qrCodeStatus === 'expired'">
            <div class="qrcode-icon expired-icon">
              <ExclamationOutlined />
            </div>
            <p class="qrcode-tip">{{ t('sys.login.expired') }}</p>
            <p class="qrcode-tip link-text" @click="reset">{{ t('sys.login.refreshCode') }}</p>
          </div>
        </div>
      </div>
      <div class="qrcode-bottom" v-if="qrCodeStatus === 'scanned'">
        <span class="link-text" @click="goBack">{{ t('sys.login.recoverCode') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, onUnmounted, nextTick } from 'vue';
  import { QRCode } from 'ant-design-vue';
  import { CheckOutlined, ExclamationOutlined } from '@ant-design/icons-vue';
  import { getCodeCertificate, getCodeCertificateStatus, setCodeCertificateStatus } from '@/api/basic/user';
  import { useUserStore } from '@/store/modules/user';
  import { useRouter } from 'vue-router';
  import { PageEnum } from '@/enums/pageEnum';
  import { useI18n } from '@/hooks/web/useI18n';

  interface State {
    qrCodeText: string;
    qrCodeStatus: string;
    ticket: string;
    timer: any;
  }

  const { t } = useI18n();
  const userStore = useUserStore();
  const router = useRouter();
  const state = reactive<State>({
    qrCodeText: '',
    // active/expired/scanned/loading
    qrCodeStatus: 'loading',
    ticket: '',
    timer: null,
  });
  const { qrCodeText, qrCodeStatus } = toRefs(state);

  function reset() {
    clearTimer();
    state.ticket = '';
    state.qrCodeStatus = 'loading';
    getCodeCertificate().then(res => {
      state.ticket = res?.data || '';
      if (!res?.data) return;
      const data = { t: 'login', id: res.data };
      state.qrCodeText = JSON.stringify(data);
      state.qrCodeStatus = 'active';
      state.timer = setInterval(() => {
        handleGetStatus();
      }, 1000);
    });
  }
  function handleGetStatus() {
    getCodeCertificateStatus(state.ticket).then(res => {
      if (res.data.status === 0) return;
      if (res.data.status === 1) {
        state.qrCodeStatus = 'scanned';
        return;
      }
      clearTimer();
      if (res.data.status === -1) {
        state.qrCodeStatus = 'expired';
        return;
      }
      // 登录成功
      if (res.data.status === 2) {
        userStore.updateToken(res.data.value);
        nextTick(() => {
          router.push(PageEnum.BASE_HOME);
        });
        return;
      }
    });
  }
  function goBack() {
    setCodeCertificateStatus(state.ticket, '-1').then(() => {
      reset();
    });
  }
  function clearTimer() {
    if (!state.timer) return;
    clearInterval(state.timer);
    state.timer = null;
  }

  onMounted(() => {
    reset();
  });
  onUnmounted(() => {
    clearTimer();
  });
</script>
