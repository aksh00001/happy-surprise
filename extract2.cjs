const fs = require('fs');

const logPath = 'C:\\Users\\akshu\\.gemini\\antigravity\\brain\\61aa0be5-6509-438f-860c-62e2ff15a57a\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');

const lastFound = { html: null, css: null, js: null };

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    // Find the multi_replace_file_content or write_to_file calls, or VIEW_FILE
    if (data.type === 'VIEW_FILE' && data.content) {
      if (data.content.includes('style.css')) lastFound.css = data.content;
      else if (data.content.includes('index.html')) lastFound.html = data.content;
      else if (data.content.includes('main.js')) lastFound.js = data.content;
    }
  } catch(e) {}
}

if (lastFound.css) fs.writeFileSync('last_style.txt', lastFound.css);
if (lastFound.html) fs.writeFileSync('last_html.txt', lastFound.html);
if (lastFound.js) fs.writeFileSync('last_js.txt', lastFound.js);

console.log("Done extracting last states");
