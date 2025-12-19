/**
 * Script to list available Gemini models
 * Helps identify which models are available in your API
 * 
 * Usage: node scripts/listGeminiModels.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ENV = require('../config/env');

const listModels = async () => {
  try {
    if (!ENV.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env');
      process.exit(1);
    }

    console.log('🔍 Listing available Gemini models...\n');
    
    const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    
    // Try to list models (if API supports it)
    try {
      // Note: listModels might not be available in all SDK versions
      // We'll try common model names instead
      const commonModels = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro-vision'
      ];

      console.log('📋 Testing common model names:\n');
      
      for (const modelName of commonModels) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          // Try a simple test request
          const result = await model.generateContent('test');
          await result.response;
          console.log(`✅ ${modelName} - Available`);
        } catch (error) {
          if (error.message.includes('404') || error.message.includes('not found')) {
            console.log(`❌ ${modelName} - Not available`);
          } else {
            console.log(`⚠️  ${modelName} - Error: ${error.message.substring(0, 100)}`);
          }
        }
      }

      console.log('\n💡 Recommended: Use "gemini-pro" if available (most stable)');
      console.log('💡 Alternative: Use "gemini-1.5-pro" if you need newer features\n');
      
    } catch (error) {
      console.error('❌ Error listing models:', error.message);
      console.log('\n💡 Try using "gemini-pro" as it\'s the most commonly available model');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the check
listModels();

