// router.js — decides which page to show, based on the web address after the "#".
//
//   #/                              -> Home
//   #/subject/electricity           -> Subject page
//   #/lesson/electricity/voltage    -> Lesson page
//
// Because the address changes, the Back button on your phone works,
// and refreshing the page keeps you on the same lesson.

const Router = {
  container: null,

  start: function (container) {
    this.container = container;
    window.addEventListener("hashchange", () => this.render());
    this.render();
  },

  // "#/lesson/electricity/voltage" -> ["lesson", "electricity", "voltage"]
  parts: function () {
    return location.hash
      .replace(/^#\/?/, "")
      .split("/")
      .filter(Boolean)
      .map(decodeURIComponent);
  },

  render: function () {
    const p = this.parts();
    const c = this.container;
    c.replaceChildren();          // clear the old page

    if (p.length === 0) {
      renderHome(c);
    } else if (p[0] === "subject" && p[1]) {
      renderSubject(c, p[1]);
    } else if (p[0] === "lesson" && p[1] && p[2]) {
      renderLesson(c, p[1], p[2]);
    } else {
      renderNotFound(c, "That page was not found.");
    }

    window.scrollTo(0, 0);
    const heading = c.querySelector("h1");
    if (heading) heading.focus({ preventScroll: true });   // helps screen readers
  }
};
