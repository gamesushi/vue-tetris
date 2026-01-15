<template>
  <div class="sutra-container" ref="container">
    <div class="sutra-content" ref="content" :style="contentStyle">
      <div class="sutra-text-flow">
        <span class="sutra-title">《金刚经》</span>
        <span class="history-text">{{ historyText }}</span>
        <span class="active-char-wrapper" v-if="activeChar" ref="activeWrapper">
            <span class="active-char" :style="activeCharStyle">{{ activeChar }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sutraText } from './text'
import './index.less'

export default {
  name: 'Sutra',
  data() {
    return {
      fullText: sutraText.replace(/\s+/g, ''),
      currentIndex: 0,
      historyText: '',
      activeChar: '',
      progress: 0, 
      timer: null,
      lastClearLines: 0,
      offsetX: 0, // Horizontal Scroll
      isInstant: false 
    }
  },
  computed: {
    ...mapState(['cur', 'pause', 'reset', 'clearLines']),
    isGameRunning() {
      // Game is considered running if there is a current block, it is not paused, and not in reset state
      return !!this.cur && !this.pause && !this.reset;
    },
    contentStyle() {
      // Move Horizontally (X)
      return {
        transform: `translateX(${this.offsetX}px)`
      }
    },
    activeCharStyle() {
        if (this.isInstant) {
            return {
                height: 'auto',
                transition: 'none'
            };
        }
        return {
            maxHeight: this.progress === 1 ? '1.5em' : '0em', // logical height
            transition: this.progress === 1 ? 'max-height 60s linear' : 'none',
            opacity: 1
        }
    }
  },
  watch: {
    clearLines(newVal) {
      if (newVal > this.lastClearLines) {
        const diff = newVal - this.lastClearLines;
        this.handleClear(diff);
        this.lastClearLines = newVal;
      } else if (newVal < this.lastClearLines) {
         this.lastClearLines = newVal;
      }
    },
    reset(val) {
        if (val) {
           this.resetState();
        }
    },
    isGameRunning(newVal) {
        if (newVal) {
            this.startTypingLoop();
        } else {
            clearTimeout(this.timer);
        }
    }
  },
  mounted() {
    if (this.isGameRunning) {
        this.startTypingLoop();
    }
    window.addEventListener('resize', this.updateScroll);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    window.removeEventListener('resize', this.updateScroll);
  },
  methods: {
    resetState() {
        clearTimeout(this.timer);
        this.currentIndex = 0;
        this.historyText = '';
        this.activeChar = '';
        this.progress = 0;
        this.offsetX = 0;
        this.lastClearLines = 0;
    },
    startTypingLoop() {
        if (this.activeChar && this.currentIndex > 0) {
            // If resuming with an active char, retry it
            this.currentIndex--;
        }
        this.nextChar(true); 
    },
    nextChar(slow = true) {
        if (this.currentIndex >= this.fullText.length) return;
        
        const char = this.fullText[this.currentIndex];
        this.activeChar = char;
        this.currentIndex++;
        
        this.isInstant = !slow;
        this.progress = 0;
        
        this.$nextTick(() => {
             if (slow) {
                 requestAnimationFrame(() => {
                     this.progress = 1; 
                     this.updateScroll();
                 });
                 this.timer = setTimeout(() => {
                     this.commitChar();
                     this.nextChar(true); 
                 }, 60000); 
             } else {
                 this.progress = 1;
                 this.commitChar();
                 this.nextChar(true); 
             }
        });
    },
    handleClear(lines) {
        clearTimeout(this.timer);
        this.commitChar();
        for (let i = 0; i < lines - 1; i++) {
            if (this.currentIndex < this.fullText.length) {
                const char = this.fullText[this.currentIndex];
                this.historyText += char;
                this.currentIndex++;
            }
        }
        this.updateScroll();
        this.nextChar(true);
    },
    commitChar() {
        if (this.activeChar) {
            this.historyText += this.activeChar;
            this.activeChar = '';
            this.progress = 0;
            this.updateScroll();
        }
    },
    updateScroll() {
      this.$nextTick(() => {
        // Horizontal Scroll Logic
        const container = this.$refs.container;
        const wrapper = this.$refs.activeWrapper;
        
        if (container && wrapper) {
            const cRect = container.getBoundingClientRect();
            const wRect = wrapper.getBoundingClientRect();
            
            // Check overflow Left (since Content flows Right to Left)
            // If active char is heavily to the left of the container
            if (wRect.left < cRect.left) {
                 const diff = cRect.left - wRect.left + 20; 
                 this.offsetX += diff;
            }
        }
      });
    }
  }
}
</script>

<style lang="less">
/* Enforce PC Styles directly in component to ensure update */
.sutra-container {
    left: 655px !important;
    top: 87px !important;
    width: 440px !important;
    height: 560px !important;
    /* Optional: visible structure for debugging, remove if not needed */
    /* border: 1px dashed rgba(0, 255, 255, 0.5); */
}

/* Mobile override must be preserved and use !important to beat the specific PC override above if needed, 
   but media queries inside logic usually apply correctly. 
   However, since we used !important above, we should ensure mobile still works.
*/
@media (max-width: 768px) {
    .sutra-container {
        left: auto !important;
        width: 170px !important;
        height: 660px !important;
        top: 127px !important;
    }
}
</style>
