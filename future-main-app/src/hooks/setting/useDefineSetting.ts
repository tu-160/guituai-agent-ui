export const useDefineSetting = () => {
  const flowStatusList = [
    { id: 0, fullName: '待提交' },
    { id: 1, fullName: '进行中' },
    { id: 2, fullName: '已通过' },
    { id: 3, fullName: '已拒绝' },
    { id: 4, fullName: '已终止' },
    { id: 5, fullName: '已暂停' },
    { id: 6, fullName: '撤销中' },
    { id: 7, fullName: '已撤销' },
    { id: 8, fullName: '已退回' },
    { id: 9, fullName: '已撤回' },
  ];
  const flowUrgentList = [
    { id: 1, fullName: '普通' },
    { id: 2, fullName: '重要' },
    { id: 3, fullName: '紧急' },
  ];

  function getUrgentText(value) {
    if (value == 2) return '重要';
    if (value == 3) return '紧急';
    return '普通';
  }
  function getUrgentTextColor(value) {
    if (value == 2) return '#E6A23D';
    if (value == 3) return '#FF1818';
    return '#1890FF';
  }
  function getFlowStatusContent(value) {
    return flowStatusList[value || 0]?.fullName || '';
  }
  function getFlowStatusColor(value) {
    if (value == 1) return '#0177FF';
    if (value == 2) return 'rgba(35,162,5,0.39)';
    if (value == 3) return 'rgba(242,68,68,0.39)';
    if (value == 4) return 'rgba(241,61,61,0.85)';
    if (value == 5) return 'rgba(185,123,6,0.39)';
    if (value == 6) return 'rgba(215,149,77,0.39)';
    if (value == 7) return 'rgba(245,127,0,0.39)';
    if (value == 8) return 'rgba(21,21,157,0.39)';
    if (value == 9) return 'rgba(186,33,33,0.39)';
    return '#F09437';
  }
  function getHandlingStatusContent(value) {
    if (value == 1) return '流转';
    if (value == 2) return '加签';
    if (value == 3) return '转审';
    if (value == 4) return '指派';
    if (value == 5) return '退回';
    if (value == 6) return '撤回';
    if (value == 7) return '协办';
    if (value == 8) return '撤销';
    return '待签收';
  }
  function getHandlingStatusColor(value) {
    if (value == 1) return '#3DC60A';
    if (value == 2) return 'rgba(25,185,185,0.39)';
    if (value == 3) return 'rgba(49,151,214,0.39)';
    if (value == 4) return 'rgba(255,0,0,0.39)';
    if (value == 5) return 'rgba(21,21,157,0.39)';
    if (value == 6) return 'rgba(186,33,33,0.39)';
    if (value == 7) return 'rgba(172,214,58,0.39)';
    if (value == 8) return 'rgba(245,127,0,0.39)';
    return '#2B6EF2';
  }
  function getFlowStateContent(value) {
    const stateList = [
      '拒绝',
      '同意',
      '发起',
      '退回',
      '撤回',
      '加签',
      '减签',
      '转审',
      '暂停',
      '恢复',
      '复活',
      '指派',
      '催办',
      '协办',
      '撤销申请',
      '终止',
      '同意撤销',
      '拒绝撤销',
    ];
    if (value == -1) return '待审批';
    if (value == -2) return '未审批';
    return stateList[value] || '';
  }
  function getFlowStateColor(value) {
    const colorList = [
      'rgba(242,68,68,0.39)',
      'rgba(35,162,5,0.39)',
      'rgba(0,0,255,0.39)',
      'rgba(21,21,157,0.39)',
      'rgba(186,33,33,0.39)',
      'rgba(25,185,185,0.39)',
      'rgba(50,191,61,0.39)',
      'rgba(49,151,214,0.39)',
      'rgba(185,123,6,0.39)',
      'rgba(45,94,186,0.39)',
      'rgba(50,191,61,0.39)',
      'rgba(255,0,0,0.39)',
      'rgba(0,128,0,0.39)',
      'rgba(172,214,58,0.39)',
      'rgba(245,127,0,0.39)',
      'rgba(241,61,61,0.85)',
      'rgba(35,162,5,0.39)',
      'rgba(242,68,68,0.39)',
    ];
    if (value == -1 || value == -2) return 'rgba(165,168,172,1)';
    return colorList[value] || '';
  }
  function getHexColor(color) {
    let values = color
      .replace(/rgba?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
    let a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2);
  }

  return {
    flowStatusList,
    flowUrgentList,
    getUrgentText,
    getUrgentTextColor,
    getFlowStatusContent,
    getFlowStatusColor,
    getHandlingStatusContent,
    getHandlingStatusColor,
    getFlowStateContent,
    getFlowStateColor,
    getHexColor,
  };
};
