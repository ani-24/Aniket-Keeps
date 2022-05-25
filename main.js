const notesContainer = document.querySelector(".notes-container");

const addNoteBtn = document.querySelector(".add-note-btn");

const showNotes = () => {
  let notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    notes.forEach((note) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");
      noteDiv.innerHTML = `
      <div class="operations-container">
        <div class="operation edit"><i class="fas fa-edit"></i></div>
        <div class="operation delete"><i class="fas fa-trash-alt"></i></div>
      </div>
      <div class="main">
        <div class="note-text">${note}</div>
      </div>
      `;
      notesContainer.appendChild(noteDiv);
    });
  }
};

const addNoteToList = (note) => {
  let notes = localStorage.getItem("notes");
  if (!notes) {
    let notes = [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  } else {
    notes = JSON.parse(notes);
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }
};

const removeNoteFromList = (note) => {
  let notes = localStorage.getItem("notes");
  notes = JSON.parse(notes);
  let newNotes = notes.filter((item) => item !== note);
  localStorage.setItem("notes", JSON.stringify(newNotes));
};

const addNote = () => {
  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = `
    <div class="operations-container">
      <div class="operation save"><i class="fas fa-save"></i></div>
    </div>
    <div class="main">
      <textarea class="note-input"></textarea>
    </div>
    `;
  const textarea = note.querySelector(".note-input");
  notesContainer.appendChild(note);
  textarea.focus();
  textarea.addEventListener("keydown", (key) => {
    if (key.which === 13 && key.ctrlKey) {
      addNoteToList(textarea.value);
      note.querySelector(".operations-container").innerHTML = `
      <div class="operation edit"><i class="fas fa-edit"></i></div>
      <div class="operation delete"><i class="fas fa-trash-alt"></i></div>
    `;
      note.querySelector(
        ".main"
      ).innerHTML = `<div class="note-text">${textarea.value}</div>`;
    }
  });
};

notesContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("save") &&
    !e.target.classList.contains("edit")
  ) {
    const note = e.target.parentElement.parentElement;
    const noteText = note.querySelector(".note-input").value;
    note.querySelector(".operations-container").innerHTML = `
      <div class="operation edit"><i class="fas fa-edit"></i></div>
      <div class="operation delete"><i class="fas fa-trash-alt"></i></div>
    `;
    note.querySelector(
      ".main"
    ).innerHTML = `<div class="note-text">${noteText}</div>`;
    addNoteToList(noteText);
  } else if (e.target.classList.contains("delete")) {
    const note = e.target.parentElement.parentElement;
    const noteText = note.querySelector(".note-text").textContent;
    removeNoteFromList(noteText);
    note.remove();
  } else if (e.target.classList.contains("edit")) {
    const notes = document.querySelectorAll(".note");
    const note = e.target.parentElement.parentElement;
    const noteText = note.querySelector(".note-text").textContent;
    let currentIdx = 0;
    notes.forEach((item, idx) => {
      if (item === note) {
        currentIdx = idx;
      }
    });
    note.querySelector(".operations-container").innerHTML = `
      <div class="operation save save-edit"><i class="fas fa-save"></i></div>
    `;
    note.querySelector(
      ".main"
    ).innerHTML = `<textarea class="note-input">${noteText}</textarea>`;
    const textarea = note.querySelector(".note-input");
    textarea.focus();
    const edit = () => {
      note.querySelector(
        ".main"
      ).innerHTML = `<div class="note-text">${textarea.value}</div>`;
      let notesList = localStorage.getItem("notes");
      notesList = JSON.parse(notesList);
      notesList[currentIdx] = textarea.value;
      localStorage.setItem("notes", JSON.stringify(notesList));
      note.querySelector(".operations-container").innerHTML = `
      <div class="operation edit"><i class="fas fa-edit"></i></div>
      <div class="operation delete"><i class="fas fa-trash-alt"></i></div>
    `;
    };
    textarea.addEventListener("keydown", (key) => {
      if (key.which === 13 && key.ctrlKey) {
        edit();
      }
    });
    note.addEventListener("click", (e) => {
      if (e.target.classList.contains("save-edit")) {
        edit();
      }
    });
  }
});

addNoteBtn.addEventListener("click", addNote);
window.addEventListener("DOMContentLoaded", showNotes);
