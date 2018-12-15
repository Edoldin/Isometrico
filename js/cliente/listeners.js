var listeners={
    add:function(){
        listeners.redim()
        window.addEventListener('resize',listeners.redim);
        window.addEventListener('keydown',listeners.keyDown)
        window.addEventListener('keyup',listeners.keyUp)
        app.view.addEventListener('mousedown',(event)=>{listeners.mouse(event,true)})
        app.view.addEventListener('mousemove',(event)=>{listeners.mouse(event,false)})
        app.view.addEventListener('wheel',(event)=>{listeners.rueda(event)})
        listeners.removeContext();
    },
    removeContext:function(){
        document.oncontextmenu = function(){return false;}
        document.onselectstart=function(){return false;}
    },
    redim:function(){
        var w=window.innerWidth;
        var h=window.innerHeight;
        app.renderer.resize(w,h);
        app.view.height=h;
        app.view.width=w;
    },
    mouse:function(event,click){
        //event.button 0 iz, 1 rueda, 2 dc
        if (click){
            if(event.button==0){
                const p=Shape.point.copy(pixiCam.windowToPixi({x:event.clientX,y:event.clientY}))
                prota.dispara(p)
            }
        }
        var x=event.clientX;
        var y=event.clientY;
    },
    rueda:function(event){
        pixiCam.scalePixiPoint(event.deltaY)
    },
    keyDown:function(event){listeners.key(event,true)},
    keyUp:function(event){listeners.key(event,false)},
    key:function(event,bol){
        var key=event.key.toLowerCase()
        if(key=='w' || key=='a' || key=='s' || key=='d' || key=='shift'){
        if(prota[key]!=bol){
                prota.teclas[key]=bol;
                let d={x:0,y:0};
                if(prota.teclas['w']) d.y--;
                if(prota.teclas['a']) d.x--;
                if(prota.teclas['s']) d.y++;
                if(prota.teclas['d']) d.x++;
                if(d.x==0||d.y==0)prota.direccion=d;
                else prota.direccion={x:Math.sign(d.x)*Math.SQRT1_2,y:Math.sign(d.y)*Math.SQRT1_2}
                //console.log(event.key+' '+prota[event.key])
                //conexion.send(JSON.stringify({tipo:'direccion',msj:{w:prota.w,a:prota.a,s:prota.s,d:prota.d}}))
            }
        }
        if(key=='e'&& bol){memoriaUI.skill=(memoriaUI.skill+1)%tiposDisparo.length}
        if(key=='q'&& bol){memoriaUI.skill=(memoriaUI.skill+tiposDisparo.length-1)%tiposDisparo.length}
        if(key=='enter'&& bol)    texto.actua();
    }
};console.log('listeners cargados')