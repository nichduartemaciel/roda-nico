import { useState, useRef, useCallback } from "react";

const COLORS = [
  "#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF",
  "#FF9F1C","#2EC4B6","#F72585","#B5E48C","#48CAE4",
  "#F4A261","#A8DADC","#E63946","#90E0EF","#FFBA08",
  "#D62828","#023E8A","#40916C","#7B2D8B","#E9C46A",
];

const ALL_WHEELS = [
  // ── APARÊNCIA BÁSICA ──
  { id:1,  group:"Aparência",  name:"Gênero",          items:["Masculino","Feminino","Andrógino","Não-binário","Fluido","Sem gênero","Monstruoso","Mecânico"] },
  { id:2,  group:"Aparência",  name:"Espécie",          items:["Humano","Elfo","Demônio","Anjo","Robô","Zumbi","Animal Híbrido","Elemental","Fantasma","Deus","Alienígena","Vampiro"] },
  { id:3,  group:"Aparência",  name:"Tipo de Corpo",    items:["Esguio","Musculoso","Rechonchudo","Curvilíneo","Monstroso","Pequeno","Gigante","Etéreo","Sem forma","Assimétrico"] },
  { id:4,  group:"Aparência",  name:"Tom de Pele",      items:["Claro","Médio","Escuro","Ebâneo","Acinzentado","Azulado","Esverdeado","Dourado","Translúcido","Pétreo","Escamoso","Avermelhado"] },
  { id:5,  group:"Aparência",  name:"Marcas na Pele",   items:["Nenhuma","Cicatrizes","Tatuagens","Sardas","Pintinhas","Runas","Veias brilhantes","Rachaduras","Manchas","Escamas parciais","Padrões tribais"] },
  // ── ROSTO ──
  { id:6,  group:"Rosto",      name:"Formato do Rosto", items:["Oval","Quadrado","Triangular","Redondo","Alongado","Afundado","Múltiplos rostos","Mascarado","Sem rosto","Angular","Assimétrico"] },
  { id:7,  group:"Rosto",      name:"Qtd. de Olhos",    items:["1 olho","2 olhos","3 olhos","4 olhos","6 olhos","Sem olhos","Olhos espalhados","Olhos no corpo","Olhos ocultos"] },
  { id:8,  group:"Rosto",      name:"Tipo de Olho",     items:["Normal","Heterocromia","Olho de gato","Sem pupila","Olho de réptil","Espiral","Estelar","Abissal","Brilhante","Multicolorido","Metálico"] },
  { id:9,  group:"Rosto",      name:"Boca / Dentes",    items:["Normal","Presas longas","Dentes múltiplos","Sem boca","Boca larga","Boca costurada","Bico","Chamas saindo","Sorriso rasgado","Boca dupla"] },
  { id:10, group:"Rosto",      name:"Orelhas",          items:["Humana","Pontuda","Arredondada","Animal","Sem orelha","Orelhas múltiplas","Chifres no lugar","Antenas","Assimétrica"] },
  // ── CABELO ──
  { id:11, group:"Cabelo",     name:"Cor do Cabelo",    items:["Preto","Loiro","Ruivo","Castanho","Branco","Azul","Verde","Roxo","Rosa","Arco-íris","Cinza","Transparente","Chamas"] },
  { id:12, group:"Cabelo",     name:"Estilo do Cabelo", items:["Liso longo","Cacheado","Raspado","Moicano","Trançado","Afro","Rabo de cavalo","Dreadlocks","Bagunçado","Careca","Flutua no ar","Tentáculos"] },
  // ── MEMBROS ──
  { id:13, group:"Membros",    name:"Braços / Mãos",    items:["Normal","Garras","Tentáculos","Mecânico","Asas","Sem mãos","Múltiplos braços","Mãos gigantes","Lâminas","Patas","Raízes"] },
  { id:14, group:"Membros",    name:"Pernas / Pés",     items:["Normal","Cascos","Patas","Cauda de serpente","Pernas mecânicas","Sem pernas (flutua)","Raízes","Múltiplas pernas","Garras nos pés","Cauda de peixe"] },
  { id:15, group:"Membros",    name:"Extras Corporais", items:["Nenhum","Asas nas costas","Cauda","Chifres","Halo","Tentáculos nas costas","Múltiplas caudas","Espinhos","Auréola sombria","Olho na testa","Boca no peito"] },
  // ── ROUPA ──
  { id:16, group:"Roupa",      name:"Estilo da Roupa",  items:["Medieval","Futurista","Casual","Formal","Gótico","Steampunk","Tradicional","Militar","Esportivo","Seminú","Armadura pesada","Robes","Streetwear","Lolita","Yokai"] },
  { id:17, group:"Roupa",      name:"Cor Principal",    items:["Preto","Branco","Vermelho","Azul escuro","Dourado","Roxo","Verde musgo","Cinza","Laranja","Rosa","Multicolorido","Transparente"] },
  { id:18, group:"Roupa",      name:"Acessório 1",      items:["Nenhum","Chapéu","Máscara","Capuz","Óculos","Tiara","Brincos","Correntes","Capa","Cachecol","Bandagem","Coroa","Elmo"] },
  { id:19, group:"Roupa",      name:"Acessório 2",      items:["Nenhum","Luvas","Pauldron","Cinto com itens","Bolsa misteriosa","Relógio arcano","Amuleto","Livro preso","Bengala","Instrumento musical","Animal de estimação"] },
  // ── ITEM / ARMA ──
  { id:20, group:"Equipamento",name:"Arma / Item",      items:["Espada","Arco","Cajado","Revólver","Katana","Sem arma","Escudo","Livro mágico","Foice","Adaga dupla","Correntes","Elemento puro","Marionetes","Instrumento","Veneno"] },
  { id:21, group:"Equipamento",name:"Tipo de Magia",    items:["Nenhuma","Fogo","Água","Terra","Raio","Gelo","Sombra","Luz","Necromancia","Ilusão","Tempo","Espaço","Caos","Cura","Maldição","Sangue"] },
  // ── PERSONALIDADE ──
  { id:22, group:"Personalidade",name:"Arquétipo",      items:["Herói relutante","Vilão trágico","Mentor sábio","Trickster","Cavaleiro caído","Inocente corrompido","Sobrevivente","Protetor","Rebelde","Fanático","O vazio","Vítima que virou monstro"] },
  { id:23, group:"Personalidade",name:"Traço Principal",items:["Sarcástico","Gentil demais","Frio e calculista","Impulsivo","Paranoico","Obsessivo","Melancólico","Alegre superficial","Curioso","Desconfiado","Leal até a morte","Indiferente"] },
  { id:24, group:"Personalidade",name:"Medo / Fraqueza",items:["Abandono","Fracasso","Intimidade","Morte","Solidão","Perder controle","O passado","Aqueles que ama","A própria natureza","Deus(es)","Irrelevância","Ser descoberto"] },
  { id:25, group:"Personalidade",name:"Desejo Profundo",items:["Ser amado","Poder absoluto","Paz","Vingança","Compreender o mundo","Ser livre","Proteger alguém","Expiar culpa","Não sentir mais nada","Reconhecimento","Recomeçar","Transcender"] },
  // ── HISTÓRIA ──
  { id:26, group:"História",   name:"Origem",           items:["Órfão criado sozinho","Família nobre caída","Experimento","Criatura antiga","Mortal amaldiçoado","Sobrevivente de massacre","Escolhido pela profecia","Desertor","Reencarnação","Acidente de magia","Divindade exilada","Nasceu morto"] },
  { id:27, group:"História",   name:"Trauma Central",   items:["Perdeu tudo num dia","Traído pelo melhor amigo","Criado para ser arma","Amou quem não devia","Causou uma tragédia","Não lembra quem era","Sobreviveu quando não queria","Preso por anos","Viu algo que não devia","Descobriu uma verdade horrível"] },
  { id:28, group:"História",   name:"Motivação Atual",  items:["Vingar a família","Encontrar respostas","Destruir o sistema","Proteger um inocente","Completar a missão","Simplesmente sobreviver","Reparar um erro","Seguir um código","Servir a algo maior","Encontrar um lugar no mundo","Acabar com tudo","Descobrir quem é"] },
  { id:29, group:"História",   name:"Segredo Guardado", items:["É o vilão","Matou alguém inocente","Está morrendo","Ama o inimigo","Não sente mais emoções","Seu poder tem um preço horrível","Já foi outra pessoa","Sabe como tudo vai terminar","Foi o responsável pela tragédia","Está sendo controlado","É uma cópia"] },
  { id:30, group:"História",   name:"Relação com o Bem",items:["Herói convicto","Herói duvidoso","Neutro","Anti-herói","Vilão com razão","Vilão sem redenção","Além do bem e do mal","Muda conforme a narrativa","Acredita que é o herói da própria tragédia"] },
  // ── CENA / ESTÉTICA ──
  { id:31, group:"Cena",       name:"Ambiente",         items:["Floresta sombria","Cidade futurista","Ruínas antigas","Oceano profundo","Deserto","Castelo gótico","Espaço sideral","Submundo","Vila medieval","Laboratório","Dimensão fracturada","Jardim eterno","Favela cyberpunk"] },
  { id:32, group:"Cena",       name:"Época",            items:["Medieval","Renascimento","Século XIX","Anos 1920","Anos 80","Contemporâneo","Futuro próximo","Pós-apocalíptico","Fantasia sem tempo","Prehistórico","Mitológico"] },
  { id:33, group:"Cena",       name:"Clima / Atmosfera",items:["Neblina densa","Chuva pesada","Tempestade","Noite estrelada","Amanhecer","Pôr do sol violeta","Eclipse","Neve","Calor sufocante","Chuva de cinzas","Silêncio absoluto","Ar eletrificado"] },
  { id:34, group:"Cena",       name:"Iluminação",       items:["Luz dura lateral","Contra-luz dramático","Luz fria de lua","Chamas quentes","Néon","Bioluminescência","Sombra quase total","Luz divina de cima","Reflexo na água","Explosão ao fundo","Lampejo de raio"] },
  { id:35, group:"Cena",       name:"Paleta de Cores",  items:["Monocromático","Complementares vivos","Tons terrosos","Pastéis suaves","Neons saturados","Preto e vermelho","Azul e dourado","Verde e roxo","Sépia","Branco e preto sujo","Arco-íris desaturado"] },
  // ── ARTE ──
  { id:36, group:"Arte",       name:"Estilo Visual",    items:["Realista","Semi-realista","Anime","Chibi","Cartoon ocidental","Pixel Art","Esboço solto","Gravura antiga","Aquarela","Arte conceitual","Mangá","Art Nouveau","Woodblock"] },
  { id:37, group:"Arte",       name:"Pose / Composição",items:["Parado imponente","Em movimento","Olhando para trás","Curvado em dor","Abraçando a si mesmo","Em queda","De costas","Pose de ataque","Pose de defesa","Sentado pensativo","Deitado","Emergindo das sombras"] },
  { id:38, group:"Arte",       name:"Ângulo",           items:["Frontal","De baixo para cima","De cima para baixo","Perfil","3/4","Perspectiva extrema","Do ombro (over-the-shoulder)","Plongée dramático","Grande angular distorcido"] },
];

const GROUPS = [...new Set(ALL_WHEELS.map(w => w.group))];

const CX = 140, CY = 140, R = 122;
const polar = (deg) => {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
};
const slicePath = (start, end) => {
  const s = polar(start), e = polar(end);
  const large = end - start > 180 ? 1 : 0;
  return `M${CX},${CY} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${R},${R} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)} Z`;
};

function WheelSVG({ items, rotation, spinning }) {
  const n = items.length, seg = 360 / n;
  return (
    <svg width="280" height="280" style={{
      transform: `rotate(${rotation}deg)`,
      transition: spinning ? "transform 4.5s cubic-bezier(0.08,0.82,0.17,1)" : "none",
      display: "block", willChange: "transform",
    }}>
      <circle cx={CX} cy={CY} r={R+8} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14"/>
      <circle cx={CX} cy={CY} r={R+2} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5"/>
      {items.map((item, i) => {
        const start = i*seg, end = (i+1)*seg, mid = start+seg/2;
        const midRad = (mid-90)*Math.PI/180;
        const tR = R*0.63;
        const tx = CX+tR*Math.cos(midRad), ty = CY+tR*Math.sin(midRad);
        const fs = n>10?6.5:n>7?8:9.5;
        const maxC = n>10?8:n>7?11:14;
        const label = item.length>maxC ? item.slice(0,maxC-1)+"…" : item;
        return (
          <g key={i}>
            <path d={slicePath(start,end)} fill={COLORS[i%COLORS.length]} stroke="#0a0a1a" strokeWidth="1.5"/>
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${mid},${tx},${ty})`}
              fill="white" fontSize={fs} fontWeight="800" fontFamily="sans-serif"
              style={{filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.95))",userSelect:"none"}}>
              {label}
            </text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={14} fill="#0a0a1a"/>
      <circle cx={CX} cy={CY} r={10} fill="#1a1a30" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={4} fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

const GROUP_COLORS = {
  "Aparência":    "#FF6B6B",
  "Rosto":        "#FFD93D",
  "Cabelo":       "#C77DFF",
  "Membros":      "#4D96FF",
  "Roupa":        "#6BCB77",
  "Equipamento":  "#FF9F1C",
  "Personalidade":"#F72585",
  "História":     "#2EC4B6",
  "Cena":         "#48CAE4",
  "Arte":         "#B5E48C",
};

function WheelCard({ wheel, onSpin, onEdit, onDelete, showDelete }) {
  const gc = GROUP_COLORS[wheel.group] || "#aaa";
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)", border:`1px solid ${gc}30`,
      borderTop:`3px solid ${gc}`,
      borderRadius:"20px", padding:"18px 16px 16px",
      display:"flex", flexDirection:"column", alignItems:"center", gap:"12px",
      boxShadow:`0 6px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
    }}>
      <div style={{display:"flex",alignItems:"center",width:"100%",justifyContent:"space-between"}}>
        <div>
          <div style={{color:gc,fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"2px"}}>{wheel.group}</div>
          <div style={{color:"white",fontWeight:800,fontSize:"14px"}}>{wheel.name}</div>
        </div>
        <div style={{display:"flex",gap:"5px"}}>
          <button onClick={onEdit} style={{background:`${gc}22`,border:`1px solid ${gc}44`,borderRadius:"7px",color:gc,cursor:"pointer",padding:"4px 8px",fontSize:"12px"}}>✏️</button>
          {showDelete && <button onClick={onDelete} style={{background:"#FF6B6B22",border:"1px solid #FF6B6B44",borderRadius:"7px",color:"#FF6B6B",cursor:"pointer",padding:"4px 8px",fontSize:"12px"}}>🗑️</button>}
        </div>
      </div>
      <div style={{position:"relative"}}>
        <div style={{
          position:"absolute",top:"-4px",left:"50%",transform:"translateX(-50%)",zIndex:10,
          width:0,height:0,borderLeft:"11px solid transparent",borderRight:"11px solid transparent",
          borderTop:`20px solid ${gc}`,filter:`drop-shadow(0 2px 6px ${gc}80)`,
        }}/>
        <WheelSVG items={wheel.items} rotation={wheel.rotation} spinning={wheel.animating}/>
      </div>
      <div style={{minHeight:"32px",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {wheel.animating ? (
          <span style={{color:"rgba(255,255,255,0.35)",fontSize:"12px"}}>🌀 girando…</span>
        ) : wheel.result ? (
          <div style={{
            background:`linear-gradient(135deg,${gc}cc,${gc}88)`,
            borderRadius:"10px",padding:"6px 16px",
            color:"white",fontWeight:800,fontSize:"13px",
            boxShadow:`0 4px 16px ${gc}50`,
            animation:"pop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>🎯 {wheel.result}</div>
        ) : (
          <span style={{color:"rgba(255,255,255,0.15)",fontSize:"12px"}}>— —</span>
        )}
      </div>
      <button onClick={onSpin} disabled={wheel.animating} style={{
        width:"100%",padding:"9px",
        background:wheel.animating?"rgba(255,255,255,0.04)":`linear-gradient(135deg,${gc}dd,${gc}99)`,
        border:"none",borderRadius:"12px",color:"white",fontWeight:800,fontSize:"13px",
        cursor:wheel.animating?"not-allowed":"pointer",
        boxShadow:wheel.animating?"none":`0 3px 14px ${gc}40`,transition:"all 0.2s",
      }}>
        {wheel.animating?"🌀":"🎲"} {wheel.animating?"Girando…":"Girar"}
      </button>
    </div>
  );
}

function EditModal({ wheel, onClose, onSave }) {
  const [name, setName] = useState(wheel.name);
  const [grp,  setGrp]  = useState(wheel.group);
  const [text, setText] = useState(wheel.items.join("\n"));
  const save = () => {
    const items = text.split("\n").map(s=>s.trim()).filter(Boolean);
    if(items.length<2){alert("Pelo menos 2 opções!");return;}
    onSave({...wheel,name,group:grp,items});
  };
  const inp = {width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"10px 13px",color:"white",fontSize:"13px",outline:"none",boxSizing:"border-box"};
  const lbl = {display:"block",color:"rgba(255,255,255,0.45)",fontSize:"11px",letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"6px"};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#10102a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"20px",padding:"28px",width:"340px",boxShadow:"0 20px 60px rgba(0,0,0,0.7)"}}>
        <h3 style={{color:"white",marginBottom:"18px",fontSize:"17px",fontWeight:800}}>✏️ Editar Roda</h3>
        <label style={lbl}>Grupo</label>
        <select value={grp} onChange={e=>setGrp(e.target.value)} style={{...inp,marginBottom:"12px",cursor:"pointer"}}>
          {GROUPS.map(g=><option key={g} value={g} style={{background:"#10102a"}}>{g}</option>)}
          <option value="Personalizado" style={{background:"#10102a"}}>Personalizado</option>
        </select>
        <label style={lbl}>Nome</label>
        <input value={name} onChange={e=>setName(e.target.value)} style={{...inp,marginBottom:"12px"}}/>
        <label style={lbl}>Opções <span style={{color:"rgba(255,255,255,0.25)"}}>(uma por linha)</span></label>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={9} style={{...inp,resize:"vertical",height:"auto"}}/>
        <div style={{display:"flex",gap:"9px",marginTop:"18px"}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontWeight:700,fontSize:"13px"}}>Cancelar</button>
          <button onClick={save} style={{flex:2,padding:"10px",background:"linear-gradient(135deg,#4ECDC4,#4D96FF)",border:"none",borderRadius:"10px",color:"white",cursor:"pointer",fontWeight:800,fontSize:"14px",boxShadow:"0 4px 14px rgba(77,150,255,0.4)"}}>Salvar ✓</button>
        </div>
      </div>
    </div>
  );
}

const initWheels = ALL_WHEELS.map(w=>({...w,rotation:0,result:null,animating:false}));

export default function App() {
  const [wheels,      setWheels]      = useState(initWheels);
  const [editTarget,  setEditTarget]  = useState(null);
  const [activeGroup, setActiveGroup] = useState("Todos");
  const [spinning,    setSpinning]    = useState(false);
  const timers = useRef({});

  const computeWinner = (items, rot) => {
    const n=items.length, seg=360/n;
    const norm=((rot%360)+360)%360;
    return items[Math.floor(((360-norm)%360)/seg)%n];
  };

  const spinOne = useCallback((id) => {
    setWheels(prev=>prev.map(w=>{
      if(w.id!==id||w.animating) return w;
      const extra=Math.floor(Math.random()*360);
      const newRot=w.rotation+(6+Math.floor(Math.random()*4))*360+extra;
      const winner=computeWinner(w.items,newRot);
      clearTimeout(timers.current[id]);
      timers.current[id]=setTimeout(()=>{
        setWheels(p=>p.map(x=>x.id===id?{...x,animating:false,result:winner}:x));
      },4700);
      return{...w,rotation:newRot,animating:true,result:null};
    }));
  },[]);

  const spinAll = () => {
    const visible = wheels.filter(w => activeGroup==="Todos" || w.group===activeGroup);
    visible.forEach(w=>spinOne(w.id));
  };

  const addWheel = () => setWheels(prev=>[...prev,{
    id:Date.now(),group:"Personalizado",name:"Nova Roda",rotation:0,result:null,animating:false,
    items:["Opção 1","Opção 2","Opção 3","Opção 4"],
  }]);

  const saveEdit = (updated) => {
    setWheels(prev=>prev.map(w=>w.id===updated.id?{...w,...updated,rotation:0,result:null,animating:false}:w));
    setEditTarget(null);
  };

  const visible = activeGroup==="Todos" ? wheels : wheels.filter(w=>w.group===activeGroup);
  const results = wheels.filter(w=>w.result&&!w.animating);
  const anyAnimating = wheels.some(w=>w.animating);

  const allGroups = ["Todos", ...GROUPS];

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0a0a1a}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px}
        select option{background:#10102a}
      `}</style>
      <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 15% 10%,#1a0828 0%,#0a0a1e 50%,#080f1e 100%)",padding:"clamp(16px,3vw,40px)"}}>

        {/* HEADER */}
        <header style={{textAlign:"center",marginBottom:"28px"}}>
          <h1 style={{fontSize:"clamp(26px,5vw,46px)",fontWeight:900,background:"linear-gradient(135deg,#FF6B6B 0%,#FFD93D 28%,#6BCB77 55%,#4D96FF 80%,#C77DFF 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:"8px",lineHeight:1.1}}>
            🎨 Roda do Artista
          </h1>
          <p style={{color:"rgba(255,255,255,0.35)",fontSize:"14px",fontWeight:600}}>
            {ALL_WHEELS.length} rodas · cada detalhe do seu personagem, sorteado
          </p>
        </header>

        {/* SUMMARY BAR */}
        {results.length > 0 && (
          <div style={{maxWidth:"1300px",margin:"0 auto 24px",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px"}}>Personagem atual — {results.length}/{wheels.length} rodas sorteadas</span>
              <button onClick={()=>setWheels(p=>p.map(w=>({...w,result:null})))} style={{background:"rgba(255,100,100,0.1)",border:"1px solid rgba(255,100,100,0.2)",borderRadius:"8px",color:"rgba(255,120,120,0.8)",cursor:"pointer",padding:"4px 12px",fontSize:"12px",fontWeight:700}}>Limpar</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {results.map(w=>{
                const gc=GROUP_COLORS[w.group]||"#aaa";
                return(
                  <div key={w.id} style={{background:`${gc}15`,border:`1px solid ${gc}30`,borderRadius:"10px",padding:"6px 13px",display:"flex",gap:"7px",alignItems:"center"}}>
                    <span style={{color:`${gc}99`,fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{w.name}</span>
                    <span style={{color:"white",fontWeight:800,fontSize:"13px"}}>{w.result}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div style={{maxWidth:"1300px",margin:"0 auto 20px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <button onClick={spinAll} disabled={anyAnimating} style={{
              padding:"10px 26px",
              background:anyAnimating?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#C77DFF,#4D96FF)",
              border:"none",borderRadius:"14px",color:"white",fontWeight:800,fontSize:"14px",
              cursor:anyAnimating?"not-allowed":"pointer",
              boxShadow:anyAnimating?"none":"0 5px 24px rgba(199,125,255,0.4)",transition:"all 0.2s",
            }}>
              {anyAnimating?"🌀 Girando…":"✨ Girar "+( activeGroup==="Todos"?"Todas":"Grupo")}
            </button>
            <button onClick={addWheel} style={{padding:"10px 18px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"14px",color:"rgba(255,255,255,0.75)",fontWeight:700,fontSize:"14px",cursor:"pointer"}}>
              ＋ Nova Roda
            </button>
          </div>

          {/* GROUP FILTER */}
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
            {allGroups.map(g=>{
              const gc=GROUP_COLORS[g]||"#aaa";
              const active=activeGroup===g;
              return(
                <button key={g} onClick={()=>setActiveGroup(g)} style={{
                  padding:"6px 13px",fontSize:"12px",fontWeight:700,
                  background:active?(g==="Todos"?"rgba(255,255,255,0.15)":`${gc}25`):"rgba(255,255,255,0.04)",
                  border:active?(g==="Todos"?"1px solid rgba(255,255,255,0.3)":`1px solid ${gc}60`):"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"20px",color:active?(g==="Todos"?"white":gc):"rgba(255,255,255,0.4)",
                  cursor:"pointer",transition:"all 0.15s",
                }}>{g}</button>
              );
            })}
          </div>
        </div>

        {/* GRID */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"18px",maxWidth:"1300px",margin:"0 auto"}}>
          {visible.map(w=>(
            <WheelCard key={w.id} wheel={w}
              onSpin={()=>spinOne(w.id)}
              onEdit={()=>setEditTarget(w)}
              onDelete={()=>setWheels(p=>p.filter(x=>x.id!==w.id))}
              showDelete={wheels.length>1}
            />
          ))}
        </div>

        <p style={{textAlign:"center",marginTop:"40px",color:"rgba(255,255,255,0.12)",fontSize:"12px"}}>
          Filtre por grupo · Edite qualquer roda com ✏️ · Adicione categorias com ＋
        </p>
      </div>
      {editTarget && <EditModal wheel={editTarget} onClose={()=>setEditTarget(null)} onSave={saveEdit}/>}
    </>
  );
}
