/* =====================================
   CRAFTLY — Main JavaScript
   Build by Nayon Ahamed | NCX
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const storage = {
    get(key, fallback = null) {
      try {
        return localStorage.getItem(key) ?? fallback;
      } catch {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }
  };

  // ---------- Theme ----------
  const themeButton = $("#themeButton");
  const themeOptions = $$(".theme-option");
  const colorDots = $$(".color-dot");
  const customColor = $("#customColor");
  const resetColorButton = $("#resetColorButton");

  const defaultColor = "#2C8C83";

  function applyTheme(theme, save = true) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    document.body.classList.toggle(
      "light-theme",
      selectedTheme === "light"
    );

    themeOptions.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.theme === selectedTheme
      );
    });

    if (save) {
      storage.set("craftly-theme", selectedTheme);
    }
  }

  function applyAccent(color, save = true) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return;

    document.documentElement.style.setProperty("--accent", color);

    colorDots.forEach(dot => {
      dot.classList.toggle(
        "active",
        dot.dataset.color?.toLowerCase() === color.toLowerCase()
      );
    });

    if (customColor) {
      customColor.value = color;
    }

    if (save) {
      storage.set("craftly-accent", color);
    }
  }

  applyTheme(storage.get("craftly-theme", "dark"), false);
  applyAccent(storage.get("craftly-accent", defaultColor), false);

  themeOptions.forEach(button => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.theme);
    });
  });

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-theme");
      applyTheme(isLight ? "dark" : "light");
    });
  }

  colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
      applyAccent(dot.dataset.color);
    });
  });

  if (customColor) {
    customColor.addEventListener("input", () => {
      applyAccent(customColor.value);
    });
  }

  if (resetColorButton) {
    resetColorButton.addEventListener("click", () => {
      applyAccent(defaultColor);
    });
  }

  // ---------- Navigation ----------
  const sidebar = $("#sidebar");
  const sidebarOverlay = $("#sidebarOverlay");
  const menuButton = $("#menuButton");
  const breadcrumbTitle = $("#breadcrumbTitle");

  const pageTitles = {
    dashboard: "Dashboard",
    builder: "AI Website Builder",
    projects: "My Projects",
    templates: "Template Library",
    editor: "Code Editor",
    api: "API Manager",
    settings: "Settings",
    about: "About CRAFTLY"
  };

  function closeSidebar() {
    sidebar?.classList.remove("open");
    sidebarOverlay?.classList.remove("visible");
  }

  function navigateTo(sectionId) {
    const target = document.getElementById(sectionId);
    const dashboard = $("#dashboard");

    if (!target) return;

    // Hide all main sections first.
    $$(".page-section").forEach(section => {
      section.style.display = "none";
    });

    // Show the correct page.
    if (sectionId === "dashboard") {
      if (dashboard) dashboard.style.display = "block";
    } else if (
      sectionId === "builder" ||
      sectionId === "projects"
    ) {
      if (dashboard) dashboard.style.display = "block";
      target.style.display = "block";
    } else {
      target.style.display = "block";
    }

    if (breadcrumbTitle) {
      breadcrumbTitle.textContent =
        pageTitles[sectionId] || "CRAFTLY";
    }

    $$(".nav-link").forEach(link => {
      const linkId = (link.dataset.section || "")
        .replace("#", "");

      link.classList.toggle("active", linkId === sectionId);
    });

    closeSidebar();

    if (sectionId !== "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (history.replaceState) {
      history.replaceState(null, "", `#${sectionId}`);
    }
  }

  $$("[data-section]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      const sectionId = (link.dataset.section || "")
        .replace("#", "");

      navigateTo(sectionId);
    });
  });

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      sidebar?.classList.toggle("open");
      sidebarOverlay?.classList.toggle("visible");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  // Initial page
  const initialPage = location.hash.replace("#", "");
  navigateTo(
    pageTitles[initialPage] ? initialPage : "dashboard"
  );

  // ---------- Login Dialog ----------
  const loginDialog = $("#loginDialog");
  const loginButton = $("#loginButton");
  const closeDialog = $("#closeDialog");
  const googleLogin = $("#googleLogin");
  const emailLogin = $("#emailLogin");
  const guestLogin = $("#guestLogin");

  function openLoginDialog() {
    if (!loginDialog) return;

    if (typeof loginDialog.showModal === "function") {
      if (!loginDialog.open) loginDialog.showModal();
    } else {
      loginDialog.hidden = false;
      loginDialog.classList.add("visible");
    }
  }

  function closeLoginDialog() {
    if (!loginDialog) return;

    if (typeof loginDialog.close === "function" &&
        loginDialog.open) {
      loginDialog.close();
    } else {
      loginDialog.hidden = true;
      loginDialog.classList.remove("visible");
    }
  }

  loginButton?.addEventListener("click", openLoginDialog);
  closeDialog?.addEventListener("click", closeLoginDialog);

  googleLogin?.addEventListener("click", () => {
    alert(
      "Google login is not configured yet. " +
      "A secure authentication backend is required."
    );
  });

  emailLogin?.addEventListener("click", () => {
    alert(
      "Email login is not configured yet. " +
      "A secure authentication backend is required."
    );
  });

  guestLogin?.addEventListener("click", () => {
    storage.set("craftly-guest-mode", "true");

    if (loginButton) {
      loginButton.textContent = "Guest Mode";
    }

    closeLoginDialog();

    alert(
      "Guest Mode activated. You can explore the available " +
      "workspace features on this device."
    );
  });

  if (storage.get("craftly-guest-mode") === "true" && loginButton) {
    loginButton.textContent = "Guest Mode";
  }

  // ---------- Template Selection ----------
  const templateButtons = $$(".template-button");
  const websitePrompt = $("#websitePrompt");
  const builderStatus = $("#builderStatus");

  const templatePrompts = {
    "Business":
      "Create a professional business website with a homepage, " +
      "about section, services, contact information and a clean layout.",

    "Portfolio":
      "Create a modern personal portfolio website with an introduction, " +
      "skills, projects, experience and contact section.",

    "Online Store":
      "Create a modern online store layout with product cards, " +
      "categories, shopping information and contact details.",

    "Blog":
      "Create a clean blog website with featured articles, " +
      "categories, recent posts and an about section."
  };

  templateButtons.forEach(button => {
    button.addEventListener("click", () => {
      const templateCard = button.closest("[data-template]");
      const templateName =
        templateCard?.dataset.template ||
        button.dataset.template;

      const prompt = templatePrompts[templateName];

      if (!prompt) return;

      if (websitePrompt) {
        websitePrompt.value = prompt;
      }

      if (builderStatus) {
        builderStatus.textContent =
          `${templateName} template selected. ` +
          "Customize the prompt in AI Builder.";
      }

      navigateTo("builder");
      websitePrompt?.focus();
    });
  });

  // ---------- AI Builder ----------
  const generateButton = $("#generateButton");

  generateButton?.addEventListener("click", () => {
    const prompt = websitePrompt?.value.trim() || "";

    if (!prompt) {
      if (builderStatus) {
        builderStatus.textContent =
          "Please describe the website you want to create.";
      }

      websitePrompt?.focus();
      return;
    }

    if (prompt.length > 5000) {
      if (builderStatus) {
        builderStatus.textContent =
          "Your prompt is too long. Please keep it under 5000 characters.";
      }
      return;
    }

    if (builderStatus) {
      builderStatus.textContent =
        "AI generation is not connected yet. " +
        "Configure a secure backend and AI API before generating websites.";
    }

    // No fake generation or fake API response.
  });

  // ---------- Keyboard Support ----------
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
      closeLoginDialog();
    }
  });

  // ---------- App Ready ----------
  console.info("CRAFTLY interface initialized.");
});
