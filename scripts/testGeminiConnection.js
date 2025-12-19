/**
 * Script to test Gemini API connection and list available models
 * 
 * Usage: node scripts/testGeminiConnection.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
const ENV = require('../config/env');

const testConnection = async () => {
  try {
    if (!ENV.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in .env');
      process.exit(1);
    }

    console.log('🔍 Testing Gemini API connection...\n');
    console.log(`API Key: ${ENV.GEMINI_API_KEY.substring(0, 10)}...${ENV.GEMINI_API_KEY.substring(ENV.GEMINI_API_KEY.length - 4)}\n`);

    // Try to list models using the REST API directly
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${ENV.GEMINI_API_KEY}`;
      const response = await fetch(listUrl);
      const data = await response.json();

      if (data.models && data.models.length > 0) {
        console.log('✅ Available models:\n');
        const generateContentModels = data.models.filter(m => 
          m.supportedGenerationMethods && 
          m.supportedGenerationMethods.includes('generateContent')
        );

        if (generateContentModels.length > 0) {
          generateContentModels.forEach(model => {
            console.log(`  ✅ ${model.name}`);
            if (model.displayName) {
              console.log(`     Display Name: ${model.displayName}`);
            }
          });

          // Recommend the first available model
          const recommendedModel = generateContentModels[0].name.split('/').pop();
          console.log(`\n💡 Recommended model: ${recommendedModel}`);
          console.log(`   Update services/aiService.js line 20 to use: '${recommendedModel}'\n`);
        } else {
          console.log('⚠️  No models found that support generateContent');
        }
      } else {
        console.log('⚠️  Could not list models via REST API');
        console.log('   Trying direct model test...\n');
      }
    } catch (error) {
      console.log('⚠️  Could not list models:', error.message);
      console.log('   Trying direct model test...\n');
    }

    // Test model names directly (try both with and without models/ prefix)
    console.log('🧪 Testing model names directly:\n');
    const commonModels = [
      'gemini-2.5-flash',      // Latest and fastest
      'gemini-2.5-pro',         // Latest and most capable
      'gemini-2.0-flash',       // Stable version
      'gemini-flash-latest',    // Latest flash
      'gemini-pro-latest',      // Latest pro
      'gemini-pro',             // Legacy
      'gemini-1.5-pro',         // Legacy
      'gemini-1.5-flash'        // Legacy
    ];

    const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    let foundModel = null;

    for (const modelName of commonModels) {
      try {
        console.log(`   Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "test"');
        const response = await result.response;
        const text = await response.text();
        
        if (text) {
          console.log(`   ✅ ${modelName} - WORKS!\n`);
          foundModel = modelName;
          break;
        }
      } catch (error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          console.log(`   ❌ ${modelName} - Not available`);
        } else {
          console.log(`   ⚠️  ${modelName} - Error: ${error.message.substring(0, 80)}...`);
        }
      }
    }

    if (foundModel) {
      console.log(`\n✅ SUCCESS! Use this model: ${foundModel}`);
      console.log(`   Update services/aiService.js line 20:\n`);
      console.log(`   this.model = this.genAI.getGenerativeModel({ model: '${foundModel}' });\n`);
    } else {
      console.log('\n❌ No working models found. Possible issues:');
      console.log('   1. API key might be invalid');
      console.log('   2. API key might not have access to models');
      console.log('   3. Region restrictions');
      console.log('   4. API version mismatch\n');
      console.log('💡 Check your API key at: https://aistudio.google.com/app/apikey');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the test
testConnection();

