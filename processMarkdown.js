const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

const API_KEY = process.env.API_KEY;
// const ENDPOINT_URL = new URL(process.env.ENDPOINT_URL);

const getModifiedMarkdownFiles = () => {
  try {
    const output = execSync('git log -m -1 --name-only --pretty=format:""').toString();
    return output.split('\n').filter(file => file.endsWith('.md') && file.trim() !== '');
  } catch(e) {
    return []
  }
};

const sendRequest = (file, content) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ content, filepath: file });

    const options = {
      hostname: ENDPOINT_URL.hostname,
      port: ENDPOINT_URL.port,
      path: ENDPOINT_URL.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      res.setEncoding('utf8');
      res.on('data', d => {
        process.stdout.write(d);
      });
      res.on('end', resolve);
    });

    req.on('error', error => {
      console.error(error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const main = async () => {
  const files = getModifiedMarkdownFiles();
  console.log(files)
  for (const file of files) {
    if (file) {
      const content = fs.readFileSync(file, 'utf8');
    }
  }
};

main();
