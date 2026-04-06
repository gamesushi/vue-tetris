import store from '../../vuex/store'
import todo from '../../control/todo'
import { isMobile } from '../../unit/'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showMenu: false,
      isMobile: isMobile()
    }
  },
  computed: {
    ...mapState([
      'music',
      'pause',
      'points',
      'controlMode'
    ])
  },
  mounted() {
    window.addEventListener('resize', this.resize.bind(this), true)
  },
  methods: {
    resize() {
      this.isMobile = isMobile()
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
      // 自动暂停逻辑
      if (this.showMenu && !this.pause) {
        todo.p.down(store)
      } else if (!this.showMenu && this.pause) {
        // 如果关闭菜单且当前为暂停状态，则恢复
        todo.p.down(store)
      }
    },
    triggerAction(type) {
      if (todo[type]) {
        todo[type].down(store)
        todo[type].up(store)
        
        // 如果是重置，可能需要关闭设置面板
        if (type === 'r') {
          this.showMenu = false
        }
      }
    },
    toggleControlMode() {
      const targetMode = this.controlMode === 'button' ? 'touch' : 'button'
      store.commit('controlMode', targetMode)
    }
  }
}
