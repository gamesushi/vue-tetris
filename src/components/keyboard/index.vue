<template>
  <div
    class="keyboard"
    :style="'margin-top:'+fillingNum+'px'"
  >
    <div class="button-row primary-row">
      <div class="keyboard-dpad">
        <div class="dpad-top">
          <vbutton
            color="blue"
            size="s1"
            :label="labelLeft"
            :active="keyboard['left']"
            ref="dom_left"
          />
          <vbutton
            color="blue"
            size="s1"
            :label="labelRight"
            :active="keyboard['right']"
            ref="dom_right"
          />
        </div>
        <vbutton
          class="dpad-down"
          color="blue"
          size="s1"
          :label="labelDown"
          :active="keyboard['down']"
          ref="dom_down"
        />
      </div>
      <div class="keyboard-action">
        <vbutton
          color="blue"
          size="s1"
          :label="rotation"
          :active="keyboard['rotate']"
          ref="dom_rotate"
          class="action-rotate"
        />
        <vbutton
          color="blue"
          size="s1"
          :label="labelDropSpace"
          :active="keyboard['drop']"
          ref="dom_space"
          class="action-drop"
        />
      </div>
    </div>
  </div>
</template>
<style lang="less">
 @import './index.less';
</style>

<script src="./index.js">
</script>
