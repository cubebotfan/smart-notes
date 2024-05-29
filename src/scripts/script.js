"use strict";
import Note from "./notes.js";

function getTitle() {
	return document.getElementById('file-name').value;
}

function getContent() {
	return document.getElementById('file-content').value;
}

function setTitle(title) {
	document.getElementById('file-name').value = title;
}

function setContent(content) {
	document.getElementById('file-content').value = content;
}

const EDIT_MENU = document.getElementsByClassName("notepad-container")[0];

function hideEditMenu() {
	EDIT_MENU.classList.add('hide');
}

function showEditMenu() {
	EDIT_MENU.classList.remove('hide');
}

function createNoteElement(title, id) {
	let li = document.createElement("li");
	//li.textContent = title;
	li.onclick = noteClicked;
	li.classList.add("note");
	li.setAttribute("data-id", id);
	li.setAttribute("data-action", "switch");

	let span = document.createElement("span");
	span.classList.add("note-text");
	span.setAttribute("data-id", id);
	span.setAttribute("data-action", "switch");
	span.textContent = title;
	li.appendChild(span);

	let deleteButton = document.createElement("i");
	deleteButton.classList.add('bx');
	deleteButton.classList.add('bx-trash');
	deleteButton.classList.add("note-trash");

	//deleteButton.onclick = noteClicked; //on parent already
	deleteButton.setAttribute("data-id", id);
	deleteButton.setAttribute("data-action", "delete");

	li.appendChild(deleteButton);
	return li;
}

function addNoteElement(title, id) {
	let notesElement = document.getElementById('all-notes');
	notesElement.append(createNoteElement(title, id));
}

function updateNoteElement(id, modified = true) {
	let element = document.querySelector(`.note[data-id="${id}"] span`);
	if (element) {
		element.textContent = ((modified) ? "*" : "") + (notes[id].title || "unnamed");
		return true;
	}
	return false;
}

function deleteNoteElement(id) {
	let notesElement = document.getElementById('all-notes');

	let element = document.querySelector(`.note[data-id="${id}"]`);
	if (element) {
		notesElement.removeChild(element);
	}
	return false;
}

/* - - - - - - - - - -
	Save and Load
 - - -- - - - - - - */

function saveNote(id) {
	if (!notes[id].date) {
		notes[id].date = Date.now();
	}
	let savedNotes = localStorage.getItem("savedNotes");

	if (!savedNotes) {
		localStorage.setItem("savedNotes", "[]");
		savedNotes = "[]";
	}
	let oldNotes = JSON.parse(savedNotes);
	let noteIndex = oldNotes.findIndex(n => { return n.date == notes[id].date; });
	if (noteIndex > -1) {
		oldNotes[noteIndex] = notes[id];
	} else {
		oldNotes.push(notes[id]);
	}

	oldNotes.sort((a,b)=>{return a.date-b.date}); //sort by date	
	localStorage.setItem("savedNotes", JSON.stringify(oldNotes));
	updateNoteElement(id, false);
	return true;
}

function loadNotes() {
	let savedNotes = localStorage.getItem("savedNotes");
	if (savedNotes) {
		notes = JSON.parse(savedNotes);
	}
	let notesElement = document.getElementById('all-notes');
	notesElement.innerHTML = "";
	notes.forEach((n, i) => {
		notesElement.appendChild(createNoteElement(n.title, i));
	});
}

function loadNote(id) {
	let savedNotes = localStorage.getItem("savedNotes");
	if (!savedNotes) {
		return false;
	}
	let oldNotes = JSON.parse(savedNotes);
	let loadedNote = oldNotes.find(n => { return n.date == notes[id].date });
	if (!loadedNote) {
		return false;
	}
	notes[id] = loadedNote;
	updateNoteElement(id, false);
	return true;
}

function deleteNote(id) {
	let savedNotes = localStorage.getItem("savedNotes");
	if (!savedNotes) {
		return;
	}
	let oldNotes = JSON.parse(savedNotes);
	let noteIndex = oldNotes.findIndex(n => { return n.date == notes[id].date; });
	if (noteIndex > -1) {
		oldNotes.splice(noteIndex, 1);
		localStorage.setItem("savedNotes", JSON.stringify(oldNotes));
	}
	discardNote(id);	
	deselectNote();
	return;
}

function discardNote(id) {
	deleteNoteElement(id);
	notes.splice(id,1);
	let noteElements = document.querySelectorAll("[data-id]");
	noteElements.forEach(n=>{
		let dataId = n.getAttribute('data-id');
		if (dataId>id) {
			n.setAttribute('data-id', dataId-1);
		}
	});
}

function addNew(event) {
	newDraft();
}


function saveChanges(event) {
	if (selectedNote < 0) {
		return;
	}
	let title = getTitle();
	let content = getContent();
	if (!title) {
		document.getElementById('file-name').focus();
		return;
	}
	if (!content) {
		document.getElementById('file-content').focus();
		return;
	}
	saveNote(selectedNote);
}

function discardChanges(event) {
	let noteExists = loadNote(selectedNote);
	if (!noteExists) {
		discardNote(selectedNote);
	}
	deselectNote();
}

function deselectNote() {
	selectedNote = -1;
	hideEditMenu();
	setTitle("");
	setContent("");
}

function newDraft() {
	selectedNote = notes.length;
	notes.push(new Note("", ""));
	addNoteElement("*unnamed", selectedNote);
	setTitle("");
	setContent("");
	showEditMenu();
}

function noteClicked(event) {
	let id = event.target.getAttribute("data-id");
	let action = event.target.getAttribute("data-action");
	switch (action) {
		case "switch":
			switchNote(id);
		break;
		case "delete":
			deleteNote(id);
		break;
	}
}
function switchNote(id) {
	selectedNote = id;
	setTitle(notes[selectedNote].title);
	setContent(notes[selectedNote].content);
	showEditMenu();
}

function contentTyped(event) {
	notes[selectedNote].title = getTitle();
	notes[selectedNote].content = getContent();
	updateNoteElement(selectedNote);
}

let notes = [];
let selectedNote = -1;

loadNotes();

/* - - - - - - - - - -
	Add event listeners
 - - - - - - - - - - */

let addNewButtons = [...document.getElementsByClassName("add-new")];
addNewButtons.forEach(b => {
	b.addEventListener("click", addNew);
});

let saveButtons = [...document.getElementsByClassName("save-button")];
saveButtons.forEach(b => {
	b.addEventListener("click", saveChanges);
});

let cancelButtons = [...document.getElementsByClassName("cancel-button")];
cancelButtons.forEach(b => {
	b.addEventListener("click", discardChanges);
});

document.getElementById('file-name').addEventListener("input", contentTyped);
document.getElementById('file-content').addEventListener("input", contentTyped);