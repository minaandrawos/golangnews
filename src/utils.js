export function getDomain(link) {
  const matches = link.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
  return matches ? matches[1] : '';
}

export function getRelativeDate(published) {
  const denom = 1000 * 3600 * 24;
  const d = new Date(published);
  if (isNaN(d.getTime())) return '';
  const result = Math.floor((Date.now() - d) / denom);
  if (result <= 0) return 'Today';
  return `${result} ${result === 1 ? 'day' : 'days'} ago`;
}

export function parseTitle(rawTitle) {
  const words = rawTitle.split(' ');
  const tags = [];
  const titleWords = [];
  for (const word of words) {
    if (word.startsWith('#')) tags.push(word.substring(1));
    else titleWords.push(word);
  }
  return { cleanTitle: titleWords.join(' ').trim(), tags };
}
