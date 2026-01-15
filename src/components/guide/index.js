import { i18n, lan } from '../../unit/const'
import { isMobile } from '../../unit'
import Vbutton from '../keyboard/button/index.vue'

export default {
  name: 'Guide',
  components: {
    Vbutton
  },
  data() {
    return {
      isMobile: isMobile()
    }
  },
  computed: {

  },
  mounted() {
    window.addEventListener('resize', this.resize.bind(this), true)
  },
  methods: {
    resize() {
      this.isMobile = isMobile()
    }
  }
}
