var xyArray = [];
var tableArray = [];
var canvas, ctx;
var intervalIndex = 0;
var flowControl = 1;

function init() {
	document.getElementById('map-canvas').disabled = true;
	document.getElementById('map-canvas').classList.add('disable');
	document.getElementById('start-play').classList.add('disable');
	
	document.getElementById('start-rec').onclick = function() {
		document.getElementById('map-canvas').disabled = false;
		document.getElementById('map-canvas').classList.remove('disable');
		document.getElementById('start-play').classList.remove('disable');
		showTime();
	};
}

function showTime() {
	canvas =  document.getElementById('map-canvas');
	ctx = canvas.getContext('2d');

	canvas.onmousemove = function(e) {
		var coords = getMouseCoords(e);
		var x = coords[0];
		var y = coords[1];
		
		ctx.clearRect(0,0,canvas.scrollWidth, canvas.scrollHeight);
		hoTing(xyArray, x, y);
		drawFullCirc(x, y);
	};
	
	canvas.onclick = function(e) {
		var coords = getMouseCoords(e);
		var x = coords[0];
		var y = coords[1];
		var labelValue = document.getElementById('caption-input').value;
		xyArray.push({
			x:x,
			y:y,
			label:labelValue
		});
		hoTing(xyArray, x, y);
		displayOverlay();
	};
	
	document.getElementById('caption-input').onkeydown = function(event) {
		if (event.keyCode == 13) {
			insertToggle();
		}
	};
}

function hoTing(xyArray, x, y) {
	ctx.clearRect(0,0,canvas.scrollWidth, canvas.scrollHeight);
	if (xyArray.length > 1) {
		ctx.beginPath();
		ctx.moveTo(xyArray[0].x, xyArray[0].y);
		for (var i = 1; i <	xyArray.length; i++) {
			drawLine(xyArray[i].x, xyArray[i].y);
		}
		ctx.closePath();
	}
	for (var i = 0; i < xyArray.length; i++) {
		drawFullCirc(xyArray[i].x, xyArray[i].y);
	}
	ctx.closePath();
	drawFullCirc(x, y);
}

function tick() {
	var x = xyArray.x;
	var y = xyArray.y;
	
	document.getElementById('map-canvas').disabled = true;
	document.getElementById('map-canvas').classList.add('no-event');
	ctx.clearRect(0,0,canvas.scrollWidth, canvas.scrollHeight);

	var controls = document.querySelectorAll(".toggle");
	for (var i = 0; i < controls.length; i++) {
		controls[i].classList.add('disable');
		controls[i].disabled = true;
	}
	
	if (intervalIndex < 1) {
		drawFullCirc(xyArray[0].x, xyArray[0].y);
		ctx.closePath();
	}
	else {
		ctx.beginPath();
		ctx.moveTo(xyArray[0].x, xyArray[0].y);
		for (var i = 0; i <= flowControl; i++) {
			drawLine(xyArray[i].x, xyArray[i].y);
		}
		ctx.closePath();
		
		for (var i = 0; i <= flowControl; i++) {
			drawFullCirc(xyArray[i].x, xyArray[i].y);
		}
		ctx.closePath();
		flowControl += 1;
	}
	
	// function executes function, which execute function containing copy of value
	// value of "intervaIndex" at the time of container execution
	// otherwise after the "setTimeout" delay the value of "intervalIndex" has already changed before first function call
	// could have also put a "setInterval" in the "popLabel()" function
	setTimeout((function(i){ return function () {popLabel(i)}})(intervalIndex), 200);
	
	if (++intervalIndex < xyArray.length) {
		setTimeout(tick, 2000);
	}
	
	if (intervalIndex == xyArray.length) {
		(function() {
			setTimeout(function() {
				document.getElementById('map-canvas').disabled = false;
				document.getElementById('map-canvas').classList.remove('no-event');
				document.getElementById('pop-label').style.display = "none";
				intervalIndex = 0;
				flowControl = 1;
				disableEnable();
			}, 2000);
		})();
		clearInterval(tick);
	}
};

function drawLine(x, y) {
	ctx.lineWidth = 2;
	ctx.lineTo(x, y);
	ctx.stroke();
}

function drawFullCirc(x, y) {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, 8, 0, 2 * Math.PI);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
}

function popLabel(i) {
	var	canvasObj =  document.getElementById('map-canvas');
	var canvasWidth = canvasObj.clientWidth;
	var canvasHeight = canvasObj.clientHeight;
	var halfWidth = canvasWidth / 2;
	var halfHeight = canvasHeight / 2;
	var popUp = document.getElementById('pop-label');
	var innerLabel = xyArray[i].label;
	
	 // top, left, right
	if (xyArray[i].y < halfHeight) {
		popUp.style.top = (xyArray[i].y + 8) + "px";
		popUp.style.bottom = "auto";
		if (xyArray[i].x < halfWidth) {
			popUp.style.left = (xyArray[i].x + 8) + "px";
			popUp.style.right = "auto";
		}
		else {
			popUp.style.right = canvasWidth - (xyArray[i].x - 8) + "px";
			popUp.style.left = "auto";
		}
		if (innerLabel != "") {
			popUp.innerHTML = innerLabel;
			popUp.style.display = "block";
		}
	}
	
	// bottom, left, right
	if (xyArray[i].y > halfHeight) {
		popUp.style.bottom = canvasHeight - (xyArray[i].y - 8) + "px";
		popUp.style.top = "auto";
		if (xyArray[i].x < halfWidth) {
			popUp.style.left = (xyArray[i].x + 8) + "px";
			popUp.style.right = "auto";
		}
		else {
			popUp.style.right = canvasWidth - (xyArray[i].x - 8) + "px";
			popUp.style.left = "auto";
		}
		if (innerLabel != "") {
			popUp.innerHTML = innerLabel;
			popUp.style.display = "block";
		}
	}
	setTimeout(hideLabel, 1600);
}

function hideLabel() {
	var popUp = document.getElementById('pop-label');
	popUp.style.display = "none";
}

function displayOverlay() {
	var setDisplay = document.getElementsByClassName('display');
	for (i = 0; i < setDisplay.length; i++) {
		setDisplay[i].style.display = "block";
	}
	document.getElementById('caption-input').focus();
	disableEnable();
}

function insertToggle() {
	var setDisplay = document.getElementsByClassName('display');
	for (var i = 0; i < setDisplay.length; i++) {
		setDisplay[i].style.display = "none";
	}
	disableEnable();
	
	var labelValue = document.getElementById('caption-input');
	xyArray[xyArray.length-1].label = labelValue.value;
	
	generateRow();
	labelValue.value = null;
}

function disableEnable() {
	var controls = document.querySelectorAll(".toggle");
	for (var i = 0; i < controls.length; i++) {
		controls[i].classList.toggle('disable');
		if (controls[i].disabled == true) {
			controls[i].disabled = false;
		}
	}
}

function generateRow() {
	var tbl = document.getElementById('tbl');
	var numRow = tbl.rows.length;
	for (var i = numRow - 1; i > 0; i--) {
		tbl.deleteRow(i);
	}
	for (var i = 0; i < xyArray.length; i++) {
		var x = xyArray[i].x;
		var y = xyArray[i].y;
		var newRow = tbl.insertRow(-1);
		var firstCell = newRow.insertCell(0);
		var upSpan = document.createElement('span');
		var upText = document.createTextNode('Up');
		upSpan.className = "ctrl toggle up";
		upSpan.onclick = function() {
			var e = this;
			var rowToMove = e.parentNode.parentNode;
			var rowAbove = rowToMove.previousSibling;
			var tableRef = rowToMove.parentNode;
			tableRef.insertBefore(rowToMove, rowAbove);
			updateArray();
			hoTing(xyArray, x, y);
		};
		upSpan.appendChild(upText);
		firstCell.appendChild(upSpan);
		
		var downSpan = document.createElement('span');
		var downText = document.createTextNode('Down');
		downSpan.className = "ctrl toggle down";
		downSpan.onclick = function() {
			var e = this;
			var rowToMove = e.parentNode.parentNode;
			var rowBelow = rowToMove.nextSibling;
			var tableRef = rowToMove.parentNode;
			tableRef.insertBefore(rowToMove, getNextSibling(getNextSibling(rowToMove)));
			updateArray();
			hoTing(xyArray, x, y);
		};
		downSpan.appendChild(downText);
		firstCell.appendChild(downSpan);
			
		var secondCell = newRow.insertCell(1);
		var label = document.createElement('label');
		label.setAttribute('for', 'labelField');
		label.appendChild(document.createTextNode("Label:"));
		var labelField = document.createElement('input');
		labelField.className = "caption-edit toggle";
		labelField.type = "text";
		labelField.value = xyArray[i].label;
		labelField.oninput = function() {
			updateArray();
			hoTing(xyArray, x, y);
		};
		secondCell.appendChild(labelField);
		secondCell.insertBefore(label, labelField);
		secondCell.appendChild(document.createTextNode(" x: " + xyArray[i].x + ", y: " + xyArray[i].y + ""));
		
		var thirdCell = newRow.insertCell(2);
		var deleteSpan = document.createElement('span');
		var deleteText = document.createTextNode('Delete');
		deleteSpan.className = "ctrl toggle";
		deleteSpan.onclick = function() {
			var e = this;
			var rowToDelete = e.parentNode.parentNode;
			var tableRef = rowToDelete.parentNode;
			tableRef.removeChild(rowToDelete);
			updateArray();
			hoTing(xyArray, x, y);
		};
		deleteSpan.appendChild(deleteText);
		thirdCell.appendChild(deleteSpan);
	}
}

function getNextSibling(rowToMove) {
	var kablamo = rowToMove.nextSibling;
	while (kablamo != null && kablamo.nodeType != 1) {
		kablamo = kablamo.nextSibling;
	}
	return kablamo;
}

function updateArray() {
	var table = document.getElementById('tbl');
	var input = document.getElementsByClassName('caption-edit').value;
	var xyCoords = [];
	for (var i = 1; i < table.rows.length; i++) {
		var coordsArray = table.rows[i].cells[1].innerHTML;
		var inputLabel = table.rows[i].cells[1].childNodes[1].value;
		var innerText = table.rows[i].cells[1].innerHTML;
		//alert(inputLabel + "," + innerText.match(/\d+/g));
		var xyCoords = innerText.match(/\d+/g);
		var x = parseInt(xyCoords[0]);
		var y = parseInt(xyCoords[1]);
		tableArray.push({
			label:inputLabel,
			x:x,
			y:y
		});
	}
	xyArray = tableArray;
	tableArray = [];
};

window.onload = init;
