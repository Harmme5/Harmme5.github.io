# Hugo 博客开发踩坑记录

## 1. 首页打字机效果位置错误

**问题描述：**
- 在 `layouts/partials/head/custom.html` 中添加打字机效果代码
- 效果没有在首页生效，反而在其他页面出现
- 选择器 `.site-description` 和 `.subtitle` 都无法找到元素

**原因分析：**
- 首页使用独立的 `layouts/index.html` 模板文件，不继承标准的 Hugo Stack 主题结构
- `head/custom.html` 只被博客文章页面引入，不被首页使用
- 首页的副标题元素 class 是 `.subtitle`，而不是主题默认的 `.site-description`

**解决方案：**
直接在 `layouts/index.html` 中添加打字机效果的 CSS 和 JavaScript，不要在 `head/custom.html` 中添加。

**教训：**
检查功能生效的页面前，先确认该页面使用的是哪个模板文件，不要假设所有页面都使用相同的模板结构。

---

## 2. 文章封面图导致卡片无法点击

**问题描述：**
- 添加文章封面图后，列表页的文章卡片无法点击进入文章
- 点击图片区域没有任何反应

**尝试的错误方案：**
1. 给图片添加 `pointer-events: none` - 图片不再阻挡点击，但卡片依然无法点击
2. 修改图片灯箱选择器 - 避免了误触发灯箱，但点击问题仍然存在

**原因分析：**
- 文章卡片的 HTML 结构中，只有标题部分包裹在 `<a>` 标签内
- 封面图在 `<a>` 标签外部，点击图片不会触发跳转

**最终解决方案：**
```javascript
document.querySelectorAll('.article-list--compact article').forEach(function(article) {
    const link = article.querySelector('a');
    if (link) {
        article.addEventListener('click', function(e) {
            window.location.href = link.href;
        });
    }
});
```
让整个 article 元素可点击，而不是依赖 `<a>` 标签的范围。

**教训：**
遇到点击问题时，先检查 HTML 结构和点击目标的层级关系，不要只在 CSS 层面解决。

---

## 3. Git 中文 commit 消息在 GitHub 显示乱码

**问题描述：**
使用中文编写的 commit 消息，在 GitHub 上显示为乱码

**解决方案：**
```bash
# 配置 Git 使用 UTF-8 编码
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8

# 使用 filter-branch 重写历史提交
git filter-branch --msg-filter 'iconv -f gbk -t utf-8' -- --all

# 强制推送
git push --force
```

**教训：**
在项目初期就应该配置好 Git 的编码设置，避免后续需要重写历史。

---

## 4. 字数统计和阅读时间显示

**问题描述：**
想要在文章卡片上显示字数和阅读时间

**正确方案：**
- Hugo 内置变量：`.WordCount` 和计算公式 `{{ div .WordCount 300 }}`
- 在 `hugo.toml` 中启用：`readingTime = true`
- 创建自定义模板覆盖主题默认模板

**教训：**
先查阅主题文档和 Hugo 内置变量，不要自己重新实现已有的功能。

---

## 开发建议

1. **模板结构优先确认** - 在添加功能前，先用浏览器开发者工具查看页面的 HTML 结构和 class 名称
2. **使用 Chrome DevTools 调试** - 利用 MCP chrome-devtools 工具直接检查页面元素和执行 JavaScript
3. **分离关注点** - 首页和博客页面如果使用不同模板，应在各自的模板文件中添加特定功能
4. **测试完整的用户流程** - 添加新功能后，测试相关页面的所有交互，确保没有副作用
