class AnimatedSprite{
    constructor(padre){
        let o=this;
        o.sprites={}
        o.container=new PIXI.Container();
        o.padre=padre
        o.tipo=animationtype[padre.animation]
        o.container.zIndex=1;
        o.container.scale=new PIXI.Point(o.tipo.scale.x,o.tipo.scale.y)
        if (app.isometrico)o.container.scale.x*=Math.SQRT1_2;
        o.currentSprite=o.tipo.initAnimaton
        //o.spriteTime=new Date().getDate();
        Object.keys(o.tipo.animations).map(function(key,index){
            var value=o.tipo.animations[key]
            if(typeof value=='string'){
                const [a,b]=value.split('-')
                value=[]
                if(a<b) for(let k=a;k<=b;k++) value.push(k)
                if(a>b) for(let k=a;k>=b;k--) value.push(k)
            }
            let texture=[];
            for(let k=0;k<value.length;k++){
                texture.push(o.tipo.textures[value[k]])
            }
            o.sprites[key]=new PIXI.extras.AnimatedSprite(texture)
            o.sprites[key].animationSpeed=o.tipo.animationSpeed;
        })
    }
    addTo(p={x:0,y:0},stage=app.stage){
        this.container.addChild(this.sprites[this.currentSprite])
        this.stage=stage
        stage.addChild(this.container)
        this.setPosition(p)
    }
    play(animationName){
        this.container.removeChild(this.sprites[this.currentSprite]);
        this.sprites[this.currentSprite].stop();
        this.container.addChild(this.sprites[animationName]);
        this.sprites[animationName].gotoAndPlay(0);
        this.currentSprite=animationName;
    }
    stop(){
        this.sprites[this.currentSprite].stop();
    }
    setPosition(p){
        this.container.x=p.x-this.container.width/2+this.tipo.gContainerPosition.x;
        this.container.y=p.y-this.container.height/2+this.tipo.gContainerPosition.y;
    }
    move(p){// 0 abajo, 1 izquierda, 2 derecha, 3 arriba
        this.container.x+=p.x;
        this.container.y+=p.y;
    }
    scale(p,pivot={x:0,y:0}){// no termina de funcionar
        //const x=this.tipo.gContainerPosition.x
        //const y=-this.tipo.gContainerPosition.y
        this.container.pivot=new PIXI.Point(pivot.x,pivot.y);
        this.container.scale.x*=p.x
        this.container.scale.y*=p.y
    }
    remove(){
        this.stage.removeChild(this.container)
        delete this
    }
    static load(cb){
        AnimatedSprite.loader=PIXI.loader;
        for (let k=0;k<animationtype.length;k++){
            AnimatedSprite.loader.add(animationtype[k].tittle,animationtype[k].src)
        }
        function separaTexturas(){//poner control para saber si una imagen ha sido cargada
            for(let k=0;k<animationtype.length;k++){
                let a=animationtype[k]
                const dim={x:a.width/a.tileNumberW,y:a.height/a.tileNumberH};
                const baseTexture=AnimatedSprite.loader.resources[a.tittle].texture;
                for(let h=0;h<a.tileNumberH;h++){
                    for(let w=0;w<a.tileNumberW;w++){
                        const texture=new PIXI.Texture(baseTexture, new PIXI.Rectangle(dim.x*w, dim.y*h, dim.x, dim.y));
                        a.textures.push(texture);
                    }
                }
                a.dividedTextures=true;
            }
            cb()
        }
        AnimatedSprite.loader.load(separaTexturas);
        //AnimatedSprite.loader.on('complete', callback())
    }
}