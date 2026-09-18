/* ── Hide Netlify badge ── */
(function(){
  function removeNetlify(){
    document.querySelectorAll('[data-netlify-identity-menu],[data-netlify],#netlify-identity-widget,.netlify-badge,netlify-identity-widget').forEach(el=>el.remove());
    document.querySelectorAll('a[href*="netlify.com"],a[href*="netlify.app"]').forEach(el=>{
      let node=el;
      while(node&&node!==document.body){const s=node.getAttribute&&node.getAttribute('style');if(s&&(s.includes('fixed')||s.includes('z-index'))){node.remove();return;}node=node.parentElement;}
      el.closest('div,aside,section')?.remove();
    });
    document.querySelectorAll('script[src*="netlify"]').forEach(el=>el.remove());
  }
  removeNetlify();
  document.addEventListener('DOMContentLoaded',removeNetlify);
  window.addEventListener('load',removeNetlify);
  new MutationObserver(removeNetlify).observe(document.documentElement,{childList:true,subtree:true});
})();

const app = document.querySelector('#app');

function icon(name){
  const icons={book:'▣',water:'◒',community:'✦',library:'▤',arrow:'→',dorm:'⬡',phone:'◈',email:'◉',fb:'ƒ'};
  return icons[name]||name||'•';
}

function render(d){
  const c = d.contact;
  const s = d.story;
  const f = d.founder;
  const h = d.hero;

  app.innerHTML=`
    <div id="progress-bar"></div>

    <header class="nav" id="nav">
      <div class="container nav-inner">
        <a class="brand" href="#home"><span class="logo">A</span><span>Ayaa</span></a>
        <button class="menu" id="menu" aria-label="Open menu">☰</button>
        <nav class="nav-links" id="links">
          <a href="#story">Story</a>
          <a href="#gallery">Gallery</a>
          <a href="#watch">Watch</a>
          <a href="#impact">Impact</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <main>

      <!-- HERO -->
      <section class="hero" id="home">
        <div class="hero-blob"></div>
        <div class="hero-blob-2"></div>
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">${h.eyebrow}</div>
            <h1>${h.headline}</h1>
            <p>${h.description}</p>
            <div class="actions">
              <a class="btn btn-primary" href="#story">Our story ${icon('arrow')}</a>
              <a class="btn btn-ghost" href="#contact">Get involved</a>
            </div>
          </div>
          <div class="hero-card" aria-label="Students and community at Ayaa">
            <img src="${h.heroImage}" alt="Ayaa school community" class="hero-card-img"/>
            <div class="hero-art"></div>
            <div class="hero-card-content">
              <span>${h.cardSpan}</span>
              <h3>${h.cardHeading}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- STORY -->
      <section id="story">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">The beginning</div><h2>A school born from sacrifice.</h2></div>
            <p>From the Lost Boys of Sudan to the United States Army — and back home to build something that lasts.</p>
          </div>
          <div class="story">
            <div class="story-big reveal">"${s.quote}"</div>
            <div class="story-copy reveal">
              <p>${s.paragraph1}</p>
              <p>${s.paragraph2}</p>
              <p>${s.paragraph3}</p>
              <div class="stats">
                <div class="stat reveal"><strong data-count="2022" data-format="year">2022</strong><span>School opened</span></div>
                <div class="stat reveal"><strong data-count="200" data-format="plus">200+</strong><span>Students enrolled</span></div>
                <div class="stat reveal"><strong>4</strong><span>Senior grades (S1–S4)</span></div>
              </div>
            </div>
          </div>
          <!-- Founder -->
          <div class="founder reveal">
            <div class="founder-photos">
              <div class="founder-photo-wrap">
                <img src="${f.photo}" alt="${f.name}, Founder" class="founder-photo"/>
                <div class="founder-photo-ring"></div>
              </div>
              <div class="founder-photo-wrap founder-army-wrap">
                <img src="${f.armyPhoto}" alt="${f.name} as U.S. Army Sergeant" class="founder-photo founder-army"/>
                <div class="founder-army-badge">U.S. Army</div>
              </div>
            </div>
            <div class="founder-info">
              <div class="eyebrow">Meet the founder</div>
              <h3 class="founder-name">${f.name}</h3>
              <p class="founder-role">${f.role}</p>
              <p class="founder-bio">${f.bio}</p>
              <div class="founder-contact">
                <a href="mailto:${c.email}" class="contact-chip"><span class="chip-icon">✉</span>${c.email}</a>
                <a href="tel:${c.phone.replace(/-/g,'')}" class="contact-chip"><span class="chip-icon">☎</span>${c.phone}</a>
                <a href="${c.facebookSimon}" target="_blank" rel="noopener" class="contact-chip"><span class="chip-icon">f</span>Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GALLERY -->
      <section id="gallery" class="gallery-section">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">Life at Ayaa</div><h2>See the school.</h2></div>
            <p>Real students. Real classrooms. Real community in Magwi County, South Sudan.</p>
          </div>
          <div class="gallery-grid">
            ${d.gallery.map((img,i)=>`
              <figure class="gallery-item${img.tall?' gallery-tall':''}${img.wide?' gallery-wide':''} reveal" ${i>0?`style="--d:${i*0.08}s"`:''}>
                <img src="${img.src}" alt="${img.alt}"/>
                <figcaption>${img.caption}</figcaption>
              </figure>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- WATCH -->
      <section id="watch" class="watch-section">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">Featured story</div><h2>Simon's story, in his own words.</h2></div>
            <p>WaterStep documented Simon Ottaviano's extraordinary journey — from war and displacement to building a school for the next generation.</p>
          </div>
          <div class="watch-layout reveal">
            <div class="video-wrap">
              <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FWaterStep%2Fvideos%2F572520868981967%2F&show_text=false&mute=0"
                scrolling="no" frameborder="0" allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Simon Ottaviano and Ayaa Secondary School — WaterStep"></iframe>
            </div>
            <div class="watch-info">
              <div class="watch-tag">WaterStep · 2023</div>
              <h3 class="watch-title">"South Sudanese Man Endured War to Bring Hope Home"</h3>
              <p class="watch-desc">This film follows Simon Ottaviano's journey — from the Lost Boys of Sudan to Louisville, Kentucky, to the construction of Ayaa Senior Secondary School in South Sudan. It also documents the safe-water project WaterStep brought to the school in 2023.</p>
              <a class="btn btn-primary" href="https://waterstep.org/the-privilege-of-safe-water/" target="_blank" rel="noopener">Read the full story ${icon('arrow')}</a>
            </div>
          </div>
        </div>
      </section>

      <!-- MISSION -->
      <section id="mission">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">What matters</div><h2>More than a classroom.</h2></div>
            <p>Ayaa's work spans education, clean water, and community — building something whole, not just a building.</p>
          </div>
          <div class="feature-grid">
            <article class="feature reveal" style="--d:0s"><div class="icon">${icon('book')}</div><h3>Education</h3><p>A full Senior 1–4 secondary curriculum giving students in Magwi County the credentials and knowledge to shape their own future.</p></article>
            <article class="feature reveal" style="--d:0.12s"><div class="icon">${icon('water')}</div><h3>Safe Water</h3><p>In 2023, WaterStep installed a clean-water system at Ayaa — replacing an expensive and unsafe river-water supply that cost six times a teacher's monthly salary.</p></article>
            <article class="feature reveal" style="--d:0.24s"><div class="icon">${icon('community')}</div><h3>Community</h3><p>Ayaa is a long-term investment in Magwi County — a place for students to learn, gather, play, and grow together.</p></article>
          </div>
        </div>
      </section>

      <!-- IMPACT -->
      <section class="impact" id="impact">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">Progress</div><h2>Turning needs into action.</h2></div>
            <p>Milestones from the school's verified public story.</p>
          </div>
          <div class="impact-grid">
            ${d.impact.map((item,i)=>`
              <article class="impact-card reveal" style="--d:${i*0.13}s">
                <div class="number" data-count="${item.number}" data-format="${item.format}">${item.number}${item.format==='plus'?'+':''}</div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
              </article>
            `).join('')}
          </div>
          <div class="timeline timeline-animated reveal" id="timeline">
            <div class="timeline-item"><strong>01 / FOUNDATION</strong><h3>Education first</h3><p>Ayaa was created as a lasting educational resource for Magwi County — funded entirely by Simon's personal sacrifice.</p></div>
            <div class="timeline-item"><strong>02 / HEALTH</strong><h3>Water and sanitation</h3><p>Clean water became part of the school's infrastructure in 2023, supported by WaterStep.</p></div>
            <div class="timeline-item"><strong>03 / NEXT</strong><h3>Girls' dormitory</h3><p>The next major goal is a girls' dormitory — giving ~100 girls a safe place to live and study without dangerous daily travel.</p></div>
          </div>
        </div>
      </section>

      <!-- PROJECTS -->
      <section id="projects">
        <div class="container">
          <div class="section-head reveal">
            <div><div class="eyebrow">What comes next</div><h2>Help us keep building.</h2></div>
            <p>Each project below represents a real need at Ayaa — and an opportunity to make a lasting difference.</p>
          </div>
          <div class="feature-grid">
            ${d.projects.map((p,i)=>`
              <article class="feature${p.highlight?' feature-highlight':''} reveal" style="--d:${i*0.12}s">
                <div class="icon">🏠</div>
                ${p.highlight?'<div class="feature-badge">Active fundraiser</div>':''}
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                ${p.link?`<a class="btn btn-primary" style="margin-top:24px" href="${p.link}" target="_blank" rel="noopener">${p.linkText} ${icon('arrow')}</a>`:''}
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- CONTACT -->
      <section class="contact-section" id="contact">
        <div class="container">
          <div class="contact-box reveal">
            <div class="contact-box-left">
              <div class="eyebrow">Get involved</div>
              <h2>Ready to help?</h2>
              <p>Whether you want to donate, ask a question, or explore a partnership — Simon would love to hear from you. Every conversation can become part of Ayaa's story.</p>
              <a class="btn btn-primary" href="${d.gofundmeUrl}" target="_blank" rel="noopener">Donate on GoFundMe ${icon('arrow')}</a>
            </div>
            <div class="contact-box-right">
              <div class="contact-card">
                <div class="contact-card-head">
                  <img src="${f.photo}" alt="${f.name}" class="contact-avatar"/>
                  <div><strong>${f.name}</strong><span>Founder &amp; Director · Louisville, KY</span></div>
                </div>
                <div class="contact-links">
                  <a href="mailto:${c.email}" class="contact-row">
                    <div class="contact-row-icon">✉</div>
                    <div class="contact-row-text"><span>Email</span><strong>${c.email}</strong></div>
                  </a>
                  <a href="tel:${c.phone.replace(/-/g,'')}" class="contact-row">
                    <div class="contact-row-icon">☎</div>
                    <div class="contact-row-text"><span>Phone</span><strong>${c.phone}</strong></div>
                  </a>
                  <a href="${c.facebookSchool}" target="_blank" rel="noopener" class="contact-row">
                    <div class="contact-row-icon">f</div>
                    <div class="contact-row-text"><span>School Facebook</span><strong>Ayaa South Sudanese Organization</strong></div>
                  </a>
                  <a href="${c.facebookSimon}" target="_blank" rel="noopener" class="contact-row">
                    <div class="contact-row-icon">f</div>
                    <div class="contact-row-text"><span>Simon's Facebook</span><strong>Simon Ottaviano</strong></div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer>
      <div class="container footer-inner">
        <div class="footer-left">
          <div class="footer-brand">Ayaa South Sudanese Organization</div>
          <div class="footer-note">Headquartered in Louisville, Kentucky, USA</div>
          <div class="footer-note" style="margin-top:4px">Supporting Ayaa Senior Secondary School · Magwi County, South Sudan</div>
          <div class="footer-note" style="margin-top:4px">Founded by ${f.name} · Est. 2022</div>
        </div>
        <div class="footer-contact">
          <a href="mailto:${c.email}" class="footer-link">✉ ${c.email}</a>
          <a href="tel:${c.phone.replace(/-/g,'')}" class="footer-link">☎ ${c.phone}</a>
          <a href="${c.facebookSchool}" target="_blank" rel="noopener" class="footer-link">f School Facebook</a>
        </div>
        <div></div>
      </div>
    </footer>
  `;
}

/* ── Init: load content then render ── */
async function init(){
  try {
    const isPreview = new URLSearchParams(location.search).has('preview');
    const url = isPreview ? '/api/content/preview' : './content.json?t='+Date.now();
    const res = await fetch(url);
    const data = await res.json();
    render(data);
  } catch(e) {
    console.error('Could not load content:', e);
  }
  setupListeners();
}

function setupListeners(){
  /* Nav toggle */
  const menu=document.querySelector('#menu');
  const links=document.querySelector('#links');
  if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
  if(links) links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

  /* Scroll: nav + progress */
  const progressBar=document.querySelector('#progress-bar');
  window.addEventListener('scroll',()=>{
    const nav=document.querySelector('#nav');
    if(nav) nav.classList.toggle('scrolled',scrollY>30);
    if(progressBar){const total=document.documentElement.scrollHeight-innerHeight;progressBar.style.width=(total>0?(scrollY/total)*100:0)+'%';}
  },{passive:true});

  /* Count-up */
  function animateCount(el){
    if(el._counted) return; el._counted=true;
    const target=parseInt(el.dataset.count,10);
    const fmt=el.dataset.format;
    const start=fmt==='year'?target-4:0;
    const dur=1400; const t0=performance.now();
    (function step(now){
      const p=Math.min((now-t0)/dur,1);
      const ease=1-Math.pow(1-p,3);
      const v=Math.round(start+(target-start)*ease);
      el.textContent=fmt==='plus'?v+'+':v;
      if(p<1) requestAnimationFrame(step);
      else el.textContent=fmt==='plus'?target+'+':target;
    })(t0);
  }

  /* Timeline dots */
  function animateTimelineDots(tl){
    tl.querySelectorAll('.timeline-item').forEach((item,i)=>{
      setTimeout(()=>item.classList.add('dot-visible'),i*260+300);
    });
  }

  /* Intersection observer */
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.classList.add('visible');
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      if(e.target.dataset&&e.target.dataset.count) animateCount(e.target);
      if(e.target.classList.contains('timeline-animated')) animateTimelineDots(e.target);
      observer.unobserve(e.target);
    });
  },{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  /* Button ripple */
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click',function(e){
      const c=document.createElement('span');
      const d=Math.max(this.offsetWidth,this.offsetHeight);
      const r=this.getBoundingClientRect();
      c.style.cssText=`position:absolute;border-radius:50%;pointer-events:none;width:${d}px;height:${d}px;top:${e.clientY-r.top-d/2}px;left:${e.clientX-r.left-d/2}px;background:rgba(255,255,255,.25);transform:scale(0);animation:ripple .55s ease-out forwards;`;
      this.appendChild(c);
      c.addEventListener('animationend',()=>c.remove());
    });
  });
}

init();
