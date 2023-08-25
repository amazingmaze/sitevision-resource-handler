# Sitevision resource handler

Sass Watcher is a project that compiles SASS files, watches for changes, and uploads the resulting JavaScript and CSS files to a WebDAV server.
Uses chokidar for file watching as well as parcel for easy compilation/optimization of typescript files.

## Features

- Compiles SASS files to CSS
- Watches for changes in SASS and JavaScript files
- Uploads JavaScript and CSS files to a WebDAV server

## Requirements

- Node.js
- WebDAV server

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

## Configuration

index.scss and index.ts is required within /src/sass and /src/ts respectively. This are hard-coded paths. You'll also need to create a `config.json` file in the root directory with the following structure:

```json
{
  "hostname": "your-webdav-server.com",
  "username": "username",
  "password": "password"
}
```

Replace the values with your WebDAV server details.

## Usage
### Development

Start the development server and watch for changes:

```bash
npm run watch
```

### Build

Compile and build the project:

```bash
npm run build
```

### Files

* build.js: Compiles the SASS file and uploads JavaScript and CSS files. Will minify and optimize files. Should be used for production.
* common.js: Contains common functions for uploading files and compiling SASS
* watch.js: Watches for changes in SASS and JavaScript files and triggers compilation and upload. Will not optimize files before upload. Used for testing and development.
* package.json: Project dependencies and scripts

### Dependencies

* chokidar: File watcher
* node-sass: SASS compiler
* webdav: WebDAV client

## Testing WebDAV Server

For testing purposes, a WebDAV server is included in the project. This server uses the `jsDAV` library and is configured to run on `http://localhost:3333/webdav/files`.

### Configuration

The server is configured to use basic authentication with the following credentials:

- Username: `user`
- Password: `pass`

You can modify these credentials in the `server.cjs` file.

### Running the Server

To start the WebDAV server, run the following command:

```bash
node server.cjs
```
The server will be accessible at http://localhost:3333/webdav/files, and you can use it to test the file upload functionality of the project.

### Files

* server.cjs: Contains the code to run the WebDAV server, including authentication and configuration.

### Dependencies

* jsDAV: WebDAV server library

### Note

Make sure to update the config.json file with the correct hostname, username, and password to match the testing WebDAV server when running in a testing environment.

## License

ISC

## Author

mattias@amazeit.dev