export const DARK_COLORS = {
  background: '#0D1117',
  surface: '#161B22',
  card: '#1C2128',
  cardBorder: '#30363D',
  accent: '#00ACD7',
  accentDim: '#1a3a47',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  tagBg: '#1a3358',
  tagText: '#58A6FF',
  today: '#3FB950',
  separator: '#21262D',
  headerBg: '#161B22',
  headerText: '#E6EDF3',
  error: '#F85149',
  errorSurface: '#2D1214',
};

export const LIGHT_COLORS = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  cardBorder: '#E8E8E8',
  accent: '#0AB1E8',       // golangnews.com cyan
  accentDim: '#E0F7FD',
  textPrimary: '#000000',
  textSecondary: '#666666',
  tagBg: '#CCCCCC',
  tagText: '#333333',
  today: '#1A7F37',
  separator: '#EEEEEE',
  headerBg: '#0AB1E8',     // golangnews.com cyan header
  headerText: '#FFFFFF',   // white text on cyan header
  error: '#CF222E',
  errorSurface: '#FFEBE9',
};

// Kept for backwards compatibility — components now use useTheme() instead
export const COLORS = DARK_COLORS;

export const HOME_URL = 'https://golangnews.com/index.xml';
export const TAG_PREFIX = 'https://golangnews.com/stories.xml?q=%23';
export const LINK_PREFIX = 'https://golangnews.com/';

export const CATEGORIES = [
  { label: 'Home', value: 'index.xml' },
  { label: 'New', value: 'stories.xml' },
  { label: 'Top', value: 'stories/upvoted.xml' },
  { label: 'Code', value: 'stories/code.xml' },
  { label: 'Videos', value: 'stories.xml?q=Video:' },
  { label: 'Jobs', value: 'stories.xml?q=Hiring:' },
  { label: 'Events', value: 'stories.xml?q=Event:' },
  { label: 'Books', value: 'stories.xml?q=Book:' },
  { label: 'Podcasts', value: 'stories.xml?q=Cast:' },
  { label: 'Show', value: 'stories.xml?q=Show:' },
];
