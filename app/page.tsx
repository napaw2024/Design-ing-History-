"use client";

import { useEffect, useRef, useState } from "react";
import data from "./data/designgeschichte.json";
import { relations, type RelationKind } from "./data/relations";

type Entry = { id:string; tag:string; number:string; photo?:string|string[]; corner_text:string; main_text:string; keywords?:string[] };
type Exhibition = { thesis:string; description:string; images:string[]; links:{label:string;url:string}[] };
type WebSource = { label:string; url:string; context:string };
type ImageCredit = { credit:string; url?:string };

const images:Record<string,string>={
  assignment_3:"/images/assignment3.png",assignment_5:"/images/assignment5.png",
  assignment_7:"/images/assignment7.png",assignment_8:"/images/assignment8.gif",
  assignment_9:"/images/assignment9.png",
  assignment_12:"/images/assignment12.png",assignment_13:"/images/assignment13.jpeg",
  assignment_15:"/images/stopp15.png",assignment_16:"/images/assignment16.png"
};
const entryImages=(entry:Entry)=>{
  if(images[entry.id]) return [images[entry.id]];
  const photos=Array.isArray(entry.photo)?entry.photo:entry.photo?[entry.photo]:[];
  return photos.map(photo=>`/images/${encodeURIComponent(photo)}`);
};
const backgroundOnlyEntries=new Set(["assignment_15"]);
const theses=[
  {id:"assignment_7",text:"GUTES DESIGN IST SCHÖN",x:4,y:22,r:-3},
  {id:"assignment_9",text:"GUTES DESIGN IST FUNKTIONAL",x:48,y:19,r:2},
  {id:"assignment_13",text:"GUTES DESIGN IST DEMOKRATISCH",x:17,y:35,r:1},
  {id:"assignment_15",text:"GUTES DESIGN INFORMIERT",x:62,y:34,r:-2},
  {id:"assignment_18",text:"GUTES DESIGN IST INNOVATIV",x:2,y:51,r:2},
  {id:"assignment_19",text:"GUTES DESIGN IST NACHHALTIG",x:47,y:49,r:-1},
  {id:"assignment_21",text:"GUTES DESIGN IST IDENTITÄTSSTIFTEND",x:10,y:66,r:-2},
  {id:"assignment_25",text:"GUTES DESIGN IST WIDERSTÄNDIG",x:57,y:65,r:2},
  {id:"assignment_27",text:"GUTES DESIGN IST INTERSEKTIONAL",x:3,y:81,r:1},
  {id:"assignment_29",text:"GUTES DESIGN IST LERNBAR",x:54,y:82,r:-2}
];
const thesisByAssignment:Record<string,string>={
  assignment_1:"assignment_21",assignment_2:"assignment_29",assignment_3:"assignment_15",assignment_4:"assignment_9",assignment_5:"assignment_9",assignment_6:"assignment_15",
  assignment_7:"assignment_7",assignment_8:"assignment_7",assignment_9:"assignment_9",assignment_10:"assignment_9",assignment_11:"assignment_9",assignment_12:"assignment_9",
  assignment_13:"assignment_13",assignment_14:"assignment_13",assignment_15:"assignment_15",assignment_16:"assignment_13",assignment_17:"assignment_15",assignment_18:"assignment_18",
  assignment_19:"assignment_19",assignment_20:"assignment_19",assignment_21:"assignment_21",assignment_22:"assignment_21",assignment_23:"assignment_21",assignment_24:"assignment_21",
  assignment_25:"assignment_25",assignment_26:"assignment_18",assignment_27:"assignment_27",assignment_28:"assignment_27",assignment_29:"assignment_29",assignment_30:"assignment_29",
  assignment_31:"assignment_29",assignment_32:"assignment_29",assignment_33:"assignment_29",assignment_34:"assignment_29"
};
const assignment31Exhibitions:Exhibition[]=[
  {thesis:"1. Gutes Design ist schön",description:"Historische Sardinendosen verbinden alltägliche Verpackung mit Illustration, Typografie, Farbe und Ornament. Ihre Schönheit liegt nicht nur in Dekoration, sondern in der dichten visuellen Erzählung eines industriellen Gebrauchsgegenstands.",images:["schon_1.jpg","schoen_2.jpg","schoen_3.jpg"],links:[]},
  {thesis:"2. Gutes Design ist funktional",description:"Fahrradhelme, Kindersitze und das Grigri übersetzen Schutz in direkt verständliche Formen und Handlungen. Ihre Gestaltung wird daran messbar, wie sicher, eindeutig und körpernah sie funktionieren.",images:["funktional_1.jpg","funktional_2.jpg","funktional_4.jpg","grigri.jpg"],links:[{label:"Decathlon – Sport- und Sicherheitsprodukte",url:"https://www.decathlon.de"}]},
  {thesis:"3. Gutes Design ist demokratisch",description:"Das Informationsangebot zu Schweizer Volksabstimmungen gestaltet politischen Zugang: Vorlagen, Resultate und Hilfen zur Stimmabgabe werden öffentlich auffindbar und nachvollziehbar strukturiert.",images:[],links:[{label:"Volksabstimmung vom 14. Juni 2026",url:"https://www.admin.ch/de/volksabstimmung-vom-14-juni-2026"}]},
  {thesis:"4. Gutes Design informiert",description:"Kreisverkehr, Kinder und Einfahrtsverbot reduzieren komplexe Verkehrsregeln auf stark standardisierte Zeichen. Farbe, Form und Piktogramm erzeugen eine Information, die auch unter Zeitdruck lesbar bleibt.",images:["kreisverkehr-verkehrszeichen-nr-215-4226.webp","kinder.jpg","verkehrszeichen-fur-betriebskennzeichnung-verbot-der-einfahrt.webp"],links:[]},
  {thesis:"5. Gutes Design ist innovativ",description:"Mitigation of Shock macht eine mögliche Klimazukunft räumlich erfahrbar. Der Mechanismus von Antikythera und römisches Opus caementicium zeigen zugleich, dass technologische Komplexität und Innovation keine lineare Geschichte ausschließlich neuer Erfindungen bilden.",images:["innovativ_1.jpg","NAMA_Machine_d'Anticythère_1.jpg","cementicus.jpg"],links:[{label:"Superflux – Mitigation of Shock",url:"https://superflux.in/index.php/work/mitigation-of-shock/"}]},
  {thesis:"6. Gutes Design ist nachhaltig",description:"Recycelte Kleidung, kompostierbare Handyhüllen und die Suchmaschine Ecosia verlagern Nachhaltigkeit in Materialwahl, Produktlebenszyklus und alltägliche digitale Nutzung. Die Beispiele zeigen verschiedene Maßstäbe ökologischer Gestaltung.",images:["nachhaltig_1.jpg","nachhaltig_2.jpg","ecosia.jpg"],links:[{label:"Pela Case – kompostierbare Handyhüllen",url:"https://eu.pelacase.com/"},{label:"Ecosia – Suchmaschine für den Planeten",url:"https://www.ecosia.org/?c=de"}]},
  {thesis:"7. Gutes Design ist identitätsstiftend",description:"Die Pariser Métro, die Berliner U-Bahn und die London Underground werden durch Architektur, Fahrzeuge, Farben und Leitsysteme zu wiedererkennbaren Bildern ihrer Städte. Gestaltung bildet urbane Identität ab und produziert sie zugleich.",images:["parise.jpg.webp","berliner-u-bahn-museum.png","london-underground-deutschlandfunk.png"],links:[]},
  {thesis:"8. Gutes Design ist widerständig",description:"Das Beneficial Design Institute stellt dominante Nachhaltigkeitsnarrative infrage. CV Dazzle und Reflectacles greifen direkt in Systeme maschineller Gesichtserkennung ein und machen Gestaltung zu einer praktischen Form des Widerstands gegen Überwachung.",images:["cvdazzle-06-copyright-adam-harvey-2020.jpg","reflec.jpg"],links:[{label:"Beneficial Design Institute",url:"https://www.bd-i.de"},{label:"CV Dazzle",url:"https://adam.harvey.studio/cvdazzle"},{label:"Reflectacles",url:"https://www.reflectacles.com/#home"}]},
  {thesis:"9. Gutes Design ist intersektional",description:"Microsoft Inclusive Design, der WebAIM Contrast Checker und die WCAG-Techniken übersetzen unterschiedliche körperliche, sensorische und situative Voraussetzungen in konkrete Gestaltungsentscheidungen. Zugänglichkeit wird dadurch nicht als Zusatz, sondern als systematischer Teil des Entwurfs behandelt.",images:[],links:[{label:"Microsoft Inclusive Design",url:"https://inclusive.microsoft.design/articles/inclusive-101-guidebook"},{label:"WebAIM Contrast Checker",url:"https://webaim.org/resources/contrastchecker/"},{label:"WCAG 2.1 Techniques",url:"https://www.w3.org/WAI/WCAG21/Techniques/"}]},
  {thesis:"10. Gutes Design ist lernbar",description:"Kindersicherungssysteme machen ihre Schutzfunktion durch wiederholbare Handgriffe verständlich. Blender steht dagegen für ein komplexes Werkzeug, dessen Logik durch Übung, Interfacewissen und gemeinschaftlich verfügbares Lernen erschlossen wird.",images:["kinder1.jpeg","kinder 3.jpg.webp"],links:[{label:"Blender",url:"https://www.blender.org"}]}
];
const webSources:WebSource[]=[
  {label:"Vimeo – Book Biography Machine",url:"https://vimeo.com/145423437",context:"Assignment 6 · Geschichtsvisualisierung"},
  {label:"Conservas Berlin – Nuri Sardinen in Olivenöl",url:"https://conservas.berlin/shop/nuri-sardinen-in-olivenoel-125-g/",context:"Assignment 31 · Gutes Design ist schön"},
  {label:"Decathlon – Sicherungsgerät Grigri",url:"https://www.decathlon.de/p/sicherungsgerat-mit-bremsunterstutzung-grigri/X8537180/m8537180",context:"Assignment 31 · Gutes Design ist funktional"},
  {label:"Museumsportal Berlin – Berliner U-Bahn-Museum",url:"https://www.museumsportal-berlin.de/de/museen/berliner-u-bahn-museum/",context:"Assignment 31 · Gutes Design ist identitätsstiftend"},
  {label:"Deutschlandfunk – Streik im Londoner U-Bahn-Verkehr",url:"https://www.deutschlandfunk.de/streik-im-londoner-u-bahn-verkehr-100.html",context:"Assignment 31 · Gutes Design ist identitätsstiftend"},
  {label:"Paris-Blog – Pariser Métro",url:"https://paris-blog.org/2018/02/01/__trashed-3/",context:"Assignment 31 · Gutes Design ist identitätsstiftend"},
  {label:"Dolle – Kindersicherung für Treppen und Türen",url:"https://www.dolle.de/kindersicherung-treppe",context:"Assignment 31 · Gutes Design ist lernbar"},
  {label:"Otto – Kindersicherung für Schränke",url:"https://www.otto.de/babys/ausstattung/kindersicherung/",context:"Assignment 31 · Gutes Design ist lernbar"},
  {label:"Lederiet – Hanfgarn",url:"https://lederiet.de/shop/193-faden/8099-hanfgarn/",context:"Assignment 19 · Gutes Design ist nachhaltig"},
  {label:"Bauer Beton – Blindenleitsystem für Bahnanlagen",url:"https://www.bauerbeton.de/produkte-bauer-beton/bahnanlagen/blindenleitsystem/",context:"Assignment 27 · Gutes Design ist intersektional"},
  {label:"Futurezone – Tracking von Taylor Swifts Privatjet",url:"https://futurezone.at/digital-life/taylor-swift-tracking-privatjet-elon-musk-co2-reisen-routen-gesetz/402906024",context:"Assignment 20 · Verantwortung und Nachhaltigkeit"},
  {label:"The Berliner – Gleisdreieck U-Bahn bridge",url:"https://www.the-berliner.com/english-news-berlin/gleisdreieck-u-bahn-bridge-has-to-be-rebuilt/",context:"Assignment 21 · Gelb Gelb Gelb"},
  {label:"D23 – Walt Disney Legend Steve Jobs",url:"https://d23.com/walt-disney-legend/steve-jobs/",context:"Assignment 25 · Gutes Design ist widerständig"},
  {label:"Otto – Frischhalteclips",url:"https://www.otto.de/p/benson-frischhaltebeutel-verschlussclips-frischhalteclips-10er-set-gefrierbeutel-clips-klammer-beutel-S0K5N0ZC/",context:"Assignment 11 · Heimlicher Held"},
  {label:"Wikipedia – STOP sign.jpg",url:"https://de.wikipedia.org/wiki/Datei:STOP_sign.jpg",context:"Assignment 15 · Gutes Design ist informativ"},
  {label:"Lagerkonzept – Verkehrszeichen Verbot der Einfahrt",url:"https://shop.lagerkonzept.com/verkehrszeichen-innerbetrieblich/2763-verkehrszeichen-fur-betriebskennzeichnung-verbot-der-einfahrt.html",context:"Assignment 31 · Gutes Design informiert"},
  {label:"Schilder-Versand – Verkehrszeichen Kinder Nr. 136-20",url:"https://www.schilder-versand.com/verkehrsschilder/gefahrzeichen-nach-stvo/2879/Kinder,-Aufstellung-links-Verkehrsschild-Nr-136-20",context:"Assignment 31 · Gutes Design informiert"},
  {label:"Wikipedia – Out-of-place-Artefakt (OOPArt)",url:"https://de.wikipedia.org/wiki/Out-of-place-Artefakt",context:"Assignment 31 · Gutes Design ist innovativ"},
  {label:"Wikipedia – Mechanismus von Antikythera",url:"https://de.wikipedia.org/wiki/Mechanismus_von_Antikythera",context:"Assignment 31 · Gutes Design ist innovativ"},
  {label:"Wikipedia – Opus caementicium",url:"https://de.wikipedia.org/wiki/Opus_caementicium",context:"Assignment 31 · Gutes Design ist innovativ"},
  {label:"Patagonia Deutschland",url:"https://eu.patagonia.com/de/de/",context:"Assignment 31 · Gutes Design ist nachhaltig"},
  ...assignment31Exhibitions.flatMap(exhibition=>exhibition.links.map(link=>({...link,context:`Assignment 31 · ${exhibition.thesis}`})))
];
const imageCredits:Record<string,ImageCredit>={
  "assignment1.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "assignment3.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "assignment5.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "metalab_interface_dante.jpg":{credit:"Externe Quelle · Book Biography Machine / Vimeo",url:"https://vimeo.com/145423437"},
  "assignment11.png":{credit:"Mit Midjourney generierte Abbildung"},
  "assignment12.png":{credit:"Mit Midjourney generierte Abbildung"},
  "assignment13.jpeg":{credit:"Eigener Screenshot · Natalia Pawlik"},
  "assignment16.png":{credit:"Mit Midjourney generierte Abbildung"},
  "trampelpfad.png":{credit:"Mit Midjourney generierte Abbildung"},
  "assignment17.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "assignment8.gif":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "assignment30.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "assignment29.jpg":{credit:"Eigener Figma-Screenshot · Natalia Pawlik"},
  "informiert_notiz.png":{credit:"Abbildung aus der Vorlesungsreihe · Design(ing) History"},
  "notiz_schoen1.png":{credit:"Abbildung aus der Vorlesungsreihe · Design(ing) History"},
  "schon_1.jpg":{credit:"Foto/Screenshot von Conservas Berlin · Nuri Sardinen",url:"https://conservas.berlin/shop/nuri-sardinen-in-olivenoel-125-g/"},
  "schoen_2.jpg":{credit:"Foto/Screenshot von Conservas Berlin · Sardinendosen-Auswahl",url:"https://conservas.berlin/shop/nuri-sardinen-in-olivenoel-125-g/"},
  "schoen_3.jpg":{credit:"Foto/Screenshot von Conservas Berlin · Sardinendosen-Auswahl",url:"https://conservas.berlin/shop/nuri-sardinen-in-olivenoel-125-g/"},
  "U-Bahn-Museum-4839_bearbeitet-scaled.jpg":{credit:"Museumsportal Berlin · Berliner U-Bahn-Museum",url:"https://www.museumsportal-berlin.de/de/museen/berliner-u-bahn-museum/"},
  "berliner-u-bahn-museum.png":{credit:"Museumsportal Berlin · Berliner U-Bahn-Museum",url:"https://www.museumsportal-berlin.de/de/museen/berliner-u-bahn-museum/"},
  "london-underground-deutschlandfunk.png":{credit:"Deutschlandfunk · Streik im Londoner U-Bahn-Verkehr",url:"https://www.deutschlandfunk.de/streik-im-londoner-u-bahn-verkehr-100.html"},
  "parise.jpg.webp":{credit:"Paris-Blog · Pariser Métro",url:"https://paris-blog.org/2018/02/01/__trashed-3/"},
  "kinder1.jpeg":{credit:"Dolle · Kindersicherung für Treppen und Türen",url:"https://www.dolle.de/kindersicherung-treppe"},
  "kinder 3.jpg.webp":{credit:"Otto · Kindersicherung für Schränke",url:"https://www.otto.de/babys/ausstattung/kindersicherung/"},
  "stopp15.png":{credit:"Wikipedia · STOP sign.jpg",url:"https://de.wikipedia.org/wiki/Datei:STOP_sign.jpg"},
  "assignment19.jpg":{credit:"Lederiet · Hanfgarn",url:"https://lederiet.de/shop/193-faden/8099-hanfgarn/"},
  "assignment20.jpg":{credit:"Futurezone · Tracking von Taylor Swifts Privatjet",url:"https://futurezone.at/digital-life/taylor-swift-tracking-privatjet-elon-musk-co2-reisen-routen-gesetz/402906024"},
  "assignment21.jpg":{credit:"Externe Bildquelle · Link noch ergänzen"},
  "assignment21-gleisdreieck.png":{credit:"The Berliner · Gleisdreieck U-Bahn bridge",url:"https://www.the-berliner.com/english-news-berlin/gleisdreieck-u-bahn-bridge-has-to-be-rebuilt/"},
  "steve-jobs-apple-historie-2.jpg":{credit:"D23 · Walt Disney Legend Steve Jobs",url:"https://d23.com/walt-disney-legend/steve-jobs/"},
  "assignment27.webp":{credit:"Externe Bildquelle · Link noch ergänzen"},
  "assignment27-blindenleitsystem.png":{credit:"Bauer Beton · Blindenleitsystem für Bahnanlagen",url:"https://www.bauerbeton.de/produkte-bauer-beton/bahnanlagen/blindenleitsystem/"},
  "Frame 275.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "Frame 262.png":{credit:"Eigene Abbildung · Natalia Pawlik"},
  "frisch.png":{credit:"Otto · Benson Frischhalteclips",url:"https://www.otto.de/p/benson-frischhaltebeutel-verschlussclips-frischhalteclips-10er-set-gefrierbeutel-clips-klammer-beutel-S0K5N0ZC/"},
  "funktional_1.jpg":{credit:"Screenshot von Decathlon.de",url:"https://www.decathlon.de"},
  "funktional_2.jpg":{credit:"Screenshot von Decathlon.de",url:"https://www.decathlon.de"},
  "funktional_4.jpg":{credit:"Screenshot von Decathlon.de",url:"https://www.decathlon.de"},
  "grigri.jpg":{credit:"Screenshot von Decathlon.de · Sicherungsgerät Grigri",url:"https://www.decathlon.de/p/sicherungsgerat-mit-bremsunterstutzung-grigri/X8537180/m8537180"},
  "innovativ_1.jpg":{credit:"Superflux · Mitigation of Shock",url:"https://superflux.in/index.php/work/mitigation-of-shock/"},
  "NAMA_Machine_d'Anticythère_1.jpg":{credit:"Wikipedia · Mechanismus von Antikythera (im Kontext von OOPArts)",url:"https://de.wikipedia.org/wiki/Mechanismus_von_Antikythera"},
  "cementicus.jpg":{credit:"Wikipedia · Opus caementicium",url:"https://de.wikipedia.org/wiki/Opus_caementicium"},
  "nachhaltig_1.jpg":{credit:"Screenshot der Patagonia-Website",url:"https://eu.patagonia.com/de/de/"},
  "nachhaltig_2.jpg":{credit:"Screenshot der Pela-Case-Website",url:"https://eu.pelacase.com/"},
  "ecosia.jpg":{credit:"Screenshot einer Ecosia-Suche",url:"https://www.ecosia.org/?c=de"},
  "cvdazzle-06-copyright-adam-harvey-2020.jpg":{credit:"Adam Harvey · CV Dazzle",url:"https://adam.harvey.studio/cvdazzle"},
  "reflec.jpg":{credit:"Reflectacles",url:"https://www.reflectacles.com/#home"}
  ,"verkehrszeichen-fur-betriebskennzeichnung-verbot-der-einfahrt.webp":{credit:"Lagerkonzept · Verkehrszeichen Verbot der Einfahrt",url:"https://shop.lagerkonzept.com/verkehrszeichen-innerbetrieblich/2763-verkehrszeichen-fur-betriebskennzeichnung-verbot-der-einfahrt.html"}
  ,"kinder.jpg":{credit:"Schilder-Versand · Verkehrszeichen Kinder Nr. 136-20",url:"https://www.schilder-versand.com/verkehrsschilder/gefahrzeichen-nach-stvo/2879/Kinder,-Aufstellung-links-Verkehrsschild-Nr-136-20"}
};
const positions=[
  [9,25],[25,23],[41,25],[57,23],[73,26],[89,24],
  [11,39],[27,40],[43,38],[59,40],[75,38],[91,40],
  [8,53],[24,51],[40,54],[56,52],[72,54],[88,52],
  [11,67],[27,65],[43,68],[59,66],[75,68],[91,66],
  [18,81],[39,79],[61,82],[83,80],[50,88],[64,84],
  [76,89],[88,82],[96,74],[96,90]
];
const positionFor=(index:number,total:number)=>positions[index]??[
  7+((index*17)%88),
  Math.min(89,24+Math.floor(index/6)*14+(index%2)*2)
];
const notePositions=[
  [6,31],[91,30],[7,48],[93,48],[5,64],[92,65],[15,26],[34,28],[53,27],[71,29],
  [17,50],[38,49],[59,51],[79,50],[14,68],[34,69],[54,68],[75,69],[18,87],[79,87]
];
const clean=(text="")=>text.replace(/\s+/g," ").trim();
const vimeoId=(text="")=>text.match(/vimeo\.com\/(\d+)/)?.[1]||null;
const withoutVimeo=(text="")=>clean(text.replace(/(?:\d+[a-z]?\)\s*)?https?:\/\/(?:www\.)?vimeo\.com\/\d+\?\S+/i,""));
const relationCurve=(x1:number,y1:number,x2:number,y2:number,index:number,amount=1)=>{
  const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy)||1;
  const direction=index%2===0?1:-1;
  const bend=Math.min(82,Math.max(24,length*.13))*direction*amount;
  const px=-dy/length,py=dx/length;
  const c1x=x1+dx*.3+px*bend,c1y=y1+dy*.3+py*bend;
  const c2x=x1+dx*.7-px*bend,c2y=y1+dy*.7-py*bend;
  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
};
export default function Home(){
  const stageRef=useRef<HTMLElement>(null);
  const assignments=(data as Entry[]).filter(x=>x.tag==="Assignment"&&+x.number>=1&&(!x.main_text.startsWith("Replace")||x.number==="34"));
  const notes=(data as Entry[]).filter(x=>x.tag==="Notizen"&&x.main_text.trim()!==""&&!x.main_text.trim().startsWith("Replace")).slice(0,20);
  const [active,setActive]=useState<Entry|null>(null);
  const [vortex,setVortex]=useState<"idle"|"in"|"out">("idle");
  const [hovered,setHovered]=useState<string|null>(null);
  const [view,setView]=useState<"chaos"|"order">("chaos");
  const [orderThesisHover,setOrderThesisHover]=useState<string|null>(null);
  const [orderThesisFilter,setOrderThesisFilter]=useState<string|null>(null);
  const [relationGeometry,setRelationGeometry]=useState<Record<string,[number,number,number,number]>>({});
  const [sourcesOpen,setSourcesOpen]=useState(false);
  const visibleEntries=[...assignments,...notes];
  const sourceImages=[...new Set([
    ...visibleEntries.flatMap(entry=>entryImages(entry).map(src=>decodeURIComponent(src.replace("/images/","")))),
    ...assignment31Exhibitions.flatMap(exhibition=>exhibition.images),
    "Frame 275.png","Frame 262.png","frisch.png","chip.png","stopp15.png"
  ])].sort((a,b)=>a.localeCompare(b,"de"));
  const entryById:Record<string,Entry>=Object.fromEntries(visibleEntries.map(entry=>[entry.id,entry]));
  const visibleIds=new Set(visibleEntries.map(entry=>entry.id));
  const visibleRelations=relations.filter(relation=>visibleIds.has(relation.source)&&visibleIds.has(relation.target));
  const connectedIds=new Set(visibleRelations.flatMap(relation=>relation.source===hovered?[relation.target]:relation.target===hovered?[relation.source]:[]));
  const relatedToActive=active?visibleRelations.filter(relation=>relation.source===active.id||relation.target===active.id):[];
  useEffect(()=>{
    let frame=0;
    const measure=()=>{
      const stage=stageRef.current;
      if(!stage)return;
      const stageBox=stage.getBoundingClientRect();
      const next:Record<string,[number,number,number,number]>={};
      visibleRelations.forEach(relation=>{
        const source=stage.querySelector<HTMLElement>(`[data-entry-id="${relation.source}"]`);
        const target=stage.querySelector<HTMLElement>(`[data-entry-id="${relation.target}"]`);
        if(!source||!target)return;
        const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();
        next[`${relation.source}|${relation.target}`]=[a.left+a.width/2-stageBox.left,a.top-stageBox.top,b.left+b.width/2-stageBox.left,b.top-stageBox.top];
      });
      setRelationGeometry(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
      frame=requestAnimationFrame(measure);
    };
    frame=requestAnimationFrame(measure);
    return()=>cancelAnimationFrame(frame);
  },[view,assignments.length,notes.length]);
  const activeAssignmentIndex=active?.tag==="Assignment"?assignments.findIndex(entry=>entry.id===active.id):-1;
  const openEntry=(entry:Entry)=>{if(entry.id!=="assignment_34"){setActive(entry);return}if(vortex!=="idle")return;setHovered(null);setVortex("in");window.setTimeout(()=>setVortex("out"),760);window.setTimeout(()=>setVortex("idle"),1540)};
  const closeEntry=()=>setActive(null);
  const showPrevious=()=>activeAssignmentIndex>=0&&setActive(assignments[(activeAssignmentIndex-1+assignments.length)%assignments.length]);
  const showNext=()=>activeAssignmentIndex>=0&&setActive(assignments[(activeAssignmentIndex+1)%assignments.length]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setActive(null);setSourcesOpen(false)}if(activeAssignmentIndex>=0&&e.key==="ArrowLeft")setActive(assignments[(activeAssignmentIndex-1+assignments.length)%assignments.length]);if(activeAssignmentIndex>=0&&e.key==="ArrowRight")setActive(assignments[(activeAssignmentIndex+1)%assignments.length])};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[activeAssignmentIndex,active?.id]);
  const specialId=hovered||active?.id;
  const orderThesisSelection=orderThesisHover==="all"?null:(orderThesisHover||orderThesisFilter);
  const activeThesisId=orderThesisSelection||(specialId?.startsWith("assignment_")?thesisByAssignment[specialId]:null);
  return <main ref={stageRef} className={`stage ${active?"has-active":""} ${vortex!=="idle"?`is-vortex-${vortex}`:""} ${active?.id==="assignment_34"?"is-archive-active":""} ${specialId==="assignment_11"?"is-frisch-collage":""} ${specialId==="assignment_15"?"is-stopp-collage":""} ${specialId==="assignment_17"?"is-chip-collage":""} ${specialId==="assignment_5"?"is-beige":""} ${specialId==="assignment_20"?"is-pink":""} ${specialId==="assignment_21"?"is-yellow":""} ${specialId==="assignment_26"?"is-red":""} ${specialId==="assignment_27"?"is-leitsystem-collage":""}`}>
    <div className="object-collage-background frisch-collage-background" aria-hidden="true">{Array.from({length:18},(_,i)=><img key={i} style={{left:`${(i*31+5)%96}%`,top:`${(i*43+4)%92}%`,transform:`translate(-50%,-50%) rotate(${(i%9-4)*7}deg)`}} src="/images/frisch.png" alt=""/>)}</div>
    <div className="object-collage-background stopp-collage-background" aria-hidden="true">{Array.from({length:20},(_,i)=><img key={i} style={{left:`${(i*41+4)%97}%`,top:`${(i*31+6)%91}%`,transform:`translate(-50%,-50%) rotate(${(i%9-4)*8}deg)`}} src="/images/stopp15.png" alt=""/>)}</div>
    <div className="object-collage-background chip-collage-background" aria-hidden="true">{Array.from({length:22},(_,i)=><img key={i} style={{left:`${(i*37+3)%97}%`,top:`${(i*29+8)%91}%`,transform:`translate(-50%,-50%) rotate(${(i%11-5)*6}deg)`}} src="/images/chip.png" alt=""/>)}</div>
    <div className="object-collage-background leitsystem-collage-background" aria-hidden="true">{Array.from({length:20},(_,i)=><img key={i} style={{left:`${(i*41+4)%97}%`,top:`${(i*31+6)%91}%`,transform:`translate(-50%,-50%) rotate(${(i%9-4)*8}deg)`}} src={i%2===0?"/Frame%20275.png":"/Frame%20262.png"} alt=""/>)}</div>
    {view==="chaos"&&<div className="theses-layer" aria-hidden="true">{theses.map((thesis,index)=><span key={thesis.id} className={`thesis-word ${activeThesisId===thesis.id?"is-visible":""}`} style={{left:`${thesis.x}%`,top:`${thesis.y}%`,"--thesis-rotation":`${thesis.r}deg`,"--thesis-index":index} as React.CSSProperties}>{thesis.text}</span>)}</div>}
    {!active&&<svg className={`connections connections-${view}`} aria-hidden="true">
      <defs>
        <marker id="relation-dot-semantisch" markerWidth="8" markerHeight="8" refX="4" refY="4" markerUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3.2" fill="#ef3d78" stroke="#fff" strokeWidth="1"/></marker>
        <marker id="relation-dot-geschichtlich" markerWidth="8" markerHeight="8" refX="4" refY="4" markerUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3.2" fill="#246dff" stroke="#fff" strokeWidth="1"/></marker>
      </defs>
      {visibleRelations.map((relation,index)=>{
        const geometry=relationGeometry[`${relation.source}|${relation.target}`];
        if(!geometry)return null;
        const activeRelation=hovered===relation.source||hovered===relation.target;
        if(view==="order"&&!activeRelation)return null;
        return <g key={`${relation.source}-${relation.target}`} className={`connection-group ${relation.kind} ${activeRelation?"is-active":""}`}>
          <path className="connection" d={relationCurve(...geometry,index,1)} markerStart={activeRelation?`url(#relation-dot-${relation.kind})`:undefined} markerEnd={activeRelation?`url(#relation-dot-${relation.kind})`:undefined}/>
        </g>;
      })}
    </svg>}
    <header>
      <h1>DESIGN(NING) HISTORY</h1>
      <p>Dokumentation der Assignments und Gedanken aus dem Kurs Design(ing) History – Überblick Designgeschichte und -theorie</p>
      <div className="toggle-row"><nav className="view-toggle" aria-label="Ansicht wählen"><button className={view==="chaos"?"active":""} onClick={()=>{setView("chaos");setHovered(null);setOrderThesisHover(null)}}>CHAOS ?</button><button className={view==="order"?"active":""} onClick={()=>{setView("order");setHovered(null);setOrderThesisHover(null)}}>ORDNUNG ?</button></nav></div>
    </header>

    {view==="chaos"&&<section className={`field ${assignments.length>19?"count-many":""}`} aria-label="Assignments">
      {assignments.map((entry,index)=>{
        const [x,y]=positionFor(index,assignments.length);
        const image=entryImages(entry)[0];
        const dimmed=Boolean(hovered&&hovered!==entry.id&&!connectedIds.has(entry.id));
        const highlighted=hovered===entry.id||connectedIds.has(entry.id);
        const archiveTrigger=entry.id==="assignment_34";
        return <button data-entry-id={entry.id} key={entry.id} className={`island island-${index%4} layout-${index%6} ${archiveTrigger?"archive-trigger":""} ${entry.id==="assignment_5"?"assignment-beige":""} ${entry.id==="assignment_20"?"assignment-pink":""} ${entry.id==="assignment_21"?"assignment-yellow":""} ${entry.id==="assignment_26"?"assignment-red":""} ${+entry.number>9?"two-digit":""} ${dimmed?"is-dimmed":""} ${highlighted?"is-highlighted":""} ${hovered===entry.id?"is-hovered":""}`} style={{left:`${x}%`,top:`${y}%`}} onMouseEnter={()=>setHovered(entry.id)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(entry.id)} onBlur={()=>setHovered(null)} onClick={()=>openEntry(entry)} aria-label={archiveTrigger?"Archiv einsaugen":`Assignment ${entry.number} öffnen`}>
          <span className="giant">{entry.number}</span>
          {!archiveTrigger&&<span className="sheet">
            {image&&!backgroundOnlyEntries.has(entry.id) ? <img src={image} alt=""/> : <span className="placeholder">{clean(entry.corner_text).slice(0,38)}</span>}
            <span className="meta">{entry.number.padStart(2,"0")} Deadline: 2 August 2026<br/>{clean(entry.corner_text)||"Assignment"}</span>
            <span className="tiny">{clean(entry.main_text).slice(0,125)}…</span>
          </span>}
          {!archiveTrigger&&<span className="hover-heading"><span className="hover-number">{entry.number}</span><span className="hover-heading-title">{clean(entry.corner_text)||`Assignment ${entry.number}`}</span></span>}
          {!archiveTrigger&&<span className="hover-card" aria-hidden="true">
            <span className="hover-card-head"><b>{entry.number}. ASSIGNMENT</b><strong>{clean(entry.corner_text)||`Assignment ${entry.number}`}</strong></span>
            <span className="hover-card-copy">{clean(entry.main_text).slice(0,180)}{clean(entry.main_text).length>180?"…":""}</span>
            {image&&!backgroundOnlyEntries.has(entry.id)&&<span className="hover-card-media"><img src={image} alt=""/></span>}
          </span>}
        </button>
      })}
      {notes.map((entry,index)=>{
        const [x,y]=notePositions[index];
        const placeholder=entry.main_text.startsWith("Replace");
        const dimmed=Boolean(hovered&&hovered!==entry.id&&!connectedIds.has(entry.id));
        const highlighted=hovered===entry.id||connectedIds.has(entry.id);
        return <button data-entry-id={entry.id} key={entry.id} className={`note note-${index%5} ${dimmed?"is-dimmed":""} ${highlighted?"is-highlighted":""}`} style={{left:`${x}%`,top:`${y}%`}} onMouseEnter={()=>setHovered(entry.id)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(entry.id)} onBlur={()=>setHovered(null)} onClick={()=>setActive(entry)} aria-label={`Notiz ${entry.number} öffnen`}>
          <b>N{entry.number}</b>
          <span>{placeholder ? (clean(entry.corner_text)||`Notiz ${entry.number}`) : clean(entry.main_text).slice(0,105)}</span>
          <span className="hover-title">{clean(entry.corner_text)||`Notiz ${entry.number}`}</span>
        </button>
      })}
    </section>}

    {view==="order"&&<section className="order-view" aria-label="Notizen und Assignments in Ordnung">
      <div className="order-theses" aria-label="Die zehn Thesen in Reihenfolge">
        <button className={`order-thesis order-thesis-all ${!orderThesisSelection?"is-active":""}`} onMouseEnter={()=>setOrderThesisHover("all")} onMouseLeave={()=>setOrderThesisHover(null)} onFocus={()=>setOrderThesisHover("all")} onBlur={()=>setOrderThesisHover(null)} onClick={()=>setOrderThesisFilter(null)} aria-pressed={!orderThesisFilter}><span>00</span><strong>ALLE ASSIGNMENTS</strong></button>
        {theses.map((thesis,index)=><button key={thesis.id} className={`order-thesis ${activeThesisId===thesis.id?"is-active":""} ${orderThesisFilter===thesis.id?"is-selected":""}`} onMouseEnter={()=>setOrderThesisHover(thesis.id)} onMouseLeave={()=>setOrderThesisHover(null)} onFocus={()=>setOrderThesisHover(thesis.id)} onBlur={()=>setOrderThesisHover(null)} onClick={()=>setOrderThesisFilter(thesis.id)} aria-pressed={orderThesisFilter===thesis.id}><span>{String(index+1).padStart(2,"0")}</span><strong>{thesis.text}</strong></button>)}
      </div>
      <div className={`order-row order-notes ${hovered?.startsWith("notizen_")?"has-row-hover":""}`} style={{"--columns":notes.length} as React.CSSProperties}>
      {notes.map(entry=><button data-entry-id={entry.id} key={entry.id} className={`order-column order-note ${hovered===entry.id?"is-order-hovered":""}`} onMouseEnter={()=>setHovered(entry.id)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(entry.id)} onBlur={()=>setHovered(null)} onClick={()=>setActive(entry)} aria-label={`Notiz ${entry.number} öffnen`}>
        <span className="order-kicker">N{entry.number}. NOTIZ</span><strong>{clean(entry.corner_text)||`Notiz ${entry.number}`}</strong><span className="order-copy">{entry.main_text.startsWith("Replace")?"Noch nicht ausgearbeitet.":clean(entry.main_text)}</span>
      </button>)}
      </div>
      <div className={`order-row order-assignments ${hovered?.startsWith("assignment_")?"has-row-hover":""}`} style={{"--columns":assignments.length} as React.CSSProperties}>
      {assignments.map(entry=>{
        const image=entryImages(entry)[0];
        const archiveTrigger=entry.id==="assignment_34";
        const thesisMatch=!orderThesisSelection||thesisByAssignment[entry.id]===orderThesisSelection;
        return <button data-entry-id={entry.id} key={entry.id} className={`order-column ${archiveTrigger?"order-archive-trigger":""} ${entry.id==="assignment_5"?"assignment-beige":""} ${entry.id==="assignment_20"?"assignment-pink":""} ${entry.id==="assignment_21"?"assignment-yellow":""} ${entry.id==="assignment_26"?"assignment-red":""} ${orderThesisSelection?(thesisMatch?"is-thesis-match":"is-thesis-dimmed"):""} ${hovered===entry.id?"is-order-hovered":""}`} onMouseEnter={()=>setHovered(entry.id)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(entry.id)} onBlur={()=>setHovered(null)} onClick={()=>openEntry(entry)} aria-label={archiveTrigger?"Archiv einsaugen":`Assignment ${entry.number} öffnen`}>
          <span className="order-kicker">{entry.number}. ASSIGNMENT</span>
          {!archiveTrigger&&<><strong>{clean(entry.corner_text)||`Assignment ${entry.number}`}</strong>{image&&!backgroundOnlyEntries.has(entry.id)&&<img src={image} alt=""/>}<span className="order-copy">{clean(entry.main_text)}</span></>}
        </button>
      })}
      </div>
    </section>}

    <footer><span className="footer-author">NATALIA PAWLIK @FHP SOS 26</span><button className="sources-link" onClick={()=>setSourcesOpen(true)}>QUELLEN</button></footer>

    {sourcesOpen&&<div className="sources-overlay" role="dialog" aria-modal="true" aria-labelledby="sources-title">
      <button className="sources-close" onClick={()=>setSourcesOpen(false)} aria-label="Quellen schließen">×</button>
      <section className="sources-page">
        <header className="sources-header"><p>DESIGN(ING) HISTORY</p><h2 id="sources-title">Quellen</h2><span>Verwendete Abbildungen und externe Verweise</span></header>
        <ol className="sources-list">
          {sourceImages.map((name,index)=>{const credit=imageCredits[name]||{credit:"Bild der Mini-Ausstellung oder Kursdokumentation · genaue Herkunft noch ergänzen"};return <li key={name}><span>ABB. {String(index+1).padStart(2,"0")}</span><strong>{name}</strong><p>{credit.credit}</p>{credit.url?<a href={credit.url} target="_blank" rel="noreferrer">{credit.url} ↗</a>:<em>Kein externer Link</em>}</li>})}
          {webSources.map((source,index)=><li key={`${source.url}-${index}`}><span>WEB {String(index+1).padStart(2,"0")}</span><strong>{source.context}</strong><p>{source.label}</p><a href={source.url} target="_blank" rel="noreferrer">{source.url} ↗</a></li>)}
        </ol>
      </section>
    </div>}

    {active&&<div className="overlay" onMouseDown={e=>e.currentTarget===e.target&&closeEntry()}>
      <button className="close" onClick={closeEntry} aria-label="Schließen">×</button>
      {active.tag==="Assignment"&&<><button className="detail-arrow detail-prev" onClick={showPrevious} aria-label="Vorheriges Assignment">←</button><button className="detail-arrow detail-next" onClick={showNext} aria-label="Nächstes Assignment">→</button></>}
      <article className="detail">
        <div className={`detail-content ${active.id==="assignment_24"?"story-detail":""}`}>
          <p className="kicker">{active.number}. {active.tag==="Notizen"?"NOTIZ":"ASSIGNMENT"}</p>
          <h2>{clean(active.corner_text)||`Assignment ${active.number}`}</h2>
          <p className="detail-copy">{active.main_text.startsWith("Replace")?"Diese Notiz ist im Archiv noch nicht ausgearbeitet.":withoutVimeo(active.main_text)}</p>
          {vimeoId(active.main_text)&&<div className="detail-video"><iframe src={`https://player.vimeo.com/video/${vimeoId(active.main_text)}`} title={`${clean(active.corner_text)||`Assignment ${active.number}`} – Vimeo Video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>}
          {active.id==="assignment_31"?<div className="mini-exhibitions">{assignment31Exhibitions.map((exhibition,index)=><section className="mini-exhibition" key={exhibition.thesis}>
            <div className="mini-exhibition-copy"><span>{String(index+1).padStart(2,"0")}</span><h3>{exhibition.thesis}</h3><p>{exhibition.description}</p></div>
            <div className={`mini-exhibition-collage collage-count-${exhibition.images.length}`}>
              {exhibition.images.map((name,imageIndex)=><img className={name==="london-underground-deutschlandfunk.png"?"image-contain":undefined} key={name} src={`/images/${encodeURIComponent(name)}`} alt={`${exhibition.thesis}, Auswahl ${imageIndex+1}`}/>)}
              {exhibition.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer"><small>WEBSITE ↗</small><strong>{link.label}</strong><span>{new URL(link.url).hostname.replace("www.","")}</span></a>)}
            </div>
          </section>)}</div>:!backgroundOnlyEntries.has(active.id)&&entryImages(active).map((src,index)=><img key={src} src={src} alt={`${clean(active.corner_text)||active.tag}, Abbildung ${index+1}`}/>)}
          {relatedToActive.length>0&&<aside className="detail-relations"><h3>VERWANDT:</h3>{(["semantisch","geschichtlich"] as RelationKind[]).map(kind=>{
            const matches=relatedToActive.filter(relation=>relation.kind===kind);
            return matches.length>0&&<section key={kind}>{matches.map(relation=>{
              const related=entryById[relation.source===active.id?relation.target:relation.source];
              return related&&<button key={`${relation.source}-${relation.target}`} onClick={()=>setActive(related)}><span className={`relation-pill ${kind}`}>{kind}</span><small>{related.tag==="Assignment"?`${related.number}. ASSIGNMENT`:`N${related.number}. NOTIZ`}</small><strong>{clean(related.corner_text)}</strong></button>;
            })}</section>;
          })}</aside>}
        </div>
      </article>
    </div>}
  </main>
}
