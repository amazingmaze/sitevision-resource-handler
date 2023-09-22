import { createClient } from 'webdav';
import sass from 'node-sass';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

// Load configuration from JSON file
const env = process.env.NODE_ENV || '';
const configFileName = `./config${env ? `.${env}` : ''}.json`;
const config = JSON.parse(fs.readFileSync(configFileName, 'utf8'));

// Initialize WebDAV client
const client = createClient(
  config.hostname + '/webdav/files/',
  {
    username: config.username,
    password: config.password
  }
);

// Function to create directories recursively on the WebDAV server
const createDirectoryRecursively = async (dirPath) => {
  const parts = dirPath.split('/').filter(Boolean); // Remove empty strings
  let currentPath = '';
  for (const part of parts) {
    currentPath += '/' + part;
    const exists = await client.exists(currentPath);
    if (!exists) {
      await client.createDirectory(currentPath);
    }
  }
};

// Function to upload a file to the WebDAV server
export const uploadFile = async (filePath, content) => {
  try {
    // Construct the full directory path for uploading
    let uploadDirectoryPaths = normalizePath(path.join(config.webdavBaseUploadFolder, path.dirname(filePath)));

    // Check if the directory exists on the server
    const directoryExists = await client.exists(uploadDirectoryPaths);

    // Create the directory if it doesn't exist
    if (!directoryExists) {
      console.log(chalk.bgMagenta("Creating directories in WebDAV: " + chalk.bold(uploadDirectoryPaths)));
      await createDirectoryRecursively(uploadDirectoryPaths);
    }

    const fullPath = normalizePath(path.join(uploadDirectoryPaths, path.basename(filePath)));

    // Upload the file
    await client.putFileContents(fullPath, content);
    console.log(chalk.green('File uploaded successfully:', chalk.bold(fullPath)));
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const normalizePath = (path) => path.replace(/\\/g, '/');

// Function to compile SASS files
export const compileSass = (filePath) => {
  if (path.extname(filePath) !== '.scss') return;

  try {
    const result = sass.renderSync({
      file: path.join(process.cwd(), path.join('src', 'sass', 'index.scss')),
      outputStyle: 'compressed'
    });

    const outputPath = path.join(process.cwd(), 'dist', 'css', 'main.css');

    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the compiled CSS to the output path
    fs.writeFileSync(outputPath, result.css);
  } catch (err) {
    console.error(err);
  }
};

// Function to copy Sitevision scripts to dist
export const copySitevisionScripts = (filePath) => {
  const content = fs.readFileSync(filePath);
  
  // Calculate the relative path to the 'src' directory
  const relativePathToSrc = path.relative(path.join(process.cwd(), 'src'), filePath);
  
  // Create the destination path based on the relative path
  const destPath = path.join(process.cwd(), 'dist', relativePathToSrc);

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(destPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the file to the output directory
  fs.writeFileSync(destPath, content);
};

// Initialize function to create the base directory on the WebDAV server
export const init = async () => {
  const resourcesFolderPath = config.webdavBaseUploadFolder;
  const directoryExists = await client.exists(resourcesFolderPath);

  if (!directoryExists) {
    await createDirectoryRecursively(resourcesFolderPath);
  }

  // Check if './dist' exists, if not create it
  const distFolderPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distFolderPath)) {
    fs.mkdirSync(distFolderPath, { recursive: true });
  }
};
