<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh.md">简体中文</a> 
</p>



# 圭图AI： 一个基于 Java、Python的 LLM（大语言模型）应用开发架构。充分发挥Java在企业应用的优势和Python在LLM上的优势，两者结合，形成面向企业级的大模型低代码应用开发框架。

---

## 圭图AI是什么？

是一款基于深度文档理解构建的开源 RAG（Retrieval-Augmented Generation）引擎。可以为各种规模的企业及个人提供一套精简的 RAG 工作流程，结合大语言模型（LLM）针对用户各类不同的复杂格式数据提供可靠的问答以及有理有据的引用。

## 主要功能

### **"Quality in, quality out"**

- 基于[深度文档理解]，能够从各类复杂格式的非结构化数据中提取真知灼见。
- 真正在无限上下文（token）的场景下快速完成大海捞针测试。

### **基于模板的文本切片**

- 不仅仅是智能，更重要的是可控可解释。
- 多种文本模板可供选择

### **有理有据、最大程度降低幻觉（hallucination）**

- 文本切片过程可视化，支持手动调整。
- 有理有据：答案提供关键引用的快照并支持追根溯源。

### **兼容各类异构数据源**

- 支持丰富的文件类型，包括 Word 文档、PPT、excel 表格、txt 文件、图片、PDF、影印件、复印件、结构化数据, 网页等。

### **全程无忧、自动化的 RAG 工作流**

- 全面优化的 RAG 工作流可以支持从个人应用乃至超大型企业的各类生态系统。
- 大语言模型 LLM 以及向量模型均支持配置。
- 基于多路召回、融合重排序。
- 提供易用的 API，可以轻松集成到各类企业系统。

### **部分系统截图**

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206203907.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206203932.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206204012.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206204044.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206204103.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206204119.png)

![输入图片说明](https://github.com/tu-160/guituai-agent/blob/main/docs/20250206204136.png)



## 生态支持

### 大语言模型（支持主流30+大语言模型）


| 大语言模型名称                       | 支持情况   | 描述    |
|-------------------------------|--------|-------|
| DeepSeek                       | ✅ 已支持  | -     |
| MiniCPM                       | ✅ 已支持  | -     |
| ChatGPT                       | ✅ 已支持  | -     |
| Ollama 部署模型                   | ✅ 已支持  | -     |
| 星火大模型                         | ✅ 已支持  | -     |
| 通义千问                          | ✅ 已支持  | -     |
| 智普 ChatGLM                    | ✅ 已支持  | -     |
| 月之暗面 Moonshot                 | ✅ 已支持  | -     |
| Qwen2-7B-Instruct   | ✅ 已支持  | -     |
| Qwen2-72B-Instruct  | ✅ 已支持  | -     |
| Yi-1.5-34B-Chat     | ✅ 已支持  | -     |
| glm-4-9b-chat       | ✅ 已支持  | -     |



### 图片生成模型


| 大语言模型名称                                     | 支持情况   | 描述    |
|---------------------------------------------|--------|-------|
| Openai                                      | ✅ 已支持  | -     |
| Stability                                   | ✅ 已支持  | -     |
| stable-diffusion-3-medium         | ✅ 已支持  | -     |
| FLUX.1-schnell                    | ✅ 已支持  | -     |
| stable-diffusion-xl-base-1.0      | ✅ 已支持  | -     |
| Kolors                            | ✅ 已支持  | -     |
| Flux.1-schnell                | ✅ 已支持  | -     |
| Stable Diffusion 3            | ✅ 已支持  | -     |
| Stable Diffusion XL           | ✅ 已支持  | -     |
| Stable Diffusion 2.1          | ✅ 已支持  | -     |
| Stable Diffusion Turbo        | ✅ 已支持  | -     |
| Stable Diffusion XL Turbo     | ✅ 已支持  | -     |
| Stable Diffusion XL Lighting  | ✅ 已支持  | -     |




### 多模态

| 大语言模型名称                     | 支持情况   | 描述    |
|-----------------------------|--------|-------|
| DeepSeek                      | ✅ 已支持  | -     |
| MimiCPM                      | ✅ 已支持  | -     |
| 通义千问                      | ✅ 已支持  | -     |
| Openai                      | ✅ 已支持  | -     |
| Ollama                      | ✅ 已支持  | -     |


### 向量化模型

| 大语言模型名称                     | 支持情况   | 描述    |
|-----------------------------|--------|-------|
| Openai                      | ✅ 已支持  | -     |
| 星火大模型                       | ✅ 已支持  | -     |
| 智普 ChatGLM                  | ✅ 已支持  | -     |
| Ollama                      | ✅ 已支持  | -     |
| 通义千问                        | ✅ 已支持  | -     |
| bge-small-zh-v1.5 | ✅ 已支持  | -     |
| bge-large-zh-v1.5 | ✅ 已支持  | -     |
| bge-m3            | ✅ 已支持  | -     |


### 向量存储（向量数据库）

| 向量数据库名称       | 支持情况   | 描述 |
|---------------|--------|----|
| Milvus        | ✅ 已支持  | -  |
| OpenSearch    | ✅ 已支持  | -  |
| ElasticSearch | ✅ 已支持  | -  |
| Redis         | ✅ 已支持  | -  |




## 交流微信



