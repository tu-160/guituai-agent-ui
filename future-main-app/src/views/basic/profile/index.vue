<template>
  <div class="future-content-wrapper profile-wrapper bg-white">
    <a-tabs v-model:activeKey="activeKey" tab-position="left" class="common-left-tabs profile-left-tabs" destroyInactiveTabPane>
      <a-tab-pane key="user" tab="个人资料">
        <UserInfo :user="user" @updateInfo="getInfo" />
      </a-tab-pane>
      <a-tab-pane key="tenantInfo" tab="租户信息" v-if="isTenant">
        <TenantInfo :tenantInfo="tenantInfo" />
      </a-tab-pane>
      <a-tab-pane key="password" tab="修改密码">
        <Password />
      </a-tab-pane>
      <a-tab-pane key="line" disabled></a-tab-pane>
      <a-tab-pane key="organize" tab="我的组织">
        <future-group-title content="我的组织" helpMessage="用户可以自行切换组织信息，我的组织默认只能进行单选" />
        <div class="organize-list">
          <a-row :gutter="80" v-if="state.organizeList.length">
            <a-col :span="12" class="organize-item" v-for="(item, i) in state.organizeList" :key="i">
              <div class="organize-item-main" :class="{ active: state.activeOrganize === item.id }" @click="changeMajor(item.id, 'Organize')">
                <i class="icon-ym icon-ym-organization"></i>
                <p class="organize-name">{{ item.fullName }}</p>
                <p class="btn">默认</p>
                <div class="icon-checked">
                  <check-outlined />
                </div>
              </div>
            </a-col>
          </a-row>
          <!-- <future-empty v-else /> -->
        </div>
      </a-tab-pane>
      <a-tab-pane key="position" tab="我的岗位">
        <future-group-title content="我的岗位" helpMessage="用户可以自行切换我的组织内的岗位信息，我的岗位默认只能进行单选" />
        <div class="organize-list">
          <a-row :gutter="80" v-if="state.positionList.length">
            <a-col :span="12" class="organize-item" v-for="(item, i) in state.positionList" :key="i">
              <div class="organize-item-main" :class="{ active: state.activePosition === item.id }" @click="changeMajor(item.id, 'Position')">
                <i class="icon-ym icon-ym-wf-outgoingApply"></i>
                <p class="organize-name">{{ item.fullName }}</p>
                <p class="btn">主岗</p>
                <div class="icon-checked">
                  <check-outlined />
                </div>
              </div>
            </a-col>
          </a-row>
          <!-- <future-empty v-else /> -->
        </div>
      </a-tab-pane>
      <a-tab-pane key="subordinate" tab="我的下属">
        <future-group-title content="我的下属" />
        <div class="subordinate-list">
          <BasicTree ref="subTreeRef" :treeData="state.subordinateList" :load-data="loadData">
            <template #title="item">
              <a-card class="subordinate-tree-node" shadow="never" slot-scope="{ data }">
                <a-avatar :size="50" :src="apiUrl + item.avatar"></a-avatar>
                <div class="text">
                  <p>{{ item.userName }}</p>
                  <p class="user-text">{{ item.department }}{{ item.position ? '/' + item.position : '' }}</p>
                </div>
              </a-card>
            </template>
          </BasicTree>
        </div>
      </a-tab-pane>
      <a-tab-pane key="justAuth" tab="绑定设置" v-if="getUseSocials">
        <JustAuth />
      </a-tab-pane>
      <a-tab-pane key="authorize" tab="系统权限">
        <Authorize />
      </a-tab-pane>
      <a-tab-pane key="sysLog" tab="登录日志">
        <SysLog />
      </a-tab-pane>
      <template #leftExtra>
        <div class="head">
          <a-upload
            :showUploadList="false"
            :action="uploadUrl + '/userAvatar'"
            class="avatar-uploader"
            :headers="getHeaders"
            accept="image/*"
            :before-upload="beforeUpload"
            @change="handleChange">
            <div class="avatar-box">
              <a-avatar :size="50" :src="apiUrl + user.avatar" class="avatar" v-if="user.avatar" />
              <div class="avatar-hover">更换头像</div>
            </div>
          </a-upload>
          <span class="username">{{ user.realName }}</span>
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  // import { getUserSettingInfo, getSubordinate, updateAvatar, getUserOrganizes, getUserPositions, setMajor } from '@/api/permission/userSetting';
  import { reactive, toRefs, ref, computed, onMounted, watch, unref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { useGlobSetting } from '@/hooks/setting';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getToken } from '@/utils/auth';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { createLocalStorage } from '@/utils/cache';
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { BasicTree, TreeActionType } from '@/components/Tree';
  import UserInfo from './components/UserInfo.vue';
  import TenantInfo from './components/TenantInfo.vue';
  import Password from './components/Password.vue';
  import JustAuth from './components/JustAuth.vue';
  import Authorize from './components/Authorize.vue';
  import SysLog from './components/SysLog.vue';

  interface State {
    activeKey: string;
    user: any;
    tenantInfo: any;
    isTenant: boolean;
    userLoading: boolean;
    loading: boolean;
    nodeId: string;
    subordinateList: any[];
    organizeList: any[];
    positionList: any[];
    activeOrganize: string;
    activePosition: string;
  }

  const { createMessage } = useMessage();
  const ls = createLocalStorage();
  const userStore = useUserStore();
  const globSetting = useGlobSetting();
  const apiUrl = ref(globSetting.apiUrl);
  const uploadUrl = ref(globSetting.uploadUrl);
  const subTreeRef = ref<Nullable<TreeActionType>>(null);
  const state = reactive<State>({
    activeKey: '',
    user: {},
    tenantInfo: {},
    isTenant: false,
    userLoading: false,
    loading: false,
    nodeId: '0',
    subordinateList: [],
    organizeList: [],
    positionList: [],
    activeOrganize: '',
    activePosition: '',
  });
  const { activeKey, user, tenantInfo, isTenant } = toRefs(state);

  const getHeaders = computed(() => ({ Authorization: getToken() as string }));
  const getUseSocials = computed(() => !!ls.get('useSocials'));

  watch(
    () => state.activeKey,
    val => {
      if (val === 'subordinate') {
        state.nodeId = '0';
        getSubordinateList();
        return;
      }
      if (val === 'organize') return getUserOrganizesList();
      if (val === 'position') return getUserPositionsList();
    },
  );

  function beforeUpload(file) {
    let isAccept = new RegExp('image/*').test(file.type);
    if (!isAccept) createMessage.error(`请上传图片`);
    return isAccept;
  }
  function handleChange({ file }: UploadChangeParam) {
    if (file.status === 'error') {
      createMessage.error('上传失败');
      return;
    }
    if (file.status === 'done') {
      if (file.response.code === 200) {
        if (!file.response.data || !file.response.data.name) return;
        // updateAvatar(file.response.data.name).then(res => {
        //   state.user.avatar = file.response.data.url;
        //   userStore.setUserInfo({ headIcon: file.response.data.url });
        //   createMessage.success(res.msg);
        // });
      } else {
        createMessage.error(file.response.msg);
      }
    }
  }
  function getInfo() {
    state.userLoading = false;
    // getUserSettingInfo().then(res => {
    //   state.user = res.data;
    //   state.tenantInfo = res.data.currentTenantInfo;
    //   state.isTenant = res.data.isTenant || false;
    //   state.activeKey = 'user';
    //   state.userLoading = false;
    // });
  }
  function getSubordinateList() {
    state.loading = true;
    // getSubordinate(state.nodeId).then(res => {
    //   state.subordinateList = res.data;
    //   state.loading = false;
    // });
  }
  function loadData(node) {
    state.nodeId = node.id;
    return new Promise((resolve: (value?: unknown) => void) => {
      // getSubordinate(state.nodeId).then(res => {
      //   const list = res.data;
      //   getTree().updateNodeByKey(node.eventKey, { children: list, isLeaf: !list.length });
      //   resolve();
      // });
    });
  }
  function getTree() {
    const tree = unref(subTreeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }
  function getUserOrganizesList() {
    // getUserOrganizes().then(res => {
    //   state.organizeList = res.data || [];
    //   const list = state.organizeList.filter(o => o.isDefault);
    //   if (!list.length) return (state.activeOrganize = '');
    //   const activeItem = list[0];
    //   state.activeOrganize = activeItem.id;
    // });
  }
  function getUserPositionsList() {
    // getUserPositions().then(res => {
    //   state.positionList = res.data || [];
    //   const list = state.positionList.filter(o => o.isDefault);
    //   if (!list.length) return (state.activePosition = '');
    //   const activeItem = list[0];
    //   state.activePosition = activeItem.id;
    // });
  }
  function changeMajor(majorId, majorType) {
    if (state['active' + majorType] === majorId) return;
    const query = { majorId, majorType };
    // setMajor(query).then(res => {
    //   state['active' + majorType] = majorId;
    //   createMessage.success(res.msg).then(() => {
    //     location.reload();
    //   });
    // });
  }

  onMounted(() => {
    getInfo();
  });
</script>

<style lang="less">
  .profile-wrapper {
    .profile-left-tabs {
      width: 100%;
      margin-right: 0;
      .ant-tabs-tab-disabled {
        padding: 0 !important;
        .ant-tabs-tab-btn {
          border-bottom: 1px solid @border-color-base1;
          width: 100%;
        }
      }
      .ant-tabs-content-holder {
        width: 100% !important;
        .ant-tabs-content-left {
          height: 100%;
          & > .ant-tabs-tabpane {
            padding-left: 10px;
            height: 100%;
          }
        }
      }
    }
    .head {
      height: 70px;
      width: 160px;
      padding-top: 10px;
      padding-left: 10px;
      .avatar-uploader {
        display: inline-block;
        vertical-align: top;
        .avatar-hover {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 12px;
          display: none;
          overflow: hidden;
          width: 50px;
          height: 50px;
          text-align: center;
          border-radius: 50%;
          line-height: 50px;
          color: #fff;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.5);
        }
        &:hover {
          & .avatar-hover {
            display: block;
          }
        }
      }
      .avatar-box {
        position: relative;
      }
      .avatar {
        display: inline-block;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        vertical-align: top;
        margin-right: 10px;
      }
      .username {
        line-height: 50px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 90px;
        display: inline-block;
      }
    }
    .organize-list {
      width: 100%;
      padding: 50px;
      .organize-item {
        margin-bottom: 30px;
        .organize-item-main {
          height: 70px;
          position: relative;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          display: flex;
          align-items: center;
          padding: 0 20px;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
          color: @text-color-base;
          &.active {
            border: 1px solid @primary-color;
            box-shadow: 0 0 6px rgba(6, 58, 108, 0.26);
            color: @primary-color;
            .btn,
            .icon-checked {
              display: block;
            }
          }
          .icon-ym {
            font-size: 24px;
            margin-right: 10px;
          }
          .organize-name {
            line-height: 24px;
            font-size: 14px;
          }
          .btn {
            display: none;
            position: absolute;
            right: 45px;
            bottom: 7px;
            font-size: 12px;
          }
          .icon-checked {
            display: none;
            width: 20px;
            height: 20px;
            border: 20px solid @primary-color;
            border-left: 20px solid transparent !important;
            border-top: 20px solid transparent !important;
            border-bottom-right-radius: 2px;
            position: absolute;
            transform: scale(0.9);
            right: -2px;
            bottom: -2px;
            .anticon-check {
              position: absolute;
              top: 0;
              left: 0;
              font-size: 16px;
              color: #fff;
            }
          }
        }
      }
    }
    .subordinate-list {
      height: calc(100% - 50px);
      padding-top: 20px;
      .ant-tree {
        .ant-tree-switcher {
          line-height: 80px !important;
          .ant-tree-switcher-icon,
          .ant-tree-switcher-icon {
            font-size: 18px;
          }
        }
        .ant-tree-node-content-wrapper {
          height: 80px !important;
        }
        .ant-tree-treenode {
          background-color: transparent !important;
        }
        .subordinate-tree-node {
          width: 300px;
          .ant-card-body {
            display: flex;
            padding: 10px 10px;
            align-items: center;
            .ant-avatar {
              margin-right: 10px;
              flex-shrink: 0;
            }
            .text {
              font-size: 14px;
              width: calc(100% - 60px);
              p {
                line-height: 25px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
              }
            }
            .user-text {
              color: #999;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
</style>
