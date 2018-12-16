var Shape={
    point: class {
        constructor(x,y){
            this.x=x;
            this.y=y;
        }
        plus(p){
            return new Shape.point(this.x+p.x,this.y+p.y)
        }
        rest(p){
            return new Shape.point(this.x-p.x,this.y-p.y)
        }
        neg(){
            return new Shape.point(-this.x,-this.y)
        }
        scale(x,y=x){
            return new Shape.point(this.x*x,this.y*y)
        }
        norm2(){
            return this.x*this.x+this.y*this.y
        }
        norm(){
            return Math.sqrt(this.x*this.x+this.y*this.y)
        }
        angle(){
            return Math.atan2(this.y,this.x)
        }
        rotate(angle,c={x:0,y:0}){
            const c=Math.cos(angle);
            const s=Math.sin(angle);
            const x=this.x-c.x;
            const y=this.y-c.y;
            return new Shape.point(x*c-y*s+c.x,y*c+x*s+c.y)
        }
        copy(){return new Shape.point(this.x,this.y)}

        static sum(...puntos){
            var x=puntos[0].x;
            var y=puntos[0].y;
            for (let k=1;k<puntos.length;k++){
                x=x+puntos[k].x;
                y=y+puntos[k].y;
            }
            return new Shape.point(x,y)
        }
        static copy(p){return new Shape.point(p.x,p.y)}
        static vector(p1,p2){
            return new Shape.point(p2.x-p1.x,p2.y-p1.y)
        }
        static distancia(p1,p2){
            const v=Shape.point.vector(p1,p2);
            return v.norm()
        }
        static vNormalizado(p1,p2){
            const v=Shape.point.vector(p1,p2)
            const d=v.norm()
            return v.scale(1/d)
        }
    },
    rect:class {
        constructor(x,y,w,h){
            this.type='rect';
            this.x=x;
            this.y=y;
            this.w=w;
            this.h=h;
            this.pivot=new Shape.point(x,y)
        }
        center(){
            return new Shape.point(this.x+this.w/2,this.y+this.h/2);
        }
        copy(){
            return new Shape.rect(this.x,this.y,this.w,this.h)
        }
        move(p){
            this.x=this.x+p.x;
            this.y=this.y+p.y;
            return true
        }
        moveTo(p){
            this.x=p.x-this.x+this.pivot.x;
            this.y=p.y-this.y+this.pivot.y;
        }
        scale(p){
            this.w*=p.x;
            this.h*=p.y;
            this.x+=(this.x-this.pivot.x)*p.x
            this.y+=(this.y-this.pivot.y)*p.y
        }
        pointIn(p){
            if(p.x<this.x || p.x>this.x+this.w) return false;
            if(p.y<this.y || p.y>this.y+this.h) return false;
            return true
        }
    },
    rectIncl:class {
        constructor(x,y,w,h,angle){
            this.type='rect2';
            this.x=x;            this.y=y;
            this.w=w;            this.h=h;
            this.angle=angle;
            this.cosAngle=Math.cos(angle);
            this.sinAngle=Math.sin(angle);
        }
        center(){
            const x=this.x+this.cosAngle*this.w/2;
            const y=this.x+this.sinAngle*this.h/2;
            return new Shape.point(x,y);
        }
        move(p){
            this.x=this.x+p.x;
            this.y=this.y+p.y;
            return true
        }
        moveTo(p){
            this.x=p.x-this.x+this.pivot.x;
            this.y=p.y-this.y+this.pivot.y;
        }
        scale(p){
            this.w*=p.x;
            this.h*=p.y;
            this.x+=(this.x-this.pivot.x)*p.x
            this.y+=(this.y-this.pivot.y)*p.y
        }
        pointIn(p){
            const x1=p.x-this.x;
            const y1=p.y-this.y;
            const x2=x1*this.cosAngle-y1*this.sinAngle+this.x;
            const y2=y1*this.cosAngle+x1*this.sinAngle+this.y;
            if(x2<this.x || x2>this.x+this.w) return false;
            if(y2<this.y || y2>this.y+this.h) return false;
            return true
        }
    }
    ,
    regularPolygon:class{
        constructor(cx,cy,n,radio,desfase=0){
            this.type='rpolygon';
            this.x=cx;                                      //centro del polígono
            this.y=cy;                                      //centro del polígono
            this.n=n;                                       //número de vértices
            this.maxR=radio                                 //distancia a los vértices
            this.desfase=desfase;                           //Angulo del primer vértice en radianes
            this.angle=2*Math.PI/n;                         //Angulo entre vértices
            this.minR=radio*Math.abs(Math.cos(2*Math.PI))   //distancia a los lados
            this.points=null;                               //puntos del polígono coordenadas absolutas del polígono
        }
        scale(s,bol=false){
            this.maxR*=s;
            this.minR*=s;
            if(bol)this.calcPoints();
        }
        moveTo(p){
            this.x=p.x-this.x;
            this.y=p.y-this.y;
        }
        calcPoints(){
            this.points=[];
            var desfase=this.desfase;
            for(let k=0;k<this.n;k++){
                const point=new Shape.point(Math.cos(desfase)*this.r,Math.sin(desfase)*this.r).plus(this)
                this.points.push(point);
                desfase+=this.angle;
            }
        }
        pointIn(p){
            const v=Shape.point.vector(this,p);
            const d=v.norm();
            if (d>this.maxR) return false
            if (d<this.minR) return true
            const angle=Math.abs((v.angle()-this.desfase)%this.angle-this.angle/2);
            const dist=Math.sqrt(this.minR*this.minR+Math.pow(Math.sin(angle),2));
            if (dist<d) return false
            else return true
        }
    }
    ,
    polygon:class {
        constructor(points){
            this.type='polygon';
            this.points=points;
            this.limitSquare=this.calcLimitSquare()
        }
        calcLimitSquare(){
            var r=[points[0].x,points[0].x,points[0].y,points[0].y]
            for(k=1;k<points.length;k++){
                if(points[k].x<r[0]) r[0]=points[k].x
                if(points[k].x>r[1]) r[1]=points[k].x
                if(points[k].y<r[2]) r[2]=points[k].y
                if(points[k].y>r[3]) r[3]=points[k].y
            }
            return new Shape.rect(r[0],r[2],r[1]-r[0],r[3]-r[2])
        }
        add(p,k){
            this.points.splice(k,0,p);
            if(this.limitSquare.x>p.x) this.limitSquare.x=p.x
            if(this.limitSquare.y>p.y) this.limitSquare.y=p.y
            if(this.limitSquare.x+this.limitSquare.w<p.x) this.limitSquare.w=-p.x+this.limitSquare.x
            if(this.limitSquare.y+this.limitSquare.h<p.y) this.limitSquare.h=-p.y+this.limitSquare.y
        }
        convexTest(){
            if(this.points.length<4) return true
            var p=this.points
            var difs={x:[Math.sign(p[p.length].x-p[0].x)],y:[Math.sign(p[p.length].y-p[0].y)],c:0};
            for (k=0;k<this.points.length;k++){
                difs.x.push(Math.sign(p[k].x-p[(k+1)%p.length].x));
                if (difs.x[k]!=difs.x[(k+1)%p.length]) difs.c++
                difs.y.push(Math.sign(p[k].y-p[(k+1)%p.length].y));
                if (difs.y[k]!=difs.y[(k+1)%p.length]) difs.c++
            }
            if(difs.c<=4) return true;
            return false
        }
        pointIn(p){// it has to be a convex polygon
            if(this.limitSquare.pointIn(p)){
                var inside = false;
                var points=this.points
                for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
                    var xi = points[i].x, yi = points[i].y;
                    var xj = points[j].x, yj = points[j].y;
        
                    var intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
                return inside;
            }return false;
        }
        move(p){
            for(k=0;k<this.points.length;k++){
                this.points[k].x+=p.x;
                this.points[k].y+=p.y;
            }
            this.limitSquare.move(p)
        }
    },
    circle:class {
        constructor(x,y,r){
            this.type='circle';
            this.x=x;
            this.y=y;
            this.r=r;
        }
        copy(){
            return new Shape.circle(this.x,this.y,this.r)
        }
        string(){
            return JSON.stringify(this)
        }
        move(p){
            p.r=p.r||0;
            this.x+=p.x;
            this.y+=p.y;
            this.r+=p.r;
        }
        moveTo(p){
            this.x=p.x;
            this.y=p.y;
        }
        scale(p){
            this.r*=(p.x+p.y)/2
        }
        pointIn(p){
            const dx=this.x-p.x
            const dy=this.y-p.y
            if(dx>this.r || dy>this.r)return false
            if (this.r*this.r>dx*dx+dy*dy) return true
            return false
        }
    },
    d:{//detecta interseccion y retorna true o false si intersecan o no (funciona)
        rectVSrect:function(r1,r2){
            if(r1.x+r1.w<r2.x || r1.x>r2.x+r2.w) return false;
            if(r1.y+r1.h<r2.y || r1.y>r2.y+r2.h) return false;
            return true;
        },
        rectVScircle:function(r,c,slow=false){
            if(r.x>c.x+c.r || r.x+r.w<c.x-c.r) return false;
            if(r.y>c.y+c.r || r.y+r.h<c.y-c.r) return false;
            if (slow){
                if (r.x>c.x && r.y>c.y){
                    const v={x:r.x-c.x,y:r.y-c.y}
                    const dist2=v.x*v.x+v.y*v.y
                    if (dist2>c.r*c.r) return false
                    else     return true
                }// esquina inferior izquierda
                if (r.x>c.x && r.y+r.h<c.y){
                    const v={x:r.x-c.x,y:r.y+r.h-c.y}
                    const dist2=v.x*v.x+v.y*v.y
                    if (dist2>c.r*c.r) return false
                    else     return true
                }// esquina superior izquierda
                if (r.x+r.w<c.x && r.y>c.y){
                    const v={x:r.x+r.w-c.x,y:r.y-c.y}
                    const dist2=v.x*v.x+v.y*v.y
                    if (dist2>c.r*c.r) return false
                    else     return true
                }// esquina inferior derecha
                if (r.x+r.w<c.x && r.y+r.h<c.y){
                    const v={x:r.x+r.w-c.x,y:r.y+r.h-c.y}
                    const dist2=v.x*v.x+v.y*v.y
                    if (dist2>c.r*c.r) return false
                    else     return true
                }// esquina superior derecha*/
                return {tipo:'bloquePared'}
            }
            return true
        },
        circleVSrect:function(c,r,slow=false){
            return Shape.d.rectVScircle(r,c,slow)
        },
        circleVScircle:function(c1,c2){
            var r=c1.r+c2.r;
            var v={x:c2.x-c1.x,y:c2.y-c1.y}
            if(v.x>r || vy >r) return false
            var dist2=(v.x*v.x+v.y*v.y)
            if(dist2>r*r) return false
            return true
        }
    },
    interseccion:{
        cVSc:function(c1,c2){
            const r=c1.r+c2.r;
            const v=Shape.point.vector(c1,c2)
            if(v.x>r || v.y>r) return false
            const dist=v.norm()
            if(dist>r) return false
            const interseccion=(r-dist)/r;
            const direccion=v.scale(1/dist)
            return [interseccion,direccion]
        },
    }
    ,
    rigidBodies:{
        circleINrect:function(c1,r1){
            let rect2=new Shape.rect(r1.x-c1.r,r1.y-c1.r,r1.w-c1.r,r1.h-c1.r);
            if (rect2.pointIn(c1))  return false;
            else{
                //if()
            }

        },
        circleVScircle:function(c1,c2,p1,p2){
            const i=Shape.interseccion.cVSc(c1,c2)
            if (i!=false){
                pC1={x:-i[1].x*i[0]*c1.r,  y:-i[1].y*i[0]*c1.r}
                pC2={x:i[1].x*i[0]*c2.r,  y:i[1].y*i[0]*c2.r}
                return [pC1,pC2]
            }return false
        },
        rectVSrect:function(r1,r2){
            if(r1.x+r1.w<r2.x || r1.x>r2.x+r2.w) return false;
            if(r1.y+r1.h<r2.y || r1.y>r2.y+r2.h) return false;
            return true;
        }
    },
    m:{// modifica dejará a la primera de las figuras como inmutable y moverá la segunda a la posición más próxima que no se intersequen
        //r vs c
        //c vs r
        circleVScircle:function(c1,c2){//funciona
            const r=c1.r+c2.r;
            const v={x:c2.x-c1.x,y:c2.y-c1.y}
            if(v.x>r || v.y>r) return false
            const dist=Math.sqrt(v.x*v.x+v.y*v.y)
            if(dist<r){
                const vNorm={x:v.x/dist,y:v.y/dist}
                c2.x=c1.x+(vNorm.x)*r;
                c2.y=c1.y+(vNorm.y)*r;
                return true
            }else{
                return false
            }
        },
        rectVSrect:function(r1,r2){
            const v={x:r2.x-r1.x,y:r2.y-r1.y}
            if(r1.x+r1.w<r2.x || r1.x>r2.x+r2.w) return false;
            if(r1.y+r1.h<r2.y || r1.y>r2.y+r2.h) return false;
        },
        circleVSrect:function(c,r){
            const rp={x:r.x+r.w,y:r.y+r.h}
            if(r.x>c.x+c.r || rp.x<c.x-c.r) return false;
            if(r.y>c.y+c.r || rp.y<c.y-c.r) return false;
            let d=[r.x-c.x,c.x-rp.x,r.y-c.y,c.y-rp.y];
            if (d[0]>0){
                if(d[2]>0){// esquina inferior izquierda
                    const v={x:d[0],y:d[2]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        r.x=r.x+v.x/dist*(c.r-dist)
                        r.y=r.y+v.y/dist*(c.r-dist)
                        return true
                    }
                }
                if(d[3]>0){// esquina superior izquierda
                    const v={x:d[0],y:-d[3]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        r.x=r.x+v.x/dist*(c.r-dist)
                        r.y=r.y+v.y/dist*(c.r-dist)
                        return true
                    }
                }
                //lado izquierdo
                r.x=c.x+c.r
                return true
            }
            if (d[1]>0){
                if(d[2]>0){// esquina inferior derecha
                    const v={x:-d[1],y:d[2]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        r.x=r.x+v.x/dist*(c.r-dist)
                        r.y=r.y+v.y/dist*(c.r-dist)
                        return true
                    }
                }
                if(d[3]>0){// esquina superior derecha
                    const v={x:-d[1],y:-d[3]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        r.x=r.x+v.x/dist*(c.r-dist)
                        r.y=r.y+v.y/dist*(c.r-dist)
                        return true
                    }
                }
                //lado derecho
                r.x=c.x-c.r-r.w
                return true

            }
            if(d[2]>0){//lado inferior
                r.y=c.y+c.r
                return true
            }
            if(d[3]>0){//lado superior
                r.y=c.y-c.r-r.w
                return true
            }
        },
        rectVScircle:function(r,c){
            const rp={x:r.x+r.w,y:r.y+r.h}
            if(r.x>c.x+c.r || rp.x<c.x-c.r) return false;
            if(r.y>c.y+c.r || rp.y<c.y-c.r) return false;
            let d=[r.x-c.x,c.x-rp.x,r.y-c.y,c.y-rp.y];
            if (d[0]>0){
                if(d[2]>0){// esquina inferior izquierda
                    const v={x:d[0],y:d[2]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        c.x=r.x+v.x/dist*c.r
                        c.y=r.y+v.y/dist*c.r
                        return true
                    }
                }
                if(d[3]>0){// esquina superior izquierda
                    const v={x:d[0],y:-d[3]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        c.x=r.x+v.x/dist*c.r
                        c.y=rp.y+v.y/dist*c.r
                        return true
                    }
                }
                //lado izquierdo
                c.x=r.x-c.r
                return true
            }
            if (d[1]>0){
                if(d[2]>0){// esquina inferior derecha
                    const v={x:-d[1],y:d[2]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        c.x=rp.x+v.x/dist*c.r
                        c.y=r.y+v.y/dist*c.r
                        return true
                    }
                }
                if(d[3]>0){// esquina superior derecha
                    const v={x:-d[1],y:-d[3]}
                    const dist=Math.sqrt(v.x*v.x+v.y*v.y);
                    if (dist>c.r) return false
                    else{
                        c.x=rp.x+v.x/dist*c.r
                        c.y=rp.y+v.y/dist*c.r
                        return true
                    }
                }
                //lado derecho
                c.x=r.x+c.r+r.w
                return true
            }
            if(d[2]>0){//lado inferior
                c.y=r.y-c.r
                return true
            }
            if(d[3]>0){//lado superior
                c.y=r.y+c.r+r.w
                return true
            }
        }
    }
}