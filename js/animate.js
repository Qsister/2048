function showNumWithAnimation(x,y,num){
	var numberCell=$("#number_cell_"+x+"_"+y);
	numberCell.css("background-color",getNumBgColor(num));
	numberCell.css("color",getNumColor(num));
	numberCell.text(num);

	numberCell.animate({
		width:gridCellW,
		height:gridCellW,
		top:getPosTop(x,y),
		left:getPosLeft(x,y)
	},50);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$("#number_cell_"+fromx+"_"+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}