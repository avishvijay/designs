const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'SzkzJzyQBQnKjsVnyBnnqtz9xgflXy2J';
const inputFile = path.join(__dirname, 'assets', 'portrait.jpg');
const outputFile = path.join(__dirname, 'assets', 'portrait-compressed.jpg');

// Read the input file
const input = fs.readFileSync(inputFile);

// Prepare the request options
const options = {
    hostname: 'api.tinify.com',
    path: '/shrink',
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + Buffer.from('api:' + API_KEY).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': input.length
    }
};

// Make the request to TinyPNG
const req = https.request(options, (res) => {
    if (res.statusCode === 201) {
        // Get the compressed image URL from the response
        const compressedUrl = res.headers.location;
        
        // Download the compressed image
        https.get(compressedUrl, (downloadRes) => {
            const output = fs.createWriteStream(outputFile);
            downloadRes.pipe(output);
            
            output.on('finish', () => {
                console.log('Image compressed successfully!');
                console.log('Original size:', (input.length / 1024).toFixed(2), 'KB');
                console.log('Compressed size:', (fs.statSync(outputFile).size / 1024).toFixed(2), 'KB');
            });
        });
    } else {
        console.error('Error:', res.statusCode);
    }
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(input);
req.end(); 