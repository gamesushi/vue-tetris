import { isClear, want } from '../../unit/'
import { fillLine, blankLine } from '../../unit/const'
import states from '../../control/states'
const t = setTimeout
export default {
  props: ['cur', 'reset', 'propMatrix'],
  watch: {
    $props: {
      handler(val = {}, oldVal) {
        this.propsChange(val)
      },
      deep: true
    }
  },
  render() {
    let matrix
    if (this.isOver) {
      matrix = this.overState
    } else {
      matrix = this.getResult()
    }

    return (
      <div class="matrix">
        {matrix.map((p, k1) =>
          <p>
            {p.map((e, k2) => {
              let className = ''
              let text = '業'
              if (e === 2) {
                className = 'd'
              } else if (typeof e === 'string' && e.endsWith('_active')) {
                const type = e.split('_')[0]
                className = 'active type-' + type
                text = '德'
              } else if (typeof e === 'string' && e.endsWith('_ghost')) {
                const type = e.split('_')[0]
                className = 'ghost type-' + type
                text = '德'
              } else if (e) {
                const type = e === 1 ? 'I' : e
                className = 'c type-' + type
              }
              return <b class={className}>{text}</b>
            })}
          </p>
        )}
      </div>
    )
  },
  data() {
    return {
      clearLines: false,
      animateColor: 2,
      isOver: false,
      overState: null
    }
  },
  methods: {
    propsChange(nextProps) {
      const clears = isClear(nextProps.propMatrix)
      const overs = nextProps.reset
      setTimeout(() => {
        this.clearLines = clears
        this.isOver = overs
      }, 0)
      if (clears && !this.clearLines) {
        this.clearAnimate(clears)
      }
      if (!clears && overs && !this.isOver) {
        this.over(nextProps)
      }
    },
    getResult(props) {
      if (!props) {
        props = this.$props
      }
      const cur = props.cur
      const shape = cur && cur.shape
      const xy = cur && cur.xy
      let matrix = JSON.parse(JSON.stringify(props.propMatrix))
      const clearLines = this.clearLines
      if (clearLines) {
        const animateColor = this.animateColor
        clearLines.forEach(index => {
          matrix[index] = [
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor,
            animateColor
          ]

        })
      } else if (shape) {
        // Ghost Block Calculation
        let ghostY = xy[0]
        while (want({ shape, xy: [ghostY + 1, xy[1]] }, props.propMatrix)) {
          ghostY++
        }

        // Render Ghost Block
        // Only render if ghost is below the current block position
        if (ghostY > xy[0]) {
          shape.forEach((m, k1) =>
            m.forEach((n, k2) => {
              if (n && ghostY + k1 >= 0) {
                let line = matrix[ghostY + k1]
                if (line && !line[xy[1] + k2]) {
                  line[xy[1] + k2] = cur.type + '_ghost'
                  matrix[ghostY + k1] = line
                }
              }
            })
          )
        }

        shape.forEach((m, k1) =>
          m.forEach((n, k2) => {
            if (n && xy[0] + k1 >= 0) {
              // 竖坐标可以为负
              // 竖坐标可以为负
              let line = matrix[xy[0] + k1]
              let color
              // Check for overlap, ignoring ghost cells
              let isGhost = typeof line[xy[1] + k2] === 'string' && line[xy[1] + k2].endsWith('_ghost')
              if (line[xy[1] + k2] && !isGhost && !clearLines) {
                // 矩阵与方块重合
                color = 2
              } else {
                color = cur.type + '_active'
              }
              line[xy[1] + k2] = color
              matrix[xy[0] + k1] = line
            }
          })
        )
      }
      return matrix
    },
    clearAnimate() {
      this.animateColor = 2
      t(() => {
        states.clearLines(this.propMatrix, this.clearLines)
      }, 600)
    },
    over(nextProps) {
      let overState = this.getResult(nextProps)

      this.overState = [...overState]
      const exLine = index => {
        if (index <= 19) {
          overState[19 - index] = fillLine
        } else if (index >= 20 && index <= 39) {
          overState[index - 20] = blankLine
        } else {
          states.overEnd()
          return
        }
        this.overState = [...overState]
        // console.log(JSON.stringify(overState))
      }

      for (let i = 0; i <= 40; i++) {
        t(exLine.bind(null, i), 40 * (i + 1))
      }
    }
  }
}
