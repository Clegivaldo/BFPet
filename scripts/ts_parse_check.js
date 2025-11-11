const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = process.cwd();
let found = false;

function walk(dir){
  const entries = fs.readdirSync(dir);
  for(const e of entries){
    const p = path.join(dir,e);
    let st;
    try{ st = fs.statSync(p); }catch(e){ continue; }
    if(st.isDirectory()){
      const base = path.basename(p);
      if(base === 'node_modules' || base === '.expo' || base.startsWith('.')) continue;
      walk(p);
      if(found) return;
      continue;
    }
    if(!/\.(ts|tsx|js|jsx)$/.test(p)) continue;
    if(p.endsWith('.d.ts')) continue;
    let text;
    try{ text = fs.readFileSync(p,'utf8'); }catch(e){ continue; }
    // choose script kind
    const ext = path.extname(p).toLowerCase();
    let kind = ts.ScriptKind.TS;
    if(ext === '.tsx') kind = ts.ScriptKind.TSX;
    if(ext === '.js') kind = ts.ScriptKind.JS;
    if(ext === '.jsx') kind = ts.ScriptKind.JSX;

    try{
      // transpileModule will parse and return diagnostics in a robust way
  const res = ts.transpileModule(text, { compilerOptions: { jsx: (kind === ts.ScriptKind.TSX || kind === ts.ScriptKind.JSX) ? 'react-native' : 'preserve' }, fileName: p });
      const diagnostics = res.diagnostics || [];
      if(diagnostics && diagnostics.length){
        for(const d of diagnostics){
          const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
          const pos = d.start != null ? getLineCol(text, d.start) : null;
          console.log(`${p}:${pos ? pos.line+1+":"+ (pos.col+1) : '?:?'} => ${msg}`);
        }
        found = true;
        return;
      }
    }catch(err){
      console.log(`${p}: parse error => ${err.message}`);
      found = true;
      return;
    }
  }
}

function getLineCol(text, pos){
  const lines = text.slice(0,pos).split(/\r?\n/);
  const line = lines.length -1;
  const col = lines[lines.length-1].length;
  return { line, col };
}

walk(root);
if(!found) console.log('OK: all files parsed by TypeScript parser');
