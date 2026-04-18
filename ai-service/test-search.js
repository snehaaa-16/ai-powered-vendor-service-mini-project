import axios from 'axios';

const AI_BASE_URL = 'http://localhost:3002';

async function testSearchFunctionality() {
  console.log('🧪 Testing Search Functionality...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${AI_BASE_URL}/health`);
    console.log('✅ Health Check:', {
      status: healthResponse.data.status,
      searchEngine: healthResponse.data.searchEngine?.isInitialized,
      geminiSearch: healthResponse.data.geminiSearch?.isAvailable
    });
    console.log('');

    // Test 2: Skill Search
    console.log('2. Testing Skill Search...');
    try {
      const skillSearchResponse = await axios.get(`${AI_BASE_URL}/api/skill-search?q=React`);
      console.log('✅ Skill Search:', {
        success: skillSearchResponse.data.success,
        vendorsCount: skillSearchResponse.data.vendors?.length || 0,
        pagination: skillSearchResponse.data.pagination
      });
    } catch (error) {
      console.log('❌ Skill Search Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 3: Search Suggestions
    console.log('3. Testing Search Suggestions...');
    try {
      const suggestionsResponse = await axios.get(`${AI_BASE_URL}/api/suggest?q=React`);
      console.log('✅ Search Suggestions:', {
        success: suggestionsResponse.data.success,
        suggestionsCount: suggestionsResponse.data.suggestions?.length || 0
      });
    } catch (error) {
      console.log('❌ Search Suggestions Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 4: Advanced Filter
    console.log('4. Testing Advanced Filter...');
    try {
      const advancedFilterResponse = await axios.post(`${AI_BASE_URL}/api/advanced-filter`, {
        skills: ['React', 'JavaScript'],
        rating: 4.0
      });
      console.log('✅ Advanced Filter:', {
        success: advancedFilterResponse.data.success,
        vendorsCount: advancedFilterResponse.data.vendors?.length || 0
      });
    } catch (error) {
      console.log('❌ Advanced Filter Error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 5: Smart Search (AI)
    console.log('5. Testing Smart Search (AI)...');
    try {
      const smartSearchResponse = await axios.post(`${AI_BASE_URL}/api/smart-search`, {
        requirement: 'I need a React developer to build a web application with modern UI components'
      });
      console.log('✅ Smart Search:', {
        success: smartSearchResponse.data.success,
        vendorsCount: smartSearchResponse.data.vendors?.length || 0,
        analysis: smartSearchResponse.data.analysis
      });
    } catch (error) {
      console.log('❌ Smart Search Error:', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the AI service is running on port 3002');
      console.log('   Run: cd ai-service && npm start');
    }
  }
}

// Run the test
testSearchFunctionality();
