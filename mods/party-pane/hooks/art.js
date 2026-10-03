// Vector busts for the party pane. Each character is an original design in the
// commissioned style: thick dark outlines, flat cel shading, cyan rim light.
const O = '#1b2830'
const RIM = '#37e8e6'
const S = `stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`
const T = `stroke="${O}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`

// One function per character. Each returns the drawing's inner markup for a
// 120 x 120 box; the head sits in a group with class "head" so it can bob
// on its own while the shoulders stay put.
const CHARACTERS = {
  // The orchestrating Claude: a white-bearded sage with one glowing eye.
  sage: () => `
    <path d="M6 121 C8 94 30 84 60 84 C90 84 112 94 114 121Z" fill="#2f4f8f" ${S}/>
    <path d="M6 121 C8 100 20 90 36 86 C28 98 28 110 30 121Z" fill="#223a70"/>
    <path d="M44 86 L60 104 L76 86" fill="#e9c441" ${S}/>
    <g class="head">
      <path d="M25 62 C17 28 40 7 62 7 C88 7 103 30 95 62 C97 84 84 100 60 104 C36 100 23 84 25 62Z" fill="#e3eff5" ${S}/>
      <path d="M25 62 C17 28 40 7 62 7" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M76 12 C90 22 98 40 94 62 C92 50 88 38 76 12Z" fill="#a9bdc8"/>
      <path d="M41 46 C41 33 79 33 79 46 L77 66 C73 77 47 77 43 66Z" fill="#dcb9c8" ${T}/>
      <path d="M32 44 C38 18 82 14 90 44 C80 32 52 28 32 44Z" fill="#ffffff" ${T}/>
      <path d="M36 64 C36 92 50 108 60 109 C70 108 84 92 84 64 C76 77 68 71 60 78 C52 71 44 77 36 64Z" fill="#e3eff5" ${S}/>
      <path d="M52 86 C54 96 57 102 60 106 M68 86 C66 96 63 102 60 106" fill="none" stroke="#9db3be" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M45 63 C52 57 58 62 60 67 C62 62 68 57 75 63 C70 73 62 71 60 69 C58 71 50 73 45 63Z" fill="#ffffff" ${T}/>
      <path d="M44 46 L55 49 M76 46 L66 49" stroke="#7f929c" stroke-width="3.2" stroke-linecap="round"/>
      <circle class="glow" cx="50" cy="52" r="4.6" fill="#7ff6ff" stroke="${O}" stroke-width="1.6"/>
      <path d="M66 53 Q72 57 78 53" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M71 44 L77 60" stroke="#8d5a6e" stroke-width="2.2" stroke-linecap="round"/>
    </g>`,

  // Explore: a hooded scout with glowing goggle lenses.
  scout: () => `
    <path d="M8 121 C10 96 30 86 60 86 C90 86 110 96 112 121Z" fill="#1d7f87" ${S}/>
    <path d="M8 121 C10 102 22 92 38 88 C30 100 30 112 32 121Z" fill="#145a61"/>
    <path d="M36 88 C46 100 74 100 84 88 L86 100 C74 110 46 110 34 100Z" fill="#e6a53a" ${S}/>
    <g class="head">
      <path d="M26 70 C18 30 40 8 60 8 C82 8 102 30 94 70 C90 88 78 94 60 94 C42 94 30 88 26 70Z" fill="#1d7f87" ${S}/>
      <path d="M26 70 C18 30 40 8 60 8" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M38 52 C38 38 82 38 82 52 L80 72 C74 84 46 84 40 72Z" fill="#c78b6e" ${T}/>
      <path d="M36 50 C38 36 82 36 84 50 C78 44 44 44 36 50Z" fill="#0f3d43"/>
      <path d="M36 54 L84 54 L82 60 L38 60Z" fill="#26343c" ${T}/>
      <circle class="glow" cx="49" cy="57" r="8" fill="#7ff6ff" stroke="#e9b83a" stroke-width="3.2"/>
      <circle class="glow" cx="71" cy="57" r="8" fill="#7ff6ff" stroke="#e9b83a" stroke-width="3.2"/>
      <circle cx="46.5" cy="54.5" r="2.4" fill="#fff"/><circle cx="68.5" cy="54.5" r="2.4" fill="#fff"/>
      <path d="M52 74 Q60 79 68 74" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
    </g>`,

  // Code writing: a horned, orange-bearded smith in an iron helm.
  smith: () => `
    <path d="M6 121 C8 96 28 86 60 86 C92 86 112 96 114 121Z" fill="#7d8b96" ${S}/>
    <path d="M6 121 C8 102 20 92 36 88 C28 100 28 112 30 121Z" fill="#5b6872"/>
    <circle cx="26" cy="100" r="6" fill="#e9c441" ${T}/><circle cx="94" cy="100" r="6" fill="#e9c441" ${T}/>
    <g class="head">
      <path d="M30 36 C16 30 10 16 14 6 C26 10 34 20 40 30Z" fill="#f3e8c6" ${S}/>
      <path d="M90 36 C104 30 110 16 106 6 C94 10 86 20 80 30Z" fill="#f3e8c6" ${S}/>
      <path d="M28 66 C22 90 40 112 60 112 C80 112 98 90 92 66 C84 78 70 74 60 80 C50 74 36 78 28 66Z" fill="#e0782c" ${S}/>
      <path d="M28 66 C22 90 40 112 60 112" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M44 96 C50 104 56 108 60 110 M76 96 C70 104 64 108 60 110" fill="none" stroke="#a8480f" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M36 52 C36 40 84 40 84 52 L82 70 C76 80 44 80 38 70Z" fill="#e3ab8c" ${T}/>
      <path d="M26 46 C24 18 44 8 60 8 C76 8 96 18 94 46 L84 44 C80 32 40 32 36 44Z" fill="#8b98a3" ${S}/>
      <path d="M26 46 C24 18 44 8 60 8" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 8 L64 8 L64 42 L56 42Z" fill="#b6c2cb" ${T}/>
      <path d="M43 54 L55 57 M77 54 L65 57" stroke="#a8480f" stroke-width="3.4" stroke-linecap="round"/>
      <circle class="glow" cx="49" cy="61" r="3.6" fill="#1b2830"/><circle class="glow" cx="71" cy="61" r="3.6" fill="#1b2830"/>
      <path d="M47 76 Q60 84 73 76 Q60 80 47 76Z" fill="#fff6e0" ${T}/>
    </g>`,

  // Review: a gold-masked guardian with a purple plume and glaring red eyes.
  guardian: () => `
    <path d="M8 121 C10 96 30 86 60 86 C90 86 110 96 112 121Z" fill="#5b2d96" ${S}/>
    <path d="M8 121 C10 102 22 92 38 88 C30 100 30 112 32 121Z" fill="#3e1f6b"/>
    <path d="M34 90 L60 108 L86 90 L80 80 L40 80Z" fill="#e9b82e" ${S}/>
    <g class="head">
      <path d="M18 56 L4 28 L28 40Z" fill="#2fc4d6" ${S}/><path d="M102 56 L116 28 L92 40Z" fill="#2fc4d6" ${S}/>
      <path d="M30 40 L24 6 L44 28 L52 2 L60 26 L68 2 L76 28 L96 6 L90 40Z" fill="#7b3fb8" ${S}/>
      <path d="M26 54 C26 34 94 34 94 54 C96 76 80 100 60 106 C40 100 24 76 26 54Z" fill="#eab72d" ${S}/>
      <path d="M26 54 C26 36 44 30 60 30" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M46 28 C54 22 66 22 74 28 L72 44 C66 40 54 40 48 44Z" fill="#f3d36a" ${T}/>
      <circle cx="60" cy="33" r="4.4" fill="#e03131" stroke="${O}" stroke-width="2"/>
      <path d="M33 56 L53 62 L51 70 L35 64Z" fill="#1b2830"/><path d="M87 56 L67 62 L69 70 L85 64Z" fill="#1b2830"/>
      <path class="glow" d="M38 59 L51 63 L50 67 L39 63Z" fill="#ff4a4a"/><path class="glow" d="M82 59 L69 63 L70 67 L81 63Z" fill="#ff4a4a"/>
      <path d="M40 84 Q60 98 80 84 L76 92 Q60 102 44 92Z" fill="#fff" ${T}/>
      <path d="M48 87 L50 92 M55 90 L56 95 M65 90 L64 95 M72 87 L70 92" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>
    </g>`,

  // Tests: a blue-mohawked goblin alchemist holding a bubbling flask.
  alchemist: () => `
    <path d="M10 121 C12 98 30 88 60 88 C90 88 108 98 110 121Z" fill="#2c3a44" ${S}/>
    <path d="M10 121 C12 104 22 94 38 90 C30 102 30 112 32 121Z" fill="#1e2a31"/>
    <g class="head">
      <path d="M44 22 C40 10 48 2 52 0 C54 8 56 12 58 18 C60 8 64 2 70 0 C72 10 72 16 70 22 C66 24 50 24 44 22Z" fill="#2fb0e0" ${S}/>
      <path d="M26 56 L8 46 L28 70Z" fill="#7bc65a" ${S}/><path d="M94 56 L112 46 L92 70Z" fill="#7bc65a" ${S}/>
      <path d="M28 52 C28 30 92 30 92 52 L90 74 C82 92 38 92 30 74Z" fill="#7bc65a" ${S}/>
      <path d="M28 52 C28 34 44 28 60 28" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M36 80 C40 100 50 108 60 108 C70 108 80 100 84 80 C76 88 68 86 60 90 C52 86 44 88 36 80Z" fill="#8fb2c4" ${S}/>
      <path d="M32 40 C40 30 80 30 88 40 L86 48 C76 42 44 42 34 48Z" fill="#e9b82e" ${S}/>
      <circle cx="46" cy="42" r="9" fill="#c8f4ff" stroke="${O}" stroke-width="3"/><circle cx="74" cy="42" r="9" fill="#c8f4ff" stroke="${O}" stroke-width="3"/>
      <circle class="glow" cx="47" cy="58" r="5" fill="#fff6a8" stroke="${O}" stroke-width="2.2"/><circle class="glow" cx="73" cy="58" r="5" fill="#fff6a8" stroke="${O}" stroke-width="2.2"/>
      <circle cx="48" cy="59" r="2.2" fill="${O}"/><circle cx="72" cy="59" r="2.2" fill="${O}"/>
      <path d="M48 72 Q60 80 72 72" fill="#fff" ${T}/>
    </g>
    <path d="M80 98 L80 86 L96 86 L96 98 L102 114 C102 120 74 120 74 114Z" fill="#a6f06a" ${S}/>
    <path d="M78 106 C86 102 92 110 100 106" fill="none" stroke="#e8ffd0" stroke-width="2.4" stroke-linecap="round"/>`,

  // You: the bearded, black-haired boss with the cream streak, from the
  // commissioned head art.
  you: () => `
    <path d="M8 121 C10 96 30 88 60 88 C90 88 110 96 112 121Z" fill="#26262e" ${S}/>
    <path d="M8 121 C10 102 20 94 34 90 C28 102 28 112 30 121Z" fill="#0fb5b5"/>
    <path d="M46 82 L46 98 C54 106 66 106 74 98 L74 82Z" fill="#b9808a" ${T}/>
    <g class="head">
      <ellipse cx="25" cy="62" rx="7" ry="10" fill="#c98f86" ${T}/>
      <path d="M20 56 C19 64 21 70 25 72" fill="none" stroke="${RIM}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="95" cy="62" rx="6" ry="9" fill="#dca593" ${T}/>
      <path d="M28 50 C28 14 92 14 92 50 L91 70 C86 94 34 94 29 70Z" fill="#dca593" ${S}/>
      <path d="M29 50 C28 70 31 84 42 92 C34 80 36 62 40 40Z" fill="#c4878b"/>
      <path d="M30 66 C28 94 44 110 60 110 C76 110 92 94 90 66 C84 80 72 78 60 84 C48 78 36 80 30 66Z" fill="#1c1c25" ${S}/>
      <path d="M88 72 C90 88 84 102 74 108" fill="none" stroke="#f2edc8" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 76 C50 71 56 75 60 78 C64 75 70 71 78 76 C74 82 64 81 60 80 C56 81 46 82 42 76Z" fill="#1c1c25" ${T}/>
      <path d="M49 86 Q60 99 71 86 Q60 91 49 86Z" fill="#d58a7a" ${T}/>
      <path d="M52 87 Q60 94 68 87 Q60 90 52 87Z" fill="#3a0d0d"/>
      <path d="M53 87 Q60 89 67 87 L66 89 Q60 91 54 89Z" fill="#fff"/>
      <ellipse cx="48" cy="58" rx="8" ry="6" fill="#eef3f6" ${T}/><ellipse cx="73" cy="58" rx="8" ry="6" fill="#eef3f6" ${T}/>
      <circle class="glow" cx="50" cy="59" r="3.8" fill="#3b2a24"/><circle class="glow" cx="75" cy="59" r="3.8" fill="#3b2a24"/>
      <circle cx="51.5" cy="57.5" r="1.4" fill="#fff"/><circle cx="76.5" cy="57.5" r="1.4" fill="#fff"/>
      <path d="M37 50 Q47 43 57 50 M64 50 Q74 43 84 50" fill="none" stroke="#17161c" stroke-width="4" stroke-linecap="round"/>
      <path d="M62 60 L58 70 Q61 73 65 70" fill="none" stroke="#a86a62" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 54 C12 30 28 10 50 8 C58 2 74 4 82 10 C98 14 102 32 98 52 C94 38 86 32 76 30 C60 26 44 28 36 34 C30 40 27 46 22 54Z" fill="#17161c" ${S}/>
      <path d="M22 54 C12 30 28 10 50 8" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M56 8 L63 -3 L72 8Z" fill="#17161c" ${T}/>
      <path d="M70 9 C86 12 98 24 98 44 C94 32 86 24 74 20 C68 18 66 12 70 9Z" fill="#f2edc8" ${T}/>
    </g>`,

  // Fallback: a floating spirit with a red jewel eye and crescent horns.
  wisp: () => `
    <g class="head">
      <path d="M22 70 C8 50 14 24 34 14 C26 34 32 50 44 58Z" fill="#7fd8f0" ${S}/>
      <path d="M98 70 C112 50 106 24 86 14 C94 34 88 50 76 58Z" fill="#7fd8f0" ${S}/>
      <path d="M60 24 C84 24 96 46 92 70 C88 94 72 108 60 108 C48 108 32 94 28 70 C24 46 36 24 60 24Z" fill="#e8f7fc" ${S}/>
      <path d="M28 70 C24 46 36 24 60 24" fill="none" stroke="${RIM}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M72 30 C88 40 92 60 88 78 C82 56 80 44 72 30Z" fill="#b9dbe6"/>
      <circle class="glow" cx="60" cy="58" r="12" fill="#e03131" stroke="${O}" stroke-width="3"/>
      <circle cx="56" cy="54" r="3.6" fill="#fff"/>
      <path d="M44 84 Q60 92 76 84" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
    </g>`,
}

// Which character plays which agent type. Anything unknown is a wisp.
export const CAST = {
  main: 'sage',
  Explore: 'scout',
  'general-purpose': 'smith',
  Plan: 'sage',
  'code-reviewer': 'guardian',
  'agent-skills:code-reviewer': 'guardian',
  'agent-skills:security-auditor': 'guardian',
  'agent-skills:test-engineer': 'alchemist',
}

export const NAMES = {
  sage: 'Sage',
  scout: 'Scout',
  smith: 'Smith',
  guardian: 'Guardian',
  alchemist: 'Alchemist',
  you: 'You',
  wisp: 'Wisp',
}

export function characterFor(type) {
  return CAST[type] ?? 'wisp'
}

// state: 'working' | 'done' | 'failed' | 'idle'
export function portrait(kind, state) {
  const body = (CHARACTERS[kind] ?? CHARACTERS.wisp)()
  const badge =
    state === 'done'
      ? `<circle cx="100" cy="100" r="13" fill="#3ccf6e" ${S}/><path d="M93 100 L98 106 L108 94" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : state === 'failed'
        ? `<circle cx="100" cy="100" r="13" fill="#e5484d" ${S}/><path d="M100 92 L100 102 M100 107 L100 108" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`
        : ''
  const ring =
    state === 'working'
      ? `<ellipse class="ring" cx="60" cy="116" rx="44" ry="6" fill="none" stroke="${RIM}" stroke-width="3"/>`
      : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -6 128 134" class="${state}">
  <style>
    .head{transform-origin:60px 100px;animation:bob 3.2s ease-in-out infinite}
    .working .head{animation:work .55s ease-in-out infinite}
    .done .head{animation:none}
    .failed .head{animation:shake .5s ease-in-out 2}
    .glow{animation:glow 1.6s ease-in-out infinite}
    .done .glow,.failed .glow{animation:none}
    .ring{animation:ring 1.1s ease-out infinite;transform-origin:60px 116px}
    @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
    @keyframes work{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-3px) rotate(1.5deg)}}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
    @keyframes glow{0%,100%{opacity:1}50%{opacity:.55}}
    @keyframes ring{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.15)}}
  </style>
  ${ring}${body}${badge}
</svg>`
}
