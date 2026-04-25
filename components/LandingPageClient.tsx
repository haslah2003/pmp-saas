"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import LandingLanguageSelector from "@/components/LandingLanguageSelector";

const C = { teal: "#1AB0A2", tealDk: "#148F84", tealLt: "#E6F8F6", purple: "#5B2D91", purpleDk: "#472272", purpleLt: "#F0EAFA", amber: "#F5A623", amberLt: "#FFF7E6", dark: "#1A1430", muted: "#5E6078", bg: "#FAFAF9" };

const copy = {
  en: {
    nav: { pricing: "Pricing", login: "Sign In", cta: "Get Started Free" },
    hero: { badge1: "PMBOK 7 + ECO 2021", badge2: "PMBOK 8 + ECO 2026", h1a: "Pass your PMP exam", h1b: "with ", h1c: "AI-powered", h1d: " mastery", sub: "The intelligent study companion that adapts to your level, explains like a personal mentor, and tracks your readiness \u2014 so you pass with confidence.", cta1: "Try the AI tutor \u2014 free", cta2: "See how it works", s1v: "24/7", s1l: "AI access", s2v: "540+", s2l: "questions", s3v: "2", s3l: "PMBOK editions", upload: "Click to upload hero image", uploadHint: "Recommended: 800\u00d7600 or 16:9" },
    features: { label: "Features", title: "Everything you need to pass \u2014 nothing you don\u2019t", items: [
      { icon: "\ud83e\udd16", title: "AI tutor", desc: "Ask anything about PMBOK. Get exam-level explanations adapted to your understanding \u2014 instantly." },
      { icon: "\ud83e\udde0", title: "MindMap explorer", desc: "Visual knowledge maps with AI \u2018Go Deeper\u2019 panel. See the full picture, then zoom into every detail." },
      { icon: "\ud83d\udcdd", title: "Practice engine", desc: "Situational questions with detailed rationales. Guru Reports pinpoint your weak areas." },
      { icon: "\ud83c\udfa7", title: "Audio lessons", desc: "ElevenLabs-narrated content with expert personas. Study on your commute, at the gym, anywhere." },
      { icon: "\ud83d\udcca", title: "Progress dashboard", desc: "Track study time, readiness score, and domain mastery with visual analytics." },
      { icon: "\ud83d\udd04", title: "Dual framework", desc: "Both PMBOK 7 + ECO 2021 and PMBOK 8 + ECO 2026 \u2014 choose your exam path." },
    ]},
    how: { label: "How it works", title: "Four steps to PMP success", steps: [
      { num: "01", title: "Create your account", desc: "Sign up in seconds. Start with Basic or go straight to Standard \u2014 no long commitments." },
      { num: "02", title: "Learn with your AI tutor", desc: "Ask questions, explore MindMaps, take practice quizzes. The AI adapts to how you learn." },
      { num: "03", title: "Track & master", desc: "Use Guru Reports to find weak spots. Retake targeted practice until every domain is green." },
      { num: "04", title: "Pass your exam", desc: "Walk into the testing centre confident. You\u2019ve trained with the smartest PMP prep available." },
    ]},
    pricing: { label: "Pricing", title: "Invest in your PMP success", sub: "Join thousands of professionals who passed their PMP exam with our AI-powered preparation platform. Cancel anytime.", monthly: "Monthly", annual: "Annual", saveBadge: "Save up to 43%", perMonth: "monthly/", orYear: "or", yearSuffix: "/year \u2014 Save", secured: "Secured by PayPal", cards: "Debit or credit card", cancel: "Cancel anytime", plans: [
      { name: "Basic", emoji: "\ud83d\ude80", tagline: "Everything you need to start your PMP journey", monthly: 9, annual: 69, annualSave: "36%", features: ["Full Course Library (24 lessons)", "AI Tutor \u2014 unlimited sessions", "Practice Engine \u2014 60 questions", "Progress Dashboard", "Interactive Mind Maps", "BOK 7 + ECO 2021 framework"], cta: "Get Basic", popular: false },
      { name: "Standard", emoji: "\u26a1", tagline: "The complete PMP exam preparation toolkit", monthly: 19, annual: 139, annualSave: "39%", features: ["Everything in Basic \u2705", "Practice Engine \u2014 unlimited questions", "Mock Exam (180 questions)", "Guru Report & weak area analysis", "Go Deeper AI expansions", "BOK 7 + ECO 2021 framework", "Priority content updates"], cta: "Get Standard", popular: true },
      { name: "Professional", emoji: "\ud83d\udc8e", tagline: "Maximum depth for serious PMP candidates", monthly: 29, annual: 199, annualSave: "43%", features: ["Everything in Standard \u2705", "PMBOK 8 + ECO 2026 framework", "AI Question Bank (540 questions)", "Personalised study plan", "Priority support", "Lifetime content updates", "Pass guarantee materials"], cta: "Get Professional", popular: false },
    ]},
    compare: { label: "Comparison", title: "How we compare", cols: ["", "PMP Expert Tutor", "Bootcamps", "Video courses"], rows: [["AI-powered tutoring","\u2713","\u2717","\u2717"],["Adaptive learning","\u2713","\u2717","\u2717"],["Visual MindMaps","\u2713","\u2717","Some"],["Audio narration","\u2713","\u2717","\u2713"],["PMBOK 8 + ECO 2026","\u2713","Varies","Rare"],["Starting price","$9/mo","$500\u20132,000","$100\u2013300"],["24/7 availability","\u2713","\u2717","\u2713"]]},
    faq: { label: "FAQ", title: "Frequently asked questions", items: [
      { q: "Is this aligned with the current PMP exam?", a: "Yes. We cover both PMBOK 7 + ECO 2021 (current exam) and PMBOK 8 + ECO 2026 (upcoming refresh). You choose your track based on your exam date." },
      { q: "How does the AI tutor work?", a: "Ask any PMP-related question in natural language. The tutor explains using official PMBOK frameworks, adapts to your level, and provides exam-relevant examples \u2014 available 24/7." },
      { q: "Can I study on my phone?", a: "Absolutely. The entire platform is fully responsive \u2014 AI tutor, MindMaps, practice exams, and audio lessons all work seamlessly on mobile and tablet." },
      { q: "What payment methods do you accept?", a: "We accept PayPal and all major debit/credit cards. All payments are securely processed through PayPal. Cancel anytime." },
      { q: "Can I switch plans later?", a: "Yes. Upgrade or downgrade at any time from your account settings. When upgrading, you only pay the difference for the remainder of your billing cycle." },
      { q: "What\u2019s the difference between Standard and Professional?", a: "Professional adds PMBOK 8 + ECO 2026 content, a 540-question AI question bank, personalised study plans, priority support, and lifetime content updates \u2014 ideal if you want maximum preparation depth." },
    ]},
    finalCta: { title: "Ready to pass your PMP?", sub: "Join project professionals across the GCC who are studying smarter with AI. Start with Basic \u2014 upgrade when you\u2019re ready.", btn: "Get started \u2014 from $9/month" },
    footer: { by: "by", line1: "\u00a9 2026 PMP Expert Tutor by AiTuTorZ. Content sourced exclusively from PMBOK\u00ae Guide 7th Edition (2021), PMBOK\u00ae Guide 8th Edition, PMP Examination Content Outline \u2014 January 2021 & 2026.", line2: "PMP\u00ae is a registered mark of Project Management Institute, Inc. This platform is not affiliated with or endorsed by PMI.", product: "Product", legal: "Legal", privacy: "Privacy policy", terms: "Terms of service", contact: "Contact" },
  },
  ar: {
    nav: { pricing: "\u0627\u0644\u0623\u0633\u0639\u0627\u0631", login: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644", cta: "\u0627\u0628\u062f\u0623 \u0645\u062c\u0627\u0646\u064b\u0627" },
    hero: { badge1: "PMBOK 7 + ECO 2021", badge2: "PMBOK 8 + ECO 2026", h1a: "\u0627\u062c\u062a\u0632 \u0627\u062e\u062a\u0628\u0627\u0631 PMP", h1b: "\u0628\u0642\u0648\u0629 ", h1c: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", h1d: "", sub: "\u0631\u0641\u064a\u0642\u0643 \u0627\u0644\u0630\u0643\u064a \u0641\u064a \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0627\u0644\u0630\u064a \u064a\u062a\u0643\u064a\u0651\u0641 \u0645\u0639 \u0645\u0633\u062a\u0648\u0627\u0643\u060c \u0648\u064a\u0634\u0631\u062d \u0643\u0645\u0631\u0634\u062f \u0634\u062e\u0635\u064a\u060c \u0648\u064a\u062a\u0627\u0628\u0639 \u062c\u0627\u0647\u0632\u064a\u062a\u0643 \u2014 \u0644\u062a\u062c\u062a\u0627\u0632 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0628\u062b\u0642\u0629.", cta1: "\u062c\u0631\u0651\u0628 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0630\u0643\u064a \u2014 \u0645\u062c\u0627\u0646\u064b\u0627", cta2: "\u0634\u0627\u0647\u062f \u0643\u064a\u0641 \u064a\u0639\u0645\u0644", s1v: "24/7", s1l: "\u0648\u0635\u0648\u0644 \u0644\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", s2v: "+540", s2l: "\u0633\u0624\u0627\u0644", s3v: "2", s3l: "\u0625\u0635\u062f\u0627\u0631\u064a PMBOK", upload: "\u0627\u0646\u0642\u0631 \u0644\u062a\u062d\u0645\u064a\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u0628\u0637\u0644", uploadHint: "\u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0645\u0648\u0635\u0649: 800\u00d7600 \u0623\u0648 16:9" },
    features: { label: "\u0627\u0644\u0645\u0632\u0627\u064a\u0627", title: "\u0643\u0644 \u0645\u0627 \u062a\u062d\u062a\u0627\u062c\u0647 \u0644\u0644\u0646\u062c\u0627\u062d \u2014 \u0648\u0644\u0627 \u0634\u064a\u0621 \u0632\u0627\u0626\u062f", items: [
      { icon: "\ud83e\udd16", title: "\u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0630\u0643\u064a", desc: "\u0627\u0633\u0623\u0644 \u0623\u064a \u0634\u064a\u0621 \u0639\u0646 PMBOK. \u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0634\u0631\u0648\u062d\u0627\u062a \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0645\u064f\u0643\u064a\u0651\u0641\u0629 \u062d\u0633\u0628 \u0641\u0647\u0645\u0643 \u2014 \u0641\u0648\u0631\u064b\u0627." },
      { icon: "\ud83e\udde0", title: "\u0645\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0630\u0647\u0646\u064a\u0629", desc: "\u062e\u0631\u0627\u0626\u0637 \u0645\u0639\u0631\u0641\u064a\u0629 \u0645\u0631\u0626\u064a\u0629 \u0645\u0639 \u0644\u0648\u062d\u0629 '\u062a\u0639\u0645\u0651\u0642 \u0623\u0643\u062b\u0631' \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0634\u0627\u0647\u062f \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u062b\u0645 \u062a\u0639\u0645\u0651\u0642 \u0641\u064a \u0643\u0644 \u062a\u0641\u0635\u064a\u0644." },
      { icon: "\ud83d\udcdd", title: "\u0645\u062d\u0631\u0651\u0643 \u0627\u0644\u062a\u0645\u0627\u0631\u064a\u0646", desc: "\u0623\u0633\u0626\u0644\u0629 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0633\u064a\u0646\u0627\u0631\u064a\u0648 \u0645\u0639 \u062a\u0641\u0633\u064a\u0631\u0627\u062a \u0645\u0641\u0635\u0651\u0644\u0629. \u062a\u0642\u0627\u0631\u064a\u0631 \u062e\u0628\u064a\u0631 \u062a\u062d\u062f\u0651\u062f \u0646\u0642\u0627\u0637 \u0636\u0639\u0641\u0643." },
      { icon: "\ud83c\udfa7", title: "\u062f\u0631\u0648\u0633 \u0635\u0648\u062a\u064a\u0629", desc: "\u0645\u062d\u062a\u0648\u0649 \u0645\u0631\u0648\u064a \u0628\u0623\u0635\u0648\u0627\u062a \u062e\u0628\u0631\u0627\u0621 \u0645\u0646 ElevenLabs. \u0627\u062f\u0631\u0633 \u0641\u064a \u062a\u0646\u0642\u0644\u0627\u062a\u0643\u060c \u0641\u064a \u0627\u0644\u062c\u064a\u0645\u060c \u0641\u064a \u0623\u064a \u0645\u0643\u0627\u0646." },
      { icon: "\ud83d\udcca", title: "\u0644\u0648\u062d\u0629 \u062a\u062a\u0628\u0651\u0639 \u0627\u0644\u062a\u0642\u062f\u0651\u0645", desc: "\u062a\u0627\u0628\u0639 \u0648\u0642\u062a \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0648\u0646\u0633\u0628\u0629 \u0627\u0644\u062c\u0627\u0647\u0632\u064a\u0629 \u0648\u0625\u062a\u0642\u0627\u0646 \u0627\u0644\u0645\u062c\u0627\u0644\u0627\u062a \u0628\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0645\u0631\u0626\u064a\u0629." },
      { icon: "\ud83d\udd04", title: "\u0625\u0637\u0627\u0631 \u0645\u0632\u062f\u0648\u062c", desc: "\u0643\u0644\u0627 \u0627\u0644\u0625\u0637\u0627\u0631\u064a\u0646 PMBOK 7 + ECO 2021 \u0648 PMBOK 8 + ECO 2026 \u2014 \u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631 \u0627\u062e\u062a\u0628\u0627\u0631\u0643." },
    ]},
    how: { label: "\u0643\u064a\u0641 \u064a\u0639\u0645\u0644", title: "\u0623\u0631\u0628\u0639 \u062e\u0637\u0648\u0627\u062a \u0646\u062d\u0648 \u0646\u062c\u0627\u062d PMP", steps: [
      { num: "01", title: "\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0643", desc: "\u0633\u062c\u0651\u0644 \u0641\u064a \u062b\u0648\u0627\u0646\u064d. \u0627\u0628\u062f\u0623 \u0628\u0627\u0644\u0623\u0633\u0627\u0633\u064a \u0623\u0648 \u0627\u0646\u062a\u0642\u0644 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0644\u0642\u064a\u0627\u0633\u064a \u2014 \u0628\u062f\u0648\u0646 \u0627\u0644\u062a\u0632\u0627\u0645\u0627\u062a \u0637\u0648\u064a\u0644\u0629." },
      { num: "02", title: "\u062a\u0639\u0644\u0651\u0645 \u0645\u0639 \u0645\u0639\u0644\u0645\u0643 \u0627\u0644\u0630\u0643\u064a", desc: "\u0627\u0637\u0631\u062d \u0623\u0633\u0626\u0644\u0629\u060c \u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0630\u0647\u0646\u064a\u0629\u060c \u062e\u0636 \u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u062a\u062f\u0631\u064a\u0628\u064a\u0629. \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u064a\u062a\u0643\u064a\u0651\u0641 \u0645\u0639 \u0637\u0631\u064a\u0642\u0629 \u062a\u0639\u0644\u0651\u0645\u0643." },
      { num: "03", title: "\u062a\u062a\u0628\u0651\u0639 \u0648\u0623\u062a\u0642\u0646", desc: "\u0627\u0633\u062a\u062e\u062f\u0645 \u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u062e\u0628\u064a\u0631 \u0644\u0627\u0643\u062a\u0634\u0627\u0641 \u0646\u0642\u0627\u0637 \u0627\u0644\u0636\u0639\u0641. \u0623\u0639\u062f \u0627\u0644\u062a\u0645\u0627\u0631\u064a\u0646 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u0629 \u062d\u062a\u0649 \u064a\u0635\u0628\u062d \u0643\u0644 \u0645\u062c\u0627\u0644 \u0623\u062e\u0636\u0631." },
      { num: "04", title: "\u0627\u062c\u062a\u0632 \u0627\u062e\u062a\u0628\u0627\u0631\u0643", desc: "\u0627\u062f\u062e\u0644 \u0645\u0631\u0643\u0632 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0628\u062b\u0642\u0629. \u0644\u0642\u062f \u062a\u062f\u0631\u0651\u0628\u062a \u0628\u0623\u0630\u0643\u0649 \u0623\u062f\u0627\u0629 \u062a\u062d\u0636\u064a\u0631 \u0644\u0640 PMP \u0645\u062a\u0627\u062d\u0629." },
    ]},
    pricing: { label: "\u0627\u0644\u0623\u0633\u0639\u0627\u0631", title: "\u0627\u0633\u062a\u062b\u0645\u0631 \u0641\u064a \u0646\u062c\u0627\u062d\u0643 \u0628\u0640 PMP", sub: "\u0627\u0646\u0636\u0645 \u0644\u0622\u0644\u0627\u0641 \u0627\u0644\u0645\u062d\u062a\u0631\u0641\u064a\u0646 \u0627\u0644\u0630\u064a\u0646 \u0627\u062c\u062a\u0627\u0632\u0648\u0627 \u0627\u062e\u062a\u0628\u0627\u0631 PMP \u0628\u0645\u0646\u0635\u062a\u0646\u0627 \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0625\u0644\u063a\u0627\u0621 \u0641\u064a \u0623\u064a \u0648\u0642\u062a.", monthly: "\u0634\u0647\u0631\u064a", annual: "\u0633\u0646\u0648\u064a", saveBadge: "\u0648\u0641\u0651\u0631 \u062d\u062a\u0649 43%", perMonth: "\u0634\u0647\u0631\u064a\u064b\u0627/", orYear: "\u0623\u0648", yearSuffix: "/\u0633\u0646\u0629 \u2014 \u0648\u0641\u0651\u0631", secured: "\u0645\u062d\u0645\u064a \u0628\u0648\u0627\u0633\u0637\u0629 PayPal", cards: "\u0628\u0637\u0627\u0642\u0629 \u062e\u0635\u0645 \u0623\u0648 \u0627\u0626\u062a\u0645\u0627\u0646", cancel: "\u0625\u0644\u063a\u0627\u0621 \u0641\u064a \u0623\u064a \u0648\u0642\u062a", plans: [
      { name: "\u0623\u0633\u0627\u0633\u064a", emoji: "\ud83d\ude80", tagline: "\u0643\u0644 \u0645\u0627 \u062a\u062d\u062a\u0627\u062c\u0647 \u0644\u0628\u062f\u0621 \u0631\u062d\u0644\u0629 PMP", monthly: 9, annual: 69, annualSave: "36%", features: ["\u0645\u0643\u062a\u0628\u0629 \u0627\u0644\u062f\u0648\u0631\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 (24 \u062f\u0631\u0633\u064b\u0627)", "\u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0630\u0643\u064a \u2014 \u062c\u0644\u0633\u0627\u062a \u063a\u064a\u0631 \u0645\u062d\u062f\u0648\u062f\u0629", "\u0645\u062d\u0631\u0651\u0643 \u0627\u0644\u062a\u0645\u0627\u0631\u064a\u0646 \u2014 60 \u0633\u0624\u0627\u0644\u064b\u0627", "\u0644\u0648\u062d\u0629 \u062a\u062a\u0628\u0651\u0639 \u0627\u0644\u062a\u0642\u062f\u0651\u0645", "\u062e\u0631\u0627\u0626\u0637 \u0630\u0647\u0646\u064a\u0629 \u062a\u0641\u0627\u0639\u0644\u064a\u0629", "\u0625\u0637\u0627\u0631 BOK 7 + ECO 2021"], cta: "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u0623\u0633\u0627\u0633\u064a", popular: false },
      { name: "\u0642\u064a\u0627\u0633\u064a", emoji: "\u26a1", tagline: "\u0645\u062c\u0645\u0648\u0639\u0629 \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u062a\u062d\u0636\u064a\u0631 \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0644\u0627\u062e\u062a\u0628\u0627\u0631 PMP", monthly: 19, annual: 139, annualSave: "39%", features: ["\u0643\u0644 \u0634\u064a\u0621 \u0641\u064a \u0627\u0644\u0623\u0633\u0627\u0633\u064a \u2705", "\u0645\u062d\u0631\u0651\u0643 \u0627\u0644\u062a\u0645\u0627\u0631\u064a\u0646 \u2014 \u0623\u0633\u0626\u0644\u0629 \u063a\u064a\u0631 \u0645\u062d\u062f\u0648\u062f\u0629", "\u0627\u062e\u062a\u0628\u0627\u0631 \u0645\u062d\u0627\u0643\u0627\u0629 (180 \u0633\u0624\u0627\u0644\u064b\u0627)", "\u062a\u0642\u0631\u064a\u0631 \u062e\u0628\u064a\u0631 \u0648\u062a\u062d\u0644\u064a\u0644 \u0646\u0642\u0627\u0637 \u0627\u0644\u0636\u0639\u0641", "\u062a\u0648\u0633\u0639\u0627\u062a \u062a\u0639\u0645\u0651\u0642 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a", "\u0625\u0637\u0627\u0631 BOK 7 + ECO 2021", "\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0645\u062d\u062a\u0648\u0649 \u0630\u0627\u062a \u0623\u0648\u0644\u0648\u064a\u0629"], cta: "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u0642\u064a\u0627\u0633\u064a", popular: true },
      { name: "\u0627\u062d\u062a\u0631\u0627\u0641\u064a", emoji: "\ud83d\udc8e", tagline: "\u0627\u0644\u0639\u0645\u0642 \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0645\u0631\u0634\u062d\u064a\u0646 \u0627\u0644\u062c\u0627\u062f\u064a\u0646 \u0644\u0640 PMP", monthly: 29, annual: 199, annualSave: "43%", features: ["\u0643\u0644 \u0634\u064a\u0621 \u0641\u064a \u0627\u0644\u0642\u064a\u0627\u0633\u064a \u2705", "\u0625\u0637\u0627\u0631 PMBOK 8 + ECO 2026", "\u0628\u0646\u0643 \u0623\u0633\u0626\u0644\u0629 \u0630\u0643\u064a (540 \u0633\u0624\u0627\u0644\u064b\u0627)", "\u062e\u0637\u0629 \u062f\u0631\u0627\u0633\u0629 \u0645\u062e\u0635\u0651\u0635\u0629", "\u062f\u0639\u0645 \u0630\u0648 \u0623\u0648\u0644\u0648\u064a\u0629", "\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0645\u062d\u062a\u0648\u0649 \u0645\u062f\u0649 \u0627\u0644\u062d\u064a\u0627\u0629", "\u0645\u0648\u0627\u062f \u0636\u0645\u0627\u0646 \u0627\u0644\u0646\u062c\u0627\u062d"], cta: "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0641\u064a", popular: false },
    ]},
    compare: { label: "\u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629", title: "\u0643\u064a\u0641 \u0646\u062a\u0645\u064a\u0651\u0632", cols: ["", "PMP Expert Tutor", "\u0645\u0639\u0633\u0643\u0631\u0627\u062a \u062a\u062f\u0631\u064a\u0628\u064a\u0629", "\u062f\u0648\u0631\u0627\u062a \u0641\u064a\u062f\u064a\u0648"], rows: [["\u062a\u0639\u0644\u064a\u0645 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a","\u2713","\u2717","\u2717"],["\u062a\u0639\u0644\u0651\u0645 \u062a\u0643\u064a\u0651\u0641\u064a","\u2713","\u2717","\u2717"],["\u062e\u0631\u0627\u0626\u0637 \u0630\u0647\u0646\u064a\u0629 \u0645\u0631\u0626\u064a\u0629","\u2713","\u2717","\u0628\u0639\u0636"],["\u0633\u0631\u062f \u0635\u0648\u062a\u064a","\u2713","\u2717","\u2713"],["PMBOK 8 + ECO 2026","\u2713","\u064a\u062e\u062a\u0644\u0641","\u0646\u0627\u062f\u0631"],["\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0627\u0628\u062a\u062f\u0627\u0626\u064a","$9/\u0634\u0647\u0631","$500\u20132,000","$100\u2013300"],["\u0645\u062a\u0627\u062d 24/7","\u2713","\u2717","\u2713"]]},
    faq: { label: "\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629", title: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u0643\u062b\u0631 \u0634\u064a\u0648\u0639\u064b\u0627", items: [
      { q: "\u0647\u0644 \u0647\u0630\u0627 \u0645\u062a\u0648\u0627\u0641\u0642 \u0645\u0639 \u0627\u062e\u062a\u0628\u0627\u0631 PMP \u0627\u0644\u062d\u0627\u0644\u064a\u061f", a: "\u0646\u0639\u0645. \u0646\u063a\u0637\u0651\u064a \u0643\u0644\u0627 \u0627\u0644\u0625\u0637\u0627\u0631\u064a\u0646 PMBOK 7 + ECO 2021 (\u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u062d\u0627\u0644\u064a) \u0648 PMBOK 8 + ECO 2026 (\u0627\u0644\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0642\u0627\u062f\u0645). \u0627\u062e\u062a\u0631 \u0645\u0633\u0627\u0631\u0643 \u062d\u0633\u0628 \u062a\u0627\u0631\u064a\u062e \u0627\u062e\u062a\u0628\u0627\u0631\u0643." },
      { q: "\u0643\u064a\u0641 \u064a\u0639\u0645\u0644 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0630\u0643\u064a\u061f", a: "\u0627\u0637\u0631\u062d \u0623\u064a \u0633\u0624\u0627\u0644 \u0645\u062a\u0639\u0644\u0642 \u0628\u0640 PMP \u0628\u0644\u063a\u0629 \u0637\u0628\u064a\u0639\u064a\u0629. \u064a\u0634\u0631\u062d \u0627\u0644\u0645\u0639\u0644\u0645 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0623\u064f\u0637\u0631 PMBOK \u0627\u0644\u0631\u0633\u0645\u064a\u0629\u060c \u0648\u064a\u062a\u0643\u064a\u0651\u0641 \u0645\u0639 \u0645\u0633\u062a\u0648\u0627\u0643\u060c \u0648\u064a\u0642\u062f\u0651\u0645 \u0623\u0645\u062b\u0644\u0629 \u0630\u0627\u062a \u0635\u0644\u0629 \u0628\u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u2014 \u0645\u062a\u0627\u062d 24/7." },
      { q: "\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u0627\u0644\u062f\u0631\u0627\u0633\u0629 \u0639\u0644\u0649 \u0647\u0627\u062a\u0641\u064a\u061f", a: "\u0628\u0627\u0644\u062a\u0623\u0643\u064a\u062f. \u0627\u0644\u0645\u0646\u0635\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u062a\u062c\u0627\u0648\u0628\u0629 \u2014 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0630\u0643\u064a \u0648\u0627\u0644\u062e\u0631\u0627\u0626\u0637 \u0627\u0644\u0630\u0647\u0646\u064a\u0629 \u0648\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u0627\u0644\u062a\u0645\u0631\u064a\u0646 \u0648\u0627\u0644\u062f\u0631\u0648\u0633 \u0627\u0644\u0635\u0648\u062a\u064a\u0629 \u062a\u0639\u0645\u0644 \u0628\u0633\u0644\u0627\u0633\u0629 \u0639\u0644\u0649 \u0627\u0644\u062c\u0648\u0627\u0644 \u0648\u0627\u0644\u062c\u0647\u0627\u0632 \u0627\u0644\u0644\u0648\u062d\u064a." },
      { q: "\u0645\u0627 \u0637\u0631\u0642 \u0627\u0644\u062f\u0641\u0639 \u0627\u0644\u0645\u0642\u0628\u0648\u0644\u0629\u061f", a: "\u0646\u0642\u0628\u0644 PayPal \u0648\u062c\u0645\u064a\u0639 \u0628\u0637\u0627\u0642\u0627\u062a \u0627\u0644\u062e\u0635\u0645 \u0648\u0627\u0644\u0627\u0626\u062a\u0645\u0627\u0646 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629. \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u062a\u062a\u0645 \u0628\u0623\u0645\u0627\u0646 \u0639\u0628\u0631 PayPal. \u0625\u0644\u063a\u0627\u0621 \u0641\u064a \u0623\u064a \u0648\u0642\u062a." },
      { q: "\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u062a\u063a\u064a\u064a\u0631 \u062e\u0637\u062a\u064a \u0644\u0627\u062d\u0642\u064b\u0627\u061f", a: "\u0646\u0639\u0645. \u062a\u0631\u0642\u064a\u0629 \u0623\u0648 \u062a\u062e\u0641\u064a\u0636 \u0641\u064a \u0623\u064a \u0648\u0642\u062a \u0645\u0646 \u0625\u0639\u062f\u0627\u062f\u0627\u062a \u062d\u0633\u0627\u0628\u0643. \u0639\u0646\u062f \u0627\u0644\u062a\u0631\u0642\u064a\u0629\u060c \u062a\u062f\u0641\u0639 \u0627\u0644\u0641\u0631\u0642 \u0641\u0642\u0637 \u0644\u0628\u0642\u064a\u0629 \u062f\u0648\u0631\u0629 \u0627\u0644\u0641\u0648\u062a\u0631\u0629." },
      { q: "\u0645\u0627 \u0627\u0644\u0641\u0631\u0642 \u0628\u064a\u0646 \u0627\u0644\u0642\u064a\u0627\u0633\u064a \u0648\u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0641\u064a\u061f", a: "\u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0641\u064a \u064a\u0636\u064a\u0641 \u0645\u062d\u062a\u0648\u0649 PMBOK 8 + ECO 2026\u060c \u0628\u0646\u0643 \u0623\u0633\u0626\u0644\u0629 \u0630\u0643\u064a \u0645\u0646 540 \u0633\u0624\u0627\u0644\u064b\u0627\u060c \u062e\u0637\u0637 \u062f\u0631\u0627\u0633\u0629 \u0645\u062e\u0635\u0651\u0635\u0629\u060c \u062f\u0639\u0645 \u0630\u0648 \u0623\u0648\u0644\u0648\u064a\u0629\u060c \u0648\u062a\u062d\u062f\u064a\u062b\u0627\u062a \u0645\u062d\u062a\u0648\u0649 \u0645\u062f\u0649 \u0627\u0644\u062d\u064a\u0627\u0629 \u2014 \u0645\u062b\u0627\u0644\u064a \u0625\u0630\u0627 \u0623\u0631\u062f\u062a \u0623\u0642\u0635\u0649 \u0639\u0645\u0642 \u0641\u064a \u0627\u0644\u062a\u062d\u0636\u064a\u0631." },
    ]},
    finalCta: { title: "\u0645\u0633\u062a\u0639\u062f \u0644\u0627\u062c\u062a\u064a\u0627\u0632 PMP\u061f", sub: "\u0627\u0646\u0636\u0645 \u0644\u0645\u062d\u062a\u0631\u0641\u064a \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 \u0641\u064a \u0627\u0644\u062e\u0644\u064a\u062c \u0627\u0644\u0630\u064a\u0646 \u064a\u062f\u0631\u0633\u0648\u0646 \u0628\u0630\u0643\u0627\u0621 \u0645\u0639 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a. \u0627\u0628\u062f\u0623 \u0628\u0627\u0644\u0623\u0633\u0627\u0633\u064a \u2014 \u0648\u062a\u0631\u0642\u0651 \u0639\u0646\u062f\u0645\u0627 \u062a\u0643\u0648\u0646 \u062c\u0627\u0647\u0632\u064b\u0627.", btn: "\u0627\u0628\u062f\u0623 \u2014 \u0645\u0646 $9/\u0634\u0647\u0631" },
    footer: { by: "\u0628\u0648\u0627\u0633\u0637\u0629", line1: "\u00a9 2026 PMP Expert Tutor \u0628\u0648\u0627\u0633\u0637\u0629 AiTuTorZ. \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0645\u0633\u062a\u0645\u062f \u062d\u0635\u0631\u064a\u064b\u0627 \u0645\u0646 \u062f\u0644\u064a\u0644 PMBOK\u00ae \u0627\u0644\u0625\u0635\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0628\u0639 (2021)\u060c \u062f\u0644\u064a\u0644 PMBOK\u00ae \u0627\u0644\u0625\u0635\u062f\u0627\u0631 \u0627\u0644\u062b\u0627\u0645\u0646\u060c \u0648\u0645\u062d\u062a\u0648\u0649 \u0627\u062e\u062a\u0628\u0627\u0631 PMP \u2014 \u064a\u0646\u0627\u064a\u0631 2021 \u0648 2026.", line2: "PMP\u00ae \u0639\u0644\u0627\u0645\u0629 \u062a\u062c\u0627\u0631\u064a\u0629 \u0645\u0633\u062c\u0644\u0629 \u0644\u0645\u0639\u0647\u062f \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639 (PMI). \u0647\u0630\u0647 \u0627\u0644\u0645\u0646\u0635\u0629 \u063a\u064a\u0631 \u062a\u0627\u0628\u0639\u0629 \u0644\u0640 PMI \u0648\u0644\u0627 \u0645\u0639\u062a\u0645\u062f\u0629 \u0645\u0646\u0647.", product: "\u0627\u0644\u0645\u0646\u062a\u062c", legal: "\u0642\u0627\u0646\u0648\u0646\u064a", privacy: "\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629", terms: "\u0634\u0631\u0648\u0637 \u0627\u0644\u062e\u062f\u0645\u0629", contact: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627" },
  },
};

function useInView(threshold = 0.12) { const ref = useRef<HTMLDivElement>(null); const [vis, setVis] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold }); obs.observe(el); return () => obs.disconnect(); }, []); return [ref, vis] as const; }
function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) { const [ref, vis] = useInView(); return (<div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>{children}</div>); }

const featureColors = [{ bg: C.tealLt, accent: C.teal },{ bg: C.purpleLt, accent: C.purple },{ bg: C.amberLt, accent: C.amber },{ bg: C.purpleLt, accent: C.purple },{ bg: C.tealLt, accent: C.teal },{ bg: C.amberLt, accent: C.amber }];
const planGradients = [`linear-gradient(135deg, ${C.teal}, ${C.tealDk})`,`linear-gradient(135deg, ${C.purple}, ${C.tealDk})`,`linear-gradient(135deg, ${C.purpleDk}, ${C.purple})`];
const planBtnColors = [C.teal, C.purple, C.purpleDk];

export default function LandingPageClient({ lang }: { lang: "en" | "ar" }) {
  const t = copy[lang]; const isAr = lang === "ar"; const dir = isAr ? "rtl" : "ltr";
  const bodyFont = isAr ? "'Cairo', sans-serif" : "'DM Sans', sans-serif";
  const displayFont = isAr ? "'Cairo', sans-serif" : "'DM Sans', sans-serif";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [heroImg, setHeroImg] = useState<string | null>("/hero.png");
  const heroFileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Cairo:wght@400;600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{font-family:${bodyFont};-webkit-font-smoothing:antialiased}
      .lp-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
      .lp-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
      .lp-steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;position:relative}
      .lp-pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
      .lp-steps-line{position:absolute;top:26px;left:12.5%;right:12.5%;height:2px;z-index:0}
      .lp-nav-desktop{display:flex;align-items:center;gap:${isAr?"20px":"28px"}}
      .lp-nav-hamburger{display:none;cursor:pointer;padding:8px}
      .lp-mobile-menu{display:none}
      .lp-compare-scroll{border-radius:16px;overflow:hidden;border:1px solid #E8E8E4;background:#fff}
      .lp-hero-stats{display:flex;gap:28px;margin-top:36px;font-size:13px}
      .lp-trust-row{display:flex;justify-content:center;gap:24px;font-size:12px;flex-wrap:wrap}
      @media(max-width:900px){
        .lp-hero-grid{grid-template-columns:1fr;gap:32px}
        .lp-hero-image{max-width:480px;margin:0 auto}
        .lp-features-grid{grid-template-columns:repeat(2,1fr)}
        .lp-steps-grid{grid-template-columns:repeat(2,1fr);gap:32px}
        .lp-steps-line{display:none}
        .lp-pricing-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto}
      }
      @media(max-width:640px){
        .lp-nav-desktop{display:none}
        .lp-nav-hamburger{display:block}
        .lp-mobile-menu.open{display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(255,255,255,0.98);backdrop-filter:blur(16px);border-bottom:1px solid #E8E8E4;padding:8px 0;z-index:99}
        .lp-mobile-menu.open a,.lp-mobile-menu.open .lp-mob-item{display:block;padding:14px 24px;font-size:15px;font-weight:500;color:${C.muted};text-decoration:none;border-bottom:1px solid #F0F0EC}
        .lp-mobile-menu.open a:last-child,.lp-mobile-menu.open .lp-mob-item:last-child{border-bottom:none}
        .lp-features-grid{grid-template-columns:1fr}
        .lp-steps-grid{grid-template-columns:1fr;gap:28px}
        .lp-hero-stats{flex-wrap:wrap;gap:16px}
        .lp-compare-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .lp-compare-scroll table{min-width:520px}
        .lp-trust-row{flex-direction:column;align-items:center;gap:8px}
      }
    `}</style>
    <div dir={dir} style={{fontFamily:bodyFont}}>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:scrolled||mobileMenu?"rgba(255,255,255,0.96)":"transparent",backdropFilter:scrolled||mobileMenu?"blur(14px)":"none",borderBottom:scrolled?"1px solid #E8E8E4":"1px solid transparent",transition:"all 0.3s ease",padding:"0 clamp(1rem,4vw,3rem)"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"relative"}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <Image src="/logo.png" alt="AiTutorZ" width={34} height={34} style={{borderRadius:8,objectFit:"contain"}} />
            <span style={{fontSize:17,fontWeight:700,color:C.dark,letterSpacing:"-0.02em"}}>PMP Expert Tutor</span>
          </Link>
          <div className="lp-nav-desktop">
            <a href="#features" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.pricing==="Pricing"?"Features":"\u0627\u0644\u0645\u0632\u0627\u064a\u0627"}</a>
            <a href="#pricing" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.pricing}</a>
            <a href="#faq" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>FAQ</a>
            <LandingLanguageSelector />
            <Link href="/login" style={{fontSize:14,color:C.muted,textDecoration:"none",fontWeight:500}}>{t.nav.login}</Link>
            <Link href="/signup" style={{fontSize:13,fontWeight:600,color:"#fff",background:`linear-gradient(135deg,${C.teal},${C.tealDk})`,padding:"8px 22px",borderRadius:8,textDecoration:"none"}}>{t.nav.cta}</Link>
          </div>
          <div className="lp-nav-hamburger" onClick={()=>setMobileMenu(!mobileMenu)}>
            <div style={{width:22,display:"flex",flexDirection:"column",gap:5}}>
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",transform:mobileMenu?"rotate(45deg) translate(5px,5px)":"none"}} />
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",opacity:mobileMenu?0:1}} />
              <span style={{height:2,background:C.dark,borderRadius:2,transition:"all 0.25s",transform:mobileMenu?"rotate(-45deg) translate(5px,-5px)":"none"}} />
            </div>
          </div>
          <div className={`lp-mobile-menu ${mobileMenu?"open":""}`}>
            <a href="#features" onClick={()=>setMobileMenu(false)}>{t.nav.pricing==="Pricing"?"Features":"\u0627\u0644\u0645\u0632\u0627\u064a\u0627"}</a>
            <a href="#pricing" onClick={()=>setMobileMenu(false)}>{t.nav.pricing}</a>
            <a href="#faq" onClick={()=>setMobileMenu(false)}>FAQ</a>
            <div className="lp-mob-item"><LandingLanguageSelector /></div>
            <Link href="/login" onClick={()=>setMobileMenu(false)}>{t.nav.login}</Link>
            <Link href="/signup" onClick={()=>setMobileMenu(false)} style={{color:C.teal,fontWeight:700}}>{t.nav.cta}</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem) clamp(2rem,5vw,4rem)",background:`linear-gradient(170deg,${C.tealLt} 0%,#FFFFFF 40%,${C.purpleLt} 100%)`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-120,[isAr?"left":"right"]:-120,width:340,height:340,borderRadius:"50%",background:`${C.teal}08`,pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:-80,[isAr?"right":"left"]:-80,width:260,height:260,borderRadius:"50%",background:`${C.purple}06`,pointerEvents:"none"}} />
        <div style={{maxWidth:1140,margin:"0 auto",position:"relative"}} className="lp-hero-grid">
          <FadeIn>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              <span style={{fontSize:12,fontWeight:600,color:C.tealDk,background:C.tealLt,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.teal}22`}}>{t.hero.badge1}</span>
              <span style={{fontSize:12,fontWeight:600,color:C.purple,background:C.purpleLt,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.purple}22`}}>{t.hero.badge2}</span>
            </div>
            <h1 style={{fontSize:"clamp(28px,5vw,46px)",fontWeight:800,lineHeight:1.15,color:C.dark,letterSpacing:"-0.03em",marginBottom:18,fontFamily:displayFont}}>
              {t.hero.h1a}<br />{t.hero.h1b}<span style={{background:`linear-gradient(135deg,${C.teal},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{t.hero.h1c}</span>{t.hero.h1d}
            </h1>
            <p style={{fontSize:"clamp(15px,2vw,17px)",lineHeight:1.7,color:C.muted,marginBottom:28,maxWidth:440}}>{t.hero.sub}</p>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <Link href="/signup" style={{fontSize:15,fontWeight:600,color:"#fff",background:`linear-gradient(135deg,${C.teal},${C.tealDk})`,padding:"14px 28px",borderRadius:10,textDecoration:"none"}}>{t.hero.cta1}</Link>
              <a href="#how-it-works" style={{fontSize:14,fontWeight:500,color:C.muted,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:34,height:34,borderRadius:"50%",border:`1.5px solid ${C.purple}33`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.purple}}>{"\u25b6"}</span>
                {t.hero.cta2}
              </a>
            </div>
            <div className="lp-hero-stats" style={{color:C.muted}}>
              <span><strong style={{color:C.tealDk,fontSize:16}}>{t.hero.s1v}</strong> {t.hero.s1l}</span>
              <span><strong style={{color:C.purple,fontSize:16}}>{t.hero.s2v}</strong> {t.hero.s2l}</span>
              <span><strong style={{color:C.amber,fontSize:16}}>{t.hero.s3v}</strong> {t.hero.s3l}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="lp-hero-image">
            <div onClick={()=>heroFileRef.current?.click()} style={{width:"100%",aspectRatio:"4/3",borderRadius:18,background:heroImg?`url(${heroImg}) center/cover no-repeat`:`linear-gradient(135deg,${C.tealLt},${C.purpleLt})`,border:heroImg?"none":`2px dashed ${C.teal}44`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}}>
              {!heroImg&&(<div style={{textAlign:"center"}}><div style={{fontSize:40,marginBottom:10}}>{"\ud83d\udcf7"}</div><div style={{fontSize:14,fontWeight:600,color:C.purple}}>{t.hero.upload}</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>{t.hero.uploadHint}</div></div>)}
            </div>
            <input ref={heroFileRef} type="file" accept="image/png" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>setHeroImg(r.result as string);r.readAsDataURL(f);}}} />
          </FadeIn>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:48}}><span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.features.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.features.title}</h2></div></FadeIn>
          <div className="lp-features-grid">
            {t.features.items.map((f,i)=>(<FadeIn key={i} delay={i*0.08}><div style={{padding:"28px 24px",borderRadius:16,border:"1px solid #F0F0EC",background:"#fff",height:"100%"}}><div style={{width:46,height:46,borderRadius:12,background:featureColors[i].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,marginBottom:16}}>{f.icon}</div><div style={{fontSize:16,fontWeight:700,color:C.dark,marginBottom:8,fontFamily:displayFont}}>{f.title}</div><div style={{fontSize:14,color:C.muted,lineHeight:1.65}}>{f.desc}</div></div></FadeIn>))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:C.bg}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:48}}><span style={{fontSize:12,fontWeight:700,color:C.purple,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.how.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.how.title}</h2></div></FadeIn>
          <div className="lp-steps-grid">
            <div className="lp-steps-line" style={{background:`linear-gradient(90deg,${C.teal}44,${C.purple}44)`}} />
            {t.how.steps.map((s,i)=>(<FadeIn key={i} delay={i*0.1}><div style={{textAlign:"center",position:"relative",zIndex:1}}><div style={{width:52,height:52,borderRadius:"50%",margin:"0 auto 16px",background:i%2===0?`linear-gradient(135deg,${C.teal},${C.tealDk})`:`linear-gradient(135deg,${C.purple},${C.purpleDk})`,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,boxShadow:i%2===0?`0 4px 14px ${C.teal}33`:`0 4px 14px ${C.purple}33`}}>{s.num}</div><div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:6,fontFamily:displayFont}}>{s.title}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{s.desc}</div></div></FadeIn>))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:1140,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:40}}>
            <span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.pricing.label}</span>
            <h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.pricing.title}</h2>
            <p style={{fontSize:15,color:C.muted,marginTop:8,padding:"0 1rem"}}>{t.pricing.sub}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginTop:24,flexWrap:"wrap"}}>
              {annual&&<span style={{fontSize:12,fontWeight:600,color:C.teal,background:C.tealLt,padding:"4px 12px",borderRadius:12}}>{t.pricing.saveBadge}</span>}
              <span style={{fontSize:14,color:annual?C.muted:C.dark,fontWeight:annual?400:600}}>{t.pricing.monthly}</span>
              <div onClick={()=>setAnnual(!annual)} style={{width:48,height:26,borderRadius:13,padding:3,background:annual?`linear-gradient(135deg,${C.teal},${C.purple})`:"#D1D5DB",cursor:"pointer",transition:"background 0.3s",display:"flex",alignItems:"center"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",transition:"transform 0.2s",transform:annual?(isAr?"translateX(-22px)":"translateX(22px)"):"translateX(0)",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}} />
              </div>
              <span style={{fontSize:14,color:annual?C.dark:C.muted,fontWeight:annual?600:400}}>{t.pricing.annual}</span>
            </div>
          </div></FadeIn>
          <div className="lp-pricing-grid">
            {t.pricing.plans.map((p,i)=>(<FadeIn key={i} delay={i*0.1}><div style={{borderRadius:20,padding:p.popular?"3px":"0",background:p.popular?`linear-gradient(135deg,${C.purple},${C.teal})`:"transparent"}}>
              {p.popular&&<div style={{textAlign:"center",padding:"9px 0 5px",color:"#fff",fontSize:12,fontWeight:700,letterSpacing:"0.04em"}}>{"\u2b50"} {isAr?"\u0627\u0644\u0623\u0643\u062b\u0631 \u0634\u0639\u0628\u064a\u0629":"Most popular"}</div>}
              <div style={{background:"#fff",borderRadius:p.popular?17:20,padding:"32px 24px",border:p.popular?"none":"1px solid #E8E8E4"}}>
                <div style={{fontSize:20,fontWeight:800,color:planBtnColors[i],marginBottom:4}}>{p.name} {p.emoji}</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.5}}>{p.tagline}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                  <span style={{fontSize:13,color:C.muted}}>{t.pricing.perMonth}</span>
                  <span style={{fontSize:42,fontWeight:800,color:C.dark}}>${annual?Math.round(p.annual/12):p.monthly}</span>
                </div>
                {annual?<div style={{fontSize:12,color:C.teal,fontWeight:600,marginBottom:16}}>{t.pricing.orYear} ${p.annual}{t.pricing.yearSuffix} {p.annualSave}</div>:<div style={{height:16}} />}
                <div style={{borderTop:"1px solid #F0F0EC",paddingTop:20,marginTop:4}}>
                  {p.features.map((f,j)=>(<div key={j} style={{fontSize:13,color:"#475569",padding:"5px 0",display:"flex",alignItems:"center",gap:8}}><span style={{color:C.teal,fontSize:14,flexShrink:0}}>{"\u2713"}</span> {f}</div>))}
                </div>
                <Link href="/signup" style={{display:"block",width:"100%",marginTop:24,padding:"13px 0",borderRadius:10,fontSize:14,fontWeight:700,textAlign:"center",textDecoration:"none",background:p.popular?`linear-gradient(135deg,${C.purple},${C.tealDk})`:planGradients[i],color:"#fff"}}>{p.cta}</Link>
              </div>
            </div></FadeIn>))}
          </div>
          <FadeIn delay={0.3}><div className="lp-trust-row" style={{textAlign:"center",marginTop:28,color:C.muted}}>
            <span>{"\ud83d\udd12"} {t.pricing.secured}</span><span>{"\ud83d\udcb3"} {t.pricing.cards}</span><span>{"\ud83d\udeab"} {t.pricing.cancel}</span>
          </div></FadeIn>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:C.bg}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:36}}><span style={{fontSize:12,fontWeight:700,color:C.purple,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.compare.label}</span><h2 style={{fontSize:"clamp(22px,3.5vw,28px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.compare.title}</h2></div></FadeIn>
          <FadeIn delay={0.1}><div className="lp-compare-scroll">
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{background:`linear-gradient(135deg,${C.tealLt},${C.purpleLt})`}}>{t.compare.cols.map((col,ci)=>(<th key={ci} style={{textAlign:ci===0?(isAr?"right":"left"):"center",padding:"14px 16px",fontWeight:ci===1?700:500,color:ci===1?C.purple:C.muted,whiteSpace:"nowrap"}}>{col}</th>))}</tr></thead>
              <tbody>{t.compare.rows.map((row,ri)=>(<tr key={ri} style={{borderTop:"1px solid #F0F0EC"}}>{row.map((cell,ci)=>(<td key={ci} style={{padding:"12px 16px",textAlign:ci===0?(isAr?"right":"left"):"center",color:ci===1?C.teal:(ci===0?"#475569":C.muted),fontWeight:ci===1?700:400,whiteSpace:"nowrap"}}>{cell}</td>))}</tr>))}</tbody>
            </table>
          </div></FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:"#fff"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <FadeIn><div style={{textAlign:"center",marginBottom:40}}><span style={{fontSize:12,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t.faq.label}</span><h2 style={{fontSize:"clamp(24px,4vw,30px)",fontWeight:800,color:C.dark,marginTop:8,letterSpacing:"-0.02em",fontFamily:displayFont}}>{t.faq.title}</h2></div></FadeIn>
          <div>{t.faq.items.map((f,i)=>(<FadeIn key={i} delay={i*0.05}><div style={{borderBottom:"1px solid #F0F0EC",cursor:"pointer",padding:"18px 0"}} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,fontWeight:600,color:C.dark}}>{f.q}</span>
              <span style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:faqOpen===i?`linear-gradient(135deg,${C.teal},${C.purple})`:"#F1F1EF",color:faqOpen===i?"#fff":C.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:500,transition:"all 0.25s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)",marginInlineStart:12}}>+</span>
            </div>
            <div style={{maxHeight:faqOpen===i?200:0,overflow:"hidden",transition:"max-height 0.35s ease,opacity 0.25s ease",opacity:faqOpen===i?1:0}}>
              <p style={{fontSize:14,color:C.muted,lineHeight:1.7,marginTop:10}}>{f.a}</p>
            </div>
          </div></FadeIn>))}</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,3rem)",background:`linear-gradient(135deg,${C.dark} 0%,${C.purpleDk} 50%,${C.dark} 100%)`,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-80,[isAr?"left":"right"]:-60,width:300,height:300,borderRadius:"50%",background:`${C.teal}10`,pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:-60,[isAr?"right":"left"]:-40,width:220,height:220,borderRadius:"50%",background:`${C.purple}10`,pointerEvents:"none"}} />
        <FadeIn><div style={{maxWidth:560,margin:"0 auto",position:"relative"}}>
          <h2 style={{fontSize:"clamp(26px,4vw,34px)",fontWeight:800,color:"#fff",letterSpacing:"-0.02em",marginBottom:12,fontFamily:displayFont}}>{t.finalCta.title}</h2>
          <p style={{fontSize:"clamp(14px,2vw,16px)",color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:28}}>{t.finalCta.sub}</p>
          <Link href="/signup" style={{display:"inline-block",fontSize:15,fontWeight:700,color:C.dark,background:`linear-gradient(135deg,${C.tealLt},#fff)`,padding:"14px 36px",borderRadius:10,textDecoration:"none"}}>{t.finalCta.btn}</Link>
        </div></FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"2.5rem clamp(1rem,4vw,3rem)",background:C.bg,borderTop:"1px solid #E8E8E4"}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"start",flexWrap:"wrap",gap:24}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <Image src="/logo.png" alt="AiTutorZ" width={28} height={28} style={{borderRadius:6,objectFit:"contain"}} />
              <span style={{fontSize:15,fontWeight:700,color:C.dark}}>PMP Expert Tutor</span>
            </div>
            <div style={{fontSize:13,color:C.muted}}>{t.footer.by} <span style={{color:C.teal,fontWeight:600}}>AiTutorZ</span> {"\u00b7"} {"\u00a9"} 2026</div>
          </div>
          <div style={{display:"flex",gap:40}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.footer.product}</div>
              <a href="#features" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.features.label}</a>
              <a href="#pricing" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.pricing.label}</a>
              <a href="#faq" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>FAQ</a>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.dark,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.footer.legal}</div>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.privacy}</a>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.terms}</a>
              <a href="#" style={{display:"block",fontSize:13,color:C.muted,textDecoration:"none",padding:"3px 0"}}>{t.footer.contact}</a>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1140,margin:"20px auto 0",borderTop:"1px solid #E8E8E4",paddingTop:16}}>
          <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,textAlign:"center"}}>{t.footer.line1}</p>
          <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,textAlign:"center",marginTop:4}}>{t.footer.line2}</p>
        </div>
      </footer>

    </div>
  </>);
}
