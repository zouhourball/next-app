import { BeautyFactProductType } from '@/app/types'

function detectCategory(product: BeautyFactProductType): string {
  const text = `${product.product_name} ${product.categories}`.toLowerCase()
  if (text.match(/mascara/)) return 'mascara'
  if (text.match(/rouge.lèvres|lipstick|lip gloss|gloss|lip/)) return 'lipstick'
  if (text.match(/fond de teint|foundation/)) return 'foundation'
  if (text.match(/ombre|eyeshadow|palette|fard.paupières/)) return 'eyeshadow'
  if (text.match(/blush|fard.joues/)) return 'blush'
  if (text.match(/parfum|fragrance|cologne|eau de/)) return 'perfume'
  if (text.match(/shampoo|shampoing/)) return 'shampoo'
  if (text.match(/solaire|sunscreen|spf|écran|protection solaire/)) return 'sunscreen'
  if (text.match(/vernis|nail polish|ongles/)) return 'nail'
  if (text.match(/déodorant|deodorant|antitranspirant/)) return 'deodorant'
  if (text.match(/sérum|serum|contour|yeux|eye/)) return 'serum'
  if (text.match(/crème|moistur|hydrat|soin|lotion/)) return 'cream'
  if (text.match(/highlighter|illuminateur|enlumineur/)) return 'highlighter'
  if (text.match(/bronzer|bronzant|autobronzant/)) return 'bronzer'
  if (text.match(/eye.?liner|liner/)) return 'eyeliner'
  if (text.match(/correcteur|concealer|anti.cernes/)) return 'concealer'
  return 'default'
}

// ── Individual SVG illustrations ─────────────────────────────────────────────

function Lipstick() {
  return (
    <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="68" width="30" height="36" rx="5" fill="#C2185B"/>
      <rect x="28" y="62" width="24" height="10" rx="2" fill="#E91E63"/>
      <rect x="28" y="45" width="24" height="20" rx="3" fill="#F8BBD9"/>
      <path d="M28 45 Q40 12 52 45 Z" fill="#FF4081"/>
      <ellipse cx="46" cy="28" rx="3" ry="9" fill="rgba(255,255,255,0.38)" transform="rotate(-12 46 28)"/>
    </svg>
  )
}

function Mascara() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="55" width="20" height="55" rx="6" fill="#212121"/>
      <rect x="33" y="48" width="14" height="12" rx="3" fill="#424242"/>
      {/* wand */}
      <rect x="38" y="10" width="4" height="38" rx="2" fill="#757575"/>
      {/* bristles */}
      {[14,18,22,26,30,34,38].map(y => (
        <g key={y}>
          <line x1="38" y1={y} x2="32" y2={y - 1} stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="42" y1={y} x2="48" y2={y - 1} stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      ))}
    </svg>
  )
}

function Foundation() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="50" width="36" height="60" rx="8" fill="#D4A373"/>
      {/* pump neck */}
      <rect x="36" y="18" width="8" height="36" rx="4" fill="#BCAAA4"/>
      {/* pump head */}
      <rect x="28" y="14" width="24" height="8" rx="4" fill="#A1887F"/>
      {/* label */}
      <rect x="27" y="65" width="26" height="18" rx="3" fill="rgba(255,255,255,0.3)"/>
      {/* shine */}
      <ellipse cx="54" cy="72" rx="3" ry="12" fill="rgba(255,255,255,0.2)"/>
    </svg>
  )
}

function Eyeshadow() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="50" rx="8" fill="#7B1FA2"/>
      <rect x="10" y="20" width="80" height="12" rx="8" fill="#9C27B0"/>
      {/* shades */}
      {[
        { x: 22, c: '#CE93D8' }, { x: 42, c: '#E91E63' },
        { x: 62, c: '#FF8A65' }, { x: 22, c: '#80DEEA', cy: 58 },
        { x: 42, c: '#A5D6A7', cy: 58 }, { x: 62, c: '#FFD54F', cy: 58 },
      ].map((s, i) => (
        <circle key={i} cx={s.x} cy={(s as {cy?: number}).cy ?? 42} r="10" fill={s.c}/>
      ))}
    </svg>
  )
}

function Blush() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="15" width="80" height="55" rx="10" fill="#F48FB1"/>
      <rect x="10" y="15" width="80" height="10" rx="10" fill="#EC407A"/>
      {/* powder circle */}
      <circle cx="50" cy="47" r="22" fill="#F8BBD9"/>
      <circle cx="50" cy="47" r="16" fill="#F48FB1" opacity="0.6"/>
      {/* highlight */}
      <ellipse cx="42" cy="40" rx="5" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-20 42 40)"/>
    </svg>
  )
}

function Perfume() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* cap */}
      <rect x="28" y="12" width="24" height="16" rx="4" fill="#FFC107"/>
      {/* neck */}
      <rect x="34" y="26" width="12" height="10" rx="2" fill="#FFD54F"/>
      {/* body */}
      <rect x="16" y="34" width="48" height="72" rx="10" fill="#FFB300"/>
      {/* liquid */}
      <rect x="20" y="38" width="40" height="64" rx="8" fill="#FFD740" opacity="0.5"/>
      {/* label */}
      <rect x="21" y="58" width="38" height="24" rx="4" fill="rgba(255,255,255,0.35)"/>
      {/* shine */}
      <ellipse cx="58" cy="65" rx="3" ry="18" fill="rgba(255,255,255,0.2)"/>
    </svg>
  )
}

function Shampoo() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="30" width="44" height="82" rx="10" fill="#26C6DA"/>
      {/* cap */}
      <rect x="28" y="14" width="24" height="20" rx="6" fill="#00ACC1"/>
      {/* cap hole */}
      <circle cx="40" cy="16" r="4" fill="#006064"/>
      {/* label */}
      <rect x="22" y="55" width="36" height="30" rx="5" fill="rgba(255,255,255,0.3)"/>
      {/* bubbles */}
      <circle cx="56" cy="30" r="5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="64" cy="40" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="60" cy="22" r="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}

function Sunscreen() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* tube */}
      <rect x="18" y="28" width="44" height="86" rx="10" fill="#FF8F00"/>
      {/* fold at bottom */}
      <rect x="18" y="96" width="44" height="18" rx="6" fill="#E65100"/>
      {/* cap */}
      <rect x="25" y="14" width="30" height="18" rx="5" fill="#FFB300"/>
      {/* sun icon */}
      <circle cx="40" cy="62" r="10" fill="rgba(255,255,255,0.4)"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <line key={i}
          x1={40 + Math.cos(deg * Math.PI/180) * 13}
          y1={62 + Math.sin(deg * Math.PI/180) * 13}
          x2={40 + Math.cos(deg * Math.PI/180) * 17}
          y2={62 + Math.sin(deg * Math.PI/180) * 17}
          stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

function NailPolish() {
  return (
    <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* cap */}
      <rect x="10" y="8" width="40" height="20" rx="6" fill="#B71C1C"/>
      {/* neck */}
      <rect x="22" y="26" width="16" height="14" rx="3" fill="#C62828"/>
      {/* bottle */}
      <rect x="12" y="38" width="36" height="68" rx="8" fill="#E53935"/>
      {/* liquid depth */}
      <rect x="16" y="55" width="28" height="47" rx="5" fill="#EF9A9A" opacity="0.4"/>
      {/* shine */}
      <ellipse cx="42" cy="68" rx="3" ry="16" fill="rgba(255,255,255,0.25)"/>
      {/* brush */}
      <rect x="28" y="98" width="4" height="20" rx="2" fill="#795548"/>
    </svg>
  )
}

function Deodorant() {
  return (
    <svg viewBox="0 0 70 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="20" width="46" height="90" rx="12" fill="#E3F2FD"/>
      {/* band */}
      <rect x="12" y="70" width="46" height="15" fill="#90CAF9"/>
      {/* cap */}
      <rect x="12" y="8" width="46" height="16" rx="6" fill="#64B5F6"/>
      {/* label */}
      <rect x="17" y="28" width="36" height="36" rx="5" fill="rgba(100,181,246,0.3)"/>
      {/* snowflake dots */}
      <circle cx="35" cy="46" r="3" fill="#42A5F5"/>
      <circle cx="25" cy="40" r="2" fill="#90CAF9"/>
      <circle cx="45" cy="40" r="2" fill="#90CAF9"/>
    </svg>
  )
}

function Serum() {
  return (
    <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* bulb dropper */}
      <ellipse cx="30" cy="18" rx="14" ry="16" fill="#FFA000"/>
      {/* dropper tube */}
      <rect x="27" y="30" width="6" height="20" rx="3" fill="#FF8F00"/>
      {/* bottle neck */}
      <rect x="22" y="48" width="16" height="10" rx="3" fill="#E65100"/>
      {/* bottle body */}
      <rect x="12" y="55" width="36" height="58" rx="9" fill="#FFB300"/>
      {/* liquid */}
      <rect x="16" y="68" width="28" height="41" rx="6" fill="#FFD740" opacity="0.45"/>
      {/* shine */}
      <ellipse cx="42" cy="80" rx="3" ry="14" fill="rgba(255,255,255,0.25)"/>
    </svg>
  )
}

function Cream() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* jar body */}
      <rect x="10" y="30" width="80" height="45" rx="8" fill="#F3E5F5"/>
      {/* lid */}
      <rect x="10" y="18" width="80" height="16" rx="8" fill="#CE93D8"/>
      {/* label */}
      <rect x="18" y="38" width="64" height="28" rx="5" fill="rgba(255,255,255,0.4)"/>
      {/* cream swirl */}
      <path d="M32 52 Q50 42 68 52 Q50 62 32 52 Z" fill="rgba(206,147,216,0.5)"/>
    </svg>
  )
}

function Highlighter() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="18" width="80" height="55" rx="10" fill="#FFF9C4"/>
      <rect x="10" y="18" width="80" height="10" rx="10" fill="#FFD54F"/>
      <circle cx="50" cy="50" r="22" fill="#FFF59D"/>
      <circle cx="50" cy="50" r="14" fill="#FFD740" opacity="0.55"/>
      {/* sparkles */}
      {[[36,36],[64,36],[36,64],[64,64],[50,36]].map(([x,y],i) => (
        <text key={i} x={x-4} y={y+4} fontSize="10" fill="#FFA000">✦</text>
      ))}
    </svg>
  )
}

function Bronzer() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="18" width="80" height="55" rx="10" fill="#D7CCC8"/>
      <rect x="10" y="18" width="80" height="10" rx="10" fill="#A1887F"/>
      <circle cx="50" cy="50" r="22" fill="#BCAAA4"/>
      <circle cx="50" cy="50" r="14" fill="#8D6E63" opacity="0.5"/>
      <text x="38" y="55" fontSize="16" fill="#6D4C41">☀️</text>
    </svg>
  )
}

function Eyeliner() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="10" width="20" height="70" rx="8" fill="#212121"/>
      <rect x="33" y="10" width="14" height="16" rx="5" fill="#424242"/>
      {/* tip */}
      <path d="M35 80 L40 105 L45 80 Z" fill="#212121"/>
      <ellipse cx="46" cy="45" rx="2" ry="14" fill="rgba(255,255,255,0.1)"/>
    </svg>
  )
}

function Concealer() {
  return (
    <svg viewBox="0 0 70 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="30" width="40" height="80" rx="8" fill="#FFCCBC"/>
      <rect x="18" y="30" width="34" height="12" rx="4" fill="#FFAB91"/>
      {/* applicator */}
      <rect x="28" y="10" width="14" height="22" rx="5" fill="#FF8A65"/>
      <ellipse cx="35" cy="32" rx="7" ry="4" fill="#FFCCBC"/>
      <rect x="22" y="50" width="26" height="20" rx="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}

function Default() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="22" y="55" fontSize="52" fill="#F48FB1">✿</text>
      <text x="62" y="32" fontSize="22" fill="#CE93D8">✦</text>
      <text x="12" y="30" fontSize="18" fill="#FFD740">✦</text>
      <text x="70" y="75" fontSize="16" fill="#80DEEA">✦</text>
    </svg>
  )
}

// ── Category → background colour mapping ─────────────────────────────────────
const bgColors: Record<string, string> = {
  lipstick:    '#FCE4EC',
  mascara:     '#ECEFF1',
  foundation:  '#FFF3E0',
  eyeshadow:   '#F3E5F5',
  blush:       '#FCE4EC',
  perfume:     '#FFFDE7',
  shampoo:     '#E0F7FA',
  sunscreen:   '#FFF8E1',
  nail:        '#FFEBEE',
  deodorant:   '#E3F2FD',
  serum:       '#FFF8E1',
  cream:       '#F3E5F5',
  highlighter: '#FFFDE7',
  bronzer:     '#EFEBE9',
  eyeliner:    '#F5F5F5',
  concealer:   '#FBE9E7',
  default:     '#FCE4EC',
}

const svgMap: Record<string, React.ReactNode> = {
  lipstick:    <Lipstick />,
  mascara:     <Mascara />,
  foundation:  <Foundation />,
  eyeshadow:   <Eyeshadow />,
  blush:       <Blush />,
  perfume:     <Perfume />,
  shampoo:     <Shampoo />,
  sunscreen:   <Sunscreen />,
  nail:        <NailPolish />,
  deodorant:   <Deodorant />,
  serum:       <Serum />,
  cream:       <Cream />,
  highlighter: <Highlighter />,
  bronzer:     <Bronzer />,
  eyeliner:    <Eyeliner />,
  concealer:   <Concealer />,
  default:     <Default />,
}

interface Props {
  product: BeautyFactProductType
  height?: number
}

export default function ProductPlaceholder({ product, height = 180 }: Props) {
  const category = detectCategory(product)
  const bg = bgColors[category] ?? bgColors.default
  const svg = svgMap[category] ?? svgMap.default

  return (
    <div style={{
      height,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px 8px 0 0',
    }}>
      <div style={{ width: height * 0.6, height: height * 0.75 }}>
        {svg}
      </div>
    </div>
  )
}
