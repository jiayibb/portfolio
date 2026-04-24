// ============================================================
// 郑家依 · 作品集 · 主脚本
// ============================================================

// ===== 1. Nav 章节高亮（基于 getBoundingClientRect，兼容 sticky）=====
(function(){
  const sections = ['c1','c2','c3','c4','ft'];
  const links = {};
  sections.forEach(id => {
    const a = document.querySelector(`.nav-l a[href="#${id}"]`);
    if(a) links[id] = a;
  });

  function update(){
    const nav = document.getElementById('nav');
    const navH = nav ? nav.offsetHeight : 60;
    // 触发点：nav 底部再往下 40% 视口高度处
    const triggerY = navH + window.innerHeight * 0.4;

    let current = null;
    // 从下往上找：第一个顶部位置 <= triggerY 的章节就是当前章节
    for(let i = sections.length - 1; i >= 0; i--){
      const id = sections[i];
      const el = document.getElementById(id);
      if(!el) continue;
      const rect = el.getBoundingClientRect();
      if(rect.top <= triggerY){
        current = id;
        break;
      }
    }

    Object.entries(links).forEach(([id, a]) => {
      a.classList.toggle('active', id === current);
    });
  }

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  setTimeout(update, 100);
})();

// ===== 2. 滚入淡入 + 进度条 + Nav 滚动态 =====
const obs = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting) e.target.classList.add('v'); });
}, {threshold:.08});
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

window.addEventListener('scroll', () => {
  const n = document.getElementById('nav');
  n.classList.toggle('sc', scrollY > window.innerHeight * .7);
  document.getElementById('prog').style.width =
    (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
});

// ===== 3. Sparkle 鼠标特效 =====
const sparks = ['✦','✧','·','⊹','✵'];
let lastSparkle = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if(now - lastSparkle < 50) return;
  lastSparkle = now;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = sparks[Math.floor(Math.random() * sparks.length)];
  s.style.left = (e.clientX + (Math.random() - .5) * 20) + 'px';
  s.style.top = (e.clientY + (Math.random() - .5) * 20) + 'px';
  s.style.color = Math.random() > .5 ? '#2D3B2D' : '#B8C4A8';
  s.style.fontSize = (8 + Math.random() * 10) + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1200);
});

// ===== 4. 章节标题 sticky 状态检测 =====
(function(){
  const chapters = document.querySelectorAll('.ch');
  if(!chapters.length) return;
  function update(){
    const nav = document.getElementById('nav');
    const navH = nav ? nav.offsetHeight : 50;
    document.documentElement.style.setProperty('--nav-h-scrolled', navH + 'px');
    chapters.forEach(ch => {
      const top = ch.getBoundingClientRect().top;
      ch.classList.toggle('ch-stuck', top <= navH + 2);
    });
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

// ===== 5. 锅口位置追踪（气泡起点绑定）=====
(function(){
  const img = document.querySelector('.hero-split-img img');
  const bubbles = document.querySelector('.bubbles');
  if(!img || !bubbles) return;

  const POT_X_RATIO = 0.70;
  const POT_Y_RATIO = 0.60;

  function update(){
    if(!img.complete || !img.naturalWidth) return;
    const cw = bubbles.offsetWidth;
    const ch = bubbles.offsetHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const cRatio = cw / ch;
    const iRatio = iw / ih;

    let renderedW, renderedH, offsetX, offsetY;
    if(iRatio > cRatio){
      renderedH = ch; renderedW = ch * iRatio;
      offsetX = (cw - renderedW) / 2; offsetY = 0;
    }else{
      renderedW = cw; renderedH = cw / iRatio;
      offsetX = 0;
      const objPos = getComputedStyle(img).objectPosition || '50% 30%';
      const m = objPos.match(/(\d+)%\s*$/);
      const yP = m ? parseInt(m[1]) / 100 : 0.3;
      offsetY = (ch - renderedH) * yP;
    }

    const potX = offsetX + renderedW * POT_X_RATIO;
    const potY = offsetY + renderedH * POT_Y_RATIO;
    bubbles.style.setProperty('--pot-x', (potX / cw * 100) + '%');
    bubbles.style.setProperty('--pot-y-from-bottom', ((ch - potY) / ch * 100) + '%');
  }

  if(img.complete) update();
  img.addEventListener('load', update);
  window.addEventListener('resize', update);
})();


// ============================================================
// 6. 三语翻译 (中 · 英 · 西)
// ============================================================

const TMAP = {
  // ===== Nav =====
  nav_n: {
    zh: '郑家依 <span>Jiayi Zheng</span>',
    en: 'Jiayi Zheng <span>郑家依</span>',
    es: 'Jiayi Zheng <span>郑家依</span>'
  },
  nav_c1: { zh:'i. 产品', en:'i. Product', es:'i. Producto' },
  nav_c2: { zh:'ii. 增长', en:'ii. Growth', es:'ii. Crecimiento' },
  nav_c3: { zh:'iii. 内容', en:'iii. Content', es:'iii. Contenido' },
  nav_c4: { zh:'iv. 跨文化', en:'iv. Cross-Cultural', es:'iv. Transcultural' },
  nav_ft: { zh:'联系', en:'Contact', es:'Contacto' },

  // ===== Hero =====
  bub1_t: { zh:'产品能力', en:'Product', es:'Producto' },
  bub2_t: { zh:'增长能力', en:'Growth', es:'Crecimiento' },
  bub3_t: { zh:'内容能力', en:'Content', es:'Contenido' },
  bub4_t: { zh:'跨文化能力', en:'Cross-Cultural', es:'Transcultural' },

  hero_title: {
    zh: "HI! I'M <em>Jiayi Zheng</em>",
    en: "HI! I'M <em>Jiayi Zheng</em>",
    es: "HI! I'M <em>Jiayi Zheng</em>"
  },
  hero_cn: { zh:'郑家依', en:'郑家依 · Jiayi', es:'郑家依 · Jiayi' },
  hero_sub: {
    zh: '看到具体的人，<br>连接具体的人，<em>打动</em>具体的人。',
    en: 'See the real person,<br>connect the real person,<br><em>move</em> the real person.',
    es: 'Ver a la persona real,<br>conectar con ella,<br><em>moverla</em>.'
  },

  sec01_lb: { zh:'/ 01 · 我是谁', en:'/ 01 · Who I am', es:'/ 01 · Quién soy' },
  sec01_tx: {
    zh: '西班牙语专业出身，3 年消费品经验。巴塞罗那在住。',
    en: 'Spanish language major, 3 years in consumer goods. Based in Barcelona.',
    es: 'Licenciada en Filología Hispánica, 3 años en bienes de consumo. Residente en Barcelona.'
  },
  sec02_lb: { zh:'/ 02 · 我在做', en:'/ 02 · What I do', es:'/ 02 · Qué hago' },
  sec02_tx: {
    zh: '产品开发 · 电商增长 · 内容运营 · 跨文化实践',
    en: 'Product development · E-commerce growth · Content · Cross-cultural practice',
    es: 'Desarrollo · E-commerce · Contenido · Práctica transcultural'
  },
  sec03_lb: { zh:'/ 03 · 关键词', en:'/ 03 · Keywords', es:'/ 03 · Palabras clave' },
  kw1: { zh:'从0到1搭建', en:'0-to-1 Builder', es:'De 0 a 1' },
  kw2: { zh:'数据驱动决策', en:'Data-Driven', es:'Datos' },
  kw3: { zh:'审美与人文底色', en:'Aesthetic & Humanistic', es:'Estética y humanidad' },
  kw4: { zh:'西语专八 · DELE C1', en:'Spanish TEM-8 · DELE C1', es:'Especialidad de Español · DELE C1' },

  // ===== Index =====
  idx1_t: { zh:'产品能力', en:'Product', es:'Producto' },
  idx1_d: { zh:'用户洞察 · 需求定义<br>竞品分析 · 从0到1', en:'User insight · Requirements<br>Competitor analysis · 0-to-1', es:'Usuario · Requisitos<br>Competencia · De 0 a 1' },
  idx2_t: { zh:'增长能力', en:'Growth', es:'Crecimiento' },
  idx2_d: { zh:'天猫运营 · 活动策划<br>短视频电商 · 数据复盘', en:'Tmall ops · Campaigns<br>Short-video · Data review', es:'Tmall · Campañas<br>Video corto · Análisis de datos' },
  idx3_t: { zh:'内容能力', en:'Content', es:'Contenido' },
  idx3_d: { zh:'选题策划 · 小红书爆款<br>品牌叙事 · 公众号运营', en:'Editorial · Xiaohongshu hits<br>Brand narrative · WeChat', es:'Editorial · Xiaohongshu<br>Narrativa · WeChat' },
  idx4_t: { zh:'跨文化能力', en:'Cross-Cultural', es:'Transcultural' },
  idx4_d: { zh:'西语内容 · 跨文化选题<br>海外洞察 · 在地社群', en:'Spanish content · Cross-cultural<br>Global insight · Local community', es:'Contenido en español<br>Comunidad local' },

  // ===== 章节标题 =====
  ch1_title: { zh:'产品能力', en:'Product', es:'Producto' },
  ch1_sub: {
    zh: '从数据里<span class="hi">看到一个具体的人</span>。',
    en: '<span class="hi">Seeing a real person</span> in the data.',
    es: '<span class="hi">Ver a una persona real</span> en los datos.'
  },
  ch2_title: { zh:'增长能力', en:'Growth', es:'Crecimiento' },
  ch2_sub: {
    zh: '深刻理解"流量 × 转化"，<span class="hi">再一一突破</span>。',
    en: 'Understand "traffic × conversion" deeply, <span class="hi">then break through both</span>.',
    es: 'Entender "tráfico × conversión" a fondo, <span class="hi">y avanzar en ambos</span>.'
  },
  ch3_title: { zh:'内容能力', en:'Content', es:'Contenido' },
  ch3_sub: {
    zh: '内容的核心，就是<span class="hi">产生共鸣</span>。',
    en: 'Content is essentially about <span class="hi">creating resonance</span>.',
    es: 'El contenido, en esencia, <span class="hi">crea resonancia</span>.'
  },
  ch4_title: { zh:'跨文化能力', en:'Cross-Cultural', es:'Transcultural' },
  ch4_sub: {
    zh: '在陌生的语境里<span class="hi">建立连接</span>。',
    en: '<span class="hi">Building connections</span> in unfamiliar contexts.',
    es: '<span class="hi">Construir conexiones</span> en contextos desconocidos.'
  },

  // ===== Generic labels =====
  h_results: { zh:'Results', en:'Results', es:'Resultados' },
  h_metrics: { zh:'Key Metrics', en:'Key Metrics', es:'Métricas Clave' },
  h_takeaway: { zh:'Takeaway', en:'Takeaway', es:'Conclusión' },

  // ===== 01. 贵州红酸汤 =====
  p1_name: { zh:'贵州红酸汤', en:'Guizhou Red Sour Soup', es:'Sopa Ácida Roja de Guizhou' },
  p1_period: { zh:'2022 — 2023 · 下厨房', en:'2022 — 2023 · Xiachufang', es:'2022 — 2023 · Xiachufang' },
  p1_insight: {
    zh: '很多人说想"吃得健康"，但真正需要的，可能只是<span class="hi">一个更简单、更不需要纠结的选择</span>。',
    en: 'Many people say they want to "eat healthy," but what they really need is <span class="hi">a simpler choice they don\'t have to overthink</span>.',
    es: 'Mucha gente dice que quiere "comer sano", pero lo que realmente necesita es <span class="hi">una opción más simple, sin complicaciones</span>.'
  },
  p1_d1: {
    zh: '<strong>0添加白砂糖</strong> — 抓取用户对"水煮菜"场景的关注，确立为核心差异化卖点',
    en: '<strong>Zero added sugar</strong> — Picked up on user attention to "water-boiled" meals, made it the core differentiator',
    es: '<strong>Sin azúcar añadido</strong> — Detectamos el interés en comidas "sin aceite" y lo convertimos en el eje diferenciador'
  },
  p1_d2: {
    zh: '<strong>小包装规格</strong> — 根据"一人食"场景数据，降低尝鲜门槛',
    en: '<strong>Small packaging</strong> — Based on "single-serving" data, lowering the trial barrier',
    es: '<strong>Envase individual</strong> — Datos sobre "comer solo/a": bajamos la barrera de prueba'
  },
  p1_r1: { zh:'小红书品类销量', en:'#1 on Xiaohongshu', es:'Nº1 en Xiaohongshu' },
  p1_r2: { zh:'累计售出', en:'Total sold', es:'Unidades vendidas' },
  p1_r3: { zh:'领先第二名', en:'Ahead of #2', es:'Por delante del Nº2' },
  p1_lbl1: { zh:'产品详情页', en:'Product Page', es:'Ficha de producto' },
  p1_lbl2: { zh:'品类搜索', en:'Category Search', es:'Búsqueda categoría' },
  p1_tk: {
    zh: '好的产品决策，不只是从数据"推导"出来的，而是从数据里<strong>"认出"一个具体的人</strong>。',
    en: 'Good product decisions aren\'t merely "derived" from data — they come from <strong>recognizing a real person</strong> within it.',
    es: 'Las buenas decisiones de producto no se "derivan" de los datos — surgen de <strong>reconocer a una persona real</strong> en ellos.'
  },

  // ===== 02. 野珍菌汤 =====
  p2_name: { zh:'野珍菌汤 · 视觉体系', en:'Wild Mushroom Soup · Visual System', es:'Sopa de Hongos · Sistema Visual' },
  p2_period: { zh:'2022 — 2023 · 下厨房', en:'2022 — 2023 · Xiachufang', es:'2022 — 2023 · Xiachufang' },
  p2_body: {
    zh: '打造"下厨房"自有品牌调味品矩阵，主导从视觉概念到包装落地的全流程，提升品牌在线上渠道的整体辨识度。',
    en: 'Built a private-label seasoning matrix for Xiachufang, leading the full process from visual concept to packaging execution, strengthening brand recognition across online channels.',
    es: 'Creé una matriz de condimentos de marca propia para Xiachufang, liderando todo el proceso —del concepto visual al envase final— y reforzando el reconocimiento en canales online.'
  },
  p2_r1: { zh:'SKU 上线', en:'SKUs launched', es:'SKU lanzados' },
  p2_r2: { zh:'沿用至今', en:'Still in use', es:'En uso actual' },
  p2_r3: { zh:'延伸冷冻线', en:'Extended to frozen', es:'Extendido a congelados' },
  p2_tk: {
    zh: '从单品包装到系列视觉体系，这套搭建逻辑<strong>适用于任何处于品牌初建期的消费品</strong>。',
    en: 'From single packaging to a full visual system, this framework <strong>works for any consumer brand in its early stage</strong>.',
    es: 'Del envase al sistema visual completo, esta lógica <strong>sirve para cualquier marca de consumo en su fase inicial</strong>.'
  },

  // ===== 03. 天猫 =====
  p3_name: { zh:'天猫店铺运营', en:'Tmall Store Operations', es:'Operaciones Tmall' },
  p3_period: { zh:'2022 — 2023 · 年度 GMV 超 1000 万', en:'2022 — 2023 · Annual GMV over ¥10M', es:'2022 — 2023 · GMV anual +10M ¥' },
  p3_insight: {
    zh: '店铺缺流量，也缺转化，但更缺的是<span class="hi">把两件事当成一个系统来设计</span>。',
    en: 'The store lacked traffic and conversion — but most of all, it lacked <span class="hi">designing the two as a single system</span>.',
    es: 'A la tienda le faltaba tráfico y conversión, pero sobre todo faltaba <span class="hi">diseñar ambos como un solo sistema</span>.'
  },
  p3_bignum_l: { zh:'年度 GMV', en:'Annual GMV', es:'GMV Anual' },
  p3_bignum_t: {
    zh: '覆盖生鲜、调味品、速食三大品类。核心目标：提升 GMV、客单价、复购率，<strong>同时优化流量结构</strong>，降低对付费推广的依赖。',
    en: 'Covering fresh food, seasonings, and ready meals. Goals: lift GMV, AOV, and repurchase — while <strong>optimizing traffic structure</strong> and reducing paid dependency.',
    es: 'Cubriendo frescos, condimentos y comidas preparadas. Objetivos: GMV, ticket medio y recompra — <strong>optimizando la estructura de tráfico</strong> y reduciendo dependencia del pago.'
  },
  p3_r1: { zh:'满减使用率', en:'Discount usage', es:'Uso de descuentos' },
  p3_r2: { zh:'短视频占比', en:'Short-video share', es:'Cuota de video' },
  p3_r4: { zh:'客单价提升', en:'AOV increase', es:'Ticket medio' },
  p3_d1: {
    zh: '<strong>满减策略优化</strong> — 新增凑单专区、优化 SKU 定价、全链路强化心智。客单价提升 30%，连带率 1.5+',
    en: '<strong>Bundle discount optimization</strong> — Added bundle zones, optimized SKU pricing, reinforced mindset across the funnel. AOV +30%, attach rate 1.5+',
    es: '<strong>Optimización de descuentos</strong> — Zonas de combinación, precios SKU ajustados, refuerzo del mensaje. Ticket +30%, ratio de vinculación 1.5+'
  },
  p3_d2: {
    zh: '<strong>单品调价</strong> — 用新客占比、转化率、加购率变化验证每次调价。单品新客占比 69% → 82%',
    en: '<strong>Price optimization</strong> — Validated each change with new-customer %, CVR, and add-to-cart shifts. New-customer share: 69% → 82%',
    es: '<strong>Ajuste de precios</strong> — Validado con % clientes nuevos, CVR y carrito. Nuevos clientes: 69% → 82%'
  },
  p3_d3: {
    zh: '<strong>短视频从 0 到 1</strong> — 主动开启淘宝短视频测试，验证正反馈后联合 BD 建立快速上传通道，短视频流量占比从 0.6% 提升至 14%',
    en: '<strong>Short-video 0→1</strong> — Launched Taobao short-video tests; after positive signal, partnered with BD to build a fast upload pipeline. Share: 0.6% → 14%',
    es: '<strong>Video corto 0→1</strong> — Pruebas en Taobao; tras señal positiva, canal rápido con BD. Cuota: 0,6% → 14%'
  },
  p3_d4: {
    zh: '<strong>方法论沉淀</strong> — 针对天猫建立「增长想法池」，以 PDCA 方法论持续验证"数据驱动 + 策略迭代"的运营模式',
    en: '<strong>Methodology</strong> — Built a "growth idea pool" for Tmall, using PDCA to continuously validate a "data-driven + iterative strategy" model.',
    es: '<strong>Metodología</strong> — Creé un "pool de ideas de crecimiento" para Tmall, validado por PDCA como modelo "datos + iteración".'
  },
  p3_tk: {
    zh: '增长不是砸钱买流量，是<strong>让每一分钱都花出更高的客单价</strong>。',
    en: 'Growth isn\'t about throwing money at traffic — it\'s about <strong>making every cent produce a higher basket</strong>.',
    es: 'Crecer no es gastar en tráfico, es <strong>hacer que cada céntimo genere un ticket mayor</strong>.'
  },

  // ===== 04. 抖音 =====
  p4_name: { zh:'抖音投放 · 从 0 搭建', en:'Douyin Ads · Built from 0', es:'Douyin · Desde cero' },
  p4_period: { zh:'2021 · 下厨房', en:'2021 · Xiachufang', es:'2021 · Xiachufang' },
  p4_d1: {
    zh: '<strong>从 0 到 1 搭建</strong> — 独立完成达人筛选、建联、样品寄送、定向链接申请、数据回收与复盘的全流程闭环',
    en: '<strong>0-to-1 setup</strong> — Solo-managed influencer sourcing, outreach, sampling, link applications, data collection and retrospectives end-to-end',
    es: '<strong>De 0 a 1</strong> — Gestioné en solitario selección, contacto, muestras, enlaces, recogida de datos y retrospectivas'
  },
  p4_d2: {
    zh: '<strong>关键洞察</strong> — 头部达人贡献约 80% 订单，验证了"头部集中"的达人投放模型，沉淀了可复用的达人筛选标准',
    en: '<strong>Key insight</strong> — Top influencers drove ~80% of orders, validating a "head-concentrated" model and producing reusable selection criteria',
    es: '<strong>Insight clave</strong> — Los top influencers generaron ~80% de pedidos, validando el modelo "concentrado en cabeza" y criterios reutilizables'
  },
  p4_d3: {
    zh: '<strong>SOP 全流程沉淀</strong> — 建立定向链接申请流程、样品寄送 SOP、打款流程、数据回收标准',
    en: '<strong>Full SOP</strong> — Established procedures for link applications, sampling, payment, and data collection',
    es: '<strong>SOP completo</strong> — Establecí procesos para enlaces, muestras, pagos y datos'
  },
  p4_r1: { zh:'验证抖音内容带货模式的可行性', en:'Validated Douyin content-commerce model', es:'Validado el modelo de comercio por contenido' },
  p4_r2: { zh:'沉淀达人筛选标准与费用测算模型', en:'Reusable influencer selection & cost model', es:'Criterios y modelo de coste reutilizables' },
  p4_r3: { zh:'为后续规模化投放奠定基础', en:'Foundation for future scaled campaigns', es:'Base para campañas a escala' },
  p4_tk: {
    zh: '从 0 到 1 最重要的不是第一次做得多好，而是<strong>把过程变成可复用的东西沉淀下来</strong>。',
    en: 'In 0-to-1, what matters isn\'t doing it perfectly the first time — it\'s <strong>turning the process into something reusable</strong>.',
    es: 'En 0-a-1, no importa hacerlo perfecto la primera vez — importa <strong>convertir el proceso en algo reutilizable</strong>.'
  },

  // ===== 05. TikTok =====
  p5_name: { zh:'TikTok 电商 · 西语市场', en:'TikTok E-commerce · Spanish Market', es:'TikTok · Mercado Hispano' },
  p5_period: { zh:'2025 · Chinauta', en:'2025 · Chinauta', es:'2025 · Chinauta' },
  p5_body: {
    zh: '选择丝瓜络切入——契合海外用户对"东方手工 + 可持续生活"的兴趣。内容以女性视角讲文化故事。',
    en: 'Entered with loofah sponges — aligned with Western interest in "Eastern craft + sustainable living." Content told cultural stories from a female perspective.',
    es: 'Empecé con esponjas de luffa — alineado con el interés occidental en "artesanía oriental + vida sostenible". Historias culturales con mirada femenina.'
  },
  p5_tblh1: { zh:'维度', en:'Metric', es:'Métrica' },
  p5_tblh2: { zh:'数据', en:'Data', es:'Dato' },
  p5_tbl1a: { zh:'发布视频', en:'Videos posted', es:'Videos publicados' },
  p5_tbl2a: { zh:'累计点赞', en:'Total likes', es:'Likes totales' },
  p5_tbl3a: { zh:'单视频最高点赞', en:'Top video likes', es:'Likes video top' },
  p5_tk: {
    zh: '这次验证让我看到：在 TikTok 上做内容（讲故事、建立情感连接）是可以做到的，但<strong>从内容到转化的路径比想象的要长</strong>。',
    en: 'This validated that I can do content on TikTok (storytelling, emotional connection) — but <strong>the path from content to conversion is longer than I expected</strong>.',
    es: 'Este test confirmó que puedo hacer contenido en TikTok (historias, conexión emocional) — pero <strong>el camino del contenido a la conversión es más largo de lo esperado</strong>.'
  },

  // ===== 06. 下厨房公众号 =====
  p6_name: { zh:'下厨房公众号 · 3 年持续输出', en:'Xiachufang WeChat · 3 Years', es:'WeChat Xiachufang · 3 Años' },
  p6_period: { zh:'2023 — 2026 · 432 篇', en:'2023 — 2026 · 432 articles', es:'2023 — 2026 · 432 artículos' },
  p6_insight: {
    zh: '卖货文的本质不是"介绍产品"，而是<span class="hi">"帮用户说服自己"</span>。',
    en: 'Sales writing isn\'t about "introducing a product" — it\'s about <span class="hi">"helping the user convince themselves"</span>.',
    es: 'Escribir para vender no es "presentar un producto" — es <span class="hi">"ayudar al usuario a convencerse a sí mismo"</span>.'
  },
  p6_bignum_l: { zh:'篇文章', en:'Articles', es:'Artículos' },
  p6_bignum_t: {
    zh: '3 年持续输出，专注美食卖货文章。<strong>独立完成选题、撰稿、排版全流程。</strong>',
    en: '3 years of consistent output, focused on food commerce writing. <strong>Independently led topic selection, writing, and layout.</strong>',
    es: '3 años de producción continua, escritura comercial gastronómica. <strong>Selección de temas, redacción y maquetación de forma independiente.</strong>'
  },
  p6_r1: { zh:'平均阅读量', en:'Avg. reads', es:'Lecturas promedio' },
  p6_r2: { zh:'篇阅读 2 万+', en:'Articles 20k+', es:'Artículos +20k' },
  p6_r3: { zh:'持续输出', en:'Sustained', es:'Sostenido' },
  p6_lbl1: { zh:'下厨房', en:'Xiachufang', es:'Xiachufang' },
  p6_val1: { zh:'主号', en:'Main', es:'Principal' },
  p6_lbl2: { zh:'下厨房商店', en:'XCF Shop', es:'Tienda XCF' },
  p6_val2: { zh:'服务号', en:'Service', es:'Servicio' },
  p6_lbl3: { zh:'文章示例', en:'Sample', es:'Ejemplo' },
  p6_val3: { zh:'三文鱼', en:'Salmon', es:'Salmón' },

  case1_t: { zh:'"最懂事的水果" — 花香蓝莓', en:'"The Most Thoughtful Fruit" — Floral Blueberry', es:'"La Fruta Más Considerada" — Arándano Floral' },
  case1_d: { zh:'阅读 4.5 万 · 当日 GMV 2.8 万+', en:'45k reads · Same-day GMV ¥28k+', es:'45k lecturas · GMV del día +28k ¥' },
  case1_p: {
    zh: '为什么选"懂事"？蓝莓不用洗不用剥，拿起来就吃。但只说"方便"是说明书。说<strong>"懂事"</strong>，是把产品特征翻译成用户的情感语言。',
    en: 'Why "thoughtful"? Blueberries need no washing or peeling — just eat them. But "convenient" is a spec sheet. <strong>"Thoughtful"</strong> translates a feature into emotional language.',
    es: '¿Por qué "considerada"? Los arándanos no se lavan ni pelan — se comen sin más. Pero "cómodo" es ficha técnica. <strong>"Considerada"</strong> traduce el atributo al lenguaje emocional.'
  },
  case1_lbl: { zh:'蓝莓推文', en:'Blueberry article', es:'Artículo arándano' },
  case1_val: { zh:'4.5 万 阅读', en:'45k reads', es:'45k lecturas' },

  tbl_h1: { zh:'段落', en:'Section', es:'Sección' },
  tbl_h2: { zh:'动作', en:'Action', es:'Acción' },
  tbl_h3: { zh:'目的', en:'Purpose', es:'Propósito' },
  tbl_1a: { zh:'开篇', en:'Opening', es:'Apertura' },
  tbl_1b: { zh:'"为什么之前不推荐蓝莓"', en:'"Why I never recommended blueberries"', es:'"Por qué nunca recomendé arándanos"' },
  tbl_1c: { zh:'建立真实感', en:'Build authenticity', es:'Crear autenticidad' },
  tbl_2a: { zh:'产品', en:'Product', es:'Producto' },
  tbl_2b: { zh:'花香 · 新品种 L25', en:'Floral · New variety L25', es:'Floral · Variedad L25' },
  tbl_2c: { zh:'制造稀缺', en:'Create scarcity', es:'Crear escasez' },
  tbl_3a: { zh:'产地', en:'Origin', es:'Origen' },
  tbl_3b: { zh:'云南高原 · 露天生长', en:'Yunnan plateau · Open-air', es:'Meseta de Yunnan · Aire libre' },
  tbl_3c: { zh:'品质信任', en:'Quality trust', es:'Confianza de calidad' },
  tbl_4a: { zh:'价格', en:'Price', es:'Precio' },
  tbl_4b: { zh:'"一盒 ≈ 一杯奶茶钱"', en:'"One box ≈ a bubble tea"', es:'"Una caja ≈ un bubble tea"' },
  tbl_4c: { zh:'化解敏感', en:'Ease sensitivity', es:'Reducir sensibilidad' },
  tbl_5a: { zh:'供应链', en:'Supply', es:'Cadena' },
  tbl_5b: { zh:'"只和一个供应商合作"', en:'"One supplier only"', es:'"Un solo proveedor"' },
  tbl_5c: { zh:'解决痛点', en:'Solve pain', es:'Resolver dolor' },
  tbl_6a: { zh:'转化', en:'Conversion', es:'Conversión' },
  tbl_6b: { zh:'新人券 · 低门槛话术', en:'New-user coupon · Low-barrier copy', es:'Cupón · Copy de baja barrera' },
  tbl_6c: { zh:'引导下单', en:'Drive purchase', es:'Impulsar compra' },

  meth1: { zh:'破防', en:'Break Through', es:'Romper' },
  meth1d: { zh:'颠覆原有认知', en:'Overturn assumptions', es:'Subvertir supuestos' },
  meth2: { zh:'建信', en:'Build Trust', es:'Confianza' },
  meth2d: { zh:'数据 · 产地 · 供应链', en:'Data · Origin · Supply', es:'Datos · Origen · Cadena' },
  meth3: { zh:'给台阶', en:'Give Reason', es:'Dar Razón' },
  meth3d: { zh:'价格锚点 + 低门槛', en:'Price anchor + Low barrier', es:'Ancla precio + Baja barrera' },

  p6_tk: {
    zh: '每篇卖货文章 = 一次微型说服链路，<strong>这套结构在不同品类里反复验证有效</strong>。',
    en: 'Each sales article = a micro persuasion chain. <strong>This structure proved effective across multiple categories.</strong>',
    es: 'Cada artículo comercial = una cadena micro de persuasión. <strong>Esta estructura se validó en múltiples categorías.</strong>'
  },

  // ===== 07. 山巴 =====
  p7_name: { zh:'山巴 · 小红书冷启动', en:'Shanba · Xiaohongshu Cold Start', es:'Shanba · Xiaohongshu' },
  p7_period: { zh:'2024 — 2025', en:'2024 — 2025', es:'2024 — 2025' },
  p7_r1: { zh:'篇笔记', en:'Posts', es:'Publicaciones' },
  p7_r2: { zh:'最高曝光', en:'Top exposure', es:'Mayor alcance' },
  p7_r3: { zh:'最高点赞', en:'Top likes', es:'Max likes' },
  p7_r4: { zh:'粉丝', en:'Followers', es:'Seguidores' },
  p7_lbl: { zh:'山巴主页', en:'Shanba profile', es:'Perfil Shanba' },
  case2_t: { zh:'爱吃辣椒的人都要感谢墨西哥', en:'Chili Lovers Should Thank Mexico', es:'Los amantes del chile deben agradecer a México' },
  case2_d: { zh:'点赞 1,624 · 收藏 452 · 评论 230', en:'1,624 likes · 452 saves · 230 comments', es:'1.624 likes · 452 guardados · 230 comentarios' },
  case2_p: {
    zh: '从一盘西班牙辣椒切入，写辣椒经由殖民贸易传入欧洲的历史，<strong>把一个饮食细节变成一个文化钩子</strong>。',
    en: 'Started with a plate of Spanish peppers, tracing how chili peppers traveled to Europe via colonial trade — <strong>turning a food detail into a cultural hook</strong>.',
    es: 'Empecé con pimientos de Padrón y rastreé cómo el chile llegó a Europa por el comercio colonial — <strong>convertir un detalle culinario en un anzuelo cultural</strong>.'
  },
  case2_lbl: { zh:'评论互动', en:'Comments', es:'Comentarios' },
  case2_val: { zh:'230 条', en:'230', es:'230' },
  p7_transfer: {
    zh: '<strong>能力迁移：</strong>用文化切口打开陌生话题、建立读者共鸣，这套内容逻辑适用于任何需要"冷启动"的品牌或账号。',
    en: '<strong>Transfer:</strong> Opening unfamiliar topics through cultural entry points and building reader resonance — this logic works for any brand or account starting cold.',
    es: '<strong>Transferencia:</strong> Abrir temas desconocidos por la puerta cultural y crear resonancia — esta lógica vale para cualquier marca o cuenta en fase inicial.'
  },
  p7_tk: {
    zh: '<strong>共鸣本身就是流量。</strong>',
    en: '<strong>Resonance is itself traffic.</strong>',
    es: '<strong>La resonancia es, en sí misma, tráfico.</strong>'
  },

  // ===== Chapter 4 quote =====
  ch4_qb: {
    zh: '待在边缘不是坏事。正是因为你不完全属于任何一个地方，<em>才能看见别人习以为常、却值得被说出来的东西</em>。',
    en: 'Being at the edge isn\'t bad. Because you don\'t fully belong anywhere, <em>you see what others take for granted but deserves to be said</em>.',
    es: 'Estar al margen no es malo. Porque no perteneces completamente a ningún sitio, <em>ves lo que los demás dan por sentado pero merece ser dicho</em>.'
  },

  // ===== 08. Una Verba =====
  p8_name: { zh:'Una Verba · 女性社群', en:'Una Verba · Women\'s Community', es:'Una Verba · Comunidad de Mujeres' },
  p8_period: { zh:'2024 — 2025 · Barcelona', en:'2024 — 2025 · Barcelona', es:'2024 — 2025 · Barcelona' },
  p8_insight: {
    zh: '"<span class="hi">如何让这件事情可持续运转？</span>"',
    en: '"<span class="hi">How do you make this run sustainably?</span>"',
    es: '"<span class="hi">¿Cómo hacer que esto funcione de forma sostenible?</span>"'
  },
  p8_s1: { zh:'场线下活动', en:'Offline events', es:'Eventos presenciales' },
  p8_s2: { zh:'累计参与人次', en:'Total attendees', es:'Asistentes totales' },
  p8_s3: { zh:'WhatsApp 社群', en:'WhatsApp community', es:'Comunidad WhatsApp' },
  p8_d1: {
    zh: '<strong>机制先行</strong> — 制作 SOP 文档与活动模板，让任何成员都能自主发起活动，降低组织门槛',
    en: '<strong>Mechanism first</strong> — Built SOPs and event templates so any member could initiate, lowering the barrier to organize',
    es: '<strong>Primero el mecanismo</strong> — SOP y plantillas: cualquier miembro puede iniciar, bajando la barrera organizativa'
  },
  p8_d2: {
    zh: '<strong>去中心化落地</strong> — 成员陆续自发组织二手衣物交换、自由舞动工作坊等活动',
    en: '<strong>Decentralized execution</strong> — Members spontaneously organized clothing swaps, free-movement workshops, and more',
    es: '<strong>Ejecución descentralizada</strong> — Los miembros organizaron de forma espontánea intercambios de ropa, talleres de danza libre, etc.'
  },
  p8_d3: {
    zh: '<strong>从 0 搭建完整闭环</strong> — 从机制设计、活动策划到现场执行，独立负责可持续运转的全套流程',
    en: '<strong>End-to-end 0-to-1</strong> — Led mechanism design, event planning, and on-site execution — the full sustainable loop',
    es: '<strong>De 0 a 1 completo</strong> — Diseño de mecanismo, planificación y ejecución en directo — el bucle completo'
  },
  p8_tk: {
    zh: '从 0 搭建垂直社群的完整经验，从机制设计到活动落地，<strong>深度理解海外华人用户在跨文化语境下的真实需求与行为逻辑</strong>。',
    en: 'End-to-end experience building a vertical community — from mechanism to event — with <strong>deep understanding of diaspora users\' real needs and behavior in cross-cultural contexts</strong>.',
    es: 'Experiencia completa construyendo una comunidad vertical — del mecanismo al evento — con <strong>comprensión profunda de las necesidades reales del público diáspora en contextos transculturales</strong>.'
  },

  // ===== 09. Sino Women =====
  p9_name: { zh:'Sino Women in Diaspora · 内容平台', en:'Sino Women in Diaspora · Content Platform', es:'Sino Women in Diaspora · Plataforma' },
  p9_period: { zh:'2024 — 2025 · 网站', en:'2024 — 2025 · Website', es:'2024 — 2025 · Sitio web' },
  p9_s1: { zh:'条收录投稿', en:'Submissions', es:'Envíos recibidos' },
  p9_s2_n: { zh:'中英', en:'Bilingual', es:'Bilingüe' },
  p9_s2_l: { zh:'双语体系', en:'EN/CN system', es:'Sistema EN/CN' },
  p9_s3_n: { zh:'持续', en:'Ongoing', es:'En curso' },
  p9_s3_l: { zh:'更新中', en:'Updating', es:'Actualizando' },
  p9_b1: {
    zh: '负责内容框架设计、网站文案撰写与活动策划，搭建记录海外华裔女性故事的线上空间。',
    en: 'Led content framework, website copy, and event planning — building an online space to record stories of diaspora Chinese women.',
    es: 'Lideré la arquitectura de contenido, copy del sitio y planificación — un espacio online para historias de mujeres chinas en diáspora.'
  },
  p9_b2: {
    zh: '全程以 AI 辅助工作流：网站命名、栏目架构、视觉风格方向，到双语内容处理、文案润色、访谈提纲撰写。',
    en: 'AI-assisted throughout: naming, section architecture, visual direction, bilingual content processing, copy polishing, interview outlines.',
    es: 'Con IA en todo el flujo: nombrado, arquitectura, dirección visual, contenido bilingüe, pulido de copy, guiones de entrevista.'
  },
  p9_b3: {
    zh: '<strong>能力迁移：</strong>中英双语内容体系搭建 + AI 辅助内容工作流，可直接应用于面向海外华人群体的品牌内容运营。',
    en: '<strong>Transfer:</strong> Bilingual EN/CN content system + AI-assisted workflow, directly applicable to brand content operations for diaspora Chinese audiences.',
    es: '<strong>Transferencia:</strong> Sistema bilingüe EN/CN + flujo con IA, aplicable directamente a operaciones de contenido dirigidas al público chino en diáspora.'
  },
  p9_tk: {
    zh: 'AI 不只是提效工具，它在<strong>重新划定"一个人能做什么"的边界</strong>。',
    en: 'AI isn\'t just a productivity tool — it\'s <strong>redrawing what one person can do</strong>.',
    es: 'La IA no es solo una herramienta de productividad — está <strong>redibujando lo que una persona puede hacer</strong>.'
  },

  // ===== Footer =====
  ft_small: { zh:'Colophon', en:'Colophon', es:'Colofón' },
  ft_q: {
    zh: '看到具体的人，<br>连接具体的人，<br><em>打动具体的人。</em>',
    en: 'See the real person,<br>connect the real person,<br><em>move the real person.</em>',
    es: 'Ver a la persona real,<br>conectar con ella,<br><em>moverla.</em>'
  },
  ft_coda: {
    zh: '这是我做每一件事的起点，也是终点。',
    en: 'The starting point and the ending point of everything I do.',
    es: 'El punto de partida y el punto de llegada de todo lo que hago.'
  }
};

function go(lang){
  document.getElementById('lg').classList.add('out');
  document.body.className = lang;

  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if(TMAP[key] && TMAP[key][lang]){
      el.innerHTML = TMAP[key][lang];
    }
  });
}
