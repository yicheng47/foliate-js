// Electron's native scrollbar on macOS keeps a permanent light gutter even when
// the system prefers overlay scrollbars, so every platform gets a slim thumb on
// a transparent track that shows only while scrolling or hovered.
export const scrollbarCSS = (scroller, active) => `
    ${scroller}::-webkit-scrollbar { width: 8px; height: 8px; }
    ${scroller}::-webkit-scrollbar-track,
    ${scroller}::-webkit-scrollbar-corner { background: transparent; }
    ${scroller}::-webkit-scrollbar-thumb {
        background-color: transparent;
        border: 2px solid transparent;
        background-clip: content-box;
        border-radius: 9999px;
    }
    ${active}::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb, rgba(128, 128, 128, 0.3));
    }
    ${scroller}::-webkit-scrollbar-thumb:hover,
    ${scroller}::-webkit-scrollbar-thumb:active {
        background-color: var(--scrollbar-thumb-hover, rgba(128, 128, 128, 0.5));
    }`

export const showScrollbarWhileScrolling = el => {
    let timer
    el.addEventListener('scroll', () => {
        el.setAttribute('scrolling', '')
        clearTimeout(timer)
        timer = setTimeout(() => el.removeAttribute('scrolling'), 1000)
    }, { passive: true })
}
