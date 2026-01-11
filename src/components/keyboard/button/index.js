import { transform } from '../../../unit/const'

export default {
  props: [
    'active',
    'color',
    'size',
    'top',
    'left',
    'label'
  ],
  computed: {
    buttonStyle() {
      const topValue = typeof this.top === 'number' ? `${this.top}px` : this.top
      const leftValue = typeof this.left === 'number' ? `${this.left}px` : this.left
      return `top:${topValue};left:${leftValue}`
    }
  }
}
