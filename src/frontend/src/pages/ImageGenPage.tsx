import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const STYLE_PRESETS = [
  { id: "photorealistic", label: "Photorealistic" },
  { id: "cinematic", label: "Cinematic" },
  { id: "oil_painting", label: "Oil Painting" },
  { id: "anime", label: "Anime" },
  { id: "3d_render", label: "3D Render" },
  { id: "watercolor", label: "Watercolor" },
  { id: "neon_cyberpunk", label: "Neon Cyberpunk" },
  { id: "macro", label: "Macro Photography" },
];

const ASPECT_RATIOS = [
  { id: "1:1", w: 512, h: 512 },
  { id: "16:9", w: 640, h: 360 },
  { id: "4:3", w: 640, h: 480 },
  { id: "9:16", w: 360, h: 640 },
];

function buildImageHTML(
  prompt: string,
  style: string,
  width: number,
  height: number,
): string {
  const keywords = prompt.toLowerCase().split(/\s+/);
  const hasKeyword = (words: string[]) =>
    words.some((w) => keywords.includes(w));

  // Color extraction
  const colorMap: Record<string, string> = {
    red: "#ff2244",
    blue: "#2244ff",
    green: "#22ff44",
    purple: "#aa22ff",
    orange: "#ff8800",
    yellow: "#ffee00",
    pink: "#ff44aa",
    cyan: "#00eeff",
    white: "#ffffff",
    black: "#111111",
    gold: "#ffcc00",
    silver: "#ccccdd",
    sunset: "#ff6622",
    ocean: "#0066aa",
    forest: "#115522",
    fire: "#ff4400",
    sky: "#44aaff",
    night: "#050520",
    space: "#030318",
    neon: "#00ffaa",
  };
  let primaryColor = "#7c3aed";
  let secondaryColor = "#06b6d4";
  for (const [word, color] of Object.entries(colorMap)) {
    if (keywords.includes(word)) {
      primaryColor = color;
      break;
    }
  }

  // Subject detection
  const isPortrait = hasKeyword([
    "portrait",
    "face",
    "person",
    "woman",
    "man",
    "girl",
    "boy",
    "human",
  ]);
  const isLandscape = hasKeyword([
    "landscape",
    "mountain",
    "forest",
    "ocean",
    "sea",
    "sky",
    "sunset",
    "nature",
  ]);
  const isCity = hasKeyword([
    "city",
    "urban",
    "building",
    "street",
    "cyberpunk",
    "neon",
    "night",
  ]);
  const isSpace = hasKeyword([
    "space",
    "galaxy",
    "star",
    "nebula",
    "cosmos",
    "universe",
    "planet",
  ]);

  const styleConfigs: Record<
    string,
    { bg: string; overlay: string; effects: string }
  > = {
    photorealistic: {
      bg: "radial-gradient(ellipse at 30% 30%, #c9a87c 0%, #8a6545 40%, #4a3525 100%)",
      overlay: "rgba(0,0,0,0.1)",
      effects: "grain",
    },
    cinematic: {
      bg: "linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 30%, #0d1a3a 60%, #000000 100%)",
      overlay: "rgba(0,80,120,0.15)",
      effects: "grain+bokeh+bars",
    },
    oil_painting: {
      bg: `radial-gradient(ellipse, ${primaryColor}88 0%, ${secondaryColor}44 50%, #1a0a05 100%)`,
      overlay: "rgba(80,40,0,0.2)",
      effects: "texture+strokes",
    },
    anime: {
      bg: "linear-gradient(135deg, #1a1a3e 0%, #2d1b69 40%, #0a0a1e 100%)",
      overlay: "rgba(150,50,255,0.1)",
      effects: "clean+glow",
    },
    "3d_render": {
      bg: "radial-gradient(circle at 40% 40%, #1a1a2e 0%, #0d0d1a 60%, #050510 100%)",
      overlay: "rgba(0,200,255,0.05)",
      effects: "depth+gloss",
    },
    watercolor: {
      bg: `radial-gradient(ellipse, ${primaryColor}44 0%, #e8d5c4 40%, #b8c5d0 100%)`,
      overlay: "rgba(255,255,255,0.3)",
      effects: "wash+bleed",
    },
    neon_cyberpunk: {
      bg: "linear-gradient(180deg, #000000 0%, #0a0010 40%, #050520 100%)",
      overlay: "rgba(0,0,0,0)",
      effects: "neon+grid+rain",
    },
    macro: {
      bg: `radial-gradient(circle at 50% 50%, ${primaryColor}cc 0%, ${primaryColor}44 30%, #0a0a0a 100%)`,
      overlay: "rgba(0,0,0,0.05)",
      effects: "bokeh+sharp",
    },
  };

  const cfg = styleConfigs[style] || styleConfigs.cinematic;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:${width}px;height:${height}px;overflow:hidden;background:#000;}</style>
</head>
<body>
<canvas id="c" width="${width}" height="${height}"></canvas>
<script>
(function(){
  var W=${width}, H=${height};
  var c=document.getElementById('c');
  var ctx=c.getContext('2d');

  // --- Simplex-like noise (value noise) ---
  var perm=new Uint8Array(512);
  for(var i=0;i<256;i++) perm[i]=i;
  for(var i=255;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=perm[i];perm[i]=perm[j];perm[j]=t;}
  for(var i=0;i<256;i++) perm[256+i]=perm[i];
  function fade(t){return t*t*t*(t*(t*6-15)+10);}
  function lerp(a,b,t){return a+t*(b-a);}
  function grad(h,x,y){var u=(h&1)?x:-x,v=(h&2)?y:-y;return u+v;}
  function noise2(x,y){
    var xi=Math.floor(x)&255,yi=Math.floor(y)&255;
    var xf=x-Math.floor(x),yf=y-Math.floor(y);
    var u=fade(xf),v=fade(yf);
    var aa=perm[perm[xi]+yi],ab=perm[perm[xi]+yi+1];
    var ba=perm[perm[xi+1]+yi],bb=perm[perm[xi+1]+yi+1];
    return lerp(lerp(grad(aa,xf,yf),grad(ba,xf-1,yf),u),lerp(grad(ab,xf,yf-1),grad(bb,xf-1,yf-1),u),v);
  }
  function fbm(x,y,oct){
    var val=0,amp=0.5,freq=1,max=0;
    for(var i=0;i<oct;i++){val+=noise2(x*freq,y*freq)*amp;max+=amp;amp*=0.5;freq*=2;}
    return val/max;
  }

  // --- Primary gradient background ---
  var bg=${JSON.stringify(cfg.bg)};
  function parseGradient(s, ctx2, w, h){
    if(s.startsWith('linear-gradient')){
      var m=s.match(/linear-gradient\(([^,]+),(.+)\)/);
      if(!m)return '#000';
      var angle=parseFloat(m[1])||135;
      var rad=angle*Math.PI/180;
      var len=Math.abs(w*Math.cos(rad))+Math.abs(h*Math.sin(rad));
      var cx=w/2,cy=h/2;
      var x0=cx-Math.cos(rad)*len/2,y0=cy-Math.sin(rad)*len/2;
      var x1=cx+Math.cos(rad)*len/2,y1=cy+Math.sin(rad)*len/2;
      var g=ctx2.createLinearGradient(x0,y0,x1,y1);
      var stops=m[2].match(/(#[a-fA-F0-9]+|rgba?\([^)]+\))\s*(\d+%)?/g)||[];
      stops.forEach(function(st,i){
        var c2=st.match(/(#[a-fA-F0-9]+|rgba?\([^)]+\))/)[0];
        var p=st.match(/(\d+)%/);
        g.addColorStop(p?parseFloat(p[1])/100:i/(stops.length-1||1),c2);
      });
      return g;
    } else if(s.startsWith('radial-gradient')){
      var m=s.match(/radial-gradient\(([^,]+),(.+)\)/);
      if(!m)return '#333';
      var pos=m[1].match(/([\d.]+)%\s*([\d.]+)%/);
      var cx=pos?w*parseFloat(pos[1])/100:w/2;
      var cy2=pos?h*parseFloat(pos[2])/100:h/2;
      var g=ctx2.createRadialGradient(cx,cy2,0,cx,cy2,Math.max(w,h)*0.7);
      var stops=m[2].match(/(#[a-fA-F0-9]+|rgba?\([^)]+\))[^,]*/g)||[];
      stops.forEach(function(st,i){
        var c2=st.match(/(#[a-fA-F0-9]+|rgba?\([^)]+\))/)[0];
        var p=st.match(/([\d.]+)%/);
        g.addColorStop(p?parseFloat(p[1])/100:i/(stops.length-1||1),c2);
      });
      return g;
    }
    return s;
  }

  ctx.fillStyle=parseGradient(bg,ctx,W,H);
  ctx.fillRect(0,0,W,H);

  var style=${JSON.stringify(style)};
  var primaryColor=${JSON.stringify(primaryColor)};
  var secondaryColor=${JSON.stringify(secondaryColor)};
  var isPortrait=${isPortrait};
  var isLandscape=${isLandscape};
  var isCity=${isCity};
  var isSpace=${isSpace};

  // --- Style-specific rendering ---
  if(style==='neon_cyberpunk'||isCity){
    // Neon grid
    ctx.strokeStyle='rgba(0,255,200,0.15)'; ctx.lineWidth=1;
    for(var x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(var y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Perspective grid
    ctx.strokeStyle='rgba(150,0,255,0.2)';
    for(var i=0;i<20;i++){
      var px=W*i/19;
      ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(W/2,H);ctx.stroke();
    }
    // Neon buildings
    var buildingColors=['#ff00ff','#00ffff','#ff4400','#00ff88'];
    for(var i=0;i<8;i++){
      var bx=W*i/8+Math.random()*20;
      var bh=H*0.3+Math.random()*H*0.4;
      var bw=W/10+Math.random()*W/12;
      ctx.fillStyle='rgba(10,0,20,0.9)';
      ctx.fillRect(bx,H-bh,bw,bh);
      ctx.strokeStyle=buildingColors[i%buildingColors.length];
      ctx.lineWidth=1.5;
      ctx.strokeRect(bx,H-bh,bw,bh);
      // Windows
      ctx.fillStyle=buildingColors[i%buildingColors.length];
      for(var wy=H-bh+10;wy<H-10;wy+=20){
        for(var wx=bx+8;wx<bx+bw-8;wx+=18){
          if(Math.random()>0.4){ctx.fillRect(wx,wy,8,10);}
        }
      }
    }
    // Rain streaks
    ctx.strokeStyle='rgba(100,200,255,0.3)'; ctx.lineWidth=0.5;
    for(var i=0;i<200;i++){
      var rx=Math.random()*W,ry=Math.random()*H,rl=5+Math.random()*15;
      ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+rl);ctx.stroke();
    }
    // Glowing orbs
    for(var i=0;i<5;i++){
      var ox=Math.random()*W,oy=H*0.2+Math.random()*H*0.5;
      var gr=ctx.createRadialGradient(ox,oy,0,ox,oy,60+Math.random()*80);
      gr.addColorStop(0,buildingColors[i%4].replace('#','rgba(').replace(/(..)(..)(..)$/,function(_,r,g,b){return parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16)+',0.6)';}));
      gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
    }
  }

  if(isSpace||style==='3d_render'){
    // Stars
    for(var i=0;i<800;i++){
      var sx=Math.random()*W,sy=Math.random()*H;
      var ss=Math.random()*2.5;
      ctx.beginPath();ctx.arc(sx,sy,ss,0,Math.PI*2);
      var br=0.5+Math.random()*0.5;
      ctx.fillStyle='rgba(255,255,255,'+br+')';
      ctx.fill();
    }
    // Nebula clouds using noise
    var imgd=ctx.createImageData(W,H);
    for(var px2=0;px2<W;px2+=2) for(var py2=0;py2<H;py2+=2){
      var n=fbm(px2/180,py2/180,5);
      if(n>0.1){
        var idx=(py2*W+px2)*4;
        var alpha=Math.min(255,n*180);
        imgd.data[idx]=80; imgd.data[idx+1]=0; imgd.data[idx+2]=160;
        imgd.data[idx+3]=alpha;
        imgd.data[idx+4]=80; imgd.data[idx+5]=0; imgd.data[idx+6]=160;
        imgd.data[idx+7]=alpha;
      }
    }
    ctx.putImageData(imgd,0,0,0,0,W,H);
    // Planet
    var px3=W*0.6,py3=H*0.4,pr=Math.min(W,H)*0.18;
    var pg=ctx.createRadialGradient(px3-pr*0.3,py3-pr*0.3,pr*0.05,px3,py3,pr);
    pg.addColorStop(0,'#aaddff'); pg.addColorStop(0.4,'#4488cc'); pg.addColorStop(1,'#112244');
    ctx.beginPath();ctx.arc(px3,py3,pr,0,Math.PI*2);
    ctx.fillStyle=pg; ctx.fill();
    // Ring
    ctx.save();ctx.translate(px3,py3);ctx.scale(1,0.3);
    ctx.beginPath();ctx.arc(0,0,pr*1.6,0,Math.PI*2);
    ctx.strokeStyle='rgba(100,180,255,0.5)';ctx.lineWidth=8;ctx.stroke();
    ctx.restore();
  }

  if(isPortrait||style==='photorealistic'){
    // Face-like composition
    var fx=W/2,fy=H*0.38,fr=Math.min(W,H)*0.22;
    var fg=ctx.createRadialGradient(fx-fr*0.2,fy-fr*0.2,fr*0.1,fx,fy,fr);
    fg.addColorStop(0,'#fdd9b5');fg.addColorStop(0.6,'#c68642');fg.addColorStop(1,'#7d4813');
    ctx.beginPath();ctx.arc(fx,fy,fr,0,Math.PI*2);
    ctx.fillStyle=fg;ctx.fill();
    // Hair
    var hg=ctx.createRadialGradient(fx,fy-fr*0.5,0,fx,fy,fr*1.2);
    hg.addColorStop(0,'#2c1503');hg.addColorStop(1,'#100800');
    ctx.beginPath();ctx.ellipse(fx,fy-fr*0.7,fr*1.1,fr*0.9,0,Math.PI,2*Math.PI);
    ctx.fillStyle=hg;ctx.fill();
    // Eyes - catchlight
    ctx.fillStyle='#2244aa';
    ctx.beginPath();ctx.arc(fx-fr*0.28,fy-fr*0.1,fr*0.08,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(fx+fr*0.28,fy-fr*0.1,fr*0.08,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='white';
    ctx.beginPath();ctx.arc(fx-fr*0.25,fy-fr*0.13,fr*0.025,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(fx+fr*0.31,fy-fr*0.13,fr*0.025,0,Math.PI*2);ctx.fill();
    // Background bokeh
    for(var i=0;i<30;i++){
      var bx2=Math.random()*W,by2=Math.random()*H;
      var br2=10+Math.random()*40;
      var bg2=ctx.createRadialGradient(bx2,by2,0,bx2,by2,br2);
      bg2.addColorStop(0,'rgba(180,120,80,0.15)');bg2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath();ctx.arc(bx2,by2,br2,0,Math.PI*2);
      ctx.fillStyle=bg2;ctx.fill();
    }
  }

  if(isLandscape){
    // Mountains
    function mountain(x1,x2,peak,col){
      ctx.beginPath();ctx.moveTo(x1,H);ctx.lineTo((x1+x2)/2,peak);
      ctx.lineTo(x2,H);ctx.closePath();
      ctx.fillStyle=col;ctx.fill();
    }
    mountain(0,W*0.5,H*0.15,'#334455');
    mountain(W*0.2,W*0.8,H*0.2,'#445566');
    mountain(W*0.5,W,H*0.18,'#2d3d4d');
    mountain(W*0.1,W*0.6,H*0.35,'#556677');
    // Snow caps
    ctx.fillStyle='#ccddee';
    ctx.beginPath();ctx.moveTo(W*0.25,H*0.15);ctx.lineTo(W*0.3,H*0.28);ctx.lineTo(W*0.2,H*0.28);ctx.closePath();ctx.fill();
    // Sky gradient
    var sg=ctx.createLinearGradient(0,0,0,H*0.5);
    sg.addColorStop(0,'rgba(5,5,30,0.7)');sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=sg;ctx.fillRect(0,0,W,H*0.5);
  }

  if(style==='watercolor'){
    // Watercolor bleed effect
    for(var i=0;i<200;i++){
      var wx=Math.random()*W,wy=Math.random()*H;
      var wr=20+Math.random()*80;
      var a=0.02+Math.random()*0.06;
      var hue=Math.random()*60+180;
      ctx.beginPath();ctx.arc(wx,wy,wr,0,Math.PI*2);
      ctx.fillStyle='hsla('+hue+',60%,70%,'+a+')';ctx.fill();
    }
  }

  if(style==='oil_painting'){
    // Impasto brushstrokes
    for(var i=0;i<1500;i++){
      var ox=Math.random()*W,oy=Math.random()*H;
      var ow=3+Math.random()*20,oh=1+Math.random()*4;
      var oa=Math.random()*Math.PI;
      ctx.save();ctx.translate(ox,oy);ctx.rotate(oa);
      var hue2=Math.random()*360;
      ctx.fillStyle='hsla('+hue2+',40%,50%,0.15)';
      ctx.fillRect(-ow/2,-oh/2,ow,oh);
      ctx.restore();
    }
  }

  if(style==='anime'){
    // Clean cel-shading lines
    ctx.strokeStyle='rgba(150,100,255,0.4)'; ctx.lineWidth=2;
    for(var i=0;i<6;i++){
      ctx.beginPath();
      ctx.moveTo(Math.random()*W,0);
      ctx.bezierCurveTo(Math.random()*W,H/3,Math.random()*W,H*2/3,Math.random()*W,H);
      ctx.stroke();
    }
    // Speed lines
    for(var i=0;i<40;i++){
      var ax=W/2,ay=H/2;
      var angle=Math.PI*2*i/40;
      ctx.strokeStyle='rgba(255,255,255,0.05)';
      ctx.lineWidth=0.5+Math.random()*2;
      ctx.beginPath();
      ctx.moveTo(ax,ay);
      ctx.lineTo(ax+Math.cos(angle)*W,ay+Math.sin(angle)*H);
      ctx.stroke();
    }
  }

  // --- Particle system (universal) ---
  var pCount=style==='macro'?50:200;
  for(var i=0;i<pCount;i++){
    var px=Math.random()*W,py=Math.random()*H;
    var ps=0.5+Math.random()*(style==='macro'?8:3);
    var pa=0.1+Math.random()*0.5;
    var ph=Math.random()*360;
    ctx.beginPath();ctx.arc(px,py,ps,0,Math.PI*2);
    ctx.fillStyle='hsla('+ph+',80%,70%,'+pa+')';ctx.fill();
  }

  // --- Film grain overlay ---
  if(style==='cinematic'||style==='photorealistic'){
    var grainData=ctx.createImageData(W,H);
    for(var i=0;i<grainData.data.length;i+=4){
      var g2=(Math.random()-0.5)*40;
      grainData.data[i]=128+g2; grainData.data[i+1]=128+g2; grainData.data[i+2]=128+g2;
      grainData.data[i+3]=18;
    }
    ctx.putImageData(grainData,0,0);
  }

  // --- Cinematic letterbox bars ---
  if(style==='cinematic'){
    ctx.fillStyle='rgba(0,0,0,0.85)';
    ctx.fillRect(0,0,W,H*0.09);
    ctx.fillRect(0,H*0.91,W,H*0.09);
  }

  // --- Vignette ---
  var vig=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.2,W/2,H/2,Math.max(W,H)*0.8);
  vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);

  // --- Prompt watermark ---
  ctx.fillStyle='rgba(255,255,255,0.18)';
  ctx.font='bold '+Math.round(W*0.018)+'px Inter,sans-serif';
  ctx.textAlign='center';
  var prompt=${JSON.stringify(prompt.slice(0, 60))};
  ctx.fillText(prompt+(prompt.length>=60?'...':''), W/2, H-16);
  ctx.font='bold '+Math.round(W*0.012)+'px Inter,sans-serif';
  ctx.fillStyle='rgba(124,58,237,0.6)';
  ctx.fillText('NOVENTRA IMAGE STUDIO',W/2,H-4);
})();
</script>
</body>
</html>`;
}

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [ratio, setRatio] = useState("16:9");
  const [generating, setGenerating] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentRatio =
    ASPECT_RATIOS.find((r) => r.id === ratio) ?? ASPECT_RATIOS[1];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const output = buildImageHTML(
      prompt,
      style,
      currentRatio.w,
      currentRatio.h,
    );
    setHtml(output);
    setGenerating(false);
  }, [prompt, style, currentRatio]);

  const handleDownload = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const canvas = iframe.contentWindow.document.querySelector(
      "canvas",
    ) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `noventra-image-${Date.now()}.png`;
    a.click();
  }, []);

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-background flex flex-col"
      data-ocid="imagegen.page"
    >
      {/* Page header */}
      <div className="border-b border-border/30 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">
            Noventra Image Studio
          </h1>
          <p className="text-xs text-muted-foreground">
            Procedural AI image synthesis
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 shrink-0 border-r border-border/30 flex flex-col gap-5 p-5 overflow-y-auto">
          {/* Prompt */}
          <div className="space-y-2">
            <label
              htmlFor="img-prompt"
              className="text-xs font-semibold text-foreground/70 uppercase tracking-wider"
            >
              Describe your image
            </label>
            <Textarea
              id="img-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic portrait of a cyberpunk warrior in neon-lit Tokyo rain..."
              className="h-28 resize-none bg-white/[0.03] border-white/10 text-sm focus:border-violet-500/50 focus:ring-violet-500/20 placeholder:text-muted-foreground/40"
              data-ocid="imagegen.textarea"
            />
          </div>

          {/* Style presets */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Style
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  data-ocid={`imagegen.${s.id}.toggle`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    style === s.id
                      ? "bg-violet-600/30 border-violet-500/60 text-violet-300"
                      : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Aspect Ratio
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRatio(r.id)}
                  data-ocid={`imagegen.ratio.${r.id.replace(":", "x")}.toggle`}
                  className={`py-2 rounded-lg text-xs font-mono border transition-all ${
                    ratio === r.id
                      ? "bg-cyan-600/30 border-cyan-500/60 text-cyan-300"
                      : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0 text-white font-semibold h-11"
            data-ocid="imagegen.primary_button"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {html && (
            <Button
              variant="outline"
              onClick={handleDownload}
              className="w-full border-white/10 hover:border-violet-500/50 gap-2"
              data-ocid="imagegen.download_button"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </Button>
          )}

          {/* Tips */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
            <p className="text-xs font-semibold text-violet-400">💡 Tips</p>
            <p className="text-xs text-muted-foreground">
              Use keywords like{" "}
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                portrait
              </Badge>
              ,{" "}
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                space
              </Badge>
              ,{" "}
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                landscape
              </Badge>{" "}
              for best results.
            </p>
          </div>
        </div>

        {/* Right Panel — Preview */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 bg-[#050508]">
          {generating ? (
            <div
              className="flex flex-col items-center gap-4"
              data-ocid="imagegen.loading_state"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-cyan-500/60 animate-spin" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                Synthesizing pixels...
              </p>
            </div>
          ) : html ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div
                className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/30"
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 14rem)",
                  aspectRatio: `${currentRatio.w}/${currentRatio.h}`,
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={html}
                  title="Generated image"
                  sandbox="allow-scripts"
                  className="w-full h-full"
                  style={{ display: "block" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs border-violet-500/40 text-violet-400"
                >
                  {style.replace("_", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-cyan-500/40 text-cyan-400"
                >
                  {ratio}
                </Badge>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-all"
                  data-ocid="imagegen.secondary_button"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-4 text-center"
              data-ocid="imagegen.empty_state"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-900/40 to-cyan-900/40 border border-white/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-violet-400/60" />
              </div>
              <div>
                <p className="text-foreground font-semibold mb-1">
                  Ready to create
                </p>
                <p className="text-sm text-muted-foreground">
                  Enter a prompt and click Generate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
