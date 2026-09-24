import { GOLF_RULES, GOLF_RULE_GROUPS } from '@/data/clubData'
import { GolfRule } from '@/types'

export type PenaltyLevel = 'none' | 'one_stroke' | 'two_strokes' | 'disqualification'

export interface RefereeVerdict {
  query: string
  title: string
  verdict: string
  procedureSteps: string[]
  penaltyLevel: PenaltyLevel
  penaltyText: string
  rule: GolfRule
  confidence: 'high' | 'medium'
  tips?: string
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Curated expert rulings for common golf on-course disputes
 */
const EXPERT_SCENARIOS = [
  {
    triggers: ['agua', 'lago', 'rio', 'estacas rojas', 'estaca roja', 'estacas amarillas', 'estaca amarilla', 'penalizacion roja', 'penalizacion amarilla'],
    ruleId: 17,
    title: 'Bola en Área de Penalización (Agua / Estacas)',
    verdict: 'Puedes intentar jugar la bola como yace sin penalización. Si decides tomar alivio, incurres en 1 golpe de penalización.',
    procedureSteps: [
      'Si son estacas rojas (Área lateral): Tienes 3 opciones: 1) Jugar bajo golpe y distancia desde el punto anterior, 2) Dropar en línea recta hacia atrás manteniendo el punto de entrada entre la bandera y la bola, o 3) Alivio lateral dentro de 2 longitudes de palo desde el punto por donde cruzó el margen.',
      'Si son estacas amarillas: Solo dispones de las opciones 1 y 2 (no hay opción lateral de 2 palos).',
      'Dropa la bola sosteniéndola a la altura de la rodilla y déjala caer recta sin lanzarla.',
    ],
    penaltyLevel: 'one_stroke' as PenaltyLevel,
    penaltyText: '1 Golpe de penalización (o 0 si la juegas como yace)',
    tips: 'Consejo R&A: No tienes obligación de buscar la bola dentro del agua; basta con tener certeza virtual de que entró.',
  },
  {
    triggers: ['bunker', 'arena', 'trampa de arena', 'rastrillo', 'tocar arena', 'hojas en bunker', 'piedras en bunker'],
    ruleId: 12,
    title: 'Procedimiento en Búnker de Arena',
    verdict: 'Está permitido retirar impedimentos sueltos (piedras, hojas, ramas) y obstrucciones movibles (rastrillos) dentro del búnker sin penalización.',
    procedureSteps: [
      'Puedes retirar piedras o rastrillos con cuidado de no mover tu bola.',
      'PROHIBIDO: No apoyes el palo tocando la arena inmediatamente delante o detrás de la bola, ni toques la arena en swings de práctica.',
      'Si la bola reposa contra un rastrillo, márcala antes de mover el rastrillo; si se mueve al retirarlo, repónla en el lugar exacto sin penalización.',
    ],
    penaltyLevel: 'none' as PenaltyLevel,
    penaltyText: 'Sin penalización (siempre que no toques arena al preparar el golpe)',
    tips: 'Si tocas la arena deliberadamente con el palo en la preparación del golpe, la penalización es de 2 golpes.',
  },
  {
    triggers: ['camino', 'asfalto', 'aspersor', 'rociador', 'boca de riego', 'terreno en reparacion', 'charco', 'agua temporal', 'cart path'],
    ruleId: 16,
    title: 'Alivio Gratuito por Condición Anormal del Campo',
    verdict: 'Tienes derecho a ALIVIO COMPLETO Y GRATUITO sin penalización si un camino pavimentado, aspersor, o agua temporal interfiere con tu postura o swing.',
    procedureSteps: [
      'Encuentra el Punto Más Cercano de Alivio Completo (donde la condición ya no interfiera ni con tu reposo, ni con tu postura ni con tu swing).',
      'Este punto no puede estar más cerca del hoyo que la posición original de la bola.',
      'Mide 1 longitud de palo desde ese punto (con el palo más largo de tu bolsa que no sea el putter) y dropa la bola a la altura de la rodilla.',
    ],
    penaltyLevel: 'none' as PenaltyLevel,
    penaltyText: 'Sin penalización (Alivio Gratuito Oficial)',
    tips: 'La interferencia visual o mental no otorga alivio; debe existir contacto físico con la postura, reposo o swing.',
  },
  {
    triggers: ['fuera de limites', 'blancas', 'estacas blancas', 'fuera del campo', 'pared', 'valla'],
    ruleId: 2,
    title: 'Bola Fuera de Límites (Estacas Blancas)',
    verdict: 'La bola está fuera de límites cuando la totalidad de la misma reposa más allá de la línea interna definida por las estacas blancas o el muro.',
    procedureSteps: [
      'No existe opción de alivio lateral para una bola fuera de límites.',
      'Debes proceder bajo Alivio de Golpe y Distancia: 1 golpe de penalización y jugar otra bola desde el lugar donde diste el golpe anterior.',
      'Si era el golpe de salida en el tee, puedes colocar la bola sobre un tee en cualquier parte del área de salida.',
    ],
    penaltyLevel: 'one_stroke' as PenaltyLevel,
    penaltyText: '1 Golpe de penalización + Distancia (repetir golpe)',
    tips: 'Si una parte minúscula de la bola toca el campo, la bola se considera dentro.',
  },
  {
    triggers: ['perdida', 'buscar', '3 minutos', 'tiempo de busqueda', 'no encuentro la bola'],
    ruleId: 19,
    title: 'Bola No Encontrada (Perdida tras 3 Minutos)',
    verdict: 'El tiempo oficial para buscar una bola es de 3 minutos de reloj continuos desde que el jugador o su caddie comienzan la búsqueda.',
    procedureSteps: [
      'Si transcurren los 3 minutos sin encontrar e identificar la bola, queda oficialmente perdida.',
      'Debes regresar al punto del golpe anterior y jugar bajo Alivio de Golpe y Distancia con 1 golpe de penalización.',
      'Si habías jugado una Bola Provisional anunciada correctamente, esa bola provisional se convierte de inmediato en la bola en juego.',
    ],
    penaltyLevel: 'one_stroke' as PenaltyLevel,
    penaltyText: '1 Golpe de penalización + Repetir desde punto previo',
    tips: 'Anuncia siempre una bola provisional en el tee si crees que tu bola puede haberse perdido fuera de área de penalización.',
  },
  {
    triggers: ['injugable', 'arbusto', 'arbol', 'mata', 'matorral', 'debajo de un arbol', 'raices'],
    ruleId: 18,
    title: 'Declaración de Bola Injugable',
    verdict: 'El jugador es el ÚNICO juez para decidir si su bola es injugable. Puedes declararla en cualquier lugar del campo (salvo en un área de penalización).',
    procedureSteps: [
      'Bajo 1 golpe de penalización, tienes 3 alternativas:',
      'Opción A: Alivio de Golpe y Distancia (jugar desde donde diste el último golpe).',
      'Opción B: Dropar en línea recta hacia atrás desde el punto de la bola, manteniendo ese punto entre la bandera y tú, sin límite de distancia hacia atrás.',
      'Opción C: Dropar dentro de 2 longitudes de palo desde donde reposa la bola, sin acercarte al hoyo.',
    ],
    penaltyLevel: 'one_stroke' as PenaltyLevel,
    penaltyText: '1 Golpe de penalización',
    tips: 'Si declaras injugable una bola dentro de un búnker, las opciones B y C deben droparse dentro del búnker, o bien dropar fuera del búnker en línea hacia atrás bajo 2 golpes de penalización.',
  },
  {
    triggers: ['bandera', 'green', 'patear con bandera', 'pique', 'marca de bola', 'marca de clavo'],
    ruleId: 13,
    title: 'Reglas en el Putting Green',
    verdict: 'Bajo las Reglas R&A modernas, puedes ejecutar cualquier putt manteniendo la bandera colocada en el hoyo sin ninguna penalización.',
    procedureSteps: [
      'Si la bola golpea la bandera mientras está en el agujero, no hay penalización y se juega como quede o embocada.',
      'En el green puedes reparar piques de bola, marcas de clavos, daños de zapatos y marcas viejas de hoyo.',
      'Antes de levantar la bola en el green, debes marcar su posición con un marcador o moneda justo detrás de la bola.',
    ],
    penaltyLevel: 'none' as PenaltyLevel,
    penaltyText: 'Sin penalización',
    tips: 'Recuerda que no puedes testear la superficie del green raspándola o rodando una bola antes de tu turno.',
  },
  {
    triggers: ['tarde', 'demora', 'hora de salida', 'retraso', 'llegar tarde', 'tee time tarde'],
    ruleId: 5,
    title: 'Llegada al Tee de Salida Fuera de Hora',
    verdict: 'El jugador debe estar en el tee de salida listo para jugar a la hora exacta fijada por el Comité.',
    procedureSteps: [
      'Si llegas al tee listo para jugar con menos de 5 minutos de retraso sobre tu hora oficial:',
      'En Stroke Play (juego por golpes): Incurres en 2 golpes de penalización en el primer hoyo.',
      'En Match Play: Pierdes el primer hoyo del partido.',
      'Si llegas con más de 5 minutos de retraso: Descalificación automática del torneo (salvo circunstancias excepcionales aprobadas por el Comité).',
    ],
    penaltyLevel: 'two_strokes' as PenaltyLevel,
    penaltyText: '2 Golpes de penalización (hasta 5 min) / Descalificación (+5 min)',
    tips: 'Preséntate en el tee siempre al menos 10 minutos antes de tu hora de salida oficial para evitar controversias.',
  },
  {
    triggers: ['14 palos', 'cuantos palos', 'palos en la bolsa', 'limite de palos', 'quince palos', '15 palos'],
    ruleId: 4,
    title: 'Límite Oficial de Palos en la Bolsa',
    verdict: 'El reglamento prohíbe taxativamente iniciar una ronda con más de 14 palos de golf en tu bolsa.',
    procedureSteps: [
      'Verifica tu bolsa antes de dar el golpe de salida en el hoyo 1.',
      'Si descubres que llevas más de 14 palos en juego, debes declarar inmediatamente fuera de juego el palo sobrante al resto de jugadores.',
      'Penalización en Stroke Play: 2 golpes por cada hoyo donde se cometió la infracción, con un máximo de 4 golpes por ronda.',
      'Penalización en Match Play: Se deduce 1 hoyo por cada hoyo de infracción, hasta un máximo de 2 hoyos.',
    ],
    penaltyLevel: 'two_strokes' as PenaltyLevel,
    penaltyText: '2 Golpes por hoyo con infracción (Máximo 4 golpes)',
    tips: 'No tires el palo sobrante al campo; simplemente márcalo y decláralo inactivo para el resto de la vuelta.',
  },
  {
    triggers: ['dos golpes', 'doble toque', 'golpear dos veces', 'doble golpe', 'impacto doble'],
    ruleId: 10,
    title: 'Doble Toque Accidental en un Golpe',
    verdict: 'Si el palo golpea accidentalmente la bola más de una vez durante la ejecución de un solo golpe, NO hay penalización.',
    procedureSteps: [
      'El doble impacto debe ser un único movimiento continuo del swing sin una intención deliberada de empujar o redirigir la bola.',
      'La bola se cuenta como un solo golpe y se juega desde donde repose.',
    ],
    penaltyLevel: 'none' as PenaltyLevel,
    penaltyText: 'Sin penalización (cuenta únicamente como 1 golpe realizado)',
    tips: 'Esta regla fue modernizada por la R&A en 2019 para eliminar la penalización injusta en chips cortos.',
  },
]

/**
 * AI Referee Engine that analyzes user query and issues an official R&A ruling
 */
export function consultGolfReferee(query: string): RefereeVerdict {
  const normQuery = normalize(query)

  // 1. Try expert scenario exact trigger matching first
  let bestScenario = null
  let maxMatchedTriggers = 0

  for (const scenario of EXPERT_SCENARIOS) {
    let matched = 0
    for (const trig of scenario.triggers) {
      if (normQuery.includes(trig)) {
        matched += 2
      }
    }
    if (matched > maxMatchedTriggers) {
      maxMatchedTriggers = matched
      bestScenario = scenario
    }
  }

  if (bestScenario && maxMatchedTriggers >= 2) {
    const rule = GOLF_RULES.find((r) => r.id === bestScenario.ruleId) || GOLF_RULES[0]
    return {
      query,
      title: bestScenario.title,
      verdict: bestScenario.verdict,
      procedureSteps: bestScenario.procedureSteps,
      penaltyLevel: bestScenario.penaltyLevel,
      penaltyText: bestScenario.penaltyText,
      rule,
      confidence: 'high',
      tips: bestScenario.tips,
    }
  }

  // 2. Semantic matching against all 25 GOLF_RULES
  let highestScore = 0
  let matchedRule = GOLF_RULES[0]

  for (const rule of GOLF_RULES) {
    let score = 0
    const titleNorm = normalize(rule.title)
    const summaryNorm = normalize(rule.summary)
    const procedureNorm = normalize(rule.procedure)
    const penaltiesNorm = normalize(rule.penalties)

    for (const kw of rule.keywords) {
      const kwNorm = normalize(kw)
      if (normQuery.includes(kwNorm)) score += 5
    }

    const words = normQuery.split(/\s+/).filter((w) => w.length > 3)
    for (const w of words) {
      if (titleNorm.includes(w)) score += 4
      if (summaryNorm.includes(w)) score += 2
      if (procedureNorm.includes(w)) score += 2
      if (penaltiesNorm.includes(w)) score += 2
    }

    if (score > highestScore) {
      highestScore = score
      matchedRule = rule
    }
  }

  // Determine penalty level based on rule penalties description
  let penaltyLevel: PenaltyLevel = 'none'
  const penaltiesLower = matchedRule.penalties.toLowerCase()
  if (penaltiesLower.includes('descalificaci')) {
    penaltyLevel = 'disqualification'
  } else if (penaltiesLower.includes('2 golpe') || penaltiesLower.includes('penalización general')) {
    penaltyLevel = 'two_strokes'
  } else if (penaltiesLower.includes('1 golpe') || penaltiesLower.includes('un golpe')) {
    penaltyLevel = 'one_stroke'
  }

  return {
    query,
    title: `Dictamen R&A: ${matchedRule.title}`,
    verdict: matchedRule.summary,
    procedureSteps: [
      matchedRule.procedure,
      'Asegúrate de consultar con tus compañeros de juego antes de tomar la acción si existiese alguna controversia.',
    ],
    penaltyLevel,
    penaltyText: matchedRule.penalties,
    rule: matchedRule,
    confidence: highestScore > 6 ? 'high' : 'medium',
    tips: `Consulta oficial bajo la ${matchedRule.number} de las Reglas de Golf R&A / USGA.`,
  }
}
