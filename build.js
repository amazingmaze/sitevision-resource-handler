import path from 'path';
import fs from 'fs';
import { uploadFile, compileSass, copySitevisionScripts, init } from './common.js';
import chalk from 'chalk';

const main = async () => {
  // Initialize the WebDAV client and create the base directory
  await init();

  // Compile the SASS file to the dist folder
  compileSass('/src/sass/index.scss');

  // Process .vm and .js files
  processSitevisionScripts();

  // Upload each file from the dist directory
  const distPath = path.join(process.cwd(), 'dist');
  await readDirRecursively(distPath, uploadFromDist);

  console.log(chalk.bgGreen('Build and upload completed.'));
};

// Process Sitevision scripts
const processSitevisionScripts = (srcPath = path.join(process.cwd(), 'src', 'scripts')) => {
  try {
    const filesAndDirs = fs.readdirSync(srcPath);
    filesAndDirs.forEach(item => {
      const itemPath = path.join(srcPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        processSitevisionScripts(itemPath);
      } else {
        copySitevisionScripts(itemPath);
      }
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Warning: src/scripts directory not found. Not required unless you want to upload .vm/.js files.');
    } else {
      console.error('Error reading src/scripts directory:', err);
    }
  }
};

// Recursively read directory and upload each file one at a time to avoid race conditions
const readDirRecursively = async (dir, callback) => {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        await readDirRecursively(filePath, callback);
      } else {
        await callback(filePath);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

// Upload a single file from the dist directory
const uploadFromDist = async (filePath) => {
  const content = fs.readFileSync(filePath);
  const relativePath = path.relative(path.join(process.cwd(), 'dist'), filePath);
  await uploadFile(relativePath, content);
};

// Start the process
main().catch(err => {
  console.error('An error occurred:', err);
});
