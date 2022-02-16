#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const cwd = process.cwd();
const cwdFile = file => path.join(cwd, file)

const pkg = require(cwdFile('package.json'));
const prodPkgFile = cwdFile('package-prod.json')

console.log('>> Generate package-prod.json file')

fs.writeFileSync(
  prodPkgFile,
  JSON.stringify(pkg, (key, value) => key === 'devDependencies' ? undefined : value, 2)
);

const dockerArgs = Array.from(process.argv).slice(2);
const dockerProcess = spawn('docker', ['build', ...dockerArgs], {
  cwd,
  argv0: 'docker',
  stdio: [0, 1, 2]
});

const cleanup = () => {
  console.log('>> Remove package-prod.json file')

  try {
    fs.rmSync(prodPkgFile)
  } catch {}
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', cleanup);
