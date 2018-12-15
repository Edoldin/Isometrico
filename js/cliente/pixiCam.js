var pixiCam={
    initSettings:function(){
        if(app.stage.renderer instanceof PIXI.CanvasRenderer){
            console.log('Canvas render')
            return false
        }
        // PIXI.settings.FILTER_RESOLUTION=0;
        app.stage.scale.x=Math.SQRT2;
        app.isometrico=true;
        app.antialias=true;
        console.log('Isometrico Cargado')
        //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        //Buscar algo para detectar el tipo de render
        app.stage.interactive = true;
        // map,efects,units,menu
        console.log('Webgl renderer')
        return true
    },
    scalePixi:function(e,m=1.2){//no usada
        //e<0? acercar:alejar
        m=e<0?m:1/m;
        //coordenadas del mouse
        app.stage.scale.x=app.stage.scale.x*m
        app.stage.scale.y=app.stage.scale.y*m
    },
    scalePixiPoint:function(e,p={x:app.view.width/2,y:app.view.height/2},m=1.1){
        //e<0? acercar:alejar
        m=e<0?m:1/m;
        //coordenadas del mouse
        app.stage.scale.x*=m
        app.stage.scale.y*=m
        app.stage.position.x+=(1-m)*(p.x-app.stage.position.x)
        app.stage.position.y+=(1-m)*(p.y-app.stage.position.y)
    },
    setScale:function(x,y=x,p={x:app.view.width/2,y:app.view.height/2}){
        app.stage.scale.x=x
        app.stage.scale.y=y
        pixiCam.centerCamera(p)
    },
    windowToPixi:function(p,stage=app.stage){
        return {
            x:(p.x-stage.position.x)/stage.scale.x,
            y:(p.y-stage.position.y)/stage.scale.y
        }
    },
    pixiToWindow:function(p,stage=app.stage){
        return {
            x:p.x*stage.scale.x+stage.position.x,
            y:p.y*stage.scale.y+stage.position.y
        }
    },
    centerCamera:function(p={x:0,y:0}){
        app.stage.position=new PIXI.Point(-p.x*app.stage.scale.x+app.view.width/2,app.view.height/2-p.y*app.stage.scale.y)
        //console.log('centro camara en '+app.stage.position.x+','+app.stage.position.y)
    },
    semiCenterCamera:function(p={x:0,y:0},f=1){
        p.r=p.r||50;
        const middle=pixiCam.windowToPixi({x:app.view.width/2,y:app.view.height/2})
        const m={x:app.view.width/2/app.stage.scale.x*f,y:app.view.height/2/app.stage.scale.y*f}
        if(p.r>m.x||p.r>m.y) pixiCam.centerCamera(p)
        else{
            let np={x:middle.x,y:middle.y,updt:false}
            const c={x:p.x-middle.x,y:p.y-middle.y}
            if(c.x<-m.x+p.r){ np.updt=true; np.x=p.x+m.x-p.r;}
            if(c.x>m.x-p.r) { np.updt=true; np.x=p.x-m.x+p.r;}
            if(c.y<-m.y+p.r){ np.updt=true; np.y=p.y+m.y-p.r;}
            if(c.y>m.y-p.r) { np.updt=true; np.y=p.y-m.y+p.r;}
            if(np.updt) pixiCam.centerCamera(np)
        }
    },
    limitedCamera:function(ls,p){
        const m={x:app.view.width/app.stage.scale.x,y:app.view.height/app.stage.scale.y}
        if(ls.w<m.x)    pixiCam.scalePixiPoint(-1,null,m.x/ls.w)
        if(ls.h<m.y)    pixiCam.scalePixiPoint(-1,null,m.x/ls.w)

        const p1=pixiCam.windowToPixi({x:0,y:0});
        const p2=pixiCam.windowToPixi({x:app.view.width,y:app.view.height});
        let updt=false;
        if(p1.x<ls.x){ updt=true; app.stage.position.x=ls.x}
        if(p2.y<ls.y){ updt=true; app.stage.position.y=ls.y} 
        /*if(p1.x<ls.x+ls.w){ updt=true; app.stage.position.x=ls.x-m.x}
        if(p2.y>ls.y+ls.h){ updt=true; app.stage.position.y=ls.y-m.y} */
        if(!updt) pixiCam.centerCamera(p)
    },
    movePixi:function(p={x:0,y:0}){
        app.stage.position=new PIXI.Point(stage.position.x+p.x,stage.position.y+p.y)
    },
    isometricRendering:function(stage=app.stage){//no termina de funcionar cuando y<0 
        stage.children.sort(function (a,b){
            //if(a.zIndex==undefined)a.zIndex=1;
            //if(b.zIndex==undefined)b.zIndex=1;
            if(a.zIndex>b.zIndex)return 1;
            if(a.zIndex<a.zIndex)return -1;
            if(a.y>=b.y&&a.zIndex==b.zIndex)return 1; 
            else return -1;
        });
    }
}