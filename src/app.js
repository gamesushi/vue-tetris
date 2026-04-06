import Decorate from './components/decorate/index.vue'
import Guide from './components/guide/index.vue'
import Next from './components/next/index.vue'
import Music from './components/music/index.vue'
import Pause from './components/pause/index.vue'
import Number from './components/number/index.vue'
import Point from './components/point/index.vue'
import Settings from './components/settings/index.vue'
import Logo from './components/logo/index.vue'
import Matrix from './components/matrix/index.vue'
import Sutra from './components/sutra/index.vue'
import Keyboard from './components/keyboard/index.vue'
import { mapState } from 'vuex'
import { transform, lastRecord, speeds, i18n, lan } from './unit/const'
import { visibilityChangeEvent, isFocus, isMobile } from './unit/'
import states from './control/states'
import todo from './control/todo'

export default {
  watch: {
    isMobile: {
      handler(val) {
        if (val) {
          document.body.classList.add('mobile-mode')
          document.body.classList.remove('pc-mode')
        } else {
          document.body.classList.remove('mobile-mode')
          document.body.classList.add('pc-mode')
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.render()
    window.addEventListener('resize', this.resize.bind(this), true)
  },
  data() {
    return {
      size: {},
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
      filling: '',
      isMobile: isMobile(),
      touchStartX: 0,
      touchStartY: 0,
      touchLastX: 0,
      isLongPress: false,
      isSwiping: false,
      longPressTimeout: null
    }
  },
  components: {
    Decorate,
    Guide,
    Next,
    Music,
    Pause,
    Number,
    Point,
    Logo,
    Settings,
    Matrix,
    Sutra,
    Keyboard
  },
  computed: {
    pContent() {
      return this.cur ? i18n.cleans[lan] : i18n.startLine[lan]
    },
    level: () => i18n.level[lan],
    nextText: () => i18n.next[lan],
    ...mapState([
      'matrix',
      'keyboard',
      'music',
      'pause',
      'next',
      'cur',
      'speedStart',
      'speedRun',
      'startLines',
      'clearLines',
      'points',
      'max',
      'reset',
      'drop',
      'controlMode'
    ])
  },
  methods: {
    render() {
      let filling = 0
      const size = (() => {
        const w = this.w
        const h = this.h
        const ratio = h / w
        let scale
        let css = {}
        const baseHeight = this.isMobile ? 1760 : 962
        const ratioThreshold = baseHeight / 750
        if (ratio < ratioThreshold) {
          scale = h / baseHeight
          css = {
            'margin-top': Math.floor(-baseHeight / 2) + 'px'
          }
        } else {
          scale = w / 750
          filling = (h - baseHeight * scale) / scale / 3
          css = {
            'padding-top': Math.floor(filling) + 42 + 'px',
            'padding-bottom': '50px',
            'margin-top': Math.floor(-baseHeight / 2 - (filling * 1.5 - 50)) + 'px'
          }
        }
        css[transform] = `scale(${scale})`
        return css
      })()
      this.size = size
      this.start()
      this.filling = filling
    },
    resize() {
      this.w = document.documentElement.clientWidth
      this.h = document.documentElement.clientHeight
      this.isMobile = isMobile()
      this.render()
    },
    start() {
      if (visibilityChangeEvent) {
        // 将页面的焦点变换写入store
        document.addEventListener(
          visibilityChangeEvent,
          () => {
            states.focus(isFocus())
          },
          false
        )
      }

      if (lastRecord) {
        // 读取记录
        if (lastRecord.cur && !lastRecord.pause) {
          // 拿到上一次游戏的状态, 如果在游戏中且没有暂停, 游戏继续
          const speedRun = this.$store.state.speedRun
          let timeout = speeds[speedRun - 1] / 2 // 继续时, 给予当前下落速度一半的停留时间
          // 停留时间不小于最快速的速度
          timeout =
            speedRun < speeds[speeds.length - 1]
              ? speeds[speeds.length - 1]
              : speedRun
          states.auto(timeout)
        }

        if (!lastRecord.cur) {
          states.overStart()
        }
      } else {
        states.overStart()
      }
    },
    onTouchStart(e) {
      if (!this.isMobile) return;
      if (this.controlMode === 'button') return;
      if (e.touches.length > 1) return;
      if (this.pause) return;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchLastX = this.touchStartX;
      this.isLongPress = false;
      this.isSwiping = false;
      
      this.longPressTimeout = setTimeout(() => {
        if (!this.isSwiping) {
          this.isLongPress = true;
          todo.down.down(this.$store);
        }
      }, 300);
    },
    onTouchMove(e) {
      if (!this.isMobile || this.pause) return;
      if (this.controlMode === 'button') return;
      if (e.touches.length > 1) return;
      
      e.preventDefault(); 
      
      const touchCurX = e.touches[0].clientX;
      const touchCurY = e.touches[0].clientY;
      const deltaX = touchCurX - this.touchStartX;
      const deltaY = touchCurY - this.touchStartY;
      
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        if (!this.isSwiping) {
          this.isSwiping = true;
          clearTimeout(this.longPressTimeout);
          if (this.isLongPress) {
            todo.down.up(this.$store);
            this.isLongPress = false;
          }
        }
        
        const step = 40; 
        if (touchCurX - this.touchLastX > step) {
          todo.right.down(this.$store); todo.right.up(this.$store);
          this.touchLastX += step;
        } else if (this.touchLastX - touchCurX > step) {
          todo.left.down(this.$store); todo.left.up(this.$store);
          this.touchLastX -= step;
        }
      }
    },
    onTouchEnd(e) {
      if (!this.isMobile || this.pause) return;
      if (this.controlMode === 'button') return;
      
      clearTimeout(this.longPressTimeout);
      if (this.isLongPress) {
        todo.down.up(this.$store);
        this.isLongPress = false;
      } else if (!this.isSwiping) {
        todo.rotate.down(this.$store); todo.rotate.up(this.$store);
      } else {
        const touchCurX = e.changedTouches[0].clientX;
        const touchCurY = e.changedTouches[0].clientY;
        const deltaX = touchCurX - this.touchStartX;
        const deltaY = touchCurY - this.touchStartY;
        
        if (deltaY > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
          todo.space.down(this.$store); todo.space.up(this.$store);
        }
      }
    }
  }
}
