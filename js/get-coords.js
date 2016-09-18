//from quirksmode.org

function findPos(obj){
	var curleft = curtop = 0;
	
	if (obj.offsetParent){
		do{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			}while(obj = obj.offsetParent);

	return [curleft,curtop];
	}
}

function getMouseCoords(event){
	if(!event){
		var event = window.event;
	}

	var posx = 0;
	var posy = 0;
	
	if(event.pageX || event.pageY){
		posx = event.pageX;
		posy = event.pageY;
	}
	else if(event.clientX || event.clientY){
		posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	var totaloffset = findPos(event.target);
	
 	var totalXoffset = totaloffset[0];
 	var totalYoffset = totaloffset[1];
	
 	var canvasX = posx - (totalXoffset + 2);//PLUS 2PX FOR CANVAS BORDER
 	var canvasY = posy - (totalYoffset + 2);//PLUS 2PX FOR CANVAS BORDER
	
	return [canvasX, canvasY];
}	
