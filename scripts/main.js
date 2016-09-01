// addLoadEvent(newGame);

var numsObj, gridManager, tileViews;

$(document).ready(function() {
	// 初始化棋盘格
	init();
	newGame();
});

function newGame ()
{	
	// 在随机两个格子生成数字
	gridManager.randomGenerate();
	gridManager.randomGenerate();
}

function init ()
{
	var gridContainer = $("#grid-container");
	var grids = $(".grid-cell");
	var scores = $(".score");
	var newGame = $("#new-game");
	var grid;
	var bestScore = scores[0];
	var score = scores[1];

	numsObj = new Numbers();
	tileViews = new TileViews(bestScore, score);
	gridManager = new GridManager(numsObj, tileViews);

	for (var row = 0; row < 4; row++)
	{
		for (var col = 0; col < 4; col++)
		{
			grid = grids[getIndex(row, col)];
			// 初始化棋盘
			grid.style.top = getPosTop(row) + "px";
			grid.style.left = getPosTop(col) + "px";

			// 初始化棋子
			var tileView = $("<div></div>");
			tileViews.addView(tileView);

			tileViews.initialState(getIndex(row, col));
			// tileView.className = "number-cell";
			tileView.addClass("number-cell");
			// gridContainer.appendChild (tileView);
			gridContainer.append (tileView);
		}
	}
	score.innerHTML = 0;
	bestScore.innerHTML = 0;

	newGame.click(function(){
		gridManager.newGame();
	});
}

document.onkeydown = function(event) 
{
	switch(event.keyCode)
	{
		// left
		case 37:
			if (gridManager.moveLeft()) {
				setTimeout(function(){
					gridManager.randomGenerate();
				}, 300);
				setTimeout(function(){
					gridManager.isGameOver();
				}, 320);
			}
			return false;
			break;
		// up
		case 38:
			if (gridManager.moveUp()) {
				setTimeout(function(){
					gridManager.randomGenerate();
				}, 300);
				setTimeout(function(){
					gridManager.isGameOver();
				}, 320);
			}
			return false;
			break;
		// right
		case 39:
			if (gridManager.moveRight()) {
				setTimeout(function(){
					gridManager.randomGenerate();
				}, 300);
				setTimeout(function(){
					gridManager.isGameOver();
				}, 320);
			}
			return false;
			break;
		// down
		case 40:
			if (gridManager.moveDown()) {
				setTimeout(function(){
					gridManager.randomGenerate();
				}, 300);
				setTimeout(function(){
					gridManager.isGameOver();
				}, 320);
			}
			return false;
			break;
	}
};