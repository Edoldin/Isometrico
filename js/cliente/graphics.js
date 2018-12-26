class BaseGraphics extends PIXI.Graphics{
    constructor(stage=app.stage){
        super()
        this.lineStyle
        this.stage=stage;
        stage.addChild(this);
    }
    move(p){
        this.x+=p.x;
        this.y+=p.y;
    }
    remove(){
        this.stage.removeChild(this)
        this.destroy()
        delete this
    }
}
class HitGraphics extends BaseGraphics{
    constructor(padre,stage=app.stage){
        super(stage);
        this.padre=padre;
        if(this.padre.hitArea.type==2) this.rotate(this.padre.hitArea.angle)
        if(this.padre.hitArea.type==4) this.rotate(this.padre.hitArea.desfase)
        this.zIndex=0;
        this.update()
    }
    update(){
        this.clear()
        this.lineStyle(2, 0xFF0000);
        const ha=this.padre.hitArea
        switch (ha.type) {
            case 1:
                this.drawRect(ha.x,ha.y,ha.w,ha.h)
                break;
            case 2:
                this.drawRect(ha.x,ha.y,ha.w,ha.h)
                break;
            case 3:
                this.drawCircle(ha.x,ha.y,ha.r)
                break;
            case 4:
            break;
            case 5: 
            break;
        }
    }
}
class PointGraphics extends BaseGraphics{
    constructor(padre,stage=app.stage){
        super(stage);
        if (padre) this.padre=padre
        this.update()
        //this.zIndex=1;
    }
    update(){
        this.clear()
        this.lineStyle(2, 0xFF0000);
        this.drawCircle(this.padre.position.x,this.padre.position.y,1);
    }
}