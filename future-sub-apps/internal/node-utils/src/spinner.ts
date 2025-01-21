import ora, { type Ora } from 'ora';

interface SpinnerOptions {
  failedText?: string;
  successText?: string;
  title: string;
}

/**
 * 创建一个异步加载指示器 (成功打印成功，失败打印失败)
 * @param param0 
 * @param callback 
 * @returns 
 */
export async function spinner<T>(
  { failedText, successText, title }: SpinnerOptions,
  callback: () => Promise<T>,
): Promise<T> {
  const loading: Ora = ora(title).start();

  try {
    const result = await callback();
    loading.succeed(successText || 'Success!');
    return result;
  } catch (error) {
    loading.fail(failedText || 'Failed!');
    throw error;
  } finally {
    loading.stop();
  }
}
