var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick",stage);

var gameView = new createjs.Container();
gameView.x = 30;
gameView.y =30;
stage.addChild(gameView);

var circleArr = [[],[],[],[],[],[],[],[],[]];//定义数组，承载圆
var currentCat;
var MOVE_NONE=-1,MOVE_LEFT=0,MOVE_UP_LEFT=1,MOVE_UP_RIGHT=2,MOVE_RIGHT=3,MOVE_BOTTOM_RIGHT= 4,MOVE_BOTTOM_LEFT=5;

//逻辑函数
function getMoveDir(cat)
{
    var distanceMap=[];
    //left
    var can = true;//标记变量
    for(var x = cat.indexX ; x>=0 ; x--)
    {
        if(circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_LEFT] = cat.indexX - x;
            break;
        }
    }
    if(can)
    {
        return MOVE_LEFT;
    }

    //left up
    can = true;
    x = cat.indexX;
    var y = cat.indexY;
    while(true)
    {
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_UP_LEFT] = cat.indexY - y;
            break;
        }
        //数组从0开始计，解决双行X不变，单行X减减，不能用for循环，替代的方法是  while 里写if 来循环
        if(y%2 == 0)
        {
            x--;
        }
        y--;
        if(x<0 || y<0)
        {
            break; //考虑边界问题
        }
    }
    if(can)
    {
        return MOVE_UP_LEFT;
    }

    //right up
    can = true;
    x = cat.indexX;
    y = cat.indexY;
    while(true)
    {
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_UP_RIGHT] = cat.indexY - y;
            break;
        }
        if(y%2 == 1)
        {
            x++;
        }
        y--;
        if(x>8 || y<0)
        {
            break; //考虑边界问题
        }
    }
    if(can)
    {
        return MOVE_UP_RIGHT;
    }

    //right
    can = true;
    for(x = cat.indexX; x<9 ;x++)
    {
        if(circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_RIGHT] = x -cat.indexX ;
            break;
        }
    }
    if(can)
    {
        return MOVE_RIGHT;
    }

    //right bottom
    can = true;
    x = cat.indexX;
    y = cat.indexY;
    while(true)
    {
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_BOTTOM_RIGHT] = y - cat.indexY;
            break;
        }
        if(y%2 == 1)
        {
            x++;
        }
        y++;
        if(x>8 || y>8)
        {
            break;
        }
    }
    if(can)
    {
        return MOVE_BOTTOM_RIGHT;
    }

    //left bottom
    can = true;
    x = cat.indexX;
    y =cat.indexY;
    while(true)
    {
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            can = false;
            distanceMap[MOVE_BOTTOM_LEFT] = y - cat.indexY;
            break;
        }
        if(y%2==0)  //单数不变，双数x减减
        {
            x--;
        }
        y++;
        if(x<0 || y> 8)
        {
            break;
        }
    }
    if(can)
    {
        return MOVE_BOTTOM_LEFT;
    }

    //计算还有路可走
    var maxDir = -1,maxValue = -1;
    for(var dir=0;dir<distanceMap.length;dir++)
    {
        if(distanceMap[dir]>maxValue)
        {
            maxValue = distanceMap[dir];
            maxDir = dir;
        }
    }
    if(maxValue>1)
    {
        return maxDir;
    }
    else
    {
        return MOVE_NONE;
    }
}

//点击事件函数
function circleClicked(event)
{
    if(event.target.getCircleType() != Circle.TYPE_Cat)
    {
        event.target.setCircleType(Circle.TYPE_SELECTED);//.target属性指的是目标值，即点击值
    }
    else
    {
        return;
    }

    //判断边界问题
    if(currentCat.indexX ==0 || currentCat.indexX ==8 || currentCat.indexY == 0 || currentCat.indexY == 8)
    {
        alert("游戏结束！");
        return;
    }

    //第二种方法，难度加大版
    var dir = getMoveDir(currentCat);
    switch (dir)
    {
        case MOVE_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);//移动后使当前猫变为未选择状态
            currentCat = circleArr[currentCat.indexX - 1][currentCat.indexY];//当前猫的移动的位置付给currentCat，其值已更新
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        case  MOVE_UP_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX:currentCat.indexX-1][currentCat.indexY -1];
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        case MOVE_BOTTOM_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2 ? currentCat.indexX-1:currentCat.indexX][currentCat.indexY + 1];
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        case MOVE_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexX +1][currentCat.indexY];
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        case MOVE_UP_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2 ? currentCat.indexX:currentCat.indexX +1][currentCat.indexY -1];
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        case MOVE_BOTTOM_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2 ? currentCat.indexX+1:currentCat.indexX][currentCat.indexY +1];
            currentCat.setCircleType(Circle.TYPE_Cat);
            break;
        default :
            alert("成功围住神经猫！");
    }




    /*第一种方法，游戏本身的逻辑不够强大，易玩
    var leftCircle = circleArr[currentCat.indexX-1][currentCat.indexY];
    var rightCircle = circleArr[currentCat.indexX+1][currentCat.indexY];
    var leftTopCircle = circleArr[currentCat.indexX-1][currentCat.indexY-1];
    var rightTopCircle = circleArr[currentCat.indexX][currentCat.indexY-1];
    var leftBottomCircle = circleArr[currentCat.indexX-1][currentCat.indexY+1];
    var rightBottomCircle = circleArr[currentCat.indexX+1][currentCat.indexY+1];
    if(leftCircle.getCircleType() == 1)   //get --获取当前状态    set --新建立状态
    {
        leftCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = leftCircle;
    }
    else if(rightCircle.getCircleType() == 1)
    {
        rightCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = rightCircle;
    }
    else if(leftTopCircle.getCircleType() == 1)
    {
        leftTopCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = leftTopCircle;
    }
    else if(rightTopCircle.getCircleType() == 1)
    {
        rightTopCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = rightTopCircle;
    }
    else if(leftBottomCircle.getCircleType() == 1)
    {
        leftBottomCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = leftBottomCircle;
    }
    else if(rightBottomCircle.getCircleType() == 1)
    {
        rightBottomCircle.setCircleType(3);
        currentCat.setCircleType(1);
        currentCat = rightBottomCircle;
    }
    else
    {
        alert("游戏结束！");
    }
    //CatMove();*/
}

/*//猫可以向六个方向移动后，原位置恢复灰色和被点击的可能
function CatMove(s)
{
    if(s.getCircleType() == 1)
    {
        s.getCircleType(3);
        currentCat.getCircleType(1);
        currentCat = s;
    }
}*/

//绘制全屏的圆
function addCircles()
{
    for(var indexY=0; indexY < 9; indexY++)
    {
        for(var indexX=0; indexX < 9; indexX++)
        {
            var c =new Circle();
            gameView.addChild(c);

            circleArr[indexX][indexY] = c;
            c.indexX = indexX;
            c.indexY = indexY;
            c.x = indexY%2?indexX*55+25:indexX*55;//每行错位
            c.y = indexY*55;

            //绘制猫
            if(indexX == 4 && indexY == 4)
            {
                c.setCircleType(3);
                currentCat = c;
            }
            //选择添加圆，避免被选后未被添加而导致猫又走
            else if(Math.random() < 0.1)
            {
                c.setCircleType(Circle.TYPE_SELECTED);
            }

            //监听鼠标点击事件
            c.addEventListener("click",circleClicked);
        }
    }
}

addCircles();
