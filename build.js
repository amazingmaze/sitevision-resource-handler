import path from 'path';
import fs from 'fs';
import { uploadFile, compileSass, copyVelocity, init } from './common.js';
import chalk from 'chalk';

// Initialize the WebDAV client and create the base directory if it doesn't exist
await init();

// Compile the SASS file and output it to the dist folder
compileSass('/src/sass/index.scss'); // Update the path as needed

// Function to process .vm files in the src/vm directory
const processVmFiles = () => {
  // Define the path to the src/vm directory
  const srcVmPath = path.join(process.cwd(), 'src', 'vm');
  
  try {
    // Read all files in the src/vm directory
    const files = fs.readdirSync(srcVmPath);
    
    // Iterate through each file and copy it if it has a .vm extension
    files.forEach(file => {
      if (file.endsWith("vm")) {
        const filePath = path.join(srcVmPath, file);
        copyVelocity(filePath);
      }
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('Warning: src/vm directory not found. Not required unless you want to upload .vm');
    } else {
      console.error('Error reading src/vm directory:', err);
    }
  }
};

// Function to read a directory recursively and apply a callback function to each file
const readDirRecursively = (dir, callback) => {
  // Read the directory
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Iterate through each file or sub-directory
    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        // If it's a directory, read it recursively
        if (stats.isDirectory()) {
          readDirRecursively(filePath, callback);
        } else if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.vm')) {
          // If it's a file with one of the specified extensions, apply the callback
          callback(filePath);
        }
      });
    });
  });
};

// Function to upload a file from the dist directory to the WebDAV server
const uploadFromDist = (filePath) => {
  // Read the file content
  const content = fs.readFileSync(filePath);
  
  // Get the relative path of the file within the dist directory
  const relativePath = path.relative(path.join(process.cwd(), 'dist'), filePath);
  
  uploadFile(relativePath, content);
};

// Process .vm files and copy them to the dist directory
processVmFiles();

// Read the dist directory recursively and upload each file
const distPath = path.join(process.cwd(), 'dist');
readDirRecursively(distPath, uploadFromDist);

console.log(chalk.bgGreen('Build and upload completed.'));
