// render-pictures.js — builds the "My Pictures and Sketches" box on the lesson page.
//
// How it works for you:
//   1. Press "Choose picture" and pick a screenshot, photo, or sketch from your device.
//   2. You see a preview. You can type a caption.
//   3. Press "Save picture". It is saved in this browser and shows in the gallery.
//   4. Tap a picture to see it bigger. Press "Remove" to delete it.

function buildPicturesSection(subjectId, lessonId) {
  let pending = null;        // the picture waiting for the Save button: { blob, name }
  let pendingUrl = null;
  let galleryUrls = [];      // temporary addresses of the pictures on screen

  // ----- Choose button (the real file input is hidden, the label is the button) -----
  const fileInput = el("input", { type: "file", accept: "image/*", id: "picture-file", class: "sr-only" });
  const chooseLabel = el("label", { class: "btn choose-btn", for: "picture-file", text: "📷 Choose picture" });

  // ----- Preview + caption + Save/Cancel (hidden until you choose a picture) -----
  const previewImg = el("img", { class: "picture-preview", alt: "Preview of the picture you chose" });
  const captionInput = el("input", {
    type: "text", class: "caption-input", maxlength: "120",
    placeholder: "Caption (optional)", "aria-label": "Picture caption"
  });
  const saveButton = el("button", { class: "btn", type: "button", text: "💾 Save picture" });
  const cancelButton = el("button", { class: "btn", type: "button", text: "Cancel" });
  const preview = el("div", { class: "picture-pending", hidden: true },
    previewImg,
    captionInput,
    el("div", { class: "picture-actions" }, saveButton, cancelButton)
  );

  const status = el("p", { class: "save-status picture-status", "aria-live": "polite" });
  const gallery = el("div", { class: "gallery" });

  // ----- Big viewer -----
  const viewerImg = el("img", { class: "viewer-img", alt: "" });
  const closeButton = el("button", { class: "btn", type: "button", text: "Close" });
  const viewer = el("dialog", { class: "viewer" }, viewerImg, closeButton);
  closeButton.addEventListener("click", function () { viewer.close(); });
  viewer.addEventListener("click", function (event) { if (event.target === viewer) viewer.close(); });

  function setStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("is-error", !!isError);
  }

  function clearPending() {
    pending = null;
    if (pendingUrl) { URL.revokeObjectURL(pendingUrl); pendingUrl = null; }
    previewImg.removeAttribute("src");
    preview.hidden = true;
    fileInput.value = "";
    captionInput.value = "";
    saveButton.disabled = false;
  }

  // Show all saved pictures of this lesson.
  function refreshGallery() {
    return ImageStore.list(subjectId, lessonId).then(function (items) {
      galleryUrls.forEach(function (url) { URL.revokeObjectURL(url); });
      galleryUrls = [];
      gallery.replaceChildren();

      if (items.length === 0) {
        gallery.append(el("p", { class: "gallery-empty", text: "No pictures yet for this lesson." }));
        return;
      }

      items.forEach(function (item) {
        const url = URL.createObjectURL(item.blob);
        galleryUrls.push(url);
        const label = item.caption || "My picture";

        const openButton = el("button", { class: "gallery-open", type: "button", "aria-label": "View bigger: " + label },
          el("img", { class: "gallery-img", src: url, alt: label })
        );
        openButton.addEventListener("click", function () {
          viewerImg.src = url;
          viewerImg.alt = label;
          viewer.showModal();
        });

        const removeButton = el("button", { class: "btn btn-small", type: "button", text: "Remove" });
        removeButton.addEventListener("click", function () {
          if (!window.confirm("Remove this picture? This cannot be undone.")) return;
          ImageStore.remove(item.id)
            .then(function () { setStatus("Picture removed.", false); return refreshGallery(); })
            .catch(function () { setStatus("Could not remove the picture.", true); });
        });

        gallery.append(el("figure", { class: "gallery-item" },
          openButton,
          item.caption ? el("figcaption", { text: item.caption }) : null,
          removeButton
        ));
      });
    }).catch(function (error) {
      setStatus(error && error.message ? error.message : "Saved pictures could not be loaded.", true);
    });
  }

  // When you choose a file: make it smaller, then show the preview.
  fileInput.addEventListener("change", function () {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    setStatus("Preparing picture…", false);

    ImageStore.prepare(file).then(function (blob) {
      clearPending();
      pending = { blob: blob, name: file.name };
      pendingUrl = URL.createObjectURL(blob);
      previewImg.src = pendingUrl;
      preview.hidden = false;
      setStatus("Check the picture, then press Save.", false);
    }).catch(function () {
      clearPending();
      setStatus("That file could not be opened as a picture. Try a JPG or PNG.", true);
    });
  });

  saveButton.addEventListener("click", function () {
    if (!pending) return;
    saveButton.disabled = true;           // stop double-saving
    ImageStore.add(subjectId, lessonId, pending.blob, captionInput.value.trim(), pending.name)
      .then(function () {
        clearPending();
        setStatus("Saved ✓", false);
        return refreshGallery();
      })
      .catch(function () {
        saveButton.disabled = false;
        setStatus("Could not save the picture. Your browser may be blocking storage or is full.", true);
      });
  });

  cancelButton.addEventListener("click", function () {
    clearPending();
    setStatus("", false);
  });

  refreshGallery();

  return lessonSection("My Pictures and Sketches", [
    el("p", { text: "Add your own screenshots, photos, or hand-drawn sketches for this lesson." }),
    el("div", { class: "picture-tools" }, fileInput, chooseLabel),
    preview,
    status,
    gallery,
    viewer
  ]);
}
