import AsyncStorage from '@react-native-async-storage/async-storage';

const NEWS_KEY = '@cached_news_v1';

export async function saveNewsToCache(items) {
  try {
    await AsyncStorage.setItem(NEWS_KEY, JSON.stringify({ items, savedAt: Date.now() }));
  } catch (e) {
    // ignore cache errors
    console.warn('Failed to save cache', e);
  }
}

export async function loadNewsFromCache() {
  try {
    const raw = await AsyncStorage.getItem(NEWS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read cache', e);
    return null;
  }
}
