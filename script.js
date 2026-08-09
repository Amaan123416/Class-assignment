document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const themeToggle = document.getElementById("themeToggle");
  const choicePanel = document.getElementById("choicePanel");
  const choiceMessage = document.getElementById("choiceMessage");
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const savedMessages = document.getElementById("savedMessages");

  function toggleMenu() {
    siteNav.classList.toggle("active");
  }

  function updateTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-mode");
      themeToggle.textContent = "☀️";
    } else {
      document.documentElement.classList.remove("dark-mode");
      themeToggle.textContent = "🌙";
    }
    localStorage.setItem("siteTheme", theme);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem("siteTheme") || "light";
    updateTheme(savedTheme);
  }

  function displayChoice(choice) {
    const suggestions = {
      "Landing page": "Use a strong hero headline, a clean call-to-action, and three supporting feature cards.",
      "Portfolio": "Showcase your best work with project summaries and a consistent project card layout.",
      "Contact form": "Keep the contact form easy to scan, with clear labels and a friendly thank-you message.",
    };

    choiceMessage.textContent = suggestions[choice] || "Pick an option to see a quick suggestion.";
  }

  function showSavedMessages() {
    const stored = JSON.parse(localStorage.getItem("savedContactMessages") || "[]");

    if (!savedMessages) return;

    savedMessages.innerHTML = "";

    if (!stored.length) {
      const empty = document.createElement("p");
      empty.className = "saved-empty";
      empty.textContent = "No saved messages yet. Submit the form to save a message locally.";
      savedMessages.appendChild(empty);
      return;
    }

    stored.forEach((item) => {
      const card = document.createElement("article");
      card.className = "saved-message";
      card.innerHTML = `
        <strong>${item.name}</strong>
        <span>${item.email}</span>
        <p>${item.message}</p>
        <small>${new Date(item.date).toLocaleString()}</small>
      `;
      savedMessages.appendChild(card);
    });
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const nextTheme = document.documentElement.classList.contains("dark-mode") ? "light" : "dark";
      updateTheme(nextTheme);
    });
  }

  if (choicePanel && choiceMessage) {
    choicePanel.addEventListener("click", function (event) {
      const button = event.target.closest(".choice-button");
      if (!button) return;
      const choice = button.dataset.choice;
      displayChoice(choice);
      document.querySelectorAll(".choice-button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  }

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        formFeedback.textContent = "Please fill in all fields before sending.";
        return;
      }

      const stored = JSON.parse(localStorage.getItem("savedContactMessages") || "[]");
      stored.unshift({
        name,
        email,
        message,
        date: new Date().toISOString(),
      });
      localStorage.setItem("savedContactMessages", JSON.stringify(stored.slice(0, 5)));

      formFeedback.textContent = `Thanks, ${name}! Your message is saved locally.`;
      contactForm.reset();
      showSavedMessages();
    });
  }

  loadTheme();
  showSavedMessages();
});
