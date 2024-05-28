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

function saveNotes() {
	localStorage.setItem("savedNotes", JSON.stringify(notes));
	loadNotes();
}

function loadNotes() {
	let savedNotes = localStorage.getItem("savedNotes");
	if (savedNotes) {
		notes = JSON.parse(savedNotes);
	}
	let notesElement = document.getElementById('all-notes');
	notesElement.innerHTML = "";
	notes.forEach((n,i)=>{
		let li = document.createElement("li");
		li.textContent = n.title;
		li.onclick = noteClick;
		li.classList.add("note");
		li.setAttribute("data-id", i);
		notesElement.appendChild(li);
	});
}

function addNew(event) {
	newNote();
}

function cancelEdit(event) {
	let selectedNote = -1;
	hideEditMenu();
	setTitle("");
	setContent("");
	loadNotes();
}

function saveEdit(event) {
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

	if (selectedNote >= notes.length) {
		notes.push(new Note(title, content, Date.now()));
	} else {
		notes[selectedNote].title = title;
		notes[selectedNote].content = content;
	}
	saveNotes();
}

function newNote() {
	selectedNote = notes.length;
	setTitle("");
	setContent("");
	showEditMenu();
}

function noteClick(event) {
	switchNote(event.target.getAttribute("data-id"));
}
function switchNote(id) {
	selectedNote = id;
	setTitle(notes[selectedNote].title);
	setContent(notes[selectedNote].content);
	showEditMenu();
}

let notes = [];
let selectedNote = -1;

loadNotes();
console.log(notes);

let addNewButtons = [...document.getElementsByClassName("add-new")];
addNewButtons.forEach(b=>{
	b.addEventListener("click", addNew);
});

let saveButtons = [...document.getElementsByClassName("save-button")];
saveButtons.forEach(b=>{
	b.addEventListener("click", saveEdit);
});

let cancelButtons = [...document.getElementsByClassName("cancel-button")];
cancelButtons.forEach(b=>{
	b.addEventListener("click", cancelEdit);
});