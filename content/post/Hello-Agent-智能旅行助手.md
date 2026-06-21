---
title: Hello-Agent-智能旅行助手
date: '2026-06-14 11:53:59+08:00'
lastmod: '2026-06-14 17:26:42+08:00'
draft: false
tags: ["Agent"]                   # 文章标签
categories: ["技术教程"]           # 文章分类
series: ["Agent"]                 # 文章系列（可选）
slug: helloagentintelligent-travel-assistant-1pnonz
url: /post/helloagentintelligent-travel-assistant-1pnonz.html
toc: true
isCJKLanguage: true

summary: "本文记录Hello-Agent智能旅行助手搭建过程" # 文章摘要
---

# Hello-Agent-智能旅行助手

# 代码部分

[hello-agents/first_agent at main · Harmme5/hello-agents](https://github.com/Harmme5/hello-agents/tree/main/first_agent)

## 依赖

```python
import re #正则库
import os #读取环境变量
from OpenAICompatibleClient import OpenAICompatibleClient
from wttr_in import get_weather
from search_attraction import get_attraction
```

## 提示词

```python
AGENT_SYSTEM_PROMPT = """
你是一个智能旅行助手。你的任务是分析用户的请求，并使用可用工具一步步地解决问题。

# 可用工具:
- `get_weather(city: str)`: 查询指定城市的实时天气。
- `get_attraction(city: str, weather: str)`: 根据城市和天气搜索推荐的旅游景点。

# 输出格式要求:
你的每次回复必须严格遵循以下格式，包含一对Thought和Action：

Thought: [你的思考过程和下一步计划]
Action: [你要执行的具体行动]

Action的格式必须是以下之一：
1. 调用工具：function_name(arg_name="arg_value")
2. 结束任务：Finish[最终答案]

# 重要提示:
- 每次只输出一对Thought-Action
- Action必须在同一行，不要换行
- 当收集到足够信息可以回答用户问题时，必须使用 Action: Finish[最终答案] 格式结束

请开始吧！
"""
```

## 初始化

```python
# 将所有工具函数放入一个字典，方便后续调用
available_tools = {
    "get_weather": get_weather,
    "get_attraction": get_attraction,
}

# --- 1. 配置LLM客户端 ---
# 请根据您使用的服务，将这里替换成对应的凭证和地址
API_KEY = os.getenv("DASHSCOPE_API_KEY")
BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"
MODEL_ID = "glm-5.1"

llm = OpenAICompatibleClient(
    model=MODEL_ID,
    api_key=API_KEY,
    base_url=BASE_URL
)

# --- 2. 初始化 ---
user_prompt = "你好，请帮我查询一下今天沈阳的天气，然后根据天气推荐一个合适的旅游景点。"
prompt_history = [f"用户请求: {user_prompt}"]

print(f"用户输入: {user_prompt}\n" + "=" * 40)
```

## 主循环

```python
# --- 3. 运行主循环 ---
for i in range(5):  # 设置最大循环次数
    print(f"--- 循环 {i + 1} ---\n")

    # 3.1. 构建Prompt
    full_prompt = "\n".join(prompt_history) # 在历史prompt前添加换行，结构更清晰

    # 3.2. 调用LLM进行思考
    llm_output = llm.generate(full_prompt, system_prompt=AGENT_SYSTEM_PROMPT)
    # 模型可能会输出多余的Thought-Action，需要截断
    # re是正则表达式，下行用于截取模型输出里"第一个"完整的Thought + Action
    match = re.search(r'(Thought:.*?Action:.*?)(?=\n\s*(?:Thought:|Action:|Observation:)|\Z)', llm_output, re.DOTALL)
    if match:
        truncated = match.group(1).strip() # group(1)取正则第一个括号()捕获到的内容
        if truncated != llm_output.strip(): # strip(),去掉前后空白字符，比如多余的换行、空格
            llm_output = truncated
            print("已截断多余的 Thought-Action 对")
    print(f"模型输出:\n{llm_output}\n")
    prompt_history.append(llm_output)# 把llm_output的内容添加到prompt_history

    # 3.3. 解析并执行行动
    # 截取Action：后的所有内容
    action_match = re.search(r"Action: (.*)", llm_output, re.DOTALL)
    if not action_match: # 等价于if action_match is None:
        observation = "错误: 未能解析到 Action 字段。请确保你的回复严格遵循 'Thought: ... Action: ...' 的格式。"
        observation_str = f"Observation: {observation}"
        print(f"{observation_str}\n" + "=" * 40)
        prompt_history.append(observation_str)
        continue
    action_str = action_match.group(1).strip()
    # 如果是最终步骤，根据提示词，会输出Finish[最终答案]
    if action_str.startswith("Finish"):
        # 获取“最终答案”
        final_answer = re.match(r"Finish\[(.*)\]", action_str).group(1)
        print(f"任务完成，最终答案: {final_answer}")
        break
    # re.search：在整个字符串里查找第一个能匹配上的位置
    # (\w+)：匹配一个或多个“单词字符”，例如search、call_tool、abc123
    # \(：匹配左括号，因为 ( 在正则里有特殊含义，所以要写成 \(
    # .group(1)：取第一个捕获组
    tool_name = re.search(r"(\w+)\(", action_str).group(1)
    # 提取括号里的全部内容
    args_str = re.search(r"\((.*)\)", action_str).group(1)
    # 找出所有的 参数名=参数值
    kwargs = dict(re.findall(r'(\w+)="([^"]*)"', args_str))

    if tool_name in available_tools:
        # 动态调用工具
        observation = available_tools[tool_name](**kwargs)
    else:
        observation = f"错误:未定义的工具 '{tool_name}'"

    # 3.4. 记录观察结果
    observation_str = f"Observation: {observation}"
    print(f"{observation_str}\n" + "=" * 40)
    prompt_history.append(observation_str)
```

# 主循环拆解

## 拼接历史上下文

```python
    # 3.1. 构建Prompt
    full_prompt = "\n".join(prompt_history) # 在历史prompt前添加换行，结构更清晰
```

该行代码在每次循环开始都会运行，作用：把历史prompt添加进完整的prompt，Observation观察的对象。

## 调用大模型+截断多余输出

```python
    # 3.2. 调用LLM进行思考
    llm_output = llm.generate(full_prompt, system_prompt=AGENT_SYSTEM_PROMPT)
    # 模型可能会输出多余的Thought-Action，需要截断
    # re是正则表达式，下行用于截取模型输出里"第一个"完整的Thought + Action
    match = re.search(r'(Thought:.*?Action:.*?)(?=\n\s*(?:Thought:|Action:|Observation:)|\Z)', llm_output, re.DOTALL)
    if match:
        truncated = match.group(1).strip() # group(1)取正则第一个括号()捕获到的内容
        if truncated != llm_output.strip(): # strip(),去掉前后空白字符，比如多余的换行、空格
            llm_output = truncated
            print("已截断多余的 Thought-Action 对")
    print(f"模型输出:\n{llm_output}\n")
    prompt_history.append(llm_output)# 把llm_output的内容添加到prompt_history
```

- ​`re.search`​：在字符串 `llm_output`​ 中**从头开始查找第一个匹配正则规则**的内容，找到就返回匹配对象 `match`​，没找到返回 `None`。

- ​`re.DOTALL`​：使正则里的`.`可以匹配换行符，
  
  如果不开启`re.DOTALL`​，正则`Thought:.*Action:`​，遇到换行`\n`就会终止，只能匹配到第一行，拿不到完整内容
  
  若开启`re.DOTALL`​，则`.*`​ 能跳过 `\n`，连续匹配两行
1. ​`(?=\n\s*(?:Thought:|Action:|Observation:)|\Z)`：
   
   ​`（？=）`：只判断“后面是不是这个内容”，不会把这部分文本纳入匹配结果，用来划定匹配的结束边界。
   
   ​`\n`：换行
   
   ​`\s*`：匹配0个 / 多个空格、制表符等空白字符
   
   ​`(?:...)`：非捕获组，只做匹配、不单独提取内容
   
   ​`Thought:|Action:|Observation:`：遇到下一轮任意标准标识，就停止当前匹配

2. ​`|\Z`
   
   ​`|`：或
   
   ​`\Z`：匹配整个字符串的末尾(文本最后一行)

## 解析Action动作

```python
 # 3.3. 解析并执行行动
    # 截取Action：后的所有内容
    action_match = re.search(r"Action: (.*)", llm_output, re.DOTALL)
    if not action_match: # 等价于if action_match is None:
        observation = "错误: 未能解析到 Action 字段。请确保你的回复严格遵循 'Thought: ... Action: ...' 的格式。"
        observation_str = f"Observation: {observation}"
        print(f"{observation_str}\n" + "=" * 40)
        prompt_history.append(observation_str)
        continue
    action_str = action_match.group(1).strip()
```

- 正则提前`Action：`后面的全部内容
- 如果解析失败，则输出错误提示，同时存入上下文（`.append(observation_str)`），进入下一轮循环

## 判断任务是否结束

```python
 # 如果是最终步骤，根据提示词，会输出Finish[最终答案]
    if action_str.startswith("Finish"):
        # 获取“最终答案”
        final_answer = re.match(r"Finish\[(.*)\]", action_str).group(1)
        print(f"任务完成，最终答案: {final_answer}")
        break
```

识别到 `Finish[] `代表任务完成，提取括号内最终回答，跳出主循环，程序结束。

## 解析工具名、参数并调用工具

```python
# 提取工具名
tool_name = re.search(r"(\w+)\(", action_str).group(1)
# 提取括号内所有参数文本
args_str = re.search(r"\((.*)\)", action_str).group(1)
# 正则匹配 参数字符串="参数值"，转为字典
kwargs = dict(re.findall(r'(\w+)="([^"]*)"', args_str))

# 动态调用工具
if tool_name in available_tools:
    observation = available_tools[tool_name](**kwargs)
else:
    observation = f"错误:未定义的工具 '{tool_name}'"
```

### 第一步：提取工具名

假设经过前面解析，`action_str `​的内容为：`get_attraction(city="沈阳", weather="晴")`

```python
tool_name = re.search(r"(\w+)\(", action_str).group(1)
```

- ​`\w+`​：匹配**单词字符**（字母、数字、下划线），`+` 代表匹配 1 个及以上，用来抓取函数名；
- ​`\(`​：`(`​ 在正则中有特殊分组含义，所以需要**转义**，代表匹配字面左括号 `(`；
- ​`(\w+)`​：外层圆括号是**捕获组**，会单独把匹配到的内容提取出来。

从字符串 `get_attraction(city="沈阳", weather="晴")`​ 中匹配：匹配到 `get_attraction(`​，捕获组拿到 `get_attraction`。

- ​`.group(1)`：取出第一个捕获组的内容
- 结果：`tool_name = "get_attraction"`

### 第二步：提取括号内参数字符串

```python
args_str = re.search(r"\((.*)\)", action_str).group(1)
```

- ​`\(`​：匹配左括号 `(`
- ​`.*`​：匹配括号中间​**所有字符**（任意内容）
- ​`\)`​：转义，匹配右括号 `)`
- 整体作用：精准截取一对括号内部的全部文本。

原字符串：`get_attraction(city="沈阳", weather="晴")`​括号内内容为：`city="沈阳", weather="晴"`

- 结果：`args_str = 'city="沈阳", weather="晴"'`

### 第三步：拆分参数，转为字典kwargs

```python
kwargs = dict(re.findall(r'(\w+)="([^"]*)"', args_str))
```

1. ​`re.findall`​：找出所有符合规则的内容，返回**列表**

2. 正则表达式拆解`(\w+)="([^"]*)"`
   
   - ​`(\w+)`​：捕获组 1，匹配**参数名**（如 `city`​、`weather`）；
     
     - ​`=`：匹配等号；
     - ​`"`：匹配左侧双引号；
   
   - ​`([^"]*)`​：捕获组 2，**非双引号的所有字符**
     
     - ​`[^"]`​：取反，代表**除了双引号以外**的任意字符；
     - ​`*`：匹配 0 个或多个；
     - 作用：精准拿到引号内的参数值，不会跨引号乱匹配；
   
   - ​`"`：匹配右侧双引号。

3. 执行过程
   
   输入`args_str = 'city="沈阳", weather="晴"'`
   
   1. ​`re.findall`​匹配出两组结果，返回嵌套列表：`[("city", "沈阳"), ("weather", "晴")]`
   
   2. ​`dict(...)`：把「键值对列表」直接转为字典
      
      ​`kwargs = {"city": "沈阳", "weather": "晴"}`

### 第四步：动态调用工具函数

```python
    if tool_name in available_tools:
        observation = available_tools[tool_name](**kwargs)
    else:
        observation = f"错误:未定义的工具 '{tool_name}'"
```

1. ​`available_tools[tool_name]`

示例中 `tool_name="get_attraction"`​，等价于：`available_tools["get_attraction"]`

2. ​`**kwargs`字典解包
   
   ​`**`​ 是 Python 字典解包运算符，把字典 `{"city": "沈阳", "weather": "晴"}`​拆解成关键字参数形式：`city="沈阳", weather="晴"`

​`available_tools[tool_name](**kwargs)`​ 等价于 手写调用`get_attraction(city="沈阳", weather="晴")`

## 记录工具返回结果

```python
    # 3.4. 记录观察结果
    observation_str = f"Observation: {observation}"
    print(f"{observation_str}\n" + "=" * 40)
    prompt_history.append(observation_str)
```

将工具执行结果包装为 `Observation: `格式，追加到历史上下文，供给下一轮 LLM 思考使用

# 最终输出

```bash
用户输入: 你好，请帮我查询一下今天沈阳的天气，然后根据天气推荐一个合适的旅游景点。
========================================
--- 循环 1 ---

正在调用大语言模型...
大语言模型响应成功。
模型输出:
Thought: 用户需要查询沈阳的天气并根据天气推荐景点。我应该先第一步查询沈阳的实时天气。
Action: get_weather(city="沈阳")

Observation: 沈阳当前天气：Sunny,气温30摄氏度
========================================
--- 循环 2 ---

正在调用大语言模型...
大语言模型响应成功。
模型输出:
Thought: 已经获取了沈阳的天气为晴天(Sunny)，现在需要根据这个天气情况为沈阳推荐合适的旅游景点。
Action: get_attraction(city="沈阳", weather="Sunny")

Observation: In sunny weather, visit the Shenynag Imperial Palace Museum and Zhong Street for historical and cultural experiences. Comfortable clothing is advised due to temperature variations. Wi-Fi is widely available.
========================================
--- 循环 3 ---

正在调用大语言模型...
大语言模型响应成功。
模型输出:
Thought: 我已经成功获取了沈阳的天气情况（晴天，30度）以及相应的旅游景点推荐（沈阳故宫博物院和中街）。现在信息已经足够，可以为用户生成最终的完整回复了。
Action: Finish[沈阳今天的天气是晴天，气温30摄氏度。根据当前的天气情况，为您推荐以下旅游景点：沈阳故宫博物院和中街，您可以在那里享受历史和文化的体验。由于气温较高且有温差变化，建议穿着舒适的衣服。]

任务完成，最终答案: 沈阳今天的天气是晴天，气温30摄氏度。根据当前的天气情况，为您推荐以下旅游景点：沈阳故宫博物院和中街，您可以在那里享受历史和文化的体验。由于气温较高且有温差变化，建议穿着舒适的衣服。

进程已结束，退出代码为 0
```

- ​**初始**​：上下文存入用户请求 `查询沈阳天气+推荐景点`

- **第 1 轮循环**
  
  - 拼接历史文本传给 LLM；
  - LLM 输出：`Thought: 先查询沈阳天气 Action: get_weather(city="沈阳")`；
  - 解析工具名 & 参数，调用 `get_weather`；
  - 拿到天气结果，生成 `Observation` 并入上下文。

- **第 2 轮循环**
  
  - 上下文包含：用户请求 + 第一轮思考动作 + 天气结果；
  - LLM 输出：`Thought: 根据天气推荐景点 Action: get_attraction(city="沈阳", weather="xxx")`；
  - 调用景点工具，获取推荐结果，生成新 `Observation`。

- **第 3 轮循环**
  
  - 信息收集完毕，LLM 输出：`Action: Finish[最终回答内容]`；
  - 识别到 Finish，输出答案，循环结束。

# 要点

- ​ **​`**kwargs`​**​ **动态调用的优势**不用硬编码函数和参数，**新增工具时，只需要在** **​`available_tools`​**​ **里加一行**，解析逻辑完全不用改，扩展性很强，也是 Agent 工具调用的标准写法。
- ​**​`re.findall`​**​ **配合双捕获组**正则里写了两个 `()`​，返回的列表就是 `[(键1,值1), (键2,值2)]`，天生适合转字典。
