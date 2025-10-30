import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CameraScreenParams {
  bodyPart: string;
}

interface BodyPartInfo {
  title: string;
  description: string;
  tips: string[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface CameraState {
  hasPermission: boolean | null;
  type: 'front' | 'back';
  capturedImage: string | null;
  isLoading: boolean;
  cameraAvailable: boolean;
}

const BODY_PART_INFO_MAP: Record<string, BodyPartInfo> = {
  skin: {
    title: 'Skin Scan',
    description: 'Check for moles, rashes, and skin conditions',
    tips: ['Ensure good lighting', 'Hold camera steady', 'Focus on the area of concern'],
    icon: 'color-palette',
    color: '#2ECC71',
  },
  eyes: {
    title: 'Eye Scan',
    description: 'Monitor eye health and detect issues early',
    tips: ['Remove glasses', 'Look straight ahead', 'Keep eyes open'],
    icon: 'eye',
    color: '#457B9D',
  },
  teeth: {
    title: 'Dental Scan',
    description: 'Check dental health and oral hygiene',
    tips: ['Clean teeth first', 'Good lighting', 'Show all teeth'],
    icon: 'happy',
    color: '#F4A261',
  },
  face: {
    title: 'Face Scan',
    description: 'Overall facial health and skin condition',
    tips: ['Remove makeup', 'Natural lighting', 'Neutral expression'],
    icon: 'person',
    color: '#8b5cf6',
  },
  ears: {
    title: 'Ear Scan',
    description: 'Check ear health and detect infections',
    tips: ['Clean ears first', 'Good lighting', 'Show ear canal'],
    icon: 'ear',
    color: '#A8DADC',
  },
};

// Lottie Loading Component
function LoadingAnimation() {
  return (
    <View style={styles.loadingContainer}>
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
      <Text style={styles.loadingText}>Preparing camera...</Text>
    </View>
  );
}

// Safe camera import with fallback
function getCameraModule() {
  try {
    const expoCamera = require('expo-camera');
    return {
      Camera: expoCamera.Camera,
      CameraType: expoCamera.CameraType,
      available: true,
    };
  } catch (error) {
    console.error('Failed to import expo-camera:', error);
    return {
      Camera: null,
      CameraType: null,
      available: false,
    };
  }
}

async function requestCameraPermission(): Promise<boolean> {
  try {
    const expoCamera = require('expo-camera');
    const { status } = await expoCamera.Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
}

async function takePicture(cameraRef: React.RefObject<any>): Promise<string> {
  if (!cameraRef.current) {
    throw new Error('Camera not available');
  }

  const photo = await cameraRef.current.takePictureAsync({
    quality: 0.8,
    base64: true,
  });
  return photo.uri;
}

async function pickImageFromLibrary(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Failed to pick image:', error);
    return null;
  }
}

export default function CameraScreen() {
  const { bodyPart } = useLocalSearchParams<CameraScreenParams>();
  const [state, setState] = useState<CameraState>({
    hasPermission: null,
    type: 'back',
    capturedImage: null,
    isLoading: false,
    cameraAvailable: false,
  });




  
  const cameraRef = useRef<any>(null);

  const bodyPartInfo = useMemo(() => 
    BODY_PART_INFO_MAP[bodyPart] || BODY_PART_INFO_MAP.skin, 
    [bodyPart]
  );

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const cameraModule = getCameraModule();
        setState(prev => ({ ...prev, cameraAvailable: cameraModule.available }));
        
        if (cameraModule.available) {
          const hasPermission = await requestCameraPermission();
          setState(prev => ({ ...prev, hasPermission }));
        } else {
          setState(prev => ({ ...prev, hasPermission: false }));
        }
      } catch (error) {
        console.error('Failed to initialize camera:', error);
        setState(prev => ({ ...prev, hasPermission: false, cameraAvailable: false }));
      }
    };

    initializeCamera();
  }, []);

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const imageUri = await takePicture(cameraRef);
      setState(prev => ({ ...prev, capturedImage: imageUri, isLoading: false }));
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to take picture');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handlePickImage = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const imageUri = await pickImageFromLibrary();
      if (imageUri) {
        setState(prev => ({ ...prev, capturedImage: imageUri, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
      Alert.alert('Error', 'Failed to pick image');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleRetakePicture = useCallback(() => {
    setState(prev => ({ ...prev, capturedImage: null }));
  }, []);

  const handleAnalyzeImage = useCallback(() => {
    if (!state.capturedImage) return;

    router.push({
      pathname: '/scan-result',
      params: {
        imageUri: state.capturedImage,
        bodyPart,
      },
    });
  }, [state.capturedImage, bodyPart]);

  const handleToggleCamera = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      type: prev.type === 'back' ? 'front' : 'back' 
    }));
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);



  // Loading state
  if (state.hasPermission === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              const hasPermission = await requestCameraPermission();
              setState(prev => ({ ...prev, hasPermission }));
            }}
          >
            <Text style={styles.retryButtonText}>Retry Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (state.hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="camera" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Camera Access Required</Text>
          <Text style={styles.errorText}>
            Please enable camera access in your device settings to use the scanning feature.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleGoBack}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera not available
  if (!state.cameraAvailable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="camera" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Camera Not Available</Text>
          <Text style={styles.errorText}>
            Camera component could not be loaded. Please restart the app.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleGoBack}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {!state.capturedImage ? (
          <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
            >
              <Ionicons name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{bodyPartInfo.title}</Text>
              <Text style={styles.headerSubtitle}>{bodyPartInfo.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleToggleCamera}
            >
              <Ionicons name="camera-reverse" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          {/* Camera Area */}
          <View style={styles.cameraArea}>
            {/* Clean camera area - no placeholder box */}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handlePickImage}
              disabled={state.isLoading}
            >
              <Ionicons name="images" size={24} color="#457B9D" />
              <Text style={styles.galleryButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePicture}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <LottieView
                  source={require('../assets/animations/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={styles.placeholderButton} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {/* Preview Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleRetakePicture}
            >
              <Ionicons name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Photo</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Image Preview */}
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: state.capturedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetakePicture}
            >
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={handleAnalyzeImage}
            >
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF6EE',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDF6EE',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EE',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#457B9D',
    marginTop: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EE',
    paddingHorizontal: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FDF6EE',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  cameraArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF6EE',
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FDF6EE',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  galleryButton: {
    alignItems: 'center',
    padding: 12,
    position: 'absolute',
    left: 20,
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#457B9D',
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#457B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#457B9D',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: '#457B9D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  placeholderButton: {
    width: 40,
    position: 'absolute',
    right: 20,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
}); 