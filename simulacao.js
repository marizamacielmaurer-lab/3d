"use strict";

const svg = document.querySelector("#factory");
const button = document.querySelector("#start");
const action = document.querySelector("#action");
const status = document.querySelector("#status");
const stations = [...document.querySelectorAll(".stations li")];

const point = (x, y, z = 0) => [67 + x + .46 * y, 462 - .34 * y - z];
const coords = (points) => points.map((p) => point(...p).join(",")).join(" ");
const polygon = (points, fill, extra = "") => `<polygon points="${coords(points)}" fill="${fill}" ${extra}/>`;
const line = (a, b, stroke, width = 1, extra = "") => {
  const [x1,y1] = point(...a);
  const [x2,y2] = point(...b);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
};
const spot = (x, y, z, r, fill, extra = "") => {
  const [cx,cy] = point(x,y,z);
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
};
const group = (id, content, extra = "") => `<g id="${id}" ${extra}>${content}</g>`;
const box = (x,y,z,w,d,h,colors) => {
  const a = [x,y,z+h], b = [x+w,y,z+h], c = [x+w,y+d,z+h], e = [x,y+d,z+h];
  return polygon([[x,y,z],[x+w,y,z],b,a],colors[0])
    + polygon([[x+w,y,z],[x+w,y+d,z],c,b],colors[1])
    + polygon([a,b,c,e],colors[2])
    + line(a,b,"#d6f4ff30");
};

const steel = ["#58778e","#38566e","#8caabd"];
const shell = ["url(#shell)","#42637b","#c2d4de"];
const slate = ["#223c54","#15283d","#49687d"];
const light = ["#a8bdcb","#6b889e","#dce8ec"];
const dark = ["#152a3e","#0e1f32","#355269"];
const trim = ["#368b9a","#205768","#77e6e6"];

function floor() {
  let grid = "";
  for (let x=45;x<=1220;x+=29) grid += line([x,-22,2],[x,291,2],"#52788e2d");
  for (let y=-22;y<=291;y+=24) grid += line([45,y,2],[1220,y,2],"#52788e2d");
  return '<ellipse cx="735" cy="470" rx="665" ry="69" fill="url(#shadow)"/>'
    + box(41,-27,-20,1185,324,20,["url(#deck)","#192c43","#243d54"])
    + grid
    + line([44,-27,-3],[1224,-27,-3],"#7199ad56")
    + line([70,-27,-8],[193,-27,-8],"#64d9dd",2)
    + line([1090,-27,-8],[1198,-27,-8],"#64d9dd",2)
    + [61,1205].flatMap(x=>[-9,280].map(y=>spot(x,y,1,2,"#99b7c8"))).join("");
}

function printer() {
  return box(92,13,0,294,245,41,shell)
    + box(104,9,9,126,6,22,dark)
    + spot(119,8,20,3,"#79eeee")
    + line([133,8,20],[163,8,20],"#6ba3b5",3)
    + box(266,9,9,89,6,22,slate)
    + [277,291,305,319,333,347].map(x=>line([x,8,15],[x,8,25],"#b5cfdb",1.2)).join("")
    + box(97,235,41,24,23,284,steel)
    + box(359,235,41,24,23,284,steel)
    + box(97,235,302,286,23,24,shell)
    + polygon([[122,245,46],[359,245,46],[359,245,303],[122,245,303]],"url(#glass)",'stroke="#7dd6ec30"')
    + [155,196,237,278,319].map(x=>line([x,244,55],[x,244,285],"#6ca9bc25")).join("")
    + box(120,55,43,240,164,49,slate)
    + box(106,51,90,280,174,38,dark)
    + box(107,51,128,279,174,4,["#6bb6c6","#337086","#4c6b7d"])
    + polygon([[120,63,133],[375,63,133],[375,214,133],[120,214,133]],"#344e5d")
    + Array.from({length:12},(_,i)=>line([125+i*21,64,133],[125+i*21,212,133],"#93b6c032")).join("")
    + Array.from({length:7},(_,i)=>line([123,69+i*22,133],[372,69+i*22,133],"#93b6c032")).join("")
    + line([109,51,128],[379,51,128],"#63dedf",2)
    + box(116,104,132,112,64,31,steel)
    + box(114,108,140,26,56,15,trim)
    + box(210,106,134,13,61,26,slate)
    + spot(150,103,151,3,"#ffbd89")
    + '<g id="gantry"></g><g id="pusher"></g>';
}

function bridge() {
  return box(388,83,0,51,104,99,slate)
    + polygon([[385,75,132],[453,75,109],[453,192,109],[385,192,132]],"#93adbf")
    + polygon([[385,75,132],[453,75,109],[453,75,101],[385,75,124]],"#4a6e85")
    + line([387,187,135],[452,187,112],"#d5edf5",3)
    + line([388,82,131],[451,82,110],"#f1af80",2);
}

function conveyor(beltEnd, beltTop) {
  const feet = [468,687,907,1160].map(x=>
    box(x,186,0,28,27,81,slate) + box(x,58,0,28,26,84,steel)
    + box(x-8,53,0,45,36,7,slate) + spot(x+13,56,8,2.4,"#b4c9d8")).join("");
  const markerPositions = [483,585,687,789,891,993,1095,1147];
  for (let x=1249;x<beltEnd;x+=102) markerPositions.push(x);
  const markers = markerPositions.map(x=>spot(x,57,88,2.5,"#b6d0de")).join("");
  return feet + box(446,58,70,beltEnd-443,152,37,slate)
    + box(447,196,105,beltEnd-446,16,10,steel)
    + polygon(beltTop,"url(#belt)")
    + '<g clip-path="url(#belt-clip)"><g id="treads"></g></g>'
    + box(448,54,99,beltEnd-443,13,11,steel)
    + line([451,53,82],[beltEnd-1,53,82],"#55bac6",2)
    + markers
    + box(532,19,15,72,33,44,dark)
    + box(541,22,31,54,24,31,steel)
    + [549,559,569,579,589].map(x=>line([x,21,38],[x,21,55],"#244b62",2)).join("")
    + spot(591,20,36,3,"#84e1e1");
}

function scannerBack() {
  // Draw a continuous post behind the belt, with its base on the far side.
  return box(1008,214,0,66,43,7,slate)
    + box(1026,220,7,30,26,240,steel)
    + box(1023,217,211,36,32,33,slate);
}

function scannerFront() {
  return box(1008,17,0,66,39,13,slate)
    + box(1026,24,13,30,27,234,shell)
    + box(1023,21,211,36,32,33,steel)
    + box(1002,21,242,78,235,35,shell)
    + box(1010,20,248,61,6,17,dark)
    + spot(1021,18,256,4,"#6daab6", 'id="scanner-led"')
    + line([1034,18,256],[1060,18,256],"#7498ae",2)
    + box(1024,110,226,34,49,17,dark)
    + polygon([[1026,112,225],[1056,112,225],[1056,157,225],[1026,157,225]],"#62d5e2", 'id="lens" opacity=".5"');
}

function printerFront() {
  return box(92,13,41,26,23,282,shell)
    + box(359,13,41,25,23,282,shell)
    + box(92,13,301,292,26,28,shell)
    + box(92,35,308,25,213,20,light)
    + box(359,35,308,25,213,20,light)
    + line([116,12,313],[353,12,313],"#f0f7fa",1)
    + line([139,11,312],[176,11,312],"#328ca2",4)
    + spot(343,12,314,4,"#75ebeb", 'id="printer-led"')
    + box(135,251,277,74,29,8,slate)
    + spot(170,263,337,30,"#1d3b52")
    + spot(165,263,337,28,"#497486")
    + spot(165,263,337,23,"#315365")
    + spot(165,263,337,17,"#6fc4cf")
    + spot(165,263,337,6,"#172d42")
    + '<g id="cooling"></g>';
}

svg.innerHTML = `<defs>
  <linearGradient id="shell" x2="0%" y2="100%"><stop stop-color="#9db6c7"/><stop offset="1" stop-color="#637f98"/></linearGradient>
  <linearGradient id="deck" x2="0%" y2="100%"><stop stop-color="#29455d"/><stop offset="1" stop-color="#15283e"/></linearGradient>
  <linearGradient id="belt" x2="0%" y2="100%"><stop stop-color="#152e43"/><stop offset="1" stop-color="#233f51"/></linearGradient>
  <linearGradient id="glass" x2="100%" y2="100%"><stop stop-color="#73d1e6" stop-opacity=".22"/><stop offset="1" stop-color="#3a698b" stop-opacity=".13"/></linearGradient>
  <linearGradient id="scan" x2="0%" y2="100%"><stop stop-color="#68edff" stop-opacity=".06"/><stop offset="1" stop-color="#68edff" stop-opacity=".38"/></linearGradient>
  <radialGradient id="shadow"><stop stop-color="#020710" stop-opacity=".8"/><stop offset="1" stop-color="#020710" stop-opacity="0"/></radialGradient>
  <clipPath id="belt-clip"><polygon id="belt-outline"/></clipPath>
</defs>` + group("equipment",floor()+printer()+bridge()+scannerBack()
  + '<g id="conveyor"></g><g id="piece"></g><g id="beam"></g>'+printerFront()+scannerFront()+'<g id="approval"></g>');

const get = (id) => document.getElementById(id);
const conveyorGroup = get("conveyor");
const beltOutline = get("belt-outline");
let treads;
let exitX;
const piece = get("piece");
const pusher = get("pusher");
const gantry = get("gantry");
const beam = get("beam");
const cooling = get("cooling");
const approval = get("approval");
const printerLed = get("printer-led");
const scannerLed = get("scanner-led");
const lens = get("lens");
const equipment = get("equipment");

const total = 32;
const exitStart = 28.45;
const exitEnd = 31.65;
const printEnd = 10.2;
const partX = 270;
const partY = 111;
const width = 44;
const depth = 49;
const layerHeight = 4.1;
const layerCount = 9;
const endX = 1019;
const clamp = (n) => Math.max(0,Math.min(1,n));
const mix = (a,b,t) => a+(b-a)*t;
const span = (t,a,b) => clamp((t-a)/(b-a));
const ease = (x) => x*x*(3-2*x);
const rampHeight = (x) => mix(132,109,span(x,385,453));
const palette = ["#f18e60","#bc5946","#ffc796"];
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const contour = [[0,0],[width,0],[width,depth],[0,depth],[0,0]];

function fitConveyor() {
  // Find the screen edge in SVG coordinates without changing the scene framing.
  const matrix = svg.getScreenCTM();
  const view = svg.viewBox.baseVal;
  const right = matrix?.a > 0
    ? (document.documentElement.clientWidth-matrix.e)/matrix.a
    : view.x+view.width;
  const beltEnd = Math.ceil(right-point(0,53)[0]+110);
  const beltTop = [[452,64,109],[beltEnd,64,109],[beltEnd,206,109],[452,206,109]];
  exitX = right-point(0,partY)[0]+12;
  beltOutline.setAttribute("points",coords(beltTop));
  conveyorGroup.innerHTML = conveyor(beltEnd,beltTop);
  treads = get("treads");
  treads.innerHTML = Array.from({length:Math.ceil((beltEnd-437)/13)+1},(_,i)=>{
    const x = 437+i*13;
    return line([x,67,110],[x,203,110],"#6487996a",1.8);
  }).join("");
}

function drawGantry(x,y,z,printing) {
  const bar = Math.max(171,z+30);
  gantry.innerHTML = box(120,y-13,bar,239,26,12,steel)
    + line([125,y-14,bar+6],[355,y-14,bar+6],"#b7ced9",2)
    + box(x-18,y-16,z+9,36,30,37,shell)
    + box(x-13,y-17,z+16,26,4,18,dark)
    + [x-7,x,x+7].map(pos=>line([pos,y-18,z+20],[pos,y-18,z+30],"#86bdc5",1.6)).join("")
    + box(x-7,y-5,z+3,14,10,8,slate)
    + polygon([[x-5,y,z+5],[x+5,y,z+5],[x,y,z]],"#f0ac7e")
    + (printing ? spot(x,y,z,2,"#fff0b3") : "");
}

const partLayers = Array.from({length:layerCount},(_,i)=>
  box(0,0,i*layerHeight,width,depth,layerHeight,palette)
    + line([0,0,(i+1)*layerHeight],[width,0,(i+1)*layerHeight],"#8b412e8f",.8));
let lastShape = "";

function drawPart(x,z,layers,fraction) {
  let shape = partLayers.slice(0,layers).join("");
  if (fraction>0 && layers<layerCount) {
    const height = (layers+1)*layerHeight;
    const trace = contour.map(([a,b])=>[a,b,height]);
    shape += `<polyline points="${coords(trace)}" fill="none" stroke="#ffbd82" stroke-width="4.3" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="${fraction} 2"/>`;
  }
  if (shape !== lastShape) {
    piece.innerHTML = shape;
    lastShape = shape;
  }
  const [ox,oy] = point(0,0,0);
  const [px,py] = point(x,partY,z);
  piece.setAttribute("transform",`translate(${px-ox} ${py-oy})`);
}

function drawPusher(x) {
  pusher.innerHTML = line([219,137,148],[x,137,148],"#273c51",12)
    + line([219,137,149],[x,137,149],"#d9e5ec",7)
    + box(x-7,partY-4,134,7,depth+8,28,trim);
}

const stages = [
  [0,0,"IMPRIMINDO"],
  [10.7,0,"RESFRIANDO"],
  [13.2,1,"RETIRANDO PEÇA"],
  [18.4,2,"TRANSPORTANDO"],
  [24.4,3,"INSPECIONANDO"],
  [27.8,3,"PEÇA APROVADA"],
  [exitStart,3,"SAÍDA DA PEÇA"],
  [exitEnd,3,"PROCESSO CONCLUÍDO"]
];

let startTime = null;
let currentStage = "";
let loop;

function setStage(name,station) {
  if (name === currentStage) return;
  currentStage = name;
  status.textContent = name;
  stations.forEach((item,i)=>item.classList.toggle("active",i===station));
}

function render(t) {
  const idle = t < 0;
  const printing = !idle && t >= .6 && t < printEnd;
  const progress = span(t,.6,printEnd)*layerCount;
  const layers = Math.floor(progress);
  const fraction = progress-layers;
  // Match extrusion and head motion using the lengths in the projected view.
  const shortEdge = Math.hypot(.46*depth,.34*depth);
  const remaining = fraction*2*(width+shortEdge);
  const distances = [0,width,width+shortEdge,2*width+shortEdge,2*(width+shortEdge)];
  const edge = Math.min(3,distances.findLastIndex((distance)=>distance<=remaining));
  const along = (remaining-distances[edge])/(distances[edge+1]-distances[edge]);
  const [ax,ay] = contour[edge];
  const [bx,by] = contour[edge+1];
  const parking = ease(span(t,printEnd,11.3));
  const arrival = ease(span(t,0,.6));
  const headX = printing ? partX+mix(ax,bx,along) : t<.6 ? mix(152,partX,arrival) : mix(partX,152,parking);
  const headY = printing ? partY+mix(ay,by,along) : t<.6 ? mix(191,partY,arrival) : mix(partY,191,parking);
  const headZ = printing ? 132+(layers+1)*layerHeight : t<.6 ? mix(195,132+layerHeight,arrival) : mix(132+layerCount*layerHeight,195,parking);
  drawGantry(headX,headY,headZ,printing);

  const contact = ease(span(t,13.2,14.1));
  const push = ease(span(t,14.1,16.2));
  const retract = ease(span(t,16.2,18.25));
  const slide = ease(span(t,16.2,17.6));
  const travel = span(t,18.4,24.4);
  // Integrate a linear ramp up and ramp down so the belt and piece stay in sync.
  const rampUp = Math.min(travel,.14);
  const braking = Math.max(0,travel-.8);
  const advance = (travel - rampUp + rampUp*rampUp/.28 - braking*braking/.4)/.83;
  const face = mix(mix(mix(230,partX,contact),400,push),230,retract);
  const departure = span(t,exitStart,exitEnd);
  const launch = Math.min(departure,.2);
  const exitTravel = (exitX-endX)*(departure-launch+launch*launch/.4)/.9;
  const x = mix(mix(mix(partX,400,push),458,slide),endX,advance)+exitTravel;
  drawPusher(face);
  drawPart(x,rampHeight(x),layers,fraction);
  treads.setAttribute("transform",`translate(${((endX-458)*advance+exitTravel)%13} 0)`);

  const chill = t>=10.7 && t<13.2 ? Math.sin(span(t,10.7,13.2)*Math.PI) : 0;
  cooling.innerHTML = chill ? [200,224,248].map((x,i)=>line(
    [x,172,187+i*8],[x+22,172,187+i*8],"#9beaf6",2,`opacity="${chill*.64}"`
  )).join("") : "";
  const scanning = t>=24.4 && t<27.8;
  const approved = t>=27.8;
  const scanProgress = span(t,24.4,27.8);
  const sweep = mix(partY,partY+depth,(1-Math.cos(scanProgress*Math.PI*2))/2);
  const scanGlow = ease(span(scanProgress,0,.12)) * (1-ease(span(scanProgress,.86,1)));
  beam.innerHTML = scanning ? polygon([[1041,134,226],[endX+width,sweep,146],[endX,sweep,146]],"url(#scan)")
    + line([endX,sweep,146],[endX+width,sweep,146],"#90faff",2.6) : "";
  beam.setAttribute("opacity",scanGlow);
  approval.innerHTML = approved ? '<g transform="translate(1206 182)"><circle r="25" fill="#173d39" stroke="#82f2b7" stroke-width="2"/><path d="M-10 0l7 7 13-15" fill="none" stroke="#82f2b7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' : "";
  printerLed.setAttribute("fill",printing ? "#ffb984" : "#75ebeb");
  scannerLed.setAttribute("fill",approved ? "#82f2b7" : scanning ? "#86f6ff" : "#6daab6");
  lens.setAttribute("opacity",scanning ? "1" : ".5");

  const fade = ease(span(t,30.5,total));
  const zoom = motion.matches ? 0 : .035 * ease(span(t,0,2)) * (1-ease(span(t,10,15)));
  equipment.setAttribute("transform",`translate(${-760*zoom} ${-225*zoom}) scale(${1+zoom})`);
  approval.setAttribute("opacity",ease(span(t,27.8,28.15))*(1-fade));
  button.style.setProperty("--progress",clamp(t/total));
  const stage = idle ? null : stages.findLast(([from])=>t>=from);
  setStage(stage?.[2] ?? "SISTEMA PRONTO",stage?.[1] ?? -1);
}

function frame(now) {
  const t = (now-startTime)/1000;
  if (t >= total) {
    startTime = null;
    button.removeAttribute("aria-disabled");
    action.textContent = "INICIAR SIMULAÇÃO";
    render(-1);
    return;
  }
  render(t);
  loop = requestAnimationFrame(frame);
}

button.addEventListener("click",()=>{
  if (startTime !== null) return;
  startTime = performance.now();
  button.setAttribute("aria-disabled","true");
  action.textContent = "EM ANDAMENTO";
  render(0);
  loop = requestAnimationFrame(frame);
});

document.addEventListener("visibilitychange",()=>{
  if (startTime === null) return;
  if (document.hidden) cancelAnimationFrame(loop);
  else loop = requestAnimationFrame(frame);
});

window.addEventListener("resize",()=>{
  fitConveyor();
  render(startTime === null ? -1 : Math.min(total,(performance.now()-startTime)/1000));
});

fitConveyor();
render(-1);
