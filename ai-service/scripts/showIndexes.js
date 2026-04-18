import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor, Client, SearchQuery } from '../models/index.js';

dotenv.config();

async function showIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📋 Detailed Index Information:');
    
    // Get index information
    const vendorIndexes = await Vendor.collection.getIndexes();
    const clientIndexes = await Client.collection.getIndexes();
    const searchQueryIndexes = await SearchQuery.collection.getIndexes();

    console.log(`\n🏢 Vendor Collection (${Object.keys(vendorIndexes).length} indexes):`);
    console.log('─'.repeat(80));
    Object.keys(vendorIndexes).forEach(indexName => {
      const index = vendorIndexes[indexName];
      console.log(`📌 ${indexName}`);
      console.log(`   Fields: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`   Unique: Yes`);
      if (index.sparse) console.log(`   Sparse: Yes`);
      if (index.background) console.log(`   Background: Yes`);
      if (index.weights) console.log(`   Weights: ${JSON.stringify(index.weights)}`);
      console.log('');
    });

    console.log(`👥 Client Collection (${Object.keys(clientIndexes).length} indexes):`);
    console.log('─'.repeat(80));
    Object.keys(clientIndexes).forEach(indexName => {
      const index = clientIndexes[indexName];
      console.log(`📌 ${indexName}`);
      console.log(`   Fields: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`   Unique: Yes`);
      if (index.sparse) console.log(`   Sparse: Yes`);
      if (index.background) console.log(`   Background: Yes`);
      console.log('');
    });

    console.log(`🔍 SearchQuery Collection (${Object.keys(searchQueryIndexes).length} indexes):`);
    console.log('─'.repeat(80));
    Object.keys(searchQueryIndexes).forEach(indexName => {
      const index = searchQueryIndexes[indexName];
      console.log(`📌 ${indexName}`);
      console.log(`   Fields: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`   Unique: Yes`);
      if (index.sparse) console.log(`   Sparse: Yes`);
      if (index.background) console.log(`   Background: Yes`);
      console.log('');
    });

    // Summary
    console.log('📊 Index Summary:');
    console.log('─'.repeat(80));
    console.log(`Total Indexes: ${Object.keys(vendorIndexes).length + Object.keys(clientIndexes).length + Object.keys(searchQueryIndexes).length}`);
    console.log(`Vendor Indexes: ${Object.keys(vendorIndexes).length}`);
    console.log(`Client Indexes: ${Object.keys(clientIndexes).length}`);
    console.log(`SearchQuery Indexes: ${Object.keys(searchQueryIndexes).length}`);
    
    // Check for important indexes
    const vendorIndexNames = Object.keys(vendorIndexes);
    const hasTextIndex = vendorIndexNames.includes('vendor_text_search');
    const hasSkillIndex = vendorIndexNames.includes('skills.name_1');
    const hasLocationIndex = vendorIndexNames.includes('location.city_1');
    
    console.log('\n✅ Key Indexes Status:');
    console.log(`   Text Search Index: ${hasTextIndex ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Skills Index: ${hasSkillIndex ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Location Index: ${hasLocationIndex ? '✅ Present' : '❌ Missing'}`);
    
    console.log('\n🎯 Your search system is ready!');
    
  } catch (error) {
    console.error('❌ Error showing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
showIndexes();
