// Test script for Cosmos Canvas API
// Run with: node test.js

const API_URL = 'http://localhost:8000';

async function testAPI() {
    console.log('🧪 Testing Cosmos Canvas API\n');

    // Test 1: Health check
    console.log('1️⃣ Testing GET / (health check)...');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log('✅ Response:', data);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Chat endpoint with Mars
    console.log('2️⃣ Testing POST /chat with Mars question...');
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Tell me about Mars'
            })
        });
        const data = await response.json();
        console.log('✅ Response:\n', data.response);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Chat endpoint with Andromeda
    console.log('3️⃣ Testing POST /chat with Andromeda galaxy...');
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Tell me about the Andromeda galaxy'
            })
        });
        const data = await response.json();
        console.log('✅ Response:\n', data.response);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Chat endpoint with Orion constellation
    console.log('4️⃣ Testing POST /chat with Orion constellation...');
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: 'Tell me about Orion constellation'
            })
        });
        const data = await response.json();
        console.log('✅ Response:\n', data.response);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n✨ All tests completed!\n');

    // Test Earth mode trimming and cleaning
    console.log('5️⃣ Testing Earth mode response cleaning...');
    function testSanitize(input, mode) {
        // Simulate the cleaning logic from both backend and frontend
        let cleaned = input.trim();
        
        // Backend cleaning (strip code fences)
        cleaned = cleaned.replace(/^```json\s*|^```\s*/i, '');
        cleaned = cleaned.replace(/```\s*$/i, '');
        cleaned = cleaned.replace(/```[\s\S]*?```/g, m => m.replace(/^```\w*\s*/i, '').replace(/```$/, ''));
        cleaned = cleaned.trim();
        
        // Earth mode trimming (first 7, last 3)
        if (mode === 'Earth Json') {
            if (cleaned.length >= 10) {
                cleaned = cleaned.slice(7, -3);
            } else {
                cleaned = '';
            }
        }
        
        try {
            return JSON.stringify(JSON.parse(cleaned), null, 2);
        } catch {
            return cleaned;
        }
    }

    // Test cases
    const tests = [
        {
            input: '```json\n{"date":"2025-10-03","activeBaseLayer":"MODIS_Terra_CorrectedReflectance_TrueColor"}\n```',
            mode: 'default',
            desc: 'Code fence removal (default mode)'
        },
        {
            input: 'XXXXXXX{"date":"2025-10-03","activeBaseLayer":"test"}YYY',
            mode: 'Earth Json',
            desc: 'Earth mode trimming (7+3 chars)'
        },
        {
            input: '```json\nXXXXXXX{"date":"2025-10-03"}YYY\n```',
            mode: 'Earth Json',
            desc: 'Combined: code fence + Earth trimming'
        }
    ];

    tests.forEach((test, i) => {
        try {
            const result = testSanitize(test.input, test.mode);
            const parsed = JSON.parse(result);
            console.log(`✅ Test ${i+1} (${test.desc}): PASS`);
        } catch (e) {
            console.log(`❌ Test ${i+1} (${test.desc}): FAIL - ${e.message}`);
        }
    });
}

// Run tests
testAPI().catch(console.error);
