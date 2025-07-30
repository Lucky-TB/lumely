// This can be deployed to Vercel or Netlify for free
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // TODO: Replace with actual Teachable Machine model inference
    // For now, simulate realistic predictions based on image characteristics
    const predictions = await analyzeImage(image);

    res.status(200).json({ predictions });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function analyzeImage(base64Image) {
  // Simulate realistic predictions based on image characteristics
  const imageSize = Buffer.from(base64Image, 'base64').length;
  
  let predictions;
  
  if (imageSize > 50000) { // Large image - might indicate detailed skin
    predictions = [
      { className: 'healthy_skin', probability: 0.75 },
      { className: 'mild_irritation', probability: 0.20 },
      { className: 'needs_attention', probability: 0.05 }
    ];
  } else if (imageSize > 20000) { // Medium image
    predictions = [
      { className: 'healthy_skin', probability: 0.60 },
      { className: 'mild_irritation', probability: 0.30 },
      { className: 'needs_attention', probability: 0.10 }
    ];
  } else { // Small image - might indicate poor quality
    predictions = [
      { className: 'healthy_skin', probability: 0.40 },
      { className: 'mild_irritation', probability: 0.40 },
      { className: 'needs_attention', probability: 0.20 }
    ];
  }

  return predictions;
} 