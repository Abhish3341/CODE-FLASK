#!/usr/bin/env node
/**
 * QS Vulnerability Fix Validation
 * 
 * This script validates that the arrayLimit vulnerability in qs has been properly fixed.
 * The vulnerability allowed attackers to bypass arrayLimit protection using bracket notation.
 */

const qs = require('qs');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     QS arrayLimit Vulnerability Fix Validation             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Configuration
const tests = [
    {
        name: 'Bracket Notation Limit Enforcement',
        query: 'a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6',
        options: { arrayLimit: 5 },
        expectedType: 'object',
        description: 'Should convert to object when bracket notation exceeds arrayLimit'
    },
    {
        name: 'Bracket Notation Within Limit',
        query: 'a[]=1&a[]=2&a[]=3',
        options: { arrayLimit: 5 },
        expectedType: 'array',
        description: 'Should create array when bracket notation is within arrayLimit'
    },
    {
        name: 'Large Payload DoS Prevention',
        query: 'a[]=' + Array(500).fill('x').join('&a[]='),
        options: { arrayLimit: 50 },
        expectedType: 'object',
        description: 'Should prevent memory exhaustion with large payloads'
    },
    {
        name: 'Indexed Notation Limit',
        query: 'a[0]=1&a[1]=2&a[2]=3&a[3]=4&a[4]=5',
        options: { arrayLimit: 5 },
        expectedType: 'array',
        description: 'Indexed notation should still work correctly'
    }
];

let passCount = 0;
let failCount = 0;

tests.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log(`Query length: ${test.query.length} chars`);
    console.log(`Options: { arrayLimit: ${test.options.arrayLimit} }`);
    
    const result = qs.parse(test.query, test.options);
    const actualType = Array.isArray(result.a) ? 'array' : 'object';
    const passed = actualType === test.expectedType;
    
    console.log(`Expected type: ${test.expectedType}`);
    console.log(`Actual type:   ${actualType}`);
    console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    
    if (passed) {
        passCount++;
    } else {
        failCount++;
    }
});

console.log('╔════════════════════════════════════════════════════════════╗');
console.log(`║ Results: ${passCount} PASSED, ${failCount} FAILED${' '.repeat(25)}║`);
console.log('╚════════════════════════════════════════════════════════════╝\n');

if (failCount === 0) {
    console.log('✅ All tests passed! The arrayLimit vulnerability has been fixed.');
    process.exit(0);
} else {
    console.log('❌ Some tests failed. The vulnerability may not be fully fixed.');
    process.exit(1);
}
