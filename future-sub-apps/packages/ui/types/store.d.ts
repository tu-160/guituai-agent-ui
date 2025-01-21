import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface PermissionChildItem {
  id: string;
  enCode: string;
  fullName: string;
}

export interface PermissionInfo {
  modelId: string;
  moduleName: string;
  button: PermissionChildItem[];
  column: PermissionChildItem[];
  form: PermissionChildItem[];
  resource: PermissionChildItem[];
}

export interface SysConfigInfo {
  appIcon: Nullable<string>;
  companyName: Nullable<string>;
  copyright: Nullable<string>;
  loginIcon: Nullable<string>;
  logoIcon: Nullable<string>;
  navigationIcon: Nullable<string>;
  workLogoIcon: Nullable<string>;
  newUserDefaultPassword: Nullable<string>;
  sysName: Nullable<string>;
  sysVersion: Nullable<string>;
  title: Nullable<string>;
  futureDomain: Nullable<string>;
  defaultView: Nullable<string>;
  showLunarCalendar: Nullable<boolean>;
  firstDay: number;
  duration: number;
}

export interface SystemInfo {
  id: string;
  name: Nullable<string>;
  icon: Nullable<string>;
  currentSystem: boolean;
}

export interface UserInfo {
  birthday: Nullable<number>;
  departmentId: Nullable<string>;
  departmentName: Nullable<string>;
  email: Nullable<string>;
  headIcon: Nullable<string>;
  isAdministrator: boolean;
  manager: Nullable<string>;
  mobilePhone: Nullable<string>;
  organizeId: Nullable<string>;
  organizeIdList: Nullable<string[]>;
  organizeName: Nullable<string>;
  portalId: Nullable<string>;
  positionId: Nullable<string>;
  positionName: string;
  positionIds: any[];
  prevLogin: number;
  prevLoginIPAddress: Nullable<string>;
  prevLoginIPAddressName: Nullable<string>;
  prevLoginTime: Nullable<number>;
  roleName: Nullable<string>;
  roleIds: string[];
  groupIds: string[];
  systemId: string;
  systemIds: SystemInfo[];
  userAccount: string;
  userId: string;
  userName: Nullable<string>;
  signImg: string;
  signId: string;
  standingList: any[];
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
