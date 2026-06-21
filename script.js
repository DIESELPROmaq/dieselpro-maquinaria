// ============================================================
//  DIESELPRO MAQUINARIA — script.js
// ============================================================
//  EMAILJS (opcional — envío de correo desde el formulario):
//  1. Crea cuenta gratuita en https://www.emailjs.com
//  2. Crea un servicio (Gmail) y una plantilla de email
//  3. Pon tus claves en las variables de abajo
//  4. Cambia EMAILJS_ENABLED a true
//  5. Descomenta el <script> de EmailJS en el <head> del index.html
// ============================================================


const EMAILJS_PUBLIC_KEY  = 'uhRByrzDPqzbNJSLS';
const EMAILJS_SERVICE_ID  = 'service_atf76ys';
const EMAILJS_TEMPLATE_ID = 'ime19ps';
const EMAILJS_ENABLED     = true;


// ============================================================
//  NAVEGACIÓN SPA (Single Page — todo en un index.html)
// ============================================================
const sections = ['inicio', 'nosotros', 'servicio', 'rodaje', 'renta', 'contacto'];

function navTo(id) {
  // Ocultar todas las secciones
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
  });

  // Mostrar la sección destino
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Actualizar nav link activo
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });

  // Cerrar menú móvil
  closeHamburger();

  // Actualizar hash sin recargar
  history.pushState(null, '', '#' + id);
}

// Leer hash al cargar la página (para links directos o recarga)
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  const validSection = sections.includes(hash) ? hash : 'inicio';
  navTo(validSection);
});

// Botón atrás del navegador
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '') || 'inicio';
  navTo(hash);
});

// ============================================================
//  HAMBURGER — menú móvil
// ============================================================
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');
const navHamburger = document.getElementById('navHamburger');
if (navHamburger && mainNav) {
  navHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.contains('open');
    if (isOpen) {
      navHamburger.classList.remove('open');
      navHamburger.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
    } else {
      navHamburger.classList.add('open');
      navHamburger.setAttribute('aria-expanded', 'true');
      mainNav.classList.add('open');
    }
  });
}


function closeHamburger() {
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (navHamburger) {
    navHamburger.classList.remove('open');
    navHamburger.setAttribute('aria-expanded', 'false');
  }
  if (mainNav) mainNav.classList.remove('open');
}


if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mainNav.classList.toggle('open', isOpen);
  });
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
  if (mainNav && mainNav.classList.contains('open')) {
    if (!mainNav.contains(e.target) && (!hamburger || !hamburger.contains(e.target)) && (!navHamburger || !navHamburger.contains(e.target))) {
      closeHamburger();
    }
  }
});


// ============================================================
//  TOPBAR — sombra al hacer scroll
// ============================================================
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ============================================================
//  MODAL
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Cerrar modal al hacer clic en el overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Cerrar modal con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => closeModal(m.id));
  }
});

// ============================================================
//  FORMULARIO DE CONTACTO
//  → Siempre envía a WhatsApp con mensaje estructurado
//  → Si EMAILJS_ENABLED = true, también envía correo
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recopilar valores
    const nombre      = val('nombre');
    const telefono    = val('telefono');
    const emailVal    = val('email')       || 'No proporcionado';
    const servicioEl  = document.getElementById('servicio');
    const servicio    = servicioEl ? servicioEl.value.trim() : '';
    const marca       = val('marca')       || 'No especificada';
    const modelo      = val('modelo')      || 'No especificado';
    const descripcion = val('descripcion');

// Validación
    if (!nombre || !telefono || !servicio || !descripcion) {
      toast('Por favor completa los campos obligatorios marcados con *');
      return;
    }

    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    // ── 1. WhatsApp ──────────────────────────────────────────
    const waMsg = encodeURIComponent(
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*NUEVA SOLICITUD*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*Nombre o Empresa:*\n${nombre}\n\n` +
      `*Teléfono de contacto:*\n${telefono}\n\n` +
      `*Correo electrónico:*\n${emailVal}\n\n` +
      `*Servicio requerido:*\n${servicio}\n\n` +
      `*Marca de la maquinaria:*\n${marca}\n\n` +
      `*Modelo o Serie:*\n${modelo}\n\n` +
      `*Descripción de la falla o requerimiento:*\n${descripcion}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━`
    );
    window.open(`https://wa.me/522225491442?text=${waMsg}`, '_blank');

    // ── 2. EmailJS (opcional) ─────────────────────────────────
    if (EMAILJS_ENABLED && typeof emailjs !== 'undefined') {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          nombre, telefono, email: emailVal,
          servicio, marca, modelo, descripcion,
          fecha: new Date().toLocaleDateString('es-MX', { dateStyle: 'full' })
        });
        toast('Solicitud enviada por WhatsApp y correo electrónico.');
      } catch (err) {
        console.error('EmailJS:', err);
        toast('WhatsApp abierto. Revisa la configuración de EmailJS para correos.');
      }
    } else {
      toast('WhatsApp abierto con tu solicitud.');
    }

    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar solicitud →';
  });
}

// Helpers
function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

// ── Toast de notificación ────────────────────────────────────
function toast(msg) {
  let t = document.getElementById('dp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'dp-toast';
    Object.assign(t.style, {
      position: 'fixed',
      bottom: '28px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: '#1E1E1E',
      color: '#F0EDE8',
      borderLeft: '4px solid #E8A020',
      padding: '14px 24px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity .3s, transform .3s',
      maxWidth: '90vw',
      textAlign: 'center',
      pointerEvents: 'none',
      borderRadius: '0'
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 4200);
}


// ── Funciones de WhatsApp por botón ──
async function registrarContacto(datos) {
  if (typeof emailjs === 'undefined') return;
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      tipo_mensaje: datos.tipo      || 'Contacto general',
      nombre:       datos.nombre    || 'No proporcionado',
      telefono:     datos.telefono  || 'No proporcionado',
      email:        datos.email     || 'No proporcionado',
      servicio:     datos.servicio  || 'No especificado',
      marca:        datos.marca     || 'No especificada',
      modelo:       datos.modelo    || 'No especificado',
      mensaje:      datos.mensaje   || 'Sin mensaje adicional',
      seccion:      datos.seccion   || 'No especificada',
      fecha:        new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })
    });
  } catch (err) {
    console.error('EmailJS error:', err);
  }
}

function waBtn(tipo, mensaje, seccion, datos = {}) {
  const waMsg = encodeURIComponent(mensaje);
  window.open(`https://wa.me/522225491442?text=${waMsg}`, '_blank');
  registrarContacto({ tipo, seccion, mensaje, ...datos });
}

function waBtnTopbar() {
  waBtn('Contacto rápido desde topbar',
    `Hola, me comunico desde el sitio web de DIESELPRO MAQUINARIA.\n\n¿Pueden orientarme sobre sus servicios?`,
    'Topbar');
}

function waBtnHero() {
  waBtn('Contacto desde Hero',
    `*DIESELPRO MAQUINARIA*\n\nHola, visité su sitio web y me interesa conocer más sobre sus servicios de soporte técnico para maquinaria pesada.\n\n¿Podrían orientarme?`,
    'Inicio - Hero');
}

function waBtnEmergencia() {
  waBtn('Emergencia - Maquinaria detenida',
    `*EMERGENCIA*\n\nTengo maquinaria detenida y necesito soporte técnico urgente.\n\n¿Pueden atenderme lo antes posible?`,
    'Inicio - Banner emergencia');
}

function waBtnNosotros() {
  waBtn('Contacto desde Quiénes Somos',
    `*DIESELPRO MAQUINARIA*\n\nHola, revisé información sobre su empresa y me gustaría solicitar soporte técnico para mi maquinaria.\n\n¿Pueden orientarme?`,
    'Quiénes Somos');
}

function waBtnServicio() {
  waBtn('Contacto desde Servicio y Motor',
    `*DIESELPRO MAQUINARIA*\n\nHola, revisé sus servicios de mecánica y motor y me interesa solicitar una cotización.\n\n¿Pueden ayudarme?`,
    'Servicio y Motor');
}

function waBtnModal(servicio) {
  const mensajes = {
    diagnostico: `🔍 *Diagnóstico electrónico*\n\nHola, necesito un diagnóstico para mi maquinaria.\n\n¿Pueden orientarme sobre el proceso y costos?`,
    puesta:      `✅ *Puesta en operación*\n\nHola, necesito el servicio de puesta en operación para mi maquinaria.\n\n¿Pueden cotizarme?`,
    preventivo:  `🛡️ *Mantenimiento preventivo*\n\nHola, me interesa programar mantenimiento preventivo para mi equipo.\n\n¿Pueden orientarme?`,
    correctivo:  `🔩 *Mantenimiento correctivo*\n\nHola, tengo una falla en mi maquinaria y necesito reparación.\n\n¿Pueden atenderme?`,
    soldadura:   `🔥 *Reparación de soldadura*\n\nHola, necesito servicio de soldadura estructural para mi equipo.\n\n¿Pueden cotizarme?`
  };
  waBtn(`Solicitud modal: ${servicio}`, mensajes[servicio], `Modal - ${servicio}`);
}

function waBtnRodaje() {
  waBtn('Contacto desde Tren de Rodaje',
    `*Tren de rodaje*\n\nHola, me interesa cotizar servicio de tren de rodaje o compra de aditamentos para mi excavadora.\n\n¿Pueden ayudarme?`,
    'Tren de Rodaje');
}

function waBtnRenta() {
  waBtn('Consulta Renta y Venta',
    `*Renta y venta*\n\nHola, me interesa conocer la disponibilidad y condiciones de renta o venta de equipos.\n\n¿Pueden informarme?`,
    'Renta y Venta');
}

function waBtnContacto() {
  waBtn('Contacto directo',
    `*DIESELPRO MAQUINARIA*\n\nHola, me comunico desde su sitio web y quisiera hablar con un especialista.\n\n¿Pueden atenderme?`,
    'Contacto');
}

function waBtnFooter() {
  waBtn('Contacto desde Footer',
    `Hola, me comunico desde el sitio web de DIESELPRO MAQUINARIA.\n\n¿Pueden orientarme?`,
    'Footer');
}


// ── Abrir modales de servicios ──
function openServicio(id) {
  openModal('modal-' + id);
}


// ── Visor de imagen completa ──
function abrirImagen(src) {
  let visor = document.getElementById('visor-img');
  if (!visor) {
    visor = document.createElement('div');
    visor.id = 'visor-img';
    visor.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.95);
      z-index:500; display:flex; align-items:center;
      justify-content:center; cursor:zoom-out; padding:20px;
    `;
    visor.innerHTML = `
      <img id="visor-img-el" style="max-width:100%; max-height:90vh; object-fit:contain; display:block;">
      <button onclick="event.stopPropagation();cerrarVisor()" style="
        position:absolute; top:16px; right:24px; background:none;
        border:none; color:#ffffff; font-size:32px; cursor:pointer; line-height:1;">✕</button>`;
    visor.addEventListener('click', cerrarVisor);
    document.body.appendChild(visor);
  }
  document.getElementById('visor-img-el').src = src;
  visor.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarVisor() {
  const visor = document.getElementById('visor-img');
  if (visor) visor.style.display = 'none';
  document.body.style.overflow = '';
}


