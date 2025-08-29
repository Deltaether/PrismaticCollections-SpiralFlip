function readPackage(pkg, context) {
  // Allow essential build scripts for Angular development
  if (pkg.name === 'esbuild') {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.install = pkg.scripts.install || 'node install.js';
  }
  
  if (pkg.name === '@parcel/watcher') {
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.install = pkg.scripts.install || 'node-gyp-build';
  }
  
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};