import assert from 'node:assert/strict';
import test from 'node:test';
import { appendUniquePosts, isPublishedAnnouncement, normalizeAnnouncementType } from '../src/lib/contentModel';

test('normalizes legacy announcement types into the two supported channels', () => {
  assert.equal(normalizeAnnouncementType('pengumuman'), 'pengumuman');
  assert.equal(normalizeAnnouncementType('berita'), 'artikel');
  assert.equal(normalizeAnnouncementType(undefined), 'artikel');
});

test('publication state is explicit', () => {
  assert.equal(isPublishedAnnouncement({ published: true }), true);
  assert.equal(isPublishedAnnouncement({ published: false }), false);
  assert.equal(isPublishedAnnouncement({ published: undefined }), false);
});

test('pagination does not duplicate community posts', () => {
  const post = { id: '1' } as never;
  assert.equal(appendUniquePosts([post], [post]).length, 1);
});
