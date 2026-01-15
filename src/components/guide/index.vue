<template>
  <div v-show="!isMobile">
    <div class="guide right">
      <div class="msg">
        <div class="control-section">
          <div class="arrow-cluster">
            <div class="arrow-row top">
              <div class="key-wrapper">
                <div class="key-cap">↑</div>
                <span class="key-label">旋</span>
              </div>
            </div>
            <div class="arrow-row bottom">
              <div class="key-wrapper">
                <div class="key-cap">←</div>
                <span class="key-label">左</span>
              </div>
              <div class="key-wrapper">
                <div class="key-cap">↓</div>
                <span class="key-label">下</span>
              </div>
              <div class="key-wrapper">
                <div class="key-cap">→</div>
                <span class="key-label">右</span>
              </div>
            </div>
          </div>
          <div class="action-cluster">
            <div class="key-wrapper space-wrapper">
              <div class="key-cap space">Space</div>
              <span class="key-label">落</span>
            </div>
          </div>
          <div class="func-cluster">
            <div class="key-wrapper">
              <div class="key-cap">S</div>
              <span class="key-label">音</span>
            </div>
            <div class="key-wrapper">
              <div class="key-cap">P</div>
              <span class="key-label">止</span>
            </div>
            <div class="key-wrapper">
              <div class="key-cap">R</div>
              <span class="key-label">复</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script src="./index.js">
</script>

<style lang="less">
@import './index.less';
</style>