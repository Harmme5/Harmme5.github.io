---
title: 如何让大语言模型稳定输出JSON格式固定内容
slug: >-
  how-to-make-a-large-language-model-stably-output-fixed-content-in-json-format-znoxqp
url: >-
  /post/how-to-make-a-large-language-model-stably-output-fixed-content-in-json-format-znoxqp.html
date: '2026-06-20 15:56:24+08:00'
lastmod: '2026-06-20 15:56:24+08:00'
tocOrdered: false
toc: true
isCJKLanguage: true
---

# 如何让大语言模型稳定输出JSON格式固定内容

[如何让大语言模型稳定输出JSON格式固定内容？#大模型 #人工智能 #AI大模型 #AI #Agent - 抖音](https://www.douyin.com/video/7624851375507439098)

笔记记录自抖音视频，关于**控制大模型稳定输出JSON格式**这个问题，之前在做六足机器人项目时，我最多尝试到了本视频描述到的第二步，即设置`response_format`​参数为`{"type": "json_object"}`​，使用该模式同时需要确保提示词中包含“JSON”关键词。该模式在，一共跑过478次调用大模型(`qwen-vl-flash`系列)，这478次全部稳定输出JSON格式，并无其他冗余文案，但该场景下，无需极致稳定，也就没有了后续的校验优化。

---

工业级开发需要绝对的确定性，而模型天生自带“随机性”，是追求稳定性的障碍，不可控即不可用。

# 第一道防线：提示词控制（Schema注入+近因效应）

> [!CAUTION] 🚨 传统Prompt痛点
> 仅有在提示词中加入"输出JSON"时，模型常添加多余文字或解释，导致程序解析失败。

## Schema注入+Few-shot

明确提供TypeScript接口或JSON Schema定义，并给出2-3个真实范例，强制模型对齐格式。

## 近因效应

将“禁止废话，仅输出JSON”指令置于末尾，并用定界符框定输出区域，避免长上下文模型遗忘格式要求

---

经过以上措施，如果还是翻车，就上第二道防线

# 第二道防线：生成控制层

## 针对闭源API：Structured Outputs

在模型解码时将Schema预编译到引擎中，以[千问设置结构化输出](https://help.aliyun.com/zh/model-studio/qwen-structured-output#f39f3c9e1a03)为例

![image](http://127.0.0.1:10803/assets/image-20260620124931-8waypks.png)

## 针对开源模型：Logit Masking

> [!NOTE] ✏️ Logit Masking
> Logit Masking（概率掩码）技术
> 
> 基于有限状态机或正则约束，把不符合阶层语法的字符概率直接设为负无穷，从物理层面彻底杜绝格式错误。

---

前面两道防线都做好了，还要留好兜底方案

# 第三道防线：工程校验与自修复的闭环逻辑

> [!NOTE] ✏️ 强校验框架
> 引入Pydantic等工具，对模型输出进行字段完整性和类型正确性检查，杜绝脏数据。

> [!NOTE] ✏️ 闭环自修复机制
> 将校验报错信息（如“字段缺失”）反馈给模型，指导其修正错误，利用LLM能力完成自我修复

> [!NOTE] ✏️ 流式解析优化
> 针对超长JSON输出，采用边生成边检查的流式方式，及时发现错误并中断，节省计算资源，

# 总结

> [!IMPORTANT] ❗ 总体思路
> 让模型稳定输出，不能靠“灵光一闪”，而要靠确定的**软件工程防线**去包裹非确定的生成模型。

> [!NOTE] ✏️ 工程组合拳
> 提示词给样例 + API开约束 + 推理端加掩码 + 工程端自修复重试。将格式错误率降至0.1%以下

## 进阶方案

对于极致稳定性要求的场景，采用**SFT监督微调**<span data-type="text">，让模型形成“肌肉记忆”，实现条件反射式的正确输出。</span>
