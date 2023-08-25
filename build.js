import path from 'path';
import fs from 'fs';
import { uploadFile, compileSass } from './common.js';

// Compile the SASS file
compileSass('/src/sass/index.scss'); // Update the path as needed

const distPath = path.join(process.cwd(), 'dist');
fs.readdir(distPath, (err, files) => {
  if (err) {
    console.error('Error reading dist directory:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css')) { // Upload JavaScript and CSS files
      const filePath = path.join(distPath, file);
      const content = fs.readFileSync(filePath);
      uploadFile(file, content);
    }
  });
});

console.log('Build and upload completed.');