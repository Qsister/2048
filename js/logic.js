var board = new Array();
var score = 0;

var startX=0,startY=0,endX=0,endY=0;


$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if(width>500){
		gridContainerW=500;
		gridCellW=100;
		cellSpace=20;
	}
	$('#grid_container').css('width',gridContainerW-2*cellSpace);
	$('#grid_container').css('height',gridContainerW-2*cellSpace);
	$('#grid_container').css('padding',cellSpace);
	$('#grid_container').css('border-radius',0.02*gridContainerW);

	$('.grid').css('width',gridCellW);
	$('.grid').css('height',gridCellW);
	$('.grid').css('border-radius',0.06*gridCellW);
}
function newgame(){
	//初始化棋盘格
	init();
	//随机生成两个数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	score = 0;
	$("#score").text(score);
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var grid=$("#grid_"+i+"_"+j);
			grid.css('top',getPosTop(i,j));
			grid.css('left',getPosLeft(i,j));
		}
	}

	for(var i=0;i<4;i++){
		board[i] = new Array();
		for(var j=0;j<4;j++){
			board[i][j] = 0;
		}
	}
	updateBoardView();
}

function updateBoardView(){
	$(".number_cell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid_container").append('<div class="number_cell" id="number_cell_' +i+ '_' +j+ '"></div>');
			var theNumberCell = $("#number_cell_"+i+"_"+j);
			if(board[i][j]==0){
				theNumberCell.css("width",0);
				theNumberCell.css("height",0);
				theNumberCell.css("top",getPosTop(i,j)+0.5*gridCellW);
				theNumberCell.css("left",getPosLeft(i,j)+0.5*gridCellW);
			}

			else{
				theNumberCell.css("width",gridCellW);
				theNumberCell.css("height",gridCellW);
				theNumberCell.css("top",getPosTop(i,j));
				theNumberCell.css("left",getPosLeft(i,j));
				theNumberCell.css("background-color",getNumBgColor(board[i][j]));
				theNumberCell.css("color",getNumColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
		}
	}
	$(".number_cell").css("line-height",gridCellW+"px");
	$(".number_cell").css("font-size",0.4*gridCellW+"px");
}

function generateOneNumber(){
	if(nospace(board)){
		//棋盘已满
		return false;
	}
	else{
		//随机一个位
		var randx=parseInt(Math.floor(Math.random()*4));
		var randy=parseInt(Math.floor(Math.random()*4));
		while(true){
			if(board[randx][randy]==0)
				break;
			var randx=parseInt(Math.floor(Math.random()*4));
			var randy=parseInt(Math.floor(Math.random()*4));
		}

		//随机一个数字
		var randNum=Math.random()<0.5 ? 2 :4;

		//在随机位置显示随机数
		board[randx][randy]=randNum;
		showNumWithAnimation(randx,randy,randNum);

		return true;
	}
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37:
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 38:
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39:
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40:
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
});

document.addEventListener("touchmove",function(event){
	event.preventDefault();
},false);

document.addEventListener("touchstart",function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
},false);

document.addEventListener("touchend",function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;
	//判断手指方向
	var X=endX-startX;
	var Y=endY-startY;
	if(Math.abs(X)<0.3*gridCellW && Math.abs(Y)<0.3*gridCellW){
		return;
	}
	if(Math.abs(X)>=Math.abs(Y) && X>=0){
		//右
		if(moveRight()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	else if(Math.abs(X)>=Math.abs(Y) && X<0){
		//左
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	else if(Math.abs(X)<Math.abs(Y) && Y>=0){
		//下
		if(moveDown()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}
	else{
		//上
		if(moveUp()){
			setTimeout("generateOneNumber()",210);
			setTimeout("isgameover()",300);
		}
	}


},false);

function moveLeft(){
	if(canMoveLeft(board)){
		for(var i=0;i<4;i++){
			for(var j=1;j<4;j++){
				if(board[i][j]!=0){
					for(var k=0;k<j;k++){
						if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
							//move
							showMoveAnimation(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;
							continue;
						}
						else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)){
							//move
							showMoveAnimation(i,j,i,k);
							//add
							board[i][k]+=board[i][j];
							board[i][j]=0;
							//score
							score+=board[i][k];
							$("#score").text(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200) ;
		return true;
	}
	return false;
}

function moveUp(){
	if(canMoveUp(board)){
		for(var i=1;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]!=0){
					for(var k=0;k<i;k++){
						if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
							continue;
						}
						else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board)){
							//move
							showMoveAnimation(i,j,k,j);
							//add
							board[k][j]+=board[i][j];
							board[i][j]=0;
							//score
							score+=board[k][j];
							$("#score").text(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200) ;
		return true;
	}
	return false;
}

function moveRight(){
	if(canMoveRight(board)){
		for(var i=0;i<4;i++){
			for(var j=2;j>=0;j--){
				if(board[i][j]!=0){
					for(var k=3;k>j;k--){
						if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
							//move
							showMoveAnimation(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;
							continue;
						}
						else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board)){
							//move
							showMoveAnimation(i,j,i,k);
							//add
							board[i][k]+=board[i][j];
							board[i][j]=0;
							//score
							score+=board[i][k];
							$("#score").text(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200) ;
		return true;
	}
	return false;
}

function moveDown(){
	if(canMoveDown(board)){
		for(var j=0;j<4;j++){
			for(var i=2;i>=0;i--){
				if(board[i][j]!=0){
					for(var k=3;k>i;k--){
						if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
							//move
							showMoveAnimation(i,j,k,j);
							board[k][j]=board[i][j];
							board[i][j]=0;
							continue;
						}
						else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board)){
							//move
							showMoveAnimation(i,j,k,j);
							//add
							board[k][j]+=board[i][j];
							board[i][j]=0;
							//score
							score+=board[k][j];
							$("#score").text(score);
							continue;
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200) ;
		return true;
	}
	return false;
}

function isgameover(){
	if(nospace(board) && nomove(board))
		gameover();
}

function gameover(){
	alert("游戏结束！");
}





