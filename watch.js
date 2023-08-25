// watch.js
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { uploadFile, compileSass } from './common.js';

const compileAndUploadSass = (filePath) => {
  if (path.extname(filePath) !== '.scss') return;
  compileSass(filePath);

  const outputPath = path.join(process.cwd(), 'dist', 'main.css');
  const cssBuffer = fs.readFileSync(outputPath);
  uploadFile('/main.css', cssBuffer);
};

const uploadJavaScript = (filePath) => {
  const jsContent = fs.readFileSync(filePath);
  uploadFile(path.basename(filePath), jsContent);
};

const sassWatcher = chokidar.watch("./src/sass", { ignored: /^\./, persistent: true });
sassWatcher.on('change', compileAndUploadSass);

const jsWatcher = chokidar.watch('dist/*.js', { ignored: /^\./, persistent: true });
jsWatcher.on('change', uploadJavaScript);

// Compile sass on watch start
compileAndUploadSass('/src/sass/index.scss');

console.log('Watching for changes...');
