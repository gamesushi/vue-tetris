<template>
  <div
        class="keyboard"
        :style="'margin-top:'+fillingNum+'px'"
      >
        <!-- Top Row: Secondary Controls -->
        <div class="button-row secondary-row">
          <vbutton
            color="green"
            size="s2"
            :label="labelPauseP"
            :active="keyboard['pause']"
            ref="dom_p"
          />
          <vbutton
            color="green"
            size="s2"
            :label="labelSoundS"
            :active="keyboard['music']"
            ref="dom_s"
          />
          <vbutton
            color="red"
            size="s2"
            :label="labelResetR"
            :active="keyboard['reset']"
            ref="dom_r"
          />
        </div>

        <!-- Bottom Row: Primary Controls -->
        <div class="button-row primary-row">
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
          <vbutton
            color="blue"
            size="s1"
            :label="labelDown"
            :active="keyboard['down']"
            ref="dom_down"
          />
          <vbutton
            color="blue"
            size="s1"
            :label="rotation"
            :active="keyboard['rotate']"
            ref="dom_rotate"
          />
          <vbutton
            color="blue"
            size="s1"
            :label="labelDropSpace"
            :active="keyboard['drop']"
            ref="dom_space"
          />
        </div>
      </div>
</template>
<style lang="less">
 @import './index.less';
</style>

<script src="./index.js">
</script>
