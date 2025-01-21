const defaultStartForm = {
  title: '触发动作设置', // 标题
  formType: 1, // 表单类型 1-在线开发普通表单 2-在线开发流程表单 3-数据接口
  formId: '', // 触发表单/接口id
  formName: '', // 触发表单/接口名称
  formFieldList: [], // 表单/接口字段
  interfaceTemplateJson: [], // 接口参数
  triggerEvent: 1, // 触发事件 1-新增 2-修改 3-删除
  ruleList: [], // 触发条件规则
  ruleMatchLogic: 'and', // 触发条件规则匹配逻辑
  msgUserType: [1], // 通知人类型
  msgUserIds: [], // 通知人
  // 执行失败通知
  failMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 开始执行通知
  startMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 定时触发
  startTime: null, // 触发开始时间
  cron: '', // cron表达式
  endTimeType: 1, // 触发结束时间类型
  endLimit: 1, // 触发次数
  endTime: null, // 触发指定事件
  webhookUrl: '', // webhookUrl
  webhookGetFieldsUrl: '', // webhook获取接口字段Url
  webhookRandomStr: '', // webhook获取接口字段识别码
};
export default {
  defaultStartForm,
  // 开始节点
  start: {
    type: 'start',
    content: '请设置触发事件',
    properties: defaultStartForm,
  },
  // 获取数据节点
  getData: {
    type: 'getData',
    content: '请设置想要获取的数据',
    properties: {
      title: '获取数据',
      formType: 1, // 表单类型 1-在线开发普通表单 2-在线开发流程表单 3-数据接口
      formId: '', // 触发表单/接口id
      formName: '', // 触发表单/接口名称
      formFieldList: [], // 表单/接口字段
      interfaceTemplateJson: [], // 接口参数
      ruleList: [], // 获取条件规则
      ruleMatchLogic: 'and', // 获取条件规则匹配逻辑
    },
  },
  // 新增数据节点
  addData: {
    type: 'addData',
    content: '请设置新增数据',
    properties: {
      title: '新增数据',
      enableFlow: 0,
      flowId: '', // 流程id
      formId: '', // 表单id
      formName: '', // 表单名称
      formFieldList: [], // 表单字段
      transferList: [], // 字段设置
      ruleList: [], // 新增条件规则/唯一性验证
      ruleMatchLogic: 'and', // 新增条件规则/唯一性验证匹配逻辑
      addRule: 0, // 数据存在时 0-不新增数据 1-不新增数据
    },
  },
  // 更新数据节点
  updateData: {
    type: 'updateData',
    content: '请设置更新数据',
    properties: {
      title: '更新数据',
      enableFlow: 0,
      flowId: '', // 流程id
      formId: '', // 表单id
      formName: '', // 表单名称
      formFieldList: [], // 表单字段
      transferList: [], // 更新字段
      ruleList: [], // 更新条件规则/唯一性验证
      ruleMatchLogic: 'and', // 更新条件规则/唯一性验证匹配逻辑
      unFoundRule: 0, // 未找到数据时 0-不更新 1-新增
    },
  },
  // 删除数据节点
  deleteData: {
    type: 'deleteData',
    content: '请设置删除数据',
    properties: {
      title: '删除数据',
      formId: '', // 表单id
      formName: '', // 表单名称
      formFieldList: [], // 表单字段
      ruleList: [], // 删除条件规则/唯一性验证
      ruleMatchLogic: 'and', // 删除条件规则/唯一性验证匹配逻辑
      deleteRule: 0, // 数据存在时 0-删除未找到的数据 1-删除未找到的数据
    },
  },
  // 数据接口节点
  dataInterface: {
    type: 'dataInterface',
    content: '请设置数据接口',
    properties: {
      title: '数据接口',
      formId: '', // 接口id
      formName: '', // 接口名称
      templateJson: [], // 接口参数
    },
  },
  // 消息通知节点
  message: {
    type: 'message',
    content: '请设置消息通知',
    properties: {
      title: '消息通知',
      msgUserIds: [], // 通知人
      msgId: '',
      msgName: '',
      templateJson: [],
    },
  },
  // 发起审批节点
  launchFlow: {
    type: 'launchFlow',
    content: '请设置发起审批',
    properties: {
      title: '发起审批',
      flowId: '', // 流程id
      flowName: '', // 流程名称
      formFieldList: [], // 表单字段
      transferList: [], // 字段设置
      initiator: [],
    },
  },
  empty: {
    type: 'empty',
    content: '',
    properties: {},
  },
};
