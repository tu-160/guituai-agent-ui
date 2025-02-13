import { i18n } from "@/locales/i18n";

type Item = {
  key: string;
  label: string;
  value: string;
};
export const DictItems: Item[] = [
  {
    label: i18n.global.t('knowledgeConfiguration.chunkGeneral'),
    key: 'naive',
    value: 'naive',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkQA'),
    key: 'qa',
    value: 'qa',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkResume'),
    key: 'resume',
    value: 'resume',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkManual'),
    key: 'manual',
    value: 'manual',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkTable'),
    key: 'table',
    value: 'table',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkPaper'),
    key: 'paper',
    value: 'paper',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkBook'),
    key: 'book',
    value: 'book',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkLaws'),
    key: 'laws',
    value: 'laws',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkPresentation'),
    key: 'presentation',
    value: 'presentation',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkOne'),
    key: 'one',
    value: 'one',
  },
  {
    label: i18n.global.t('knowledgeConfiguration.chunkKGraph'),
    key: 'knowledge_graph',
    value: 'knowledge_graph',
  },
];

// parserDescriptions.ts
export const parserDescriptions = {
  naive: `
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">"General" 分块方法说明</p>
    <p>支持的文件格式为DOCX、EXCEL、PPT、IMAGE、PDF、TXT、MD、JSON、EML、HTML。</p>
    <p>此方法将简单的方法应用于块文件：</p>
    <li>系统将使用视觉检测模型将连续文本分割成多个片段。</li>
    <li>接下来，这些连续的片段被合并成Token数不超过“Token数”的块。</li>
    <p></p>
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">"General" 示例</p>
    <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/general1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/general2.svg" style="width: 100%;">
      </div>  
      </div>
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">General 对话示例</p>
  `,
  qa: `
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Q&A" 分块方法说明</p>
    <p>此块方法支持<b> excel </b>和<b> csv/txt </b>文件格式。</p>
    <li>
      如果文件以<b> excel </b>格式，则应由两个列组成
      没有标题：一个提出问题，另一个用于答案，
      答案列之前的问题列。多张纸是
      只要列正确结构，就可以接受。
    </li>
    <li>
      如果文件以<b> csv/txt </b>格式为
      用作分开问题和答案的定界符。
    </li>
    <p>
      <i>
        未能遵循上述规则的文本行将被忽略，并且
        每个问答对将被认为是一个独特的部分。
      </i>
    </p>
    <p></p>
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Q&A" 示例</p>
    <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/qa1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/qa2.svg" style="width: 100%;">
      </div>  
      </div>
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">Q&A 对话示例</p>
  `,
  resume: `
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Resume" 分块方法说明</p>
      <p>支持的文件格式为<b>DOCX</b>、<b>PDF</b>、<b>TXT</b>。</p>
      <p>简历有多种格式，就像一个人的个性一样，但我们经常必须将它们组织成结构化数据，以便于搜索。</p>
      <p>我们不是将简历分块，而是将简历解析为结构化数据。 作为HR，你可以扔掉所有的简历， 您只需与<i>'GuiTuAI'</i>交谈即可列出所有符合资格的候选人。</p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Resume" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/resume1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/resume2.svg" style="width: 100%;">
      </div>  
      </div>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Q&A 对话示例</p>
  `,
  manual: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Manual" 分块方法说明</p>
      <p>仅支持<b>PDF</b>。</p>
      <p>
      我们假设手册具有分层部分结构。 我们使用最低的部分标题作为对文档进行切片的枢轴。
      因此，同一部分中的图和表不会被分割，并且块大小可能会很大。
      </p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Manual" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/manual1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/manual2.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/manual3.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/manual4.svg" style="width: 100%;">
      </div>  
    </div>
    <p style="font-size: 16px; font-weight: bold; font-family: Inter">Q&A 对话示例</p>
  `,
  table: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Table" 分块方法说明</p>
      <p>支持</p>
      <p><b>EXCEL</b>和<b>CSV/TXT</b>格式文件。</p>
      <p>
      以下是一些提示：
      </p>
      <ul>
        <li>对于 csv 或 txt 文件，列之间的分隔符为 <em><b>TAB</b></em>。</li>
        <li>第一行必须是列标题。</li>
        <li>列标题必须是有意义的术语，以便我们的大语言模型能够理解。
            列举一些同义词时最好使用斜杠<i>'/'</i>来分隔，甚至更好
            使用方括号枚举值，例如 <i>'gender/sex(male,female)'</i>.<p>
            以下是标题的一些示例：</p><ol>
        <li>供应商/供货商<b>'TAB'</b>颜色（黄色、红色、棕色）<b>'TAB'</b>性别（男、女）<b>'TAB'尺码（M、L、XL、XXL）</b></li><b>
        <li>姓名/名字<b>'TAB'</b>电话/手机/微信<b>'TAB'</b>最高学历（高中，职高，硕士，本科，博士，初中，中技，中 专，专科，专升本，MPA，MBA，EMBA）</li>
        </b></ol><b>
        <p></p>
        </b></li><b>
        <li>表中的每一行都将被视为一个块。</li>
        </b>
      </ul>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Table" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
            <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/table1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/table2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Table 对话示例</p>
  `,
  paper: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Paper" 分块方法说明</p>
      <p>仅支持<b>PDF</b>文件。</p>
      <p>如果我们的模型运行良好，论文将按其部分进行切片，例如<i>摘要、1.1、1.2</i>等。</p>
      <p>
      这样做的好处是LLM可以更好的概括论文中相关章节的内容，
      产生更全面的答案，帮助读者更好地理解论文。
      缺点是它增加了 LLM 对话的背景并增加了计算成本，
      所以在对话过程中，你可以考虑减少‘<b>topN</b>’的设置。</p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Paper" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
            <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/paper1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/paper2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Paper 对话示例</p>
  `,
  book: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Book" 分块方法说明</p>
      <p>支持的文件格式为<b>DOCX</b>、<b>PDF</b>、<b>TXT</b>。</p>
      <p>
      由于一本书很长，并不是所有部分都有用，如果是 PDF，
      请为每本书设置<i>页面范围</i>，以消除负面影响并节省分析计算时间。</p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Book" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/book1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/book2.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/book3.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/book4.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Book 对话示例</p>
      `,
  laws: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Laws" 分块方法说明</p>
      <p>支持的文件格式为<b>DOCX</b>、<b>PDF</b>、<b>TXT</b>。</p>
      <p>
      法律文件有非常严格的书写格式。 我们使用文本特征来检测分割点。
      </p>
      <p>
      chunk的粒度与'ARTICLE'一致，所有上层文本都会包含在chunk中。
      </p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Laws" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/laws1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/laws2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Laws 对话示例</p>
  `,
  presentation: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Presentation" 分块方法说明</p>
      <p>支持的文件格式为<b>PDF</b>、<b>PPTX</b>。</p>
      <p>
      每个页面都将被视为一个块。 并且每个页面的缩略图都会被存储。</p>
      <p>
      <i>您上传的所有PPT文件都会使用此方法自动分块，无需为每个PPT文件进行设置。</i></p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Presentation" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/presentation1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/presentation2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Presentation 对话示例</p>
  `,
  one: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"One" 分块方法说明</p>
      <p>支持的文件格式为<b>DOCX、EXCEL、PDF、TXT</b>。
      </p>
      <p>
      对于一个文档，它将被视为一个完整的块，根本不会被分割。
      </p>
      <p>
      如果你要总结的东西需要一篇文章的全部上下文，并且所选LLM的上下文长度覆盖了文档长度，你可以尝试这种方法。
      </p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"One" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/one1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/one2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">One 对话示例</p>  
  `,
  knowledge_graph: `
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Knowledge Graph" 分块方法说明</p>
      <p>支持的文件格式为<b>DOCX、EXCEL、PPT、IMAGE、PDF、TXT、MD、JSON、EML</b></p>
      <p>文件分块后，使用分块提取整个文档的知识图谱和思维导图。此方法将简单的方法应用于分块文件：
      连续的文本将被切成大约 512 个 token 数的块。</p>
      <p>接下来，将分块传输到 LLM 以提取知识图谱和思维导图的节点和关系。</p>
      <p>注意您需要指定的条目类型。</p>
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">"Knowledge Graph" 示例</p>
      <p>提出以下屏幕截图以促进理解。</p>
      <div style="display: flex;margin-top: 16px;margin-left: -5px;margin-right: -5px;row-gap: 10px;flex-flow: row wrap;min-width: 0;">
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/knowledge_graph1.svg" style="width: 100%;">
      </div>  
      <div style="padding-left: 5px; padding-right: 5px;">
      <img alt="" src="/img/dictionary/knowledge_graph2.svg" style="width: 100%;">
      </div>  
      <p style="font-size: 16px; font-weight: bold; font-family: Inter">Knowledge Graph 对话示例</p>  
  `,
};

export const parserComponentShow = {
  naive: ['pagerank', 'auto_keywords', 'auto_questions', 'chunk_token_num', 'delimiter', 'layout_recognize', 'html4excel', 'use_raptor'],
  qa: ['pagerank', 'use_raptor'],
  resume: ['pagerank', ],
  manual: ['pagerank', 'auto_keywords', 'auto_questions', 'use_raptor'],
  table: ['pagerank', ],
  paper: ['pagerank', 'auto_keywords', 'auto_questions', 'use_raptor'],
  book: ['pagerank', 'auto_keywords', 'auto_questions', 'use_raptor'],
  laws: ['pagerank', 'auto_keywords', 'auto_questions', 'use_raptor'],
  presentation: ['pagerank', 'auto_keywords', 'auto_questions', 'use_raptor'],
  one: ['pagerank', 'auto_keywords', 'auto_questions'],
  knowledge_graph: ['pagerank', 'chunk_token_num', 'delimiter', 'entity_types'],
};
export interface RaptorConfig {
  use_raptor?: boolean; // 是否使用 Raptor
  max_token?: number; // 最大 Token 数
  threshold?: number; // 阈值
  max_cluster?: number; // 最大聚类数
  prompt?: string; // 提示语
  random_seed?: number; // 随机种子
}

export interface ParserConfig {
  auto_keywords?: null | number; // 自动关键词
  auto_questions?: null | number; // 自动问题
  chunk_token_num?: null | number; // 块 Token 数
  delimiter?: null | string; // 分隔符
  layout_recognize?: boolean | null; // 是否识别布局
  html4excel?: boolean | null; // 是否将 HTML 转换为 Excel
  raptor?: RaptorConfig; // Raptor 配置
  pages?: any | any[];
  entity_types?: any | any[];
}

export interface ParserConfigCommon {
  naive: ParserConfig;
  qa: ParserConfig;
  resume: ParserConfig;
  manual: ParserConfig;
  table: ParserConfig;
  paper: ParserConfig;
  book: ParserConfig;
  laws: ParserConfig;
  presentation: ParserConfig;
  one: ParserConfig;
  knowledge_graph: ParserConfig;
}

export const default_raptor_value: RaptorConfig = {
  max_token: 256,
  threshold: 0.1,
  max_cluster: 64,
  prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
  random_seed: 0,
}

export const parser_configCommon: ParserConfigCommon = {
  naive: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: 128,
    delimiter: '\\n!?;。；！？',
    layout_recognize: true,
    html4excel: false,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  qa: {
    auto_keywords: null,
    auto_questions: null,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  resume: {
    auto_keywords: null,
    auto_questions: null,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {},
  },
  manual: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  table: {
    auto_keywords: null,
    auto_questions: null,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {},
  },
  paper: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  book: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  laws: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  presentation: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  one: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: null,
    delimiter: null,
    layout_recognize: null,
    html4excel: null,
    raptor: {
      use_raptor: false,
      max_token: 256,
      threshold: 0.1,
      max_cluster: 64,
      prompt: '请总结以下段落。 小心数字，不要编造。 段落如下：{cluster_content}以上就是你需要总结的内容。',
      random_seed: 0,
    },
  },
  knowledge_graph: {
    auto_keywords: 0,
    auto_questions: 0,
    chunk_token_num: 8192,
    delimiter: '\\n!?;。；！？',
    layout_recognize: null,
    html4excel: null,
    raptor: {},
    entity_types: ['organization', 'person', 'location', 'event', 'time'],
  },
};
