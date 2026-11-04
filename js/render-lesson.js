// render-lesson.js — builds the LESSON page.
// Sections: title, explanation, infographic, important details,
//           examples, personal notes, review checklist.

function lessonSection(title, children) {
  return el("section", { class: "lesson-section" }, el("h2", { text: title }), children);
}

function renderLesson(container, subjectId, lessonId) {
  const subject = NotebookData.subject(subjectId);
  const lesson = NotebookData.lesson(subjectId, lessonId);
  if (!subject || !lesson) { renderNotFound(container, "That lesson was not found."); return; }

  document.title = lesson.title + " – " + subject.title;

  const position = subject.lessons.indexOf(lessonId);

  // ----- Header + "Mark as completed" button -----
  const doneButton = el("button", { class: "btn btn-done", type: "button" });
  function paintDoneButton() {
    const done = NotebookStore.isCompleted(subjectId, lessonId);
    doneButton.textContent = done ? "✔ Completed (tap to undo)" : "Mark as completed";
    doneButton.classList.toggle("is-done", done);
    doneButton.setAttribute("aria-pressed", done ? "true" : "false");
  }
  doneButton.addEventListener("click", function () {
    const now = !NotebookStore.isCompleted(subjectId, lessonId);
    NotebookStore.setCompleted(subjectId, lessonId, now);
    paintDoneButton();
  });
  paintDoneButton();

  const header = el("div", { class: "lesson-header" },
    el("h1", { tabindex: "-1", text: padNumber(position + 1) + " — " + lesson.title }),
    doneButton
  );

  // ----- Simple explanation -----
  const explanation = lessonSection("Simple Explanation",
    lesson.explanation.map(function (paragraph) { return el("p", { text: paragraph }); })
  );

  // ----- Infographic (a hand-drawn SVG picture) -----
  const infographic = lessonSection("Infographic", [
    el("img", { class: "infographic", src: lesson.infographic, alt: lesson.infographicAlt }),
    el("p", { class: "infographic-caption", text: lesson.infographicAlt })
  ]);

  // ----- Important details -----
  const details = lessonSection("Important Details", [
    el("dl", { class: "details-grid" },
      lesson.details.map(function (item) {
        return el("div", { class: "detail" },
          el("dt", { text: item.label }),
          el("dd", { text: item.value })
        );
      })
    ),
    el("ul", { class: "reminders" },
      lesson.reminders.map(function (text) { return el("li", { text: text }); })
    )
  ]);

  // ----- Examples -----
  const examples = lessonSection("Examples",
    el("ul", { class: "examples" },
      lesson.examples.map(function (text) { return el("li", { text: text }); })
    )
  );

  // ----- Personal notes (saved every time you type) -----
  const notesBox = el("textarea", {
    class: "notes-box",
    id: "personal-notes",
    placeholder: "Write your own explanation or observations here…",
    "aria-label": "Personal notes"
  });
  notesBox.value = NotebookStore.getNotes(subjectId, lessonId);

  const saveStatus = el("p", { class: "save-status", "aria-live": "polite" });
  notesBox.addEventListener("input", function () {
    const ok = NotebookStore.setNotes(subjectId, lessonId, notesBox.value);
    saveStatus.textContent = ok ? "Saved ✓" : "Could not save. Your browser is blocking storage.";
    saveStatus.classList.toggle("is-error", !ok);
  });

  const notes = lessonSection("Personal Notes", [
    notesBox,
    saveStatus
  ]);

  // ----- My pictures and sketches (your own uploads) -----
  const pictures = buildPicturesSection(subjectId, lessonId);

  // ----- Review checklist -----
  const countText = el("p", { class: "checklist-count" });
  function paintChecklistCount() {
    const n = NotebookStore.checkedCount(subjectId, lessonId);
    countText.textContent = n + " of " + lesson.checklist.length + " reviewed";
  }

  const checklistItems = lesson.checklist.map(function (text, index) {
    const box = el("input", { type: "checkbox" });
    box.checked = NotebookStore.isChecked(subjectId, lessonId, index);
    box.addEventListener("change", function () {
      NotebookStore.setChecked(subjectId, lessonId, index, box.checked);
      paintChecklistCount();
    });
    return el("li", null, el("label", null, box, el("span", { text: text })));
  });
  paintChecklistCount();

  const checklist = lessonSection("Review Checklist", [
    el("ul", { class: "checklist" }, checklistItems),
    countText
  ]);

  // ----- Previous / next lesson buttons -----
  const nav = el("div", { class: "lesson-nav" });
  if (position > 0) {
    const prevId = subject.lessons[position - 1];
    nav.append(el("a", { class: "btn", href: "#/lesson/" + subjectId + "/" + prevId, text: "← " + NotebookData.lesson(subjectId, prevId).title }));
  }
  nav.append(el("a", { class: "btn", href: "#/subject/" + subjectId, text: "All " + subject.title + " lessons" }));
  if (position < subject.lessons.length - 1) {
    const nextId = subject.lessons[position + 1];
    nav.append(el("a", { class: "btn", href: "#/lesson/" + subjectId + "/" + nextId, text: NotebookData.lesson(subjectId, nextId).title + " →" }));
  }

  // ----- Put everything on the page -----
  container.append(
    el("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" },
      el("a", { href: "#/", text: "Home" }),
      el("span", { text: "›" }),
      el("a", { href: "#/subject/" + subjectId, text: subject.title }),
      el("span", { text: "›" }),
      el("span", { text: lesson.title })
    ),
    el("div", { class: "lesson-page" }, header, explanation, infographic, details, examples, notes, pictures, checklist, nav)
  );
}
