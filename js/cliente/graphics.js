class BaseGraphics extends PIXI.Graphics{
    constructor(stage=app.stage){
        super()
        this.stage=stage;
        stage.addChild(this);
    }
    move(p){
        this.x+=p.x;
        this.y+=p.y;
    }
    remove(){
        this.stage.removeChild(this)
        delete this
    }
}
class HitGraphics extends BaseGraphics{
    constructor(padre,stage=app.stage){
        super(stage);
        this.padre=padre;
        this.zIndex=0;
        this.update()
    }
    update(){
        this.clear()
        this.lineStyle(2, 0xFF0000);
        if(this.padre.hitArea.type=='rect'){
            const {x,y,w,h}=this.padre.hitArea;
            this.drawRect(x,y,w,h);
        }
        if(this.padre.hitArea.type=='circle'){
            const {x,y,r}=this.padre.hitArea;
            this.drawCircle(x,y,r)
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