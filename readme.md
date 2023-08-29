# Sitevision Resource Handler

Sitevision Resource Handler is a utility that automates the process of compiling SASS files, copying Velocity templates, and uploading resources like JavaScript, CSS, and Velocity templates to a WebDAV server. It uses Chokidar for file watching, Parcel for TypeScript compilation, and Node-Sass for SASS compilation.

## Features

- Compiles SASS files to CSS
- Compiles TypeScript files to JavaScript
- Watches for changes in SASS, JavaScript, and Velocity template files
- Uploads JavaScript, CSS, and Velocity templates to a WebDAV server
- Supports recursive directory uploads

## Requirements

- Node.js
- WebDAV server

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

## Configuration

Create a `config.json` file in the root directory with the following structure:

```json
{
  "hostname": "http://your-webdav-server.com",
  "username": "username",
  "password": "password",
  "webdavBaseUploadFolder": "your-base-folder"
}
```

Replace the values with your WebDAV server details and desired base upload folder.

## Usage

### Development

To start the development server and watch for changes, run:

```bash
npm run watch
```

### Build

To compile and build the project for production, run:

```bash
npm run build
```

### Cleaning

To clean the `dist` and `.parcel-cache` directories, run:

```bash
npm run clean
```

### Notes on SiteVision
If you are to upload to a development site that does not have a legit certificate installed. Make sure that do not have https requirement in website settings (access requirements). If you do not do this you will get a 401 error on upload.

You also have to make sure that the user you use to connect to webdav is a local created sitevision user with enough privileges.

## Project Structure

- `build.js`: Handles the compilation of SASS files and uploads resources to the WebDAV server. Suitable for production.
- `common.js`: Contains utility functions for uploading files, compiling SASS, and creating directories.
- `watch.js`: Watches for file changes and triggers appropriate actions like compilation and upload. Suitable for development.
- `config.json`: Configuration file for WebDAV server details.
- `package.json`: Project dependencies and scripts.

## Dependencies

- Chokidar: File watcher
- Node-Sass: SASS compiler
- WebDAV: WebDAV client
- Parcel: TypeScript compiler

## License

ISC

## Author

Mattias <mattias@amazeit.dev>
