document.addEventListener("DOMContentLoaded", () => {
      
      // 1. Tratamento do Vídeo (Forçando a exibição e autoplay)
      const video = document.getElementById('heroVideo');
      
      if (video) {
        video.classList.add('loaded');
        
        video.addEventListener('ended', () => {
            video.pause();
        });

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Autoplay impedido pelo navegador. Mantendo poster estático.", error);
          });
        }
      }

      // 3. Header Oculto no Scroll Down & Scroll Progress
      let lastScroll = 0;
      const header = document.querySelector('.site-header');
      const scrollProgress = document.querySelector('.scroll-progress');

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Esconder Header
        if (currentScroll > 100 && currentScroll > lastScroll) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
        lastScroll = currentScroll;

        // Barra de progresso
        if (scrollProgress) {
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (currentScroll / height) * 100;
          scrollProgress.style.width = scrolled + "%";
        }
      });

      // 2. Cursor Customizado
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const cursor = document.getElementById('cursor');
        
        if (cursor) {
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            
            gsap.ticker.add(() => {
                cursorX += (mouseX - cursorX) * 0.2;
                cursorY += (mouseY - cursorY) * 0.2;
                cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            });

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const interactives = document.querySelectorAll('.interactive, a, button');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        }
      }

      // 3. Montar o Marquee via Template
      const marqueeTrack = document.getElementById('marqueeTrack');
      const marqueeTemplate = document.getElementById('marqueeTemplate');
      
      if (marqueeTrack && marqueeTemplate) {
        for (let i = 0; i < 4; i++) {
          marqueeTrack.appendChild(marqueeTemplate.content.cloneNode(true));
        }
      }

      // 4. Animações com GSAP & SplitType
      gsap.registerPlugin(ScrollTrigger);

      // Aguarda as fontes carregarem para que o SplitType calcule as larguras corretamente!
      document.fonts.ready.then(() => {
        const splitHeadline = new SplitType('.hero-section .gs-reveal-split', { types: 'lines, words', tagName: 'span' });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Prepara as linhas separadas para animação
        gsap.set(splitHeadline.lines, { overflow: 'hidden' });
        gsap.set(splitHeadline.words, { y: '100%' });
        gsap.set('.hero-section .gs-reveal-split', { opacity: 1 }); // Revela o container

        // Timeline da Hero Section (Mais lenta)
        tl.to('.hero-section .eyebrow', { y: 0, opacity: 1, duration: 1.5, delay: 0.2 })
          .to(splitHeadline.words, {
            y: '0%',
            duration: 1.8,
            stagger: 0.08, // Revela as palavras mais devagar
            ease: "power4.out"
          }, "-=1.0")
          .to('.hero-section .subheadline', { y: 0, opacity: 1, duration: 1.5 }, "-=1.2")
          .to('.hero-actions', { y: 0, opacity: 1, duration: 1.5 }, "-=1.2")
          .to('.gs-reveal-video', { x: 0, opacity: 1, duration: 2, ease: "power3.out" }, "-=1.5")
          .to('.hero-stats-wrapper .stat-card', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2
          }, "-=1.5")
          .to('.hero-marquee-wrapper', { y: 0, opacity: 1, duration: 1.5 }, "-=1.0");
      });

      // ScrollTriggers genéricos para animações
        gsap.utils.toArray('section:not(.hero-section) .gs-reveal').forEach(function(elem) {
          ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            onEnter: function() {
              gsap.to(elem, {y: 0, opacity: 1, duration: 0.8, ease: "power3.out"});
            },
            once: true
          });
        });

        // Revela títulos divididos em linhas nas dobras seguintes
        gsap.utils.toArray('section:not(.hero-section) .solution-title, section:not(.hero-section) .trajetoria-title, section:not(.hero-section) .mentoria-title, section:not(.hero-section) .estacoes-title, section:not(.hero-section) .perguntas-title, section:not(.hero-section) .contato-title').forEach(function(title) {
          const lines = title.querySelectorAll('.gs-reveal-split');
          if (lines.length > 0) {
            gsap.set(lines, { y: '100%', opacity: 0 });
            ScrollTrigger.create({
              trigger: title,
              start: "top 85%",
              onEnter: function() {
                gsap.to(lines, {
                  y: '0%', 
                  opacity: 1, 
                  duration: 1, 
                  stagger: 0.1, 
                  ease: "power4.out"
                });
              },
              once: true
            });
          }
        });

        gsap.utils.toArray('section:not(.hero-section) .gs-reveal-stagger').forEach(function(elem) {
          ScrollTrigger.create({
            trigger: elem,
            start: "top 85%",
            onEnter: function() {
              gsap.to(elem.children, {y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out"});
            },
            once: true
          });
        });

        // COUNT-UP ANIMATION PARA BIG NUMBERS
        gsap.utils.toArray('.count-up').forEach(function(el) {
          const target = parseFloat(el.getAttribute('data-target'));
          const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
          const obj = { val: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: function() {
              gsap.to(obj, {
                val: target,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: function() {
                   el.innerText = obj.val.toFixed(decimals).replace('.', ',');
                }
              });
            },
            once: true
          });
        });

        // FAQ Accordion
        document.querySelectorAll('.faq-summary').forEach(button => {
          button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');
            
            // Fecha outros items
            document.querySelectorAll('.faq-item').forEach(other => {
              other.classList.remove('is-open');
              other.querySelector('.faq-summary').setAttribute('aria-expanded', 'false');
            });
            
            // Abre o clicado
            if (!isOpen) {
              item.classList.add('is-open');
              button.setAttribute('aria-expanded', 'true');
            }
          });
        });

        // PARALLAX GLOBAL NAS DOBRAS SEGUINTES (Blocos subindo suavemente)
        // Aplicado no contêiner inteiro para evitar que o título atropele o "Eyebrow"
        gsap.utils.toArray('.problem-header, .solution-content, .trajetoria-header, .atuacao-header, .mentoria-content').forEach(function(elem) {
          // O ScrollTrigger com scrub garante o movimento vinculado à rolagem
          gsap.to(elem, {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: elem,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5
            }
          });
        });

        // ---------------------------------------------------------
        // ANIMAÇÃO BLUEPRINT DA TRAJETÓRIA (Régua de Engenharia)
        // ---------------------------------------------------------
        const rulerWrapper = document.querySelector(".timeline-ruler-wrapper");
        if(rulerWrapper) {
          // 1. A régua "cresce" para baixo ancorada ao scroll
          gsap.fromTo('.engineering-ruler', 
            { clipPath: 'inset(0 0 100% 0)' }, 
            { 
              clipPath: 'inset(0 0 0% 0)',
              ease: 'none',
              scrollTrigger: {
                trigger: '.timeline-ruler-wrapper',
                start: "top 75%",
                end: "bottom 75%",
                scrub: 1
              }
            }
          );

          // 2. Elementos de cada marco surgem em sequência animada
          gsap.utils.toArray('.timeline-item').forEach(function(item) {
            const node = item.querySelector('.timeline-node');
            const content = item.querySelectorAll('.timeline-period, .timeline-role, .timeline-desc');
            
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top 85%", // Dispara quando o marco entra bem na tela
                toggleActions: "play none none reverse"
              }
            });
            
            // Desenha a linha horizontal a partir da régua
            tl.fromTo(item, 
              { "--connector-width": "0rem" }, 
              { "--connector-width": "2rem", duration: 0.4, ease: "power2.out" }
            )
            // Círculo (nó) dá um "pop"
            .from(node, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.2")
            // Textos deslizam suavemente
            .from(content, { x: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }, "-=0.2");
          });
        }

        // ---------------------------------------------------------
        // SWIPER INIT (Estações e Captação)
        // ---------------------------------------------------------
        const swiperEstacoes = new Swiper('.estacoes-swiper', {
          slidesPerView: 'auto',
          spaceBetween: 24,
          grabCursor: true,
          rewind: true, /* Troca loop por rewind para não duplicar no DOM */
          speed: 800,
          navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
          },
          autoplay: {
            delay: 3500,
            disableOnInteraction: true,
          },
          breakpoints: {
            320: {
              spaceBetween: 16
            },
            1024: {
              spaceBetween: 24
            }
          }
        });

        // ---------------------------------------------------------
        // SWIPER INIT (Infraestrutura - 3D Coverflow)
        // ---------------------------------------------------------
        const swiperInfra = new Swiper('.infra-swiper', {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          initialSlide: 1, /* Começa na imagem do meio */
          coverflowEffect: {
            rotate: 20,      /* Ângulo de rotação 3D mais dramático */
            stretch: 0,
            depth: 250,      /* Profundidade do eixo Z */
            modifier: 1.5,   /* Multiplicador do efeito */
            slideShadows: false, 
          },
          pagination: {
            el: '.infra-pagination',
            clickable: true,
          },
          autoplay: {
            delay: 4500,
            disableOnInteraction: true,
          }
        });

        // Ícones e caixas descem levemente para dar profundidade cruzada
        gsap.utils.toArray('.problem-icon-wrapper, .solution-panel').forEach(function(elem) {
          gsap.to(elem, {
            y: 40,
            ease: "none",
            scrollTrigger: {
              trigger: elem,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5
            }
          });
        });

      });