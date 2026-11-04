// storage.js — the ONLY file that saves and loads your personal data.
// It uses the browser's localStorage (free, no server needed).
//
// What we save, for each lesson:
//   notes     -> your own notes (text)
//   checked   -> which review-checklist items you ticked
//   completed -> did you mark the lesson as completed?

const NotebookStore = (function () {
  const KEY = "learningNotebook.v1";   // the name of our "drawer" in localStorage
  let data = { version: 1, lessons: {} };
  let persistent = true;               // becomes false if the browser blocks saving

  // Read everything from the drawer when the app starts.
  function load() {
    try {
      localStorage.setItem("__notebook_test", "1");   // can we write at all?
      localStorage.removeItem("__notebook_test");
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.lessons === "object" && parsed.lessons !== null) {
          data = parsed;
        }
      }
    } catch (error) {
      persistent = false;
    }
  }

  // Write everything back to the drawer. Returns true if it worked.
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      persistent = false;
      return false;
    }
  }

  function key(subjectId, lessonId) { return subjectId + "/" + lessonId; }

  // Look at a lesson's saved info without creating anything.
  function peek(subjectId, lessonId) { return data.lessons[key(subjectId, lessonId)] || null; }

  // Get (or create) a lesson's saved info so we can change it.
  function entry(subjectId, lessonId) {
    const k = key(subjectId, lessonId);
    if (!data.lessons[k]) data.lessons[k] = { notes: "", checked: {}, completed: false };
    return data.lessons[k];
  }

  load();

  return {
    isPersistent: function () { return persistent; },

    getNotes: function (subjectId, lessonId) {
      const e = peek(subjectId, lessonId);
      return e && typeof e.notes === "string" ? e.notes : "";
    },
    setNotes: function (subjectId, lessonId, text) {
      entry(subjectId, lessonId).notes = text;
      return save();
    },

    isChecked: function (subjectId, lessonId, index) {
      const e = peek(subjectId, lessonId);
      return !!(e && e.checked && e.checked[index]);
    },
    setChecked: function (subjectId, lessonId, index, value) {
      const e = entry(subjectId, lessonId);
      if (value) { e.checked[index] = true; } else { delete e.checked[index]; }
      return save();
    },
    checkedCount: function (subjectId, lessonId) {
      const e = peek(subjectId, lessonId);
      return e && e.checked ? Object.keys(e.checked).length : 0;
    },

    isCompleted: function (subjectId, lessonId) {
      const e = peek(subjectId, lessonId);
      return !!(e && e.completed);
    },
    setCompleted: function (subjectId, lessonId, value) {
      entry(subjectId, lessonId).completed = !!value;
      return save();
    },
    completedCount: function (subjectId, lessonIds) {
      return lessonIds.filter(function (id) {
        const e = peek(subjectId, id);
        return e && e.completed;
      }).length;
    }
  };
})();
