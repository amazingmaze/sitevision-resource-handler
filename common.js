// common.js
import { createClient } from 'webdav';
import sass from 'node-sass';
import path from 'path';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = createClient(
  config.hostname + '/webdav/files/',
  {
    username: config.username,
    password: config.password
  }
);

export const uploadFile = (filePath, content) => {
  client.putFileContents(filePath, content).then(() => {
    console.log('File uploaded successfully:', filePath);
  }).catch(error => {
    console.error('Error uploading file:', error);
  });
};

export const compileSass = (filePath) => {
  if (path.extname(filePath) !== '.scss') return;

  try {
    const result = sass.renderSync({
      file: path.join(process.cwd(), filePath),
      outputStyle: 'compressed'
    });

    const outputPath = path.join(process.cwd(), 'dist', 'main.css');
    fs.writeFileSync(outputPath, result.css);
  } catch (err) {
    console.error(err);
  }
};

