import { User } from '../types';

export function postedAt(date: string): string {
  const now = new Date();
  const posted = new Date(date);
  const diff = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diff / (1000 * 60));

  if (diffDays > 0) return `${diffDays} hari yang lalu`;
  if (diffHours > 0) return `${diffHours} jam yang lalu`;
  if (diffMinutes > 0) return `${diffMinutes} menit yang lalu`;
  return 'Baru saja';
}

export function normalizeUser(user: User): User {
  return {
    ...user,
    avatar: encodeURI(user.avatar),
  };
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
