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

// Chromium ignores :host::-webkit-scrollbar-thumb:hover, so pointer hover over
// the scrollbar is tracked here and shares the attribute with scrolling. `root`
// is the shadow root when `el` is its host: events from content inside it never
// reach the host as boundary events.
export const showScrollbarWhileScrolling = (el, root = el) => {
    let timer
    let hovering = false
    const show = () => {
        clearTimeout(timer)
        el.setAttribute('scrolling', '')
    }
    const hideLater = () => {
        clearTimeout(timer)
        timer = setTimeout(() => el.removeAttribute('scrolling'), 1000)
    }
    const unhover = () => {
        if (!hovering) return
        hovering = false
        hideLater()
    }
    el.addEventListener('scroll', () => {
        show()
        if (!hovering) hideLater()
    }, { passive: true })
    el.addEventListener('pointermove', e => {
        const rect = el.getBoundingClientRect()
        const over = e.clientX >= rect.left + el.clientLeft + el.clientWidth
            || e.clientY >= rect.top + el.clientTop + el.clientHeight
        if (over === hovering) return
        if (over) {
            hovering = true
            show()
        } else unhover()
    })
    el.addEventListener('pointerleave', unhover)
    // A book iframe swallows the moves that would clear the hover, so entering
    // any content clears it.
    root.addEventListener('pointerover', e => {
        if (e.target !== el) unhover()
    })
}
