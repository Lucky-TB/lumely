# Teachable Machine Integration Setup

This guide explains how to integrate your Google Teachable Machine models with the Lumely app for different body parts (skin, face, ears, eyes, and teeth).

## Prerequisites

1. Trained Teachable Machine models for the body parts you want to support (skin, face, ears, eyes, teeth)
2. Firebase project with Storage enabled
3. Environment variables configured for each body part

## Step 1: Export Your Teachable Machine Model

1. Go to your Teachable Machine project
2. Click "Export Model"
3. Choose "Tensorflow.js" format
4. Download the model files (you'll get a `model.json` and `weights.bin` file)

## Step 2: Host Your Model

You have several options to host your model:

### Option A: Firebase Hosting (Recommended)
1. Create a new Firebase Hosting site
2. Upload your model files to the `public` folder
3. Deploy the site
4. Your model will be available at `https://your-project.web.app/model.json`

### Option B: GitHub Pages
1. Create a new GitHub repository
2. Upload your model files
3. Enable GitHub Pages
4. Your model will be available at `https://your-username.github.io/your-repo/model.json`

### Option C: Any Web Server
Upload your model files to any web server that can serve static files.

## Step 3: Create a Prediction API

You'll need to create an API endpoint that can:
1. Accept image data (base64 or file upload)
2. Load your Teachable Machine model
3. Make predictions
4. Return results in JSON format

### Example API Implementation (Node.js/Express)

```javascript
const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
app.use(express.json({ limit: '50mb' }));

let model = null;

// Load the model once when the server starts
async function loadModel() {
  try {
    model = await tf.loadLayersModel('https://your-model-url.com/model.json');
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

loadModel();

app.post('/predict', async (req, res) => {
  try {
    if (!model) {
      return res.status(500).json({ error: 'Model not loaded' });
    }

    const { imageBase64 } = req.body;
    
    // Convert base64 to buffer
    const buffer = Buffer.from(imageBase64, 'base64');
    
    // Resize image to match your model's expected input size
    const resizedImage = await sharp(buffer)
      .resize(224, 224) // Adjust to your model's input size
      .toBuffer();
    
    // Convert to tensor
    const tensor = tf.node.decodeImage(resizedImage, 3);
    const expandedTensor = tensor.expandDims(0);
    const normalizedTensor = expandedTensor.div(255.0);
    
    // Make prediction
    const predictions = await model.predict(normalizedTensor).array();
    
    // Clean up tensors
    tensor.dispose();
    expandedTensor.dispose();
    normalizedTensor.dispose();
    
    // Format response
    const results = predictions[0].map((score, index) => ({
      class: getClassLabel(index), // Define your class labels
      score: score
    }));
    
    res.json({ predictions: results });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

function getClassLabel(index) {
  const labels = ['healthy_eye', 'dry_eye', 'conjunctivitis', 'cataract', 'glaucoma'];
  return labels[index] || `class_${index}`;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Step 4: Update Environment Variables

Add your model URLs for each body part to your `.env` file:

```env
# Teachable Machine URLs for different body parts
EXPO_PUBLIC_TEACHABLE_MACHINE_SKIN_URL=https://your-api-url.com/predict/skin
EXPO_PUBLIC_TEACHABLE_MACHINE_FACE_URL=https://your-api-url.com/predict/face
EXPO_PUBLIC_TEACHABLE_MACHINE_EARS_URL=https://your-api-url.com/predict/ears
EXPO_PUBLIC_TEACHABLE_MACHINE_EYE_URL=https://your-api-url.com/predict/eye
EXPO_PUBLIC_TEACHABLE_MACHINE_TEETH_URL=https://your-api-url.com/predict/teeth
```

**Note**: You can start with just the body parts you have models for. The app will use the eye model as a fallback if no specific URL is configured for a body part.

## Step 5: Test the Integration

1. Start your API server
2. Run the app
3. Go to the scan screen
4. Select any body part you have configured (Eyes, Skin, Face, Ears, or Teeth)
5. Take a photo
6. The app will use the appropriate Teachable Machine model for that body part

## Troubleshooting

### Common Issues

1. **Model not loading**: Check that your model URL is accessible and the files are properly hosted
2. **CORS errors**: Make sure your API server allows requests from your app's domain
3. **Image format issues**: Ensure your API can handle the image format being sent
4. **Memory issues**: Large models might cause memory problems on mobile devices

### Debugging

1. Check the console logs for error messages
2. Verify that the image is being uploaded to Firebase Storage
3. Test your API endpoint directly with a tool like Postman
4. Ensure your model's input size matches what you're sending

## Model Training Tips

For better results with eye health classification:

1. **Data Quality**: Use high-quality, well-lit images
2. **Class Balance**: Ensure each class has similar numbers of training examples
3. **Data Augmentation**: Use Teachable Machine's augmentation features
4. **Validation**: Test your model with various lighting conditions and angles
5. **Medical Disclaimer**: Always include appropriate medical disclaimers

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on your API
2. **Authentication**: Consider adding API keys for production use
3. **Data Privacy**: Ensure patient data is handled according to regulations
4. **Model Security**: Protect your model from unauthorized access

## Next Steps

1. Deploy your API to a production server (Heroku, AWS, etc.)
2. Add monitoring and logging
3. Implement caching for better performance
4. Add more sophisticated image preprocessing
5. Consider using a CDN for faster model loading 