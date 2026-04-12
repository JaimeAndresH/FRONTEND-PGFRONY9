const STORAGE_KEY = "catalogoPlusFavorites";
const ADMIN_STORAGE_KEY = "catalogoPlusAdminServices";

const elements = {
  featuredServices: document.getElementById("featured-services"),
  allServices: document.getElementById("all-services"),
  favoriteServices: document.getElementById("favorite-services"),
  favoritesCount: document.getElementById("favorites-count"),
  favoritesMessage: document.getElementById("favorites-message"),
  clearFavorites: document.getElementById("clear-favorites"),
  contactForm: document.getElementById("contact-form"),
  contactSuccess: document.getElementById("form-success"),
  adminForm: document.getElementById("admin-form"),
  adminSuccess: document.getElementById("admin-success"),
  adminServices: document.getElementById("admin-services"),
  adminCount: document.getElementById("admin-count"),
  adminMessage: document.getElementById("admin-message"),
  clearAdminServices: document.getElementById("clear-admin-services"),
  resetAdminForm: document.getElementById("reset-admin-form"),
  navToggle: document.querySelector("[data-nav-toggle]"),
  nav: document.querySelector("[data-nav]")
};

let services = [];
const fallbackServices = [
  {
    id: "edu-digital",
    name: "Educacion Digital",
    description: "Cursos y talleres de formacion tecnologica para fortalecer habilidades digitales y aprendizaje practico.",
    category: "Educativo",
    mode: "Virtual",
    price: "Desde $120.000",
    badge: "Destacado",
    featured: true,
    image: "assets/img/service-education.svg"
  },
  {
    id: "colab-empresarial",
    name: "Colaboracion Empresarial",
    description: "Soluciones de trabajo en equipo para empresas modernas con asesoria, procesos y herramientas colaborativas.",
    category: "Comercial",
    mode: "Hibrido",
    price: "Desde $180.000",
    badge: "Popular",
    featured: true,
    image: "assets/img/service-collaboration.svg"
  },
  {
    id: "innovacion-tech",
    name: "Innovacion Tecnologica",
    description: "Consultoria en transformacion digital para mejorar operaciones, experiencia del usuario y eficiencia.",
    category: "Tecnologico",
    mode: "Presencial",
    price: "Desde $250.000",
    badge: "Destacado",
    featured: true,
    image: "assets/img/service-innovation.svg"
  },
  {
    id: "turismo-inteligente",
    name: "Turismo Inteligente",
    description: "Experiencias turisticas apoyadas en tecnologia, rutas personalizadas y acompanamiento digital.",
    category: "Turistico",
    mode: "Experiencial",
    price: "Desde $210.000",
    badge: "Nuevo",
    featured: false,
    image: "assets/img/service-tourism.svg"
  }
];

init();

async function init() {
  setupNavigation();
  setupFavoritesActions();
  setupAdminActions();
  services = await getServices();
  renderPage();
  setupContactForm();
  setupAdminForm();
}

function setupNavigation() {
  if (!elements.navToggle || !elements.nav) return;
  elements.navToggle.addEventListener("click", () => {
    elements.nav.classList.toggle("is-open");
  });
}

async function getServices() {
  try {
    const response = await fetch("data/services.json");
    if (!response.ok) throw new Error("No fue posible cargar los servicios.");
    return await response.json();
  } catch {
    return fallbackServices;
  }
}

function renderPage() {
  const adminServices = getAdminServices();
  const completeServices = [...adminServices, ...services];

  if (elements.featuredServices) {
    const featured = completeServices.filter((service) => service.featured).slice(0, 3);
    renderServices(elements.featuredServices, featured, "No hay servicios destacados disponibles.");
  }

  if (elements.allServices) {
    renderServices(elements.allServices, completeServices, "No hay servicios para mostrar.");
  }

  if (elements.favoriteServices) {
    const favoriteItems = completeServices.filter((service) => getFavorites().includes(service.id));
    renderServices(elements.favoriteServices, favoriteItems, "Aún no has agregado servicios a favoritos.");
    updateFavoritesSummary(favoriteItems.length);
  }

  if (elements.adminServices) {
    renderAdminServices(adminServices);
    updateAdminSummary(adminServices.length);
  }
}

function renderServices(container, items, emptyMessage) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  container.innerHTML = items.map(createServiceCard).join("");

  container.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.favorite);
      renderPage();
    });
  });
}

function createServiceCard(service) {
  const isFavorite = getFavorites().includes(service.id);
  return `
    <article class="service-card">
      <div class="service-card__media">
        <img src="${service.image}" alt="${service.name}">
        <span class="service-card__badge">${service.badge}</span>
        <button class="service-card__favorite ${isFavorite ? "is-active" : ""}" type="button" data-favorite="${service.id}" aria-label="Agregar a favoritos">
          ${isFavorite ? "♥" : "♡"}
        </button>
      </div>
      <div class="service-card__content">
        <div class="service-card__meta">
          <span>${service.category}</span>
          <span>${service.mode}</span>
        </div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="service-card__actions">
          <a class="service-card__link" href="servicios.html">Ver más</a>
          <span>${service.price}</span>
        </div>
      </div>
    </article>
  `;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function toggleFavorite(serviceId) {
  const favorites = getFavorites();
  const nextFavorites = favorites.includes(serviceId)
    ? favorites.filter((id) => id !== serviceId)
    : [...favorites, serviceId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
}

function setupFavoritesActions() {
  if (!elements.clearFavorites) return;
  elements.clearFavorites.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderPage();
  });
}

function updateFavoritesSummary(total) {
  if (elements.favoritesCount) {
    elements.favoritesCount.textContent = String(total);
  }

  if (elements.favoritesMessage) {
    elements.favoritesMessage.textContent = total
      ? `Tienes ${total} servicio${total === 1 ? "" : "s"} guardado${total === 1 ? "" : "s"} en tu lista.`
      : "Todavía no has guardado favoritos. Explora el catálogo y marca los servicios que más te gusten.";
  }

  if (elements.clearFavorites) {
    elements.clearFavorites.disabled = total === 0;
  }
}

function setupContactForm() {
  if (!elements.contactForm) return;
  elements.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.contactForm);
    const fields = Object.fromEntries(formData.entries());
    const validations = {
      name: fields.name.trim().length >= 3 ? "" : "Ingresa un nombre válido.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) ? "" : "Ingresa un correo válido.",
      service: fields.service.trim() ? "" : "Este campo es obligatorio.",
      message: fields.message.trim().length >= 10 ? "" : "Escribe al menos 10 caracteres."
    };
    if (!applyErrors(elements.contactForm, validations)) return;
    elements.contactSuccess.hidden = false;
    elements.contactForm.reset();
  });
}

function applyErrors(form, validations) {
  let isValid = true;
  Object.entries(validations).forEach(([fieldName, errorMessage]) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorNode = field?.parentElement?.querySelector(".error-message");
    if (!field || !errorNode) return;
    errorNode.textContent = errorMessage;
    if (errorMessage) isValid = false;
  });
  return isValid;
}

function setupAdminForm() {
  if (!elements.adminForm) return;
  elements.adminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(elements.adminForm);
    const fields = Object.fromEntries(formData.entries());
    const validations = {
      "admin-name": fields["admin-name"].trim() ? "" : "El nombre es obligatorio.",
      "admin-category": fields["admin-category"].trim() ? "" : "La categoría es obligatoria.",
      "admin-mode": fields["admin-mode"].trim() ? "" : "Selecciona una modalidad.",
      "admin-price": fields["admin-price"].trim() ? "" : "Ingresa una tarifa o precio.",
      "admin-badge": fields["admin-badge"].trim() ? "" : "Selecciona una etiqueta.",
      "admin-description": fields["admin-description"].trim().length >= 10 ? "" : "Describe el servicio con más detalle."
    };
    if (!applyErrors(elements.adminForm, validations)) return;

    const adminServices = getAdminServices();
    adminServices.unshift({
      id: `custom-${Date.now()}`,
      name: fields["admin-name"].trim(),
      category: fields["admin-category"].trim(),
      mode: fields["admin-mode"].trim(),
      price: fields["admin-price"].trim(),
      badge: fields["admin-badge"].trim(),
      description: fields["admin-description"].trim(),
      image: "assets/img/service-custom.svg",
      featured: formData.get("admin-featured") === "on"
    });

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminServices));
    elements.adminForm.reset();
    if (elements.adminSuccess) {
      elements.adminSuccess.hidden = false;
    }
    renderPage();
  });
}

function setupAdminActions() {
  if (elements.clearAdminServices) {
    elements.clearAdminServices.addEventListener("click", () => {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      if (elements.adminSuccess) {
        elements.adminSuccess.hidden = true;
      }
      renderPage();
    });
  }

  if (elements.resetAdminForm) {
    elements.resetAdminForm.addEventListener("click", () => {
      if (!elements.adminForm) return;
      elements.adminForm.reset();
      clearFormErrors(elements.adminForm);
      if (elements.adminSuccess) {
        elements.adminSuccess.hidden = true;
      }
    });
  }
}

function getAdminServices() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function renderAdminServices(items) {
  if (!elements.adminServices) return;
  if (!items.length) {
    elements.adminServices.innerHTML = '<div class="empty-state">Todavía no has creado servicios personalizados. Usa el formulario para agregar el primero.</div>';
    return;
  }

  elements.adminServices.innerHTML = items.map((item) => `
    <article class="admin-item">
      <div class="admin-item__top">
        <span class="admin-item__badge">${item.badge}</span>
        <span class="admin-item__featured">${item.featured ? "Destacado" : "Estándar"}</span>
      </div>
      <strong>${item.name}</strong>
      <p>${item.category} • ${item.mode}</p>
      <small>${item.description}</small>
      <div class="admin-item__actions">
        <span>${item.price}</span>
        <button class="admin-item__delete" type="button" data-delete="${item.id}">Eliminar</button>
      </div>
    </article>
  `).join("");

  elements.adminServices.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteAdminService(button.dataset.delete));
  });
}

function deleteAdminService(serviceId) {
  const updated = getAdminServices().filter((service) => service.id !== serviceId);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
  if (!updated.length && elements.adminSuccess) {
    elements.adminSuccess.hidden = true;
  }
  renderPage();
}

function updateAdminSummary(total) {
  if (elements.adminCount) {
    elements.adminCount.textContent = String(total);
  }

  if (elements.adminMessage) {
    elements.adminMessage.textContent = total
      ? `Has registrado ${total} servicio${total === 1 ? "" : "s"} personalizado${total === 1 ? "" : "s"} en esta vista.`
      : "Aquí verás los servicios personalizados creados en esta sección.";
  }

  if (elements.clearAdminServices) {
    elements.clearAdminServices.disabled = total === 0;
  }
}

function clearFormErrors(form) {
  form.querySelectorAll(".error-message").forEach((node) => {
    node.textContent = "";
  });
}
