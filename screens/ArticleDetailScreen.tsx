import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NewsArticle } from '../services/NewsService';

const { width } = Dimensions.get('window');

interface ArticleDetailRouteParams {
  article: NewsArticle;
}

export default function ArticleDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { article } = route.params as ArticleDetailRouteParams;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.categoryBadge}>{article.category}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        {article.imageUrl && (
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
        )}

        <View style={styles.articleContainer}>
          {/* Article Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Article Meta */}
          <View style={styles.metaContainer}>
            <Text style={styles.author}>By {article.author}</Text>
            <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          </View>

          {/* Article Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryLabel}>Summary</Text>
            <Text style={styles.summary}>{article.summary}</Text>
          </View>

          {/* Article Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{article.content}</Text>
          </View>

          {/* Article Footer */}
          <View style={styles.footer}>
            <View style={styles.divider} />
            <Text style={styles.footerText}>
              Thank you for reading • News Reader App
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  articleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    lineHeight: 36,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  author: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  summary: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  contentContainer: {
    marginBottom: 30,
  },
  contentText: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 28,
    textAlign: 'justify',
  },
  footer: {
    paddingTop: 30,
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});