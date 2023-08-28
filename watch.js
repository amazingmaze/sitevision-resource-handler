import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { uploadFile, compileSass, copyVelocity, init } from './common.js';

// Initialize the WebDAV client and create the base directory if it doesn't exist
await init();

// Function to compile and upload SASS files when they change
const compileAndUploadSass = (filePath) => {
  // Check if the file has a .scss extension
  if (path.extname(filePath) !== '.scss') return;

  compileSass(filePath);

  // Read the compiled CSS from the output path
  const outputPath = path.join(process.cwd(), 'dist', 'css', 'main.css');
  const cssBuffer = fs.readFileSync(outputPath);

  const relativePath = path.relative('dist', outputPath); // Remove 'dist' from the path

  uploadFile(relativePath, cssBuffer);
};

// Function to upload JavaScript and Velocity (.vm) files when they change
const uploadJsAndVm = (filePath) => {
  const jsContent = fs.readFileSync(filePath);
  const relativePath = path.relative('dist', filePath); // Remove 'dist' from the path
  uploadFile(relativePath, jsContent);
};

// Watch for changes in SASS files and compile/upload them
const sassWatcher = chokidar.watch("./src/sass", { ignored: /^\./, persistent: true });
sassWatcher.on('change', compileAndUploadSass);

// Watch for changes in JavaScript and .vm files in the dist directory and upload them
const jsAndVmWatcher = chokidar.watch(['dist/*/*.js', 'dist/**/*.vm'], { ignored: /^\./, persistent: true });
jsAndVmWatcher.on('change', (filePath) => {
  console.log(`File changed: ${filePath}`);
  uploadJsAndVm(filePath);
});

// Watch for changes in .vm files in the src/vm directory and copy them to the dist directory
const vmWatcher = chokidar.watch('./src/vm', { ignored: /^\./, persistent: true });
vmWatcher.on('change', copyVelocity);

console.log('Watching for changes...');
