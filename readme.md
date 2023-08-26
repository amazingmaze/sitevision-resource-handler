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

## Project Structure

- `build.js`: Handles the compilation of SASS files and uploads resources to the WebDAV server. Suitable for production.
- `common.js`: Contains utility functions for uploading files, compiling SASS, and creating directories.
- `watch.js`: Watches for file changes and triggers appropriate actions like compilation and upload. Suitable for development.
- `server.cjs`: A test WebDAV server for local testing.
- `config.json`: Configuration file for WebDAV server details.
- `package.json`: Project dependencies and scripts.

## Dependencies

- Chokidar: File watcher
- Node-Sass: SASS compiler
- WebDAV: WebDAV client
- Parcel: TypeScript compiler
- jsDAV: WebDAV server for testing

## Testing WebDAV Server

A test WebDAV server is included in the project, configured to run on `http://localhost:8080`. To start the server, run:

```bash
npm run test
```

## License

ISC

## Author

Mattias <mattias@amazeit.dev>
