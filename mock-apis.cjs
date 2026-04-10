const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.api.ts')) {
        callback(dirPath);
      }
    }
  });
}

walkDir('./src/features', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Remove actual axios/api imports
  content = content.replace(/import\s+\{?\s*(?:api|axios)\s*\}?\s+from\s+["']@\/config\/axios["'];?\n?/g, '');
  
  // Create a delay helper if not present
  const delayStr = 'const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));\n\n';
  if (content.includes('axios.get') || content.includes('api.get') || content.includes('api.post') || content.includes('axios.post') || content.includes('api.put') || content.includes('axios.put') || content.includes('api.delete') || content.includes('axios.delete')) {
    if (!content.includes('const delay =')) {
      content = content.replace(/(import.*?\n)(?![ \t]*import)/, '$1\n' + delayStr);
    }
  }

  // Replace API calls - functions returning data
  content = content.replace(/const\s+\{\s*data\s*\}\s*=\s*await\s+(?:api|axios)\.(?:get|post|put)\([^)]+\);?\s*\n\s*return\s+data;?/g, 
    'await delay();\n  return {} as any;');

  // Replace get API calls directly returning (if any exist like return await api.get...)
  content = content.replace(/return\s+await\s+(?:api|axios)\.(?:get|post|put)\([^)]+\);?/g, 
    'await delay();\n  return {} as any;');

  // Replace API delete calls
  content = content.replace(/await\s+(?:api|axios)\.delete\([^)]+\);?/g, 
    'await delay();');

  // Specific for importStudents which might have more complex body
  content = content.replace(/const\s+formData\s*=\s*new\s+FormData\(\);[\s\S]*?return\s+data;?/g, 
    'await delay();\n  return {} as any;');

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Mocked:', filePath);
  }
});
