import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function NewsDetailScreen({ route }) {
  const { item } = route.params || {};
  if (!item) return <View style={styles.container}><Text>No article</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  category: { fontSize: 12, color: '#666', marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 24 }
});
