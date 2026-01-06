#!/usr/bin/env node
/**
 * Simple Axios data: URI test - Debug version
 */

const axios = require('axios');

console.log('Test: maxBodyLength enforcement on data: URI\n');

(async () => {
    console.log('Configuration:');
    console.log('  Data URI base64 size: 1000 bytes');
    console.log('  Estimated decoded size: ~750 bytes');
    console.log('  maxBodyLength: 50 bytes');
    console.log('');
    
    try {
        const base64 = 'B'.repeat(1000);
        const uri = 'data:application/octet-stream;base64,' + base64;
        
        console.log('Sending request...');
        const response = await axios.get(uri, {
            responseType: 'arraybuffer',
            maxBodyLength: 50
        });
        
        console.log('Response received:');
        console.log('  Status:', response.status);
        console.log('  Data length:', response.data.length);
        console.log('  Result: ❌ FAILED - should have thrown error for exceeding maxBodyLength');
        process.exit(1);
        
    } catch (err) {
        console.log('Error caught:');
        console.log('  Message:', err.message);
        if (err.message.includes('maxBodyLength') || err.message.includes('exceeded')) {
            console.log('  Result: ✅ PASSED - correctly enforced maxBodyLength');
            process.exit(0);
        } else {
            console.log('  Result: ❌ FAILED - error but not size-related');
            process.exit(1);
        }
    }
})();
