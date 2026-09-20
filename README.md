# 年年岁岁人依旧 · 董卿 × 周涛

基于原有 Hexo 7 项目改造，无新增前端框架或运行依赖。

## 本地运行

```sh
npm run dev
```

打开 http://localhost:4000 。已有 node_modules，无须重复安装。

## 页面与数据

- 首页 `/`：介绍、人物入口、精选年份。
- 时间长廊 `/timeline/`：1968—2025 年索引、分类、关键词搜索、年代筛选。
- 周涛 `/zhou-tao/`、董卿 `/dong-qing/`：人物资料与相关记录。
- 共同记忆 `/together/`、名场面 `/moments/`：共享年表数据的独立视图。
- 访谈 `/interviews/`：三个 Tab、搜索、每页 9 条、视频卡片和原文入口。

日常只需编辑：

- `source/_data/timeline.yml`：年表。`id` 必须唯一，`year` 为数字或 null；`tags` 使用 zhou / dong / together / moments。`title` 是列表标题，`summaries` 是正文，`observation` 是有明确归属的原表编者注，`checks` 是核对说明。
- `source/_data/interviews.yml`：访谈。`person` 使用 zhou / dong / together；`date` 可写完整日期、年份或“日期未详”。
- `source/_data/archive.yml`：站名、题记、原表序言及长文。
- `source/assets/archive/`：原表提取图片；`images` 使用以 `/assets/archive/` 开头的路径。

两类记录都使用 `sources` 数组：`url`、`label`、`kind`（video / source）、`origin`、可选 `scope`（来源支持的具体范围）。外部视频显示封面与播放按钮，点击前往原站；不自动播放、不加载不可靠 iframe。未提供视频截图时明确使用木棉插画封面。图片点击可查看完整原图，按 Escape 关闭。

`fields` 保存逐格原文、原链接和图片对应关系，`inherited_fields` 保存合并单元格的关联信息。编辑已有记录时建议保留这些字段以便溯源。新增记录可将两者设为 `[]`。

## 数据整理说明

原表导入为 234 条年表记录、78 份访谈与阅读资料、123 张图片。标题和分段说明另存于 archive.yml。空年份不会虚构经历；年份未知的条目单独存放。原表数值日期以所属年份配合其月日呈现，不将 Excel 内部的 2025 年误当成事件年份。

原表存在感想、转述和未核实线索，均以转录内容呈现，不据此断言私人关系。已知年份、奖项届次等矛盾保留原文并附核对说明。补充来源注明其支持范围，不把介绍页或会议报道当作原表每个细节的证明。无可靠链接的条目保留待核说明。共同访谈栏中的个人朗读资料沿用原表分类，同时明确其不等同于共同受访。

## 开发与校验

主题沿用 `themes/scholar/` 目录：`layout/` 为 EJS，`source/css/main.css` 为样式，`source/js/main.js` 为原生交互，`_config.yml` 为导航。

`npm run build` 生成静态文件。`node tools/verify-archive.cjs` 检查原表单元格、原链接、图片、记录编号和生成页面的本地路径。

`tools/workbook-extracted.json` 是已读取的原表快照；`tools/source-research.json` 是已有检索记录。`tools/import-archive.py` 和 `tools/enrich-archive.cjs` 是一次性导入与补充脚本，日常维护不需要运行，重新运行会覆盖 YAML 中后续手工修改。

发布前按实际站点设置 `_config.yml` 中的 `url` 和 `root`。不需要更换 Hexo 项目。
