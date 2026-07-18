import { WritingEditor } from "@/components/WritingEditor";

export default function WritingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-emerald-400">Writing</span> Practice
        </h1>
        <p className="text-zinc-500 text-sm">
          Write freely, then check for mistakes. Words you got wrong are added to your vocabulary automatically.
        </p>
      </div>
      <WritingEditor />
    </main>
  );
}