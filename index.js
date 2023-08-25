import sass from 'node-sass';
import chokidar from 'chokidar';
import { createClient } from 'webdav';
import path from 'path';
import config from './config.json' assert { type: 'json' };

const watcher = chokidar.watch(config.rootFolder, { ignored: /^\./, persistent: true });

const client = createClient(
  config.hostname + '/webdav/files/',
  {
    username: config.username,
    password: config.password
  }
);

watcher.on('change', (filePath) => {
  if (path.extname(filePath) === '.scss') {
    // Always render the main index.scss file
    sass.render({
      file: path.join(config.rootFolder, 'index.scss'),
      outputStyle: 'compressed'
    }, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      // Create a buffer from the result
      const cssBuffer = Buffer.from(result.css);

      // Upload the buffer as main.css
      client.putFileContents('/main.css', cssBuffer).then(() => {
        console.log('File uploaded successfully:', 'main.css');
      }).catch(error => {
        console.error('Error uploading file:', error);
      });
    });
  }
});

console.log('Watching for changes...');
