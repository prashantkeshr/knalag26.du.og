import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, CheckCircle2, Circle,
  BookOpen, Map, BarChart2, Settings, Zap, Loader2, StickyNote,
} from 'lucide-react';
import { useStore } from '@/store';
import { loadTechnologies, loadModules } from '@/lib/content-engine';
import type { Technology, Module } from '@/types/content';
import clsx from 'clsx';

export default function Sidebar() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  // Per-tech modules cache: techId → Module[]
  const [techModulesMap, setTechModulesMap] = useState<Record<string, Module[]>>({});
  const [loadingTech, setLoadingTech] = useState<string | null>(null);
  const [expandedTech, setExpandedTech] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const { tech: activeTech, lessonId: activeLesson } = useParams();
  const location = useLocation();
  const progress = useStore(s => s.progress);

  useEffect(() => {
    loadTechnologies().then(setTechnologies).catch(() => {});
  }, []);

  // Auto-expand active tech on route change
  useEffect(() => {
    if (activeTech) setExpandedTech(activeTech);
  }, [activeTech]);

  // Load modules whenever expandedTech changes
  useEffect(() => {
    if (!expandedTech) return;

    // Already cached → just sync the expanded module
    if (techModulesMap[expandedTech]) {
      if (activeLesson && activeTech === expandedTech) {
        const mod = techModulesMap[expandedTech].find(m => m.lessons.some(l => l.id === activeLesson));
        if (mod) setExpandedModule(mod.id);
      }
      return;
    }

    setLoadingTech(expandedTech);
    loadModules(expandedTech)
      .then(mods => {
        setTechModulesMap(prev => ({ ...prev, [expandedTech]: mods }));
        // Open the right module
        if (activeLesson && activeTech === expandedTech) {
          const mod = mods.find(m => m.lessons.some(l => l.id === activeLesson));
          setExpandedModule(mod?.id ?? mods[0]?.id ?? null);
        } else {
          setExpandedModule(mods[0]?.id ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingTech(null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedTech]);

  // Sync expanded module when active lesson changes within the same tech
  useEffect(() => {
    if (!activeTech || !activeLesson) return;
    const mods = techModulesMap[activeTech];
    if (!mods) return;
    const mod = mods.find(m => m.lessons.some(l => l.id === activeLesson));
    if (mod) setExpandedModule(mod.id);
  }, [activeLesson, activeTech, techModulesMap]);

  const closeMobile = () => {
    if (window.innerWidth < 1024) useStore.getState().setSidebarOpen(false);
  };

  const notes = useStore(s => s.notes);
  const noteCount = Object.values(notes).filter(n => n?.text?.trim()).length;

  const navItems = [
    { to: '/',             icon: BookOpen,   label: 'Home',         badge: undefined as number | undefined },
    { to: '/roadmap',      icon: Map,        label: 'Roadmap',      badge: undefined },
    { to: '/progress',     icon: BarChart2,  label: 'Progress',     badge: undefined },
    { to: '/notes',        icon: StickyNote, label: 'Notes',        badge: noteCount || undefined },
    { to: '/api-explorer', icon: Zap,        label: 'API Explorer', badge: undefined },
    { to: '/settings',     icon: Settings,   label: 'Settings',     badge: undefined },
  ];

  return (
    <nav className="flex flex-col h-full py-4" aria-label="Site navigation">
      {/* Top nav links */}
      <div className="px-3 mb-4">
        {navItems.map(({ to, icon: Icon, label, badge }) => {
          const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-kernal mb-0.5',
                isActive
                  ? 'bg-k-accent/15 text-k-accent'
                  : 'text-k-muted hover:text-k-text hover:bg-k-surface-2',
              )}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className="text-[10px] font-bold bg-k-accent/20 text-k-accent rounded-full px-1.5 py-0.5 leading-none">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="px-4 mb-2">
        <span className="text-xs font-semibold text-k-muted uppercase tracking-wider">Learning Paths</span>
      </div>

      {/* Technologies */}
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {technologies.map(tech => {
          const isExpanded = expandedTech === tech.id;
          const techMods = techModulesMap[tech.id] ?? [];
          const isLoadingThis = loadingTech === tech.id;

          return (
            <div key={tech.id} className="mb-0.5">
              {/* Tech header button */}
              <button
                onClick={() => {
                  if (!tech.enabled) return;
                  setExpandedTech(isExpanded ? null : tech.id);
                }}
                disabled={!tech.enabled}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-kernal',
                  tech.enabled
                    ? activeTech === tech.id
                      ? 'bg-k-surface-2 text-k-text'
                      : 'text-k-muted hover:text-k-text hover:bg-k-surface-2'
                    : 'text-k-border cursor-not-allowed opacity-40',
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tech.color }}
                />
                <span className="flex-1 text-left truncate">{tech.name}</span>
                <span className="text-xs text-k-muted/60 font-normal shrink-0">S{tech.stage}</span>
                {tech.enabled && (
                  isLoadingThis
                    ? <Loader2 size={12} className="text-k-muted shrink-0 animate-spin" />
                    : isExpanded
                      ? <ChevronDown size={14} className="text-k-muted shrink-0 transition-transform duration-200" />
                      : <ChevronRight size={14} className="text-k-muted shrink-0 transition-transform duration-200" />
                )}
              </button>

              {/* Animated expand panel */}
              <div
                className={clsx(
                  'overflow-hidden transition-all duration-200 ease-out',
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
                )}
              >
                {/* Course overview link */}
                <div className="ml-3 mt-1 border-l border-k-border pl-3">
                  <Link
                    to={`/learn/${tech.id}`}
                    onClick={closeMobile}
                    className={clsx(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-kernal mb-1',
                      location.pathname === `/learn/${tech.id}`
                        ? 'bg-k-accent/15 text-k-accent font-semibold'
                        : 'text-k-muted hover:text-k-text hover:bg-k-surface-2',
                    )}
                  >
                    <BookOpen size={11} className="shrink-0" />
                    Course Overview
                  </Link>

                  {/* Modules */}
                  {techMods.map(mod => {
                    const isModExpanded = expandedModule === mod.id;
                    const modDone = mod.lessons.filter(l => progress[l.id]).length;

                    return (
                      <div key={mod.id} className="mb-0.5">
                        <button
                          onClick={() => setExpandedModule(isModExpanded ? null : mod.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold text-k-muted hover:text-k-text hover:bg-k-surface-2 transition-kernal"
                        >
                          {isModExpanded
                            ? <ChevronDown size={11} className="shrink-0 transition-transform duration-150" />
                            : <ChevronRight size={11} className="shrink-0 transition-transform duration-150" />
                          }
                          <span className="flex-1 text-left truncate uppercase tracking-wide text-[10px]">
                            {mod.title}
                          </span>
                          <span className="text-k-muted/60 text-[10px]">{modDone}/{mod.lessons.length}</span>
                        </button>

                        {/* Lessons */}
                        <div
                          className={clsx(
                            'overflow-hidden transition-all duration-150 ease-out',
                            isModExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
                          )}
                        >
                          <div className="mt-0.5 ml-2 border-l border-k-border/50 pl-2">
                            {mod.lessons.map(lesson => {
                              const done = progress[lesson.id];
                              const isActive = activeLesson === lesson.id;

                              return (
                                <Link
                                  key={lesson.id}
                                  to={`/learn/${tech.id}/${lesson.id}`}
                                  onClick={closeMobile}
                                  className={clsx(
                                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-kernal',
                                    isActive
                                      ? 'bg-k-accent/20 text-k-accent font-medium'
                                      : 'text-k-muted hover:text-k-text hover:bg-k-surface-2',
                                  )}
                                >
                                  {done
                                    ? <CheckCircle2 size={11} className="text-k-success shrink-0" />
                                    : <Circle size={11} className="shrink-0 opacity-40" />
                                  }
                                  <span className="truncate">{lesson.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 border-t border-k-border mt-2">
        <p className="text-xs text-k-muted/60 font-mono">KERNAL v0.1.0-alpha</p>
      </div>
    </nav>
  );
}
