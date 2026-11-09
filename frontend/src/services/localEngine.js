// Miraa local engine: a small in-browser solver so the website works
// without a backend. Handles arithmetic, percentages, linear and quadratic
// equations in one variable, and falls back to a guided study plan.

// ---------- Expression parser (recursive descent, no eval) ----------

const tokenize = (input) => {
  const tokens = [];
  const src = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < src.length && /[0-9.]/.test(src[i])) { num += src[i]; i += 1; }
      if ((num.match(/\./g) || []).length > 1) throw new Error('Invalid number');
      tokens.push({ type: 'num', value: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let word = '';
      while (i < src.length && /[a-zA-Z]/.test(src[i])) { word += src[i]; i += 1; }
      tokens.push({ type: 'id', value: word.toLowerCase() });
      continue;
    }
    if ('+-*/^()%'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i += 1; continue; }
    throw new Error(`Unexpected character "${ch}"`);
  }
  return tokens;
};

const FUNCS = {
  sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan,
  log: Math.log10, ln: Math.log, abs: Math.abs,
};
const CONSTS = { pi: Math.PI, e: Math.E };

// Returns a function (vars) => number
const parse = (input, variable = null) => {
  const tokens = tokenize(input);
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const isOp = (t, v) => t && t.type === 'op' && t.value === v;
  const startsFactor = (t) => t && (t.type === 'num' || t.type === 'id' || isOp(t, '('));

  const parseExpr = () => {
    let left = parseTerm();
    while (isOp(peek(), '+') || isOp(peek(), '-')) {
      const op = next().value;
      const right = parseTerm();
      const l = left;
      left = op === '+' ? (v) => l(v) + right(v) : (v) => l(v) - right(v);
    }
    return left;
  };

  const parseTerm = () => {
    let left = parseUnary();
    for (;;) {
      const t = peek();
      if (isOp(t, '*') || isOp(t, '/')) {
        const op = next().value;
        const right = parseUnary();
        const l = left;
        left = op === '*' ? (v) => l(v) * right(v) : (v) => l(v) / right(v);
      } else if (startsFactor(t)) {
        // implicit multiplication: 2x, 3(x+1), (a)(b)
        const right = parsePower();
        const l = left;
        left = (v) => l(v) * right(v);
      } else {
        break;
      }
    }
    return left;
  };

  const parseUnary = () => {
    if (isOp(peek(), '-')) { next(); const f = parseUnary(); return (v) => -f(v); }
    if (isOp(peek(), '+')) { next(); return parseUnary(); }
    return parsePower();
  };

  const parsePower = () => {
    const base = parsePostfix();
    if (isOp(peek(), '^')) {
      next();
      const exp = parseUnary();
      return (v) => Math.pow(base(v), exp(v));
    }
    return base;
  };

  const parsePostfix = () => {
    let f = parsePrimary();
    while (isOp(peek(), '%')) { next(); const g = f; f = (v) => g(v) / 100; }
    return f;
  };

  const parsePrimary = () => {
    const t = next();
    if (!t) throw new Error('Unexpected end of expression');
    if (t.type === 'num') return () => t.value;
    if (isOp(t, '(')) {
      const e = parseExpr();
      if (!isOp(next(), ')')) throw new Error('Missing closing parenthesis');
      return e;
    }
    if (t.type === 'id') {
      if (FUNCS[t.value]) {
        if (!isOp(peek(), '(')) throw new Error(`Expected "(" after ${t.value}`);
        next();
        const arg = parseExpr();
        if (!isOp(next(), ')')) throw new Error('Missing closing parenthesis');
        return (v) => FUNCS[t.value](arg(v));
      }
      if (CONSTS[t.value] !== undefined) return () => CONSTS[t.value];
      if (variable && t.value === variable) return (v) => v;
      throw new Error(`Unknown symbol "${t.value}"`);
    }
    throw new Error(`Unexpected "${t.value}"`);
  };

  const fn = parseExpr();
  if (pos !== tokens.length) throw new Error('Could not understand the full expression');
  return fn;
};

// ---------- Formatting helpers ----------

const round = (n) => {
  if (!Number.isFinite(n)) return n;
  const r = Math.round(n * 1e10) / 1e10;
  return Object.is(r, -0) ? 0 : r;
};

const fmt = (n) => {
  const r = round(n);
  if (Number.isInteger(r)) return String(r);
  // Try to show a simple fraction too
  for (let d = 2; d <= 64; d += 1) {
    const num = r * d;
    if (Math.abs(num - Math.round(num)) < 1e-9) {
      return `${Math.round(num)}/${d} ≈ ${parseFloat(r.toFixed(6))}`;
    }
  }
  return String(parseFloat(r.toFixed(8)));
};

const signed = (n) => (n < 0 ? `- ${fmt(Math.abs(n))}` : `+ ${fmt(n)}`);
// Coefficient in front of a variable: 1x -> x, -1x -> -x
const coef = (n) => (n === 1 ? '' : n === -1 ? '-' : fmt(n));
const signedCoef = (n) => (n < 0 ? `- ${coef(Math.abs(n))}` : `+ ${coef(n)}`);

// ---------- Problem extraction ----------

const cleanQuestion = (text) =>
  text
    .trim()
    .replace(/^(please\s+)?(solve|calculate|compute|evaluate|simplify|find|what is|what's|whats)\s*(for\s+[a-z]\s*)?[:,]?\s*/i, '')
    .replace(/[?.!]+$/, '')
    .trim();

const findVariable = (expr) => {
  const ids = (expr.match(/[a-zA-Z]+/g) || [])
    .map((w) => w.toLowerCase())
    .filter((w) => !FUNCS[w] && CONSTS[w] === undefined);
  const singles = [...new Set(ids)].filter((w) => w.length === 1);
  if (ids.length && singles.length === 1 && ids.every((w) => w === singles[0])) return singles[0];
  return null;
};

// ---------- Solvers ----------

const solvePercentOf = (text) => {
  const m = text.match(/(-?\d+(?:\.\d+)?)\s*%\s*of\s*(-?\d+(?:\.\d+)?)/i);
  if (!m) return null;
  const p = parseFloat(m[1]);
  const base = parseFloat(m[2]);
  const result = (p / 100) * base;
  return {
    subject: 'Math · Percentages',
    answer: `${p}% of ${base} = ${fmt(result)}`,
    confidence: 99,
    steps: [
      { description: 'Convert the percentage to a decimal', explanation: `${p}% means ${p} out of 100, so ${p}% = ${p} ÷ 100 = ${fmt(p / 100)}.` },
      { description: 'Multiply by the base value', explanation: `${fmt(p / 100)} × ${base} = ${fmt(result)}.` },
      { description: 'State the answer', explanation: `${p}% of ${base} is ${fmt(result)}.` },
    ],
  };
};

const solveEquation = (expr, variable) => {
  const sides = expr.split('=');
  if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) return null;
  const lhs = parse(sides[0], variable);
  const rhs = parse(sides[1], variable);
  const f = (x) => lhs(x) - rhs(x);

  // Fit f(x) = a x^2 + b x + c from three samples, then verify at two more.
  const f0 = f(0); const f1 = f(1); const fm1 = f(-1);
  const a = round((f1 + fm1) / 2 - f0);
  const b = round((f1 - fm1) / 2);
  const c = round(f0);
  const model = (x) => a * x * x + b * x + c;
  const fits = [2, -3, 0.5].every((x) => Math.abs(f(x) - model(x)) < 1e-6 * (1 + Math.abs(f(x))));
  if (!fits || ![a, b, c].every(Number.isFinite)) return null;

  const v = variable;
  const eq = `${sides[0].trim()} = ${sides[1].trim()}`;

  if (a === 0) {
    if (b === 0) {
      return {
        subject: 'Math · Equations',
        answer: c === 0 ? `Every value of ${v} satisfies this equation (identity).` : 'This equation has no solution.',
        confidence: 97,
        steps: [
          { description: 'Move everything to one side', explanation: `${eq} simplifies to ${fmt(c)} = 0 after the ${v}-terms cancel.` },
          { description: 'Interpret the result', explanation: c === 0 ? 'The statement 0 = 0 is always true, so any value works.' : `${fmt(c)} = 0 is never true, so no value of ${v} works.` },
        ],
      };
    }
    const x = round(-c / b);
    return {
      subject: 'Math · Linear equations',
      answer: `${v} = ${fmt(x)}`,
      confidence: 98,
      steps: [
        { description: 'Collect all terms on one side', explanation: `Rewrite ${eq} as ${coef(b)}${v} ${signed(c)} = 0.` },
        { description: `Isolate the ${v}-term`, explanation: `Move the constant across: ${coef(b)}${v} = ${fmt(-c)}.` },
        { description: `Divide by the coefficient of ${v}`, explanation: `${v} = ${fmt(-c)} ÷ ${fmt(b)} = ${fmt(x)}.` },
        { description: 'Check the answer', explanation: `Substituting ${v} = ${fmt(x)} gives left side ${fmt(lhs(x))} and right side ${fmt(rhs(x))}. ✔` },
      ],
    };
  }

  const disc = round(b * b - 4 * a * c);
  const steps = [
    { description: 'Write in standard form', explanation: `Rearrange ${eq} into a${v}² + b${v} + c = 0: ${coef(a)}${v}² ${b ? `${signedCoef(b)}${v} ` : ""}${c ? `${signed(c)} ` : ""}= 0, so a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}.` },
    { description: 'Compute the discriminant', explanation: `Δ = b² − 4ac = (${fmt(b)})² − 4·(${fmt(a)})·(${fmt(c)}) = ${fmt(disc)}.` },
  ];
  let answer;
  if (disc < 0) {
    const re = round(-b / (2 * a));
    const im = round(Math.sqrt(-disc) / (2 * Math.abs(a)));
    answer = `No real solutions. Complex roots: ${v} = ${fmt(re)} ± ${fmt(im)}i`;
    steps.push({ description: 'Interpret the discriminant', explanation: 'Δ < 0, so the parabola never crosses zero: there are no real roots.' });
    steps.push({ description: 'Complex roots (optional)', explanation: `${v} = (−b ± i√|Δ|) / 2a = ${fmt(re)} ± ${fmt(im)}i.` });
  } else {
    const r1 = round((-b + Math.sqrt(disc)) / (2 * a));
    const r2 = round((-b - Math.sqrt(disc)) / (2 * a));
    answer = disc === 0 ? `${v} = ${fmt(r1)} (double root)` : `${v} = ${fmt(r1)} or ${v} = ${fmt(r2)}`;
    steps.push({ description: 'Apply the quadratic formula', explanation: `${v} = (−b ± √Δ) / 2a = (${fmt(-b)} ± √${fmt(disc)}) / ${fmt(2 * a)}.` });
    steps.push({ description: 'Simplify the roots', explanation: disc === 0 ? `Δ = 0 gives one repeated root: ${v} = ${fmt(r1)}.` : `${v}₁ = ${fmt(r1)}, ${v}₂ = ${fmt(r2)}.` });
    steps.push({ description: 'Check the answer', explanation: `Plugging each root back in makes both sides equal (difference ≈ ${fmt(Math.abs(f(r1)) + Math.abs(f(r2)))}). ✔` });
  }
  return { subject: 'Math · Quadratic equations', answer, confidence: 97, steps };
};

const solveArithmetic = (expr) => {
  const fn = parse(expr);
  const value = fn();
  if (!Number.isFinite(value)) {
    return {
      subject: 'Math · Arithmetic',
      answer: 'The expression is undefined (for example, division by zero).',
      confidence: 95,
      steps: [{ description: 'Check for undefined operations', explanation: 'Dividing by zero or taking an invalid root has no real value.' }],
    };
  }
  return {
    subject: 'Math · Arithmetic',
    answer: `${expr} = ${fmt(value)}`,
    confidence: 99,
    steps: [
      { description: 'Apply the order of operations', explanation: 'Work through parentheses first, then exponents, then multiplication and division (left to right), and finally addition and subtraction.' },
      { description: 'Evaluate the expression', explanation: `${expr} evaluates to ${fmt(value)}.` },
      { description: 'State the answer', explanation: `The result is ${fmt(value)}.` },
    ],
  };
};

const SUBJECTS = [
  { name: 'Physics', words: ['force', 'velocity', 'acceleration', 'energy', 'momentum', 'newton', 'gravity', 'mass', 'circuit', 'voltage', 'current'] },
  { name: 'Chemistry', words: ['mole', 'molecule', 'atom', 'reaction', 'acid', 'base', 'ph', 'bond', 'element', 'compound', 'electron'] },
  { name: 'Biology', words: ['cell', 'dna', 'gene', 'protein', 'photosynthesis', 'enzyme', 'organism', 'evolution', 'mitosis'] },
  { name: 'History', words: ['war', 'empire', 'revolution', 'century', 'king', 'treaty', 'independence', 'civilization'] },
  { name: 'Literature', words: ['poem', 'novel', 'author', 'theme', 'character', 'metaphor', 'essay', 'story'] },
  { name: 'Math', words: ['equation', 'derivative', 'integral', 'triangle', 'angle', 'area', 'probability', 'fraction', 'graph'] },
];

const guidedPlan = (text) => {
  const lower = text.toLowerCase();
  const subject = SUBJECTS.find((s) => s.words.some((w) => new RegExp(`\\b${w}(s|es)?\\b`).test(lower)))?.name || 'General';
  const keywords = [...new Set(lower.match(/[a-z]{5,}/g) || [])].slice(0, 4);
  return {
    subject: `${subject} · Study guide`,
    answer:
      'Miraa built a step-by-step study plan for this question. Instant exact answers are available for arithmetic, percentages and equations; connect the Miraa API for full AI explanations on every subject.',
    confidence: 70,
    steps: [
      { description: 'Restate the question', explanation: `Put it in your own words: "${text.trim().slice(0, 160)}". What exactly is being asked?` },
      { description: 'Identify key concepts', explanation: keywords.length ? `Focus on: ${keywords.join(', ')}. Write a one-line definition for each.` : 'List the terms and ideas the question depends on and define each one.' },
      { description: 'Gather what you know', explanation: `Write down the facts, formulas or evidence from your ${subject === 'General' ? 'notes' : subject.toLowerCase() + ' notes'} that relate to those concepts.` },
      { description: 'Build the answer', explanation: 'Connect the facts logically, one claim or calculation per line, and justify each step.' },
      { description: 'Review', explanation: 'Re-read the question and check that your answer addresses every part of it.' },
    ],
  };
};

export const solveLocally = (rawText) => {
  const text = rawText.trim();
  const percent = solvePercentOf(text);
  if (percent) return percent;

  const expr = cleanQuestion(text);
  try {
    if (expr.includes('=')) {
      const variable = findVariable(expr);
      if (variable) {
        const res = solveEquation(expr, variable);
        if (res) return res;
      }
    } else if (/^[0-9+\-*/^().%\s×÷−a-z]+$/i.test(expr) && /\d/.test(expr) && !findVariable(expr)) {
      return solveArithmetic(expr);
    }
  } catch {
    // fall through to the guided plan
  }
  return guidedPlan(text);
};

// ---------- Local persistence (localStorage) ----------

const STORAGE_KEY = 'miraa.history.v1';
const PROFILE_KEY = 'miraa.profile.v1';

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode); ignore
  }
};

export const getLocalProfile = () => {
  let profile = readJSON(PROFILE_KEY, null);
  if (!profile) {
    profile = { name: 'Miraa learner', joinedAt: new Date().toISOString() };
    writeJSON(PROFILE_KEY, profile);
  }
  return profile;
};

export const saveLocalProfile = (profile) => writeJSON(PROFILE_KEY, profile);

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const localSolve = ({ text, type = 'text' }) => {
  const result = solveLocally(text);
  const record = {
    id: newId(),
    text,
    type,
    createdAt: new Date().toISOString(),
    saved: false,
    solution: {
      answer: result.answer,
      steps: result.steps.map((s, i) => ({ stepNumber: i + 1, ...s })),
      confidence: result.confidence,
      subject: result.subject,
    },
  };
  const all = readJSON(STORAGE_KEY, []);
  writeJSON(STORAGE_KEY, [record, ...all].slice(0, 200));
  return record;
};

export const localHistory = () =>
  readJSON(STORAGE_KEY, []).filter((r) => r.saved);

export const localGet = (id) => readJSON(STORAGE_KEY, []).find((r) => r.id === id) || null;

export const localSave = (id) => {
  const all = readJSON(STORAGE_KEY, []);
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], saved: true };
  writeJSON(STORAGE_KEY, all);
  return true;
};

export const localDelete = (id) => {
  writeJSON(STORAGE_KEY, readJSON(STORAGE_KEY, []).filter((r) => r.id !== id));
};

export const localClear = () => writeJSON(STORAGE_KEY, []);
