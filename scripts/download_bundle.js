const http = require('http');
const fs = require('fs');
const url = require('url');

function download(urlStr, outPath){
  return new Promise((resolve,reject)=>{
    const u = url.parse(urlStr);
    const opts = { hostname: u.hostname, port: u.port, path: u.path, method: 'GET' };
    const req = http.request(opts, res => {
      if(res.statusCode !== 200){
        reject(new Error('StatusCode: '+res.statusCode));
        return;
      }
      const file = fs.createWriteStream(outPath);
      res.pipe(file);
      file.on('finish', ()=> file.close(() => resolve()));
      file.on('error', err => reject(err));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main(){
  const bundleUrl = process.argv[2] || 'http://127.0.0.1:8081/index.bundle?platform=android&dev=false&minify=false';
  const mapUrl = process.argv[3] || 'http://127.0.0.1:8081/index.bundle.map?platform=android&dev=false&minify=false';
  const bundleOut = process.argv[4] || 'index.bundle';
  const mapOut = process.argv[5] || 'index.bundle.map';

  for(let i=0;i<60;i++){
    try{
      console.log('Attempt', i+1, 'downloading bundle...');
      await download(bundleUrl, bundleOut);
      console.log('bundle downloaded');
      await download(mapUrl, mapOut);
      console.log('map downloaded');
      console.log('Downloaded bundle and map');
      process.exit(0);
    }catch(err){
      console.log('retry', i+1, '-', err.message);
      await new Promise(r => setTimeout(r,1000));
    }
  }
  console.error('Failed to download after retries');
  process.exit(1);
}

main();
