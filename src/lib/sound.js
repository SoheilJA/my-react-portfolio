const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null
export const soundSupported = Boolean(AC)

let ctx = null
let master = null
let reverb = null
let noiseBuf = null
let amb = null
let runningCb = null

const ok = () => ctx && ctx.state === 'running' && master

function pinkNoise(seconds) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + w * 0.0555179
    b1 = 0.99332 * b1 + w * 0.0750759
    b2 = 0.969 * b2 + w * 0.153852
    b3 = 0.8665 * b3 + w * 0.3104856
    b4 = 0.55 * b4 + w * 0.5329522
    b5 = -0.7616 * b5 - w * 0.016898
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
    b6 = w * 0.115926
  }
  return buf
}

function impulse(seconds, decay) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    let lp = 0
    for (let i = 0; i < len; i++) {
      lp += ((Math.random() * 2 - 1) - lp) * 0.25
      d[i] = lp * Math.pow(1 - i / len, decay)
    }
  }
  return buf
}

export function prepareAudio() {
  if (!soundSupported || ctx) return
  ctx = new AC()

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -20
  comp.ratio.value = 4
  comp.attack.value = 0.01
  comp.release.value = 0.3

  master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(comp)
  comp.connect(ctx.destination)

  reverb = ctx.createConvolver()
  reverb.buffer = impulse(3, 2.5)
  const wet = ctx.createGain()
  wet.gain.value = 0.45
  reverb.connect(wet)
  wet.connect(master)

  noiseBuf = pinkNoise(4)
  ctx.onstatechange = () => {
    if (ctx && ctx.state === 'running') runningCb?.()
  }
}

export function onAudioRunning(cb) {
  runningCb = cb
  if (ctx && ctx.state === 'running') cb()
}

export function unlockAudio() {
  if (ctx && ctx.state === 'suspended') return ctx.resume().catch(() => {})
}

export function startAmbience() {
  if (!ok() || amb) return
  const t = ctx.currentTime

  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  src.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 90
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  lp.Q.value = 0.5
  const mg = ctx.createGain()
  mg.gain.value = 1
  const sg = ctx.createGain()
  sg.gain.value = 0.0001
  src.connect(hp)
  hp.connect(lp)
  lp.connect(mg)
  mg.connect(sg)
  sg.connect(master)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.35
  const lfoG = ctx.createGain()
  lfoG.gain.value = 0.18
  lfo.connect(lfoG)
  lfoG.connect(mg.gain)

  const lfo2 = ctx.createOscillator()
  lfo2.frequency.value = 0.13
  const lfo2G = ctx.createGain()
  lfo2G.gain.value = 280
  lfo2.connect(lfo2G)
  lfo2G.connect(lp.frequency)

  const hum = ctx.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = 55
  const hg = ctx.createGain()
  hg.gain.value = 0.0001
  hum.connect(hg)
  hg.connect(master)

  const padLp = ctx.createBiquadFilter()
  padLp.type = 'lowpass'
  padLp.frequency.value = 700
  const pg = ctx.createGain()
  pg.gain.value = 0.0001
  padLp.connect(pg)
  pg.connect(master)
  pg.connect(reverb)
  ;[110, 164.81, 220, 277.18].forEach((f, i) => {
    const o = ctx.createOscillator()
    o.type = i % 2 ? 'triangle' : 'sine'
    o.frequency.value = f
    o.detune.value = (i - 1.5) * 4
    o.connect(padLp)
    o.start(t)
  })

  src.start(t)
  lfo.start(t)
  lfo2.start(t)
  hum.start(t)

  master.gain.setTargetAtTime(0.85, t, 0.5)
  sg.gain.setTargetAtTime(0.05, t, 0.5)
  hg.gain.setTargetAtTime(0.025, t, 0.7)
  pg.gain.setTargetAtTime(0.02, t, 1.5)

  amb = { sg, lp, pg }
}

export function setTune(p) {
  if (!ok() || !amb) return
  const t = ctx.currentTime
  amb.lp.frequency.setTargetAtTime(800 + p * 2400, t, 0.3)
  amb.sg.gain.setTargetAtTime(0.045 + p * 0.06, t, 0.3)
}

export function thump() {
  if (!ok()) return
  const t = ctx.currentTime

  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(95, t)
  o.frequency.exponentialRampToValueAtTime(38, t + 0.9)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2)
  o.connect(g)
  g.connect(master)
  g.connect(reverb)
  o.start(t)
  o.stop(t + 2.1)

  const n = ctx.createBufferSource()
  n.buffer = noiseBuf
  const nl = ctx.createBiquadFilter()
  nl.type = 'lowpass'
  nl.frequency.setValueAtTime(900, t)
  nl.frequency.exponentialRampToValueAtTime(140, t + 1.3)
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.0001, t)
  ng.gain.exponentialRampToValueAtTime(0.22, t + 0.04)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.5)
  n.connect(nl)
  nl.connect(ng)
  ng.connect(master)
  ng.connect(reverb)
  n.start(t)
  n.stop(t + 1.6)

  if (amb) {
    amb.pg.gain.cancelScheduledValues(t)
    amb.pg.gain.setTargetAtTime(0.1, t, 0.25)
    amb.pg.gain.setTargetAtTime(0.0001, t + 1.2, 0.9)
    amb.sg.gain.cancelScheduledValues(t)
    amb.sg.gain.setTargetAtTime(0.012, t, 0.15)
  }
}

export function whoosh(dur = 1.4) {
  if (!ok()) return
  const t = ctx.currentTime
  const n = ctx.createBufferSource()
  n.buffer = noiseBuf
  n.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 0.6
  bp.frequency.setValueAtTime(180, t)
  bp.frequency.exponentialRampToValueAtTime(1800, t + dur * 0.45)
  bp.frequency.exponentialRampToValueAtTime(250, t + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.28, t + dur * 0.4)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  n.connect(bp)
  bp.connect(g)
  g.connect(master)
  g.connect(reverb)
  n.start(t)
  n.stop(t + dur + 0.05)
}

export function endAmbience(sec = 2.2) {
  if (!ctx) return
  const c = ctx
  const t = c.currentTime
  if (master) {
    master.gain.cancelScheduledValues(t)
    master.gain.setValueAtTime(master.gain.value, t)
    master.gain.linearRampToValueAtTime(0.0001, t + sec)
  }
  c.onstatechange = null
  setTimeout(() => c.close().catch(() => {}), sec * 1000 + 300)
  ctx = master = reverb = noiseBuf = amb = runningCb = null
}