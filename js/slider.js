document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-container');
    if (!slider) return;

    const viewport = slider.querySelector('.slider-viewport');
    const track = slider.querySelector('.slider-track');
    const items = Array.from(track.children);
    const dotsContainer = slider.querySelector('.slider-dots');

    let dots = [];
    let itemsPerPage = 1;
    let pageCount = 1;
    let currentIndex = 0;
    let autoPlay = null;

    let isDragging = false;
    let startX = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;
    let rafId = null;

    // ---- helpers de paginación según tus breakpoints ----
    function computeItemsPerPage() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        if (window.innerWidth <= 1200) return 4;
        return 5; // escritorio grande
    }

    function pageStartItem(pageIndex) {
        return Math.min(pageIndex * itemsPerPage, items.length - 1);
    }

    // Distancia real (px) desde el inicio del track al primer item de la página
    function pageOffsetPx(pageIndex) {
        const i = pageStartItem(pageIndex);
        const targetItem = items[i];
        const firstItem = items[0];
        if (!targetItem || !firstItem) return 0;
        // La distancia correcta es la diferencia de offsets desde el primer elemento.
        // Esto independiza el cálculo del padding del contenedor.
        return Math.round(targetItem.offsetLeft - firstItem.offsetLeft);
    }


    function rebuildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < pageCount; i++) {
            const b = document.createElement('button');
            b.className = 'dot';
            b.setAttribute('aria-label', `Ir a página ${i + 1}`);
            b.addEventListener('click', () => moveToPage(i));
            dotsContainer.appendChild(b);
        }
        dots = Array.from(dotsContainer.children);
    }

    function updateDots() {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function setPositionByIndex() {
        const offset = pageOffsetPx(currentIndex);
        track.style.transform = `translate3d(-${offset}px,0,0)`;
        prevTranslate = -offset;
        updateDots();
    }

    function moveToPage(index) {
        if (index < 0) index = pageCount - 1;
        if (index >= pageCount) index = 0;
        currentIndex = index;
        track.style.transition = 'transform 0.45s ease';
        setPositionByIndex();
        startAutoplay();
    }

    function setup() {
        itemsPerPage = computeItemsPerPage();
        pageCount = Math.ceil(items.length / itemsPerPage);
        rebuildDots();
        track.style.transition = 'none';
        // medir después del reflow
        requestAnimationFrame(setPositionByIndex);
        startAutoplay();
    }

    function startAutoplay() {
        clearInterval(autoPlay);
        if (window.innerWidth > 768) {
            autoPlay = setInterval(() => moveToPage(currentIndex + 1), 3500);
        }
    }

    // ---- Drag/Swipe ----
    viewport.addEventListener('mousedown', dragStart);
    viewport.addEventListener('touchstart', dragStart, { passive: true });
    viewport.addEventListener('mousemove', dragMove);
    viewport.addEventListener('touchmove', dragMove, { passive: true });
    viewport.addEventListener('mouseup', dragEnd);
    viewport.addEventListener('mouseleave', dragEnd);
    viewport.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getX(e);
        clearInterval(autoPlay);
        track.style.transition = 'none';
        currentTranslate = prevTranslate;
        rafId = requestAnimationFrame(updateAnimation);
    }

    function dragMove(e) {
        if (!isDragging) return;
        const dx = getX(e) - startX;
        currentTranslate = prevTranslate + dx;
    }

    function updateAnimation() {
        track.style.transform = `translate3d(${currentTranslate}px,0,0)`;
        if (isDragging) rafId = requestAnimationFrame(updateAnimation);
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(rafId);

        const movedBy = currentTranslate - prevTranslate;

        // Pasos REALES entre páginas (por offsets), así evitamos desfases acumulados
        const currOff = pageOffsetPx(currentIndex);
        const nextOff = pageOffsetPx(Math.min(currentIndex + 1, pageCount - 1));
        const prevOff = pageOffsetPx(Math.max(currentIndex - 1, 0));
        const forwardStep = Math.abs(nextOff - currOff) || viewport.clientWidth;
        const backwardStep = Math.abs(currOff - prevOff) || viewport.clientWidth;

        const isMobile = window.innerWidth <= 576;
        const forwardThreshold = (isMobile ? 0.2 : 0.5) * forwardStep;
        const backwardThreshold = (isMobile ? 0.2 : 0.5) * backwardStep;

        if (movedBy < -forwardThreshold && currentIndex < pageCount - 1) currentIndex++;
        if (movedBy > backwardThreshold && currentIndex > 0) currentIndex--;

        moveToPage(currentIndex);
    }

    function getX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    setup();
    window.addEventListener('resize', () => {
        currentIndex = 0;
        setup();
    });
});
