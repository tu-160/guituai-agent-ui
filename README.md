<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh.md">简体中文</a> 
</p>



# 圭图AI： 一个基于 Java、Python的 LLM（大语言模型）应用开发架构。充分发挥Java在企业应用的优势和Python在LLM上的优势，两者结合，形成面向企业级的大模型低代码应用开发框架。

在当今快速发展的技术环境中，企业级应用开发正朝着更加高效、灵活和易于维护的方向发展。基于Java与Python的LLM（大语言模型）应用开发架构，旨在充分利用两种编程语言的独特优势，为企业提供一个既强大又灵活的低代码解决方案。

### 架构概述

此架构采用Java作为构建企业级业务低代码平台的核心语言，得益于其稳定性、安全性和强大的生态系统支持。Java的这些特性使其成为处理复杂的企业逻辑、数据管理及服务端应用的理想选择。同时，利用Python在开发RAG（检索增强生成）引擎方面的灵活性和效率，尤其是对于自然语言处理任务，为用户提供更智能、直观的交互体验。通过将这两种技术巧妙结合，我们创建了一个面向未来的LLM应用开发框架，能够满足现代企业不断变化的需求。

### 优点及优越性

1. **高效率与灵活性**：Java提供的稳定性和安全性确保了企业级应用的基础坚固，而Python则以其简洁的语法和丰富的机器学习库加速了开发周期，使得开发者可以更快地实现功能迭代，同时保持高质量标准。

2. **智能化用户交互**：通过集成Python驱动的RAG引擎，该架构能够显著提升应用程序的理解能力与响应质量，实现更为自然流畅的人机对话体验，极大地增强了用户体验。

3. **可扩展性强**：这种混合架构允许企业根据自身需求灵活调整资源分配和技术栈，无论是增加新的业务模块还是扩展AI功能，都能轻松应对。

4. **降低开发成本**：借助低代码平台的理念，减少了编写重复代码的工作量，提升了开发效率，降低了整体项目成本。此外，由于Java和Python都是开源且拥有庞大的社区支持，可以获得丰富的资源和插件，进一步减少开发时间。

5. **促进创新**：鼓励团队成员探索新技术的同时，也保障了现有系统的稳定运行。这种平衡促进了持续的技术创新，有助于企业在竞争中保持领先地位。



## 项目地址

### github地址

前端地址：[https://github.com/tu-160/guituai-agent-ui](https://github.com/tu-160/guituai-agent-ui)

后端地址：[https://github.com/tu-160/guituai-agent](https://github.com/tu-160/guituai-agent)

业务低代码基础服务：[https://github.com/tu-160/guituai-cloud](https://github.com/tu-160/guituai-cloud)

### gitee地址

前端地址：[https://gitee.com/dabanzong/guituai-agent-ui](https://gitee.com/dabanzong/guituai-agent-ui)

后端地址：[https://gitee.com/dabanzong/guituai-agent](https://gitee.com/dabanzong/guituai-agent)

业务低代码基础服务：[https://gitee.com/dabanzong/guituai-cloud](https://gitee.com/dabanzong/guituai-cloud)


## 技术栈

- 前端：[Vue.js](https://cn.vuejs.org/)
- 后端：[Spring Cloud/ Python](https://github.com/spring-projects/)
- 向量数据库：[elasticsearch](https://github.com/elastic/elasticsearch/)
- 缓存数据库：[redis](https://github.com/redis/redis/)


### 集成（鸣谢）
- [RAGFlow](https://github.com/infiniflow/ragflow): 是一款基于深度文档理解构建的开源 RAG 引擎。

## 商业合作
针对上面技术，我们开发了一套商业级软件，支持代理 & 私有化部署！

我们的优势，支持定制化行业解决方案，支持用户自定义Agent，技术方案领先。

<img src="./docs/20250209155532.jpg" width="300" height="300" alt="描述文字">


---


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

![输入图片说明](./docs/20250206203907.png)

![输入图片说明](./docs/20250206203932.png)

![输入图片说明](./docs/20250206204012.png)

![输入图片说明](./docs/20250206204044.png)

![输入图片说明](./docs/20250206204103.png)

![输入图片说明](./docs/20250206204119.png)

![输入图片说明](./docs/20250206204136.png)



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

