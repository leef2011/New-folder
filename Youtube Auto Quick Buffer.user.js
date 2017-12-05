// ==UserScript==
// @name         Youtube Auto Quick Buffer
// @namespace    https://greasyfork.org/en/users/8935-daniel-jochem?sort=ratings
// @description  Quickens the bufferer on all Youtube videos
// @match        https://www.youtube.com
// @include      https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @version      1.3
// ==/UserScript==

// reload script on page change using spf events (normal youtube)
window.addEventListener("spfdone", function() {
    main();
});

// reload script on page change using youtube polymer fire events (material youtube)
window.addEventListener("yt-page-data-updated", function() {
    main();
});

main();

function main() {
    if (isPlayerAvailable()) {
        if (document.URL.indexOf("&gl=CA") === -1) {
            window.location = document.URL + "&gl=CA";
        }
    }
}

function isPlayerAvailable() { // true if a youtube video is available ( false if live video)
    return /https:\/\/www\.youtube\.com\/watch\?v=.*/.test(document.location.href) && document.getElementById('live-chat-iframe') === null;
}