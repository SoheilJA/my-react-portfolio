<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import AbstractArt from './AbstractArt.vue'

const canvas = ref(null)
const fallback = ref(true)
let dead = false
let cleanup = () => {}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vD;
  void main() {
    vec3 p = position;
    float d = sin(p.x * 2.6 + uTime * 0.8)
            * sin(p.y * 2.6 + uTime * 0.6)
            * sin(p.z * 2.6 + uTime * 0.7);
    p += normalize(p) * d * (0.35 + uMouse.y * 0.1);
    vD = d;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = `
  varying float vD;
  void main() {
    float a = 0.3 + abs(vD) * 0.7;
    gl_FragColor = vec4(1.0, 0.353, 0.0, a);
  }
`

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

onMounted(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!hasWebGL()) return

  const THREE = await import('three')
  if (dead) return

  const el = canvas.value
  const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = 5

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
  })
  const geometry = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.5, 3))
  const mesh = new THREE.LineSegments(geometry, material)
  scene.add(mesh)

  const mouse = new THREE.Vector2()
  const target = new THREE.Vector2()
  let visible = true

  function resize() {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  function onMove(e) {
    target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1))
  }

  function tick(time) {
    if (!visible) return
    uniforms.uTime.value = time
    mouse.lerp(target, 0.05)
    uniforms.uMouse.value.copy(mouse)
    mesh.rotation.y = time * 0.12 + mouse.x * 0.4
    mesh.rotation.x = mouse.y * 0.3
    renderer.render(scene, camera)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(el)
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(el)
  window.addEventListener('pointermove', onMove, { passive: true })
  gsap.ticker.add(tick)

  resize()
  fallback.value = false

  cleanup = () => {
    gsap.ticker.remove(tick)
    ro.disconnect()
    io.disconnect()
    window.removeEventListener('pointermove', onMove)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
})

onUnmounted(() => {
  dead = true
  cleanup()
})
</script>

<template>
  <div class="relative aspect-square w-full">
    <AbstractArt v-if="fallback" />
    <canvas
        ref="canvas"
        class="absolute inset-0 h-full w-full transition-opacity duration-1000"
        :class="fallback ? 'opacity-0' : 'opacity-100'"
        aria-hidden="true"
    ></canvas>
  </div>
</template>