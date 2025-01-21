import { hiprint } from 'vue-plugin-hiprint';
const defaultImg =
  'data:image/png;base64,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';
(window as any).defaultImg = defaultImg;

const provider = () => {
  var addElementTypes = (context: any) => {
    context.removePrintElementTypes('providerModule');

    context.addPrintElementTypes('providerModule', [
      new hiprint.PrintElementTypeGroup('', [
        {
          tid: 'providerModule.text',
          title: '文本',
          type: 'text',
          options: {},
        },
        {
          tid: 'providerModule.longText',
          title: '长文本',
          type: 'longText',
          options: {},
        },
        {
          tid: 'providerModule.image',
          title: '图片',
          type: 'image',
          options: {
            width: 100,
            height: 100,
            src: defaultImg,
          },
        },
        {
          tid: 'providerModule.table',
          title: '空白表格',
          type: 'table',
          options: {},
          columns: [[{ align: 'center' }, { align: 'center' }]],
        },
        {
          tid: 'providerModule.qrcode',
          title: '二维码',
          type: 'qrcode',
          options: {
            width: 48,
            height: 48,
            testData: '',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'providerModule.barcode',
          title: '条形码',
          type: 'barcode',
          options: {
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            textType: 'barcode',
          },
        },
        {
          tid: 'providerModule.images',
          title: '图片组',
          type: 'html',
          options: {
            cType: 'images',
            imageField: '',
            width: 210,
            height: 210,
            imageWidth: 100,
            imageHeight: 100,
            imageSpace: 5,
            formatter: `function (t, e, printData) {
  if (!printData || JSON.stringify(printData) === '{}') {
    return '<div style="display:block;height:100%;width:100%;"><img src="' + defaultImg + '" style="width:100%;height:100%;" /></div>';
  }
  if (!e.field) return '';
  let fieldList = e.field.split('.');
  if (!printData[fieldList[0]] || !printData[fieldList[0]][fieldList[1]] || !printData[fieldList[0]][fieldList[1]][fieldList[2]]) return '';
  try {
    let list = JSON.parse(printData[fieldList[0]][fieldList[1]][fieldList[2]]);
    if (!Array.isArray(list) || !list.length) return '';
    let imgsArr = list.map(o => (window.hinnn.apiUrl || '') + o.url);
    var space = '0 ' + e.imageSpace + 'pt ' + e.imageSpace + 'pt' + ' 0';
    var imgsStr = '<div style="display:block;height:100%;width:100%;">';
    for (var index = 0; index < imgsArr.length; index++) {
      imgsStr += '<img src="' + imgsArr[index] + '" style="width:' + e.imageWidth + 'pt;height:' + e.imageHeight + 'pt;margin: ' + space + ';float:left;" />';
    }
    return imgsStr + '</div>';
  } catch (e) {
    return '';
  }
}`,
          },
        },
        {
          tid: 'providerModule.hline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'providerModule.vline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'providerModule.rect',
          title: '矩形',
          type: 'rect',
        },
        {
          tid: 'providerModule.oval',
          title: '椭圆',
          type: 'oval',
        },
        {
          tid: 'providerModule.cell',
          title: '',
          type: 'text',
          options: {
            width: 70,
            height: 24,
            textAlign: 'center',
            textContentVerticalAlign: 'middle',
            borderLeft: 'solid',
            borderTop: 'solid',
            borderRight: 'solid',
            borderBottom: 'solid',
          },
        },
        {
          tid: 'providerModule.printTime',
          title: '打印时间',
          type: 'text',
          options: {
            field: 'systemInfo.printTime',
            testData: '2024-05-20 12:00:00',
            height: 16,
            width: 140,
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'providerModule.printer',
          title: '打印人员',
          type: 'text',
          options: {
            field: 'systemInfo.printer',
            testData: '管理员',
            height: 16,
            width: 140,
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'providerModule.flowRecord',
          title: '审批信息',
          type: 'table',
          options: {
            field: 'operatorRecordList',
            fields: [
              { text: '节点名称', field: 'nodeName' },
              { text: '操作人员', field: 'userName' },
              { text: '操作时间', field: 'handleTime' },
              { text: '执行动作', field: 'handleStatus' },
              { text: '备注', field: 'handleOpinion' },
              { text: '签名', field: 'signImg' },
            ],
          },
          columns: [
            [
              { title: '节点名称', field: 'nodeName', width: 100 },
              { title: '操作人员', field: 'userName', width: 100 },
              { title: '操作时间', field: 'handleTime', width: 100 },
              { title: '执行动作', field: 'handleStatus', width: 100 },
              { title: '备注', field: 'handleOpinion', width: 100 },
              { title: '签名', field: 'signImg', width: 100, tableTextType: 'image' },
            ],
          ],
        },
      ]),
    ]);
  };
  return {
    addElementTypes,
  };
};

export default provider;
