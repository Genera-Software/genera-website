"use client";

import { useEffect } from "react";

const PAW_D =
  "M73.79,53.42c-5.3,4.1-11.93,4.82-17.92,2.15-10.49-4.68-15.79-16.71-16.42-27.95-.43-7.78,1.67-15.39,6.75-21.25,7.4-8.55,19.07-8.29,27.1-.35,9.01,8.91,12.15,22.82,8.6,34.83-1.47,4.97-3.95,9.37-8.1,12.57Z M125.39,54.11c-4.4,2.68-9.39,3.85-14.32,2.46-6.55-1.85-11.24-6.89-13.63-13.22-3.95-10.44-2.76-21.98,2.99-31.51,4.83-8.01,13.91-13.84,23.12-11.19,5.16,1.49,8.91,5.25,11.51,9.81,2.55,4.48,3.54,9.21,3.72,14.4.27,8.1-1.71,16.08-6.51,22.62-1.93,2.63-4,4.87-6.87,6.62Z M24.6,94.92c-6.08.64-12.02-2.72-16.25-7.12C.4,79.54-2.81,64.99,2.89,55.23c4.94-8.46,14.18-10.56,22.89-5.86,4.07,2.19,7.12,5.39,9.6,9.29,4.35,6.84,5.87,15.05,3.88,22.91-1.81,7.12-7.31,12.58-14.65,13.36Z M166.1,89.1c-5.73,5.26-13.42,7.74-20.56,4.23-3.51-1.73-5.96-4.44-7.62-8-1.78-3.8-2.22-7.74-2.07-12.07.29-8.18,4-15.98,10.24-21.27,8.01-6.79,18.64-7.1,25.06,1.01,4.65,5.88,5.1,13.34,3.56,20.63-1.26,5.97-4.15,11.38-8.62,15.48Z M148.74,112.24c-2.15-3.24-4.87-5.79-7.8-8.29-3.43-2.93-6.58-5.84-9.68-9.18-5.37-5.8-8.8-12.74-13.13-17.85-6.27-7.39-14.77-11.71-24.47-12.62-3.14-.3-6.27-.36-9.4.04-10.27,1.32-20.03,6.58-25.86,15.11l-5.86,8.57c-3.29,4.82-7.07,8.99-11.49,12.87-2.99,2.63-6.04,4.91-8.66,7.94-3.33,3.86-5.81,8.09-7.2,13.05-2.18,7.72-2.15,15.86.82,23.37,2.95,7.48,10.14,12.82,17.87,14.83,9.85,2.56,20.15,1.16,29.66-2.33,11.7-4.29,20.08-4.22,31.71-.07,7.62,2.72,15.42,4.35,23.5,3.52,7.64-.79,14.76-3.77,19.88-9.53,4.22-4.74,5.9-10.96,6.28-17.26.47-7.84-1.82-15.62-6.16-22.16ZM94.98,143.87h-27.38c-4.68,0-8.48-3.8-8.48-8.48v-40.57c0-4.69,3.8-8.49,8.49-8.48h5.97s0,43.1,0,43.1h21.59s-.2,14.43-.2,14.43ZM102.32,143.87l.02-21.59h-21.59s0-14.38,0-14.38h27.53c4.68,0,8.48,3.8,8.48,8.48v26.53s0,.96,0,.96h-14.44ZM80.75,100.8v-14.47s27.53,0,27.53,0c4.68,0,8.48,3.79,8.48,8.48v5.99s-36.01,0-36.01,0Z";

const BADGE_BASE_URL = "https://www.generasoftware.com";

export default function BadgeKit() {
  useEffect(() => {
    const PAW_W = 175.51,
      PAW_H = 161.41;
    const pawPath = new Path2D(PAW_D);

    type Spec = {
      id: string;
      kind: "powered" | "book";
      shape: "pill" | "card" | "stamp";
      name: string;
      tag: string;
      bg: string | null;
      border: string | null;
      paw: string;
      word: string;
      small: string;
      _w?: number;
      _h?: number;
    };

    const POWERED: Spec[] = [
      { id: "powered-by-genera-pill-forest", kind: "powered", shape: "pill", name: "Pill — Forest", tag: "Footer favourite", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
      { id: "powered-by-genera-pill-cream", kind: "powered", shape: "pill", name: "Pill — Cream", tag: "Light backgrounds", bg: "#EAF3F4", border: "#D5E7E9", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
      { id: "powered-by-genera-pill-light", kind: "powered", shape: "pill", name: "Pill — Outline", tag: "Transparent", bg: null, border: "#C2E2E6", paw: "#FFA800", word: "#003E45", small: "#6A8A8F" },
      { id: "powered-by-genera-card-forest", kind: "powered", shape: "card", name: "Card — Forest", tag: "With tagline", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "#FFC34D" },
      { id: "powered-by-genera-card-cream", kind: "powered", shape: "card", name: "Card — Cream", tag: "With tagline", bg: "#FFFFFF", border: "#E2EEF0", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
      { id: "powered-by-genera-stamp-forest", kind: "powered", shape: "stamp", name: "Stamp — Forest", tag: "Compact", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
    ];

    const BOOK: Spec[] = [
      { id: "book-with-genera-pill-forest", kind: "book", shape: "pill", name: "Pill — Forest", tag: "Footer favourite", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
      { id: "book-with-genera-pill-cream", kind: "book", shape: "pill", name: "Pill — Cream", tag: "Light backgrounds", bg: "#EAF3F4", border: "#D5E7E9", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
      { id: "book-with-genera-pill-light", kind: "book", shape: "pill", name: "Pill — Outline", tag: "Transparent", bg: null, border: "#C2E2E6", paw: "#FFA800", word: "#003E45", small: "#6A8A8F" },
      { id: "book-with-genera-card-forest", kind: "book", shape: "card", name: "Card — Forest", tag: "With tagline", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "#FFC34D" },
      { id: "book-with-genera-card-cream", kind: "book", shape: "card", name: "Card — Cream", tag: "With tagline", bg: "#FFFFFF", border: "#E2EEF0", paw: "#FFA800", word: "#003E45", small: "#5E8085" },
      { id: "book-with-genera-stamp-forest", kind: "book", shape: "stamp", name: "Stamp — Forest", tag: "Compact", bg: "#003E45", border: null, paw: "#FFA800", word: "#FFFFFF", small: "rgba(255,255,255,0.6)" },
    ];

    function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function setFont(ctx: CanvasRenderingContext2D, weight: number, size: number, fam: string, ls?: number) {
      ctx.font = weight + " " + size + "px " + fam;
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = (ls || 0) + "px";
      } catch {
        /* noop */
      }
    }
    function measure(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, fam: string, ls?: number) {
      setFont(ctx, weight, size, fam, ls);
      return ctx.measureText(text).width;
    }

    function layout(spec: Spec, mctx: CanvasRenderingContext2D) {
      const GOLD_FAM = '"massilia"',
        BODY = '"niveau-grotesk"';
      const isBook = spec.kind === "book";
      const SMALL = isBook ? "BOOK WITH" : "POWERED BY";
      const LEAD = isBook ? "Book with GENERA" : "Powered by GENERA";
      const TAGLINE = isBook ? "Online booking made easy" : "A Better Breed of Software";

      if (spec.shape === "pill") {
        const pawH = 30,
          padL = 22,
          padR = 25,
          gap = 13,
          H = 56;
        const smallW = measure(mctx, SMALL, 700, 10.5, BODY, 2);
        const wordW = measure(mctx, "GENERA", 800, 22, GOLD_FAM, 1);
        const pawW = PAW_W * (pawH / PAW_H);
        const textW = Math.max(smallW, wordW);
        const W = padL + pawW + gap + textW + padR;
        return {
          w: W,
          h: H,
          draw: function (ctx: CanvasRenderingContext2D) {
            const tx = padL + pawW + gap;
            const ph = pawH,
              py = (H - ph) / 2;
            ctx.save();
            ctx.translate(padL, py);
            ctx.scale(ph / PAW_H, ph / PAW_H);
            ctx.fillStyle = spec.paw;
            ctx.fill(pawPath);
            ctx.restore();
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillStyle = spec.small;
            setFont(ctx, 700, 10.5, BODY, 2);
            ctx.fillText(SMALL, tx, H / 2 - 10);
            ctx.fillStyle = spec.word;
            setFont(ctx, 800, 22, GOLD_FAM, 1);
            ctx.fillText("GENERA", tx, H / 2 + 8);
          },
        };
      }

      if (spec.shape === "card") {
        const pawHc = 48,
          padLc = 27,
          padRc = 30,
          gapc = 18,
          Hc = 96;
        const l1W = measure(mctx, LEAD, 700, 20, GOLD_FAM, 0.3);
        const l2W = measure(mctx, TAGLINE, 600, 12.5, BODY, 0.4);
        const pawWc = PAW_W * (pawHc / PAW_H);
        const textWc = Math.max(l1W, l2W);
        const Wc = padLc + pawWc + gapc + textWc + padRc;
        return {
          w: Wc,
          h: Hc,
          draw: function (ctx: CanvasRenderingContext2D) {
            const ph = pawHc,
              py = (Hc - ph) / 2,
              tx = padLc + pawWc + gapc;
            ctx.save();
            ctx.translate(padLc, py);
            ctx.scale(ph / PAW_H, ph / PAW_H);
            ctx.fillStyle = spec.paw;
            ctx.fill(pawPath);
            ctx.restore();
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillStyle = spec.word;
            setFont(ctx, 700, 20, GOLD_FAM, 0.3);
            ctx.fillText(LEAD, tx, Hc / 2 - 11);
            ctx.fillStyle = spec.small;
            setFont(ctx, 600, 12.5, BODY, 0.4);
            ctx.fillText(TAGLINE, tx, Hc / 2 + 14);
          },
        };
      }

      // stamp
      const pawHs = 50,
        padXs = 26,
        padTop = 22,
        padBot = 22,
        gapPaw = 13,
        gapTxt = 6;
      const smallWs = measure(mctx, SMALL, 700, 10, BODY, 2.5);
      const wordWs = measure(mctx, "GENERA", 800, 22, GOLD_FAM, 1.5);
      const pawWs = PAW_W * (pawHs / PAW_H);
      const Ws = Math.max(pawWs, smallWs, wordWs) + padXs * 2;
      const Hs = padTop + pawHs + gapPaw + 10 + gapTxt + 22 + padBot;
      return {
        w: Ws,
        h: Hs,
        draw: function (ctx: CanvasRenderingContext2D) {
          const cx = Ws / 2;
          ctx.save();
          ctx.translate(cx - pawWs / 2, padTop);
          ctx.scale(pawHs / PAW_H, pawHs / PAW_H);
          ctx.fillStyle = spec.paw;
          ctx.fill(pawPath);
          ctx.restore();
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          const yLabel = padTop + pawHs + gapPaw + 5;
          const yWord = yLabel + 5 + gapTxt + 11;
          ctx.fillStyle = spec.small;
          setFont(ctx, 700, 10, BODY, 2.5);
          ctx.fillText(SMALL, cx, yLabel);
          ctx.fillStyle = spec.word;
          setFont(ctx, 800, 22, GOLD_FAM, 1.5);
          ctx.fillText("GENERA", cx, yWord);
        },
      };
    }

    function render(spec: Spec, scale: number) {
      const m = document.createElement("canvas").getContext("2d")!;
      const L = layout(spec, m);
      spec._w = Math.round(L.w);
      spec._h = Math.round(L.h);
      const cv = document.createElement("canvas");
      cv.width = Math.round(L.w * scale);
      cv.height = Math.round(L.h * scale);
      const ctx = cv.getContext("2d")!;
      ctx.scale(scale, scale);
      if (spec.bg) {
        rr(ctx, 0, 0, L.w, L.h, spec.shape === "pill" ? L.h / 2 : spec.shape === "stamp" ? 26 : 18);
        ctx.fillStyle = spec.bg;
        ctx.fill();
      }
      if (spec.border) {
        const inset = 0.75;
        rr(ctx, inset, inset, L.w - inset * 2, L.h - inset * 2, spec.shape === "pill" ? (L.h - inset * 2) / 2 : spec.shape === "stamp" ? 26 : 18);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = spec.border;
        ctx.stroke();
      }
      L.draw(ctx);
      return { canvas: cv, w: spec._w, h: spec._h };
    }

    function esc(s: string) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function legacyCopy(text: string) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      ta.remove();
    }

    function currentLink() {
      const el = document.getElementById("linkInput") as HTMLInputElement | null;
      return (el?.value || BADGE_BASE_URL).trim();
    }

    function labelFor(spec: Spec) {
      return spec.kind === "book" ? "Book with Genera" : "Powered by Genera";
    }

    function codeFor(spec: Spec) {
      const link = currentLink();
      const label = labelFor(spec);
      return (
        '<a href="' +
        link +
        '" target="_blank" rel="noopener"\n   title="' +
        label +
        '">\n  <img src="' +
        BADGE_BASE_URL +
        "/badges/" +
        spec.id +
        '.png"\n       alt="' +
        label +
        ' — dog daycare software"\n       width="' +
        spec._w +
        '" height="' +
        spec._h +
        '"\n       style="height:auto;border:0;">\n</a>'
      );
    }
    function codeHTML(spec: Spec) {
      const link = currentLink();
      const label = labelFor(spec);
      return (
        '<span class="t">&lt;a</span> <span class="a">href</span>=<span class="s">"' +
        esc(link) +
        '"</span> <span class="a">target</span>=<span class="s">"_blank"</span> <span class="a">rel</span>=<span class="s">"noopener"</span>\n   <span class="a">title</span>=<span class="s">"' +
        esc(label) +
        '"</span><span class="t">&gt;</span>\n  <span class="t">&lt;img</span> <span class="a">src</span>=<span class="s">"' +
        BADGE_BASE_URL +
        "/badges/" +
        spec.id +
        '.png"</span>\n       <span class="a">alt</span>=<span class="s">"' +
        esc(label) +
        ' — dog daycare software"</span>\n       <span class="a">width</span>=<span class="s">"' +
        spec._w +
        '"</span> <span class="a">height</span>=<span class="s">"' +
        spec._h +
        '"</span>\n       <span class="a">style</span>=<span class="s">"height:auto;border:0;"</span><span class="t">&gt;</span>\n<span class="t">&lt;/a&gt;</span>'
      );
    }

    type Ref = {
      spec: Spec;
      cvHolder: HTMLElement;
      preview: HTMLElement;
      pre: HTMLElement;
      codeWrap: HTMLElement;
    };

    const grid = document.getElementById("grid");
    const bookGrid = document.getElementById("grid-book");
    if (!grid || !bookGrid) return;
    grid.innerHTML = "";
    bookGrid.innerHTML = "";
    const cardRefs: Ref[] = [];

    function download(spec: Spec) {
      const r = render(spec, 3);
      r.canvas.toBlob(function (blob) {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = spec.id + ".png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1000);
      }, "image/png");
    }

    function buildCard(spec: Spec, target: HTMLElement) {
      const card = document.createElement("div");
      card.className = "card";
      const preview = document.createElement("div");
      preview.className = "preview";
      const cvHolder = document.createElement("div");
      preview.appendChild(cvHolder);

      const body = document.createElement("div");
      body.className = "card-body";
      const head = document.createElement("div");
      head.className = "card-head";
      head.innerHTML = '<span class="nm">' + spec.name + '</span><span class="tag">' + spec.tag + "</span>";

      const btns = document.createElement("div");
      btns.className = "btns";
      const dl = document.createElement("button");
      dl.className = "btn btn-primary";
      dl.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M5 21h14"/></svg>Download PNG';
      const cp = document.createElement("button");
      cp.className = "btn btn-ghost";
      cp.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>Copy code';
      btns.appendChild(dl);
      btns.appendChild(cp);

      const codeWrap = document.createElement("div");
      codeWrap.className = "code-wrap";
      const pre = document.createElement("pre");
      pre.className = "code";
      codeWrap.appendChild(pre);

      body.appendChild(head);
      body.appendChild(btns);
      body.appendChild(codeWrap);
      card.appendChild(preview);
      card.appendChild(body);
      target.appendChild(card);

      const ref: Ref = { spec, cvHolder, preview, pre, codeWrap };
      cardRefs.push(ref);

      dl.addEventListener("click", function () {
        download(spec);
      });
      cp.addEventListener("click", function () {
        function feedback() {
          codeWrap.classList.add("open");
          pre.innerHTML = codeHTML(spec);
          const orig = cp.innerHTML;
          cp.classList.add("copied");
          cp.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Copied!';
          setTimeout(function () {
            cp.classList.remove("copied");
            cp.innerHTML = orig;
          }, 1700);
        }
        const text = codeFor(spec);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(feedback, function () {
            legacyCopy(text);
            feedback();
          });
        } else {
          legacyCopy(text);
          feedback();
        }
      });
      return ref;
    }

    function paintPreview(ref: Ref) {
      const scale = Math.max(2, window.devicePixelRatio || 1);
      const r = render(ref.spec, scale);
      r.canvas.style.width = r.w + "px";
      r.canvas.style.height = r.h + "px";
      ref.cvHolder.innerHTML = "";
      ref.cvHolder.appendChild(r.canvas);
      if (ref.codeWrap.classList.contains("open")) ref.pre.innerHTML = codeHTML(ref.spec);
    }

    const swatches = Array.from(document.querySelectorAll<HTMLElement>(".bk .swatch"));
    swatches.forEach(function (sw) {
      sw.addEventListener("click", function () {
        swatches.forEach(function (s) {
          s.classList.remove("active");
        });
        sw.classList.add("active");
        const bg = sw.getAttribute("data-bg");
        const checker = sw.getAttribute("data-checker");
        cardRefs.forEach(function (ref) {
          if (checker) {
            ref.preview.classList.add("checker");
            ref.preview.style.background = "";
          } else {
            ref.preview.classList.remove("checker");
            ref.preview.style.background = bg || "";
          }
        });
      });
    });

    const linkInput = document.getElementById("linkInput");
    const onLinkInput = function () {
      cardRefs.forEach(function (ref) {
        if (ref.codeWrap.classList.contains("open")) ref.pre.innerHTML = codeHTML(ref.spec);
      });
    };
    linkInput?.addEventListener("input", onLinkInput);

    POWERED.forEach((s) => buildCard(s, grid));
    BOOK.forEach((s) => buildCard(s, bookGrid));

    function paintAll() {
      cardRefs.forEach(paintPreview);
    }

    if (document.fonts && document.fonts.ready) {
      Promise.all([
        document.fonts.load('800 23px "massilia"'),
        document.fonts.load('700 21px "massilia"'),
        document.fonts.load('700 11px "niveau-grotesk"'),
        document.fonts.load('600 13px "niveau-grotesk"'),
      ]).then(function () {
        paintAll();
      });
      document.fonts.ready.then(paintAll);
    }
    paintAll();
    window.addEventListener("load", paintAll);

    return () => {
      window.removeEventListener("load", paintAll);
      linkInput?.removeEventListener("input", onLinkInput);
    };
  }, []);

  return (
    <>
      {/* Page hero — matches the gradient hero used across the site */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-mid to-[#007080] px-8 pt-32 pb-28 text-white">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow !text-gold-soft">Proud to power your pack</p>
          <h1 className="mt-2 text-white">
            Show families you run on <em className="text-gold">Genera</em>
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-white/80">
            Add a “Powered by Genera” badge to your daycare website. Pick a style, grab the
            PNG or the copy-paste code, and link your families straight back to us — no design
            skills needed.
          </p>
        </div>
      </section>

      <div className="bk">
      <div className="linkbar">
        <div className="lbl">
          Badge links to
          <small>Edit this and every snippet updates instantly</small>
        </div>
        <input id="linkInput" type="text" defaultValue={BADGE_BASE_URL} spellCheck={false} />
      </div>

      <main className="wrap">
        <div className="controls">
          <h2>Choose your badge</h2>
          <div className="bg-toggle">
            <span>Preview on</span>
            <div className="swatch active" data-bg="var(--cream)" title="Cream" style={{ background: "#F8FAFB" }} />
            <div
              className="swatch"
              data-bg="#ffffff"
              data-checker="1"
              title="Transparent / white"
              style={{ background: "repeating-conic-gradient(#d8e3e4 0% 25%, #fff 0% 50%) 0/14px 14px" }}
            />
          </div>
        </div>

        <h3 className="group-h">Powered by Genera</h3>
        <p className="group-sub">Show families which software runs your daycare.</p>
        <div className="grid" id="grid" />

        <h3 className="group-h">Book with Genera</h3>
        <p className="group-sub">Send clients straight to your online booking page.</p>
        <div className="grid" id="grid-book" />
      </main>

      <section className="steps">
        <div className="inner">
          <h2>Add it in three steps</h2>
          <p className="sub">However you build your site, a Genera badge takes under a minute.</p>
          <div className="step-grid">
            <div className="step">
              <div className="num">1</div>
              <h3>Pick &amp; grab</h3>
              <p>
                Choose a style above. Hit <b>Copy code</b> for a paste-ready snippet, or{" "}
                <b>Download PNG</b> for a high-resolution image.
              </p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Drop it in</h3>
              <p>
                Paste the code into your website footer, or upload the PNG anywhere your site
                builder lets you add an image and link.
              </p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>You&apos;re linked</h3>
              <p>
                The badge points families straight to generasoftware.com — building trust and
                showing off the software behind your daycare.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
.bk{
  --cream:#F8FAFB; --cream-dark:#EEF4F5;
  --forest:#003E45; --forest-mid:#005060; --forest-dark:#002830;
  --gold:#FFA800; --gold-light:#FFC34D; --gold-soft:#FFE099;
  --teal-soft:#E0F0F2; --teal-mid:#C2E2E6; --teal-line:#D5E7E9;
  --ink:#111827; --ink-soft:#4B5563;
  --f-head:"massilia", ui-sans-serif, system-ui, sans-serif;
  --f-body:"niveau-grotesk", ui-sans-serif, system-ui, sans-serif;
  font-family:var(--f-body); background:var(--cream); color:var(--ink); line-height:1.5;
  position:relative; display:flow-root;
}
.bk *{ box-sizing:border-box; margin:0; padding:0; }
.bk a{ color:inherit; }
.bk h1,.bk h2,.bk h3{ font-family:var(--f-head); font-weight:700; line-height:1.04; letter-spacing:-0.01em; }

.bk .linkbar{
  max-width:1160px; margin:-44px auto 0; position:relative; z-index:10;
  background:#fff; border:1px solid var(--teal-line); border-radius:18px;
  box-shadow:0 18px 50px rgba(0,62,69,0.12);
  padding:22px 26px; display:flex; flex-wrap:wrap; align-items:center; gap:16px;
}
.bk .linkbar .lbl{ font-family:var(--f-head); font-weight:600; color:var(--forest); font-size:1.02rem; }
.bk .linkbar .lbl small{ display:block; font-family:var(--f-body); font-weight:600; color:var(--ink-soft); font-size:0.8rem; letter-spacing:0; }
.bk .linkbar input{
  flex:1; min-width:260px; font-family:var(--f-body); font-size:0.98rem; color:var(--forest);
  border:1.5px solid var(--teal-mid); border-radius:11px; padding:12px 15px; background:var(--cream);
  transition:border .15s ease, box-shadow .15s ease;
}
.bk .linkbar input:focus{ outline:none; border-color:var(--forest); box-shadow:0 0 0 4px rgba(0,62,69,0.08); background:#fff; }

.bk .wrap{ max-width:1160px; margin:0 auto; padding:0 28px; }
.bk .controls{
  display:flex; flex-wrap:wrap; align-items:center; gap:14px;
  margin:54px 0 26px;
}
.bk .controls h2{ font-size:1.7rem; color:var(--forest); margin-right:auto; }
.bk .bg-toggle{ display:flex; align-items:center; gap:8px; }
.bk .bg-toggle span{ font-family:var(--f-head); font-weight:500; font-size:0.85rem; color:var(--ink-soft); }
.bk .swatch{
  width:30px; height:30px; border-radius:9px; cursor:pointer; border:2px solid transparent;
  box-shadow:inset 0 0 0 1px rgba(0,40,48,0.12); transition:transform .12s ease;
}
.bk .swatch:hover{ transform:scale(1.08); }
.bk .swatch.active{ border-color:var(--gold); box-shadow:0 0 0 2px var(--gold-soft); }

.bk .group-h{
  font-size:1.35rem; color:var(--forest); margin:30px 0 2px;
}
.bk .group-h:first-of-type{ margin-top:8px; }
.bk .group-sub{ color:var(--ink-soft); font-size:0.98rem; margin-bottom:20px; }
.bk .grid{
  display:grid; grid-template-columns:repeat(auto-fill, minmax(330px,1fr));
  gap:24px; padding-bottom:30px;
}
.bk .card{
  background:#fff; border:1px solid var(--teal-line); border-radius:20px; overflow:hidden;
  box-shadow:0 6px 22px rgba(0,62,69,0.06); display:flex; flex-direction:column;
  transition:box-shadow .2s ease, transform .2s ease;
}
.bk .card:hover{ box-shadow:0 16px 40px rgba(0,62,69,0.12); transform:translateY(-3px); }
.bk .preview{
  --pv:var(--cream);
  background:var(--pv); background-size:18px 18px;
  min-height:148px; display:flex; align-items:center; justify-content:center;
  padding:26px; transition:background .2s ease;
  position:relative; border-bottom:1px solid var(--teal-line);
}
.bk .preview.checker{
  background-image:
    linear-gradient(45deg, rgba(0,40,48,0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0,40,48,0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0,40,48,0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0,40,48,0.05) 75%);
  background-position:0 0, 0 9px, 9px -9px, -9px 0;
  background-color:#fff;
}
.bk .preview canvas{ display:block; max-width:100%; height:auto; }
.bk .card-body{ padding:17px 20px 20px; display:flex; flex-direction:column; gap:13px; }
.bk .card-head{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; }
.bk .card-head .nm{ font-family:var(--f-head); font-weight:600; font-size:1.06rem; color:var(--forest); white-space:nowrap; }
.bk .card-head .tag{
  font-family:var(--f-body); font-weight:700; font-size:0.66rem; letter-spacing:0.08em; text-transform:uppercase;
  color:var(--forest-mid); background:var(--teal-soft); padding:4px 9px; border-radius:999px; white-space:nowrap;
}
.bk .btns{ display:flex; gap:9px; }
.bk .btn{
  flex:1; font-family:var(--f-head); font-weight:500; font-size:0.9rem;
  padding:11px 12px; border-radius:11px; border:none; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  transition:background .16s ease, transform .12s ease, box-shadow .16s ease; white-space:nowrap;
}
.bk .btn svg{ width:16px; height:16px; }
.bk .btn:active{ transform:translateY(1px); }
.bk .btn-primary{ background:var(--forest); color:#fff; box-shadow:0 3px 12px rgba(0,62,69,0.2); }
.bk .btn-primary:hover{ background:var(--forest-mid); box-shadow:0 6px 18px rgba(0,62,69,0.28); }
.bk .btn-ghost{ background:var(--cream-dark); color:var(--forest); box-shadow:inset 0 0 0 1.5px var(--teal-mid); }
.bk .btn-ghost:hover{ box-shadow:inset 0 0 0 1.5px var(--forest); }
.bk .btn.copied{ background:var(--gold); color:var(--ink); box-shadow:0 3px 12px rgba(255,168,0,0.4); }

.bk .code-wrap{ display:none; }
.bk .code-wrap.open{ display:block; }
.bk pre.code{
  background:var(--forest-dark); color:#cfe7ea; border-radius:12px;
  padding:14px 15px; font-family:"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace;
  font-size:0.74rem; line-height:1.55; overflow-x:auto; white-space:pre; margin-top:2px;
}
.bk pre.code .t{ color:#7fd4d0; }
.bk pre.code .a{ color:#ffd27a; }
.bk pre.code .s{ color:#b6e7a8; }

.bk .steps{
  background:#fff; border-top:1px solid var(--teal-line); margin-top:40px;
  padding:60px 28px 70px;
}
.bk .steps .inner{ max-width:1160px; margin:0 auto; }
.bk .steps h2{ font-size:1.9rem; color:var(--forest); text-align:center; }
.bk .steps .sub{ text-align:center; color:var(--ink-soft); margin:10px auto 40px; max-width:48ch; font-size:1.05rem; }
.bk .step-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:22px; }
.bk .step{
  background:var(--cream); border:1px solid var(--teal-line); border-radius:16px; padding:26px 24px;
}
.bk .step .num{
  width:38px; height:38px; border-radius:11px; background:var(--gold);
  display:grid; place-items:center; font-family:var(--f-head); font-weight:700; color:var(--ink);
  font-size:1.1rem; margin-bottom:15px;
}
.bk .step h3{ font-size:1.18rem; color:var(--forest); margin-bottom:7px; }
.bk .step p{ color:var(--ink-soft); font-size:0.96rem; }

@media (max-width:560px){
  .bk .controls h2{ width:100%; margin-bottom:6px; }
}
      `}</style>
      </div>
    </>
  );
}
