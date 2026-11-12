import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Search, Trash2, ExternalLink, Download,
  StickyNote, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store';
import { useSeo } from '@/lib/seo';
import clsx from 'clsx';

export default function NotesPage() {
  useSeo({
    title: 'My Notes',
    description: 'All your personal notes from KERNAL lessons — in one place.',
    path: '/notes',
  });

  const { notes, deleteNote } = useStore();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const allNotes = useMemo(() => {
    return Object.entries(notes)
      .filter(([, n]) => n.text?.trim())
      .sort((a, b) => new Date(b[1].savedAt).getTime() - new Date(a[1].savedAt).getTime());
  }, [notes]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allNotes;
    const q = search.toLowerCase();
    return allNotes.filter(
      ([, n]) =>
        n.text.toLowerCase().includes(q) ||
        n.lessonTitle.toLowerCase().includes(q) ||
        n.techName.toLowerCase().includes(q),
    );
  }, [allNotes, search]);

  // Group by tech
  const grouped = useMemo(() => {
    const map = new Map<string, { techName: string; techId: string; entries: [string, typeof filtered[0][1]][] }>();
    for (const [id, n] of filtered) {
      if (!map.has(n.techId)) map.set(n.techId, { techName: n.techName, techId: n.techId, entries: [] });
      map.get(n.techId)!.entries.push([id, n]);
    }
    return [...map.values()];
  }, [filtered]);

  const handleDelete = (lessonId: string) => {
    deleteNote(lessonId);
    setConfirmDelete(null);
  };

  const exportNotes = () => {
    const lines = allNotes.map(([id, n]) =>
      `# ${n.techName} — ${n.lessonTitle}\nURL: https://kernal.dhurta.org/learn/${n.techId}/${id}\nSaved: ${new Date(n.savedAt).toLocaleDateString()}\n\n${n.text}\n\n---\n`
    ).join('\n');
    const blob = new Blob([`# My KERNAL Notes\nExported: ${new Date().toLocaleString()}\n\n---\n\n` + lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kernal-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <StickyNote size={24} className="text-k-warning" />
          <h1 className="text-2xl font-bold text-k-text">My Notes</h1>
          <span className="text-xs bg-k-surface border border-k-border text-k-muted rounded-full px-2 py-0.5">
            {allNotes.length} note{allNotes.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-k-muted text-sm">
          Personal notes from your lessons — saved to this device.
        </p>
      </header>

      {allNotes.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Search + Export bar */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-k-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-k-surface border border-k-border rounded-lg pl-9 pr-3 py-2 text-sm text-k-text placeholder:text-k-muted outline-none focus:border-k-accent/60"
              />
            </div>
            <button
              onClick={exportNotes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-k-border text-xs text-k-muted hover:border-k-accent/50 hover:text-k-accent transition-kernal"
            >
              <Download size={13} /> Export
            </button>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <p className="text-k-muted text-sm py-10 text-center">No notes match your search.</p>
          ) : (
            <div className="space-y-8">
              {grouped.map(group => (
                <section key={group.techId}>
                  <div className="flex items-center gap-2 mb-3">
                    <Link
                      to={`/learn/${group.techId}`}
                      className="text-sm font-bold text-k-text hover:text-k-accent transition-kernal flex items-center gap-1"
                    >
                      {group.techName}
                      <ChevronRight size={13} className="text-k-muted" />
                    </Link>
                    <span className="text-xs text-k-muted">{group.entries.length} note{group.entries.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-3">
                    {group.entries.map(([lessonId, note]) => (
                      <div
                        key={lessonId}
                        className="border border-k-border rounded-kernal bg-k-surface overflow-hidden"
                      >
                        {/* Note header */}
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-k-border bg-k-surface-2/50">
                          <FileText size={13} className="text-k-warning shrink-0" />
                          <span className="text-xs font-semibold text-k-text flex-1 truncate">{note.lessonTitle}</span>
                          <span className="text-xs text-k-muted/60 shrink-0">
                            {new Date(note.savedAt).toLocaleDateString()}
                          </span>
                          <Link
                            to={`/learn/${note.techId}/${lessonId}`}
                            className="p-1 rounded text-k-muted hover:text-k-accent transition-kernal shrink-0"
                            title="Open lesson"
                          >
                            <ExternalLink size={12} />
                          </Link>
                          {confirmDelete === lessonId ? (
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleDelete(lessonId)}
                                className="text-xs text-k-danger hover:underline px-1"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs text-k-muted hover:text-k-text px-1"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(lessonId)}
                              className="p-1 rounded text-k-muted/60 hover:text-k-danger transition-kernal shrink-0"
                              title="Delete note"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>

                        {/* Note body */}
                        <pre
                          className={clsx(
                            'px-4 py-3 text-xs text-k-text font-mono leading-relaxed whitespace-pre-wrap',
                            note.text.length > 400 ? 'max-h-40 overflow-y-auto' : '',
                          )}
                        >
                          {note.text}
                        </pre>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-k-surface border border-k-border flex items-center justify-center">
        <StickyNote size={28} className="text-k-muted" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-k-text mb-1">No notes yet</h2>
        <p className="text-sm text-k-muted max-w-xs">
          Open any lesson and jot down notes — they'll appear here, grouped by course.
        </p>
      </div>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-kernal bg-k-accent text-k-bg text-sm font-semibold hover:bg-k-accent/90 transition-kernal"
      >
        Browse courses
      </Link>
    </div>
  );
}
