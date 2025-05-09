// Cargar configuración
// const DEFAULT_LANGUAGE = 'en';
// const SUPPORTED_LANGUAGES = ['en', 'es'];

let currentLang = DEFAULT_LANGUAGE;

// Función para cargar traducciones dinámicamente
function loadLanguage(lang) {
    return new Promise((resolve) => {
        if (window.translations && window.translations[lang]) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `js/lang/${lang}.js`;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

// Función para extraer parámetros de la URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Función para cambiar la URL (sin recargar la página)
function updateUrlLangParam(lang) {
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLang = lang;
    applyTranslations();
    localStorage.setItem('userLanguage', lang);
    updateUrlLangParam(lang); // Actualiza parámetro en URL
}

function toggleLanguage() {
    setLanguage(currentLang === 'es' ? 'en' : 'es');
}

function applyTranslations() {
    document.body.classList.add('changing-language');

    // Elementos de texto normal
    const textElements = document.querySelectorAll('[data-i18n]');
    textElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Atributos ALT
    const altElements = document.querySelectorAll('[data-i18n-alt]');
    altElements.forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (translations[currentLang][key]) {
            element.setAttribute('alt', translations[currentLang][key]);
            // Si es un enlace, actualizamos también aria-label
            if (element.parentElement.tagName === 'A') {
                element.parentElement.setAttribute('aria-label', translations[currentLang][key]);
            }
        }
    });

    // Actualizar botón de idioma
    const langBtn = document.querySelector('.language-btn');
    if (langBtn) {
        langBtn.textContent = currentLang.toUpperCase();
        langBtn.setAttribute('data-i18n', 'current-language');
    }

    setTimeout(() => {
        document.body.classList.remove('changing-language');
    }, 300);
}

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', async () => {
    const urlLang = getUrlParam('lang');
    const savedLang = localStorage.getItem('userLanguage');
    const browserLang = navigator.language.slice(0, 2);
    
    const lang = SUPPORTED_LANGUAGES.includes(urlLang) ? urlLang :
                SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang :
                SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 
                DEFAULT_LANGUAGE;

    await loadLanguage(lang);
    setLanguage(lang);
});


// window.toggleLanguage = function() {
//     setLanguage(currentLang === 'es' ? 'en' : 'es');
// };

// window.addEventListener('popstate', () => {
//     const newLang = getLanguageFromUrl();
//     if (newLang && translations[newLang]) {
//         setLanguage(newLang);
//     }
// });