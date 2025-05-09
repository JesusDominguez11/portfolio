// ================= CONFIGURACIÓN =================
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'es'];
const MIN_LOADING_TIME = 500; // Tiempo mínimo de visualización del loader (ms)

// ================= VARIABLES GLOBALES =================
let currentLang = DEFAULT_LANGUAGE;
let translations = {};

// ================= FUNCIONES CORE =================

/**
 * Inicializa el sistema de idiomas
 */
async function initLanguageSystem() {
    showLoadingOverlay();
    
    const lang = determinePreferredLanguage();

    await setLanguage(lang);

    hideLoadingOverlay();
}

/**
 * Determina el idioma preferido basado en URL, localStorage y navegador
 */
function determinePreferredLanguage() {
    const urlLang = getUrlParam('lang');
    const savedLang = localStorage.getItem('userLanguage');
    const browserLang = navigator.language.slice(0, 2);

    return SUPPORTED_LANGUAGES.includes(urlLang) ? urlLang :
           SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang :
           SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 
           DEFAULT_LANGUAGE;
}

/**
 * Cambia al idioma especificado
 */
async function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang) || currentLang === lang) return;

    try {
        showLoadingOverlay();

        // Cargar traducciones si no están en memoria
        if (!translations[lang]) {
            await loadTranslations(lang);
        }
        
        // Aplicar traducciones con tiempo mínimo de carga
        await Promise.all([
            applyTranslations(lang),
            new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME))
        ]);
        
        // Actualizar estado
        currentLang = lang;
        persistLanguagePreference(lang);

    } catch (error) {
        console.error('Error changing language:', error);
        throw error;
    } finally {
        hideLoadingOverlay();
    }
}

/**
 * Alterna entre los idiomas disponibles
 */
function toggleLanguage() {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
}

// ================= FUNCIONES DE APOYO =================

async function loadTranslations(lang) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/lang/${lang}.js`;
        script.onload = () => {
            if (window.translations && window.translations[lang]) {
                translations[lang] = window.translations[lang];
                resolve();
            } else {
                reject(new Error(`Translation file for ${lang} did not load correctly`));
            }
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function applyTranslations(lang) {
    // Traducir textos
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Traducir atributos alt y aria-label
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        if (translations[lang]?.[key]) {
            el.setAttribute('alt', translations[lang][key]);
            if (el.parentElement.tagName === 'A') {
                el.parentElement.setAttribute('aria-label', translations[lang][key]);
            }
        }
    });

    // Actualizar botón de idioma
    const langBtn = document.querySelector('.language-btn');
    if (langBtn) {
        langBtn.textContent = lang.toUpperCase();
    }
}

function persistLanguagePreference(lang) {
    localStorage.setItem('userLanguage', lang);
    updateUrlParam('lang', lang);
}

// ================= FUNCIONES UTILITARIAS =================

function getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function updateUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

function showLoadingOverlay() {
    const loader = document.getElementById('languageLoader');
    if (loader) {
        loader.style.display = 'flex';
        setTimeout(() => loader.classList.remove('hidden'), 1);
    }
    document.body.classList.add('changing-language');
}

function hideLoadingOverlay() {
    const loader = document.getElementById('languageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Match CSS transition duration
    }
    document.body.classList.remove('changing-language');
}

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', initLanguageSystem);

// ================= EXPORTACIÓN PARA USO GLOBAL =================
window.toggleLanguage = toggleLanguage;
window.setLanguage = setLanguage;