<template>
  <component :is="routerType" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { isUrl } from '@/utils/is';
  import { getToken } from '@/utils/auth';
  import { encryptByBase64 } from '@/utils/cipher';
  import { useGlobSetting } from '@/hooks/setting';

  const to = ref('');
  const props = defineProps({
    linkType: { type: String, default: '' },
    urlAddress: { type: String, default: '' },
    linkTarget: { type: String, default: 'self' },
    type: { type: [Number, String], default: 0 },
    propertyJson: { type: String },
  });
  const globSetting = useGlobSetting();

  const getIsUrl = computed(() => {
    return isUrl(to.value);
  });
  const routerType = computed(() => {
    if (!props.linkType || !props.urlAddress) return 'div';
    if (getIsUrl.value) return 'a';
    return 'router-link';
  });

  watch(
    () => {
      props.urlAddress;
    },
    () => {
      if (props.linkType) init();
    },
    {
      deep: true,
    },
  );

  function init() {
    let path = '/' + props.urlAddress;
    if (props.type == 6) {
      let propertyJson = props.propertyJson ? JSON.parse(props.propertyJson) : null,
        moduleId = '';
      if (propertyJson) moduleId = propertyJson.moduleId || '';
      path = `${globSetting.dataVUrl}view/${moduleId}?token=${getToken()}`;
    }
    if (props.type == 7 || props.linkType == '2') {
      if (props.linkTarget === '_self') {
        path = `/externalLink?href=${encodeURIComponent(encryptByBase64(props.urlAddress))}`;
      } else {
        path = props.urlAddress.replace(/\${dataV}/g, globSetting.dataVUrl).replace(/\${futureToken}/g, getToken() as string);
      }
    }
    to.value = path;
  }
  function linkProps(to) {
    if (getIsUrl.value) return { href: to, target: '_blank', rel: 'noopener' };
    return { to: to };
  }

  onMounted(() => {
    if (props.linkType) init();
  });
</script>
