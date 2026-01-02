document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       DOM ELEMENTS
       ========================================= */
    const searchInput = document.getElementById('deviantSearch');
    const searchResults = document.getElementById('searchResults');
    const previewImg = document.getElementById('previewImage');
    const carouselNav = document.getElementById('carouselNav');
    const prevArrow = document.querySelector('.nav-arrow.prev');
    const nextArrow = document.querySelector('.nav-arrow.next');

    const traitsSection = document.getElementById('traitsSection');
    const startPrompt = document.getElementById('startPrompt');
    const deviantNameDisplay = document.getElementById('deviantNameDisplay');
    const deviantBadge = document.getElementById('deviantBadge');
    const slotsContainer = document.getElementById('slotsContainer');

    const createBtn = document.getElementById('createBtn');
    const overlay = document.getElementById('generatedOverlay');
    const finalCard = document.getElementById('finalCard');
    const backBtn = document.getElementById('backBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Mobile Menu elements
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    /* =========================================
       STATE
       ========================================= */
    let selectedDeviant = null;
    let currentImageIndex = 0;

    /* =========================================
       INIT
       ========================================= */
    initParticles();
    initMobileMenu();
    init3DEffects();

    /* =========================================
       DATA FLATTENING (for search)
       ========================================= */
    const allDeviants = [];
    if (typeof deviants !== 'undefined') {
        Object.keys(deviants).forEach(type => {
            Object.keys(deviants[type]).forEach(cat => {
                deviants[type][cat].forEach(dev => {
                    allDeviants.push(dev);
                });
            });
        });
    }

    /* =========================================
       SEARCH LOGIC
       ========================================= */
    if (searchInput && searchResults) {
        // Refresh allDeviants on focus to ensure data sync
        searchInput.addEventListener('focus', () => {
            allDeviants.length = 0;
            if (typeof deviants !== 'undefined') {
                Object.keys(deviants).forEach(type => {
                    Object.keys(deviants[type]).forEach(cat => {
                        deviants[type][cat].forEach(dev => {
                            allDeviants.push(dev);
                        });
                    });
                });
            }
        });

        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            searchResults.innerHTML = '';

            if (val.length < 1) {
                searchResults.classList.remove('active');
                return;
            }

            const filtered = allDeviants.filter(d => d.nome.toLowerCase().includes(val));

            if (filtered.length > 0) {
                searchResults.classList.add('active');
                filtered.forEach(dev => {
                    const item = document.createElement('div');
                    item.className = 'result-item';

                    // Visual Tags
                    const tagClass = dev.type === 'CAOS' ? 'tag-caos' : 'tag-padrao';
                    const tagText = dev.type === 'CAOS' ? 'CAOS' : 'NORMAL';

                    item.innerHTML = `
                        <span class="res-name">${dev.nome} <small>(${dev.category})</small></span>
                        <span class="result-tag ${tagClass}">${tagText}</span>
                    `;

                    item.addEventListener('click', () => selectDeviant(dev));
                    searchResults.appendChild(item);
                });
            } else {
                searchResults.classList.remove('active');
            }
        });
    }

    /* =========================================
       SELECTION LOGIC
       ========================================= */
    function selectDeviant(dev) {
        selectedDeviant = dev;
        if (searchInput) searchInput.value = dev.nome;
        if (searchResults) searchResults.classList.remove('active');

        // 1. Image Handling (Carousel)
        currentImageIndex = 0;
        updatePreview();

        // 2. UI Updates
        if (startPrompt) startPrompt.style.display = 'none';
        if (traitsSection) traitsSection.style.display = 'block';

        // Header Info
        if (deviantNameDisplay) deviantNameDisplay.textContent = dev.nome;
        if (deviantBadge) {
            deviantBadge.textContent = dev.type;
            deviantBadge.className = `type-badge ${dev.type === 'CAOS' ? 'badge-caos' : 'badge-padrao'}`;
        }

        // 3. Generate Slots
        generateSlots(dev);
    }

    /* =========================================
       CAROUSEL LOGIC
       ========================================= */
    function updatePreview() {
        if (!selectedDeviant || !previewImg) return;

        let imgSrc = "";
        if (selectedDeviant.imgs && selectedDeviant.imgs.length > 0) {
            if (currentImageIndex >= selectedDeviant.imgs.length) currentImageIndex = 0;
            if (currentImageIndex < 0) currentImageIndex = selectedDeviant.imgs.length - 1;
            imgSrc = selectedDeviant.imgs[currentImageIndex];
        } else {
            imgSrc = selectedDeviant.img;
        }

        previewImg.src = imgSrc + `?v=${Date.now()}`;
        previewImg.style.opacity = '0';
        setTimeout(() => {
            previewImg.style.opacity = '1';
        }, 200);

        if (carouselNav) {
            // Check both .imgs array and its length
            const hasMultipleImgs = selectedDeviant.imgs && Array.isArray(selectedDeviant.imgs) && selectedDeviant.imgs.length > 1;
            carouselNav.style.display = hasMultipleImgs ? 'flex' : 'none';
        }
        generateSlots(selectedDeviant);
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            if (!selectedDeviant) return;
            currentImageIndex--;
            updatePreview();
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            if (!selectedDeviant) return;
            currentImageIndex++;
            updatePreview();
        });
    }

    /* =========================================
       SLOT GENERATION
       ========================================= */
    function generateSlots(dev) {
        if (!slotsContainer || !dev) return;
        slotsContainer.innerHTML = '';

        const isCaos = dev.type === 'CAOS';

        // --- NEW UNIVERSAL VARIANT LOGIC (V28) ---
        let variantData = null;
        if (typeof variantTraits !== 'undefined' && variantTraits[dev.nome]) {
            variantData = variantTraits[dev.nome][currentImageIndex];
        }

        let slotsConfig = [];

        // Base Configuration
        if (isCaos) {
            slotsConfig = [
                { label: "Slot 1 (Primário)", pool: traitsData["Slot Primário"] },
                { label: "Slot 2 (Secundário)", pool: traitsData["Slot Secundário"][dev.category] || [] },
                { label: "Slot 3 (Caos)", fixed: "CAOS" },
                { label: "Slot 4 (Enfeite)", pool: traitsData["Enfeite"] },
                { label: "Slot 5 (Terciário)", pool: traitsData["Slot Terciário"] }
            ];
        } else {
            slotsConfig = [
                { label: "Slot 1 (Primário)", pool: traitsData["Slot Primário"] },
                { label: "Slot 2 (Secundário)", pool: traitsData["Slot Secundário"][dev.category] || [] },
                { label: "Slot 3 (Enfeite)", pool: traitsData["Enfeite"] },
                { label: "Slot 4 (Terciário)", pool: traitsData["Slot Terciário"] }
            ];
        }

        // Apply Universal Overrides (Universal System V28)
        if (variantData) {
            const sIdx = variantData.slot - 1; // 1-based to 0-based
            if (slotsConfig[sIdx]) {
                slotsConfig[sIdx] = {
                    label: `Slot ${variantData.slot} (${variantData.label})`,
                    fixed: variantData.trait
                };
            }
        }

        slotsConfig.forEach((cfg) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-group';
            const label = document.createElement('div');
            label.className = 'slot-label';
            label.textContent = cfg.label;

            if (cfg.fixed) {
                const input = document.createElement('input');
                input.className = 'trait-input fixed';
                input.value = cfg.fixed;
                input.disabled = true;
                slotDiv.appendChild(label);
                slotDiv.appendChild(input);
            } else {
                const select = document.createElement('select');
                select.className = 'trait-select';
                select.innerHTML = `<option value="">Selecione...</option>`;

                if (Array.isArray(cfg.pool)) {
                    cfg.pool.forEach(t => { select.innerHTML += `<option value="${t}">${t}</option>`; });
                } else {
                    Object.keys(cfg.pool).forEach(subCat => {
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = subCat;
                        cfg.pool[subCat].forEach(t => { optgroup.innerHTML += `<option value="${t}">${t}</option>`; });
                        select.appendChild(optgroup);
                    });
                }
                slotDiv.appendChild(label);
                slotDiv.appendChild(select);
            }
            slotsContainer.appendChild(slotDiv);
        });
    }

    /* =========================================
       UTILS
       ========================================= */
    function toDataURL(url, callback) {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            try {
                callback(canvas.toDataURL('image/png'));
            } catch (e) {
                console.error("Canvas toDataURL failed:", e);
                callback(url);
            }
        };
        img.onerror = function () { callback(url); };
        img.src = url;
    }

    /* =========================================
       CREATION / EXPORT
       ========================================= */
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            if (!selectedDeviant) return;
            const inputs = slotsContainer.querySelectorAll('select, input');
            const finalTraits = [];

            inputs.forEach(inp => {
                if (inp.value && inp.value !== "") {
                    finalTraits.push({
                        name: inp.value,
                        isFixed: inp.classList.contains('fixed') || inp.value === 'CAOS'
                    });
                }
            });

            if (finalCard) finalCard.className = `generated-card ${selectedDeviant.type === 'CAOS' ? 'style-caos' : 'style-padrao'}`;

            let safeIndex = currentImageIndex;
            if (selectedDeviant.imgs && (safeIndex < 0 || safeIndex >= selectedDeviant.imgs.length)) safeIndex = 0;
            let currentImgSrc = (selectedDeviant.imgs && selectedDeviant.imgs.length > 0) ? selectedDeviant.imgs[safeIndex] : selectedDeviant.img;
            currentImgSrc += `?v=${Date.now()}`;

            const tempImg = new Image();
            tempImg.onload = () => { renderCard(currentImgSrc, finalTraits); };
            tempImg.onerror = () => { renderCard(currentImgSrc, finalTraits); };
            tempImg.src = currentImgSrc;
        });
    }

    function renderCard(imgSrc, traits) {
        if (!finalCard || !selectedDeviant) return;
        finalCard.innerHTML = `
            <div class="card-visual"><img src="${imgSrc}" width="600" height="600" alt="Deviant" style="display: block;"></div>
            <div class="card-content">
                <div class="card-header-text"><h2>${selectedDeviant.nome}</h2><span class="card-category">${selectedDeviant.category}</span></div>
                <div class="card-traits-grid">
                    ${traits.map(t => `<div class="trait-tag ${t.isFixed ? 'trait-gold' : ''}">${t.name}</div>`).join('')}
                </div>
                <div class="watermark">deviant criado • bolttexturas</div>
            </div>`;
        if (overlay) overlay.classList.add('active');
    }

    if (backBtn && overlay) backBtn.addEventListener('click', () => overlay.classList.remove('active'));

    if (saveBtn) {
        saveBtn.innerText = 'Salvar';
        saveBtn.addEventListener('click', () => {
            saveBtn.textContent = "Gerando...";
            setTimeout(() => {
                const originalCard = document.getElementById('finalCard');
                if (!originalCard) return;
                const clone = originalCard.cloneNode(true);
                clone.style.position = 'fixed'; clone.style.left = '-10000px'; clone.style.top = '0';
                clone.style.transform = 'none'; clone.style.zIndex = '-9999';

                const cloneVisual = clone.querySelector('.card-visual');
                if (cloneVisual) cloneVisual.style.background = 'none';

                clone.style.width = '1640px';
                clone.style.height = '1080px';
                clone.style.backgroundColor = '#111111';
                clone.style.border = '5px solid #b566ff';
                clone.style.boxShadow = 'none';
                clone.style.borderRadius = '40px';
                clone.style.overflow = 'hidden';

                const cloneImg = clone.querySelector('.card-visual img');
                const imgPath = cloneImg ? cloneImg.src.split('?')[0] : "";

                if (cloneImg && imgPath) {
                    toDataURL(imgPath, (base64) => {
                        const imgDiv = document.createElement('div');
                        imgDiv.style.width = '600px'; imgDiv.style.height = '600px';
                        imgDiv.style.borderRadius = '40px'; imgDiv.style.overflow = 'hidden';
                        imgDiv.style.backgroundImage = `url('${base64}')`;
                        imgDiv.style.backgroundSize = 'cover'; imgDiv.style.backgroundPosition = 'center';
                        cloneImg.parentNode.replaceChild(imgDiv, cloneImg);
                        document.body.appendChild(clone);
                        generateCanvas(clone);
                    });
                } else {
                    document.body.appendChild(clone);
                    generateCanvas(clone);
                }
            }, 100);
        });
    }

    function generateCanvas(clone) {
        html2canvas(clone, {
            backgroundColor: null,
            scale: 2, // Double scale for higher quality (4K-ish density)
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: 1640,
            height: 1080,
            windowWidth: 1640, // Force the virtual "window" to be desktop-sized
            windowHeight: 1080
        }).then(canvas => {
            try {
                const link = document.createElement('a');
                link.download = `bolt_${selectedDeviant.nome.toLowerCase().replace(/\s+/g, '_')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                if (saveBtn) saveBtn.textContent = "Salvar";
            } catch (e) {
                alert("⚠️ Erro ao salvar! Considere usar o Firefox.");
                if (saveBtn) saveBtn.textContent = "Erro";
            } finally {
                if (document.body.contains(clone)) document.body.removeChild(clone);
            }
        });
    }

    /* =========================================
       MOBILE MENU
       ========================================= */
    function initMobileMenu() {
        if (!hamburgerBtn || !mobileSidebar || !closeSidebar) return;
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileSidebar.classList.toggle('active');
        });
        closeSidebar.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileSidebar.classList.remove('active');
        });
        document.addEventListener('click', (e) => {
            if (!mobileSidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && mobileSidebar.classList.contains('active')) {
                hamburgerBtn.classList.remove('active');
                mobileSidebar.classList.remove('active');
            }
        });
    }

    /* =========================================
       VISUAL EFFECTS (3D Panel)
       ========================================= */
    function init3DEffects() {
        const wrapper = document.querySelector('.image-preview-wrapper-3d');
        if (!wrapper) return;
        wrapper.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 800) return;
            const rect = wrapper.getBoundingClientRect();
            const xPct = ((e.clientX - rect.left) / rect.width) - 0.5;
            const yPct = ((e.clientY - rect.top) / rect.height) - 0.5;
            wrapper.style.transform = `rotateY(${xPct * -30}deg) rotateX(${yPct * 30}deg) scale(1.02)`;
        });
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
        });
    }

    /* =========================================
       PARTICLES SYSTEM
       ========================================= */
    function initParticles() {
        const canvas = document.getElementById('particulas-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];
        function resize() {
            width = window.innerWidth; height = window.innerHeight;
            canvas.width = width; canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();
        class Particle {
            constructor() {
                this.x = Math.random() * width; this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2; this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = `rgba(132, 0, 255, ${this.alpha})`;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        for (let i = 0; i < 60; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
