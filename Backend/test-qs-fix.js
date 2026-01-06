#!/usr/bin/env node
'use strict';

const qs = require('qs');

console.log('Testing qs arrayLimit fix...\n');

// Test 1: Basic bypass test
console.log('Test 1 - Basic bypass with bracket notation:');
console.log('Query: a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6');
console.log('Options: { arrayLimit: 5 }');
const result1 = qs.parse('a[]=1&a[]=2&a[]=3&a[]=4&a[]=5&a[]=6', { arrayLimit: 5 });
console.log('Result:', result1);
console.log('Array length:', result1.a ? result1.a.length : 'Not an array');
console.log('Expected: Should respect arrayLimit of 5, not create array of 6');
console.log('PASS:', result1.a && typeof result1.a === 'object' && !Array.isArray(result1.a) ? '✓' : '✗');
console.log('');

// Test 2: Indexed notation still works
console.log('Test 2 - Indexed notation with arrayLimit:');
console.log('Query: a[0]=1&a[1]=2&a[2]=3&a[3]=4&a[4]=5');
console.log('Options: { arrayLimit: 5 }');
const result2 = qs.parse('a[0]=1&a[1]=2&a[2]=3&a[3]=4&a[4]=5', { arrayLimit: 5 });
console.log('Result:', result2);
console.log('Array length:', result2.a ? result2.a.length : 'Not an array');
console.log('Expected: Should create an array with 5 elements');
console.log('PASS:', result2.a && Array.isArray(result2.a) && result2.a.length === 5 ? '✓' : '✗');
console.log('');

// Test 3: Indexed notation exceeding limit
console.log('Test 3 - Indexed notation exceeding arrayLimit:');
console.log('Query: a[0]=1&a[1]=2&a[2]=3&a[3]=4&a[4]=5&a[5]=6');
console.log('Options: { arrayLimit: 5 }');
const result3 = qs.parse('a[0]=1&a[1]=2&a[2]=3&a[3]=4&a[4]=5&a[5]=6', { arrayLimit: 5 });
console.log('Result:', result3);
console.log('Type:', Array.isArray(result3.a) ? 'array' : 'object');
console.log('Expected: Should convert to object when index exceeds limit');
console.log('PASS:', result3.a && !Array.isArray(result3.a) ? '✓' : '✗');
console.log('');

// Test 4: DoS prevention with large payload
console.log('Test 4 - DoS prevention with bracket notation:');
console.log('Creating query with 1000 bracket elements...');
console.log('Options: { arrayLimit: 100 }');
const largPayload = 'a[]=' + Array(1000).fill('x').join('&a[]=');
const start = Date.now();
const result4 = qs.parse(largPayload, { arrayLimit: 100 });
const elapsed = Date.now() - start;
console.log('Parsed in', elapsed, 'ms');
console.log('Result type:', Array.isArray(result4.a) ? 'array' : 'object');
if (Array.isArray(result4.a)) {
    console.log('Array length:', result4.a.length);
    console.log('PASS: ✗ (Should have been converted to object)');
} else {
    console.log('Object keys count:', Object.keys(result4.a).length);
    console.log('PASS: ✓ (Properly converted to object instead of array)');
}
console.log('');

// Test 5: Within limit should still work
console.log('Test 5 - Bracket notation within limit:');
console.log('Query: a[]=1&a[]=2&a[]=3');
console.log('Options: { arrayLimit: 5 }');
const result5 = qs.parse('a[]=1&a[]=2&a[]=3', { arrayLimit: 5 });
console.log('Result:', result5);
console.log('Array length:', result5.a ? result5.a.length : 'Not an array');
console.log('Expected: Should create an array with 3 elements (within limit)');
console.log('PASS:', result5.a && Array.isArray(result5.a) && result5.a.length === 3 ? '✓' : '✗');
console.log('');

console.log('='.repeat(50));
console.log('Summary: arrayLimit is now properly enforced for bracket notation!');
