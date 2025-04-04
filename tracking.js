// Configuración centralizada
const trackingConfig = {
    email: 'romandominguezgarcia.01@gmail.com',
    sessionStorageKey: 'portfolioInteractions',
    trackedEvents: []
  };
  
  // Función mejorada para tracking
  const trackInteraction = async (eventName, metadata = {}) => {
    // Evitar duplicados en esta sesión
    if(trackingConfig.trackedEvents.includes(eventName)) return;
    
    const formData = new FormData();
    formData.append('_subject', `Interacción en portfolio: ${eventName}`);
    formData.append('event', eventName);
    formData.append('timestamp', new Date().toISOString());
    formData.append('page', window.location.pathname);
    
    // Agregar metadata adicional
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${trackingConfig.email}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      if(response.ok) {
        trackingConfig.trackedEvents.push(eventName);
        console.log(`Evento ${eventName} registrado`);
      }
    } catch (error) {
      console.error(`Error registrando ${eventName}:`, error);
    }
  };
  
  // 1. Tracking del Footer (versión mejorada)
  const setupFooterTracking = () => {
    const footer = document.querySelector('footer');
    if(!footer) return;
  
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        trackInteraction('footer-reached', {
          interactionTime: `${(performance.now() / 1000).toFixed(1)}s`,
          scrollDepth: '100%'
        });
        observer.disconnect(); // Dejar de observar
      }
    }, { threshold: 0.5 });
  
    observer.observe(footer);
  };
  
  // 2. Tracking del QR Code
  const setupQRTracking = () => {
    document.querySelectorAll('[data-qr-tracking]').forEach(qr => {
      qr.addEventListener('click', () => {
        trackInteraction('qr-click', {
          destination: qr.href || qr.dataset.url,
          elementPosition: getElementPosition(qr)
        });
      });
    });
  };
  
  // 3. Tracking de enlaces a proyectos
  const setupProjectLinksTracking = () => {
    document.querySelectorAll('a[data-project]').forEach(link => {
      link.addEventListener('click', (e) => {
        trackInteraction('project-link-click', {
          projectName: link.dataset.project,
          linkType: link.dataset.linkType || 'code',
          url: link.href
        });
        
        // Opcional: retraso para asegurar el tracking
        if(link.target !== '_blank') {
          e.preventDefault();
          setTimeout(() => window.location = link.href, 150);
        }
      });
    });
  };

  // Agrega esto a tus funciones de tracking
const setupLinkedInTracking = () => {
    const linkedInLinks = document.querySelectorAll('a[href*="linkedin.com"]');
    
    linkedInLinks.forEach(link => {
      // Verificar si es tu perfil personal
      const isProfileLink = link.href.includes('/in/tu-usuario') || 
                           link.href.includes('/company/tu-empresa');
      
      link.addEventListener('click', (e) => {
        // Solo trackear si es un enlace a tu perfil/empresa
        if(isProfileLink) {
          const metadata = {
            linkText: link.innerText.trim(),
            linkPosition: getElementPosition(link),
            destination: link.href
          };
          
          trackInteraction('linkedin-click', metadata);
          
          // Opcional: pequeño retraso para asegurar el tracking
          if(!link.target || link.target !== '_blank') {
            e.preventDefault();
            setTimeout(() => {
              window.location.href = link.href;
            }, 200);
          }
        }
      });
    });
  };
  
  // 4. Tracking de secciones visibles
  const setupSectionTracking = () => {
    document.querySelectorAll('section[data-section-name]').forEach(section => {
      const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
          trackInteraction('section-view', {
            sectionName: section.dataset.sectionName,
            viewTime: new Date().toLocaleTimeString(),
            scrollPosition: `${window.scrollY}px`
          });
        }
      }, { threshold: 0.3 });
      
      observer.observe(section);
    });
  };
  
  // Función auxiliar para posición de elementos
  const getElementPosition = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      visibility: `${(rect.top / window.innerHeight * 100).toFixed(1)}%`
    };
  };
  
  // Inicializar todos los trackers
  document.addEventListener('DOMContentLoaded', () => {
    setupFooterTracking();
    setupQRTracking();
    setupProjectLinksTracking();
    setupLinkedInTracking();
    setupSectionTracking();
  });