(function(){
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const C={arms:"var(--p-red)",chest:"var(--p-blue)",cable:"var(--p-yellow)",quad:"var(--p-green)",rest:"var(--p-grey)"};
const E=(n,t,u)=>({id:n.toLowerCase().replace(/[^a-z0-9]+/g,"-"),n,t:t||"3 × 10",u:u||"reps"});
const ABS1=["Abs",[E("Crunch","3 × 20"),E("Side crunch","3 × 15 / side"),E("Leg lifts","3 × 12"),E("Inverted crunch","3 × 12"),E("Bicycles","3 × 20")]];
const ABS2=["Abs",[E("Crunch","3 × 20"),E("Side crunch","3 × 15 / side"),E("Plank","3 × 45 s","sec"),E("Inverted crunch","3 × 12"),E("Bicycles","3 × 20")]];
const ABS3=["Abs",[E("Cable crunch","3 × 15"),E("Side crunch","3 × 15 / side"),E("Spiderman plank","3 × 10 / side"),E("Inverted crunch","3 × 12"),E("Bicycles","3 × 20")]];
const QUADS=(x)=>["Quads",[E("Squat","4 × 8"),...(x?[E("DB squat","3 × 12"),E("Leg extension","3 × 12"),E("Leg curl","3 × 12")]:[]),E("Lunge","3 × 10 / leg"),E("Single-leg balance","3 × 30 s","sec"),E("Calf raise","3 × 20")]];
const PLAN={
 0:{t:"Arms & Abs",k:"arms",sub:"Arms A · Abs 1",g:[
   ["Biceps",[E("Barbell curl"),E("Concentration curl","3 × 10 / arm")]],
   ["Triceps",[E("Overhead extension"),E("Skull crushers")]],
   ["Shoulders",[E("Lateral raise","3 × 12"),E("DB military press"),E("Mace 360s","3 × 10 / side")]],ABS1]},
 1:{t:"Chest & Back",k:"chest",sub:"Bodyweight + bands",g:[
   ["Chest",[E("Pushups","3 × max"),E("Wide pushups","3 × max"),E("Decline pushups","3 × max"),E("Dips","3 × max"),E("Flys","3 × 12")]],
   ["Back",[E("Pullups","3 × max"),E("Band row","3 × 15"),E("TRX row","3 × 12"),E("DB row","3 × 10 / arm"),E("Band pull-apart","3 × 20")]]]},
 2:{t:"Arms & Abs + Quads",k:"arms",sub:"Arms B · Abs 2 · Legs 1",g:[
   ["Biceps",[E("Band curl","3 × 15"),E("Bar curl")]],
   ["Triceps",[E("Band pushdown","3 × 15"),E("Bar extension")]],
   ["Shoulders",[E("Shrugs","3 × 12"),E("DB military press")]],ABS2,QUADS(false)]},
 3:{t:"Chest & Back",k:"chest",sub:"Heavy day",g:[
   ["Chest",[E("Bench press","4 × 6"),E("Incline pushups","3 × max"),E("Dips","3 × max"),E("DB flys","3 × 12")]],
   ["Back",[E("Barbell row","4 × 8"),E("Pullups","3 × max"),E("DB row","3 × 10 / arm"),E("Band pull-apart","3 × 20")]]]},
 4:{t:"Cables",k:"cable",sub:"Cable stack · Abs 3",g:[
   ["Push / Pull",[E("Cable crossover","3 × 12"),E("Seated cable row","3 × 12"),E("Lat pulldown","3 × 10"),E("Face pull","3 × 15")]],
   ["Arms",[E("Cable curl","3 × 12"),E("Tricep pushdown","3 × 12")]],ABS3]},
 5:{t:"Quads",k:"quad",sub:"Legs 2 · max test",g:[QUADS(true)]},
 6:{t:"Rest",k:"rest",sub:"Off",g:[]}
};
// Dropdown choices per muscle group, split by equipment: bw = bodyweight, mach = machine/cable, free = free weight, band = bands
const KINDS=[["bw","Bodyweight"],["mach","Machine"],["free","Free weight"],["band","Bands"]];
const POOLS={
 "Biceps":{bw:["Chin-ups","Close-grip chin-ups","TRX curl"],
   mach:["Cable curl","Machine bicep curl","Machine preacher curl","Rope hammer curl","High cable curl"],
   free:["Barbell curl","Bar curl","EZ-bar curl","DB curl","Hammer curl","Concentration curl","Preacher curl","Incline DB curl","Mace curl"],
   band:["Band curl","Band hammer curl"]},
 "Triceps":{bw:["Dips","Bench dips","Diamond pushups","TRX tricep extension"],
   mach:["Tricep pushdown","Rope pushdown","Rope overhead extension","Machine dip","Machine tricep extension"],
   free:["Overhead extension","Skull crushers","Bar extension","Close-grip bench","Kickbacks","DB overhead extension"],
   band:["Band pushdown","Band overhead extension"]},
 "Shoulders":{bw:["Pike pushups","Handstand pushups","Wall walks","Plank shoulder taps"],
   mach:["Machine shoulder press","Smith machine press","Cable lateral raise","Reverse pec deck","Cable face pull"],
   free:["DB military press","Barbell overhead press","Arnold press","Lateral raise","Front raise","Rear delt fly","Upright row","Shrugs","Mace 360s","Mace 10-to-2"],
   band:["Band face pull","Band lateral raise","Band overhead press"]},
 "Abs":{bw:["Crunch","Side crunch","Leg lifts","Inverted crunch","Bicycles","Plank","Side plank","Spiderman plank","Hanging knee raise","Mountain climbers","Ab wheel","Dead bug","V-ups"],
   mach:["Cable crunch","Ab crunch machine","Captain's chair leg raise","Cable woodchop","Cable Pallof press"],
   free:["Russian twist","Weighted crunch","DB side bend","Weighted plank","Landmine twist"],
   band:["Band Pallof press","Band woodchop"]},
 "Chest":{bw:["Pushups","Wide pushups","Decline pushups","Incline pushups","Diamond pushups","Archer pushups","Dips"],
   mach:["Machine chest press","Pec deck","Smith machine bench","Cable crossover","Low-to-high cable fly"],
   free:["Bench press","Incline bench","DB bench","Incline DB bench","Flys","DB flys","DB pullover"],
   band:["Band chest press","Band fly"]},
 "Back":{bw:["Pullups","Chin-ups","TRX row","Inverted row","Superman"],
   mach:["Lat pulldown","Seated cable row","Single-arm cable row","Straight-arm pulldown","Assisted pullup machine","T-bar row machine"],
   free:["DB row","Barbell row","Pendlay row","Deadlift","Good mornings","Kettlebell swing"],
   band:["Band row","Band pull-apart","Band lat pulldown"]},
 "Quads":{bw:["Air squat","Jump squat","Pistol squat","Lunge","Walking lunge","Step-ups","Bulgarian split squat","Single-leg balance","Wall sit","Calf raise"],
   mach:["Leg press","Hack squat","Smith machine squat","Leg extension","Leg curl","Seated calf raise"],
   free:["Squat","Front squat","DB squat","Goblet squat","DB lunge","Romanian deadlift","DB calf raise"],
   band:["Band squat","Band leg curl","Banded lateral walk"]},
 "Push / Pull":{bw:["Pushups","Pullups","Inverted row","Dips"],
   mach:["Cable crossover","Cable chest press","Low-to-high cable fly","Seated cable row","Lat pulldown","Straight-arm pulldown","Face pull","Single-arm cable row","Cable lateral raise","Cable upright row","Cable shrug","Machine chest press"],
   free:["Bench press","DB bench","DB row","Barbell row"],
   band:["Band chest press","Band row","Band face pull"]},
 "Arms":{bw:["Chin-ups","Dips","Bench dips","Diamond pushups"],
   mach:["Cable curl","Rope hammer curl","High cable curl","Tricep pushdown","Rope pushdown","Overhead cable extension","Single-arm pushdown","Machine preacher curl"],
   free:["Barbell curl","DB curl","Hammer curl","Skull crushers","Overhead extension"],
   band:["Band curl","Band pushdown"]}
};
// [[label,[names]]...] for one group's dropdown; any plan default not in the pool lands in "Other"
function opts(gn,list){const pool=POOLS[gn]||{},seen=new Set(),out=[];
  for(const [k,l] of KINDS){const ns=(pool[k]||[]).filter(n=>!seen.has(n)&&seen.add(n));if(ns.length)out.push([l,ns])}
  const rest=list.map(e=>e.n).filter(n=>!seen.has(n)&&seen.add(n));if(rest.length)out.push(["Other",rest]);
  return out}
const exName=(e,x)=>(x&&x.n)||e.n;
const MAXES=[["bench","Bench"],["row","Back row"],["curl","Curl"],["tripd","Tri pushdown"],["mp","Military press"],["trap","Trap shrug"],["dl","Deadlift"],["legce","Leg curl/ext"],["pushups","Pushups"],["pullups","Pullups"]];
const BW=new Set(["pushups","pullups"]);
const HAB=[["noalc","No alcohol"],["nosweets","No sweets"],["nocoffee","No coffee"]];
const CARDIO=["—","Walk","HIIT run","Run 5k","Heavy bag","Clear land"];

const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const parse=s=>{const[a,b,c]=s.split("-").map(Number);return new Date(a,b-1,c)};
const sunday=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-x.getDay());return x};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const fmt=d=>d.toLocaleDateString(undefined,{month:"short",day:"numeric"});
const e1rm=(w,r)=>(!w||!r)?0:(r===1?w:Math.round(w*(1+r/30)));
const $=id=>document.getElementById(id);

let weeks={}; const today=new Date(); let wk=iso(sunday(today)); let sel=today.getDay();
let sb=null, uid=null, dirty=new Set(), timer=null, syncing=false;

try{const s=localStorage.getItem("zeo-weeks");if(s)weeks=JSON.parse(s)||{}}catch(e){}
try{const s=localStorage.getItem("zeo-dirty");if(s)dirty=new Set(JSON.parse(s)||[])}catch(e){}

function W(k){k=k||wk;if(!weeks[k])weeks[k]={start:k,days:{},maxes:{},notes:{}};const w=weeks[k];w.days=w.days||{};w.maxes=w.maxes||{};w.notes=w.notes||{};return w}
function D(i){const w=W();w.days[i]=w.days[i]||{ex:{},hab:{}};w.days[i].ex=w.days[i].ex||{};w.days[i].hab=w.days[i].hab||{};return w.days[i]}
// The workout done on day i: the day's own pick (d.plan, a PLAN key) or the scheduled one
function planOf(w,i){const d=w&&w.days&&w.days[i];const p=d&&d.plan;return PLAN[p!=null&&PLAN[p]?p:i]}
function allEx(i,w){return planOf(w||W(),i).g.flatMap(g=>g[1])}
function dayPct(w,i){const ex=allEx(i,w);if(!ex.length)return null;const d=(w.days||{})[i];if(!d||!d.ex)return 0;return Math.round(100*ex.filter(e=>d.ex[e.id]&&d.ex[e.id].done).length/ex.length)}
// Only exercises in the day's current workout count, so entries left from a workout you switched away from don't inflate volume
function dayVol(w,i){const d=(w.days||{})[i];if(!d||!d.ex)return 0;let v=0;for(const e of allEx(i,w)){const x=d.ex[e.id];if(x)v+=(+x.w||0)*(+x.r||0)*(+x.s||0)}return v}
function volume(w){let v=0;for(let i=0;i<7;i++)v+=dayVol(w,i);return v}

function persist(){try{localStorage.setItem("zeo-weeks",JSON.stringify(weeks));localStorage.setItem("zeo-dirty",JSON.stringify([...dirty]))}catch(e){}}
function save(k){k=k||wk;if(weeks[k])weeks[k].u=Date.now();dirty.add(k);persist();
  clearTimeout(timer);timer=setTimeout(flush,700);renderSide()}
function setStatus(t){$("status").textContent=t}
function toast(t){const el=document.createElement("div");el.className="toast";el.textContent=t;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}

function renderStrip(){
  const s=parse(wk),w=weeks[wk]||{days:{}},tIso=iso(today);
  $("wkLbl").textContent=fmt(s)+" – "+fmt(addD(s,6));
  $("strip").innerHTML=DAYS.map((n,i)=>{const p=dayPct(w,i);const d=addD(s,i);
    const pl=planOf(w,i);
    return `<button class="day ${p===100?"full":""} ${iso(d)===tIso?"istoday":""}" style="--c:${C[pl.k]}" data-i="${i}" aria-pressed="${i===sel}" aria-label="${pl.t}, ${fmt(d)}">
    <span class="dt">${d.getDate()}</span><span class="dn">${n}</span><span class="pc num">${p===null?"off":p+"%"}</span></button>`}).join("");
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function renderDay(){
  const d=D(sel),p=planOf(W(),sel),date=addD(parse(wk),sel);
  const pk=d.plan!=null&&PLAN[d.plan]?+d.plan:sel;
  const pickW=`<label class="pick">Workout <select id="plan-${sel}" data-plan aria-label="Workout for ${DAYS[sel]}">${Object.keys(PLAN).map(k=>
    `<option value="${k}" ${+k===pk?"selected":""}>${esc(PLAN[k].t)} · ${esc(PLAN[k].sub)}${+k===sel?" (scheduled)":""}</option>`).join("")}</select></label>`;
  let h=`<div class="dayhead" style="--c:${C[p.k]}"><div><span class="tag">${DAYS[sel]} · ${fmt(date)} · ${esc(p.sub)}</span><h2>${esc(p.t)}</h2></div>
   <div class="meta" id="dayMeta"></div></div>${pickW}`;
  if(!p.g.length)h+=`<div class="rest">Rest day. Log any cardio or habits below if you want the streak, or pick a workout above.</div>`;
  for(const [gn,list] of p.g){
    h+=`<div class="group"><h3>${esc(gn)}</h3><div class="ledger"><div class="ex head"><span></span><span style="text-align:left">Exercise</span><span>lb</span><span>Reps</span><span>Sets</span></div>`;
    const choices=opts(gn,list);
    for(const e of list){const x=d.ex[e.id]||{};const key=sel+"-"+e.id;const cur=exName(e,x);const custom=!!x.c;
      const ch=custom||choices.some(c=>c[1].includes(cur))?choices:[...choices,["Saved",[cur]]];
      h+=`<div class="ex ${x.done?"done":""}" data-ex="${e.id}">
      <input type="checkbox" class="chk" id="c-${key}" ${x.done?"checked":""} aria-label="Done: ${esc(cur)}">
      <div class="name"><select id="n-${key}" data-n aria-label="Exercise">${ch.map(([l,ns])=>`<optgroup label="${esc(l)}">${ns.map(n=>`<option ${!custom&&n===cur?"selected":""}>${esc(n)}</option>`).join("")}</optgroup>`).join("")}<option value="__custom" ${custom?"selected":""}>Custom…</option></select>
      <input type="text" class="custom" id="t-${key}" data-t value="${custom?esc(x.n||""):""}" placeholder="Type your exercise" aria-label="Custom exercise name" ${custom?"":"hidden"}>
      <i>${esc(e.t)}</i></div>
      <input type="number" inputmode="decimal" min="0" step="2.5" id="w-${key}" data-f="w" value="${x.w??""}" placeholder="BW" aria-label="${esc(e.n)} weight">
      <input type="number" inputmode="numeric" min="0" id="r-${key}" data-f="r" value="${x.r??""}" placeholder="${e.u==="sec"?"sec":"–"}" aria-label="${esc(e.n)} ${e.u}">
      <input type="number" inputmode="numeric" min="0" id="s-${key}" data-f="s" value="${x.s??""}" placeholder="–" aria-label="${esc(e.n)} sets"></div>`}
    h+=`</div></div>`}
  h+=`<div class="group"><h3>Cardio & habits</h3><div class="habits">
    <label class="pill">Cardio <select id="cardio-${sel}" data-h="cardio">${CARDIO.map(c=>`<option ${d.hab.cardio===c?"selected":""}>${c}</option>`).join("")}</select></label>
    ${HAB.map(([k,l])=>`<label class="pill"><input type="checkbox" id="h-${sel}-${k}" data-h="${k}" ${d.hab[k]?"checked":""}>${l}</label>`).join("")}</div></div>
    <div class="group"><h3>Notes</h3><textarea id="note-${sel}" placeholder="How it felt, what to bump next week…">${esc(W().notes[sel]||"")}</textarea></div>`;
  $("dayView").innerHTML=h;renderMeta();
}
function renderMeta(){const p=dayPct(W(),sel);const v=dayVol(W(),sel);
  const m=$("dayMeta");if(m)m.innerHTML=p===null?"":`<span class="num">${p}%</span> done · <span class="num">${v.toLocaleString()}</span> lb volume`}

function renderMaxes(){
  const w=W(),keys=Object.keys(weeks).sort(),prev=keys.filter(k=>k<wk).pop();const pw=prev?weeks[prev]:null;
  $("maxGrid").innerHTML=MAXES.map(([k,l])=>{const m=w.maxes[k]||{};const e=BW.has(k)?(+m.r||0):e1rm(+m.w,+m.r);
    const pm=pw&&pw.maxes&&pw.maxes[k];const pe=pm?(BW.has(k)?(+pm.r||0):e1rm(+pm.w,+pm.r)):0;const diff=e&&pe?e-pe:0;
    return `<div class="maxc"><label for="mw-${k}">${l}</label><div class="inp">
     ${BW.has(k)?"":`<input type="number" inputmode="decimal" id="mw-${k}" data-m="${k}" data-f="w" value="${m.w??""}" placeholder="lb" aria-label="${l} weight"><span class="x">×</span>`}
     <input type="number" inputmode="numeric" id="mr-${k}" data-m="${k}" data-f="r" value="${m.r??""}" placeholder="reps" aria-label="${l} reps"></div>
     <div class="e1 num">${e?(BW.has(k)?"Max reps "+e:"e1RM "+e+" lb"):"Not logged"}${diff?` <span class="${diff>0?"up":""}">${diff>0?"+":""}${diff}</span>`:""}</div></div>`}).join("");
}

function lastWeeks(n){const out=[];let s=parse(wk);for(let i=n-1;i>=0;i--){const k=iso(addD(s,-7*i));out.push([k,weeks[k]])}return out}
function bars(data,fmtv,unit){
  const vw=360,vh=170,pl=38,pb=22,pt=10,max=Math.max(1,...data.map(d=>d[1]));const nice=niceMax(max);
  const bw=(vw-pl-8)/data.length;let s=`<svg viewBox="0 0 ${vw} ${vh}" role="img" aria-label="${unit} by week">`;
  for(let t=0;t<=4;t++){const y=pt+(vh-pt-pb)*(1-t/4);s+=`<line x1="${pl}" x2="${vw-4}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width="1"/><text x="${pl-5}" y="${y+3}" text-anchor="end">${fmtv(nice*t/4)}</text>`}
  data.forEach((d,i)=>{const h=(vh-pt-pb)*(d[1]/nice);const x=pl+i*bw+bw*.18;const cur=d[0]===wk;
    s+=`<rect x="${x}" y="${vh-pb-h}" width="${bw*.64}" height="${Math.max(h,0)}" rx="2" fill="${cur?"var(--accent)":"var(--p-grey)"}" opacity="${cur?1:.55}"><title>${fmt(parse(d[0]))}: ${d[1].toLocaleString()} ${unit}</title></rect>`;
    if(i%2===(data.length-1)%2)s+=`<text x="${x+bw*.32}" y="${vh-6}" text-anchor="middle">${fmt(parse(d[0]))}</text>`});
  return s+"</svg>"}
function niceMax(m){const p=Math.pow(10,Math.floor(Math.log10(m)));const f=m/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p}
const kfmt=v=>v>=1000?(v/1000).toFixed(v%1000?1:0)+"k":String(Math.round(v));

function renderCharts(){
  const lw=lastWeeks(10);
  const vol=lw.map(([k,w])=>[k,w?volume(w):0]);
  $("volChart").innerHTML=vol.some(v=>v[1])?bars(vol,kfmt,"lb"):`<div class="empty">Log weight, reps and sets on any day and weekly volume shows up here.</div>`;
  const comp=lw.map(([k,w])=>[k,w?[0,1,2,3,4,5,6].filter(i=>dayPct(w,i)===100).length:0]);
  $("compChart").innerHTML=comp.some(v=>v[1])?bars(comp.map(c=>[c[0],c[1]]),v=>String(Math.round(v*10)/10),"sessions").replace(/>(\d)\.\d+</g,">$1<"):`<div class="empty">Check off every exercise on a day to count it as a full session (6 per week).</div>`;
  const lift=$("liftSel").value||"bench";const bw=BW.has(lift);
  const pts=lw.map(([k,w],i)=>{const m=w&&w.maxes&&w.maxes[lift];const v=m?(bw?(+m.r||0):e1rm(+m.w,+m.r)):0;return [k,v,i]}).filter(p=>p[1]);
  $("maxChart").innerHTML=pts.length?trend(lw,pts,bw?" reps":" lb","Estimated max by week"):`<div class="empty">Enter a weekly max for this lift to start its trend line.</div>`;
  const bpts=lw.map(([k,w],i)=>[k,bwOf(w),i]).filter(p=>p[1]);
  $("bwChart").innerHTML=bpts.length?trend(lw,bpts," lb","Body weight by week"):`<div class="empty">Log a weekly weigh-in and the trend line shows up here.</div>`;
}
// Line chart over the weeks in lw; pts are [weekKey, value, index into lw].
function trend(lw,pts,unit,label){
  const vw=360,vh=170,pl=38,pb=22,pt=12,n=lw.length;let lo=Math.min(...pts.map(p=>p[1])),hi=Math.max(...pts.map(p=>p[1]));
  const pad=Math.max(5,Math.round((hi-lo)*.2));lo=Math.max(0,Math.floor((lo-pad)/5)*5);hi=Math.ceil((hi+pad)/5)*5;
  const X=i=>pl+(vw-pl-12)*(n===1?.5:i/(n-1)),Y=v=>pt+(vh-pt-pb)*(1-(v-lo)/(hi-lo||1));
  let s=`<svg viewBox="0 0 ${vw} ${vh}" role="img" aria-label="${label}">`;
  for(let t=0;t<=4;t++){const v=lo+(hi-lo)*t/4,y=Y(v);s+=`<line x1="${pl}" x2="${vw-4}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${pl-5}" y="${y+3}" text-anchor="end">${Math.round(v)}</text>`}
  lw.forEach(([k],i)=>{if(i%3===(n-1)%3)s+=`<text x="${X(i)}" y="${vh-6}" text-anchor="middle">${fmt(parse(k))}</text>`});
  if(pts.length>1){const dpath=pts.map((p,j)=>(j?"L":"M")+X(p[2]).toFixed(1)+","+Y(p[1]).toFixed(1)).join("");
    s+=`<path d="${dpath} L${X(pts[pts.length-1][2]).toFixed(1)},${vh-pb} L${X(pts[0][2]).toFixed(1)},${vh-pb}Z" fill="var(--accent)" opacity=".12"/><path d="${dpath}" fill="none" stroke="var(--accent)" stroke-width="2"/>`}
  pts.forEach((p,j)=>{const last=j===pts.length-1;s+=`<circle cx="${X(p[2])}" cy="${Y(p[1])}" r="${last?4.5:3}" fill="${last?"var(--accent)":"var(--surface)"}" stroke="var(--accent)" stroke-width="2"><title>${fmt(parse(p[0]))}: ${p[1]}${unit}</title></circle>`;
    if(last)s+=`<text x="${Math.min(X(p[2]),vw-24)}" y="${Y(p[1])-9}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${p[1]}</text>`});
  return s+"</svg>";
}

/* body weight: one weigh-in per week, stored as w.bw (lb) so it syncs and backs up with the week */
const bwOf=w=>(w&&+w.bw)||0;
const r1=v=>Math.round(v*10)/10;
const sgn=v=>(v>0?"+":v<0?"−":"±")+Math.abs(r1(v));
function bwLog(){return Object.keys(weeks).sort().filter(k=>bwOf(weeks[k])).map(k=>[k,bwOf(weeks[k])])}
function renderBW(){const v=bwOf(weeks[wk]);$("bwIn").value=v||"";renderBWHist()}
function renderBWHist(){
  const log=bwLog(),cur=bwOf(weeks[wk]),prev=log.filter(([k])=>k<wk).pop();
  $("bwDelta").textContent=cur?(prev?sgn(cur-prev[1])+" lb vs "+fmt(parse(prev[0])):"First weigh-in"):(prev?"Last "+prev[1]+" lb, "+fmt(parse(prev[0])):"Not logged");
  if(!log.length){$("bwStats").innerHTML="";$("bwHist").innerHTML=`<div class="empty">Enter this week's weight to start your history.</div>`;return}
  const [fk,fv]=log[0],[lk,lv]=log[log.length-1],span=Math.round((parse(lk)-parse(fk))/6048e5);
  const tile=(l,v,s)=>`<div class="maxc"><label>${l}</label><div class="bwv num">${v}</div><div class="e1">${s}</div></div>`;
  $("bwStats").innerHTML=tile("Start",fv+" lb",fmt(parse(fk)))+tile("Latest",lv+" lb",fmt(parse(lk)))
    +tile("Change",log.length>1?sgn(lv-fv)+" lb":"—",span?span+" week"+(span===1?"":"s"):"One weigh-in")
    +tile("Per week",span?sgn((lv-fv)/span)+" lb":"—","Average");
  let rows="";for(let i=log.length-1;i>=0;i--){const [k,v]=log[i];const d=i?v-log[i-1][1]:null;
    rows+=`<tr${k===wk?' aria-current="true"':""}><td><button type="button" data-wk="${k}">${fmt(parse(k))}, ${parse(k).getFullYear()}</button></td><td class="num">${v}</td><td class="num">${d===null?"—":sgn(d)}</td></tr>`}
  $("bwHist").innerHTML=`<table class="hist"><thead><tr><th>Week of</th><th>Weight (lb)</th><th>Change</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderSide(){renderStrip();renderMeta();renderCharts();renderBWHist()}
function renderAll(){renderStrip();renderDay();renderMaxes();renderBW();renderCharts()}

$("liftSel").innerHTML=MAXES.map(([k,l])=>`<option value="${k}">${l}</option>`).join("");
$("liftSel").addEventListener("change",renderCharts);
function showDay(){const h=document.querySelector("header.top"),t=$("dayView");const y=t.getBoundingClientRect().top+window.scrollY-h.offsetHeight-8;
  window.scrollTo({top:Math.max(0,y),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}
$("strip").addEventListener("click",e=>{const b=e.target.closest(".day");if(!b)return;sel=+b.dataset.i;renderStrip();renderDay();showDay()});
$("prevWk").onclick=()=>{wk=iso(addD(parse(wk),-7));renderAll()};
$("nextWk").onclick=()=>{wk=iso(addD(parse(wk),7));renderAll()};
$("thisWk").onclick=()=>{wk=iso(sunday(today));sel=today.getDay();renderAll()};

$("dayView").addEventListener("input",e=>{const t=e.target;
  if(t.matches(".ex input[type=number]")){const id=t.closest(".ex").dataset.ex;const d=D(sel);d.ex[id]=d.ex[id]||{};const v=t.value===""?null:+t.value;if(v===null)delete d.ex[id][t.dataset.f];else d.ex[id][t.dataset.f]=v;save()}
  else if(t.matches("input[data-t]")){const id=t.closest(".ex").dataset.ex;const d=D(sel);d.ex[id]=d.ex[id]||{};d.ex[id].c=true;d.ex[id].n=t.value.trim();save()}
  else if(t.tagName==="TEXTAREA"){W().notes[sel]=t.value;save()}});
function defaultEx(id){return allEx(sel).find(e=>e.id===id)}
$("dayView").addEventListener("change",e=>{const t=e.target;
  if(t.matches("select[data-n]")){const row=t.closest(".ex");const id=row.dataset.ex;const d=D(sel);const x=d.ex[id]=d.ex[id]||{};const txt=row.querySelector("input[data-t]");
    if(t.value==="__custom"){x.c=true;x.n=txt.value.trim();txt.hidden=false;txt.focus()}
    else{delete x.c;txt.hidden=true;txt.value="";if(t.value===defaultEx(id).n)delete x.n;else x.n=t.value}
    save()}
  else if(t.matches("select[data-plan]")){const d=D(sel);if(+t.value===sel)delete d.plan;else d.plan=+t.value;save();renderDay()}
  else if(t.classList.contains("chk")){const row=t.closest(".ex");const id=row.dataset.ex;const d=D(sel);d.ex[id]=d.ex[id]||{};d.ex[id].done=t.checked;row.classList.toggle("done",t.checked);save()}
  else if(t.dataset.h){D(sel).hab[t.dataset.h]=t.type==="checkbox"?t.checked:t.value;save()}});
$("maxGrid").addEventListener("input",e=>{const t=e.target;if(!t.dataset.m)return;const w=W();w.maxes[t.dataset.m]=w.maxes[t.dataset.m]||{};
  const v=t.value===""?null:+t.value;if(v===null)delete w.maxes[t.dataset.m][t.dataset.f];else w.maxes[t.dataset.m][t.dataset.f]=v;save()});
$("maxGrid").addEventListener("change",renderMaxes);
$("bwIn").addEventListener("input",e=>{const w=W();const v=+e.target.value;if(v>0)w.bw=v;else delete w.bw;save()});
$("bwHist").addEventListener("click",e=>{const b=e.target.closest("[data-wk]");if(!b)return;wk=b.dataset.wk;renderAll();$("bwIn").focus()});

/* export */
function csv(){const q=v=>{v=v==null?"":String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  const rows=[["week_start","date","day","workout","group","exercise","target","weight_lb","reps","sets","volume_lb","done"]];
  const hrows=[["week_start","date","day","cardio","no_alcohol","no_sweets","no_coffee","notes"]];
  const mrows=[["week_start","lift","weight_lb","reps","e1rm_lb"]];
  const brows=[["week_start","body_weight_lb","change_lb"]];let pbw=0;
  for(const k of Object.keys(weeks).sort()){const w=weeks[k];const s=parse(k);
    const bw=bwOf(w);if(bw){brows.push([k,bw,pbw?r1(bw-pbw):""]);pbw=bw}
    for(let i=0;i<7;i++){const d=(w.days||{})[i];const date=iso(addD(s,i));
      const pl=planOf(w,i);
      for(const [gn,list] of pl.g)for(const e of list){const x=d&&d.ex&&d.ex[e.id];if(!x)continue;
        rows.push([k,date,DAYS[i],pl.t,gn,exName(e,x)||"(custom)",e.t,x.w,x.r,x.s,(+x.w||0)*(+x.r||0)*(+x.s||0),x.done?"yes":"no"])}
      const h=d&&d.hab||{};const note=(w.notes||{})[i];if(Object.keys(h).length||note)hrows.push([k,date,DAYS[i],h.cardio&&h.cardio!=="—"?h.cardio:"",h.noalc?"yes":"",h.nosweets?"yes":"",h.nocoffee?"yes":"",note||""])}
    for(const [mk,ml] of MAXES){const m=(w.maxes||{})[mk];if(m&&(m.w||m.r))mrows.push([k,ml,m.w,m.r,BW.has(mk)?"":e1rm(+m.w,+m.r)])}}
  return [rows,[],["HABITS"],...hrows,[],["WEEKLY MAXES"],...mrows,[],["BODY WEIGHT"],...brows].map(r=>r.map(q).join(",")).join("\n")}
function offer(filename,data,type){
  try{const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);return}catch(e){}
  const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="box"><h3>${filename}</h3><p class="sub" style="margin:0;color:var(--muted)">Downloads aren't available here. Copy the text and paste it into a file named ${filename}.</p><textarea id="expText" readonly></textarea><div class="actions"><button class="btn primary" id="cpy">Copy</button><button class="btn" id="cls">Close</button></div></div>`;
  document.body.appendChild(m);const ta=m.querySelector("textarea");ta.value=data;
  m.querySelector("#cpy").onclick=()=>{navigator.clipboard.writeText(data).then(()=>toast("Copied")).catch(()=>{ta.focus();ta.select()})};
  m.querySelector("#cls").onclick=()=>m.remove()}
$("expCsv").onclick=()=>offer("zeo-workouts-"+iso(today)+".csv",csv(),"text/csv");
$("expJson").onclick=()=>offer("zeo-backup-"+iso(today)+".json",JSON.stringify({version:1,weeks},null,1),"application/json");
$("impBtn").onclick=()=>$("impFile").click();
$("impFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const ws=j.weeks||j;let n=0;
  for(const k in ws){if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&ws[k]&&typeof ws[k]==="object"){weeks[k]=ws[k];weeks[k].start=k;weeks[k].u=Date.now();dirty.add(k);n++}}save(wk);renderAll();toast("Imported "+n+" week"+(n===1?"":"s"))}catch(err){toast("That file isn't a ZEO backup. Use a file made with Export backup.")}};r.readAsText(f);e.target.value=""};

renderAll();

/* ---------- cross-device sync (Supabase) ----------
   Each week is one row: (user_id, start) -> data. Every edit stamps the week with
   `u` (ms). On load and whenever the app comes back into view we pull; the newer
   copy of each week wins, and unsynced local edits are pushed. Works offline: edits
   queue in localStorage ("zeo-dirty") until the next successful push. */
const CFG=window.ZEO_CONFIG||{};
const SYNC_READY=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase&&window.supabase.createClient);
const hhmm=()=>new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});
function chip(state,text){const c=$("syncChip");c.dataset.state=state;c.querySelector("span").textContent=text}

async function flush(){
  if(!sb||!uid||syncing||!dirty.size)return;
  if(!navigator.onLine){chip("off","Offline");setStatus("Offline. Entries are saved on this device and will sync when you're back online.");return}
  syncing=true;chip("busy","Syncing");
  const sent={};const rows=[];
  for(const k of dirty){if(!weeks[k])continue;sent[k]=weeks[k].u||0;rows.push({user_id:uid,start:k,data:weeks[k],updated_at:new Date(weeks[k].u||Date.now()).toISOString()})}
  try{
    if(rows.length){const {error}=await sb.from("weeks").upsert(rows,{onConflict:"user_id,start"});if(error)throw error}
    for(const k of [...dirty])if(!weeks[k]||(weeks[k].u||0)===sent[k])dirty.delete(k);
    persist();chip("ok","Synced");setStatus("Synced across your devices · "+hhmm());
  }catch(e){chip("err","Not synced");setStatus("Couldn't sync just now ("+(e.message||"network error")+"). Entries are kept on this device and will retry.")}
  finally{syncing=false;if(dirty.size&&$("syncChip").dataset.state==="ok")setTimeout(flush,400)}
}

async function pull(){
  if(!sb||!uid)return false;
  const {data,error}=await sb.from("weeks").select("start,data,updated_at");if(error)throw error;
  let changed=false;const seen=new Set();
  for(const r of data||[]){
    const k=r.start;seen.add(k);
    const rd=JSON.parse(JSON.stringify(r.data||{}));rd.start=k;rd.u=rd.u||Date.parse(r.updated_at)||0;
    const l=weeks[k];
    if(l&&dirty.has(k)&&(l.u||0)>=rd.u)continue;          // our unsynced edit is newer: keep and push it
    if(!l||JSON.stringify(l)!==JSON.stringify(rd)){weeks[k]=rd;changed=true}
    dirty.delete(k);
  }
  // Weeks that only exist on this device. Only edited ones (stamped with u): just viewing a week
  // creates an empty object, and pushing that could overwrite another device's unsynced entries.
  for(const k in weeks)if(!seen.has(k)&&weeks[k].u)dirty.add(k);
  persist();return changed;
}

async function syncNow(){
  if(!sb||!uid)return;
  try{chip("busy","Syncing");const changed=await pull();if(changed)renderAll();
    if(dirty.size)await flush();else{chip("ok","Synced");setStatus("Synced across your devices · "+hhmm())}}
  catch(e){chip("err","Not synced");setStatus("Signed in, but couldn't reach the database ("+(e.message||"network error")+"). Entries are kept on this device.")}
}

function renderAcct(user){
  const a=$("acct");
  if(!SYNC_READY){chip("local","This device");
    a.innerHTML=`<p class="sub">Sync isn't configured on this deployment, so entries stay in this browser. Add your Supabase URL and key to <code>config.js</code> to sync phone and laptop (see README).</p>`;return}
  if(user){
    a.innerHTML=`<p class="sub">Signed in as <b>${esc(user.email||"you")}</b>. Every change is saved here first, then synced.</p>
      <div class="actions"><button class="btn primary" id="syncBtn">Sync now</button><button class="btn" id="outBtn">Sign out</button></div>`;
    $("syncBtn").onclick=syncNow;
    $("outBtn").onclick=async()=>{await flush();await sb.auth.signOut();toast("Signed out. Your log is still on this device.")};
    return}
  chip("local","Sign in");
  a.innerHTML=`<form class="login" id="login" autocomplete="on">
      <label>Email<input type="email" id="lgEmail" autocomplete="username" required></label>
      <label>Password<input type="password" id="lgPass" autocomplete="current-password" minlength="6" required></label>
      <div class="actions"><button class="btn primary" type="submit">Sign in</button><button class="btn" type="button" id="lgNew">Create account</button></div>
      <p class="sub" id="lgMsg" role="status"></p></form>`;
  const msg=t=>{$("lgMsg").textContent=t};
  $("login").onsubmit=async e=>{e.preventDefault();msg("Signing in…");
    const {error}=await sb.auth.signInWithPassword({email:$("lgEmail").value.trim(),password:$("lgPass").value});
    if(error)msg(error.message)};
  $("lgNew").onclick=async()=>{const email=$("lgEmail").value.trim(),password=$("lgPass").value;
    if(!email||password.length<6){msg("Enter an email and a password of at least 6 characters.");return}
    msg("Creating account…");
    const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});
    if(error)msg(error.message);else if(!data.session)msg("Check your email to confirm the account, then sign in here.")};
}

function startSync(){
  if(!SYNC_READY){renderAcct(null);setStatus("Saved in this browser.");return}
  sb=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  sb.auth.onAuthStateChange((ev,session)=>{
    const user=session&&session.user,id=user?user.id:null;
    if(id===uid&&startSync.seen)return;startSync.seen=true;uid=id;renderAcct(user);
    if(!uid){setStatus("Saved on this device. Sign in to sync across devices.");return}
    setTimeout(syncNow,0);   // outside the auth callback, per supabase-js guidance
  });
  addEventListener("online",flush);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")syncNow();else flush()});
}
startSync();

if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
