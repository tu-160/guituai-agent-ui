import CryptoJS from 'crypto-js';

// 获取加密密钥

// MD5加密
export function md5(input: string): string {
  return CryptoJS.MD5(input).toString();
}

// AES加密
export function aesEncrypt(data: string, key: string): string {
  const parsedKey = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(data, parsedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex); // 16 进制转换
}

// 加密密码
export function encryptPassword(password: string): string {
  const md5Hash = md5(password);
  const encryptionKey = import.meta.env.VITE_APP_ENCRYPTIONKEY || '';
  return aesEncrypt(md5Hash, encryptionKey);
}
