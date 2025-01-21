<script setup lang="ts">
import { ref } from "vue";
import {
  Table,
  Form,
  FormItem,
  Input as AInput,
  Button as AButton,
} from "ant-design-vue";

// 目标是获取数据显示
// 定义组件属性
// 查询功能相关块 表单条件查询/列表展示/分页

const tableDomRef = ref();
function useTableState() {
  const dataSource = ref([
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
  ]);
  const columns = ref([
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address",
    },
  ]);
  return {
    dataSource,
    columns,
  };
}

function useSearchForm() {
  const formState = ref({
    user: "",
    password: "",
  });
  const handleFinish = () => {};
  const handleFinishFailed = () => {};
  return {
    formState,
    handleFinish,
    handleFinishFailed,
  };
}

const { dataSource, columns } = useTableState();
const { formState, handleFinish, handleFinishFailed } = useSearchForm();
</script>

<template>
  <div>
    <div>
      <Form
        layout="inline"
        :model="formState"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <form-item>
          <a-input v-model:value="formState.user" placeholder="Username">
            <template #prefix
              ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </form-item>
        <form-item>
          <a-input
            v-model:value="formState.password"
            type="password"
            placeholder="Password"
          >
            <template #prefix
              ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
            /></template>
          </a-input>
        </form-item>
        <form-item>
          <a-button
            type="primary"
            html-type="submit"
            :disabled="formState.user === '' || formState.password === ''"
          >
            Log in
          </a-button>
        </form-item>
      </Form>
    </div>

    <Table ref="tableDomRef" :dataSource="dataSource" :columns="columns">
    </Table>
  </div>
</template>

<style lang="less"></style>
