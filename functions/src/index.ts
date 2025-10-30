/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as tf from '@tensorflow/tfjs-node';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import sharp from 'sharp';

admin.initializeApp();

interface Prediction {
  className: string;
  probability: number;
}

interface PredictionRequest {
  image: string; // base64 encoded image
  bodyPart?: string; // to identify if it's an eye scan
}

interface PredictionResponse {
  predictions: Prediction[];
}

// Model URLs for different body parts - Updated to ZV8bPXq58
const MODEL_URLS = {
  skin: process.env.SKIN_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
  face: process.env.FACE_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
  ears: process.env.EARS_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
  eye: process.env.EYE_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
  eyes: process.env.EYE_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
  teeth: process.env.TEETH_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/ZV8bPXq58/',
};

// Store models for each body part
const models: Record<string, tf.LayersModel | null> = {
  skin: null,
  face: null,
  ears: null,
  eye: null,
  eyes: null,
  teeth: null,
};

const modelLoading: Record<string, boolean> = {
  skin: false,
  face: false,
  ears: false,
  eye: false,
  eyes: false,
  teeth: false,
};

async function loadModel(bodyPart: string) {
  const normalizedBodyPart = bodyPart?.toLowerCase() || 'eye';
  
  if (modelLoading[normalizedBodyPart]) return;
  
  try {
    modelLoading[normalizedBodyPart] = true;
    console.log(`🔄 Loading Teachable Machine model for ${normalizedBodyPart}...`);
    console.log(`🔍 ALL MODEL_URLS:`, JSON.stringify(MODEL_URLS, null, 2));
    
    const modelUrl = MODEL_URLS[normalizedBodyPart];
    console.log('📡 Selected Model URL:', `${modelUrl}model.json`);
    console.log('📡 Full model URL being loaded:', modelUrl);
    
    models[normalizedBodyPart] = await tf.loadLayersModel(`${modelUrl}model.json`);
    console.log(`✅ Teachable Machine model loaded successfully for ${normalizedBodyPart}`);
    console.log('📊 Model summary:', models[normalizedBodyPart]?.summary());
  } catch (error) {
    console.error(`❌ Error loading model for ${normalizedBodyPart}:`, error);
    console.log('⚠️ Using fallback predictions for now');
    models[normalizedBodyPart] = null;
  } finally {
    modelLoading[normalizedBodyPart] = false;
  }
}

// Models will be loaded on-demand when first requested

// This function will receive image data and return predictions
export const predictHealth = functions.https.onRequest({
  memory: '2GiB',
  timeoutSeconds: 60,
}, async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { image, bodyPart }: PredictionRequest = req.body;

    if (!image) {
      res.status(400).json({ error: 'Image data is required' });
      return;
    }

    const normalizedBodyPart = bodyPart?.toLowerCase() || 'eye';
    console.log('🔍 Processing image for body part:', normalizedBodyPart);
    console.log('📊 Model loaded status:', models[normalizedBodyPart] !== null);

    let predictions: Prediction[];

    // Try to load model if not loaded for this body part
    if (!models[normalizedBodyPart] && !modelLoading[normalizedBodyPart]) {
      console.log(`🔄 Attempting to load model for ${normalizedBodyPart} scan...`);
      await loadModel(normalizedBodyPart);
    }

    // Only use real Teachable Machine models - no fallbacks
    if (!models[normalizedBodyPart]) {
      throw new Error(`No model available for body part: ${normalizedBodyPart}. Please configure the model URL in environment variables.`);
    }

    console.log(`🤖 Using real Teachable Machine model for ${normalizedBodyPart} analysis`);
    predictions = await analyzeImageWithModel(image, normalizedBodyPart);
    console.log('✅ Real model predictions:', predictions);

    const response: PredictionResponse = {
      predictions
    };

    console.log('🎯 Final response:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Prediction error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

async function analyzeImageWithModel(base64Image: string, bodyPart: string): Promise<Prediction[]> {
  const normalizedBodyPart = bodyPart?.toLowerCase() || 'eye';
  const model = models[normalizedBodyPart];
  
  if (!model) {
    throw new Error(`Model not loaded for ${normalizedBodyPart}`);
  }

  try {
    console.log('🔄 Converting image for model analysis...');
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Resize image to match your model's expected input size (224x224)
    const resizedImage = await sharp(buffer)
      .resize(224, 224)
      .toBuffer();
    
    console.log('🔄 Creating tensor from image...');
    
    // Convert to tensor
    const tensor = tf.node.decodeImage(resizedImage, 3);
    const expandedTensor = tensor.expandDims(0);
    const normalizedTensor = expandedTensor.div(255.0);
    
    console.log('🚀 Making prediction with Teachable Machine model...');
    
    // Make prediction using your actual model
    const predictions = await models[normalizedBodyPart].predict(normalizedTensor) as tf.Tensor;
    const predictionArray = await predictions.array();
    
    // Clean up tensors
    tensor.dispose();
    expandedTensor.dispose();
    normalizedTensor.dispose();
    predictions.dispose();
    
    console.log('📊 Raw model predictions:', predictionArray);
    
    // Format results based on your model's classes
    const results = (predictionArray as number[][])[0].map((score: number, index: number) => ({
      className: getEyeClassLabel(index),
      probability: score
    }));
    
    console.log('✅ Formatted predictions:', results);
    return results;
  } catch (error) {
    console.error('❌ Model prediction error:', error);
    throw error;
  }
}

function getEyeClassLabel(index: number): string {
  // Updated with correct classes from ZV8bPXq58 model
  const labels = [
    'Healthy',
    'Cataract',
    'Conjunctivitis (Pink Eye)',
    'Uveitis',
    'Eyelid Drooping'
  ];
  return labels[index] || `eye_class_${index}`;
}


// Health check endpoint
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Teachable Machine API is running',
    modelLoaded: Object.values(models).some(m => m !== null)
  });
});
