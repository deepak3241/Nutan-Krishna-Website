/* =========================================================
   THE ROYAL STAY — site interactions
   ========================================================= */

const WHATSAPP_NUMBER = "919811022334"; // demo number, configure here

function waLink(text){
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

/* =========================================================
   HEADER: solid on scroll + mobile nav + scrollspy + parallax
   ========================================================= */
const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const heroArt = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("scroll", () => {
  header.classList.toggle("solid", window.scrollY > 40);
  document.getElementById("back-to-top").classList.toggle("visible", window.scrollY > 600);
  if (heroArt && !reduceMotion && window.scrollY < window.innerHeight){
    heroArt.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
});

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}));

const navLinks = document.querySelectorAll("[data-nav]");
const navSections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
function updateActiveNav(){
  let current = navSections[0];
  navSections.forEach(sec => { if (window.scrollY + 140 >= sec.offsetTop) current = sec; });
  navLinks.forEach(a => a.classList.toggle("active", document.querySelector(a.getAttribute("href")) === current));
}
window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

document.getElementById("scroll-indicator").addEventListener("click", () => {
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".js-whatsapp").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(waLink(btn.dataset.waText || "Hi The Royal Stay, I have a question."), "_blank");
  });
});

/* =========================================================
   BOOKING WIDGET (availability demo)
   ========================================================= */
document.getElementById("booking-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const result = document.getElementById("booking-result");
  const checkin = form.checkin.value;
  const checkout = form.checkout.value;
  if (!checkin || !checkout){
    result.textContent = "Please choose both a check-in and check-out date.";
    result.style.color = "#A3402E";
    return;
  }
  if (new Date(checkout) <= new Date(checkin)){
    result.textContent = "Check-out date should be after your check-in date.";
    result.style.color = "#A3402E";
    return;
  }
  const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  result.style.color = "#8C6A3F";
  result.textContent = `Rooms are available for your ${nights}-night stay (${form.adults.value} adults, ${form.children.value} children). Scroll down to pick a room, or send a booking request below.`;
});

/* =========================================================
   ROOMS DATA + RENDER
   ========================================================= */
const ROOMS = [
  { name: "Deluxe Room", price: 4200, guests: 2, bed: "Queen Bed", size: "220 sq ft", desc: "A comfortable entry-level room with a city-facing window.", amenities: ["Free Wi-Fi","AC","Flat-screen TV"], rating: 4.7, badge: "Best Value", tone: "a" },
  { name: "Premium Room", price: 5600, guests: 2, bed: "King Bed", size: "260 sq ft", desc: "More space and a soaking tub, on our quieter courtyard side.", amenities: ["Free Wi-Fi","AC","Mini Bar","Bathtub"], rating: 4.8, badge: "", tone: "b" },
  { name: "Executive Room", price: 6800, guests: 2, bed: "King Bed", size: "300 sq ft", desc: "A work desk and lounge chair added for longer stays.", amenities: ["Free Wi-Fi","AC","Work Desk","Mini Bar"], rating: 4.8, badge: "", tone: "c" },
  { name: "Family Suite", price: 8200, guests: 4, bed: "2 Queen Beds", size: "420 sq ft", desc: "Two connected sleeping areas, built for families travelling together.", amenities: ["Free Wi-Fi","AC","Sofa Seating","Mini Bar"], rating: 4.9, badge: "Most Popular", tone: "a" },
  { name: "Luxury Suite", price: 10500, guests: 3, bed: "King Bed + Day Bed", size: "480 sq ft", desc: "A separate sitting room and a private balcony over the courtyard.", amenities: ["Free Wi-Fi","AC","Balcony","Bathtub","Mini Bar"], rating: 4.9, badge: "Bestseller", tone: "b" },
  { name: "Royal Suite", price: 14000, guests: 4, bed: "King Bed + Day Bed", size: "620 sq ft", desc: "Our largest suite, with a private terrace and dedicated butler service.", amenities: ["Free Wi-Fi","AC","Private Terrace","Butler Service","Bathtub"], rating: 5.0, badge: "Bestseller", tone: "c" }
];

function roomCardHTML(room, i){
  const badgeHTML = room.badge ? `<span class="room-badge">${room.badge}</span>` : "";
  return `
  <article class="room-card">
    <div class="room-photo ph-photo tone-${room.tone}">
      ${badgeHTML}
      <svg viewBox="0 0 24 24" fill="none" stroke="#EFE7D8" stroke-opacity="0.5" stroke-width="1.3"><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/></svg>
    </div>
    <div class="room-body">
      <h3>${room.name}</h3>
      <div class="room-meta"><span>${room.guests} Guests</span><span>${room.bed}</span><span>${room.size}</span></div>
      <p class="room-desc">${room.desc}</p>
      <div class="room-amenities">${room.amenities.map(a => `<span>${a}</span>`).join("")}</div>
      <div class="room-footer">
        <span class="room-price">₹${room.price.toLocaleString("en-IN")}<small> / night</small></span>
        <span class="room-rating">★ ${room.rating}</span>
      </div>
    </div>
    <div class="room-actions">
      <button type="button" class="btn btn-outline btn-sm js-room-detail" data-index="${i}">View Details</button>
      <a href="#booking" class="btn btn-primary btn-sm">Book Now</a>
    </div>
  </article>`;
}

const roomGrid = document.getElementById("room-grid");
function renderRooms(limit){
  roomGrid.innerHTML = ROOMS.slice(0, limit).map(roomCardHTML).join("");
  roomGrid.querySelectorAll(".js-room-detail").forEach(btn => {
    btn.addEventListener("click", () => openRoomModal(Number(btn.dataset.index)));
  });
}
renderRooms(3);

let allRoomsShown = false;
document.getElementById("view-all-rooms").addEventListener("click", (e) => {
  e.preventDefault();
  allRoomsShown = !allRoomsShown;
  renderRooms(allRoomsShown ? ROOMS.length : 3);
  document.getElementById("view-all-rooms").textContent = allRoomsShown ? "Show Fewer Rooms" : "View All Rooms";
});

/* ---------- room detail modal ---------- */
const roomModal = document.getElementById("room-modal");
const roomModalFrame = document.getElementById("room-modal-frame");
const roomModalThumbs = document.getElementById("room-modal-thumbs");
const roomModalBody = document.getElementById("room-modal-body");

function openRoomModal(index){
  const room = ROOMS[index];
  roomModalBody.innerHTML = `
    <h3>${room.name}</h3>
    <div class="room-modal-specs">
      <span>${room.guests} Guests</span><span>${room.bed}</span><span>${room.size}</span><span>★ ${room.rating}</span>
    </div>
    <p>${room.desc}</p>
    <div class="room-amenities">${room.amenities.map(a => `<span>${a}</span>`).join("")}</div>
    <div class="room-modal-price">₹${room.price.toLocaleString("en-IN")} <small style="font-family:'Jost',sans-serif;font-size:0.8rem;color:#8a8070;"> / night</small></div>
    <div class="room-modal-policy">Check-in from 1:00 PM · Check-out by 11:00 AM · Free cancellation up to 24 hours before arrival.</div>
    <a href="#booking" class="btn btn-primary btn-block" id="room-modal-book">Book Now</a>
  `;
  const thumbs = [room.tone, "a", "b", "c"];
  function setFrame(tone){
    roomModalFrame.className = "room-modal-frame ph-photo tone-" + tone;
    roomModalFrame.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#EFE7D8" stroke-opacity="0.5" stroke-width="1.2"><path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6"/></svg>`;
  }
  setFrame(thumbs[0]);
  roomModalThumbs.innerHTML = thumbs.map((t, i) => `<div class="ph-photo tone-${t} ${i===0?'active':''}" data-tone="${t}"></div>`).join("");
  roomModalThumbs.querySelectorAll(".ph-photo").forEach(thumb => {
    thumb.addEventListener("click", () => {
      roomModalThumbs.querySelectorAll(".ph-photo").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      setFrame(thumb.dataset.tone);
    });
  });
  roomModal.hidden = false;
  document.getElementById("room-modal-close").focus();
  roomModal.querySelector("#room-modal-book").addEventListener("click", () => { roomModal.hidden = true; });
}
document.getElementById("room-modal-close").addEventListener("click", () => roomModal.hidden = true);
roomModal.addEventListener("click", (e) => { if (e.target === roomModal) roomModal.hidden = true; });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !roomModal.hidden) roomModal.hidden = true; });

/* =========================================================
   GALLERY: category filter + lightbox
   ========================================================= */
const GALLERY = [
  { cat: "Rooms", caption: "Deluxe Room interior", tone: "a", size: "wide" },
  { cat: "Suites", caption: "Royal Suite sitting area", tone: "b", size: "tall" },
  { cat: "Lobby", caption: "The main lobby", tone: "c", size: "" },
  { cat: "Exterior", caption: "Hotel exterior at dusk", tone: "a", size: "" },
  { cat: "Restaurant", caption: "Courtyard restaurant", tone: "b", size: "" },
  { cat: "Pool", caption: "Rooftop pool", tone: "c", size: "wide" },
  { cat: "Amenities", caption: "Spa relaxation lounge", tone: "a", size: "" },
  { cat: "Events", caption: "Banquet hall set for a wedding", tone: "b", size: "" },
  { cat: "Nearby", caption: "City Palace, 8 minutes away", tone: "c", size: "" }
];
const galleryCats = ["All", ...new Set(GALLERY.map(g => g.cat))];
const galleryTabs = document.getElementById("gallery-tabs");
const galleryGrid = document.getElementById("gallery-grid");
let currentGalleryList = GALLERY;

function renderGalleryTabs(active){
  galleryTabs.innerHTML = galleryCats.map(cat => `<button type="button" class="gallery-tab ${cat===active?'active':''}" data-cat="${cat}">${cat}</button>`).join("");
  galleryTabs.querySelectorAll(".gallery-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      renderGalleryTabs(btn.dataset.cat);
      renderGalleryGrid(btn.dataset.cat);
    });
  });
}
function renderGalleryGrid(cat){
  currentGalleryList = cat === "All" ? GALLERY : GALLERY.filter(g => g.cat === cat);
  galleryGrid.innerHTML = currentGalleryList.map((g, i) => `
    <div class="gallery-item ${g.size}" data-index="${i}" tabindex="0" role="button" aria-label="View: ${g.caption}">
      <div class="ph-photo tone-${g.tone}" style="height:100%;"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="28" fill="none" stroke="#B79A6B" stroke-opacity="0.4" stroke-width="1"/></svg></div>
      <span class="cap">${g.caption}</span>
    </div>`).join("");
  galleryGrid.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
    item.addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(Number(item.dataset.index)); });
  });
}
renderGalleryTabs("All");
renderGalleryGrid("All");

const lightbox = document.getElementById("lightbox");
const lightboxFrame = document.getElementById("lightbox-frame");
let lbIndex = 0;
function openLightbox(i){ lbIndex = i; renderLightbox(); lightbox.hidden = false; document.getElementById("lightbox-close").focus(); }
function renderLightbox(){
  const g = currentGalleryList[lbIndex];
  lightboxFrame.innerHTML = `<div class="ph-photo tone-${g.tone}" style="height:100%;"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="28" fill="none" stroke="#B79A6B" stroke-opacity="0.5" stroke-width="1"/></svg></div>`;
}
document.getElementById("lightbox-close").addEventListener("click", () => lightbox.hidden = true);
document.getElementById("lightbox-prev").addEventListener("click", () => { lbIndex = (lbIndex - 1 + currentGalleryList.length) % currentGalleryList.length; renderLightbox(); });
document.getElementById("lightbox-next").addEventListener("click", () => { lbIndex = (lbIndex + 1) % currentGalleryList.length; renderLightbox(); });
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.hidden = true; });
document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") lightbox.hidden = true;
  if (e.key === "ArrowLeft") document.getElementById("lightbox-prev").click();
  if (e.key === "ArrowRight") document.getElementById("lightbox-next").click();
});

/* =========================================================
   LOCAL EXPERIENCES
   ========================================================= */
const EXPERIENCES = [
  { title: "City Palace & Old Town", desc: "Wander Udaipur's lakeside old town and its centuries-old palace.", dist: "8 min drive", tone: "a" },
  { title: "Jagdish Temple", desc: "A short walk to one of Udaipur's most visited temples.", dist: "6 min walk", tone: "b" },
  { title: "Hathi Pol Bazaar", desc: "Local handicrafts, textiles and miniature paintings.", dist: "5 min drive", tone: "c" },
  { title: "Lake Pichola Boat Ride", desc: "An evening boat ride with views of the City Palace.", dist: "10 min drive", tone: "a" }
];
document.getElementById("experience-grid").innerHTML = EXPERIENCES.map(x => `
  <article class="experience-card">
    <div class="ph-photo tone-${x.tone}"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="24" fill="none" stroke="#B79A6B" stroke-opacity="0.4" stroke-width="1"/></svg></div>
    <div class="experience-card-body">
      <h3>${x.title}</h3>
      <p>${x.desc}</p>
      <span class="experience-dist">${x.dist}</span>
    </div>
  </article>`).join("");

/* =========================================================
   ANIMATED COUNTERS
   ========================================================= */
const counters = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.counter);
    const isDecimal = el.dataset.decimal === "true";
    const duration = 1200;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const value = target * progress;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

/* =========================================================
   REVIEWS
   ========================================================= */
const REVIEWS = [
  { name: "Rohan Shah", stay: "Luxury Suite, 3 nights", text: "The kind of place where the staff remembers your name by day two. Breakfast alone is worth the stay.", initials: "RS" },
  { name: "Ananya Reddy", stay: "Family Suite, weekend", text: "Booked for our anniversary and they'd left a handwritten card on the bed. Small touch, big impression.", initials: "AR" },
  { name: "Karthik Iyer", stay: "Executive Room, business trip", text: "Quiet enough to actually work from the room, and the front desk sorted my cab in under five minutes.", initials: "KI" },
  { name: "Priya Nair", stay: "Premium Room, 2 nights", text: "Clean, elegant, and the location made every sight in Udaipur a short drive away.", initials: "PN" },
  { name: "Vikram Rao", stay: "Royal Suite, honeymoon", text: "The private terrace at sunset made the whole trip. We're already planning to come back.", initials: "VR" },
  { name: "Meera Joshi", stay: "Deluxe Room, solo trip", text: "Felt completely safe travelling alone here — the staff checked in without being intrusive.", initials: "MJ" }
];
document.getElementById("review-grid").innerHTML = REVIEWS.map(r => `
  <article class="review-card">
    <span class="review-stars">★★★★★</span>
    <p class="review-text">"${r.text}"</p>
    <div class="review-author">
      <span class="review-avatar">${r.initials}</span>
      <div><strong>${r.name}</strong><span>${r.stay}</span></div>
    </div>
  </article>`).join("");

/* =========================================================
   FAQ
   ========================================================= */
const FAQS = [
  { q: "What time is check-in?", a: "Check-in begins at 1:00 PM. Early check-in can be arranged on request, subject to availability." },
  { q: "What time is check-out?", a: "Check-out is by 11:00 AM. Late check-out until 1:00 PM is complimentary on our weekend offer." },
  { q: "Is breakfast included?", a: "Yes, a full breakfast buffet is included with every room booking, served 7:00–10:30 AM." },
  { q: "Is parking available?", a: "Yes, free on-site parking is available for all guests." },
  { q: "Is Wi-Fi free?", a: "Yes, complimentary high-speed Wi-Fi is available throughout the property." },
  { q: "Are children allowed?", a: "Absolutely — we're a family-friendly hotel, with cots and a kids' breakfast menu available on request." },
  { q: "Are pets allowed?", a: "We currently allow small, well-behaved pets in select rooms — please let us know in advance." },
  { q: "What is the cancellation policy?", a: "Free cancellation up to 24 hours before your check-in date; after that, one night's charge applies." },
  { q: "Do you offer airport or station pickup?", a: "Yes, pre-booked airport and station transfers are available at an additional charge." },
  { q: "Can I book through WhatsApp?", a: "Yes — tap any 'WhatsApp Us' button on this site and our team will confirm your booking directly." }
];
document.getElementById("faq-list").innerHTML = FAQS.map((f, i) => `
  <details class="faq-item" ${i === 0 ? "open" : ""}>
    <summary>${f.q}<span class="icon"></span></summary>
    <div class="answer">${f.a}</div>
  </details>`).join("");

/* =========================================================
   FORMS: booking request, contact, newsletter
   ========================================================= */
function handleFormSubmit(formId, messageId, successText){
  const form = document.getElementById(formId);
  const message = document.getElementById(messageId);
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      message.textContent = "Please fill in all required fields correctly.";
      message.className = "form-message error";
      form.reportValidity();
      return;
    }
    message.textContent = successText;
    message.className = "form-message success";
    form.reset();
  });
}

const reservationForm = document.getElementById("reservation-form");
reservationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("reservation-message");
  if (!reservationForm.checkValidity()){
    message.textContent = "Please fill in all required fields correctly.";
    message.className = "form-message error";
    reservationForm.reportValidity();
    return;
  }
  const ref = "RS-" + Math.floor(100000 + Math.random() * 900000);
  const f = reservationForm;
  message.className = "form-message success";
  message.innerHTML = `Your booking request has been received.<br>Reference <strong>${ref}</strong> · ${f.checkin.value} to ${f.checkout.value} · ${f.roomtype.value || "Room type pending"} · ${f.guests.value} guest(s).`;
});

document.getElementById("booking-whatsapp-btn").addEventListener("click", () => {
  const f = reservationForm;
  const name = f.name.value.trim() || "Guest";
  const phone = f.phone.value.trim();
  const checkin = f.checkin.value || "(date not set)";
  const checkout = f.checkout.value || "(date not set)";
  const guests = f.guests.value || "not specified";
  const roomtype = f.roomtype.value || "not specified";
  const request = f.request.value.trim();
  let msg = `Hi The Royal Stay, I'd like to book a room.\n\nName: ${name}`;
  if (phone) msg += `\nPhone: ${phone}`;
  msg += `\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\nRoom type: ${roomtype}`;
  if (request) msg += `\nSpecial request: ${request}`;
  window.open(waLink(msg), "_blank");
});

handleFormSubmit("contact-form", "contact-message", "Message sent — we'll get back to you within a day.");
handleFormSubmit("newsletter-form", "newsletter-message", "Subscribed — look out for our next offer email.");

const footerNewsletter = document.getElementById("footer-newsletter");
footerNewsletter.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = footerNewsletter.querySelector("input");
  if (input.value){ input.value = ""; input.placeholder = "Subscribed ✓"; }
});