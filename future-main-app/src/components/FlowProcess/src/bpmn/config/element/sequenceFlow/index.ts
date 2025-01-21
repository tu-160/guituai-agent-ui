import { futureConfigBpmnContextPad } from '../../contextPad';
import { bpmnSequenceFlow } from '../../variableName';
const { del } = futureConfigBpmnContextPad;
const futureSequenceFlow: any = {
  name: bpmnSequenceFlow,
  shapeType: bpmnSequenceFlow,
  contextPad: {
    default: false,
    customization: { del }, // 自定义 只有default = false 开启
  },
  properties: {},
};
export { futureSequenceFlow };
