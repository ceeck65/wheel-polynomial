import { ref, computed, onMounted } from 'vue'
import { getStrArray } from './utils'
import type { CanvasConfig, PrizeConfig, PropsType } from './types'

const canvasDefaultConfig: CanvasConfig = {
  radius: 250,
  textRadius: 190,
  textLength: 50,
  textDirection: 'vertical',
  lineHeight: 20,
  borderWidth: 0,
  borderColor: 'transparent',
  btnText: 'Girar',
  btnWidth: 140,
  fontSize: 24
}

export function useCanvas (props: PropsType) {
  const wheelEl = ref()

  const canvasConfig = computed(() => {
    return Object.assign(canvasDefaultConfig, props.canvas) as PrizeConfig
  })

  function drawCanvas (): void {
    const canvasEl = wheelEl.value as HTMLCanvasElement
    if (canvasEl.getContext) {
      const { radius, textRadius, borderWidth, borderColor, fontSize } = canvasConfig.value

      const arc = Math.PI / (props.prizes.length / 2)
      const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D

      ctx.clearRect(0, 0, radius * 2, radius * 2)

      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderWidth * 2

      ctx.font = `${fontSize}px Arial`
      props.prizes.forEach((row, i) => {
        const angle = i * arc - Math.PI / 2
        ctx.fillStyle = row.bgColor
        ctx.beginPath()
        ctx.arc(radius, radius, radius - borderWidth, angle, angle + arc, false)
        ctx.stroke()
        ctx.arc(radius, radius, 0, angle + arc, angle, true)
        ctx.fill()
        ctx.save()
        ctx.fillStyle = row.color
        ctx.translate(radius + Math.cos(angle + arc / 2) * textRadius, radius + Math.sin(angle + arc / 2) * textRadius)
        drawPrizeText(ctx, angle, arc, row.name)
        ctx.restore()

      })
    }
  }

  function drawPrizeText (ctx: CanvasRenderingContext2D, angle: number, arc: number, name: string) {
    const { lineHeight, textLength, textDirection } = canvasConfig.value
    const content = getStrArray(name, textLength)
    if (content === null) return
    textDirection === 'vertical' ? ctx.rotate(angle + arc / 2 + Math.PI) : ctx.rotate(angle + arc / 2 + Math.PI / 2)
    content.forEach((text, idx) => {
      let textX = -ctx.measureText(text).width / 2
      let textY = (idx + 1) * lineHeight
      if (textDirection === 'vertical') {
        textX = 0
        textY = (idx + 1) * lineHeight - content.length * lineHeight / 2
      }
      ctx.fillText(text, textX, textY)
    })
  }

  onMounted(() => {
    if (props.type === 'canvas') drawCanvas()
  })

  return {
    wheelEl,
    canvasConfig,
    drawCanvas
  }
}