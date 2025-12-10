import uuid from 'react-native-uuid';
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

// Generate unique ID
export function generateId(): string {
  return uuid.v4() as string;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }

  if (isThisWeek(date)) {
    return format(date, 'EEEE, h:mm a');
  }

  if (isThisYear(date)) {
    return format(date, 'MMM d, h:mm a');
  }

  return format(date, 'MMM d, yyyy');
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

// Format date for entry header
export function formatEntryDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'EEEE, MMMM d, yyyy');
}

// Format time only
export function formatTime(dateString: string): string {
  return format(new Date(dateString), 'h:mm a');
}

// Get current ISO date string
export function getCurrentISODate(): string {
  return new Date().toISOString();
}

// Get date string for a specific date (YYYY-MM-DD)
export function getDateString(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Strip HTML tags from content
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Get excerpt from content
export function getExcerpt(content: string, maxLength: number = 150): string {
  const plainText = stripHtml(content);
  return truncateText(plainText, maxLength);
}

// Calculate reading time (words per minute)
export function calculateReadingTime(content: string): number {
  const plainText = stripHtml(content);
  const words = plainText.split(/\s+/).filter((word) => word.length > 0);
  const wordsPerMinute = 200;
  return Math.ceil(words.length / wordsPerMinute);
}

// Get word count
export function getWordCount(content: string): number {
  const plainText = stripHtml(content);
  return plainText.split(/\s+/).filter((word) => word.length > 0).length;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Group entries by date
export function groupEntriesByDate<T extends { entryDate: string }>(
  entries: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  entries.forEach((entry) => {
    const dateKey = getDateString(new Date(entry.entryDate));
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, entry]);
  });

  return grouped;
}

// Validate PIN format (4-6 digits)
export function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

// Generate random color
export function generateRandomColor(): string {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
