import { IngredientInfo, IngredientAnalysis, IngredientRating } from './ingredientAnalysis'

// ── GHS H-code buckets ─────────────────────────────────────────────────────
const H_BAD = new Set([
  'H340', 'H341',              // Mutagenic
  'H350', 'H351',              // Carcinogenic
  'H360', 'H361', 'H362',      // Reproductive toxicity
  'H370', 'H371', 'H372', 'H373', // STOT
  'H300', 'H301',              // Fatal/toxic if swallowed
  'H310', 'H311',              // Fatal/toxic — skin contact
  'H330', 'H331',              // Fatal/toxic — inhalation
  'H304',                      // Aspiration hazard
  'H314',                      // Severe skin burns
  'H318',                      // Serious eye damage
])

const H_MODERATE = new Set([
  'H302', 'H303',              // Harmful if swallowed
  'H312', 'H313',              // Harmful — skin contact
  'H315', 'H316',              // Skin irritation
  'H317',                      // Allergic skin reaction
  'H319', 'H320',              // Eye irritation
  'H332', 'H333',              // Harmful if inhaled
  'H335',                      // Respiratory irritation
  'H336',                      // Drowsiness / dizziness
  'H400', 'H410', 'H411', 'H412', // Aquatic toxicity
  'H420',                      // Ozone / environment hazard
])

// French descriptions for common H-codes
const H_LABELS: Record<string, string> = {
  H302: 'Nocif en cas d\'ingestion',
  H315: 'Irritant cutané',
  H317: 'Peut provoquer une allergie cutanée',
  H318: 'Provoque de graves lésions oculaires',
  H319: 'Provoque une irritation oculaire',
  H332: 'Nocif par inhalation',
  H335: 'Peut irriter les voies respiratoires',
  H340: 'Peut induire des anomalies génétiques',
  H350: 'Susceptible de provoquer le cancer',
  H360: 'Peut nuire à la fertilité ou au fœtus',
  H370: 'Risque avéré d\'effets sur les organes',
  H373: 'Risque présumé d\'effets sur les organes à long terme',
  H400: 'Très toxique pour les organismes aquatiques',
  H410: 'Très toxique pour les organismes aquatiques',
  H411: 'Toxique pour les organismes aquatiques',
  H412: 'Nocif pour les organismes aquatiques',
  H314: 'Provoque des brûlures cutanées et des lésions oculaires',
}

function parseGHS(text: string): { hStatements: string[]; signalWord?: string } {
  // Extract all H-codes in the valid GHS range (H200–H420)
  const allCodes = [...text.matchAll(/\bH(\d{3})\b/g)]
    .map(m => `H${m[1]}`)
    .filter(h => { const n = parseInt(h.slice(1)); return n >= 200 && n <= 420 })
  const hStatements = [...new Set(allCodes)]

  // Signal word appears as {"Name":"Signal",...,"String":"Danger|Warning"}
  const signalMatch = text.match(/"Signal"[\s\S]{0,600}?"String":"(Danger|Warning)"/)
  const signalWord = signalMatch?.[1]

  return { hStatements, signalWord }
}

function rateGHS(hStatements: string[], signalWord?: string): { rating: IngredientRating; reason: string } {
  const badHits   = hStatements.filter(h => H_BAD.has(h))
  const modHits   = hStatements.filter(h => H_MODERATE.has(h))

  const describe = (codes: string[]) =>
    codes.map(c => H_LABELS[c] ?? c).join(', ')

  if (badHits.length > 0)
    return { rating: 'bad', reason: describe(badHits) }
  if (modHits.length > 0)
    return { rating: 'moderate', reason: describe(modHits) }
  if (signalWord === 'Danger')
    return { rating: 'moderate', reason: 'Signalement danger (GHS)' }
  if (signalWord === 'Warning')
    return { rating: 'moderate', reason: 'Signalement avertissement (GHS)' }
  if (hStatements.length === 0)
    return { rating: 'good', reason: 'Aucun danger GHS identifié' }
  return { rating: 'good', reason: 'Profil GHS favorable' }
}

// ── PubChem lookup (two-step: name → CID → GHS) ───────────────────────────
async function pubchemLookup(name: string): Promise<{ rating: IngredientRating; reason: string } | null> {
  // Step 1: resolve name → CID
  let cid: number | null = null
  try {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`,
      { next: { revalidate: 86400 } }
    )
    if (res.ok) {
      const json = await res.json()
      cid = json.IdentifierList?.CID?.[0] ?? null
    }
  } catch { return null }

  if (!cid) return null

  // Step 2: fetch GHS classification
  try {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return { rating: 'good', reason: 'Aucune classification GHS' }

    const { hStatements, signalWord } = parseGHS(await res.text())
    return rateGHS(hStatements, signalWord)
  } catch { return null }
}

// ── Ingredient text parsing (shared with sync version) ────────────────────
function normalise(raw: string): string {
  return raw.toLowerCase()
    .replace(/\*/g, '').replace(/\+/g, '')
    .replace(/\d+%/g, '').replace(/\s+/g, ' ').trim()
}

function parseIngredients(text: string): string[] {
  return text
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .split(/[,;]/)
    .map(normalise)
    .filter(s => s.length > 1)
}

function scoreLabel(s: number) {
  if (s >= 80) return 'Excellent'
  if (s >= 60) return 'Bon'
  if (s >= 40) return 'Moyen'
  if (s >= 20) return 'Mauvais'
  return 'Très mauvais'
}

// ── Public API ─────────────────────────────────────────────────────────────
export async function analyseIngredients(ingredientsText: string): Promise<IngredientAnalysis> {
  const parsed = parseIngredients(ingredientsText)

  // Fetch all ingredients in parallel (results cached 24 h by Next.js)
  const results = await Promise.all(
    parsed.map(async name => ({ name, result: await pubchemLookup(name) }))
  )

  const bad: IngredientInfo[]      = []
  const moderate: IngredientInfo[] = []
  const good: IngredientInfo[]     = []
  const unknown: string[]          = []

  for (const { name, result } of results) {
    if (!result) { unknown.push(name); continue }
    const info: IngredientInfo = { name, rating: result.rating, reason: result.reason }
    if (result.rating === 'bad')          bad.push(info)
    else if (result.rating === 'moderate') moderate.push(info)
    else                                   good.push(info)
  }

  const score = Math.max(0, Math.min(100, 100 - bad.length * 15 - moderate.length * 5))
  return { bad, moderate, good, unknown, score, scoreLabel: scoreLabel(score) }
}
