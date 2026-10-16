/* OSP site-wide "Watch live" banner + modal (DWTS 2026).
 * Loaded on EVERY page via Webflow site-wide custom code (one-time). Behaviour is driven by
 * live-stream.json in this repo, so show-night changes ship by git push, no Designer.
 * Two phases. TEASER (teaser_enabled, from teaser_start): "don't miss the live stream" bar linking to
 * teaser_url, dismissable per session. LIVE (enabled && now in [show_start, show_end], or force_on, AND
 * embed_url or watch_url set): "watch live" bar + modal player. Teaser holds on show night until URLs exist. Never throws into the host page. */
(function () {
  try {
    if (window.__lcLiveBannerLoaded) return;
    window.__lcLiveBannerLoaded = true;
    // raw GitHub, not jsDelivr: @main edge cache lags ~7 days. Non-prod hosts read the preview config.
    var PROD = /^(www\.)?ospshasta\.org$/.test(location.hostname);
    var CFG = "https://raw.githubusercontent.com/Mat-Longinow/arch/main/osp/site/" + (PROD ? "live-stream.json" : "live-stream.preview.json");
    var OK_HOSTS = /^(www\.youtube\.com|www\.youtube-nocookie\.com|www\.facebook\.com|player\.vimeo\.com)$/;

    function safeUrl(u) {
      try { var x = new URL(u); return x.protocol === "https:" ? x : null; } catch (e) { return null; }
    }
    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
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
        var live = !!(liveReady && (c.force_on || (c.enabled && inWindow)));
        // teaser: from teaser_start until show_end, and it holds through show night until a stream URL exists
        var tStart = c.teaser_start ? Date.parse(c.teaser_start) : 0;
        var teaser = !live && !!c.teaser_text && (!!c.force_teaser || (!!c.teaser_enabled && now >= tStart && now <= Date.parse(c.show_end)));
        try { if (teaser && !c.force_teaser && sessionStorage.getItem("lcLiveTeaserX") === String(c.teaser_start)) return; } catch (e) {}
        if (!live && !teaser) return;
        var teaserUrl = safeUrl(c.teaser_url);

        var css = document.createElement("style");
        css.textContent =
          "#lc-live-wrap{position:relative;z-index:1;box-sizing:border-box;padding:0 16px 14px;margin:0;background:#fff}" +
          "#lc-live-bar{position:relative;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;box-sizing:border-box;max-width:1100px;margin:0 auto;padding:14px 44px 14px 16px;background:#f7eef8;border:1px solid #d6b3d8;border-radius:8px;box-shadow:0 2px 8px rgba(99,36,102,.08);color:#632466;font-family:proxima-nova,Arial,sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:center}" +
          "#lc-live-bar .lc-sp{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:400;line-height:1}#lc-live-bar .lc-sp img{height:26px;width:auto;max-width:120px;background:#fff;border-radius:6px;padding:3px 6px}" +
          "#lc-live-box .lc-sp{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px}#lc-live-box .lc-sp img{height:30px;width:auto;max-width:140px;background:#fff;border-radius:7px;padding:3px 6px}" +
          "#lc-live-bar .lc-dot{flex:0 0 auto;width:12px;height:12px;border-radius:50%;background:#632466;animation:lcp 1.2s infinite}" +
          "@keyframes lcp{50%{opacity:.25}}" +
          "#lc-live-bar:before{content:'i';flex:0 0 auto;width:22px;height:22px;box-sizing:border-box;background:#632466;color:#fff;border-radius:50%;font:italic 700 14px/22px Georgia,serif;text-align:center}" +
          "#lc-live-bar.lc-livebar:before{display:none}" +
          "#lc-live-bar button.lc-btn,#lc-live-bar a.lc-go{cursor:pointer;text-decoration:none;display:inline-block;border:1px solid #f2be00;background:#f2be00;color:#632466;font-family:proxima-nova,Arial,sans-serif;font-size:14px;font-weight:600;line-height:1;text-transform:uppercase;letter-spacing:.02em;padding:10px 20px;border-radius:6px}" +
          "#lc-live-bar button.lc-btn:hover,#lc-live-bar a.lc-go:hover{background:#fff;color:#632466;border-color:#632466}" +
          "#lc-live-bar .lc-tx{position:absolute;right:8px;top:8px;width:28px;height:28px;background:none;border:0;border-radius:4px;color:#632466;opacity:.6;font-size:22px;line-height:1;padding:0;cursor:pointer}#lc-live-bar .lc-tx:hover{opacity:1;background:rgba(99,36,102,.08)}" +
          "#lc-live-bar .lc-short{display:none}" +
          "@media(max-width:600px){#lc-live-wrap{padding:0 10px 10px}#lc-live-bar{gap:10px;padding:12px 40px 12px 12px;font-size:15px;line-height:22px;text-align:left;justify-content:flex-start}#lc-live-bar .lc-sp{display:none}#lc-live-bar .lc-long{display:none}#lc-live-bar .lc-short{display:inline;flex:1 1 calc(100% - 40px);min-width:0}#lc-live-bar button.lc-btn,#lc-live-bar a.lc-go{margin-left:34px;padding:9px 16px}}" +
          "#lc-live-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.8);padding:16px}" +
          "#lc-live-modal.open{display:flex}" +
          "#lc-live-box{position:relative;width:100%;max-width:960px;background:#111;border-radius:10px;padding:14px;color:#fff}" +
          "#lc-live-box h2{margin:0 36px 10px 2px;font-size:18px;color:#fff}" +
          "#lc-live-x{position:absolute;top:8px;right:10px;background:none;border:0;color:#fff;font-size:28px;line-height:1;cursor:pointer}" +
          "#lc-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000}" +
          "#lc-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}" +
          "#lc-live-box a{color:#fff;font-size:13px;display:inline-block;margin-top:8px}";
        document.head.appendChild(css);

        var wrap = document.createElement("div");
        wrap.id = "lc-live-wrap";
        var bar = document.createElement("div");
        bar.id = "lc-live-bar";
        wrap.appendChild(bar);
        // Webflow navs are position:fixed (no flow space), some transparent with white links over the hero.
        // So the wrap sits in flow at the top of body, padded down by the visible nav's real height; its
        // background is the nav's own colour (brand purple when the nav is transparent) so the nav stays
        // legible. It never covers the nav or the hero, and scrolls away with the page.
        function place() {
          var h = 0, bg = "";
          ["navbar-responsive", "navbar-copy", "navbar-2"].forEach(function (cl) {
            var n = document.querySelector("." + cl + ".w-nav");
            if (!n) return;
            var cs = getComputedStyle(n);
            if (cs.display === "none" || cs.visibility === "hidden") return;
            var r = n.getBoundingClientRect();
            if (cs.position === "fixed" || cs.position === "sticky") {
              if (r.bottom > h) { h = r.bottom; bg = cs.backgroundColor; }
            }
          });
          wrap.style.paddingTop = Math.round(h + 12) + "px";
          wrap.style.background = (!bg || /rgba\(.*,\s*0\)$|transparent/.test(bg)) ? "#632466" : bg;
        }
        function mount() {
          document.body.insertBefore(wrap, document.body.firstChild);
          place();
          window.addEventListener("resize", place);
          window.addEventListener("load", place);
          setTimeout(place, 800);
        }
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Live stream");
        var logo = safeUrl(c.sponsor_logo);
        var sponsor = logo ? '<span class="lc-sp">' + esc(c.sponsor_label || "Sponsored by") + ' <img src="' + esc(logo.href) + '" alt="' + esc(c.sponsor_name || "Stream sponsor") + '"></span>' : "";
        if (teaser) {
          bar.className = "lc-teaser";
          bar.innerHTML = '<span class="lc-long">' + esc(c.teaser_text) + '</span><span class="lc-short">' + esc(c.teaser_text_short || c.teaser_text) + "</span>" +
            (teaserUrl ? '<a class="lc-go" href="' + esc(teaserUrl.href) + '">' + esc(c.teaser_button_text || "Learn more") + "</a>" : "") + sponsor +
            '<button type="button" class="lc-tx" aria-label="Dismiss">&times;</button>';
          mount();
          bar.querySelector(".lc-tx").addEventListener("click", function () {
            window.removeEventListener("resize", place);
            wrap.parentNode.removeChild(wrap);
            try { sessionStorage.setItem("lcLiveTeaserX", c.teaser_start); } catch (e) {}
          });
          return;
        }
        bar.innerHTML = '<span class="lc-dot"></span><span>' + esc(c.banner_text) + '</span><button type="button" class="lc-btn">' + esc(c.button_text || "Watch live") + "</button>" + sponsor;
        bar.className = "lc-livebar";
        mount();

        var modal = document.createElement("div");
        modal.id = "lc-live-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.innerHTML = '<div id="lc-live-box"><button id="lc-live-x" type="button" aria-label="Close">&times;</button><h2>' + esc(c.modal_title) + '</h2><div id="lc-live-frame"></div>' +
          (watch ? '<a href="' + esc(watch.href) + '" target="_blank" rel="noopener">Having trouble? Open the stream in a new tab</a>' : "") + sponsor + "</div>";
        document.body.appendChild(modal);

        var frame = modal.querySelector("#lc-live-frame");
        function open() {
          if (embed && !frame.firstChild) {
            var f = document.createElement("iframe");
            f.src = embed.href;
            f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
            f.allowFullscreen = true;
            f.title = c.modal_title || "Live stream";
            frame.appendChild(f);
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
