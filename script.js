document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("nav-links").classList.toggle("active");
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

//ya no es necesario pq se cambio por: se uso html {    scroll-behavior: smooth; /* Habilita el desplazamiento suave en toda la página */}
// // Desplazamiento suave para el botón "Ver mis proyectos"
// document.querySelector('.boton-llamada').addEventListener('click', function (e) {
//     e.preventDefault(); // Evita el comportamiento predeterminado del enlace
//     const targetId = this.getAttribute('href'); // Obtiene el ID de la sección de proyectos
//     const targetSection = document.querySelector(targetId); // Selecciona la sección de proyectos
//     targetSection.scrollIntoView({
//         behavior: 'smooth', // Desplazamiento suave
//         block: 'start'      // Alinea la sección en la parte superior de la ventana
//     });
// }); 

// Detectar cuando una sección es visible
const secciones = document.querySelectorAll('section');

var therS = 0.3;
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }

        if(secciones.seccion == 'proyectos'){
            entry.target.classList.add('visible');
            therS = 0.1
        }else{
            therS = 0.4
        }

        console.log(therS);
    });
}, {
    threshold: therS // Activar la animación cuando el 10% de la sección sea visible
});

// Observar cada sección
secciones.forEach(seccion => {
    observer.observe(seccion);
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