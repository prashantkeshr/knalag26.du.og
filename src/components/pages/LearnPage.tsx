import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Bookmark, BookmarkCheck, Clock, ExternalLink,
  Share2, Check, ThumbsUp, ThumbsDown, FileText, X, Award,
} from 'lucide-react';
import { loadLesson, loadCourse, loadModules } from '@/lib/content-engine';
import { useSeo } from '@/lib/seo';
import { useStore } from '@/store';
import type { Lesson, Course, Module } from '@/types/content';
import ContentRenderer from '@/components/content/ContentRenderer';
import GitHubRefs from '@/components/content/GitHubRefs';
import clsx from 'clsx';

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'text-k-success bg-k-success/10 border-k-success/30',
  intermediate: 'text-k-warning bg-k-warning/10 border-k-warning/30',
  advanced:     'text-k-danger  bg-k-danger/10  border-k-danger/30',
};

export default function LearnPage() {
  const { tech, lessonId } = useParams<{ tech: string; lessonId?: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { progress, bookmarks, markComplete, markIncomplete, toggleBookmark } = useStore();
  const isComplete  = lessonId ? !!progress[lessonId] : false;
  const isBookmarked = lessonId ? bookmarks.includes(lessonId) : false;

  const [copied, setCopied] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(() => {
    try { return localStorage.getItem(`kernal_rating_${lessonId}`) as 'up' | 'down' | null; } catch { return null; }
  });
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(`kernal_note_${lessonId}`) ?? ''; } catch { return ''; }
  });
  const [noteOpen, setNoteOpen] = useState(false);

  const shareLesson = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveNote = (val: string) => {
    setNote(val);
    try { localStorage.setItem(`kernal_note_${lessonId}`, val); } catch { /* private */ }
  };

  const rateLesson = (val: 'up' | 'down') => {
    const next = rating === val ? null : val;
    setRating(next);
    try {
      if (next) localStorage.setItem(`kernal_rating_${lessonId}`, next);
      else localStorage.removeItem(`kernal_rating_${lessonId}`);
    } catch { /* private */ }
  };

  useEffect(() => {
    setRating(null);
    setNote('');
    setNoteOpen(false);
    try {
      setRating(localStorage.getItem(`kernal_rating_${lessonId}`) as 'up' | 'down' | null);
      setNote(localStorage.getItem(`kernal_note_${lessonId}`) ?? '');
    } catch { /* private */ }
  }, [lessonId]);

  useEffect(() => {
    if (!tech) return;
    setLoading(true);
    setError(null);

    Promise.all([
      loadCourse(tech),
      loadModules(tech),
    ]).then(([c, mods]) => {
      setCourse(c);
      setModules(mods);
      // Auto-redirect to first lesson if no lessonId
      if (!lessonId && mods[0]?.lessons[0]) {
        navigate(`/learn/${tech}/${mods[0].lessons[0].id}`, { replace: true });
      }
    }).catch(() => setError(`Could not load course for "${tech}".`));
  }, [tech, navigate, lessonId]);

  useEffect(() => {
    if (!tech || !lessonId) return;
    setLoading(true);
    setError(null);

    loadLesson(tech, lessonId)
      .then(l => {
        setLesson(l);
        setLoading(false);
        try {
          localStorage.setItem('kernal_lastTopicTitle', l.title);
          localStorage.setItem('kernal_lastTopicUrl', `/learn/${tech}/${lessonId}`);
        } catch { /* private browsing */ }
      })
      .catch(() => { setError(`Lesson "${lessonId}" not found.`); setLoading(false); });
  }, [tech, lessonId]);

  // Flatten all lessons for prev/next
  const allLessons = modules.flatMap(m => m.lessons);
  const currentIdx = lessonId ? allLessons.findIndex(l => l.id === lessonId) : -1;
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // FAQ section
  const faq = lesson?.faq ?? [];

  // Memoize JSON-LD so the useSeo effect only re-runs when data actually changes
  const jsonLd = useMemo(() => {
    if (!lesson || !tech) return undefined;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LearningResource',
          name: lesson.title,
          description: lesson.subtitle,
          url: `https://kernal.dhurta.org/learn/${tech}/${lessonId}`,
          educationalLevel: lesson.difficulty === 'beginner' ? 'Beginner'
            : lesson.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
          learningResourceType: 'Lesson',
          isAccessibleForFree: true,
          inLanguage: 'en',
          timeRequired: `PT${lesson.estimatedMinutes}M`,
          provider: { '@type': 'Organization', name: 'KERNAL by Dhurta.Org', url: 'https://kernal.dhurta.org' },
          isPartOf: course ? { '@type': 'Course', name: course.name, url: `https://kernal.dhurta.org/learn/${tech}` } : undefined,
          teaches: lesson.skillsTaught,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://kernal.dhurta.org/' },
            { '@type': 'ListItem', position: 2, name: course?.name ?? tech, item: `https://kernal.dhurta.org/learn/${tech}` },
            { '@type': 'ListItem', position: 3, name: lesson.title,  item: `https://kernal.dhurta.org/learn/${tech}/${lessonId}` },
          ],
        },
      ],
    };
  }, [lesson, course, tech, lessonId]);

  const keywords = lesson && tech
    ? [
        tech,
        `learn ${tech}`,
        `${tech} tutorial`,
        `${tech} course`,
        lesson.title.toLowerCase(),
        ...(lesson.skillsTaught ?? []),
        'coding tutorial',
        'programming',
        'KERNAL',
        'free coding',
      ].join(', ')
    : undefined;

  // Per-lesson SEO: title, description, canonical, structured data
  useSeo({
    title: lesson ? lesson.title : (course?.name ?? tech ?? 'Learn'),
    description: lesson
      ? lesson.subtitle
      : (course ? `Learn ${course.name} — free interactive lessons on KERNAL` : ''),
    path: lesson && tech && lessonId
      ? `/learn/${tech}/${lessonId}`
      : `/learn/${tech ?? ''}`,
    jsonLd,
    keywords,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-k-danger mb-4">{error}</p>
        <Link to="/" className="text-k-accent hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  if (loading && !lesson) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 bg-k-surface rounded-lg w-2/3" />
        <div className="h-4 bg-k-surface rounded w-1/3" />
        <div className="h-32 bg-k-surface rounded-kernal mt-4" />
        <div className="h-4 bg-k-surface rounded w-full" />
        <div className="h-4 bg-k-surface rounded w-5/6" />
        <div className="h-4 bg-k-surface rounded w-4/6" />
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <article>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-k-muted mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-k-text transition-kernal">Home</Link>
        <ChevronRight size={12} />
        <Link to={`/learn/${tech}`} className="hover:text-k-text transition-kernal capitalize">{course?.name ?? tech}</Link>
        <ChevronRight size={12} />
        <span className="text-k-text truncate max-w-[200px]">{lesson.title}</span>
      </nav>

      {/* Lesson Header */}
      <header className="mb-8">
        <div className="flex items-start gap-3 flex-wrap mb-3">
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full border capitalize', DIFFICULTY_COLOR[lesson.difficulty])}>
            {lesson.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-k-muted">
            <Clock size={12} /> {lesson.estimatedMinutes} min
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={shareLesson}
              className="p-1.5 rounded-lg text-k-muted hover:text-k-accent hover:bg-k-surface transition-kernal"
              aria-label="Share lesson"
            >
              {copied ? <Check size={15} className="text-k-success" /> : <Share2 size={15} />}
            </button>
            <button
              onClick={() => lessonId && toggleBookmark(lessonId)}
              className="p-1.5 rounded-lg text-k-muted hover:text-k-warning hover:bg-k-surface transition-kernal"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            >
              {isBookmarked ? <BookmarkCheck size={16} className="text-k-warning" /> : <Bookmark size={16} />}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-k-text mb-2">{lesson.title}</h1>
        <p className="text-k-muted text-base">{lesson.subtitle}</p>

        {/* Skills taught */}
        {lesson.skillsTaught.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {lesson.skillsTaught.map(s => (
              <span key={s} className="text-xs bg-k-accent/10 text-k-accent border border-k-accent/20 rounded-full px-2 py-0.5 font-mono">
                {s}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <ContentRenderer
        blocks={lesson.content}
        lessonId={lesson.id}
        whyItExists={lesson.whyItExists}
        explainModes={lesson.explainModes}
      />

      {/* FAQ Section */}
      {faq.length > 0 && (
        <section className="mt-10" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-lg font-semibold text-k-text mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details
                key={i}
                className="border border-k-border rounded-kernal overflow-hidden group"
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
              >
                <summary
                  itemProp="name"
                  className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-k-text hover:bg-k-surface-2 transition-kernal list-none"
                >
                  {item.q}
                  <ChevronRight size={14} className="text-k-muted group-open:rotate-90 transition-transform" />
                </summary>
                <div
                  itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                  className="px-4 py-3 border-t border-k-border bg-k-surface-2/50"
                >
                  <p itemProp="text" className="text-sm text-k-muted leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {lesson.sources && lesson.sources.length > 0 && (
        <section className="mt-8 pt-6 border-t border-k-border">
          <h3 className="text-xs font-semibold text-k-muted uppercase tracking-wider mb-3">Sources & References</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-k-muted hover:text-k-accent border border-k-border hover:border-k-accent/50 rounded-lg px-3 py-1.5 transition-kernal"
              >
                <ExternalLink size={11} />
                {src.name}
                <span className="text-k-muted/50">· {src.verified}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* GitHub real code examples */}
      {tech && lesson && (
        <GitHubRefs tech={tech} lessonTitle={lesson.title} skills={lesson.skillsTaught ?? []} />
      )}

      {/* Notes */}
      <section className="mt-6 border border-k-border rounded-kernal overflow-hidden">
        <button
          onClick={() => setNoteOpen(o => !o)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-k-surface hover:bg-k-surface-2 transition-kernal text-left"
        >
          <FileText size={15} className="text-k-muted shrink-0" />
          <span className="text-sm font-medium text-k-text flex-1">My Notes</span>
          {note && <span className="w-2 h-2 rounded-full bg-k-accent shrink-0" />}
          <span className="text-xs text-k-muted">{noteOpen ? 'hide' : note ? 'edit' : 'add note'}</span>
        </button>
        {noteOpen && (
          <div className="border-t border-k-border p-3">
            <textarea
              value={note}
              onChange={e => saveNote(e.target.value)}
              placeholder="Jot down anything — commands to remember, things to look up, your own explanation…"
              rows={5}
              className="w-full bg-k-bg border border-k-border rounded-lg px-3 py-2 text-sm text-k-text placeholder:text-k-muted outline-none focus:border-k-accent/60 resize-y font-mono"
            />
            <p className="text-xs text-k-muted mt-1">Saved automatically to this device.</p>
          </div>
        )}
      </section>

      {/* Was this helpful */}
      <div className="mt-6 flex items-center gap-4 py-4 border-y border-k-border">
        <span className="text-sm text-k-muted">Was this lesson helpful?</span>
        <div className="flex gap-2">
          <button
            onClick={() => rateLesson('up')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-kernal',
              rating === 'up'
                ? 'bg-k-success/20 text-k-success border-k-success/40'
                : 'border-k-border text-k-muted hover:border-k-success/40 hover:text-k-success'
            )}
          >
            <ThumbsUp size={14} /> Yes
          </button>
          <button
            onClick={() => rateLesson('down')}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-kernal',
              rating === 'down'
                ? 'bg-k-danger/20 text-k-danger border-k-danger/40'
                : 'border-k-border text-k-muted hover:border-k-danger/40 hover:text-k-danger'
            )}
          >
            <ThumbsDown size={14} /> No
          </button>
        </div>
      </div>

      {/* Complete / Incomplete toggle */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            if (!lessonId) return;
            if (isComplete) {
              markIncomplete(lessonId);
            } else {
              markComplete(lessonId);
              const updated = { ...progress, [lessonId]: true };
              const allDone = allLessons.length > 0 && allLessons.every(l => updated[l.id]);
              if (allDone) setShowCompletion(true);
            }
          }}
          className={clsx(
            'flex items-center gap-2 px-5 py-2.5 rounded-kernal font-semibold text-sm transition-kernal',
            isComplete
              ? 'bg-k-success/20 text-k-success border border-k-success/30 hover:bg-k-success/10'
              : 'bg-k-accent text-k-bg hover:bg-k-accent/90'
          )}
        >
          {isComplete
            ? <><CheckCircle2 size={16} /> Completed — click to undo</>
            : <><Circle size={16} /> Mark as complete</>
          }
        </button>
        <button
          onClick={shareLesson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-kernal border border-k-border text-k-muted text-sm hover:border-k-accent/50 hover:text-k-accent transition-kernal"
        >
          {copied ? <><Check size={15} className="text-k-success" /> Copied!</> : <><Share2 size={15} /> Share</>}
        </button>
      </div>

      {/* Track completion modal */}
      {showCompletion && course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-k-surface border border-k-warning/40 rounded-kernal p-8 max-w-sm w-full text-center shadow-2xl">
            <button
              onClick={() => setShowCompletion(false)}
              className="absolute top-3 right-3 p-1.5 text-k-muted hover:text-k-text transition-kernal"
            >
              <X size={16} />
            </button>
            <div className="text-5xl mb-4">🎉</div>
            <Award size={32} className="text-k-warning mx-auto mb-3" />
            <h2 className="text-xl font-bold text-k-text mb-2">Track Complete!</h2>
            <p className="text-k-muted text-sm mb-1">You finished all lessons in</p>
            <p className="text-k-accent font-semibold mb-5">{course.name}</p>
            <Link
              to="/progress"
              onClick={() => setShowCompletion(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-k-warning text-k-bg rounded-kernal font-semibold text-sm hover:bg-k-warning/90 transition-kernal"
            >
              <Award size={16} /> Claim Certificate
            </Link>
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      <nav className="flex items-center justify-between mt-8 pt-6 border-t border-k-border gap-4" aria-label="Lesson navigation">
        {prevLesson ? (
          <Link
            to={`/learn/${tech}/${prevLesson.id}`}
            className="flex-1 max-w-xs flex items-center gap-2 p-3 rounded-kernal border border-k-border hover:border-k-accent/50 hover:bg-k-surface transition-kernal"
          >
            <ChevronLeft size={16} className="text-k-muted shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-k-muted">Previous</div>
              <div className="text-sm text-k-text font-medium truncate">{prevLesson.title}</div>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {nextLesson && (
          <Link
            to={`/learn/${tech}/${nextLesson.id}`}
            className="flex-1 max-w-xs flex items-center justify-end gap-2 p-3 rounded-kernal border border-k-border hover:border-k-accent/50 hover:bg-k-surface transition-kernal text-right"
          >
            <div className="min-w-0">
              <div className="text-xs text-k-muted">Next</div>
              <div className="text-sm text-k-text font-medium truncate">{nextLesson.title}</div>
            </div>
            <ChevronRight size={16} className="text-k-muted shrink-0" />
          </Link>
        )}
      </nav>

      {/* Real world */}
      {lesson.realWorld && (
        <section className="mt-8 p-4 rounded-kernal bg-k-surface border border-k-border">
          <h3 className="text-xs font-semibold text-k-muted uppercase tracking-wider mb-3">Used in the real world</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {lesson.realWorld.usedIn.map(use => (
              <span key={use} className="text-xs bg-k-surface-2 text-k-muted rounded-full px-2 py-0.5">{use}</span>
            ))}
          </div>
          {lesson.realWorld.examples.map((ex, i) => (
            <p key={i} className="text-xs text-k-muted">• {ex}</p>
          ))}
        </section>
      )}
    </article>
  );
}
