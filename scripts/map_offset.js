const fs = require('fs');
const path = require('path');
const { SourceMapConsumer } = require('source-map');

async function main(){
  const args = process.argv.slice(2);
  if(args.length < 3){
    console.error('Usage: node map_offset.js <bundle-file> <sourcemap-file> <genLine:genCol>');
    process.exit(2);
  }
  const [bundleFile, mapFile, pos] = args;
  const [genLineStr, genColStr] = pos.split(':');
  const genLine = parseInt(genLineStr,10);
  const genCol = parseInt(genColStr,10);
  if(!fs.existsSync(bundleFile) || !fs.existsSync(mapFile)){
    console.error('Bundle or source map file not found');
    process.exit(2);
  }
  const rawMap = fs.readFileSync(mapFile,'utf8');
  let map;
  try{ map = JSON.parse(rawMap); }catch(e){ console.error('Invalid source map JSON', e.message); process.exit(2); }

  console.log(`Mapping generated position ${genLine}:${genCol} using ${mapFile}...`);
  await SourceMapConsumer.with(map, null, consumer => {
    const orig = consumer.originalPositionFor({ line: genLine, column: genCol });
    if(orig && orig.source){
      console.log('Original source:', orig.source);
      console.log('Original line:', orig.line, 'column:', orig.column);
      console.log('Name:', orig.name || '(none)');
    } else {
      console.log('No mapping found for that generated position');
    }
  });
}

main().catch(err=>{ console.error(err); process.exit(1); });
