function Circle()
{
    createjs.Shape.call(this);

    //调用圆的颜色
    this.setCircleType = function(type)
    {
        this._CircleType = type;
        switch(type)
        {
            case Circle.TYPE_UNSELECTED:
                this.setColor("#cccccc");
                break;
            case Circle.TYPE_SELECTED:
                this.setColor("#FF6600");
                break;
            case Circle.TYPE_Cat:
                this.setColor("#000066");  //毛的颜色
                break;
        }
    }

    //绘制圆，圆的颜色通过传参的方式传入
    this.setColor = function(ColorString)
    {
        this.graphics.beginFill(ColorString);
        this.graphics.drawCircle(0,0,25);
        this.graphics.endFill();
    }

    //函数的返回值
    this.getCircleType = function()
    {
        return this._CircleType;
    }

    //设置默认小球颜色值
    this.setCircleType(1);
}

//复制属性
Circle.prototype = new createjs.Shape();

//设置函数通用型变量
Circle.TYPE_UNSELECTED = 1;
Circle.TYPE_SELECTED = 2;
Circle.TYPE_Cat = 3;