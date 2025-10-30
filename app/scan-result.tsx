import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { localStorageService } from '../lib/localStorage';
import { HealthAnalysisResult, teachableMachineService } from '../lib/teachableMachine';

interface ScanResultParams {
  imageUri: string;
  bodyPart: string;
}

export default function ScanResultScreen() {
  const { imageUri, bodyPart } = useLocalSearchParams<ScanResultParams>();
  const [analysis, setAnalysis] = useState<HealthAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const analyzeImage = useCallback(async () => {
    if (!imageUri) return;

    try {
      setLoading(true);
      console.log(`🔍 Starting analysis for body part: ${bodyPart}`);
      console.log(`📸 Image URI: ${imageUri}`);
      
      // Use Teachable Machine for all body parts, pass bodyPart for eye-specific analysis
      const prediction = await teachableMachineService.predictFromImage(imageUri, bodyPart);
      console.log(`✅ Prediction received:`, prediction);
      
      const topPrediction = teachableMachineService.getTopPrediction(prediction.predictions);
      console.log(`🎯 Top prediction:`, topPrediction);
      
      const result = teachableMachineService.formatPredictionResult(topPrediction);
      console.log(`📊 Formatted result:`, result);
      
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        `We couldn't analyze your scan. Error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [imageUri, bodyPart]);

  useEffect(() => {
    analyzeImage();
  }, [analyzeImage]);

  const saveScan = useCallback(async () => {
    if (!analysis || !imageUri) return;

    try {
      setSaving(true);
      console.log('Save Scan - Starting save process to local storage');

      // Save scan data to local storage
      const scanData = {
        bodyPart,
        imageUri, // Use local file URI instead of Firebase URL
        analysis,
      };
      console.log('Save Scan - Saving to local storage:', scanData);
      const scanId = await localStorageService.saveScan(scanData);
      console.log('Save Scan - Scan saved with ID:', scanId);

      Alert.alert('Success', 'Scan saved to your health log!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save scan. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [analysis, imageUri, bodyPart]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'healthy':
        return '#10B981';
      case 'issue_detected':
        return '#EF4444';
      case 'needs_attention':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }, []);

  const getUrgencyColor = useCallback((urgency: string) => {
    switch (urgency) {
      case 'low':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleRescan = useCallback(() => {
    router.back();
  }, []);

  const handleAskAI = useCallback(() => {
    router.push('/(tabs)/chat');
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Ionicons name="medical" size={64} color="#457B9D" />
          <Text style={styles.loadingText}>Analyzing your scan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analysis) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorText}>
            We couldn't analyze your scan. Please try again with a clearer image.
          </Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleGoBack}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Results</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/(tabs)')}>
            <Ionicons name="close" size={24} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.scanImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageLabel}>
              {bodyPart} scan (Teachable Machine Analysis)
            </Text>
          </View>
        </View>

        {/* Analysis Results */}
        <View style={styles.resultsCard}>
          <Text style={styles.sectionTitle}>Analysis Results</Text>
          
          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={24} color={getStatusColor(analysis.status)} />
              <Text style={styles.resultTitle}>Status</Text>
            </View>
            <Text style={[styles.resultValue, { color: getStatusColor(analysis.status) }]}>
              {analysis.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Ionicons name="information-circle" size={24} color="#457B9D" />
              <Text style={styles.resultTitle}>Condition</Text>
            </View>
            <Text style={styles.resultValue}>{analysis.condition}</Text>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Ionicons name="trending-up" size={24} color="#457B9D" />
              <Text style={styles.resultTitle}>Confidence</Text>
            </View>
            <Text style={styles.resultValue}>{Math.round(analysis.confidence * 100)}%</Text>
          </View>

          <View style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Ionicons name="alert-circle" size={24} color={getUrgencyColor(analysis.urgency)} />
              <Text style={styles.resultTitle}>Urgency</Text>
            </View>
            <Text style={[styles.resultValue, { color: getUrgencyColor(analysis.urgency) }]}>
              {analysis.urgency.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRescan}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.actionText}>Rescan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={saveScan}
            disabled={saving}
          >
            <Ionicons name="save" size={24} color="white" />
            <Text style={styles.actionText}>{saving ? 'Saving...' : 'Save to Health Log'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
            onPress={handleAskAI}
          >
            <Ionicons name="chatbubble" size={24} color="white" />
            <Text style={styles.actionText}>Ask AI</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EE',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
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
  backButton: {
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
  closeButton: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scanImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  imageLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginLeft: 8,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationsCard: {
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
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: '#457B9D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 