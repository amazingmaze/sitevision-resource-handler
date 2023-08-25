const jsDAV = require("jsDAV/lib/jsdav");
const jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");

// Directory where files will be stored, matching the desired URL path
const filesDir = "/webdav/files";

// Custom Basic Authentication Backend
const authBackend = {
  authenticate: function(handler, realm, cb) {
    const authHeader = handler.request.headers.authorization || '';
    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic' || !credentials) {
      return cb(null, false);
    }

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');
    if (username === 'user' && password === 'pass') {
      return cb(null, true);
    }

    return cb(null, false);
  }
};

// Create WebDAV Server
const server = jsDAV.createServer({
  node: "/", // Serve files from this directory
  locksBackend: jsDAV_Locks_Backend_FS.new(filesDir),
  authBackend: authBackend,
  realm: "example",
  plugins: { // Disable unnecessary plugins
    filelist: false,
    filesearch: false,
    codesearch: false
  }
}, 3333);

console.log('WebDAV server running on http://localhost:3333/webdav/files');
