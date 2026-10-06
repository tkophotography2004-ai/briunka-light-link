/* No downloads: keep normal playback, but no download / PiP / cast / speed menu on video,
   and no right-click / long-press "Save as" or drag-out on media. */
(function () {
    var SEL = 'video, audio, img, picture, source';
    function harden(el) {
        if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
            el.setAttribute('controlslist', 'nodownload noplaybackrate noremoteplayback');
            el.setAttribute('disableremoteplayback', '');
            el.disableRemotePlayback = true;
            if (el.tagName === 'VIDEO') { el.setAttribute('disablepictureinpicture', ''); el.disablePictureInPicture = true; }
        }
        if (el.tagName === 'IMG') { el.setAttribute('draggable', 'false'); }
    }
    function scan(root) {
        if (root.matches && root.matches('video, audio, img')) harden(root);
        if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll('video, audio, img'), harden);
    }
    function block(e) {
        if (e.target && e.target.closest && e.target.closest(SEL)) e.preventDefault();
    }
    document.addEventListener('contextmenu', block, true);
    document.addEventListener('dragstart', block, true);
    function start() {
        scan(document);
        new MutationObserver(function (muts) {
            muts.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) scan(n); }); });
        }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
