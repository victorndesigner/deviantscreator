document.addEventListener('DOMContentLoaded', () => {
    const btnDeviantes = document.getElementById('btnDeviantes');
    const btnTracos = document.getElementById('btnTracos');
    const infoSearch = document.getElementById('infoSearch');
    const infoContent = document.getElementById('infoContent');

    let currentMode = 'deviantes'; // 'deviantes' or 'tracos'

    // --- INIT ---
    renderContent();

    // --- EVENT LISTENERS ---
    if (btnDeviantes) {
        btnDeviantes.addEventListener('click', () => {
            if (currentMode === 'deviantes') return;
            currentMode = 'deviantes';
            updateButtons();
            renderContent();
        });
    }

    if (btnTracos) {
        btnTracos.addEventListener('click', () => {
            if (currentMode === 'tracos') return;
            currentMode = 'tracos';
            updateButtons();
            renderContent();
        });
    }

    if (infoSearch) {
        infoSearch.addEventListener('input', () => {
            renderContent(infoSearch.value.toLowerCase());
        });
    }

    // --- FUNCTIONS ---

    function updateButtons() {
        btnDeviantes.classList.toggle('active', currentMode === 'deviantes');
        btnTracos.classList.toggle('active', currentMode === 'tracos');
        if (infoSearch) infoSearch.value = ""; // Clear search on toggle
    }

    function renderContent(searchTerm = "") {
        if (!infoContent || typeof deviants === 'undefined') return;
        infoContent.innerHTML = '';

        if (currentMode === 'deviantes') {
            renderDeviantes(searchTerm);
        } else {
            renderTracos(searchTerm);
        }
    }

    function renderDeviantes(searchTerm) {
        Object.keys(deviants).forEach(type => {
            const typeGroup = document.createElement('div');
            typeGroup.className = 'info-group';

            const header = document.createElement('div');
            header.className = 'info-group-header';
            header.innerHTML = `<h3>${type}</h3><span class="chevron">▾</span>`;

            const list = document.createElement('div');
            list.className = 'info-item-list';

            let count = 0;
            Object.keys(deviants[type]).forEach(cat => {
                deviants[type][cat].forEach(dev => {
                    const images = dev.imgs || [dev.img];
                    images.forEach((img, index) => {
                        let variantName = dev.nome;
                        let displayCat = cat; // Category underneath remains original (Combate, etc)

                        // Index 0 is base, index 1+ are variants
                        const vIndex = index;
                        if (index > 0) {
                            if (typeof variantTraits !== 'undefined' && variantTraits[dev.nome] && variantTraits[dev.nome][vIndex]) {
                                const vt = variantTraits[dev.nome][vIndex];
                                // Name format: BaseName - Label
                                variantName = `${dev.nome} - ${vt.label || "Variante"}`;
                            } else {
                                // Fallback: BaseName - Variante
                                variantName = `${dev.nome} - Variante`;
                            }
                        }

                        if (searchTerm === "" || variantName.toLowerCase().includes(searchTerm)) {
                            const item = document.createElement('div');
                            item.className = 'info-item';
                            item.innerHTML = `
                                <div class="info-item-thumb">
                                    <img src="${img}" alt="${variantName}">
                                </div>
                                <div class="info-item-details">
                                    <span class="item-name">${variantName}</span>
                                    <span class="item-cat">${displayCat}</span>
                                </div>
                            `;
                            list.appendChild(item);
                            count++;
                        }
                    });
                });
            });

            if (count > 0) {
                typeGroup.appendChild(header);
                typeGroup.appendChild(list);
                infoContent.appendChild(typeGroup);

                header.addEventListener('click', () => {
                    typeGroup.classList.toggle('expanded');
                });

                // Expand by default if searching
                if (searchTerm !== "") typeGroup.classList.add('expanded');
            }
        });
    }

    function renderTracos(searchTerm) {
        if (typeof traitsData === 'undefined') return;

        Object.keys(traitsData).forEach(slotName => {
            const slotGroup = document.createElement('div');
            slotGroup.className = 'info-group';

            const header = document.createElement('div');
            header.className = 'info-group-header';
            header.innerHTML = `<h3>${slotName}</h3><span class="chevron">▾</span>`;

            const list = document.createElement('div');
            list.className = 'info-item-list traits-list';

            let count = 0;
            const data = traitsData[slotName];

            if (Array.isArray(data)) {
                data.forEach(trait => {
                    if (searchTerm === "" || trait.toLowerCase().includes(searchTerm)) {
                        list.appendChild(createTraitItem(trait));
                        count++;
                    }
                });
            } else {
                Object.keys(data).forEach(subCat => {
                    // Category-based traits (like secondary)
                    if (Array.isArray(data[subCat])) {
                        data[subCat].forEach(trait => {
                            if (searchTerm === "" || trait.toLowerCase().includes(searchTerm)) {
                                list.appendChild(createTraitItem(trait, subCat));
                                count++;
                            }
                        });
                    } else {
                        // For sub-categories (like secondary -> combat/penalties)
                        Object.keys(data[subCat]).forEach(cat => {
                            data[subCat][cat].forEach(trait => {
                                if (searchTerm === "" || trait.toLowerCase().includes(searchTerm)) {
                                    list.appendChild(createTraitItem(trait, `${subCat} (${cat})`));
                                    count++;
                                }
                            });
                        });
                    }
                });
            }

            if (count > 0) {
                slotGroup.appendChild(header);
                slotGroup.appendChild(list);
                infoContent.appendChild(slotGroup);

                header.addEventListener('click', () => {
                    slotGroup.classList.toggle('expanded');
                });

                if (searchTerm !== "") slotGroup.classList.add('expanded');
            }
        });
    }

    function createTraitItem(name, sub = null) {
        const item = document.createElement('div');
        item.className = 'info-item trait-item';
        item.innerHTML = `
            <div class="info-item-details">
                <span class="item-name">${name}</span>
                ${sub ? `<span class="item-cat">${sub}</span>` : ''}
            </div>
        `;
        return item;
    }
});
