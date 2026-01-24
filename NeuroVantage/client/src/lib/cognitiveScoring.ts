import { getDomainLabel, getDomainUnits } from "@/lib/domains";
import { PHQ2_BANDS, SCREENER_LIMITS, SCREENER_THRESHOLDS, resolveSeverity } from "@/lib/thresholds";

export type ScoreDomain =
  | "reaction"
  | "memory"
  | "executive"
  | "depression"
  | "attention";

export type DomainScore = {
  domain: ScoreDomain;
  label: string;
  units: string;
  value: number | null;
  lastUpdated?: number;
};

export type ScoreRecord = Record<ScoreDomain, DomainScore>;

export type ScreenerScores = {
  reaction: number;
  memory: number;
  executive: number;
  depression: number;
  attention: number;
};

export type ReactionTrial = {
  rtMs: number;
};

export type ReactionDetails = {
  trials?: ReactionTrial[];
  averageMs?: number;
};

export type TaskDetails = {
  reaction?: ReactionDetails;
};

export type QuestionnaireData = {
  answered?: number;
  total?: number;
};

export type ScreenerSession = {
  scores: ScoreRecord;
  taskDetails: TaskDetails;
  questionnaire: QuestionnaireData;
};

const SCORE_DOMAIN_META: Record<ScoreDomain, { label: string; units: string }> = {
  reaction: {
    label: getDomainLabel("reaction_speed", "clinician"),
    units: getDomainUnits("reaction_speed"),
  },
  memory: {
    label: getDomainLabel("visual_memory", "clinician"),
    units: getDomainUnits("visual_memory"),
  },
  executive: {
    label: getDomainLabel("executive_function", "clinician"),
    units: getDomainUnits("executive_function"),
  },
  depression: {
    label: getDomainLabel("mood", "clinician"),
    units: getDomainUnits("mood"),
  },
  attention: {
    label: getDomainLabel("attention", "clinician"),
    units: getDomainUnits("attention"),
  },
};

export function createEmptySession(): ScreenerSession {
  return {
    scores: createEmptyScoreRecord(),
    taskDetails: {},
    questionnaire: {},
  };
}

function createEmptyScoreRecord(): ScoreRecord {
  return Object.entries(SCORE_DOMAIN_META).reduce((acc, [domain, meta]) => {
    acc[domain as ScoreDomain] = {
      domain: domain as ScoreDomain,
      label: meta.label,
      units: meta.units,
      value: null,
    };
    return acc;
  }, {} as ScoreRecord);
}

export function hydrateSession(raw?: Partial<ScreenerSession>): ScreenerSession {
  const base = createEmptySession();
  if (!raw) return base;

  const hydratedScores: ScoreRecord = { ...base.scores };
  const rawScores: Partial<ScoreRecord> = raw.scores ?? {};
  (Object.keys(SCORE_DOMAIN_META) as ScoreDomain[]).forEach((domain) => {
    const meta = SCORE_DOMAIN_META[domain];
    const incoming = rawScores[domain];
    hydratedScores[domain] = {
      domain,
      label: meta.label,
      units: meta.units,
      value:
        incoming && typeof incoming.value === "number"
          ? incoming.value
          : incoming?.value ?? null,
      lastUpdated: incoming?.lastUpdated,
    };
  });

  return {
    scores: hydratedScores,
    taskDetails: raw.taskDetails ?? {},
    questionnaire: raw.questionnaire ?? {},
  };
}

export function scoreRecordToPrimitive(
  record: ScoreRecord
): ScreenerScores {
  return {
    reaction: record.reaction.value ?? 0,
    memory: record.memory.value ?? 0,
    executive: record.executive.value ?? 0,
    depression: record.depression.value ?? 0,
    attention: record.attention.value ?? 0,
  };
}

export function updateSessionScores(
  session: ScreenerSession,
  updates: Partial<Record<ScoreDomain, number | null>>
): ScreenerSession {
  const nextScores: ScoreRecord = { ...session.scores };
  const timestamp = Date.now();
  (Object.entries(updates) as [ScoreDomain, number | null][]).forEach(
    ([domain, value]) => {
      if (typeof value === "undefined") return;
      const current = nextScores[domain];
      nextScores[domain] = {
        ...current,
        value,
        lastUpdated: timestamp,
      };
    }
  );
  return {
    ...session,
    scores: nextScores,
  };
}

export function updateSessionQuestionnaire(
  session: ScreenerSession,
  data: QuestionnaireData
): ScreenerSession {
  return {
    ...session,
    questionnaire: {
      ...session.questionnaire,
      ...data,
    },
  };
}

export function updateSessionTaskDetails(
  session: ScreenerSession,
  details: TaskDetails
): ScreenerSession {
  return {
    ...session,
    taskDetails: {
      ...session.taskDetails,
      ...details,
    },
  };
}

export type DerivedFlags = {
  hasDepressionFlag: boolean;
  hasAttentionFlag: boolean;
  hasReactionFlag: boolean;
  hasExecutiveFlag: boolean;
};

export type DataQuality = {
  suspiciousRtPattern: boolean;
  tooManyMissingItems: boolean;
  summary: "good" | "limited";
};

export type NormativeBand = "below" | "average" | "above" | "unknown";
type MemoryNormBand = NormativeBand;
type ExecutiveNormBand = NormativeBand;
export type DepressionSeverity = "none" | "mild" | "moderate" | "moderately severe" | "severe";
export type GlobalRiskLevel = "low" | "moderate" | "high";

export type Observation = {
  title: string;
  description: string;
  subpoints?: string[];
};

export type Suggestion = {
  title: string;
  desc: string;
  urgent: boolean;
  basedOn?: string;
};

export type ReportModel = {
  scores: ScreenerScores;
  reactionNormBand: NormativeBand;
  memoryNormBand: MemoryNormBand | "unknown";
  executiveNormBand: ExecutiveNormBand | "unknown";
  reactionAgeMedianMs: number | null;
  visualMemoryMedianItems: number | null;
  depressionSeverity: DepressionSeverity;
  derivedFlags: DerivedFlags;
  dataQuality: DataQuality;
  observations: Observation[];
  recommendations: Suggestion[];
  globalRiskLevel: GlobalRiskLevel;
};

export type TaskSummary = {
  domain: ScoreDomain;
  label: string;
  units: string;
  value: number | null;
  status: "pending" | "complete" | "skipped";
  lastUpdated?: number;
};

export type TaskSummaries = Record<ScoreDomain, TaskSummary>;

export class TaskPayloadBuilder {
  private summaries: TaskSummaries = {} as TaskSummaries;
  private details: TaskDetails;

  constructor(private session: ScreenerSession) {
    this.details = session.taskDetails ?? {};
  }

  build() {
    (Object.entries(this.session.scores) as [ScoreDomain, DomainScore][]).forEach(
      ([domain, score]) => {
        this.summaries[domain] = {
          domain,
          label: score.label,
          units: score.units,
          value: score.value,
          status: score.value === null ? "pending" : "complete",
          lastUpdated: score.lastUpdated,
        };
      }
    );
    return {
      summaries: this.summaries,
      details: this.details,
    };
  }
}

export class QuestionnairePayloadBuilder {
  constructor(private data: QuestionnaireData = {}) {}

  setCounts(data: QuestionnaireData) {
    this.data = { ...this.data, ...data };
    return this;
  }

  toJSON() {
    return buildQuestionnairesPayload(this.data);
  }
}

export function getReactionNormBand(
  age: number | null,
  rtMs: number | null
): NormativeBand | "unknown" {
  if (
    rtMs == null ||
    Number.isNaN(rtMs) ||
    age == null ||
    Number.isNaN(age)
  ) {
    return "unknown";
  }

  let slowCutoff: number;
  let fastCutoff: number;

  if (age < 40) {
    slowCutoff = 380;
    fastCutoff = 260;
  } else if (age < 60) {
    slowCutoff = 420;
    fastCutoff = 280;
  } else {
    slowCutoff = 460;
    fastCutoff = 300;
  }

  if (rtMs > slowCutoff) return "below";
  if (rtMs < fastCutoff) return "above";
  return "average";
}

export function getReactionMedianForAge(age: number | null): number | null {
  if (age == null || Number.isNaN(age)) return null;
  if (age < 40) return 320;
  if (age < 60) return 350;
  return 380;
}

export function getMemoryNormBand(span: number | null): MemoryNormBand | "unknown" {
  if (span === null || Number.isNaN(span)) return "unknown";
  if (span >= 8) return "above";
  if (span <= 4) return "below";
  return "average";
}

export function getMemoryMedianForAge(age: number | null): number | null {
  if (age == null || Number.isNaN(age)) return null;
  if (age < 40) return 7;
  if (age < 60) return 6;
  return 5;
}

export function getDepressionSeverity(score: number | null): DepressionSeverity {
  return resolveSeverity(score, PHQ2_BANDS);
}

export function getExecutiveNormBand(
  execScore: number | null
): ExecutiveNormBand | "unknown" {
  if (execScore === null || Number.isNaN(execScore)) return "unknown";
  if (execScore < SCREENER_THRESHOLDS.executiveLowerBound) return "below";
  if (execScore > 1500) return "above";
  return "average";
}

export function buildQuestionnairesPayload(data?: QuestionnaireData) {
  return {
    totalItems: data?.total ?? 0,
    answered: data?.answered ?? 0,
  };
}

export function buildDataQuality(input: {
  reaction?: ReactionDetails;
  questionnaire?: QuestionnaireData;
}): DataQuality {
  const trials = input.reaction?.trials ?? [];
  const avg = input.reaction?.averageMs ?? null;
  let suspiciousRtPattern = false;
  if (trials.length > 0 && trials.length < 5) {
    suspiciousRtPattern = true;
  } else if (trials.length >= 2) {
    const mean = trials.reduce((sum, t) => sum + t.rtMs, 0) / trials.length;
    const variance =
      trials.reduce((sum, t) => sum + Math.pow(t.rtMs - mean, 2), 0) /
      trials.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < 15 || mean < 150) {
      suspiciousRtPattern = true;
    }
  } else if (avg !== null && avg < 150) {
    suspiciousRtPattern = true;
  }

  const answered = input.questionnaire?.answered ?? 0;
  const total = input.questionnaire?.total ?? 0;
  const tooManyMissingItems =
    total > 0 ? answered / total < 0.7 : false;

  return {
    suspiciousRtPattern,
    tooManyMissingItems,
    summary: suspiciousRtPattern || tooManyMissingItems ? "limited" : "good",
  };
}

export function getDerivedFlags(scores: ScreenerScores): DerivedFlags {
  return {
    hasDepressionFlag: scores.depression >= SCREENER_THRESHOLDS.depressionFlag,
    hasAttentionFlag: scores.attention >= SCREENER_THRESHOLDS.attentionFlag,
    hasReactionFlag: scores.reaction > SCREENER_THRESHOLDS.reactionSlowMs,
    hasExecutiveFlag: scores.executive < SCREENER_THRESHOLDS.executiveLowerBound,
  };
}

class RecommendationGenerator {
  constructor(private scores: ScreenerScores) {}

  generate(): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const moodSeverity = getDepressionSeverity(this.scores.depression);
    if (this.scores.depression >= SCREENER_THRESHOLDS.depressionFlag) {
      suggestions.push({
        title: "Mood Evaluation Recommended",
        desc: "Scores indicate potential mood dysregulation. Consider a full hormone panel to rule out biological causes.",
        urgent: true,
        basedOn: `PHQ-2–style mood score ${this.scores.depression}/${SCREENER_LIMITS.moodMax} (${moodSeverity}).`,
      });
    }

    if (this.scores.executive < SCREENER_THRESHOLDS.executiveLowerBound) {
      suggestions.push({
        title: "Executive Function Variance",
        desc: "Lower scores in inhibition control tasks. May indicate neurotransmitter imbalances affecting focus.",
        urgent: false,
        basedOn: `Stroop-style executive score ${this.scores.executive} (< ${SCREENER_THRESHOLDS.executiveLowerBound}).`,
      });
    }

    if (this.scores.attention >= SCREENER_THRESHOLDS.attentionFlag) {
      suggestions.push({
        title: "Attention Variance Detected",
        desc: "Attention scores suggest focus challenges. Executive function assessment is recommended.",
        urgent: false,
        basedOn: `Attention self-report score ${this.scores.attention} (≥ ${SCREENER_THRESHOLDS.attentionFlag}).`,
      });
    }

    if (this.scores.reaction > SCREENER_THRESHOLDS.reactionSlowMs) {
      suggestions.push({
        title: "Slowed Processing Speed",
        desc: "Reaction time is below average for your age group. Slower reaction time can be associated with reduced processing speed and should be interpreted in context.",
        urgent: false,
        basedOn: `Simple reaction speed ${Math.round(this.scores.reaction)} ms (> ${SCREENER_THRESHOLDS.reactionSlowMs} ms).`,
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        title: "Routine Wellness Check",
        desc: "Cognitive function appears stable. Recommended annual follow-up to track long-term brain health.",
        urgent: false,
        basedOn: "All screener domains were within reference ranges during this visit.",
      });
    }
    return suggestions;
  }
}

class ObservationGenerator {
  generate(): Observation[] {
    return [
      {
        title: "Mood",
        description:
          `Mood screening scores are based on a short PHQ-2–style 0–${SCREENER_LIMITS.moodMax} checklist, where higher scores reflect a greater burden of depressive symptoms. This is a brief screen and should be interpreted alongside clinical context.`,
        subpoints: [
          "Kroenke K, Spitzer RL, Williams JB. The Patient Health Questionnaire-2: validity of a two-item depression screener. Med Care. 2003;41(11):1284-1292. PMID: 14583691.",
        ],
      },
      {
        title: "Attention",
        description:
          "Attention screening items are adapted from adult ADHD self-report scales; higher scores reflect more self-reported attention difficulties. Attention screening score reflects self-reported difficulties with focus and distractibility; higher scores indicate more attention-related symptoms.",
        subpoints: [
          "Hines JL, King TS, Curry WJ. The adult ADHD self-report scale for screening for adult attention-deficit/hyperactivity disorder. J Am Board Fam Med. 2012;25(6):847-853. doi:10.3122/jabfm.2012.06.120065. PMID: 23136325.",
          "Brevik EJ, Lundervold AJ, Haavik J, Posserud MB. Validity and accuracy of the Adult ADHD Self-Report Scale (ASRS) and the Wender Utah Rating Scale (WURS) symptom checklists in discriminating between adults with and without ADHD. Brain Behav. 2020;10(6):e01605. doi:10.1002/brb3.1605. PMID: 32285644.",
        ],
      },
      {
        title: "Reaction Speed",
        description:
          "Reaction speed is interpreted as the median time it takes to respond to simple visual stimuli; slower reaction times can reflect reduced processing speed and may be influenced by multiple factors such as fatigue and overall health.",
        subpoints: [
          "Der G, Deary IJ. Age and sex differences in reaction time in adulthood: results from the United Kingdom Health and Lifestyle Survey. Psychol Aging. 2006;21(1):62-73. PMID: 16594792.",
        ],
      },
      {
        title: "Visual Memory",
        description:
          "Visual memory span is interpreted as the highest sequence length a person can accurately recall on a visuo-spatial task; lower spans suggest weaker short-term visuo-spatial memory.",
        subpoints: [
          "Kessels RPC, van Zandvoort MJE, Postma A, Kappelle LJ, de Haan EHF. The Corsi Block-Tapping Task: standardization and normative data. Appl Neuropsychol. 2000;7(4):252-258. PMID: 11296689.",
          "Berch DB, Krikorian R, Huha EM. The Corsi block-tapping task: methodological and theoretical considerations. Brain Cogn. 1998;38(3):317-338. PMID: 9841789.",
        ],
      },
      {
        title: "Executive Function",
        description:
          "Executive function performance is interpreted based on speed and accuracy on a Stroop-style task, where lower scores suggest greater difficulty with inhibitory control and cognitive flexibility.",
        subpoints: [
          "MacLeod CM. Half a century of research on the Stroop effect: an integrative review. Psychol Bull. 1991;109(2):163-203. PMID: 2034749.",
          "Miyake A, Friedman NP, Emerson MJ, Witzki AH, Howerter A, Wager TD. The unity and diversity of executive functions and their contributions to complex \"frontal lobe\" tasks: a latent variable analysis. Cogn Psychol. 2000;41(1):49-100. PMID: 10945922.",
        ],
      },
    ];
  }
}

export function getSuggestions(scores: ScreenerScores): Suggestion[] {
  return new RecommendationGenerator(scores).generate();
}

export function getDataDrivenObservations(): Observation[] {
  return new ObservationGenerator().generate();
}

export function computeReportModel(input: {
  session: ScreenerSession;
  ageAtScreening: number | null;
}): ReportModel {
  const primitiveScores = scoreRecordToPrimitive(input.session.scores);
  const reactionNormBand = getReactionNormBand(
    input.ageAtScreening,
    primitiveScores.reaction
  );
  const memoryNormBand = getMemoryNormBand(primitiveScores.memory);
  const executiveNormBand = getExecutiveNormBand(primitiveScores.executive);
  const reactionAgeMedianMs = getReactionMedianForAge(input.ageAtScreening);
  const visualMemoryMedianItems = getMemoryMedianForAge(input.ageAtScreening);
  const depressionSeverity = getDepressionSeverity(primitiveScores.depression);
  const derivedFlags = getDerivedFlags(primitiveScores);
  const dataQuality = buildDataQuality({
    reaction: input.session.taskDetails?.reaction,
    questionnaire: input.session.questionnaire,
  });
  const globalRiskLevel = getGlobalRiskLevel(
    primitiveScores,
    input.ageAtScreening
  );

  return {
    scores: primitiveScores,
    reactionNormBand,
    memoryNormBand,
    executiveNormBand,
    reactionAgeMedianMs,
    visualMemoryMedianItems,
    depressionSeverity,
    derivedFlags,
    dataQuality,
    observations: getDataDrivenObservations(),
    recommendations: getSuggestions(primitiveScores),
    globalRiskLevel,
  };
}

export function getGlobalRiskLevel(
  scores: ScreenerScores,
  age: number | null
): GlobalRiskLevel {
  const moodSeverity = getDepressionSeverity(scores.depression);
  const reactionBand = getReactionNormBand(age, scores.reaction);
  const memoryBand = getMemoryNormBand(scores.memory);
  const execBand = getExecutiveNormBand(scores.executive);
  const attentionFlag = scores.attention >= SCREENER_THRESHOLDS.attentionFlag;

  let points = 0;
  if (moodSeverity === "moderate") points += 1;
  if (
    moodSeverity === "moderately severe" ||
    moodSeverity === "severe"
  ) {
    points += 2;
  }
  if (reactionBand === "below") points += 1;
  if (memoryBand === "below") points += 1;
  if (execBand === "below") points += 1;
  if (attentionFlag) points += 1;

  if (points <= 1) return "low";
  if (points <= 3) return "moderate";
  return "high";
}
