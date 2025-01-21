const dataBoardDefault = [
  {
    fullName: '新增客户',
    unit: '个',
    num: 262,
    field: '',
    icon: 'icon-ym icon-ym-wf-contractApproval',
    iconColor: 'rgb(123, 26, 225)',
    moduleId: '',
    linkType: '',
    urlAddress: '',
    linkTarget: '_self',
    id: '1',
  },
  {
    fullName: '新增商机',
    unit: '个',
    num: 199,
    field: '',
    icon: 'icon-ym icon-ym-wf-outgoingApply',
    iconColor: 'rgb(74, 184, 255)',
    moduleId: '',
    linkType: '',
    urlAddress: '',
    linkTarget: '_self',
    id: '2',
  },
  {
    fullName: '合同金额',
    unit: '元',
    num: 126263.5,
    field: '',
    icon: 'icon-ym icon-ym-wf-payDistribution',
    iconColor: 'rgb(255, 139, 88)',
    moduleId: '',
    linkType: '',
    urlAddress: '',
    linkTarget: '_self',
    id: '3',
  },
  {
    fullName: '回款金额',
    unit: '元',
    num: 6223.2,
    field: '',
    icon: 'icon-ym icon-ym-wf-incomeRecognition',
    iconColor: 'rgb(252, 91, 135)',
    moduleId: '',
    linkType: '',
    urlAddress: '',
    linkTarget: '_self',
    id: '4',
  },
];
// 布局控件
export const layoutComponents = [
  {
    icon: 'icon-ym icon-ym-portal-card',
    label: '卡片面板',
    futureKey: 'card',
    title: '卡片面板',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-card',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    children: [],
    w: 6,
    h: 6,
    minW: 6,
    minH: 4,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-portal-tab',
    label: '标签面板',
    futureKey: 'tab',
    title: '标签面板',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-tab',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    children: [
      {
        title: 'Tab 1',
        name: '1',
        icon: '',
        children: [],
      },
      {
        title: 'Tab 2',
        name: '2',
        icon: '',
        children: [],
      },
    ],
    active: '1',
    type: '',
    tabPosition: 'top',
    w: 6,
    h: 6,
    minW: 6,
    minH: 4,
    maxW: 12,
    maxH: 12,
  },
];
// 基础控件
export const basicComponents = [
  {
    icon: 'icon-ym icon-ym-generator-function',
    label: '常用功能',
    futureKey: 'commonFunc',
    title: '常用功能',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-function',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      styleType: 1,
      appStyleType: 1,
      defaultValue: [
        {
          fullName: '表单设计',
          moduleId: '85cd7bca426e49ce83a061bf461b1447',
          linkType: '1',
          linkTarget: '_self',
          urlAddress: 'onlineDev/webDesign',
          icon: 'icon-ym icon-ym-webDesign',
          iconBgColor: '#FF3B3B',
          type: 2,
          id: '1',
        },
        {
          fullName: '流程设计',
          moduleId: 'fe0150960dd542ec9328067e4495074b',
          linkType: '1',
          linkTarget: '_self',
          urlAddress: 'workFlow/flowEngine',
          icon: 'icon-ym icon-ym-flowDesign',
          iconBgColor: '#7B1AE1',
          type: 2,
          id: '2',
        },
        {
          fullName: '权限管理',
          moduleId: '9057d797550e4457b7ddf2456ce45882',
          linkType: '1',
          linkTarget: '_self',
          urlAddress: 'permission/authorize',
          icon: 'icon-ym icon-ym-authorize',
          iconBgColor: '#1890FF',
          type: 2,
          id: '3',
        },
        {
          fullName: '报表设计',
          moduleId: 'c7159f97177b420d9fc8ec8c74ae541b',
          linkType: '1',
          linkTarget: '_self',
          urlAddress: 'onlineDev/dataReport',
          icon: 'icon-ym icon-ym-reportDesign',
          iconBgColor: '#F68900',
          type: 2,
          id: '4',
        },
        {
          fullName: '门户设计',
          moduleId: '232d7226f00446d882e1e1bd999f7b2d',
          linkType: '1',
          linkTarget: '_self',
          urlAddress: 'onlineDev/visualPortal',
          icon: 'icon-ym icon-ym-portalDesign',
          iconBgColor: '#33B932',
          type: 2,
          id: '5',
        },
      ],
      appDefaultValue: [
        {
          fullName: 'FUTURE快速开发',
          moduleId: '',
          linkType: '2',
          urlAddress: 'https://www.futuresoft.com/',
          linkTarget: '_blank',
          icon: 'icon-ym icon-ym-webDesign',
          iconBgColor: '#33B932',
          type: 2,
          id: '1',
        },
      ],
      rowNumber: 5,
      showBorder: false,
      appRowNumber: 4,
      appShowBorder: false,
      labelFontSize: 14,
      labelFontWeight: false,
      labelFontColor: '#606266',
    },
    w: 6,
    h: 4,
    minW: 6,
    minH: 3,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-generator-textarea',
    label: '文本',
    futureKey: 'text',
    title: '文本',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-textarea',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: '',
      textFontSize: 14,
      textFontColor: '#303133',
      textFontWeight: false,
      textFontStyle: false,
      textLeft: 'left',
      textUnderLine: 'none',
      textBgColor: '',
      textAutoplay: false,
      textAutoplayMode: 'left',
      textAutoplaySpeed: 60,
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 4,
    h: 3,
    minW: 4,
    minH: 2,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-image',
    label: '图片',
    futureKey: 'image',
    title: '图片',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-image',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 2,
      defaultValue: '',
      textDefaultValue: 'FUTURE快速开发平台',
      textFontSize: 14,
      textFontColor: '#fff',
      textFontWeight: false,
      textFontStyle: false,
      textLeft: 'center',
      textBgColor: '#30313399',
      imageFillStyle: 'cover',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 6,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-carousel',
    label: '轮播图',
    futureKey: 'carousel',
    title: '轮播图',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-carousel',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
      carouselType: false,
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner1.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '1',
        },
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner2.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '2',
        },
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner4.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '3',
        },
      ],
      appDefaultValue: [
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner1.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '1',
        },
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner2.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '2',
        },
        {
          imageUrl: 'https://app.cdn.futuresoft.com/image/3.2/banner4.png',
          dataType: 2,
          propsApi: '',
          moduleId: '',
          linkType: '',
          urlAddress: '',
          linkTarget: '_self',
          textDefaultValue: '',
          id: '3',
        },
      ],
      carouselAutoplay: true,
      carouselDirection: 'horizontal',
      carouselInterval: 3000,
      carouselIndicatorPosition: 'bottomRight',
      carouselArrow: 'never',
      carouselLoop: true,
      imageFillStyle: 'cover',
      textFontSize: 14,
      textFontColor: '#fff',
      textFontWeight: false,
      textFontStyle: false,
      textLeft: 'center',
      textBgColor: '#30313399',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 6,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-video',
    label: '视频',
    futureKey: 'video',
    title: '视频',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-video',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 2,
      defaultValue: '',
      videoAutoplay: true,
      playNumber: 2,
      mutePlay: false,
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 6,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-iframe',
    label: 'Iframe',
    futureKey: 'iframe',
    title: 'Iframe',
    visibility: ['pc'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-iframe',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      defaultValue: 'https://www.futuresoft.com/',
    },
    w: 12,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
];
// 系统控件
export const systemComponents = [
  {
    icon: 'icon-ym icon-ym-generator-todo',
    label: '我的待办',
    futureKey: 'todo',
    title: '我的待办',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-todo',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      styleType: 1,
      defaultValue: [
        {
          fullName: '流程待签',
          id: 'flowToSign',
          noShow: false,
          num: 0,
          category: [],
          urlAddress: '/workFlow/flowToSign',
          icon: 'icon-ym icon-ym-flowToSign',
          iconBgColor: '#1997f4',
          type: 2,
        },
        {
          fullName: '流程待办',
          id: 'flowTodo',
          noShow: false,
          num: 0,
          category: [],
          urlAddress: '/workFlow/flowTodo',
          icon: 'icon-ym icon-ym-flowTodo',
          iconBgColor: '#f29700',
          type: 2,
        },
        {
          fullName: '流程在办',
          id: 'flowDoing',
          noShow: false,
          num: 0,
          category: [],
          urlAddress: '/workFlow/flowDoing',
          icon: 'icon-ym icon-ym-flowDoing',
          iconBgColor: '#495dfd',
          type: 2,
        },
        {
          fullName: '流程已办',
          id: 'flowDone',
          noShow: false,
          num: 0,
          category: [],
          urlAddress: '/workFlow/flowDone',
          icon: 'icon-ym icon-ym-flowDone',
          iconBgColor: '#7b1ae1',
          type: 2,
        },
        {
          fullName: '流程抄送',
          id: 'flowCirculate',
          noShow: false,
          num: 0,
          category: [],
          urlAddress: '/workFlow/flowCirculate',
          icon: 'icon-ym icon-ym-flowCirculate',
          iconBgColor: '#33b932',
          type: 2,
        },
      ],
      rowNumber: 5,
      showBorder: false,
      appRowNumber: 5,
      appShowBorder: false,
      labelFontSize: 14,
      labelFontWeight: false,
      labelFontColor: '#606266',
      valueFontSize: 24,
      valueFontWeight: true,
      valueFontColor: '#303133',
      valueFontBgColor: '#FE433E',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 12,
    h: 4,
    minW: 6,
    minH: 3,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-flowToSign',
    label: '待签事项',
    futureKey: 'todoList',
    title: '待签事项',
    visibility: ['pc', 'app'],
    type: 1,
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-flowToSign',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    w: 6,
    h: 7,
    minW: 4,
    minH: 7,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-flowTodo',
    label: '待办事项',
    futureKey: 'todoList',
    title: '待办事项',
    visibility: ['pc', 'app'],
    type: 2,
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-flowTodo',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    w: 6,
    h: 7,
    minW: 4,
    minH: 7,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-flowDoing',
    label: '在办事项',
    futureKey: 'todoList',
    title: '在办事项',
    type: 3,
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-flowDoing',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    w: 6,
    h: 7,
    minW: 4,
    minH: 7,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-generator-notice',
    label: '公告通知',
    futureKey: 'notice',
    title: '公告通知',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-notice',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      border: true,
      showOverflow: true,
      showHeader: true,
      styleType: 1,
      appStyleType: 1,
      defaultValue: [],
      showImage: true,
      headerFontSize: 14,
      headerFontWeight: false,
      headerFontColor: '#303133',
      headerLeft: 'center',
      headerBgColor: '#F3F6F9',
      tableIndex: true,
      noticeCount: 5,
      tableFontSize: 14,
      tableFontColor: '#606266',
      tableBgColor: '',
      tableOddLineColor: '',
      tableEvenLineColor: '',
      describe: false,
      showText: true,
      textFontSize: 14,
      textFontColor: '#606266',
      textFontWeight: false,
      appCount: 5,
      appColumnList: [
        { fullName: '类型', filedName: 'classify', fontSize: 12, classify: [], fontWeight: false, fontColor: '#606266', show: true },
        { fullName: '标题', filedName: 'fullName', fontSize: 14, fontWeight: false, fontColor: '#303133', show: true },
        { fullName: '摘要', filedName: 'content', fontSize: 12, fontWeight: false, fontColor: '#606266', show: true },
        { fullName: '时间', filedName: 'time', fontSize: 12, timeClassify: 1, fontWeight: false, fontColor: '#606266', show: true },
        { fullName: '人员', filedName: 'user', fontSize: 12, userClassify: 1, fontWeight: false, fontColor: '#606266', show: true },
      ],
      columnData: [
        { fullName: '类型', filedName: 'classify', sortable: false, show: true, fixed: 'none', align: 'center', width: 0, classify: [] },
        { fullName: '标题', filedName: 'fullName', sortable: false, show: true, fixed: 'none', align: 'center', width: 0 },
        { fullName: '创建人', filedName: 'creatorUser', sortable: false, show: true, fixed: 'none', align: 'center', width: 0 },
        { fullName: '创建时间', filedName: 'creatorTime', sortable: false, show: true, fixed: 'none', align: 'center', width: 0 },
        { fullName: '发布人', filedName: 'releaseUser', sortable: false, show: true, fixed: 'none', align: 'center', width: 0 },
        { fullName: '发布时间', filedName: 'releaseTime', sortable: false, show: true, fixed: 'none', align: 'center', width: 0 },
      ],
      rowData: [
        { fullName: '类型', filedName: 'classify', fontSize: 12, classify: [], fontWeight: false, fontColor: '#606266', show: true },
        { fullName: '标题', filedName: 'fullName', fontSize: 14, fontWeight: false, fontColor: '#303133', show: true },
        { fullName: '摘要', filedName: 'content', fontSize: 12, fontWeight: false, fontColor: '#606266', show: true },
        { fullName: '时间', filedName: 'time', fontSize: 12, timeClassify: 1, fontWeight: false, fontColor: '#606266', show: true },
      ],
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 12,
    h: 7,
    minW: 4,
    minH: 7,
    maxW: 12,
    maxH: 20,
  },
];

// 图表控件
export const chartComponents = [
  {
    icon: 'icon-ym icon-ym-generator-Panel',
    label: '数据面板',
    futureKey: 'dataBoard',
    title: '数据面板',
    dataType: 'static',
    propsApi: '',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-function',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      styleType: 1,
      appStyleType: 1,
      defaultValue: dataBoardDefault,
      appDefaultValue: dataBoardDefault,
      rowNumber: 4,
      showBorder: false,
      appRowNumber: 4,
      appShowBorder: false,
      labelFontSize: 14,
      labelFontWeight: false,
      labelFontColor: '#606266',
      valueFontSize: 24,
      valueFontWeight: true,
      valueFontColor: '#303133',
      unitFontSize: 14,
      unitFontWeight: false,
      unitFontColor: '#606266',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 12,
    h: 4,
    minW: 6,
    minH: 3,
    maxW: 12,
    maxH: 12,
  },
  {
    icon: 'icon-ym icon-ym-generator-table',
    label: '表格列表',
    futureKey: 'tableList',
    title: '表格列表',
    dataType: 'static',
    propsApi: '',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-table',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    option: {
      border: true,
      showOverflow: true,
      styleType: 1,
      defaultValue: [],
      showHeader: true,
      headerFontSize: 14,
      headerFontWeight: false,
      headerFontColor: '#303133',
      headerLeft: 'center',
      headerBgColor: '#F3F6F9',
      tableIndex: true,
      tableCount: 5,
      tableFontSize: 14,
      tableFontColor: '#606266',
      tableOddLineColor: '',
      tableEvenLineColor: '',
      tableBgColor: '',
      describe: false,
      showName: true,
      dataFontSize: 14,
      dataFontColor: '#606266',
      dataFontWeight: false,
      nameFontSize: 14,
      nameFontColor: '#303133',
      nameFontWeight: false,
      appCount: 5,
      appColumnList: [
        { fullName: '姓名', filedName: 'inputField102' },
        { fullName: '日期', filedName: 'inputField105' },
      ],
      columnData: [
        { fullName: '排名', filedName: 'inputField101', sortable: false, fixed: 'none', align: 'center', width: 0, id: '1' },
        { fullName: '姓名', filedName: 'inputField102', sortable: false, fixed: 'none', align: 'center', width: 0, id: '2' },
        { fullName: '销售额', filedName: 'inputField103', sortable: false, fixed: 'none', align: 'center', width: 0, id: '3' },
        { fullName: '完成情况', filedName: 'inputField104', sortable: false, fixed: 'none', align: 'center', width: 0, id: '4' },
      ],
      rowData: [
        { fullName: '标题', filedName: 'inputField102', fontSize: 14, fontWeight: false, fontColor: '#303133' },
        { fullName: '描述', filedName: 'inputField103', fontSize: 12, fontWeight: false, fontColor: '#606266' },
        { fullName: '时间', filedName: 'inputField105', fontSize: 12, fontWeight: false, fontColor: '#606266' },
      ],
      target: '_self',
      urlAddress: '',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },

  {
    icon: 'icon-ym icon-ym-generator-bar',
    label: '柱状图',
    futureKey: 'barChart',
    title: '柱状图',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-bar',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      // 图表标题设置
      titleText: '', //主标题
      titleTextStyleColor: '#303133', //主标题字体颜色
      titleTextStyleFontSize: 18, //主标题字体大小[12-25px]
      titleTextStyleFontWeight: false, //主标题是否加粗
      titleLeft: 'center', //主子标题位置[left,center,right]
      titleBgColor: '', //主子标题背景色[rgba(),#303133]
      // 图表副标题设置
      titleSubtext: '', //子标题
      titleSubtextStyleColor: '#303133', //子标题字体颜色
      titleSubtextStyleFontSize: 12, //子标题字体大小[12-25px]
      titleSubtextStyleFontWeight: false, //子标题是否加粗
      // 柱体设置
      seriesBarWidth: 30, //柱体宽度
      seriesItemStyleBarBorderRadius: 0, //柱体圆角
      // X轴设置
      xAxisName: '', //X轴名称
      xAxisNameTextStyleFontSize: 14, //X轴名称字体大小
      xAxisNameTextStyleColor: '#303133', //X轴名称字体颜色
      xAxisNameTextStyleFontWeight: false, //X轴名称是否加粗
      xAxisShow: true, //X轴是否显示
      category: 'category', //X轴类型[category,value]
      xAxisAxisLineLineStyleColor: '#303133', //X轴线颜色
      xAxisAxisLabelRotate: 0, //X轴标签角度
      xAxisAxisLabelTextStyleFontSize: 14, //X轴标签字体大小
      xAxisAxisLabelTextStyleColor: '#303133', //X轴标签字体颜色
      xAxisAxisLabelTextFontWeight: false, //X轴标签是否加粗
      xAxisSplitLineShow: false, //X轴网格线
      xAxisSplitLineLineStyleColor: '#DFDFDF', //X轴网格线颜色
      xAxisInverse: false, //X轴反转
      // Y轴设置
      yAxisName: '', //Y轴名称
      yAxisNameTextStyleFontSize: 14, //Y轴名称字体大小
      yAxisNameTextStyleColor: '#303133', //Y轴名称字体颜色
      yAxisNameTextStyleFontWeight: false, //Y轴名称是否加粗
      yAxisShow: true, //Y轴是否显示
      yAxisAxisLineLineStyleColor: '#303133', //Y轴颜色
      yAxisSplitLineShow: true, //Y轴网格线
      yAxisSplitLineLineStyleColor: '#DFDFDF', //Y轴网格线颜色
      yAxisAxisLabelTextStyleFontSize: 14, //Y轴标签字体大小
      yAxisAxisLabelTextStyleColor: '#303133', //Y轴标签字体颜色
      yAxisAxisLabelTextFontWeight: false, //Y轴标签是否加粗
      //数值设置
      seriesLabelShow: true, //显示数值
      seriesLabelFontSize: 14, //数值大小
      seriesLabelFontWeight: false, //数值加粗
      seriesLabelColor: '#303133', //数值颜色
      seriesLabelBgColor: '', //数值背景色
      //提示语设置
      tooltipShow: true, //提示语显示
      tooltipTextStyleFontSize: 14, //提示语字体大小
      tooltipTextStyleFontWeight: false, //提示语是否加粗
      tooltipTextStyleColor: '#303133', //提示语字体颜色
      tooltipBgColor: '#fff', //提示语背景颜色
      //坐标轴边距设置
      gridLeft: 20, //左边距  max:400
      gridTop: 50, //顶边距  max:400
      gridRight: 20, //右边距  max:400
      gridBottom: 20, //底边距  max:400
      //图例设置
      legendShow: true, //显示图例
      legendTextStyleFontSize: 14, //图例字体大小
      legendOrient: 'horizontal', //图例布局[horizontal,vertical]
      legendLeft: 0, //图例上下边距
      legendTop: 0, //图例左右边距
      //自定义配色
      AxisTextStyleColor: '', //X、Y轴字体的颜色全局设置
      AxisLineStyleColor: '', //X、Y轴轴线颜色全局设置
      colorList: [],
      //数据设置（系列）
      barType: [],
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '系列', value: '' },
      { field: '维度', value: '' },
      { field: '数值', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-generator-pie',
    label: '饼图',
    futureKey: 'pieChart',
    title: '饼图',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-pie',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      roseType: false,
      roseType1: false,
      // 图表标题设置
      titleText: '', //主标题
      titleTextStyleColor: '#303133', //主标题字体颜色
      titleTextStyleFontSize: 18, //主标题字体大小[12-25px]
      titleTextStyleFontWeight: false, //主标题是否加粗
      titleLeft: 'center', //主子标题位置[left,center,right]
      titleBgColor: '', //主子标题背景色[rgba(),#303133]
      // 图表副标题设置
      titleSubtext: '', //子标题
      titleSubtextStyleColor: '#303133', //子标题字体颜色
      titleSubtextStyleFontSize: 12, //子标题字体大小[12-25px]
      titleSubtextStyleFontWeight: false, //子标题是否加粗
      //数值设置
      seriesLabelShow: true, //显示数值
      seriesLabelPosition: 'outside',
      seriesLabelShowInfo: ['count', 'percent'],
      seriesCenterLeft: 50,
      seriesCenterTop: 50,
      seriesLabelFontSize: 14, //数值大小
      seriesLabelFontWeight: false, //数值加粗
      seriesLabelColor: '#303133', //数值颜色
      seriesLabelBgColor: '', //数值背景色
      seriesLineStyleWidth: 2,
      seriesSymbolRotate: 4,
      //提示语设置
      tooltipShow: true, //提示语显示
      tooltipTextStyleFontSize: 14, //提示语字体大小
      tooltipTextStyleFontWeight: false, //提示语是否加粗
      tooltipTextStyleColor: '#303133', //提示语字体颜色
      tooltipBgColor: '#fff', //提示语背景颜色
      //坐标轴边距设置
      gridLeft: 20, //左边距  max:400
      gridTop: 50, //顶边距  max:400
      gridRight: 20, //右边距  max:400
      gridBottom: 20, //底边距  max:400
      //图例设置
      legendShow: true, //显示图例
      legendTextStyleFontSize: 14, //图例字体大小
      legendOrient: 'horizontal', //图例布局[horizontal,vertical]
      legendLeft: 0, //图例上下边距
      legendTop: 0, //图例左右边距
      //自定义配色
      AxisTextStyleColor: '', //X、Y轴字体的颜色全局设置
      AxisLineStyleColor: '', //X、Y轴轴线颜色全局设置
      colorList: [],
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '系列', value: '' },
      { field: '维度', value: '' },
      { field: '数值', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-generator-line',
    label: '折线图',
    futureKey: 'lineChart',
    title: '折线图',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-line',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      areaStyle: false,
      // 图表标题设置
      titleText: '', //主标题
      titleTextStyleColor: '#303133', //主标题字体颜色
      titleTextStyleFontSize: 18, //主标题字体大小[12-25px]
      titleTextStyleFontWeight: false, //主标题是否加粗
      titleLeft: 'center', //主子标题位置[left,center,right]
      titleBgColor: '', //主子标题背景色[rgba(),#303133]
      // 图表副标题设置
      titleSubtext: '', //子标题
      titleSubtextStyleColor: '#303133', //子标题字体颜色
      titleSubtextStyleFontSize: 12, //子标题字体大小[12-25px]
      titleSubtextStyleFontWeight: false, //子标题是否加粗
      // X轴设置
      xAxisName: '', //X轴名称
      xAxisNameTextStyleFontSize: 14, //X轴名称字体大小
      xAxisNameTextStyleColor: '#303133', //X轴名称字体颜色
      xAxisNameTextStyleFontWeight: false, //X轴名称是否加粗
      xAxisShow: true, //X轴是否显示
      category: 'category', //X轴类型[category,value]
      xAxisAxisLineLineStyleColor: '#303133', //X轴线颜色
      xAxisAxisLabelRotate: 0, //X轴标签角度
      xAxisAxisLabelTextStyleFontSize: 14, //X轴标签字体大小
      xAxisAxisLabelTextStyleColor: '#303133', //X轴标签字体颜色
      xAxisAxisLabelTextFontWeight: false, //X轴标签是否加粗
      xAxisSplitLineShow: false, //X轴网格线
      xAxisSplitLineLineStyleColor: '#DFDFDF', //X轴网格线颜色
      xAxisInverse: false, //X轴反转
      // Y轴设置
      yAxisName: '', //Y轴名称
      yAxisNameTextStyleFontSize: 14, //Y轴名称字体大小
      yAxisNameTextStyleColor: '#303133', //Y轴名称字体颜色
      yAxisNameTextStyleFontWeight: false, //Y轴名称是否加粗
      yAxisShow: true, //Y轴是否显示
      yAxisAxisLineLineStyleColor: '#303133', //Y轴颜色
      yAxisSplitLineShow: true, //Y轴网格线
      yAxisSplitLineLineStyleColor: '#DFDFDF', //Y轴网格线颜色
      yAxisAxisLabelTextStyleFontSize: 14, //Y轴标签字体大小
      yAxisAxisLabelTextStyleColor: '#303133', //Y轴标签字体颜色
      yAxisAxisLabelTextFontWeight: false, //Y轴标签是否加粗
      //数值设置
      seriesLabelShow: true, //显示数值
      seriesLabelFontSize: 14, //数值大小
      seriesLabelFontWeight: false, //数值加粗
      seriesLabelColor: '#303133', //数值颜色
      seriesLabelBgColor: '', //数值背景色
      seriesLineStyleWidth: 2,
      seriesSymbolRotate: 4,
      //提示语设置
      tooltipShow: true, //提示语显示
      tooltipTextStyleFontSize: 14, //提示语字体大小
      tooltipTextStyleFontWeight: false, //提示语是否加粗
      tooltipTextStyleColor: '#303133', //提示语字体颜色
      tooltipBgColor: '#fff', //提示语背景颜色
      //坐标轴边距设置
      gridLeft: 20, //左边距  max:400
      gridTop: 50, //顶边距  max:400
      gridRight: 20, //右边距  max:400
      gridBottom: 20, //底边距  max:400
      //图例设置
      legendShow: true, //显示图例
      legendTextStyleFontSize: 14, //图例字体大小
      legendOrient: 'horizontal', //图例布局[horizontal,vertical]
      legendLeft: 0, //图例上下边距
      legendTop: 0, //图例左右边距
      //自定义配色
      AxisTextStyleColor: '', //X、Y轴字体的颜色全局设置
      AxisLineStyleColor: '', //X、Y轴轴线颜色全局设置
      colorList: [],
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '系列', value: '' },
      { field: '维度', value: '' },
      { field: '数值', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-generator-radar', //'icon-ym icon-ym-generator-annular',
    label: '雷达图',
    futureKey: 'radarChart',
    title: '雷达图',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-radar',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      radarAxisNameFontWeight: false,
      radarAxisNameFontSize: 14,
      radarAxisNameColor: '#303133',
      seriesAreaStyleOpacity: 0.3,
      radarCenterLeft: 50,
      radarCenterTop: 50,
      // 图表标题设置
      titleText: '', //主标题
      titleTextStyleColor: '#303133', //主标题字体颜色
      titleTextStyleFontSize: 18, //主标题字体大小[12-25px]
      titleTextStyleFontWeight: false, //主标题是否加粗
      titleLeft: 'center', //主子标题位置[left,center,right]
      titleBgColor: '', //主子标题背景色[rgba(),#303133]
      // 图表副标题设置
      titleSubtext: '', //子标题
      titleSubtextStyleColor: '#303133', //子标题字体颜色
      titleSubtextStyleFontSize: 12, //子标题字体大小[12-25px]
      titleSubtextStyleFontWeight: false, //子标题是否加粗
      //数值设置
      seriesLabelShow: true, //显示数值
      seriesLabelFontSize: 14, //数值大小
      seriesLabelFontWeight: false, //数值加粗
      seriesLabelColor: '#303133', //数值颜色
      seriesLabelBgColor: '', //数值背景色
      seriesLineStyleWidth: 2,
      seriesSymbolRotate: 4,
      //提示语设置
      tooltipShow: true, //提示语显示
      tooltipTextStyleFontSize: 14, //提示语字体大小
      tooltipTextStyleFontWeight: false, //提示语是否加粗
      tooltipTextStyleColor: '#303133', //提示语字体颜色
      tooltipBgColor: '#fff', //提示语背景颜色
      //坐标轴边距设置
      gridLeft: 20, //左边距  max:400
      gridTop: 50, //顶边距  max:400
      gridRight: 20, //右边距  max:400
      gridBottom: 20, //底边距  max:400
      //图例设置
      legendShow: true, //显示图例
      legendTextStyleFontSize: 14, //图例字体大小
      legendOrient: 'horizontal', //图例布局[horizontal,vertical]
      legendLeft: 0, //图例上下边距
      legendTop: 0, //图例左右边距
      //自定义配色
      AxisTextStyleColor: '', //X、Y轴字体的颜色全局设置
      AxisLineStyleColor: '', //X、Y轴轴线颜色全局设置
      colorList: [],
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '系列', value: '' },
      { field: '维度', value: '' },
      { field: '数值', value: '' },
      { field: '最大值', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-timeAxis',
    label: '时间轴',
    futureKey: 'timeAxis',
    title: '时间轴',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-timeAxis',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      layout: 1,
      sortable: 1,
      showNumber: undefined,
      appShowNumber: undefined,
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '内容', value: '' },
      { field: '时间戳', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-rankList',
    label: '排行榜',
    futureKey: 'rankList',
    title: '排行榜',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-rankList',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      columnOptions: [
        { label: '部门', value: 'label' },
        { label: '金额', value: 'value' },
      ],
      target: '_self',
      urlAddress: '',
    },
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-generator-area',
    label: '地图',
    futureKey: 'mapChart',
    title: '地图',
    renderKey: '',
    visibility: ['pc'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-generator-area',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: {
      styleType: 1,
      defaultValue: [],
      mapType: ['100000'],
      mspScale: 1,
      bgColor: '',
      geoAreaColor: '#eee', //区域颜色
      geoBorderColor: '#606266', //描边线颜色
      geoBorderWidth: 1, //描边线 0 不显示
      geoLabelShow: false, //区域名称
      geoLabelColor: '#303133', //区域颜色
      geoLabelFontWeight: false, //区域加粗
      geoLabelFontSize: 14, //区域字体
      geoShadowOffset: 0, //阴影大小
      geoShadowColor: '#000', //阴影颜色
      geoRoam: true, //缩放
      geoAspectScale: 0.75, //地图长宽比
      drillDown: true, //是否下钻
      drillDownFontSize: 14,
      drillDownFontWeight: false,
      drillDownColor: '#303133',
      // 图表标题设置
      titleText: '', //主标题
      titleTextStyleColor: '#303133', //主标题字体颜色
      titleTextStyleFontSize: 18, //主标题字体大小[12-25px]
      titleTextStyleFontWeight: false, //主标题是否加粗
      titleLeft: 'center', //主子标题位置[left,center,right]
      titleBgColor: '', //主子标题背景色[rgba(),#303133]
      // 图表副标题设置
      titleSubtext: '', //子标题
      titleSubtextStyleColor: '#303133', //子标题字体颜色
      titleSubtextStyleFontSize: 12, //子标题字体大小[12-25px]
      titleSubtextStyleFontWeight: false, //子标题是否加粗
      //提示语设置
      tooltipShow: true, //提示语显示
      tooltipTextStyleFontSize: 14, //提示语字体大小
      tooltipTextStyleFontWeight: false, //提示语是否加粗
      tooltipTextStyleColor: '#303133', //提示语字体颜色
      tooltipBgColor: '#fff', //提示语背景颜色
      //坐标轴边距设置
      seriesCenterLeft: 50, //左边距
      seriesCenterTop: 50, //右边距
      seriesItemStyleOpacity: 1, //散点透明度
      seriesType: 'effectScatter', //散点类型
      seriesPointSize: 20, //热力图点的大小
      seriesBlurSize: 20, //热力图点的模糊大小
      seriesMaxOpacity: 1, //热力图最大透明度
      showNumber: undefined, //数据显示数量
      appShowNumber: undefined, //app数据显示数量
      autoCarousel: true, //自动轮播
      autoCarouselTime: 3000, //自动轮播时间
      visualMapType: 'continuous', //continuous:连续型视觉  piecewise:分段型视觉
      visualMapMin: 0, //最小值
      visualMapMax: 200, //最大值
      // 柱体设置
      seriesBarWidth: 30, //柱体宽度
      seriesItemStyleBarBorderRadius: 0, //柱体圆角
      //柱体排名
      barTitleText: '数据统计排名',
      barTitleTextStyleFontSize: '14',
      barTitleTextStyleFontWeight: false,
      barTitleTextStyleColor: '#303133',
      berGridTop: 35, //顶边距
      berGridRight: 10, //右边距
      berGridBottom: 180, //底边距
      updateMapType: '',
      target: '_self',
      urlAddress: '',
    },
    mappingConfig: [
      { field: '维度', value: '' },
      { field: '数值', value: '' },
      { field: '经度', value: '' },
      { field: '纬度', value: '' },
    ],
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 4,
    minH: 4,
    maxW: 12,
    maxH: 20,
  },
  {
    icon: 'icon-ym icon-ym-portal-custom-echart',
    label: '自定义echart',
    futureKey: 'customEcharts',
    title: '自定义echart',
    renderKey: '',
    visibility: ['pc', 'app'],
    card: {
      titleFontSize: 14,
      titleFontWeight: false,
      titleFontColor: '#303133',
      titleLeft: 'left',
      titleBgColor: '',
      cardIcon: 'icon-ym icon-ym-portal-custom-echart',
      cardIconColor: '#606266',
      linkType: '',
      type: '',
      moduleId: '',
      urlAddress: '',
      linkTarget: '_self',
      appLinkType: '',
      appType: '',
      appModuleId: '',
      appUrlAddress: '',
    },
    dataType: 'static',
    propsApi: '',
    option: '',
    refresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    appDataType: 'static',
    appPropsApi: '',
    appPropsName: '',
    appTemplateJson: {},
    appOption: '',
    appRefresh: {
      autoRefresh: false,
      autoRefreshTime: 5,
    },
    w: 6,
    h: 8,
    minW: 6,
    minH: 8,
    maxW: 12,
    maxH: 20,
  },
];
