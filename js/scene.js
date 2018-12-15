/*const fs=require('fs');
const Jugador=require('./jugador.js')
const Disparo=require('./disparo.js')
const Items=require('./items.js')
const Shape=require('./shapes.js')*/

class Scene{
    constructor(){
        // jugadores, bloques y areas calcularán cambios, se podrán añadir o quitar comprobaciones según la escena
        // mundo sólo aplica cambios y será lo que guardaremos al cerrar
        // cambios será lo que enviemos a los jugadores, que tendrán su propio mundo que los aplicará
        this.limite=new Shape.rect(-10000,-10000,20000,20000)
        this.troceado=[]
        this.ladoTroceado=200
        for(var k=this.limite.x;k<this.limite.width/this.ladoTroceado;k*=this.ladoTroceado){
            troceado[k]=[];
            for(var j=this.limite.y;j<this.limite.height/this.ladoTroceado;j*=this.ladoTroceado){
                troceado[k][j]={limite: new Shape.rect(k*this.ladoTroceado),items:[]}
            }
        }
        this.jugadores=[];
        this.disparos=[];
        this.jugadoresM=[];
        this.npc=[];
        this.items=[]; //items constiene todo lo que tiene el mundo por defecto, sin jugadores
        this.areas=[];
        this.bloques=[];
        this.tiposAreas=[];
        this.tiposBloques=[];
        this.tiposJugador=[];
        this.tiposNpc=[];
        this.tiposDisparo=[];

        this.cambios={
            jugadores:[],
            items:[]
        };
        this.opciones={
            tiempo:false,
            fps:60
        }
        this.mundo;
        this.frameFunctions=[]
        //this.leeMundo(id);
    }
    leeMundo(id){
        fs.readFile('./mundos/'+id+'.json', function(error, content) {
            if (error) throw error;
            else{
                Scene.cargaMundo(content)
                console.log('mundo leído');
                this.id=id
            }
        });
    }
    static cargaMundo(str){
        var mundo=JSON.parse(str);
    }
    actualizaMundoStr(){
        var mundo={
            //jugadores:this.jugadores.map(),
            bloques:this.bloques
            /*areas:this.areas.map(),
            items:this.items.map():*/
        }
        this.escribeMundo(id,JSON.stringify(mundo))
    }
    escribeMundo(id){
        fs.writeFile('./mundos/'+id+'.json',JSON.stringify(this.mundo),(error)=>{
            if (error) throw error;
            else{
                console.log('mundo escrito')
            }
    });
    }
    addTiempo(){
        if(this.opciones.tiempo==false){
            this.tiempo=setInterval(()=>{
                this.frameFunctions.forEach(funcion=>{funcion(1000/this.opciones.fps)})
                //this.enviaCambios()
            },1000/this.opciones.fps);
            this.opciones.tiempo=true;
            console.log('time running')
        }
 
    }
    stopTiempo(){
        if(this.opciones.tiempo==true){
            clearInterval(this.tiempo)
            this.opciones.tiempo=false
            console.log('time stopped')
        }
    }
    enviaMundo(ws){
        let {jugadoresM,items}=this
        let msj={
            tipo:'mundo',
            msj:{
                jugadores:jugadoresM,
                items:items}
        }
        ws.send(JSON.stringify(msj))
    }
    frame(){
        this.frameFunctions.forEach(funcion=>{funcion()})
        for(let k=0;k<this.jugadores.length;k++){
            if(this.jugadores[k].jugador){
                var j=this.jugadores[k].jugador
                if(j.tiempo())  this.jugadoresM[k]={}
/*                for(let i=0;i<this.items.length;i++){  // bloques vs jugador 
                    var d=this.bloques[b].colisiona(c)
                    if (d) c.bloque(this.bloques[b],d) 
                }
                var m={id:c.id,x:c.x,y:c.y,tipo:c.tipo,direccion:c.direccion,disparos:[],mira:c.mira,radio:c.radio}
                for(i=0;i<c.disparos.length;i++){   
                    c.disparos[i].muevete(); // disparos vs tiempo
                    if (c.disparos[i]) c.disparos[i].colisiona(k);// disparos vs jugador
                    for(b=0;b<this.bloques.length;b++){  // bloques vs disparos 
                        if (c.disparos[i]) if (this.bloques[b].colisiona(c.disparos[i])) c.disparos[i].destruyete();
                    }
                    if (c.disparos[i]) m.disparos.push({id:c.disparos[i].id,x:c.disparos[i].x,y:c.disparos[i].y,r:c.disparos[i].radio})// m[3].push([c.disparos[i].x,c.disparos[i].y,c.disparos[i].radio])//,c.disparos[i].direccion,c.disparos[i].v])
                }
                this.cambios.push(m)*/
            }
        }
    };
    enviaCambios(){
        for(let k=0;k<this.jugadores.length;k++){
            /*mensaje=[
                [jugador.x,jugador.y,[direcion.x,direcion.y],[
                        [j.disparo.x,j.disparo.y,[j.disparos.dir.x,j.d.dir.y],j.d.velocidad]
                    ],  [...]
                ],...,[...]
            ]*/
            if (this.jugadores[k].jugador){
                var msjStats={x:this.jugadores[k].jugador.x,y:this.jugadores[k].jugador.y ,vida:[this.jugadores[k].jugador.vida,this.jugadores[k].jugador.vidaMax]}
                this.jugadores[k].send(JSON.stringify({tipo:'estatus',msj:msjStats}),(error)=>{})
                var msjAreas= this.areas.map((x)=>{return {p:x.p,tipo:x.tipo,x:x.x,y:x.y}})
                this.jugadores[k].send(JSON.stringify({tipo:'areas',msj:msjAreas}),(error)=>{})
            }
            this.jugadores[k].send(JSON.stringify({tipo:'cData',msj:this.cambios,k:k}),(error)=>{})
        }
    }
}
//module.exports=scene;