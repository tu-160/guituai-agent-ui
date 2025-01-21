<template>
  <ScrollContainer>
    <a-form :colon="false" :model="tenantInfo" ref="formElRef" :labelCol="{ style: { width: '100px' } }">
      <a-row>
        <a-col :span="24">
          <future-group-title content="租户信息" class="mb-20px" />
        </a-col>
        <a-col :span="12">
          <a-form-item label="租户名称">
            <p>{{ tenantInfo.tenantName }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="租户号">
            <p>{{ tenantInfo.tenantId }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="有效期">
            <p>{{ tenantInfo.validTime }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="域名">
            <p>{{ tenantInfo.domain }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <future-group-title content="单位信息" class="mb-20px" />
        </a-col>
        <a-col :span="12">
          <a-form-item label="单位简称">
            <p>{{ tenantInfo.unitInfoJson.unitShortName }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="信用代码">
            <p>{{ tenantInfo.unitInfoJson.unitCreditCode }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="单位性质">
            <p>{{ getUnitNature(tenantInfo.unitInfoJson.unitNature) }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="详细地址">
            <p>{{ tenantInfo.unitInfoJson.unitAddress }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="单位简介">
            <p>{{ tenantInfo.unitInfoJson.unitDescription }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <future-group-title content="联系人信息" class="mb-20px" />
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系人">
            <p>{{ tenantInfo.userInfoJson.contacts }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系电话">
            <p>{{ tenantInfo.userInfoJson.contactPhone }}</p>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系邮箱">
            <p>{{ tenantInfo.userInfoJson.contactEmail }}</p>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </ScrollContainer>
</template>
<script setup lang="ts">
  import { ScrollContainer } from '@/components/Container';

  defineProps({
    tenantInfo: { type: Object, default: () => ({}) },
  });

  function getUnitNature(val) {
    if (val == 0) return '个体户';
    if (val == 1) return '合伙企业';
    if (val == 2) return '集体企业';
    if (val == 3) return '私营企业';
    if (val == 4) return '国有企业';
  }
</script>
