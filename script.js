document.getElementById("menu-toggle").addEventListener("click", function() {
    const navLinks = document.getElementById("nav-links");

    if (navLinks.classList.contains("active")) {

        setTimeout(() => navLinks.classList.remove("active"), 400); // Espera a que termine la animación
    } else {
        navLinks.classList.add("active");
        navLinks.style.maxHeight = "300px"; // Ajusta según el contenido
    }
});

// Cerrar el menú cuando se hace clic en un enlace con animación
document.querySelectorAll("#nav-links li a").forEach(link => {
    link.addEventListener("click", function() {
        const navLinks = document.getElementById("nav-links");
        setTimeout(() => navLinks.classList.remove("active"), 400);
    });
});


// Navegación suave mejorada
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});


















document.addEventListener('DOMContentLoaded', function() {
    // Configuración del QR flotante
    const qrFixed = document.querySelector('.qr-fixed');
    const secciones = document.querySelectorAll('section');
    let lastScroll = window.pageYOffset;
    let ticking = false;

    // 1. Manejo del QR flotante
    const updateQrVisibility = () => {
        const currentScroll = window.pageYOffset;
        
        // Comportamiento del QR
        if (qrFixed) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll hacia abajo
                qrFixed.style.opacity = '0';
                qrFixed.style.pointerEvents = 'none';
                qrFixed.style.transform = 'translateY(20px)';
            } else {
                // Scroll hacia arriba
                qrFixed.style.opacity = '1';
                qrFixed.style.pointerEvents = 'auto';
                qrFixed.style.transform = 'translateY(0)';
            }
        }

        // 2. Manejo de las secciones
        secciones.forEach(seccion => {
            const rect = seccion.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8) && 
                            (rect.bottom >= window.innerHeight * 0.2);

            if (isVisible) {
                seccion.classList.add('visible');
                seccion.classList.remove('hidden');
            } else {
                // Solo ocultar si no es la sección actual
                if (currentScroll > rect.bottom || currentScroll < rect.top) {
                    seccion.classList.remove('visible');
                    seccion.classList.add('hidden');
                }
            }
        });

        lastScroll = currentScroll;
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateQrVisibility);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);

    // 3. Intersection Observer para animaciones iniciales
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
            }
        });
    }, {
        threshold: 0.9
    });

    // Observar cada sección
    secciones.forEach(seccion => {
        observer.observe(seccion);
    });

    // Inicializar con el estado correcto
    updateQrVisibility();
});


// Ocultar/mostrar el navbar al hacer scroll
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.classList.remove('hide');
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('hide')) {
        navbar.classList.add('hide');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hide')) {
        navbar.classList.remove('hide');
    }

    lastScroll = currentScroll;
});


// Mover el cursor secundario con un ligero retraso
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    setTimeout(() => {
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    }, 50);
});

// Resaltar la sección activa en el navbar
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Verifica si la sección está en la vista
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Compara el href del enlace con el ID de la sección activa
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const images = inner.querySelectorAll("img");
        let index = 0;

        function updateCarousel() {
            inner.style.transform = `translateX(-${index * 100}%)`;
        }

        prevBtn.addEventListener("click", function() {
            index = (index - 1 + images.length) % images.length;
            updateCarousel();
        });

        nextBtn.addEventListener("click", function() {
            index = (index + 1) % images.length;
            updateCarousel();
        });
    });
});











document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya se envió el formulario en esta sesión
    if(sessionStorage.getItem('visitTracked')) return;
    
    // Obtener más datos del visitante
    const visitData = {
      _subject: `Visita a tu portafolio - ${new Date().toLocaleDateString()}`,
      url: window.location.href,
      time: new Date().toLocaleString(),
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'Móvil' : 'Escritorio',
      screen: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || 'Directo'
    };
  
    // Configurar los encabezados
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    
    // Configurar el cuerpo del envío
    const formData = new FormData();
    for(const key in visitData) {
      formData.append(key, visitData[key]);
    }
  
    // Enviar los datos
    fetch('https://formsubmit.co/ajax/romandominguezgarcia.01@gmail.com', {
      method: 'POST',
      headers: headers,
      body: formData,
      mode: 'cors' // Importante para peticiones entre dominios
    })
    .then(response => {
      if(response.ok) {
        sessionStorage.setItem('visitTracked', 'true');
        console.log('Visita registrada exitosamente');
      }
    })
    .catch(error => {
      console.error('Error al registrar visita:', error);
      // Opcional: Reintentar después de un tiempo
      setTimeout(() => {
        fetch('https://formsubmit.co/ajax/romandominguezgarcia.01@gmail.com', {
          method: 'POST',
          headers: headers,
          body: formData
        });
      }, 5000);
    });
  });







