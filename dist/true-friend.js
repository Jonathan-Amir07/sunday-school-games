/**
 * How to Choose a True Friend · Lesson 06
 * Coptic Orthodox Sunday School Mini-Games (David & Jonathan)
 * Game 1: Pack the True Friend's Backpack
 * Game 2: Zoom-In Mystery
 */

(() => {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  let audioCtx = null;
  let isMuted = false;
  try { isMuted = localStorage.getItem('sundaySchoolAudioMuted') === 'true'; } catch {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainStart = 0.2, gainEnd = 0.001) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainStart, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainEnd, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  function playChime() {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 0.28, 0.22), idx * 70);
    });
  }

  function playBuzzer() {
    if (isMuted) return;
    playTone(140, 'sawtooth', 0.35, 0.25);
    setTimeout(() => playTone(125, 'sawtooth', 0.3, 0.2), 60);
  }

  function playSnap() {
    if (isMuted) return;
    playTone(480, 'triangle', 0.12, 0.18);
  }

  function playVictory() {
    if (isMuted) return;
    const notes = [392, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.45, 0.3), idx * 110);
    });
  }

  // --- SVG ARTWORK GENERATOR ---
  const SVG_DEFS = {
    backpack: `<svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="bpBody" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#804a2d"/> <stop offset="100%" stop-color="#552f19"/> </linearGradient> <linearGradient id="bpFlap" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#9a5a36"/> <stop offset="100%" stop-color="#6e3a1f"/> </linearGradient> <linearGradient id="bpInside" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#2a1408"/> <stop offset="100%" stop-color="#442210"/> </linearGradient> </defs> <!-- Shadow --> <ellipse cx="120" cy="205" rx="90" ry="12" fill="rgba(43,29,27,0.2)"/> <!-- Straps behind --> <path d="M70,50 Q40,90 50,180" stroke="#482512" stroke-width="12" fill="none" stroke-linecap="round"/> <path d="M170,50 Q200,90 190,180" stroke="#482512" stroke-width="12" fill="none" stroke-linecap="round"/> <!-- Main Body --> <rect x="52" y="70" width="136" height="125" rx="20" fill="url(#bpBody)" stroke="#3e1f0e" stroke-width="3"/> <!-- Open Cavity (Drop Zone) --> <ellipse cx="120" cy="74" rx="60" ry="22" fill="url(#bpInside)" stroke="#c69049" stroke-width="2.5"/> <!-- Front Pocket --> <rect x="74" y="115" width="92" height="65" rx="8" fill="#6f3b20" stroke="#4a2411" stroke-width="2"/> <path d="M74,130 L166,130" stroke="#4a2411" stroke-width="2" stroke-dasharray="3,3"/> <!-- Brass Buckles and Straps --> <rect x="90" y="80" width="10" height="95" fill="#4a2411"/> <rect x="140" y="80" width="10" height="95" fill="#4a2411"/> <rect x="88" y="125" width="14" height="16" rx="2" fill="#c69049" stroke="#774f1b" stroke-width="1.5"/> <rect x="138" y="125" width="14" height="16" rx="2" fill="#c69049" stroke="#774f1b" stroke-width="1.5"/> <!-- Top Open Flap tilted back --> <path d="M60,65 Q120,30 180,65 Q120,45 60,65 Z" fill="url(#bpFlap)" stroke="#3e1f0e" stroke-width="2"/> <!-- Coptic Cross Emblem on pocket --> <g transform="translate(120,150) scale(0.65)"> <path d="M-2,-14 h4 v28 h-4 Z M-14,-2 h28 v4 h-28 Z" fill="#e8a855"/> <circle cx="0" cy="0" r="3" fill="#6f3b20"/> <circle cx="-14" cy="0" r="2" fill="#e8a855"/> <circle cx="14" cy="0" r="2" fill="#e8a855"/> <circle cx="0" cy="-14" r="2" fill="#e8a855"/> <circle cx="0" cy="14" r="2" fill="#e8a855"/> </g> </svg>`,

    mirror: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="goldM" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#fae29c"/> <stop offset="50%" stop-color="#c69049"/> <stop offset="100%" stop-color="#8c581e"/> </linearGradient> <linearGradient id="glassM" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#d6edfc"/> <stop offset="60%" stop-color="#a8d3f2"/> <stop offset="100%" stop-color="#7ab4de"/> </linearGradient> </defs> <!-- Handle --> <path d="M50,68 L50,92 M46,92 L54,92 M47,78 L53,78" stroke="url(#goldM)" stroke-width="5" stroke-linecap="round"/> <circle cx="50" cy="94" r="3" fill="url(#goldM)"/> <!-- Mirror Frame --> <ellipse cx="50" cy="38" rx="30" ry="34" fill="url(#goldM)" stroke="#683d10" stroke-width="2"/> <!-- Glass Surface --> <ellipse cx="50" cy="38" rx="23" ry="27" fill="url(#glassM)"/> <!-- Glass Sheen / Reflection lines --> <path d="M37,24 Q52,18 61,30" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round"/> <path d="M35,36 Q42,28 53,38" stroke="#ffffff" stroke-width="1.8" fill="none" opacity="0.6" stroke-linecap="round"/> <!-- Sparkle of Honesty --> <path d="M62,20 L64,15 L66,20 L71,22 L66,24 L64,29 L62,24 L57,22 Z" fill="#fffaf1"/> </svg>`,

    heart: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="heartG" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#e24a42"/> <stop offset="60%" stop-color="#b82622"/> <stop offset="100%" stop-color="#7e1411"/> </linearGradient> </defs> <!-- Divine rays of love --> <g stroke="#d8a156" stroke-width="1.8" opacity="0.75"> <line x1="50" y1="12" x2="50" y2="4"/> <line x1="28" y1="20" x2="20" y2="14"/> <line x1="72" y1="20" x2="80" y2="14"/> <line x1="14" y1="42" x2="5" y2="42"/> <line x1="86" y1="42" x2="95" y2="42"/> </g> <!-- Gold Border --> <path d="M50,86 C20,64 10,48 10,32 C10,18 22,12 34,12 C42,12 47,17 50,22 C53,17 58,12 66,12 C78,12 90,18 90,32 C90,48 80,64 50,86 Z" fill="#c69049"/> <!-- Inner Red Heart --> <path d="M50,82 C22,61 14,46 14,33 C14,21 24,15 34,15 C42,15 47,20 50,24 C53,20 58,15 66,15 C76,15 86,21 86,33 C86,46 78,61 50,82 Z" fill="url(#heartG)"/> <!-- Soft highlight --> <path d="M22,30 C22,23 28,19 35,19" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.65" stroke-linecap="round"/> <!-- Small Coptic cross inside heart --> <path d="M49,36 h4 v16 h-4 Z M43,41 h16 v4 h-16 Z" fill="#fae29c"/> </svg>`,

    rings: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#fae29c"/> <stop offset="60%" stop-color="#c69049"/> <stop offset="100%" stop-color="#7b4a15"/> </linearGradient> <linearGradient id="ringCopper" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#e8b896"/> <stop offset="60%" stop-color="#b66847"/> <stop offset="100%" stop-color="#693019"/> </linearGradient> </defs> <!-- Shadow --> <ellipse cx="50" cy="80" rx="36" ry="6" fill="rgba(43,29,27,0.15)"/> <!-- Ring 1 (Left, Copper/Bronze) --> <circle cx="39" cy="48" r="25" fill="none" stroke="url(#ringCopper)" stroke-width="7"/> <!-- Ring 2 (Right, Gold, Intertwined) --> <circle cx="61" cy="48" r="25" fill="none" stroke="url(#ringGold)" stroke-width="7"/> <!-- Overlap highlight to show intertwining --> <path d="M47,28 A25,25 0 0,1 61,23" fill="none" stroke="url(#ringGold)" stroke-width="7"/> <!-- Sparkles of unity --> <path d="M50,15 L52,10 L54,15 L59,17 L54,19 L52,24 L50,19 L45,17 Z" fill="#e8a855"/> <path d="M78,35 L79,32 L80,35 L83,36 L80,37 L79,40 L78,37 L75,36 Z" fill="#fae29c"/> </svg>`,

    lips: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="padG" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#fae29c"/> <stop offset="50%" stop-color="#c69049"/> <stop offset="100%" stop-color="#804d19"/> </linearGradient> </defs> <!-- Shackle --> <path d="M34,44 V28 C34,18 42,12 50,12 C58,12 66,18 66,28 V44" fill="none" stroke="#7e5323" stroke-width="7" stroke-linecap="round"/> <!-- Lock Body --> <rect x="25" y="40" width="50" height="46" rx="8" fill="url(#padG)" stroke="#5c3510" stroke-width="2"/> <!-- Embossed Lips with Zipper/Lock motif --> <path d="M34,58 Q50,51 66,58 Q50,68 34,58 Z" fill="#582a17"/> <!-- Teeth / zipper notches --> <path d="M37,58 h26 M42,55 v6 M46,55 v6 M50,54 v8 M54,55 v6 M58,55 v6" stroke="#fae29c" stroke-width="1.8" stroke-linecap="round"/> <!-- Keyhole under --> <circle cx="50" cy="74" r="3" fill="#32160b"/> <path d="M49,74 L48,80 L52,80 L51,74 Z" fill="#32160b"/> </svg>`,

    key: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="keyG" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#fce8ab"/> <stop offset="50%" stop-color="#d19c52"/> <stop offset="100%" stop-color="#8a571c"/> </linearGradient> </defs> <!-- Lock base plate --> <circle cx="42" cy="46" r="28" fill="#53311b" stroke="#c69049" stroke-width="3"/> <circle cx="42" cy="46" r="22" fill="#381d0e"/> <!-- Keyhole --> <circle cx="42" cy="43" r="4.5" fill="#fce8ab"/> <polygon points="40,43 38,53 46,53 44,43" fill="#fce8ab"/> <!-- The Matching Key laid across --> <g transform="translate(18,-5) rotate(32, 50, 50)"> <!-- Key Bow --> <circle cx="68" cy="50" r="10" fill="none" stroke="url(#keyG)" stroke-width="3.5"/> <circle cx="68" cy="50" r="4" fill="url(#keyG)"/> <!-- Shaft --> <rect x="26" y="48.5" width="34" height="3.5" rx="1.5" fill="url(#keyG)"/> <!-- Bits / Teeth --> <rect x="27" y="52" width="3.5" height="6" fill="url(#keyG)"/> <rect x="33" y="52" width="3.5" height="4" fill="url(#keyG)"/> </g> </svg>`,

    child: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="pillowG" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#ffffff"/> <stop offset="100%" stop-color="#dfd2c0"/> </linearGradient> </defs> <!-- Soft embroidered pillow --> <path d="M14,48 C14,35 86,35 86,48 C92,68 88,80 75,82 C50,85 50,85 25,82 C12,80 8,68 14,48 Z" fill="url(#pillowG)" stroke="#bfa991" stroke-width="2"/> <!-- Pillow corner tassels --> <circle cx="12" cy="47" r="2.5" fill="#c69049"/> <circle cx="88" cy="47" r="2.5" fill="#c69049"/> <circle cx="18" cy="80" r="2.5" fill="#c69049"/> <circle cx="82" cy="80" r="2.5" fill="#c69049"/> <!-- Halo of peace --> <circle cx="48" cy="40" r="20" fill="none" stroke="#e8a855" stroke-width="2" stroke-dasharray="2,2"/> <!-- Sleeping Child face --> <circle cx="48" cy="43" r="13" fill="#f8d6b8"/> <!-- Hair --> <path d="M37,41 C37,33 43,30 52,31 C59,32 61,37 60,42 C56,38 52,38 46,39 C41,40 38,42 37,41 Z" fill="#6a4427"/> <!-- Peaceful closed eyes --> <path d="M42,44 Q45,47 48,44" stroke="#5d391e" stroke-width="1.6" fill="none" stroke-linecap="round"/> <path d="M51,44 Q54,47 57,44" stroke="#5d391e" stroke-width="1.6" fill="none" stroke-linecap="round"/> <!-- Gentle smile --> <path d="M47,50 Q49,52 52,50" stroke="#b0523e" stroke-width="1.2" fill="none" stroke-linecap="round"/> <!-- Soft Blanket --> <path d="M28,58 Q50,52 72,58 L70,80 Q50,78 30,80 Z" fill="#7d9db3" stroke="#517288" stroke-width="1.5"/> <path d="M30,58 Q50,54 70,58" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6"/> </svg>`,

    church: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="domeG" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#fae29c"/> <stop offset="70%" stop-color="#c69049"/> <stop offset="100%" stop-color="#86541f"/> </linearGradient> </defs> <!-- Main Stone Wall --> <rect x="25" y="44" width="50" height="44" fill="#eedec8" stroke="#7d593d" stroke-width="2"/> <!-- Left Tower --> <rect x="15" y="52" width="16" height="36" fill="#dfcbaf" stroke="#7d593d" stroke-width="1.8"/> <!-- Central Coptic Dome --> <path d="M32,44 C32,25 68,25 68,44 Z" fill="url(#domeG)" stroke="#6d4218" stroke-width="2"/> <!-- Cross atop the Dome --> <path d="M48.5,12 h3 v14 h-3 Z M43.5,16 h13 v3 h-13 Z" fill="#d9993e"/> <circle cx="50" cy="11" r="1.5" fill="#fae29c"/> <!-- Church Arched Door --> <path d="M43,88 V66 C43,62 57,62 57,66 V88 Z" fill="#58311a" stroke="#33190a" stroke-width="1.5"/> <!-- Arched Windows --> <path d="M32,56 V63 C32,65 38,65 38,63 V56 Z" fill="#4d6f85" stroke="#372010" stroke-width="1"/> <path d="M62,56 V63 C62,65 68,65 68,63 V56 Z" fill="#4d6f85" stroke="#372010" stroke-width="1"/> <!-- Tower bell arch --> <path d="M19,60 V67 C19,69 27,69 27,67 V60 Z" fill="#3c2010"/> </svg>`,

    trap_megaphone: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="hornG" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" stop-color="#e8594d"/> <stop offset="70%" stop-color="#b8291c"/> <stop offset="100%" stop-color="#6e140c"/> </linearGradient> </defs> <!-- Danger / Gossip Soundwaves --> <path d="M68,28 Q84,40 68,54 M74,22 Q94,39 74,60 M80,16 Q104,39 80,66" stroke="#b8291c" stroke-width="3" fill="none" stroke-linecap="round"/> <!-- Megaphone Cone --> <polygon points="34,42 66,22 66,60 34,48" fill="url(#hornG)" stroke="#53110a" stroke-width="2"/> <!-- Megaphone Rim --> <ellipse cx="66" cy="41" rx="4" ry="19" fill="#fae29c" stroke="#53110a" stroke-width="1.5"/> <!-- Back Handle and Base --> <rect x="22" y="40" width="13" height="10" rx="3" fill="#4a3f3b" stroke="#221c19" stroke-width="1.5"/> <path d="M26,50 L22,72 L28,72 L32,50 Z" fill="#38302c" stroke="#221c19" stroke-width="1.5"/> <!-- Red Flag Warning Badge --> <circle cx="28" cy="24" r="9" fill="#ba382c"/> <text x="28" y="28" fill="#ffffff" font-family="'DM Sans',sans-serif" font-weight="bold" font-size="12" text-anchor="middle">!</text> </svg>`,

    trap_boxing: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="gloveG" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#e24a42"/> <stop offset="60%" stop-color="#a82319"/> <stop offset="100%" stop-color="#69120b"/> </linearGradient> </defs> <!-- Angry impact sparks --> <g stroke="#ba382c" stroke-width="2.2" stroke-linecap="round"> <line x1="72" y1="20" x2="84" y2="14"/> <line x1="82" y1="36" x2="94" y2="34"/> <line x1="76" y1="52" x2="88" y2="58"/> </g> <!-- Boxing Glove Main Fist --> <rect x="24" y="24" width="46" height="38" rx="16" fill="url(#gloveG)" stroke="#4a120b" stroke-width="2"/> <!-- Glove Thumb --> <path d="M48,46 C56,46 64,52 62,60 C60,66 48,64 44,56 Z" fill="url(#gloveG)" stroke="#4a120b" stroke-width="1.8"/> <!-- Wrist / Lacing --> <rect x="20" y="58" width="28" height="20" rx="4" fill="#dfd0be" stroke="#524337" stroke-width="2"/> <path d="M24,63 L34,73 M34,63 L24,73 M29,60 v16" stroke="#ba382c" stroke-width="2"/> <!-- Warning Badge --> <circle cx="26" cy="18" r="9" fill="#ba382c"/> <text x="26" y="22" fill="#ffffff" font-family="'DM Sans',sans-serif" font-weight="bold" font-size="12" text-anchor="middle">!</text> </svg>`,

    trap_gamepad: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="padBody" x1="0%" y1="0%" x2="0%" y2="100%"> <stop offset="0%" stop-color="#4a4f59"/> <stop offset="100%" stop-color="#24272c"/> </linearGradient> </defs> <!-- Tangled distraction lightning --> <path d="M48,12 L54,20 L48,22 L53,30" stroke="#f0a53a" stroke-width="2.5" fill="none" stroke-linecap="round"/> <!-- Gamepad Shape --> <path d="M20,44 C16,56 18,78 30,78 C38,78 42,66 50,66 C58,66 62,78 70,78 C82,78 84,56 80,44 C76,36 65,34 50,35 C35,34 24,36 20,44 Z" fill="url(#padBody)" stroke="#16181b" stroke-width="2.5"/> <!-- D-Pad (Left) --> <path d="M29,48 h4 v-4 h4 v4 h4 v4 h-4 v4 h-4 v-4 h-4 Z" fill="#9da5b3"/> <!-- Action Buttons (Right) --> <circle cx="66" cy="46" r="2.5" fill="#e24a42"/> <circle cx="72" cy="52" r="2.5" fill="#387640"/> <circle cx="60" cy="52" r="2.5" fill="#3b72b8"/> <circle cx="66" cy="58" r="2.5" fill="#f0a53a"/> <!-- Warning Badge --> <circle cx="22" cy="22" r="9" fill="#ba382c"/> <text x="22" y="26" fill="#ffffff" font-family="'DM Sans',sans-serif" font-weight="bold" font-size="12" text-anchor="middle">!</text> </svg>`
  };

  // --- ITEM DATA ---
  const ITEMS = [
    {
      id: 'mirror',
      name: 'Mirror',
      trait: 'Honesty',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Shows you the truth about yourself without lying or flattering.',
      mysteryMatch: 'Mirror: A friend who reflects the truth honestly',
      distractors: [
        'Mirror: A friend who cares only about appearances and clothes',
        'Mirror: A friend who mimics whatever you do without thinking',
        'Mirror: A friend who hides your mistakes so you never learn'
      ],
      pan: { x: -8, y: -12 }
    },
    {
      id: 'heart',
      name: 'Heart',
      trait: 'Genuine Love',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Cares for you sincerely, just like Jonathan loved David.',
      mysteryMatch: 'Heart: A friend with true, unselfish love',
      distractors: [
        'Heart: A friend who expects gifts and favors in return',
        'Heart: A friend who agrees with you even when you sin',
        'Heart: A friend who only likes you when you are winning'
      ],
      pan: { x: 0, y: 0 }
    },
    {
      id: 'rings',
      name: 'Linked Rings',
      trait: 'Cooperation & Sharing',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Sticks with you and shares life\'s responsibilities.',
      mysteryMatch: 'Linked Rings: A friend who cooperates and shares with you',
      distractors: [
        'Linked Rings: A friend who demands you only play with them',
        'Linked Rings: A friend who borrows your things and never returns them',
        'Linked Rings: A friend who competes against you for attention'
      ],
      pan: { x: 12, y: -6 }
    },
    {
      id: 'lips',
      name: 'Padlock & Zipper',
      trait: 'Keeps Secrets',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Protects your trust and never spreads rumors.',
      mysteryMatch: 'Keeper of Secrets: A friend you can trust with your secrets',
      distractors: [
        'Secret Keeper: A friend who promises to keep a secret but whispers it',
        'Secret Keeper: A friend who hides dangerous things from parents',
        'Secret Keeper: A friend who never talks or shares their thoughts'
      ],
      pan: { x: 0, y: 14 }
    },
    {
      id: 'key',
      name: 'Lock & Key',
      trait: 'Mutual Understanding',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Fits with you and understands how you think and feel.',
      mysteryMatch: 'Lock & Key: A friend who understands and completes you',
      distractors: [
        'Lock & Key: A friend who controls what games you are allowed to play',
        'Lock & Key: A friend who locks away feelings and stays angry',
        'Lock & Key: A friend who expects you to read their mind'
      ],
      pan: { x: -14, y: 8 }
    },
    {
      id: 'child',
      name: 'Sleeping Child',
      trait: 'Safety & Peace',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Makes you feel completely safe because you trust them.',
      mysteryMatch: 'Peaceful Sleep: Feeling safe and secure because you trust your friend',
      distractors: [
        'Sleep: A friend who falls asleep during Sunday school lessons',
        'Sleep: A friend who ignores problems and stays lazy',
        'Sleep: A friend who stays quiet when someone else gets bullied'
      ],
      pan: { x: 8, y: -8 }
    },
    {
      id: 'church',
      name: 'Church',
      trait: 'Spiritual Growth',
      tag: 'Green Flag',
      isTrap: false,
      quote: 'Encourages you to pray, go to church, and grow closer to God.',
      mysteryMatch: 'Church: A friend who encourages you to go to church and grow spiritually',
      distractors: [
        'Church: A friend who only talks to you during the liturgy',
        'Church: A friend who boasts about memorizing hymns to look good',
        'Church: A friend who whispers and plays during church prayers'
      ],
      pan: { x: 0, y: -16 }
    },
    // Traps (Red Flags)
    {
      id: 'trap_megaphone',
      name: 'Megaphone',
      trait: 'Gossip Trap',
      tag: 'Red Flag',
      isTrap: true,
      quote: 'Red Flag! Tells everyone your secrets and gossips behind your back.'
    },
    {
      id: 'trap_boxing',
      name: 'Boxing Glove',
      trait: 'Bully Trap',
      tag: 'Red Flag',
      isTrap: true,
      quote: 'Red Flag! Uses anger and fighting instead of peace and patience.'
    },
    {
      id: 'trap_gamepad',
      name: 'Game Controller',
      trait: 'Distraction Trap',
      tag: 'Red Flag',
      isTrap: true,
      quote: 'Red Flag! Pulls you away from church, prayer, and studying.'
    }
  ];

  const GOOD_ITEMS = ITEMS.filter(it => !it.isTrap);

  // --- STATE ---
  let selectedItemId = null;
  let packedItems = new Set();
  let lives = 3;
  let bannerTimer = null;

  // Game 2 State
  let currentRound = 0;
  let score = 0;
  let zoomScale = 3.5;
  let hintsLeft = 3;
  let roundAnswered = false;

  // --- DOM ELEMENTS ---
  const landingView = document.getElementById('landingView');
  const game1View = document.getElementById('game1View');
  const game2View = document.getElementById('game2View');

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const teacherButton = document.getElementById('teacherButton');
  const teacherDialog = document.getElementById('teacherDialog');
  const verseDialog = document.getElementById('verseDialog');
  const openVerseBtn = document.getElementById('openVerseBtn');
  const copyButton = document.getElementById('copyButton');
  const gameLink = document.getElementById('gameLink');

  // Game 1 Elements
  const startBackpackBtn = document.getElementById('startBackpackBtn');
  const itemsGrid = document.getElementById('itemsGrid');
  const backpackDropzone = document.getElementById('backpackDropzone');
  const backpackSvgHolder = document.getElementById('backpackSvgHolder');
  const packedItemsTray = document.getElementById('packedItemsTray');
  const backpackCount = document.getElementById('backpackCount');
  const backpackProgressBar = document.getElementById('backpackProgressBar');
  const backpackBanner = document.getElementById('backpackBanner');
  const livesContainer = document.getElementById('livesContainer');
  const resetBackpackBtn = document.getElementById('resetBackpackBtn');
  const backpackWinDialog = document.getElementById('backpackWinDialog');
  const backpackGameOverDialog = document.getElementById('backpackGameOverDialog');
  const retryBackpackBtn = document.getElementById('retryBackpackBtn');
  const winPlayMysteryBtn = document.getElementById('winPlayMysteryBtn');
  const winPackAgainBtn = document.getElementById('winPackAgainBtn');

  // Game 2 Elements
  const startMysteryBtn = document.getElementById('startMysteryBtn');
  const mysteryRoundDisplay = document.getElementById('mysteryRoundDisplay');
  const mysteryScoreDisplay = document.getElementById('mysteryScoreDisplay');
  const mysterySvgHolder = document.getElementById('mysterySvgHolder');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomCostBadge = document.getElementById('zoomCostBadge');
  const zoomLevelText = document.getElementById('zoomLevelText');
  const mysteryFeedback = document.getElementById('mysteryFeedback');
  const mysteryChoicesGrid = document.getElementById('mysteryChoicesGrid');
  const mysteryRevealCard = document.getElementById('mysteryRevealCard');
  const revealTitle = document.getElementById('revealTitle');
  const revealDescription = document.getElementById('revealDescription');
  const mysteryNextBtn = document.getElementById('mysteryNextBtn');
  const mysteryWinDialog = document.getElementById('mysteryWinDialog');
  const finalScoreVal = document.getElementById('finalScoreVal');
  const finalRankBadge = document.getElementById('finalRankBadge');
  const mysteryPlayAgainBtn = document.getElementById('mysteryPlayAgainBtn');
  const mysteryToBackpackBtn = document.getElementById('mysteryToBackpackBtn');

  // Confetti Canvas
  const confettiCanvas = document.getElementById('confettiCanvas');

  // --- UTILS ---
  function shuffle(arr) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  function setView(view) {
    landingView.classList.remove('active-view');
    game1View.classList.remove('active-view');
    game2View.classList.remove('active-view');
    landingView.classList.add('hidden-view');
    game1View.classList.add('hidden-view');
    game2View.classList.add('hidden-view');

    view.classList.remove('hidden-view');
    view.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- CONFETTI CANNON ---
  function fireConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    const width = confettiCanvas.width = window.innerWidth;
    const height = confettiCanvas.height = window.innerHeight;

    const colors = ['#c69049', '#914b38', '#387640', '#fae29c', '#d6edfc', '#e24a42'];
    const particles = Array.from({ length: 90 }, () => ({
      x: width * 0.5 + (Math.random() - 0.5) * 120,
      y: height * 0.4 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() * -14) - 5,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    }));

    let startTime = Date.now();
    function animate() {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.42; // gravity
        p.rotation += p.rotationSpeed;
        if (elapsed > 2000) p.opacity -= 0.016;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (elapsed < 3800 && particles.some(p => p.opacity > 0)) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    requestAnimationFrame(animate);
  }

  // --- GAME 1: PACK THE BACKPACK ---
  function initGame1() {
    selectedItemId = null;
    packedItems.clear();
    lives = 3;
    if (backpackSvgHolder) backpackSvgHolder.innerHTML = SVG_DEFS.backpack;
    updateGame1Stats();
    renderGame1Items();
    setBackpackBanner('Tap or drag an item below into the backpack.', 'neutral');
  }

  function updateGame1Stats() {
    const packedCount = packedItems.size;
    backpackCount.textContent = `${packedCount} / 7 Packed`;
    backpackProgressBar.style.width = `${(packedCount / 7) * 100}%`;

    // Render lives hearts
    livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.className = `heart ${i < lives ? 'active' : 'lost'}`;
      heart.textContent = '♥';
      livesContainer.appendChild(heart);
    }

    // Render packed badges inside backpack
    packedItemsTray.innerHTML = '';
    packedItems.forEach(id => {
      const item = ITEMS.find(it => it.id === id);
      if (!item) return;
      const badge = document.createElement('span');
      badge.className = 'packed-badge';
      badge.innerHTML = `<span class="packed-badge-icon">${SVG_DEFS[item.id] || '✣'}</span><span>${item.name}</span>`;
      packedItemsTray.appendChild(badge);
    });
  }

  function setBackpackBanner(text, type = 'neutral') {
    if (bannerTimer) clearTimeout(bannerTimer);
    backpackBanner.className = `trait-banner ${type === 'green' ? 'green-flag' : type === 'red' ? 'red-flag' : ''}`;
    backpackBanner.querySelector('.banner-icon').textContent = type === 'green' ? '✓' : type === 'red' ? '⚠' : '✣';
    backpackBanner.querySelector('.banner-text').textContent = text;

    if (type !== 'neutral') {
      bannerTimer = setTimeout(() => {
        backpackBanner.className = 'trait-banner';
        backpackBanner.querySelector('.banner-icon').textContent = '✣';
        backpackBanner.querySelector('.banner-text').textContent = 'Tap or drag another item to continue packing!';
      }, 3800);
    }
  }

  function renderGame1Items() {
    itemsGrid.innerHTML = '';
    const shuffledItems = shuffle(ITEMS);

    shuffledItems.forEach(item => {
      const card = document.createElement('div');
      card.className = `item-card ${packedItems.has(item.id) ? 'packed' : ''}`;
      card.dataset.id = item.id;
      card.setAttribute('draggable', !packedItems.has(item.id));
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', packedItems.has(item.id) ? '-1' : '0');
      card.setAttribute('aria-label', `${item.name}: ${item.trait}`);

      card.innerHTML = `
        <div class="item-symbol-wrap" aria-hidden="true">${SVG_DEFS[item.id] || '✣'}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-tag">${item.isTrap ? 'Watch out!' : item.trait}</div>
      `;

      // Click / Tap selection
      card.addEventListener('click', () => {
        if (packedItems.has(item.id)) return;
        if (selectedItemId === item.id) {
          selectedItemId = null;
          card.classList.remove('selected');
          backpackDropzone.classList.remove('target-active');
        } else {
          document.querySelectorAll('.item-card.selected').forEach(c => c.classList.remove('selected'));
          selectedItemId = item.id;
          card.classList.add('selected');
          backpackDropzone.classList.add('target-active');
          playSnap();
        }
      });

      // Desktop HTML5 dragstart
      card.addEventListener('dragstart', (e) => {
        selectedItemId = item.id;
        e.dataTransfer.setData('text/plain', item.id);
        card.classList.add('selected');
        backpackDropzone.classList.add('drag-over');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('selected');
        backpackDropzone.classList.remove('drag-over');
      });

      itemsGrid.appendChild(card);
    });
  }

  function attemptPackItem(itemId) {
    const item = ITEMS.find(it => it.id === itemId);
    if (!item || packedItems.has(item.id)) return;

    if (item.isTrap) {
      // Red Flag trap!
      playBuzzer();
      lives--;
      updateGame1Stats();
      setBackpackBanner(`${item.quote}`, 'red');

      // Visual shake feedback
      backpackDropzone.classList.add('error-shake');
      const card = itemsGrid.querySelector(`[data-id="${item.id}"]`);
      if (card) card.classList.add('bounce-error');

      setTimeout(() => {
        backpackDropzone.classList.remove('error-shake');
        if (card) card.classList.remove('bounce-error');
      }, 500);

      // Check for Game Over
      if (lives <= 0) {
        setTimeout(() => backpackGameOverDialog.showModal(), 600);
      }
    } else {
      // Green Flag success!
      playChime();
      playSnap();
      packedItems.add(item.id);
      updateGame1Stats();
      setBackpackBanner(`Packed ${item.name} (${item.trait}): “${item.quote}”`, 'green');

      const card = itemsGrid.querySelector(`[data-id="${item.id}"]`);
      if (card) {
        card.classList.add('packed');
        card.classList.remove('selected');
        card.setAttribute('draggable', 'false');
      }

      // Check for Win
      if (packedItems.size === GOOD_ITEMS.length) {
        setTimeout(() => {
          playVictory();
          fireConfetti();
          backpackWinDialog.showModal();
        }, 700);
      }
    }

    selectedItemId = null;
    backpackDropzone.classList.remove('target-active', 'drag-over');
  }

  // Backpack Dropzone listeners
  backpackDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    backpackDropzone.classList.add('drag-over');
  });

  backpackDropzone.addEventListener('dragleave', () => {
    backpackDropzone.classList.remove('drag-over');
  });

  backpackDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    backpackDropzone.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain') || selectedItemId;
    if (id) attemptPackItem(id);
  });

  backpackDropzone.addEventListener('click', () => {
    if (selectedItemId) {
      attemptPackItem(selectedItemId);
    }
  });

  // --- GAME 2: ZOOM-IN MYSTERY ---
  function initGame2() {
    currentRound = 0;
    score = 0;
    startMysteryRound(0);
  }

  function startMysteryRound(roundIdx) {
    currentRound = roundIdx;
    roundAnswered = false;
    zoomScale = 3.5;
    hintsLeft = 3;

    mysteryRoundDisplay.textContent = `${roundIdx + 1} of ${GOOD_ITEMS.length}`;
    mysteryScoreDisplay.textContent = `${score} pts`;
    zoomLevelText.textContent = '350%';
    zoomOutBtn.disabled = false;
    zoomCostBadge.textContent = '3 hints left';

    mysteryFeedback.className = 'mystery-feedback';
    mysteryFeedback.textContent = 'Select the matching object and friendship trait below:';
    mysteryRevealCard.classList.add('hidden');

    const item = GOOD_ITEMS[roundIdx];
    mysterySvgHolder.innerHTML = SVG_DEFS[item.id] || '';

    // Apply 350% magnification zoom and panning offset
    const pan = item.pan || { x: 0, y: 0 };
    mysterySvgHolder.style.setProperty('--zoom-scale', zoomScale);
    mysterySvgHolder.style.setProperty('--pan-x', `${pan.x}px`);
    mysterySvgHolder.style.setProperty('--pan-y', `${pan.y}px`);

    renderMysteryChoices(item);
  }

  function renderMysteryChoices(currentItem) {
    mysteryChoicesGrid.innerHTML = '';

    // 1 correct match + 3 distractors
    const choices = [
      { text: currentItem.mysteryMatch, isCorrect: true }
    ];

    // Pick 3 distractors
    const itemDistractors = shuffle(currentItem.distractors || []).slice(0, 2);
    itemDistractors.forEach(d => choices.push({ text: d, isCorrect: false }));

    // If still need 1 more distractor, grab from another item
    if (choices.length < 4) {
      const otherItem = GOOD_ITEMS.find(it => it.id !== currentItem.id);
      if (otherItem && otherItem.distractors) {
        choices.push({ text: otherItem.distractors[0], isCorrect: false });
      }
    }

    const shuffledChoices = shuffle(choices);
    const letters = ['A', 'B', 'C', 'D'];

    shuffledChoices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-card';
      btn.innerHTML = `
        <span class="choice-marker" aria-hidden="true">${letters[idx]}</span>
        <div class="choice-copy">
          <strong>${choice.text.split(':')[0] || ''}</strong>
          <span>${choice.text.includes(':') ? choice.text.substring(choice.text.indexOf(':') + 1).trim() : choice.text}</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        if (roundAnswered) return;
        handleMysteryChoice(choice, btn, currentItem);
      });

      mysteryChoicesGrid.appendChild(btn);
    });
  }

  function handleMysteryChoice(choice, btn, item) {
    if (choice.isCorrect) {
      roundAnswered = true;
      btn.classList.add('is-correct');
      playChime();

      // Zoom out to 100% full reveal!
      mysterySvgHolder.style.setProperty('--zoom-scale', '1.0');
      mysterySvgHolder.style.setProperty('--pan-x', '0px');
      mysterySvgHolder.style.setProperty('--pan-y', '0px');
      zoomLevelText.textContent = '100% (Revealed)';
      zoomOutBtn.disabled = true;

      // Calculate round score
      const hintsUsed = 3 - hintsLeft;
      const roundScore = Math.max(40, 100 - (hintsUsed * 20));
      score += roundScore;
      mysteryScoreDisplay.textContent = `${score} pts`;

      mysteryFeedback.className = 'mystery-feedback';
      mysteryFeedback.textContent = `Correct! +${roundScore} points awarded.`;

      // Disable other choices
      mysteryChoicesGrid.querySelectorAll('.choice-card').forEach(c => {
        if (c !== btn) c.style.opacity = '0.5';
      });

      // Show Reveal Card
      revealTitle.textContent = `${item.name}: ${item.trait}`;
      revealDescription.textContent = item.quote;
      mysteryNextBtn.innerHTML = (currentRound === GOOD_ITEMS.length - 1)
        ? 'See Final Results <span aria-hidden="true">🏆</span>'
        : 'Next Round <span aria-hidden="true">→</span>';
      mysteryRevealCard.classList.remove('hidden');
    } else {
      playBuzzer();
      btn.classList.add('is-wrong');
      mysteryFeedback.className = 'mystery-feedback';
      mysteryFeedback.textContent = 'Not quite! Look closer or use a zoom hint, then try again.';
      setTimeout(() => btn.classList.remove('is-wrong'), 500);
    }
  }

  // Zoom Out Hint Button
  zoomOutBtn.addEventListener('click', () => {
    if (roundAnswered || hintsLeft <= 0) return;
    hintsLeft--;
    zoomScale = Math.max(1.8, zoomScale - 0.55);
    playSnap();

    mysterySvgHolder.style.setProperty('--zoom-scale', zoomScale);
    zoomLevelText.textContent = `${Math.round(zoomScale * 100)}%`;
    zoomCostBadge.textContent = `${hintsLeft} hint${hintsLeft === 1 ? '' : 's'} left (-20 pts)`;

    if (hintsLeft === 0) {
      zoomOutBtn.disabled = true;
      zoomCostBadge.textContent = 'No hints left';
    }
  });

  // Next Round Button
  mysteryNextBtn.addEventListener('click', () => {
    if (currentRound < GOOD_ITEMS.length - 1) {
      startMysteryRound(currentRound + 1);
    } else {
      // Completed all 7 rounds
      playVictory();
      fireConfetti();
      finalScoreVal.textContent = score;

      if (score >= 600) {
        finalRankBadge.textContent = 'GOLD DETECTIVE · TRUE FRIEND SHELTER!';
      } else if (score >= 450) {
        finalRankBadge.textContent = 'FAITHFUL SCOUT · GREAT DEDUCTION!';
      } else {
        finalRankBadge.textContent = 'LEARNING FRIEND · KEEP GROWING IN WISDOM!';
      }

      mysteryWinDialog.showModal();
    }
  });

  // --- NAVIGATION & DIALOG HOOKS ---
  startBackpackBtn.addEventListener('click', () => {
    setView(game1View);
    initGame1();
  });

  startMysteryBtn.addEventListener('click', () => {
    setView(game2View);
    initGame2();
  });

  document.querySelectorAll('[data-action="to-menu"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
      setView(landingView);
    });
  });

  document.querySelectorAll('[data-action="switch-to-game2"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setView(game2View);
      initGame2();
    });
  });

  resetBackpackBtn.addEventListener('click', initGame1);
  retryBackpackBtn.addEventListener('click', () => {
    backpackGameOverDialog.close();
    initGame1();
  });
  winPackAgainBtn.addEventListener('click', () => {
    backpackWinDialog.close();
    initGame1();
  });
  winPlayMysteryBtn.addEventListener('click', () => {
    backpackWinDialog.close();
    setView(game2View);
    initGame2();
  });

  mysteryPlayAgainBtn.addEventListener('click', () => {
    mysteryWinDialog.close();
    initGame2();
  });
  mysteryToBackpackBtn.addEventListener('click', () => {
    mysteryWinDialog.close();
    setView(game1View);
    initGame1();
  });

  // Sound Toggle Button
  soundToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    soundIcon.textContent = isMuted ? '🔇' : '🔊';
    try { localStorage.setItem('sundaySchoolAudioMuted', isMuted); } catch {}
  });
  if (isMuted) soundIcon.textContent = '🔇';

  // Teacher Dialog
  teacherButton.addEventListener('click', () => {
    const fullUrl = new URL('./true-friend.html', location.href).href;
    gameLink.href = fullUrl;
    gameLink.textContent = fullUrl;
    copyButton.textContent = 'Copy game link';
    teacherDialog.showModal();
  });

  copyButton.addEventListener('click', async () => {
    const fullUrl = new URL('./true-friend.html', location.href).href;
    try {
      await navigator.clipboard.writeText(fullUrl);
      copyButton.textContent = 'Copied!';
    } catch {
      copyButton.textContent = 'Use link above';
    }
  });

  // Memory Verse Dialog
  if (openVerseBtn) {
    openVerseBtn.addEventListener('click', () => verseDialog.showModal());
  }

  // Dialog Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dialog = e.target.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });

  // Initialize
  initGame1();
})();
