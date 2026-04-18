import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor, Client, SearchQuery } from '../models/index.js';

dotenv.config();

async function fixIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('\n🗑️ Dropping existing indexes...');
    await Vendor.collection.dropIndexes();
    await Client.collection.dropIndexes();
    await SearchQuery.collection.dropIndexes();
    
    console.log('✅ Existing indexes dropped');

    console.log('\n📊 Creating Vendor indexes...');
    await Vendor.createIndexes();
    console.log('✅ Vendor indexes created');

    console.log('\n📊 Creating Client indexes...');
    await Client.createIndexes();
    console.log('✅ Client indexes created');

    console.log('\n📊 Creating SearchQuery indexes...');
    await SearchQuery.createIndexes();
    console.log('✅ SearchQuery indexes created');

    console.log('\n📋 Index Summary:');
    
    const vendorIndexes = await Vendor.collection.getIndexes();
    const clientIndexes = await Client.collection.getIndexes();
    const searchQueryIndexes = await SearchQuery.collection.getIndexes();

    console.log(`\nVendor Collection (${Object.keys(vendorIndexes).length} indexes):`);
    Object.keys(vendorIndexes).forEach(indexName => {
      const index = vendorIndexes[indexName];
      const keyInfo = index.key ? JSON.stringify(index.key) : 'Default index';
      const uniqueInfo = index.unique ? ' (unique)' : '';
      const sparseInfo = index.sparse ? ' (sparse)' : '';
      console.log(`  - ${indexName}: ${keyInfo}${uniqueInfo}${sparseInfo}`);
    });

    console.log(`\nClient Collection (${Object.keys(clientIndexes).length} indexes):`);
    Object.keys(clientIndexes).forEach(indexName => {
      const index = clientIndexes[indexName];
      const keyInfo = index.key ? JSON.stringify(index.key) : 'Default index';
      const uniqueInfo = index.unique ? ' (unique)' : '';
      const sparseInfo = index.sparse ? ' (sparse)' : '';
      console.log(`  - ${indexName}: ${keyInfo}${uniqueInfo}${sparseInfo}`);
    });

    console.log(`\nSearchQuery Collection (${Object.keys(searchQueryIndexes).length} indexes):`);
    Object.keys(searchQueryIndexes).forEach(indexName => {
      const index = searchQueryIndexes[indexName];
      const keyInfo = index.key ? JSON.stringify(index.key) : 'Default index';
      const uniqueInfo = index.unique ? ' (unique)' : '';
      const sparseInfo = index.sparse ? ' (sparse)' : '';
      console.log(`  - ${indexName}: ${keyInfo}${uniqueInfo}${sparseInfo}`);
    });

    console.log('\n✅ All indexes fixed and created successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixIndexes();
