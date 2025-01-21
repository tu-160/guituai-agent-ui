import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
export class BpmnLintError {
  public element: any;
  public message: string;
  constructor(element: any | any[], message: string) {
    this.element = element;
    this.message = message;
  }
}

// 自定义bpmnLint规则
abstract class BpmnLintBase {
  protected registry: ElementRegistry;
  protected root: any;
  protected constructor(registry: ElementRegistry, root: any) {
    this.registry = registry;
    this.root = root;
  }
  public abstract validate(): boolean;
  protected error: BpmnLintError | undefined;
  public getError(): BpmnLintError | undefined {
    return this.error;
  }
}
/**
 * xml元素校验
 *  1.流程必须要有一个【开始，结束】节点 且只能有一个。
 *  2.至少有一个【审批】节点，
 *  3.分流网关和合流官网必须成对关系。
 *  4.除了开始节点（只有出线）及结束节点（只有进线） 其它节点必须要含有出线和入线。
 *  5.分流节点出线必须有多条出线，只有一条进线； 合流节点必须有多条进线，只能有一条出线。
 *
 */
class FormValidator extends BpmnLintBase {
  public constructor(registry: ElementRegistry, root: any) {
    super(registry, root);
  }
  validate(): boolean {
    let errorList: any = [];
    let allElements = this.root.children;
    if (allElements && allElements.length > 0) {
      let newElementData = allElements.reduce((classified: any, element: any) => {
        // 获取元素类型 (网关元素存在分流和合流 所以需要取 wnGatewayType)
        let elementType = (element.type === 'bpmn:InclusiveGateway' ? element.wnGatewayType : element.type)?.replace('bpmn:', '')?.toLowerCase();
        // 如果分类对象中不存在当前类型的数组，则创建一个新数组
        if (!classified[elementType]) classified[elementType] = [];
        // 将元素添加到相应类型的数组中
        classified[elementType].push(element);
        return classified;
      }, {});
      if (newElementData) {
        if (!(newElementData.hasOwnProperty('startevent') && newElementData.hasOwnProperty('endevent') && newElementData.hasOwnProperty('usertask'))) {
          this.error = new BpmnLintError(null, '确保画布上至少包含【开始-审批-结束】节点');
          return false;
        }
        // 开始节点
        if (newElementData['startevent']) {
          if (newElementData['startevent'].length > 1) {
            // 开始 结束节点只有拥有一个
            this.error = new BpmnLintError(null, '画布上只能存在一个开始节点');
            return false;
          }
          // 开始节点只能有一个出线
          if (newElementData['startevent'][0]) {
            let outLine = newElementData['startevent'][0].outgoing;
            let inLine = newElementData['startevent'][0].incoming; // 进线
            if (inLine && inLine.length > 0) {
              errorList.push({
                element: newElementData['startevent'][0],
                error: '开始节点不存在进线，请删除多余线条！',
              });
            }
            if (!outLine) {
              errorList.push({
                element: newElementData['startevent'][0],
                error: '开始元素不能单独使用，请于其它元素进行连线使用！',
              });
            }
          }
        }
        // 结束节点：
        if (newElementData['endevent']) {
          if (newElementData['endevent'].length > 1) {
            this.error = new BpmnLintError(null, '画布上只能存在一个结束节点，请删除多余节点元素！');
            return false;
          }
          // 结束节点只能有一个进线
          if (newElementData['endevent'][0]) {
            let outLine = newElementData['endevent'][0].outgoing;
            let inLine = newElementData['endevent'][0].incoming; // 进线
            if (outLine && outLine.length > 0) {
              errorList.push({
                element: newElementData['endevent'][0],
                error: '结束节点不存在出线，请删除多余线条！',
              });
            }
            if (!inLine) {
              errorList.push({
                element: newElementData['endevent'][0],
                error: '结束元素不能单独使用，请于其它元素进行连线使用！',
              });
            }
          }
        }
        // 网关
        if (newElementData.hasOwnProperty('confluence') || newElementData.hasOwnProperty('divide')) {
          if (!(newElementData['confluence'] && newElementData['confluence'].length && newElementData['divide'] && newElementData['divide'].length)) {
            this.error = new BpmnLintError(null, '请您检查分流与合流是否成对使用！');
            return false;
          }
        }
        // 任务节点
        if (newElementData['usertask']) {
          // 遍历进线元素 必须有一条进线及出线元素
          let userTaskList = newElementData['usertask'];
          userTaskList.map((userTaskShape: any) => {
            let outLine = userTaskShape.outgoing;
            let inLine = userTaskShape.incoming; // 进线
            // 任务节点必须要有一个进线和出线
            if (outLine && outLine.length && inLine && inLine.length) {
            } else {
              errorList.push({
                element: userTaskShape,
                error: '任务元素不能单独使用，请确保至少有一条出线与一条进线',
              });
            }
          });
        }
        if (errorList && errorList.length > 0) {
          this.error = new BpmnLintError(errorList, errorList[0].error);
          return false;
        }
      }
    } else {
      this.error = new BpmnLintError(null, '画布上不存在元素，至少包含【开始-审批-结束】节点');
      return false;
    }
    return true;
  }
}

export function validate(registry: ElementRegistry, root: any): BpmnLintError | undefined {
  /***/
  const validators = [new FormValidator(registry, root)];

  for (let validator of validators) {
    if (!validator.validate()) {
      return validator.getError();
    }
  }
}
