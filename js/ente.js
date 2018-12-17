class Base{
    constructor(options){
        if(options==undefined||options==null) options={};
        const defaultStats={position:new Shape.point(0,0),animation:0,direccion:new Shape.point(0,0),lastdir:new Shape.point(0,0),
            vida:100,atack:10,def:10,velocidad:0.2,
        }
        var o=this
        Object.keys(defaultStats).map(function(key){
            o[key]=options[key]||defaultStats[key];
        })
    }
}
class Ente extends Base{
    constructor(options){
        super(options);
        var o=this;
        o.attachedElements=[];
        const{x,y}=o.position
        const hA=animationtype[o.animation].hitArea;
        if(hA.type==1)  o.hitArea=new Shape.rect(x-hA.w/2,y-hA.h/2,hA.w,hA.h)
        if(hA.type==2)  o.hitArea=new Shape.circle(x,y,hA.r)
        this.attachedElements.push(o.hitArea)
        o.graphics=new AnimatedSprite(o)
        this.attachedElements.push(o.graphics)
        o.hitGraphics=new HitGraphics(o)
        this.attachedElements.push(o.hitGraphics)
        /*o.punto=new PointGraphics(o)
        this.attachedElements.push(o.punto)*/

    }
    scale(p){
        if(typeof p=='number')p={x:p,y:p}
        //this.graphics.scale(p,this.position)
        this.attachedElements.forEach(e => {
            if(e.update) e.update();
        });
    }
    move(p){// la hitbox no se actualiza bien
        if(p.x==0 && p.y==0) return
        this.position=this.position.plus(p)
        this.attachedElements.forEach(e => {
            e.move(p);
        });
    }
    setPosition(p){
        this.position= Shape.point.copy(p)
        this.hitArea.moveTo(p)
        this.attachedElements.forEach(e => {
            if(e.update) e.update();
        });
        this.graphics.setPosition(p)
    }
    add(){
        this.mySceneArray.push(this)
        this.graphics.addTo(this.position)
        this.graphics.play(animationtype[this.animation].initAnimaton)
    }
    remove(e,remove){
        const n=this.attachedElements.indexOf(e)
        if(n>0 && n<this.attachedElements.length){
            this.attachedElements.slice(n,1)
            app.renderer.removeChild(e);
        }
        if(remove && e.remove) e.remove()
    }
    removeAll(){
        while(this.attachedElements.length<0){
            const e=this.attachedElements[this.attachedElements.length-1]
            this.attachedElements.pop();
            app.renderer.removeChild(e);
            if(e.remove) e.remove()
        }
    }
    deleteAll(){
        while(this.attachedElements.length>0){
            var e=this.attachedElements[this.attachedElements.length-1]
            this.attachedElements.pop();
            if(e.remove) e.remove()
            e=null;
        }
    }
    destroy(){
        this.mySceneArray.splice(this.mySceneArray.indexOf(this), 1);
        this.deleteAll()
        delete this;
    }
}
class Aleat extends Ente{
    constructor(options){
        super(options);
        this.mySceneArray=myScene.jugadores;
    }
    tiempo(delta){// ejemplo control de direccion
        if (this.vida<=0){
            this.destroy()
            return 
        }
        if(Math.random()<0.02){
            const a=[{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1},
                    {x:-Math.SQRT1_2,y:-Math.SQRT1_2},
                    {x:Math.SQRT1_2,y:-Math.SQRT1_2},
                    {x:-Math.SQRT1_2,y:Math.SQRT1_2},
                    {x:Math.SQRT1_2,y:Math.SQRT1_2},]
            this.lastdir=this.direccion
            const sol=Math.floor(Math.random()*8)
            this.direccion=Shape.point.copy(a[sol]);
            if(sol==0||sol==5||sol==7) this.graphics.play('right')
            if(sol==1) this.graphics.play('down')
            if(sol==2||sol==4||sol==6) this.graphics.play('left')
            if(sol==3) this.graphics.play('up')
        }else{
            let d=this.direccion.copy().scale(this.velocidad*delta)
            this.move(d)
        }
    }
}
class Static extends Ente{
    constructor(options){
        super(options);
        this.mySceneArray=myScene.jugadores;
    }
    tiempo(delta){
        if (this.vida<=0){
            this.destroy()
            return 
        }
    }
}
class Prota extends Ente{
    constructor(options){
        super(options);
        this.mySceneArray=myScene.jugadores;
        this.teclas={w:false,a:false,s:false,d:false}
    }
    tiempo(delta){
        if (this.vida<=0){
            this.destroy()
            return 
        }
        let d=Shape.point.copy(this.direccion).scale(this.velocidad*delta)
        this.move(d)
        if(controles.tipoCamara=='centrada')   pixiCam.centerCamera(this.hitArea)
        if(controles.tipoCamara=='semicent')   pixiCam.semiCenterCamera(this.hitArea,0.3)
        if(controles.tipoCamara=='limited')    pixiCam.limitedCamera({x:0,y:0,w:2000,h:2000},this.position)
    } 
    dispara(p){
        const dir=Shape.point.vNormalizado(this.position,p)
        var disparo=new Disparo(this,{position:this.position.copy(),direccion:dir})
        disparo.add()
        //console.log(this.position)
        const position=this.position.copy().plus(dir.scale(20))
        disparo.setPosition(position)
    }
}
class Disparo extends Ente{
    constructor(padre,stats={}){
        const defaultStats={position:new Shape.point(padre.x,padre.y),animation:5,direccion:new Shape.point(1,0),lastdir:new Shape.point(0,0),
            vida:200,atack:100,velocidad:0.3,
        }
        super(defaultStats)
        this.padre=padre;
        this.mySceneArray=myScene.disparos;
        var o=this
        Object.keys(defaultStats).map(function(key){
            o[key]=stats[key]||defaultStats[key];
        })
    }
    tiempo(delta){
        let d=this.direccion.copy().scale(this.velocidad*delta)
        this.move(d)
        this.vida--;
        if (this.vida<=0) this.destroy()
    }
}
var animationtype=[{//0
    tittle:'capi',
    src:'src/capi.png',
    width:256,
    height:256,
    scale:{x:1,y:1},
    tileNumberW:4,
    tileNumberH:4,
    animationSpeed:0.2,
    initAnimaton:'down',
    textures:[],
    dividedTextures:false,
    animations:{
        down:[0,1,2,3],downS:[0],
        left:[4,5,6,7],leftS:[4],
        right:[6,9,10,11],rightS:[6],
        up:[12,13,14,15],upS:[12]
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:12},//circle
    //hitArea:{type:1,w:20,h:20},//rect
},{//1
    tittle:'squeleton',
    src:'src/squeleton.png',
    width:576,
    height:256,
    scale:{x:1,y:1},
    tileNumberW:9,
    tileNumberH:4,
    animationSpeed:0.2,
    initAnimaton:'down',
    textures:[],
    dividedTextures:false,
    animations:{
        down:[18,19,20,21,22,23,24,25,26],downS:[18],
        left:[9,10,11,12,13,14,15,16,17],leftS:[9],
        right:[27,28,29,30,31,32,33,34,35],rightS:[27],
        up:[0,1,2,3,4,5,6,7,8],upS:[0]
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:12},//circle
    //hitArea:{type:1,w:20,h:20},//rect
},{//2
    tittle:'goldenArmor',
    src:'src/goldenarmor.png',
    width:576,
    height:256,
    scale:{x:1,y:1},
    tileNumberW:9,
    tileNumberH:4,
    animationSpeed:0.2,
    initAnimaton:'down',
    textures:[],
    dividedTextures:false,
    animations:{
        down:[18,19,20,21,22,23,24,25,26],downS:[18],
        left:[9,10,11,12,13,14,15,16,17],leftS:[9],
        right:[27,28,29,30,31,32,33,34,35],rightS:[27],
        up:[0,1,2,3,4,5,6,7,8],upS:[0]
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:12},//circle
    //hitArea:{type:1,w:20,h:20},//rect
},{//3
    tittle:'disparoAzul',
    src:'src/disparoAzul.jpg',
    width:736,
    height:736,
    scale:{x:1,y:1},
    tileNumberW:8,
    tileNumberH:8,
    animationSpeed:0.6,
    initAnimaton:'vive1',
    textures:[],
    dividedTextures:false,
    animations:{
        crea:'0-23',
        vive1:'0-63',
        vive2:'31-24',
        destruye:'32-63'
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:3}
},
{//4
    tittle:'explosion',
    src:'src/explosion.jpg',
    width:900,
    height:680,
    scale:{x:0.3,y:0.3},
    tileNumberW:8,
    tileNumberH:6,
    animationSpeed:1,
    initAnimaton:'vive',
    textures:[],
    dividedTextures:false,
    animations:{
        crea:'0-15',
        vive:[14,15,16,17,18,19,20,21,22,21,20,19,18,17,16,15],
        destruye:'32-39'
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:5}
},
{//5
    tittle:'disparosCarpeta',
    src:'src/disparosSprites/4.png',
    width:2048,
    height:1024,
    scale:{x:0.3,y:0.3},
    tileNumberW:8,
    tileNumberH:4,
    animationSpeed:0.5,
    initAnimaton:'vive',
    textures:[],
    dividedTextures:false,
    animations:{
        vive:'0-31',
    },
    gContainerPosition:{x:0,y:-64*2/5},
    hitArea:{type:2,r:5}
},
];
