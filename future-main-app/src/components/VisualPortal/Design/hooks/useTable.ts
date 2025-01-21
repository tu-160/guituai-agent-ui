import { computed, onMounted, ref, unref, watch, nextTick } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { getDataInterfaceRes } from '@/api/systemData/dataInterface';
import { getNoticeList } from '@/api/onlineDev/portal';
import dayjs from 'dayjs';
import { getParamList } from '@/utils/future';
import { useI18n } from '@/hooks/web/useI18n';
import { useGo } from '@/hooks/web/usePage';
import { encryptByBase64 } from '@/utils/cipher';

const { t } = useI18n();

export function useTable(activeData) {
  const tableListRef = ref();
  const tableElRef = ref();
  const list: any = ref([]);
  const headerHeight = ref(39);
  const { height } = useElementBounding(tableListRef);
  const lastHeight = ref(0);
  const go = useGo();

  const getOption = computed(() => activeData.option);
  const getBorder = computed(() => unref(getOption).border);
  const getColumns = computed(() => {
    if (activeData.option.styleType != 1) return activeData.option.rowData;
    const index = { fullName: t('component.table.index'), filedName: 'index', width: 50, fixed: 'left', align: 'center' };
    let columnData = activeData.option.tableIndex ? [index, ...activeData.option.columnData] : activeData.option.columnData;
    if (activeData.futureKey == 'notice') {
      columnData = columnData.filter(o => (o.show && o.filedName !== 'classify') || o.filedName === 'index');
    }
    if (!columnData.length) return [];
    const columnList = columnData.map((o, i) => {
      let newObj: any = {
        title: o.fullName,
        dataIndex: o.filedName,
        key: o.filedName,
        width: o.width || 100,
        fixed: o.fixed === 'none' ? false : o.fixed,
        ellipsis: !!unref(getOption).showOverflow,
        customHeaderCell: () => {
          return {
            style: {
              backgroundColor: activeData.option.headerBgColor,
              color: activeData.option.headerFontColor,
              fontSize: (activeData.option.headerFontSize || 14) + 'px',
              fontWeight: activeData.option.headerFontWeight ? 600 : 500,
              textAlign: activeData.option.headerLeft || o.align || 'center',
            },
          };
        },
        customCell: (_record, rowIndex, _column) => {
          const rowColorKey = (rowIndex + 1) % 2 === 0 ? 'tableEvenLineColor' : 'tableOddLineColor';
          const color = activeData.option[rowColorKey] || activeData.option.tableBgColor;
          return {
            style: {
              backgroundColor: color,
              color: activeData.option.tableFontColor,
              fontSize: (activeData.option.tableFontSize || 14) + 'px',
              textAlign: o.align || 'center',
            },
          };
        },
      };
      if (newObj.key === 'index') newObj.customRender = ({ index }) => index + 1;
      if (o.sortable) newObj.sorter = { compare: (a, b) => a[newObj.key] - b[newObj.key], multiple: i };
      return newObj;
    });
    return sortFixedColumn(columnList);
  });
  const getTableBindValues = computed(() => {
    return {
      columns: unref(getColumns),
      pagination: false,
      size: 'small',
      rowKey: 'id',
      scroll: { y: lastHeight.value - (activeData.option.showHeader ? headerHeight.value : 0) },
      showHeader: activeData.option.showHeader,
      bordered: unref(getBorder),
      customRow: record => {
        return {
          onClick: () => handleRowClick(record), // 点击事件处理
        };
      },
    };
  });

  watch(
    () => height.value,
    () => {
      nextTick(() => {
        lastHeight.value = tableListRef.value?.clientHeight;
      });
    },
  );

  watch(
    () => lastHeight.value,
    val => {
      nextTick(() => {
        const tableEl = tableElRef.value?.$el;
        let bodyEl = tableEl?.querySelector('.ant-table-body');
        if (bodyEl) bodyEl!.style.height = `${val - (activeData.option.showHeader ? headerHeight.value : 0)}px`;
      });
    },
  );
  watch(
    () => [unref(getOption).headerFontSize, unref(getOption).border],
    () => {
      nextTick(() => getHeaderHeight());
    },
  );
  watch(
    () => unref(getOption).columnData,
    () => {
      setTimeout(() => getHeaderHeight(), 100);
    },
    { deep: true, immediate: true },
  );

  function initData() {
    if (activeData.futureKey === 'tableList') {
      if (activeData.dataType === 'dynamic') {
        list.value = [];
        const propsApi = activeData.propsApi;
        if (!propsApi) return;
        const query = { paramList: getParamList(activeData.templateJson) };
        getDataInterfaceRes(propsApi, query).then(res => {
          list.value = res.data || [];
          handleData();
        });
      } else {
        list.value = JSON.parse(JSON.stringify(activeData.option.defaultValue));
        handleData();
      }
    } else {
      const rowColumnKey = activeData.option.styleType === 1 ? 'columnData' : 'rowData';
      let typeList: any[] = [];
      activeData.option[rowColumnKey].forEach(o => {
        if (o.classify?.length) typeList = o.classify;
      });
      getNoticeList({ typeList }).then(res => {
        list.value = res.data.list || [];
        list.value.map(o => {
          o.creatorTime = dayjs(o.creatorTime).format('YYYY-MM-DD HH:mm:ss');
          o.releaseTime = dayjs(o.releaseTime).format('YYYY-MM-DD HH:mm:ss');
        });
        handleData(2);
      });
    }
  }
  function handleData(type?) {
    const count = type === 2 ? activeData.option.noticeCount || 50 : activeData.option.tableCount || 50;
    list.value = list.value.slice(0, count);
    nextTick(() => getHeaderHeight());
  }
  function getHeaderHeight() {
    headerHeight.value = unref(tableListRef)?.getElementsByTagName('thead')[0]?.getBoundingClientRect()?.height + 1 || 39;
  }
  function sortFixedColumn(columns: any[]) {
    const fixedLeftColumns: any[] = [];
    const fixedRightColumns: any[] = [];
    const defColumns: any[] = [];
    for (const column of columns) {
      if (column.fixed === 'left') {
        fixedLeftColumns.push(column);
        continue;
      }
      if (column.fixed === 'right') {
        fixedRightColumns.push(column);
        continue;
      }
      defColumns.push(column);
    }
    return [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(item => !item.defaultHidden);
  }
  function getItemStyle(index) {
    const rowColorKey = (index + 1) % 2 === 0 ? 'tableEvenLineColor' : 'tableOddLineColor';
    const color = activeData.option[rowColorKey] || activeData.option.tableBgColor;
    return { backgroundColor: color };
  }
  function getColumnsStyle(type = 0) {
    const fontWeight = unref(getColumns)[type].fontWeight ? 'bolder' : 'normal';
    const fontSize = (unref(getColumns)[type].fontSize || 14) + 'px';
    const color = unref(getColumns)[type].fontColor;
    return { 'font-weight': fontWeight, 'font-size': fontSize, color } as any;
  }
  function handleRowClick(row) {
    if (!activeData.option?.urlAddress) return;
    let urlAddress = JSON.parse(JSON.stringify(activeData.option.urlAddress));
    const regex = /\${[^{}]+}/g;
    urlAddress = urlAddress.replace(regex, match => {
      const key = match.slice(2, -1);
      return row[key] || match;
    });
    if (activeData.option.target == '_self') {
      go(`/externalLink?href=${encodeURIComponent(encryptByBase64(urlAddress))}`);
    } else {
      window.open(urlAddress, activeData.option.target);
    }
  }

  onMounted(() => initData());

  return {
    getItemStyle,
    getColumnsStyle,
    getOption,
    getColumns,
    getTableBindValues,
    list,
    tableListRef,
    tableElRef,
    getBorder,
    handleRowClick,
  };
}
