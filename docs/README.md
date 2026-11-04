# Digital Learning Notebook (prototype)

## How to run
1. Unzip the folder.
2. Double-click `index.html` (it opens in your browser). That is all.
3. Optional in VS Code: install the free "Live Server" extension, right-click `index.html`, then "Open with Live Server".

## What is inside
- `index.html`: the one page
- `css/`: the looks
- `js/`: the brain (`router.js` picks the page, `storage.js` saves your notes)
- `data/`: the content (subjects and lessons)
- `images/infographics/`: one hand-drawn SVG per lesson

## Adding your own pictures
On any lesson page, go to "My Pictures and Sketches":
1. Press "Choose picture" and pick a screenshot, photo, or sketch.
2. Check the preview, add a caption if you want.
3. Press "Save picture".
Tap a picture to see it bigger. Press "Remove" to delete it.
Pictures are made smaller automatically (longest side 1600 px) and saved in this browser (IndexedDB).

## Notes
- Your notes, checklist ticks, completed lessons, and pictures are saved in this browser on this device only. A picture uploaded on your phone will not appear on your laptop.
- Clearing browser data deletes them. A backup/export button is planned for a later phase.
- The handwriting font (Patrick Hand) loads from Google Fonts. Without internet, a fallback font is used.
- Not built yet: add subject, add lesson, backup/export, cloud sync.
