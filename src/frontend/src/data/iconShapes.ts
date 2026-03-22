export interface SVGShapeDefinition {
  id: string;
  name: string;
  category: "Animals" | "Geometric" | "Characters";
  svgContent: string;
  defaultFgColor: string;
  defaultBgColor: string;
}

export const ICON_SHAPES_LIBRARY: SVGShapeDefinition[] = [
  // Animals
  {
    id: "dog",
    name: "Dog",
    category: "Animals",
    defaultFgColor: "#8B4513",
    defaultBgColor: "#000000",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="55" ry="40" fill="FG"/>
      <!-- Head -->
      <circle cx="100" cy="75" r="35" fill="FG"/>
      <!-- Snout -->
      <ellipse cx="100" cy="90" rx="18" ry="12" fill="BG" opacity="0.3"/>
      <!-- Nose -->
      <ellipse cx="100" cy="84" rx="8" ry="5" fill="BG"/>
      <!-- Eyes -->
      <circle cx="87" cy="68" r="5" fill="BG"/>
      <circle cx="113" cy="68" r="5" fill="BG"/>
      <circle cx="88" cy="67" r="2" fill="white"/>
      <circle cx="114" cy="67" r="2" fill="white"/>
      <!-- Ears -->
      <ellipse cx="72" cy="55" rx="14" ry="20" fill="BG" transform="rotate(-15 72 55)"/>
      <ellipse cx="128" cy="55" rx="14" ry="20" fill="BG" transform="rotate(15 128 55)"/>
      <!-- Tail -->
      <path d="M155 120 Q180 90 170 70" stroke="FG" stroke-width="10" fill="none" stroke-linecap="round"/>
      <!-- Legs -->
      <rect x="60" y="155" width="18" height="30" rx="9" fill="FG"/>
      <rect x="85" y="155" width="18" height="30" rx="9" fill="FG"/>
      <rect x="110" y="155" width="18" height="30" rx="9" fill="FG"/>
      <rect x="135" y="155" width="18" height="30" rx="9" fill="FG"/>
    </g>`,
  },
  {
    id: "cat",
    name: "Cat",
    category: "Animals",
    defaultFgColor: "#808080",
    defaultBgColor: "#404040",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="135" rx="50" ry="38" fill="FG"/>
      <!-- Head -->
      <circle cx="100" cy="78" r="32" fill="FG"/>
      <!-- Ears -->
      <polygon points="72,52 60,25 88,45" fill="FG"/>
      <polygon points="128,52 140,25 112,45" fill="FG"/>
      <polygon points="74,50 65,30 87,44" fill="#FFB6C1"/>
      <polygon points="126,50 135,30 113,44" fill="#FFB6C1"/>
      <!-- Eyes -->
      <ellipse cx="87" cy="72" rx="7" ry="8" fill="#90EE90"/>
      <ellipse cx="113" cy="72" rx="7" ry="8" fill="#90EE90"/>
      <ellipse cx="87" cy="72" rx="3" ry="7" fill="BG"/>
      <ellipse cx="113" cy="72" rx="3" ry="7" fill="BG"/>
      <!-- Nose -->
      <polygon points="100,84 95,90 105,90" fill="#FFB6C1"/>
      <!-- Whiskers -->
      <line x1="60" y1="88" x2="90" y2="86" stroke="BG" stroke-width="1.5"/>
      <line x1="60" y1="93" x2="90" y2="91" stroke="BG" stroke-width="1.5"/>
      <line x1="110" y1="86" x2="140" y2="88" stroke="BG" stroke-width="1.5"/>
      <line x1="110" y1="91" x2="140" y2="93" stroke="BG" stroke-width="1.5"/>
      <!-- Tail -->
      <path d="M150 140 Q175 110 165 80 Q160 65 150 75" stroke="FG" stroke-width="10" fill="none" stroke-linecap="round"/>
      <!-- Legs -->
      <rect x="62" y="158" width="16" height="28" rx="8" fill="FG"/>
      <rect x="84" y="158" width="16" height="28" rx="8" fill="FG"/>
      <rect x="108" y="158" width="16" height="28" rx="8" fill="FG"/>
      <rect x="130" y="158" width="16" height="28" rx="8" fill="FG"/>
    </g>`,
  },
  {
    id: "bird",
    name: "Bird",
    category: "Animals",
    defaultFgColor: "#FF6B35",
    defaultBgColor: "#FFD700",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="120" rx="45" ry="35" fill="FG"/>
      <!-- Head -->
      <circle cx="130" cy="75" r="28" fill="FG"/>
      <!-- Beak -->
      <polygon points="155,72 175,78 155,84" fill="BG"/>
      <!-- Eye -->
      <circle cx="138" cy="70" r="7" fill="white"/>
      <circle cx="140" cy="70" r="4" fill="BG"/>
      <circle cx="141" cy="69" r="1.5" fill="white"/>
      <!-- Wing -->
      <ellipse cx="85" cy="115" rx="35" ry="20" fill="BG" opacity="0.6" transform="rotate(-20 85 115)"/>
      <!-- Tail -->
      <path d="M55 125 L30 140 L55 135 L30 155 L60 140" fill="BG"/>
      <!-- Feet -->
      <line x1="90" y1="155" x2="80" y2="175" stroke="BG" stroke-width="3"/>
      <line x1="80" y1="175" x2="65" y2="180" stroke="BG" stroke-width="3"/>
      <line x1="80" y1="175" x2="80" y2="185" stroke="BG" stroke-width="3"/>
      <line x1="80" y1="175" x2="95" y2="180" stroke="BG" stroke-width="3"/>
      <line x1="110" y1="155" x2="120" y2="175" stroke="BG" stroke-width="3"/>
      <line x1="120" y1="175" x2="105" y2="180" stroke="BG" stroke-width="3"/>
      <line x1="120" y1="175" x2="120" y2="185" stroke="BG" stroke-width="3"/>
      <line x1="120" y1="175" x2="135" y2="180" stroke="BG" stroke-width="3"/>
    </g>`,
  },
  {
    id: "elephant",
    name: "Elephant",
    category: "Animals",
    defaultFgColor: "#808080",
    defaultBgColor: "#606060",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="60" ry="45" fill="FG"/>
      <!-- Head -->
      <circle cx="100" cy="72" r="38" fill="FG"/>
      <!-- Trunk -->
      <path d="M85 100 Q70 130 80 155 Q85 165 90 155 Q82 130 95 105" fill="FG"/>
      <!-- Ears -->
      <ellipse cx="55" cy="72" rx="22" ry="30" fill="BG" opacity="0.5"/>
      <ellipse cx="145" cy="72" rx="22" ry="30" fill="BG" opacity="0.5"/>
      <!-- Eyes -->
      <circle cx="88" cy="62" r="6" fill="BG"/>
      <circle cx="89" cy="61" r="2" fill="white"/>
      <!-- Tusks -->
      <path d="M88 100 Q75 115 70 130" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Legs -->
      <rect x="55" y="160" width="22" height="35" rx="11" fill="FG"/>
      <rect x="83" y="160" width="22" height="35" rx="11" fill="FG"/>
      <rect x="111" y="160" width="22" height="35" rx="11" fill="FG"/>
      <rect x="139" y="160" width="22" height="35" rx="11" fill="FG"/>
      <!-- Tail -->
      <path d="M160 125 Q175 115 170 130" stroke="FG" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>`,
  },
  {
    id: "lion",
    name: "Lion",
    category: "Animals",
    defaultFgColor: "#DAA520",
    defaultBgColor: "#8B6914",
    svgContent: `<g>
      <!-- Mane -->
      <circle cx="100" cy="80" r="50" fill="BG"/>
      <!-- Head -->
      <circle cx="100" cy="80" r="35" fill="FG"/>
      <!-- Body -->
      <ellipse cx="100" cy="145" rx="50" ry="38" fill="FG"/>
      <!-- Snout -->
      <ellipse cx="100" cy="92" rx="18" ry="13" fill="#F4C87A"/>
      <!-- Nose -->
      <polygon points="100,82 94,90 106,90" fill="#C0392B"/>
      <!-- Eyes -->
      <circle cx="87" cy="72" r="7" fill="#DAA520"/>
      <circle cx="113" cy="72" r="7" fill="#DAA520"/>
      <circle cx="87" cy="72" r="4" fill="BG"/>
      <circle cx="113" cy="72" r="4" fill="BG"/>
      <circle cx="88" cy="71" r="1.5" fill="white"/>
      <circle cx="114" cy="71" r="1.5" fill="white"/>
      <!-- Ears -->
      <circle cx="72" cy="48" r="12" fill="BG"/>
      <circle cx="128" cy="48" r="12" fill="BG"/>
      <!-- Legs -->
      <rect x="60" y="168" width="20" height="28" rx="10" fill="FG"/>
      <rect x="85" y="168" width="20" height="28" rx="10" fill="FG"/>
      <rect x="110" y="168" width="20" height="28" rx="10" fill="FG"/>
      <rect x="135" y="168" width="20" height="28" rx="10" fill="FG"/>
      <!-- Tail -->
      <path d="M150 135 Q175 115 170 95" stroke="FG" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="170" cy="92" r="8" fill="BG"/>
    </g>`,
  },
  {
    id: "frog",
    name: "Frog",
    category: "Animals",
    defaultFgColor: "#228B22",
    defaultBgColor: "#006400",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="55" ry="42" fill="FG"/>
      <!-- Head -->
      <ellipse cx="100" cy="80" rx="42" ry="32" fill="FG"/>
      <!-- Eyes on top -->
      <circle cx="75" cy="58" r="16" fill="FG"/>
      <circle cx="125" cy="58" r="16" fill="FG"/>
      <circle cx="75" cy="56" r="10" fill="#90EE90"/>
      <circle cx="125" cy="56" r="10" fill="#90EE90"/>
      <circle cx="75" cy="56" r="5" fill="BG"/>
      <circle cx="125" cy="56" r="5" fill="BG"/>
      <circle cx="76" cy="55" r="2" fill="white"/>
      <circle cx="126" cy="55" r="2" fill="white"/>
      <!-- Mouth -->
      <path d="M75 95 Q100 110 125 95" stroke="BG" stroke-width="3" fill="none"/>
      <!-- Belly -->
      <ellipse cx="100" cy="130" rx="35" ry="28" fill="#90EE90" opacity="0.5"/>
      <!-- Front legs -->
      <path d="M50 120 Q30 130 25 150 Q30 160 40 155 Q45 140 55 130" fill="FG"/>
      <path d="M150 120 Q170 130 175 150 Q170 160 160 155 Q155 140 145 130" fill="FG"/>
      <!-- Back legs -->
      <path d="M60 155 Q40 170 35 185 Q45 195 55 185 Q60 170 70 160" fill="FG"/>
      <path d="M140 155 Q160 170 165 185 Q155 195 145 185 Q140 170 130 160" fill="FG"/>
    </g>`,
  },
  {
    id: "fish",
    name: "Fish",
    category: "Animals",
    defaultFgColor: "#4169E1",
    defaultBgColor: "#1E90FF",
    svgContent: `<g>
      <!-- Tail -->
      <polygon points="40,100 15,70 15,130" fill="BG"/>
      <!-- Body -->
      <ellipse cx="110" cy="100" rx="70" ry="45" fill="FG"/>
      <!-- Scales pattern -->
      <path d="M80 80 Q90 70 100 80" stroke="BG" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M100 80 Q110 70 120 80" stroke="BG" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M120 80 Q130 70 140 80" stroke="BG" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M90 95 Q100 85 110 95" stroke="BG" stroke-width="2" fill="none" opacity="0.5"/>
      <path d="M110 95 Q120 85 130 95" stroke="BG" stroke-width="2" fill="none" opacity="0.5"/>
      <!-- Fin top -->
      <path d="M90 58 Q110 35 130 58" fill="BG" opacity="0.7"/>
      <!-- Fin bottom -->
      <path d="M90 142 Q110 165 130 142" fill="BG" opacity="0.7"/>
      <!-- Eye -->
      <circle cx="155" cy="90" r="12" fill="white"/>
      <circle cx="157" cy="90" r="7" fill="BG"/>
      <circle cx="158" cy="89" r="2.5" fill="white"/>
      <!-- Mouth -->
      <path d="M175 98 Q180 103 175 108" stroke="BG" stroke-width="2" fill="none"/>
    </g>`,
  },
  {
    id: "horse",
    name: "Horse",
    category: "Animals",
    defaultFgColor: "#8B4513",
    defaultBgColor: "#5C2E00",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="58" ry="38" fill="FG"/>
      <!-- Neck -->
      <path d="M120 100 Q135 75 130 55" stroke="FG" stroke-width="25" fill="none" stroke-linecap="round"/>
      <!-- Head -->
      <ellipse cx="140" cy="50" rx="22" ry="28" fill="FG" transform="rotate(20 140 50)"/>
      <!-- Snout -->
      <ellipse cx="155" cy="62" rx="12" ry="9" fill="#C4956A"/>
      <!-- Nostril -->
      <circle cx="152" cy="63" r="3" fill="BG" opacity="0.5"/>
      <circle cx="160" cy="63" r="3" fill="BG" opacity="0.5"/>
      <!-- Eye -->
      <circle cx="135" cy="42" r="6" fill="BG"/>
      <circle cx="136" cy="41" r="2" fill="white"/>
      <!-- Mane -->
      <path d="M120 100 Q115 80 125 60 Q120 55 115 65 Q110 75 118 95" fill="BG"/>
      <!-- Ears -->
      <polygon points="128,28 122,10 138,22" fill="FG"/>
      <!-- Legs -->
      <rect x="55" y="158" width="16" height="38" rx="8" fill="FG"/>
      <rect x="78" y="158" width="16" height="38" rx="8" fill="FG"/>
      <rect x="108" y="158" width="16" height="38" rx="8" fill="FG"/>
      <rect x="131" y="158" width="16" height="38" rx="8" fill="FG"/>
      <!-- Tail -->
      <path d="M42 125 Q20 140 25 165 Q30 175 35 165 Q32 145 48 130" fill="BG"/>
    </g>`,
  },
  {
    id: "duck",
    name: "Duck",
    category: "Animals",
    defaultFgColor: "#FFD700",
    defaultBgColor: "#FFA500",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="130" rx="52" ry="40" fill="FG"/>
      <!-- Head -->
      <circle cx="130" cy="75" r="30" fill="FG"/>
      <!-- Bill -->
      <ellipse cx="160" cy="80" rx="18" ry="10" fill="BG"/>
      <!-- Eye -->
      <circle cx="138" cy="68" r="7" fill="white"/>
      <circle cx="140" cy="68" r="4" fill="BG"/>
      <circle cx="141" cy="67" r="1.5" fill="white"/>
      <!-- Wing -->
      <ellipse cx="88" cy="125" rx="30" ry="18" fill="BG" opacity="0.4" transform="rotate(-10 88 125)"/>
      <!-- Tail feathers -->
      <path d="M48 120 L25 105 L48 115 L25 125 L50 125" fill="BG" opacity="0.7"/>
      <!-- Feet -->
      <path d="M85 168 L75 185 L95 185 L85 168" fill="BG"/>
      <path d="M115 168 L105 185 L125 185 L115 168" fill="BG"/>
    </g>`,
  },
  {
    id: "monkey",
    name: "Monkey",
    category: "Animals",
    defaultFgColor: "#8B6914",
    defaultBgColor: "#5C4000",
    svgContent: `<g>
      <!-- Body -->
      <ellipse cx="100" cy="135" rx="48" ry="38" fill="FG"/>
      <!-- Head -->
      <circle cx="100" cy="75" r="35" fill="FG"/>
      <!-- Face patch -->
      <ellipse cx="100" cy="82" rx="22" ry="20" fill="#D2A679"/>
      <!-- Ears -->
      <circle cx="65" cy="72" r="16" fill="FG"/>
      <circle cx="65" cy="72" r="10" fill="#D2A679"/>
      <circle cx="135" cy="72" r="16" fill="FG"/>
      <circle cx="135" cy="72" r="10" fill="#D2A679"/>
      <!-- Eyes -->
      <circle cx="88" cy="68" r="7" fill="BG"/>
      <circle cx="112" cy="68" r="7" fill="BG"/>
      <circle cx="89" cy="67" r="2.5" fill="white"/>
      <circle cx="113" cy="67" r="2.5" fill="white"/>
      <!-- Nose -->
      <circle cx="96" cy="82" r="4" fill="BG" opacity="0.5"/>
      <circle cx="104" cy="82" r="4" fill="BG" opacity="0.5"/>
      <!-- Mouth -->
      <path d="M88 92 Q100 102 112 92" stroke="BG" stroke-width="2.5" fill="none"/>
      <!-- Arms -->
      <path d="M52 120 Q30 130 25 155" stroke="FG" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M148 120 Q170 130 175 155" stroke="FG" stroke-width="14" fill="none" stroke-linecap="round"/>
      <!-- Legs -->
      <rect x="68" y="162" width="20" height="32" rx="10" fill="FG"/>
      <rect x="112" y="162" width="20" height="32" rx="10" fill="FG"/>
      <!-- Tail -->
      <path d="M148 145 Q175 140 180 120 Q182 105 170 110" stroke="FG" stroke-width="8" fill="none" stroke-linecap="round"/>
    </g>`,
  },
  // Geometric
  {
    id: "circle",
    name: "Circle",
    category: "Geometric",
    defaultFgColor: "#6366F1",
    defaultBgColor: "#4F46E5",
    svgContent: `<g>
      <circle cx="100" cy="100" r="80" fill="FG"/>
      <circle cx="100" cy="100" r="60" fill="BG" opacity="0.3"/>
      <circle cx="100" cy="100" r="40" fill="FG" opacity="0.5"/>
    </g>`,
  },
  {
    id: "star",
    name: "Star",
    category: "Geometric",
    defaultFgColor: "#FFD700",
    defaultBgColor: "#FFA500",
    svgContent: `<g>
      <polygon points="100,15 120,70 180,70 132,105 150,160 100,128 50,160 68,105 20,70 80,70" fill="FG"/>
      <polygon points="100,35 115,75 155,75 123,98 135,138 100,115 65,138 77,98 45,75 85,75" fill="BG" opacity="0.4"/>
    </g>`,
  },
  {
    id: "heart",
    name: "Heart",
    category: "Geometric",
    defaultFgColor: "#E74C3C",
    defaultBgColor: "#C0392B",
    svgContent: `<g>
      <path d="M100 165 C100 165 20 120 20 65 C20 38 42 18 65 18 C80 18 93 26 100 38 C107 26 120 18 135 18 C158 18 180 38 180 65 C180 120 100 165 100 165Z" fill="FG"/>
      <path d="M100 145 C100 145 38 108 38 68 C38 50 52 35 68 35 C80 35 90 42 100 55 C110 42 120 35 132 35 C148 35 162 50 162 68 C162 108 100 145 100 145Z" fill="BG" opacity="0.3"/>
    </g>`,
  },
  {
    id: "triangle",
    name: "Triangle",
    category: "Geometric",
    defaultFgColor: "#2ECC71",
    defaultBgColor: "#27AE60",
    svgContent: `<g>
      <polygon points="100,15 185,175 15,175" fill="FG"/>
      <polygon points="100,45 165,165 35,165" fill="BG" opacity="0.3"/>
    </g>`,
  },
  {
    id: "diamond",
    name: "Diamond",
    category: "Geometric",
    defaultFgColor: "#00BCD4",
    defaultBgColor: "#0097A7",
    svgContent: `<g>
      <polygon points="100,10 185,100 100,190 15,100" fill="FG"/>
      <polygon points="100,35 160,100 100,165 40,100" fill="BG" opacity="0.3"/>
      <polygon points="100,60 135,100 100,140 65,100" fill="FG" opacity="0.5"/>
    </g>`,
  },
  {
    id: "hexagon",
    name: "Hexagon",
    category: "Geometric",
    defaultFgColor: "#9B59B6",
    defaultBgColor: "#8E44AD",
    svgContent: `<g>
      <polygon points="100,15 175,57 175,143 100,185 25,143 25,57" fill="FG"/>
      <polygon points="100,38 155,68 155,132 100,162 45,132 45,68" fill="BG" opacity="0.3"/>
    </g>`,
  },
  {
    id: "lightning",
    name: "Lightning",
    category: "Geometric",
    defaultFgColor: "#F1C40F",
    defaultBgColor: "#F39C12",
    svgContent: `<g>
      <polygon points="115,10 55,110 95,110 85,190 145,90 105,90" fill="FG"/>
      <polygon points="115,30 70,110 100,110 90,170 135,95 105,95" fill="BG" opacity="0.4"/>
    </g>`,
  },
  {
    id: "shield",
    name: "Shield",
    category: "Geometric",
    defaultFgColor: "#3498DB",
    defaultBgColor: "#2980B9",
    svgContent: `<g>
      <path d="M100 15 L175 45 L175 105 C175 148 140 178 100 190 C60 178 25 148 25 105 L25 45 Z" fill="FG"/>
      <path d="M100 35 L158 60 L158 105 C158 138 130 162 100 172 C70 162 42 138 42 105 L42 60 Z" fill="BG" opacity="0.3"/>
    </g>`,
  },
  // Characters
  {
    id: "person",
    name: "Person",
    category: "Characters",
    defaultFgColor: "#E67E22",
    defaultBgColor: "#D35400",
    svgContent: `<g>
      <!-- Head -->
      <circle cx="100" cy="55" r="30" fill="FG"/>
      <!-- Body -->
      <rect x="72" y="90" width="56" height="65" rx="10" fill="FG"/>
      <!-- Arms -->
      <rect x="35" y="90" width="37" height="16" rx="8" fill="FG"/>
      <rect x="128" y="90" width="37" height="16" rx="8" fill="FG"/>
      <!-- Legs -->
      <rect x="72" y="148" width="22" height="45" rx="11" fill="FG"/>
      <rect x="106" y="148" width="22" height="45" rx="11" fill="FG"/>
      <!-- Eyes -->
      <circle cx="90" cy="50" r="5" fill="BG"/>
      <circle cx="110" cy="50" r="5" fill="BG"/>
      <!-- Smile -->
      <path d="M88 65 Q100 75 112 65" stroke="BG" stroke-width="3" fill="none"/>
    </g>`,
  },
  {
    id: "robot",
    name: "Robot",
    category: "Characters",
    defaultFgColor: "#95A5A6",
    defaultBgColor: "#7F8C8D",
    svgContent: `<g>
      <!-- Head -->
      <rect x="65" y="20" width="70" height="60" rx="8" fill="FG"/>
      <!-- Antenna -->
      <rect x="97" y="5" width="6" height="18" fill="BG"/>
      <circle cx="100" cy="5" r="6" fill="#E74C3C"/>
      <!-- Eyes -->
      <rect x="75" y="35" width="20" height="15" rx="4" fill="#00BCD4"/>
      <rect x="105" y="35" width="20" height="15" rx="4" fill="#00BCD4"/>
      <!-- Mouth -->
      <rect x="78" y="60" width="44" height="10" rx="5" fill="BG"/>
      <rect x="82" y="62" width="8" height="6" rx="2" fill="#2ECC71"/>
      <rect x="96" y="62" width="8" height="6" rx="2" fill="#2ECC71"/>
      <rect x="110" y="62" width="8" height="6" rx="2" fill="#2ECC71"/>
      <!-- Body -->
      <rect x="60" y="88" width="80" height="70" rx="8" fill="FG"/>
      <!-- Chest panel -->
      <rect x="75" y="98" width="50" height="40" rx="5" fill="BG" opacity="0.4"/>
      <circle cx="90" cy="115" r="8" fill="#E74C3C"/>
      <circle cx="110" cy="115" r="8" fill="#2ECC71"/>
      <!-- Arms -->
      <rect x="28" y="88" width="32" height="14" rx="7" fill="FG"/>
      <rect x="140" y="88" width="32" height="14" rx="7" fill="FG"/>
      <!-- Legs -->
      <rect x="68" y="162" width="24" height="35" rx="8" fill="FG"/>
      <rect x="108" y="162" width="24" height="35" rx="8" fill="FG"/>
    </g>`,
  },
  {
    id: "alien",
    name: "Alien",
    category: "Characters",
    defaultFgColor: "#2ECC71",
    defaultBgColor: "#27AE60",
    svgContent: `<g>
      <!-- Head (large oval) -->
      <ellipse cx="100" cy="75" rx="55" ry="65" fill="FG"/>
      <!-- Eyes (large) -->
      <ellipse cx="78" cy="65" rx="20" ry="25" fill="BG"/>
      <ellipse cx="122" cy="65" rx="20" ry="25" fill="BG"/>
      <ellipse cx="78" cy="65" rx="12" ry="16" fill="#00FFFF"/>
      <ellipse cx="122" cy="65" rx="12" ry="16" fill="#00FFFF"/>
      <ellipse cx="78" cy="65" rx="6" ry="8" fill="BG"/>
      <ellipse cx="122" cy="65" rx="6" ry="8" fill="BG"/>
      <circle cx="79" cy="62" r="2" fill="white"/>
      <circle cx="123" cy="62" r="2" fill="white"/>
      <!-- Nose slits -->
      <ellipse cx="96" cy="95" rx="3" ry="5" fill="BG" opacity="0.5"/>
      <ellipse cx="104" cy="95" rx="3" ry="5" fill="BG" opacity="0.5"/>
      <!-- Mouth -->
      <path d="M80 108 Q100 120 120 108" stroke="BG" stroke-width="3" fill="none"/>
      <!-- Body -->
      <ellipse cx="100" cy="155" rx="35" ry="30" fill="FG"/>
      <!-- Arms (tentacle-like) -->
      <path d="M65 140 Q40 145 35 165 Q38 175 45 168 Q48 150 68 148" fill="FG"/>
      <path d="M135 140 Q160 145 165 165 Q162 175 155 168 Q152 150 132 148" fill="FG"/>
      <!-- Legs -->
      <rect x="78" y="175" width="18" height="22" rx="9" fill="FG"/>
      <rect x="104" y="175" width="18" height="22" rx="9" fill="FG"/>
    </g>`,
  },
  {
    id: "wizard",
    name: "Wizard",
    category: "Characters",
    defaultFgColor: "#6A0DAD",
    defaultBgColor: "#FFD700",
    svgContent: `<g>
      <!-- Hat -->
      <polygon points="100,5 130,75 70,75" fill="FG"/>
      <ellipse cx="100" cy="75" rx="38" ry="10" fill="FG"/>
      <!-- Hat band -->
      <rect x="62" y="68" width="76" height="12" rx="4" fill="BG"/>
      <!-- Head -->
      <circle cx="100" cy="105" r="30" fill="#FDBCB4"/>
      <!-- Beard -->
      <path d="M75 120 Q100 155 125 120 Q115 145 100 150 Q85 145 75 120Z" fill="white"/>
      <!-- Eyes -->
      <circle cx="90" cy="100" r="5" fill="BG"/>
      <circle cx="110" cy="100" r="5" fill="BG"/>
      <!-- Robe -->
      <path d="M70 135 L55 190 L145 190 L130 135 Q100 145 70 135Z" fill="FG"/>
      <!-- Stars on robe -->
      <polygon points="85,155 88,163 96,163 90,168 92,176 85,171 78,176 80,168 74,163 82,163" fill="BG" transform="scale(0.6) translate(55,95)"/>
      <!-- Staff -->
      <rect x="148" y="80" width="6" height="110" rx="3" fill="BG"/>
      <circle cx="151" cy="78" r="10" fill="#00FFFF"/>
    </g>`,
  },
  {
    id: "ninja",
    name: "Ninja",
    category: "Characters",
    defaultFgColor: "#2C3E50",
    defaultBgColor: "#E74C3C",
    svgContent: `<g>
      <!-- Body -->
      <rect x="68" y="95" width="64" height="70" rx="8" fill="FG"/>
      <!-- Belt -->
      <rect x="68" y="140" width="64" height="12" rx="4" fill="BG"/>
      <!-- Head -->
      <circle cx="100" cy="65" r="32" fill="FG"/>
      <!-- Mask (only eyes visible) -->
      <rect x="68" y="55" width="64" height="22" rx="5" fill="BG"/>
      <!-- Eyes -->
      <circle cx="88" cy="66" r="6" fill="#FF6B35"/>
      <circle cx="112" cy="66" r="6" fill="#FF6B35"/>
      <circle cx="88" cy="66" r="3" fill="BG"/>
      <circle cx="112" cy="66" r="3" fill="BG"/>
      <!-- Arms -->
      <rect x="30" y="95" width="38" height="14" rx="7" fill="FG"/>
      <rect x="132" y="95" width="38" height="14" rx="7" fill="FG"/>
      <!-- Hands with shuriken -->
      <polygon points="25,102 30,95 35,102 30,109" fill="BG"/>
      <polygon points="175,102 170,95 165,102 170,109" fill="BG"/>
      <!-- Legs -->
      <rect x="68" y="162" width="24" height="35" rx="8" fill="FG"/>
      <rect x="108" y="162" width="24" height="35" rx="8" fill="FG"/>
    </g>`,
  },
];
