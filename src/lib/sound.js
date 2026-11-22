let ctx = null
let master = null
let reverb = null
let noiseBuf = null

const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null
export const soundSupported = Boolean(AC)

function makeNoise(seconds) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return buf
}

function makeImpulse(seconds, decay) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
  }
  return buf
}

export async function unlockAudio() {
  if (!soundSupported) return false
  if (!ctx) {
    ctx = new AC()
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.knee.value = 20
    comp.ratio.value = 6
    comp.attack.value = 0.003
    comp.release.value = 0.25
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(comp)
    comp.connect(ctx.destination)

    reverb = ctx.createConvolver()
    reverb.buffer = makeImpulse(2.6, 2.2)
    reverb.connect(master)
    noiseBuf = makeNoise(2)
  }
  if (ctx.state === 'suspended') await ctx.resume()
  return true
}

function route(node, wet = 0.25) {
  node.connect(master)
  if (wet > 0) {
    const g = ctx.createGain()
    g.gain.value = wet
    node.connect(g)
    g.connect(reverb)
  }
}

function ramp(param, t, from, to, end) {
  param.setValueAtTime(from, t)
  param.exponentialRampToValueAtTime(to, end)
}

export function blip() {
  if (!ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'sine'
  ramp(o.frequency, t, 520, 1040, t + 0.12)
  const g = ctx.createGain()
  ramp(g.gain, t, 0.0001, 0.18, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
  o.connect(g)
  route(g, 0.3)
  o.start(t)
  o.stop(t + 0.25)
}

export function tick(freq = 1800) {
  if (!ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'square'
  o.frequency.value = freq
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 900
  const g = ctx.createGain()
  ramp(g.gain, t, 0.0001, 0.1, t + 0.002)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  o.connect(hp)
  hp.connect(g)
  route(g, 0.12)
  o.start(t)
  o.stop(t + 0.06)
}

export function riser(dur = 2.2) {
  if (!ctx) return
  const t = ctx.currentTime
  const end = t + dur
  const tail = end + 0.05

  const n = ctx.createBufferSource()
  n.buffer = noiseBuf
  n.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 1.2
  ramp(bp.frequency, t, 300, 7000, end)
  const ng = ctx.createGain()
  ramp(ng.gain, t, 0.0001, 0.4, end)
  ng.gain.exponentialRampToValueAtTime(0.0001, tail)
  n.connect(bp)
  bp.connect(ng)
  route(ng, 0.2)
  n.start(t)
  n.stop(tail + 0.02)

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 6
  ramp(lp.frequency, t, 200, 3200, end)
  const sg = ctx.createGain()
  ramp(sg.gain, t, 0.0001, 0.16, end)
  sg.gain.exponentialRampToValueAtTime(0.0001, tail)
  lp.connect(sg)
  route(sg, 0.3)
  ;[-9, 9].forEach((det) => {
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.detune.value = det
    ramp(o.frequency, t, 70, 420, end)
    o.connect(lp)
    o.start(t)
    o.stop(tail + 0.02)
  })

  const sub = ctx.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = 55
  const subg = ctx.createGain()
  ramp(subg.gain, t, 0.0001, 0.35, end)
  subg.gain.exponentialRampToValueAtTime(0.0001, tail)
  sub.connect(subg)
  route(subg, 0)
  sub.start(t)
  sub.stop(tail + 0.02)
}

export function impact() {
  if (!ctx) return
  const t = ctx.currentTime

  const sub = ctx.createOscillator()
  sub.type = 'sine'
  ramp(sub.frequency, t, 150, 36, t + 0.9)
  const sg = ctx.createGain()
  ramp(sg.gain, t, 1, 0.0001, t + 2.6)
  sub.connect(sg)
  route(sg, 0.1)
  sub.start(t)
  sub.stop(t + 2.7)

  const n = ctx.createBufferSource()
  n.buffer = noiseBuf
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  ramp(lp.frequency, t, 5000, 180, t + 1.4)
  const ng = ctx.createGain()
  ramp(ng.gain, t, 0.8, 0.0001, t + 1.6)
  n.connect(lp)
  lp.connect(ng)
  route(ng, 0.55)
  n.start(t)
  n.stop(t + 1.7)

  const bl = ctx.createBiquadFilter()
  bl.type = 'lowpass'
  bl.frequency.setValueAtTime(500, t)
  bl.frequency.exponentialRampToValueAtTime(1400, t + 0.25)
  bl.frequency.exponentialRampToValueAtTime(300, t + 2.2)
  const bg = ctx.createGain()
  ramp(bg.gain, t, 0.0001, 0.28, t + 0.06)
  bg.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
  bl.connect(bg)
  route(bg, 0.45)
  ;[55, 82.5, 110, 165].forEach((f, i) => {
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = f
    o.detune.value = i % 2 ? 7 : -7
    o.connect(bl)
    o.start(t)
    o.stop(t + 2.5)
  })
}

export function whoosh(dur = 1.2) {
  if (!ctx) return
  const t = ctx.currentTime
  const n = ctx.createBufferSource()
  n.buffer = noiseBuf
  n.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 0.9
  bp.frequency.setValueAtTime(250, t)
  bp.frequency.exponentialRampToValueAtTime(5200, t + dur * 0.45)
  bp.frequency.exponentialRampToValueAtTime(400, t + dur)
  const g = ctx.createGain()
  ramp(g.gain, t, 0.0001, 0.5, t + dur * 0.35)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  n.connect(bp)
  bp.connect(g)
  route(g, 0.35)
  n.start(t)
  n.stop(t + dur + 0.05)
}

export function fadeOutAndClose(sec = 2.4) {
  if (!ctx) return
  const c = ctx
  const m = master
  m.gain.cancelScheduledValues(c.currentTime)
  m.gain.setValueAtTime(m.gain.value, c.currentTime)
  m.gain.linearRampToValueAtTime(0, c.currentTime + sec)
  setTimeout(() => c.close(), sec * 1000 + 200)
  ctx = master = reverb = noiseBuf = null
}