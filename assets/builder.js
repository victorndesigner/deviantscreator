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

    // Mobile Menu
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
    init3DEffects(); // Re-enabled V5

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

    /* =========================================
       SELECTION LOGIC
       ========================================= */
    function selectDeviant(dev) {
        selectedDeviant = dev;
        searchInput.value = dev.nome;
        searchResults.classList.remove('active');

        // 1. Image Handling (Carousel)
        currentImageIndex = 0;
        updatePreviewImage();

        if (dev.imgs && dev.imgs.length > 1) {
            carouselNav.style.display = 'flex';
        } else {
            carouselNav.style.display = 'none';
        }

        // 2. UI Updates
        startPrompt.style.display = 'none';
        traitsSection.style.display = 'block';

        // Header Info
        deviantNameDisplay.textContent = dev.nome;
        deviantBadge.textContent = dev.type;
        deviantBadge.className = `type-badge ${dev.type === 'CAOS' ? 'badge-caos' : 'badge-padrao'}`;

        // 3. Generate Slots
        generateSlots(dev);
    }

    /* =========================================
       CAROUSEL LOGIC
       ========================================= */
    function updatePreviewImage() {
        if (!selectedDeviant || !selectedDeviant.imgs) return;
        previewImg.style.opacity = '0';
        setTimeout(() => {
            previewImg.src = selectedDeviant.imgs[currentImageIndex];
            previewImg.style.opacity = '1';
        }, 200);
    }

    prevArrow.addEventListener('click', () => {
        if (!selectedDeviant) return;
        currentImageIndex--;
        if (currentImageIndex < 0) currentImageIndex = selectedDeviant.imgs.length - 1;
        updatePreviewImage();
    });

    nextArrow.addEventListener('click', () => {
        if (!selectedDeviant) return;
        currentImageIndex++;
        if (currentImageIndex >= selectedDeviant.imgs.length) currentImageIndex = 0;
        updatePreviewImage();
    });

    /* =========================================
       SLOT GENERATION
       ========================================= */
    function generateSlots(dev) {
        slotsContainer.innerHTML = '';

        // Define Slot Structure based on Type
        // PADRAO: 4 Slots (Primario, Secundario, Custom, Animais/Terciario)
        // CAOS: 5 Slots   (Primario, Secundario, CAOS(FIXED), Custom, Animais/Terciario)

        const isCaos = dev.type === 'CAOS';
        // Let's define the config for iteration
        // We need 4 dropdowns for PADRAO, 5 for CAOS (one fixed)

        // Configuration Map
        let slotsConfig = [];

        if (isCaos) {
            slotsConfig = [
                { label: "Slot 1 (Primário)", pool: traitsData["Slot Primário"] },
                { label: "Slot 2 (Secundário)", pool: traitsData["Slot Secundário"][dev.category] || [] }, // Specific category
                { label: "Slot 3 (Caos)", fixed: "CAOS" },
                { label: "Slot 4 (Custom)", pool: traitsData["Custom"] },
                { label: "Slot 5 (Animais)", pool: traitsData["Slot Terciário"]["Animais"] }
            ];
        } else {
            slotsConfig = [
                { label: "Slot 1 (Primário)", pool: traitsData["Slot Primário"] },
                { label: "Slot 2 (Secundário)", pool: traitsData["Slot Secundário"][dev.category] || [] },
                { label: "Slot 3 (Custom)", pool: traitsData["Custom"] },
                { label: "Slot 4 (Animais)", pool: traitsData["Slot Terciário"]["Animais"] }
            ];
        }

        // Render Loops
        slotsConfig.forEach((cfg, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'slot-group';

            const label = document.createElement('div');
            label.className = 'slot-label';
            label.textContent = cfg.label;

            if (cfg.fixed) {
                // Fixed Slot (Visual Only input)
                const input = document.createElement('input');
                input.className = 'trait-input fixed';
                input.value = cfg.fixed;
                input.disabled = true;
                slotDiv.appendChild(label);
                slotDiv.appendChild(input);
            } else {
                // Select Dropdown
                const select = document.createElement('select');
                select.className = 'trait-select';

                // Group logic for Primário (since it has categories inside)
                // If the pool is an Array, straight render.
                // If pool is Object (like Primário), use OptGroups.

                select.innerHTML = `<option value="">Selecione...</option>`;

                if (Array.isArray(cfg.pool)) {
                    cfg.pool.forEach(t => {
                        select.innerHTML += `<option value="${t}">${t}</option>`;
                    });
                } else {
                    // Object with subtypes
                    Object.keys(cfg.pool).forEach(subCat => {
                        const optgroup = document.createElement('optgroup');
                        optgroup.label = subCat;
                        cfg.pool[subCat].forEach(t => {
                            optgroup.innerHTML += `<option value="${t}">${t}</option>`;
                        });
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
       CREATION / EXPORT
       ========================================= */
    createBtn.addEventListener('click', () => {
        if (!selectedDeviant) return;

        // Gather Inputs
        const inputs = slotsContainer.querySelectorAll('select, input');
        const finalTraits = [];

        inputs.forEach(inp => {
            if (inp.value && inp.value !== "") finalTraits.push(inp.value);
        });

        // Setup Card Class
        finalCard.className = `generated-card ${selectedDeviant.type === 'CAOS' ? 'style-caos' : 'style-padrao'}`;

        // Build HTML
        // Note: Using the CURRENT image from carousel with safety check
        let safeIndex = currentImageIndex;
        if (selectedDeviant.imgs && (safeIndex < 0 || safeIndex >= selectedDeviant.imgs.length)) {
            safeIndex = 0; // Fallback
        }

        const currentImgSrc = (selectedDeviant.imgs && selectedDeviant.imgs.length > 0)
            ? selectedDeviant.imgs[safeIndex]
            : selectedDeviant.img;

        console.log("Generating card with image:", currentImgSrc);

        // Pre-validate image before showing
        const tempImg = new Image();
        tempImg.onload = () => {
            renderCard(currentImgSrc, finalTraits);
        };
        tempImg.onerror = () => {
            console.error("Failed to load image for card:", currentImgSrc);
            // Try to render anyway or show placeholder
            renderCard(currentImgSrc, finalTraits);
        };
        tempImg.src = currentImgSrc;
    });

    function renderCard(imgSrc, traits) {
        finalCard.innerHTML = `
            <div class="card-visual">
                <img src="${imgSrc}" alt="Deviant" crossorigin="anonymous" style="display: block;"> 
            </div>
            <div class="card-content">
                <div class="card-header-text">
                    <h2>${selectedDeviant.nome}</h2>
                    <span class="card-category">${selectedDeviant.category}</span>
                </div>
                <div class="card-traits-grid">
                    ${traits.map(t => {
            const isSpecial = (t === 'CAOS');
            return `<div class="trait-tag ${isSpecial ? 'trait-caos' : ''}">${t}</div>`;
        }).join('')}
                </div>
                <div class="watermark">deviant criado • bolttexturas</div>
            </div>
        `;
        overlay.classList.add('active');
    }

    backBtn.addEventListener('click', () => overlay.classList.remove('active'));

    saveBtn.innerText = 'Salvar'; // Update text
    saveBtn.addEventListener('click', () => {
        html2canvas(finalCard, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `bolt_${selectedDeviant.nome.toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    /* =========================================
       MOBILE MENU
       ========================================= */
    function initMobileMenu() {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileSidebar.classList.toggle('active');
        });

        closeSidebar.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            mobileSidebar.classList.remove('active');
        });

        // Click outside to close
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

        // ONLY on wrapper interaction
        wrapper.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 800) return;

            const rect = wrapper.getBoundingClientRect();
            const xVal = e.clientX - rect.left;
            const yVal = e.clientY - rect.top;

            // -0.5 to 0.5 range
            const xPct = (xVal / rect.width) - 0.5;
            const yPct = (yVal / rect.height) - 0.5;

            // Max 15 degree tilt
            const rotateY = xPct * -30;
            const rotateX = yPct * 30;

            wrapper.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
        });

        // Reset on leave
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
        });
    }

    /* =========================================
       PARTICLES SYSTEM
       ========================================= */
    function initParticles() {
        const canvas = document.getElementById('particulas-canvas');
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = `rgba(132, 0, 255, ${this.alpha})`; // Purple dots
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
