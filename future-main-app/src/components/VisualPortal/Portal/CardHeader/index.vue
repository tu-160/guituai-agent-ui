<template>
  <div class="portal-common-title" :style="{ background: card.titleBgColor }">
    <div
      class="title"
      :style="{
        color: card.titleFontColor,
        'font-size': card.titleFontSize + 'px',
        'justify-content': card.titleLeft,
        'font-weight': card.titleFontWeight ? 'bolder' : 'normal',
      }">
      <i :class="card.cardIcon" :style="{ color: card.cardIconColor || '#000' }"></i>
      <span>{{ title }}</span>
    </div>
    <web-link
      v-if="card.cardRightBtn"
      :linkType="card.linkType"
      :urlAddress="card.urlAddress"
      :linkTarget="card.linkTarget"
      :type="card.type"
      :propertyJson="card.propertyJson">
      <a-button class="button" type="link">{{ card.cardRightBtn }}</a-button>
    </web-link>
  </div>
</template>
<script lang="ts" setup>
  import webLink from '../Link/index.vue';

  defineProps(['title', 'card']);
</script>
