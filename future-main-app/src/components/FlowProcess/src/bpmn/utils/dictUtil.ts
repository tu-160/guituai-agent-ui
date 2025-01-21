export interface DictItem {
  dictValue: string;
  dictItemValue: string;
  dictItemLabel: string;
}

export const dict = {
  YesNo: {
    name: 'YesNo',
    Yes: 'Y',
    No: 'N',
  },
  EnabledDisabled: {
    enabled: 'enabled',
    disabled: 'disabled',
  },
  ProviderState: {
    name: 'ProviderState',
  },
  ProviderType: {
    name: 'ProviderType',
    alibaba: 'alibaba',
    tencent: 'tencent',
    huawei: 'huawei',
    minio: 'minio',
  },
  IAMProviderProtocol: {
    name: 'IAMProviderProtocol',
    oidc: 'oidc',
    saml2: 'saml2',
    cas: 'cas',
  },
  IAMProviderType: {
    name: 'IAMProviderType',
    qq: 'qq',
    dingtalk: 'dingtalk',
    qywechat: 'qywechat',
    feishu: 'feishu',
    wechat: 'wechat',
    alipay: 'alipay',
    weibo: 'weibo',
    alibaba: 'alibaba',
    tencent: 'tencent',
  },
  Gender: {
    name: 'Gender',
  },
  Political: {
    name: 'Political',
  },
  Marital: {
    name: 'Marital',
  },
  StudentStatus: {
    name: 'StudentStatus',
  },
  GBNation: {
    name: 'GBNation',
  },
  GradeLevel: {
    name: 'GradeLevel',
  },
  AccountType: {
    name: 'AccountType',
  },
  UserCertType: {
    name: 'UserCertType',
  },
  AppInfoVersionState: {
    name: 'AppInfoVersionState',
    publish: 'publish',
    develop: 'develop',
    history: 'history',
  },
  LanguageType: {
    name: 'LanguageType',
    enUS: 'en_US',
    zhCN: 'zh_CN',
    zhTW: 'zh_TW',
  },
};
export const dictName = [
  dict.YesNo.name,
  dict.Gender.name,
  dict.Political.name,
  dict.Marital.name,
  dict.StudentStatus.name,
  dict.GBNation.name,
  dict.GradeLevel.name,
  dict.AccountType.name,
  dict.UserCertType.name,
  dict.LanguageType.name,
];

export const YesNo2Boolean = (value: any) => {
  return dict.YesNo.Yes === value || dict.YesNo.No === value ? dict.YesNo.Yes === value : value;
};

export const Boolean2YesNo = (value: any) => {
  return value === true || value === false ? value ? dict.YesNo.Yes : dict.YesNo.No : value;
};

export const Enabled2Boolean = (value: any) => {
  return dict.EnabledDisabled.enabled === value || dict.EnabledDisabled.disabled === value ?
    dict.EnabledDisabled.enabled === value : value;
};

export const Boolean2Enabled = (value: any) => {
  return value === true || value === false ? value ? dict.EnabledDisabled.enabled : dict.EnabledDisabled.disabled : value;
};
