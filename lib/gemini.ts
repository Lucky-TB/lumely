import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

// Health analysis prompts for different body parts
const HEALTH_PROMPTS = {
  skin: `Analyze this skin image for potential health issues. Look for:
  - Moles, freckles, or skin lesions
  - Signs of skin cancer (asymmetry, irregular borders, color variation, diameter >6mm)
  - Rashes, inflammation, or infections
  - Acne, eczema, or other skin conditions
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  eyes: `Analyze this eye image for potential health issues. Look for:
  - Redness, irritation, or inflammation
  - Unusual pupil size or shape
  - Cloudiness or opacity
  - Signs of infection or injury
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  teeth: `Analyze this teeth image for potential dental health issues. Look for:
  - Cavities or tooth decay
  - Gum disease or inflammation
  - Staining or discoloration
  - Chipped or damaged teeth
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  face: `Analyze this face image for potential health issues. Look for:
  - Skin conditions, rashes, or inflammation
  - Swelling or asymmetry
  - Signs of infection or injury
  - Overall skin health and complexion
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  ears: `Analyze this ear image for potential health issues. Look for:
  - Signs of infection or inflammation
  - Wax buildup or blockages
  - Unusual discharge or fluid
  - Structural abnormalities
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  hair: `Analyze this hair/scalp image for potential health issues. Look for:
  - Hair loss or thinning
  - Scalp conditions (dandruff, psoriasis, seborrheic dermatitis)
  - Signs of infection or inflammation
  - Hair texture and shine quality
  - Scalp redness or irritation
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`,

  nails: `Analyze this nail image for potential health issues. Look for:
  - Nail color and texture
  - Signs of fungal infection
  - Nail bed health
  - Discoloration or spots
  - Nail shape and thickness
  - Signs of trauma or damage
  
  Return a JSON response with:
  {
    "status": "healthy" | "issue_detected" | "needs_attention",
    "condition": "description of what you see",
    "confidence": 0.0-1.0,
    "recommendations": ["list of recommendations"],
    "urgency": "low" | "medium" | "high"
  }`
};

export interface HealthAnalysisResult {
  status: 'healthy' | 'issue_detected' | 'needs_attention';
  condition: string;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export async function analyzeHealthImage(
  imageBase64: string,
  bodyPart: keyof typeof HEALTH_PROMPTS
): Promise<HealthAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = HEALTH_PROMPTS[bodyPart];
    const imageData = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg'
      }
    };

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback response if JSON parsing fails
    return {
      status: 'needs_attention',
      condition: 'Unable to analyze image clearly',
      confidence: 0.5,
      recommendations: ['Please try taking a clearer photo', 'Consider consulting a healthcare professional'],
      urgency: 'low'
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      status: 'needs_attention',
      condition: 'Analysis failed',
      confidence: 0.0,
      recommendations: ['Please try again', 'Check your internet connection'],
      urgency: 'low'
    };
  }
}

export async function generateWellnessRecommendations(
  bodyPart: string,
  healthHistory: any[]
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Based on the user's ${bodyPart} health history, generate 3-5 personalized wellness recommendations. 
    Focus on practical, actionable advice for maintaining or improving ${bodyPart} health.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract recommendations (assuming they're in a list format)
    const recommendations = text
      .split('\n')
      .filter(line => line.trim().match(/^[-•*]\s/))
      .map(line => line.replace(/^[-•*]\s/, '').trim())
      .filter(Boolean);
    
    return recommendations.length > 0 ? recommendations : [
      'Maintain regular hygiene practices',
      'Stay hydrated',
      'Get adequate sleep',
      'Consider consulting a healthcare professional for personalized advice'
    ];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [
      'Maintain regular hygiene practices',
      'Stay hydrated',
      'Get adequate sleep'
    ];
  }
} 