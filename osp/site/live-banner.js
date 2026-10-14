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
          "#lc-live-bar{position:sticky;top:0;z-index:99998;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;padding:18px 20px;background:#632466;color:#fff;font:700 19px/1.3 inherit;text-align:center}" +
          "#lc-live-bar .lc-sp{display:flex;align-items:center;gap:8px;font:500 13px/1 inherit;opacity:.95}#lc-live-bar .lc-sp img{height:26px;width:auto;max-width:120px;background:#fff;border-radius:4px;padding:3px 6px}" +
          "#lc-live-box .lc-sp{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px}#lc-live-box .lc-sp img{height:30px;width:auto;max-width:140px;background:#fff;border-radius:4px;padding:3px 6px}" +
          "@media(max-width:600px){#lc-live-bar{padding:14px 12px;gap:10px;font-size:16px}#lc-live-bar .lc-sp{display:none}}" +
          "#lc-live-bar .lc-dot{width:14px;height:14px;border-radius:50%;background:#f2be00;animation:lcp 1.2s infinite}" +
          "@keyframes lcp{50%{opacity:.25}}" +
          "#lc-live-bar button{cursor:pointer;border:2px solid #f2be00;background:#f2be00;color:#632466;font:800 17px/1 inherit;padding:12px 26px;border-radius:999px}" +
          "#lc-live-bar a.lc-go{text-decoration:none;border:2px solid #f2be00;background:#f2be00;color:#632466;font:800 17px/1 inherit;padding:12px 26px;border-radius:999px}#lc-live-bar a.lc-go:hover{background:transparent;color:#f2be00}" +
          "#lc-live-bar.lc-teaser{padding-right:40px}#lc-live-bar .lc-tx{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:24px;line-height:1;padding:0 6px;cursor:pointer}" +
          "#lc-live-bar .lc-short{display:none}@media(max-width:600px){#lc-live-bar .lc-long{display:none}#lc-live-bar .lc-short{display:inline}#lc-live-bar a.lc-go{font-size:15px;padding:10px 18px}}" +
          "#lc-live-bar button:hover{background:transparent;color:#f2be00}" +
          "#lc-live-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.8);padding:16px}" +
          "#lc-live-modal.open{display:flex}" +
          "#lc-live-box{position:relative;width:100%;max-width:960px;background:#111;border-radius:10px;padding:14px;color:#fff}" +
          "#lc-live-box h2{margin:0 36px 10px 2px;font-size:18px;color:#fff}" +
          "#lc-live-x{position:absolute;top:8px;right:10px;background:none;border:0;color:#fff;font-size:28px;line-height:1;cursor:pointer}" +
          "#lc-live-frame{position:relative;width:100%;aspect-ratio:16/9;background:#000}" +
          "#lc-live-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}" +
          "#lc-live-box a{color:#fff;font-size:13px;display:inline-block;margin-top:8px}";
        document.head.appendChild(css);

        var bar = document.createElement("div");
        bar.id = "lc-live-bar";
        bar.setAttribute("role", "region");
        bar.setAttribute("aria-label", "Live stream");
        var logo = safeUrl(c.sponsor_logo);
        var sponsor = logo ? '<span class="lc-sp">' + esc(c.sponsor_label || "Sponsored by") + ' <img src="' + esc(logo.href) + '" alt="' + esc(c.sponsor_name || "Stream sponsor") + '"></span>' : "";
        if (teaser) {
          bar.className = "lc-teaser";
          bar.innerHTML = '<span class="lc-long">' + esc(c.teaser_text) + '</span><span class="lc-short">' + esc(c.teaser_text_short || c.teaser_text) + "</span>" +
            (teaserUrl ? '<a class="lc-go" href="' + esc(teaserUrl.href) + '">' + esc(c.teaser_button_text || "Learn more") + "</a>" : "") + sponsor +
            '<button type="button" class="lc-tx" aria-label="Dismiss">&times;</button>';
          document.body.insertBefore(bar, document.body.firstChild);
          bar.querySelector(".lc-tx").addEventListener("click", function () {
            bar.parentNode.removeChild(bar);
            try { sessionStorage.setItem("lcLiveTeaserX", c.teaser_start); } catch (e) {}
          });
          return;
        }
        bar.innerHTML = '<span class="lc-dot"></span><span>' + esc(c.banner_text) + '</span><button type="button">' + esc(c.button_text || "Watch live") + "</button>" + sponsor;
        document.body.insertBefore(bar, document.body.firstChild);

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
        bar.querySelector("button").addEventListener("click", open);
        modal.querySelector("#lc-live-x").addEventListener("click", close);
        modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
      })
      .catch(function () {});
  } catch (e) {}
})();
