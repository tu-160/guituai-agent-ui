import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';

/**
 * 将JSON数据写入文件中
 * @param filePath
 * @param data
 * @param spaces
 */
export async function outputJSON(filePath: string, data: any, spaces: number = 2) {
  try {
    const dir = dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    const jsonData = JSON.stringify(data, null, spaces);
    await fs.writeFile(filePath, jsonData, 'utf8');
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
}

/**
 * 用于确保指定的文件存在。如果文件不存在，它将创建该文件并将其写入空内容。
 * @param filePath 
 */
export async function ensureFile(filePath: string) {
  try {
    const dir = dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, '', { flag: 'a' });
  } catch (error) {
    console.error('Error ensuring file:', error);
    throw error;
  }
}
/**
 * 读取一个JSON文件并将其解析为JavaScript对象
 * @param filePath 
 * @returns 
 */
export async function readJSON(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}
