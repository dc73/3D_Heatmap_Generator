const {app,BrowserWindow,session}=require('electron');
const path=require('node:path');
app.setName('AAC Heatmap');
app.whenReady().then(()=>{
 session.defaultSession.on('will-download',(_event,item,webContents)=>{const win=BrowserWindow.fromWebContents(webContents);item.setSaveDialogOptions({title:'Export heatmap',defaultPath:path.join(app.getPath('downloads'),item.getFilename())});});
 const create=()=>{const win=new BrowserWindow({width:1350,height:950,minWidth:800,minHeight:650,title:'Academic Advancement Center — Heatmap',backgroundColor:'#f4f7f9',autoHideMenuBar:true,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.loadFile(path.join(__dirname,'../release/Heatmap Studio.html'));};
 create();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)create();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
