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
	li.textContent = title;
	li.onclick = noteClicked;
	li.classList.add("note");
	li.setAttribute("data-id", id);
	return li;
}

function addNoteElement(title, id) {
	let notesElement = document.getElementById('all-notes');
	notesElement.append(createNoteElement(title,id));
}

function updateNoteElement(id, modified = true) {
	let element = document.querySelector(`.note[data-id="${id}"]`);
	if (element) {
		element.textContent = ((modified) ? "*": "") + (notes[id].title || "unnamed");
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
	let noteIndex = oldNotes.findIndex(n=>{return n.date==notes[id].date;});
	if (noteIndex>-1) {
		oldNotes[noteIndex] = notes[id];
	} else {
		oldNotes.push(notes[id]);
	}
	localStorage.setItem("savedNotes", JSON.stringify(oldNotes));
	updateNoteElement(id, false);
}

function loadNotes() {
	let savedNotes = localStorage.getItem("savedNotes");
	if (savedNotes) {
		notes = JSON.parse(savedNotes);
	}
	let notesElement = document.getElementById('all-notes');
	notesElement.innerHTML = "";
	notes.forEach((n,i)=>{
		notesElement.appendChild(createNoteElement(n.title, i));
	});
}

function loadNote(id) {
	let savedNotes = localStorage.getItem("savedNotes");
	if (!savedNotes) {
		return false;
	}
	let oldNotes = JSON.parse(savedNotes);
	let loadedNote = oldNotes.find(n=>{return n.date==notes[id].date});
	if (!loadedNote) {
		return false;
	}
	notes[id] = loadedNote;
	updateNoteElement(id, false);
	return true;
}

function addNew(event) {
	newDraft();
}


function saveChanges(event) {
	if (selectedNote<0) {
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
		deleteNoteElement(selectedNote);
	}

	selectedNote = -1;
	hideEditMenu();
	setTitle("");
	setContent("");
}

function newDraft() {
	selectedNote = notes.length;
	notes.push(new Note("",""));
	addNoteElement("*unnamed", selectedNote);
	setTitle("");
	setContent("");
	showEditMenu();
}

function noteClicked(event) {
	switchNote(event.target.getAttribute("data-id"));
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
addNewButtons.forEach(b=>{
	b.addEventListener("click", addNew);
});

let saveButtons = [...document.getElementsByClassName("save-button")];
saveButtons.forEach(b=>{
	b.addEventListener("click", saveChanges);
});

let cancelButtons = [...document.getElementsByClassName("cancel-button")];
cancelButtons.forEach(b=>{
	b.addEventListener("click", discardChanges);
});

document.getElementById('file-name').addEventListener("input",contentTyped);
document.getElementById('file-content').addEventListener("input",contentTyped);