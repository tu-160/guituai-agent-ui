import type { App } from 'vue';
import { Button } from './Button';
import {
  Input,
  InputNumber,
  Layout,
  Form,
  Switch,
  Dropdown,
  Menu,
  Select,
  Table,
  Checkbox,
  Tabs,
  Collapse,
  Card,
  Tooltip,
  Row,
  Col,
  Popconfirm,
  Divider,
  Alert,
  AutoComplete,
  Cascader,
  Rate,
  Slider,
  Avatar,
  Tag,
  Space,
  Steps,
  Popover,
  Radio,
  Progress,
  Image,
  Upload,
} from 'ant-design-vue';

import { BasicHelp, BasicCaption } from '@/components/Basic';
import { Tinymce } from '@/components/Tinymce/index';
import { FutureEmpty } from '@/components/Empty/index';

const FutureEditor = Tinymce;
FutureEditor.name = 'FutureEditor';
const FutureGroupTitle = BasicCaption;
FutureGroupTitle.name = 'FutureGroupTitle';

export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(InputNumber)
    .use(Button)
    .use(Layout)
    .use(Form)
    .use(Switch)
    .use(Dropdown)
    .use(Menu)
    .use(Select)
    .use(Table)
    .use(Checkbox)
    .use(Tabs)
    .use(Card)
    .use(Collapse)
    .use(Tooltip)
    .use(Row)
    .use(Col)
    .use(Popconfirm)
    .use(Popover)
    .use(Divider)
    .use(Slider)
    .use(Rate)
    .use(Alert)
    .use(AutoComplete)
    .use(Cascader)
    .use(Avatar)
    .use(Tag)
    .use(Space)
    .use(Steps)
    .use(Radio)
    .use(Progress)
    .use(Image)
    .use(Upload)
    .use(BasicHelp)
    .use(FutureGroupTitle)
    .use(FutureEditor)
    .use(FutureEmpty);
}
