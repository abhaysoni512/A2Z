// ==UserScript==
// @name         LearnCPP Modern Enhancer
// @namespace    https://github.com/abhaysoni512
// @version      2.3
// @description  Dark mode, progress tracking, resume learning, copy buttons and keyboard navigation
// @author       Abhay
// @match        https://www.learncpp.com/*
// @match        https://learncpp.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const DARK_KEY = 'lcpp_dark';
    const PROGRESS_KEY = 'lcpp_progress';
    const LAST_PAGE_KEY = 'lcpp_last_page';

    const slug =
        location.pathname.replace(/^\/|\/$/g, '')
        .split('/')
        .pop() || 'home';

    let progress =
        new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'));

    let darkMode =
        JSON.parse(localStorage.getItem(DARK_KEY) || 'true');

    localStorage.setItem(LAST_PAGE_KEY, location.href);

    /* ==========================================================
       DARK MODE
    ========================================================== */

    const DARK_CSS = `
    :root{
        color-scheme:dark;
        --lcpp-bg:#0b1220;
        --lcpp-surface:#111827;
        --lcpp-surface-2:#182235;
        --lcpp-surface-3:#202b3d;
        --lcpp-border:#334155;
        --lcpp-text:#dbe3ee;
        --lcpp-muted:#9aa8bb;
        --lcpp-heading:#f7fafc;
        --lcpp-link:#70b7ff;
        --lcpp-link-hover:#9fd0ff;
        --lcpp-accent:#3b82f6;
        --lcpp-code-bg:#1c2636;
        --lcpp-code-text:#d8dee9;
        --lcpp-font:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        --lcpp-mono:"JetBrains Mono","Fira Code","SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
    }

    html,
    body,
    #page,
    .site,
    .site-container{
        background:var(--lcpp-bg) !important;
        color:var(--lcpp-text) !important;
    }

    body{
        font-family:var(--lcpp-font) !important;
        font-size:18px !important;
        line-height:1.72 !important;
        -webkit-font-smoothing:antialiased;
        text-rendering:optimizeLegibility;
    }

    ::selection{
        background:rgba(96,165,250,.35) !important;
        color:#ffffff !important;
    }

    article,
    .entry,
    .entry-content,
    .content-area,
    .site-content,
    main{
        background:var(--lcpp-surface) !important;
        color:var(--lcpp-text) !important;
        border-color:rgba(148,163,184,.12) !important;
    }

    article,
    .entry-content{
        border-radius:14px !important;
    }

    .entry-content{
        font-size:1rem !important;
        line-height:1.75 !important;
    }

    .entry-content p,
    .entry-content li{
        color:var(--lcpp-text) !important;
    }

    h1,h2,h3,h4,h5,h6,
    .entry-title{
        color:var(--lcpp-heading) !important;
        font-family:var(--lcpp-font) !important;
        letter-spacing:0 !important;
        line-height:1.18 !important;
    }

    h1,
    .entry-title{
        font-size:clamp(2rem, 3vw, 3.25rem) !important;
        font-weight:650 !important;
    }

    h2,h3{
        font-weight:700 !important;
    }

    a{
        color:var(--lcpp-link) !important;
        text-decoration-color:rgba(112,183,255,.45) !important;
        text-underline-offset:.18em !important;
    }

    a:hover,
    a:focus{
        color:var(--lcpp-link-hover) !important;
        text-decoration-color:currentColor !important;
    }

    strong,
    b{
        color:#eef4fb !important;
        font-weight:700 !important;
    }

    blockquote,
    .notice,
    .note,
    .tip,
    .important,
    .quiz,
    .summary{
        background:var(--lcpp-surface-2) !important;
        color:var(--lcpp-text) !important;
        border-color:var(--lcpp-border) !important;
    }

    pre,
    .wp-block-code{
        overflow:auto !important;
        background:var(--lcpp-code-bg) !important;
        color:var(--lcpp-code-text) !important;
        border:1px solid var(--lcpp-border) !important;
        border-radius:10px !important;
        box-shadow:0 16px 38px rgba(0,0,0,.18) !important;
    }

    pre,
    code{
        font-family:var(--lcpp-mono) !important;
        text-shadow:none !important;
    }

    pre:not([class*="language-"]):not(.line-numbers){
        padding:1rem 1.15rem !important;
        font-size:15px !important;
        line-height:1.55 !important;
        white-space:pre !important;
        tab-size:4;
    }

    pre:not([class*="language-"]):not(.line-numbers) code{
        font-size:inherit !important;
        line-height:inherit !important;
        background:transparent !important;
        color:inherit !important;
    }

    :not(pre) > code{
        background:rgba(96,165,250,.12) !important;
        color:#bfdbfe !important;
        border:1px solid rgba(96,165,250,.2) !important;
        border-radius:5px !important;
        padding:.08em .32em !important;
        font-size:.9em !important;
    }

    pre[class*="language-"],
    pre[class*="language-"] code,
    pre.line-numbers,
    pre.line-numbers code{
        font-family:var(--lcpp-mono) !important;
        text-shadow:none !important;
        color:var(--lcpp-code-text) !important;
        background:var(--lcpp-code-bg) !important;
    }

    pre[class*="language-"],
    pre.line-numbers{
        font-size:15px !important;
        line-height:1.5 !important;
    }

    pre[class*="language-"] code,
    pre.line-numbers code{
        font-size:inherit !important;
        line-height:inherit !important;
    }

    pre.line-numbers{
        position:relative !important;
        padding-left:3.8em !important;
        counter-reset:linenumber !important;
    }

    pre.line-numbers > code{
        position:relative !important;
        padding:0 !important;
        white-space:inherit !important;
    }

    pre.line-numbers .line-numbers-rows{
        position:absolute !important;
        pointer-events:none !important;
        top:0 !important;
        left:-3.8em !important;
        width:3em !important;
        border-right-color:rgba(148,163,184,.35) !important;
        user-select:none !important;
    }

    pre.line-numbers .line-numbers-rows > span{
        display:block !important;
        counter-increment:linenumber !important;
    }

    pre.line-numbers .line-numbers-rows > span:before{
        color:#8795aa !important;
    }

    .hljs-keyword,
    .hljs-type,
    .token.keyword,
    .token.class-name{
        color:#60a5fa !important;
    }

    .hljs-string,
    .token.string{
        color:#f87171 !important;
    }

    .hljs-comment,
    .token.comment{
        color:#22c55e !important;
        font-style:italic !important;
    }

    .hljs-title,
    .token.function{
        color:#f59e0b !important;
    }

    table{
        background:var(--lcpp-surface-2) !important;
        color:var(--lcpp-text) !important;
        border-color:var(--lcpp-border) !important;
    }

    td,th{
        border-color:var(--lcpp-border) !important;
    }

    th{
        background:var(--lcpp-surface-3) !important;
        color:var(--lcpp-heading) !important;
    }

    input,
    textarea,
    select{
        background:var(--lcpp-surface-2) !important;
        color:var(--lcpp-text) !important;
        border-color:var(--lcpp-border) !important;
    }

    button,
    input[type="button"],
    input[type="submit"]{
        font-family:var(--lcpp-font) !important;
    }

    header,
    nav,
    .site-header,
    .main-navigation,
    .nav-primary{
        background:#0f172a !important;
        color:var(--lcpp-text) !important;
        border-color:rgba(148,163,184,.12) !important;
    }

    .widget,
    aside,
    .sidebar,
    .site-footer,
    footer{
        background:var(--lcpp-surface) !important;
        color:var(--lcpp-text) !important;
        border-color:rgba(148,163,184,.12) !important;
    }

    img,
    video{
        filter:none !important;
    }

    #lcpp-toolbar,
    #lcpp-toolbar *{
        box-sizing:border-box;
        font-family:var(--lcpp-font) !important;
    }

    .lcpp-code-shell{
        position:relative;
        display:flow-root;
        margin:1.25em 0;
    }

    .lcpp-code-shell > pre{
        margin:0 !important;
    }

    #lcpp-toolbar{
        position:fixed;
        right:18px;
        bottom:18px;
        z-index:999999;
        display:flex;
        flex-direction:column;
        gap:10px;
        width:min(220px, calc(100vw - 36px));
        opacity:.86;
        transition:opacity .18s ease, transform .18s ease;
    }

    #lcpp-toolbar:hover,
    #lcpp-toolbar:focus-within{
        opacity:1;
    }

    .lcpp-button,
    .lcpp-counter{
        width:100%;
        min-height:44px;
        border:1px solid rgba(148,163,184,.15);
        border-radius:10px;
        background:rgba(15,23,42,.94);
        color:#e8eef8;
        box-shadow:0 14px 32px rgba(0,0,0,.28);
        backdrop-filter:blur(10px);
    }

    .lcpp-button{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        padding:10px 14px;
        cursor:pointer;
        font-size:13px;
        font-weight:750;
        letter-spacing:.03em;
        text-transform:uppercase;
    }

    .lcpp-button:hover,
    .lcpp-button:focus-visible{
        background:#1d4ed8;
        color:white;
        outline:none;
        transform:translateY(-1px);
    }

    .lcpp-counter{
        display:flex;
        align-items:center;
        justify-content:center;
        padding:9px 12px;
        color:#bac6d8;
        font-size:13px;
        line-height:1.35;
        text-align:center;
    }

    .lcpp-copy-button{
        position:absolute;
        top:10px;
        right:10px;
        z-index:100;
        border:1px solid rgba(147,197,253,.35);
        border-radius:8px;
        padding:6px 11px;
        cursor:pointer;
        background:#2563eb;
        color:white;
        font:700 12px/1 var(--lcpp-font);
        letter-spacing:.04em;
        text-transform:uppercase;
        box-shadow:0 8px 20px rgba(37,99,235,.28);
    }

    .lcpp-copy-button:hover,
    .lcpp-copy-button:focus-visible{
        background:#1d4ed8;
        outline:none;
    }

    @media (max-width:700px){
        body{
            font-size:16px !important;
        }

        pre,
        pre code,
        code{
            font-size:13px !important;
        }

        #lcpp-toolbar{
            right:12px;
            bottom:12px;
            width:min(184px, calc(100vw - 24px));
        }
    }
    `;

    const BASE_CSS = `
    #lcpp-toolbar,
    #lcpp-toolbar *{
        box-sizing:border-box;
        font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif !important;
    }

    .lcpp-code-shell{
        position:relative;
        display:flow-root;
        margin:1.25em 0;
    }

    .lcpp-code-shell > pre{
        margin:0 !important;
    }

    #lcpp-toolbar{
        position:fixed;
        right:18px;
        bottom:18px;
        z-index:999999;
        display:flex;
        flex-direction:column;
        gap:10px;
        width:min(220px, calc(100vw - 36px));
        opacity:.86;
        transition:opacity .18s ease, transform .18s ease;
    }

    #lcpp-toolbar:hover,
    #lcpp-toolbar:focus-within{
        opacity:1;
    }

    .lcpp-button,
    .lcpp-counter{
        width:100%;
        min-height:44px;
        border:1px solid rgba(15,23,42,.12);
        border-radius:10px;
        background:rgba(255,255,255,.94);
        color:#172033;
        box-shadow:0 14px 32px rgba(15,23,42,.16);
        backdrop-filter:blur(10px);
    }

    .lcpp-button{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        padding:10px 14px;
        cursor:pointer;
        font-size:13px;
        font-weight:750;
        letter-spacing:.03em;
        text-transform:uppercase;
    }

    .lcpp-button:hover,
    .lcpp-button:focus-visible{
        background:#2563eb;
        color:white;
        outline:none;
        transform:translateY(-1px);
    }

    .lcpp-counter{
        display:flex;
        align-items:center;
        justify-content:center;
        padding:9px 12px;
        color:#475569;
        font-size:13px;
        line-height:1.35;
        text-align:center;
    }

    .lcpp-copy-button{
        position:absolute;
        top:10px;
        right:10px;
        z-index:100;
        border:1px solid rgba(37,99,235,.24);
        border-radius:8px;
        padding:6px 11px;
        cursor:pointer;
        background:#2563eb;
        color:white;
        font:700 12px/1 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        letter-spacing:.04em;
        text-transform:uppercase;
        box-shadow:0 8px 20px rgba(37,99,235,.22);
    }

    .lcpp-copy-button:hover,
    .lcpp-copy-button:focus-visible{
        background:#1d4ed8;
        outline:none;
    }

    @media (max-width:700px){
        #lcpp-toolbar{
            right:12px;
            bottom:12px;
            width:min(184px, calc(100vw - 24px));
        }
    }
    `;

    const baseStyle = document.createElement('style');
    baseStyle.id = 'lcpp-modern-enhancer-base-style';
    baseStyle.textContent = BASE_CSS;
    document.head.appendChild(baseStyle);

    const style = document.createElement('style');
    style.id = 'lcpp-modern-enhancer-style';

    function applyDarkMode(enable) {
        if (enable) {
            style.textContent = DARK_CSS;
            if (!style.isConnected) document.head.appendChild(style);
        } else {
            style.remove();
        }

        localStorage.setItem(
            DARK_KEY,
            JSON.stringify(enable)
        );
    }

    applyDarkMode(darkMode);

    /* ==========================================================
       COPY BUTTONS
    ========================================================== */

    function addCopyButtons() {

        document.querySelectorAll('pre').forEach(pre => {

            if (pre.dataset.copyReady) return;

            pre.dataset.copyReady = '1';

            pre
                .querySelectorAll('.lcpp-copy-button')
                .forEach(button => button.remove());

            let host = pre.parentElement;

            if (!host?.classList.contains('lcpp-code-shell')) {
                host = document.createElement('div');
                host.className = 'lcpp-code-shell';
                pre.before(host);
                host.appendChild(pre);
            }

            const btn = document.createElement('button');

            btn.type = 'button';
            btn.className = 'lcpp-copy-button';
            btn.innerText = 'Copy';

            btn.onclick = async () => {

                const text =
                    pre.querySelector('code')?.textContent ||
                    pre.textContent;

                await navigator.clipboard.writeText(text);

                btn.innerText = 'Copied';

                setTimeout(() => {
                    btn.innerText = 'Copy';
                }, 1500);
            };

            host.appendChild(btn);
        });
    }

    addCopyButtons();

    new MutationObserver(addCopyButtons)
        .observe(document.body, {
            childList: true,
            subtree: true
        });

    /* ==========================================================
       PROGRESS TRACKING
    ========================================================== */

    function saveProgress() {
        localStorage.setItem(
            PROGRESS_KEY,
            JSON.stringify([...progress])
        );
    }

    function markRead() {
        progress.add(slug);
        saveProgress();
        updateReadButton();
    }

    function unmarkRead() {
        progress.delete(slug);
        saveProgress();
        updateReadButton();
    }

    /* ==========================================================
       AUTO COMPLETE ON 90% SCROLL
    ========================================================== */

    let autoMarked = false;

    window.addEventListener('scroll', () => {

        if (autoMarked) return;

        const scrollPercent =
            (window.scrollY + window.innerHeight) /
            document.documentElement.scrollHeight;

        if (scrollPercent > 0.9) {

            autoMarked = true;

            progress.add(slug);

            saveProgress();

            updateReadButton();
        }
    });

    /* ==========================================================
       TOOLBAR
    ========================================================== */

    const toolbar = document.createElement('div');
    toolbar.id = 'lcpp-toolbar';

    function createButton(text) {

        const btn = document.createElement('button');

        btn.type = 'button';
        btn.className = 'lcpp-button';
        btn.textContent = text;

        return btn;
    }

    /* DARK MODE BUTTON */

    const darkBtn =
        createButton(darkMode ? 'Light mode' : 'Dark mode');

    darkBtn.onclick = () => {

        darkMode = !darkMode;

        applyDarkMode(darkMode);

        darkBtn.textContent =
            darkMode ?
            'Light mode' :
            'Dark mode';
    };

    toolbar.appendChild(darkBtn);

    /* MARK READ BUTTON */

    const readBtn =
        createButton('');

    function updateReadButton() {

        if (progress.has(slug)) {
            readBtn.textContent =
                'Completed';
        } else {
            readBtn.textContent =
                'Mark read';
        }

        counter.textContent =
            `${progress.size} lessons completed`;
    }

    readBtn.onclick = () => {

        if (progress.has(slug))
            unmarkRead();
        else
            markRead();
    };

    toolbar.appendChild(readBtn);

    /* COUNTER */

    const counter =
        document.createElement('div');
    counter.className = 'lcpp-counter';

    toolbar.appendChild(counter);

    updateReadButton();

    /* RESUME BUTTON */

    const resumeBtn =
        createButton('Resume');

    resumeBtn.onclick = () => {

        const last =
            localStorage.getItem(LAST_PAGE_KEY);

        if (last)
            location.href = last;
    };

    toolbar.appendChild(resumeBtn);

    document.body.appendChild(toolbar);

    /* ==========================================================
       KEYBOARD NAVIGATION
    ========================================================== */

    document.addEventListener(
        'keydown',
        e => {

            if (
                ['INPUT','TEXTAREA','SELECT']
                .includes(e.target.tagName)
            ) return;

            const prev =
                document.querySelector(
                    'a[rel="prev"]'
                );
 
            const next =
                document.querySelector(
                    'a[rel="next"]'
                );

            if (
                (e.key === '[' ||
                 e.key === 'ArrowLeft')
                && prev
            ) {
                location.href = prev.href;
            }

            if (
                (e.key === ']' ||
                 e.key === 'ArrowRight')
                && next
            ) {
                location.href = next.href;
            }
        }
    );

})();
