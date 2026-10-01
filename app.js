import {parseData,sample,parseAttendance} from './data.js';
import {chartSVG,palettes,customPalette,escapeXML} from './chart.js';
const $=id=>document.getElementById(id);
let dataset,view='iso';
const fmt=n=>n.toLocaleString(undefined,{maximumFractionDigits:2});
function render(){
 if(!dataset)return;
 const {cells,names,columns}=dataset,flat=cells.flat(),max=Math.max(...flat),total=flat.reduce((a,b)=>a+b,0);
 const palette=$('palette').value==='custom'?customPalette($('custom-color').value):palettes[$('palette').value];
 $('chart').innerHTML=chartSVG(dataset,{view,rotation:Number($('rotation').value),height:Number($('height').value),palette});
 document.querySelectorAll('.legend i').forEach((el,i)=>el.style.background=palette[i]);
 $('angle').textContent=$('rotation').value+'°';
 $('chart-title').textContent=$('title').value.trim()||'Untitled heatmap';
 $('total').textContent=fmt(total);$('peak').textContent=fmt(max);$('average').textContent=fmt(total/flat.length);
 $('shape').textContent=`${names.length} ${dataset.attendance?'days':$('mode').value==='months'?'months':'weekdays'} × ${columns} ${dataset.attendance?'hours · 9 AM–9 PM':columns===1?'value':'values'}`;
 $('chart').setAttribute('aria-label',`${$('chart-title').textContent}. ${names.map((n,i)=>`${n}: ${cells[i].join(', ')}`).join('; ')}`);
 $('height').disabled=view!=='iso';$('rotation').disabled=view!=='iso';
}
function generate(){try{const next=$('mode').value==='attendance'?parseAttendance($('data').value):parseData($('data').value,$('mode').value);dataset=next;$('error').textContent='';render();$('status').textContent='Heatmap generated. Ready to export.';}catch(e){$('error').textContent=e.message;$('status').textContent='Preview shows your last valid data.';}}
function example(){ $('data').value=$('mode').value==='attendance'?attendanceExample():sample($('mode').value);$('help').textContent=$('mode').value==='attendance'?'Paste your original Time, Sun, Mon… CSV, or import the file.':$('mode').value==='months'?'Rows are months. This example has seven values per month.':'Rows are weekdays. This example has twelve values per day.';generate();}
$('generate').addEventListener('click',generate);$('example').addEventListener('click',example);$('mode').addEventListener('change',()=>{$('help').textContent=$('mode').value==='attendance'?'Paste your original Time, Sun, Mon… CSV, or import the file.':$('mode').value==='months'?'Enter up to 12 rows, or a list of monthly values.':'Enter up to 7 rows, or a list from Monday to Sunday.';$('status').textContent='Grouping changed. Generate to apply it to your data.';});
$('title').addEventListener('input',render);$('height').addEventListener('input',render);
for(const [id,type] of [['iso','iso'],['flat','flat']])$(id).addEventListener('click',()=>{view=type;$('iso').setAttribute('aria-pressed',String(type==='iso'));$('flat').setAttribute('aria-pressed',String(type==='flat'));render();});
const logoImage=document.querySelector('.brand img');
async function logoData(){if(logoImage.src.startsWith('data:'))return logoImage.src;const blob=await (await fetch(logoImage.src)).blob();return new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});}
async function exportSVG(){const chart=$('chart').querySelector('svg').innerHTML;return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="830" viewBox="0 0 1200 830" font-family="Arial, Helvetica, sans-serif"><rect width="1200" height="830" fill="white"/><rect width="1200" height="100" fill="#17191e"/><image href="${await logoData()}" x="24" y="9" width="80" height="80"/><text x="125" y="42" fill="white" font-size="20">Academic Advancement Center</text><text x="125" y="75" fill="#ff969c" font-size="24">${escapeXML($('chart-title').textContent)}</text><g transform="translate(0 105)" font-family="Arial, Helvetica, sans-serif" fill="#637984">${chart}</g><text x="40" y="790" fill="#637984" font-size="15">${escapeXML($('shape').textContent)} · Total ${$('total').textContent} · Highest ${$('peak').textContent}</text></svg>`;}
function saveBlob(blob,extension){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=($('title').value||'AAC-heatmap').replace(/[^a-z0-9]+/gi,'-')+'.'+extension;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
$('download-svg').addEventListener('click',async()=>{try{saveBlob(new Blob([await exportSVG()],{type:'image/svg+xml'}),'svg');$('status').textContent='Vector SVG exported. Resize it without losing quality.';}catch(e){$('error').textContent='Export failed: '+e.message;}});
$('download').addEventListener('click',async()=>{try{const svg=await exportSVG(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const img=new Image();try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Could not render export.'));img.src=url;});const out=document.createElement('canvas');out.width=Number($('resolution').value);out.height=Math.round(out.width*830/1200);out.getContext('2d').drawImage(img,0,0,out.width,out.height);const blob=await new Promise(resolve=>out.toBlob(resolve,'image/png'));if(!blob)throw new Error('Could not create PNG.');saveBlob(blob,'png');$('status').textContent=`PNG exported at ${out.width} × ${out.height} pixels.`;}finally{URL.revokeObjectURL(url);}}catch(e){$('error').textContent='Export failed: '+e.message;}});
$('custom-color').addEventListener('input',()=>{$('palette').value='custom';render();});
for(const id of ['rotation','palette'])$(id).addEventListener('input',render);
let drag;
$('chart').addEventListener('pointerdown',e=>{if(view!=='iso')return;drag={x:e.clientX,angle:Number($('rotation').value)};$('chart').setPointerCapture(e.pointerId);});
$('chart').addEventListener('pointermove',e=>{if(!drag)return;$('rotation').value=(drag.angle+(e.clientX-drag.x)*.5+720)%360;render();});
for(const event of ['pointerup','pointercancel'])$('chart').addEventListener(event,()=>drag=null);
function attendanceExample(){return 'Time,Sun,Mon,Tue,Wed,Thu,Fri,Sat,Total\n'+Array.from({length:24},(_,h)=>[`${h%12||12}:00 ${h<12?'AM':'PM'}`,...Array.from({length:7},(_,d)=>h>=9&&h<=21?(h*7+d*3)%19:0),0].join(',')).join('\n');}
$('csv-file').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const text=await file.text();const attendance=/^\uFEFF?\s*"?Time"?\s*,/i.test(text);const next=attendance?parseAttendance(text):parseData(text,$('mode').value==='attendance'?'days':$('mode').value);$('mode').value=attendance?'attendance':$('mode').value==='attendance'?'days':$('mode').value;$('data').value=text;dataset=next;$('error').textContent='';render();$('status').textContent=`Imported ${file.name}${attendance?' · 9 AM–9 PM · Saturday and Total excluded':''}.`;}catch(e){$('error').textContent=e.message;}event.target.value='';});
example();
