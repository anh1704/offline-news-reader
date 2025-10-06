// Mock API: returns fake news items; in real app replace with network call
export async function fetchNews({ category } = {}) {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 500));

  const items = [
    {
      id: '1',
      title: 'New React Native Release',
      category: 'Tech',
      excerpt: 'React Native releases new version with performance improvements.',
      content: 'Full article content about React Native release...'
    },
    {
      id: '2',
      title: 'World Cup Highlights',
      category: 'Sports',
      excerpt: 'Exciting matches in the World Cup.',
      content: 'Full article content about World Cup...'
    },
    {
      id: '3',
      title: 'Economy Update',
      category: 'Business',
      excerpt: 'Market shows mixed signals this quarter.',
      content: 'Full article content about economy...'
    }
  ];

  if (category && category !== 'All') {
    return items.filter((i) => i.category === category);
  }
  return items;
}
