import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Lock, Clock, ChevronRight,
  Layers, Briefcase,
} from 'lucide-react';
import { loadTechnologies } from '@/lib/content-engine';
import { useSeo } from '@/lib/seo';
import { useStore } from '@/store';
import type { Technology } from '@/types/content';
import clsx from 'clsx';

const STAGE_META: Record<number, { label: string; color: string }> = {
  0:  { label: 'Foundation',          color: '#64748b' },
  1:  { label: 'Structure',           color: '#e34c26' },
  2:  { label: 'Style',               color: '#264de4' },
  3:  { label: 'Logic',               color: '#f7df1e' },
  4:  { label: 'Collaboration',       color: '#f05032' },
  5:  { label: 'General Programming', color: '#3776ab' },
  6:  { label: 'Data',                color: '#4479a1' },
  7:  { label: 'Type Safety',         color: '#3178c6' },
  8:  { label: 'UI Frameworks',       color: '#61dafb' },
  9:  { label: 'Server Side',         color: '#339933' },
  10: { label: 'APIs',                color: '#ff6b35' },
  11: { label: 'Databases',           color: '#336791' },
  12: { label: 'DevOps',              color: '#2496ed' },
  13: { label: 'Cloud',               color: '#ff9900' },
  14: { label: 'AI / ML',             color: '#ff6f00' },
  15: { label: 'Security',            color: '#e53e3e' },
  16: { label: 'Embedded',            color: '#00979d' },
};

interface DomainPath {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  techs: string[];
  totalHours: number;
  careers: string[];
}

const DOMAIN_PATHS: DomainPath[] = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    emoji: '🎨',
    color: '#61dafb',
    description: 'Build beautiful, interactive web UIs with modern frameworks',
    techs: ['fundamentals', 'html', 'css', 'javascript', 'typescript', 'react', 'git'],
    totalHours: 143,
    careers: ['UI Developer', 'Frontend Engineer', 'React Developer', 'Web Designer'],
  },
  {
    id: 'backend',
    label: 'Backend Developer',
    emoji: '⚙️',
    color: '#339933',
    description: 'Build servers, APIs, and databases that power applications',
    techs: ['python', 'sql', 'nodejs', 'apis', 'postgresql', 'git', 'docker'],
    totalHours: 130,
    careers: ['Backend Engineer', 'API Developer', 'Node.js Developer', 'Python Developer'],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Engineer',
    emoji: '🏗️',
    color: '#8b5cf6',
    description: 'Master both frontend and backend to build complete applications',
    techs: ['fundamentals', 'html', 'css', 'javascript', 'typescript', 'react', 'nodejs', 'sql', 'apis', 'docker', 'git'],
    totalHours: 200,
    careers: ['Full-Stack Developer', 'Product Engineer', 'Software Engineer', 'Tech Lead'],
  },
  {
    id: 'data',
    label: 'Data Scientist / ML',
    emoji: '🤖',
    color: '#ff6b35',
    description: 'Analyse data, build models, and deploy intelligent systems',
    techs: ['python', 'sql', 'ml', 'llms'],
    totalHours: 110,
    careers: ['Data Scientist', 'ML Engineer', 'AI Engineer', 'Analytics Engineer'],
  },
  {
    id: 'devops',
    label: 'DevOps / Cloud Engineer',
    emoji: '☁️',
    color: '#ff9900',
    description: 'Automate infrastructure, CI/CD pipelines, and cloud deployments',
    techs: ['linux', 'git', 'docker', 'cicd', 'aws', 'deployment'],
    totalHours: 95,
    careers: ['DevOps Engineer', 'SRE', 'Cloud Engineer', 'Platform Engineer'],
  },
  {
    id: 'security',
    label: 'Security Engineer',
    emoji: '🛡️',
    color: '#ef4444',
    description: 'Protect applications from vulnerabilities and attacks',
    techs: ['fundamentals', 'javascript', 'websecurity', 'cryptography'],
    totalHours: 78,
    careers: ['Security Engineer', 'Penetration Tester', 'DevSecOps', 'AppSec Engineer'],
  },
  {
    id: 'embedded',
    label: 'Embedded / IoT',
    emoji: '🔧',
    color: '#00979d',
    description: 'Program microcontrollers, IoT devices, and hardware interfaces',
    techs: ['python', 'linux', 'embedded'],
    totalHours: 80,
    careers: ['Embedded Systems Engineer', 'IoT Developer', 'Firmware Developer', 'Hardware Engineer'],
  },
];

type Tab = 'stages' | 'careers';

export default function RoadmapPage() {
  useSeo({
    title: 'Learning Roadmap',
    description: 'Full KERNAL curriculum — stage-by-stage or by career path. 24 tracks, 360 lessons.',
    path: '/roadmap',
    ogType: 'website',
  });

  const [tab, setTab] = useState<Tab>('stages');
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const progress = useStore(s => s.progress);

  useEffect(() => {
    loadTechnologies().then(setTechnologies).catch(() => {});
  }, []);

  const techById = Object.fromEntries(technologies.map(t => [t.id, t]));

  const byStage = technologies.reduce<Record<number, Technology[]>>((acc, t) => {
    if (!acc[t.stage]) acc[t.stage] = [];
    acc[t.stage].push(t);
    return acc;
  }, {});
  const stages = Object.keys(byStage).map(Number).sort((a, b) => a - b);

  const completedLessons = Object.values(progress).filter(Boolean).length;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-k-text mb-2">Learning Roadmap</h1>
        <p className="text-k-muted text-sm">
          24 courses · 360 lessons · Choose your path
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-k-surface border border-k-border rounded-lg mb-8 w-fit">
        <button
          onClick={() => setTab('stages')}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-kernal',
            tab === 'stages' ? 'bg-k-accent text-k-bg' : 'text-k-muted hover:text-k-text',
          )}
        >
          <Layers size={14} /> By Stage
        </button>
        <button
          onClick={() => setTab('careers')}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-kernal',
            tab === 'careers' ? 'bg-k-accent text-k-bg' : 'text-k-muted hover:text-k-text',
          )}
        >
          <Briefcase size={14} /> By Career Path
        </button>
      </div>

      {/* ── By Stage view ── */}
      {tab === 'stages' && (
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-px bg-k-border hidden md:block" />
          <div className="space-y-8">
            {stages.map(stage => {
              const meta = STAGE_META[stage] ?? { label: `Stage ${stage}`, color: '#4fd1c5' };
              const techs = byStage[stage];
              const allEnabled = techs.every(t => t.enabled);
              return (
                <div key={stage} className="md:pl-12 relative">
                  <div
                    className="hidden md:flex absolute left-0 w-10 h-10 rounded-full border-2 items-center justify-center text-xs font-bold font-mono z-10"
                    style={{ borderColor: meta.color, background: 'var(--bg)', color: meta.color }}
                  >
                    S{stage}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="md:hidden text-xs font-bold font-mono px-2 py-0.5 rounded border" style={{ borderColor: meta.color, color: meta.color }}>S{stage}</span>
                      <h2 className="font-bold text-k-text">{meta.label}</h2>
                      {!allEnabled && <span className="text-xs text-k-muted bg-k-surface rounded-full px-2 py-0.5 border border-k-border">Coming soon</span>}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {techs.map(tech => (
                        tech.enabled ? (
                          <Link
                            key={tech.id}
                            to={`/learn/${tech.id}`}
                            className="flex items-center gap-3 p-3 rounded-kernal border bg-k-surface border-k-border hover:border-k-accent/50 hover:bg-k-surface-2 transition-kernal group"
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0" style={{ background: tech.color }}>
                              {tech.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-k-text group-hover:text-k-accent transition-kernal truncate">{tech.name}</div>
                              <div className="text-xs text-k-muted truncate">{tech.description}</div>
                            </div>
                            <ArrowRight size={14} className="text-k-muted group-hover:text-k-accent transition-kernal shrink-0" />
                          </Link>
                        ) : (
                          <div key={tech.id} className="flex items-center gap-3 p-3 rounded-kernal border bg-k-surface/30 border-k-border/30 cursor-not-allowed select-none">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 grayscale opacity-30" style={{ background: tech.color, color: '#fff' }}>
                              {tech.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-k-muted/50 truncate">{tech.name}</div>
                              <div className="text-xs text-k-muted/35 truncate">{tech.description}</div>
                            </div>
                            <Lock size={13} className="text-k-muted/35 shrink-0" />
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── By Career Path view ── */}
      {tab === 'careers' && (
        <div className="space-y-4">
          <p className="text-sm text-k-muted mb-6">
            Choose a career goal and follow a curated sequence of courses — from zero to job-ready.
          </p>

          {DOMAIN_PATHS.map(domain => {
            const isOpen = expandedDomain === domain.id;
            const domainTechs = domain.techs.map(id => techById[id]).filter(Boolean);
            const techColors = domainTechs.map(t => t.color);

            return (
              <div key={domain.id} className="border border-k-border rounded-kernal overflow-hidden">
                {/* Domain header */}
                <button
                  onClick={() => setExpandedDomain(isOpen ? null : domain.id)}
                  className="w-full flex items-center gap-4 p-4 bg-k-surface hover:bg-k-surface-2 transition-kernal text-left"
                >
                  <span className="text-3xl shrink-0">{domain.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-bold text-k-text">{domain.label}</h2>
                      <span className="flex items-center gap-1 text-xs text-k-muted">
                        <Clock size={11} /> ~{domain.totalHours}h
                      </span>
                    </div>
                    <p className="text-xs text-k-muted truncate">{domain.description}</p>
                    {/* Mini color bar */}
                    <div className="flex gap-0.5 mt-2">
                      {techColors.slice(0, 8).map((c, i) => (
                        <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={clsx('text-k-muted shrink-0 transition-transform duration-200', isOpen && 'rotate-90')}
                  />
                </button>

                {/* Expanded domain detail */}
                <div className={clsx('overflow-hidden transition-all duration-200', isOpen ? 'max-h-[2000px]' : 'max-h-0')}>
                  <div className="border-t border-k-border p-4 bg-k-surface-2/30">
                    {/* Career chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {domain.careers.map(c => (
                        <span key={c} className="text-xs bg-k-surface border border-k-border rounded-full px-2.5 py-0.5 text-k-muted">
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Tech sequence */}
                    <h3 className="text-xs font-bold uppercase tracking-wider text-k-muted mb-3">Learning Sequence</h3>
                    <div className="space-y-2">
                      {domainTechs.map((tech, idx) => (
                        <Link
                          key={tech.id}
                          to={`/learn/${tech.id}`}
                          className="flex items-center gap-3 p-3 rounded-kernal border border-k-border bg-k-surface hover:border-k-accent/50 hover:bg-k-surface-2 transition-kernal group"
                        >
                          {/* Step number */}
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: tech.color + '20', color: tech.color, border: `1px solid ${tech.color}40` }}
                          >
                            {idx + 1}
                          </span>
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0"
                            style={{ background: tech.color }}
                          >
                            {tech.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-k-text group-hover:text-k-accent transition-kernal truncate">
                              {tech.name}
                            </div>
                            <div className="text-xs text-k-muted truncate">{tech.description}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-k-muted hidden sm:block">{tech.estimatedHours}h</span>
                            <ArrowRight size={13} className="text-k-muted group-hover:text-k-accent transition-kernal" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-4 pt-4 border-t border-k-border">
                      <Link
                        to={`/learn/${domain.techs[0]}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-k-accent text-k-bg rounded-kernal font-semibold text-sm hover:bg-k-accent/90 transition-kernal"
                      >
                        Start this path →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress summary */}
      <div className="mt-12 p-5 bg-k-surface border border-k-border rounded-kernal">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={18} className="text-k-accent" />
          <h3 className="font-semibold text-k-text">Your progress</h3>
        </div>
        <p className="text-sm text-k-muted mb-3">
          You've completed <span className="text-k-text font-medium">{completedLessons}</span> lessons so far.
        </p>
        <Link to="/progress" className="text-xs text-k-accent hover:text-k-text transition-kernal">
          View detailed progress →
        </Link>
      </div>
    </div>
  );
}
