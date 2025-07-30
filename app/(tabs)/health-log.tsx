import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../lib/firebase';

interface ScanData {
  id: string;
  bodyPart: string;
  imageUrl: string;
  analysis: {
    status: 'healthy' | 'issue_detected' | 'needs_attention';
    condition: string;
    confidence: number;
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high';
  };
  createdAt: any;
}

export default function HealthLogScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const scansQuery = query(
      collection(db, 'scans'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(scansQuery, (snapshot) => {
      const scansData: ScanData[] = [];
      snapshot.forEach((doc) => {
        scansData.push({
          id: doc.id,
          ...doc.data(),
        } as ScanData);
      });
      setScans(scansData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Data will automatically refresh via Firebase listener
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#10B981'; // green
      case 'issue_detected':
        return '#EF4444'; // red
      case 'needs_attention':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280'; // gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'issue_detected':
        return 'Issue Detected';
      case 'needs_attention':
        return 'Needs Attention';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getBodyPartIcon = (bodyPart: string) => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      eyes: 'eye',
      skin: 'color-palette',
      teeth: 'happy',
      face: 'person',
      ears: 'ear',
      hair: 'cut',
      nails: 'finger-print',
    };
    return iconMap[bodyPart] || 'body';
  };

  const getBodyPartColor = (bodyPart: string) => {
    const colorMap: { [key: string]: string } = {
      eyes: '#457B9D',
      skin: '#2ECC71',
      teeth: '#F4A261',
      face: '#8b5cf6',
      ears: '#A8DADC',
      hair: '#9B59B6',
      nails: '#E74C3C',
    };
    return colorMap[bodyPart] || '#6B7280';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Ionicons name="medical" size={64} color="#457B9D" />
          <Text style={styles.loadingText}>Loading your health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Health Log</Text>
            <Text style={styles.headerSubtitle}>Your scan history and health trends</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Ionicons name="add" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>This Month</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{scans.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scans.filter(s => s.analysis.status === 'healthy').length}
              </Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scans.filter(s => s.analysis.status === 'needs_attention').length}
              </Text>
              <Text style={styles.statLabel}>Monitor</Text>
            </View>
          </View>
        </View>

        {/* Scan History */}
        <View style={styles.scanHistory}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          
          {scans.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Scans Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start your health journey by taking your first scan
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.emptyButtonText}>Take First Scan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            scans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={styles.scanCard}
                onPress={() => {
                  // Navigate to scan detail view
                  console.log('View scan details:', scan.id);
                }}
              >
                <View style={styles.scanCardContent}>
                  <Image
                    source={{ uri: scan.imageUrl }}
                    style={styles.scanImage}
                  />
                  <View style={styles.scanInfo}>
                    <View style={styles.scanHeader}>
                      <View style={styles.scanTitleContainer}>
                        <Ionicons 
                          name={getBodyPartIcon(scan.bodyPart)} 
                          size={20} 
                          color={getBodyPartColor(scan.bodyPart)} 
                        />
                        <Text style={styles.scanTitle}>
                          {scan.bodyPart.charAt(0).toUpperCase() + scan.bodyPart.slice(1)} Scan
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(scan.analysis.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(scan.analysis.status) }]}>
                          {getStatusText(scan.analysis.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.scanDate}>
                      {formatDate(scan.createdAt)}
                    </Text>
                    <Text style={styles.scanCondition} numberOfLines={2}>
                      {scan.analysis.condition}
                    </Text>
                    <Text style={styles.scanConfidence}>
                      Confidence: {Math.round(scan.analysis.confidence * 100)}%
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)')}
          >
            <View style={styles.actionContent}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.actionText}>New Scan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={() => router.push('/(tabs)/chat')}
          >
            <View style={styles.actionContent}>
              <Ionicons name="chatbubble" size={24} color="white" />
              <Text style={styles.actionText}>Ask AI</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF6EE', // soft warm background
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EE',
  },
  loadingText: {
    fontSize: 18,
    color: '#457B9D',
    marginTop: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#457B9D',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  scanHistory: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scanCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  scanInfo: {
    flex: 1,
  },
  scanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scanTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scanDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  scanCondition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scanConfidence: {
    fontSize: 12,
    color: '#999',
  },
  quickActions: {
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: '#457B9D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
}); 