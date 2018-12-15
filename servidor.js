var http=require('http');
const fs= require('fs');
var path=require('path');

const hostname = '127.0.0.1';//'83.59.176.135'; //'127.0.0.1';
const portHttp = 5001
/*const Punto=require('./mates/punto.js')

const Jugador=require('./clases/jugador.js')
const Disparo=require('./clases/disparo.js')
const Item=require('./clases/items.js')
const Scene=require('./clases/scene.js')
const Shape=require('./clases/shapes.js')*/


var servidorHttp=http.createServer(function (solicitud,respuesta){
    console.log(solicitud.url)
    if (solicitud.url == '/')        solicitud.url = '/juegoPixi.html';
    var filePath = '.' + solicitud.url;
    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        //'.gif': 'image/gif',
        //'.wav': 'audio/wav',
        //'.mp4': 'video/mp4',
        //'.woff': 'application/font-woff',
        //'.ttf': 'application/font-ttf',
        //'.eot': 'application/vnd.ms-fontobject',
        //'.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };
    contentType = mimeTypes[extname] || 'application/octet-stream';
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    respuesta.writeHead(200, { 'Content-Type': contentType });
                    respuesta.end(content, 'utf-8');
                });
            }
            else {
                respuesta.writeHead(500);
                respuesta.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                respuesta.end();
            }
        }
        else {
            respuesta.writeHead(200, { 'Content-Type': contentType });
            respuesta.end(content, 'utf-8');
        }
    });
});
servidorHttp.listen(portHttp);
console.warn('Http listen on port '+portHttp)
//var scene=new Scene()
// Servidor ws
/*var WebSocketServer = require('ws').Server;
var servidorWs= new WebSocketServer({'server': servidorHttp});// servidorHttp
console.warn('WebSocket listen on servidorHttp')

servidorWs.on("connection",function (ws){
    console.warn('conexion')
    scene.jugadores.push(ws);
    ws.on('message',function(mensaje){
        ejecutaMensaje(ws,JSON.parse(mensaje));
    });
    ws.on('close',function(client){
        scene.jugadores.splice(jugadores.indexOf(ws), 1);
        console.warn("cliente "+" desconectado");
    });

    ws.on('error',function(client){
        scene.jugadores.splice(jugadores.indexOf(ws), 1);
        console.warn("cliente "+" desconectado");
    });
});*/
/*function ejecutaMensaje(ws,msj){
    if (msj.tipo=='init'){  //works
        if (!ws.jugador){
        new Jugador(0,0,5,100,10,ws)
        console.log('new Jugador')
        scene.enviaMundo(ws)
        }
    }
    if(msj.tipo=='direccion'){ //works
        if(ws.jugador){
            ws.jugador.setDireccion(msj.msj)
        }
    }
    if(msj.tipo=='mensaje'){
        console.log(msj.msj)
        if(ws.jugador){
            new Mensaje(ws.jugador,msj.msj)
        }
    }
    if(msj.tipo=='disparo'){
        if (ws.jugador){
            var v=Punto.normaliza(msj.msj)
            Disparo.tiposDisparo[msj.msj.tipod].efecto(ws,[v.x,v.y]);
        }
    }
}
// ws.send(JSON.stringify({topic:'handshake', data:'sdf487rgiuh7'}));
/*var tiempo=setInterval(function(){
    var mensaje=[];
    for(k=0;k<jugadores.length;k++){ // jugadores
        if(jugadores[k].jugador){
            var c=jugadores[k].jugador
            c.muevete();
            for(b=0;b<bloques.length;b++){  // bloques vs jugador 
                var d=bloques[b].colisiona(c)
                if (d) c.bloque(bloques[b],d) 
            }
            for(a=0;a<areas.length;a++){  // areas vs jugador 
                //if (areas[a].in(jugadores[k].jugador.x,jugadores[k].jugador.y)) console.log(tiposAreas[areas[a].tipo].name) //funciona
                if(tiposAreas[areas[a].tipo].colision) areas[a].colisiona(c)
            }
            //var m=[c.x,c.y,c.direccion,[],c.radio]
            var m={id:c.id,x:c.x,y:c.y,tipo:c.tipo,direccion:c.direccion,disparos:[],mira:c.mira,radio:c.radio}
            for(i=0;i<c.disparos.length;i++){   
                c.disparos[i].muevete(); // disparos vs tiempo 
                if (c.disparos[i]) c.disparos[i].colisiona(k);// disparos vs jugador

                for(b=0;b<bloques.length;b++){  // bloques vs disparos 
                    if (c.disparos[i]) if (bloques[b].colisiona(c.disparos[i])) c.disparos[i].destruyete();
                }
                if (c.disparos[i]) m.disparos.push({id:c.disparos[i].id,x:c.disparos[i].x,y:c.disparos[i].y,r:c.disparos[i].radio})// m[3].push([c.disparos[i].x,c.disparos[i].y,c.disparos[i].radio])//,c.disparos[i].direccion,c.disparos[i].v])
            }
            mensaje.push(m)
        }
    }
    for(k=0;k<jugadores.length;k++){
        /*mensaje=[
            [jugador.x,jugador.y,[direcion.x,direcion.y],[
                    [j.disparo.x,j.disparo.y,[j.disparos.dir.x,j.d.dir.y],j.d.velocidad]
                ],  [...]
            ],...,[...]
        ]*/
        /*if (jugadores[k].jugador){
            var msjStats={x:jugadores[k].jugador.x,y:jugadores[k].jugador.y ,vida:[jugadores[k].jugador.vida,jugadores[k].jugador.vidaMax]}
            jugadores[k].send(JSON.stringify({tipo:'estatus',msj:msjStats}),(error)=>{})
            var msjAreas= areas.map((x)=>{return {p:x.p,tipo:x.tipo,x:x.x,y:x.y}})
            jugadores[k].send(JSON.stringify({tipo:'areas',msj:msjAreas}),(error)=>{})
        }
        jugadores[k].send(JSON.stringify({tipo:'cData',msj:mensaje,k:k}),(error)=>{})
    }
}, 1000/60)/*


/*var jugadores=[];
var bloques=[];
var areas=[];
var ids={j:0, b:0, d:0,npc:0,a:0,m:0}*/
/*var mensajes=[];

function Mensaje(padre,srt,alcance){
    var o=this;
    o.id='m '+ids.m; ids.m++;
    o.padre=padre
    o.msj=srt;
    o.vida=60*5
    o.alcance=alcance||5000
    o.date=Date.now();
    padre.msjEnv.push(o)
}   
    Mensaje.prototype.in=function(x,y){
        var o=this
        if(o.x-o.alcance>x || o.x+o.alcance<x) return false;
        if(o.y-o.alcance>y || o.y+o.alcance<y) return false;
        return true
    }
scene.items.push(new Item(new Shape.rect(100,100,50,500),0))
scene.items.push(new Item(new Shape.rect(-400,600,500,50),1))
scene.items.push(new Item(new Shape.rect(-800,-200,50,50),1))
scene.items.push(new Item(new Shape.rect(-800,200,50,50),0))
scene.items.push(new Item(new Shape.rect(-600,-200,50,50),1))
scene.items.push(new Item(new Shape.rect(-600,200,50,50),0))
scene.items.push(new Item(new Shape.rect(-400,-200,50,50),1))
scene.items.push(new Item(new Shape.rect(-400,200,50,50),0))
scene.items.push(new Item(new Shape.rect(-100,-500,100,200),1))
scene.items.push(new Item(new Shape.rect(100,-500,100,200),1))
scene.items.push(new Item(new Shape.rect(300,300,200,200),1))
scene.items.push(new Item(new Shape.rect(-1000,-700,400,200),1))
scene.items.push(new Item(new Shape.rect(-1000,-1200,200,400),1))
/*var areapuntos=[
    {x:0,y:1000},
    {x:1000,y:0},
    {x:0,y:-1000},
    {x:-1/*
var areapuntos=[];
for(k=0;k<6;k++){
    areapuntos.push({x:Math.sin(Math.PI*k/3)*1000,y:Math.cos(Math.PI*k/3)*1000})
}
var areapuntos2=areapuntos.map(function(i){return {x:i.x+2000,y:i.y}})
var areapuntos3=areapuntos.map(function(i){return {x:i.x,y:i.y+2000}})
var areapuntos4=areapuntos.map(function(i){return {x:i.x,y:i.y-2000}})
var areapuntos5=areapuntos.map(function(i){return {x:i.x-2000,y:i.y}})
var areapuntos6=areapuntos.map(function(i){return {x:(i.x+2000)/4,y:(i.y-2000)/4}})
scene.areas.push(new Area(areapuntos,0))
scene.areas.push(new Area(areapuntos2,1))
scene.areas.push(new Area(areapuntos3,2))
scene.areas.push(new Area(areapuntos4,3))
scene.areas.push(new Area(areapuntos5,4))
var asdadsa=new Area(areapuntos6,5)
new Bloque(asdadsa.x-10,asdadsa.y-10,10,10,1)
for(k=0;k<6;k++){
    for(i=0;i<6;i++){
        scene.items.push(new Bloque(0+150*i,-1000-150*k-10,50,50,1))
    }
}*/
//scene.addTiempo()