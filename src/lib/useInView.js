import { ref, onMounted, onUnmounted } from 'vue'

export function useInView(threshold = 0.12) {
  const el = ref(null)
  const seen = ref(false)
  let io

  onMounted(() => {
    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          seen.value = true
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    if (el.value) io.observe(el.value)
  })

  onUnmounted(() => io?.disconnect())

  return { el, seen }
}