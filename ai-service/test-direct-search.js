import mongoose from 'mongoose';
import dotenv from 'dotenv';
import searchEngine from './services/searchEngine.js';
import { Vendor } from './models/index.js';

dotenv.config();

async function testDirectSearch() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Initializing search engine...');
    await searchEngine.initialize();
    console.log('✅ Search engine initialized');

    // Test 1: Check if vendors exist
    const vendorCount = await Vendor.countDocuments({ isActive: true });
    console.log(`📊 Found ${vendorCount} active vendors in database`);

    if (vendorCount === 0) {
      console.log('⚠️ No vendors found. Please run the seed script first:');
      console.log('   node scripts/seedData.js');
      return;
    }

    // Test 2: Direct search test
    console.log('\n🔍 Testing direct search for "React"...');
    try {
      const results = await searchEngine.searchBySkills('React', 1, 10);
      console.log('✅ Direct search successful:', {
        vendorsFound: results.vendors.length,
        total: results.pagination.total,
        query: results.query
      });
    } catch (error) {
      console.error('❌ Direct search failed:', error.message);
    }

    // Test 3: Test search suggestions
    console.log('\n🔍 Testing search suggestions...');
    try {
      const suggestions = await searchEngine.getSearchSuggestions('React', 5);
      console.log('✅ Search suggestions:', suggestions);
    } catch (error) {
      console.error('❌ Search suggestions failed:', error.message);
    }

    // Test 4: Test popular skills
    console.log('\n🔍 Testing popular skills...');
    try {
      const popularSkills = await searchEngine.getPopularSkills(10);
      console.log('✅ Popular skills:', popularSkills);
    } catch (error) {
      console.error('❌ Popular skills failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testDirectSearch();
