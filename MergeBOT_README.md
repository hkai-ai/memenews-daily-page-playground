默认配置下，一言以蔽之：

新建 PR 时，为该 PR 添加 waitForMerge 标签；当该 PR 准备合并入相应分支时，根据希望的合并方式，添加 readtForMerge 或 readyForRebase 标签，这时 merge-bot 会自动 按照相应方式合并 该 PR 进入相应分支。

对于元狲内部的Git规范与工作流程，请参考 [飞书文档](https://m0e8x072xo3.feishu.cn/wiki/NFl0wSC7uiXRtykrVTocdLXlnQh) 。

下面是关于 merge-bot 的基本信息。

1.0 来源
该 merge-bot 来源于 ： https://github.com/squalrus/merge-bot

2.0 配置更改
更改 .githu/workflow 下的相应工作流 .yml 文件即可。

配置如何修改，请见来源的相关文档。