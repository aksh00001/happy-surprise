const fs = require('fs');

const logPath = 'C:\\Users\\akshu\\.gemini\\antigravity\\brain\\61aa0be5-6509-438f-860c-62e2ff15a57a\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.type === 'VIEW_FILE' && data.content) {
      if (data.content.includes('style.css')) {
        fs.writeFileSync('extracted_style.txt', data.content);
      } else if (data.content.includes('index.html')) {
        fs.writeFileSync('extracted_html.txt', data.content);
      } else if (data.content.includes('main.js')) {
        fs.writeFileSync('extracted_main.txt', data.content);
      }
    }
  } catch(e) {}
}
console.log("Done");
