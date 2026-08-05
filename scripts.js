/* scripts.js — entrance animations + SVG petals + particles
   - Staggered entrance using [data-anim]
   - Generates falling SVG petals in #petals
   - Renders light background particles on #particles-canvas
   - Respects prefers-reduced-motion and low-device heuristics
*/
(function(){
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const lowPower = navigator.deviceMemory && navigator.deviceMemory < 1.5;

  // STAGGERED ENTRANCE
  function runEntrance(){
    const invite = document.getElementById('invite');
    if(invite){
      requestAnimationFrame(()=> invite.classList.add('is-visible'));
    }

    const nodes = Array.from(document.querySelectorAll('[data-anim]'))
      .sort((a,b)=> (parseInt(a.dataset.anim)||0) - (parseInt(b.dataset.anim)||0));

    nodes.forEach((el, idx) => {
      const delay = 180 * idx; // ms
      setTimeout(()=>{
        el.classList.add('animated');
        // wrap text in reveal span if necessary
        if(el.classList.contains('reveal-text') && !el.querySelector('span')){
          const txt = el.textContent.trim();
          el.innerHTML = '<span>' + txt + '</span>';
        }
        if(el.classList.contains('button')) el.classList.add('animate-in');
      }, delay);
    });
  }

  // SVG Petal generator
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function createSvgPetal(){
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('class','petal');
    // create a teardrop path
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d','M12 2 C15 4 19 6 19 10 C19 15 15 18 12 22 C9 18 5 15 5 10 C5 6 9 4 12 2 Z');
    // fill/stroke matching palette (fallback hardcoded)
    path.setAttribute('fill','#FBEFF0'); // rose-light
    path.setAttribute('stroke','#C79282'); // rose-gold
    path.setAttribute('stroke-opacity','0.12');
    path.setAttribute('stroke-width','0.4');
    svg.appendChild(path);

    // initial placement
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const startLeft = Math.random() * vw;
    const size = 12 + Math.random()*22; // 12-34px

    svg.style.position = 'absolute';
    svg.style.left = startLeft + 'px';
    svg.style.top = '-10vh';
    svg.style.width = size + 'px';
    svg.style.height = (size * 1.2) + 'px';
    svg.style.opacity = (0.6 + Math.random()*0.45).toFixed(2);
    svg.style.transform = `rotate(${Math.random()*360}deg)`;

    const duration = 7000 + Math.random()*9000; // 7-16s
    const delay = Math.random()*1500;
    svg.style.animation = `fall ${duration}ms linear ${delay}ms forwards`;

    const container = document.getElementById('petals');
    if(container) container.appendChild(svg);

    // remove after animation
    setTimeout(()=>{ svg.remove(); }, duration + delay + 600);
  }

  function startPetals(){
    if(prefersReduced || isMobile || lowPower) return null;
    // initial burst
    for(let i=0;i<6;i++) createSvgPetal();
    const interval = setInterval(()=>{
      createSvgPetal();
      if(Math.random()>0.92) createSvgPetal();
    }, 700);
    return interval;
  }

  // PARTICLES (canvas)
  function startParticles(){
    if(prefersReduced || isMobile || lowPower) return null;
    const canvas = document.getElementById('particles-canvas');
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;

    function Particle(){
      this.x = Math.random()*w;
      this.y = Math.random()*h;
      this.vx = (Math.random()-0.5)*0.2;
      this.vy = -0.05 - Math.random()*0.25;
      this.r = 0.6 + Math.random()*1.8;
      this.alpha = 0.28 + Math.random()*0.5;
    }
    Particle.prototype.step = function(){
      this.x += this.vx; this.y += this.vy;
      if(this.y < -10){ this.y = h + 10; this.x = Math.random()*w; }
    };

    const density = Math.max(6, Math.round((w*h)/90000));
    const particles = new Array(density).fill(0).map(()=> new Particle());

    function onResize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    window.addEventListener('resize', onResize);

    let raf;
    function loop(){
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        p.step();
        ctx.beginPath();
        ctx.fillStyle = `rgba(235,224,222,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }

  // INIT
  window.addEventListener('load', ()=>{
    runEntrance();
    const petalsInterval = startPetals();
    const stopParticles = startParticles();

    // stop producing petals after 45s to preserve perf
    if(petalsInterval) setTimeout(()=> clearInterval(petalsInterval), 45000);
  });

})();
