import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Zap, ListOrdered, History as HistoryIcon, ShieldCheck,
  MessageSquare, Lightbulb, GraduationCap, Check, ChevronDown,
} from 'lucide-react';

const examples = ['2x + 3 = 11', 'x^2 - 5x + 6 = 0', 'What is 15% of 80?', '(3 + 4) * 2^3 - 10 / 4'];

const features = [
  { icon: Zap, title: 'Instant answers', text: 'Arithmetic, percentages, linear and quadratic equations are solved exactly, right in your browser.' },
  { icon: ListOrdered, title: 'Step-by-step', text: 'Every answer comes with the reasoning behind it, so you learn the method, not just the result.' },
  { icon: Lightbulb, title: 'Study plans', text: 'For essay and theory questions, Miraa builds a guided plan to help you reach the answer yourself.' },
  { icon: HistoryIcon, title: 'Your history', text: 'Save solutions and come back to them when it is time to revise.' },
  { icon: ShieldCheck, title: 'Private by default', text: 'In standalone mode your questions never leave your device. History lives in your browser.' },
  { icon: GraduationCap, title: 'Built for students', text: 'A clean, distraction-free space that works on your phone, tablet or laptop.' },
];

const steps = [
  { icon: MessageSquare, title: 'Ask', text: 'Type your question or equation, or upload a photo of it.' },
  { icon: Sparkles, title: 'Solve', text: 'Miraa works through the problem and checks its own answer.' },
  { icon: ListOrdered, title: 'Learn', text: 'Follow each step, then save it to your history for later.' },
];

const plans = [
  { name: 'Free', price: '$0', period: 'forever', features: ['Unlimited math solving', 'Step-by-step explanations', 'Study plans for any subject', 'History in your browser'], cta: 'Start free', highlight: false },
  { name: 'Pro', price: '$9.99', period: 'per month', features: ['Everything in Free', 'Full AI explanations for every subject', 'Photo & handwriting recognition', 'Sync across devices', 'Priority support'], cta: 'See plans', highlight: true },
];

const faqs = [
  { q: 'Is Miraa free?', a: 'Yes. Solving, explanations and history are free. Pro adds AI explanations for every subject and syncing across devices.' },
  { q: 'Which questions can Miraa solve right now?', a: 'Exact solutions for arithmetic, percentages, and linear and quadratic equations in one variable. For other subjects, Miraa gives you a structured study plan.' },
  { q: 'Where is my history stored?', a: 'In standalone mode it is stored in your browser only. When connected to the Miraa API, it is stored in your account.' },
  { q: 'Does Miraa just give me the answer?', a: 'Miraa always shows its working so you can understand and reproduce the method in an exam.' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const ask = (q) => {
    const text = (q ?? question).trim();
    navigate('/solve', { state: text ? { question: text, autoSolve: true } : undefined });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-50 via-white to-white" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-300/40 to-pink-300/40 blur-3xl" />
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-medium text-primary-700">
            <Sparkles className="h-4 w-4" /> Your AI study companion
          </span>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-6xl">
            Understand every question with <span className="gradient-text">Miraa</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Ask anything from your homework. Get the answer, every step to reach it, and a
            history to revise from.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); ask(); }}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-primary-900/5 sm:flex-row"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Try: solve 3(y - 2) = 2y + 5"
              className="flex-1 rounded-xl px-4 py-3 text-base focus:outline-none"
              aria-label="Your question"
            />
            <button type="submit" className="btn-primary px-6 py-3">
              Ask Miraa <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => ask(ex)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-mono text-sm text-gray-700 hover:border-primary-300 hover:text-primary-700"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need to study smarter</h2>
            <p className="mt-4 text-gray-600">Miraa explains, not just answers.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">How Miraa works</h2>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-pink-500 text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700 shadow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Simple pricing</h2>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.highlight ? 'border-primary-500 bg-primary-50/50 shadow-lg' : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                    Coming soon
                  </span>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4">
                  <span className="font-display text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-gray-500">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.highlight ? '/profile' : '/solve'}
                  className={`mt-8 w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Questions & answers</h2>
          <div className="mt-10 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {faqs.map(({ q, a }, i) => (
              <div key={q}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium text-gray-900"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  {q}
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <p className="px-6 pb-5 text-sm leading-6 text-gray-600">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-700 to-pink-600 px-8 py-14 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to ask your first question?</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">No sign-up needed. Open Miraa and start learning.</p>
            <Link to="/solve" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 hover:bg-primary-50">
              Open Miraa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
