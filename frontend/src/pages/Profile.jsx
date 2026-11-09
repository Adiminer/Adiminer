import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Calendar, Target, BookOpen, Flame, Pencil, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHistory } from '../services/api';
import { getLocalProfile, saveLocalProfile } from '../services/localEngine';

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

const computeStreak = (items) => {
  const days = new Set(items.map((i) => dayKey(i.createdAt)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1); // streak can continue from yesterday
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const Profile = () => {
  const { history, setHistory } = useApp();
  const [profile, setProfile] = useState(getLocalProfile);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);

  useEffect(() => {
    getHistory()
      .then((res) => res.success && setHistory(res.data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const avg = total ? Math.round(history.reduce((s, i) => s + i.confidence, 0) / total) : 0;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const week = history.filter((i) => new Date(i.createdAt).getTime() > weekAgo).length;
    const subjects = history.reduce((acc, i) => {
      const s = (i.subject || 'General').split(' · ')[0];
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    return { total, avg, week, streak: computeStreak(history), subjects };
  }, [history]);

  const saveName = () => {
    const next = { ...profile, name: name.trim() || 'Miraa learner' };
    saveLocalProfile(next);
    setProfile(next);
    setName(next.name);
    setEditing(false);
  };

  const statCards = [
    { icon: BookOpen, label: 'Saved questions', value: stats.total, color: 'text-blue-600 bg-blue-50' },
    { icon: Flame, label: 'Day streak', value: stats.streak, color: 'text-orange-600 bg-orange-50' },
    { icon: Calendar, label: 'This week', value: stats.week, color: 'text-green-600 bg-green-50' },
    { icon: Target, label: 'Avg. confidence', value: `${stats.avg}%`, color: 'text-primary-600 bg-primary-50' },
  ];

  const subjectEntries = Object.entries(stats.subjects).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <div className="card mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-pink-500 font-display text-2xl font-bold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <form onSubmit={(e) => { e.preventDefault(); saveName(); }} className="flex gap-2">
                <input className="input-field max-w-xs py-1.5" value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={40} />
                <button type="submit" className="btn-primary px-3 py-1.5" aria-label="Save name"><Check className="h-4 w-4" /></button>
              </form>
            ) : (
              <h1 className="flex items-center gap-2 text-2xl font-extrabold text-gray-900">
                {profile.name}
                <button onClick={() => setEditing(true)} className="rounded-md p-1 text-gray-400 hover:text-gray-700" aria-label="Edit name">
                  <Pencil className="h-4 w-4" />
                </button>
              </h1>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Free plan · Studying with Miraa since{' '}
              {new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link to="/solve" className="btn-primary">
            <Sparkles className="h-4 w-4" /> Ask Miraa
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Subjects */}
          <div className="card">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Subjects</h2>
            {subjectEntries.length === 0 ? (
              <p className="text-sm text-gray-500">Save some questions to see your subject mix.</p>
            ) : (
              <ul className="space-y-3">
                {subjectEntries.map(([subject, count]) => (
                  <li key={subject}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-700">{subject}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-primary-500" style={{ width: `${(count / stats.total) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Plans */}
          <div className="card lg:col-span-2">
            <h2 className="mb-5 text-lg font-bold text-gray-900">Your plan</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border-2 border-primary-500 bg-primary-50/50 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Free</h3>
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-semibold text-white">Current</span>
                </div>
                <p className="mt-2 font-display text-3xl font-extrabold text-gray-900">$0</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Unlimited math solving</li>
                  <li>• Step-by-step explanations</li>
                  <li>• Study plans for any subject</li>
                  <li>• History in this browser</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Crown className="h-4 w-4 text-yellow-500" /> Pro
                </h3>
                <p className="mt-2 font-display text-3xl font-extrabold text-gray-900">
                  $9.99<span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>• Full AI explanations for every subject</li>
                  <li>• Photo & handwriting recognition</li>
                  <li>• Sync across devices</li>
                  <li>• Priority support</li>
                </ul>
                <button disabled className="btn-primary mt-5 w-full">
                  Coming soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
