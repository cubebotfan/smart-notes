"use strict";
//thank goodness this was a feature in my old JavaScript library.
//learned how to make a the main pat of this code from somewhere online a while ago
function DragElement(element) {
    let elementheaders = element.getElementsByClassName("draggable-window-bar");
    if (elementheaders.length > 0) {
        elementheaders[0].addEventListener('mousedown',startDrag);
    } else {
        element.addEventListener('mousedown', startDrag);
    }
	window.addEventListener('resize', onResize);

    var x1 = 0;
    var x2 = 0;
    var y1 = 0;
    var y2 = 0;
    function startDrag(e) {
        if (e.button != 0) {
            return;
        }
        x1 = e.clientX;
        y1 = e.clientY;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }
    function drag(e) {

        x2 = x1-e.clientX;
        y2 = y1-e.clientY;
        x1 = e.clientX;
        y1 = e.clientY;

        element.style.top = Math.max(0, Math.min(element.offsetTop - y2, window.innerHeight-element.offsetHeight)) + "px";
        element.style.left = Math.max(0, Math.min(element.offsetLeft - x2, window.innerWidth-element.offsetWidth)) + "px";
    }
    function endDrag(e) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);

        if (element.offsetTop <= document.body.offsetTop) {
            element.style.top = document.body.offsetTop + "px";
        } else if (element.offsetTop + element.offsetHeight >= document.body.offsetHeight) {
            element.style.top = document.body.offsetHeight - element.offsetHeight + "px";
        }
        if (element.offsetLeft <= document.body.offsetLeft) {
            element.style.left = document.body.offsetLeft + "px";
        } else if (element.offsetLeft + element.offsetWidth >= document.body.offsetWidth) {
            element.style.left = document.body.offsetWidth - element.offsetWidth + "px";
        }
    }
	function onResize(e) {
		element.style.top = Math.max(0, Math.min(element.offsetTop, window.innerHeight-element.offsetHeight)) + "px";
        element.style.left = Math.max(0, Math.min(element.offsetLeft, window.innerWidth-element.offsetWidth)) + "px";
	}
}
{
    let elements = document.getElementsByClassName("draggable-window");

    
    for (let i = 0; i < elements.length; ++i) {
        new DragElement(elements[i]);
    }
    
}