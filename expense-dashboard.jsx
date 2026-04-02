import { useState, useEffect, useCallback, useMemo } from "react";

const SK="armfin-v4";
const EXP_CATS=[
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
const INC_CATS=[
  {id:"salary",name:"เงินเดือน",icon:"💰",color:"#2D6A4F"},
  {id:"bonus",name:"โบนัส",icon:"🎁",color:"#40916C"},
  {id:"ot",name:"ค่าเวร/OT",icon:"⏰",color:"#52B788"},
  {id:"other_income",name:"รายได้อื่น",icon:"💎",color:"#74C69D"},
];
const ALL_CATS=[...INC_CATS,...EXP_CATS];
const cM=Object.fromEntries(ALL_CATS.map(c=>[c.id,c]));
const gc=id=>cM[id]||{id,name:id,icon:"📌",color:"#9B9B9B"};

const TAX_ITEMS=[
  {id:"ins_life",name:"ประกันชีวิต",max:100000,icon:"🛡️"},
  {id:"ins_hp",name:"ประกันสุขภาพ",max:25000,icon:"🏥"},
  {id:"ssf",name:"SSF",max:200000,icon:"📈"},
  {id:"rmf",name:"RMF",max:500000,icon:"📊"},
  {id:"pvd",name:"กองทุนสำรองฯ",max:500000,icon:"🏛️"},
  {id:"donate",name:"เงินบริจาค",max:0,icon:"🙏"},
  {id:"home",name:"ดอกเบี้ยบ้าน",max:100000,icon:"🏠"},
  {id:"child",name:"บุตร",max:30000,icon:"👶"},
  {id:"parent",name:"บิดามารดา",max:60000,icon:"👴"},
  {id:"ereceipt",name:"Easy E-Receipt",max:50000,icon:"🧾"},
];

const THM=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const THF=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const f$=n=>Math.abs(n).toLocaleString("th-TH",{maximumFractionDigits:0});
const fD=d=>{const x=new Date(d);return`${x.getDate()} ${THM[x.getMonth()]} ${x.getFullYear()+543}`;};
const fT=d=>{const x=new Date(d);return`${String(x.getHours()).padStart(2,"0")}:${String(x.getMinutes()).padStart(2,"0")}`;};
const C={bg:"#101014",card:"#1a1a22",bdr:"#2a2a35",txt:"#e8e6e1",sub:"#9a9590",dim:"#605c57",acc:"#C4956A",grn:"#5ab88a",red:"#e0675a",crm:"#22222c"};

function getPd(sd,off=0){
  const n=new Date();n.setMonth(n.getMonth()+off);
  const y=n.getFullYear(),m=n.getMonth(),d=n.getDate();
  let s,e;
  if(d>=sd){s=new Date(y,m,sd);e=new Date(y,m+1,sd-1,23,59,59);}
  else{s=new Date(y,m-1,sd);e=new Date(y,m,sd-1,23,59,59);}
  const dp=Math.max(Math.ceil((new Date()-s)/864e5),1);
  const td=Math.ceil((e-s)/864e5)+1;
  return{start:s,end:e,title:`${THF[s.getMonth()]} ${s.getFullYear()+543}`,range:`${s.getDate()} ${THM[s.getMonth()]} — ${e.getDate()} ${THM[e.getMonth()]} ${e.getFullYear()+543}`,dp,td,prog:Math.min(dp/td,1)};
}

function Donut({segs,sz=120,sw=12,children}){
  const r=(sz-sw)/2,ci=2*Math.PI*r,tot=segs.reduce((a,s)=>a+s.v,0)||1;
  let off=-ci/4;
  return(<div style={{position:"relative",width:sz,height:sz}}>
    <svg width={sz} height={sz}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#2a2a35" strokeWidth={sw}/>
    {segs.map((s,i)=>{const l=(s.v/tot)*ci;const el=<circle key={i} cx={sz/2} cy={sz/2} r={r} fill="none" stroke={s.c} strokeWidth={sw} strokeDasharray={`${l} ${ci-l}`} strokeDashoffset={-off} strokeLinecap="round" style={{transition:"all 0.6s ease"}}/>;off+=l;return el;})}</svg>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>{children}</div>
  </div>);
}

const Lbl=({children})=><div style={{fontSize:10,color:C.dim,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{children}</div>;
const Crd=({children,style})=><div style={{background:C.card,borderRadius:16,padding:20,border:`1px solid ${C.bdr}`,...style}}>{children}</div>;
const iS={width:"100%",background:C.crm,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"12px 16px",color:C.txt,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
const mono="'DM Mono',monospace";

export default function App(){
  const[D,setD]=useState({entries:[],budgets:{},goals:[],fixed:[],tax:{},sd:25});
  const[pg,setPg]=useState("overview");
  const[po,setPo]=useState(0);
  const[ml,setMl]=useState(null);
  const[ld,setLd]=useState(true);
  const[toast,setTt]=useState(null);
  const[fTy,setFTy]=useState("expense");
  const[fCt,setFCt]=useState("food");
  const[fAm,setFAm]=useState("");
  const[fNo,setFNo]=useState("");
  const[fDt,setFDt]=useState(new Date().toISOString().slice(0,10));
  const[eId,setEId]=useState(null);
  const[dId,setDId]=useState(null);
  const[gN,setGN]=useState("");const[gT,setGT]=useState("");const[gS,setGS]=useState("");const[gDl,setGDl]=useState("");
  const[xN,setXN]=useState("");const[xC,setXC]=useState("bills");const[xA,setXA]=useState("");const[xD,setXD]=useState("1");
  const[bC,setBC]=useState("");const[bA,setBA]=useState("");

  const fl=(m,t="ok")=>{setTt({m,t});setTimeout(()=>setTt(null),2800);};

  useEffect(()=>{(async()=>{try{const r=await window.storage.get(SK);if(r?.value){const d=JSON.parse(r.value);setD({entries:d.entries||[],budgets:d.budgets||{},goals:d.goals||[],fixed:d.fixed||[],tax:d.tax||{},sd:d.sd||25});}}catch(e){}setLd(false);})();},[]);

  const sv=useCallback(async(nd)=>{const d={...D,...nd,ts:Date.now()};setD(d);try{await window.storage.set(SK,JSON.stringify(d));}catch(e){}},[D]);

  const{entries,budgets,goals,fixed,tax,sd}=D;
  const pd=useMemo(()=>getPd(sd,po),[sd,po]);
  const pE=useMemo(()=>entries.filter(e=>{const d=new Date(e.date);return d>=pd.start&&d<=pd.end;}),[entries,pd]);
  const tI=useMemo(()=>pE.filter(e=>e.type==="income").reduce((s,e)=>s+e.amount,0),[pE]);
  const tX=useMemo(()=>pE.filter(e=>e.type==="expense").reduce((s,e)=>s+e.amount,0),[pE]);
  const bal=tI-tX;
  const pct=tI>0?Math.round((tX/tI)*100):0;
  const fixT=fixed.reduce((s,f)=>s+f.amount,0);
  const disp=tI-fixT;
  const avgD=pd.dp>0?Math.round(tX/pd.dp):0;

  const expCat=useMemo(()=>{const m={};pE.filter(e=>e.type==="expense").forEach(e=>{m[e.category]=(m[e.category]||0)+e.amount;});return Object.entries(m).map(([id,t])=>({...gc(id),total:t})).sort((a,b)=>b.total-a.total);},[pE]);

  const dailyD=useMemo(()=>{const days={};const diff=Math.ceil((pd.end-pd.start)/864e5)+1;for(let i=0;i<Math.min(diff,31);i++){const d=new Date(pd.start);d.setDate(d.getDate()+i);days[d.toISOString().slice(0,10)]=0;}pE.filter(e=>e.type==="expense").forEach(e=>{const k=e.date.slice(0,10);if(k in days)days[k]+=e.amount;});return Object.entries(days).map(([dt,v])=>({l:new Date(dt).getDate().toString(),v}));},[pE,pd]);

  const grouped=useMemo(()=>{const s=[...pE].sort((a,b)=>new Date(b.date)-new Date(a.date));const g={};s.forEach(e=>{const k=e.date.slice(0,10);if(!g[k])g[k]=[];g[k].push(e);});return Object.entries(g);},[pE]);

  const monthly=useMemo(()=>{const ms=[];for(let i=0;i<6;i++){const p=getPd(sd,-i);const mE=entries.filter(e=>{const d=new Date(e.date);return d>=p.start&&d<=p.end;});ms.push({pd:p,inc:mE.filter(e=>e.type==="income").reduce((s,e)=>s+e.amount,0),exp:mE.filter(e=>e.type==="expense").reduce((s,e)=>s+e.amount,0),n:mE.length});}return ms.reverse();},[entries,sd]);

  const yr=new Date().getFullYear();
  const yrInc=useMemo(()=>entries.filter(e=>new Date(e.date).getFullYear()===yr&&e.type==="income").reduce((s,e)=>s+e.amount,0),[entries,yr]);
  const taxD=Object.values(tax).reduce((s,v)=>s+(parseFloat(v)||0),0);

  const rf=()=>{setMl(null);setEId(null);setFTy("expense");setFCt("food");setFAm("");setFNo("");setFDt(new Date().toISOString().slice(0,10));};

  const doSave=async()=>{const a=parseFloat(fAm);if(!a||a<=0){fl("กรุณาใส่จำนวนเงิน","err");return;}const en={id:eId||Date.now().toString(),type:fTy,category:fCt,amount:a,note:fNo,date:new Date(fDt).toISOString(),createdAt:new Date().toISOString(),source:"web"};const nE=eId?entries.map(e=>e.id===eId?en:e):[...entries,en];await sv({entries:nE});rf();fl(eId?"แก้ไขสำเร็จ":"บันทึกสำเร็จ");};

  const doDel=async()=>{await sv({entries:entries.filter(e=>e.id!==dId)});setDId(null);rf();fl("ลบแล้ว");};
  const opEd=e=>{setEId(e.id);setFTy(e.type);setFCt(e.category);setFAm(e.amount.toString());setFNo(e.note||"");setFDt(e.date.slice(0,10));setMl("add");};

  // Bar chart
  const Bar=({data,h=100})=>{const mx=Math.max(...data.map(d=>d.v),1);const td=new Date().getDate();
    return <div style={{display:"flex",alignItems:"flex-end",gap:1,height:h}}>{data.map((d,i)=>{const ht=Math.max((d.v/mx)*100,d.v>0?5:2);const isT=parseInt(d.l)===td;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%",gap:2}}><div style={{width:"100%",maxWidth:14,height:`${ht}%`,background:isT?C.acc:d.v>0?"#3a3a45":"#2a2a35",borderRadius:"3px 3px 1px 1px",transition:"height 0.5s"}}/>{(parseInt(d.l)%5===0||isT)&&<span style={{fontSize:8,color:isT?C.acc:C.dim}}>{d.l}</span>}</div>;})}</div>;};

  // Progress bar
  const PBar=({pct:p,color,h=5})=><div style={{background:C.crm,borderRadius:h,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(p,100)}%`,height:"100%",background:color,borderRadius:h,transition:"width 0.5s",opacity:0.7}}/></div>;

  // Entry row
  const ERow=({e,onClick})=>{const c=gc(e.category);return <div onClick={onClick} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 20px",cursor:"pointer",borderBottom:`1px solid ${C.bdr}`,transition:"background 0.1s"}} onMouseEnter={ev=>ev.currentTarget.style.background=C.crm} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:10,background:c.color+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{c.icon}</div><div><div style={{fontSize:12,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,color:C.dim}}>{fD(e.date)}{e.note?` · ${e.note}`:""}{e.source==="telegram"?" 📲":""}</div></div></div><div style={{fontSize:13,fontWeight:700,fontFamily:mono,color:e.type==="income"?C.grn:C.txt}}>{e.type==="income"?"+":"−"}{f$(e.amount)}</div></div>;};

  const navs=[
    {id:"overview",label:"ภาพรวม",icon:"◎",g:1},
    {id:"transactions",label:"รายการ",icon:"☰",g:1},
    {id:"budget",label:"งบประมาณ",icon:"📐",g:2},
    {id:"fixed",label:"รายจ่ายประจำ",icon:"🔄",g:2},
    {id:"goals",label:"เป้าหมาย",icon:"🎯",g:2},
    {id:"compare",label:"เปรียบเทียบ",icon:"📊",g:2},
    {id:"tax",label:"ภาษี",icon:"📋",g:3},
    {id:"analytics",label:"วิเคราะห์",icon:"◐",g:3},
    {id:"settings",label:"ตั้งค่า",icon:"⚙",g:4},
  ];

  const titles={overview:"ภาพรวมการเงิน",transactions:"รายการทั้งหมด",budget:"งบประมาณ",fixed:"รายจ่ายประจำ",goals:"เป้าหมายการเงิน",compare:"เปรียบเทียบรายเดือน",tax:"สรุปภาษี",analytics:"วิเคราะห์การเงิน",settings:"ตั้งค่า"};

  if(ld)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}><div style={{color:C.dim}}>กำลังโหลด...</div></div>;

  // ─── MODAL: Add/Edit ───
  const AddModal=()=>ml==="add"&&(
    <div style={{position:"fixed",inset:0,background:"#000000aa",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={rf}>
      <div style={{background:C.card,borderRadius:20,padding:28,width:400,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.bdr}`,boxShadow:"0 20px 60px #000000aa"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <h2 style={{fontSize:17,fontWeight:700,fontFamily:"'DM Serif Display',serif",margin:0}}>{eId?"แก้ไขรายการ":"เพิ่มรายการใหม่"}</h2>
          <button onClick={rf} style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.bdr}`,background:C.crm,cursor:"pointer",color:C.sub}}>✕</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[["expense","รายจ่าย",C.red],["income","รายรับ",C.grn]].map(([t,l,c])=><button key={t} onClick={()=>{setFTy(t);setFCt(t==="income"?"salary":"food");}} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${fTy===t?c:C.bdr}`,background:fTy===t?c+"08":"transparent",color:fTy===t?c:C.sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
        </div>
        <Lbl>หมวดหมู่</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
          {(fTy==="income"?INC_CATS:EXP_CATS).map(c=><button key={c.id} onClick={()=>setFCt(c.id)} style={{background:fCt===c.id?c.color+"12":C.crm,color:fCt===c.id?c.color:C.sub,border:`1px solid ${fCt===c.id?c.color+"44":C.bdr}`,borderRadius:18,padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{c.icon} {c.name}</button>)}
        </div>
        <Lbl>จำนวนเงิน (บาท)</Lbl>
        <input type="number" inputMode="decimal" value={fAm} onChange={e=>setFAm(e.target.value)} placeholder="0" style={{...iS,fontSize:24,fontWeight:700,textAlign:"center",fontFamily:mono,marginBottom:12}}/>
        <Lbl>วันที่</Lbl>
        <input type="date" value={fDt} onChange={e=>setFDt(e.target.value)} style={{...iS,marginBottom:12}}/>
        <Lbl>หมายเหตุ</Lbl>
        <input type="text" value={fNo} onChange={e=>setFNo(e.target.value)} placeholder="ไม่จำเป็น" style={{...iS,marginBottom:20}}/>
        <div style={{display:"flex",gap:8}}>
          {eId&&<button onClick={()=>setDId(eId)} style={{width:44,height:44,borderRadius:10,background:"#3a2020",border:"1px solid #4a2a2a",cursor:"pointer",fontSize:15}}>🗑</button>}
          <button onClick={doSave} style={{flex:1,height:44,borderRadius:10,border:"none",background:`linear-gradient(135deg,${fTy==="income"?C.grn:C.acc},${fTy==="income"?"#1B4332":"#8B6B45"})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{eId?"บันทึกแก้ไข":"บันทึก"}</button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Plus Jakarta Sans','Noto Sans Thai',sans-serif",color:C.txt}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#3a3a45;border-radius:4px;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        input:focus,select:focus{border-color:${C.acc}!important;outline:none;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        select{-webkit-appearance:none;}
      `}</style>

      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:999,background:toast.t==="err"?"#3a2020":"#1a2a22",color:toast.t==="err"?C.red:C.grn,padding:"10px 24px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 4px 20px #00000066",border:`1px solid ${toast.t==="err"?"#4a2a2a":"#2a4a3a"}`,animation:"fadeIn 0.2s"}}>{toast.m}</div>}

      {/* SIDEBAR */}
      <div style={{width:200,background:C.card,borderRight:`1px solid ${C.bdr}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"24px 18px 20px",borderBottom:`1px solid ${C.bdr}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${C.acc},#A07850)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,fontWeight:700,fontFamily:"'DM Serif Display',serif"}}>฿</div>
            <div><div style={{fontSize:14,fontWeight:700,letterSpacing:-0.3}}>MoneyWise</div><div style={{fontSize:8,color:C.dim,letterSpacing:1.5,textTransform:"uppercase"}}>Financial Manager</div></div>
          </div>
        </div>
        <div style={{padding:"10px 8px",flex:1}}>
          {navs.map((n,i)=><div key={n.id}>
            {i>0&&navs[i-1].g!==n.g&&<div style={{height:1,background:C.bdr,margin:"6px 10px"}}/>}
            <button onClick={()=>setPg(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 10px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:pg===n.id?C.crm:"transparent",color:pg===n.id?C.txt:C.sub,fontWeight:pg===n.id?600:400,fontSize:12,fontFamily:"inherit"}}>
              <span style={{fontSize:13,width:20,textAlign:"center",opacity:pg===n.id?1:0.5}}>{n.icon}</span>{n.label}
            </button>
          </div>)}
        </div>
        <div style={{padding:"12px 18px",borderTop:`1px solid ${C.bdr}`,fontSize:10,color:C.dim}}>รอบวันที่ {sd} · {entries.length} รายการ</div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,minWidth:0,padding:"0 28px 40px"}}>
        {/* TOPBAR */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0 12px"}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,margin:0,fontFamily:"'DM Serif Display',serif"}}>{titles[pg]}</h1>
            <p style={{fontSize:11,color:C.dim,margin:"2px 0 0"}}>{pd.range}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",background:C.card,borderRadius:8,border:`1px solid ${C.bdr}`,padding:2}}>
              <button onClick={()=>setPo(p=>p-1)} style={{width:28,height:28,border:"none",background:"transparent",cursor:"pointer",borderRadius:6,fontSize:10,color:C.sub}}>◀</button>
              {po!==0&&<button onClick={()=>setPo(0)} style={{height:28,border:"none",background:C.crm,cursor:"pointer",borderRadius:6,fontSize:10,color:C.acc,padding:"0 8px",fontWeight:600,fontFamily:"inherit"}}>วันนี้</button>}
              <button onClick={()=>setPo(p=>p+1)} style={{width:28,height:28,border:"none",background:"transparent",cursor:"pointer",borderRadius:6,fontSize:10,color:C.sub}}>▶</button>
            </div>
            <button onClick={()=>{rf();setMl("add");}} style={{height:36,padding:"0 16px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.acc},#A07850)`,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:14,fontWeight:300}}>+</span>เพิ่มรายการ
            </button>
          </div>
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {pg==="overview"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
            {[{l:"รายรับ",v:tI,c:C.grn},{l:"รายจ่าย",v:tX,c:C.red},{l:"คงเหลือ",v:Math.abs(bal),c:bal>=0?C.grn:C.red}].map((x,i)=><Crd key={i} style={{padding:16}}><Lbl>{x.l}</Lbl><span style={{fontSize:22,fontWeight:700,color:x.c,fontFamily:mono}}>{f$(x.v)}</span><span style={{fontSize:11,color:C.dim,marginLeft:3}}>฿</span></Crd>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <Crd style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Lbl>สถานะรอบเดือน</Lbl><span style={{fontSize:10,color:C.acc,fontWeight:600}}>วันที่ {pd.dp}/{pd.td}</span></div>
              <PBar pct={pd.prog*100} color={C.acc} h={7}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
                <div><div style={{fontSize:9,color:C.dim,textTransform:"uppercase",marginBottom:3}}>เฉลี่ย/วัน</div><div style={{fontSize:17,fontWeight:700,fontFamily:mono}}>{f$(avgD)}</div></div>
                <div><div style={{fontSize:9,color:C.dim,textTransform:"uppercase",marginBottom:3}}>เหลือใช้จริง</div><div style={{fontSize:17,fontWeight:700,fontFamily:mono,color:disp>0?C.grn:C.red}}>{f$(disp)}</div></div>
              </div>
            </Crd>
            <Crd style={{padding:16}}>
              <Lbl>สัดส่วนรายจ่าย</Lbl>
              {expCat.length>0?<div style={{display:"flex",gap:14,alignItems:"center"}}>
                <Donut segs={expCat.map(c=>({v:c.total,c:c.color}))} sz={100} sw={10}><div style={{fontSize:16,fontWeight:700,fontFamily:mono}}>{pct}%</div></Donut>
                <div>{expCat.slice(0,4).map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><div style={{width:6,height:6,borderRadius:"50%",background:c.color}}/><span style={{fontSize:10,color:C.sub,flex:1}}>{c.name}</span><span style={{fontSize:10,fontWeight:600,fontFamily:mono}}>{f$(c.total)}</span></div>)}</div>
              </div>:<div style={{textAlign:"center",padding:16,color:C.dim,fontSize:12}}>ยังไม่มีข้อมูล</div>}
            </Crd>
          </div>
          {Object.keys(budgets).length>0&&<Crd style={{padding:16,marginBottom:14}}>
            <Lbl>สถานะงบประมาณ</Lbl>
            {Object.entries(budgets).slice(0,3).map(([cid,b])=>{const c=gc(cid);const sp=pE.filter(e=>e.category===cid).reduce((s,e)=>s+e.amount,0);const over=sp>b;
              return <div key={cid} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11}}>{c.icon} {c.name}</span><span style={{fontSize:10,fontWeight:600,fontFamily:mono,color:over?C.red:C.sub}}>{f$(sp)}/{f$(b)}</span></div><PBar pct={b>0?(sp/b)*100:0} color={over?C.red:sp/b>0.8?"#F4A261":C.grn}/>{over&&<div style={{fontSize:9,color:C.red}}>⚠ เกินงบ {f$(sp-b)} ฿</div>}</div>;})}
            <button onClick={()=>setPg("budget")} style={{background:"none",border:"none",color:C.acc,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ดูงบทั้งหมด →</button>
          </Crd>}
          {goals.length>0&&<Crd style={{padding:16,marginBottom:14}}>
            <Lbl>เป้าหมายการเงิน</Lbl>
            {goals.slice(0,2).map(g=>{const p=g.target>0?Math.min((g.saved/g.target)*100,100):0;return <div key={g.id} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11}}>🎯 {g.name}</span><span style={{fontSize:10,fontWeight:600,fontFamily:mono,color:C.grn}}>{f$(g.saved)}/{f$(g.target)}</span></div><PBar pct={p} color={C.grn}/></div>;})}
            <button onClick={()=>setPg("goals")} style={{background:"none",border:"none",color:C.acc,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ดูทั้งหมด →</button>
          </Crd>}
          <Crd style={{padding:16,marginBottom:14}}><Lbl>รายจ่ายรายวัน</Lbl>{dailyD.length>0?<Bar data={dailyD}/>:<div style={{textAlign:"center",padding:16,color:C.dim,fontSize:12}}>ยังไม่มีข้อมูล</div>}</Crd>
          <Crd style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 20px 6px"}}><Lbl>รายการล่าสุด</Lbl>{pE.length>4&&<button onClick={()=>setPg("transactions")} style={{background:"none",border:"none",color:C.acc,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ดูทั้งหมด →</button>}</div>
            {pE.length===0?<div style={{textAlign:"center",padding:"20px 20px 28px",color:C.dim,fontSize:13}}>📭 ยังไม่มีรายการ</div>
            :[...pE].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4).map(e=><ERow key={e.id} e={e} onClick={()=>opEd(e)}/>)}
          </Crd>
        </>}

        {/* ═══ TRANSACTIONS ═══ */}
        {pg==="transactions"&&<Crd style={{padding:0,overflow:"hidden"}}>
          {pE.length===0?<div style={{textAlign:"center",padding:60,color:C.dim}}>📭 ยังไม่มีรายการ</div>
          :grouped.map(([dk,items])=><div key={dk}>
            <div style={{padding:"8px 20px",background:C.crm,borderBottom:`1px solid ${C.bdr}`,fontSize:12,fontWeight:600}}>{fD(dk)}</div>
            {items.map(e=><ERow key={e.id} e={e} onClick={()=>opEd(e)}/>)}
          </div>)}
        </Crd>}

        {/* ═══ BUDGET ═══ */}
        {pg==="budget"&&<>
          <Crd style={{marginBottom:14,padding:16}}>
            <Lbl>ตั้งงบประมาณ</Lbl>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <select value={bC} onChange={e=>setBC(e.target.value)} style={{...iS,flex:1,minWidth:120,padding:"9px 12px"}}><option value="">เลือกหมวด...</option>{EXP_CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
              <input type="number" value={bA} onChange={e=>setBA(e.target.value)} placeholder="งบ/เดือน" style={{...iS,flex:1,minWidth:100,fontFamily:mono,padding:"9px 12px"}}/>
              <button onClick={async()=>{if(!bC||!bA)return;await sv({budgets:{...budgets,[bC]:parseFloat(bA)}});setBC("");setBA("");fl("ตั้งงบสำเร็จ");}} style={{height:42,padding:"0 18px",borderRadius:10,border:"none",background:C.acc,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ตั้งงบ</button>
            </div>
          </Crd>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {EXP_CATS.map(cat=>{const b=budgets[cat.id]||0;const sp=pE.filter(e=>e.category===cat.id).reduce((s,e)=>s+e.amount,0);const over=sp>b&&b>0;const p=b>0?(sp/b)*100:0;
              return <Crd key={cat.id} style={{padding:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13}}>{cat.icon} {cat.name}</span>{b>0&&<button onClick={async()=>{const nb={...budgets};delete nb[cat.id];await sv({budgets:nb});}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:10}}>✕</button>}</div>
                {b>0?<><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:C.dim}}>ใช้ไป</span><span style={{fontSize:12,fontWeight:700,fontFamily:mono,color:over?C.red:C.txt}}>{f$(sp)}/{f$(b)}</span></div><PBar pct={p} color={over?C.red:p>80?"#F4A261":C.grn} h={6}/><div style={{fontSize:10,color:over?C.red:C.grn,fontWeight:600,marginTop:4}}>{over?`เกิน ${f$(sp-b)} ฿`:`เหลือ ${f$(b-sp)} ฿`}</div></>
                :<div style={{fontSize:11,color:C.dim,textAlign:"center",padding:6}}>ยังไม่ตั้งงบ</div>}
              </Crd>;})}
          </div>
        </>}

        {/* ═══ FIXED EXPENSES ═══ */}
        {pg==="fixed"&&<>
          <Crd style={{marginBottom:14,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><Lbl>รายจ่ายคงที่/ประจำเดือน</Lbl><button onClick={()=>setMl("addFixed")} style={{height:34,padding:"0 14px",borderRadius:8,border:"none",background:C.acc,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ เพิ่ม</button></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              {[{l:"คงที่/เดือน",v:fixT,c:C.red},{l:"รายรับ",v:tI,c:C.grn},{l:"เหลือใช้จริง",v:disp,c:disp>0?C.grn:C.red}].map((x,i)=><div key={i} style={{background:C.crm,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:9,color:C.dim,textTransform:"uppercase",marginBottom:4}}>{x.l}</div><div style={{fontSize:18,fontWeight:700,fontFamily:mono,color:x.c}}>{f$(x.v)}</div></div>)}
            </div>
            {fixed.length===0?<div style={{textAlign:"center",padding:20,color:C.dim,fontSize:12}}>ยังไม่มีรายจ่ายประจำ</div>
            :fixed.map(fx=>{const c=gc(fx.category);return <div key={fx.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bdr}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:8,background:c.color+"10",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{c.icon}</div><div><div style={{fontSize:12,fontWeight:600}}>{fx.name}</div><div style={{fontSize:10,color:C.dim}}>วันที่ {fx.dueDay} · {c.name}</div></div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:700,fontFamily:mono,color:C.red}}>−{f$(fx.amount)}</span><button onClick={async()=>{await sv({fixed:fixed.filter(f=>f.id!==fx.id)});fl("ลบแล้ว");}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:11}}>✕</button></div>
            </div>;})}
          </Crd>
          {tX>0&&<Crd style={{padding:16}}><Lbl>คงที่ vs ผันแปร</Lbl>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <Donut segs={[{v:fixT,c:"#3D405B"},{v:Math.max(tX-fixT,0),c:"#F4A261"}]} sz={100} sw={10}><div style={{fontSize:14,fontWeight:700,fontFamily:mono}}>{tX>0?Math.round((fixT/tX)*100):0}%</div></Donut>
              <div>{[{l:"คงที่",v:fixT,c:"#3D405B"},{l:"ผันแปร",v:Math.max(tX-fixT,0),c:"#F4A261"}].map((x,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><div style={{width:8,height:8,borderRadius:"50%",background:x.c}}/><span style={{fontSize:11,color:C.sub,marginRight:6}}>{x.l}</span><span style={{fontSize:11,fontWeight:600,fontFamily:mono}}>{f$(x.v)} ฿</span></div>)}</div>
            </div>
          </Crd>}
        </>}

        {/* ═══ GOALS ═══ */}
        {pg==="goals"&&<>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <button onClick={()=>{setGN("");setGT("");setGS("");setGDl("");setMl("addGoal");}} style={{height:36,padding:"0 16px",borderRadius:10,border:"none",background:C.acc,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ เพิ่มเป้าหมาย</button>
          </div>
          {goals.length===0?<Crd><div style={{textAlign:"center",padding:32,color:C.dim}}>🎯 ยังไม่มีเป้าหมาย<br/><span style={{fontSize:11}}>เช่น เก็บเงินซื้อ MacBook, กองทุนฉุกเฉิน</span></div></Crd>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {goals.map(g=>{const p=g.target>0?Math.min((g.saved/g.target)*100,100):0;const done=g.saved>=g.target;
              return <Crd key={g.id} style={{padding:16,border:done?`2px solid ${C.grn}`:`1px solid ${C.bdr}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:700}}>{done?"✅":"🎯"} {g.name}</span>
                  <button onClick={async()=>{await sv({goals:goals.filter(x=>x.id!==g.id)});}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:10}}>✕</button>
                </div>
                <div style={{textAlign:"center",marginBottom:10}}>
                  <Donut segs={[{v:g.saved,c:C.grn},{v:Math.max(g.target-g.saved,0),c:"#2a2a35"}]} sz={90} sw={8}><div style={{fontSize:15,fontWeight:700,fontFamily:mono,color:done?C.grn:C.txt}}>{Math.round(p)}%</div></Donut>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:C.dim}}>เก็บแล้ว</span><span style={{fontWeight:600,fontFamily:mono,color:C.grn}}>{f$(g.saved)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:8}}><span style={{color:C.dim}}>เป้าหมาย</span><span style={{fontWeight:600,fontFamily:mono}}>{f$(g.target)}</span></div>
                {!done&&<div style={{display:"flex",gap:4}}>{[500,1000,5000].map(a=><button key={a} onClick={async()=>{await sv({goals:goals.map(x=>x.id===g.id?{...x,saved:x.saved+a}:x)});fl(`+${f$(a)} ฿`);}} style={{flex:1,padding:"5px 0",borderRadius:6,border:`1px solid ${C.bdr}`,background:C.crm,color:C.sub,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+{a>=1000?`${a/1000}K`:a}</button>)}</div>}
              </Crd>;})}
          </div>}
        </>}

        {/* ═══ COMPARE ═══ */}
        {pg==="compare"&&<>
          <Crd style={{padding:16,marginBottom:14}}>
            <Lbl>เปรียบเทียบ 6 เดือน</Lbl>
            <div style={{display:"flex",gap:8,alignItems:"flex-end",height:160,marginBottom:10}}>
              {monthly.map((m,i)=>{const mx=Math.max(...monthly.map(x=>Math.max(x.inc,x.exp)),1);const hI=(m.inc/mx)*130;const hE=(m.exp/mx)*130;
                return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:140}}>
                    <div style={{width:12,height:Math.max(hI,2),background:C.grn,borderRadius:"3px 3px 1px 1px",opacity:0.6,transition:"height 0.5s"}}/>
                    <div style={{width:12,height:Math.max(hE,2),background:C.red,borderRadius:"3px 3px 1px 1px",opacity:0.6,transition:"height 0.5s"}}/>
                  </div>
                  <span style={{fontSize:10,color:C.sub}}>{THM[m.pd.start.getMonth()]}</span>
                </div>;})}
            </div>
            <div style={{display:"flex",gap:14,justifyContent:"center"}}>{[{l:"รายรับ",c:C.grn},{l:"รายจ่าย",c:C.red}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.sub}}><div style={{width:8,height:8,borderRadius:2,background:x.c,opacity:0.6}}/>{x.l}</div>)}</div>
          </Crd>
          <Crd style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:C.crm}}>{["เดือน","รายรับ","รายจ่าย","คงเหลือ","#"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontWeight:600,color:C.sub,fontSize:9,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>)}</tr></thead>
              <tbody>{monthly.map((m,i)=><tr key={i} style={{borderBottom:`1px solid ${C.bdr}`}}>
                <td style={{padding:"9px 14px",fontWeight:600}}>{THM[m.pd.start.getMonth()]}</td>
                <td style={{padding:"9px 14px",fontFamily:mono,color:C.grn,fontWeight:600}}>+{f$(m.inc)}</td>
                <td style={{padding:"9px 14px",fontFamily:mono,color:C.red,fontWeight:600}}>−{f$(m.exp)}</td>
                <td style={{padding:"9px 14px",fontFamily:mono,fontWeight:700,color:m.inc-m.exp>=0?C.grn:C.red}}>{m.inc-m.exp>=0?"+":"−"}{f$(m.inc-m.exp)}</td>
                <td style={{padding:"9px 14px",color:C.dim}}>{m.n}</td>
              </tr>)}</tbody>
            </table>
          </Crd>
        </>}

        {/* ═══ TAX ═══ */}
        {pg==="tax"&&<>{(()=>{const p=60000,s=9000,td2=p+s+taxD;const ti=Math.max(yrInc-td2,0);let tx=0,rm=ti;[[150000,0],[150000,.05],[200000,.1],[250000,.15],[250000,.2],[500000,.25],[1e6,.3],[Infinity,.35]].forEach(([b,r])=>{const a=Math.min(rm,b);tx+=a*r;rm-=a;});
          return <>
            <Crd style={{padding:16,marginBottom:14}}>
              <Lbl>สรุปภาษีปี {yr+543}</Lbl>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
                {[{l:"รายได้ทั้งปี",v:yrInc,c:C.grn},{l:"ค่าลดหย่อน",v:td2,c:C.acc},{l:"รายได้สุทธิ",v:ti,c:C.txt},{l:"ภาษีประมาณ",v:Math.round(tx),c:C.red}].map((x,i)=><div key={i} style={{background:C.crm,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:8,color:C.dim,textTransform:"uppercase",marginBottom:4}}>{x.l}</div><div style={{fontSize:16,fontWeight:700,fontFamily:mono,color:x.c}}>{f$(x.v)}</div></div>)}
              </div>
              <div style={{background:C.crm,borderRadius:10,padding:10,fontSize:10,color:C.dim}}>ℹ️ ค่าลดหย่อนส่วนตัว 60,000 + ประกันสังคม 9,000 รวมอัตโนมัติ</div>
            </Crd>
            <Crd style={{padding:16}}>
              <Lbl>ค่าลดหย่อนภาษี</Lbl>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {TAX_ITEMS.map(tc=>{const v=tax[tc.id]||0;return <div key={tc.id} style={{background:C.crm,borderRadius:10,padding:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>{tc.icon} {tc.name}</span>{tc.max>0&&<span style={{fontSize:8,color:C.dim}}>สูงสุด {f$(tc.max)}</span>}</div>
                  <input type="number" value={v||""} onChange={e=>{const nt={...tax,[tc.id]:parseFloat(e.target.value)||0};sv({tax:nt});}} placeholder="0" style={{...iS,fontSize:13,fontFamily:mono,padding:"7px 10px"}}/>
                  {tc.max>0&&v>tc.max&&<div style={{fontSize:9,color:C.red,marginTop:3}}>⚠ เกินสิทธิ์</div>}
                </div>;})}
              </div>
            </Crd>
          </>;})()}
        </>}

        {/* ═══ ANALYTICS ═══ */}
        {pg==="analytics"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Crd style={{padding:16}}>
            <Lbl>KPI</Lbl>
            {[{l:"จำนวนรายการ",v:pE.length,u:"รายการ"},{l:"เฉลี่ย/วัน",v:f$(avgD),u:"฿"},{l:"อัตราออม",v:`${tI>0?Math.round(((tI-tX)/tI)*100):0}%`,u:tI>0&&((tI-tX)/tI)>=0.2?"ดี ✓":"ปรับปรุง"},{l:"หมวดสูงสุด",v:expCat[0]?.name||"-",u:expCat[0]?`${f$(expCat[0].total)} ฿`:""}].map((x,i)=><div key={i} style={{padding:"10px 0",borderBottom:i<3?`1px solid ${C.bdr}`:"none",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.sub}}>{x.l}</span><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,fontFamily:mono}}>{x.v}</div>{x.u&&<div style={{fontSize:9,color:C.dim}}>{x.u}</div>}</div></div>)}
          </Crd>
          <Crd style={{padding:16}}>
            <Lbl>กฎ 50/30/20</Lbl>
            <div style={{fontSize:10,color:C.dim,marginBottom:10}}>จำเป็น 50% / ต้องการ 30% / ออม 20%</div>
            {(()=>{const needs=pE.filter(e=>["food","transport","bills","health","insurance"].includes(e.category)).reduce((s,e)=>s+e.amount,0);const wants=pE.filter(e=>["shopping","social","education","other_expense"].includes(e.category)).reduce((s,e)=>s+e.amount,0);const sav=pE.filter(e=>e.category==="saving").reduce((s,e)=>s+e.amount,0);
              return[{l:"จำเป็น",p:tX>0?Math.round((needs/tX)*100):0,t:50,c:"#264653"},{l:"ต้องการ",p:tX>0?Math.round((wants/tX)*100):0,t:30,c:"#E76F51"},{l:"ออม",p:tX>0?Math.round((sav/tX)*100):0,t:20,c:C.grn}].map((x,i)=><div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11}}>{x.l}</span><span style={{fontSize:10,fontWeight:600,fontFamily:mono}}>{x.p}% <span style={{color:C.dim}}>/ {x.t}%</span></span></div>
                <div style={{background:C.crm,borderRadius:3,height:5,overflow:"hidden",position:"relative"}}><div style={{position:"absolute",left:`${x.t}%`,top:0,bottom:0,width:1.5,background:C.txt,opacity:0.15}}/><div style={{width:`${Math.min(x.p,100)}%`,height:"100%",background:x.c,borderRadius:3,opacity:0.6}}/></div>
              </div>);})()}
          </Crd>
          <Crd style={{padding:16}}><Lbl>รายรับ</Lbl>
            {pE.filter(e=>e.type==="income").length>0?Object.entries(pE.filter(e=>e.type==="income").reduce((m,e)=>{m[e.category]=(m[e.category]||0)+e.amount;return m;},{})).sort((a,b)=>b[1]-a[1]).map(([id,t])=><div key={id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.bdr}`}}><span style={{fontSize:11}}>{gc(id).icon} {gc(id).name}</span><span style={{fontSize:12,fontWeight:700,color:C.grn,fontFamily:mono}}>+{f$(t)}</span></div>)
            :<div style={{textAlign:"center",padding:14,color:C.dim,fontSize:11}}>ยังไม่มี</div>}
          </Crd>
          <Crd style={{padding:16}}><Lbl>รายจ่าย</Lbl>
            {expCat.length>0?expCat.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.bdr}`}}><span style={{fontSize:11}}>{c.icon} {c.name}</span><span style={{fontSize:12,fontWeight:700,color:C.red,fontFamily:mono}}>−{f$(c.total)}</span></div>)
            :<div style={{textAlign:"center",padding:14,color:C.dim,fontSize:11}}>ยังไม่มี</div>}
          </Crd>
        </div>}

        {/* ═══ SETTINGS ═══ */}
        {pg==="settings"&&<div style={{maxWidth:480}}>
          <Crd style={{padding:16,marginBottom:14}}>
            <Lbl>วันที่เงินเดือนเข้า</Lbl>
            <div style={{display:"flex",gap:6}}>{[22,23,24,25,26,27,28].map(d=><button key={d} onClick={async()=>{await sv({sd:d});fl(`ตั้งวันที่ ${d}`);}} style={{width:48,height:42,borderRadius:10,border:`1px solid ${sd===d?C.acc:C.bdr}`,background:sd===d?C.acc+"12":C.card,color:sd===d?C.acc:C.sub,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:mono}}>{d}</button>)}</div>
          </Crd>
          <Crd style={{padding:16,marginBottom:14}}>
            <Lbl>ข้อมูลทั้งหมด</Lbl>
            <div style={{fontSize:12,color:C.sub,lineHeight:2}}>รายการ: <strong>{entries.length}</strong> · รอบนี้: <strong>{pE.length}</strong> · งบ: <strong>{Object.keys(budgets).length}</strong> · เป้าหมาย: <strong>{goals.length}</strong> · ประจำ: <strong>{fixed.length}</strong></div>
          </Crd>
          <button onClick={async()=>{if(window.confirm("ล้างข้อมูลทั้งหมด?")){await sv({entries:[],budgets:{},goals:[],fixed:[],tax:{}});fl("ล้างแล้ว");}}} style={{width:"100%",padding:"12px",borderRadius:12,background:"#2a1a1a",color:C.red,border:"1px solid #4a2a2a",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ล้างข้อมูลทั้งหมด</button>
        </div>}
      </div>

      {/* ═══ MODALS ═══ */}
      <AddModal/>

      {ml==="addGoal"&&<div style={{position:"fixed",inset:0,background:"#000000aa",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setMl(null)}>
        <div style={{background:C.card,borderRadius:20,padding:28,width:380,border:`1px solid ${C.bdr}`,boxShadow:"0 20px 60px #000000aa"}} onClick={e=>e.stopPropagation()}>
          <h2 style={{fontSize:17,fontWeight:700,fontFamily:"'DM Serif Display',serif",margin:"0 0 18px"}}>🎯 เพิ่มเป้าหมาย</h2>
          <Lbl>ชื่อ</Lbl><input value={gN} onChange={e=>setGN(e.target.value)} placeholder="เช่น เก็บเงินซื้อ MacBook" style={{...iS,marginBottom:10}}/>
          <Lbl>เป้าหมาย (฿)</Lbl><input type="number" value={gT} onChange={e=>setGT(e.target.value)} placeholder="0" style={{...iS,fontFamily:mono,marginBottom:10}}/>
          <Lbl>เก็บแล้ว (฿)</Lbl><input type="number" value={gS} onChange={e=>setGS(e.target.value)} placeholder="0" style={{...iS,fontFamily:mono,marginBottom:10}}/>
          <Lbl>กำหนด</Lbl><input type="date" value={gDl} onChange={e=>setGDl(e.target.value)} style={{...iS,marginBottom:18}}/>
          <button onClick={async()=>{if(!gN||!gT)return;await sv({goals:[...goals,{id:Date.now().toString(),name:gN,target:parseFloat(gT),saved:parseFloat(gS)||0,deadline:gDl||null}]});setMl(null);fl("บันทึกเป้าหมายสำเร็จ");}} style={{width:"100%",height:42,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.grn},#1B4332)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>บันทึก</button>
        </div>
      </div>}

      {ml==="addFixed"&&<div style={{position:"fixed",inset:0,background:"#000000aa",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setMl(null)}>
        <div style={{background:C.card,borderRadius:20,padding:28,width:380,border:`1px solid ${C.bdr}`,boxShadow:"0 20px 60px #000000aa"}} onClick={e=>e.stopPropagation()}>
          <h2 style={{fontSize:17,fontWeight:700,fontFamily:"'DM Serif Display',serif",margin:"0 0 18px"}}>🔄 เพิ่มรายจ่ายประจำ</h2>
          <Lbl>ชื่อ</Lbl><input value={xN} onChange={e=>setXN(e.target.value)} placeholder="เช่น ผ่อนรถ, ค่าเน็ต" style={{...iS,marginBottom:10}}/>
          <Lbl>หมวด</Lbl><select value={xC} onChange={e=>setXC(e.target.value)} style={{...iS,marginBottom:10}}>{EXP_CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
          <Lbl>เงิน/เดือน (฿)</Lbl><input type="number" value={xA} onChange={e=>setXA(e.target.value)} placeholder="0" style={{...iS,fontFamily:mono,marginBottom:10}}/>
          <Lbl>วันครบกำหนด</Lbl><input type="number" value={xD} onChange={e=>setXD(e.target.value)} min="1" max="31" style={{...iS,fontFamily:mono,marginBottom:18}}/>
          <button onClick={async()=>{if(!xN||!xA)return;await sv({fixed:[...fixed,{id:Date.now().toString(),name:xN,category:xC,amount:parseFloat(xA),dueDay:parseInt(xD)||1}]});setXN("");setXA("");setMl(null);fl("บันทึกสำเร็จ");}} style={{width:"100%",height:42,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.acc},#8B6B45)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>บันทึก</button>
        </div>
      </div>}

      {ml==="telegram"&&<div style={{position:"fixed",inset:0,background:"#000000aa",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setMl(null)}>
        <div style={{background:C.card,borderRadius:20,padding:28,width:400,maxHeight:"85vh",overflowY:"auto",border:`1px solid ${C.bdr}`,boxShadow:"0 20px 60px #000000aa"}} onClick={e=>e.stopPropagation()}>
          <h2 style={{fontSize:17,fontWeight:700,fontFamily:"'DM Serif Display',serif",margin:"0 0 14px",color:C.acc}}>📲 Telegram Bot</h2>
          {[{t:"สถาปัตยกรรม",c:<div style={{fontSize:12,color:C.sub}}>Telegram → Google Apps Script → Sheets ← Web<div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>{["ฟรี 100%","ไม่ต้อง server","24/7"].map(t=><span key={t} style={{fontSize:9,color:C.grn,background:C.grn+"10",padding:"2px 6px",borderRadius:4,fontWeight:600}}>✓ {t}</span>)}</div></div>},
          {t:"ตัวอย่าง",c:<>{["กาแฟ 65","อาหาร ข้าวมันไก่ 50","น้ำมัน 800","เงินเดือน 25000"].map(x=><div key={x} style={{fontFamily:mono,fontSize:12,color:C.grn,marginBottom:2}}>{x}</div>)}</>},
          {t:"ขั้นตอน",c:<div style={{fontSize:11,color:C.sub,lineHeight:2}}>1. สร้าง Bot @BotFather<br/>2. สร้าง Google Sheet<br/>3. วาง code ใน Apps Script<br/>4. Deploy → Webhook<br/>5. เสร็จ!</div>}].map((s,i)=><div key={i} style={{background:C.crm,borderRadius:10,padding:14,marginBottom:8}}><div style={{fontSize:9,color:C.dim,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{s.t}</div>{s.c}</div>)}
        </div>
      </div>}

      {dId&&<div style={{position:"fixed",inset:0,background:"#000000bb",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDId(null)}>
        <div style={{background:C.card,borderRadius:20,padding:28,width:300,textAlign:"center",border:`1px solid ${C.bdr}`,boxShadow:"0 16px 60px #000000aa"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:32,marginBottom:8}}>🗑</div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:18,fontFamily:"'DM Serif Display',serif"}}>ลบรายการนี้?</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setDId(null)} style={{flex:1,padding:"10px",borderRadius:10,background:C.crm,border:`1px solid ${C.bdr}`,color:C.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>ยกเลิก</button>
            <button onClick={doDel} style={{flex:1,padding:"10px",borderRadius:10,background:C.red,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>ลบ</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
