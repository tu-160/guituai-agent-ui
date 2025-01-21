import fs from 'node:fs/promises';

import { format, getFileInfo, resolveConfig } from 'prettier';
/**
 * 指定的文件进行格式化，并返回格式化后的内容
 * @param filepath 
 * @returns 
 */
async function prettierFormat(filepath: string) {
  const prettierOptions = await resolveConfig(filepath, {});

  const fileInfo = await getFileInfo(filepath);

  const input = await fs.readFile(filepath, 'utf8');
  const output = await format(input, {
    ...prettierOptions,
    parser: fileInfo.inferredParser as any,
  });
  if (output !== input) {
    await fs.writeFile(filepath, output, 'utf8');
  }
  return output;
}

export { prettierFormat };
