/* ==========================================================================
   AGROSPHERE AI - CLIENT APPLICATION LOGIC
   ========================================================================== */

// --- Translation Map (EN <-> HI) for High Fidelity UI Translation ---
const TRANSLATIONS = {
    en: {
        welcome: "Welcome back, Praveen!",
        welcome_desc: "Get instant AI recommendations, monitor mandi rates, and diagnose crop health in real-time.",
        status_gps: "Kallakurichi, Tamil Nadu",
        status_sync: "Synced Live",
        advisory_title: "Weather Advisory",
        advisory_ok: "Spraying is safe today. Rain forecasted tomorrow evening.",
        advisory_rain: "Heavy rain forecast: Postpone pesticide spray.",
        ask_ai_btn: "Ask AgroSphere AI",
        live_rates: "Live Mandi Rates",
        calculator_btn: "Run Soil Suitability Test"
    },
    hi: {
        welcome: "स्वागत है, प्रवीण!",
        welcome_desc: "त्वरित एआई सिफारिशें प्राप्त करें, मंडी दरों की निगरानी करें और वास्तविक समय में फसल स्वास्थ्य की जांच करें।",
        status_gps: "कल्लाकुरिची, तमिलनाडु",
        status_sync: "लाइव सिंक किया गया",
        advisory_title: "मौसम सलाह",
        advisory_ok: "आज छिड़काव सुरक्षित है। कल शाम बारिश होने की संभावना है।",
        advisory_rain: "भारी बारिश का पूर्वानुमान: कीटनाशकों के छिड़काव को स्थगित करें।",
        ask_ai_btn: "कृषि एआई से पूछें",
        live_rates: "लाइव मंडी भाव",
        calculator_btn: "मिट्टी उपयुक्तता परीक्षण चलाएं"
    }
};

// --- Global App State ---
let currentLanguage = 'en';
let activeView = 'dashboard';
let mandiChart = null;

// --- Mock Datasets for Crops and Markets ---
const CROP_PRICE_DATA = {
    wheat: {
        label: "Wheat (Kanak)",
        prices: [2150, 2180, 2210, 2225, 2250, 2275],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        current: "₹2,275/qtl",
        change: "+₹45 (This Month)",
        trend: "up"
    },
    paddy: {
        label: "Paddy (Basmati)",
        prices: [4300, 4250, 4200, 4150, 4120, 4100],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        current: "₹4,100/qtl",
        change: "-₹50 (This Month)",
        trend: "down"
    },
    cotton: {
        label: "Cotton (Kapas)",
        prices: [6600, 6720, 6800, 6750, 6810, 6850],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        current: "₹6,850/qtl",
        change: "+₹80 (This Month)",
        trend: "up"
    },
    potato: {
        label: "Potato (Aloo)",
        prices: [1150, 1180, 1200, 1210, 1200, 1200],
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        current: "₹1,200/qtl",
        change: "₹0 (Stable)",
        trend: "flat"
    }
};

const MANDI_MOCK_LIST = [
    { mandi: "Khanna Mandi", min: 2240, max: 2310, avg: 2275, arrival: "1,200 Tons" },
    { mandi: "Ludhiana Mandi", min: 2230, max: 2290, avg: 2260, arrival: "850 Tons" },
    { mandi: "Amritsar Mandi", min: 2250, max: 2320, avg: 2285, arrival: "980 Tons" },
    { mandi: "Jalandhar Mandi", min: 2220, max: 2280, avg: 2250, arrival: "620 Tons" }
];

const SCANNER_DIAGNOSES = {
    tomato_early_blight: {
        crop: "Tomato (टमाटर)",
        disease: "Early Blight (Alternaria solani)",
        confidence: "95.2%",
        severity: "High",
        severityClass: "high",
        symptoms: "Dark, concentric spots resembling target rings appear first on older foliage. Leaf surrounding spots turns yellow, leading to premature drop.",
        causes: "High relative humidity (above 85%) and temperature between 24°C–29°C. Spores survive in crop residues and travel by wind.",
        organic: [
            "Prune lower infected foliage and destroy them (do not compost).",
            "Spray copper hydroxide or organic neem oil (5ml per liter water).",
            "Mulch soil around plants to prevent spores splashing up from the soil."
        ],
        chemical: [
            "Apply Chlorothalonil or Mancozeb fungicide spray immediately.",
            "Repeat sprays at 10-14 day intervals under humid conditions.",
            "Follow a strict pre-harvest interval of 5-7 days."
        ]
    },
    rice_blast: {
        crop: "Paddy/Rice (धान)",
        disease: "Rice Blast (Pyricularia oryzae)",
        confidence: "91.5%",
        severity: "Medium",
        severityClass: "medium",
        symptoms: "Diamond-shaped, spindle-like spots with gray centers and brown borders on leaves. Can cause collar rot and neck rot in severe cases.",
        causes: "Frequent rains, heavy dews, high nitrogen fertilizer over-application, and temperatures around 25°C–28°C.",
        organic: [
            "Ensure field sanitation and destruction of stubble from previous infected crop.",
            "Avoid over-flooding fields continuously; practice alternate wetting and drying.",
            "Apply bio-fungicides containing Pseudomonas fluorescens."
        ],
        chemical: [
            "Spray Tricyclazole 75% WP at 0.6 grams/liter of water.",
            "Alternatively, use Azoxystrobin + Difenoconazole compound sprays.",
            "Reduce nitrogen fertilizer rates to slow down vegetative vulnerability."
        ]
    },
    maize_rust: {
        crop: "Maize/Corn (मक्का)",
        disease: "Common Maize Rust (Puccinia sorghi)",
        confidence: "88.7%",
        severity: "Low",
        severityClass: "low",
        symptoms: "Small, dusty golden-brown pustules on both upper and lower leaf surfaces. Heavy infection causes leaves to yellow and dry.",
        causes: "Cool temperature (16°C - 23°C) and high humidity. Fungal spores are dispersed rapidly by wind currents.",
        organic: [
            "Plant rust-resistant hybrid corn varieties next crop cycle.",
            "Practice proper crop rotation with legumes (beans, soybeans) to disrupt spore cycles.",
            "Ensure wide crop spacing to facilitate quick leaf drying."
        ],
        chemical: [
            "Chemical treatments are rarely needed unless infection occurs early in the growth stage.",
            "If severity increases, spray Pyraclostrobin or Mancozeb fungicides.",
            "Apply at first sign of pustule emergence on lower leaves."
        ]
    }
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupLanguageSwitcher();
    setupChatLogic();
    setupScannerLogic();
    setupMarketChart();
    setupMobileSidebar();
    setupProfileLogic();
    
    // Populate Mandi Table
    updateMandiTable("wheat");
});

// --- Mobile Sidebar Controls ---
function setupMobileSidebar() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", (e) => {
            sidebar.classList.toggle("mobile-open");
            e.stopPropagation();
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener("click", (e) => {
            if (sidebar.classList.contains("mobile-open") && !sidebar.contains(e.target)) {
                sidebar.classList.remove("mobile-open");
            }
        });
    }
}

// --- Navigation Controller ---
function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const viewId = item.getAttribute("data-view");
            
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            switchView(viewId);
            
            // Close mobile sidebar on navigation
            document.getElementById("sidebar").classList.remove("mobile-open");
        });
    });
}

function switchView(viewId) {
    activeView = viewId;
    
    // Hide all view sections
    const sections = document.querySelectorAll(".view-section");
    sections.forEach(sec => sec.classList.remove("active-view"));
    
    // Show correct section
    let targetSection = document.getElementById(`${viewId}-view`);
    if (!targetSection) {
        // Fallback mapping
        if (viewId === 'soil-weather') {
            targetSection = document.getElementById("soil-weather-view");
        } else if (viewId === 'support') {
            targetSection = document.getElementById("support-view");
        }
    }
    
    if (targetSection) {
        targetSection.classList.add("active-view");
    }
    
    // Update sidebar navigation active state manually if triggered programmatically
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.getAttribute("data-view") === viewId) {
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        }
    });

    // Special trigger: Render or resize chart when switching to market view
    if (viewId === 'market') {
        setTimeout(() => {
            if (mandiChart) {
                mandiChart.resize();
            }
        }, 100);
    }
}

// --- Language Toggle Logic ---
function setupLanguageSwitcher() {
    const langBtns = document.querySelectorAll(".lang-btn");
    
    langBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            currentLanguage = btn.getAttribute("data-lang");
            translateUI(currentLanguage);
        });
    });
}

function translateUI(lang) {
    const texts = TRANSLATIONS[lang];
    
    // Update elements that have translations
    const welcomeTitle = document.querySelector(".banner-text h2");
    if (welcomeTitle) welcomeTitle.textContent = texts.welcome;
    
    const welcomeDesc = document.querySelector(".banner-text p");
    if (welcomeDesc) welcomeDesc.textContent = texts.welcome_desc;
    
    const gpsStatus = document.querySelector(".status-badge.gps");
    if (gpsStatus) gpsStatus.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${texts.status_gps}`;
    
    const syncStatus = document.querySelector(".status-badge.sync");
    if (syncStatus) syncStatus.innerHTML = `<i class="fa-solid fa-cloud"></i> ${texts.status_sync}`;

    const weatherTitle = document.querySelector(".weather-card .card-header h3");
    if (weatherTitle) weatherTitle.textContent = texts.advisory_title;

    const weatherPill = document.querySelector(".advisory-pill span");
    if (weatherPill) weatherPill.textContent = texts.advisory_ok;

    const askAiBtn = document.querySelector(".banner-action button");
    if (askAiBtn) askAiBtn.innerHTML = `<i class="fa-solid fa-robot"></i> ${texts.ask_ai_btn}`;
    
    const tickerTitle = document.querySelector(".ticker-title");
    if (tickerTitle) tickerTitle.textContent = texts.live_rates;

    const soilCalcBtn = document.querySelector(".soil-summary button");
    if (soilCalcBtn) soilCalcBtn.innerHTML = `<i class="fa-solid fa-calculator"></i> ${texts.calculator_btn}`;
}

// --- AI Advisory Chatbot Engine ---
function setupChatLogic() {
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const voiceBtn = document.getElementById("voiceBtn");
    const clearChatBtn = document.getElementById("clearChatBtn");
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener("click", handleUserMessage);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleUserMessage();
        });
    }

    if (clearChatBtn) {
        clearChatBtn.addEventListener("click", () => {
            const chatMessages = document.getElementById("chatMessages");
            chatMessages.innerHTML = `
                <div class="message ai">
                    <div class="message-avatar">AI</div>
                    <div class="message-content">
                        <p>Chat cleared. How can I help you, Rajesh?</p>
                    </div>
                </div>
            `;
        });
    }
    
    // Voice query simulation
    if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
            voiceBtn.classList.add("recording");
            chatInput.placeholder = "Listening... Speak now";
            
            // Simulate voice typing after 2 seconds
            setTimeout(() => {
                voiceBtn.classList.remove("recording");
                chatInput.placeholder = "Type agricultural question...";
                
                const spokenPhrases = [
                    "What is the best fertilizer dose for basmati paddy?",
                    "How to cure leaf yellowing in tomato crop?",
                    "Tell me about PM-KISAN subsidy requirements",
                    "क्या मुझे गेहूं की बुआई के लिए खाद की मात्रा बताएंगे?"
                ];
                
                // Pick a random spoken query
                const randomQuery = spokenPhrases[Math.floor(Math.random() * spokenPhrases.length)];
                chatInput.value = randomQuery;
                
                // Alert the user slightly of simulation
                showToast("Voice command recognized.");
            }, 2500);
        });
    }
}

function handleUserMessage() {
    const chatInput = document.getElementById("chatInput");
    const query = chatInput.value.trim();
    if (!query) return;
    
    // Add farmer message
    addChatMessage(query, "farmer");
    chatInput.value = "";
    
    // Add typing indicator
    showTypingIndicator();
    
    // Simulate AI response delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAiResponse(query);
        addChatMessage(response, "ai");
    }, 1200);
}

function addChatMessage(content, sender) {
    const chatMessages = document.getElementById("chatMessages");
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    
    let avatarHTML = sender === 'ai' ? 'AI' : 'RM';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarHTML}</div>
        <div class="message-content">${content}</div>
        <span class="message-time">${time}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById("chatMessages");
    const indicatorDiv = document.createElement("div");
    indicatorDiv.id = "typingIndicator";
    indicatorDiv.classList.add("message", "ai");
    indicatorDiv.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content" style="padding: 10px 18px;">
            <span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span>
        </div>
    `;
    chatMessages.appendChild(indicatorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
}

function openPresetChat(query) {
    switchView("chat");
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.value = query;
        handleUserMessage();
    }
}

// Smart keyword agricultural chatbot matcher
function getAiResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes("yellow") || q.includes("पीली") || q.includes("blight") || q.includes("टमाटर")) {
        return `
            <h4>Tomato Leaf Yellowing & Blight Advisory</h4>
            <p>Leaf yellowing in tomatoes is most commonly due to <strong>Early Blight</strong> or nutrient deficiencies. Here are diagnostic guidelines:</p>
            <table>
                <tr>
                    <th>Symptom</th>
                    <th>Diagnosis</th>
                    <th>Correction Plan</th>
                </tr>
                <tr>
                    <td>Target-like brown spots with yellow halos on bottom leaves</td>
                    <td>Early Blight (Fungal)</td>
                    <td>Spray Chlorothalonil or copper oxychloride fungicide. Remove lower leaves.</td>
                </tr>
                <tr>
                    <td>Uniform yellowing of older leaves, slow growth</td>
                    <td>Nitrogen Deficiency</td>
                    <td>Apply Ammonium Sulfate or well-rotted organic manure at soil base.</td>
                </tr>
            </table>
            <p>Ensure you avoid overhead sprinkler watering, as leaf wetness spreads fungal spores.</p>
        `;
    }
    
    if (q.includes("urea") || q.includes("fertilizer") || q.includes("npk") || q.includes("paddy") || q.includes("धान")) {
        return `
            <h4>Fertilizer Advisory for Paddy (Basmati)</h4>
            <p>For Basmati Paddy varieties in Punjab, we recommend a split N-P-K nutrient application to ensure high yields and strong lodging resistance:</p>
            <ul>
                <li><strong>Basal Dose (At Sowing/Transplant):</strong> Apply 26 kg Nitrogen (N), 12 kg Phosphorus (P₂O₅), and 12 kg Potassium (K₂O) per acre.</li>
                <li><strong>First Top Dressing (3 Weeks post-transplant):</strong> Apply 30 kg Urea per acre.</li>
                <li><strong>Second Top Dressing (6 Weeks post-transplant - panicle initiation):</strong> Apply another 30 kg Urea per acre.</li>
            </ul>
            <p><em>Tip:</em> Always apply urea after draining excess standing water, then re-flood after 24 hours to maximize root absorption.</p>
        `;
    }

    if (q.includes("pm-kisan") || q.includes("subsidy") || q.includes("scheme") || q.includes("योजना")) {
        return `
            <h4>PM-KISAN Scheme Information</h4>
            <p>The <strong>PM-KISAN Samman Nidhi</strong> provides ₹6,000 yearly to eligible farming families in 3 installments of ₹2,000.</p>
            <h5>How to apply:</h5>
            <ol>
                <li>Visit the official portal at <a href="https://pmkisan.gov.in" target="_blank">pmkisan.gov.in</a>.</li>
                <li>Go to the 'New Farmer Registration' section.</li>
                <li>Enter your Aadhaar Number and land records details (Khasra/Khatauni documents).</li>
                <li>Ensure your bank account is linked to your Aadhaar for direct cash transfer.</li>
            </ol>
            <p>For further registration verification, you can contact the local Patwari or Agriculture Officer in Ludhiana at civil lines.</p>
        `;
    }

    if (q.includes("cotton") || q.includes("rate") || q.includes("mandi") || q.includes("कपास") || q.includes("भाव")) {
        return `
            <h4>Mandi Price Report - Cotton (Kapas)</h4>
            <p>Wholesale Cotton arrivals have improved in Punjab mandis. Average rates are stable: </p>
            <ul>
                <li><strong>Khanna Mandi:</strong> ₹6,850/Quintal (Arrival: 240 Tons)</li>
                <li><strong>Ludhiana Mandi:</strong> ₹6,810/Quintal (Arrival: 180 Tons)</li>
                <li><strong>Abohar Mandi:</strong> ₹6,920/Quintal (Peak arrivals)</li>
            </ul>
            <p>Trends indicate prices will remain steady around ₹6,800 - ₹6,950 for the next two weeks. We advise selling medium quality crops now.</p>
        `;
    }

    if (q.includes("ph") || q.includes("potato") || q.includes("soil") || q.includes("मिट्टी")) {
        return `
            <h4>Soil and Crop Suitability Advice</h4>
            <p>Potatoes grow best in well-drained, sandy loam or loamy soils. The ideal soil parameters are:</p>
            <ul>
                <li><strong>pH Range:</strong> 5.0 to 6.2 (Slightly acidic). Lower pH helps prevent Potato Scab disease.</li>
                <li><strong>Organic Matter:</strong> Needs high organic carbon. Add 10-15 tons of farmyard manure per acre.</li>
            </ul>
            <p>If your pH is above 7.0, consider adding agricultural sulfur to lower soil pH prior to tuber sowing.</p>
        `;
    }

    // Default response
    return `
        <h4>AgroSphere AI Help Desk</h4>
        <p>I have registered your query regarding agriculture science. I can assist with:</p>
        <ul>
            <li>Crop disease diagnosis (Tomato blight, Rice blast, Maize rust, Wheat spot).</li>
            <li>NPK fertilizer schedules and dosages.</li>
            <li>Live market rates (mandi rates) and price forecast.</li>
            <li>Government subsidies and irrigation support schemes.</li>
        </ul>
        <p>Please rephrase your question using keywords like 'fertilizer', 'disease', 'mandi price', or 'subsidy'. You can also call the Kisan Call Center toll-free at <a href="tel:18001801551">1800-180-1551</a>.</p>
    `;
}

// --- Crop Disease Scanner Engine ---
function setupScannerLogic() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    
    if (dropzone && fileInput) {
        // Dropzone drag-over style
        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.style.borderColor = "var(--color-mint)";
            dropzone.style.backgroundColor = "rgba(82, 183, 136, 0.05)";
        });
        
        dropzone.addEventListener("dragleave", () => {
            dropzone.style.borderColor = "rgba(27, 67, 50, 0.2)";
            dropzone.style.backgroundColor = "transparent";
        });
        
        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleUploadedFile(files[0]);
            }
        });
        
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                handleUploadedFile(fileInput.files[0]);
            }
        });
    }
}

function handleUploadedFile(file) {
    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewUrl = e.target.result;
        
        // Hide dropzone, show processing screen
        document.getElementById("dropzone").style.display = "none";
        const scannerProcessing = document.getElementById("scannerProcessing");
        scannerProcessing.style.display = "flex";
        
        document.getElementById("imagePreview").src = previewUrl;
        
        // Start simulated scanning timeline
        runScanningAnimation();
    };
    reader.readAsDataURL(file);
}

function runScanningAnimation(mockDiagnosisKey = null) {
    const progressFill = document.getElementById("progressFill");
    const statusText = document.getElementById("scanningStatusText");
    let progress = 0;
    
    const steps = [
        "Analyzing leaf layout...",
        "Identifying chlorosis spots...",
        "Measuring vein necrosis...",
        "Querying AgroSphere crop database...",
        "Finalizing diagnostic report..."
    ];
    
    const interval = setInterval(() => {
        progress += 4;
        progressFill.style.width = `${progress}%`;
        
        // Update status text periodically
        const stepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);
        statusText.textContent = steps[stepIndex];
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Finished! Hide processing, show results
            document.getElementById("scannerProcessing").style.display = "none";
            document.getElementById("diagnosisResults").style.display = "block";
            
            // Populate results
            // If we don't have a template key, pick one randomly based on name or default to tomato
            const keys = ["tomato_early_blight", "rice_blast", "maize_rust"];
            const selectedKey = mockDiagnosisKey || keys[Math.floor(Math.random() * keys.length)];
            populateDiagnosisResult(selectedKey);
        }
    }, 100);
}

function populateDiagnosisResult(key) {
    const data = SCANNER_DIAGNOSES[key];
    
    document.getElementById("resCropName").textContent = data.crop;
    
    const severityBadge = document.getElementById("resSeverity");
    severityBadge.textContent = `Severity: ${data.severity}`;
    severityBadge.className = `severity-badge ${data.severityClass}`;
    
    document.getElementById("resDiseaseName").textContent = data.disease;
    document.getElementById("resConfidence").textContent = data.confidence;
    document.getElementById("resSymptoms").textContent = data.symptoms;
    document.getElementById("resCauses").textContent = data.causes;
    
    // Populate lists
    const organicList = document.getElementById("resOrganicRemedy");
    organicList.innerHTML = "";
    data.organic.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        organicList.appendChild(li);
    });
    
    const chemicalList = document.getElementById("resChemicalRemedy");
    chemicalList.innerHTML = "";
    data.chemical.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        chemicalList.appendChild(li);
    });
}

function resetScanner() {
    document.getElementById("diagnosisResults").style.display = "none";
    document.getElementById("scannerProcessing").style.display = "none";
    document.getElementById("dropzone").style.display = "flex";
    document.getElementById("fileInput").value = "";
    document.getElementById("progressFill").style.width = "0%";
}

function simulateScannerDemo(templateKey) {
    resetScanner();
    
    // Hide dropzone, show processing screen
    document.getElementById("dropzone").style.display = "none";
    document.getElementById("scannerProcessing").style.display = "flex";
    
    // Set mock picture preview base64 or placeholder
    const imgPreview = document.getElementById("imagePreview");
    
    // Assign generic placeholder images for visual scanner representation
    if (templateKey === 'tomato_early_blight') {
        imgPreview.src = "demo_leaf_yellow.jpg";
    } else if (templateKey === 'rice_blast') {
        imgPreview.src = "demo_leaf_spots.jpg";
    } else {
        imgPreview.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e5f2ff'/><path d='M50 20 C20 40, 20 80, 50 90 C80 80, 80 40, 50 20 Z' fill='%2340916c'/></svg>";
    }
    
    runScanningAnimation(templateKey);
}

function askAiAboutScan() {
    const diseaseName = document.getElementById("resDiseaseName").textContent;
    openPresetChat(`How can I prevent and control ${diseaseName}? Give me a week-by-week timeline.`);
}

// --- Mandi Price Trends Chart Engine (Chart.js) ---
function setupMarketChart() {
    const cropSelect = document.getElementById("cropSelect");
    const stateSelect = document.getElementById("stateSelect");
    const mandiSelect = document.getElementById("mandiSelect");
    
    if (!cropSelect) return;
    
    // Listen for filter changes
    cropSelect.addEventListener("change", () => {
        const val = cropSelect.value;
        updateChartData(val);
        updateMandiTable(val);
    });
    
    stateSelect.addEventListener("change", () => {
        updateChartData(cropSelect.value);
    });
    
    mandiSelect.addEventListener("change", () => {
        updateChartData(cropSelect.value);
    });
    
    // Initial chart creation
    const ctx = document.getElementById("marketChart").getContext("2d");
    const initData = CROP_PRICE_DATA.wheat;
    
    mandiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initData.months,
            datasets: [{
                label: `Avg Rate (₹/quintal) - ${initData.label}`,
                data: initData.prices,
                borderColor: '#2d6a4f',
                backgroundColor: 'rgba(45, 106, 79, 0.08)',
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: '#1b4332',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(0,0,0,0.04)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

function updateChartData(cropKey) {
    const data = CROP_PRICE_DATA[cropKey];
    if (!data || !mandiChart) return;
    
    const mandiName = document.getElementById("mandiSelect").options[document.getElementById("mandiSelect").selectedIndex].text;
    
    // Update labels and values
    document.getElementById("chartTitle").textContent = `${data.label} (${mandiName}) Price Trends`;
    document.getElementById("currPriceLabel").textContent = data.current;
    
    const changeLabel = document.getElementById("currChangeLabel");
    changeLabel.innerHTML = `<i class="fa-solid fa-arrow-trend-${data.trend === 'up' ? 'up' : 'down'}"></i> ${data.change}`;
    changeLabel.className = `change-label ${data.trend === 'up' ? 'positive' : (data.trend === 'down' ? 'negative' : 'neutral')}`;
    
    // Update chart
    mandiChart.data.labels = data.months;
    mandiChart.data.datasets[0].label = `Avg Rate - ${data.label}`;
    mandiChart.data.datasets[0].data = data.prices;
    
    // Color toggle based on trend
    if (data.trend === 'down') {
        mandiChart.data.datasets[0].borderColor = '#e63946';
        mandiChart.data.datasets[0].backgroundColor = 'rgba(230, 57, 70, 0.08)';
        mandiChart.data.datasets[0].pointBackgroundColor = '#e63946';
    } else {
        mandiChart.data.datasets[0].borderColor = '#2d6a4f';
        mandiChart.data.datasets[0].backgroundColor = 'rgba(45, 106, 79, 0.08)';
        mandiChart.data.datasets[0].pointBackgroundColor = '#1b4332';
    }
    
    mandiChart.update();
}

function updateMandiTable(cropKey) {
    const tableBody = document.getElementById("mandiTableBody");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";
    
    // Scale rates slightly to reflect different crop values
    let multiplier = 1.0;
    let varietyName = "PBW-725 (High Yield)";
    
    if (cropKey === 'paddy') { multiplier = 1.8; varietyName = "Basmati-1121"; }
    else if (cropKey === 'cotton') { multiplier = 3.0; varietyName = "Bt Cotton (Hybrid)"; }
    else if (cropKey === 'potato') { multiplier = 0.55; varietyName = "Kufri Jyoti"; }
    
    MANDI_MOCK_LIST.forEach(item => {
        const minRate = Math.round(item.min * multiplier);
        const maxRate = Math.round(item.max * multiplier);
        const modalRate = Math.round(item.avg * multiplier);
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.mandi}</strong></td>
            <td>${varietyName}</td>
            <td>₹${minRate.toLocaleString()}</td>
            <td>₹${maxRate.toLocaleString()}</td>
            <td><strong>₹${modalRate.toLocaleString()}</strong></td>
            <td>${item.arrival}</td>
        `;
        tableBody.appendChild(row);
    });
}

// --- Soil Compatibility Calculator Engine ---
function calculateSoilCompatibility() {
    const N = parseFloat(document.getElementById("nitrogen").value);
    const P = parseFloat(document.getElementById("phosphorus").value);
    const K = parseFloat(document.getElementById("potassium").value);
    const pH = parseFloat(document.getElementById("phLevel").value);
    
    // Soil calculation algorithm (ranks suitability out of 100%)
    const crops = [
        {
            name: "Wheat (गेहूं)",
            score: calculateCropSuitability(N, P, K, pH, { N: 60, P: 40, K: 40, pHMin: 6.0, pHMax: 7.2 }),
            detail: "Wheat prefers moderately neutral soils (pH 6-7). Nitrogen is essential during initial tilling."
        },
        {
            name: "Paddy/Rice (धान)",
            score: calculateCropSuitability(N, P, K, pH, { N: 70, P: 35, K: 45, pHMin: 5.5, pHMax: 6.6 }),
            detail: "Paddy prefers acidic to neutral soils (pH 5.5-6.5). Enjoys higher Nitrogen water-retained soil."
        },
        {
            name: "Potato (आलू)",
            score: calculateCropSuitability(N, P, K, pH, { N: 50, P: 30, K: 70, pHMin: 5.0, pHMax: 6.0 }),
            detail: "Potatoes thrive in highly acidic soil (pH 5-6). Potassium (K) is vital for tuber growth size."
        },
        {
            name: "Cotton (कपास)",
            score: calculateCropSuitability(N, P, K, pH, { N: 55, P: 50, K: 50, pHMin: 6.0, pHMax: 8.0 }),
            detail: "Cotton has a wide tolerance, preferring alkaline soil (pH 6-8) with good drainage."
        }
    ];
    
    // Sort crops by score descending
    crops.sort((a, b) => b.score - a.score);
    
    // Render results
    const resultsContainer = document.getElementById("soilResults");
    const rankingsList = document.getElementById("cropRankings");
    
    rankingsList.innerHTML = "";
    
    crops.forEach((crop, index) => {
        const item = document.createElement("div");
        item.className = "crop-rank-item";
        item.innerHTML = `
            <div class="rank-crop-details">
                <span class="rank-number">#${index + 1}</span>
                <div>
                    <span class="crop-name-label">${crop.name}</span>
                    <p style="font-size: 11px; color: var(--color-text-muted); margin: 0;">${crop.detail}</p>
                </div>
            </div>
            <span class="rank-pct">${crop.score}% Match</span>
        `;
        rankingsList.appendChild(item);
    });
    
    // Generate helpful advisory tip based on metrics
    let remedyText = "";
    if (pH < 5.5) {
        remedyText = "Your soil is acidic (pH < 5.5). We recommend applying agricultural lime (calcium carbonate) at 400kg/acre to stabilize pH for wheat and cotton crops.";
    } else if (pH > 7.5) {
        remedyText = "Your soil is alkaline (pH > 7.5). We recommend applying elemental gypsum/sulfur to lower pH. Focus on cotton as it tolerates alkaline conditions well.";
    } else {
        remedyText = "Your soil pH is in the optimal range (6.0 - 7.0). ";
    }
    
    if (N < 45) {
        remedyText += " Nitrogen levels are deficient. Apply 20kg of Neem-coated Urea or organic farm manure at transplant.";
    } else if (K < 40) {
        remedyText += " Potassium levels are slightly low; add Muriate of Potash (MOP) to optimize grain weight.";
    } else {
        remedyText += " Overall soil macronutrients are balanced. Excellent soil health!";
    }
    
    document.getElementById("soilRemedyText").textContent = remedyText;
    
    // Unhide results wrapper
    resultsContainer.style.display = "block";
}

function calculateCropSuitability(N, P, K, pH, targets) {
    // Score based on deviance from target macronutrients and pH
    let deviance = 0;
    
    // Nitrogen deviance (weight 20%)
    deviance += Math.abs(N - targets.N) / targets.N * 20;
    
    // Phosphorus deviance (weight 20%)
    deviance += Math.abs(P - targets.P) / targets.P * 20;
    
    // Potassium deviance (weight 20%)
    deviance += Math.abs(K - targets.K) / targets.K * 20;
    
    // pH deviance (weight 40% - critical metric)
    if (pH < targets.pHMin) {
        deviance += Math.abs(targets.pHMin - pH) / targets.pHMin * 40 * 2.5; // weight heavy for bad pH
    } else if (pH > targets.pHMax) {
        deviance += Math.abs(pH - targets.pHMax) / targets.pHMax * 40 * 2.5;
    }
    
    // Convert deviance to percentage score (bounded between 30% and 98%)
    let score = Math.round(100 - deviance);
    if (score > 98) score = 98;
    if (score < 35) score = 35;
    
    return score;
}

// Helper: Toast notifications
function showToast(message) {
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "var(--color-primary-dark)";
    toast.style.color = "var(--color-white)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "var(--border-radius-md)";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    toast.style.zIndex = "2000";
    toast.style.fontSize = "13px";
    toast.style.fontFamily = "Inter";
    toast.style.animation = "slideUp 0.3s ease";
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// --- Dynamic Profile Management (localStorage & Device uniqueness) ---
function setupProfileLogic() {
    const profileTrigger = document.getElementById("profileTrigger");
    const settingsBtn = document.getElementById("settingsBtn");
    const profileModal = document.getElementById("profileModal");
    const closeProfileModal = document.getElementById("closeProfileModal");
    const editNameInput = document.getElementById("editName");
    const editRegionInput = document.getElementById("editRegion");

    // Load initial values from localStorage or default
    const savedName = localStorage.getItem("farmer_name") || "Praveen";
    const savedRegion = localStorage.getItem("farmer_region") || "Kallakurichi";

    updateProfileUI(savedName, savedRegion);

    if (profileTrigger) {
        profileTrigger.addEventListener("click", openModal);
    }
    if (settingsBtn) {
        settingsBtn.addEventListener("click", openModal);
    }
    if (closeProfileModal) {
        closeProfileModal.addEventListener("click", closeModal);
    }

    // Close on click outside modal content
    if (profileModal) {
        profileModal.addEventListener("click", (e) => {
            if (e.target === profileModal) {
                closeModal();
            }
        });
    }

    function openModal() {
        const currentName = document.getElementById("farmerNameLabel").textContent;
        const currentRegion = document.getElementById("farmerRegionLabel").textContent;
        editNameInput.value = currentName;
        editRegionInput.value = currentRegion;
        profileModal.style.display = "flex";
    }

    function closeModal() {
        profileModal.style.display = "none";
    }
}

function saveProfileData() {
    const editName = document.getElementById("editName").value.trim();
    const editRegion = document.getElementById("editRegion").value.trim();
    
    if (editName && editRegion) {
        localStorage.setItem("farmer_name", editName);
        localStorage.setItem("farmer_region", editRegion);
        
        updateProfileUI(editName, editRegion);
        
        // Close modal
        document.getElementById("profileModal").style.display = "none";
        showToast("Profile settings saved successfully.");
    }
}

function updateProfileUI(name, region) {
    const nameLabel = document.getElementById("farmerNameLabel");
    const regionLabel = document.getElementById("farmerRegionLabel");
    
    if (nameLabel) nameLabel.textContent = name;
    if (regionLabel) regionLabel.textContent = region;
    
    // Update welcome header card
    const firstWord = name.split(" ")[0];
    
    // Update translations with the user's name
    TRANSLATIONS.en.welcome = `Welcome back, ${firstWord}!`;
    TRANSLATIONS.hi.welcome = `स्वागत है, ${name}!`;
    
    // Re-run UI translation to apply the name changes
    translateUI(currentLanguage);
}

