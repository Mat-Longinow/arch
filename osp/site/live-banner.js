/* OSP site-wide "Watch live" banner + modal (DWTS 2026).
 * Loaded on EVERY page via Webflow site-wide custom code (one-time). Behaviour is driven by
 * live-stream.json in this repo, so show-night changes ship by git push, no Designer.
 * Two phases. TEASER (teaser_enabled, from teaser_start): "don't miss the live stream" bar linking to
 * teaser_url, dismissable per session. LIVE (enabled && now in [show_start, show_end], or force_on, AND
 * embed_url or watch_url set): "watch live" bar + modal player. Teaser holds on show night until URLs exist. Never throws into the host page. */
(function () {
  function lcStartOverlay(host, c) {
    var t = Date.parse(c.stream_start); if (!(t > Date.now())) return;
    var lbl = new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" });
    var o = document.createElement("div"); o.className = "lc-start-ov";
    o.style.cssText = "position:absolute;inset:0;z-index:3;background:rgba(45,45,45,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;font-family:proxima-nova,Arial,sans-serif;padding:16px;box-sizing:border-box";
    o.innerHTML = '<div style="font-size:clamp(16px,2.6vw,24px);font-weight:600;letter-spacing:.02em">Live Stream Starting At</div><div style="font-size:clamp(30px,6vw,56px);font-weight:700;line-height:1.1;margin-top:8px">' + lbl + "</div>";
    host.appendChild(o);
    var iv = setInterval(function () { if (Date.now() >= t) { if (o.parentNode) o.parentNode.removeChild(o); clearInterval(iv); } }, 10000);
  }

  try {
    if (window.__lcLiveBannerLoaded) return;
    window.__lcLiveBannerLoaded = true;
    // raw GitHub, not jsDelivr: @main edge cache lags ~7 days. Non-prod hosts read the preview config.
    var PROD = /^(www\.)?ospshasta\.org$/.test(location.hostname);
    var CFG = "https://raw.githubusercontent.com/Mat-Longinow/arch/main/osp/site/" + (PROD ? "live-stream.json" : "live-stream.preview.json");
    var OK_HOSTS = /^(www\.youtube\.com|www\.youtube-nocookie\.com|www\.facebook\.com|player\.vimeo\.com|vimeo\.com)$/;

    function safeUrl(u) {
      try { var x = new URL(u); return x.protocol === "https:" ? x : null; } catch (e) { return null; }
    }
    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    // two-line copy: explicit title + description, else split a legacy single string at the first ": " or ". "
    function split2(t, d, whole) {
      if (t) return [t, d || ""];
      var w = String(whole || ""), m = w.match(/^(.*?)(?::\s+|\.\s+)(.*)$/);
      return m ? [m[1], m[2].charAt(0).toUpperCase() + m[2].slice(1)] : [w, ""];
    }

    fetch(CFG + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        var now = Date.now();
        var inWindow = now >= Date.parse(c.show_start) && now <= Date.parse(c.show_end);
        var embed = safeUrl(c.embed_url);
        if (embed && !OK_HOSTS.test(embed.hostname)) embed = null;
        var watch = safeUrl(c.watch_url);
        var liveReady = !!(embed || watch);
        // ?live=preview forces LIVE mode at any time (ignores the time window and the enabled flag); plain URLs keep the window logic
        var previewLive = /[?&]live=preview(&|$)/.test(location.search);
        var live = !!(liveReady && (previewLive || c.force_on || (c.enabled && inWindow)));
        // teaser: from teaser_start until show_end, and it holds through show night until a stream URL exists
        var tStart = c.teaser_start ? Date.parse(c.teaser_start) : 0;
        var teaser = !live && !!c.teaser_text && (!!c.force_teaser || (!!c.teaser_enabled && now >= tStart && now <= Date.parse(c.show_end)));
        try { if (teaser && !c.force_teaser && sessionStorage.getItem("lcLiveTeaserX") === String(c.teaser_start)) return; } catch (e) {}
        if (!live && !teaser) return;
        var teaserUrl = safeUrl(c.teaser_url);

        var css = document.createElement("style");
        css.textContent =
          "#lc-live-wrap{position:absolute;left:0;right:0;top:0;z-index:50;box-sizing:border-box;padding:0 16px;margin:0;background:none;pointer-events:none;height:0}" +
          "#lc-live-bar{position:relative;display:flex;gap:16px;align-items:center;justify-content:space-between;box-sizing:border-box;width:100%;max-width:1100px;margin:0 auto;padding:16px 20px;background:#fff;border:1px solid #d9c3db;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.22);pointer-events:auto;color:#632466;font-family:proxima-nova,Arial,sans-serif;text-align:left}" +
          "#lc-live-bar .lc-l{display:flex;align-items:center;gap:14px;min-width:0;flex:1 1 auto}" +
          "#lc-live-bar .lc-r{display:flex;align-items:center;gap:12px;flex:0 0 auto}" +
          "#lc-live-bar .lc-ic{flex:0 0 auto;width:24px;height:24px;box-sizing:border-box;background:#632466;color:#fff;border-radius:50%;font:italic 700 15px/24px Georgia,serif;text-align:center}" +
          "#lc-live-bar .lc-dot{flex:0 0 auto;width:14px;height:14px;margin:5px;border-radius:50%;background:#632466;animation:lcp 1.2s infinite}" +
          "@keyframes lcp{50%{opacity:.25}}" +
          "#lc-live-bar .lc-txt{display:flex;flex-direction:column;gap:2px;min-width:0;text-align:left}" +
          "#lc-live-bar .lc-t1{font-size:17px;font-weight:700;line-height:24px;color:#632466}" +
          "#lc-live-bar .lc-t2{font-size:15px;font-weight:400;line-height:22px;color:#632466}" +
                    "#lc-live-bar button.lc-btn,#lc-live-bar a.lc-go{cursor:pointer;text-decoration:none;display:inline-block;white-space:nowrap;border:1px solid #f2be00;background:#f2be00;color:#632466;font-family:proxima-nova,Arial,sans-serif;font-size:14px;font-weight:600;line-height:1;text-transform:uppercase;letter-spacing:.02em;padding:11px 20px;border-radius:6px}" +
          "#lc-live-bar button.lc-btn:hover,#lc-live-bar a.lc-go:hover{background:#fff;color:#632466;border-color:#632466}" +
          "#lc-live-bar .lc-tx{flex:0 0 auto;width:28px;height:28px;background:none;border:0;border-radius:4px;color:#632466;opacity:.6;font-size:22px;line-height:1;padding:0;cursor:pointer}#lc-live-bar .lc-tx:hover{opacity:1;background:rgba(99,36,102,.08)}" +
          "@media(max-width:600px){#lc-live-wrap{padding-left:10px!important;padding-right:10px!important;}#lc-live-bar{flex-wrap:wrap;gap:12px;padding:14px 44px 14px 14px}#lc-live-bar .lc-l{flex:1 1 100%}#lc-live-bar .lc-t1{font-size:16px;line-height:22px}#lc-live-bar .lc-t2{font-size:14px;line-height:20px}#lc-live-bar .lc-r{display:contents}#lc-live-bar .lc-tx{position:absolute;right:8px;top:8px}#lc-live-bar button.lc-btn,#lc-live-bar a.lc-go{margin-left:38px;padding:10px 16px}}" +
          "#lc-live-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(40,12,42,.78);padding:16px;font-family:proxima-nova,Arial,sans-serif}" +
          "#lc-live-modal.open{display:flex}" +
          "#lc-live-box{position:relative;box-sizing:border-box;width:100%;max-width:960px;max-height:100%;overflow:auto;background:#fff;border:1px solid #d9c3db;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.22);padding:20px;color:#632466}" +
          "#lc-live-box .lc-sp{display:flex;flex-direction:column;align-items:center;gap:6px;margin:0 36px 14px;text-align:center;font-size:13px;line-height:1.2;color:#632466}#lc-live-box .lc-sp img{height:56px;width:auto;max-width:220px}" +
          "#lc-live-box h2{margin:0 36px 14px;text-align:center;font-size:22px;line-height:1.25;font-weight:700;color:#632466}" +
          "#lc-live-x{position:absolute;top:10px;right:12px;width:28px;height:28px;background:none;border:0;border-radius:4px;color:#632466;opacity:.6;font-size:24px;line-height:1;padding:0;cursor:pointer}#lc-live-x:hover{opacity:1;background:rgba(99,36,102,.08)}" +
          "#lc-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:6px;overflow:hidden}" +
          "#lc-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}" +
          "#lc-live-box a.lc-alt{display:inline-block;margin-top:12px;font-size:14px;font-weight:600;color:#632466;text-decoration:underline}" +
          "@media(max-width:600px){#lc-live-box{padding:14px}#lc-live-box h2{font-size:18px}#lc-live-box .lc-sp img{height:44px}}";
        document.head.appendChild(css);

        var wrap = document.createElement("div");
        wrap.id = "lc-live-wrap";
        var bar = document.createElement("div");
        bar.id = "lc-live-bar";
        wrap.appendChild(bar);
        // Webflow navs are out of flow (fixed OR absolute, depending on breakpoint/interaction state), some
        // transparent with white links over the hero. The wrap is absolutely positioned (zero height, no background,
        // so the hero never moves and the transparent nav is untouched) and floats over the hero, offset by
        // the bottom of whatever nav-like element is really occupying the top of the page (measured, never a
        // fixed px), plus 12px. Re-measured on load, resize, scroll, fonts, images, DOM/size changes and on a
        // short timer, because Webflow reveals/resizes the nav late. Never covers the nav or hero.
        function navBottom() {
          var h = 0, bg = "", seen = [];
          function consider(n) {
            if (!n || n === wrap || wrap.contains(n) || seen.indexOf(n) > -1) return;
            seen.push(n);
            var cs = getComputedStyle(n);
            if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return;
            if (cs.position !== "fixed" && cs.position !== "absolute" && cs.position !== "sticky") return;
            var r = n.getBoundingClientRect();
            if (r.height < 20 || r.width < window.innerWidth * 0.5 || r.top > 150 || r.bottom < 20) return;
            var bottom = cs.position === "absolute" ? r.bottom + window.pageYOffset : r.bottom;
            if (bottom > h) { h = bottom; bg = cs.backgroundColor; }
          }
          // the scroll-reveal nav (.navbar-2) only appears after scrolling; it must not resize the page mid-scroll
          document.querySelectorAll(".w-nav[role=banner],.w-nav").forEach(function (n) {
            if (/navbar-2|footer/.test(n.className)) return;
            consider(n);
          });
          Array.prototype.forEach.call(document.body.children, function (n) {
            if (n.id === "lc-live-modal" || /navbar-2|footer/.test(n.className)) return;
            consider(n);
            if (/w-nav/.test(n.className)) return; // never treat a nav's own menu overlay as the nav
            Array.prototype.forEach.call(n.children || [], function (k) { if (!/w-nav/.test(k.className)) consider(k); });
          });
          return { h: h, bg: bg };
        }
        // left edge of the first nav link ("Services") and right edge of the last ("Giving"), viewport coords
        function navSpan() {
          var links = [], navs = document.querySelectorAll(".w-nav");
          Array.prototype.forEach.call(navs, function (nv) {
            if (/navbar-2|footer/.test(nv.className)) return;
            Array.prototype.forEach.call(nv.querySelectorAll("a"), function (a) {
              var r = a.getBoundingClientRect(), cs = getComputedStyle(a);
              if (cs.display === "none" || cs.visibility === "hidden" || r.width < 8 || r.height < 8 || r.top > 200 || r.bottom < 0) return;
              if (/^(services|giving)$/i.test((a.textContent || "").trim())) links.push(r);
            });
          });
          var first = null, last = null;
          links.forEach(function (r) { if (!first || r.left < first.left) first = r; if (!last || r.right > last.right) last = r; });
          if (!first || !last || last.right - first.left < 300) return null;
          return { l: first.left, r: last.right };
        }
        // Home hero overlay (.black-overlay.home) is a native 75vh Webflow block; the card floats over its top, so give the hero the card's
        // height back (+ the 12px gap) while the card is up. Only touches the home hero, only when its native
        // height is still 75vh, and is undone on dismiss.
        function heroFix(extra) {
          var overlay = document.querySelector(".services-main.home .black-overlay.home");
          var img = document.querySelector(".services-main.home .main-image.home");
          if (!overlay || !img) return;
          if (!extra) {
            if (overlay.getAttribute("data-lc-hero")) { overlay.style.height = ""; img.style.height = ""; overlay.removeAttribute("data-lc-hero"); }
            return;
          }
          if (!overlay.getAttribute("data-lc-hero")) {
            if (Math.abs(overlay.getBoundingClientRect().height - window.innerHeight * 0.75) > 3) return; // not the native 75vh: leave alone
            overlay.setAttribute("data-lc-hero", "1");
          }
          var v = "calc(75vh + " + extra + "px)";
          if (overlay.style.height !== v) { overlay.style.height = v; img.style.height = v; }
        }
        var raf = 0;
        function place() {
          if (raf) return;
          raf = requestAnimationFrame(function () {
            raf = 0;
            if (!wrap.parentNode) return;
            var m = navBottom();
            var top = Math.round(m.h + 12);
            if (wrap.style.top !== top + "px") wrap.style.top = top + "px";
            // width: card edges sit a little inside the first (Services) and last (Giving) top-nav links
            var L = "", R = "";
            if (window.innerWidth > 600) {
              var sp = navSpan();
              if (sp) { L = Math.max(16, Math.round(sp.l + 40)) + "px"; R = Math.max(16, Math.round(window.innerWidth - sp.r + 40)) + "px"; }
            }
            if (wrap.style.paddingLeft !== L) wrap.style.paddingLeft = L;
            if (wrap.style.paddingRight !== R) wrap.style.paddingRight = R;
            bar.style.maxWidth = L ? "none" : ""; // measured span wins; else the CSS max-width, centred
            heroFix(Math.round(bar.offsetHeight + 12));
          });
        }
        function mount() {
          document.body.insertBefore(wrap, document.body.firstChild);
          place();
          ["resize", "load", "scroll", "orientationchange"].forEach(function (ev) { window.addEventListener(ev, place, { passive: true }); });
          try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(place); } catch (e) {}
          document.addEventListener("load", place, true); // images/fonts finishing anywhere (capture)
          try {
            var ro = new ResizeObserver(place);
            document.querySelectorAll(".w-nav").forEach(function (n) { ro.observe(n); });
            new MutationObserver(place).observe(document.body, { attributes: true, attributeFilter: ["class", "style"], subtree: true, childList: false });
          } catch (e) {}
          [300, 800, 1500, 3000, 6000].forEach(function (t) { setTimeout(place, t); });
        }
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Live stream");
        var logo = safeUrl(c.sponsor_logo);
        var sponsor = logo ? '<span class="lc-sp">' + esc(c.sponsor_label || "Sponsored by") + ' <img src="' + esc(logo.href) + '" alt="' + esc(c.sponsor_name || "Stream sponsor") + '"></span>' : "";
        if (teaser) {
          bar.className = "lc-teaser";
          var tt = split2(c.teaser_title, c.teaser_desc, c.teaser_text);
          bar.innerHTML = '<div class="lc-l"><span class="lc-ic" aria-hidden="true">i</span><div class="lc-txt"><span class="lc-t1">' + esc(tt[0]) + '</span><span class="lc-t2">' + esc(tt[1]) + "</span></div></div>" +
            '<div class="lc-r">' + (teaserUrl ? '<a class="lc-go" href="' + esc(teaserUrl.href) + '">' + esc(c.teaser_button_text || "Learn more") + "</a>" : "") +
            '<button type="button" class="lc-tx" aria-label="Dismiss">&times;</button></div>';
          mount();
          bar.querySelector(".lc-tx").addEventListener("click", function () {
          wrap.parentNode.removeChild(wrap); heroFix(0);
            try { sessionStorage.setItem("lcLiveTeaserX", c.teaser_start); } catch (e) {}
          });
          return;
        }
        var lt = split2(c.live_title, c.live_desc, c.banner_text);
        bar.innerHTML = '<div class="lc-l"><span class="lc-dot"></span><div class="lc-txt"><span class="lc-t1">' + esc(lt[0]) + '</span><span class="lc-t2">' + esc(lt[1]) + "</span></div></div>" +
          '<div class="lc-r"><button type="button" class="lc-btn">' + esc(c.button_text || "Watch live") + "</button></div>";
        bar.className = "lc-livebar";
        mount();

        var modal = document.createElement("div");
        modal.id = "lc-live-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.innerHTML = '<div id="lc-live-box"><button id="lc-live-x" type="button" aria-label="Close">&times;</button>' + sponsor + '<h2>' + esc(c.modal_title) + '</h2><div id="lc-live-frame"></div>' +
          (watch ? '<a class="lc-alt" href="' + esc(watch.href) + '" target="_blank" rel="noopener">Having trouble? Open the stream in a new tab</a>' : "") + "</div>";
        document.body.appendChild(modal);

        var frame = modal.querySelector("#lc-live-frame");
        function open() {
          if (embed && !frame.firstChild) {
            var f = document.createElement("iframe");
            f.src = embed.href;
            f.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media; web-share";
            f.allowFullscreen = true;
            f.title = c.modal_title || "Live stream";
            frame.appendChild(f);
            lcStartOverlay(frame, c);
          } else if (!embed && watch) { window.open(watch.href, "_blank", "noopener"); return; }
          modal.classList.add("open");
        }
        function close() { modal.classList.remove("open"); frame.innerHTML = ""; } // empty frame = stops playback
        bar.querySelector(".lc-btn").addEventListener("click", open);
        modal.querySelector("#lc-live-x").addEventListener("click", close);
        modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      })
      .catch(function () {});
  } catch (e) {}
})();
