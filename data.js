export const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const weekdays=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export function parseData(text,mode){
 const labels=mode==='months'?months:weekdays;
 if(!text.trim())throw new Error('Enter some values to generate your heatmap.');
 let lines=text.trim().split(/\r?\n/).filter(l=>l.trim());
 const split=l=>l.includes('\t')?l.split('\t'):l.includes(',')?l.split(','):l.trim().split(/\s+/);
 let rows=lines.map(split).map(r=>r.map(s=>s.trim().replace(/^"|"$/g,'')));
 const numeric=s=>s===''||Number.isFinite(Number(s));
 let headers=[];
 if(rows.length>1&&rows[0].some((s,i)=>i>0&&!numeric(s))){headers=rows.shift().slice(1);}
 if(!rows.length)throw new Error('Add a row of numeric values below your column labels.');
 if(rows.length===1&&rows[0].every(numeric)){rows=rows[0].map(v=>[v]);}
 const named=rows.some(r=>!numeric(r[0]));
 if(named&&rows.some(r=>numeric(r[0])))throw new Error('Use a label on every row, or leave all row labels out.');
 const names=rows.map((r,i)=>named?r[0]:labels[i]);
 const values=rows.map(r=>named?r.slice(1):r);
 if(values.length>labels.length)throw new Error(`Use at most ${labels.length} rows for ${mode==='months'?'months':'days of the week'}.`);
 const columns=Math.max(...values.map(r=>r.length));
 if(columns===0)throw new Error('Add a numeric value after each row label.');
 if(columns>60)throw new Error('Use at most 60 value columns.');
 const cells=values.map((r,i)=>Array.from({length:columns},(_,j)=>{
 const raw=r[j]??''; const n=Number(raw);
 if(!Number.isFinite(n)||n<0)throw new Error(`Row ${i+1}, column ${j+1}: enter a zero or positive number.`);
 return n;
 }));
 return {names,cells,columns,headers};
}
export function sample(mode){return (mode==='months'?months:weekdays).map((name,i)=>[name,...Array.from({length:mode==='months'?7:12},(_,j)=>((i*17+j*13+i*j*7)%53))].join(', ')).join('\n');}

// Read quoted CSV fields, including escaped quotes and embedded line breaks.
export function readCSV(text){
 const rows=[];let row=[],field='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){
 const c=text[i];
 if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(quoted||field===''){quoted=!quoted;}else throw new Error('Invalid quote in CSV.');}
 else if(c===','&&!quoted){row.push(field.trim());field='';}
 else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field.trim());if(row.some(Boolean))rows.push(row);row=[];field='';}
 else field+=c;
 }
 if(quoted)throw new Error('CSV has an unclosed quoted field.');
 row.push(field.trim());if(row.some(Boolean))rows.push(row);
 return rows;
}
export function parseAttendance(text){
 const rows=readCSV(text),header=rows.shift()?.map(s=>s.toLowerCase());
 const days=['Mon','Tue','Wed','Thu','Fri','Sun'];
 const names=['Monday','Tuesday','Wednesday','Thursday','Friday','Sunday'];
 if(!header||header[0]!=='time')throw new Error('CSV must start with a Time column followed by Sun, Mon, Tue, Wed, Thu, Fri.');
 const indices=days.map(d=>header.indexOf(d.toLowerCase()));
 if(indices.some(i=>i<0))throw new Error('CSV must include Sun, Mon, Tue, Wed, Thu, and Fri columns.');
 const hours=new Map();
 rows.forEach((r,i)=>{
 const match=r[0]?.match(/^(\d{1,2}):([0-5]\d)\s*(am|pm)?$/i);
 if(!match)throw new Error(`CSV row ${i+2}: unrecognized time.`);
 let h=Number(match[1]);const minute=Number(match[2]),period=match[3]?.toLowerCase();
 if((period&&(h<1||h>12))||(!period&&h>23))throw new Error(`CSV row ${i+2}: invalid hour.`);
 if(period)h=h%12+(period==='pm'?12:0);
 if(h<9||h>21||minute!==0)return;
 if(hours.has(h))throw new Error(`CSV has more than one row for ${r[0]}.`);
 hours.set(h,indices.map(j=>{const raw=r[j];const n=Number(raw);if(raw===undefined||!Number.isFinite(n)||n<0)throw new Error(`CSV row ${i+2}: attendance must be zero or positive.`);return n;}));
 });
 const selected=Array.from({length:13},(_,i)=>i+9);
 const missing=selected.filter(h=>!hours.has(h));
 if(missing.length)throw new Error(`CSV is missing hourly rows: ${missing.map(h=>`${h%12||12}:00 ${h<12?'AM':'PM'}`).join(', ')}.`);
 return {names,cells:days.map((_,d)=>selected.map(h=>hours.get(h)[d])),columns:13,headers:selected.map(h=>`${h%12||12}${h<12?'am':'pm'}`),attendance:true};
}
