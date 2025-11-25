window.addEventListener('load', () => {
    const GOOGLE_API_KEY = "";


    async function getApiErrorMessage(response) {
        try {
            const errorBody = await response.json();
            return errorBody.error?.message || `Error ${response.status}: Respons tidak valid.`;
        } catch (e) {
            return `Error ${response.status}: ${response.statusText || 'Terjadi kesalahan tidak diketahui.'}`;
        }
    }

    function getAspectRatioClass(ratio) {
        const mapping = { '1:1': 'aspect-square', '16:9': 'aspect-video', '9:16': 'aspect-[9/16]', '4:3': 'aspect-[4/3]', '3:4': 'aspect-[3/4]', '2:3': 'aspect-[2/3]', '4:6': 'aspect-[4/6]' };
        return mapping[ratio] || 'aspect-square';
    }

    function setupOptionButtons(container, isCheckbox = false) {
        if (!container) return;
        container.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('button');
            if (clickedButton && container.contains(clickedButton)) {
                if (isCheckbox) {
                    clickedButton.classList.toggle('selected');
                } else {
                    Array.from(container.children).forEach(btn => btn.classList.remove('selected'));
                    clickedButton.classList.add('selected');
                }
            }
        });
    }
    
    async function downloadDataURI(dataURI, filename) {
        try {
            const response = await fetch(dataURI);
            const blob = await response.blob();
            saveAs(blob, filename); 
        } catch (error) {
            console.error("Gagal mengunduh file:", error);
            window.open(dataURI, '_blank');
        }
    }
    
    document.body.addEventListener('click', function(e) {
        const downloadButton = e.target.closest('.download-btn');
        if (downloadButton) {
            e.preventDefault();
            const dataURI = downloadButton.getAttribute('href');
            const filename = downloadButton.getAttribute('download') || 'magic-Foto.png';
            if (dataURI && dataURI !== '#') downloadDataURI(dataURI, filename);
        }
    });

    const tabMapping = {
        'beranda': 'beranda',
        'product': 'product-Fotography',
        'vto': 'virtual-try-on',
        'pov-tangan': 'pov-tangan',
        'fashion': 'fashion', 
        'pre-wedding': 'pre-wedding',
        'model': 'model-generator',
        'Fotographer-rental': 'Fotographer-rental',
        'enhance-Foto': 'enhance-Foto',
        'magic-expander': 'magic-expander',
        'sticker-maker': 'sticker-maker',
        'sketch-to-image': 'sketch-to-image',
        'art-karikatur': 'art-karikatur',
        'dokumentasi': 'dokumentasi',
    };

     const fsProductInput = document.getElementById('fs-product-input');
    const fsProductUploadBox = document.getElementById('fs-product-upload-box');
    const fsProductPreview = document.getElementById('fs-product-preview');
    const fsProductPlaceholder = document.getElementById('fs-product-placeholder');
    const fsRemoveProductBtn = document.getElementById('fs-remove-product-btn');
    const fsLogoInput = document.getElementById('fs-logo-input');
    const fsLogoUploadBox = document.getElementById('fs-logo-upload-box');
    const fsLogoPreview = document.getElementById('fs-logo-preview');
    const fsLogoPlaceholder = document.getElementById('fs-logo-placeholder');
    const fsRemoveLogoBtn = document.getElementById('fs-remove-logo-btn');
    const fsModelTypeOptions = document.getElementById('fs-model-type-options');
    const fsModelDetailsContainer = document.getElementById('fs-model-details-container');
    const fsCustomModelContainer = document.getElementById('fs-custom-model-container');
    const fsCustomModelInput = document.getElementById('fs-custom-model-input');
    const fsCustomModelUploadBox = document.getElementById('fs-custom-model-upload-box');
    const fsCustomModelPreview = document.getElementById('fs-custom-model-preview');
    const fsCustomModelPlaceholder = document.getElementById('fs-custom-model-placeholder');
    const fsRemoveCustomModelBtn = document.getElementById('fs-remove-custom-model-btn');
    const fsAgeOptions = document.getElementById('fs-age-options');
    const fsCustomAgeContainer = document.getElementById('fs-custom-age-container');
    const fsStyleOptions = document.getElementById('fs-style-options');
    const fsCustomStyleContainer = document.getElementById('fs-custom-style-container');
    const fsGenerateBtn = document.getElementById('fs-generate-btn');
    // Mobile Sidebar Toggle - Konsep 2
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebarTooltip = document.getElementById('sidebar-tooltip');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const floatingSidebarEl = document.getElementById('floating-sidebar');
    const sidebarToggleIcon = document.getElementById('sidebar-toggle-icon');
    
    // Show tooltip after 1.5 seconds
    setTimeout(() => {
        if (sidebarTooltip && window.innerWidth < 768) {
            sidebarTooltip.classList.add('visible');
            setTimeout(() => {
                sidebarTooltip.classList.remove('visible');
            }, 4000);
        }
    }, 1500);
    
    function toggleMobileSidebar() {
        if (!floatingSidebarEl || !sidebarBackdrop || !sidebarToggleIcon) return;
        
        const isOpen = !floatingSidebarEl.classList.contains('-translate-x-full');
        
        if (isOpen) {
            // Close sidebar
            floatingSidebarEl.classList.add('-translate-x-full');
            sidebarBackdrop.classList.remove('active');
            sidebarToggleIcon.style.transform = 'rotate(0deg)';
            document.body.style.overflow = '';
        } else {
            // Open sidebar - ensure it's expanded on mobile
            floatingSidebarEl.classList.remove('-translate-x-full');
            floatingSidebarEl.classList.remove('collapsed');
            floatingSidebarEl.classList.add('expanded');
            sidebarBackdrop.classList.add('active');
            sidebarToggleIcon.style.transform = 'rotate(180deg)';
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        }
    }
    
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', toggleMobileSidebar);
    }
    
    // Close sidebar when clicking on sidebar buttons
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    if (!floatingSidebarEl.classList.contains('-translate-x-full')) {
                        toggleMobileSidebar();
                    }
                }, 300);
            }
        });
    });

    let fsProductData = null;
    let fsLogoData = null;
    let fsCustomModelData = null; 

    function fsUpdateGenerateButtonState() {
        const modelType = document.querySelector('#fs-model-type-options .selected')?.dataset.value;
        const isCustomModelRequired = modelType === 'Kustom';
        const customModelOk = !isCustomModelRequired || (isCustomModelRequired && fsCustomModelData);
        
        fsGenerateBtn.disabled = !fsProductData || !customModelOk;
    }

    setupImageUpload(fsProductInput, fsProductUploadBox, (data) => {
        fsProductData = data;
        fsProductPreview.src = data.dataUrl;
        fsProductPlaceholder.classList.add('hidden');
        fsProductPreview.classList.remove('hidden');
        fsRemoveProductBtn.classList.remove('hidden');
        fsUpdateGenerateButtonState();
    });

    fsRemoveProductBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fsProductData = null;
        fsProductInput.value = '';
        fsProductPreview.src = '#';
        fsProductPreview.classList.add('hidden');
        fsProductPlaceholder.classList.remove('hidden');
        fsRemoveProductBtn.classList.add('hidden');
        fsUpdateGenerateButtonState();
    });

    setupImageUpload(fsLogoInput, fsLogoUploadBox, (data) => {
        fsLogoData = data;
        fsLogoPreview.src = data.dataUrl;
        fsLogoPlaceholder.classList.add('hidden');
        fsLogoPreview.classList.remove('hidden');
        fsRemoveLogoBtn.classList.remove('hidden');
    });

    fsRemoveLogoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fsLogoData = null;
        fsLogoInput.value = '';
        fsLogoPreview.src = '#';
        fsLogoPreview.classList.add('hidden');
        fsLogoPlaceholder.classList.remove('hidden');
        fsRemoveLogoBtn.classList.add('hidden');
    });

    setupImageUpload(fsCustomModelInput, fsCustomModelUploadBox, (data) => {
        fsCustomModelData = data;
        fsCustomModelPreview.src = data.dataUrl;
        fsCustomModelPlaceholder.classList.add('hidden');
        fsCustomModelPreview.classList.remove('hidden');
        fsRemoveCustomModelBtn.classList.remove('hidden');
        fsUpdateGenerateButtonState();
    });

    fsRemoveCustomModelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fsCustomModelData = null;
        fsCustomModelInput.value = '';
        fsCustomModelPreview.src = '#';
        fsCustomModelPreview.classList.add('hidden');
        fsCustomModelPlaceholder.classList.remove('hidden');
        fsRemoveCustomModelBtn.classList.add('hidden');
        fsUpdateGenerateButtonState();
    });

    setupOptionButtons(fsModelTypeOptions);
    setupOptionButtons(document.getElementById('fs-gender-options'));
    setupOptionButtons(fsAgeOptions);
    setupOptionButtons(document.getElementById('fs-location-options'));
    setupOptionButtons(fsStyleOptions);
    setupOptionButtons(document.getElementById('fs-ratio-options'));

    fsModelTypeOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const modelType = button.dataset.value;

        const showDetails = modelType === 'Manusia' || modelType === 'Manekin';
        const showCustom = modelType === 'Kustom';
        
        fsModelDetailsContainer.classList.toggle('hidden', !showDetails);
        fsCustomModelContainer.classList.toggle('hidden', !showCustom);
        fsUpdateGenerateButtonState(); 
    });

    fsAgeOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.value === 'Kustom') {
            fsCustomAgeContainer.classList.remove('hidden');
            document.getElementById('fs-custom-age-input').focus();
        } else if (button) {
            fsCustomAgeContainer.classList.add('hidden');
        }
    });
    
    fsStyleOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.value === 'Kustom') {
            fsCustomStyleContainer.classList.remove('hidden');
            document.getElementById('fs-custom-style-input').focus();
        } else if (button) {
            fsCustomStyleContainer.classList.add('hidden');
        }
    });

    fsGenerateBtn.addEventListener('click', async () => {
        const originalBtnHTML = fsGenerateBtn.innerHTML;
        fsGenerateBtn.disabled = true;
        fsGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Foto...</span>`;

        document.getElementById('fs-results-placeholder').classList.add('hidden');
        const resultsContainer = document.getElementById('fs-results-container');
        resultsContainer.classList.remove('hidden');

        const aspectRatio = document.querySelector('#fs-ratio-options .selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);
        
        const resultsGrid = document.getElementById('fs-results-grid');
        resultsGrid.innerHTML = '';
         for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `fs-card-${i}`;
            card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            resultsGrid.appendChild(card);
        }
        lucide.createIcons();
        
        const generationPromises = [1, 2, 3, 4].map(i => generateSingleFashionImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        fsGenerateBtn.disabled = false;
        fsGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });

    async function generateSingleFashionImage(id, aspectRatio) {
        const card = document.getElementById(`fs-card-${id}`);
        try {
            const modelType = document.querySelector('#fs-model-type-options .selected').dataset.value;
            const location = document.querySelector('#fs-location-options .selected').dataset.value;
            let style = document.querySelector('#fs-style-options .selected').dataset.value;
            if (style === 'Kustom') {
                style = document.getElementById('fs-custom-style-input').value.trim() || 'Studio Minimalis';
            }
            const customPrompt = document.getElementById('fs-prompt-input').value.trim();
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            let prompt = '';
            const parts = [];

            if (modelType === 'Kustom' && fsCustomModelData) {
                prompt = `Perform a virtual try-on. You are given two primary images: an article of clothing and a person. 
                Your task is to realistically place the clothing onto the person.
                CRITICAL INSTRUCTIONS:
                1. The final image MUST feature the person from the second image, preserving their exact face, body, and pose.
                2. The clothing from the first image must be transferred onto the person, fitting them naturally and realistically.
                3. The background should be a ${location} setting with a '${style}' visual style, suitable for a professional Fotoshoot.`;

                if (customPrompt) {
                    prompt += `\n- Additional user instructions: "${customPrompt}".`;
                }
                if (fsLogoData) {
                    prompt += `\n- Logo: The third image is a logo. Subtly place this logo on the clothing.`;
                }
                prompt += `\nThis is variation ${id}. The result must be Fotorealistic and seamlessly blended.`;
                
                parts.push({ text: prompt });
                parts.push({ inlineData: { mimeType: fsProductData.mimeType, data: fsProductData.base64 } });
                parts.push({ inlineData: { mimeType: fsCustomModelData.mimeType, data: fsCustomModelData.base64 } });
                if (fsLogoData) {
                    parts.push({ inlineData: { mimeType: fsLogoData.mimeType, data: fsLogoData.base64 } });
                }
            } else {
                prompt = `Create a professional fashion Fotoshoot. The main subject is the clothing from the provided image.`;
                if (modelType === 'Manusia' || modelType === 'Manekin') {
                    const gender = document.querySelector('#fs-gender-options .selected').dataset.value;
                    let age = document.querySelector('#fs-age-options .selected').dataset.value;
                     if (age === 'Kustom') {
                        age = document.getElementById('fs-custom-age-input').value.trim() || 'Dewasa';
                    }
                    if (modelType === 'Manusia') {
                         prompt += ` The clothing is worn by a Fotorealistic human model. The model is a ${gender}, with an age appearance of '${age}'.`;
                    } else { 
                        prompt += ` The clothing is displayed on a full-body, posable ${gender} mannequin. The mannequin must be complete with a head (can be abstract or featureless), arms, and legs, and should be standing in a realistic, dynamic fashion model pose.`;
                    }
                } else { 
                    prompt += ` The clothing is presented as a 'flat lay' or on a hanger against a clean background, with no model or mannequin visible.`;
                }

                prompt += ` The setting is a ${location} environment. The overall visual style and lighting should be '${style}'.`;
                if (customPrompt) {
                    prompt += ` Additional user instructions: "${customPrompt}".`;
                }
                if (fsLogoData) {
                    prompt += ` If appropriate, subtly place the logo from the second image onto the clothing or as a small watermark in a corner.`;
                }
                prompt += ` For this variation (number ${id}), create a slightly different pose or angle to provide variety. The final image must be high-resolution and sharp.`;

                parts.push({ text: prompt });
                parts.push({ inlineData: { mimeType: fsProductData.mimeType, data: fsProductData.base64 } });
                if (fsLogoData) {
                    parts.push({ inlineData: { mimeType: fsLogoData.mimeType, data: fsLogoData.base64 } });
                }
            }

            const payload = {
                contents: [{ parts }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (!base64Data) throw new Error("No image data received from API.");
            
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar"><i data-lucide="eye" class="w-4 h-4"></i></button>
                    <a href="${imageUrl}" download="fashion_Foto_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');

        } catch (error) {
            lucide.createIcons();
            console.error(`Error for fashion Foto card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }
    const allSidebarBtns = document.querySelectorAll('.sidebar-btn');
    const allMobileNavItems = document.querySelectorAll('.mobile-nav-item');

    function switchTab(tabKey, callback = () => {}) {
        const contentId = `content-${tabMapping[tabKey]}`;
        const newContent = document.getElementById(contentId);
        if (!newContent) return;

        const activeContent = document.querySelector('.tab-content-pane.is-active');
        if (activeContent === newContent) {
            callback();
            return;
        }

        allSidebarBtns.forEach(btn => btn.classList.remove('active'));
        allMobileNavItems.forEach(item => item.classList.remove('active'));
        document.getElementById(`tab-${tabMapping[tabKey]}`)?.classList.add('active');
        const mobileNavItem = document.getElementById(`mobile-nav-${tabMapping[tabKey]}`);
        if(mobileNavItem) {
            mobileNavItem.classList.add('active');
        }
        
        if (activeContent) {
            activeContent.classList.add('is-exiting');
            activeContent.addEventListener('animationend', () => {
                activeContent.classList.remove('is-active', 'is-exiting');
                activeContent.classList.add('hidden');
                newContent.classList.remove('hidden');
                newContent.classList.add('is-active');
                callback();
            }, { once: true });
        } else {
            newContent.classList.remove('hidden');
            newContent.classList.add('is-active');
            callback();
        }
    }
    
    for (const key in tabMapping) {
        document.getElementById(`tab-${tabMapping[key]}`)?.addEventListener('click', () => switchTab(key));
        document.getElementById(`mobile-nav-${tabMapping[key]}`)?.addEventListener('click', () => switchTab(key));
    }

    // Floating Home Button Event Listener
    const floatingHomeBtn = document.getElementById('floating-home-btn');
    if (floatingHomeBtn) {
        floatingHomeBtn.addEventListener('click', () => {
            switchTab('beranda');
            // Close mobile sidebar if open
            closeMobileSidebar();
        });
    }

    const universalModal = document.getElementById('universal-modal');
    const imagePreviewModal = document.getElementById('image-preview-modal');
    
    function hideModal() { universalModal.classList.remove('visible'); }
    function showContentModal(title, bodyHTML) {
         document.getElementById('modal-title').textContent = title;
         document.getElementById('modal-body').innerHTML = bodyHTML;
         universalModal.classList.add('visible');
    }
    document.getElementById('close-modal-btn').addEventListener('click', hideModal);
    universalModal.addEventListener('click', (e) => { if (e.target === universalModal) hideModal(); });

    function showImagePreview(imgSrc) {
        document.getElementById('preview-modal-img').src = imgSrc;
        imagePreviewModal.classList.remove('opacity-0', 'pointer-events-none');
    }
    function hideImagePreview() {
        imagePreviewModal.classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('preview-modal-img').src = "";
    }
    document.getElementById('preview-modal-close').addEventListener('click', hideImagePreview);
    imagePreviewModal.addEventListener('click', (e) => { if (e.target === imagePreviewModal) hideImagePreview(); });
    document.body.addEventListener('click', (e) => {
        const viewButton = e.target.closest('.view-btn');
        if (viewButton && viewButton.dataset.imgSrc) showImagePreview(viewButton.dataset.imgSrc);
    });

    function setPfImage(data) {
        pfImageData = data;
        pfPreview.src = data.dataUrl;
        pfPlaceholder.classList.add('hidden');
        pfPreview.classList.remove('hidden');
        pfRemoveBtn.classList.remove('hidden');
        pfUpdateButtons();
    }
    async function addGgImage(data) {
        const emptySlotIndex = ggUploadedImages.findIndex(img => img === null);
        if (emptySlotIndex !== -1) {
            ggUploadedImages[emptySlotIndex] = data;
        } else if (ggUploadedImages.length < MAX_IMAGES) {
            ggUploadedImages.push(data);
        }
        // Hitung rasio jika belum ada
        if (data && !data.ratio && data.dataUrl) {
            data.ratio = await ggCalculateImageRatio(data);
        }
        await ggRenderUploadSlots();
    }

    function stiSetImage(data) {
        stiImageData = data;
        stiPreview.src = data.dataUrl;
        stiPlaceholder.classList.add('hidden');
        stiPreview.classList.remove('hidden');
        stiRemoveBtn.classList.remove('hidden');
        stiUpdateButtons();
    }
    
    const chatHistory = document.getElementById('chat-history');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    let chatFileUploadCounter = 0;
    let conversationState = {};

    function resetConversationState() {
        conversationState = {
            currentIntent: null,
            awaitingFileUploadFor: null,
            awaitingTextInputFor: null,
            collectedData: {},
        };
    }
    
    function startArtKarikaturIntent() {
        conversationState.currentIntent = 'ART_KARIKATUR';
        switchTab('art-karikatur', () => {
            phogicRespond("Tentu! Aku sudah pindahkan kamu ke halaman Art & Karikatur. Silakan unggah Fotomu untuk memulai keajaiban seni!");
            resetConversationState();
        });
    }
    
    const FotographerMenuMap = [
        { number: 1, text: "Baby Born Foto", awaitingState: 'Fotographer_baby_Foto', tabName: 'baby', uploadMessage: "Oke, untuk Foto Bayi, silakan unggah Foto bayinya di sini." },
        { number: 2, text: "Kids Foto", awaitingState: 'Fotographer_kids_Foto', tabName: 'kids', uploadMessage: "Siap! Untuk Foto Anak, boleh kirimkan Fotonya." },
        { number: 3, text: "Foto Umrah/Haji", awaitingState: 'Fotographer_umrah_Foto', tabName: 'umrah', uploadMessage: "Tentu. Silakan unggah Foto diri yang ingin dibuatkan Foto Umrah/Haji." },
        { number: 4, text: "Pas Foto Warna", awaitingState: 'Fotographer_passport_Foto', tabName: 'passport', uploadMessage: "Bisa banget! Kirimkan Foto wajahmu yang terlihat jelas ya." },
    ];
    
    const helpMenuMap = [
        { number: 1, text: "Gabungin beberapa gambar jadi satu", handler: startMergeFotoIntent },
        { number: 2, text: "Bikinin Foto produk profesional", handler: startProductFotoIntent },
        { number: 3, text: "Buat Foto Pre+Wedding impian", handler: startPreweddingFotoIntent },
        { number: 4, text: "Buat Foto model AI dari deskripsi", handler: startModelCreateIntent },
        { number: 5, text: "Ganti pose model di Foto", handler: startModelReposeIntent },
        { number: 6, text: "Sewa Fotografer AI (bayi, umrah, dll)", handler: startFotographerRentalIntent },
        { number: 7, text: "Perbaiki Fotoku yang buram/pecah", handler: startFixFotoIntent },
        { number: 11, text: "Ubah sketsaku jadi gambar jadi", handler: startSketchToImageIntent },
        { number: 12, text: "Bikin Fotoshoot fashion AI", handler: startFashionIntent },
        { number: 13, text: "Ubah Foto jadi Art & Karikatur", handler: startArtKarikaturIntent },
    ];

    async function initBeranda() {
        const welcomeTitle = document.getElementById('welcome-title');
        if (welcomeTitle) {
            let userName = 'AI Foto Magic';
            
            // Coba ambil nama dari Google account jika tersedia
            try {
                // Cek apakah Google Identity Services sudah dimuat
                if (typeof google !== 'undefined' && google.accounts) {
                    const token = localStorage.getItem('google_token');
                    if (token) {
                        // Coba ambil info dari token atau API
                        // Note: Implementasi ini memerlukan Google Identity Services yang sudah dikonfigurasi
                        // Untuk sementara, kita akan menggunakan fallback
                    }
                }
                
                // Alternatif: Cek dari localStorage jika ada
                const savedName = localStorage.getItem('user_name');
                if (savedName) {
                    userName = savedName;
                }
            } catch (error) {
                console.log('Tidak dapat mengambil nama dari Google account:', error);
        }
            
            // Update welcome message
            if (userName !== 'AI Foto Magic') {
                welcomeTitle.textContent = `Welcome, ${userName}!`;
            } else {
                welcomeTitle.textContent = 'Welcome to AI Foto Magic';
            }
        }
        
        // Setup documentation shortcut card event listener
        const docShortcutCard = document.getElementById('doc-shortcut-card');
        if (docShortcutCard) {
            docShortcutCard.addEventListener('click', () => {
                switchTab('dokumentasi');
                // Close mobile sidebar if open
                const mobileSidebar = document.getElementById('floating-sidebar');
                const backdrop = document.getElementById('sidebar-backdrop');
                if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                    mobileSidebar.classList.remove('active');
                    if (backdrop) backdrop.classList.remove('active');
                }
            });
        }
    }

    function toggleFeatureGuide(guideId) {
        const guide = document.getElementById(guideId);
        if (guide) {
            guide.classList.toggle('hidden');
            lucide.createIcons();
        }
    }

    function toggleMoreFeatures() {
        const moreFeatures = document.getElementById('more-features');
        const icon = document.getElementById('more-features-icon');
        if (moreFeatures && icon) {
            const isHidden = moreFeatures.classList.contains('hidden');
            moreFeatures.classList.toggle('hidden');
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            lucide.createIcons();
        }
    }

    function showTypingIndicator() {
        hideTypingIndicator(); 
        const indicatorBubble = document.createElement('div');
        indicatorBubble.className = 'chat-bubble phogic typing-bubble';
        indicatorBubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
        chatHistory.appendChild(indicatorBubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = chatHistory.querySelector('.typing-bubble');
        if (indicator) {
            indicator.remove();
        }
    }

    function appendMessage(text, sender) {
        hideTypingIndicator();
        if (sender === 'phogic') {
        }

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function phogicRespond(response, awaitingFileFor = null) {
        const delay = 500 + Math.random() * 500; 
        showTypingIndicator();

        setTimeout(() => {
            appendMessage(response, 'phogic');
            if (awaitingFileFor) {
                conversationState.awaitingFileUploadFor = awaitingFileFor;
                chatFileUploadCounter++;
                const uploadId = `chat-upload-${chatFileUploadCounter}`;
                
                const uploadBubble = document.createElement('div');
                uploadBubble.className = 'chat-bubble phogic';
                uploadBubble.innerHTML = `
                    <label for="${uploadId}" class="chat-upload-label">
                        <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                        <span>Klik atau seret file ke sini</span>
                    </label>
                    <input type="file" id="${uploadId}" class="hidden" accept="image/*, .heic, .HEIC">
                `;
                chatHistory.appendChild(uploadBubble);
                lucide.createIcons();
                document.getElementById(uploadId).addEventListener('change', handlephogicFileUpload);
            }
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, delay);
    }

    function handleUserMessage(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage(message, 'user');
        chatInput.value = '';

        if (conversationState.awaitingTextInputFor) {
            processTextInput(message);
        } else {
            resetConversationState();
            const intentHandler = parseUserIntent(message);
            intentHandler();
        }
    }
    
    async function handlephogicFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const waitingFor = conversationState.awaitingFileUploadFor;
        if (!waitingFor) {
            appendMessage(`Mengunggah ${file.name}...`, 'user');
            phogicRespond("Wah, maaf, aku agak bingung. Kamu mau pakai file ini untuk apa ya? Coba bilang dulu, misalnya 'gabungkan gambar'.");
            return;
        }
        
        try {
            const processedFile = await convertHeicToJpg(file);
            
            appendMessage(`Mengunggah file '${processedFile.name || file.name}'`, 'user');

            const reader = new FileReader();
            reader.onload = (re) => {
                const dataUrl = re.target.result;
                const parts = dataUrl.split(',');
                const mimeType = parts[0].match(/:(.*?);/)[1];
                const base64 = parts[1];
                const fileData = { base64, mimeType, dataUrl, name: processedFile.name || file.name };
                processFileUpload(fileData);
            };
            reader.readAsDataURL(processedFile);
        } catch (error) {
            console.error("Gagal memproses unggahan chat:", error);
        }
    }
    
    function startFixFotoIntent() {
        conversationState.currentIntent = 'FIX_Foto';
        phogicRespond("Oh, Fotonya buram atau kurang tajam? Tenang, itu magic gampang buatku! Boleh kirimkan Fotonya?", 'fix_Foto');
    }
    function startMergeFotoIntent() {
        conversationState.currentIntent = 'MERGE_Foto';
        phogicRespond("Wih, ide bagus! Menggabungkan gambar itu salah satu magic favoritku. Yuk, mulai dengan gambar yang pertama.", 'merge_Foto_1');
    }
    function startProductFotoIntent() {
        conversationState.currentIntent = 'PRODUCT_Foto';
        phogicRespond("Siap! Mau bikin Foto produk yang keren, kan? Boleh unggah dulu Foto produknya.", 'product_Foto');
    }
    function startPreweddingFotoIntent() {
        conversationState.currentIntent = 'PREWEDDING_Foto';
        phogicRespond("Wow, selamat ya! Siap-siap punya Foto pre-wedding impian. Yuk, kita mulai dengan Foto orang pertama.", 'prewedding_Foto_1');
    }
    function startModelCreateIntent() {
        conversationState.currentIntent = 'MODEL_CREATE';
        conversationState.awaitingTextInputFor = 'model_create_prompt';
        phogicRespond("Tentu! Coba ceritain ke aku, model seperti apa yang ada di bayanganmu? Semakin detail, semakin bagus hasilnya!");
    }
    function startModelReposeIntent() {
        conversationState.currentIntent = 'MODEL_REPOSE';
        phogicRespond("Oke, mau ganti pose model? Gampang! Kirim dulu Fotonya ke sini.", 'model_repose_image');
    }

    function showHelpMenu() {
        const menuText = helpMenuMap.map(item => `${item.number}. ${item.text}`).join('\n');
        conversationState.awaitingTextInputFor = 'help_selection';
        
        phogicRespond(`Tentu! Aku bisa banyak hal. Pilih salah satu dari daftar di bawah ini dengan mengetikkan nomornya saja:\n\n${menuText}`);
    }

    function startFashionIntent() {
        conversationState.currentIntent = 'FASHION_Foto';
        switchTab('fashion', () => {
            phogicRespond("Siap! Aku sudah pindahkan kamu ke halaman Fashion Fotoshoot. Unggah Foto pakaianmu untuk memulai magicnya!");
            resetConversationState();
        });
    }

    function startSketchToImageIntent() {
        conversationState.currentIntent = 'SKETCH_TO_IMAGE';
        phogicRespond("Tentu! Mengubah sketsa jadi gambar digital itu seru banget. Coba kirimkan gambar sketsamu ke sini.", 'sketch_image');
    }

    function startFotographerRentalIntent() {
        conversationState.currentIntent = 'FotoGRAPHER_RENTAL_SUBMENU';
        const menuText = FotographerMenuMap.map(item => `${item.number}. ${item.text}`).join('\n');
        conversationState.awaitingTextInputFor = 'Fotographer_selection';
        phogicRespond(`Tentu! Fitur Fotografer AI punya beberapa pilihan. Mau coba yang mana? (Ketik nomornya)\n\n${menuText}`);
    }


    function processTextInput(message) {
        const waitingFor = conversationState.awaitingTextInputFor;
        
        if (waitingFor === 'help_selection') {
            const selectionNumber = parseInt(message.trim());
            const selectedFeature = helpMenuMap.find(item => item.number === selectionNumber);

            if (selectedFeature) {
                conversationState.awaitingTextInputFor = null; 
                selectedFeature.handler(); 
            } else {
                phogicRespond("Hmm, sepertinya itu bukan nomor yang valid. Coba ketik nomor yang ada di daftar ya.");
            }
        } else if (waitingFor === 'Fotographer_selection') { 
            const selectionNumber = parseInt(message.trim());
            const selectedFeature = FotographerMenuMap.find(item => item.number === selectionNumber);
            if (selectedFeature) {
                conversationState.awaitingTextInputFor = null;
                conversationState.collectedData.selectedFotographerFeature = selectedFeature;
                phogicRespond(selectedFeature.uploadMessage, selectedFeature.awaitingState);
            } else {
                 phogicRespond("Nomornya tidak ada di pilihan. Coba ketik nomor dari 1 sampai 4 ya.");
            }
        } else if (waitingFor === 'merge_prompt') {
            conversationState.awaitingTextInputFor = null;
            conversationState.collectedData.prompt = message;
            const images = conversationState.collectedData.images;
            switchTab('product', async () => {
                ggUploadedImages = [];
                for (const imgData of images) {
                    await addGgImage(imgData);
                }
                ggPromptInput.value = message;
                ggUpdateButtons();
                phogicRespond("Aha, instruksi diterima! Semua bahan magicnya udah kusiapin di halaman 'Gabung Gambar' ya. Kamu tinggal cek dan klik tombol 'Buat Variasi' di sana. Selamat mencoba!");
                resetConversationState();
            });
        } else if (waitingFor === 'model_create_prompt') {
            conversationState.awaitingTextInputFor = null;
            switchTab('model', () => {
                switchModelTab('create');
                mgPromptInput.value = message;
                phogicRespond("Sip, deskripsinya keren! Udah aku tuliskan di halaman 'Foto Model'. Sekarang, kamu tinggal klik tombol 'Buat Foto Model' aja.");
                resetConversationState();
            });
        } else if (waitingFor === 'model_repose_prompt') {
            conversationState.awaitingTextInputFor = null;
            switchTab('model', () => {
                switchModelTab('repose');
                cpImageData = conversationState.collectedData.image;
                cpPreview.src = conversationState.collectedData.image.dataUrl;
                cpPlaceholder.classList.add('hidden');
                cpPreview.classList.remove('hidden');
                cpRemoveBtn.classList.remove('hidden');
                cpPromptInput.value = message;
                cpUpdateButtons();
                phogicRespond("Oke, Foto dan pose barunya udah siap di halaman 'Ubah Pose'. Langsung aja klik tombol 'Buat Pose Baru' ya!");
                resetConversationState();
            });
        } else {
             conversationState.awaitingTextInputFor = null;
        }
    }

    function processFileUpload(fileData) {
        const state = conversationState.awaitingFileUploadFor;
        conversationState.awaitingFileUploadFor = null;

        if (state === 'fix_Foto') {
            switchTab('enhance-Foto', () => {
                setPfImage(fileData);
                phogicRespond("Oke, Fotonya sudah siap diperbaiki! Aku pindahin kamu ke halaman 'Perbaiki Foto' ya. Tinggal klik tombolnya dan lihat keajaibannya!");
                resetConversationState();
            });
        } else if (state.startsWith('merge_Foto')) {
            if (!conversationState.collectedData.images) conversationState.collectedData.images = [];
            conversationState.collectedData.images.push(fileData);
            
            if (conversationState.collectedData.images.length < 2) {
                phogicRespond("Sip, gambar pertama udah masuk. Keren! Sekarang, mana gambar keduanya?", 'merge_Foto_2');
            } else {
                conversationState.awaitingTextInputFor = 'merge_prompt';
                phogicRespond("Keren! Dua gambar udah siap dimagic. Sekarang, coba ceritain, kamu mau dua gambar ini digabungin jadi seperti apa?");
            }
        } else if (state === 'product_Foto') {
             switchTab('vto', () => {
                switchVtoTab('product-only');
                psImageData = fileData;
                psPreview.src = fileData.dataUrl;
                psPlaceholder.classList.add('hidden');
                psPreview.classList.remove('hidden');
                psRemoveBtn.classList.remove('hidden');
                psUpdateButtons();
                phogicRespond("Produknya udah kuterima! Sekarang kamu ada di halaman 'Fotoshoot Produk'. Yuk, atur gaya yang kamu mau terus klik buat!");
                resetConversationState();
            });
        } else if (state.startsWith('prewedding_Foto')) {
            if (!conversationState.collectedData.images) conversationState.collectedData.images = [];
            conversationState.collectedData.images.push(fileData);

            if (conversationState.collectedData.images.length < 2) {
                phogicRespond("Oke, Foto pertama udah siap. Manis banget! Sekarang, giliran Foto orang keduanya.", 'prewedding_Foto_2');
            } else {
                const images = conversationState.collectedData.images;
                switchTab('pre-wedding', () => {
                    pwPerson1Data = { data: images[0], isValid: true };
                    pwPerson1Preview.src = images[0].dataUrl;
                    pwPerson1Placeholder.classList.add('hidden');
                    pwPerson1Preview.classList.remove('hidden');
                    pwRemovePerson1Btn.classList.remove('hidden');
                    pwPerson1Validation.textContent = '%u2713 Foto valid';
                    pwPerson1Validation.className = 'validation-status text-center text-green-600';
                    
                    pwPerson2Data = { data: images[1], isValid: true };
                    pwPerson2Preview.src = images[1].dataUrl;
                    pwPerson2Placeholder.classList.add('hidden');
                    pwPerson2Preview.classList.remove('hidden');
                    pwRemovePerson2Btn.classList.remove('hidden');
                    pwPerson2Validation.textContent = '%u2713 Foto valid';
                    pwPerson2Validation.className = 'validation-status text-center text-green-600';
                    pwUpdateGenerateButtonState();
                });
                phogicRespond("Lengkap! Kedua Fotonya udah kusiapin di halaman 'Pre+Wedding'. Silakan pilih gaya dan lokasi impian kalian di sana.");
                resetConversationState();
            }
        } else if (state.startsWith('Fotographer_')) { 
            const selectedFeature = conversationState.collectedData.selectedFotographerFeature;
            if (!selectedFeature) return;

            switchTab('Fotographer-rental', () => {
                switchFotographerTab(selectedFeature.tabName);
                
               switch(selectedFeature.tabName) {
                    case 'baby':
                        sfBabyData = { data: fileData, isValid: true };
                        sfBabyPreview.src = fileData.dataUrl;
                        sfBabyPlaceholder.classList.add('hidden');
                        sfBabyPreview.classList.remove('hidden');
                        sfBabyRemoveBtn.classList.remove('hidden');
                        sfBabyValidation.textContent = '%u2713 Foto valid';
                        sfBabyValidation.className = 'validation-status text-center text-green-600';
                        sfBabyUpdateBtn();
                        break;
                    case 'kids':
                        sfKidsData = { data: fileData, isValid: true };
                        sfKidsPreview.src = fileData.dataUrl;
                        sfKidsPlaceholder.classList.add('hidden');
                        sfKidsPreview.classList.remove('hidden');
                        sfKidsRemoveBtn.classList.remove('hidden');
                        sfKidsValidation.textContent = '%u2713 Foto valid';
                        sfKidsValidation.className = 'validation-status text-center text-green-600';
                        sfKidsUpdateBtn();
                        break;
                    case 'umrah':
                         sfUmrahData = { data: fileData, isValid: true };
                        sfUmrahPreview.src = fileData.dataUrl;
                        sfUmrahPlaceholder.classList.add('hidden');
                        sfUmrahPreview.classList.remove('hidden');
                        sfUmrahRemoveBtn.classList.remove('hidden');
                        sfUmrahValidation.textContent = '%u2713 Foto valid';
                        sfUmrahValidation.className = 'validation-status text-center text-green-600';
                        sfUmrahUpdateBtn();
                        break;
                    case 'passport':
                        sfPassportData = { data: fileData, isValid: true };
                        sfPassportPreview.src = fileData.dataUrl;
                        sfPassportPlaceholder.classList.add('hidden');
                        sfPassportPreview.classList.remove('hidden');
                        sfPassportRemoveBtn.classList.remove('hidden');
                        sfPassportValidation.textContent = '%u2713 Foto valid';
                        sfPassportValidation.className = 'validation-status text-center text-green-600';
                        sfPassportUpdateBtn();
                        break;
                }

                phogicRespond("Sip! Fotonya sudah kusiapkan di halaman Sewa Fotografer. Sekarang tinggal atur pilihan lainnya dan klik tombol buat ya!");
                resetConversationState();
            });
        } else if (state === 'model_repose_image') {
            conversationState.collectedData.image = fileData;
            conversationState.awaitingTextInputFor = 'model_repose_prompt';
            phogicRespond("Foto diterima! Sekarang, tulis pose baru yang kamu inginkan. Misalnya 'sedang duduk santai', 'tertawa lepas', atau 'berjalan di taman'.");
        } else if (state === 'sketch_image') {
            switchTab('sketch-to-image', () => {
                stiSetImage(fileData);
                phogicRespond("Sketsa diterima! Aku udah siapkan di halaman 'Ubah Sketsa Jadi Gambar'. Sekarang kamu tinggal pilih tujuannya, lalu klik tombol 'Buat Gambar' ya!");
                resetConversationState();
            });
        }

    }
    
   const intents = {
        GREETING: { keywords: ['halo', 'hai', 'hi', 'pagi', 'siang', 'sore', 'malam'], handler: () => phogicRespond("Halo juga! Ada yang bisa aku bantu magic hari ini?") },
        HELP: { keywords: ['bisa apa', 'fitur', 'bantuan', 'tolong', 'help'], handler: showHelpMenu },
        FIX_Foto: { keywords: ['perbaiki', 'fix', 'enhance', 'buram', 'pecah', 'kualitas', 'tajamkan', 'jelaskan'], handler: startFixFotoIntent },
        MERGE_Foto: { keywords: ['gabung', 'kombinasi', 'campur', 'merge', 'combine'], handler: startMergeFotoIntent },
        PRODUCT_Foto: { keywords: ['produk', 'jualan', 'katalog', 'Fotoshoot produk'], handler: startProductFotoIntent },
        PREWEDDING_Foto: { keywords: ['prewed', 'prewedding', 'wedding', 'nikah', 'pasangan'], handler: startPreweddingFotoIntent },
        MODEL_CREATE: { keywords: ['buat model', 'bikin model', 'model ai'], handler: startModelCreateIntent },
        MODEL_REPOSE: { keywords: ['ubah pose', 'ganti pose', 'repose'], handler: startModelReposeIntent },
        FASHION_Foto: { keywords: ['fashion', 'pakaian', 'baju', 'busana', 'Fotoshoot fashion'], handler: startFashionIntent },
        SKETCH_TO_IMAGE: { keywords: ['sketsa', 'sketch', 'coretan', 'gambar dari sketsa', 'ubah sketsa'], handler: startSketchToImageIntent },
        FotoGRAPHER_RENTAL: { keywords: ['Fotografer', 'sewa Fotografer', 'Foto bayi', 'Foto anak', 'Foto umrah', 'pas Foto'], handler: startFotographerRentalIntent },
        ART_KARIKATUR: { keywords: ['art', 'karikatur', 'lukisan', 'kartun'], handler: startArtKarikaturIntent },
    };

    function parseUserIntent(message) {
        const msg = message.toLowerCase();
        for (const intentKey in intents) {
            if (intents[intentKey].keywords.some(keyword => msg.includes(keyword))) {
                return intents[intentKey].handler;
            }
        }
        return () => phogicRespond("Hmm, aku belum ngerti nih maksudnya. Coba katakan 'bantuan', nanti aku kasih tau apa aja magic yang aku bisa.");
    }

    async function convertHeicToJpg(file) {
        const isHeic = file.name.toLowerCase().endsWith('.heic') || file.type.toLowerCase() === 'image/heic' || file.type.toLowerCase() === 'image/heif';

        if (isHeic) {
            console.log("HEIC file detected, converting...");
            try {
                const conversionResult = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.9,
                });
                const finalBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
                const originalName = file.name.split('.').slice(0, -1).join('.');
                const jpegFile = new File([finalBlob], `${originalName}.jpeg`, { type: 'image/jpeg' });
                console.log("Conversion successful.");
                return jpegFile;
            } catch (error) {
                console.error("HEIC conversion failed:", error);
                alert("Gagal mengonversi file HEIC. File mungkin rusak atau tidak didukung.");
                throw error;
            }
        } else {
            return file;
        }
    }

    function setupImageUpload(input, uploadArea, onFile) {
        async function handleFile(file) {
            if (file) {
                try {
                    const processedFile = await convertHeicToJpg(file);
                    
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const parts = e.target.result.split(',');
                        const mimeType = parts[0].match(/:(.*?);/)[1];
                        const base64 = parts[1];
                        onFile({ base64, mimeType, dataUrl: e.target.result });
                    };
                    reader.readAsDataURL(processedFile);
                } catch (error) {
                    console.error("Error processing file:", error);
                }
            }
        }

        input.addEventListener('change', (event) => handleFile(event.target.files[0]));
        if (uploadArea) {
            ['dragover', 'drop', 'dragleave'].forEach(eventName => {
                uploadArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); });
            });
            uploadArea.addEventListener('dragover', () => uploadArea.classList.add('border-teal-500'));
            uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('border-teal-500'));
            uploadArea.addEventListener('drop', (e) => {
                uploadArea.classList.remove('border-teal-500');
                handleFile(e.dataTransfer.files[0]);
            });
        }
    }
    
    const ggUploadContainer = document.getElementById('gg-upload-container');
    const ggPromptInput = document.getElementById('gg-prompt-input');
    const ggMagicPromptBtn = document.getElementById('gg-magic-prompt-btn');
    const ggGenerateBtn = document.getElementById('gg-generate-btn');
    const ggResultsContainer = document.getElementById('gg-results-container');
    const ggResultsGrid = document.getElementById('gg-results-grid');
    const ggRatioOptions = document.getElementById('gg-ratio-options');
    let magicPromptTooltipShown = false;

    let ggUploadedImages = [];
    const MAX_IMAGES = 5;
    const MIN_IMAGES = 2;

    setupOptionButtons(ggRatioOptions);

    function ggUpdateButtons() {
        const uploadedCount = ggUploadedImages.filter(img => img !== null).length;
        ggGenerateBtn.disabled = uploadedCount < MIN_IMAGES || ggPromptInput.value.trim() === '';
        ggMagicPromptBtn.disabled = uploadedCount < MIN_IMAGES;
    }

    function ggCalculateImageRatio(imgData) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.width / img.height;
                resolve(ratio);
            };
            img.onerror = () => resolve(1); // Default to square if error
            img.src = imgData.dataUrl;
        });
    }

    function ggGetAspectRatioClass(ratio) {
        // Tentukan class berdasarkan rasio
        if (ratio >= 1.5) return 'aspect-[16/9]'; // Landscape wide
        if (ratio >= 1.2) return 'aspect-[4/3]'; // Landscape
        if (ratio >= 0.8) return 'aspect-square'; // Square
        if (ratio >= 0.6) return 'aspect-[3/4]'; // Portrait
        return 'aspect-[9/16]'; // Portrait tall
    }

    async function ggRenderUploadSlots() {
        ggUploadContainer.innerHTML = '';
        let currentSlots = ggUploadedImages.length;
        
        while (ggUploadedImages.length < MIN_IMAGES) {
            ggUploadedImages.push(null);
        }

        if (ggUploadedImages[ggUploadedImages.length - 1] !== null && ggUploadedImages.length < MAX_IMAGES) {
            ggUploadedImages.push(null);
        }

        for (let index = 0; index < ggUploadedImages.length; index++) {
            const imgData = ggUploadedImages[index];
            const slot = document.createElement('div');
            
            if (imgData) {
                // Hitung rasio jika belum ada
                if (!imgData.ratio) {
                    imgData.ratio = await ggCalculateImageRatio(imgData);
                }
                const aspectClass = ggGetAspectRatioClass(imgData.ratio);
                slot.className = `relative ${aspectClass} w-full`;
                
                slot.innerHTML = `
                    <div class="w-full h-full rounded-lg border-2 border-teal-500 overflow-hidden bg-gray-100">
                        <img src="${imgData.dataUrl}" class="w-full h-full object-cover" alt="Uploaded image ${index + 1}">
                    </div>
                    <button data-index="${index}" class="gg-remove-btn absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg z-10 transition-all">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                    </button>
                `;
            } else {
                slot.className = 'relative aspect-square w-full';
                slot.innerHTML = `
                    <label for="gg-image-input-${index}" class="file-input-label rounded-lg !p-2 h-full flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors">
                        <i data-lucide="plus" class="w-10 h-10 text-gray-400 mb-1"></i>
                        <span class="text-xs text-gray-500">Tambah</span>
                    </label>
                    <input type="file" id="gg-image-input-${index}" data-index="${index}" class="gg-image-input hidden" accept="image/png, image/jpeg, image/webp, .heic, .HEIC">
                `;
            }
            ggUploadContainer.appendChild(slot);
        }
        
        const uploadedCount = ggUploadedImages.filter(img => img !== null).length;
        if (uploadedCount >= MIN_IMAGES && !magicPromptTooltipShown) {
            const tooltip = document.getElementById('gg-magic-prompt-tooltip');
            if(tooltip) {
                tooltip.classList.add('visible');
                magicPromptTooltipShown = true;
                setTimeout(() => {
                    tooltip.classList.remove('visible');
                }, 5000); 
            }
        }


        lucide.createIcons();
        ggAttachSlotListeners();
        ggUpdateButtons();
    }

    function ggAttachSlotListeners() {
        document.querySelectorAll('.gg-image-input').forEach(input => {
            input.addEventListener('change', async (e) => { 
                const index = parseInt(e.target.dataset.index);
                const file = e.target.files[0];
                if (file) {
                    try {
                        const processedFile = await convertHeicToJpg(file);
                        const reader = new FileReader();
                        reader.onload = async (re) => {
                            const parts = re.target.result.split(',');
                            const mimeType = parts[0].match(/:(.*?);/)[1];
                            const base64 = parts[1];
                            const dataUrl = re.target.result;
                            
                            // Hitung rasio gambar
                            const ratio = await ggCalculateImageRatio({ dataUrl });
                            
                            ggUploadedImages[index] = { base64, mimeType, dataUrl, ratio };
                            await ggRenderUploadSlots();
                        };
                        reader.readAsDataURL(processedFile);
                    } catch (error) {
                       console.error("Error attaching slot listener:", error);
                    }
                }
            });
        });

        document.querySelectorAll('.gg-remove-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                ggUploadedImages.splice(index, 1);
                while (ggUploadedImages.length > MIN_IMAGES && ggUploadedImages[ggUploadedImages.length - 1] === null) {
                    ggUploadedImages.pop();
                }
                await ggRenderUploadSlots();
            });
        });
         document.querySelectorAll('label[for^="gg-image-input-"]').forEach(async (label) => {
             setupImageUpload(document.getElementById(label.getAttribute('for')), label, async (data) => {
                const index = parseInt(label.getAttribute('for').split('-').pop());
                
                // Hitung rasio gambar jika belum ada
                if (!data.ratio && data.dataUrl) {
                    data.ratio = await ggCalculateImageRatio(data);
                }
                
                ggUploadedImages[index] = data;
                await ggRenderUploadSlots();
             });
        });
    }

    ggPromptInput.addEventListener('input', ggUpdateButtons);

    ggMagicPromptBtn.addEventListener('click', async () => {
        const originalBtnHTML = ggMagicPromptBtn.innerHTML;
        ggMagicPromptBtn.disabled = true;
        ggMagicPromptBtn.innerHTML = `<div class="loader-icon w-5 h-5"></div>`;
        lucide.createIcons();

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
            const systemPrompt = `You are a creative assistant. Analyze the provided images and generate a short, creative prompt in Indonesian that describes how to merge them into a single, cohesive new image. Describe the desired style and subject matter. For example, if you see a cat and an astronaut, you could suggest: "Seekor kucing lucu sebagai astronot, mengambang di luar angkasa dengan latar belakang nebula berwarna-warni, gaya seni digital.". Respond ONLY with the prompt text itself, without any introductory phrases.`;
            
            const parts = [{ text: "Buatkan instruksi untuk menggabungkan gambar-gambar ini:" }];
            ggUploadedImages.filter(img => img !== null).forEach(img => {
                parts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } });
            });

            const payload = {
                contents: [{ parts: parts }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            
            const result = await response.json();
            const description = result.candidates[0].content.parts[0].text;
            ggPromptInput.value = description.trim();
            ggUpdateButtons();

        } catch (error) {
            console.error("Error generating magic prompt:", error);
            ggPromptInput.value = `Gagal membuat instruksi: ${error.message}`;
        } finally {
            ggMagicPromptBtn.innerHTML = originalBtnHTML;
            lucide.createIcons();
            ggUpdateButtons();
        }
    });

    ggGenerateBtn.addEventListener('click', async () => {
        const originalBtnHTML = ggGenerateBtn.innerHTML;
        ggGenerateBtn.disabled = true;
        ggGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Menggabungkan...</span>`;
        
        const aspectRatio = ggRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        const placeholder = document.getElementById('gg-results-placeholder');
        if (placeholder) {
            placeholder.classList.add('hidden');
        }

        ggResultsGrid.classList.remove('hidden');
        ggResultsGrid.className = `grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6`;
        ggResultsGrid.innerHTML = '';
        for(let i=1; i<=4; i++) {
            const card = document.createElement('div');
            card.id = `gg-card-${i}`;
            card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
            card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
            ggResultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = [1,2,3,4].map(i => ggGenerateSingleImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        ggGenerateBtn.disabled = false;
        ggGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });

    async function ggGenerateSingleImage(id, aspectRatio) {
        const card = document.getElementById(`gg-card-${id}`);
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;

            const prompt = `${ggPromptInput.value.trim()}. The final image must have an aspect ratio of ${aspectRatio}. This is variation number ${id}.`;
            const parts = [{ text: prompt }];
            ggUploadedImages.filter(img => img !== null).forEach(img => {
                parts.push({ inlineData: { mimeType: img.mimeType, data: img.base64 } });
            });
            
            const payload = {
                contents: [{ parts: parts }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };
            
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

            if (base64Data) {
                const imageUrl = `data:image/png;base64,${base64Data}`;
                card.innerHTML = `
                    <img src="${imageUrl}" class="w-full h-full object-cover">
                    <div class="absolute bottom-2 right-2 flex gap-1">
                        <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <a href="${imageUrl}" download="gabungan_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </a>
                    </div>`;
                 card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
                 card.classList.add('relative');
            } else {
                throw new Error("Respon tidak valid dari API (tidak ada data gambar).");
            }
        } catch (error) {
            console.error(`Error for card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }

    (async () => {
        await ggRenderUploadSlots();
    })();
  
    const vtoTabProductOnly = document.getElementById('vto-tab-product-only');
    const vtoTabProductModel = document.getElementById('vto-tab-product-model');
    const vtoContentProductOnly = document.getElementById('vto-content-product-only');
    const vtoContentProductModel = document.getElementById('vto-content-product-model');

    function switchVtoTab(tabName) {
        const isActiveProductOnly = tabName === 'product-only';
        
        vtoTabProductOnly.classList.toggle('active', isActiveProductOnly);
        vtoTabProductModel.classList.toggle('active', !isActiveProductOnly);

        vtoContentProductOnly.classList.toggle('hidden', !isActiveProductOnly);
        vtoContentProductModel.classList.toggle('hidden', isActiveProductOnly);
    }
    
    vtoTabProductOnly.addEventListener('click', () => switchVtoTab('product-only'));
    vtoTabProductModel.addEventListener('click', () => switchVtoTab('product-model'));

   
    const psImageInput = document.getElementById('ps-image-input');
    const psUploadBox = document.getElementById('ps-upload-box');
    const psPreview = document.getElementById('ps-preview');
    const psPlaceholder = document.getElementById('ps-placeholder');
    const psRemoveBtn = document.getElementById('ps-remove-btn');
    const psLightingOptions = document.getElementById('ps-lighting-options');
    const psMoodOptions = document.getElementById('ps-mood-options');
    const psRatioOptions = document.getElementById('ps-ratio-options');
    const psLocationContainer = document.getElementById('ps-location-container');
    const psLocationOptions = document.getElementById('ps-location-options');
    const psBoosterToggle = document.getElementById('ps-booster-toggle');
    const psGenerateBtn = document.getElementById('ps-generate-btn');
    const psGenerateBtnText = document.getElementById('ps-generate-btn-text');
    const psResultsContainer = document.getElementById('ps-results-container');
    const psResultsTitle = document.getElementById('ps-results-title');
    const psResultsGrid = document.getElementById('ps-results-grid');

    let psImageData = null;

    setupOptionButtons(psLightingOptions);
    setupOptionButtons(psMoodOptions);
    setupOptionButtons(psRatioOptions);
    setupOptionButtons(psLocationOptions);

    psMoodOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.value === 'crowd') {
            psLocationContainer.classList.remove('hidden');
        } else {
            psLocationContainer.classList.add('hidden');
        }
    });

    function updateBoosterUIState() {
        const isBoosterOn = psBoosterToggle.checked;
        const elementsToToggle = [psLightingOptions, psMoodOptions, psLocationContainer];

        elementsToToggle.forEach(el => {
            el.classList.toggle('opacity-50', isBoosterOn);
            el.classList.toggle('pointer-events-none', isBoosterOn);
            el.querySelectorAll('button').forEach(btn => btn.disabled = isBoosterOn);
        });

        psGenerateBtnText.textContent = isBoosterOn ? "Buat 10 Variasi Kreatif" : "Buat 4 Variasi";
    }
    
    psBoosterToggle.addEventListener('change', updateBoosterUIState);
    updateBoosterUIState();

    function psUpdateButtons() {
        psGenerateBtn.disabled = !psImageData;
    }

    setupImageUpload(psImageInput, psUploadBox, (data) => {
        psImageData = data;
        psPreview.src = data.dataUrl;
        psPlaceholder.classList.add('hidden');
        psPreview.classList.remove('hidden');
        psRemoveBtn.classList.remove('hidden');
        psUpdateButtons();
    });

    psRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        psImageData = null;
        psImageInput.value = '';
        psPreview.src = '#';
        psPreview.classList.add('hidden');
        psPlaceholder.classList.remove('hidden');
        psRemoveBtn.classList.add('hidden');
        psUpdateButtons();
        document.getElementById('ps-results-placeholder').classList.remove('hidden');
        psResultsContainer.classList.add('hidden');
        psResultsGrid.innerHTML = ''; 
    });
    

    async function generateProductOnlyImage(effect, aspectRatio) {
        const cardId = `ps-card-${effect.id}`;
        const card = document.getElementById(cardId);
        if (!card) return;

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            
            const payload = {
                contents: [{
                    parts: [
                        { text: effect.prompt },
                        { inlineData: { mimeType: psImageData.mimeType, data: psImageData.base64 } }
                    ]
                }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

            if (base64Data) {
                const imageUrl = `data:image/png;base64,${base64Data}`;
                const imageTitle = effect.name || `Fotoshoot Kreatif ${effect.id}`;
                card.innerHTML = `
                    <img src="${imageUrl}" class="w-full h-full object-cover">
                    <div class="absolute bottom-2 right-2 flex gap-1">
                        <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <button data-img-src="${imageUrl}" data-img-title="${imageTitle}" data-card-id="${cardId}" class="ps-edit-btn result-action-btn" title="Edit Gambar Ini">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                        </button>
                        <a href="${imageUrl}" download="Fotoshoot_produk_${effect.id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </a>
                    </div>`;
                card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
                card.classList.add('relative');
            } else {
                throw new Error("Respon API tidak valid (tidak ada data gambar).");
            }
        } catch (error) {
            console.error(`Error for product Fotoshoot card ${effect.id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }
    
    document.body.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.ps-edit-btn');
        if(editBtn) {
            const imgSrc = editBtn.dataset.imgSrc;
            const imgTitle = editBtn.dataset.imgTitle;
            const cardId = editBtn.dataset.cardId;
            if(imgSrc && imgTitle && cardId) {
                showEditModal(imgSrc, imgTitle, cardId);
            }
        }
    });

    psGenerateBtn.addEventListener('click', async () => {
        document.getElementById('ps-results-placeholder').classList.add('hidden');

        if (psBoosterToggle.checked) {
            await generateBoosterFotoshoot();
        } else {
            await generateStandardFotoshoot();
        }
    });

    async function generateStandardFotoshoot() {
        const originalBtnHTML = psGenerateBtn.innerHTML;
        psGenerateBtn.disabled = true;
        psGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Variasi...</span>`;
        
        const aspectRatio = psRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        psResultsContainer.classList.remove('hidden');
        psResultsContainer.classList.add('flex-grow', 'flex', 'flex-col'); 
        psResultsTitle.textContent = "4 Variasi Fotoshoot Produk";
        psResultsGrid.innerHTML = '';
         for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `ps-card-${i}`;
            card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            psResultsGrid.appendChild(card);
        }
        lucide.createIcons();
        
        const lighting = psLightingOptions.querySelector('.selected').dataset.value;
        const mood = psMoodOptions.querySelector('.selected').dataset.value;
        const location = psLocationOptions.querySelector('.selected').dataset.value;
        
        let baseSetting = `The lighting is ${lighting}. `;
        let moodAndLocationSetting = `The mood is ${mood}. `;

        if (mood === 'crowd') {
            let locationDescription = (location === 'indoor') 
                ? 'on a professional shooting table inside a stylish room, focusing sharply on the product' 
                : 'at a professional outdoor Fotoshoot location, like a manicured garden or a scenic architectural spot';
            moodAndLocationSetting += `The product is placed naturally within the scene: ${locationDescription}. `;
        }
        
        const userInstructions = baseSetting + moodAndLocationSetting;

        const effects = [
            { id: 1, name: 'Efek Shadow', prompt: `Analyze the product from the input image. Recreate it in a new, thematically related background with no people visible. The product must cast a prominent, artistic shadow across the surface. Adhere to these instructions: "${userInstructions}"` },
            { id: 2, name: 'Efek Bokeh', prompt: `Analyze the product from the input image. Recreate it in a new, thematically related background with no people visible. This background must be rendered with a beautiful, soft bokeh effect, while the product remains in sharp focus. Adhere to these instructions: "${userInstructions}"` },
            { id: 3, name: 'Efek Terbang', prompt: `Dynamic 'hero product' action Fotography based on the input image. The product is captured mid-air in a freeze-motion style. Create a dynamic, abstract background that is thematically related to the product. Artistic splashes and particles matching the product should scatter around it. The overall mood should be powerful and cinematic. Adhere to these instructions: "${userInstructions}"` },
            { id: 4, name: 'Studio Foto', prompt: `Professional studio Fotography of the product from the input image. Place it on a clean, reflective surface against a seamless, neutral-colored studio background. Analyze the product and place a few thematically relevant, smaller props around it to create an appealing composition. The lighting should be soft, multi-point studio lighting that eliminates harsh shadows. The final image must be ultra-realistic and sharp. Adhere to these instructions: "${userInstructions}"` }
        ];

        const generationPromises = effects.map(effect => generateProductOnlyImage(effect, aspectRatio));
        await Promise.allSettled(generationPromises);

        psGenerateBtn.disabled = false;
        psGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    }

    async function generateBoosterFotoshoot() {
        const originalBtnHTML = psGenerateBtn.innerHTML;
        psGenerateBtn.disabled = true;
        psGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Konsep...</span>`;
        
        const aspectRatio = psRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        psResultsContainer.classList.remove('hidden');
        psResultsContainer.classList.add('flex-grow', 'flex', 'flex-col'); 
        psResultsTitle.textContent = "10 Variasi Fotoshoot Super Kreatif";
        psResultsGrid.innerHTML = `<div class="col-span-1 sm:col-span-2 text-center p-4"><div class="loader-icon w-8 h-8 mx-auto"></div><p class="mt-2 text-sm text-gray-600">AI sedang merancang 10 konsep unik...</p></div>`;
        lucide.createIcons();

        try {
            const concepts = await getBoosterConcepts(aspectRatio);
            
            psGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Gambar (0/10)</span>`;
            psResultsGrid.innerHTML = ''; 
            for (let i = 0; i < concepts.length; i++) {
                const card = document.createElement('div');
                card.id = `ps-card-${i + 1}`;
                card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
                card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
                psResultsGrid.appendChild(card);
            }
             lucide.createIcons();

            const generationPromises = concepts.map((concept, index) => 
                generateProductOnlyImage({ id: index + 1, ...concept }, aspectRatio)
                .then(() => {
                    psGenerateBtn.querySelector('span').textContent = `Membuat Gambar (${index + 1}/10)`;
                })
            );
            await Promise.allSettled(generationPromises);

        } catch (error) {
            console.error("Error in booster mode:", error);
            psResultsGrid.innerHTML = `<div class="col-span-1 sm:col-span-2 text-center p-4 text-red-600"><p>Gagal membuat konsep: ${error.message}</p></div>`;
        } finally {
            psGenerateBtn.disabled = false;
            psGenerateBtn.innerHTML = originalBtnHTML;
            lucide.createIcons();
        }
    }

    
    async function getBoosterConcepts(aspectRatio) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
        const systemPrompt = `You are an elite creative director. Analyze the product image and generate 10 creative Fotoshoot concepts. Your response MUST be a valid JSON array of 10 objects, each with two keys: "name" (a short, catchy concept name in Indonesian) and "prompt" (a detailed English Fotography prompt for an AI, including the phrase "The final image MUST have an aspect ratio of ${aspectRatio}."). The concepts must be diverse and not include people.`;

        const payload = {
            contents: [{ parts: [{ text: "Analyze this product and generate 10 creative Fotoshoot concepts." }, { inlineData: { mimeType: psImageData.mimeType, data: psImageData.base64 } }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { 
                responseMimeType: "application/json",
                responseSchema: { type: "ARRAY", items: { type: "OBJECT", properties: { "name": { "type": "STRING" }, "prompt": { "type": "STRING" } }, required: ["name", "prompt"] } }
            }
        };
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));
        const result = await response.json();
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    }

    function showEditModal(imgSrc, imgTitle, cardId) {
        const bodyHTML = `
            <img src="${imgSrc}" class="w-full h-auto rounded-lg mb-4">
            <label for="edit-instruction" class="block mb-2 font-semibold">Instruksi Edit:</label>
            <textarea id="edit-instruction" class="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600" rows="3" placeholder="Contoh: ganti warna background menjadi biru..."></textarea>
            <button id="submit-edit-btn" class="mt-4 w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
                Edit Gambar
            </button>
        `;
        showContentModal(`Edit: ${imgTitle}`, bodyHTML);

        const submitEditBtn = document.getElementById('submit-edit-btn');
        submitEditBtn.addEventListener('click', async () => {
            const instruction = document.getElementById('edit-instruction').value.trim();
            if (!instruction) {
                document.getElementById('edit-instruction').focus();
                return;
            }

            submitEditBtn.disabled = true;
            submitEditBtn.innerHTML = '<div class="loader-icon loader-icon-light mx-auto"></div>';

            const parts = imgSrc.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const base64 = parts[1];
            const originalImageData = { base64, mimeType };

            try {
                const newBase64 = await generateEditedImage(originalImageData, instruction);
                const newImageUrl = `data:image/png;base64,${newBase64}`;
                
                const cardToUpdate = document.getElementById(cardId);
                if (cardToUpdate) {
                    const imgElement = cardToUpdate.querySelector('img');
                    const editBtnElement = cardToUpdate.querySelector('.ps-edit-btn');
                    const viewBtnElement = cardToUpdate.querySelector('.view-btn');
                    const downloadLinkElement = cardToUpdate.querySelector('.download-btn');
                    
                    if(imgElement) imgElement.src = newImageUrl;
                    if(editBtnElement) editBtnElement.dataset.imgSrc = newImageUrl;
                    if(viewBtnElement) viewBtnElement.dataset.imgSrc = newImageUrl;
                    if(downloadLinkElement) downloadLinkElement.href = newImageUrl;
                }
                hideModal();
            } catch (error) {
                console.error('Failed to edit image:', error);
                alert(`Gagal mengedit gambar: ${error.message}`);
                hideModal();
            }
        }, { once: true });
    }
    
    async function generateEditedImage(originalImageData, instruction) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
        const prompt = `Based on the original image, edit it according to the following instruction: "${instruction}". Keep the main subject and overall style intact, only applying the requested changes.`;
        
        const payload = {
            contents: [{ parts: [
                {text: prompt}, 
                {inlineData: { mimeType: originalImageData.mimeType, data: originalImageData.base64 }}
            ] }],
            generationConfig: { responseModalities: ['IMAGE'] }
        };
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));

        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        if (base64Data) {
            return base64Data;
        } else {
            throw new Error("Invalid response from API, no image data found.");
        }
    }

    const vtoProductUploadBox = document.getElementById('vto-product-upload-box');
    const vtoProductInput = document.getElementById('vto-product-input');
    const vtoProductPreview = document.getElementById('vto-product-preview');
    const vtoProductPlaceholder = document.getElementById('vto-product-placeholder');
    const vtoRemoveProductBtn = document.getElementById('vto-remove-product-btn');
    const vtoModelUploadBox = document.getElementById('vto-model-upload-box');
    const vtoModelInput = document.getElementById('vto-model-input');
    const vtoModelPreview = document.getElementById('vto-model-preview');
    const vtoModelPlaceholder = document.getElementById('vto-model-placeholder');
    const vtoRemoveModelBtn = document.getElementById('vto-remove-model-btn');
    const vtoRatioOptions = document.getElementById('vto-ratio-options');
    const vtoGenerateBtn = document.getElementById('vto-generate-btn');
    const vtoStatusMessage = document.getElementById('vto-status-message');
    const vtoResultsContainer = document.getElementById('vto-results-container');
    const vtoResultsGrid = document.getElementById('vto-results-grid');
    
    let vtoProductData = null;
    let vtoModelData = null;
    
    setupImageUpload(vtoProductInput, vtoProductUploadBox, (data) => {
        vtoProductData = data;
        vtoProductPreview.src = data.dataUrl;
        vtoProductPlaceholder.classList.add('hidden');
        vtoProductPreview.classList.remove('hidden');
        vtoRemoveProductBtn.classList.remove('hidden');
    });

    vtoRemoveProductBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        vtoProductData = null;
        vtoProductInput.value = '';
        vtoProductPreview.src = '#';
        vtoProductPreview.classList.add('hidden');
        vtoProductPlaceholder.classList.remove('hidden');
        vtoRemoveProductBtn.classList.add('hidden');

        document.getElementById('vto-results-placeholder').classList.remove('hidden');
        vtoResultsContainer.classList.add('hidden');
        vtoResultsContainer.querySelector('h2')?.classList.remove('hidden'); 
        vtoResultsGrid.innerHTML = '';
    });
    
    setupImageUpload(vtoModelInput, vtoModelUploadBox, (data) => {
        vtoModelData = data;
        vtoModelPreview.src = data.dataUrl;
        vtoModelPlaceholder.classList.add('hidden');
        vtoModelPreview.classList.remove('hidden');
        vtoRemoveModelBtn.classList.remove('hidden');
    });
     vtoRemoveModelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        vtoModelData = null;
        vtoModelInput.value = '';
        vtoModelPreview.src = '#';
        vtoModelPreview.classList.add('hidden');
        vtoModelPlaceholder.classList.remove('hidden');
        vtoRemoveModelBtn.classList.add('hidden');

        document.getElementById('vto-results-placeholder').classList.remove('hidden');
        vtoResultsContainer.classList.add('hidden');
        vtoResultsContainer.querySelector('h2')?.classList.remove('hidden'); 
        vtoResultsGrid.innerHTML = '';
    });

    setupOptionButtons(vtoRatioOptions);

    async function generateSingleVTOImage(id, product, model, aspectRatio) {
         const card = document.getElementById(`vto-card-${id}`);
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const prompt = `Using the product image (first image) and the model image (second image), create a new Fotorealistic image where the model is wearing or using the product. The result should be high-quality and look like a professional Fotoshoot. Preserve the model's appearance and the product's details. This is variation ${id}.`;
            
            const parts = [
                { text: prompt },
                { inlineData: { mimeType: product.mimeType, data: product.base64 } },
                { inlineData: { mimeType: model.mimeType, data: model.base64 } }
            ];
            
            const payload = { 
                contents: [{ parts: parts }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };
            
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (!base64Data) throw new Error("Tidak ada data gambar yang diterima dari AI.");
            
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="Fotoshoot_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } catch (error) {
            console.error(`Error for vto card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }

    vtoGenerateBtn.addEventListener('click', async () => {
        if (!vtoProductData || !vtoModelData) {
            vtoStatusMessage.textContent = 'Harap unggah Foto produk dan model terlebih dahulu.';
            return;
        }
        vtoStatusMessage.textContent = '';
        const originalBtnHTML = vtoGenerateBtn.innerHTML;
        vtoGenerateBtn.disabled = true;
        vtoGenerateBtn.innerHTML = '<div class="loader-icon !border-l-white w-5 h-5 mx-auto"></div>';
        
        const aspectRatio = vtoRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        document.getElementById('vto-results-placeholder').classList.add('hidden');
        const resultsTitle = vtoResultsContainer.querySelector('h2');
        if(resultsTitle) resultsTitle.classList.add('hidden');

        vtoResultsContainer.classList.remove('hidden');
        vtoResultsContainer.classList.add('flex');
        vtoResultsGrid.innerHTML = '';
        for(let i=1; i<=4; i++) {
            const card = document.createElement('div');
            card.id = `vto-card-${i}`;
            card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            vtoResultsGrid.appendChild(card);
        }
        lucide.createIcons();
        
        try {
            const generationPromises = [1,2,3,4].map(i => generateSingleVTOImage(i, vtoProductData, vtoModelData, aspectRatio));
            await Promise.allSettled(generationPromises);
        } catch (error) {
            console.error('Gagal generate gambar:', error);
            vtoStatusMessage.textContent = 'Maaf, terjadi kesalahan saat generate gambar. Coba lagi.';
        } finally {
            vtoGenerateBtn.disabled = false;
            vtoGenerateBtn.innerHTML = originalBtnHTML;
        }
    });

    const pwPerson1Input = document.getElementById('pw-person1-input');
    const pwPerson1UploadBox = document.getElementById('pw-person1-upload-box');
    const pwPerson1Preview = document.getElementById('pw-person1-preview');
    const pwPerson1Placeholder = document.getElementById('pw-person1-placeholder');
    const pwRemovePerson1Btn = document.getElementById('pw-remove-person1-btn');
    const pwPerson1Validation = document.getElementById('pw-person1-validation');
    const pwPerson2Input = document.getElementById('pw-person2-input');
    const pwPerson2UploadBox = document.getElementById('pw-person2-upload-box');
    const pwPerson2Preview = document.getElementById('pw-person2-preview');
    const pwPerson2Placeholder = document.getElementById('pw-person2-placeholder');
    const pwRemovePerson2Btn = document.getElementById('pw-remove-person2-btn');
    const pwPerson2Validation = document.getElementById('pw-person2-validation');
    const pwRefInput = document.getElementById('pw-ref-input');
    const pwRefUploadBox = document.getElementById('pw-ref-upload-box');
    const pwRefPreview = document.getElementById('pw-ref-preview');
    const pwRefPlaceholder = document.getElementById('pw-ref-placeholder');
    const pwRemoveRefBtn = document.getElementById('pw-remove-ref-btn');
    const pwTypeSelect = document.getElementById('pw-type-select');
    const pwPreweddingOptions = document.getElementById('pw-prewedding-options');
    const pwWeddingOptions = document.getElementById('pw-wedding-options');
    const pwStyleOptionsPrewedding = document.getElementById('pw-style-options-prewedding');
    const pwLocationOptionsPrewedding = document.getElementById('pw-location-options-prewedding');
    const pwStyleOptionsWedding = document.getElementById('pw-style-options-wedding');
    const pwLocationOptionsWedding = document.getElementById('pw-location-options-wedding');
    const pwWatermarkInput = document.getElementById('pw-watermark-input');
    const pwRatioOptions = document.getElementById('pw-ratio-options');
    const pwGenerateBtn = document.getElementById('pw-generate-btn');
    const pwResultsContainer = document.getElementById('pw-results-container');
    const pwResultsGrid = document.getElementById('pw-results-grid');

    let pwPerson1Data = { data: null, isValid: false };
    let pwPerson2Data = { data: null, isValid: false };
    let pwRefData = null;
    let pwSelectedInternational = null;

    function pwUpdateGenerateButtonState() {
        pwGenerateBtn.disabled = !(pwPerson1Data.isValid && pwPerson2Data.isValid);
    }

    setupImageUpload(pwPerson1Input, pwPerson1UploadBox, (data) => {
        pwPerson1Data.data = data;
        pwPerson1Preview.src = data.dataUrl;
        pwPerson1Placeholder.classList.add('hidden');
        pwPerson1Preview.classList.remove('hidden');
        pwRemovePerson1Btn.classList.remove('hidden');
        pwPerson1Data.isValid = true; 
        pwPerson1Validation.textContent = '%u2713 Foto valid';
        pwPerson1Validation.className = 'validation-status text-center text-green-600';
        pwUpdateGenerateButtonState();
    });

    pwRemovePerson1Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pwPerson1Data = { data: null, isValid: false };
        pwPerson1Input.value = '';
        pwPerson1Preview.src = '#';
        pwPerson1Preview.classList.add('hidden');
        pwPerson1Placeholder.classList.remove('hidden');
        pwRemovePerson1Btn.classList.add('hidden');
        pwPerson1Validation.textContent = '';
        pwUpdateGenerateButtonState();
        document.getElementById('pw-results-placeholder').classList.remove('hidden');
        pwResultsContainer.classList.add('hidden');
        pwResultsGrid.innerHTML = '';
    });

    setupImageUpload(pwPerson2Input, pwPerson2UploadBox, (data) => {
        pwPerson2Data.data = data;
        pwPerson2Preview.src = data.dataUrl;
        pwPerson2Placeholder.classList.add('hidden');
        pwPerson2Preview.classList.remove('hidden');
        pwRemovePerson2Btn.classList.remove('hidden');
        pwPerson2Data.isValid = true; 
        pwPerson2Validation.textContent = '%u2713 Foto valid';
        pwPerson2Validation.className = 'validation-status text-center text-green-600';
        pwUpdateGenerateButtonState();
    });

   pwRemovePerson2Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pwPerson2Data = { data: null, isValid: false };
        pwPerson2Input.value = '';
        pwPerson2Preview.src = '#';
        pwPerson2Preview.classList.add('hidden');
        pwPerson2Placeholder.classList.remove('hidden');
        pwRemovePerson2Btn.classList.add('hidden');
        pwPerson2Validation.textContent = '';
        pwUpdateGenerateButtonState();
        
        document.getElementById('pw-results-placeholder').classList.remove('hidden');
        pwResultsContainer.classList.add('hidden');
        pwResultsGrid.innerHTML = '';
    });
    
    setupImageUpload(pwRefInput, pwRefUploadBox, (data) => {
        pwRefData = data;
        pwRefPreview.src = data.dataUrl;
        pwRefPlaceholder.classList.add('hidden');
        pwRefPreview.classList.remove('hidden');
        pwRemoveRefBtn.classList.remove('hidden');
    });

    pwRemoveRefBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        pwRefData = null;
        pwRefInput.value = '';
        pwRefPreview.src = '#';
        pwRefPreview.classList.add('hidden');
        pwRefPlaceholder.classList.remove('hidden');
        pwRemoveRefBtn.classList.add('hidden');
    });

    function showInternationalStyleModal() {
        const internationalList = [
            'Korean Hanbok', 'Japanese Kimono', 'Indian Sari & Sherwani', 'Scottish Kilt & Gown', 
            'Chinese Qipao & Tang Suit', 'Moroccan Kaftan & Djellaba', 'Vietnamese Ao Dai', 'Thai Chut Thai', 
            'Western White Gown & Tuxedo', 'Nigerian Aso Oke', 'Ghanian Kente Cloth', 'Turkish Bindalli & Suit', 
            'Russian Sarafan & Kosovorotka', 'Mexican Charro Suit & China Poblana', 'Masai Shuka (Kenya/Tanzania)'
        ];

        const styleButtonsHTML = internationalList.map(style => 
            `<button class="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors international-choice-btn" data-value="${style}">${style}</button>`
        ).join('');
        
        const bodyHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${styleButtonsHTML}</div>`;
        showContentModal("Pilih Pakaian Pernikahan Internasional", bodyHTML);
        
        document.querySelectorAll('.international-choice-btn').forEach(button => {
            button.addEventListener('click', () => {
                pwSelectedInternational = button.dataset.value;
                const internationalBtn = document.getElementById('pw-international-btn');
                internationalBtn.innerHTML = `International (${pwSelectedInternational.split(' ')[0]})`;
                
                Array.from(pwStyleOptionsWedding.children).forEach(btn => btn.classList.remove('selected'));
                internationalBtn.classList.add('selected');
                
                hideModal();
            });
        });
    }
    
    pwStyleOptionsWedding.addEventListener('click', (e) => {
        const clickedButton = e.target.closest('button');
        if (clickedButton && pwStyleOptionsWedding.contains(clickedButton)) {
            if (clickedButton.id === 'pw-international-btn') {
                e.preventDefault();
                showInternationalStyleModal();
            } else {
                pwSelectedInternational = null;
                document.getElementById('pw-international-btn').textContent = 'International';
                Array.from(pwStyleOptionsWedding.children).forEach(btn => btn.classList.remove('selected'));
                clickedButton.classList.add('selected');
            }
        }
    });
    
    setupOptionButtons(pwStyleOptionsPrewedding);
    setupOptionButtons(pwLocationOptionsPrewedding);
    setupOptionButtons(pwLocationOptionsWedding);
    setupOptionButtons(pwRatioOptions);
    
    pwTypeSelect.addEventListener('change', () => {
        if (pwTypeSelect.value === 'wedding') {
            pwPreweddingOptions.classList.add('hidden');
            pwWeddingOptions.classList.remove('hidden');
        } else {
            pwPreweddingOptions.classList.remove('hidden');
            pwWeddingOptions.classList.add('hidden');
        }
    });
    
    pwGenerateBtn.addEventListener('click', async () => {
         const originalBtnHTML = pwGenerateBtn.innerHTML;
        pwGenerateBtn.disabled = true;
        pwGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Foto...</span>`;
        document.getElementById('pw-results-placeholder').classList.add('hidden');
        
        const aspectRatio = pwRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        pwResultsContainer.classList.remove('hidden');
        pwResultsGrid.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `pw-card-${i}`;
            card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            pwResultsGrid.appendChild(card);
        }
        lucide.createIcons();
        
        const generationPromises = [1,2,3,4].map(i => generateSinglePreWeddingImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        pwGenerateBtn.disabled = false;
        pwGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });

    async function refinePreWeddingFaces({ baseImage, person1Image, person2Image, aspectRatio }) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
        
        const prompt = `Refine the faces in the main image (first image). You are given two reference face images (second and third images).
        CRITICAL INSTRUCTION: You MUST replace the faces of the people in the main image with the exact faces from the reference images, ensuring a perfect, Fotorealistic match.
        ABSOLUTE RULE: DO NOT change anything else in the main image: the pose, clothing, background, lighting, and overall composition must remain identical to the main image. Only the faces should be perfected.`;

        const parts = [
            { text: prompt },
            { inlineData: { mimeType: baseImage.mimeType, data: baseImage.base64 } },
            { inlineData: { mimeType: person1Image.mimeType, data: person1Image.base64 } },
            { inlineData: { mimeType: person2Image.mimeType, data: person2Image.base64 } }
        ];

        const payload = {
            contents: [{ parts: parts }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: aspectRatio }
            }
        };
        
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`Face refinement failed: ${await getApiErrorMessage(response)}`);
        
        const result = await response.json();
        const refinedBase64 = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (!refinedBase64) {
            throw new Error("Gagal menyempurnakan wajah dari API.");
        }
        
        return refinedBase64;
    }

    async function generateSinglePreWeddingImage(id, aspectRatio) {
        const card = document.getElementById(`pw-card-${id}`);
        try {
            card.innerHTML = `<div class="text-center p-2"><div class="loader-icon w-8 h-8 mx-auto"></div><p class="text-xs mt-2 text-gray-600">Membuat konsep dasar...</p></div>`;
            lucide.createIcons();

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;

            const type = pwTypeSelect.value;
            let style, location;
            
            if (type === 'wedding') {
                style = pwStyleOptionsWedding.querySelector('.selected').dataset.value;
                location = pwLocationOptionsWedding.querySelector('.selected').dataset.value;
                if (style === 'International Attire' && pwSelectedInternational) {
                    style = `International Wedding Theme. The couple MUST wear authentic, traditional wedding attire from ${pwSelectedInternational}.`;
                }
            } else { 
                style = pwStyleOptionsPrewedding.querySelector('.selected').dataset.value;
                location = pwLocationOptionsPrewedding.querySelector('.selected').dataset.value;
            }

            const watermark = pwWatermarkInput.value.trim();
            const cameraShot = document.getElementById('pw-camera-select').value;

            let prompt = `Create a single, Fotorealistic ${type} Fotograph featuring the two individuals from the first two source images. CRITICAL: Preserve the exact facial identity and likeness of both individuals. Person A is from the first image, Person B from the second.
                - Scene: A romantic pose together.
                - Camera Shot: ${cameraShot}.
                - Location: ${location}.
                - Style: ${style}.
                - Quality: High-resolution, sharp, and flawlessly blended.`;

            if (watermark) prompt += `\n- Watermark: Add the text "${watermark}" subtly and elegantly in a corner.`;
            if (pwRefData) prompt += `\n- Reference: Use the third image provided as strong inspiration for style, color, and composition, but DO NOT copy its people.`;

            const parts = [{ text: prompt }];
            parts.push({ inlineData: { mimeType: pwPerson1Data.data.mimeType, data: pwPerson1Data.data.base64 } });
            parts.push({ inlineData: { mimeType: pwPerson2Data.data.mimeType, data: pwPerson2Data.data.base64 } });
            if (pwRefData) {
                parts.push({ inlineData: { mimeType: pwRefData.mimeType, data: pwRefData.base64 } });
            }
            
            const payload = { 
                contents: [{ parts: parts }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const initialResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!initialResponse.ok) throw new Error(`Initial generation failed: ${await getApiErrorMessage(initialResponse)}`);

            const initialResult = await initialResponse.json();
            const initialBase64Data = initialResult?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

            if (!initialBase64Data) {
                throw new Error("Gagal membuat gambar dasar dari API.");
            }

            card.innerHTML = `<div class="text-center p-2"><div class="loader-icon w-8 h-8 mx-auto"></div><p class="text-xs mt-2 text-gray-600">Menyempurnakan wajah...</p></div>`;
            lucide.createIcons();

            const refinedBase64Data = await refinePreWeddingFaces({
                baseImage: { base64: initialBase64Data, mimeType: 'image/png' },
                person1Image: pwPerson1Data.data,
                person2Image: pwPerson2Data.data,
                aspectRatio: aspectRatio
            });

            const imageUrl = `data:image/png;base64,${refinedBase64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                     <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar"><i data-lucide="eye" class="w-4 h-4"></i></button>
                    <a href="${imageUrl}" download="prewedding_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } catch (error) {
            console.error(`Error for pre-wedding card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }


    const mgPromptInput = document.getElementById('mg-prompt-input');
    const mgRandomBtn = document.getElementById('mg-random-btn');
    const mgGenerateBtn = document.getElementById('mg-generate-btn');
    const mgRatioOptions = document.getElementById('mg-ratio-options');
    const mgResultsContainer = document.getElementById('mg-results-container');
    const mgResultsGrid = document.getElementById('mg-results-grid');
    const mgSettingsDropdown = document.getElementById('mg-settings-dropdown');
    const mgTabCreate = document.getElementById('mg-tab-create');
    const mgTabRepose = document.getElementById('mg-tab-repose');
    const mgContentCreate = document.getElementById('mg-content-create');
    const mgContentRepose = document.getElementById('mg-content-repose');

    function switchModelTab(tabName) {
        const isActiveCreate = tabName === 'create';

        mgTabCreate.classList.toggle('active', isActiveCreate);
        mgTabRepose.classList.toggle('active', !isActiveCreate);

        mgContentCreate.classList.toggle('hidden', !isActiveCreate);
        mgContentRepose.classList.toggle('hidden', isActiveCreate);
    }

    mgTabCreate.addEventListener('click', () => switchModelTab('create'));
    mgTabRepose.addEventListener('click', () => switchModelTab('repose'));
    setupOptionButtons(mgRatioOptions);


    async function getRandomModelPromptFromAI() {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;

        const setting = mgSettingsDropdown.value;
        let settingInstruction = "";
        switch (setting) {
            case 'flat_bg':
                settingInstruction = " Pastikan latar belakangnya adalah latar studio yang polos atau flat berwarna netral.";
                break;
            case 'scenic_bg':
                settingInstruction = " Pastikan model berada di lokasi dengan background yang relevan dan menarik (bisa di dalam ruangan seperti kafe, studio, atau di luar ruangan seperti jalanan kota, taman).";
                break;
            case 'with_product':
                settingInstruction = " Pastikan model sedang memegang atau berinteraksi dengan sebuah produk generik yang tidak memiliki merek (contoh: smartphone, cangkir kopi, buku, tas tangan).";
                break;
        }

        const systemPrompt = `Anda adalah asisten kreatif. Buatkan satu deskripsi atau prompt yang detail dalam Bahasa Indonesia untuk menghasilkan Foto model yang Fotorealistis. Sertakan detail seperti etnis utamakan indonesia, gaya rambut, ekspresi, pakaian, dan gaya Fotografi.${settingInstruction} Jawab hanya dengan promptnya saja, tanpa teks pembuka atau penutup.`;
        
        const payload = {
            contents: [{ parts: [{ text: "Buatkan satu prompt acak untuk Foto model, sesuai dengan pengaturan yang diberikan." }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };
        
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

        if (!response.ok) throw new Error(await getApiErrorMessage(response));
        const result = await response.json();
        return result.candidates[0].content.parts[0].text.trim();
    }

    mgRandomBtn.addEventListener('click', async () => {
        const originalBtnHTML = mgRandomBtn.innerHTML;
        mgRandomBtn.disabled = true;
        mgRandomBtn.innerHTML = `<div class="loader-icon w-5 h-5"></div>`;
        lucide.createIcons();
        try {
            const randomPrompt = await getRandomModelPromptFromAI();
            mgPromptInput.value = randomPrompt;
        } catch (error) {
            console.error("Error generating random prompt:", error);
            mgPromptInput.value = `Gagal membuat prompt acak: ${error.message}`;
        } finally {
            mgRandomBtn.disabled = false;
            mgRandomBtn.innerHTML = originalBtnHTML;
             lucide.createIcons();
        }
    });

    mgGenerateBtn.addEventListener('click', async () => {
        const prompt = mgPromptInput.value.trim();
        if (!prompt) return;

        document.getElementById('mg-results-placeholder').classList.add('hidden');

        const aspectRatio = mgRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        mgResultsContainer.classList.remove('hidden');
        mgResultsGrid.innerHTML = '';
        mgGenerateBtn.disabled = true;
        mgGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Model...</span>`;

        for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `mg-card-${i}`;
            card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
            card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
            mgResultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = [1, 2, 3, 4].map(i => generateModelImage(i, prompt, aspectRatio));
        await Promise.allSettled(generationPromises);
        
        mgGenerateBtn.disabled = false;
        mgGenerateBtn.innerHTML = `<i data-lucide="sparkles" class="w-5 h-5 mr-2"></i><span>Buat 4 Foto Model</span>`;
        lucide.createIcons();
    });
    
   async function generateModelImage(id, userPrompt, aspectRatio) {
        const card = document.getElementById(`mg-card-${id}`);
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const finalPrompt = `${userPrompt}, Fotorealistic, 8k, high detail, professional Fotoshoot, sharp focus.`;

            const payload = {
                contents: [{
                    parts: [{ text: finalPrompt }]
                }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

            if (!base64Data) {
                throw new Error("No image data in API response.");
            }
            const imageUrl = `data:image/png;base64,${base64Data}`;
            
            card.innerHTML = `
                <img src="${imageUrl}" alt="Generated model" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="model_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                       <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
            lucide.createIcons();
        } catch (error) {
            console.error(`Error generating image for card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center flex flex-col items-center justify-center"><i data-lucide="alert-triangle" class="w-8 h-8 mb-2"></i><span class="break-all">Gagal: ${error.message}</span></div>`;
            lucide.createIcons();
        }
    }
    
    const cpUploadBox = document.getElementById('cp-upload-box');
    const cpImageInput = document.getElementById('cp-image-input');
    const cpPreview = document.getElementById('cp-preview');
    const cpPlaceholder = document.getElementById('cp-placeholder');
    const cpRemoveBtn = document.getElementById('cp-remove-btn');
    const cpPromptInput = document.getElementById('cp-prompt-input');
    const cpRatioOptions = document.getElementById('cp-ratio-options');
    const cpGenerateBtn = document.getElementById('cp-generate-btn');
    const cpResultsContainer = document.getElementById('cp-results-container');
    const cpResultsGrid = document.getElementById('cp-results-grid');

    let cpImageData = null;

    function cpUpdateButtons() {
        cpGenerateBtn.disabled = !cpImageData || cpPromptInput.value.trim() === '';
    }
    
    document.querySelectorAll('.cp-pose-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cpPromptInput.value = btn.querySelector('span').textContent;
            cpUpdateButtons();
        });
    });
    
    setupImageUpload(cpImageInput, cpUploadBox, (data) => {
        cpImageData = data;
        cpPreview.src = data.dataUrl;
        cpPlaceholder.classList.add('hidden');
        cpPreview.classList.remove('hidden');
        cpRemoveBtn.classList.remove('hidden');
        cpUpdateButtons();
    });

    cpRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cpImageData = null;
        cpImageInput.value = '';
        cpPreview.src = '#';
        cpPreview.classList.add('hidden');
        cpPlaceholder.classList.remove('hidden');
        cpRemoveBtn.classList.add('hidden');
        cpUpdateButtons();
        document.getElementById('cp-results-placeholder').classList.remove('hidden');
        cpResultsContainer.classList.add('hidden');
        cpResultsGrid.innerHTML = '';
    });
    
    cpPromptInput.addEventListener('input', cpUpdateButtons);
    setupOptionButtons(cpRatioOptions);
    
    cpGenerateBtn.addEventListener('click', async () => {
        const originalBtnHTML = cpGenerateBtn.innerHTML;
        cpGenerateBtn.disabled = true;
        cpGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Mengubah Pose...</span>`;
        
        document.getElementById('cp-results-placeholder').classList.add('hidden');

        const aspectRatio = cpRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        cpResultsContainer.classList.remove('hidden');
        cpResultsGrid.className = `grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6`;
        cpResultsGrid.innerHTML = '';

        for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `cp-card-${i}`;
            card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
            card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
            cpResultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = [1, 2, 3, 4].map(i => generateReposedImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        cpGenerateBtn.disabled = false;
        cpGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });


    async function generateReposedImage(id, aspectRatio) {
        const card = document.getElementById(`cp-card-${id}`);
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const prompt = `Recreate the person in this image but change their pose to "${cpPromptInput.value.trim()}". Maintain the same person, clothing, and background. This is variation ${id}.`;
            
            const payload = {
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: cpImageData.mimeType, data: cpImageData.base64 } }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            
            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

            if (base64Data) {
                const imageUrl = `data:image/png;base64,${base64Data}`;
                card.innerHTML = `
                    <img src="${imageUrl}" class="w-full h-full object-cover">
                    <div class="absolute bottom-2 right-2 flex gap-1">
                        <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <a href="${imageUrl}" download="pose_change_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </a>
                    </div>`;
                card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
                card.classList.add('relative');
            } else {
                throw new Error("Respon tidak valid dari API.");
            }
        } catch (error) {
            console.error(`Error for reposed card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }
    
    const sfTabBaby = document.getElementById('sf-tab-baby');
    const sfTabKids = document.getElementById('sf-tab-kids');
    const sfTabUmrah = document.getElementById('sf-tab-umrah');
    const sfTabPassport = document.getElementById('sf-tab-passport');
    const sfContentBaby = document.getElementById('sf-content-baby');
    const sfContentKids = document.getElementById('sf-content-kids');
    const sfContentUmrah = document.getElementById('sf-content-umrah');
    const sfContentPassport = document.getElementById('sf-content-passport');
    const sfPassportAttireOptions = document.getElementById('sf-passport-attire-options');
    const sfPassportSchoolContainer = document.getElementById('sf-passport-school-options-container');
    const sfPassportSchoolOptions = document.getElementById('sf-passport-school-options');

    function switchFotographerTab(tabName) {
        const tabs = {
            'baby': { btn: sfTabBaby, content: sfContentBaby },
            'kids': { btn: sfTabKids, content: sfContentKids },
            'umrah': { btn: sfTabUmrah, content: sfContentUmrah },
            'passport': { btn: sfTabPassport, content: sfContentPassport }
        };

        for (const key in tabs) {
            const isActive = (key === tabName);
            tabs[key].btn.classList.toggle('active', isActive);
            tabs[key].content.classList.toggle('hidden', !isActive);
        }
    }

    sfTabBaby.addEventListener('click', () => switchFotographerTab('baby'));
    sfTabKids.addEventListener('click', () => switchFotographerTab('kids'));
    sfTabUmrah.addEventListener('click', () => switchFotographerTab('umrah'));
    sfTabPassport.addEventListener('click', () => switchFotographerTab('passport'));

    async function validateImageContent(imageData, contentType, validationElement) {
         if (!imageData) {
            validationElement.textContent = '';
            return false;
        }
        validationElement.innerHTML = '<div class="loader-icon mx-auto"></div>';
        lucide.createIcons();
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
            const systemPrompt = `Analyze the image. Determine if the main subject is ${contentType}. Respond ONLY with "yes" or "no".`;
            const payload = {
                contents: [{ parts: [{ text: `Is this a Foto of ${contentType}?` }, { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            const result = await response.json();
            const answer = result.candidates[0].content.parts[0].text.trim().toLowerCase();
            
            if (answer.includes('yes')) {
                validationElement.textContent = '%u2713 Foto valid';
                validationElement.className = 'validation-status text-center text-green-600';
                return true;
            } else {
                validationElement.textContent = `%u2717 Harap unggah Foto ${contentType.replace('a ', '')}`;
                validationElement.className = 'validation-status text-center text-red-600';
                return false;
            }
        } catch (error) {
            console.error("Validation error:", error);
            validationElement.textContent = `Gagal validasi: ${error.message}`;
            validationElement.className = 'validation-status text-center text-red-600';
            return false;
        }
    }
    
    const sfBabyInput = document.getElementById('sf-baby-input');
    const sfBabyUploadBox = document.getElementById('sf-baby-upload-box');
    const sfBabyPreview = document.getElementById('sf-baby-preview');
    const sfBabyPlaceholder = document.getElementById('sf-baby-placeholder');
    const sfBabyRemoveBtn = document.getElementById('sf-baby-remove-btn');
    const sfBabyValidation = document.getElementById('sf-baby-validation');
    const sfBabyGenerateBtn = document.getElementById('sf-baby-generate-btn');
    const sfBabyThemeOptions = document.getElementById('sf-baby-theme-options');
    const sfBabyThemeCustomContainer = document.getElementById('sf-baby-theme-custom-container');
    
    let sfBabyData = { data: null, isValid: false };
    let sfBabyTooltipShown = false; 

    function sfBabyUpdateBtn() { sfBabyGenerateBtn.disabled = !sfBabyData.isValid; }

    setupImageUpload(sfBabyInput, sfBabyUploadBox, async (data) => {
        sfBabyData.data = data;
        sfBabyPreview.src = data.dataUrl;
        sfBabyPlaceholder.classList.add('hidden');
        sfBabyPreview.classList.remove('hidden');
        sfBabyRemoveBtn.classList.remove('hidden');
        sfBabyData.isValid = await validateImageContent(data, 'a baby', sfBabyValidation);
        sfBabyUpdateBtn();
        
        if (sfBabyData.isValid && !sfBabyTooltipShown) {
            const tooltip = document.getElementById('sf-baby-custom-tooltip');
            if (tooltip) {
                tooltip.classList.add('visible');
                setTimeout(() => {
                    tooltip.classList.remove('visible');
                }, 5000);
                sfBabyTooltipShown = true; 
            }
        }
    });

    sfBabyRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfBabyData = { data: null, isValid: false };
        sfBabyInput.value = '';
        sfBabyPreview.src = '#';
        sfBabyPreview.classList.add('hidden');
        sfBabyPlaceholder.classList.remove('hidden');
        sfBabyRemoveBtn.classList.add('hidden');
        sfBabyValidation.textContent = '';
        sfBabyUpdateBtn();
        sfBabyTooltipShown = false;
        document.getElementById('sf-baby-custom-tooltip').classList.remove('visible');
        
        document.getElementById('sf-baby-results-placeholder').classList.remove('hidden');
        document.getElementById('sf-baby-results-container').classList.add('hidden');
        document.getElementById('sf-baby-results-grid').innerHTML = '';
    });
    
    setupOptionButtons(document.getElementById('sf-baby-gender-options'));
    setupOptionButtons(sfBabyThemeOptions);
    setupOptionButtons(document.getElementById('sf-baby-ratio-options'));
    setupOptionButtons(document.getElementById('sf-baby-decor-options'), true);

    sfBabyThemeOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.dataset.value === 'Kustom') {
            sfBabyThemeCustomContainer.classList.remove('hidden');
            document.getElementById('sf-baby-theme-custom-input').focus();
        } else {
            sfBabyThemeCustomContainer.classList.add('hidden');
        }
    });
    
    sfBabyGenerateBtn.addEventListener('click', () => {
        document.getElementById('sf-baby-results-placeholder').classList.add('hidden');
        
        const gender = document.querySelector('#sf-baby-gender-options .selected').dataset.value;
        
        let theme = document.querySelector('#sf-baby-theme-options .selected').dataset.value;
        if (theme === 'Kustom') {
            const customThemeInput = document.getElementById('sf-baby-theme-custom-input');
            theme = customThemeInput.value.trim() || 'Studio Putih Minimalis dengan properti lucu';
        }

        const aspectRatio = document.querySelector('#sf-baby-ratio-options .selected').dataset.value;
        const name = document.getElementById('sf-baby-name').value.trim();
        const dob = document.getElementById('sf-baby-dob').value.trim();
        const decor = document.querySelector('#sf-baby-decor-options .selected');
        
        let prompt = `A professional studio Fotoshoot of the baby from the provided image. CRITICAL: Retain the baby's exact face and features. The baby is a ${gender}. The clothing, props, and overall theme should be suitable for a baby ${gender}.
        Theme: ${theme}. `;
        if(name) prompt += `Elegantly add the name "${name}" in a soft, beautiful font. `;
        if(dob) prompt += `Elegantly add the birth date "${dob}" in a soft, beautiful font. `;
        if(decor) prompt += `Include gentle decorations like flowers, soft pillows, or stuffed animals, fitting for a baby ${gender}. `;
        prompt += `The final image must be high-quality, Fotorealistic, and heartwarming.`;
        
        generateFotographerImage('baby', prompt, sfBabyData.data, aspectRatio);
    });
    
    const sfKidsInput = document.getElementById('sf-kids-input');
    const sfKidsUploadBox = document.getElementById('sf-kids-upload-box');
    const sfKidsPreview = document.getElementById('sf-kids-preview');
    const sfKidsPlaceholder = document.getElementById('sf-kids-placeholder');
    const sfKidsRemoveBtn = document.getElementById('sf-kids-remove-btn');
    const sfKidsValidation = document.getElementById('sf-kids-validation');
    const sfKidsGenerateBtn = document.getElementById('sf-kids-generate-btn');
    
    let sfKidsData = { data: null, isValid: false };

    function sfKidsUpdateBtn() { sfKidsGenerateBtn.disabled = !sfKidsData.isValid; }
    
    setupImageUpload(sfKidsInput, sfKidsUploadBox, async (data) => {
        sfKidsData.data = data;
        sfKidsPreview.src = data.dataUrl;
        sfKidsPlaceholder.classList.add('hidden');
        sfKidsPreview.classList.remove('hidden');
        sfKidsRemoveBtn.classList.remove('hidden');
        sfKidsData.isValid = await validateImageContent(data, 'a young child (not a baby or adult)', sfKidsValidation);
        sfKidsUpdateBtn();
    });
    sfKidsRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfKidsData = { data: null, isValid: false };
        sfKidsInput.value = '';
        sfKidsPreview.src = '#';
        sfKidsPreview.classList.add('hidden');
        sfKidsPlaceholder.classList.remove('hidden');
        sfKidsRemoveBtn.classList.add('hidden');
        sfKidsValidation.textContent = '';
        sfKidsUpdateBtn();
        
        document.getElementById('sf-kids-results-placeholder').classList.remove('hidden');
        document.getElementById('sf-kids-results-container').classList.add('hidden');
        document.getElementById('sf-kids-results-grid').innerHTML = '';
    });

    setupOptionButtons(document.getElementById('sf-kids-gender-options'));
    setupOptionButtons(document.getElementById('sf-kids-ratio-options'));
    setupOptionButtons(document.getElementById('sf-kids-style-options'));
    setupOptionButtons(document.getElementById('sf-kids-expression-options'));

    sfKidsGenerateBtn.addEventListener('click', () => {
        document.getElementById('sf-kids-results-placeholder').classList.add('hidden');
        const gender = document.querySelector('#sf-kids-gender-options .selected').dataset.value;
        const aspectRatio = document.querySelector('#sf-kids-ratio-options .selected').dataset.value;
        const style = document.querySelector('#sf-kids-style-options .selected').dataset.value;
        const expression = document.querySelector('#sf-kids-expression-options .selected').dataset.value;
        let prompt = `Create a professional Foto of the child from the image. CRITICAL: Preserve the child's exact face and features. The child is a ${gender}.
        Style: ${style}. The child should be posed and expressing: ${expression}. The background and clothing should match the chosen style. The final Foto should be high-quality and vibrant.`;
        generateFotographerImage('kids', prompt, sfKidsData.data, aspectRatio);
    });
    
    const sfUmrahInput = document.getElementById('sf-umrah-input');
    const sfUmrahUploadBox = document.getElementById('sf-umrah-upload-box');
    const sfUmrahPreview = document.getElementById('sf-umrah-preview');
    const sfUmrahPlaceholder = document.getElementById('sf-umrah-placeholder');
    const sfUmrahRemoveBtn = document.getElementById('sf-umrah-remove-btn');
    const sfUmrahValidation = document.getElementById('sf-umrah-validation');
    const sfUmrahGenerateBtn = document.getElementById('sf-umrah-generate-btn');
    
    let sfUmrahData = { data: null, isValid: false };

    function sfUmrahUpdateBtn() { sfUmrahGenerateBtn.disabled = !sfUmrahData.isValid; }

    setupImageUpload(sfUmrahInput, sfUmrahUploadBox, async (data) => {
       sfUmrahData.data = data;
        sfUmrahPreview.src = data.dataUrl;
        sfUmrahPlaceholder.classList.add('hidden');
        sfUmrahPreview.classList.remove('hidden');
        sfUmrahRemoveBtn.classList.remove('hidden');
        sfUmrahData.isValid = true; 
        sfUmrahValidation.textContent = '%u2713 Foto siap digunakan';
        sfUmrahValidation.className = 'validation-status text-center text-green-600';
        sfUmrahUpdateBtn();
    });

   sfUmrahRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfUmrahData = { data: null, isValid: false };
        sfUmrahInput.value = '';
        sfUmrahPreview.src = '#';
        sfUmrahPreview.classList.add('hidden');
        sfUmrahPlaceholder.classList.remove('hidden');
        sfUmrahRemoveBtn.classList.add('hidden');
        sfUmrahValidation.textContent = '';
        sfUmrahUpdateBtn();
        
        document.getElementById('sf-umrah-results-placeholder').classList.remove('hidden');
        document.getElementById('sf-umrah-results-container').classList.add('hidden');
        document.getElementById('sf-umrah-results-grid').innerHTML = '';
    });

    setupOptionButtons(document.getElementById('sf-umrah-gender-options'));
    setupOptionButtons(document.getElementById('sf-umrah-attire-options'));
    setupOptionButtons(document.getElementById('sf-umrah-ratio-options'));
    setupOptionButtons(document.getElementById('sf-umrah-theme-options'));

    sfUmrahGenerateBtn.addEventListener('click', () => {
        document.getElementById('sf-umrah-results-placeholder').classList.add('hidden');
        const gender = document.querySelector('#sf-umrah-gender-options .selected').dataset.value;
        const attire = document.querySelector('#sf-umrah-attire-options .selected').dataset.value;
        const aspectRatio = document.querySelector('#sf-umrah-ratio-options .selected').dataset.value;
        const theme = document.querySelector('#sf-umrah-theme-options .selected').dataset.value;
        let prompt = `Create a professional Foto of the person from the image, placed into an Umrah/Hajj setting. CRITICAL: Preserve the person's exact face and features. The person is a ${gender} and should be wearing ${attire}. Scene: ${theme}. The final Foto should be high-quality, realistic, and respectful.`;
        generateFotographerImage('umrah', prompt, sfUmrahData.data, aspectRatio);
    });

    const sfPassportInput = document.getElementById('sf-passport-input');
    const sfPassportUploadBox = document.getElementById('sf-passport-upload-box');
    const sfPassportPreview = document.getElementById('sf-passport-preview');
    const sfPassportPlaceholder = document.getElementById('sf-passport-placeholder');
    const sfPassportRemoveBtn = document.getElementById('sf-passport-remove-btn');
    const sfPassportValidation = document.getElementById('sf-passport-validation');
    const sfPassportGenerateBtn = document.getElementById('sf-passport-generate-btn');
    const sfPassportCustomAttireContainer = document.getElementById('sf-passport-custom-attire-container');
    const sfPassportCustomAttireRefInput = document.getElementById('sf-passport-custom-attire-ref-input');
    const sfPassportCustomAttireRefUploadBox = document.getElementById('sf-passport-custom-attire-ref-upload-box');
    const sfPassportCustomAttireRefPreview = document.getElementById('sf-passport-custom-attire-ref-preview');
    const sfPassportCustomAttireRefPlaceholder = document.getElementById('sf-passport-custom-attire-ref-placeholder');
    const sfPassportCustomAttireRefRemoveBtn = document.getElementById('sf-passport-custom-attire-ref-remove-btn');

    let sfPassportData = { data: null, isValid: false };
    let sfPassportCustomRefData = null; 

    function sfPassportUpdateBtn() { sfPassportGenerateBtn.disabled = !sfPassportData.isValid; }
    
    setupImageUpload(sfPassportInput, sfPassportUploadBox, async (data) => {
        sfPassportData.data = data;
        sfPassportPreview.src = data.dataUrl;
        sfPassportPlaceholder.classList.add('hidden');
        sfPassportPreview.classList.remove('hidden');
        sfPassportRemoveBtn.classList.remove('hidden');
        sfPassportData.isValid = await validateImageContent(data, 'a clear, front-facing portrait of a person', sfPassportValidation);
        sfPassportUpdateBtn();
    });
    sfPassportRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfPassportData = { data: null, isValid: false };
        sfPassportInput.value = '';
        sfPassportPreview.src = '#';
        sfPassportPreview.classList.add('hidden');
        sfPassportPlaceholder.classList.remove('hidden');
        sfPassportRemoveBtn.classList.add('hidden');
        sfPassportValidation.textContent = '';
        sfPassportUpdateBtn();
        document.getElementById('sf-passport-results-placeholder').classList.remove('hidden');
        document.getElementById('sf-passport-results-container').classList.add('hidden');
        document.getElementById('sf-passport-results-grid').innerHTML = '';
    });
    
    setupOptionButtons(document.getElementById('sf-passport-bg-options'));
    setupOptionButtons(sfPassportAttireOptions);
    setupOptionButtons(sfPassportSchoolOptions);
    setupOptionButtons(document.getElementById('sf-passport-size-options'));

    sfPassportAttireOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if(!button) return;

        if (button.dataset.value === 'Sekolah') {
            sfPassportSchoolContainer.classList.remove('hidden');
        } else {
            sfPassportSchoolContainer.classList.add('hidden');
        }
        
        if (button.dataset.value === 'Kustom') {
            sfPassportCustomAttireContainer.classList.remove('hidden');
        } else {
            sfPassportCustomAttireContainer.classList.add('hidden');
        }
    });

    setupImageUpload(sfPassportCustomAttireRefInput, sfPassportCustomAttireRefUploadBox, (data) => {
        sfPassportCustomRefData = data;
        sfPassportCustomAttireRefPreview.src = data.dataUrl;
        sfPassportCustomAttireRefPlaceholder.classList.add('hidden');
        sfPassportCustomAttireRefPreview.classList.remove('hidden');
        sfPassportCustomAttireRefRemoveBtn.classList.remove('hidden');
    });

    sfPassportCustomAttireRefRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sfPassportCustomRefData = null;
        sfPassportCustomAttireRefInput.value = '';
        sfPassportCustomAttireRefPreview.src = '#';
        sfPassportCustomAttireRefPreview.classList.add('hidden');
        sfPassportCustomAttireRefPlaceholder.classList.remove('hidden');
        sfPassportCustomAttireRefRemoveBtn.classList.add('hidden');
    });

    sfPassportGenerateBtn.addEventListener('click', () => {
        document.getElementById('sf-passport-results-placeholder').classList.add('hidden');
        const background = document.querySelector('#sf-passport-bg-options .selected').dataset.value;
        let attire = document.querySelector('#sf-passport-attire-options .selected').dataset.value;
        
        let size = document.querySelector('#sf-passport-size-options .selected').dataset.value;
        const aspectRatioForApi = (size === '2:3' || size === '4:6') ? '3:4' : size;
        
        let customRefDataForApi = null;

        if (attire === 'Sekolah') {
            const schoolLevel = document.querySelector('#sf-passport-school-options .selected').dataset.value;
            attire = `Ganti dengan seragam sekolah ${schoolLevel} khas Indonesia`;
        } else if (attire === 'Kustom') {
            const customText = document.getElementById('sf-passport-custom-attire-input').value.trim();
            if (sfPassportCustomRefData) {
                attire = `Ganti dengan pakaian yang sangat mirip dengan gambar referensi pakaian (gambar ketiga).`;
                if (customText) {
                    attire += ` Deskripsi tambahan: ${customText}.`;
                }
                customRefDataForApi = sfPassportCustomRefData;
            } else if (customText) {
                attire = `Ganti dengan pakaian berikut: ${customText}.`;
            } else {
                attire = 'Ganti dengan pakaian formal standar (kemeja putih).';
            }
        } else {
            attire = `Ganti dengan ${attire}`;
        }

        let prompt = `Create a formal passport Foto using the person from the image. CRITICAL: Do not alter the person's face. 
        Background: Replace the background with a solid ${background} color.
        Clothing: ${attire}.
        The final image must be a clear, front-facing headshot with professional lighting.`;

        generateFotographerImage('passport', prompt, sfPassportData.data, aspectRatioForApi, customRefDataForApi);
    });
    
    async function generateFotographerImage(type, prompt, imageData, aspectRatio, refImageData = null) {
        const resultsContainer = document.getElementById(`sf-${type}-results-container`);
        const resultsGrid = document.getElementById(`sf-${type}-results-grid`);
        const generateBtn = document.getElementById(`sf-${type}-generate-btn`);

        const originalBtnHTML = generateBtn.innerHTML;
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Foto...</span>`;

        const aspectClass = getAspectRatioClass(aspectRatio);
        resultsContainer.classList.remove('hidden');
        resultsGrid.innerHTML = '';
        
        const numVariations = 4; 

        for (let i = 1; i <= numVariations; i++) {
            const card = document.createElement('div');
            card.id = `sf-${type}-card-${i}`;
            card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
            card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
            resultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = Array.from({ length: numVariations }, (_, i) => 
            generateSingleSFImage(i + 1, type, prompt, imageData, aspectRatio, refImageData)
        );
        await Promise.allSettled(generationPromises);

        generateBtn.disabled = false;
        generateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    }

    async function generateSingleSFImage(id, type, prompt, imageData, aspectRatio, refImageData = null) {
        const card = document.getElementById(`sf-${type}-card-${id}`);
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const finalPrompt = `${prompt} This is variation number ${id}.`;
            
            const parts = [{ text: finalPrompt }, { inlineData: { mimeType: imageData.mimeType, data: imageData.base64 } }];
            if (refImageData) {
                parts.push({ inlineData: { mimeType: refImageData.mimeType, data: refImageData.base64 } });
            }
            
            const payload = {
                contents: [{ parts: parts }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            
            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (base64Data) {
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="${type}_Foto_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } else {
            throw new Error("Respon tidak valid dari API.");
        }
    } catch (error) {
        console.error(`Error for SF card ${type}-${id}:`, error);
        card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
    } finally {
        lucide.createIcons();
    }
}


const pfImageInput = document.getElementById('pf-image-input');
const pfUploadBox = document.getElementById('pf-upload-box');
const pfPreview = document.getElementById('pf-preview');
const pfPlaceholder = document.getElementById('pf-placeholder');
const pfRemoveBtn = document.getElementById('pf-remove-btn');
const pfRatioOptions = document.getElementById('pf-ratio-options');
const pfGenerateBtn = document.getElementById('pf-generate-btn');
const pfResultsContainer = document.getElementById('pf-results-container');
const pfResultsGrid = document.getElementById('pf-results-grid');

let pfImageData = null;

function pfUpdateButtons() {
    pfGenerateBtn.disabled = !pfImageData;
}

setupImageUpload(pfImageInput, pfUploadBox, setPfImage);

pfRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        pfImageData = null;
        pfImageInput.value = '';
        pfPreview.src = '#';
        pfPreview.classList.add('hidden');
        pfPlaceholder.classList.remove('hidden');
        pfRemoveBtn.classList.add('hidden');
        pfUpdateButtons();
        
        document.getElementById('pf-results-placeholder').classList.remove('hidden');
        pfResultsContainer.classList.add('hidden');
        pfResultsGrid.innerHTML = '';
    });

setupOptionButtons(pfRatioOptions);

const pfModeEnhance = document.getElementById('pf-mode-enhance');
const pfModeRestore = document.getElementById('pf-mode-restore');
window.pfCurrentMode = 'enhance'; // 'enhance' or 'restore' - expose as window property

window.updatePfModeUI = function() {
    // Check if elements exist before trying to access them
    if (!pfModeEnhance || !pfModeRestore || !pfGenerateBtn) return;
    
    if (window.pfCurrentMode === 'enhance') {
        pfModeEnhance.classList.remove('bg-transparent', 'text-gray-500');
        pfModeEnhance.classList.add('bg-white', 'shadow-sm', 'text-teal-600', 'font-semibold');
        pfModeRestore.classList.remove('bg-white', 'shadow-sm', 'text-teal-600', 'font-semibold');
        pfModeRestore.classList.add('bg-transparent', 'text-gray-500', 'font-medium');
        pfGenerateBtn.querySelector('span').textContent = 'Perbaiki & Buat 4 Variasi';
    } else {
        pfModeRestore.classList.remove('bg-transparent', 'text-gray-500', 'font-medium');
        pfModeRestore.classList.add('bg-white', 'shadow-sm', 'text-teal-600', 'font-semibold');
        pfModeEnhance.classList.remove('bg-white', 'shadow-sm', 'text-teal-600', 'font-semibold');
        pfModeEnhance.classList.add('bg-transparent', 'text-gray-500', 'font-medium');
        pfGenerateBtn.querySelector('span').textContent = 'Pulihkan & Buat 4 Variasi';
    }
};

if (pfModeEnhance) {
    pfModeEnhance.addEventListener('click', () => {
        window.pfCurrentMode = 'enhance';
        window.updatePfModeUI();
    });
}

if (pfModeRestore) {
    pfModeRestore.addEventListener('click', () => {
        window.pfCurrentMode = 'restore';
        window.updatePfModeUI();
    });
}

pfGenerateBtn.addEventListener('click', async () => {
    const originalBtnHTML = pfGenerateBtn.innerHTML;
    pfGenerateBtn.disabled = true;
    pfGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">${window.pfCurrentMode === 'restore' ? 'Merestorasi...' : 'Memperbaiki...'}</span>`;

    document.getElementById('pf-results-placeholder').classList.add('hidden');

    const aspectRatio = pfRatioOptions.querySelector('.selected').dataset.value;
    const aspectClass = getAspectRatioClass(aspectRatio);

    pfResultsContainer.classList.remove('hidden');
    pfResultsGrid.className = `grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6`;
    pfResultsGrid.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const card = document.createElement('div');
        card.id = `pf-card-${i}`;
        card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
        card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
        pfResultsGrid.appendChild(card);
    }
    lucide.createIcons();

    const generationPromises = [1, 2, 3, 4].map(i => generateEnhancedImage(i, aspectRatio));
    await Promise.allSettled(generationPromises);

    pfGenerateBtn.disabled = false;
    pfGenerateBtn.innerHTML = originalBtnHTML;
    lucide.createIcons();
});

async function generateEnhancedImage(id, aspectRatio) {
    const card = document.getElementById(`pf-card-${id}`);
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;

        let prompt;
        if (window.pfCurrentMode === 'restore') {
            prompt = `Restore this old, damaged, or black and white photo. Fix scratches, tears, and noise. Colorize it naturally and historically accurately. Sharpen details and improve resolution. High quality restoration. This is variation ${id}.`;
        } else {
            prompt = `Enhance this image to professional studio portrait quality. Improve lighting, sharpness, and color balance. Make it look like a high-resolution Fotograph. This is variation ${id}.`;
        }

        const payload = {
            contents: [{ parts: [{text: prompt}, {inlineData: { mimeType: pfImageData.mimeType, data: pfImageData.base64 }}] }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: aspectRatio }
            }
        };

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));

        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (base64Data) {
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="${pfCurrentMode}_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } else {
            throw new Error("Respon tidak valid dari API.");
        }
    } catch (error) {
        console.error(`Error for enhanced Foto card ${id}:`, error);
        card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
    } finally {
        lucide.createIcons();
    }
}

// --- Magic Expander Feature ---
const meImageInput = document.getElementById('me-image-input');
const meUploadBox = document.getElementById('me-upload-box');
const mePreview = document.getElementById('me-preview');
const mePlaceholder = document.getElementById('me-placeholder');
const meRemoveBtn = document.getElementById('me-remove-btn');
const meGenerateBtn = document.getElementById('me-generate-btn');
const meRatioOptions = document.getElementById('me-ratio-options');
const meResultsContainer = document.getElementById('me-results-container');
const meResultsGrid = document.getElementById('me-results-grid');

let meImageData = null;

setupImageUpload(meImageInput, meUploadBox, (data) => {
    meImageData = data;
    mePreview.src = data.dataUrl;
    mePlaceholder.classList.add('hidden');
    mePreview.classList.remove('hidden');
    meRemoveBtn.classList.remove('hidden');
    meGenerateBtn.disabled = false;
});

meRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    meImageData = null;
    meImageInput.value = '';
    mePreview.src = '#';
    mePreview.classList.add('hidden');
    mePlaceholder.classList.remove('hidden');
    meRemoveBtn.classList.add('hidden');
    meGenerateBtn.disabled = true;
    document.getElementById('me-results-placeholder').classList.remove('hidden');
    meResultsContainer.classList.add('hidden');
    meResultsGrid.innerHTML = '';
});

setupOptionButtons(meRatioOptions);

meGenerateBtn.addEventListener('click', async () => {
    const originalBtnHTML = meGenerateBtn.innerHTML;
    meGenerateBtn.disabled = true;
    meGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Memperluas...</span>`;
    
    document.getElementById('me-results-placeholder').classList.add('hidden');
    const aspectRatio = meRatioOptions.querySelector('.selected').dataset.value;
    const aspectClass = getAspectRatioClass(aspectRatio);

    meResultsContainer.classList.remove('hidden');
    meResultsGrid.className = `grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6`;
    meResultsGrid.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const card = document.createElement('div');
        card.id = `me-card-${i}`;
        card.className = `card overflow-hidden transition-all ${aspectClass} bg-gray-100 flex items-center justify-center`;
        card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
        meResultsGrid.appendChild(card);
    }
    lucide.createIcons();

    const generationPromises = [1, 2, 3, 4].map(i => generateExpandedImage(i, aspectRatio));
    await Promise.allSettled(generationPromises);

    meGenerateBtn.disabled = false;
    meGenerateBtn.innerHTML = originalBtnHTML;
    lucide.createIcons();
});

async function generateExpandedImage(id, aspectRatio) {
    const card = document.getElementById(`me-card-${id}`);
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
        const prompt = `Expand this image to aspect ratio ${aspectRatio}. Fill the surrounding space seamlessly matching the original background context, lighting, and style. Do not crop the original subject. This is variation ${id}.`;
        
        const payload = {
            contents: [{ parts: [{text: prompt}, {inlineData: { mimeType: meImageData.mimeType, data: meImageData.base64 }}] }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: aspectRatio }
            }
        };

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));

        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (base64Data) {
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="expand_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } else {
            throw new Error("Respon tidak valid dari API.");
        }
    } catch (error) {
        card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
    } finally {
        lucide.createIcons();
    }
}

// --- Sticker Maker Feature ---
const smImageInput = document.getElementById('sm-image-input');
const smUploadBox = document.getElementById('sm-upload-box');
const smPreview = document.getElementById('sm-preview');
const smPlaceholder = document.getElementById('sm-placeholder');
const smRemoveBtn = document.getElementById('sm-remove-btn');
const smGenerateBtn = document.getElementById('sm-generate-btn');
const smStyleOptions = document.getElementById('sm-style-options');
const smTextInput = document.getElementById('sm-text-input');
const smResultsContainer = document.getElementById('sm-results-container');
const smResultsGrid = document.getElementById('sm-results-grid');

let smImageData = null;

setupImageUpload(smImageInput, smUploadBox, (data) => {
    smImageData = data;
    smPreview.src = data.dataUrl;
    smPlaceholder.classList.add('hidden');
    smPreview.classList.remove('hidden');
    smRemoveBtn.classList.remove('hidden');
    smGenerateBtn.disabled = false;
});

smRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    smImageData = null;
    smImageInput.value = '';
    smPreview.src = '#';
    smPreview.classList.add('hidden');
    smPlaceholder.classList.remove('hidden');
    smRemoveBtn.classList.add('hidden');
    smGenerateBtn.disabled = true;
    document.getElementById('sm-results-placeholder').classList.remove('hidden');
    smResultsContainer.classList.add('hidden');
    smResultsGrid.innerHTML = '';
});

setupOptionButtons(smStyleOptions);

smGenerateBtn.addEventListener('click', async () => {
    const originalBtnHTML = smGenerateBtn.innerHTML;
    smGenerateBtn.disabled = true;
    smGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Stiker...</span>`;
    
    document.getElementById('sm-results-placeholder').classList.add('hidden');
    const style = smStyleOptions.querySelector('.selected').dataset.value;
    const customText = smTextInput.value.trim();

    smResultsContainer.classList.remove('hidden');
    smResultsGrid.className = `grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6`;
    smResultsGrid.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const card = document.createElement('div');
        card.id = `sm-card-${i}`;
        card.className = `card overflow-hidden transition-all aspect-square bg-gray-100 flex items-center justify-center`;
        card.innerHTML = `<div class="loader-icon w-10 h-10"></div>`;
        smResultsGrid.appendChild(card);
    }
    lucide.createIcons();

    const generationPromises = [1, 2, 3, 4].map(i => generateStickerImage(i, style, customText));
    await Promise.allSettled(generationPromises);

    smGenerateBtn.disabled = false;
    smGenerateBtn.innerHTML = originalBtnHTML;
    lucide.createIcons();
});

async function generateStickerImage(id, style, customText = '') {
    const card = document.getElementById(`sm-card-${id}`);
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
        
        // Build prompt based on whether text is provided
        let prompt = `Create a ${style} die-cut sticker design based on the subject of this image.
        - Background: Pure white (#FFFFFF).
        - Border: Add a thick white die-cut border around the subject.
        - Style: ${style}, expressive, colorful, vector-like quality.`;
        
        if (customText) {
            prompt += `\n- TEXT: Include the text "${customText}" in a creative, eye-catching way that fits the sticker design. Use bold, fun typography that matches the ${style} style. The text should be prominent and well-integrated into the design.`;
        }
        
        prompt += `\n- This is variation ${id}.`;
        
        const payload = {
            contents: [{ parts: [{text: prompt}, {inlineData: { mimeType: smImageData.mimeType, data: smImageData.base64 }}] }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: '1:1' }
            }
        };

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));

        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (base64Data) {
            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-contain p-4">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <a href="${imageUrl}" download="sticker_${customText ? customText.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'sticker'}_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');
        } else {
            throw new Error("Respon tidak valid dari API.");
        }
    } catch (error) {
        card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
    } finally {
        lucide.createIcons();
    }
}



 const stiImageInput = document.getElementById('sti-image-input');
    const stiUploadBox = document.getElementById('sti-upload-box');
    const stiPreview = document.getElementById('sti-preview');
    const stiPlaceholder = document.getElementById('sti-placeholder');
    const stiRemoveBtn = document.getElementById('sti-remove-btn');
    const stiPurposeOptions = document.getElementById('sti-purpose-options');
    const stiCustomPurposeContainer = document.getElementById('sti-custom-purpose-container');
    const stiCustomPurposeInput = document.getElementById('sti-custom-purpose-input');
    const stiPromptInput = document.getElementById('sti-prompt-input');
    const stiMagicPromptBtn = document.getElementById('sti-magic-prompt-btn');
    const stiRatioOptions = document.getElementById('sti-ratio-options');
    const stiGenerateBtn = document.getElementById('sti-generate-btn');
    const stiResultsContainer = document.getElementById('sti-results-container');
    const stiResultsGrid = document.getElementById('sti-results-grid');

    let stiImageData = null;

    function stiUpdateButtons() {
        const hasImage = !!stiImageData;
        stiGenerateBtn.disabled = !hasImage;
        stiMagicPromptBtn.disabled = !hasImage;
    }

    setupImageUpload(stiImageInput, stiUploadBox, (data) => {
        stiImageData = data;
        stiPreview.src = data.dataUrl;
        stiPlaceholder.classList.add('hidden');
        stiPreview.classList.remove('hidden');
        stiRemoveBtn.classList.remove('hidden');
        stiUpdateButtons();
    });

    stiRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stiImageData = null;
        stiImageInput.value = '';
        stiPreview.src = '#';
        stiPreview.classList.add('hidden');
        stiPlaceholder.classList.remove('hidden');
        stiRemoveBtn.classList.add('hidden');
        
        document.getElementById('sti-results-placeholder').classList.remove('hidden');
        stiResultsContainer.classList.add('hidden');
        stiResultsGrid.innerHTML = '';
        
        stiUpdateButtons();
    });

    setupOptionButtons(stiPurposeOptions);
    stiPurposeOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.value === 'Kustom') {
            stiCustomPurposeContainer.classList.remove('hidden');
            stiCustomPurposeInput.focus();
        } else if (button) {
            stiCustomPurposeContainer.classList.add('hidden');
        }
    });
    
    setupOptionButtons(stiRatioOptions);

    stiMagicPromptBtn.addEventListener('click', async () => {
        const originalBtnHTML = stiMagicPromptBtn.innerHTML;
        stiMagicPromptBtn.disabled = true;
        stiMagicPromptBtn.innerHTML = `<div class="loader-icon w-5 h-5"></div>`;
        try {
            let purpose = stiPurposeOptions.querySelector('.selected').dataset.value;
            if (purpose === 'Kustom') {
                purpose = stiCustomPurposeInput.value.trim() || 'sebuah gambar yang indah';
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
            const systemPrompt = `You are a creative assistant. Analyze the user's sketch and their stated goal ("tujuan"). Based on both, write a concise, descriptive prompt in Indonesian for an AI image generator to turn the sketch into a finished image. Include details about style, color, and mood, wihtout rasio. Respond ONLY with the prompt text.`;
            const userQuery = `Analisis sketsa ini. Tujuannya adalah untuk membuat: ${purpose}.`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }, { inlineData: { mimeType: stiImageData.mimeType, data: stiImageData.base64 } }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            
            const result = await response.json();
            stiPromptInput.value = result.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error("Error generating magic prompt for sketch:", error);
            stiPromptInput.value = `Gagal membuat instruksi: ${error.message}`;
        } finally {
            stiMagicPromptBtn.innerHTML = originalBtnHTML;
            stiMagicPromptBtn.disabled = false;
        }
    });

    stiGenerateBtn.addEventListener('click', async () => {
        const originalBtnHTML = stiGenerateBtn.innerHTML;
        stiGenerateBtn.disabled = true;
        stiGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Menggambar...</span>`;

        document.getElementById('sti-results-placeholder').classList.add('hidden');

        const aspectRatio = stiRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        stiResultsContainer.classList.remove('hidden');
        stiResultsGrid.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `sti-card-${i}`;
            card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            stiResultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = [1, 2, 3, 4].map(i => generateSingleSketchImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        stiGenerateBtn.disabled = false;
        stiGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });

    async function generateSingleSketchImage(id, aspectRatio) {
        const card = document.getElementById(`sti-card-${id}`);
        try {
            let purpose = stiPurposeOptions.querySelector('.selected').dataset.value;
            if (purpose === 'Kustom') {
                purpose = stiCustomPurposeInput.value.trim() || 'sebuah gambar yang indah';
            }
            const instruction = stiPromptInput.value.trim();
            
            let finalPrompt = `Transform the provided sketch into a finished, high-quality, professional image. The composition and main subject of the sketch MUST be followed.
            - The intended final purpose is: "${purpose}".
            - Additional user instructions: "${instruction}".
            - The result should be Fotorealistic, detailed, and visually stunning. This is variation number ${id}.`;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const payload = {
                contents: [{ parts: [{ text: finalPrompt }, { inlineData: { mimeType: stiImageData.mimeType, data: stiImageData.base64 } }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (!base64Data) throw new Error("No image data received from API.");

            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar"><i data-lucide="eye" class="w-4 h-4"></i></button>
                    <a href="${imageUrl}" download="hasil_sketsa_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');

        } catch (error) {
            console.error(`Error for sketch-to-image card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }

    
    const akImageInput = document.getElementById('ak-image-input');
    const akUploadBox = document.getElementById('ak-upload-box');
    const akPreview = document.getElementById('ak-preview');
    const akPlaceholder = document.getElementById('ak-placeholder');
    const akRemoveBtn = document.getElementById('ak-remove-btn');
    const akTypeOptions = document.getElementById('ak-type-options');
    const akStyleOptions = document.getElementById('ak-style-options');
    const akCustomStyleContainer = document.getElementById('ak-custom-style-container');
    const akCustomStyleInput = document.getElementById('ak-custom-style-input');
    const akPromptInput = document.getElementById('ak-prompt-input');
    const akMagicPromptBtn = document.getElementById('ak-magic-prompt-btn');
    const akRatioOptions = document.getElementById('ak-ratio-options');
    const akGenerateBtn = document.getElementById('ak-generate-btn');
    const akResultsContainer = document.getElementById('ak-results-container');
    const akResultsGrid = document.getElementById('ak-results-grid');

    let akImageData = null;

    function akUpdateButtons() {
        akGenerateBtn.disabled = !akImageData;
        akMagicPromptBtn.disabled = !akImageData;
    }

    setupImageUpload(akImageInput, akUploadBox, (data) => {
        akImageData = data;
        akPreview.src = data.dataUrl;
        akPlaceholder.classList.add('hidden');
        akPreview.classList.remove('hidden');
        akRemoveBtn.classList.remove('hidden');
        akUpdateButtons();
    });

    akRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        akImageData = null;
        akImageInput.value = '';
        akPreview.src = '#';
        akPreview.classList.add('hidden');
        akPlaceholder.classList.remove('hidden');
        akRemoveBtn.classList.add('hidden');
        document.getElementById('ak-results-placeholder').classList.remove('hidden');
        akResultsContainer.classList.add('hidden');
        akResultsGrid.innerHTML = '';
        akUpdateButtons();
    });

    const artStyles = [
        { label: 'Cat Air', value: 'Lukisan Cat Air (Watercolor)' },
        { label: 'Impresionis', value: 'Lukisan Impresionisme' },
        { label: 'Digital Art', value: 'Seni Digital Fotorealistis' },
        { label: 'Lukisan Minyak', value: 'Lukisan Cat Minyak Klasik' },
        { label: 'Sketsa Pensil', value: 'Sketsa Pensil Hitam Putih' },
        { label: 'Kustom', value: 'Kustom' }
    ];

    const caricatureStyles = [
        { label: '3D Kartun', value: 'Gaya Kartun 3D Pixar' },
        { label: 'Anime', value: 'Gaya Anime Jepang' },
        { label: 'Stiker Lucu', value: 'Stiker Chibi yang Menggemaskan' },
        { label: 'Komik US', value: 'Gaya Komik Amerika' },
        { label: 'Klasik', value: 'Karikatur Klasik dengan Kepala Besar' },
        { label: 'Kustom', value: 'Kustom' }
    ];

    function renderAkStyles(type) {
        const styles = type === 'art' ? artStyles : caricatureStyles;
        akStyleOptions.innerHTML = styles.map((style, index) => `
            <button data-value="${style.value}" class="option-btn ${index === 0 ? 'selected' : ''} justify-center">${style.label}</button>
        `).join('');
        
        setupOptionButtons(akStyleOptions);
        akCustomStyleContainer.classList.add('hidden');
    }

    setupOptionButtons(akTypeOptions);
    setupOptionButtons(akRatioOptions);
    
    akTypeOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const generateBtnSpan = akGenerateBtn.querySelector('span');

        if (button.dataset.value.toLowerCase().includes('karikatur')) {
            renderAkStyles('caricature');
            if (generateBtnSpan) generateBtnSpan.textContent = 'Buat 4 Karikatur';
        } else {
            renderAkStyles('art');
            if (generateBtnSpan) generateBtnSpan.textContent = 'Buat 4 Karya Seni';
        }
    });
    
    akStyleOptions.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.dataset.value === 'Kustom') {
            akCustomStyleContainer.classList.remove('hidden');
            akCustomStyleInput.focus();
        } else if (button) {
            akCustomStyleContainer.classList.add('hidden');
        }
    });
    
    renderAkStyles('art');

    akMagicPromptBtn.addEventListener('click', async () => {
        if (!akImageData) return;
        const originalBtnHTML = akMagicPromptBtn.innerHTML;
        akMagicPromptBtn.disabled = true;
        akMagicPromptBtn.innerHTML = `<div class="loader-icon w-5 h-5"></div>`;
        try {
            const type = akTypeOptions.querySelector('.selected').dataset.value;
            let style = akStyleOptions.querySelector('.selected').dataset.value;
            if (style === 'Kustom') {
                style = akCustomStyleInput.value.trim() || 'Seni Digital';
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
            const systemPrompt = `You are a creative art director. Analyze the user's Foto, their chosen art type, and style. Based on these, write a concise, descriptive instruction in Indonesian that adds creative details to the final image. For example, 'Tambahkan latar belakang pemandangan kota di malam hari dengan lampu neon' or 'Buat ekspresi wajah menjadi tersenyum lebar dan gembira'. Respond ONLY with the instruction text.`;
            const userQuery = `Analisis Foto ini. Jenis: ${type}. Gaya: ${style}. Buatkan satu instruksi tambahan yang kreatif.`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }, { inlineData: { mimeType: akImageData.mimeType, data: akImageData.base64 } }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] }
            };
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));
            
            const result = await response.json();
            akPromptInput.value = result.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error("Error generating magic prompt for art:", error);
            akPromptInput.value = `Gagal membuat instruksi: ${error.message}`;
        } finally {
            akMagicPromptBtn.innerHTML = originalBtnHTML;
            akUpdateButtons();
        }
    });

    akGenerateBtn.addEventListener('click', async () => {
        const originalBtnHTML = akGenerateBtn.innerHTML;
        akGenerateBtn.disabled = true;
        akGenerateBtn.innerHTML = `<div class="loader-icon !border-l-white w-5 h-5"></div><span class="ml-2">Membuat Karya...</span>`;

        document.getElementById('ak-results-placeholder').classList.add('hidden');

        const aspectRatio = akRatioOptions.querySelector('.selected').dataset.value;
        const aspectClass = getAspectRatioClass(aspectRatio);

        akResultsContainer.classList.remove('hidden');
        akResultsGrid.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const card = document.createElement('div');
            card.id = `ak-card-${i}`;
            card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
            card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
            akResultsGrid.appendChild(card);
        }
        lucide.createIcons();

        const generationPromises = [1, 2, 3, 4].map(i => generateSingleArtImage(i, aspectRatio));
        await Promise.allSettled(generationPromises);

        akGenerateBtn.disabled = false;
        akGenerateBtn.innerHTML = originalBtnHTML;
        lucide.createIcons();
    });

    async function generateSingleArtImage(id, aspectRatio) {
        const card = document.getElementById(`ak-card-${id}`);
        try {
            const type = akTypeOptions.querySelector('.selected').dataset.value;
            let style = akStyleOptions.querySelector('.selected').dataset.value;
            if (style === 'Kustom') {
                style = akCustomStyleInput.value.trim() || 'Seni Digital';
            }
            const instruction = akPromptInput.value.trim();
            
            let prompt = `Transform the person in the provided Foto into a high-quality piece of art. CRITICAL: Retain the person's key facial features and likeness, but render them in the new style.
            - Type of Artwork: ${type}.
            - Artistic Style: ${style}.`;

            if (type.toLowerCase().includes('karikatur')) {
                prompt += ` Exaggerate the facial features slightly for a humorous and recognizable caricature effect.`
            }
            
            if (instruction) {
                prompt += `\n- Additional User Instructions: ${instruction}. Please follow these instructions closely.`
            }
            
            prompt += ` The final result should be a beautiful, professional, and creative masterpiece. This is variation number ${id}.`;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
            const payload = {
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: akImageData.mimeType, data: akImageData.base64 } }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: aspectRatio }
                }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(await getApiErrorMessage(response));

            const result = await response.json();
            const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
            if (!base64Data) throw new Error("No image data received from API.");

            const imageUrl = `data:image/png;base64,${base64Data}`;
            card.innerHTML = `
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <div class="absolute bottom-2 right-2 flex gap-1">
                    <button data-img-src="${imageUrl}" class="view-btn result-action-btn" title="Lihat Gambar"><i data-lucide="eye" class="w-4 h-4"></i></button>
                    <a href="${imageUrl}" download="karya_seni_${id}.png" class="result-action-btn download-btn" title="Unduh Gambar">
                        <i data-lucide="download" class="w-4 h-4"></i>
                    </a>
                </div>`;
            card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
            card.classList.add('relative');

        } catch (error) {
            console.error(`Error for art/caricature card ${id}:`, error);
            card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
        } finally {
            lucide.createIcons();
        }
    }

// --- Remove Background Feature Logic ---

// ===== POV TANGAN FEATURE =====
const ptImageInput = document.getElementById('pt-image-input');
const ptUploadBox = document.getElementById('pt-upload-box');
const ptPreview = document.getElementById('pt-preview');
const ptPlaceholder = document.getElementById('pt-placeholder');
const ptRemoveBtn = document.getElementById('pt-remove-btn');
const ptDescInput = document.getElementById('pt-desc-input');
const ptMagicDescBtn = document.getElementById('pt-magic-desc-btn');
const ptInstructionInput = document.getElementById('pt-instruction-input');
const ptCountSlider = document.getElementById('pt-count-slider');
const ptCountDisplay = document.getElementById('pt-count-display');
const ptRatioOptions = document.getElementById('pt-ratio-options');
const ptGenerateBtn = document.getElementById('pt-generate-btn');
const ptResultsContainer = document.getElementById('pt-results-container');
const ptResultsGrid = document.getElementById('pt-results-grid');
let ptImageData = null;

function ptUpdateButtons() {
    const hasImage = !!ptImageData;
    const hasDesc = ptDescInput.value.trim() !== '' && !ptDescInput.disabled;
    ptGenerateBtn.disabled = !hasImage || !hasDesc;
    ptMagicDescBtn.disabled = !hasImage;
}

async function ptAutoGenerateDescription() {
    if (!ptImageData) return;
    const originalBtnHTML = ptMagicDescBtn.innerHTML;
    ptMagicDescBtn.disabled = true;
    ptMagicDescBtn.innerHTML = `<div class="loader-icon w-4 h-4"></div>`;
    ptDescInput.value = 'AI sedang membuat deskripsi...';
    ptDescInput.disabled = true;

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_API_KEY}`;
        const systemPrompt = `Analyze the product image and write a short, appealing product description in Indonesian, maximum of 15 words. Respond only with the description text.`;
        const payload = {
            contents: [{ parts: [{ text: "Describe this product." }, { inlineData: { mimeType: ptImageData.mimeType, data: ptImageData.base64 } }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(await getApiErrorMessage(response));
        const result = await response.json();
        ptDescInput.value = result.candidates[0].content.parts[0].text.trim().replace(/["*]/g, '');
    } catch (error) {
        console.error("Error generating auto description:", error);
        ptDescInput.value = "Gagal membuat deskripsi. Coba lagi atau isi manual.";
    } finally {
        ptMagicDescBtn.innerHTML = originalBtnHTML;
        ptDescInput.disabled = false;
        ptUpdateButtons(); 
    }
}

setupImageUpload(ptImageInput, ptUploadBox, (data) => {
    ptImageData = data;
    ptPreview.src = data.dataUrl;
    ptPlaceholder.classList.add('hidden');
    ptPreview.classList.remove('hidden');
    ptRemoveBtn.classList.remove('hidden');
    ptUpdateButtons(); 
    ptAutoGenerateDescription();
});

ptRemoveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    ptImageData = null;
    ptImageInput.value = '';
    ptDescInput.value = '';
    ptInstructionInput.value = '';
    ptPreview.src = '#';
    ptPreview.classList.add('hidden');
    ptPlaceholder.classList.remove('hidden');
    ptRemoveBtn.classList.add('hidden');
    document.getElementById('pt-results-placeholder').classList.remove('hidden');
    ptResultsContainer.classList.add('hidden');
    ptResultsGrid.innerHTML = '';
    ptUpdateButtons();
});

ptDescInput.addEventListener('input', ptUpdateButtons);

ptCountSlider.addEventListener('input', () => {
    ptCountDisplay.textContent = ptCountSlider.value;
});

setupOptionButtons(ptRatioOptions);

ptMagicDescBtn.addEventListener('click', ptAutoGenerateDescription);

ptGenerateBtn.addEventListener('click', async () => {
    if (!ptImageData) return;
    
    const originalBtnHTML = ptGenerateBtn.innerHTML;
    ptGenerateBtn.disabled = true;
    ptGenerateBtn.innerHTML = `<div class="loader-icon loader-icon-light w-5 h-5"></div><span class="ml-2">Membuat Foto POV...</span>`;
    
    document.getElementById('pt-results-placeholder').classList.add('hidden');
    
    const aspectRatio = ptRatioOptions.querySelector('.selected').dataset.value;
    const aspectClass = getAspectRatioClass(aspectRatio);
    const numImages = parseInt(ptCountSlider.value);
    
    ptResultsContainer.classList.remove('hidden');
    ptResultsGrid.innerHTML = '';
    
    for (let i = 1; i <= numImages; i++) {
        const card = document.createElement('div');
        card.id = `pt-card-${i}`;
        card.className = `card overflow-hidden bg-gray-100 flex items-center justify-center ${aspectClass}`;
        card.innerHTML = `<div class="loader-icon w-8 h-8"></div>`;
        ptResultsGrid.appendChild(card);
    }
    lucide.createIcons();
    
    const generationPromises = [];
    for (let i = 1; i <= numImages; i++) {
        generationPromises.push(generateSinglePovImage(i, aspectRatio));
    }
    await Promise.allSettled(generationPromises);
    
    ptGenerateBtn.disabled = false;
    ptGenerateBtn.innerHTML = originalBtnHTML;
    lucide.createIcons();
});

async function generateSinglePovImage(id, aspectRatio) {
    const card = document.getElementById(`pt-card-${id}`);
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GOOGLE_API_KEY}`;
        
        const productDesc = ptDescInput.value.trim();
        const additionalInstruction = ptInstructionInput.value.trim();
        
        let basePrompt = `Create a realistic first-person POV (point of view) photograph showing hands holding or interacting with this product: ${productDesc}. `;
        basePrompt += `The hands should be naturally positioned as if the viewer is holding the product. `;
        basePrompt += `Background should be lifestyle-appropriate and slightly blurred (shallow depth of field). `;
        
        if (additionalInstruction) {
            basePrompt += `Additional context: ${additionalInstruction}. `;
        }
        
        basePrompt += `The image should look like a natural, candid photo taken by someone holding their phone or camera. `;
        basePrompt += `This is creative variation number ${id}, so make each one unique in terms of hand position, angle, or background setting.`;
        
        const payload = {
            contents: [{
                parts: [
                    { text: basePrompt },
                    { inlineData: { mimeType: ptImageData.mimeType, data: ptImageData.base64 } }
                ]
            }],
            generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: aspectRatio }
            }
        };
        
        const response = await fetch(apiUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(payload) 
        });
        
        if (!response.ok) throw new Error(await getApiErrorMessage(response));
        
        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        
        if (!base64Data) throw new Error("No image data from AI.");
        
        const imageUrl = `data:image/png;base64,${base64Data}`;
        card.innerHTML = `
            <img src="${imageUrl}" class="w-full h-full object-cover">
            <div class="absolute bottom-2 right-2 flex gap-1">
                <button data-img-src="${imageUrl}" class="view-btn result-action-btn bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors" title="Lihat Gambar">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
                <a href="${imageUrl}" download="pov_tangan_${id}.png" class="download-btn result-action-btn bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors" title="Unduh Gambar">
                    <i data-lucide="download" class="w-4 h-4"></i>
                </a>
            </div>`;
        card.classList.remove('bg-gray-100', 'flex', 'items-center', 'justify-center');
        card.classList.add('relative');
    } catch (error) {
        console.error(`Error for POV card ${id}:`, error);
        card.innerHTML = `<div class="text-xs text-red-500 p-2 text-center break-all">Gagal: ${error.message}</div>`;
    } finally {
        lucide.createIcons();
    }
}
// ===== END POV TANGAN FEATURE =====


// Floating Sidebar Toggle - Konsep 2
const floatingSidebar = document.getElementById('floating-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mainContent = document.getElementById('main-content');

if (floatingSidebar && sidebarToggle && mainContent) {
    // Load saved state from localStorage (only on desktop)
    if (window.innerWidth >= 768) {
        const savedState = localStorage.getItem('sidebarState');
        if (savedState === 'collapsed') {
            floatingSidebar.classList.remove('expanded');
            floatingSidebar.classList.add('collapsed');
            mainContent.classList.remove('md:pl-[304px]');
            mainContent.classList.add('md:pl-[88px]');
        }
    }
    
    sidebarToggle.addEventListener('click', () => {
        // Only work on desktop
        if (window.innerWidth < 768) return;
        
        const isExpanded = floatingSidebar.classList.contains('expanded');
        
        if (isExpanded) {
            floatingSidebar.classList.remove('expanded');
            floatingSidebar.classList.add('collapsed');
            mainContent.classList.remove('md:pl-[304px]');
            mainContent.classList.add('md:pl-[88px]');
            localStorage.setItem('sidebarState', 'collapsed');
        } else {
            floatingSidebar.classList.remove('collapsed');
            floatingSidebar.classList.add('expanded');
            mainContent.classList.remove('md:pl-[88px]');
            mainContent.classList.add('md:pl-[304px]');
            localStorage.setItem('sidebarState', 'expanded');
        }
        
        lucide.createIcons();
    });
}

// ========== VERSION UPDATE SYSTEM ==========
const APP_VERSION = "1.1"; // Deklarasi versi aplikasi saat ini

// Initialize Firebase
if (!firebase.apps.length) {
    const firebaseConfig = {
apiKey: "AIzaSyCdoonDnGklyyzqGysEfqqsD63k4uiWFKE",
authDomain: "aifotomagicbynds.firebaseapp.com",
databaseURL: "https://aifotomagicbynds-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "aifotomagicbynds",
storageBucket: "aifotomagicbynds.firebasestorage.app",
messagingSenderId: "562423712158",
appId: "1:562423712158:web:45fda59740fe246fb6ae8f",
measurementId: "G-BXZBXN90N3"
};
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Version comparison function
function compareVersions(v1, v2) {
    // Convert to string and validate
    const version1 = String(v1 || '0');
    const version2 = String(v2 || '0');
    
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = parts1[i] || 0;
        const part2 = parts2[i] || 0;
        
        if (part1 < part2) return -1; // v1 lebih lama
        if (part1 > part2) return 1;  // v1 lebih baru
    }
    return 0; // sama
}

// Check for version updates
function checkVersionUpdate() {
    const versionRef = database.ref('aiPhotoMagic/version');
    
    versionRef.once('value', (snapshot) => {
        const versionData = snapshot.val();
        if (!versionData) {
            console.log('No version data in Firebase');
            return;
        }
        
        const latestVersion = versionData.latest;
        const updateInfo = versionData.updateInfo || {};
        
        // Compare versions
        const comparison = compareVersions(APP_VERSION, latestVersion);
        
        if (comparison < 0) {
            // Current version is older, check if user wants to see this update
            const remindLater = localStorage.getItem('aiPhotoMagic_remind_later');
            
            // Check if user chose "remind later" or "skip" and it hasn't been 24 hours yet
            if (remindLater) {
                const remindData = JSON.parse(remindLater);
                if (remindData.version === latestVersion) {
                    const hoursSince = (Date.now() - remindData.timestamp) / (1000 * 60 * 60);
                    if (hoursSince < 24) {
                        console.log('User chose remind later/skip, waiting 24 hours...');
                        return;
                    }
                }
            }
            
            // Show update modal
            showVersionUpdateModal(latestVersion, updateInfo);
        } else if (comparison === 0) {
            console.log('App is up to date');
        } else {
            console.log('App version is newer than Firebase (development mode?)');
        }
    }).catch(err => {
        console.log('Version check error:', err);
    });
}

// Show version update modal
function showVersionUpdateModal(latestVersion, updateInfo) {
    const modal = document.getElementById('version-update-modal');
    const content = document.getElementById('version-update-content');
    
    // Update content
    document.getElementById('current-version-display').textContent = `v${APP_VERSION}`;
    document.getElementById('latest-version-display').textContent = `v${latestVersion}`;
    document.getElementById('version-update-message').textContent = 
        updateInfo.message || 'Update terbaru tersedia dengan perbaikan dan fitur baru.';
    
    // Update release date
    if (updateInfo.releaseDate) {
        const date = new Date(updateInfo.releaseDate);
        const formattedDate = date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        document.getElementById('version-release-date').querySelector('span').textContent = 
            `Dirilis: ${formattedDate}`;
    }
    
    // Set download URL
    const updateBtn = document.getElementById('version-update-btn');
    if (updateInfo.downloadUrl) {
        updateBtn.href = updateInfo.downloadUrl;
    } else {
        updateBtn.href = window.location.href; // Default to current URL
    }
    
    // Show modal with animation
    modal.classList.remove('pointer-events-none', 'opacity-0');
    modal.classList.add('opacity-100');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
    
    // Re-render lucide icons in modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Store that we showed this version
    localStorage.setItem('aiPhotoMagic_last_shown_version', latestVersion);
}

// Hide version update modal
function hideVersionUpdateModal() {
    const modal = document.getElementById('version-update-modal');
    const content = document.getElementById('version-update-content');
    
    // Remove visible classes first
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // Hide completely after animation
    setTimeout(() => {
        modal.classList.add('pointer-events-none');
    }, 300);
}

// Event Listeners for version update modal
document.getElementById('version-remind-later-btn').addEventListener('click', () => {
    const latestVersion = document.getElementById('latest-version-display').textContent.replace('v', '');
    localStorage.setItem('aiPhotoMagic_remind_later', JSON.stringify({
        version: latestVersion,
        timestamp: Date.now()
    }));
    hideVersionUpdateModal();
});

document.getElementById('version-skip-btn').addEventListener('click', () => {
    const latestVersion = document.getElementById('latest-version-display').textContent.replace('v', '');
    // Simpan ke remind_later dengan timestamp untuk 24 jam kedepan
    localStorage.setItem('aiPhotoMagic_remind_later', JSON.stringify({
        version: latestVersion,
        timestamp: Date.now()
    }));
    hideVersionUpdateModal();
});

// Check for updates after page loads (with delay to not interfere with loading)
setTimeout(() => {
    checkVersionUpdate();
}, 2000);

// ========== END VERSION UPDATE SYSTEM ==========

// ========== DOCUMENTATION FILTER SYSTEM ==========
const docCategoryBtns = document.querySelectorAll('.doc-category-btn');
const docCards = document.querySelectorAll('.doc-card');

// Filter documentation cards by category
docCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active button
        docCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter cards with animation
        docCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                // Add fade-in animation
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // Add fade-out animation
                card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    });
});
// ========== END DOCUMENTATION FILTER SYSTEM ==========

lucide.createIcons();
initBeranda();
switchTab('beranda'); 
document.getElementById('footer-text').innerHTML = '&copy; 2025. AI Foto Magic v1.1 PRO by Nun NDS';

});