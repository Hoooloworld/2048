function getPosTop (row)
{
	return 20 + row * 120;
}

function getPosLeft (col)
{
	return 20 + col * 120;
}

function getNumberBackgroundColor (number)
{
	switch (number)
	{
		case 2    : return "#eee4da"; break;
		case 4    : return "#ede0c8"; break;
		case 8    : return "#f2b179"; break;
		case 16   : return "#f59563"; break;
		case 32   : return "#f67c5f"; break;
		case 64   : return "#f65e3b"; break;
		case 128  : return "#edcf72"; break;
		case 256  : return "#edcc61"; break;
		case 512  : return "#edc850"; break;
		case 1024 : return "#edc53f"; break;
		case 2048 : return "#edc22e"; break;
	}
	return "black";
}

function getNumberColor (number)
{
	if (number <= 4) {
		return "#776e65";
	}
	return "#f9f6f2";
}

function getNumberSize (number)
{
	if (number < 128) {
		return 55 + "px";
	}
	if (number >= 128 && number < 1024) {
		return 45 + "px";
	}
	if (number >= 1024) {
		return 35 + "px";
	}
}

// position 转成 下标
function getIndex (row, col)
{
	return (row * 4 + col);
}

function indexToRow (index)
{
	return parseInt(Math.floor(index / 4));
}

function indexToCol (index)
{
	return index % 4;
}
/*
 共享 onload 事件
*/
function addLoadEvent (func)
{
	var oldOnLoad = window.onload;
	if (typeof window.onload !== "function")
	{
		window.onload = func;
	}
	else
	{
		window.onload = function ()
		{
			oldOnLoad();
			func();
		}
	}
}