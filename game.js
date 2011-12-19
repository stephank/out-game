var require=function(a,b){var c=require.resolve(a,b||"/"),d=require.modules[c];if(!d)throw new Error("Failed to resolve module "+a+", tried "+c);var e=d._cached?d._cached:d();return e};require.paths=[],require.modules={},require.extensions=[".js",".coffee"],require._core={assert:!0,events:!0,fs:!0,path:!0,vm:!0},require.resolve=function(){return function(a,b){function g(a){if(require.modules[a])return a;for(var b=0;b<require.extensions.length;b++){var c=require.extensions[b];if(require.modules[a+c])return a+c}}function h(a){a=a.replace(/\/+$/,"");var b=a+"/package.json";if(require.modules[b]){var d=require.modules[b](),e=d.browserify;if(typeof e=="object"&&e.main){var f=g(c.resolve(a,e.main));if(f)return f}else if(typeof e=="string"){var f=g(c.resolve(a,e));if(f)return f}else if(d.main){var f=g(c.resolve(a,d.main));if(f)return f}}return g(a+"/index")}function i(a,b){var c=j(b);for(var d=0;d<c.length;d++){var e=c[d],f=g(e+"/"+a);if(f)return f;var i=h(e+"/"+a);if(i)return i}var f=g(a);if(f)return f}function j(a){var b;a==="/"?b=[""]:b=c.normalize(a).split("/");var d=[];for(var e=b.length-1;e>=0;e--){if(b[e]==="node_modules")continue;var f=b.slice(0,e+1).join("/")+"/node_modules";d.push(f)}return d}b||(b="/");if(require._core[a])return a;var c=require.modules.path(),d=b||".";if(a.match(/^(?:\.\.?\/|\/)/)){var e=g(c.resolve(d,a))||h(c.resolve(d,a));if(e)return e}var f=i(a,d);if(f)return f;throw new Error("Cannot find module '"+a+"'")}}(),require.alias=function(a,b){var c=require.modules.path(),d=null;try{d=require.resolve(a+"/package.json","/")}catch(e){d=require.resolve(a,"/")}var f=c.dirname(d),g=Object_keys(require.modules);for(var h=0;h<g.length;h++){var i=g[h];if(i.slice(0,f.length+1)===f+"/"){var j=i.slice(f.length);require.modules[b+j]=require.modules[f+j]}else i===f&&(require.modules[b]=require.modules[f])}},require.define=function(a,b){var c=require._core[a]?"":require.modules.path().dirname(a),d=function(a){return require(a,c)};d.resolve=function(a){return require.resolve(a,c)},d.modules=require.modules,d.define=require.define;var e={exports:{}};require.modules[a]=function(){return require.modules[a]._cached=e.exports,b.call(e.exports,d,e,e.exports,c,a),require.modules[a]._cached=e.exports,e.exports}};var Object_keys=Object.keys||function(a){var b=[];for(var c in a)b.push(c);return b};typeof process=="undefined"&&(process={}),process.nextTick||(process.nextTick=function(a){setTimeout(a,0)}),process.title||(process.title="browser"),process.binding||(process.binding=function(a){if(a==="evals")return require("vm");throw new Error("No such module")}),process.cwd||(process.cwd=function(){return"."}),require.define("path",function(a,b,c,d,e){function f(a,b){var c=[];for(var d=0;d<a.length;d++)b(a[d],d,a)&&c.push(a[d]);return c}function g(a,b){var c=0;for(var d=a.length;d>=0;d--){var e=a[d];e=="."?a.splice(d,1):e===".."?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}var h=/^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;c.resolve=function(){var a="",b=!1;for(var c=arguments.length;c>=-1&&!b;c--){var d=c>=0?arguments[c]:process.cwd();if(typeof d!="string"||!d)continue;a=d+"/"+a,b=d.charAt(0)==="/"}return a=g(f(a.split("/"),function(a){return!!a}),!b).join("/"),(b?"/":"")+a||"."},c.normalize=function(a){var b=a.charAt(0)==="/",c=a.slice(-1)==="/";return a=g(f(a.split("/"),function(a){return!!a}),!b).join("/"),!a&&!b&&(a="."),a&&c&&(a+="/"),(b?"/":"")+a},c.join=function(){var a=Array.prototype.slice.call(arguments,0);return c.normalize(f(a,function(a,b){return a&&typeof a=="string"}).join("/"))},c.dirname=function(a){var b=h.exec(a)[1]||"",c=!1;return b?b.length===1||c&&b.length<=3&&b.charAt(1)===":"?b:b.substring(0,b.length-1):"."},c.basename=function(a,b){var c=h.exec(a)[2]||"";return b&&c.substr(-1*b.length)===b&&(c=c.substr(0,c.length-b.length)),c},c.extname=function(a){return h.exec(a)[3]||""}}),require.define("/package.json",function(a,b,c,d,e){b.exports={}}),require.define("/game.coffee",function(a,b,c,d,e){((function(){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t=Array.prototype.slice;e=Math.PI,h=e*2;if(!window.requestAnimationFrame){s=["moz","webkit","ms","o"];for(q=0,r=s.length;q<r;q++){o=s[q];if(window[""+o+"RequestAnimationFrame"]){window.requestAnimationFrame=window[""+o+"RequestAnimationFrame"],window.cancelRequestAnimationFrame=window[""+o+"CancelRequestAnimationFrame"];break}}}j=function(a){var b,c,d,e,f,g,h,i,j,k,l,m;return a==null&&(a={}),a.id!=null?(h=j=0,g=100,e=75,d=document.getElementById(a.id),i=d.width/100,k=d.height/75):(m=(l=a.area)!=null?l:[0,0,100,75],h=m[0],j=m[1],g=m[2],e=m[3],i=n.xScale,k=n.yScale,d=document.createElement("canvas"),d.width=Math.ceil(g*i),d.height=Math.ceil(e*k)),c=d.getContext("2d"),c.translate(.5,.5),c.scale(i,k),f=function(a,b){return c.restore(),c.save(),h=a,j=b,c.translate(-h,-j)},c.save(),f(h,j),b=function(a){return a.context.drawImage(d,h,j,g,e)},{element:d,context:c,xScale:i,yScale:k,reposition:f,blend:b}},n=j({id:"game"}),i=document.getElementsByTagName("body")[0],i.appendChild(n.element),m=a("./levels"),p=window.state={},c=function(){function a(a,b,c,d){var e;this.w=c,this.h=d,this.xScale=n.xScale,this.yScale=n.yScale,this.reposition(a,b),this.stride=Math.ceil(c*this.xScale/8),e=Math.ceil(d*this.yScale),this.bitmap=new Uint8Array(this.stride*e)}return a.prototype.reposition=function(a,b){return this.x=a,this.y=b,this.ex=this.x+this.w,this.ey=this.y+this.h},a.prototype.mapPixel=function(a,b){var c,d;return d=b*this.stride+Math.floor(a/8),c=1<<a%8,{idx:d,bit:c}},a.prototype.map=function(a,b){return a<this.x||b<this.y||a>this.ex||this.y>this.ey?{idx:-1,bit:-1}:(a=Math.round((a-this.x)*this.xScale),b=Math.round((b-this.y)*this.yScale),this.mapPixel(a,b))},a.prototype.getPixel=function(a,b){var c,d,e;return e=this.mapPixel(a,b),d=e.idx,c=e.bit,!!(this.bitmap[d]&c)},a.prototype.get=function(a,b){var c,d,e;return e=this.map(a,b),d=e.idx,c=e.bit,d!==-1&&!!(this.bitmap[d]&c)},a.prototype.setPixel=function(a,b){var c,d,e;return e=this.mapPixel(a,b),d=e.idx,c=e.bit,this.bitmap[d]|=c},a.prototype.set=function(a,b){var c,d,e;e=this.map(a,b),d=e.idx,c=e.bit;if(d!==-1)return this.bitmap[d]|=c},a.prototype.unsetPixel=function(a,b){var c,d,e;return e=this.mapPixel(a,b),d=e.idx,c=e.bit,this.bitmap[d]&=~c},a.prototype.unset=function(a,b){var c,d,e;e=this.map(a,b),d=e.idx,c=e.bit;if(d!==-1)return this.bitmap[d]&=~c},a.prototype.putImageData=function(a,b){var c,d,e,f,g,h,i,j,k,l;f=a.data,j=a.width,h=a.height;for(l=0;0<=h?l<h:l>h;0<=h?l++:l--)for(k=0;0<=j?k<j:k>j;0<=j?k++:k--)e=(l*j+k)*4,i=f[e+0],g=f[e+1],d=f[e+2],c=f[e+3],b(i,g,d,c)?this.setPixel(k,l):this.unsetPixel(k,l)},a}(),f=function(){function i(a){this.x=a[0],this.y=a[1],this.movement={x:0,y:0},this.actionResult=null}var a,b,c,d,e,f,g;return f=.7,e=[1,2,4,8],g=.3,d=Math.sqrt(g*g/2),c=function(){var b;b=[];for(a=0;a<360;a+=20)b.push({x:Math.sin(a)*f,y:Math.cos(a)*f});return b}(),b=function(a,b,d){var e,f,g,h,i;for(h=0,i=c.length;h<i;h++){e=c[h],f=a+e.x,g=b+e.y;if(d.get(f,g))return!0}return!1},i.prototype.move=function(){var a,c,f,h,i,j,k,l,m,n,o;a=g,o=this.movement,i=o.x,j=o.y,i!==0&&j!==0&&(a=d),p.tutorial===1&&i>0&&(p.tutorial=2);if(i!==0)for(k=0,m=e.length;k<m;k++){c=e[k],f=this.x+i*(a/c);if(!b(f,this.y,p.level.collisionMap)){this.x=f;break}}if(j!==0)for(l=0,n=e.length;l<n;l++){c=e[l],h=this.y+j*(a/c);if(!b(this.x,h,p.level.collisionMap)){this.y=h;break}}return this.actionResult=this.determineAction()},i.prototype.testSentries=function(){var a,c,d,e,f,g,h;d=!1,h=p.sentries;for(f=0,g=h.length;f<g;f++){e=h[f];if(!!e.disabled)continue;e.hostile=!1,a=e.x-this.x,c=e.y-this.y;if(Math.sqrt(a*a+c*c)>e.radius)continue;b(this.x,this.y,e.getVisibilityMap())&&(d=e.hostile=!0)}return d},i.prototype.determineAction=function(){var b,c,d,e,f,g,h,i=this;d=null,e=[],h=p.charges;for(f=0,g=h.length;f<g;f++)b=h[f],b.triggered||(b.placed?e.push(b):d=b);if(d){c={edge:null,dist:Infinity},p.level.eachEdgeNear(this.x,this.y,2,function(d,e){var f,g,h,j,k,l,m,n;j=d.v1,k=d.v2,f=d.n;if(e>=c.dist)return;h={x:i.x+f.x*e,y:i.y+f.y*e};if(Math.abs(j.x-h.x)<.5&&Math.abs(j.y-h.y)<.5)return;if(Math.abs(k.x-h.x)<.5&&Math.abs(k.y-h.y)<.5)return;n=p.charges;for(l=0,m=n.length;l<m;l++){g=n[l];if(b.placed&&Math.abs(g.x-h.x)<2&&Math.abs(g.y-h.y)<2)return}return a=Math.atan2(i.y-h.y,i.x-h.x),c={p:h,a:a,dist:e}});if(c.dist<2)return p.tutorial===2&&p.sentries[0].x-this.x<5&&(p.tutorial=3),["place",d,c.p,c.a]}return e.length>0?["trigger",e]:null},i.prototype.action=function(){var b,c,d,e,f,g,h,i,j,k,l,m,n;if(!this.actionResult)return!1;g=this.actionResult[0];switch(g){case"place":l=this.actionResult,g=l[0],b=l[1],e=l[2],a=l[3],b.place(e,a),p.tutorial===3&&(p.tutorial=4);break;case"trigger":m=this.actionResult,g=m[0],c=m[1];for(h=0,j=c.length;h<j;h++)b=c[h],b.trigger();d=!1,n=p.sentries;for(i=0,k=n.length;i<k;i++)f=n[i],f.disabled||(f.hostile=!0,d=!0);p.counter=0,p.fsm=d?"fail":"win";break;default:return!1}return this.actionResult=this.determineAction(),!0},i.prototype.draw=function(){var a;return a=n.context,a.lineWidth=.2,a.fillStyle="#fa3",a.strokeStyle="#eee",a.beginPath(),a.arc(this.x,this.y,f,0,h),a.fill(),a.stroke()},i}(),b=function(){function f(){this.placed=!1,this.triggered=!1}var a,b,c,d;return a=12,c=e/40,d=c*2,b=d/30,f.prototype.place=function(a,b){return this.x=a.x,this.y=a.y,this.placed=!0,this.faceStart=b-e/2,this.faceEnd=b+e/2,this.rot=0},f.prototype.trigger=function(){var b,c,d,e,f,g,h;h=p.sentries;for(f=0,g=h.length;f<g;f++){e=h[f];if(!e.disabled)b=e.x-this.x,c=e.y-this.y,d=Math.sqrt(b*b+c*c),d<a&&(e.disabled=!0);else continue}return this.placed=!1,this.triggered=!0},f.prototype.drawEffectArea=function(){var e,f,g;if(!this.placed)return;g=n.context,g.strokeStyle="#c60",g.lineWidth=.3;for(f=0;0<=h?f<=h:f>=h;f+=d)e=f+this.rot,g.beginPath(),g.arc(this.x,this.y,a,e,e+c),g.stroke();return this.rot=(this.rot+b)%d},f.prototype.drawBody=function(){var a;if(!this.placed)return;return a=n.context,a.fillStyle="#fff",a.beginPath(),a.moveTo(this.x,this.y),a.arc(this.x,this.y,.4,this.faceStart,this.faceEnd),a.fill()},f}(),g=function(){function a(a,b){var d,f,g,h,i,k;this.instructions=b,this.x=a.x,this.y=a.y,this.look=((f=a.look)!=null?f:0)*e/180,this.radius=(g=a.radius)!=null?g:15,this.moveSpeed=(h=a.moveSpeed)!=null?h:.18,this.turnSpeed=(i=a.turnSpeed)!=null?i:.07,this.halfFov=((k=a.fov)!=null?k:90)*e/360,this.disabled=!1,this.sightStyle="#ff0",d=this.radius*2,this.drawbuf=j({area:[0,0,d,d]}),this.vismap=new c(0,0,d,d),this.updatePos(),this.updateFov(),this.ip=0,this.state="next",this.targetX=this.targetY=this.targetLook=this.waitRemaining=null}return a.prototype.updatePos=function(){var a,b;return a=this.x-this.radius,b=this.y-this.radius,this.drawbuf.reposition(a,b),this.vismap.reposition(a,b)},a.prototype.updateFov=function(){return this.fovStart=this.look-this.halfFov,this.fovEnd=this.look+this.halfFov},a.prototype.move=function(){var a,b,c,d,f,g;if(this.disabled||this.instructions.length===0)return;if(this.state==="next"){g=this.instructions[this.ip],this.state=g[0],a=2<=g.length?t.call(g,1):[],this.ip=(this.ip+1)%this.instructions.length;switch(this.state){case"move":this.targetX=a[0],this.targetY=a[1];break;case"turn":this.targetLook=a[0]*e/180;break;case"wait":this.waitRemaining=a[0]}}switch(this.state){case"move":return c=this.targetX-this.x,d=this.targetY-this.y,b=Math.sqrt(c*c+d*d),Math.abs(b)<this.moveSpeed?(this.x=this.targetX,this.y=this.targetY,this.state="next"):(f=this.moveSpeed/b,this.x+=c*f,this.y+=d*f),this.updatePos();case"wait":this.waitRemaining--;if(this.waitRemaining===0)return this.state="next";break;case"turn":return this.turnTo(this.targetLook)}},a.prototype.homeOnPlayer=function(){var a,b,c;return(c=this.targetFov)==null&&(this.targetFov=this.halfFov/2),a=this.targetFov-this.halfFov,this.halfFov+=a*.2,b=p.player,this.turnTo(Math.atan2(b.y-this.y,b.x-this.x))},a.prototype.turnTo=function(a){var b,c;return b=a-this.look,b>e&&(b-=h),b<-e&&(b+=h),Math.abs(b)<this.turnSpeed?(this.look=a,this.state="next"):(c=this.turnSpeed,b<0&&(c*=-1),this.look=(this.look+c)%h),this.updateFov()},a.prototype.fillDrawbuf=function(a){var b;return b=this.drawbuf.context,b.clearRect(0,0,100,75),b.globalCompositeOperation="source-over",p.level.drawOcclusion(this.x,this.y,b,{maxDist:this.radius}),b.globalCompositeOperation="source-out",b.fillStyle=a,b.beginPath(),b.moveTo(this.x,this.y),b.arc(this.x,this.y,this.radius,this.fovStart,this.fovEnd),b.fill()},a.prototype.drawVisibility=function(){if(this.disabled)return;return this.fillDrawbuf("#433"),this.drawbuf.blend(n)},a.prototype.drawBody=function(){var a;a=n.context,a.lineWidth=.2,a.fillStyle="#666",a.strokeStyle="#999",a.beginPath(),a.arc(this.x,this.y,.8,0,h),a.fill(),a.stroke();if(this.disabled)return;return a.strokeStyle=this.sightStyle,a.beginPath(),a.arc(this.x,this.y,.8,this.fovStart,this.fovEnd),a.stroke()},a.prototype.getVisibilityMap=function(){var a,b,c,d;return this.fillDrawbuf("#fff"),d=this.drawbuf.element,c=d.width,b=d.height,a=this.drawbuf.context.getImageData(0,0,c,b),this.vismap.putImageData(a,function(a,b,c,d){return d>128}),this.vismap},a}(),d=function(){function a(a){var b,c,d,e,f,g,h,i,j,k,l;this.walls=function(){var m,n,o,p;p=[];for(m=0,n=a.length;m<n;m++)o=a[m],g=o[0],b=2<=o.length?t.call(o,1):[],b=function(){var a,c,e;c=[];for(d=0,a=b.length,e=2;d<a;d+=e)k=b[d],l=b[d+1],c.push({x:k,y:l});return c}(),c=function(){var a,c;c=[];for(d=0,a=b.length;d<a;d++){i=b[d];if(b.length-d<2){if(g==="flat")break;j=b[0]}else j=b[d+1];h={x:j.x-i.x,y:j.y-i.y},e=Math.sqrt(h.x*h.x+h.y*h.y),f={x:-h.y/e,y:h.x/e},c.push({v1:i,v2:j,v:h,length:e,n:f})}return c}(),p.push({type:g,coords:b,edges:c});return p}(),this.collisionMap=this.buildCollisionMap()}return a.prototype.buildCollisionMap=function(){var a,b,d,e,f,g,h,i,k,l,m,n,o,p,q,r,s,t;d=j(),b=d.context,b.lineWidth=.3,b.strokeStyle="#000",b.fillStyle="#000",b.fillRect(0,0,100,75),q=this.walls;for(n=0,o=q.length;n<o;n++){r=q[n],i=r.type,e=r.coords,b.beginPath();for(h=0,p=e.length;h<p;h++)s=e[h],l=s.x,m=s.y,h===0?b.moveTo(l,m):b.lineTo(l,m);switch(i){case"hollow":b.closePath(),b.fillStyle="#fff",b.fill();break;case"solid":b.closePath(),b.fillStyle="#000",b.fill()}b.stroke()}return t=d.element,k=t.width,g=t.height,f=b.getImageData(0,0,k,g),a=new c(0,0,100,75),a.putImageData(f,function(a,b,c,d){return a<128}),a},a.prototype.drawBase=function(){var a,b,c,d,e,f,g,h,i,j,k,l;a=n.context,j=this.walls;for(g=0,h=j.length;g<h;g++){k=j[g],d=k.type,b=k.coords;if(d==="flat")continue;a.beginPath();for(c=0,i=b.length;c<i;c++)l=b[c],e=l.x,f=l.y,c===0?a.moveTo(e,f):a.lineTo(e,f);a.closePath(),a.fillStyle=function(){switch(d){case"hollow":return"#300";case"solid":return"#000"}}(),a.fill()}},a.prototype.drawWalls=function(){var a,b,c,d,e,f,g,h,i,j,k,l;a=n.context,a.lineWidth=.3,a.strokeStyle="#b44",a.beginPath(),j=this.walls;for(g=0,h=j.length;g<h;g++){k=j[g],d=k.type,b=k.coords;for(c=0,i=b.length;c<i;c++)l=b[c],e=l.x,f=l.y,c===0?a.moveTo(e,f):a.lineTo(e,f);d!=="flat"&&a.closePath()}return a.stroke()},a.prototype.eachEdgeNear=function(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r;q=this.walls;for(m=0,o=q.length;m<o;m++){l=q[m],r=l.edges;for(n=0,p=r.length;n<p;n++){f=r[n],i=f.v,j=f.v1,k=f.v2,g=f.n;if(Math.min(j.x,k.x)-a>c)continue;if(Math.min(j.y,k.y)-b>c)continue;if(a-Math.max(j.x,k.x)>c)continue;if(b-Math.max(j.y,k.y)>c)continue;h={x:j.x-a,y:j.y-b},e=g.x*h.x+g.y*h.y,Math.abs(e)<=c&&d(f,e)}}},a.prototype.drawOcclusion=function(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;d==null&&(d={}),h=(n=d.maxDist)!=null?n:null,c.fillStyle="#000",g=function(c){var d,e,f,g,h;return e=c.x-a,f=c.y-b,d=Math.sqrt(e*e+f*f),g=e/d,h=f/d,{x:c.x+g*1e4,y:c.y+h*1e4}},e=function(a){var b,d,e,f;return b=a.v1,d=a.v2,e=g(d),f=g(b),c.beginPath(),c.moveTo(b.x,b.y),c.lineTo(d.x,d.y),c.lineTo(e.x,e.y),c.lineTo(f.x,f.y),c.closePath(),c.fill()};if(d.maxDist!=null)this.eachEdgeNear(a,b,d.maxDist,e);else{o=this.walls;for(j=0,l=o.length;j<l;j++){i=o[j],p=i.edges;for(k=0,m=p.length;k<m;k++)f=p[k],e(f)}}},a}(),k={initialize:function(){var a=this;return this.up=this.down=this.left=this.right=this.action=0,document.onkeydown=function(b){return a.keyDown(b)},document.onkeyup=function(b){return a.keyUp(b)}},keyDown:function(a){switch(a.keyCode){case 37:this.left=-1;break;case 38:this.up=-1;break;case 39:this.right=1;break;case 40:this.down=1;break;case 32:this.action===0&&(this.action=1)}return this.updateMovement()},keyUp:function(a){switch(a.keyCode){case 37:this.left=0;break;case 38:this.up=0;break;case 39:this.right=0;break;case 40:this.down=0;break;case 32:this.action=0}return this.updateMovement()},updateMovement:function(){var a;return(a=p.player)!=null?a.movement={x:this.left+this.right,y:this.up+this.down}:void 0},dequeue:function(){if(this.action!==1)return;this.action=2;switch(p.fsm){case"title":return p.title.dismiss();case"play":return p.player.action()}}},l=window.gameLoop={interval:null,initialize:function(){return p.fsm="title",p.counter=0,this.initialize=function(){}},start:function(){var a=this;if(this.interval)return;return this.initialize(),this.interval=setInterval(function(){return a.tick()},25)},stop:function(){return this.interval&&clearInterval(this.interval),this.frameRequest&&typeof cancelRequestAnimationFrame=="function"&&cancelRequestAnimationFrame(this.frameRequest),this.interval=this.frameRequest=null},loadLevel:function(a){var c,e,h,i;return p.levelIdx=a,e=m[a],p.title=e.title,p.tutorial=e.tutorial||0,p.level=new d(e.walls),p.player=new f(e.start),p.charges=function(){var a,d;d=[];for(c=0,a=e.charges;0<=a?c<a:c>a;0<=a?c++:c--)d.push(new b);return d}(),p.sentries=function(){var a,b,c,d,f;c=e.sentries,f=[];for(a=0,b=c.length;a<b;a++)d=c[a],h=d[0],i=2<=d.length?t.call(d,1):[],f.push(new g(h,i));return f}(),p.fsm="levelZoom",p.counter=1},reloadLevel:function(){return this.loadLevel(p.levelIdx)},nextLevel:function(){var a;return a=p.levelIdx+1,m[a]?this.loadLevel(a):(p.fsm="end",p.counter=0)},tick:function(){var a,b,c,d,e,f,g,h,i=this;switch(p.fsm){case"title":p.counter++,p.counter===100&&this.loadLevel(0);break;case"play":p.player.move(),g=p.sentries;for(c=0,e=g.length;c<e;c++)a=g[c],a.move();p.player.testSentries()?(p.fsm="fail",p.counter=0):k.dequeue();break;case"fail":b=p.counter%10>5?"#ff0":"#f00",h=p.sentries;for(d=0,f=h.length;d<f;d++){a=h[d];if(!a.hostile)continue;a.homeOnPlayer(),a.sightStyle=b}p.counter++,p.counter===100&&this.reloadLevel();break;case"win":p.counter++,p.counter===100&&this.nextLevel()}return window.requestAnimationFrame?this.frameRequest||(this.frameRequest=requestAnimationFrame(function(){return i.frame()})):this.frame()},frame:function(){var a,b,c,d,e,f;this.frameRequest=null,b=n.context,b.clearRect(0,0,100,75);switch(p.fsm){case"title":return b.fillStyle="#fff",b.font="bold italic 12px monospace",b.textAlign="center",b.textBaseline="middle",b.fillText("out",50,37.5),b.globalCompositeOperation="source-atop",f=p.counter*1.7-30,c=b.createLinearGradient(f,0,f+30,30),c.addColorStop(0,"#000"),c.addColorStop(.49,"#ccc"),c.addColorStop(.5,"#777"),c.addColorStop(1,"#000"),b.fillStyle=c,b.fillRect(0,0,100,75),b.globalCompositeOperation="source-over";case"levelZoom":p.counter=p.counter/6*5,e=1-p.counter,d=p.counter/2,b.save(),b.translate(d*100,d*75),b.scale(e,e),b.globalAlpha=e,this.drawLevel(),b.restore();if(p.counter<.01)return p.fsm="play",k.initialize();break;case"play":return this.drawLevel();case"fail":return this.drawLevel();case"win":return a=(100-Math.max(60,p.counter))/40,b.globalAlpha=a,this.drawLevel(),a=Math.min(10,p.counter)/10,a===1&&(a=(100-Math.max(80,p.counter))/20),b.globalAlpha=a,b.fillStyle="#fff",b.font="bold italic 12px monospace",b.textAlign="center",b.textBaseline="middle",b.fillText("cleared!!",50,37.5),b.globalAlpha=1;case"end":return b.fillStyle="#fff",b.font="bold italic 12px monospace",b.textAlign="center",b.textBaseline="middle",b.fillText("fin",50,37.5)}},drawLevel:function(){var a,b,c,d,e,f,g,h,i,j,k;p.level.drawBase(),i=p.sentries;for(c=0,f=i.length;c<f;c++)b=i[c],b.drawVisibility();j=p.charges;for(d=0,g=j.length;d<g;d++)a=j[d],a.drawEffectArea(),a.drawBody();p.player.draw(),k=p.sentries;for(e=0,h=k.length;e<h;e++)b=k[e],b.drawBody();return p.level.drawWalls(),this.drawHud()},drawHud:function(){var a,b,c,d,e,f,g;c=0,g=p.charges;for(e=0,f=g.length;e<f;e++)b=g[e],!b.placed&&!b.triggered&&c++;a=n.context,a.fillStyle="#ccc",a.font="bold 2px monospace",a.textBaseline="top",a.textAlign="left",a.fillText("level: "+(p.levelIdx+1),2,2),a.textAlign="right",a.fillText("charges: "+c,98,2),a.textAlign="center",a.fillText(p.title,50,2),a.textBaseline="bottom",p.tutorial&&(d=function(){switch(p.tutorial){case 1:return"Move to the right using the arrow keys";case 2:return"Keep moving right, up to the wall behind the sentry";case 3:return"Press the spacebar to deploy an EMP charge here";case 4:return"Press the spacebar again to trigger the charge";case 5:return"Place multiple charges, trigger once to destroy both sentries"}}(),d&&a.fillText(d,50,70)),d=function(){var b,c;switch((b=p.player)!=null?(c=b.actionResult)!=null?c[0]:void 0:void 0){case"place":return"place charge";case"trigger":return a.fillStyle="#f80","trigger charges"}}();if(d)return a.fillText("[space] = "+d,50,73)}},l.start()})).call(this)}),require.define("/levels/index.coffee",function(a,b,c,d,e){b.exports=[a("./level1"),a("./level2"),a("./level3")]}),require.define("/levels/level1.coffee",function(a,b,c,d,e){b.exports={title:"tutorial",tutorial:1,start:[23,35],walls:[["hollow",80,28,20,28,20,42,80,42],["flat",50,31,50,39]],sentries:[[{x:52,y:35,look:0}]],charges:1}}),require.define("/levels/level2.coffee",function(a,b,c,d,e){b.exports={title:"warming up",tutorial:5,start:[23,35],walls:[["hollow",80,25,20,25,20,45,80,45],["flat",50,25,50,30],["flat",50,40,50,45]],sentries:[[{x:52,y:27,look:45,fov:60}],[{x:52,y:43,look:315,fov:60}]],charges:2}}),require.define("/levels/level3.coffee",function(a,b,c,d,e){b.exports={title:"let's see some footwork",start:[18,36],walls:[["hollow",72,16,28,16,28,31,15,31,15,41,28,41,28,58,72,58],["flat",38,25,38,49],["flat",62,25,62,49],["solid",43,23,43,51,57,51,57,23]],sentries:[[{x:33,y:22,look:90},["move",33,52],["turn",0],["wait",50],["turn",270],["move",33,22],["turn",0],["wait",50],["turn",90]],[{x:67,y:52,look:270},["move",67,22],["turn",180],["wait",50],["turn",90],["move",67,52],["turn",180],["wait",50],["turn",270]]],charges:2}})