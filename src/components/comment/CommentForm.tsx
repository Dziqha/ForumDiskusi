'use client';
import { useState, FormEvent } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className="bg-white border rounded-xl p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Tambahkan komentar
      </h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          rows={3}
          placeholder="Tulis pendapatmu…"
        />

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
