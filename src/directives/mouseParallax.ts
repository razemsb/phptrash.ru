import type { Directive } from 'vue'

interface ParallaxOptions {
  strength?: number
}

export const vMouseParallax: Directive<HTMLElement, ParallaxOptions | undefined> = {
  mounted(el, binding) {
    const strength = binding.value?.strength ?? 18
    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      raf = requestAnimationFrame(animate)
    }

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = ((event.clientX - cx) / rect.width) * strength
      targetY = ((event.clientY - cy) / rect.height) * strength
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
    }

    el.style.willChange = 'transform'
    el.dataset.parallaxBound = 'true'
    window.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(animate)

    ;(el as HTMLElement & { __parallaxCleanup?: () => void }).__parallaxCleanup = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  },
  unmounted(el) {
    ;(el as HTMLElement & { __parallaxCleanup?: () => void }).__parallaxCleanup?.()
  },
}
