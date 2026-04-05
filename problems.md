# 第一轮

上传到github后的网页，如下图

问题：栏目重复出现，如“About”和“关于”，Search和右上角的搜索栏，比较混乱

<img src="file:///F:/MarkText/images/2026-04-05-19-43-57-image.png" title="" alt="" width="854">

而使用hugo server命令，在本地([我的博客](http://localhost:1313/))的网页效果，比较正常

![](F:\MarkText\images\2026-04-05-19-46-29-image.png)

## 原因分析

### 1. 菜单来源不止一处，被 Hugo 合并后出现重复

当前仓库里，主菜单至少有 3 个来源：

- `hugo.toml` 里的 `[[menu.main]]`
- `hugo.toml` 里的 `[params.menu]`
- `themes/stack1/content/page/*` 这些主题自带页面 Front Matter 中的 `menu.main`

其中，`themes/stack1/content/page/about/index.md`、`themes/stack1/content/page/search/index.md`、`themes/stack1/content/page/archives/index.md`、`themes/stack1/content/page/friends/index.md` 都会把页面自动挂到主菜单。

Hugo 在构建时会把主题内容和站点内容一起合并，因此最终菜单里会同时出现“主题自带菜单项”和“我自己配置的菜单项”，这就是栏目重复的根因。

### 2. “About”和“关于”同时出现，本质上是中英文两套内容混在了一起

主题 `stack1` 自带的示例页面标题是英文，例如：

- `themes/stack1/content/page/about/index.md` -> `title: About`
- `themes/stack1/content/page/search/index.md` -> `title: Search`

而我自己的站点配置里又在尝试使用中文菜单（例如 `hugo.toml` 中的“关于”）。

所以一旦主题示例页和自定义菜单同时参与渲染，就会出现“About / 关于”这种中英文并存的现象。

### 3. “Search”和右上角搜索框同时出现，是因为搜索入口被放了两次

一方面，主题自带的搜索页 `themes/stack1/content/page/search/index.md` 已经通过 `menu.main` 把 `Search` 放进了主菜单。

另一方面，我又在 `layouts/partials/topnav.html` 中额外写了一套右上角搜索表单：

- 该模板会遍历 `.Site.Menus.main` 输出顶部菜单
- 同时还会单独渲染 `<form class="top-search-form">` 搜索框

因此页面上会同时出现：

- 一个菜单项 `Search`
- 一个右上角搜索栏

这就造成了你截图里看到的“搜索功能重复出现”。

### 4. 这个问题发生在 Hugo 生成阶段，不是 GitHub Pages 单独造成的

从当前仓库里的 `public/index.html` 可以看到，生成后的静态页面本身就已经包含了重复菜单和重复搜索入口。

说明问题在 **Hugo 构建阶段** 就已经形成了，GitHub Pages 只是把生成后的结果原样展示出来，并不是部署平台额外制造了重复。

## 结论

这次问题的本质不是单一配置写错，而是：

1. 主题自带示例内容没有清理
2. 自定义菜单和主题菜单同时生效
3. 搜索入口既放在菜单里，又单独放在右上角

所以部署后页面会显得栏目重复、语言混杂、结构混乱。

## 修复方案

### 推荐修复思路
建议统一成下面这一套：

- 菜单只保留一种来源：`hugo.toml` 中的 `[[menu.main]]`
- 搜索入口只保留一种形式：推荐保留右上角搜索框
- 页面内容尽量放在站点自己的 `content/` 目录，不要长期依赖 `themes/stack1/content/` 里的示例页面

### 具体修复步骤

#### 1. 统一菜单来源
处理 `hugo.toml` 时，应只保留一种主菜单配置方式。

建议：

- 删除 `hugo.toml` 中的 `[params.menu]`
- 保留 `[[menu.main]]` 作为唯一的顶部菜单来源

原因：当前自定义模板 `layouts/partials/topnav.html` 遍历的是 `.Site.Menus.main`，并不会读取 `[params.menu]`。继续同时保留多种写法，只会增加混乱。

#### 2. 清理主题自带示例页面带来的菜单注入
`themes/stack1/content/page/about/index.md`、`themes/stack1/content/page/search/index.md`、`themes/stack1/content/page/archives/index.md`、`themes/stack1/content/page/friends/index.md` 这些示例页都带有 `menu.main`，会自动进入主菜单。

修复时建议：

- 不把这些主题示例页直接当正式站点内容使用
- 将真正需要的页面放到站点自己的 `content/page/` 目录下
- 统一改成自己想要的中文标题
- 只给需要显示在菜单中的页面保留 `menu.main`
- 不需要进菜单的页面，就删除 Front Matter 里的 `menu.main`

这样可以避免主题示例内容和自定义内容同时出现在导航中。

#### 3. 搜索入口二选一，不要同时保留两套
当前搜索重复，是因为：

- 搜索页通过 `menu.main` 出现在菜单里
- `layouts/partials/topnav.html` 又单独渲染了右上角搜索框

修复时应二选一：

**方案 A（推荐）**
- 保留右上角搜索框
- 删除搜索页 Front Matter 中的 `menu.main`
- 让搜索页继续存在，但不在顶部菜单里显示 `Search/搜索`

**方案 B**
- 保留菜单里的 `Search/搜索`
- 删除 `layouts/partials/topnav.html` 中 `.nav-search` 这一段额外搜索表单

推荐方案 A，因为页面结构更简洁，也更符合右上角搜索框的常见使用习惯。

#### 4. About 页面也只保留一套
当前出现两个 About/关于，本质上是“主题示例页 + 自定义菜单项”同时存在。

修复时应保证：

- `About/关于` 页面只保留一个最终版本
- 菜单里也只保留一个对应入口
- 页面标题和菜单名称尽量统一，例如都使用“关于”

这样可以避免中英文混用，也避免同一功能页面出现两个入口。

#### 5. 重新生成静态文件后再部署
完成上面修改后，需要重新生成静态页面，再部署到 GitHub Pages。

建议流程：

1. 清理旧的 `public/` 内容
2. 重新执行 Hugo 构建
3. 检查生成后的 `public/index.html`、`public/about/index.html`、`public/page/about/index.html` 是否仍有重复菜单
4. 确认无误后再上传到 GitHub

这样可以避免旧的静态文件残留，导致误判为“改了配置但线上没生效”。

### 修复后的预期效果
修复完成后，页面应达到以下效果：

- 顶部菜单只保留一套栏目
- 菜单语言风格统一，不再出现 `About` 和 `关于` 混用
- 搜索入口只出现一次
- 本地构建结果与 GitHub Pages 展示结果保持一致
