/**
 * CodeStandards Landing Page Logic
 * Escrito bajo estándares de desarrollo limpio (camelCase, modularidad y separación de responsabilidades)
 */
(function () {
  "use strict";

  // --- 1. CONFIGURACIÓN E INICIALIZACIÓN ---
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollEffects();
    initInteractiveIde();
    initEditableSessions();
    initRegistrationForm();
  });

  // --- 2. CONTROL DE TEMA (CLARO / OSCURO) ---
  /**
   * Inicializa y controla el cambio de tema (Light/Dark mode)
   * Conserva las preferencias del usuario en localStorage
   */
  function initTheme() {
    const themeToggleButton = document.getElementById("theme-toggle");
    const rootElement = document.documentElement;

    // Recuperar tema almacenado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const defaultTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    rootElement.setAttribute("data-theme", defaultTheme);

    themeToggleButton.addEventListener("click", () => {
      const currentTheme = rootElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      rootElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // --- 3. EFECTOS DE NAVEGACIÓN Y APARICIÓN EN SCROLL ---
  /**
   * Maneja el cambio de aspecto de la barra de navegación al hacer scroll
   * y activa las animaciones de aparición en secciones utilizando IntersectionObserver
   */
  function initScrollEffects() {
    const navbar = document.getElementById("navbar");

    // Cambiar sombra de la Navbar al hacer scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.classList.add("navbar--scrolled");
      } else {
        navbar.classList.remove("navbar--scrolled");
      }
    });

    // Observador de intersección para animaciones fade-in (Intersection Observer)
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
      const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      };

      const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach((element) => {
        elementObserver.observe(element);
      });
    } else {
      // Fallback para navegadores antiguos
      revealElements.forEach((element) =>
        element.classList.add("reveal--visible"),
      );
    }
  }

  // --- 4. IDE INTERACTIVO (HERO COMPONENT) ---
  /**
   * Controla la alternancia de código "Sucio" vs "Limpio/Estándar" en el IDE ficticio
   */
  function initInteractiveIde() {
    const toggleButton = document.getElementById("ide-toggle-btn");
    const dirtyCodePanel = document.getElementById("code-dirty");
    const cleanCodePanel = document.getElementById("code-clean");

    let isShowingClean = false;

    toggleButton.addEventListener("click", () => {
      isShowingClean = !isShowingClean;

      if (isShowingClean) {
        dirtyCodePanel.classList.add("code-panel--hidden");
        cleanCodePanel.classList.remove("code-panel--hidden");
        toggleButton.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Ver Código Sucio
            `;
      } else {
        dirtyCodePanel.classList.remove("code-panel--hidden");
        cleanCodePanel.classList.add("code-panel--hidden");
        toggleButton.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Ver Código Estandarizado
            `;
      }
    });
  }

  // --- 5. EDICIÓN INTERACTIVA DE SESIONES VACÍAS (11-16) ---
  /**
   * Carga y guarda los contenidos personalizados de las sesiones 11 a 16
   * directamente desde la interfaz, persistiendo la información en localStorage
   */
  function initEditableSessions() {
    const emptySessionCards = document.querySelectorAll(".session-card--empty");

    emptySessionCards.forEach((card) => {
      const sessionId = card.getAttribute("data-session-id");
      const titleInput = card.querySelector(".session-card__input-title");
      const bodyTextarea = card.querySelector(".session-card__input-body");
      const saveButton = card.querySelector(".session-card__save-btn");
      const statusText = card.querySelector(".session-card__status");

      // Cargar datos previos si existen en localStorage
      const savedDataString = localStorage.getItem(`session_${sessionId}`);
      if (savedDataString) {
        try {
          const savedData = JSON.parse(savedDataString);
          titleInput.value = savedData.title || "";
          bodyTextarea.value = savedData.body || "";

          // Si ya tiene contenido, cambiar estilo visual a "completado"
          if (savedData.title || savedData.body) {
            card.classList.remove("session-card--empty");
          }
        } catch (error) {
          console.error(
            `Error al procesar los datos de la sesión ${sessionId}:`,
            error,
          );
        }
      }

      // Guardar cambios al presionar el botón
      saveButton.addEventListener("click", () => {
        const dataToSave = {
          title: titleInput.value.trim(),
          body: bodyTextarea.value.trim(),
        };

        localStorage.setItem(
          `session_${sessionId}`,
          JSON.stringify(dataToSave),
        );

        // Feedback visual de guardado exitoso
        statusText.classList.add("session-card__status--visible");

        // Si el título no está vacío, remover el estilo punteado
        if (dataToSave.title !== "") {
          card.classList.remove("session-card--empty");
        } else {
          card.classList.add("session-card--empty");
        }

        setTimeout(() => {
          statusText.classList.remove("session-card__status--visible");
        }, 2000);
      });
    });
  }

  // --- 6. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE REGISTRO ---
  /**
   * Maneja la validación dinámica y envío ficticio del formulario de registro
   */
  function initRegistrationForm() {
    const form = document.getElementById("registration-form");
    const formContainer = document.getElementById("form-container");
    const successCard = document.getElementById("success-card");
    const successMessage = document.getElementById("success-message");

    // Elementos de campos e inputs
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const levelSelect = document.getElementById("level");

    // Escuchadores de eventos para remover marcas de error al escribir/interactuar
    nameInput.addEventListener("input", () =>
      clearFieldStatus(nameInput, "name-feedback"),
    );
    emailInput.addEventListener("input", () =>
      clearFieldStatus(emailInput, "email-feedback"),
    );
    levelSelect.addEventListener("change", () =>
      clearFieldStatus(levelSelect, "level-feedback"),
    );

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let isFormValid = true;

      // 1. Validar campo Nombre
      if (nameInput.value.trim().length < 3) {
        setFieldInvalid(nameInput, "name-feedback");
        isFormValid = false;
      }

      // 2. Validar campo Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        setFieldInvalid(emailInput, "email-feedback");
        isFormValid = false;
      }

      // 3. Validar Selector de Nivel
      if (levelSelect.value === "") {
        setFieldInvalid(levelSelect, "level-feedback");
        isFormValid = false;
      }

      // Si el formulario es completamente válido
      if (isFormValid) {
        simulateFormSubmission(nameInput.value.trim());
      }
    });

    // Funciones auxiliares de validación
    function setFieldInvalid(inputElement, feedbackId) {
      inputElement.classList.add("is-invalid");
      const feedbackElement = document.getElementById(feedbackId);
      if (feedbackElement) {
        feedbackElement.classList.add("form-feedback--visible");
      }
    }

    function clearFieldStatus(inputElement, feedbackId) {
      if (inputElement.classList.contains("is-invalid")) {
        inputElement.classList.remove("is-invalid");
        const feedbackElement = document.getElementById(feedbackId);
        if (feedbackElement) {
          feedbackElement.classList.remove("form-feedback--visible");
        }
      }
    }

    function simulateFormSubmission(userName) {
      // Cambiar estado a botón cargando
      const submitBtn = document.getElementById("submit-btn");
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
            <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite;">
              <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="8"></circle>
            </svg>
            Procesando...
          `;

      // Animación de carga keyframe inyectada dinámicamente si no existe
      if (!document.getElementById("spin-keyframe")) {
        const style = document.createElement("style");
        style.id = "spin-keyframe";
        style.innerHTML =
          "@keyframes spin { to { transform: rotate(360deg); } }";
        document.head.appendChild(style);
      }

      // Simular llamada de red
      setTimeout(() => {
        // Ocultar formulario e iniciar tarjeta de éxito
        form.style.display = "none";
        successCard.style.display = "block";

        // Personalizar mensaje de éxito
        successMessage.innerHTML = `
              ¡Hola <strong>${userName}</strong>! Tu plaza provisional para el curso ha sido reservada con éxito.<br>
              Enviamos un correo a <strong>${emailInput.value.trim()}</strong> con las instrucciones para completar tu alta. ¡Nos vemos en la primera sesión!
            `;
      }, 1500);
    }
  }
})();
