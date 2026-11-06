import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, ChevronRight, ChevronDown, CheckCircle2, Circle,
  BookOpen, Briefcase, Hammer, Play, Award, Star,
} from 'lucide-react';
import type { Course, Module } from '@/types/content';
import { getOutcome } from '@/lib/course-outcomes';
import { useStore } from '@/store';
import clsx from 'clsx';

interface Props {
  tech: string;
  course: Course;
  modules: Module[];
}

const DIFF_STYLES: Record<string, string> = {
  beginner:     'text-k-success bg-k-success/10 border-k-success/30',
  intermediate: 'text-k-warning bg-k-warning/10 border-k-warning/30',
  advanced:     'text-k-danger  bg-k-danger/10  border-k-danger/30',
};

export default function CourseOverview({ tech, course, modules }: Props) {
  const outcome = getOutcome(tech);
  const progress = useStore(s => s.progress);
  const [expandedMod, setExpandedMod] = useState<string | null>(modules[0]?.id ?? null);

  const allLessons = modules.flatMap(m => m.lessons);
  const completedCount = allLessons.filter(l => progress[l.id]).length;
  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  // First unfinished lesson for CTA
  const nextLesson = allLessons.find(l => !progress[l.id]) ?? allLessons[0];

  return (
    <article className="animate-slide-up">
      {/* Hero */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-4xl">{outcome.emoji}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-k-text">{course.name}</h1>
            <p className="text-k-muted mt-0.5">{course.description}</p>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full border capitalize', DIFF_STYLES[course.difficulty])}>
            {course.difficulty}
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-k-surface border border-k-border rounded-full px-2.5 py-1 text-k-muted">
            <Clock size={11} /> {course.estimatedHours}h estimated
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-k-surface border border-k-border rounded-full px-2.5 py-1 text-k-muted">
            <BookOpen size={11} /> {allLessons.length} lessons
          </span>
          {course.certificationAvailable && (
            <span className="flex items-center gap-1.5 text-xs bg-k-warning/10 border border-k-warning/30 text-k-warning rounded-full px-2.5 py-1">
              <Award size={11} /> Certificate available
            </span>
          )}
        </div>

        {/* Progress bar (shown if started) */}
        {completedCount > 0 && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-k-muted font-medium">Your progress</span>
              <span className="text-xs font-semibold text-k-accent">{completedCount}/{allLessons.length} complete</span>
            </div>
            <div className="h-2 bg-k-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-k-accent rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {course.prerequisites.length > 0 && (
          <p className="text-xs text-k-muted mb-5">
            <span className="font-semibold text-k-text">Prerequisites: </span>
            {course.prerequisites.map((p, i) => (
              <span key={p}>
                <Link to={`/learn/${p}`} className="text-k-accent hover:underline capitalize">{p}</Link>
                {i < course.prerequisites.length - 1 && ', '}
              </span>
            ))}
          </p>
        )}

        {/* CTA */}
        {nextLesson && (
          <Link
            to={`/learn/${tech}/${nextLesson.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-k-accent text-k-bg font-bold text-sm rounded-kernal hover:bg-k-accent/90 transition-kernal shadow-sm"
          >
            <Play size={16} fill="currentColor" />
            {completedCount > 0 ? 'Continue Learning' : 'Start Learning'}
          </Link>
        )}
      </header>

      {/* Outcome cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <OutcomeCard
          icon={<Star size={18} className="text-k-accent" />}
          label="Skills you'll gain"
          items={outcome.skills}
          accent="k-accent"
        />
        <OutcomeCard
          icon={<Hammer size={18} className="text-k-warning" />}
          label="What you'll build"
          items={outcome.builds}
          accent="k-warning"
        />
        <OutcomeCard
          icon={<Briefcase size={18} className="text-k-success" />}
          label="Career paths unlocked"
          items={outcome.careers}
          accent="k-success"
        />
      </div>

      {/* Curriculum */}
      <section>
        <h2 className="text-base font-bold text-k-text mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-k-muted" />
          Curriculum
        </h2>

        <div className="space-y-2">
          {modules.map((mod, mi) => {
            const isOpen = expandedMod === mod.id;
            const modDone = mod.lessons.filter(l => progress[l.id]).length;

            return (
              <div key={mod.id} className="border border-k-border rounded-kernal overflow-hidden">
                <button
                  onClick={() => setExpandedMod(isOpen ? null : mod.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-k-surface hover:bg-k-surface-2 transition-kernal text-left"
                >
                  <span className="w-6 h-6 rounded-full bg-k-surface-2 border border-k-border text-xs font-bold text-k-muted flex items-center justify-center shrink-0">
                    {mi + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-k-text">{mod.title}</div>
                    <div className="text-xs text-k-muted truncate">{mod.description}</div>
                  </div>
                  <span className="text-xs text-k-muted shrink-0 mr-1">{modDone}/{mod.lessons.length}</span>
                  {isOpen
                    ? <ChevronDown size={14} className="text-k-muted shrink-0 transition-transform" />
                    : <ChevronRight size={14} className="text-k-muted shrink-0 transition-transform" />
                  }
                </button>

                <div
                  className={clsx(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-[600px]' : 'max-h-0',
                  )}
                >
                  <div className="border-t border-k-border divide-y divide-k-border">
                    {mod.lessons.map(lesson => {
                      const done = progress[lesson.id];
                      return (
                        <Link
                          key={lesson.id}
                          to={`/learn/${tech}/${lesson.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-k-surface-2 transition-kernal group"
                        >
                          {done
                            ? <CheckCircle2 size={14} className="text-k-success shrink-0" />
                            : <Circle size={14} className="text-k-border shrink-0" />
                          }
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-k-text group-hover:text-k-accent transition-kernal truncate">
                              {lesson.title}
                            </div>
                            <div className="text-xs text-k-muted truncate">{lesson.subtitle}</div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-k-muted">{lesson.estimatedMinutes}m</span>
                            <ChevronRight size={12} className="text-k-muted opacity-0 group-hover:opacity-100 transition-kernal" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}

function OutcomeCard({ icon, label, items, accent }: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className={clsx('rounded-kernal border border-k-border bg-k-surface p-4 flex flex-col gap-3')}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider text-k-muted">{label}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2 text-xs text-k-text leading-relaxed">
            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full bg-${accent} shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
