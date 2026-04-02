<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MoneyWise — จัดการการเงิน</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#101014;--card:#1a1a22;--bdr:#2a2a35;--txt:#e8e6e1;--sub:#9a9590;--dim:#605c57;--acc:#C4956A;--grn:#5ab88a;--red:#e0675a;--crm:#22222c;--mono:'DM Mono',monospace;--sans:'Plus Jakarta Sans','Noto Sans Thai',sans-serif;--serif:'DM Serif Display',serif}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background:var(--bg);color:var(--txt);font-family:var(--sans);min-height:100vh;display:flex}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:4px}
input,select,button{font-family:inherit;outline:none}
input:focus,select:focus{border-color:var(--acc)!important}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
select{-webkit-appearance:none;appearance:none}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* Sidebar */
.side{width:200px;background:var(--card);border-right:1px solid var(--bdr);display:flex;flex-direction:column;height:100vh;position:sticky;top:0;flex-shrink:0;overflow-y:auto}
.side-logo{padding:24px 18px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:10}
.logo-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--acc),#A07850);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700;font-family:var(--serif)}
.side-nav{padding:10px 8px;flex:1}
.nav-label{font-size:9px;color:var(--dim);font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:8px 10px 4px}
.nav-btn{width:100%;display:flex;align-items:center;gap:8;padding:9px 10px;border-radius:8px;border:none;cursor:pointer;margin-bottom:1px;background:transparent;color:var(--sub);font-size:12px;transition:all .12s}
.nav-btn.active{background:var(--crm);color:var(--txt);font-weight:600}
.nav-btn .ico{font-size:13px;width:20px;text-align:center;opacity:.5}
.nav-btn.active .ico{opacity:1}
.nav-sep{height:1px;background:var(--bdr);margin:6px 10px}
.side-foot{padding:12px 18px;border-top:1px solid var(--bdr);font-size:10px;color:var(--dim)}

/* Main */
.main{flex:1;min-width:0;padding:0 28px 40px}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 0 12px}
.topbar h1{font-size:20px;font-weight:700;font-family:var(--serif)}
.topbar .sub{font-size:11px;color:var(--dim);margin-top:2px}
.top-actions{display:flex;align-items:center;gap:8}
.period-nav{display:flex;background:var(--card);border-radius:8px;border:1px solid var(--bdr);padding:2px}
.period-nav button{width:28px;height:28px;border:none;background:transparent;cursor:pointer;border-radius:6px;font-size:10px;color:var(--sub)}
.btn-today{height:28px;border:none;background:var(--crm);cursor:pointer;border-radius:6px;font-size:10px;color:var(--acc);padding:0 8px;font-weight:600}
.btn-add{height:36px;padding:0 16px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--acc),#A07850);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5;box-shadow:0 2px 12px #C4956A33}
.sync-dot{width:6px;height:6px;border-radius:50%;margin-right:4px;display:inline-block}
.sync-dot.ok{background:var(--grn);animation:pulse 2s infinite}
.sync-dot.err{background:var(--red)}

/* Cards */
.card{background:var(--card);border-radius:16px;padding:20px;border:1px solid var(--bdr);animation:fadeIn .4s ease both}
.card-flat{background:var(--card);border-radius:16px;border:1px solid var(--bdr);overflow:hidden;animation:fadeIn .4s ease both}
.lbl{font-size:10px;color:var(--dim);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.mono{font-family:var(--mono)}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}
.mb{margin-bottom:14px}
.center{text-align:center}

/* Stat box */
.stat{background:var(--crm);border-radius:10px;padding:12px;text-align:center}
.stat .v{font-size:18px;font-weight:700;font-family:var(--mono)}
.stat .u{font-size:9px;color:var(--dim);margin-top:2px}

/* Progress bar */
.pbar{background:var(--crm);border-radius:4px;height:5px;overflow:hidden}
.pbar .fill{height:100%;border-radius:4px;transition:width .5s;opacity:.7}

/* Entry row */
.erow{display:flex;justify-content:space-between;align-items:center;padding:11px 20px;cursor:pointer;border-bottom:1px solid var(--bdr);transition:background .1s}
.erow:hover{background:var(--crm)}
.erow .left{display:flex;align-items:center;gap:12px}
.erow .icon-box{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px}
.erow .name{font-size:12px;font-weight:600}
.erow .meta{font-size:10px;color:var(--dim)}
.erow .amt{font-size:13px;font-weight:700;font-family:var(--mono)}

/* Modal */
.overlay{position:fixed;inset:0;background:#000000aa;z-index:400;display:flex;align-items:center;justify-content:center}
.modal{background:var(--card);border-radius:20px;padding:28px;width:400px;max-height:90vh;overflow-y:auto;border:1px solid var(--bdr);box-shadow:0 20px 60px #000000aa;animation:fadeIn .2s}
.modal h2{font-size:17px;font-weight:700;font-family:var(--serif);margin:0 0 18px}
.inp{width:100%;background:var(--crm);border:1px solid var(--bdr);border-radius:12px;padding:12px 16px;color:var(--txt);font-size:14px;box-sizing:border-box}
.inp-lg{font-size:24px;font-weight:700;text-align:center;font-family:var(--mono)}
.cat-btn{border-radius:18px;padding:6px 12px;font-size:11px;cursor:pointer;white-space:nowrap;border:1px solid var(--bdr);background:var(--crm);color:var(--sub);transition:all .15s}
.cat-btn.active{border-color:currentColor}
.type-btn{flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;border:1.5px solid var(--bdr);background:transparent;color:var(--sub)}
.btn-save{width:100%;height:44px;border-radius:10px;border:none;color:#fff;font-size:13px;font-weight:700;cursor:pointer}
.btn-del{width:44px;height:44px;border-radius:10px;background:#3a2020;border:1px solid #4a2a2a;cursor:pointer;font-size:15px}

/* Date group */
.date-hdr{padding:8px 20px;background:var(--crm);border-bottom:1px solid var(--bdr);font-size:12px;font-weight:600}

/* Bar chart */
.bar-wrap{display:flex;align-items:flex-end;gap:1px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px}
.bar{width:100%;max-width:14px;border-radius:3px 3px 1px 1px;transition:height .5s}
.bar-lbl{font-size:8px;color:var(--dim)}

/* Toast */
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:999;padding:10px 24px;border-radius:12px;font-size:13px;font-weight:600;box-shadow:0 4px 20px #00000066;animation:fadeIn .2s}
.toast.ok{background:#1a2a22;color:var(--grn);border:1px solid #2a4a3a}
.toast.err{background:#2a1a1a;color:var(--red);border:1px solid #4a2a2a}

/* Responsive */
@media(max-width:768px){
  .side{display:none}
  .grid-3,.grid-2,.grid-4{grid-template-columns:1fr}
  .main{padding:0 16px 40px}
}
</style>
</head>
<body>
<!-- SIDEBAR -->
<div class="side">
  <div class="side-logo">
    <div class="logo-icon">฿</div>
    <div><div style="font-size:14px;font-weight:700;letter-spacing:-.3px">MoneyWise</div><div style="font-size:8px;color:var(--dim);letter-spacing:1.5px;text-transform:uppercase">Financial Manager</div></div>
  </div>
  <div class="side-nav" id="sideNav"></div>
  <div class="side-foot">
    <div><span class="sync-dot ok" id="syncDot"></span> <span id="syncStatus">เชื่อมต่อแล้ว</span></div>
    <div style="margin-top:4px" id="sideInfo">—</div>
  </div>
</div>

<!-- MAIN -->
<div class="main">
  <div class="topbar">
    <div>
      <h1 id="pageTitle">ภาพรวมการเงิน</h1>
      <div class="sub" id="periodLabel">—</div>
    </div>
    <div class="top-actions">
      <div class="period-nav">
        <button onclick="changePeriod(-1)">◀</button>
        <button class="btn-today" id="btnToday" onclick="changePeriod(0)" style="display:none">วันนี้</button>
        <button onclick="changePeriod(1)">▶</button>
      </div>
      <button class="btn-add" onclick="openAddModal()"><span style="font-size:14px;font-weight:300">+</span>เพิ่มรายการ</button>
    </div>
  </div>
  <div id="pageContent"></div>
</div>

<!-- TOAST -->
<div id="toast" class="toast ok" style="display:none"></div>

<!-- MODAL -->
<div id="modalOverlay" class="overlay" style="display:none" onclick="closeModal()">
  <div class="modal" onclick="event.stopPropagation()" id="modalContent"></div>
</div>

<script>
// ═══════════════════════════════════════════════════
// CONFIG — ใส่ URL ของ Google Apps Script ตรงนี้
// ═══════════════════════════════════════════════════
let API_URL = localStorage.getItem('armfin_api') || '';
let SALARY_DAY = parseInt(localStorage.getItem('armfin_sd')) || 25;
let REFRESH_SEC = 30;

// ═══ STATE ═══
let entries = [];
let budgets = JSON.parse(localStorage.getItem('armfin_budgets') || '{}');
let goals = JSON.parse(localStorage.getItem('armfin_goals') || '[]');
let fixedExp = JSON.parse(localStorage.getItem('armfin_fixed') || '[]');
let taxItems = JSON.parse(localStorage.getItem('armfin_tax') || '{}');
let currentPage = 'overview';
let periodOffset = 0;
let refreshTimer = null;
let lastSync = null;

// ═══ CATEGORIES ═══
const EXP_CATS = [
  {id:"food",name:"อาหาร",icon:"🍜",color:"#E76F51"},
  {id:"transport",name:"เดินทาง",icon:"⛽",color:"#F4A261"},
  {id:"bills",name:"ค่าน้ำ/ไฟ/เน็ต",icon:"🏠",color:"#E9C46A"},
  {id:"shopping",name:"ช้อปปิ้ง",icon:"🛒",color:"#E07A5F"},
  {id:"health",name:"สุขภาพ",icon:"💊",color:"#81B29A"},
  {id:"insurance",name:"ประกัน/ผ่อน",icon:"📋",color:"#3D405B"},
  {id:"social",name:"สังคม/งานบุญ",icon:"🎊",color:"#F2CC8F"},
  {id:"education",name:"การศึกษา",icon:"📚",color:"#264653"},
  {id:"saving",name:"ออม/ลงทุน",icon:"🏦",color:"#287271"},
  {id:"other_expense",name:"อื่นๆ",icon:"📌",color:"#9B9B9B"},
];
const INC_CATS = [
  {id:"salary",name:"เงินเดือน",icon:"💰",color:"#2D6A4F"},
  {id:"bonus",name:"โบนัส",icon:"🎁",color:"#40916C"},
  {id:"ot",name:"ค่าเวร/OT",icon:"⏰",color:"#52B788"},
  {id:"other_income",name:"รายได้อื่น",icon:"💎",color:"#74C69D"},
];
const ALL_CATS = [...INC_CATS, ...EXP_CATS];
const catMap = Object.fromEntries(ALL_CATS.map(c=>[c.id,c]));
const gc = id => catMap[id] || {id,name:id,icon:"📌",color:"#9B9B9B"};

// ═══ UTILS ═══
const THM = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const THF = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const f$ = n => Math.abs(n).toLocaleString('th-TH',{maximumFractionDigits:0});
const fD = d => {const x=new Date(d);return `${x.getDate()} ${THM[x.getMonth()]} ${x.getFullYear()+543}`;};
const fT = d => {const x=new Date(d);return `${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`;};

function getPeriod(sd, off=0) {
  const n=new Date(); n.setMonth(n.getMonth()+off);
  const y=n.getFullYear(),m=n.getMonth(),d=n.getDate();
  let s,e;
  if(d>=sd){s=new Date(y,m,sd);e=new Date(y,m+1,sd-1,23,59,59);}
  else{s=new Date(y,m-1,sd);e=new Date(y,m,sd-1,23,59,59);}
  const dp=Math.max(Math.ceil((new Date()-s)/864e5),1);
  const td=Math.ceil((e-s)/864e5)+1;
  return {start:s,end:e,title:`${THF[s.getMonth()]} ${s.getFullYear()+543}`,range:`${s.getDate()} ${THM[s.getMonth()]} — ${e.getDate()} ${THM[e.getMonth()]} ${e.getFullYear()+543}`,dp,td,prog:Math.min(dp/td,1)};
}

function toast(msg, type='ok') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2800);
}

function saveLocal(key, val) { localStorage.setItem('armfin_'+key, JSON.stringify(val)); }

// ═══ API ═══
async function fetchData() {
  if (!API_URL) { updateSyncStatus(false, 'ยังไม่ได้ตั้งค่า API'); return; }
  try {
    const r = await fetch(API_URL + '?action=getData');
    const d = await r.json();
    if (d.success) {
      entries = (d.entries||[]).map(e => ({
        id: String(e.id), type: e.type, category: e.category,
        amount: parseFloat(e.amount)||0, note: e.note||'',
        date: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
        source: e.source||'unknown'
      }));
      if (d.salaryDay) { SALARY_DAY = d.salaryDay; localStorage.setItem('armfin_sd', SALARY_DAY); }
      lastSync = new Date();
      updateSyncStatus(true, `อัพเดท ${fT(lastSync)}`);
      renderPage();
    }
  } catch(e) {
    console.error('Fetch error:', e);
    updateSyncStatus(false, 'เชื่อมต่อไม่ได้');
  }
}

async function addEntry(type, category, amount, note, date) {
  if (!API_URL) { toast('กรุณาตั้งค่า API URL ก่อน','err'); return; }
  try {
    const params = new URLSearchParams({action:'addEntry',type,category,amount,note,date});
    await fetch(API_URL+'?'+params);
    toast('บันทึกสำเร็จ ✓');
    await fetchData();
  } catch(e) { toast('บันทึกไม่สำเร็จ','err'); }
}

async function deleteEntry(id) {
  if (!API_URL) return;
  try {
    await fetch(API_URL+'?action=deleteEntry&id='+id);
    toast('ลบแล้ว');
    await fetchData();
  } catch(e) { toast('ลบไม่สำเร็จ','err'); }
}

function updateSyncStatus(ok, msg) {
  const dot = document.getElementById('syncDot');
  const st = document.getElementById('syncStatus');
  dot.className = 'sync-dot ' + (ok?'ok':'err');
  st.textContent = msg;
}

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(fetchData, REFRESH_SEC * 1000);
}

// ═══ COMPUTED ═══
function getComputed() {
  const pd = getPeriod(SALARY_DAY, periodOffset);
  const pE = entries.filter(e => {const d=new Date(e.date);return d>=pd.start&&d<=pd.end;});
  const tI = pE.filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0);
  const tX = pE.filter(e=>e.type==='expense').reduce((s,e)=>s+e.amount,0);
  const bal = tI-tX;
  const pct = tI>0?Math.round((tX/tI)*100):0;
  const fixT = fixedExp.reduce((s,f)=>s+f.amount,0);
  const avgD = pd.dp>0?Math.round(tX/pd.dp):0;

  const expCat = {};
  pE.filter(e=>e.type==='expense').forEach(e=>{expCat[e.category]=(expCat[e.category]||0)+e.amount;});
  const expCatArr = Object.entries(expCat).map(([id,total])=>({...gc(id),total})).sort((a,b)=>b.total-a.total);

  // Daily data
  const days={};const diff=Math.ceil((pd.end-pd.start)/864e5)+1;
  for(let i=0;i<Math.min(diff,31);i++){const d=new Date(pd.start);d.setDate(d.getDate()+i);days[d.toISOString().slice(0,10)]=0;}
  pE.filter(e=>e.type==='expense').forEach(e=>{const k=e.date.slice(0,10);if(k in days)days[k]+=e.amount;});
  const dailyD=Object.entries(days).map(([dt,v])=>({l:new Date(dt).getDate().toString(),v}));

  // Grouped
  const sorted=[...pE].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const grouped={};sorted.forEach(e=>{const k=e.date.slice(0,10);if(!grouped[k])grouped[k]=[];grouped[k].push(e);});

  // Monthly (6 months)
  const monthly=[];
  for(let i=0;i<6;i++){const p=getPeriod(SALARY_DAY,-i);const mE=entries.filter(e=>{const d=new Date(e.date);return d>=p.start&&d<=p.end;});
    monthly.push({pd:p,inc:mE.filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0),exp:mE.filter(e=>e.type==='expense').reduce((s,e)=>s+e.amount,0),n:mE.length});}
  monthly.reverse();

  return {pd,pE,tI,tX,bal,pct,fixT,avgD,expCatArr,dailyD,grouped:Object.entries(grouped),monthly,disp:tI-fixT};
}

// ═══ NAVIGATION ═══
const navItems = [
  {id:'overview',label:'ภาพรวม',icon:'◎',g:1},
  {id:'transactions',label:'รายการ',icon:'☰',g:1},
  {id:'budget',label:'งบประมาณ',icon:'📐',g:2},
  {id:'fixed',label:'รายจ่ายประจำ',icon:'🔄',g:2},
  {id:'goals',label:'เป้าหมาย',icon:'🎯',g:2},
  {id:'compare',label:'เปรียบเทียบ',icon:'📊',g:2},
  {id:'tax',label:'ภาษี',icon:'📋',g:3},
  {id:'analytics',label:'วิเคราะห์',icon:'◐',g:3},
  {id:'settings',label:'ตั้งค่า',icon:'⚙',g:4},
];

const titles = {overview:'ภาพรวมการเงิน',transactions:'รายการทั้งหมด',budget:'งบประมาณ',fixed:'รายจ่ายประจำ',goals:'เป้าหมายการเงิน',compare:'เปรียบเทียบรายเดือน',tax:'สรุปภาษี',analytics:'วิเคราะห์การเงิน',settings:'ตั้งค่า'};

function buildNav() {
  let html = '';
  let lastG = 0;
  navItems.forEach(n => {
    if (n.g !== lastG && lastG > 0) html += '<div class="nav-sep"></div>';
    lastG = n.g;
    html += `<button class="nav-btn ${currentPage===n.id?'active':''}" onclick="navigate('${n.id}')"><span class="ico">${n.icon}</span>${n.label}</button>`;
  });
  document.getElementById('sideNav').innerHTML = html;
}

function navigate(pg) {
  currentPage = pg;
  buildNav();
  renderPage();
}

function changePeriod(dir) {
  if (dir === 0) periodOffset = 0;
  else periodOffset += dir;
  document.getElementById('btnToday').style.display = periodOffset !== 0 ? 'block' : 'none';
  renderPage();
}

// ═══ RENDER HELPERS ═══
function pbar(pct, color, h=5) {
  return `<div class="pbar" style="height:${h}px"><div class="fill" style="width:${Math.min(pct,100)}%;background:${color}"></div></div>`;
}

function erow(e, onclick='') {
  const c = gc(e.category);
  return `<div class="erow" onclick="${onclick}"><div class="left"><div class="icon-box" style="background:${c.color}18">${c.icon}</div><div><div class="name">${c.name}</div><div class="meta">${fD(e.date)}${e.note?' · '+e.note:''}${e.source==='telegram'?' 📲':''}</div></div></div><div class="amt" style="color:${e.type==='income'?'var(--grn)':'var(--txt)'}">${e.type==='income'?'+':'−'}${f$(e.amount)}</div></div>`;
}

function barChart(data, h=100) {
  const mx = Math.max(...data.map(d=>d.v),1);
  const td = new Date().getDate();
  let html = `<div class="bar-wrap" style="height:${h}px">`;
  data.forEach(d => {
    const ht = Math.max((d.v/mx)*100, d.v>0?5:2);
    const isT = parseInt(d.l) === td;
    html += `<div class="bar-col"><div class="bar" style="height:${ht}%;background:${isT?'var(--acc)':d.v>0?'#3a3a45':'var(--crm)'}"></div>${(parseInt(d.l)%5===0||isT)?`<span class="bar-lbl" style="color:${isT?'var(--acc)':'var(--dim)'};font-weight:${isT?700:400}">${d.l}</span>`:''}</div>`;
  });
  return html + '</div>';
}

function donutSVG(segs, sz=100, sw=10) {
  const r=(sz-sw)/2, ci=2*Math.PI*r, tot=segs.reduce((a,s)=>a+s.v,0)||1;
  let off=-ci/4, circles='';
  segs.forEach(s=>{const l=(s.v/tot)*ci;circles+=`<circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${s.c}" stroke-width="${sw}" stroke-dasharray="${l} ${ci-l}" stroke-dashoffset="${-off}" stroke-linecap="round"/>`;off+=l;});
  return `<svg width="${sz}" height="${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--bdr)" stroke-width="${sw}"/>${circles}</svg>`;
}

// ═══ PAGE RENDERERS ═══
function renderPage() {
  const c = getComputed();
  document.getElementById('pageTitle').textContent = titles[currentPage];
  document.getElementById('periodLabel').textContent = c.pd.range;
  document.getElementById('sideInfo').textContent = `รอบวันที่ ${SALARY_DAY} · ${entries.length} รายการ`;

  const el = document.getElementById('pageContent');
  switch(currentPage) {
    case 'overview': el.innerHTML = renderOverview(c); break;
    case 'transactions': el.innerHTML = renderTransactions(c); break;
    case 'budget': el.innerHTML = renderBudget(c); break;
    case 'fixed': el.innerHTML = renderFixed(c); break;
    case 'goals': el.innerHTML = renderGoals(c); break;
    case 'compare': el.innerHTML = renderCompare(c); break;
    case 'tax': el.innerHTML = renderTax(c); break;
    case 'analytics': el.innerHTML = renderAnalytics(c); break;
    case 'settings': el.innerHTML = renderSettings(); break;
  }
}

function renderOverview(c) {
  let html = `<div class="grid-3 mb">${[{l:'รายรับ',v:c.tI,co:'var(--grn)'},{l:'รายจ่าย',v:c.tX,co:'var(--red)'},{l:'คงเหลือ',v:Math.abs(c.bal),co:c.bal>=0?'var(--grn)':'var(--red)'}].map(x=>`<div class="card" style="padding:16px"><div class="lbl">${x.l}</div><span class="mono" style="font-size:22px;font-weight:700;color:${x.co}">${f$(x.v)}</span><span style="font-size:11px;color:var(--dim);margin-left:3px">฿</span></div>`).join('')}</div>`;

  // Status + Donut
  html += `<div class="grid-2 mb">`;
  html += `<div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><div class="lbl">สถานะรอบเดือน</div><span style="font-size:10px;color:var(--acc);font-weight:600">วันที่ ${c.pd.dp}/${c.pd.td}</span></div>${pbar(c.pd.prog*100,'var(--acc)',7)}<div class="grid-2" style="margin-top:14px"><div><div style="font-size:9px;color:var(--dim);text-transform:uppercase;margin-bottom:3px">เฉลี่ย/วัน</div><div class="mono" style="font-size:17px;font-weight:700">${f$(c.avgD)}</div></div><div><div style="font-size:9px;color:var(--dim);text-transform:uppercase;margin-bottom:3px">เหลือใช้จริง</div><div class="mono" style="font-size:17px;font-weight:700;color:${c.disp>0?'var(--grn)':'var(--red)'}">${f$(c.disp)}</div></div></div></div>`;

  html += `<div class="card" style="padding:16px"><div class="lbl">สัดส่วนรายจ่าย</div>`;
  if(c.expCatArr.length>0) {
    html += `<div style="display:flex;gap:14px;align-items:center"><div style="position:relative;width:100px;height:100px">${donutSVG(c.expCatArr.map(x=>({v:x.total,c:x.color})))}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span class="mono" style="font-size:16px;font-weight:700">${c.pct}%</span></div></div><div>${c.expCatArr.slice(0,4).map(x=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><div style="width:6px;height:6px;border-radius:50%;background:${x.color}"></div><span style="font-size:10px;color:var(--sub);flex:1">${x.name}</span><span class="mono" style="font-size:10px;font-weight:600">${f$(x.total)}</span></div>`).join('')}</div></div>`;
  } else html += `<div class="center" style="padding:16px;color:var(--dim);font-size:12px">ยังไม่มีข้อมูล</div>`;
  html += `</div></div>`;

  // Daily chart
  html += `<div class="card mb" style="padding:16px"><div class="lbl">รายจ่ายรายวัน</div>${c.dailyD.length>0?barChart(c.dailyD):'<div class="center" style="padding:16px;color:var(--dim)">ยังไม่มีข้อมูล</div>'}</div>`;

  // Recent
  html += `<div class="card-flat"><div style="display:flex;justify-content:space-between;padding:14px 20px 6px"><div class="lbl">รายการล่าสุด</div>${c.pE.length>4?`<button style="background:none;border:none;color:var(--acc);font-size:10px;font-weight:600;cursor:pointer" onclick="navigate('transactions')">ดูทั้งหมด →</button>`:''}</div>`;
  if(c.pE.length===0) html += `<div class="center" style="padding:20px 20px 28px;color:var(--dim)">📭 ยังไม่มีรายการ</div>`;
  else [...c.pE].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).forEach(e=>{ html += erow(e, `openEditModal('${e.id}')`); });
  html += `</div>`;
  return html;
}

function renderTransactions(c) {
  let html = '<div class="card-flat">';
  if(c.pE.length===0) return html + '<div class="center" style="padding:60px;color:var(--dim)">📭 ยังไม่มีรายการ</div></div>';
  c.grouped.forEach(([dk,items])=>{
    html += `<div class="date-hdr">${fD(dk)}</div>`;
    items.forEach(e=>{ html += erow(e, `openEditModal('${e.id}')`); });
  });
  return html + '</div>';
}

function renderBudget(c) {
  let html = `<div class="card mb" style="padding:16px"><div class="lbl">ตั้งงบประมาณ</div><div style="display:flex;gap:8px;flex-wrap:wrap"><select id="budgetCat" class="inp" style="flex:1;min-width:120px;padding:9px 12px"><option value="">เลือกหมวด...</option>${EXP_CATS.map(x=>`<option value="${x.id}">${x.icon} ${x.name}</option>`).join('')}</select><input id="budgetAmt" type="number" class="inp mono" placeholder="งบ/เดือน" style="flex:1;min-width:100px;padding:9px 12px"><button onclick="saveBudget()" style="height:42px;padding:0 18px;border-radius:10px;border:none;background:var(--acc);color:#fff;font-size:12px;font-weight:600;cursor:pointer">ตั้งงบ</button></div></div>`;

  html += '<div class="grid-2">';
  EXP_CATS.forEach(cat=>{
    const b=budgets[cat.id]||0;
    const sp=c.pE.filter(e=>e.category===cat.id).reduce((s,e)=>s+e.amount,0);
    const over=sp>b&&b>0;const p=b>0?(sp/b)*100:0;
    html += `<div class="card" style="padding:16px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px">${cat.icon} ${cat.name}</span>${b>0?`<button onclick="deleteBudget('${cat.id}')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:10px">✕</button>`:''}</div>`;
    if(b>0) html += `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:10px;color:var(--dim)">ใช้ไป</span><span class="mono" style="font-size:12px;font-weight:700;color:${over?'var(--red)':'var(--txt)'}">${f$(sp)}/${f$(b)}</span></div>${pbar(p,over?'var(--red)':p>80?'#F4A261':'var(--grn)',6)}<div style="font-size:10px;color:${over?'var(--red)':'var(--grn)'};font-weight:600;margin-top:4px">${over?'เกิน '+f$(sp-b)+' ฿':'เหลือ '+f$(b-sp)+' ฿'}</div>`;
    else html += '<div style="font-size:11px;color:var(--dim);text-align:center;padding:6px">ยังไม่ตั้งงบ</div>';
    html += '</div>';
  });
  return html + '</div>';
}

function renderFixed(c) {
  const fixT=fixedExp.reduce((s,f)=>s+f.amount,0);
  let html = `<div class="card mb" style="padding:16px"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div class="lbl">รายจ่ายคงที่/ประจำเดือน</div><button onclick="openFixedModal()" style="height:34px;padding:0 14px;border-radius:8px;border:none;background:var(--acc);color:#fff;font-size:11px;font-weight:600;cursor:pointer">+ เพิ่ม</button></div>`;
  html += `<div class="grid-3 mb">${[{l:'คงที่/เดือน',v:fixT,co:'var(--red)'},{l:'รายรับ',v:c.tI,co:'var(--grn)'},{l:'เหลือใช้จริง',v:c.disp,co:c.disp>0?'var(--grn)':'var(--red)'}].map(x=>`<div class="stat"><div style="font-size:9px;color:var(--dim);text-transform:uppercase;margin-bottom:4px">${x.l}</div><div class="v" style="color:${x.co}">${f$(x.v)}</div></div>`).join('')}</div>`;
  if(fixedExp.length===0) html += '<div class="center" style="padding:20px;color:var(--dim);font-size:12px">ยังไม่มีรายจ่ายประจำ</div>';
  else fixedExp.forEach(fx=>{const ct=gc(fx.category);html+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--bdr)"><div style="display:flex;align-items:center;gap:10px"><div style="width:34px;height:34px;border-radius:8px;background:${ct.color}10;display:flex;align-items:center;justify-content:center;font-size:14px">${ct.icon}</div><div><div style="font-size:12px;font-weight:600">${fx.name}</div><div style="font-size:10px;color:var(--dim)">วันที่ ${fx.dueDay} · ${ct.name}</div></div></div><div style="display:flex;align-items:center;gap:8px"><span class="mono" style="font-size:13px;font-weight:700;color:var(--red)">−${f$(fx.amount)}</span><button onclick="deleteFixed('${fx.id}')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:11px">✕</button></div></div>`;});
  return html + '</div>';
}

function renderGoals(c) {
  let html = `<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button onclick="openGoalModal()" style="height:36px;padding:0 16px;border-radius:10px;border:none;background:var(--acc);color:#fff;font-size:12px;font-weight:600;cursor:pointer">+ เพิ่มเป้าหมาย</button></div>`;
  if(goals.length===0) return html + '<div class="card center" style="padding:32px;color:var(--dim)">🎯 ยังไม่มีเป้าหมาย</div>';
  html += '<div class="grid-2">';
  goals.forEach(g=>{const p=g.target>0?Math.min((g.saved/g.target)*100,100):0;const done=g.saved>=g.target;
    html += `<div class="card" style="padding:16px;${done?'border:2px solid var(--grn)':''}"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="font-size:13px;font-weight:700">${done?'✅':'🎯'} ${g.name}</span><button onclick="deleteGoal('${g.id}')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:10px">✕</button></div><div class="center" style="margin-bottom:10px;position:relative;width:90px;height:90px;margin:0 auto 10px">${donutSVG([{v:g.saved,c:'var(--grn)'},{v:Math.max(g.target-g.saved,0),c:'var(--bdr)'}],90,8)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span class="mono" style="font-size:15px;font-weight:700;color:${done?'var(--grn)':'var(--txt)'}">${Math.round(p)}%</span></div></div><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span style="color:var(--dim)">เก็บแล้ว</span><span class="mono" style="font-weight:600;color:var(--grn)">${f$(g.saved)}</span></div><div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px"><span style="color:var(--dim)">เป้าหมาย</span><span class="mono" style="font-weight:600">${f$(g.target)}</span></div>`;
    if(!done) html += `<div style="display:flex;gap:4px">${[500,1000,5000].map(a=>`<button onclick="addToGoal('${g.id}',${a})" style="flex:1;padding:5px 0;border-radius:6px;border:1px solid var(--bdr);background:var(--crm);color:var(--sub);font-size:9px;font-weight:600;cursor:pointer">+${a>=1000?a/1000+'K':a}</button>`).join('')}</div>`;
    html += '</div>';
  });
  return html + '</div>';
}

function renderCompare(c) {
  const mx=Math.max(...c.monthly.map(m=>Math.max(m.inc,m.exp)),1);
  let html = `<div class="card mb" style="padding:16px"><div class="lbl">เปรียบเทียบ 6 เดือน</div><div style="display:flex;gap:8px;align-items:flex-end;height:160px;margin-bottom:10px">`;
  c.monthly.forEach(m=>{const hI=(m.inc/mx)*130;const hE=(m.exp/mx)*130;html+=`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px"><div style="display:flex;gap:2px;align-items:flex-end;height:140px"><div style="width:12px;height:${Math.max(hI,2)}px;background:var(--grn);border-radius:3px 3px 1px 1px;opacity:.6"></div><div style="width:12px;height:${Math.max(hE,2)}px;background:var(--red);border-radius:3px 3px 1px 1px;opacity:.6"></div></div><span style="font-size:10px;color:var(--sub)">${THM[m.pd.start.getMonth()]}</span></div>`;});
  html += `</div><div style="display:flex;gap:14px;justify-content:center">${[{l:'รายรับ',c:'var(--grn)'},{l:'รายจ่าย',c:'var(--red)'}].map(x=>`<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--sub)"><div style="width:8px;height:8px;border-radius:2px;background:${x.c};opacity:.6"></div>${x.l}</div>`).join('')}</div></div>`;

  html += '<div class="card-flat"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:var(--crm)">';
  ['เดือน','รายรับ','รายจ่าย','คงเหลือ','#'].forEach(h=>{html+=`<th style="padding:9px 14px;text-align:left;font-weight:600;color:var(--sub);font-size:9px;text-transform:uppercase;letter-spacing:.5px">${h}</th>`;});
  html += '</tr></thead><tbody>';
  c.monthly.forEach(m=>{const b=m.inc-m.exp;html+=`<tr style="border-bottom:1px solid var(--bdr)"><td style="padding:9px 14px;font-weight:600">${THM[m.pd.start.getMonth()]}</td><td class="mono" style="padding:9px 14px;color:var(--grn);font-weight:600">+${f$(m.inc)}</td><td class="mono" style="padding:9px 14px;color:var(--red);font-weight:600">−${f$(m.exp)}</td><td class="mono" style="padding:9px 14px;font-weight:700;color:${b>=0?'var(--grn)':'var(--red)'}">${b>=0?'+':'−'}${f$(b)}</td><td style="padding:9px 14px;color:var(--dim)">${m.n}</td></tr>`;});
  return html + '</tbody></table></div>';
}

function renderTax(c) {
  const yr=new Date().getFullYear();
  const yrInc=entries.filter(e=>new Date(e.date).getFullYear()===yr&&e.type==='income').reduce((s,e)=>s+e.amount,0);
  const taxD=Object.values(taxItems).reduce((s,v)=>s+(parseFloat(v)||0),0);
  const td2=60000+9000+taxD;const ti=Math.max(yrInc-td2,0);
  let tx=0,rm=ti;
  [[150000,0],[150000,.05],[200000,.1],[250000,.15],[250000,.2],[500000,.25],[1e6,.3],[Infinity,.35]].forEach(([b,r])=>{const a=Math.min(rm,b);tx+=a*r;rm-=a;});

  const TAX_ITEMS=[{id:"ins_life",name:"ประกันชีวิต",max:100000},{id:"ins_hp",name:"ประกันสุขภาพ",max:25000},{id:"ssf",name:"SSF",max:200000},{id:"rmf",name:"RMF",max:500000},{id:"pvd",name:"กองทุนสำรองฯ",max:500000},{id:"donate",name:"เงินบริจาค",max:0},{id:"home",name:"ดอกเบี้ยบ้าน",max:100000},{id:"child",name:"บุตร",max:30000},{id:"parent",name:"บิดามารดา",max:60000},{id:"ereceipt",name:"Easy E-Receipt",max:50000}];

  let html = `<div class="card mb" style="padding:16px"><div class="lbl">สรุปภาษีปี ${yr+543}</div><div class="grid-4 mb">${[{l:'รายได้ทั้งปี',v:yrInc,co:'var(--grn)'},{l:'ค่าลดหย่อน',v:td2,co:'var(--acc)'},{l:'รายได้สุทธิ',v:ti,co:'var(--txt)'},{l:'ภาษีประมาณ',v:Math.round(tx),co:'var(--red)'}].map(x=>`<div class="stat"><div style="font-size:8px;color:var(--dim);text-transform:uppercase;margin-bottom:4px">${x.l}</div><div class="v" style="font-size:16px;color:${x.co}">${f$(x.v)}</div></div>`).join('')}</div><div style="background:var(--crm);border-radius:10px;padding:10px;font-size:10px;color:var(--dim)">ℹ️ ค่าลดหย่อนส่วนตัว 60,000 + ประกันสังคม 9,000 รวมอัตโนมัติ</div></div>`;

  html += '<div class="card" style="padding:16px"><div class="lbl">ค่าลดหย่อนภาษี</div><div class="grid-2" style="gap:8px">';
  TAX_ITEMS.forEach(tc=>{const v=taxItems[tc.id]||0;html+=`<div style="background:var(--crm);border-radius:10px;padding:12px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:11px;font-weight:600">${tc.name}</span>${tc.max>0?`<span style="font-size:8px;color:var(--dim)">สูงสุด ${f$(tc.max)}</span>`:''}</div><input type="number" class="inp mono" value="${v||''}" onchange="saveTaxItem('${tc.id}',this.value)" placeholder="0" style="font-size:13px;padding:7px 10px">${tc.max>0&&v>tc.max?`<div style="font-size:9px;color:var(--red);margin-top:3px">⚠ เกินสิทธิ์</div>`:''}</div>`;});
  return html + '</div></div>';
}

function renderAnalytics(c) {
  const savR = c.tI>0?Math.round(((c.tI-c.tX)/c.tI)*100):0;
  const needs=c.pE.filter(e=>["food","transport","bills","health","insurance"].includes(e.category)).reduce((s,e)=>s+e.amount,0);
  const wants=c.pE.filter(e=>["shopping","social","education","other_expense"].includes(e.category)).reduce((s,e)=>s+e.amount,0);
  const sav=c.pE.filter(e=>e.category==="saving").reduce((s,e)=>s+e.amount,0);

  let html = '<div class="grid-2">';
  // KPI
  html += '<div class="card" style="padding:16px"><div class="lbl">KPI</div>';
  [{l:'จำนวนรายการ',v:c.pE.length,u:'รายการ'},{l:'เฉลี่ย/วัน',v:f$(c.avgD),u:'฿'},{l:'อัตราออม',v:savR+'%',u:savR>=20?'ดี ✓':'ปรับปรุง'},{l:'หมวดสูงสุด',v:c.expCatArr[0]?.name||'-',u:c.expCatArr[0]?f$(c.expCatArr[0].total)+' ฿':''}].forEach((x,i)=>{html+=`<div style="padding:10px 0;${i<3?'border-bottom:1px solid var(--bdr)':''}"><div style="display:flex;justify-content:space-between"><span style="font-size:11px;color:var(--sub)">${x.l}</span><div style="text-align:right"><div class="mono" style="font-size:12px;font-weight:700">${x.v}</div>${x.u?`<div style="font-size:9px;color:var(--dim)">${x.u}</div>`:''}</div></div></div>`;});
  html += '</div>';

  // 50/30/20
  html += '<div class="card" style="padding:16px"><div class="lbl">กฎ 50/30/20</div><div style="font-size:10px;color:var(--dim);margin-bottom:10px">จำเป็น 50% / ต้องการ 30% / ออม 20%</div>';
  [{l:'จำเป็น',p:c.tX>0?Math.round((needs/c.tX)*100):0,t:50,co:'#264653'},{l:'ต้องการ',p:c.tX>0?Math.round((wants/c.tX)*100):0,t:30,co:'#E76F51'},{l:'ออม',p:c.tX>0?Math.round((sav/c.tX)*100):0,t:20,co:'var(--grn)'}].forEach(x=>{html+=`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:11px">${x.l}</span><span class="mono" style="font-size:10px;font-weight:600">${x.p}% <span style="color:var(--dim)">/ ${x.t}%</span></span></div><div class="pbar" style="position:relative"><div style="position:absolute;left:${x.t}%;top:0;bottom:0;width:1.5px;background:var(--txt);opacity:.15"></div><div class="fill" style="width:${Math.min(x.p,100)}%;background:${x.co}"></div></div></div>`;});
  html += '</div></div>';
  return html;
}

function renderSettings() {
  return `<div style="max-width:480px">
    <div class="card mb" style="padding:16px">
      <div class="lbl">🔗 Google Apps Script URL</div>
      <div style="font-size:11px;color:var(--dim);margin-bottom:8px">ใส่ URL จาก Apps Script Deploy เพื่อเชื่อมต่อ Telegram + Google Sheets</div>
      <input id="apiUrlInput" class="inp" value="${API_URL}" placeholder="https://script.google.com/macros/s/xxx/exec" style="margin-bottom:8px">
      <button onclick="saveApiUrl()" style="width:100%;height:40px;border-radius:10px;border:none;background:var(--acc);color:#fff;font-size:13px;font-weight:600;cursor:pointer">บันทึก & เชื่อมต่อ</button>
    </div>
    <div class="card mb" style="padding:16px">
      <div class="lbl">วันที่เงินเดือนเข้า</div>
      <div style="display:flex;gap:6px">${[22,23,24,25,26,27,28].map(d=>`<button onclick="setSalaryDay(${d})" style="width:48px;height:42px;border-radius:10px;border:1px solid ${SALARY_DAY===d?'var(--acc)':'var(--bdr)'};background:${SALARY_DAY===d?'var(--acc)18':'var(--card)'};color:${SALARY_DAY===d?'var(--acc)':'var(--sub)'};font-size:15px;font-weight:600;cursor:pointer;font-family:var(--mono)">${d}</button>`).join('')}</div>
    </div>
    <div class="card mb" style="padding:16px">
      <div class="lbl">Auto-Refresh</div>
      <div style="font-size:12px;color:var(--sub)">ดึงข้อมูลใหม่ทุก <strong>${REFRESH_SEC}</strong> วินาที${lastSync?' · อัพเดทล่าสุด '+fT(lastSync):''}</div>
      <button onclick="fetchData()" style="margin-top:8px;width:100%;height:38px;border-radius:10px;border:1px solid var(--bdr);background:var(--crm);color:var(--txt);font-size:12px;font-weight:600;cursor:pointer">🔄 Refresh ตอนนี้</button>
    </div>
    <div class="card mb" style="padding:16px">
      <div class="lbl">ข้อมูล</div>
      <div style="font-size:12px;color:var(--sub)">รายการ: <strong>${entries.length}</strong> · งบ: <strong>${Object.keys(budgets).length}</strong> · เป้าหมาย: <strong>${goals.length}</strong> · ประจำ: <strong>${fixedExp.length}</strong></div>
    </div>
  </div>`;
}

// ═══ MODALS ═══
function openAddModal() {
  const cats = EXP_CATS;
  document.getElementById('modalContent').innerHTML = `
    <h2>เพิ่มรายการใหม่</h2>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button class="type-btn" id="typeExp" onclick="switchType('expense')" style="border-color:var(--red);background:var(--red)08;color:var(--red)">รายจ่าย</button>
      <button class="type-btn" id="typeInc" onclick="switchType('income')">รายรับ</button>
    </div>
    <div class="lbl">หมวดหมู่</div>
    <div id="catBtns" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px">${cats.map((c,i)=>`<button class="cat-btn ${i===0?'active':''}" onclick="selectCat('${c.id}',this)" style="${i===0?`color:${c.color};border-color:${c.color}44;background:${c.color}12`:''}">${c.icon} ${c.name}</button>`).join('')}</div>
    <div class="lbl">จำนวนเงิน (บาท)</div>
    <input id="addAmt" type="number" inputmode="decimal" class="inp inp-lg" placeholder="0" style="margin-bottom:12px">
    <div class="lbl">วันที่</div>
    <input id="addDate" type="date" class="inp" value="${new Date().toISOString().slice(0,10)}" style="margin-bottom:12px">
    <div class="lbl">หมายเหตุ</div>
    <input id="addNote" type="text" class="inp" placeholder="ไม่จำเป็น" style="margin-bottom:20px">
    <input type="hidden" id="addType" value="expense">
    <input type="hidden" id="addCat" value="food">
    <button class="btn-save" style="background:linear-gradient(135deg,var(--acc),#A07850)" onclick="submitEntry()">บันทึก</button>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function switchType(type) {
  document.getElementById('addType').value = type;
  const cats = type === 'income' ? INC_CATS : EXP_CATS;
  document.getElementById('addCat').value = cats[0].id;
  document.getElementById('typeExp').style.cssText = type==='expense'?'border-color:var(--red);background:var(--red)08;color:var(--red)':'';
  document.getElementById('typeInc').style.cssText = type==='income'?'border-color:var(--grn);background:var(--grn)08;color:var(--grn)':'';
  document.getElementById('catBtns').innerHTML = cats.map((c,i)=>`<button class="cat-btn ${i===0?'active':''}" onclick="selectCat('${c.id}',this)" style="${i===0?`color:${c.color};border-color:${c.color}44;background:${c.color}12`:''}">${c.icon} ${c.name}</button>`).join('');
}

function selectCat(id, btn) {
  document.getElementById('addCat').value = id;
  const c = gc(id);
  document.querySelectorAll('#catBtns .cat-btn').forEach(b=>{b.className='cat-btn';b.style.cssText='';});
  btn.className = 'cat-btn active';
  btn.style.cssText = `color:${c.color};border-color:${c.color}44;background:${c.color}12`;
}

async function submitEntry() {
  const amt = parseFloat(document.getElementById('addAmt').value);
  if (!amt || amt <= 0) { toast('กรุณาใส่จำนวนเงิน','err'); return; }
  await addEntry(
    document.getElementById('addType').value,
    document.getElementById('addCat').value,
    amt,
    document.getElementById('addNote').value,
    document.getElementById('addDate').value
  );
  closeModal();
}

function openEditModal(id) {
  const e = entries.find(x=>x.id===id);
  if (!e) return;
  const c = gc(e.category);
  document.getElementById('modalContent').innerHTML = `
    <h2>รายละเอียด</h2>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:var(--crm);border-radius:12px">
      <div style="width:44px;height:44px;border-radius:12px;background:${c.color}18;display:flex;align-items:center;justify-content:center;font-size:22px">${c.icon}</div>
      <div style="flex:1"><div style="font-size:15px;font-weight:700">${c.name}</div><div style="font-size:11px;color:var(--dim)">${fD(e.date)} ${fT(e.date)}${e.note?' · '+e.note:''}${e.source==='telegram'?' · 📲 Telegram':''}</div></div>
      <div class="mono" style="font-size:20px;font-weight:700;color:${e.type==='income'?'var(--grn)':'var(--txt)'}">${e.type==='income'?'+':'−'}${f$(e.amount)}</div>
    </div>
    <button onclick="if(confirm('ลบรายการนี้?')){deleteEntry('${e.id}');closeModal();}" style="width:100%;height:42px;border-radius:10px;background:#3a2020;border:1px solid #4a2a2a;color:var(--red);font-size:13px;font-weight:600;cursor:pointer">🗑 ลบรายการนี้</button>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function openGoalModal() {
  document.getElementById('modalContent').innerHTML = `
    <h2>🎯 เพิ่มเป้าหมาย</h2>
    <div class="lbl">ชื่อ</div><input id="goalName" class="inp" placeholder="เช่น เก็บเงินซื้อ MacBook" style="margin-bottom:10px">
    <div class="lbl">เป้าหมาย (฿)</div><input id="goalTarget" type="number" class="inp mono" placeholder="0" style="margin-bottom:10px">
    <div class="lbl">เก็บแล้ว (฿)</div><input id="goalSaved" type="number" class="inp mono" placeholder="0" style="margin-bottom:10px">
    <button class="btn-save" style="background:linear-gradient(135deg,var(--grn),#1B4332)" onclick="saveGoal()">บันทึก</button>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function openFixedModal() {
  document.getElementById('modalContent').innerHTML = `
    <h2>🔄 เพิ่มรายจ่ายประจำ</h2>
    <div class="lbl">ชื่อ</div><input id="fixedName" class="inp" placeholder="เช่น ผ่อนรถ, ค่าเน็ต" style="margin-bottom:10px">
    <div class="lbl">หมวด</div><select id="fixedCat" class="inp" style="margin-bottom:10px">${EXP_CATS.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}</select>
    <div class="lbl">เงิน/เดือน (฿)</div><input id="fixedAmt" type="number" class="inp mono" placeholder="0" style="margin-bottom:10px">
    <div class="lbl">วันครบกำหนด</div><input id="fixedDay" type="number" class="inp mono" value="1" min="1" max="31" style="margin-bottom:18px">
    <button class="btn-save" style="background:linear-gradient(135deg,var(--acc),#8B6B45)" onclick="saveFixed()">บันทึก</button>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; }

// ═══ DATA ACTIONS ═══
function saveBudget() {
  const cat=document.getElementById('budgetCat').value;
  const amt=parseFloat(document.getElementById('budgetAmt').value);
  if(!cat||!amt)return;
  budgets[cat]=amt; saveLocal('budgets',budgets);
  document.getElementById('budgetCat').value='';document.getElementById('budgetAmt').value='';
  toast('ตั้งงบสำเร็จ'); renderPage();
}
function deleteBudget(id) { delete budgets[id]; saveLocal('budgets',budgets); renderPage(); }

function saveGoal() {
  const n=document.getElementById('goalName').value,t=parseFloat(document.getElementById('goalTarget').value),s=parseFloat(document.getElementById('goalSaved').value)||0;
  if(!n||!t)return;
  goals.push({id:Date.now().toString(),name:n,target:t,saved:s});
  saveLocal('goals',goals); closeModal(); toast('บันทึกเป้าหมายสำเร็จ'); renderPage();
}
function deleteGoal(id) { goals=goals.filter(g=>g.id!==id); saveLocal('goals',goals); renderPage(); }
function addToGoal(id,amt) { goals=goals.map(g=>g.id===id?{...g,saved:g.saved+amt}:g); saveLocal('goals',goals); toast(`+${f$(amt)} ฿`); renderPage(); }

function saveFixed() {
  const n=document.getElementById('fixedName').value,c=document.getElementById('fixedCat').value,a=parseFloat(document.getElementById('fixedAmt').value),d=parseInt(document.getElementById('fixedDay').value)||1;
  if(!n||!a)return;
  fixedExp.push({id:Date.now().toString(),name:n,category:c,amount:a,dueDay:d});
  saveLocal('fixed',fixedExp); closeModal(); toast('บันทึกสำเร็จ'); renderPage();
}
function deleteFixed(id) { fixedExp=fixedExp.filter(f=>f.id!==id); saveLocal('fixed',fixedExp); renderPage(); }

function saveTaxItem(id,val) { taxItems[id]=parseFloat(val)||0; saveLocal('tax',taxItems); }

function saveApiUrl() {
  API_URL=document.getElementById('apiUrlInput').value.trim();
  localStorage.setItem('armfin_api',API_URL);
  toast('บันทึก URL แล้ว — กำลังเชื่อมต่อ...');
  fetchData(); startAutoRefresh();
}
function setSalaryDay(d) { SALARY_DAY=d; localStorage.setItem('armfin_sd',d); toast(`ตั้งวันที่ ${d}`); renderPage(); }

// ═══ INIT ═══
buildNav();
renderPage();
if (API_URL) { fetchData(); startAutoRefresh(); }
else { updateSyncStatus(false, 'ไปที่ ⚙ ตั้งค่า → ใส่ API URL'); }
</script>
</body>
</html>
