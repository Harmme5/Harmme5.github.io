---
title: LoRA微调
slug: lora-finetuning-z1zm5w7
url: /post/lora-finetuning-z1zm5w7.html
date: '2026-06-11 19:32:06+08:00'
lastmod: '2026-06-11 19:32:06+08:00'
toc: true
isCJKLanguage: true
---

# LoRA微调

[【LoRA微调】从原理到调参，7 个问题彻底理解LoRA，不懂线性代数也没问题_大模型微调_低秩适配](https://www.bilibili.com/video/BV1waZ2YDEcp/?spm_id_from=333.788.recommend_more_video.0&amp;trackid=web_related_0.router-related-2481894-74gx5.1772535756302.1023&amp;vd_source=86ed3e91f3c360c8b63e6013dcb45257)

# 1.什么是LoRA

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303213024-tfuhiq3.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303213126-fklpuql.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303213150-4h7grt6.png)

- （A）有5*2=10个参数
- （B）有2*4=8个参数
- LoRA总参数：10+8 =18 个

> [!TIP] 💡 结论
> 结论：通过LoRA微调，调参对象从W变为A、B，参数量由20个减少为18个，这是简化例子。实际案例中，参数量可以减少为0.01%-3%左右

# 2.为什么需要LoRA

> [!CAUTION] 🚨 资源消耗太大
> 大型语言模型动几亿甚至几千亿参数，全参数微调需要为每个新任务保存一份完整的模型副本。比如，一个10亿参数的模型，假设每个参数用4字节（float32），光存储就得4GB。多个任务下来，硬盘和显存都吃不消。
> 
> <span data-type="text" style="color: var(--b3-font-color9); background-color: var(--b3-card-warning-background);">LoRA的思路是：与其每次都复制整个模型，不如只调整一小部分参数，把成本降下来。</span>

> [!CAUTION] 🚨 训练效率低下
> 全参数微调不仅占空间，还需要大量计算资源和时间。每次训练都得更新所有参数，反向传播的计算量巨大，尤其是在GPU资源有限的情况下，普通研究者或公司根本玩不起。LoRA通过只更新一小块”增量参数”，让微调变得轻量化，普通设备也能跑得动。

## 核心亮点

- 参数少：它只微调原始参数的1%甚至更少。
  
  - 在 GPT-3 上，r = 8 的 LoRA 参数量占全微调的 <span data-type="text" style="color: var(--b3-font-color8);">0.01%-0.1%</span>，性能却达到全微调的 <span data-type="text" style="color: var(--b3-font-color8);">95%-99%</span>。
  - 在 GLUE 任务（BERT），r = 16 的 LoRA 用 0.1% 参数，平均得分仅比全微调低 0.5-1 分。

- 速度快：训练和部署都比全参数微调省时省力。

- 模块化：训练好的LoRA”插件“可以随时加载或卸载，不影响原始模型，特别适合多任务场景。

<span data-type="text" style="font-size: 20px;">模块化设计的优点</span>  
1.<span data-type="text" style="color: var(--b3-font-color2);">避免灾难性遗忘</span>：直接修改W可能导致模型在新任务上表现良好，但在原始任务上性能下降（即"灾难性遗忘"）。LoRA通过冻结W，保留了原始模型的能力

2.<span data-type="text" style="color: var(--b3-font-color2);">存储效率高</span>：一个大模型可以搭配多个LoRA模块，每个模块只占几MB，相比全模型微调动几GB，节省空间。

3.<span data-type="text" style="color: var(--b3-font-color2);">快速切换</span>：任务切换只需加载不同LoRA文件，几秒钟搞定，不用重新训练。

4.<span data-type="text" style="color: var(--b3-font-color2);">兼容性强</span>：原始模型完全不动，多个团队可以共享同一个基础模型，只开发自己的LoRA模块。

‍

# 3.为什么可以对增量权重△W低秩分解

低秩分解的核心思想是：**矩阵里的信息往往不是均匀分布的，很多维度是余的，只需要抓住”主要方向”就够了。**

> 学过机器学习的同学，可以参考PCA主成分分析算法的理念。

## 1.什么是矩阵的秩（Rank）？

在线性代数中，一个矩阵的秩（rank）是它的**线性独立行或列**的数量。<span data-type="text" style="color: var(--b3-font-color2);">如果一个矩阵是”低秩”的，意味着它的信息可以用少量独立方向表达，而不是需要完整的维度。</span>

比如下述矩阵， 第 5 行([1, 2,0, 3, 0] ) 是第 1行( [1, 0, 0, 2, 0] )和第 2 行([0,2,0,1, 0] ) 的线性组合 (**第5行=第1行+第2行**），第5行没有提供更多的信息，理论上这个矩阵有前4行就能提供所有信息了，因此矩阵的行秩为4（列秩也为4，第5列全为0，没有信息增量）。

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220131-uv6cuc5.png)

## 2.从奇异值分解得到的启发----低秩分解的原理

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220217-798kfrg.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220231-tciprgu.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220251-lazjnd3.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220344-wt7bx9e.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220400-z2evra3.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220440-bku6jzr.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220445-5e046h9.png)

结果对比原始矩阵和重构矩阵，直观地看，基本保持一致。证实上面的结论：**如果只保留最大的几个奇异值（低秩近似），就能用更少的参数近似W。** 

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220507-iazdkqp.png)

事实上，可以通过保留的奇异值，计算重构后的矩阵，保留了多少信息，如下：

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303220540-9ulcmye.png)

## 3.为什么可以对增量权重△W低秩分解

研究发现，通过对微调后的权重变化△W的奇异值分解，大部分信息集中在少数几个奇异值上。比如，LoRA论文（Huet al.,2021）在GPT-3上测试时发现，△W的前10-20个奇异值就占据了90%以上的信息。

这意味着：当我们从一个预训练模型（比如 LLaMA 或 BERT）微调到某个特定任务时，权重矩阵的变化（即 △W=W<sub>任务</sub>－W<sub>预训练</sub>）并不是完全随机的，而是具有某种"结构化"特性。具体来说，这个变化可以用一个低秩矩阵来近似表示，它的有效自由度比原始权重矩阵的维度要少得多。<span data-type="text" style="color: var(--b3-font-color2);">由于△W的秩很低，可以用A和B直接构造，不需要完整的SVD计算，更加高效。</span>

**直观理解**  
微调是为了强化模型某个特定领域的能力，不对所有方向的参数进行调整。想象预训练模型是一个已经学会“说话”的智能体，微调只是让它学会某种特定”口音”（如法律领域的术语）。这个"口音"调整不需要重新学习所有语言规则，只需在少数关键方面（如词汇选择、语调）做改变。这种改变的”自由度“很有限，因此可以用低秩矩阵近似。

**举个例子**  
假设一个512× 512的权重矩阵（W）（总共262,144个参数)：

- 全微调：可能调整所有262,144个参数。

- LoRA：假设r=8，只用A（512×8）和B（8×512)，总共8,192个参数，就能捕捉任务的主要变化。因为△W的变化集中在少数方向（比如8个，需要调参），而不是需要512个方向。
  
  r = 8 和r = 800，因为△W是低秩的，没有太大区别

## 4.对原始权重W可以低秩分解吗？

> [!CAUTION] 🚨 不行
> 研究表明，预训练模型（如BERT）的权重矩阵（W）通常具有**较高的秩（接近满秩）** ，奇异值分布较为平滑。

# 4.LoRA如何更新参数的

本质上，还是反向传播算法。

- 在前向过程，，代入A、B的参数算出损失；
- 在反向过程，根据损失求导算出A、B参数的梯度，然后更新参数。

## LoRA的核心参数

LoRA的核心思想是通过一个低秩增量（△W）来调整预训练模型的原始权重（W），而不是直接修改W本身。它的核心公式可以简单写成：

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303223816-y20cyqv.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303223832-wjvapwc.png)

## 参数更新过程

1. 初始化
   
   ![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224016-mxd7how.png)

2. 计算损失
   
   ![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303223946-rwwvd49.png)

3. 反向传播更新
   
   ![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224044-o29r0gx.png)

4. 迭代优化
   
   ![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303223957-61ihzxf.png)

# 5.LoRA可以用在Transformer的哪些层

tips：需对Transformer有一定了解。可参考：

- 知乎: https://zhuanlan.zhihu.com/p/338817680

- B站：搜“李宏毅transformer"

**总结：LoRA是好钢，要用在刀刃上。并不是所有参数都要微调，选择部分参数进行微调就可以取得较好效果。**

Transformer模型由多层堆叠组成，每层包括自注意力机制（Self-Attention）和前馈网络（Feed-ForwardNetwork,FFN）。

**Transformer架构图**

LoRA 的集成主要是将低秩增量△W =A × B 添加到这些层的权重矩阵上，同时保持原始权重（W）冻结，如：

**注意力层（Self-Attention）**

Transformer的核心是多头注意力机制，每个头有查询、键、值、输出（Query、Key、Value、Output），即***Wq***、***Wk***、***Wv***、***Wo***四个权重矩阵。

**LoRA通常应用在**​***Wq***​**和**​***Wv***​ **，上，**​***Wq***​**决定关注哪些信息，W**​***v***​**决定输出什么内容。调整它们能直接影响模型对任务的理解和生成能力。LoRA原论文发现，微调**​***Wq***​**和**​***Wv，***​**已能接近全参数微调效果，性价比高。**   
​![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224917-0t181bc.png)  
​![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224928-bcvf2ji.png)

**前馈层（FFN)**   
​![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224726-k2icyfj.png)  
FFN处理注意力输出，负责特征提取和非线性映射，调整它能增强任务特定表达。  
小模型（如BERT）可能只加注意力层，大模型（如GPT-3）或生成任务常扩展到FFN

**其他层**  
​![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303224953-c3qiubd.png)

# 6.LoRA有哪些改进版本

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225142-n7egsmv.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225131-1tipk4j.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225311-08no6d0.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225318-e37odkt.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225401-x90pxvt.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225423-weeymvi.png)

‍

以 LLaMA-Factory 为例，说明LoRA相关的参数:

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225510-phiwrtn.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225618-1nmii8z.png)

![image](https://harme-picgo.oss-cn-beijing.aliyuncs.com/img/image-20260303225632-qe1flgm.png)
