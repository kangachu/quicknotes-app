// Element Selection via querySelector
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

// In-memory state: array of objects { id, text, category, createdAt }
let notes = [];

// Save to localStorage
function saveNotes() {
  localStorage.setItem("quicknotes_data", JSON.stringify(notes));
}

// Update the note count paragraph
function updateNoteCount() {
  const count = notes.length;
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render notes list (using createElement & textContent only)
function renderNotes() {
  // Clear container
  notesList.textContent = "";

  const query = searchInput.value.trim().toLowerCase();
  const filtered = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  if (filtered.length === 0 && query !== "") {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-message";
    emptyLi.textContent = "No notes match your search.";
    notesList.appendChild(emptyLi);
    updateNoteCount();
    return;
  }

  filtered.forEach((note) => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category.toLowerCase()}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "note-content";

    const pText = document.createElement("p");
    pText.className = "note-text";
    pText.textContent = note.text; // Safe from XSS

    const metaDiv = document.createElement("div");
    metaDiv.className = "note-meta";

    const tagSpan = document.createElement("span");
    tagSpan.className = "note-tag";
    tagSpan.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(tagSpan);
    metaDiv.appendChild(dateSpan);
    contentDiv.appendChild(pText);
    contentDiv.appendChild(metaDiv);

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });

  updateNoteCount();
}

// Add Note Handler
function handleAddNote(e) {
  e.preventDefault();
  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation
  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear validation error if valid
  errorMessage.textContent = "";

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.unshift(newNote);
  saveNotes();
  renderNotes();

  // Reset form input
  noteInput.value = "";
  noteInput.focus();
}

// Delete single note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  renderNotes();
}

// Clear all notes (Bonus)
function clearAllNotes() {
  if (notes.length === 0) return;
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    renderNotes();
  }
}

// Event Listeners
noteForm.addEventListener("submit", handleAddNote);
searchInput.addEventListener("input", renderNotes);
clearAllBtn.addEventListener("click", clearAllNotes);

// Initialization: load from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("quicknotes_data");
  if (stored) {
    try {
      notes = JSON.parse(stored);
    } catch (err) {
      notes = [];
    }
  }
  renderNotes();
});