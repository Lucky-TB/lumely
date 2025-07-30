
interface Prediction {
  className: string;
  probability: number;
}

interface PredictionResult {
  predictions: Prediction[];
}

interface HealthAnalysisResult {
  status: 'healthy' | 'issue_detected' | 'needs_attention';
  condition: string;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

class TeachableMachineService {
  private apiUrl: string;

  constructor() {
    // Use Firebase Function URL - will be set after deployment
    this.apiUrl = process.env.EXPO_PUBLIC_TEACHABLE_MACHINE_URL || '';
  }

  async predictFromImage(imageUri: string, bodyPart?: string): Promise<PredictionResult> {
    try {
      if (!this.apiUrl) {
        throw new Error('Teachable Machine API URL not configured');
      }

      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await this.blobToBase64(blob);

      // Make prediction request to Firebase Function
      const predictionResponse = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          bodyPart: bodyPart, // Send body part information
        }),
      });

      if (!predictionResponse.ok) {
        throw new Error(`API error: ${predictionResponse.status} ${predictionResponse.statusText}`);
      }

      const result = await predictionResponse.json();
      
      // Validate the response structure
      if (!result.predictions || !Array.isArray(result.predictions)) {
        throw new Error('Invalid response from Teachable Machine API');
      }

      return result;
    } catch (error) {
      console.error('Teachable Machine prediction error:', error);
      throw error;
    }
  }

  getTopPrediction(predictions: Prediction[]): Prediction {
    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions available');
    }

    return predictions.reduce((top, current) => 
      current.probability > top.probability ? current : top
    );
  }

  formatPredictionResult(prediction: Prediction): HealthAnalysisResult {
    const { className, probability } = prediction;
    
    // Map prediction classes to health status and urgency
    const statusMap: Record<string, { status: 'healthy' | 'issue_detected' | 'needs_attention', urgency: 'low' | 'medium' | 'high' }> = {
      // Eye-specific predictions
      'healthy_eye': { status: 'healthy', urgency: 'low' },
      'dry_eye': { status: 'needs_attention', urgency: 'medium' },
      'conjunctivitis': { status: 'issue_detected', urgency: 'high' },
      'cataract': { status: 'issue_detected', urgency: 'high' },
      'glaucoma': { status: 'issue_detected', urgency: 'high' },
      'cornea_ulcer': { status: 'issue_detected', urgency: 'high' },
      
      // Skin predictions
      'healthy_skin': { status: 'healthy', urgency: 'low' },
      'mild_irritation': { status: 'needs_attention', urgency: 'medium' },
      'needs_attention': { status: 'needs_attention', urgency: 'medium' },
      
      // General predictions
      'normal': { status: 'healthy', urgency: 'low' },
      'clear': { status: 'healthy', urgency: 'low' },
      'healthy': { status: 'healthy', urgency: 'low' },
      'issue': { status: 'issue_detected', urgency: 'high' },
      'problem': { status: 'issue_detected', urgency: 'high' },
      'abnormal': { status: 'issue_detected', urgency: 'high' },
      'severe': { status: 'issue_detected', urgency: 'high' },
      'attention': { status: 'needs_attention', urgency: 'medium' },
      'monitor': { status: 'needs_attention', urgency: 'medium' },
    };

    const mappedResult = statusMap[className.toLowerCase()] || { status: 'needs_attention', urgency: 'medium' };
    const { status, urgency } = mappedResult;

    // Generate recommendations based on status and body part
    const recommendations = this.generateRecommendations(status, probability, className);

    return {
      status,
      condition: `Detected: ${className.replace('_', ' ')} (${Math.round(probability * 100)}% confidence)`,
      confidence: probability,
      recommendations,
      urgency,
    };
  }

  private generateRecommendations(status: string, confidence: number, className: string): string[] {
    const recommendations: string[] = [];

    if (status === 'healthy') {
      recommendations.push('✅ Your eyes appear healthy. Continue with your regular eye care routine.');
      if (confidence < 0.8) {
        recommendations.push('📋 Consider a follow-up scan for confirmation.');
      }
      recommendations.push('💧 Stay hydrated and maintain good eye hygiene.');
    } else if (status === 'issue_detected') {
      recommendations.push('⚠️ Consider consulting an eye care professional for evaluation.');
      recommendations.push('📸 Monitor your eyes for any changes or progression.');
      if (confidence > 0.7) {
        recommendations.push('🔴 This detection has high confidence and may require immediate attention.');
      }
      recommendations.push('🧴 Avoid rubbing your eyes and use protective eyewear when needed.');
    } else {
      recommendations.push('👀 Monitor your eyes closely and consider a follow-up scan.');
      recommendations.push('🏥 If symptoms persist, consult an eye care professional.');
      recommendations.push('🧴 Use gentle eye care products and avoid irritants.');
    }

    return recommendations;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data URL prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const teachableMachineService = new TeachableMachineService();
export type { HealthAnalysisResult, Prediction, PredictionResult };
