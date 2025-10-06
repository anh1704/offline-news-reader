import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { fetchNews } from '../utils/api';
import { saveNewsToCache, loadNewsFromCache } from '../utils/storage';

const CATEGORIES = ['All', 'Tech', 'Sports', 'Business'];

export default function NewsListScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsConnected(Boolean(state.isConnected));
    });
    // initial load
    loadData();
    return () => unsub();
  }, [category]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const net = await NetInfo.fetch();
    if (net.isConnected) {
      try {
        const items = await fetchNews({ category });
        setNews(items);
        await saveNewsToCache({ items, category });
      } catch (e) {
        console.warn('Fetch failed', e);
        // fallback to cache
        const cache = await loadNewsFromCache();
        if (cache && cache.items) setNews(cache.items);
      }
    } else {
      // offline: load from cache
      const cache = await loadNewsFromCache();
      if (cache && cache.items) setNews(cache.items.items || cache.items);
    }
    setLoading(false);
  }, [category]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline mode</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.filterBtn, category === c && styles.filterBtnActive]}>
            <Text style={category === c ? styles.filterTextActive : styles.filterText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detail', { item })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.excerpt}>{item.excerpt}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => <Text style={styles.empty}>{loading ? 'Loading...' : 'No news available'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  excerpt: { color: '#444', marginTop: 6 },
  category: { marginTop: 6, fontSize: 12, color: '#888' },
  offlineBanner: { backgroundColor: '#ffcc00', padding: 8, alignItems: 'center' },
  offlineText: { color: '#333' },
  filterRow: { flexDirection: 'row', marginBottom: 8 },
  filterBtn: { padding: 8, marginRight: 8, borderRadius: 4, backgroundColor: '#f2f2f2' },
  filterBtnActive: { backgroundColor: '#007aff' },
  filterText: { color: '#333' },
  filterTextActive: { color: '#fff' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' }
});
