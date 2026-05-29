const fs = require('fs');
['index.html', 'style.css', 'main.js'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8').trim();
  if (content.startsWith('"') && content.endsWith('"')) {
    try {
      content = JSON.parse(content);
      fs.writeFileSync(f, content);
      console.log('Fixed', f);
    } catch(e) {
      console.log('Failed to parse', f, e);
    }
  } else {
    console.log('Already fine', f);
  }
});
