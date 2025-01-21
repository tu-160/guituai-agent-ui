export type Awaitable<T> = Promise<T> | T;

/**
 *导入commonjs模块并返回默认导出
 * @param m
 */
export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}
