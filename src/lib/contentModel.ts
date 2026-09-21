import type { Announcement, AnnouncementContentType, ForumPost } from '../types';

export function normalizeAnnouncementType(value: unknown): AnnouncementContentType {
  return value === 'pengumuman' ? 'pengumuman' : 'artikel';
}

export function isPublishedAnnouncement(item: Pick<Announcement, 'published'>): boolean {
  return item.published === true;
}

export function appendUniquePosts(current: ForumPost[], next: ForumPost[]): ForumPost[] {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...next.filter((item) => !seen.has(item.id))];
}
