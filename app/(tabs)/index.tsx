import NetInfo from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NewsService, { NewsArticle } from '../../services/NewsService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  const [selectedSource, setSelectedSource] = useState<'vnexpress' | 'tuoitre' | 'thanhnien'>('vnexpress');

  const router = useRouter();

  useEffect(() => {
    loadNews();
    loadCategories();
    
    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected && !refreshing) {
        // Auto-refresh when coming back online
        onRefresh();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedSource]);

  const loadNews = async () => {
    try {
      const category = selectedCategory === 'Tất cả' ? undefined : selectedCategory;
      const newsData = await NewsService.fetchNews(category, selectedSource);
      setArticles(newsData);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải tin tức');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await NewsService.getCategories(selectedSource);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'Không thể làm mới khi offline');
      return;
    }

    setRefreshing(true);
    try {
      await loadNews();
    } finally {
      setRefreshing(false);
    }
  }, [isOnline, selectedCategory, selectedSource]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderArticle = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => router.push(`/article/${item.id}?article=${encodeURIComponent(JSON.stringify(item))}`)}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
      )}
      <View style={styles.articleContent}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.articleSummary} numberOfLines={3}>
          {item.summary}
        </Text>
        <View style={styles.articleFooter}>
          <Text style={styles.authorText}>{item.author}</Text>
          <Text style={styles.dateText}>{formatDate(item.publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item && styles.selectedCategoryButtonText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderSourceSelector = () => (
    <View style={styles.sourceSelector}>
      <Text style={styles.sourceSelectorTitle}>Nguồn tin:</Text>
      <View style={styles.sourceButtons}>
        {(['vnexpress', 'tuoitre', 'thanhnien'] as const).map((source) => (
          <TouchableOpacity
            key={source}
            style={[
              styles.sourceButton,
              selectedSource === source && styles.selectedSourceButton,
            ]}
            onPress={() => {
              setSelectedSource(source);
              setSelectedCategory('Tất cả');
            }}
          >
            <Text
              style={[
                styles.sourceButtonText,
                selectedSource === source && styles.selectedSourceButtonText,
              ]}
            >
              {source === 'vnexpress' ? 'VnExpress' : 
               source === 'tuoitre' ? 'Tuổi Trẻ' : 'Thanh Niên'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Tin Tức Việt Nam</Text>
      {!isOnline && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>📱 Chế độ Offline</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải tin tức...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {renderHeader()}
      {renderSourceSelector()}
      {renderCategoryFilter()}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {!isOnline ? 'Không có tin tức đã lưu' : 'Không tìm thấy tin tức'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  offlineIndicator: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryFilter: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginHorizontal: 5,
    marginLeft: 15,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 15,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  sourceSelector: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sourceSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  sourceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sourceButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedSourceButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sourceButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedSourceButtonText: {
    color: '#fff',
  },
});
