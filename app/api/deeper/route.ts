import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Framework context injected into every prompt ──────────────────────────────

const FRAMEWORK_CONTEXT: Record<string, string> = {
  pmbok7: `You are an elite PMP exam coach with deep mastery of:
- PMBOK 7th Edition (8 Performance Domains: Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty)
- ECO 2021 domain weightings (People 42%, Process 50%, Business Environment 8%)
- Rita Mulcahy's PMP Exam Prep (latest available edition)
- PMI's Agile Practice Guide

The current PMP exam is based on PMBOK 7 + ECO 2021. Approx 50% predictive, 50% agile/hybrid.`,

  pmbok8: `You are an elite PMP exam coach with deep mastery of:
- PMBOK 8th Edition (updated principles, performance domains, and tailoring guidance)
- ECO 2026 domain weightings and updated task statements (reflecting the latest PMI examination content outline)
- Rita Mulcahy's most current PMP Exam Prep materials (8th edition or latest available)
- PMI's updated Agile Practice Guide and Disciplined Agile guidance

The upcoming PMP exam evolution is based on PMBOK 8 + ECO 2026. Key shifts include: greater emphasis on tailoring, value delivery, hybrid approaches, AI-augmented project management, and sustainability in project work.`,
}

const FRAMEWORK_BADGE: Record<string, string> = {
  pmbok7: 'PMBOK 7 · ECO 2021 · Rita Mulcahy',
  pmbok8: 'PMBOK 8 · ECO 2026 · Rita Mulcahy (Latest)',
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

function buildPrompt(
  sectionType: string,
  content: Record<string, string> | string,
  lessonTitle: string,
  domain: string,
  framework: string
): string {
  const frameworkCtx = FRAMEWORK_CONTEXT[framework] ?? FRAMEWORK_CONTEXT.pmbok7
  const base = `${frameworkCtx}

Your learner is studying "${lessonTitle}" in the ${domain} Performance Domain. Be thorough, exam-focused, and use concrete examples. Format with the ## headers shown.`

  const frameworkNote =
    framework === 'pmbok8'
      ? '\n\n> **Note:** Ground all content in PMBOK 8 principles and ECO 2026 task statements. Where PMBOK 8 introduces changes from PMBOK 7, highlight them clearly so the learner understands the evolution.'
      : ''

  if (sectionType === 'concept') {
    const c = content as Record<string, string>
    return `${base}${frameworkNote}

The learner wants to go DEEPER on this Key Concept:
TERM: ${c.term}
DEFINITION: ${c.definition}

Generate a rich deep-dive with ALL of the following sections:

## 🎯 Exam Scenarios
Describe 3 specific PMP exam question patterns that test this concept. For each: explain the setup, what makes it tricky, and what the correct approach is. Be specific about PMI's thinking.${framework === 'pmbok8' ? ' Ground these in ECO 2026 task statements.' : ''}

## 🌍 Real-World Example
A vivid, concrete project scenario (3-4 sentences) that brings this concept to life. Make it feel like a real PM situation a candidate would recognize.

## ❌ Common Misconceptions
What do exam candidates typically get wrong? List 3 misconceptions with the correction for each.

## 📋 Case Study
A detailed project case study (4-5 paragraphs) illustrating this concept. Include: the project context, the challenge faced, how this concept applied, what went right or wrong, and the lesson learned. Make it realistic and instructive.

## 💡 Rita Mulcahy's Deeper Take
What specific advice does Rita give on this concept in her ${framework === 'pmbok8' ? 'most current' : ''} Exam Prep materials? Include any mnemonics, tricks, or memory aids she recommends.${framework === 'pmbok8' ? '\n\n## 🆕 PMBOK 8 Evolution\nHow does PMBOK 8 or ECO 2026 change, refine, or expand on this concept compared to PMBOK 7? What should the learner specifically update in their understanding?' : ''}`
  }

  if (sectionType === 'deepdive') {
    const c = content as Record<string, string>
    return `${base}${frameworkNote}

The learner wants to go DEEPER on this Deep Dive section:
HEADING: ${c.heading}
CONTENT: ${c.content}

Generate an advanced analysis with ALL of the following sections:

## 🔬 Advanced Analysis
Go significantly deeper — what nuances, edge cases, and advanced considerations exist beyond what was covered? What do expert PMs understand that beginners miss?

## 📚 Additional Frameworks & Models
What additional frameworks, models, or theories from ${framework === 'pmbok8' ? 'PMBOK 8, ECO 2026' : 'PMBOK 7, ECO 2021'}, or Rita Mulcahy relate directly to this? Explain each briefly and how it connects.

## 📋 Case Study
A detailed, realistic project case study (5-6 paragraphs) showing this concept in a complex scenario. Include the organizational context, the challenge, the PM's decision-making process, what tools or techniques were used, the outcome, and the lesson. Make it nuanced — not everything needs to go perfectly.

## 🔗 Performance Domain Connections
How does this topic connect to other ${framework === 'pmbok8' ? 'PMBOK 8' : 'PMBOK 7'} Performance Domains? What are the key interdependencies and how does a PM navigate them?

## 🎯 Advanced Exam Patterns
The trickiest, most situational exam question patterns on this topic. Explain the PMI mindset behind them and what separates the correct answer from the attractive wrong ones.${framework === 'pmbok8' ? '\n\n## 🆕 PMBOK 8 & ECO 2026 Updates\nWhat does PMBOK 8 or ECO 2026 specifically add, change, or emphasise in this area? How should the learner adjust their exam preparation approach?' : ''}`
  }

  if (sectionType === 'tip') {
    return `${base}${frameworkNote}

The learner wants to understand this Exam Tip more deeply:
TIP: "${content as string}"

Generate a deep explanation with ALL of the following sections:

## 🧠 The PMI Reasoning
Why does PMI test this specific concept this way? What underlying principle or philosophy drives this tip? Connect it to PMI's project management values${framework === 'pmbok8' ? ' and PMBOK 8 principles' : ''}.

## 📝 Practice Scenarios
3 specific practice scenarios showing this tip in action. For each: describe the situation, what the wrong instinct would be, and what the correct PMI-aligned approach is.

## ⚠️ Trap Answer Patterns
Describe exactly what wrong answers on this topic look like. What makes them attractive? What is the signal that tells you they are wrong?

## 🔗 Connected Exam Tips
2-3 closely related exam tips that reinforce or complement this one. Explain how they connect.${framework === 'pmbok8' ? '\n\n## 🆕 ECO 2026 Alignment\nHow does this tip align with or evolve under the ECO 2026 task statements? Any nuances the learner should know for the updated exam?' : ''}`
  }

  if (sectionType === 'rita') {
    return `${base}${frameworkNote}

The learner wants to go deeper on Rita Mulcahy's insight:
INSIGHT: "${content as string}"

Generate a rich expansion with ALL of the following sections:

## 📖 Rita's Full Teaching
What does Rita say more broadly about this topic across her ${framework === 'pmbok8' ? 'most current' : ''} Exam Prep materials? Expand significantly beyond the quoted insight with her full perspective and approach.

## 🔧 Rita's Techniques & Tricks
Specific techniques, memory aids, mnemonics, and approaches Rita recommends for mastering this area. Be as specific and practical as possible.

## 🗺️ ${framework === 'pmbok8' ? 'ECO 2026 Framework Connection' : 'ECO 2021 Framework Connection'}
How does this insight connect to the ${framework === 'pmbok8' ? 'ECO 2026 domain weightings and updated task statements' : 'ECO 2021 domain weightings (People 42%, Process 50%, Business Environment 8%)'}? Why does PMI weight it this way?

## 💬 Apply Rita's Approach
Take 2-3 realistic exam question scenarios and show how applying Rita's specific approach leads to the correct answer. Walk through the thinking step by step.${framework === 'pmbok8' ? "\n\n## 🆕 Rita on PMBOK 8\nWhat does Rita's most current guidance say about changes introduced in PMBOK 8 and ECO 2026? How does she recommend candidates adapt their preparation?" : ''}`
  }

  if (sectionType === 'pitfall') {
    return `${base}${frameworkNote}

The learner wants to understand this Common Pitfall deeply:
PITFALL: "${content as string}"

Generate a thorough analysis with ALL of the following sections:

## 🔍 Root Cause Analysis
Why do candidates fall into this trap? What underlying misconception, habit, or assumption drives it? Where does it come from?

## 🎯 How It Shows Up on the Exam
Describe exactly how this pitfall appears in PMP exam questions. What does the trap answer look like? What makes it attractive? What is the signal that it is wrong?

## ✅ The Correct Mental Model
Replace the wrong thinking pattern with the correct one. Explain clearly how a PMI-aligned PM thinks about this situation instead, grounded in ${framework === 'pmbok8' ? 'PMBOK 8 principles and ECO 2026' : 'PMBOK 7 performance domains and ECO 2021'}.

## 📋 Recovery Scenario
A brief scenario (2-3 paragraphs) where a PM falls into this pitfall in a real project, the consequences, and how they course-correct. Make the lesson visceral and memorable.

## 🛡️ Prevention Strategies
3-4 specific, actionable strategies to avoid this pitfall both in the exam and in real project management practice.${framework === 'pmbok8' ? '\n\n## 🆕 PMBOK 8 / ECO 2026 Angle\nDoes PMBOK 8 or ECO 2026 make this pitfall more or less likely? Any new traps introduced by the updated framework that candidates should watch out for?' : ''}`
  }

  return `${base}${frameworkNote}\n\nGo deeper on: "${content as string}"\n\nProvide a thorough, exam-focused analysis with practical examples and case studies.`
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sectionType, content, lessonTitle, domain, framework = 'pmbok7' } = await req.json()

  const prompt = buildPrompt(sectionType, content, lessonTitle, domain, framework)

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 2500,
    system: `You are generating deep educational content for a PMP exam preparation platform. 
Framework in use: ${FRAMEWORK_BADGE[framework] ?? FRAMEWORK_BADGE.pmbok7}.
Always ground your analysis in the specified framework. Be precise, exam-focused, and genuinely educational.`,
    messages: [{ role: 'user', content: prompt }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}