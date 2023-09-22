import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { uploadFile, compileSass, copySitevisionScripts, init } from './common.js';
import chalk from 'chalk';

// Initialize WebDAV client
await init();

// Queue and flag to manage uploads
const uploadQueue = [];
let isUploading = false;

// Process the upload queue asynchronously
const processUploadQueue = async () => {
  if (isUploading || uploadQueue.length === 0) return;
  isUploading = true;

  const filePath = uploadQueue.shift();
  const fileContent = fs.readFileSync(filePath);
  const relativePath = path.relative('dist', filePath);

  await uploadFile(relativePath, fileContent);

  isUploading = false;
  processUploadQueue();
};

// Add file to upload queue
const uploadFileFromDist = (filePath) => {
  uploadQueue.push(filePath);
  processUploadQueue();
};

const removeFileFromWebDav = (filePath) => {
  console.log(`File deleted: ${chalk.bold(filePath)}`);
};

// Watch SASS files for changes
const sassWatcher = chokidar.watch("./src/sass", { ignored: /^\./, persistent: true });
sassWatcher.on('change', (filePath) => {
  if (path.extname(filePath) !== '.scss') return;
  compileSass(filePath);
});

// Watch Sitevision scripts folder for changes
const vmWatcher = chokidar.watch('./src/scripts', { ignored: /^\./, persistent: true });
vmWatcher.on('change', copySitevisionScripts);

// Watch the dist directory for file changes
const distWatcher = chokidar.watch('dist', { ignored: /^\./, persistent: true });

distWatcher
  .on('add', (filePath) => {
    console.log(`File added: ${chalk.bold(filePath)}`);
    uploadFileFromDist(filePath);
  })
  .on('change', (filePath) => {
    console.log(`File changed: ${chalk.bold(filePath)}`);
    uploadFileFromDist(filePath);
  })
  .on('unlink', (filePath) => {
    console.log(`File removed: ${chalk.bold(filePath)}`);
    removeFileFromWebDav(filePath);
  });

// Notify that the watcher is active
console.log(chalk.inverse(chalk.bold('Watching for changes...')));
