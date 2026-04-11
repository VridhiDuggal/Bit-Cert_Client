import { PRIMARY } from '../styles/tokens';

export const AVATAR_COLORS = [
  PRIMARY,
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#14B8A6',
];

export function getAvatarColor(name = '') {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}
