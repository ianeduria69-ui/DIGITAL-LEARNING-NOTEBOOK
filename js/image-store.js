// image-store.js — saves YOUR pictures (screenshots, photos, hand sketches) in the browser.
//
// Why not localStorage? Pictures are big, and localStorage is only about 5 MB.
// IndexedDB is a bigger drawer built into every browser. It is free and needs no server.
//
// Also, before saving, every picture is made smaller (longest side 1600 px).
// A 6 MB phone photo becomes a few hundred KB, so you can save many pictures.

const ImageStore = (function () {
  const DB_NAME = "learningNotebookPictures";
  const STORE = "pictures";
  const MAX_SIDE = 1600;        // longest side of a saved picture, in pixels
  let dbPromise = null;

  // Open the drawer (and create it the first time).
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error("This browser cannot save pictures."));
        return;
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function () {
        const store = request.result.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("lessonKey", "lessonKey");
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
    dbPromise.catch(function () { dbPromise = null; });   // allow a retry later
    return dbPromise;
  }

  // Do one job in the drawer and wait until it is really finished.
  function run(mode, work) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        const transaction = db.transaction(STORE, mode);
        const request = work(transaction.objectStore(STORE));
        transaction.oncomplete = function () { resolve(request ? request.result : undefined); };
        transaction.onerror = function () { reject(transaction.error || new Error("Could not save.")); };
        transaction.onabort = function () { reject(transaction.error || new Error("Could not save.")); };
      });
    });
  }

  return {
    // Make a chosen picture smaller. Gives back a JPEG blob.
    // Rejects if the file is not a picture the browser can open.
    prepare: function (file) {
      return new Promise(function (resolve, reject) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";                       // white behind see-through PNGs
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          canvas.toBlob(function (blob) {
            if (blob) resolve(blob); else reject(new Error("not-a-picture"));
          }, "image/jpeg", 0.85);
        };
        img.onerror = function () {
          URL.revokeObjectURL(url);
          reject(new Error("not-a-picture"));
        };
        img.src = url;
      });
    },

    // Save one picture for one lesson.
    add: function (subjectId, lessonId, blob, caption, fileName) {
      const record = {
        id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
        lessonKey: subjectId + "/" + lessonId,
        blob: blob,
        caption: caption || "",
        fileName: fileName || "",
        createdAt: Date.now()
      };
      return run("readwrite", function (store) { return store.put(record); });
    },

    // Get all pictures of one lesson, oldest first.
    list: function (subjectId, lessonId) {
      return run("readonly", function (store) {
        return store.index("lessonKey").getAll(subjectId + "/" + lessonId);
      }).then(function (items) {
        return (items || []).sort(function (a, b) { return a.createdAt - b.createdAt; });
      });
    },

    // Delete one picture.
    remove: function (id) {
      return run("readwrite", function (store) { return store.delete(id); });
    }
  };
})();
