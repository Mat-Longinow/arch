/* OSP site-wide "Watch live" banner + modal (DWTS 2026).
 * Loaded on EVERY page via Webflow site-wide custom code (one-time). Behaviour is driven by
 * live-stream.json in this repo, so show-night changes ship by git push, no Designer.
 * Shows only when config.enabled && now within [show_start, show_end] (or force_on).
 * Needs embed_url or watch_url; otherwise stays hidden. Never throws into the host page. */
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
        if (!(c.force_on || (c.enabled && inWindow))) return;
        var embed = safeUrl(c.embed_url);
        if (embed && !OK_HOSTS.test(embed.hostname)) embed = null;
        var watch = safeUrl(c.watch_url);
        if (!embed && !watch) return;

        var css = document.createElement("style");
        css.textContent =
          "#lc-live-bar{position:sticky;top:0;z-index:99998;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px 16px;background:#b3123b;color:#fff;font:600 15px/1.3 inherit;text-align:center}" +
          "#lc-live-bar .lc-sp{display:flex;align-items:center;gap:8px;font:500 12px/1 inherit;opacity:.95}#lc-live-bar .lc-sp img{height:26px;width:auto;max-width:120px;background:#fff;border-radius:4px;padding:3px 6px}" +
          "#lc-live-box .lc-sp{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px}#lc-live-box .lc-sp img{height:30px;width:auto;max-width:140px;background:#fff;border-radius:4px;padding:3px 6px}" +
          "@media(max-width:600px){#lc-live-bar{padding:8px 10px;gap:8px;font-size:13px}#lc-live-bar .lc-sp{display:none}}" +
          "#lc-live-bar .lc-dot{width:10px;height:10px;border-radius:50%;background:#fff;animation:lcp 1.2s infinite}" +
          "@keyframes lcp{50%{opacity:.25}}" +
          "#lc-live-bar button{cursor:pointer;border:2px solid #fff;background:#fff;color:#b3123b;font:700 14px/1 inherit;padding:8px 18px;border-radius:999px}" +
          "#lc-live-bar button:hover{background:transparent;color:#fff}" +
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
