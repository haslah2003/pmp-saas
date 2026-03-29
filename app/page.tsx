import Link from "next/link";

const features = [
  { icon: "🗺️", title: "Interactive Mind Map", desc: "Visual overview of PMBOK 7th Edition and all 35 ECO tasks" },
  { icon: "📝", title: "AI Study Notes", desc: "Comprehensive, self-contained notes for every concept with PMI citations" },
  { icon: "🎧", title: "Audio Narration", desc: "Studio-quality AI voice explanations powered by ElevenLabs" },
  { icon: "🃏", title: "Smart Flashcards", desc: "AI-generated flashcards with questions, answers, and PMI sources" },
  { icon: "✅", title: "Scenario Quizzes", desc: "Multi-level exam questions with rationale and PMI Mindset guidance" },
  { icon: "🤖", title: "AI Expert Tutor", desc: "Ask anything — answers grounded exclusively in PMBOK 7 + ECO 2021" },
  { icon: "🎓", title: "Mock Exams", desc: "Timed exam simulations with ECO domain weightings and detailed review" },
  { icon: "📚", title: "Structured Course", desc: "Module-by-module learning path covering all exam domains" },
];

const stats = [
  { value: "42%", label: "People Domain" },
  { value: "50%", label: "Process Domain" },
  { value: "8%", label: "Business Environment" },
  { value: "180", label: "Exam Questions" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span className="text-xl font-bold text-brand-800">PMP Expert Tutor</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-500">
            Pricing
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-500">
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-brand-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-600 transition"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <div className="inline-block bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          PMBOK 7th Edition + ECO 2021 — Source-Locked
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-brand-800 leading-tight mb-6">
          Pass the PMP Exam
          <br />
          <span className="text-brand-500">With AI Precision</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The only AI-powered PMP prep platform grounded exclusively in official PMI sources.
          Study notes, audio narration, flashcards, mock exams, and an expert AI tutor —
          all from PMBOK Guide 7th Edition and PMP ECO 2021.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-brand-500 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-500/25"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/pricing"
            className="border-2 border-brand-200 text-brand-600 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-50 transition"
          >
            View Plans
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-800 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm text-brand-200 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-800 mb-4">
          Everything You Need to Pass
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          Every feature powered by AI, every answer sourced from official PMI publications.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-lg transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-brand-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Ace the PMP?
        </h2>
        <p className="text-brand-100 mb-8 max-w-lg mx-auto">
          Join thousands of professionals preparing for the PMP certification with AI-powered precision.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-white text-brand-600 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-brand-50 transition shadow-lg"
        >
          Start Your Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-gray-400">
        <p>© 2026 PMP Expert Tutor. Sources: PMBOK® Guide 7th Edition (2021) + PMP ECO January 2021 — PMI.</p>
        <p className="mt-1">PMP® is a registered mark of Project Management Institute, Inc.</p>
      </footer>
    </div>
  );
}
