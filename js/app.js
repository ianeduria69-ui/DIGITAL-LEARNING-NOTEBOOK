// app.js — starts the app and holds two small helpers used by every page builder.

// Helper 1: build an HTML element in one line.
//   el("p", { class: "intro", text: "Hello" })  ->  <p class="intro">Hello</p>
// "text" uses textContent, so what you type can never break the page.
function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach(function (name) {
      const value = props[name];
      if (value === null || value === undefined || value === false) return;
      if (name === "class") node.className = value;
      else if (name === "text") node.textContent = value;
      else node.setAttribute(name, value === true ? "" : value);
    });
  }
  children.flat().forEach(function (child) {
    if (child === null || child === undefined || child === false) return;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  });
  return node;
}

// Helper 2: find subjects and lessons in the data files.
const NotebookData = {
  subject: function (id) {
    return NOTEBOOK_SUBJECTS.find(function (s) { return s.id === id; }) || null;
  },
  lesson: function (subjectId, lessonId) {
    return NOTEBOOK_LESSONS[subjectId + "/" + lessonId] || null;
  }
};

// Start everything when the page has finished loading.
document.addEventListener("DOMContentLoaded", function () {
  if (!NotebookStore.isPersistent()) {
    document.getElementById("storage-warning").hidden = false;
  }
  Router.start(document.getElementById("app"));
});
