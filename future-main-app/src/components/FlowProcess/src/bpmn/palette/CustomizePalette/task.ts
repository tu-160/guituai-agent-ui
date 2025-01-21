import { futureApproverConfig } from '../../config/element/approver';

export default function (bpmnFactory: any, elementFactory: any, create: any, translate: any) {
  const { palette, name, shapeType, BpmnBusinessObjectKey } = futureApproverConfig;

  function createTask() {
    return function (event: any) {
      // 自定义的 不需要根据elementFactory来自动创建业务对象
      const businessObject = bpmnFactory.create(shapeType);
      businessObject[BpmnBusinessObjectKey.name] = name;
      // 在刚创建的bpmnFactory创建的业务对象中 增加新的图表形状
      const shape = elementFactory.createShape({
        type: shapeType,
        businessObject,
      });
      create.start(event, shape);
    };
  }
  return {
    [palette.name]: {
      group: palette.group, // 分组名
      className: palette.className,
      // className: 'bpmn-icon-user-task',
      title: translate(palette.title), // 提示信息
      // html: `<div><${translate(palette.title)}></div>`,
      action: {
        dragstart: createTask(), // 拖拽是触发
        click: createTask(), // 点击后触发
      },
    },
  };
}
