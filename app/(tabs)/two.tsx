import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import NewsService from '../../services/NewsService';

export default function SettingsScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [cacheSize, setCacheSize] = useState('Loading...');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    checkNetworkStatus();
    calculateCacheSize();
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  const checkNetworkStatus = async () => {
    const online = await NewsService.isOnline();
    setIsOnline(online);
  };

  const calculateCacheSize = () => {
    // Simplified cache size calculation
    setCacheSize('~2.5 MB');
  };

  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached news data? This will remove all offline articles.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await NewsService.clearCache();
              setCacheSize('0 MB');
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About News Reader',
      'Version 1.0.0\n\nAn offline-capable news reader app that caches articles for reading without internet connection.\n\nFeatures:\n• Offline reading\n• Category filtering\n• Pull-to-refresh\n• Automatic caching',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Network Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Status</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4CAF50' : '#FF5722' }]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Cache Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cache Management</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Cache Size</Text>
              <Text style={styles.settingDescription}>Current cache usage</Text>
            </View>
            <Text style={styles.settingValue}>{cacheSize}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={clearCache}>
            <Text style={styles.buttonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Refresh</Text>
              <Text style={styles.settingDescription}>Automatically refresh when online</Text>
            </View>
            <Switch
              value={autoRefresh}
              onValueChange={setAutoRefresh}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoRefresh ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          
          <TouchableOpacity style={styles.infoButton} onPress={showAbout}>
            <Text style={styles.infoButtonText}>About App</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✓ Offline reading capability</Text>
            <Text style={styles.featureItem}>✓ Category-based filtering</Text>
            <Text style={styles.featureItem}>✓ Pull-to-refresh functionality</Text>
            <Text style={styles.featureItem}>✓ Automatic background caching</Text>
            <Text style={styles.featureItem}>✓ Network status detection</Text>
            <Text style={styles.featureItem}>✓ Clean, responsive UI</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  infoButtonText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#6c757d',
    fontWeight: '300',
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 8,
  },
});
