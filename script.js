/* ==========================================
   CRAFTLY — Main JavaScript
   Build by Nayon Ahamed | NCX
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. HELPERS
  // ========================================

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

  // ========================================
  // 2. THEME SYSTEM
  // ========================================

  const themeButton = $("#themeButton");
  const themeOptions = $$(".theme-option");
  const colorDots = $$(".color-dot");
  const customColor = $("#customColor");
  const resetColorButton = $("#resetColorButton");

  const DEFAULT_COLOR = "#2C8C83";

  function applyTheme(theme, save = true) {
    const selected = theme === "light" ? "light" : "dark";

    document.body.classList.toggle(
      "light-theme",
      selected === "light"
    );

    themeOptions.forEach(button => {
      const active = button.dataset.theme === selected;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (save) {
      storage.set("craftly-theme", selected);
    }
  }

  function applyAccent(color, save = true) {
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return;

    document.documentElement.style.setProperty("--accent", color);

    const normalized = color.toLowerCase();

    colorDots.forEach(dot => {
      const active =
        dot.dataset.color?.toLowerCase() === normalized;

      dot.classList.toggle("selected", active);
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-pressed", String(active));
    });

    if (customColor && customColor.value !== color) {
      customColor.value = color;
    }

    if (save) {
      storage.set("craftly-accent", color);
    }
  }

  applyTheme(storage.get("craftly-theme", "dark"), false);

  applyAccent(
    storage.get("craftly-accent", DEFAULT_COLOR),
    false
  );

  themeOptions.forEach(button => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.theme);
    });
  });

  themeButton?.addEventListener("click", () => {
    const current = document.body.classList.contains("light-theme");

    applyTheme(current ? "dark" : "light");
  });

  colorDots.forEach(dot => {
    dot.addEventListener("click", () => {
      applyAccent(dot.dataset.color);
    });
  });

  customColor?.addEventListener("input", () => {
    applyAccent(customColor.value);
  });

  resetColorButton?.addEventListener("click", () => {
    applyAccent(DEFAULT_COLOR);
  });

  // ========================================
  // 3. NAVIGATION SYSTEM
  // ========================================

  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuButton = $("#menuButton");
  const breadcrumb = $("#breadcrumbTitle");

  const dashboard = $("#dashboard");

  const pageTitles = {
    dashboard: "Dashboard",
    builder: "AI Website Builder",
    templates: "Template Library",
    editor: "Code Editor",
    projects: "My Projects",
    settings: "Settings",
    api: "API Manager",
    about: "About CRAFTLY"
  };

  function closeSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  function openSidebar() {
    sidebar?.classList.add("open");
    overlay?.classList.add("visible");
    menuButton?.setAttribute("aria-expanded", "true");
  }

  function navigateTo(id) {
    const target = document.getElementById(id);

    if (!target || !pageTitles[id]) return;

    // Hide all top-level pages.
    $$(".page-content > .page-section").forEach(section => {
      section.style.display = "none";
    });

    // Dashboard contains Builder and Projects.
    if (id === "dashboard") {
      dashboard.style.display = "block";

      $("#builder")?.scrollIntoView({
        block: "start",
        behavior: "auto"
      });

      window.scrollTo({ top: 0, behavior: "auto" });

    } else if (id === "builder" || id === "projects") {

      dashboard.style.display = "block";

      target.scrollIntoView({
        block: "start",
        behavior: "auto"
      });

    } else {
      target.style.display = "block";

      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    }

    if (breadcrumb) {
      breadcrumb.textContent = pageTitles[id];
    }

    $$(".nav-link").forEach(link => {
      const active = link.dataset.section === id;

      link.classList.toggle("active", active);
      link.setAttribute("aria-current", active ? "page" : "false");
    });

    closeSidebar();

    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }
  }

  // Navigation links.
  $$("[data-section]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      navigateTo(link.dataset.section);
    });
  });

  // Other internal links.
  $$('a[href^="#"]:not([data-section])').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href").slice(1);

      if (!pageTitles[id]) return;

      event.preventDefault();
      navigateTo(id);
    });
  });

  menuButton?.addEventListener("click", () => {
    const isOpen = sidebar?.classList.contains("open");

    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay?.addEventListener("click", closeSidebar);

  // Initial page.
  const initialPage = location.hash.slice(1);

  navigateTo(
    Object.hasOwn(pageTitles, initialPage)
      ? initialPage
      : "dashboard"
  );

  // ========================================
  // 4. LOGIN DIALOG
  // ========================================

  const loginDialog = $("#loginDialog");
  const loginButton = $("#loginButton");

  const closeDialogButton = $("#closeDialog");
  const googleLogin = $("#googleLogin");
  const emailLogin = $("#emailLogin");
  const guestLogin = $("#guestLogin");

  function openLoginDialog() {
    if (!loginDialog) return;

    if (typeof loginDialog.showModal === "function") {
      if (!loginDialog.open) {
        loginDialog.showModal();
      }
    } else {
      loginDialog.hidden = false;
    }
  }

  function closeLoginDialog() {
    if (!loginDialog) return;

    if (typeof loginDialog.close === "function" &&
        loginDialog.open) {
      loginDialog.close();
    } else {
      loginDialog.hidden = true;
    }
  }

  loginButton?.addEventListener("click", openLoginDialog);

  closeDialogButton?.addEventListener(
    "click",
    closeLoginDialog
  );

  googleLogin?.addEventListener("click", () => {
    alert(
      "Google login is not configured yet. " +
      "Secure authentication setup is required."
    );
  });

  emailLogin?.addEventListener("click", () => {
    alert(
      "Email login is not configured yet. " +
      "Secure authentication setup is required."
    );
  });

  guestLogin?.addEventListener("click", () => {
    storage.set("craftly-guest-mode", "true");

    if (loginButton) {
      loginButton.textContent = "Guest Mode";
    }

    closeLoginDialog();

    alert("Guest Mode activated successfully.");
  });

  if (
    storage.get("craftly-guest-mode") === "true" &&
    loginButton
  ) {
    loginButton.textContent = "Guest Mode";
  }

  // ========================================
  // 5. TEMPLATE SELECTION
  // ========================================

  const websitePrompt = $("#websitePrompt");
  const builderStatus = $("#builderStatus");

  const templatePrompts = {
    "Business":
      "Create a professional business website with homepage, " +
      "about, services and contact sections.",

    "Portfolio":
      "Create a modern personal portfolio with introduction, " +
      "skills, projects and contact information.",

    "Online Store":
      "Create a modern online store with product cards, " +
      "categories and shopping information.",

    "Blog":
      "Create a clean blog website with featured articles, " +
      "categories and recent posts."
  };

  $$(".template-button").forEach(button => {
    button.addEventListener("click", () => {

      const card = button.closest("[data-template]");

      const name =
        card?.dataset.template ||
        button.dataset.template;

      const prompt = templatePrompts[name];

      if (!prompt || !websitePrompt) return;

      websitePrompt.value = prompt;

      if (builderStatus) {
        builderStatus.textContent =
          `${name} template selected. Customize your prompt.`;
      }

      navigateTo("builder");

      websitePrompt.focus();
    });
  });

  // ========================================
  // 6. AI BUILDER VALIDATION
  // ========================================

  const generateButton = $("#generateButton");

  generateButton?.addEventListener("click", () => {

    const prompt = websitePrompt?.value.trim() || "";

    if (!prompt) {
      if (builderStatus) {
        builderStatus.textContent =
          "Please describe your website idea first.";
      }

      websitePrompt?.focus();
      return;
    }

    if (prompt.length > 5000) {
      builderStatus.textContent =
        "Prompt is too long. Maximum length is 5000 characters.";

      return;
    }

    if (builderStatus) {
      builderStatus.textContent =
        "AI service is not connected yet. " +
        "A secure backend and API configuration are required.";
    }

  });

  // ========================================
  // 7. KEYBOARD ACCESSIBILITY
  // ========================================

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });
   // ========================================
  // 8. CODE EDITOR + LIVE PREVIEW
  // ========================================

  const htmlCode = $("#htmlCode");
  const cssCode = $("#cssCode");
  const jsCode = $("#jsCode");
  const previewFrame = $("#livePreview");
  const previewButton = $("#previewButton");
  const resetCodeButton = $("#resetCodeButton");
  const clearCodeButton = $("#clearCodeButton");
  const editorStatus = $("#editorStatus");

  const editorTabs = $$("[data-code-tab]");
  const deviceButtons = $$("[data-preview-size]");

  const defaultHTML = `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome to My Website!</h1>
  <p>Created with CRAFTLY.</p>
  <button>Get Started</button>
</body>
</html>`;

  const defaultCSS = `body {
  font-family: Arial, sans-serif;
  padding: 30px;
  background: #f4f6f5;
  color: #202b2b;
}

h1 {
  color: #2c8c83;
}

button {
  padding: 12px 20px;
  background: #2c8c83;
  color: white;
  border: none;
  border-radius: 8px;
}`;

  const defaultJS = `console.log("CRAFTLY Preview Ready");`;

  let activeCodeTab = "html";

  function setEditorStatus(message) {
    if (editorStatus) {
      editorStatus.textContent = message;
    }
  }

  function switchCodeTab(tabName) {
    const editors = {
      html: htmlCode,
      css: cssCode,
      js: jsCode
    };

    if (!editors[tabName]) return;

    activeCodeTab = tabName;

    Object.entries(editors).forEach(([name, editor]) => {
      if (editor) {
        editor.hidden = name !== tabName;
      }
    });

    editorTabs.forEach(button => {
      const active = button.dataset.codeTab === tabName;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    setEditorStatus(`${tabName.toUpperCase()} editor selected.`);
  }

  editorTabs.forEach(button => {
    button.addEventListener("click", () => {
      switchCodeTab(button.dataset.codeTab);
    });
  });

  function runCodePreview() {
    if (!htmlCode || !cssCode || !jsCode || !previewFrame) {
      setEditorStatus("Editor elements could not be found.");
      return;
    }

    let page = htmlCode.value.trim();

    if (!page) {
      page = "<!DOCTYPE html><html><head></head><body></body></html>";
    }

    const styleTag = `<style>
${cssCode.value}
</style>`;

    if (/<\/head>/i.test(page)) {
      page = page.replace(/<\/head>/i, `${styleTag}</head>`);
    } else {
      page = `${styleTag}${page}`;
    }

    // Prevent user JavaScript from closing the injected script tag.
    const safeJavaScript = jsCode.value.replace(
      /<\/script/gi,
      "<\\/script"
    );

    const scriptTag = `<script>
${safeJavaScript}
<\/script>`;

    if (/<\/body>/i.test(page)) {
      page = page.replace(/<\/body>/i, `${scriptTag}</body>`);
    } else {
      page += scriptTag;
    }

    previewFrame.srcdoc = page;
    setEditorStatus("Preview updated successfully.");
  }

  previewButton?.addEventListener("click", runCodePreview);

  resetCodeButton?.addEventListener("click", () => {
    if (!htmlCode || !cssCode || !jsCode) return;

    htmlCode.value = defaultHTML;
    cssCode.value = defaultCSS;
    jsCode.value = defaultJS;

    switchCodeTab("html");
    runCodePreview();

    setEditorStatus("Editor restored to default code.");
  });

  clearCodeButton?.addEventListener("click", () => {
    const editors = {
      html: htmlCode,
      css: cssCode,
      js: jsCode
    };

    const activeEditor = editors[activeCodeTab];

    if (!activeEditor) return;

    activeEditor.value = "";

    setEditorStatus(
      `${activeCodeTab.toUpperCase()} code cleared.`
    );
  });

  deviceButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (!previewFrame) return;

      const isMobile =
        button.dataset.previewSize === "mobile";

      previewFrame.classList.toggle("is-mobile", isMobile);

      deviceButtons.forEach(item => {
        const active = item === button;

        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      setEditorStatus(
        isMobile ? "Mobile preview selected." : "Desktop preview selected."
      );
    });
  });

  // Initial editor state
  if (htmlCode && cssCode && jsCode) {
    switchCodeTab("html");
    runCodePreview();
  }

  // ========================================
  // 9. INITIALIZATION
  // ========================================

  console.info("CRAFTLY initialized successfully.");

});
