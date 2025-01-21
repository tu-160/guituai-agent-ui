import type { UploadFileParams } from '../types/axios';

import { defHttp } from '../http/index';

// let bseApi: string = import.meta.env.PROD ? '' : '';

const bseApi: string = '';

// 模拟数据列表
export function mockList(data: any) {
  return defHttp.get({
    data,
    url: `${bseApi}/m1/4225195-3866131-default/pet/findByStatus?err=1`,
  });
}

// 情感分析
export function sentimentApi(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/sentiment`,
  });
}

// 合同抽取
export function extractContract(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/extractContract`,
  });
}

// 语音转文字
export function voice2text(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/voice2text`,
    },
    data,
  );
}

// 文档抽取--PDF文档
export function pdf2text(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/pdf2text`,
    },
    data,
  );
}

// 图像分类-通用图像
export function classpic(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/classpic`,
    },
    data,
  );
}

// 人脸识别--人脸检测
export function faceCheck(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/faceCheck`,
    },
    data,
  );
}

// 光学字符--通用识别
export function exchangeOcr(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/ocr`,
    },
    data,
  );
}

// 条码识别--验证码识别
export function captcha(data: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: `${bseApi}/api/exchange/captcha`,
    },
    data,
  );
}

// 信息抽取--招标抽取
export function extractBidding(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/extractBidding`,
  });
}

// 信息抽取--法律文书
export function extractJudgment(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/extractJudgment`,
  });
}

// 信息抽取--简历抽取
export function extractResume(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/extractResume`,
  });
}

// 信息抽取--观点抽取
export function extractAppraise(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/extractAppraise`,
  });
}

// 机器翻译
export function translation(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/translation`,
  });
}

// 词性标注
export function exchangeLac(data: any) {
  return defHttp.post({
    data,
    url: `${bseApi}/api/exchange/lac`,
  });
}
