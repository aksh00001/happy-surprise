const fs = require('fs');

const logPath = 'C:\\Users\\akshu\\.gemini\\antigravity\\brain\\61aa0be5-6509-438f-860c-62e2ff15a57a\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf-8').split('\n');

let files = {
  'index.html': '',
  'style.css': '',
  'main.js': ''
};

// Simple replay logic
for (let i = 0; i < 430; i++) {
  if (!lines[i] || !lines[i].trim()) continue;
  try {
    const data = JSON.parse(lines[i]);
    if (data.type === 'VIEW_FILE' && data.content) {
      if (data.content.includes('style.css')) files['style.css'] = data.content.replace(/^\d+:\s/gm, '');
      else if (data.content.includes('index.html')) files['index.html'] = data.content.replace(/^\d+:\s/gm, '');
      else if (data.content.includes('main.js')) files['main.js'] = data.content.replace(/^\d+:\s/gm, '');
    }
    if (data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.name === 'write_to_file') {
          const target = call.args.TargetFile;
          if (target && target.includes('style.css')) files['style.css'] = call.args.CodeContent;
          else if (target && target.includes('index.html')) files['index.html'] = call.args.CodeContent;
          else if (target && target.includes('main.js')) files['main.js'] = call.args.CodeContent;
        } else if (call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
          const target = call.args.TargetFile;
          let content = '';
          if (target && target.includes('style.css')) content = files['style.css'];
          else if (target && target.includes('index.html')) content = files['index.html'];
          else if (target && target.includes('main.js')) content = files['main.js'];
          
          if (content && call.args.ReplacementChunks) {
            let chunks = JSON.parse(call.args.ReplacementChunks || '[]');
            // For a perfect replay, we'd need to apply patch logic, but string replace might work if it's exact:
            // Actually, replace_file_content replaces by TargetContent.
            for (const chunk of chunks) {
              if (content.includes(chunk.TargetContent)) {
                 content = content.replace(chunk.TargetContent, chunk.ReplacementContent);
              }
            }
            if (target && target.includes('style.css')) files['style.css'] = content;
            else if (target && target.includes('index.html')) files['index.html'] = content;
            else if (target && target.includes('main.js')) files['main.js'] = content;
          }
        }
      }
    }
  } catch(e) {}
}

// Clean up VIEW_FILE headers
for (const key in files) {
  let lines = files[key].split('\n');
  lines = lines.filter(l => !l.startsWith('Created At:') && !l.startsWith('Completed At:') && !l.startsWith('File Path:') && !l.startsWith('Total Lines:') && !l.startsWith('Total Bytes:') && !l.startsWith('Showing lines') && !l.startsWith('The following code'));
  files[key] = lines.join('\n');
}

fs.writeFileSync('replayed_index.html', files['index.html']);
fs.writeFileSync('replayed_style.css', files['style.css']);
fs.writeFileSync('replayed_main.js', files['main.js']);
console.log("Done replaying");
