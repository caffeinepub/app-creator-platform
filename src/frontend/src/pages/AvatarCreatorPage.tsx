import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Check, Copy, Download, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  shirtColor: string;
  pantsColor: string;
  bodyScale: number;
  height: number;
}

const DEFAULT_CONFIG: AvatarConfig = {
  skinColor: "#C68642",
  hairColor: "#2C1503",
  hairStyle: "short",
  eyeColor: "#3B5998",
  shirtColor: "#1a1a2e",
  pantsColor: "#2d2d2d",
  bodyScale: 50,
  height: 50,
};

function buildAvatarHTML(cfg: AvatarConfig): string {
  const bodyW = 0.18 + (cfg.bodyScale / 100) * 0.12; // 0.18 to 0.30
  const scale = 0.85 + (cfg.height / 100) * 0.3;

  const hairGeomCode = (() => {
    switch (cfg.hairStyle) {
      case "long":
        return `
  var hair = new THREE.Group();
  // Skull cap
  var cap = new THREE.Mesh(new THREE.SphereGeometry(0.23, 16, 10, 0, Math.PI*2, 0, Math.PI*0.6), new THREE.MeshStandardMaterial({color: ${JSON.stringify(cfg.hairColor)}, roughness:0.8}));
  cap.position.y = 0.04;
  hair.add(cap);
  // Long strands
  var strandGeo = new THREE.CylinderGeometry(0.01, 0.005, 0.6, 6);
  var strandMat = new THREE.MeshStandardMaterial({color: ${JSON.stringify(cfg.hairColor)}, roughness:0.9});
  for(var i=0;i<12;i++){
    var s=new THREE.Mesh(strandGeo,strandMat);
    var angle = (i/12)*Math.PI*2;
    s.position.set(Math.cos(angle)*0.2, -0.1, Math.sin(angle)*0.2);
    s.rotation.z = Math.cos(angle)*0.3;
    s.rotation.x = Math.sin(angle)*0.3;
    hair.add(s);
  }
  hair.position.set(0, 1.72, 0);
  human.add(hair);`;
      case "curly":
        return `
  var hairMat = new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.hairColor)},roughness:0.9});
  for(var i=0;i<30;i++){
    var curl = new THREE.Mesh(new THREE.TorusGeometry(0.04,0.02,6,8), hairMat);
    var a=(i/30)*Math.PI*2, r=0.12+Math.random()*0.1, h=Math.random()*0.15;
    curl.position.set(Math.cos(a)*r, 1.85+h, Math.sin(a)*r);
    curl.rotation.set(Math.random(),Math.random(),Math.random());
    human.add(curl);
  }`;
      case "bald":
        return "";
      default: // short
        return `
  var hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 10, 0, Math.PI*2, 0, Math.PI*0.55),
    new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.hairColor)},roughness:0.85})
  );
  hair.position.set(0, 1.78, 0);
  human.add(hair);`;
    }
  })();

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>*{margin:0;padding:0;overflow:hidden;background:#000;} #info{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.4);font:12px monospace;pointer-events:none;}</style>
</head>
<body>
<div id="info">Drag to rotate · Scroll to zoom</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script>
(function(){
  var renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.style.background='#080818';
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;';

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080818);
  scene.fog = new THREE.FogExp2(0x080818, 0.04);
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.01, 200);
  camera.position.set(0, 1.4, 4.5);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.0, 0);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 2; controls.maxDistance = 12;
  controls.update();

  // --- 3-point lighting ---
  scene.add(new THREE.AmbientLight(0x334466, 3));
  var keyLight = new THREE.DirectionalLight(0xffffff, 4);
  keyLight.position.set(3,8,5); keyLight.castShadow=true;
  keyLight.shadow.mapSize.set(1024,1024); scene.add(keyLight);
  var rimLight = new THREE.PointLight(0x00aaff, 6, 20);
  rimLight.position.set(-4,4,-3); scene.add(rimLight);
  var fillLight = new THREE.PointLight(0x7c3aed, 4, 20);
  fillLight.position.set(4,1,4); scene.add(fillLight);

  var skinMat = new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.skinColor)},roughness:0.75,metalness:0});
  var shirtMat = new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.shirtColor)},roughness:0.8,metalness:0.05});
  var pantsMat = new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.pantsColor)},roughness:0.85,metalness:0});
  var shoesMat = new THREE.MeshStandardMaterial({color:0x111111,roughness:0.9});

  function part(geo,mat,x,y,z,rx,ry,rz){
    var m=new THREE.Mesh(geo,mat);
    m.position.set(x,y,z);
    if(rx)m.rotation.x=rx; if(ry)m.rotation.y=ry; if(rz)m.rotation.z=rz;
    m.castShadow=true; m.receiveShadow=true;
    return m;
  }

  var human = new THREE.Group();
  var bodyW = ${bodyW};

  // Head
  human.add(part(new THREE.SphereGeometry(0.22,20,14),skinMat,0,1.72,0));
  // Neck
  human.add(part(new THREE.CylinderGeometry(0.08,0.09,0.18,10),skinMat,0,1.50,0));
  // Torso
  human.add(part(new THREE.CylinderGeometry(bodyW*1.1,bodyW,0.55,14),shirtMat,0,1.15,0));
  // Hips
  human.add(part(new THREE.CylinderGeometry(bodyW,bodyW*0.9,0.30,14),pantsMat,0,0.74,0));

  // Arms
  var lUA=part(new THREE.CylinderGeometry(0.065,0.055,0.30,8),shirtMat,-(bodyW+0.08),1.22,0.04,0,0,0.32);
  var lFA=part(new THREE.CylinderGeometry(0.05,0.04,0.28,8),skinMat,-(bodyW+0.18),0.92,0.04,0,0,0.16);
  var rUA=part(new THREE.CylinderGeometry(0.065,0.055,0.30,8),shirtMat,(bodyW+0.08),1.22,0.04,0,0,-0.32);
  var rFA=part(new THREE.CylinderGeometry(0.05,0.04,0.28,8),skinMat,(bodyW+0.18),0.92,0.04,0,0,-0.16);
  human.add(lUA,lFA,rUA,rFA);

  // Hands
  human.add(part(new THREE.SphereGeometry(0.045,8,6),skinMat,-(bodyW+0.22),0.77,0.04));
  human.add(part(new THREE.SphereGeometry(0.045,8,6),skinMat,(bodyW+0.22),0.77,0.04));

  // Legs
  var lUL=part(new THREE.CylinderGeometry(0.085,0.07,0.40,10),pantsMat,-0.12,0.43,0);
  var lLL=part(new THREE.CylinderGeometry(0.06,0.05,0.38,10),pantsMat,-0.12,0.05,0);
  var rUL=part(new THREE.CylinderGeometry(0.085,0.07,0.40,10),pantsMat,0.12,0.43,0);
  var rLL=part(new THREE.CylinderGeometry(0.06,0.05,0.38,10),pantsMat,0.12,0.05,0);
  human.add(lUL,lLL,rUL,rLL);
  // Feet
  human.add(part(new THREE.BoxGeometry(0.12,0.07,0.22),shoesMat,-0.12,-0.12,0.04));
  human.add(part(new THREE.BoxGeometry(0.12,0.07,0.22),shoesMat,0.12,-0.12,0.04));

  // Eyes
  var eyeMat=new THREE.MeshStandardMaterial({color:${JSON.stringify(cfg.eyeColor)},roughness:0.1,metalness:0.2,emissive:${JSON.stringify(cfg.eyeColor)},emissiveIntensity:0.2});
  human.add(part(new THREE.SphereGeometry(0.038,8,8),eyeMat,-0.08,1.74,0.19));
  human.add(part(new THREE.SphereGeometry(0.038,8,8),eyeMat,0.08,1.74,0.19));
  // Pupils
  var pupilMat=new THREE.MeshStandardMaterial({color:0x050505});
  human.add(part(new THREE.SphereGeometry(0.018,6,6),pupilMat,-0.08,1.74,0.225));
  human.add(part(new THREE.SphereGeometry(0.018,6,6),pupilMat,0.08,1.74,0.225));

  ${hairGeomCode}

  human.scale.setScalar(${scale});
  scene.add(human);

  // Ground
  var ground=new THREE.Mesh(new THREE.CircleGeometry(4,64),new THREE.MeshStandardMaterial({color:0x0a0a1a,roughness:0.95}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.15*${scale}; ground.receiveShadow=true;
  scene.add(ground);

  // Glow ring on ground
  var ringGeo=new THREE.RingGeometry(0.6,0.8,64);
  var ringMat=new THREE.MeshBasicMaterial({color:0x7c3aed,side:THREE.DoubleSide,transparent:true,opacity:0.4});
  var ring=new THREE.Mesh(ringGeo,ringMat);
  ring.rotation.x=-Math.PI/2; ring.position.y=-0.14*${scale};
  scene.add(ring);

  // Background stars
  var starsGeo=new THREE.BufferGeometry();
  var sp=new Float32Array(2000*3);
  for(var i=0;i<2000;i++){sp[i*3]=(Math.random()-.5)*80;sp[i*3+1]=(Math.random()-.5)*80;sp[i*3+2]=(Math.random()-.5)*80;}
  starsGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
  scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffffff,size:0.08,transparent:true,opacity:0.6})));

  // postMessage updates
  window.addEventListener('message', function(e){
    if(!e.data||e.data.type!=='avatarUpdate') return;
    var d=e.data;
    if(d.skinColor) skinMat.color.set(d.skinColor);
    if(d.shirtColor) shirtMat.color.set(d.shirtColor);
    if(d.pantsColor) pantsMat.color.set(d.pantsColor);
    if(d.eyeColor){eyeMat.color.set(d.eyeColor);eyeMat.emissive.set(d.eyeColor);}
  });

  var clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
    // Slow idle sway
    human.rotation.y = t*0.3;
    // Breathing
    var breathe=1+Math.sin(t*1.2)*0.008;
    lUA.rotation.z=0.32+Math.sin(t*1.2)*0.02;
    rUA.rotation.z=-0.32-Math.sin(t*1.2)*0.02;
    ring.material.opacity=0.3+Math.sin(t*2)*0.15;
    controls.update();
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',function(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
})();
</script>
</body>
</html>`;
}

export default function AvatarCreatorPage() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [html, setHtml] = useState(() => buildAvatarHTML(DEFAULT_CONFIG));
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rebuildTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    (patch: Partial<AvatarConfig>) => {
      const next = { ...config, ...patch };
      setConfig(next);
      // For color/style changes that require full rebuild (hair style, body scale, height)
      const needsRebuild =
        patch.hairStyle !== undefined ||
        patch.bodyScale !== undefined ||
        patch.height !== undefined;
      if (needsRebuild) {
        if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
        rebuildTimer.current = setTimeout(() => {
          setHtml(buildAvatarHTML(next));
        }, 300);
      } else {
        // Live update via postMessage
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage(
            { type: "avatarUpdate", ...patch },
            "*",
          );
        }
      }
    },
    [config],
  );

  useEffect(() => {
    return () => {
      if (rebuildTimer.current) clearTimeout(rebuildTimer.current);
    };
  }, []);

  const handleExport = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const canvas = iframe.contentWindow.document.querySelector(
      "canvas",
    ) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `noventra-avatar-${Date.now()}.png`;
    a.click();
  }, []);

  const handleCopyCode = useCallback(async () => {
    const snippet = `// Noventra Avatar — Three.js r128\n// Paste in a script tag with Three.js loaded\n${html.slice(0, 500)}...`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-background flex flex-col"
      data-ocid="avatar.page"
    >
      {/* Header */}
      <div className="border-b border-border/30 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">
            Clone Avatar Creator
          </h1>
          <p className="text-xs text-muted-foreground">
            3D humanoid avatar customization studio
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Preview */}
        <div className="flex-1 relative bg-[#080818]">
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="3D Avatar"
            sandbox="allow-scripts"
            className="w-full h-full absolute inset-0"
            style={{ border: "none" }}
          />
          {/* Action buttons overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Button
              onClick={handleExport}
              size="sm"
              className="bg-black/60 border border-white/20 hover:bg-black/80 backdrop-blur-md text-white gap-1.5"
              data-ocid="avatar.download_button"
            >
              <Download className="w-3.5 h-3.5" /> Export PNG
            </Button>
            <Button
              onClick={handleCopyCode}
              size="sm"
              variant="outline"
              className="bg-black/60 border-white/20 hover:bg-black/80 backdrop-blur-md gap-1.5"
              data-ocid="avatar.secondary_button"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>

        {/* Right Controls */}
        <div className="w-72 shrink-0 border-l border-border/30 flex flex-col gap-5 p-5 overflow-y-auto bg-[#0a0a12]">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Customization
          </p>

          {/* Skin Tone */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Skin Tone</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.skinColor}
                onChange={(e) => update({ skinColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                data-ocid="avatar.skin.input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {config.skinColor}
              </span>
            </div>
          </div>

          {/* Hair Color */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Hair Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.hairColor}
                onChange={(e) => update({ hairColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                data-ocid="avatar.hair_color.input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {config.hairColor}
              </span>
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Hair Style</Label>
            <Select
              value={config.hairStyle}
              onValueChange={(v) => update({ hairStyle: v })}
            >
              <SelectTrigger
                className="bg-white/[0.03] border-white/10"
                data-ocid="avatar.hairstyle.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="curly">Curly</SelectItem>
                <SelectItem value="bald">Bald</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Eye Color */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Eye Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.eyeColor}
                onChange={(e) => update({ eyeColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                data-ocid="avatar.eye_color.input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {config.eyeColor}
              </span>
            </div>
          </div>

          {/* Shirt Color */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Shirt Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.shirtColor}
                onChange={(e) => update({ shirtColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                data-ocid="avatar.shirt_color.input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {config.shirtColor}
              </span>
            </div>
          </div>

          {/* Pants Color */}
          <div className="space-y-2">
            <Label className="text-xs text-foreground/70">Pants Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.pantsColor}
                onChange={(e) => update({ pantsColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                data-ocid="avatar.pants_color.input"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {config.pantsColor}
              </span>
            </div>
          </div>

          {/* Body Type */}
          <div className="space-y-3">
            <Label className="text-xs text-foreground/70">
              Body Type —{" "}
              {config.bodyScale < 35
                ? "Slim"
                : config.bodyScale > 65
                  ? "Muscular"
                  : "Athletic"}
            </Label>
            <Slider
              value={[config.bodyScale]}
              onValueChange={([v]) => update({ bodyScale: v })}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-violet-500"
              data-ocid="avatar.body.input"
            />
          </div>

          {/* Height */}
          <div className="space-y-3">
            <Label className="text-xs text-foreground/70">
              Height —{" "}
              {config.height < 35
                ? "Short"
                : config.height > 65
                  ? "Tall"
                  : "Average"}
            </Label>
            <Slider
              value={[config.height]}
              onValueChange={([v]) => update({ height: v })}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-cyan-500"
              data-ocid="avatar.height.input"
            />
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-xs text-violet-400 font-semibold mb-1">
              💡 Pro tip
            </p>
            <p className="text-xs text-muted-foreground">
              Drag to rotate. Scroll to zoom. Changes update in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
