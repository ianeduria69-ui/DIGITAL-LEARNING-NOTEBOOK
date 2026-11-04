// render-subject.js — builds the SUBJECT page (the list of lessons, e.g. Electricity).

function padNumber(n) { return n < 10 ? "0" + n : String(n); }

function renderSubject(container, subjectId) {
  const subject = NotebookData.subject(subjectId);
  if (!subject) { renderNotFound(container, "That subject was not found."); return; }

  document.title = subject.title + " – My Learning Notebook";

  const total = subject.lessons.length;
  const done = NotebookStore.completedCount(subject.id, subject.lessons);
  const percent = total ? Math.round((done / total) * 100) : 0;

  const bar = el("div", { class: "progress-bar" });
  bar.style.width = percent + "%";

  const rows = subject.lessons.map(function (lessonId, index) {
    const lesson = NotebookData.lesson(subject.id, lessonId);
    if (!lesson) return null;
    const isDone = NotebookStore.isCompleted(subject.id, lessonId);

    return el("li", null,
      el("a", {
        class: "lesson-row" + (isDone ? " is-done" : ""),
        href: "#/lesson/" + subject.id + "/" + lessonId
      },
        el("span", { class: "lesson-title", text: padNumber(index + 1) + " — " + lesson.title }),
        el("span", { class: "lesson-status", text: isDone ? "✔ Done" : "Not yet" })
      )
    );
  });

  container.append(
    el("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" },
      el("a", { href: "#/", text: "Home" }),
      el("span", { text: "›" }),
      el("span", { text: subject.title })
    ),
    el("h1", { tabindex: "-1", text: subject.icon + " " + subject.title }),
    el("p", { text: subject.description })
  );

  if (total === 0) {
    container.append(el("p", { class: "intro", text: "No lessons here yet. Adding your own lessons will come in a later phase." }));
    return;
  }

  container.append(
    el("div", { class: "progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(percent) }, bar),
    el("p", { class: "subject-meta", text: done + " of " + total + " lessons completed" }),
    el("ol", { class: "lesson-list", style: "list-style:none;padding:0" }, rows)
  );
}
