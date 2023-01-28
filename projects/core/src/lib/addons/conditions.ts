import { GradientColorStop } from '../utilities/gradient/gradient'

export const conditions = (shape: any, data: any[]) => {
  const conditions = shape.append('conditions')
  data.forEach(item => {
    const condition = conditions.append('condition')
      .attr('id', item.id)

    /* --- FONT --- */
    condition.append('font')
      .attr('size', item.font?.size)
      .attr('color', item.font?.color)
      .attr('style', item.font?.style?.join(','))
      .attr('family', item.font?.family)
      .attr('opacity', item.font?.opacity)
      .attr('baseline', item.font?.baseline)
      .attr('alignment', item.font?.alignment)

    /* --- FILL --- */
    const fill = condition.append('fill')
      .attr('color', item.fill?.color)
      .attr('opacity', item.fill?.opacity)

    const fillGradient = fill.append('gradient')
      .attr('type', item.fill?.gradient?.type)
      .attr('angle', item.fill?.gradient?.angle)
      .attr('stretch', item.fill?.gradient?.stretch)
    fillGradient.append('end')
      .attr('x', item.fill?.gradient?.end.x)
      .attr('y', item.fill?.gradient?.end.y)
    fillGradient.append('start')
      .attr('x', item.fill?.gradient?.start.x)
      .attr('y', item.fill?.gradient?.start.y)
    fillGradient.append('center')
      .attr('x', item.fill?.gradient?.center.x)
      .attr('y', item.fill?.gradient?.center.y)

    const fillGradientColors = fillGradient.append('colors')
    item.fill?.gradient?.colors.forEach((gcs: GradientColorStop) => {
      fillGradientColors.append('color-stop')
        .attr('point', gcs?.point)
        .attr('color', gcs?.color)
    })

    /* --- STROKE --- */
    const stroke = condition.append('stroke')
      .attr('cap', item.stroke?.cap)
      .attr('width', item.stroke?.width)
      .attr('style', item.stroke?.style)
      .attr('color', item.stroke?.color)
      .attr('opacity', item.stroke?.opacity)

    const strokeGradient = stroke.append('gradient')
      .attr('type', item.stroke?.gradient?.type)
      .attr('angle', item.stroke?.gradient?.angle)
      .attr('stretch', item.stroke?.gradient?.stretch)
    strokeGradient.append('end')
      .attr('x', item.stroke?.gradient?.end.x)
      .attr('y', item.stroke?.gradient?.end.y)
    strokeGradient.append('start')
      .attr('x', item.stroke?.gradient?.start.x)
      .attr('y', item.stroke?.gradient?.start.y)
    strokeGradient.append('center')
      .attr('x', item.stroke?.gradient?.center.x)
      .attr('y', item.stroke?.gradient?.center.y)

    const strokeGradientColors = strokeGradient.append('colors')
    item.stroke?.gradient?.colors.forEach((gcs: GradientColorStop) => {
      strokeGradientColors.append('color-stop')
        .attr('point', gcs?.point)
        .attr('color', gcs?.color)
    })
  })
}