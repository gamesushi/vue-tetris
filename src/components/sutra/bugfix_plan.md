
# 修复《金刚经》在游戏未开始/暂停时也持续显现文字的 Bug

## 问题描述
用户反馈在游戏尚未开始（waiting state）以及游戏暂停（pause state）时，背景的《金刚经》文字仍然会持续显现和更新。

## 原因分析
`src/components/sutra/index.vue` 组件在 `mounted` 生命周期钩子中无条件调用了 `startTypingLoop()`，并且没有监听游戏的运行/暂停状态来控制文字显示的定时器。

## 解决方案
1.  **引入状态管理**：在 `Sutra` 组件中引入 Vuex 的 `cur` (当前方块，用于判断游戏是否开始), `pause` (暂停状态), `reset` (重置状态)。
2.  **定义运行状态**：添加 computed 属性 `isGameRunning`，逻辑为 `!!this.cur && !this.pause && !this.reset`。
3.  **监听状态变化**：
    *   当 `isGameRunning` 变为 `true` 时，调用 `startTypingLoop()` 恢复文字显示。
    *   当 `isGameRunning` 变为 `false` 时，调用 `clearTimeout(this.timer)` 暂停文字更新。
4.  **优化恢复逻辑**：修改 `startTypingLoop`，如果恢复时存在 `activeChar`，则将 `currentIndex` 回退 1，以确保当前字符能重新完整显示（重置其 60s 计时），避免字符跳过或状态不一致。
5.  **初始化检查**：在 `mounted` 中，只有当 `isGameRunning` 为 true 时才启动循环。

## 修改文件
*   `src/components/sutra/index.vue`

## 验证
已修改代码，逻辑上覆盖了游戏未开始（cur 为 null）、游戏暂停（pause 为 true）和游戏重置（reset 为 true）的情况。
