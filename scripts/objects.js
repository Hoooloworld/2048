function Numbers ()
{
	this.bestScore = 0;
	this.score = 0;
	this.numbers = new Array();

	for (var i  = 0; i < 16; i++)
	{
		this.numbers[i] = 0;
	}
}
Numbers.prototype.clear = function ()
{
	for (var i = 0; i < 16; i++) {
		this.numbers[i] = 0;
	}
	this.score = 0;
};


function TileViews (bestScoreView, scoreView) {
	this.bestScoreView = bestScoreView;
	this.scoreView = scoreView;
	this.tileViews = new Array();
	this.hasConflicted = new Array();

	for (var i = 0; i < 16; i++) {
		this.hasConflicted[i] = false;
	}
}

TileViews.prototype.addView = function (view) { this.tileViews[this.tileViews.length] = view; };
TileViews.prototype.appear = function (index, value)
{
	var row = indexToRow(index);
	var col = indexToCol(index);
	var tileView = this.tileViews[index];

	tileView.css("color", getNumberColor(value));
	tileView.css("background-color", getNumberBackgroundColor(value));

	// 动画
	appearAnimation(tileView, row, col, value);
};
TileViews.prototype.moveHorizotal = function (row, fromCol, toCol)
{
	var tileView = this.tileViews[getIndex(row, fromCol)];
	horizontalMoveAnimation(tileView, toCol);
};
// TileViews.prototype.moveHorizotalWithPop = function (row, fromCol, toCol)
// {
// 	var tileView = this.tileViews[getIndex(row, fromCol)];
// 	var toTileView = this.tileViews[getIndex(row, toCol)];
// 	horizontalMoveWithPop(tileView, toTileView, toCol);
// };
TileViews.prototype.moveVertical = function (col, fromRow, toRow)
{
	var tileView = this.tileViews[getIndex(fromRow, col)];
	verticalMoveAnimation(tileView, toRow);
};
// TileViews.prototype.moveVerticalWithPop = function (col, fromRow, toRow)
// {
// 	var tileView = this.tileViews[getIndex(fromRow, col)];
// 	var toTileView = this.tileViews[getIndex(toRow, col)];
// 	verticalMoveWithPop(tileView, toTileView, toRow);
// };
TileViews.prototype.initialState = function(index)
{
	var tileView = this.tileViews[index];
	var row = indexToRow(index);
	var col = indexToCol(index);

	tileView.css("width", 0);
	tileView.css("height", 0);
	tileView.css("top", (getPosTop(row) + 50) + "px");
	tileView.css("left", (getPosTop(col) + 50) + "px");
	tileView.html("");
};
TileViews.prototype.updateView = function (index, value)
{
	var tileView = this.tileViews[index];
	var row = indexToRow(index);
	var col = indexToCol(index);

	tileView.css("width", '100');
	tileView.css("height", '100');
	tileView.css("top", getPosTop(row));
	tileView.css("left", getPosTop(col));
	tileView.css("color", getNumberColor(value));
	tileView.css("background-color", getNumberBackgroundColor(value));
	tileView.css("font-size", getNumberSize(value));
	tileView.css("opacity", 1);
	tileView.html(value);
};
TileViews.prototype.updateScore = function (value)
{
	this.scoreView.innerHTML = value;
};
TileViews.prototype.newGame = function ()
{
	for(var i = 0; i < 16; i++) {
		this.initialState(i);
	}
	this.scoreView.innerHTML = 0;

};



function GridManager (numsObj, tileViewsObj)
{
	this.numsObj = numsObj;
	this.tileViews = tileViewsObj;
}

GridManager.prototype.newGame = function ()
{
	this.tileViews.newGame();
	this.numsObj.clear();
	this.randomGenerate();
	this.randomGenerate();

	return false;
};

GridManager.prototype.getRandomPos = function ()
{
	var temp = [];
	var randomPos;

	// 得到所有空位
	for (var i = 0; i < 16; i++) {
		if (this.numsObj.numbers[i] === 0) { 
			temp[temp.length] = i; 
		}
	}

	if (temp.length === 1) {
		randomPos = temp[0];
	}
	else {
		var ranNum = parseInt(Math.floor(Math.random() * temp.length));
		randomPos = temp[ranNum];
	}

	return randomPos;
};

GridManager.prototype.randomGenerate = function ()
{
	if (gridManager.isNoSpace()) { return false; }

	var randomPos = this.getRandomPos();
	var randomNum = Math.random() < 0.9 ? 2 : 4;

	numsObj.numbers[randomPos] = randomNum;
	tileViews.appear(randomPos, randomNum);

	return true;
};

GridManager.prototype.isNoSpace = function ()
{
	for (var i = 0; i < 16; i++) {
		if (this.numsObj.numbers[i] === 0) {
			return false;
		}
	}
	return true;
};

GridManager.prototype.isNoTileHorizontal = function (row, leftCol, rightCol)
{
	var isNoBlock = true;
	for (var i = leftCol + 1; i < rightCol; i++)
	{
		if (this.numsObj.numbers[getIndex(row, i)] !== 0) { isNoBlock = false; break;}
	}
	return isNoBlock;
};

GridManager.prototype.isNoTileVertical = function (col, upRow, row)
{
	var isNoBlock = true;
	for (var i = upRow + 1; i < row; i++)
	{
		if (this.numsObj.numbers[getIndex(i, col)]) { isNoBlock = false; break;}
	}
	return isNoBlock;
};

GridManager.prototype.updateView = function ()
{
	var row, col;
	var tileView, number;

	for (var i = 0; i < 16; i++)
	{
		tileView = this.tileViews[i];
		number = this.numsObj.numbers[i];

		if (number === 0) {
			// 初始化 tileView
			this.tileViews.initialState(i);
		}
		else {
			// 更新 tileViews
			this.tileViews.updateView(i, number);
		}
		this.tileViews.hasConflicted[i] = false;
	}
};

GridManager.prototype.canMoveLeft = function ()
{
	for (var i = 1; i < 16; i++)
	{
		if ((i % 4) === 0 || this.numsObj.numbers[i] === 0) { continue; }

		var num = this.numsObj.numbers[i];
		var leftNum = this.numsObj.numbers[i - 1];
		if (leftNum === 0 || leftNum === num) {
			return true;
		}
	}
	return false;
};

GridManager.prototype.moveLeft = function ()
{
	if (!this.canMoveLeft()) { return false; }
	var index, toIndex, num, toNum;

	for (var row = 0; row < 4; row++)
	{
		for (var col = 1; col < 4; col++)
		{
			index = getIndex(row, col);
			if (this.numsObj.numbers[index] === 0) { continue; }
			num = this.numsObj.numbers[index];

			for (var i = 0; i < col; i++)
			{
				toIndex = getIndex(row, i);
				toNum = this.numsObj.numbers[toIndex];

				if (toNum === 0 && this.isNoTileHorizontal(row, i, col)) 
				{
					this.tileViews.moveHorizotal(row, col, i);

					this.numsObj.numbers[toIndex] = num;
					this.numsObj.numbers[index] = 0;
					break;
				}
				else if (toNum === num && this.isNoTileHorizontal(row, i, col) && 
					     !this.tileViews.hasConflicted[toIndex]) 
				{
					this.tileViews.moveHorizotal(row, col, i);

					this.numsObj.numbers[toIndex] += num;
					this.numsObj.numbers[index] = 0;
					// 加分
					this.numsObj.score += this.numsObj.numbers[toIndex];
					this.tileViews.updateScore(this.numsObj.score);
					this.tileViews.hasConflicted[toIndex] = true;
					break;
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){
		that.updateView();
	}, 250);
	return true;
};

GridManager.prototype.canMoveRight = function ()
{
	for (var i = 0; i < 16; i++)
	{
		if ((i % 4) === 3 || this.numsObj.numbers[i] === 0) { continue; }

		var num = this.numsObj.numbers[i];
		var rightNum = this.numsObj.numbers[i + 1];
		if (rightNum === 0 || rightNum === num) {
			return true;
		}
	}
	return false;
};
GridManager.prototype.moveRight = function ()
{
	if (!this.canMoveRight()) { return false; }
	var index, toIndex, num, toNum;

	for (var row = 0; row < 4; row++)
	{
		for (var col = 2; col >= 0; col--)
		{
			index = getIndex(row, col);
			if (this.numsObj.numbers[index] === 0) { continue; }
			num = this.numsObj.numbers[index];

			for (var i = 3; i > col; i--)
			{
				toIndex = getIndex(row, i);
				toNum = this.numsObj.numbers[toIndex];

				if (toNum === 0 && this.isNoTileHorizontal(row, col, i)) 
				{
					this.tileViews.moveHorizotal(row, col, i);
					this.numsObj.numbers[toIndex] = num;
					this.numsObj.numbers[index] = 0;
					break;
				}
				else if (toNum === num && this.isNoTileHorizontal(row, col, i) && 
					     !this.tileViews.hasConflicted[toIndex]) 
				{
					this.tileViews.moveHorizotal(row, col, i);
					this.numsObj.numbers[toIndex] += num;
					this.numsObj.numbers[index] = 0;
					// 加分
					this.numsObj.score += this.numsObj.numbers[toIndex];
					this.tileViews.updateScore(this.numsObj.score);
					this.tileViews.hasConflicted[toIndex] = true;
					break;
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){
		that.updateView();
	}, 250);
	return true;
};
GridManager.prototype.canMoveUp = function ()
{
	for (var i = 4; i < 16; i++)
	{
		if (this.numsObj.numbers[i] === 0) { continue; }

		var num = this.numsObj.numbers[i];
		var upNum = this.numsObj.numbers[i - 4];
		if (upNum === 0 || upNum === num) {
			return true;
		}
	}
	return false;
};
GridManager.prototype.moveUp = function ()
{
	if (!this.canMoveUp()) { return false; }
	var index, toIndex, num, toNum;

	for (var col = 0; col < 4; col++)
	{
		for (var row = 1; row < 4; row++)
		{
			index = getIndex(row, col);
			if (this.numsObj.numbers[index] === 0) { continue; }
			num = this.numsObj.numbers[index];

			for (var i = 0; i < row; i++)
			{
				toIndex = getIndex(i, col);
				toNum = this.numsObj.numbers[toIndex];

				if (toNum === 0 && this.isNoTileVertical(col, i, row)) {
					this.tileViews.moveVertical(col, row, i);
					this.numsObj.numbers[toIndex] = num;
					this.numsObj.numbers[index] = 0;
					break;
				}
				else if (toNum === num && this.isNoTileVertical(col, i, row) &&
					     !this.tileViews.hasConflicted[toIndex]) {
					this.tileViews.moveVertical(col, row, i);
					this.numsObj.numbers[toIndex] += num;
					this.numsObj.numbers[index] = 0;
					// 加分
					this.numsObj.score += this.numsObj.numbers[toIndex];
					this.tileViews.updateScore(this.numsObj.score);
					this.tileViews.hasConflicted[toIndex] = true;
					break;
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){
		that.updateView();
	}, 250);
	return true;
};

GridManager.prototype.canMoveDown = function ()
{
	for (var i = 0; i < 12; i++)
	{
		if (this.numsObj.numbers[i] === 0) { continue; }

		var num = this.numsObj.numbers[i];
		var downNum = this.numsObj.numbers[i + 4];
		if (downNum === 0 || downNum === num) {
			return true;
		}
	}
	return false;
};
GridManager.prototype.moveDown = function ()
{
	if (!this.canMoveDown()) { return false; }
	var index, toIndex, num, toNum;

	for (var col = 0; col < 4; col++)
	{
		for (var row = 2; row >= 0; row--)
		{
			index = getIndex(row, col);
			if (this.numsObj.numbers[index] === 0) { continue; }
			num = this.numsObj.numbers[index];

			for (var i = 3; i > row; i--)
			{
				toIndex = getIndex(i, col);
				toNum = this.numsObj.numbers[toIndex];

				if (toNum === 0 && this.isNoTileVertical(col, row, i)) {
					this.tileViews.moveVertical(col, row, i);
					this.numsObj.numbers[toIndex] = num;
					this.numsObj.numbers[index] = 0;
					break;
				}
				else if (toNum === num && this.isNoTileVertical(col, row, i) &&
					     !this.tileViews.hasConflicted[toIndex]) {
					this.tileViews.moveVertical(col, row, i);
					this.numsObj.numbers[toIndex] += num;
					this.numsObj.numbers[index] = 0;
					// 加分
					this.numsObj.score += this.numsObj.numbers[toIndex];
					this.tileViews.updateScore(this.numsObj.score);
					this.tileViews.hasConflicted[toIndex] = true;
					break;
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){
		that.updateView();
	}, 250);
	return true;
};
GridManager.prototype.isGameOver = function ()
{
	if (this.isNoSpace() && this.isNoMove()) {
		this.gameOver();
	}
};
GridManager.prototype.isNoMove = function ()
{
	if (this.canMoveLeft() || this.canMoveRight() ||
		this.canMoveUp() || this.canMoveDown()) {
		return false;
	}
	return true;
}
GridManager.prototype.gameOver = function ()
{
	alert("Game Over!");
};