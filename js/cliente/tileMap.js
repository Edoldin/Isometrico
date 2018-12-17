class TileMap extends PIXI.Container{
    constructor(celdas,tilePx){
        super()
        if (app.isometrico)this.scale.x*=Math.SQRT1_2;
        this.tilePx=tilePx
        this.loadedTiles={}
        this.zIndex=-1;
        this.posiciones=[]
        this.Textureloader(['c1'])
        const {x,y}=celdas
        this.cargaPosiciones(x,y)
        this.cargaSprites()
        this.limit=false

        app.stage.addChild(this)
        pixiCam.isometricRendering(this);
    }
    actualizaLimite(){
        this.limit=new Shape.rectIncl() // parámetros?
    }
    cargaPosiciones(n,m){
        this.lx=n;
        this.ly=m;
        for(var k=0;k<n;k++){
            this.posiciones[k]=[]
            for(var j=0;j<m;j++){
                this.posiciones[k][j]='c1'
            }
        }
    }
    cargaSprites(){
        for(var n=0;n<this.posiciones.length;n++){
            for(var m=0;m<this.posiciones[n].length;m++){
                let casilla=new PIXI.Sprite(this.loadedTiles[this.posiciones[n][m]]);
                this.addTile(casilla,n,m)
            }
        }
        pixiCam.isometricRendering(this.stage)
    }
    addTile(casilla,n,m,z=0){
        this.posiciones[n][m]=casilla;
        this.addChild(casilla);
        const {x,y,zi}=this.calcPosicion(n,m,z)
        casilla.zIndex=zi;
        casilla.x=x;
        casilla.y=y;
    }
    calcPosicion(n,m,z=0){
        n=n-z;m=m-z
        const x=(n+m)*this.tilePx/2
        const y=(-n+m)*this.tilePx/4
        const zi=-n+m
        return {x:x,y:y,z:zi}
    }
    Textureloader(array){
        for(let k=0;k<array.length;k++){
            this.loadedTiles[array[k]]=PIXI.Texture.fromImage(this.TILES[array[k]]);
        }
    }
    centroAbsCasilla(n,m){
        m=m+1;
        let {x,y}=this.position;
        x+=(n+m)*this.tilePx/2
        if (app.isometrico) x=x*Math.SQRT1_2;
        y+=(-n+m)*this.tilePx/4;
        return {x:x,y:y}
    }
}
TileMap.prototype.TILES={
    'c1':'src/Clay/clay_iso_tile_256_01.png',
    'c2':'src/Clay/clay_iso_tile_256_02.png',
    'c3':'src/Clay/clay_iso_tile_256_03.png',
    'c4':'src/Clay/clay_iso_tile_256_04.png',
    'c5':'src/Clay/clay_iso_tile_256_05.png',
    'c6':'src/Clay/clay_iso_tile_256_06.png',
    'cR1':'clay_iso_tile_road_256_01.png',
    'cR2':'clay_iso_tile_road_256_02.png',
    'cR3':'clay_iso_tile_road_256_03.png',
    'cR4':'clay_iso_tile_road_256_04.png',
    'cR5':'clay_iso_tile_road_256_05.png',
    'cR6':'clay_iso_tile_road_256_06.png',
    'cR7':'clay_iso_tile_road_256_07.png',
    'cR8':'clay_iso_tile_road_256_08.png',
    'cR9':'clay_iso_tile_road_256_09.png',
    'cR10':'clay_iso_tile_road_256_10.png',
    'cR11':'clay_iso_tile_road_256_11.png',
    'cR12':'clay_iso_tile_road_256_12.png',
    'cR13':'clay_iso_tile_road_256_13.png',
    'cR14':'clay_iso_tile_road_256_14.png',
    'cW1':'clay_iso_tile_water_256_1.png',
    'cW2':'clay_iso_tile_water_256_2.png',
    'cW3':'clay_iso_tile_water_256_3.png',
    'cW4':'clay_iso_tile_water_256_4.png',
    'cW5':'clay_iso_tile_water_256_5.png',
    'cW6':'clay_iso_tile_water_256_6.png',
    'cW7':'clay_iso_tile_water_256_7.png',
    'cW8':'clay_iso_tile_water_256_8.png',
    'cW9':'clay_iso_tile_water_256_9.png',
    'cW10':'clay_iso_tile_water_256_10.png',
}