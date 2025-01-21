// pathUtils.test.ts

import { describe, expect, it } from 'vitest';

import { outputJSON, ensureFile, readJSON } from '../fs';

import { resolve } from 'node:path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

describe('handlefs', () => {
  // 测试 Windows 风格路径到 POSIX 风格路径的转换
  it('converts Windows-style paths to POSIX paths', () => {
    const filePath = process.cwd() + '/t';
    console.log('filePath --->', process.cwd());
    const data = { text: '你好' };
    expect(outputJSON(filePath, data));
  });
});
