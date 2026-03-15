export type IngredientRating = 'bad' | 'moderate' | 'good'

export interface IngredientInfo {
  name: string
  rating: IngredientRating
  reason: string
}

export interface IngredientAnalysis {
  bad: IngredientInfo[]
  moderate: IngredientInfo[]
  good: IngredientInfo[]
  unknown: string[]
  score: number // 0–100, higher = safer
  scoreLabel: string
}

// INCI name (lowercase) → rating + reason in French
const db: Record<string, { rating: IngredientRating; reason: string }> = {
  // ─── BAD ─────────────────────────────────────────────────────────────────
  'methylparaben':               { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'ethylparaben':                { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'propylparaben':               { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'butylparaben':                { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'isobutylparaben':             { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'isopropylparaben':            { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'sodium lauryl sulfate':       { rating: 'bad', reason: 'Irritant cutané fort' },
  'ammonium lauryl sulfate':     { rating: 'bad', reason: 'Irritant cutané fort' },
  'formaldehyde':                { rating: 'bad', reason: 'Cancérigène avéré' },
  'dmdm hydantoin':              { rating: 'bad', reason: 'Libérateur de formaldéhyde' },
  'imidazolidinyl urea':         { rating: 'bad', reason: 'Libérateur de formaldéhyde' },
  'diazolidinyl urea':           { rating: 'bad', reason: 'Libérateur de formaldéhyde' },
  'quaternium-15':               { rating: 'bad', reason: 'Libérateur de formaldéhyde' },
  'bronopol':                    { rating: 'bad', reason: 'Libérateur de formaldéhyde' },
  'triclosan':                   { rating: 'bad', reason: 'Perturbateur endocrinien, nocif pour l\'environnement' },
  'triclocarban':                { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'bha':                         { rating: 'bad', reason: 'Perturbateur endocrinien possible, cancérigène suspecté' },
  'bht':                         { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'hydroquinone':                { rating: 'bad', reason: 'Cancérigène suspecté, irritant cutané' },
  'resorcinol':                  { rating: 'bad', reason: 'Perturbateur endocrinien, irritant' },
  'coal tar':                    { rating: 'bad', reason: 'Cancérigène avéré' },
  'dibutyl phthalate':           { rating: 'bad', reason: 'Perturbateur endocrinien' },
  'diethyl phthalate':           { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'dimethyl phthalate':          { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'lead acetate':                { rating: 'bad', reason: 'Toxique, métaux lourds' },
  'mercury':                     { rating: 'bad', reason: 'Toxique, métaux lourds' },
  'thimerosal':                  { rating: 'bad', reason: 'Contient du mercure' },
  'oxybenzone':                  { rating: 'bad', reason: 'Perturbateur endocrinien, nocif pour les coraux' },
  'benzophenone':                { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'homosalate':                  { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'octinoxate':                  { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' },
  'p-phenylenediamine':          { rating: 'bad', reason: 'Allergène fort, cancérigène suspecté' },
  'nitro musks':                 { rating: 'bad', reason: 'Perturbateur endocrinien, cancérigène suspecté' },
  'polycyclic musks':            { rating: 'bad', reason: 'Bioaccumulable, perturbateur suspecté' },
  'styrene':                     { rating: 'bad', reason: 'Cancérigène possible' },
  'talc':                        { rating: 'bad', reason: 'Cancérigène suspecté (asbestiforme)' },
  'petroleum':                   { rating: 'bad', reason: 'Dérivé pétrochimique, peut contenir des impuretés cancérigènes' },

  // ─── MODERATE ─────────────────────────────────────────────────────────────
  'sodium laureth sulfate':      { rating: 'moderate', reason: 'Irritant potentiel à haute concentration' },
  'alcohol denat':               { rating: 'moderate', reason: 'Peut assécher et irriter les peaux sensibles' },
  'dimethicone':                 { rating: 'moderate', reason: 'Silicone occlusif, non biodégradable' },
  'cyclomethicone':              { rating: 'moderate', reason: 'Silicone volatil, persistant dans l\'environnement' },
  'cyclopentasiloxane':          { rating: 'moderate', reason: 'Silicone persistant dans l\'environnement' },
  'cyclotetrasiloxane':          { rating: 'moderate', reason: 'Silicone persistant dans l\'environnement' },
  'paraffinum liquidum':         { rating: 'moderate', reason: 'Dérivé pétrochimique, occlusif' },
  'mineral oil':                 { rating: 'moderate', reason: 'Dérivé pétrochimique, occlusif' },
  'petrolatum':                  { rating: 'moderate', reason: 'Dérivé pétrochimique, occlusif' },
  'parfum':                      { rating: 'moderate', reason: 'Mélange de composés, potentiellement allergène' },
  'fragrance':                   { rating: 'moderate', reason: 'Mélange de composés, potentiellement allergène' },
  'phenoxyethanol':              { rating: 'moderate', reason: 'Conservateur, peut irriter à forte dose' },
  'methylisothiazolinone':       { rating: 'moderate', reason: 'Conservateur allergisant, interdit dans les produits sans rinçage' },
  'methylchloroisothiazolinone': { rating: 'moderate', reason: 'Conservateur allergisant' },
  'sodium benzoate':             { rating: 'moderate', reason: 'Conservateur, peut former du benzène en présence de vitamine C' },
  'aluminum chlorohydrate':      { rating: 'moderate', reason: 'Suspicion de lien avec certaines pathologies' },
  'aluminum zirconium':          { rating: 'moderate', reason: 'Suspicion de lien avec certaines pathologies' },
  'triethanolamine':             { rating: 'moderate', reason: 'Peut former des nitrosamines cancérigènes' },
  'diethanolamine':              { rating: 'moderate', reason: 'Peut former des nitrosamines cancérigènes' },
  'peg':                         { rating: 'moderate', reason: 'Dérivé pétrochimique, peut véhiculer des contaminants' },
  'propylene glycol':            { rating: 'moderate', reason: 'Irritant à haute concentration' },
  'butylene glycol':             { rating: 'moderate', reason: 'Irritant potentiel à haute concentration' },
  'sodium hydroxide':            { rating: 'moderate', reason: 'Régulateur de pH, caustique à haute concentration' },

  // ─── GOOD ─────────────────────────────────────────────────────────────────
  'aqua':                        { rating: 'good', reason: 'Eau, base inoffensive' },
  'water':                       { rating: 'good', reason: 'Eau, base inoffensive' },
  'glycerin':                    { rating: 'good', reason: 'Hydratant doux et efficace' },
  'glycerine':                   { rating: 'good', reason: 'Hydratant doux et efficace' },
  'glycerol':                    { rating: 'good', reason: 'Hydratant doux et efficace' },
  'hyaluronic acid':             { rating: 'good', reason: 'Hydratation intense, naturellement présent dans la peau' },
  'sodium hyaluronate':          { rating: 'good', reason: 'Hydratation intense, acide hyaluronique' },
  'niacinamide':                 { rating: 'good', reason: 'Vitamine B3 — anti-taches, pores, éclat' },
  'ascorbic acid':               { rating: 'good', reason: 'Vitamine C — antioxydant, éclat' },
  'ascorbyl glucoside':          { rating: 'good', reason: 'Vitamine C stable — antioxydant, éclat' },
  'sodium ascorbyl phosphate':   { rating: 'good', reason: 'Vitamine C stable — antioxydant' },
  'tocopherol':                  { rating: 'good', reason: 'Vitamine E — antioxydant, protecteur cutané' },
  'tocopheryl acetate':          { rating: 'good', reason: 'Vitamine E stable — antioxydant' },
  'retinol':                     { rating: 'good', reason: 'Vitamine A — anti-âge reconnu' },
  'retinyl palmitate':           { rating: 'good', reason: 'Vitamine A — anti-âge' },
  'panthenol':                   { rating: 'good', reason: 'Provitamine B5 — cicatrisant, hydratant' },
  'aloe barbadensis':            { rating: 'good', reason: 'Aloe vera — apaisant, hydratant naturel' },
  'aloe vera':                   { rating: 'good', reason: 'Apaisant, hydratant naturel' },
  'squalane':                    { rating: 'good', reason: 'Émollient naturel, non comédogène' },
  'ceramide':                    { rating: 'good', reason: 'Renforce la barrière cutanée' },
  'ceramide np':                 { rating: 'good', reason: 'Renforce la barrière cutanée' },
  'ceramide ap':                 { rating: 'good', reason: 'Renforce la barrière cutanée' },
  'salicylic acid':              { rating: 'good', reason: 'BHA — exfoliant, anti-acné' },
  'glycolic acid':               { rating: 'good', reason: 'AHA — exfoliant, anti-âge' },
  'lactic acid':                 { rating: 'good', reason: 'AHA doux — exfoliant, hydratant' },
  'zinc oxide':                  { rating: 'good', reason: 'Filtre solaire minéral, apaisant' },
  'titanium dioxide':            { rating: 'good', reason: 'Filtre solaire minéral physique' },
  'centella asiatica':           { rating: 'good', reason: 'Cicatrisant, apaisant — "tiger grass"' },
  'camellia sinensis':           { rating: 'good', reason: 'Thé vert — antioxydant puissant' },
  'argania spinosa':             { rating: 'good', reason: 'Huile d\'argan — nourrissante, réparatrice' },
  'rosa canina':                 { rating: 'good', reason: 'Huile de rose musquée — régénérante' },
  'simmondsia chinensis':        { rating: 'good', reason: 'Huile de jojoba — équilibrante' },
  'helianthus annuus':           { rating: 'good', reason: 'Huile de tournesol — émolliente' },
  'butyrospermum parkii':        { rating: 'good', reason: 'Beurre de karité — nourrissant' },
  'hydrolyzed collagen':         { rating: 'good', reason: 'Collagène hydrolysé — hydratant, anti-âge' },
  'collagen':                    { rating: 'good', reason: 'Hydratant, soutien de la peau' },
  'adenosine':                   { rating: 'good', reason: 'Anti-rides reconnu, apaisant' },
  'allantoin':                   { rating: 'good', reason: 'Apaisant, cicatrisant, toléré par tous' },
  'bisabolol':                   { rating: 'good', reason: 'Apaisant, anti-inflammatoire naturel' },
  'caffeine':                    { rating: 'good', reason: 'Antioxydant, décongestionnant (yeux, cellulite)' },
  'ferulic acid':                { rating: 'good', reason: 'Antioxydant puissant, potentialise la vitamine C' },
  'resveratrol':                 { rating: 'good', reason: 'Antioxydant puissant, anti-âge' },
  'coenzyme q10':                { rating: 'good', reason: 'Ubiquinone — antioxydant, anti-âge' },
  'ubiquinone':                  { rating: 'good', reason: 'CoQ10 — antioxydant, anti-âge' },
}

// Normalise a raw ingredient string to INCI lowercase
function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\*/g, '')        // organic markers
    .replace(/\+/g, '')
    .replace(/\d+%/g, '')      // percentages
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse the raw ingredients_text string into an array of individual names
export function parseIngredients(text: string): string[] {
  // Drop everything inside parentheses (sub-ingredient lists)
  const cleaned = text
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')

  return cleaned
    .split(/[,;]/)
    .map((s) => normalise(s))
    .filter((s) => s.length > 1)
}

// Match a parsed ingredient against the database
function matchIngredient(ingredient: string): { rating: IngredientRating; reason: string } | null {
  // Exact match first
  if (db[ingredient]) return db[ingredient]

  // Substring match: check if any key is contained in the ingredient (or vice versa)
  for (const [key, info] of Object.entries(db)) {
    if (ingredient.includes(key) || key.includes(ingredient)) {
      return info
    }
  }

  // PEG- prefix match
  if (/^peg-?\d/i.test(ingredient)) {
    return { rating: 'moderate', reason: 'Dérivé pétrochimique, peut véhiculer des contaminants' }
  }

  // Paraben suffix match
  if (ingredient.endsWith('paraben')) {
    return { rating: 'bad', reason: 'Perturbateur endocrinien suspecté' }
  }

  // Silicone suffixes
  if (ingredient.endsWith('siloxane') || ingredient.endsWith('silicone') || ingredient.endsWith('silane')) {
    return { rating: 'moderate', reason: 'Silicone synthétique, non biodégradable' }
  }

  return null
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Bon'
  if (score >= 40) return 'Moyen'
  if (score >= 20) return 'Mauvais'
  return 'Très mauvais'
}

export function analyseIngredients(ingredientsText: string): IngredientAnalysis {
  const parsed = parseIngredients(ingredientsText)

  const bad: IngredientInfo[] = []
  const moderate: IngredientInfo[] = []
  const good: IngredientInfo[] = []
  const unknown: string[] = []

  for (const ing of parsed) {
    const match = matchIngredient(ing)
    if (!match) {
      unknown.push(ing)
      continue
    }
    const info: IngredientInfo = { name: ing, ...match }
    if (match.rating === 'bad') bad.push(info)
    else if (match.rating === 'moderate') moderate.push(info)
    else good.push(info)
  }

  const score = Math.max(0, Math.min(100,
    100 - bad.length * 15 - moderate.length * 5
  ))

  return { bad, moderate, good, unknown, score, scoreLabel: scoreLabel(score) }
}
