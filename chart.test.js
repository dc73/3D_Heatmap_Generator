import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chartSVG,palettes,customPalette} from './chart.js';
const data={cells:[[0,2],[1,3]],names:['Sun','<Mon>'],columns:2,headers:['9am','10am']};
test('vector charts retain labels, values and finite geometry at all rotations',()=>{for(const rotation of [0,45,90,180,270,360]){const svg=chartSVG(data,{rotation});assert.equal((svg.match(/<polygon/g)||[]).length,12);assert.ok(svg.includes('&lt;Mon&gt;'));assert.ok(svg.includes('10am: 3'));assert.ok(!/NaN|Infinity/.test(svg));}});
test('flat chart and palettes',()=>{assert.equal((chartSVG(data,{view:'flat',palette:palettes.blue}).match(/<rect/g)||[]).length,5);const p=customPalette('#ff5055');assert.equal(p.length,5);assert.equal(p[4],'#ff5055');assert.ok(chartSVG(data,{palette:p}).includes('#ff5055'));});
