export interface PmpFormula {
  id: string
  name: string
  category: string
  formula: string
  variables: { symbol: string; meaning: string }[]
  interpretation: string
  whenToUse: string
  examScenario: string
  confusionAlert?: { confusedWith: string; difference: string }
  ritaTip: string
  example?: { setup: string; calculation: string; result: string }
  goodBad: string // e.g., ">1 good, <1 bad" or "positive good, negative bad"
}

export const FORMULA_CATEGORIES = [
  { id: 'evm', label: '📊 Earned Value', color: '#7c3aed' },
  { id: 'schedule', label: '📅 Schedule', color: '#2563eb' },
  { id: 'cost', label: '💰 Cost Forecasting', color: '#059669' },
  { id: 'procurement', label: '📝 Procurement', color: '#d97706' },
  { id: 'statistics', label: '📐 Statistics & Quality', color: '#dc2626' },
  { id: 'communication', label: '💬 Communication', color: '#0891b2' },
]

export const PMP_FORMULAS: PmpFormula[] = [
  // ─── EARNED VALUE MANAGEMENT ────────────────────────────────────
  {
    id: 'cv',
    name: 'Cost Variance (CV)',
    category: 'evm',
    formula: 'CV = EV − AC',
    variables: [
      { symbol: 'EV', meaning: 'Earned Value — estimated value of work actually completed' },
      { symbol: 'AC', meaning: 'Actual Cost — actual cost incurred for the work' },
    ],
    interpretation: 'Shows whether the project is over or under budget at this point in time.',
    whenToUse: 'When a question asks "how is the project performing against its budget?" or mentions cost performance.',
    examScenario: 'A project has completed $50,000 worth of work (EV) but spent $55,000 (AC). What is the cost variance? CV = $50,000 − $55,000 = −$5,000. The project is $5,000 over budget.',
    confusionAlert: {
      confusedWith: 'Schedule Variance (SV)',
      difference: 'CV uses AC (Actual Cost) — it measures MONEY. SV uses PV (Planned Value) — it measures SCHEDULE progress in dollar terms.',
    },
    ritaTip: 'EV comes first in ALL earned value formulas. For variances: negative is bad, positive is good. Think: "negative = not good."',
    example: { setup: 'EV = $50,000, AC = $55,000', calculation: '$50,000 − $55,000', result: '−$5,000 (Over budget)' },
    goodBad: 'Positive = under budget ✅ | Negative = over budget ❌',
  },
  {
    id: 'sv',
    name: 'Schedule Variance (SV)',
    category: 'evm',
    formula: 'SV = EV − PV',
    variables: [
      { symbol: 'EV', meaning: 'Earned Value — estimated value of work actually completed' },
      { symbol: 'PV', meaning: 'Planned Value — estimated value of work planned to be done by now' },
    ],
    interpretation: 'Shows whether the project is ahead of or behind schedule.',
    whenToUse: 'When a question asks about schedule performance or whether the project is on time.',
    examScenario: 'A project planned to complete $60,000 of work by now (PV) but has only completed $50,000 (EV). SV = $50,000 − $60,000 = −$10,000. The project is behind schedule.',
    confusionAlert: {
      confusedWith: 'Cost Variance (CV)',
      difference: 'SV uses PV (what was PLANNED) — it measures schedule. CV uses AC (what was SPENT) — it measures cost.',
    },
    ritaTip: 'If the formula relates to schedule, use PV. If it relates to cost, use AC. EV always comes first.',
    example: { setup: 'EV = $50,000, PV = $60,000', calculation: '$50,000 − $60,000', result: '−$10,000 (Behind schedule)' },
    goodBad: 'Positive = ahead of schedule ✅ | Negative = behind schedule ❌',
  },
  {
    id: 'cpi',
    name: 'Cost Performance Index (CPI)',
    category: 'evm',
    formula: 'CPI = EV ÷ AC',
    variables: [
      { symbol: 'EV', meaning: 'Earned Value' },
      { symbol: 'AC', meaning: 'Actual Cost' },
    ],
    interpretation: 'For every $1 spent, how much value are we getting? Shows cost efficiency.',
    whenToUse: 'When questions ask about cost efficiency or "how much value per dollar spent."',
    examScenario: 'CPI = 0.89 means you are getting only $0.89 of value for every $1.00 spent — funds are NOT being used efficiently.',
    confusionAlert: {
      confusedWith: 'Schedule Performance Index (SPI)',
      difference: 'CPI divides by AC (cost focus). SPI divides by PV (schedule focus). Both use EV as numerator.',
    },
    ritaTip: 'If it\'s an index (ratio), divide. CPI = EV/AC, SPI = EV/PV. Greater than 1 is good, less than 1 is bad.',
    example: { setup: 'EV = $2,500, AC = $2,800', calculation: '$2,500 ÷ $2,800', result: '0.893 (Getting ~89¢ per $1 spent)' },
    goodBad: '> 1 = under budget ✅ | < 1 = over budget ❌ | = 1 = on budget',
  },
  {
    id: 'spi',
    name: 'Schedule Performance Index (SPI)',
    category: 'evm',
    formula: 'SPI = EV ÷ PV',
    variables: [
      { symbol: 'EV', meaning: 'Earned Value' },
      { symbol: 'PV', meaning: 'Planned Value' },
    ],
    interpretation: 'Shows what percentage of planned schedule progress has been achieved.',
    whenToUse: 'When questions ask about schedule efficiency or "what rate are we progressing?"',
    examScenario: 'SPI = 0.83 means the project is only progressing at 83% of the planned rate — behind schedule.',
    confusionAlert: {
      confusedWith: 'Cost Performance Index (CPI)',
      difference: 'SPI uses PV (schedule). CPI uses AC (cost). Both have EV on top.',
    },
    ritaTip: 'SPI and CPI: greater than 1 = good, less than 1 = bad. The OPPOSITE is true for TCPI!',
    example: { setup: 'EV = $2,500, PV = $3,000', calculation: '$2,500 ÷ $3,000', result: '0.833 (Progressing at ~83% of plan)' },
    goodBad: '> 1 = ahead of schedule ✅ | < 1 = behind schedule ❌ | = 1 = on schedule',
  },

  // ─── COST FORECASTING ──────────────────────────────────────────
  {
    id: 'eac-cpi',
    name: 'Estimate at Completion — CPI trend (EAC)',
    category: 'cost',
    formula: 'EAC = BAC ÷ CPI',
    variables: [
      { symbol: 'BAC', meaning: 'Budget at Completion — total approved project budget' },
      { symbol: 'CPI', meaning: 'Cost Performance Index — current cost efficiency' },
    ],
    interpretation: 'If current cost performance trends continue, what will the total project cost?',
    whenToUse: 'When the question says variances are TYPICAL of the future, or the current trend will continue. This is the most common EAC formula on the exam.',
    examScenario: 'BAC = $4,000, CPI = 0.893. EAC = $4,000 ÷ 0.893 = $4,479. The project is now expected to cost $4,479.',
    ritaTip: 'Pay attention to the wording! "Variances are typical" or "trend will continue" = use BAC/CPI. This is the DEFAULT EAC formula if no other info is given.',
    example: { setup: 'BAC = $4,000, CPI = 0.893', calculation: '$4,000 ÷ 0.893', result: '$4,479' },
    goodBad: 'EAC > BAC = over budget forecast ❌ | EAC < BAC = under budget forecast ✅',
  },
  {
    id: 'eac-atypical',
    name: 'Estimate at Completion — Atypical (EAC)',
    category: 'cost',
    formula: 'EAC = AC + (BAC − EV)',
    variables: [
      { symbol: 'AC', meaning: 'Actual Cost to date' },
      { symbol: 'BAC', meaning: 'Budget at Completion' },
      { symbol: 'EV', meaning: 'Earned Value' },
    ],
    interpretation: 'If current variances are ATYPICAL (one-time events), what will the total project cost?',
    whenToUse: 'When the question says variances are ATYPICAL or a one-time occurrence that won\'t repeat.',
    examScenario: 'A machine broke causing a one-time $5,000 overrun. Current variances are not expected to continue. Use AC + (BAC − EV).',
    confusionAlert: {
      confusedWith: 'EAC = BAC/CPI',
      difference: 'BAC/CPI assumes the trend continues. AC + (BAC − EV) assumes it was a one-time event.',
    },
    ritaTip: 'Look for keywords: "one-time," "unusual," "atypical," "won\'t happen again" = use this formula.',
    goodBad: 'Compare to BAC to determine over/under budget forecast',
  },
  {
    id: 'eac-reestimate',
    name: 'Estimate at Completion — Re-estimate (EAC)',
    category: 'cost',
    formula: 'EAC = AC + Bottom-up ETC',
    variables: [
      { symbol: 'AC', meaning: 'Actual Cost to date' },
      { symbol: 'ETC', meaning: 'Estimate to Complete — re-estimated from scratch' },
    ],
    interpretation: 'When original estimates are fundamentally flawed, re-estimate all remaining work.',
    whenToUse: 'When the question says the original estimate is no longer valid or was fundamentally flawed.',
    examScenario: 'The project scope changed significantly. Original estimates no longer apply. Re-estimate the remaining work from scratch.',
    ritaTip: '"Original estimates are flawed" or "fundamentally wrong" = re-estimate. This is the most accurate but most time-consuming approach.',
    goodBad: 'Most accurate forecast when original assumptions no longer hold',
  },
  {
    id: 'etc',
    name: 'Estimate to Complete (ETC)',
    category: 'cost',
    formula: 'ETC = EAC − AC',
    variables: [
      { symbol: 'EAC', meaning: 'Estimate at Completion' },
      { symbol: 'AC', meaning: 'Actual Cost to date' },
    ],
    interpretation: 'How much MORE money is needed to finish the project from this point?',
    whenToUse: 'When asked "how much more will we need to spend?"',
    examScenario: 'EAC = $4,479, AC = $2,800. ETC = $4,479 − $2,800 = $1,679. You need $1,679 more to finish.',
    ritaTip: 'ETC is forward-looking: how much MORE. EAC is the TOTAL expected cost. Don\'t mix them up.',
    example: { setup: 'EAC = $4,479, AC = $2,800', calculation: '$4,479 − $2,800', result: '$1,679 more needed' },
    goodBad: 'Lower = less remaining cost | Higher = more budget needed',
  },
  {
    id: 'vac',
    name: 'Variance at Completion (VAC)',
    category: 'cost',
    formula: 'VAC = BAC − EAC',
    variables: [
      { symbol: 'BAC', meaning: 'Budget at Completion' },
      { symbol: 'EAC', meaning: 'Estimate at Completion' },
    ],
    interpretation: 'How much over or under budget will we be at the END of the project?',
    whenToUse: 'When asked about the expected budget variance at project completion.',
    examScenario: 'BAC = $4,000, EAC = $4,479. VAC = $4,000 − $4,479 = −$479. Expected to be $479 over budget.',
    ritaTip: 'Same rule as CV and SV: negative is bad (over budget), positive is good (under budget).',
    example: { setup: 'BAC = $4,000, EAC = $4,479', calculation: '$4,000 − $4,479', result: '−$479 (Over budget at completion)' },
    goodBad: 'Positive = under budget at end ✅ | Negative = over budget at end ❌',
  },
  {
    id: 'tcpi',
    name: 'To-Complete Performance Index (TCPI)',
    category: 'cost',
    formula: 'TCPI = (BAC − EV) ÷ (BAC − AC)',
    variables: [
      { symbol: 'BAC', meaning: 'Budget at Completion' },
      { symbol: 'EV', meaning: 'Earned Value' },
      { symbol: 'AC', meaning: 'Actual Cost' },
    ],
    interpretation: 'What cost efficiency rate must be achieved on remaining work to stay within budget?',
    whenToUse: 'When asked "what performance is needed to finish on budget?"',
    examScenario: 'TCPI = 1.25 means you need to be 25% more efficient on all remaining work to stay within budget — very difficult.',
    confusionAlert: {
      confusedWith: 'CPI',
      difference: 'CPI tells you past efficiency. TCPI tells you REQUIRED future efficiency. And TCPI interpretation is OPPOSITE: >1 is bad (harder), <1 is good (easier).',
    },
    ritaTip: 'TCPI is the ONLY index where >1 is BAD. It means you need to work harder/cheaper to stay on budget. All other indices: >1 is good.',
    goodBad: '> 1 = harder to achieve (bad) ❌ | < 1 = easier to achieve (good) ✅ — OPPOSITE of CPI/SPI!',
  },

  // ─── SCHEDULE ──────────────────────────────────────────────────
  {
    id: 'pert-triangular',
    name: 'Three-Point Estimate — Triangular',
    category: 'schedule',
    formula: 'E = (P + M + O) ÷ 3',
    variables: [
      { symbol: 'P', meaning: 'Pessimistic estimate (worst case)' },
      { symbol: 'M', meaning: 'Most Likely estimate' },
      { symbol: 'O', meaning: 'Optimistic estimate (best case)' },
    ],
    interpretation: 'Simple average of three estimates. Each estimate has equal weight.',
    whenToUse: 'When the question says "triangular distribution" or gives three estimates without specifying PERT/beta.',
    examScenario: 'O=4 days, M=6 days, P=14 days. E = (14+6+4) ÷ 3 = 8 days.',
    confusionAlert: {
      confusedWith: 'Beta (PERT) Distribution',
      difference: 'Triangular gives EQUAL weight to all three. Beta/PERT gives 4x weight to Most Likely. Look for "PERT" or "beta" = use beta formula.',
    },
    ritaTip: 'If the exam just says "three-point estimate" without specifying, default to beta (PERT). If it says "triangular," use this simpler formula.',
    example: { setup: 'O=4, M=6, P=14', calculation: '(14 + 6 + 4) ÷ 3', result: '8 days' },
    goodBad: 'N/A — this is an estimation technique',
  },
  {
    id: 'pert-beta',
    name: 'Three-Point Estimate — Beta (PERT)',
    category: 'schedule',
    formula: 'E = (P + 4M + O) ÷ 6',
    variables: [
      { symbol: 'P', meaning: 'Pessimistic estimate' },
      { symbol: 'M', meaning: 'Most Likely estimate (weighted 4x)' },
      { symbol: 'O', meaning: 'Optimistic estimate' },
    ],
    interpretation: 'Weighted average giving 4x importance to the Most Likely estimate.',
    whenToUse: 'When the question mentions "PERT," "beta distribution," or "weighted three-point estimate."',
    examScenario: 'O=4, M=6, P=14. E = (14 + 4×6 + 4) ÷ 6 = (14+24+4) ÷ 6 = 7 days.',
    confusionAlert: {
      confusedWith: 'Triangular Distribution',
      difference: 'Beta gives 4x weight to M (Most Likely), making the estimate closer to M. Triangular treats all three equally.',
    },
    ritaTip: 'Remember the 4 and 6: 4M in the numerator, 6 in the denominator. The Most Likely gets the most weight because it\'s... most likely!',
    example: { setup: 'O=4, M=6, P=14', calculation: '(14 + 24 + 4) ÷ 6', result: '7 days' },
    goodBad: 'N/A — this is an estimation technique',
  },
  {
    id: 'total-float',
    name: 'Total Float (Slack)',
    category: 'schedule',
    formula: 'Float = LS − ES  or  LF − EF',
    variables: [
      { symbol: 'LS', meaning: 'Late Start' },
      { symbol: 'ES', meaning: 'Early Start' },
      { symbol: 'LF', meaning: 'Late Finish' },
      { symbol: 'EF', meaning: 'Early Finish' },
    ],
    interpretation: 'How much can an activity be delayed without delaying the project end date?',
    whenToUse: 'When asked about slack, float, or how much an activity can slip.',
    examScenario: 'Activity has ES=Day 5, LS=Day 8. Float = 8−5 = 3 days. It can be delayed up to 3 days without affecting the project.',
    confusionAlert: {
      confusedWith: 'Free Float',
      difference: 'Total Float = delay without affecting PROJECT end date. Free Float = delay without affecting the NEXT activity\'s early start.',
    },
    ritaTip: 'Critical path activities have ZERO float. If float = 0, the activity is on the critical path. This is a frequently tested concept.',
    goodBad: '0 = critical path (no slack) | > 0 = has slack',
  },

  // ─── COMMUNICATION ─────────────────────────────────────────────
  {
    id: 'comm-channels',
    name: 'Communication Channels',
    category: 'communication',
    formula: 'Channels = n(n − 1) ÷ 2',
    variables: [
      { symbol: 'n', meaning: 'Number of people (stakeholders) including the project manager' },
    ],
    interpretation: 'Total number of potential communication channels in the project.',
    whenToUse: 'When asked how many communication paths exist, or when someone is added/removed from the team.',
    examScenario: 'A team of 5 people. Channels = 5(5−1) ÷ 2 = 10. If one person is added: 6(6−1) ÷ 2 = 15. Adding 1 person added 5 new channels!',
    ritaTip: 'The exam loves to ask: "A new person was added. How many NEW channels?" Calculate before and after, then subtract. Don\'t forget to include the PM in the count.',
    example: { setup: 'n = 10 people', calculation: '10 × 9 ÷ 2', result: '45 channels' },
    goodBad: 'More people = exponentially more channels = more communication complexity',
  },

  // ─── STATISTICS & QUALITY ──────────────────────────────────────
  {
    id: 'emv',
    name: 'Expected Monetary Value (EMV)',
    category: 'statistics',
    formula: 'EMV = Probability × Impact',
    variables: [
      { symbol: 'P', meaning: 'Probability of the risk occurring (0 to 1)' },
      { symbol: 'I', meaning: 'Impact in monetary terms (positive for opportunities, negative for threats)' },
    ],
    interpretation: 'The weighted monetary value of a risk event. Used in decision tree analysis.',
    whenToUse: 'When calculating the expected value of risks, especially in decision tree analysis or comparing risk response options.',
    examScenario: 'A risk has 30% probability and $50,000 impact. EMV = 0.30 × $50,000 = $15,000. This risk\'s expected cost is $15,000.',
    ritaTip: 'Threats have NEGATIVE impact. Opportunities have POSITIVE impact. Sum all EMVs for the total expected value of a decision path.',
    example: { setup: 'P = 30%, I = −$50,000 (threat)', calculation: '0.30 × −$50,000', result: '−$15,000' },
    goodBad: 'Negative = threat cost | Positive = opportunity value',
  },
  {
    id: 'sigma',
    name: 'Standard Deviation (σ) — PERT',
    category: 'statistics',
    formula: 'σ = (P − O) ÷ 6',
    variables: [
      { symbol: 'P', meaning: 'Pessimistic estimate' },
      { symbol: 'O', meaning: 'Optimistic estimate' },
    ],
    interpretation: 'Measures the range/uncertainty of an estimate. Larger σ = more uncertainty.',
    whenToUse: 'When asked about the uncertainty or confidence level of a PERT estimate.',
    examScenario: 'O=4, P=16. σ = (16−4) ÷ 6 = 2. The estimate has ±2 days of standard deviation.',
    confusionAlert: {
      confusedWith: 'Variance (σ²)',
      difference: 'Standard deviation = (P−O)/6. Variance = σ². The exam may ask for one when you\'re used to calculating the other.',
    },
    ritaTip: 'Remember: ±1σ = 68.3% confident, ±2σ = 95.5% confident, ±3σ = 99.7% confident. The exam loves ±2σ!',
    goodBad: 'Smaller σ = more certain estimate | Larger σ = more uncertain',
  },
  {
    id: 'pv-present-value',
    name: 'Present Value (PV)',
    category: 'statistics',
    formula: 'PV = FV ÷ (1 + r)ⁿ',
    variables: [
      { symbol: 'FV', meaning: 'Future Value — the value of money in the future' },
      { symbol: 'r', meaning: 'Interest/discount rate per period' },
      { symbol: 'n', meaning: 'Number of periods' },
    ],
    interpretation: 'What is future money worth today? Used in project selection.',
    whenToUse: 'When comparing projects based on the value of future returns in today\'s dollars. Higher PV = better investment.',
    examScenario: 'Project will return $110,000 in 2 years. Discount rate is 5%. PV = $110,000 ÷ (1.05)² = $99,773. That future money is worth ~$99,773 today.',
    ritaTip: 'Higher present value = better project. If comparing two projects, choose the one with the higher NPV (Net Present Value).',
    goodBad: 'Higher PV = better investment',
  },
]
