import { reactive, defineAsyncComponent, markRaw } from 'vue';
// import { getAuthPortal, UpdateCustomPortal } from '@/api/onlineDev/portal';
// import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
import { importViewsFile } from '@/utils';
import { getParamList } from '@/utils/future';

interface State {
  portalId: string;
  layout: any[];
  type: number;
  linkType: number;
  currentView: string;
  url: string;
  ajaxing: boolean;
  loading: boolean;
  noData: boolean;
  refreshData: any;
  timerList: any[];
  formData: any;
  enabledLock: number;
  systemId: string;
}

const state = reactive<State>({
  portalId: '',
  layout: [],
  type: 0,
  linkType: 0,
  currentView: '',
  url: '',
  ajaxing: true,
  loading: false,
  noData: false,
  refreshData: {},
  timerList: [],
  formData: {},
  enabledLock: 1,
  systemId: '',
});

export function usePortal() {
  function initData() {
    state.loading = true;
    state.layout = [];
    state.noData = false;
    if (!state.portalId) {
      state.loading = false;
      state.ajaxing = false;
      state.noData = true;
      return;
    }
    // getAuthPortal(state.portalId, { platform: 'Web', systemId: state.systemId })
    //   .then(res => {
    //     if (res.data) {
    //       state.type = res.data.type || 0;
    //       state.linkType = res.data.linkType || 0;
    //       state.url = res.data.customUrl || '';
    //       state.enabledLock = res.data.enabledLock || 0;
    //       if (res.data.type === 1) {
    //         if (res.data.customUrl && res.data.customUrl !== 1) {
    //           const formUrl = `${res.data.customUrl}`;
    //           console.log("formUrl", formUrl);
    //           state.currentView = markRaw(defineAsyncComponent(() => importViewsFile(formUrl)));
    //         }
    //       } else {
    //         if (res.data.formData) {
    //           state.formData = JSON.parse(res.data.formData);
    //           state.layout = filterList(JSON.parse(JSON.stringify(state.formData.layout)) || []);
    //           state.refreshData = state.formData.refresh || {};
    //         }
    //       }
    //     }
    //     state.ajaxing = false;
    //     state.loading = false;
    //     setTimeout(() => {
    //       initAutoRefresh();
    //     }, 500);
    //   })
    //   .catch(() => {
    //     state.loading = false;
    //     state.ajaxing = false;
    //     state.noData = true;
    //   });
  }
  function filterList(layout) {
    const loop = list => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!(Array.isArray(item.visibility) && item.visibility.includes('pc')) && item.futureKey) {
          list.splice(i, 1);
          i--;
        }
        if (item.children && item.children.length) loop(item.children);
      }
    };
    loop(layout);
    return layout;
  }
  function initAutoRefresh() {
    if (!state.layout.length) return;
    state.timerList = [];
    const loop = (list, type = 1) => {
      list.forEach(ele => {
        if ((ele.refresh && ele.refresh.autoRefresh && ele.refresh.autoRefreshTime) || type == 2) {
          var timer = setInterval(
            () => {
              ele.renderKey = +new Date();
              autoRefresh(ele);
            },
            type == 2 ? state.refreshData.autoRefreshTime * 1000 * 60 : ele.refresh.autoRefreshTime * 1000 * 60,
          );
          state.timerList.push(timer);
        }
        if (ele.children && ele.children.length) loop(ele.children, type);
      });
    };
    if (state.refreshData.autoRefresh) {
      loop(state.layout, 2);
    } else {
      loop(state.layout);
    }
  }
  function autoRefresh(item) {
    const chartList = ['barChart', 'lineChart', 'pieChart', 'radarChart', 'mapChart'];
    if (item.dataType === 'dynamic' && chartList.includes(item.futureKey)) {
      item.option.defaultValue = [];
      if (!item.propsApi) return;
      const query = { paramList: getParamList(item.templateJson) };
      // getDataInterfaceRes(item.propsApi, query).then(res => {
      //   const realData = res.data;
      //   item.option.defaultValue = Array.isArray(realData) ? realData : [];
      // });
    }
  }
  function clearAutoRefresh() {
    if (state.timerList.length) {
      state.timerList.forEach(ele => {
        if (ele) clearInterval(ele);
      });
    }
  }
  function layoutUpdatedEvent() {
    state.formData.layout = state.layout;
    const query = { formData: JSON.stringify(state.formData), systemId: state.systemId };
    // UpdateCustomPortal(state.portalId, query);
  }
  return {
    state: state,
    initData,
    filterList,
    initAutoRefresh,
    autoRefresh,
    clearAutoRefresh,
    layoutUpdatedEvent,
  };
}
