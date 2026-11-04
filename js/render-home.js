// render-home.js — builds the HOME page (the subject cards).
// Also holds the small "not found" page used when an address is wrong.

function renderNotFound(container, message) {
  container.append(
    el("h1", { tabindex: "-1", text: "Oops!" }),
    el("p", { text: message || "That page was not found." }),
    el("a", { class: "btn", href: "#/", text: "Go to Home" })
  );
}

function renderHome(container) {
  document.title = "My Learning Notebook";

  const cards = NOTEBOOK_SUBJECTS.map(function (subject) {
    const total = subject.lessons.length;
    const done = NotebookStore.completedCount(subject.id, subject.lessons);
    const info = total === 0
      ? "No lessons yet"
      : total + (total === 1 ? " lesson" : " lessons") + " · " + done + " completed";

    return el("a", { class: "card subject-card", href: "#/subject/" + subject.id },
      el("span", { class: "subject-icon", "aria-hidden": "true", text: subject.icon }),
      el("h2", { text: subject.title }),
      el("p", { class: "subject-desc", text: subject.description }),
      el("p", { class: "subject-meta", text: info })
    );
  });

  container.append(
    el("h1", { tabindex: "-1", text: "MY LEARNING NOTEBOOK" }),
    el("p", { class: "intro", text: "Choose a subject to start studying." }),
    el("div", { class: "subject-grid" }, cards)
  );
}
