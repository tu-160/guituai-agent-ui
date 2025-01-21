// 获取节点业务数据KEY
export const getBizComponentKey = (nodeInfo: any) => {
  return `${nodeInfo.type}:${nodeInfo.id}`;
};

/**
 *
 * @param parent
 * @param sub
 * @returns
 */
export function getElementTop(parent: HTMLElement, sub: HTMLElement) {
  const parentClient = parent.getBoundingClientRect();
  const subClient = sub.getBoundingClientRect();
  return subClient.top - parentClient.top;
}
