import { useState, useRef, useEffect } from "react";

const C = { bg:"#0F1B2D", fg:"#F5F3EC", card:"#16253B", b:"#2A3A50", muted:"#B8AE96", blue:"#5B8DB8", khaki:"#C4B896" };
const card = (x={}) => ({ background:C.card, border:`1px solid ${C.b}`, borderRadius:10, padding:"14px 18px", ...x });
const lbl = { fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, marginBottom:6 };

// ── 1. Dual-Pathway Diagram ──────────────────────────────────────────────────
const PATHWAYS = [
  { key:"executive", label:"Executive Control", sub:"Top-down · Planning · Impulse-braking", color:C.blue,
    mech:"The prefrontal cortex struggles to apply the brakes — to hold a rule in mind long enough to override an impulse. It's a timing and regulation problem, not a motivation problem.",
    signs:["Starts tasks but can't finish them","Acts before thinking","Difficulty holding a plan while executing"],
    screen:"Screen behavior follows the impulse: switches apps, jumps between videos — not because the next thing is more rewarding, but because inhibiting the switch is hard." },
  { key:"delay", label:"Delay Aversion", sub:"Bottom-up · Reward sensitivity · Waiting discomfort", color:C.khaki,
    mech:"The brain's reward circuitry discounts future rewards steeply — 'now' and '5 minutes from now' feel worlds apart. The discomfort of waiting is itself aversive, not just neutral.",
    signs:["Gravitates toward anything with immediate payoff","Meltdowns when asked to wait","Chooses the small reward now over the bigger reward later"],
    screen:"Gaming and social media are engineered for this pathway: variable ratio reinforcement, instant feedback, no mandatory waiting. A near-perfect fit for a delay-averse reward system." },
];

function DualPathway() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
        <div style={{ background:"#1E3A5A", border:`2px solid #4A7A9B`, borderRadius:50, padding:"10px 24px", fontSize:13, fontWeight:700, color:C.fg }}>ADHD</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}><div style={{ width:1, height:12, background:C.b }} /></div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:2 }}>
        <div style={{ width:"62%", height:16, borderTop:`1px solid ${C.b}`, borderLeft:`1px solid ${C.b}`, borderRight:`1px solid ${C.b}`, borderTopLeftRadius:4, borderTopRightRadius:4 }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {PATHWAYS.map(p => (
          <div key={p.key} onClick={() => setOpen(open===p.key?null:p.key)}
            style={{ ...card(), border:`1px solid ${open===p.key?p.color:C.b}`, cursor:"pointer", transition:"border-color 0.15s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1, minWidth:0, marginRight:6 }}>
                <div style={{ fontSize:11, fontWeight:700, color:p.color, marginBottom:2 }}>{p.label}</div>
                <div style={{ fontSize:9, color:C.muted, lineHeight:1.4 }}>{p.sub}</div>
              </div>
              <span style={{ color:C.muted, fontSize:12, transform:open===p.key?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0, marginTop:2 }}>▾</span>
            </div>
            {open===p.key && (
              <div style={{ marginTop:12 }}>
                <p style={{ fontSize:11, color:C.fg, lineHeight:1.6, marginBottom:12 }}>{p.mech}</p>
                <div style={{ ...lbl }}>Day-to-day signs</div>
                {p.signs.map((s,i) => <div key={i} style={{ fontSize:10, color:C.muted, marginBottom:4, paddingLeft:10, borderLeft:`2px solid ${p.color}40`, lineHeight:1.5 }}>{s}</div>)}
                <div style={{ ...lbl, marginTop:10 }}>With screens</div>
                <p style={{ fontSize:10, color:C.muted, lineHeight:1.6 }}>{p.screen}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize:9, color:C.muted, textAlign:"center", marginTop:8 }}>Tap a pathway to expand</p>
    </div>
  );
}

// ── 2. Delay Aversion Slider ─────────────────────────────────────────────────
const CAPTIONS = [
  [0,12,"Right now. Both brains feel the same pull toward the reward."],
  [12,28,"A few minutes. Already a noticeably steeper drop for the delay-averse brain."],
  [28,48,"Under an hour. For a delay-averse brain, this wait already feels like losing."],
  [48,68,"A few hours. The gap has widened — waiting starts to feel pointless."],
  [68,85,"Tomorrow. For a delay-averse brain, tomorrow is nearly as distant as never."],
  [85,100,"Next week. The typical brain still sees real value. The delay-averse brain registers almost none."],
];

function DelaySlider() {
  const [t, setT] = useState(15);
  const typ = (x) => 100*Math.exp(-0.003*x);
  const da  = (x) => 100*Math.exp(-0.055*x);
  const W=300, H=155, pl=28, pr=12, pt=10, pb=34;
  const pw=W-pl-pr, ph=H-pt-pb;
  const sx=(x)=>pl+(x/100)*pw, sy=(v)=>pt+ph-(v/100)*ph;
  const path=(fn)=>{const pts=[];for(let x=0;x<=100;x+=2)pts.push(`${sx(x).toFixed(1)},${sy(fn(x)).toFixed(1)}`);return`M ${pts.join(" L ")}`;};
  const cap = CAPTIONS.find(([lo,hi])=>t>=lo&&t<hi)?.[2] ?? CAPTIONS[CAPTIONS.length-1][2];
  const mx=sx(t);
  return (
    <div>
      <div style={lbl}>Perceived value of a reward over time</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {[25,50,75].map(v=><line key={v} x1={pl} y1={sy(v)} x2={pl+pw} y2={sy(v)} stroke={C.b} strokeWidth={0.5} strokeDasharray="3,3"/>)}
        <line x1={pl} y1={pt} x2={pl} y2={pt+ph} stroke={C.b} strokeWidth={1}/>
        <line x1={pl} y1={pt+ph} x2={pl+pw} y2={pt+ph} stroke={C.b} strokeWidth={1}/>
        {[0,50,100].map(v=><text key={v} x={pl-4} y={sy(v)} fill={C.muted} fontSize={7.5} textAnchor="end" dominantBaseline="middle">{v}</text>)}
        <text x={pl} y={pt+ph+12} fill={C.muted} fontSize={7.5}>Now</text>
        <text x={pl+pw} y={pt+ph+12} fill={C.muted} fontSize={7.5} textAnchor="end">Later</text>
        <text x={pl+pw/2} y={pt+ph+24} fill={C.muted} fontSize={7.5} textAnchor="middle">Time to reward →</text>
        <circle cx={pl+6} cy={pt+6} r={3} fill={C.blue}/><text x={pl+12} y={pt+6} fill={C.blue} fontSize={7.5} dominantBaseline="middle">Typical</text>
        <circle cx={pl+6} cy={pt+17} r={3} fill={C.khaki}/><text x={pl+12} y={pt+17} fill={C.khaki} fontSize={7.5} dominantBaseline="middle">Delay-averse</text>
        <path d={path(typ)} fill="none" stroke={C.blue} strokeWidth={2}/>
        <path d={path(da)} fill="none" stroke={C.khaki} strokeWidth={2}/>
        <line x1={mx} y1={pt} x2={mx} y2={pt+ph} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,2"/>
        <circle cx={mx} cy={sy(typ(t))} r={4} fill={C.blue}/>
        <circle cx={mx} cy={sy(da(t))} r={4} fill={C.khaki}/>
      </svg>
      <input type="range" min={0} max={100} value={t} onChange={e=>setT(+e.target.value)}
        style={{ width:"100%", accentColor:C.khaki, marginTop:10 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:C.muted, marginTop:2 }}>
        <span>Now</span><span>← drag →</span><span>Later</span>
      </div>
      <div style={{ ...card({background:"#1B2D42", marginTop:12}), fontSize:11, color:C.muted, lineHeight:1.7, fontStyle:"italic", minHeight:48 }}>{cap}</div>
    </div>
  );
}

// ── 3. Evidence-Tier Toggle ──────────────────────────────────────────────────
const TIERS = {
  know: { label:"What we know", items:[
    { c:"Dual-pathway model", d:"The two-pathway architecture is well-established — replicated across labs, documented neurologically, and clinically useful." },
    { c:"Delay aversion as a distinct construct", d:"Delay aversion is measurable, separable from executive function deficits, and predicts different behavioral profiles." },
    { c:"ADHD elevates risk for problematic screen use", d:"The correlation is consistent and robust across studies. ADHD is associated with higher rates of problematic gaming and social media use." },
  ]},
  testing: { label:"What's still being tested", items:[
    { c:"The mechanism connecting ADHD to problematic gaming", d:"Mediation studies — the ones that would tell us *why* ADHD leads to problematic gaming — haven't confirmed the expected pathways." },
    { c:"Whether delay aversion is the primary driver for screens", d:"It's a plausible fit (screens are engineered for immediate reinforcement), but direct evidence is limited." },
    { c:"Intervention targets by pathway", d:"We don't yet have strong RCT evidence for which interventions work best for which pathway." },
  ]},
};

function EvidenceTier() {
  const [tab, setTab] = useState("know");
  const tc = tab==="know"?C.blue:C.khaki;
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["know","testing"].map(k=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ flex:1, padding:"9px 0", borderRadius:8, border:`1px solid ${tab===k?tc:C.b}`, background:tab===k?tc+"18":"transparent", color:tab===k?tc:C.muted, fontSize:11, fontWeight:tab===k?700:400, cursor:"pointer", transition:"all 0.15s" }}>
            {TIERS[k].label}
          </button>
        ))}
      </div>
      {TIERS[tab].items.map((item,i)=>(
        <div key={i} style={{ ...card(), borderLeft:`3px solid ${tc}`, borderTopLeftRadius:0, borderBottomLeftRadius:0, marginBottom:8 }}>
          <div style={{ fontSize:12, fontWeight:600, color:C.fg, marginBottom:5 }}>{item.c}</div>
          <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{item.d}</div>
        </div>
      ))}
    </div>
  );
}

// ── 4. Mythbuster Cards ──────────────────────────────────────────────────────
const MYTHS = [
  { id:"wired", belief:'"Kids with ADHD are just wired differently — there\'s nothing we can really do about it."',
    partial:"Partly true. Temperament is real — the neurological differences are real, not chosen, not caused by parenting. Blaming yourself won't help." },
  { id:"will", belief:'"Parents just never made them get off. They could stop if they actually wanted to."',
    partial:"Also partly true. Agency exists. Structure and parental scaffolding really do make a difference. Environmental factors are not irrelevant." },
];

function Mythbusters() {
  const [fl, setFl] = useState({});
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
        {MYTHS.map(m=>{
          const f=!!fl[m.id];
          return (
            <div key={m.id} onClick={()=>setFl(x=>({...x,[m.id]:!x[m.id]}))}
              style={{ ...card({ border:`1px solid ${f?"#5B8DB840":C.b}`, cursor:"pointer", minHeight:160, display:"flex", flexDirection:"column", justifyContent:"space-between" }) }}>
              {!f ? (
                <>
                  <p style={{ fontSize:11, color:C.fg, lineHeight:1.6, fontStyle:"italic" }}>{m.belief}</p>
                  <span style={{ fontSize:9, color:C.muted, marginTop:10 }}>Tap to see the partial truth →</span>
                </>
              ) : (
                <>
                  <div>
                    <div style={{ ...lbl, color:C.blue }}>The partial truth</div>
                    <p style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{m.partial}</p>
                  </div>
                  <span style={{ fontSize:9, color:C.muted, marginTop:10 }}>← Tap to flip back</span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ ...card({ background:"#1A2E44", border:`1px solid #5B8DB830` }) }}>
        <div style={lbl}>The whole picture</div>
        <p style={{ fontSize:12, color:C.fg, lineHeight:1.7 }}>Both beliefs contain real truth, and both are incomplete. Temperament sets vulnerability — the neurology is real. And environment determines outcome — structure and scaffolding still shape where a child lands.</p>
      </div>
    </div>
  );
}

// ── 5. Pathway Comparison ────────────────────────────────────────────────────
const PATTERNS = [
  { key:"exec", label:"Executive Control pathway", color:C.blue, intro:"Sounds like a regulation problem:", items:[
    '"She\'ll start cleaning her room and somehow end up playing with a toy she found."',
    '"He knows the rule, repeats it back, and then ignores it two minutes later."',
    '"She can tell me exactly what she should do — she just can\'t seem to do it."',
  ]},
  { key:"delay", label:"Delay Aversion pathway", color:C.khaki, intro:"Sounds like a waiting problem:", items:[
    '"Any reward that isn\'t happening right now isn\'t real to him."',
    '"Five minutes might as well be five hours the way she reacts."',
    '"The wait itself is the problem — she\'s not upset about the outcome, she\'s upset about the gap."',
  ]},
];

function PathwayComp() {
  const [active, setActive] = useState(null);
  const visible = active ? PATTERNS.filter(p=>p.key===active) : PATTERNS;
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {PATTERNS.map(p=>(
          <button key={p.key} onClick={()=>setActive(active===p.key?null:p.key)}
            style={{ flex:1, padding:"7px 4px", borderRadius:8, border:`1px solid ${active===null||active===p.key?p.color:C.b}`, background:active===p.key?p.color+"18":"transparent", color:active===null||active===p.key?p.color:C.muted, fontSize:9, fontWeight:600, cursor:"pointer", lineHeight:1.3, transition:"all 0.15s" }}>
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:visible.length===1?"1fr":"1fr 1fr", gap:10 }}>
        {visible.map(p=>(
          <div key={p.key} style={{ ...card({ borderTop:`3px solid ${p.color}`, gridColumn:active===p.key?"1/-1":"auto" }) }}>
            <div style={{ fontSize:11, fontWeight:700, color:p.color, marginBottom:2 }}>{p.label}</div>
            <div style={{ fontSize:9, color:C.muted, fontStyle:"italic", marginBottom:10 }}>{p.intro}</div>
            {p.items.map((item,i)=>(
              <div key={i} style={{ fontSize:10, color:C.fg, lineHeight:1.6, marginBottom:7, paddingLeft:10, borderLeft:`2px solid ${p.color}30`, fontStyle:"italic" }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
      <p style={{ fontSize:9, color:C.muted, marginTop:8, lineHeight:1.5 }}>Many kids show both patterns. This is a mirror for recognizing the concept, not a diagnostic instrument.</p>
    </div>
  );
}

// ── 6. Glossary Tooltips ─────────────────────────────────────────────────────
const DEFS = {
  "delay aversion":"An above-average discomfort with waiting for rewards. A delay-averse brain experiences the wait itself as aversive, not merely neutral.",
  "reward sensitivity":"Heightened reactivity to potential rewards. More strongly pulled toward anything with an immediate payoff; reward experienced more intensely when it arrives.",
  "inhibitory control":"The ability to suppress an automatic response in favor of a deliberate one. Difficulty here means the 'brake' is weaker — not that the person doesn't know the rule.",
  "dual-pathway model":"Sonuga-Barke's framework proposing ADHD symptoms can arise through two distinct routes: inhibitory control deficits (top-down, executive) and delay aversion (bottom-up, motivational).",
  "mediation":"In research, a mediator explains *why* variable A leads to outcome B. 'Mediation wasn't confirmed' means the expected mechanism wasn't found, even if the A→B correlation holds.",
};

function Tooltip({ term, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    if(!open) return;
    const h=(e)=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[open]);
  return (
    <span ref={ref} style={{ position:"relative", display:"inline" }}>
      <span onClick={()=>setOpen(!open)} onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}
        style={{ borderBottom:`1px dotted ${C.khaki}`, color:C.khaki, cursor:"help" }}>{children}</span>
      {open && (
        <span style={{ position:"absolute", bottom:"calc(100% + 10px)", left:"50%", transform:"translateX(-50%)", width:220, background:"#1E3A5A", border:`1px solid ${C.b}`, borderRadius:8, padding:"11px 13px", fontSize:11, color:C.muted, lineHeight:1.6, zIndex:50, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", display:"block", pointerEvents:"none" }}>
          <span style={{ fontWeight:700, color:C.fg, display:"block", marginBottom:4 }}>{term}</span>
          {DEFS[term]}
          <span style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%) rotate(45deg)", width:8, height:8, background:"#1E3A5A", borderRight:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}` }}/>
        </span>
      )}
    </span>
  );
}

function GlossaryDemo() {
  return (
    <div style={{ ...card(), lineHeight:1.8, fontSize:13, color:C.fg }}>
      <p>Sonuga-Barke&apos;s <Tooltip term="dual-pathway model">dual-pathway model</Tooltip> proposes that ADHD symptoms emerge through two distinct routes. The first — <Tooltip term="inhibitory control">inhibitory control</Tooltip> deficits — involves difficulty suppressing automatic responses. The second — <Tooltip term="delay aversion">delay aversion</Tooltip> — involves heightened <Tooltip term="reward sensitivity">reward sensitivity</Tooltip> and waiting discomfort. Note: <Tooltip term="mediation">mediation</Tooltip> studies haven&apos;t confirmed the specific mechanism linking ADHD to problematic gaming.</p>
    </div>
  );
}

// ── 7. Strategy Explorer ──────────────────────────────────────────────────────
const SITS = [
  { id:"wait", label:"Melts down when asked to wait", strats:[
    { t:"Make the wait visible", d:"Visual timers let the child see time passing — the abstract wait becomes concrete and manageable." },
    { t:"Shorten the interval, not the expectation", d:"Instead of 'wait until dinner,' try 'wait until this song ends, then one more thing.' Same destination; smaller gaps." },
    { t:"Pair waiting with a low-demand activity", d:"Waiting isn't easier with nothing to do. Give them something predictable and low-effort during the gap." },
  ]},
  { id:"knows", label:"Can explain the rule but still breaks it", strats:[
    { t:"Reduce the gap between rule and consequence", d:"The further apart in time, the harder it is for an executive-control-challenged brain to connect them. Tighten the loop." },
    { t:"Make the rule external, not internal", d:"Visual checklists, posted steps, phone reminders — anything that takes the rule out of working memory and puts it in the environment." },
    { t:"Catch compliance, not just violation", d:"When the rule is followed, name it specifically and immediately." },
  ]},
  { id:"screen", label:"Can't stop when screen time ends", strats:[
    { t:"Transition warnings that are real warnings", d:"'Five more minutes' only works if five minutes has ever ended the session." },
    { t:"End at a natural stopping point", d:"Help the child identify what a stopping point feels like, and set the timer to end there when possible." },
    { t:"What comes next matters", d:"The post-screen transition is harder when the next activity is unstructured or unappealing." },
  ]},
  { id:"now", label:"Always chooses now over later", strats:[
    { t:"Redesign the reward interval", d:"Instead of 'you'll feel proud when done' (very delayed, abstract), use reward systems that pay out much closer to the behavior." },
    { t:"Make 'later' feel real", d:"Savings jars, progress bars, visual representations — anything that makes the future reward visible in the present." },
    { t:"Name the pull honestly", d:"Telling a child their brain makes 'later' feel far away isn't an excuse — it's information that helps them understand themselves." },
  ]},
];

function StrategyExp() {
  const [sel, setSel] = useState(new Set());
  const toggle = (id) => setSel(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const active = SITS.filter(s=>sel.has(s.id));
  return (
    <div>
      <div style={lbl}>What are you seeing?</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        {SITS.map(s=>(
          <button key={s.id} onClick={()=>toggle(s.id)}
            style={{ padding:"9px 10px", borderRadius:8, border:`1px solid ${sel.has(s.id)?C.khaki:C.b}`, background:sel.has(s.id)?C.khaki+"18":"transparent", color:sel.has(s.id)?C.khaki:C.muted, fontSize:10, cursor:"pointer", textAlign:"left", lineHeight:1.4, transition:"all 0.15s" }}>
            {s.label}
          </button>
        ))}
      </div>
      {sel.size===0 && (
        <div style={{ ...card({ padding:"28px 20px", textAlign:"center" }), color:C.muted, fontSize:12 }}>
          Select one or more situations above to see strategies
        </div>
      )}
      {active.map(sit=>(
        <div key={sit.id} style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.khaki, marginBottom:8 }}>When: {sit.label}</div>
          {sit.strats.map((st,i)=>(
            <div key={i} style={{ ...card({ marginBottom:7 }) }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.fg, marginBottom:4 }}>{st.t}</div>
              <div style={{ fontSize:11, color:C.muted, lineHeight:1.6 }}>{st.d}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── 8. Temperament Timeline ───────────────────────────────────────────────────
const OUTCOMES = [
  { id:"unstr", label:"Mostly unstructured", color:"#8B6F6F",
    desc:"Screens fill unstructured time. Waiting demands escalate into conflict. The gap between the child's regulatory needs and the environment's demands widens over time.",
    items:["Higher screen time, less voluntary stopping","More conflict around limits","Missing practice building delayed-reward tolerance"] },
  { id:"design", label:"Reward intervals redesigned", color:C.blue,
    desc:"Structure does some of the regulatory work the brain struggles to do alone. Waits are broken into visible, manageable pieces. Rewards are timed closer to behavior.",
    items:["Waiting becomes more manageable over time","Less conflict around limits (predictability reduces anticipatory distress)","Child builds language for their own experience"] },
  { id:"scaff", label:"Externally scaffolded", color:"#6B9E6B",
    desc:"Visual systems, external reminders, and clear routines take the regulatory load out of working memory. The environment does the holding the internal system struggles with.",
    items:["Rule-following improves (less reliance on internal reminders)","Transition meltdowns decrease with consistent structure","Gradually reduces scaffolding as skills build"] },
];

function TempTimeline() {
  const [rev, setRev] = useState(new Set());
  const tog = (id) => setRev(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:16 }}>
        <div style={{ background:"#1E3A5A", border:`2px solid #4A7A9B`, borderRadius:10, padding:"12px 20px", textAlign:"center", maxWidth:280 }}>
          <div style={lbl}>Starting point</div>
          <p style={{ fontSize:11, fontWeight:600, color:C.fg, lineHeight:1.5, margin:0 }}>Temperament — neurological vulnerability to delay aversion and/or inhibitory control difficulties</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", margin:"10px 0" }}>
          <div style={{ width:1, height:10, background:C.b }}/>
          <div style={{ fontSize:9, color:C.muted, margin:"3px 0" }}>environment shapes</div>
          <div style={{ width:1, height:10, background:C.b }}/>
          <span style={{ color:C.muted, fontSize:13 }}>▾</span>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {OUTCOMES.map(o=>{
          const open=rev.has(o.id);
          return (
            <div key={o.id} onClick={()=>tog(o.id)}
              style={{ ...card({ borderLeft:`4px solid ${o.color}`, borderTopLeftRadius:0, borderBottomLeftRadius:0, cursor:"pointer" }) }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, color:C.muted, marginBottom:1 }}>Environment:</div>
                  <div style={{ fontSize:12, fontWeight:700, color:o.color }}>{o.label}</div>
                </div>
                <span style={{ color:C.muted, fontSize:12, transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
              </div>
              {open && (
                <div style={{ marginTop:12 }}>
                  <p style={{ fontSize:11, color:C.fg, lineHeight:1.6, marginBottom:10 }}>{o.desc}</p>
                  <div style={lbl}>Over time</div>
                  {o.items.map((item,i)=>(
                    <div key={i} style={{ fontSize:10, color:C.muted, marginBottom:5, paddingLeft:10, borderLeft:`2px solid ${o.color}40`, lineHeight:1.5 }}>{item}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:9, color:C.muted, marginTop:12, lineHeight:1.5 }}>Same neurological starting point. Different environmental contexts produce meaningfully different trajectories — temperament is not destiny.</p>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Sec({ n, title, sub, children }) {
  return (
    <div style={{ marginBottom:48 }}>
      <div style={{ borderBottom:`1px solid ${C.b}`, paddingBottom:12, marginBottom:20 }}>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>
          {String(n).padStart(2,"0")}
        </div>
        <h2 style={{ fontSize:17, fontWeight:800, color:C.fg, margin:0 }}>{title}</h2>
        {sub && <p style={{ fontSize:11, color:C.muted, margin:"4px 0 0" }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background:C.bg, color:C.fg, minHeight:"100vh", fontFamily:"Inter, system-ui, -apple-system, sans-serif", maxWidth:640, margin:"0 auto", padding:"28px 16px", boxSizing:"border-box" }}>
      <div style={{ marginBottom:40 }}>
        <div style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:C.muted, marginBottom:6 }}>ADHD Module</div>
        <h1 style={{ fontSize:22, fontWeight:800, margin:0, lineHeight:1.2 }}>Interactive Elements</h1>
        <p style={{ fontSize:12, color:C.muted, marginTop:6 }}>8 components for the deep-dive page — all data-driven, MDX-ready</p>
      </div>

      <Sec n={1} title="Dual-Pathway Diagram" sub="Tap a pathway to expand"><DualPathway/></Sec>
      <Sec n={2} title="Delay Aversion Slider" sub="Drag to feel the difference"><DelaySlider/></Sec>
      <Sec n={3} title="Evidence-Tier Toggle" sub="What we know vs. what's still being tested"><EvidenceTier/></Sec>
      <Sec n={4} title="Mythbuster Cards" sub="Tap to flip"><Mythbusters/></Sec>
      <Sec n={5} title="Pathway Comparison" sub="A mirror, not an instrument — no scoring"><PathwayComp/></Sec>
      <Sec n={6} title="Glossary Tooltips" sub="Hover or tap underlined terms"><GlossaryDemo/></Sec>
      <Sec n={7} title="Strategy Explorer" sub="Select what you're seeing"><StrategyExp/></Sec>
      <Sec n={8} title="Temperament vs. Outcome Timeline" sub="Tap a path to expand"><TempTimeline/></Sec>
    </div>
  );
}
