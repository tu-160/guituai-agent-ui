const defaultGlobalForm = {
  type: 'global',
  nodeId: 'global',
  allFormMap: {}, //所有节点表单字段
  formId: '', // 将发起节点的表单id存在全局属性中
  titleType: 0, //标题类型 0：默认  1：自定义
  defaultContent: '{发起用户名}的{流程名称}', //默认名称
  titleContent: '', //自定义名称
  hasSign: false, //启用签名
  hasRevoke: false, //允许撤销
  hasComment: true, //允许评论
  hasCommentDeletedTips: true, //显示评论已被删除提示
  hasSignFor: false, //审批任务是否签收
  hasAloneConfigureForms: false, //允许审批节点独立配置表单
  hasContinueAfterReject: false, //拒绝后允许流程继续流转审批
  hasInitiatorPressOverdueNode: true, //允许发起人对当前逾期节点进行催办
  //自动提交规则
  autoSubmitConfig: {
    adjacentNodeApproverRepeated: false, //相邻节点审批人重复
    ApproverHasApproval: false, //审批人审批过该流程
    initiatorApproverRepeated: false, //发起人与审批人重复
  },
  recallRule: 1, //流程撤回规则  1: 不允许撤回  2: 发起节点允许撤回  3:所有节点允许撤回
  errorRule: 1, // 异常处理规则  1：超级管理员  2：指定人员   3：上一节点审批人指定  4：默认审批通过  5：无法提交
  errorRuleUser: [], // 异常处理指定人员
  //流程归档配置
  fileConfig: {
    on: false, //开启归档
    permissionType: 1, //查看权限 1：当前流程所有人  2：流程发起人  3：最后节点审批人
    path: '', //归档路径
    templateId: '', //归档模板
  },
  globalParameterList: [], //全局参数
};
const defaultStartForm = {
  type: 'start',
  nodeId: undefined,
  nodeName: '流程发起',
  formId: '', //流程表单id
  formName: '', //流程表单名称
  formOperates: [], //流程表单权限
  divideRule: 'inclusion', //分流规则
  //打印配置
  printConfig: {
    on: false, //开启打印
    printIds: [], //模板
    conditionType: 1, //打印条件 1：不限制  2：节点结束  3：流程结束  4：条件设置
    conditions: [], //条件设置
    matchLogic: 'and',
  },
  //限时设置配置
  timeLimitConfig: {
    on: 0, // 开启  0:关闭  1：自定义
    nodeLimit: 0, // 节点处理截止时间类型  1：接收时间  2：发起时间  3：表单变量
    duringDeal: 24, // 节点处理限定时长(时)
  },
  //提醒配置
  noticeConfig: {
    on: 0, // 开启   0:关闭  1：自定义
    firstOver: 1, // 第一次提醒时间(时)
    overTimeDuring: 2, // 提醒间隔(时)
    overNotice: true, // 提醒事务-提醒通知
    overEvent: false, // 提醒事件
    overEventTime: 5, // 提醒次数(次)
  },
  //超时设置
  overTimeConfig: {
    on: 0, // 开启   0:关闭  1：自定义
    firstOver: 0, // 第一次超时时间(时)
    overTimeDuring: 2, // 超时间隔(时)
    overNotice: true, // 超时事务-超时通知
    overAutoApprove: false, // 超时事务-超时自动审批
    overAutoApproveTime: 5, // 自动审批超时次数(次)
    overEvent: false, // 超时事件
    overEventTime: 5, // 超时事件超时次数(次)
  },
  // 流程待办通知
  waitMsgConfig: {
    on: 3, // 0:关闭  1:自定义  3：默认
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 流程结束通知
  endMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 流程评论通知
  commentMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点同意通知
  approveMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点拒绝通知
  rejectMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点退回通知
  backMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // copyMsgConfig通知
  copyMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点超时通知
  overTimeMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点提醒通知
  noticeMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
};
const defaultApproverForm = {
  type: 'approver',
  nodeId: undefined,
  nodeName: '审批节点',
  formId: '', //流程表单id
  formName: '', //流程表单名称
  formOperates: [], //流程表单权限
  assignList: [], //数据传递
  assigneeType: 6, // 指定审批人
  managerLevel: 1, //发起者主管  1：直属  2：第二级主管  ....  10:第10级主管
  formFieldType: 1, // 表单字段审核方式的类型  1：用户 2：部门  3：岗位  4：角色  5：分组
  formField: '', //表单字段
  approverNodeId: '', //审批节点id
  approvers: [], // 审批人集合
  approversSortList: [], // 审批人依次审批顺序
  extraRule: 1, // 审批人范围  1:无审批人范围  2:同一部门  3:同一岗位  4:发起人上级  5:发起人下属  6:同一公司
  counterSign: 0, //会签规则  0：或签  1：会签  2：依次审批
  // 会签流转配置
  counterSignConfig: {
    auditType: 1, // 1:按百分比  2:按人数
    auditRatio: 100,
    auditNum: 1,
    rejectType: 0,
    rejectRatio: 10,
    rejectNum: 1,
  },
  circulateUser: [], // 抄送人集合
  extraCopyRule: 1, //抄送人范围
  isCustomCopy: false, //允许自选抄送人
  isInitiatorCopy: false, //抄送给流程发起人
  isFormFieldCopy: false, //抄送给表单变量
  copyFormFieldType: 1, //表单字段类型  1：用户 2：部门  3：岗位  4：角色  5：分组
  copyFormField: '', //表单字段
  hasSign: false, //手写签名
  hasFile: false, //启用签名
  hasAuditBtn: true,
  auditBtnText: '同意',
  hasRejectBtn: true,
  rejectBtnText: '拒绝',
  hasBackBtn: false,
  backBtnText: '退回',
  hasFreeApproverBtn: false,
  freeApproverBtnText: '加签',
  hasReduceApproverBtn: false,
  reduceApproverBtnText: '减签',
  hasTransferBtn: false,
  transferBtnText: '转审',
  hasAssistBtn: false,
  assistBtnText: '协办',
  hasSaveAuditBtn: false,
  saveAuditBtnText: '暂存',
  backType: 1,
  backNodeCode: 0,
  //打印配置
  printConfig: {
    on: false, //开启打印
    printIds: [], //模板
    conditionType: 1, //打印条件 1：不限制  2：节点结束  3：流程结束  4：条件设置
    conditions: [], //条件设置
    matchLogic: 'and',
  },
  parameterList: [], //节点参数
  hasAutoApprover: false, // 自动同意规则,默认不启用
  autoAuditRule: {
    conditions: [], //条件设置
    matchLogic: 'and',
  },
  autoRejectRule: {
    conditions: [], //条件设置
    matchLogic: 'and',
  },
  divideRule: 'inclusion', //分流规则    inclusion: 根据条件多分支流转(包容网关)  exclusive:根据条件单分支流转（排它网关） parallel:所有分支都流转（并行网关）
  // 接口服务
  interfaceConfig: {
    interfaceId: '', // 接口id
    interfaceName: '', // 接口名称
    templateJson: [], // 模块json
  },
  // 节点同意通知
  approveMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点拒绝通知
  rejectMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点退回通知
  backMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // copyMsgConfig通知
  copyMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点超时通知
  overTimeMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  // 节点提醒通知
  noticeMsgConfig: {
    on: 2,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
  content: '', //内容
  //限时设置配置
  timeLimitConfig: {
    on: 2, // 开启    0:关闭   1：自定义  2:同步发起节点配置
    nodeLimit: 0, // 节点处理截止时间类型
    duringDeal: 24, // 节点处理限定时长(时)
    formField: '', // 请选择字段
  },
  //超时设置
  overTimeConfig: {
    on: 2, // 开启  0:关闭   1：自定义  2:同步发起节点配置
    firstOver: 0, // 第一次超时时间(时)
    overTimeDuring: 2, // 超时间隔(时)
    overNotice: true, // 超时事务-超时通知
    overAutoApprove: false, // 超时事务-超时自动审批
    overAutoApproveTime: 5, // 自动审批超时次数(次)
    overEvent: false, // 超时事件
    overEventTime: 5, // 超时事件超时次数(次)
  },
  //提醒配置
  noticeConfig: {
    on: 2, // 开启    0:关闭   1：自定义  2:同步发起节点配置
    firstOver: 1, // 第一次提醒时间(时)
    overTimeDuring: 2, // 提醒间隔(时)
    overNotice: true, // 提醒事务-提醒通知
    overEvent: false, // 提醒事件
    overEventTime: 5, // 提醒次数(次)
  },
};
const defaultSubFlowForm = {
  type: 'subFlow',
  nodeId: undefined,
  nodeName: '子流程',
  isAsync: 0, //子流程同步  0:异步  1:同步
  flowId: '',
  flowName: '',
  assignList: [], //数据传递
  approverType: 6, // 发起类型
  approvers: [], //发起人
  content: '',
  subFlowLaunchPermission: 1, //子流程发起权限
  errorRule: 1, // 异常处理规则 1：超级管理员  2：指定人员   3：上一节点审批人指定  4：默认审批通过  5：无法提交
  errorRuleUser: [], // 指定人员处理异常
  autoSubmit: 0, //自动提交 0:否  1:是
  divideRule: 'inclusion', //分流规则
  // 接口服务
  interfaceConfig: {
    interfaceId: '', // 接口id
    interfaceName: '', // 接口名称
    templateJson: [], // 参数
  },
  //子流程发起通知
  launchMsgConfig: {
    on: 3,
    msgId: '',
    msgName: '',
    templateJson: [],
  },
};
const defaultConnectForm = {
  type: 'connect',
  nodeId: undefined,
  nodeName: '连接线',
  conditions: [],
  matchLogic: 'and',
};

export default {
  defaultGlobalForm,
  defaultStartForm,
  defaultApproverForm,
  defaultSubFlowForm,
  defaultConnectForm,
};
