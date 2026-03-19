import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { postedAt, normalizeUser, stripHtml } from '../utils'; // Sesuaikan path ini jika perlu

describe('utils functions', () => {
  describe('postedAt function', () => {
    beforeAll(() => {
      // Kita "bekukan" waktu sistem saat tes berjalan agar hasilnya konsisten dan akurat
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    });

    afterAll(() => {
      // Kembalikan waktu ke normal setelah tes selesai
      vi.useRealTimers();
    });

    it('should return "hari yang lalu" properly', () => {
      expect(postedAt('2023-12-30T12:00:00.000Z')).toBe('2 hari yang lalu');
    });

    it('should return "jam yang lalu" properly', () => {
      expect(postedAt('2024-01-01T10:00:00.000Z')).toBe('2 jam yang lalu');
    });

    it('should return "menit yang lalu" properly', () => {
      expect(postedAt('2024-01-01T11:55:00.000Z')).toBe('5 menit yang lalu');
    });

    it('should return "Baru saja" properly', () => {
      expect(postedAt('2024-01-01T11:59:30.000Z')).toBe('Baru saja');
    });
  });

  describe('normalizeUser function', () => {
    it('should encode URI for avatar containing spaces', () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar path.jpg',
      };
      const result = normalizeUser(user);
      expect(result.avatar).toBe('https://example.com/avatar%20path.jpg');
    });
  });

  describe('stripHtml function', () => {
    it('should remove HTML tags from a string', () => {
      const htmlString = '<p>Halo <b>dunia</b>, ini <a href="#">tes</a>!</p>';
      expect(stripHtml(htmlString)).toBe('Halo dunia, ini tes!');
    });
  });
});
