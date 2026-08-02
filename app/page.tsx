"use client";

import { useEffect, useMemo, useState } from "react";
import data from "./data/designgeschichte.json";

type Relation = { id: string; label: string };
type Entry = {
  id: string; tag: string; number: string; corner_text: string; main_text: string;
  relationships: Record<string, Relation[]>;
};

const images: Record<string, string> = {
  assignment_3: "/images/assignment3.png",
  assignment_5: "/images/assignment5.png",
  assignment_7: "/images/assignment7.png",
  assignment_8: "/images/assignment8.gif",
  assignment_9: "/images/assignment9.png",
  assignment_11: "/images/assignment11.png",
  assignment_12: "/images/assignment12.png",
  assignment_13: "/images/assignment13.jpeg",
  assignment_15: "/images/stopp15.png",
  assignment_16: "/images/assignment16.png",
  assignment_17: "/images/assignment17.png",
};

const accents = ["lime", "pink", "blue", "orange"];
const topics: Record<string, string> = {
  assignment_2: "Definition", assignment_3: "Design", assignment_4: "Funktion",
  assignment_5: "Versagen", assignment_6: "Geschichte", assignment_7: "Schönheit",
  assignment_8: "Geschmack", assignment_9: "Funktion", assignment_10: "Alltag",
  assignment_11: "Alltag", assignment_12: "Versagen", assignment_13: "Teilhabe",
  assignment_14: "Diskussion", assignment_15: "Information", assignment_16: "Demokratie",
  assignment_17: "Manipulation", assignment_18: "Ausgefallen", assignment_19: "Innovation",
};

function clean(text = "") { return text.replace(/\s+/g, " ").trim(); }

export default function Home() {
  const assignments = (data as Entry[]).filter((entry) =>
    entry.tag === "Assignment" && +entry.number >= 2 && +entry.number <= 19 &&
    !entry.main_text.startsWith("Replace")
  );
  const [active, setActive] = useState<Entry | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alle");
  const filters = ["Alle", ...Array.from(new Set(assignments.map(a => topics[a.id])))];

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    window.addEventListener("keydown", close);
    document.body.classList.toggle("modal-open", Boolean(active));
    return () => window.removeEventListener("keydown", close);
  }, [active]);

  const visible = useMemo(() => assignments.filter((a) => {
    const haystack = `${a.corner_text} ${a.main_text} ${topics[a.id]}`.toLowerCase();
    return (filter === "Alle" || topics[a.id] === filter) && haystack.includes(query.toLowerCase());
  }), [query, filter, assignments]);

  return (
    <main>
      <header className="hero" id="top">
        <nav>
          <a className="wordmark" href="#top">D(ing)H</a>
          <div className="navlinks"><a href="#archiv">Archiv</a><a href="#haltung">Haltung</a><span>2026</span></div>
        </nav>
        <div className="hero-grid">
          <div className="title-wrap">
            <p className="eyebrow">Kursdokumentation · Designgeschichte</p>
            <h1>DESIGN<br/><span>(ING)</span><br/>HISTORY</h1>
          </div>
          <div className="hero-object">
            <img src="/images/designgeschi_titelblatt.png" alt="Kartoffelchips-Verpackung als Alltagsartefakt"/>
            <i className="asterisk">*</i><i className="bracket left">(</i><i className="bracket right">)</i>
          </div>
          <p className="intro">Eine subjektive Kartografie von Design, Alltag und Geschichte. Nicht linear, sondern als Netz aus Beobachtungen, Objekten, Fehlern und Beziehungen.</p>
        </div>
      </header>

      <section className="toolbar" id="archiv">
        <div><span className="section-no">01</span><h2>Das Archiv</h2></div>
        <label className="search"><span>Suchen</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Begriff oder Aufgabe"/></label>
      </section>

      <div className="filters" aria-label="Themen filtern">
        {filters.map(f => <button key={f} className={filter===f ? "selected" : ""} onClick={()=>setFilter(f)}>{f}</button>)}
      </div>

      <section className="archive-grid" aria-live="polite">
        {visible.map((entry, index) => {
          const image = images[entry.id];
          return <button className={`card ${accents[index%4]} ${image ? "visual" : "textual"}`} key={entry.id} onClick={()=>setActive(entry)}>
            <span className="card-top"><b>A{entry.number.padStart(2,"0")}</b><em>{topics[entry.id]}</em></span>
            {image ? <img src={image} alt=""/> : <div className="type-image"><strong>{entry.number}</strong><span>{clean(entry.corner_text) || `Assignment ${entry.number}`}</span></div>}
            <span className="card-title">{clean(entry.corner_text) || `Assignment ${entry.number}`}</span>
            <span className="card-copy">{clean(entry.main_text).slice(0,150)}{entry.main_text.length>150 ? " …" : ""}</span>
            <span className="open">öffnen ↗</span>
          </button>
        })}
      </section>

      <section className="statement" id="haltung">
        <div className="statement-sticky"><span className="section-no">02</span><h2>Eine Haltung,<br/>kein Kanon.</h2></div>
        <div className="statement-copy">
          <p>Designgeschichte wird hier nicht als neutrale Abfolge berühmter Objekte verstanden. Sie entsteht im Sortieren, Bewerten und Verknüpfen.</p>
          <p>„Gutes Design“ bleibt dabei eine bewegliche Frage: funktional für wen, schön aus welcher Perspektive, demokratisch unter welchen Bedingungen?</p>
          <div className="keywords"><span>FUNKTION</span><span>KONTEXT</span><span>TEILHABE</span><span>KRITIK</span><span>ALLTAG</span><span>MYTHOS</span></div>
        </div>
      </section>

      <section className="conversation">
        <div className="conversation-copy"><span className="section-no">03</span><h2>Naturalisierung<br/>im Gespräch</h2><p>Ein Dialog über Intuition, Archetypen und die Frage, ob Design jemals universell oder zeitlos sein kann.</p></div>
        <div className="conversation-image"><img src="/images/Frame 38.png" alt="Konversation über die Naturalisierung von Design"/></div>
      </section>

      <footer><b>DESIGN(ING) HISTORY</b><span>Dokumentation · Natalia · 2026</span><a href="#top">nach oben ↑</a></footer>

      {active && <div className="modal" role="dialog" aria-modal="true" aria-label={`Assignment ${active.number}`} onMouseDown={e=>e.target===e.currentTarget&&setActive(null)}>
        <article className={`modal-sheet ${accents[(+active.number)%4]}`}>
          <button className="close" onClick={()=>setActive(null)} aria-label="Schließen">×</button>
          <div className="modal-head"><span>A{active.number.padStart(2,"0")}</span><span>{topics[active.id]}</span></div>
          <h2>{clean(active.corner_text) || `Assignment ${active.number}`}</h2>
          {images[active.id] && <div className="modal-image"><img src={images[active.id]} alt={`Visuelle Arbeit zu Assignment ${active.number}`}/></div>}
          <p className="modal-text">{clean(active.main_text)}</p>
          {Object.values(active.relationships).flat().length > 0 && <div className="relations"><b>Verbindungen</b>{Object.entries(active.relationships).flatMap(([kind, rels]) => rels.map(rel=><span key={`${kind}-${rel.id}`}>{kind}: {rel.label}</span>))}</div>}
        </article>
      </div>}
    </main>
  );
}
