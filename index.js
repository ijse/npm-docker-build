#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const cwd = process.cwd();
const cwdFile = file => path.join(cwd, file)

const pkg = require(cwdFile('package.json'));

const prodPkgFile = cwdFile('deps-prod.json')
const devPkgFile = cwdFile('deps-dev.json')

console.log('>> Generate deps files')

fs.writeFileSync(
  prodPkgFile,
  JSON.stringify(pkg, ['dependencies'], 2)
);

fs.writeFileSync(
  devPkgFile,
  JSON.stringify(pkg, ['dependencies', 'devDependencies'], 2)
);

const dockerArgs = Array.from(process.argv).slice(2);
const dockerProcess = spawn('docker', ['build', ...dockerArgs], {
  cwd,
  argv0: 'docker',
  stdio: [0, 1, 2]
});

const cleanup = () => {
  console.log('>> Remove deps files')

  try {
    fs.rmSync(prodPkgFile)
    fs.rmSync(devPkgFile)
  } catch {}
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('uncaughtException', cleanup);
