<template>
  <div class="settings-wrapper" v-if="isMobile">
    <div class="settings-btn" @click="toggleMenu" @touchstart.stop @touchmove.stop @touchend.stop>
      ⚙️ 设置
    </div>

    <div class="settings-menu" v-if="showMenu" @touchstart.stop @touchmove.stop @touchend.stop>
      <div class="menu-header">
        <span>菜单</span>
        <span class="close-btn" @click="toggleMenu">❌</span>
      </div>
      <div class="menu-content">
        <div class="menu-item" @click="triggerAction('r')">🔄 重置游戏</div>
        <div class="menu-item" @click="triggerAction('s')">🔊 音效: {{ music ? '开' : '关' }}</div>
        <div class="menu-item" @click="toggleControlMode">🕹️ 操控模式: {{ controlMode === 'button' ? '按键' : '触屏' }}</div>
        <div class="menu-item score-title">🏆 当前分数: {{ points }}</div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>
<style lang="less"> @import './index.less'; </style>
