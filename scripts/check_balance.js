const fs = require('fs');
const path = require('path');
const root = process.cwd();
const results = [];
function walk(dir){
  let entries;
  try { entries = fs.readdirSync(dir); } catch(e) { return; }
  for(const e of entries){
    const p = path.join(dir,e);
    let st;
    try{ st = fs.statSync(p); }catch(e){ continue; }
    if(st.isDirectory()){
      if(p.includes('node_modules')) continue;
      walk(p);
      continue;
    }
    if(!/\.(ts|tsx)$/.test(p)) continue;
    let c;
    try{ c = fs.readFileSync(p,'utf8'); }catch(e){ continue; }
    const bO = (c.match(/{/g)||[]).length;
    const bC = (c.match(/}/g)||[]).length;
    const pO = (c.match(/\(/g)||[]).length;
    const pC = (c.match(/\)/g)||[]).length;
    const brO= (c.match(/\[/g)||[]).length;
    const brC= (c.match(/\]/g)||[]).length;
    if(bO!==bC||pO!==pC||brO!==brC) results.push({file:p, braces:`${bO}/${bC}`, parens:`${pO}/${pC}`, brackets:`${brO}/${brC}`});
  }
}
walk(root);
if(results.length===0){ console.log('OK: no imbalance detected'); process.exit(0); }
for(const r of results) console.log(`${r.file}: braces:${r.braces} parens:${r.parens} brackets:${r.brackets}`);
process.exit(0);
