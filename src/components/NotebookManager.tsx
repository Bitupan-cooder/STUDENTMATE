import React, { useState, useEffect } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { Note } from "../types";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  FileText,
  Tag,
  Save,
  FolderOpen,
  BookOpen,
  Download,
  Share,
} from "lucide-react";
import { motion } from "motion/react";

interface NotebookManagerProps {
  selectedNoteId: string | null;
  onClearSelectedNote: () => void;
}

// Simple custom Markdown to HTML renderer for clean formula display and beautiful text styles
function parseMarkdownToHtml(markdown: string): string {
  if (!markdown)
    return "<p class='text-slate-400 italic text-sm'>Write something amazing in Markdown...</p>";

  let html = markdown;

  // Escaping HTML to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(
    /^# (.*?)$/gm,
    "<h1 class='text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-4 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1'>$1</h1>",
  );
  html = html.replace(
    /^## (.*?)$/gm,
    "<h2 class='text-xl font-bold text-slate-800 dark:text-slate-100 mt-4 mb-1.5'>$1</h2>",
  );
  html = html.replace(
    /^### (.*?)$/gm,
    "<h3 class='text-lg font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1'>$1</h3>",
  );

  // Math equations block / LaTeX mock styling
  html = html.replace(
    /\$\$(.*?)\$\$/g,
    "<div class='my-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 font-mono text-center text-sm overflow-x-auto text-indigo-600 dark:text-indigo-400'>$1</div>",
  );
  html = html.replace(
    /\$(.*?)\$/g,
    "<code class='px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-350 font-mono text-xs rounded-sm text-indigo-600 dark:text-indigo-400'>$1</code>",
  );

  // Code blocks
  html = html.replace(
    /```([\s\S]*?)```/g,
    "<pre class='my-3 p-3.5 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-850'>$1</pre>",
  );
  html = html.replace(
    /`([^`]+)`/g,
    "<code class='px-1.5 py-0.5 bg-slate-150 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs rounded-sm'>$1</code>",
  );

  // Bold / Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Lists
  html = html.replace(
    /^\s*-\s+(.*?)$/gm,
    "<li class='list-disc list-inside ml-4 text-xs text-slate-655 dark:text-slate-350 leading-relaxed'>$1</li>",
  );
  html = html.replace(
    /^\s*\d+\.\s+(.*?)$/gm,
    "<li class='list-decimal list-inside ml-4 text-xs text-slate-655 dark:text-slate-350 leading-relaxed'>$1</li>",
  );

  // Blockquotes
  html = html.replace(
    /^>\s+(.*?)$/gm,
    "<blockquote class='pl-3.5 py-1 border-l-4 border-indigo-500 my-2.5 text-slate-500 dark:text-slate-400 italic text-xs leading-relaxed'>$1</blockquote>",
  );

  // Line breaks
  html = html.replace(/\n/g, "<br/>");

  return html;
}

function parseMarkdownForPDF(markdown: string): string {
  if (!markdown)
    return "<p style='color: #94a3b8; font-style: italic; font-size: 14px;'>Write something amazing in Markdown...</p>";

  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(
    /^# (.*?)$/gm,
    "<h1 style='font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.025em; margin-top: 16px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;'>$1</h1>",
  );
  html = html.replace(
    /^## (.*?)$/gm,
    "<h2 style='font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 16px; margin-bottom: 6px;'>$1</h2>",
  );
  html = html.replace(
    /^### (.*?)$/gm,
    "<h3 style='font-size: 18px; font-weight: 700; color: #1e293b; margin-top: 12px; margin-bottom: 4px;'>$1</h3>",
  );

  // Math/Code blocks
  html = html.replace(
    /\$\$(.*?)\$\$/g,
    "<div style='margin: 16px 0; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-family: monospace; text-align: center; font-size: 14px; color: #4f46e5; overflow-x: auto;'>$1</div>",
  );
  html = html.replace(
    /\$(.*?)\$/g,
    "<code style='padding: 2px 6px; background-color: #f1f5f9; color: #4f46e5; font-family: monospace; font-size: 12px; border-radius: 4px;'>$1</code>",
  );

  // Code blocks
  html = html.replace(
    /```([\s\S]*?)```/g,
    "<pre style='margin: 12px 0; padding: 14px; background-color: #020617; color: #e2e8f0; font-family: monospace; font-size: 12px; border-radius: 12px; overflow-x: auto; line-height: 1.625; border: 1px solid #1e293b;'>$1</pre>",
  );
  html = html.replace(
    /`([^`]+)`/g,
    "<code style='padding: 2px 6px; background-color: #f1f5f9; color: #1e293b; font-family: monospace; font-size: 12px; border-radius: 4px;'>$1</code>",
  );

  // Bold / Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Lists
  html = html.replace(
    /^\s*-\s+(.*?)$/gm,
    "<li style='margin-left: 16px; font-size: 12px; color: #475569; line-height: 1.625;'>• $1</li>",
  );
  html = html.replace(
    /^\s*\d+\.\s+(.*?)$/gm,
    "<li style='margin-left: 16px; font-size: 12px; color: #475569; line-height: 1.625;'>- $1</li>",
  );

  // Blockquotes
  html = html.replace(
    /^>\s+(.*?)$/gm,
    "<blockquote style='padding-left: 14px; padding-top: 4px; padding-bottom: 4px; border-left: 4px solid #6366f1; margin: 10px 0; color: #64748b; font-style: italic; font-size: 12px; line-height: 1.625;'>$1</blockquote>",
  );

  // Line breaks
  html = html.replace(/\n/g, "<br/>");

  return html;
}

export default function NotebookManager({
  selectedNoteId,
  onClearSelectedNote,
}: NotebookManagerProps) {
  const {
    notes,
    activeNoteId,
    fetchNotes,
    saveNote,
    deleteNote,
    setActiveNoteId,
  } = useStudyStore();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">(
    "split",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  // Listen to external active node choice (e.g. clicked from dashboard)
  useEffect(() => {
    if (selectedNoteId) {
      if (selectedNoteId === "new") {
        handleNewNote();
      } else {
        const target = notes.find((n) => n.id === selectedNoteId);
        if (target) {
          setActiveNoteId(target.id);
        }
      }
      onClearSelectedNote(); // reset callback trigger
    }
  }, [selectedNoteId, notes]);

  // Load selected note values
  useEffect(() => {
    if (activeNoteId) {
      const active = notes.find((n) => n.id === activeNoteId);
      if (active) {
        setTitle(active.title);
        setSubject(active.subject);
        setContent(active.content);
        return;
      }
    }
    // Fallback if null
    handleNewNote();
  }, [activeNoteId, notes]);

  const handleNewNote = () => {
    setActiveNoteId(null);
    setTitle("");
    setSubject("General");
    setContent(`# Notes\n\n- Write down your thoughts...\n`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const saved = await saveNote(
        activeNoteId,
        title || "Untitled Note",
        content,
        subject,
      );
      if (!activeNoteId) {
        setActiveNoteId(saved.id);
      }
      setSaveMessage("Saved draft successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e) {
      setSaveMessage("Error saving notes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Untitled Note",
          text: content,
        });
      } catch (e) {
        console.error("Error sharing text:", e);
      }
    } else {
      try {
        await navigator.clipboard.writeText(content);
        setSaveMessage("Copied to clipboard!");
        setTimeout(() => setSaveMessage(""), 3000);
      } catch (e) {
        console.error("Error copying to clipboard:", e);
      }
    }
  };

  const handleSharePDF = () => handleExportPDF(true);

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const handleExportPDF = async (share: boolean = false) => {
    try {
      setSaveMessage(share ? "Preparing PDF to share..." : "Exporting to PDF...");
      let html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      const element = document.createElement('div');
      
      // Inject some basic styling to make the PDF look like a clean document
      const docHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #1e293b;">
          ${parseMarkdownForPDF(content)}
        </div>
      `;
      element.innerHTML = docHtml;

      const filename = `${title || 'Study_Note'}.pdf`;
      const opt = {
        margin:       15,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          onclone: (clonedDoc: Document) => {
            // Remove Tailwind CSS from the cloned document to avoid html2canvas crashing on oklch()
            const styles = clonedDoc.querySelectorAll('style');
            styles.forEach(s => s.remove());
            const links = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(l => l.remove());
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      if (share) {
        // Output as blob for sharing
        const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: title || 'Study Note',
            text: 'Check out my study notes from StudentMate!',
          });
          setSaveMessage("Shared successfully!");
        } else {
          setSaveMessage("Sharing files not supported here, downloading instead.");
          await html2pdf().set(opt).from(element).save();
        }
      } else {
        await html2pdf().set(opt).from(element).save();
        setSaveMessage("Exported to PDF!");
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("PDF Export/Share failed:", error);
      setSaveMessage(share ? "Share failed." : "Export failed.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div id="notebook-manager-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            Notebook
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Write your notes here. You can use markdown to style your text.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR: Note Sheets List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-xs">
          <button
            id="draft-new-note-btn"
            onClick={handleNewNote}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              My Notes
            </span>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    note.id === activeNoteId
                      ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/40 text-indigo-755 dark:text-indigo-455"
                      : "bg-slate-50/50 dark:bg-slate-800/10 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 pr-2 overflow-hidden flex-1 text-left">
                    <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold truncate leading-snug">
                        {note.title || "Untitled note"}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium truncate">
                        {note.subject}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Your draft book is empty.
              </p>
            )}
          </div>
        </div>

        {/* EDITOR PANELS */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
          {/* Editor Header Form controls */}
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Title
              </label>
              <input
                id="note-title-input"
                type="text"
                placeholder="e.g. My awesome idea"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* MAIN WORKSPACE TEXTAREA */}
          <div>
            {/* Editor Input Text */}
            <div className="space-y-1">
              <textarea
                id="note-markdown-textarea"
                rows={14}
                placeholder={`# Your Note Title\n\nWrite your notes here...\n\nSave your ideas for later review...`}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none h-[380px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          {/* Save footer sync status line */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-emerald-500 font-medium">{saveMessage}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareText}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Tag className="w-4 h-4" />
                <span>Share Text</span>
              </button>
              <button
                onClick={handleSharePDF}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share className="w-4 h-4" />
                <span>Share PDF</span>
              </button>
              <button
                onClick={() => handleExportPDF(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                id="save-note-btn"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Note"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
