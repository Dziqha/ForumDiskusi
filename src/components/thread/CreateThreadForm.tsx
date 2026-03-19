'use client';

import { useState, FormEvent } from 'react';

interface CreateThreadFormProps {
  onSubmit: (threadData: {
    title: string;
    body: string;
    category: string;
  }) => void;
}

export default function CreateThreadForm({ onSubmit }: CreateThreadFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, body, category });
    setTitle('');
    setCategory('');
    setBody('');
    setShowForm(false);
  };

  return (
    <div className="mb-8 transition-all duration-500">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center justify-between w-full bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="text-xl font-light">+</span>
            </div>
            <span className="text-gray-500 font-medium ">
              Apa yang ingin Anda diskusikan hari ini?
            </span>
          </div>
          <span className="text-xs font-medium uppercase  text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
            Buat Thread
          </span>
        </button>
      ) : (
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-xl shadow-blue-900/5 animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800 ">
              Mulai Diskusi Baru
            </h3>
            <div className="h-1 w-12 bg-blue-500 rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
                Judul Thread
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-300"
                placeholder="Berikan judul yang menarik..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
                Kategori
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-300"
                placeholder="Contoh: react, tutorial, news"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">
                Konten
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all outline-none h-40 resize-none text-gray-800 leading-relaxed placeholder:text-gray-300"
                placeholder="Tuliskan pemikiran Anda secara detail..."
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Terbitkan Thread
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
