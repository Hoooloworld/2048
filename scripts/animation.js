function appearAnimation (tileView, row, col, value)
{
	tileView.animate({
		width:"100px",
		height:"100px",
		top:getPosTop(row),
		left:getPosLeft(col),
		opacity: 1
	}, 200, function (){
		tileView.html(value);
	});	
}

function horizontalMoveAnimation (tileView, toCol)
{
	tileView.animate({
		left:getPosLeft(toCol)
	}, 200);
}

function verticalMoveAnimation (tileView, toRow)
{
	tileView.animate({
		top: getPosTop(toRow)
	}, 200);
}

