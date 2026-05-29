const fs = require('fs');

['index.html', 'style.css', 'main.js'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8').trim();
  if (c.startsWith('"')) c = c.substring(1);
  if (c.endsWith('"')) c = c.substring(0, c.length - 1);
  
  c = c.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  
  fs.writeFileSync(f, c);
  console.log('Decoded', f);
});
