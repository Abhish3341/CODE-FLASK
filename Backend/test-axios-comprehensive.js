#!/usr/bin/env node
/**
 * Axios data: URI Vulnerability - Comprehensive Security Assessment
 * 
 * Tests whether Axios properly enforces size limits on data: URIs
 * to prevent memory exhaustion attacks (DoS).
 */

const axios = require('axios');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   Axios data: URI Memory DoS Vulnerability Assessment    ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let tests = [];
let passedTests = 0;
let failedTests = 0;

function addTest(name, passed, details = '') {
    tests.push({ name, passed, details });
    if (passed) {
        console.log(`✅ ${name}`);
        passedTests++;
    } else {
        console.log(`⚠️  ${name}`);
        failedTests++;
    }
    if (details) {
        console.log(`   ${details}`);
    }
}

// Test 1: Version check
console.log('Test 1: Axios Version');
console.log('─'.repeat(55));
const axiosPackage = require('axios/package.json');
const version = axiosPackage.version;
console.log(`Version: ${version}`);
const isVulnerable = /^1\.[0-5]\./.test(version) || /^1\.6\.0/.test(version);
const hasSomeProtection = /^1\.[6-9]\.|^[2-9]\./.test(version);
addTest(
    'Version Analysis',
    hasSomeProtection,
    isVulnerable ? '(Old version, vulnerable)' : '(Has maxContentLength protection)'
);
console.log('');

// Test 2: maxContentLength enforcement
console.log('Test 2: maxContentLength Enforcement');
console.log('─'.repeat(55));
(async () => {
    try {
        const largeBase64 = 'A'.repeat(10000); // ~7.5KB decoded
        const uri = 'data:application/octet-stream;base64,' + largeBase64;
        
        const response = await axios.get(uri, {
            responseType: 'arraybuffer',
            maxContentLength: 100,  // Only allow 100 bytes
            validateStatus: () => true
        }).catch(e => ({ error: e }));
        
        if (response.error && response.error.message && response.error.message.includes('maxContentLength')) {
            console.log('Result: Request properly rejected\n');
            addTest('maxContentLength Enforcement', true, '(Correctly enforced size limit)');
        } else if (response.status === 200) {
            console.log('Result: Request succeeded (size limit NOT enforced)\n');
            addTest('maxContentLength Enforcement', false, '(Size limit ignored)');
        } else {
            console.log(`Result: Unexpected response (${response.status})\n`);
            addTest('maxContentLength Enforcement', false, '(Unexpected behavior)');
        }
    } catch (e) {
        console.log(`Error: ${e.message}\n`);
        addTest('maxContentLength Enforcement', false, `(${e.message})`);
    }
})().then(() => {
    // Test 3: Small valid data: URI
    console.log('Test 3: Valid Small data: URI');
    console.log('─'.repeat(55));
    return (async () => {
        try {
            const smallUri = 'data:text/plain;base64,SGVsbG8gV29ybGQ='; // "Hello World"
            const response = await axios.get(smallUri, {
                responseType: 'arraybuffer',
                maxContentLength: 1000
            });
            
            console.log(`Status: ${response.status}`);
            console.log(`Data length: ${response.data.length} bytes\n`);
            addTest('Valid Data URI Processing', response.status === 200, '(Works correctly)');
        } catch (e) {
            console.log(`Error: ${e.message}\n`);
            addTest('Valid Data URI Processing', false, `(${e.message})`);
        }
    })();
}).then(() => {
    // Test 4: maxBodyLength alone (without maxContentLength)
    console.log('Test 4: maxBodyLength Without maxContentLength');
    console.log('─'.repeat(55));
    return (async () => {
        try {
            const largeBase64 = 'B'.repeat(10000);
            const uri = 'data:application/octet-stream;base64,' + largeBase64;
            
            const response = await axios.get(uri, {
                responseType: 'arraybuffer',
                maxBodyLength: 100,  // Only set maxBodyLength, not maxContentLength
                validateStatus: () => true
            }).catch(e => ({ error: e }));
            
            if (response.error && response.error.message && response.error.message.includes('exceeded')) {
                console.log('Result: Request properly rejected\n');
                addTest('maxBodyLength Enforcement', true, '(Correctly enforced)');
            } else if (response.status === 200) {
                console.log('Result: Request succeeded - ⚠️ VULNERABLE\n');
                addTest('maxBodyLength Enforcement', false, '(NOT enforced - workaround: use maxContentLength)');
            } else {
                console.log(`Result: Unexpected (${response.status})\n`);
                addTest('maxBodyLength Enforcement', false, '(Unclear)');
            }
        } catch (e) {
            console.log(`Error: ${e.message}\n`);
            addTest('maxBodyLength Enforcement', false, `(${e.message})`);
        }
    })();
}).then(() => {
    // Test 5: URL validation (best practice)
    console.log('Test 5: URL Scheme Validation');
    console.log('─'.repeat(55));
    
    function isAllowedURL(url) {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    }
    
    const testUrls = [
        { url: 'https://example.com', allowed: true },
        { url: 'http://example.com', allowed: true },
        { url: 'data:text/plain,hello', allowed: false },
        { url: 'file:///etc/passwd', allowed: false },
        { url: 'javascript:alert(1)', allowed: false }
    ];
    
    let validationPassed = true;
    testUrls.forEach(test => {
        const result = isAllowedURL(test.url);
        const correct = result === test.allowed;
        console.log(`${correct ? '✅' : '❌'} ${test.url.substring(0, 40)} → ${result ? 'Allowed' : 'Blocked'}`);
        validationPassed = validationPassed && correct;
    });
    
    console.log('');
    addTest('URL Scheme Validation', validationPassed, '(Best practice for safety)');
    
    // Summary
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log(`║  Results: ${passedTests} Passed, ${failedTests} Warnings ${' '.repeat(23)}║`);
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log('Security Assessment:\n');
    
    if (failedTests === 0) {
        console.log('✅ Axios is properly protected against data: URI DoS');
        console.log('   All size limits are properly enforced\n');
    } else {
        console.log('⚠️  IMPORTANT: Axios data: URI protection is incomplete\n');
        console.log('Current Status: v' + version);
        console.log('Issue: maxBodyLength is NOT enforced for data: URIs\n');
        
        console.log('WORKAROUNDS:\n');
        console.log('1. Always set maxContentLength (this works):\n');
        console.log('   axios.get(url, {');
        console.log('     maxContentLength: 50 * 1024 * 1024,  // 50MB limit');
        console.log('     maxBodyLength: 50 * 1024 * 1024');
        console.log('   })\n');
        
        console.log('2. Restrict allowed URL schemes:\n');
        console.log('   if (!["http:", "https:"].includes(new URL(url).protocol))');
        console.log('     throw new Error("Invalid URL scheme");\n');
        
        console.log('3. Upgrade Axios:\n');
        console.log('   npm update axios  // Get latest version with full protection\n');
    }
    
    console.log('═'.repeat(59) + '\n');
    
    process.exit(failedTests > 0 ? 1 : 0);
});
