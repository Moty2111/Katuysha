// Global one-click audio unlock
var _userGestured=false;
(function(){
  document.addEventListener('click',function _g(){
    document.removeEventListener('click',_g);
    _userGestured=true;
  },{once:true});
})();

// ===== GIFT BOX =====
if(document.getElementById('giftBox')){(function(){
  var gb=document.getElementById('gb');
  var gbWrap=document.getElementById('giftBox');
  var opened=false;

  // Show roses and init music box
  var gbRose=document.getElementById('gbRose');
  if(gbRose&&!gbRose.children.length){
    gbRose.innerHTML='<div class="rose" style="transform:scale(.6)"><div class="r-gl"></div><div class="r-p r0"></div><div class="r-p r1"></div><div class="r-p r2"></div><div class="r-p r3"></div><div class="r-p r4"></div><div class="r-sep"></div><div class="r-sep"></div></div>';
    gbRose.classList.add('show');
  }
  var srL=document.getElementById('sideRoseL');
  var srR=document.getElementById('sideRoseR');
  if(srL)srL.classList.add('show');
  if(srR)srR.classList.add('show');
  gbWrap.classList.add('show');
  initMusic();

  gb.addEventListener('click',function(e){
    if(opened)return;
    opened=true;
    document.getElementById('musicBox').classList.remove('gb-hint');
    var ctrl=document.getElementById('mbCtrl');
    if(ctrl)ctrl.classList.remove('show');
    var r=this.getBoundingClientRect();
    var cx=r.left+r.width/2,cy=r.top+r.height/2;
    var isTouch='ontouchstart' in window;
    (function tryPlay(){
      if(!window._audioEl)return;
      var p=window._audioEl.play();
      if(p&&p.then){
        p.then(function(){
          var mbP=document.getElementById('mbPlayBtn');
          if(mbP)mbP.textContent='⏸';
          if(window._audioEl.volume<0.4){
            (function fade(){
              var v=window._audioEl.volume;
              if(v<0.5){window._audioEl.volume=Math.min(v+0.05,0.5);setTimeout(fade,120)}
            })();
          }
        }).catch(function(){});
      }else{
        var mbP=document.getElementById('mbPlayBtn');
        if(mbP)mbP.textContent='⏸';
      }
    })();
    // Wobble
    this.classList.add('wobble');
    // Flash
    var flash=document.createElement('div');
    flash.style.cssText='position:fixed;inset:0;z-index:9998;background:radial-gradient(circle at '+cx+'px '+cy+'px,rgba(255,248,230,.6),transparent 50%);opacity:0;pointer-events:none;transition:opacity .25s';
    document.body.appendChild(flash);
    requestAnimationFrame(function(){flash.style.opacity='1'});
    setTimeout(function(){flash.style.opacity='0';setTimeout(function(){if(flash.parentNode)flash.remove()},300)},350);
    // Open
    var self=this;
    setTimeout(function(){
      self.classList.remove('wobble');
      self.classList.add('open');
      // Side roses sway (desktop only)
      if(!isTouch){
        var srL=document.getElementById('sideRoseL');
        var srR=document.getElementById('sideRoseR');
        if(srL){srL.style.transition='transform .8s ease-out';srL.style.transform='scale(1.04) rotate(-1deg)';setTimeout(function(){srL.style.transform='scale(1)'},800)}
        if(srR){srR.style.transition='transform .8s ease-out';srR.style.transform='scale(1.04) rotate(1deg)';setTimeout(function(){srR.style.transform='scale(1)'},800)}
        // Butterflies scatter
        var bflies=document.querySelectorAll('.bfly');
        for(var bi=0;bi<bflies.length;bi++){
          (function(b){
            setTimeout(function(){
              b.style.transition='opacity .6s,transform .7s cubic-bezier(.34,1.56,.64,1)';
              b.style.opacity='0';
              b.style.transform='scale(.3) translateY(-'+(50+Math.random()*60)+'px) rotate('+(10+Math.random()*20)+'deg)';
            },200+bi*100);
          })(bflies[bi]);
        }
        // Confetti burst
        if(typeof burstConfetti==='function')burstConfetti(cx,cy-20,40);
      }
    },850);
    // Navigation
    var navDelay=isTouch?1200:1800;
    setTimeout(function(){
      if(!isTouch&&typeof burstConfetti==='function')burstConfetti(cx,cy-20,30);
      window.navigateTo('inside.html');
    },navDelay);
  });
})();}

// ===== MUSIC BOX CLICK ON GIFT BOX SCREEN =====
(function(){
  var ctrl=document.getElementById('mbCtrl');
  var closeBtn=document.getElementById('mbCtrlClose');
  var musicBox=document.getElementById('musicBox');
  if(!ctrl||!musicBox)return;
  if(closeBtn){
    closeBtn.addEventListener('click',function(e){
      e.stopPropagation();
      ctrl.classList.remove('show');
    });
  }
  var giftBox=document.getElementById('giftBox');
  document.addEventListener('click',function(e){
    if(!giftBox||!giftBox.classList.contains('show'))return;
    if(ctrl.classList.contains('show')&&
      !e.target.closest('#mbCtrl')&&
      !e.target.closest('#musicBox')){
      ctrl.classList.remove('show');
    }
  });
})();

// ===== BALLOONS =====
if(document.getElementById('balloonArea')){(function(){
  var area=document.getElementById('balloonArea');
  if(!area)return;
  var colors=['#e8a0b4','#c45a6c','#d4a56a','#f0c0c8','#d4a0c0'];
  var zones=[{l:5,w:17},{l:23,w:17},{l:41,w:17},{l:59,w:17},{l:77,w:17}];
  for(var i=0;i<5;i++){
    (function(idx){
      var b=document.createElement('div');
      b.className='balloon';
      var sz=55+Math.floor(Math.random()*25);
      var cl=colors[idx];
      var z=zones[idx];
      var left=z.l+Math.random()*z.w;
      var heights=[180,80,140,50,110];
      var bottom=heights[idx]+Math.floor(Math.random()*25);
      var delay=Math.random()*3;
      var dur=9+Math.random()*6;
      var anames=['float1','float2','float3'];
      var anim=anames[idx%3];
      b.style.cssText='width:'+sz+'px;height:'+(sz*1.12)+'px;left:'+left+'%;bottom:'+bottom+'px;animation:'+anim+' '+dur+'s ease-in-out infinite;animation-delay:'+delay+'s';
      var strDel=Math.random()*4;
b.innerHTML='<div class="balloon-body" style="animation:wobble '+(6+Math.random()*3)+'s ease-in-out infinite;animation-delay:'+(Math.random()*4)+'s;background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.3),'+cl+')"><div class="balloon-shine"></div></div><div class="balloon-str" style="animation-delay:'+strDel+'s"></div>';
      b.addEventListener('click',function(e){
        if(b.classList.contains('out'))return;
        b.classList.add('out');
        var rect=b.getBoundingClientRect();
        burstConfetti(rect.left+rect.width/2,rect.top+rect.height/2,25);
        setTimeout(function(){if(b.parentNode){b.style.display='none'}},400);
      });
      area.appendChild(b);
    })(i);
  }
})();}
(function(){
  var s=document.createElement('style');
  s.textContent='@keyframes float1{0%{transform:translateY(0) translateX(0) rotate(0)}12%{transform:translateY(-8px) translateX(4px) rotate(1deg)}25%{transform:translateY(-16px) translateX(9px) rotate(2deg)}37%{transform:translateY(-20px) translateX(5px) rotate(1.5deg)}50%{transform:translateY(-12px) translateX(-3px) rotate(-1deg)}62%{transform:translateY(-21px) translateX(-7px) rotate(-1.8deg)}75%{transform:translateY(-15px) translateX(3px) rotate(.8deg)}87%{transform:translateY(-23px) translateX(6px) rotate(1.2deg)}100%{transform:translateY(-3px) translateX(0) rotate(0)}}@keyframes float2{0%{transform:translateY(0) translateX(0) rotate(0)}14%{transform:translateY(-12px) translateX(-4px) rotate(-1deg)}28%{transform:translateY(-6px) translateX(9px) rotate(2deg)}42%{transform:translateY(-18px) translateX(-6px) rotate(-1.5deg)}56%{transform:translateY(-10px) translateX(5px) rotate(1deg)}70%{transform:translateY(-22px) translateX(-2px) rotate(-.5deg)}84%{transform:translateY(-14px) translateX(7px) rotate(1.5deg)}100%{transform:translateY(-4px) translateX(0) rotate(0)}}@keyframes float3{0%{transform:translateY(0) translateX(0) rotate(0)}10%{transform:translateY(-6px) translateX(5px) rotate(1.2deg)}22%{transform:translateY(-18px) translateX(-4px) rotate(-1.5deg)}35%{transform:translateY(-10px) translateX(9px) rotate(2.5deg)}48%{transform:translateY(-22px) translateX(-5px) rotate(-1.2deg)}60%{transform:translateY(-14px) translateX(6px) rotate(1.5deg)}73%{transform:translateY(-25px) translateX(-7px) rotate(-1.8deg)}86%{transform:translateY(-8px) translateX(3px) rotate(.6deg)}100%{transform:translateY(-2px) translateX(0) rotate(0)}}@keyframes wobble{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(1.015) scaleY(.985)}60%{transform:scaleX(.988) scaleY(1.012)}}';
  document.head.appendChild(s);
})();

// ===== BIG CANDLE =====

// ===== THREE.JS 3D CAKE =====
(function(){
  var canvas=document.getElementById('cake3d');
  if(!canvas||typeof THREE==='undefined')return;
  var parent=canvas.parentElement;
  var cdEl=document.getElementById('candleCount');
  function resize(){canvas.width=parent.offsetWidth;canvas.height=Math.max(parent.offsetHeight,300)}
  resize();
  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(30,canvas.width/canvas.height,.1,100);
  cam.position.set(0,1.8,4.8);cam.lookAt(0,.7,0);
  var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setSize(canvas.width,canvas.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.2;

  // Lights
  var amb=new THREE.AmbientLight(0xffeef0,.35);
  scene.add(amb);
  var dl=new THREE.DirectionalLight(0xffeedd,1.3);
  dl.position.set(3,8,5);dl.castShadow=true;
  dl.shadow.mapSize.width=512;dl.shadow.mapSize.height=512;
  scene.add(dl);
  var dl2=new THREE.DirectionalLight(0xddd5ff,.45);
  dl2.position.set(-4,3,-6);scene.add(dl2);
  var rim=new THREE.DirectionalLight(0xffeeee,.4);
  rim.position.set(-2,1,7);scene.add(rim);
  var back=new THREE.DirectionalLight(0xffddcc,.2);
  back.position.set(0,-1,-5);scene.add(back);

  // Floor shadow circle
  var shadowMat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.06,depthWrite:false});
  var shadow=new THREE.Mesh(new THREE.CircleGeometry(2.6,32),shadowMat);
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-.08;
  scene.add(shadow);

  var cakeGroup=new THREE.Group();
  scene.add(cakeGroup);

  function M(c,r,me,em,ei){return new THREE.MeshStandardMaterial({color:c,roughness:r||.5,metalness:me||0,emissive:em||0,emissiveIntensity:ei||0})}

  // Plate - elegant
  var plateMat=M(0xf5ede8,.7,.05);
  var plate=new THREE.Mesh(new THREE.CylinderGeometry(2.5,.15,.1,48),plateMat);
  plate.position.y=-.05;plate.receiveShadow=true;
  cakeGroup.add(plate);
  var plateRim=new THREE.Mesh(new THREE.TorusGeometry(2.5,.025,8,48),plateMat);
  plateRim.position.y=-.01;plateRim.rotation.x=Math.PI/2;
  cakeGroup.add(plateRim);
  var plateBase=new THREE.Mesh(new THREE.CylinderGeometry(.55,.65,.04,24),M(0xe8ddd5,.8,.05));
  plateBase.position.y=-.1;cakeGroup.add(plateBase);

  // Vertical stripe decorations on tiers
  var stripeMat=M(0xfceae8,.5,.05);
  function addStripes(tierY,tierH,tierR,count,width){
    for(var s=0;s<count;s++){
      var sa=s/count*Math.PI*2;
      var strip=new THREE.Mesh(new THREE.BoxGeometry(width,tierH*.8,.02),stripeMat);
      strip.position.set(Math.cos(sa)*tierR,tierY,Math.sin(sa)*tierR);
      cakeGroup.add(strip);
    }
  }
  function addFlower(x,y,z,col,s){
    for(var fp=0;fp<5;fp++){
      var fa=fp/5*Math.PI*2;
      var p=new THREE.Mesh(new THREE.SphereGeometry(.028*s,5,5),M(col,.5,.05));
      p.position.set(x+Math.cos(fa)*.045*s,y,z+Math.sin(fa)*.045*s);
      p.scale.set(1.6,.4,1.1);cakeGroup.add(p);
    }
    var c=new THREE.Mesh(new THREE.SphereGeometry(.014*s,5,5),M(0xffdd44,.4,.05));
    c.position.set(x,y+.004,z);cakeGroup.add(c);
  }

  // Tier 3 (bottom) - strawberry pink with white decorations
  var t3=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.4,.35,32),M(0xe8b8c0,.35,.02));
  t3.position.y=.12;t3.castShadow=true;t3.receiveShadow=true;
  cakeGroup.add(t3);
  // Pearl border top of tier 3
  for(var p3=0;p3<20;p3++){
    var pa3=p3/20*Math.PI*2;
    var pearl=new THREE.Mesh(new THREE.SphereGeometry(.03,5,5),M(0xf8ece8,.3,.1));
    pearl.position.set(Math.cos(pa3)*1.35,.28,Math.sin(pa3)*1.35);
    cakeGroup.add(pearl);
  }
  // Pearl border bottom
  for(var pb3=0;pb3<16;pb3++){
    var pba3=pb3/16*Math.PI*2;
    var pbl=new THREE.Mesh(new THREE.SphereGeometry(.022,5,5),M(0xf8ece8,.3,.1));
    pbl.position.set(Math.cos(pba3)*1.38,.01,Math.sin(pba3)*1.38);
    cakeGroup.add(pbl);
  }
  // Frosting drips
  for(var d3=0;d3<28;d3++){
    var a3=d3/28*Math.PI*2,r3=1.28;
    var drip=new THREE.Mesh(new THREE.SphereGeometry(.04,5,5),M(0xfceae8,.6,0));
    drip.position.set(Math.cos(a3)*r3,.25+Math.random()*.08,Math.sin(a3)*r3);
    drip.scale.set(1,.5+Math.random()*.5,1);
    cakeGroup.add(drip);
  }
  // Cream top layer
  var ice3=new THREE.Mesh(new THREE.CylinderGeometry(1.42,.45,.06,32),M(0xfceae8,.65,0));
  ice3.position.y=.28;cakeGroup.add(ice3);
  // Flowers on tier 3
  var f3cols=[0xffb0b8,0xffa0c0,0xdda0dd,0xffb8a0,0xffc0c8];
  for(var f3=0;f3<12;f3++){
    var fa3=(f3/12)*Math.PI*2;
    addFlower(Math.cos(fa3)*1.18,.31,Math.sin(fa3)*1.18,f3cols[f3%5],.85);
  }
  for(var f3i=0;f3i<8;f3i++){
    var fa3i=(f3i/8+0.06)*Math.PI*2;
    addFlower(Math.cos(fa3i)*.8,.31,Math.sin(fa3i)*.8,f3cols[f3i%5+1],.7);
  }
  for(var f3s=0;f3s<6;f3s++){
    var fa3s=(f3s/6)*Math.PI*2;
    addFlower(Math.cos(fa3s)*1.32,.20,Math.sin(fa3s)*1.32,0xeeb0c0,.6);
  }

  // Cream band between t3-t2
  var cr23=new THREE.Mesh(new THREE.TorusGeometry(1.28,.07,12,32),M(0xfce8e8,.7,0));
  cr23.position.y=.4;cr23.rotation.x=Math.PI/2;
  cakeGroup.add(cr23);

  // Tier 2 - vanilla cream with decorations
  var t2=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.1,.3,32),M(0xf0d8d0,.38,.02));
  t2.position.y=.58;t2.castShadow=true;
  cakeGroup.add(t2);
  // Pearl border tier 2
  for(var p2=0;p2<16;p2++){
    var pa2=p2/16*Math.PI*2;
    var p2m=new THREE.Mesh(new THREE.SphereGeometry(.025,5,5),M(0xf8ece8,.3,.1));
    p2m.position.set(Math.cos(pa2)*1.05,.72,Math.sin(pa2)*1.05);
    cakeGroup.add(p2m);
  }
  // Frosting drips tier 2
  for(var d2=0;d2<22;d2++){
    var a2=d2/22*Math.PI*2,r2=1.0;
    var drip2=new THREE.Mesh(new THREE.SphereGeometry(.032,5,5),M(0xfceae8,.6,0));
    drip2.position.set(Math.cos(a2)*r2,.7+Math.random()*.06,Math.sin(a2)*r2);
    drip2.scale.set(1,.5+Math.random()*.5,1);
    cakeGroup.add(drip2);
  }
  var ice2=new THREE.Mesh(new THREE.CylinderGeometry(1.12,.38,.05,32),M(0xfceae8,.65,0));
  ice2.position.y=.72;cakeGroup.add(ice2);
  // Flowers on tier 2
  var f2cols=[0xffc0c8,0xf0b0d0,0xffb8a0,0xffd0c0,0xe0b8e0];
  for(var f2=0;f2<10;f2++){
    var fa2=(f2/10)*Math.PI*2;
    addFlower(Math.cos(fa2)*.92,.74,Math.sin(fa2)*.92,f2cols[f2%5],.8);
  }
  for(var f2i=0;f2i<6;f2i++){
    var fa2i=(f2i/6+0.06)*Math.PI*2;
    addFlower(Math.cos(fa2i)*.62,.74,Math.sin(fa2i)*.62,f2cols[f2i%5+2],.65);
  }

  // Cream between tiers
  var cr12=new THREE.Mesh(new THREE.TorusGeometry(1.0,.055,10,28),M(0xfce8e8,.7,0));
  cr12.position.y=.82;cr12.rotation.x=Math.PI/2;
  cakeGroup.add(cr12);

  // Tier 1 (top) - chocolate berry
  var t1=new THREE.Mesh(new THREE.CylinderGeometry(.75,.8,.28,32),M(0xc88070,.45,.03));
  t1.position.y=1.0;t1.castShadow=true;
  cakeGroup.add(t1);
  // Pearl border tier 1
  for(var p1=0;p1<12;p1++){
    var pa1=p1/12*Math.PI*2;
    var p1m=new THREE.Mesh(new THREE.SphereGeometry(.02,5,5),M(0xf8ece8,.3,.1));
    p1m.position.set(Math.cos(pa1)*.76,1.13,Math.sin(pa1)*.76);
    cakeGroup.add(p1m);
  }
  // Frosting drips tier 1
  for(var d1=0;d1<16;d1++){
    var a1=d1/16*Math.PI*2,r1=.73;
    var drip1=new THREE.Mesh(new THREE.SphereGeometry(.028,5,5),M(0xfceae8,.6,0));
    drip1.position.set(Math.cos(a1)*r1,1.1+Math.random()*.05,Math.sin(a1)*r1);
    drip1.scale.set(1,.5+Math.random()*.5,1);
    cakeGroup.add(drip1);
  }
  var ice1=new THREE.Mesh(new THREE.CylinderGeometry(.82,.28,.05,32),M(0xfceae8,.65,0));
  ice1.position.y=1.14;cakeGroup.add(ice1);

  // Cream rosettes on top
  for(var ro=0;ro<6;ro++){
    var ra=ro/6*Math.PI*2,rr=.55;
    var ros=new THREE.Mesh(new THREE.SphereGeometry(.045,6,6),M(0xfceae8,.6,0));
    ros.position.set(Math.cos(ra)*rr,1.16,Math.sin(ra)*rr);
    ros.scale.set(2,.5,2);cakeGroup.add(ros);
    var ros2=new THREE.Mesh(new THREE.SphereGeometry(.025,5,5),M(0xf8ddd5,.65,0));
    ros2.position.set(Math.cos(ra)*rr*.9,1.18,Math.sin(ra)*rr*.9);
    cakeGroup.add(ros2);
  }

  // Berries on top
  var berryPositions=[[-.35,1.2,-.25],[.3,1.2,.2],[.05,1.2,-.35],[-.2,1.2,.35],[.4,1.2,-.1]];
  for(var be=0;be<berryPositions.length;be++){
    var bp=berryPositions[be];
    var berryMat=M([0xcc2244,0xbb3355,0xdd3355,0x882244,0xcc2244][be],.3,.05);
    var berry=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),berryMat);
    berry.position.set(bp[0],bp[1],bp[2]);
    berry.scale.set(1,.85,.95);cakeGroup.add(berry);
    // Highlight
    var hl=new THREE.Mesh(new THREE.SphereGeometry(.018,5,5),M(0xffffff,.1,.1));
    hl.position.set(bp[0]+.02,bp[1]+.02,bp[2]+.02);
    cakeGroup.add(hl);
  }

  // Mint leaves
  for(var ml=0;ml<4;ml++){
    var lr=[.35,.45,-.3,-.4][ml],la=[1.15,1.12,1.18,1.15][ml];
    for(var lp=0;lp<2;lp++){
      var leaf=new THREE.Mesh(new THREE.SphereGeometry(.022,5,5),M(0x5a8a4a,.5,.05));
      var lAng=ml*Math.PI/2+lp*.4-.2;
      leaf.position.set(Math.cos(lAng)*lr,la+.01,Math.sin(lAng)*lr);
      leaf.scale.set(2.5,.1,1.2);cakeGroup.add(leaf);
    }
  }

  // Gold decorative band on bottom tier
  for(var gb=0;gb<24;gb++){
    var gba=gb/24*Math.PI*2;
    var gbMesh=new THREE.Mesh(new THREE.SphereGeometry(.018,5,5),M(0xd4a56a,.3,.2));
    gbMesh.position.set(Math.cos(gba)*1.3,.05,Math.sin(gba)*1.3);
    cakeGroup.add(gbMesh);
  }

  // Sprinkles across all tiers
  var spColors=[0xff6b8a,0xffd700,0x7ac0a0,0xd4a0c0,0xffa07a,0xff8c42];
  for(var si=0;si<80;si++){
    var sm=M(spColors[si%6],.6,0);
    var sp=new THREE.Mesh(new THREE.SphereGeometry(.018,5,5),sm);
    var tier=Math.floor(si/27);
    var yOff=[1.16,.74,.3][tier];
    var maxR=[.72,1.0,1.28][tier];
    var a2=Math.random()*Math.PI*2;
    var r=Math.random()*.7*maxR;
    sp.position.set(Math.cos(a2)*r,yOff,Math.sin(a2)*r);
    sp.scale.set(1,.5+Math.random()*.6,1);
    cakeGroup.add(sp);
  }

  // === Decorative patterns on tier sides ===
  var dotCols=[0xffb0b8,0xdda0dd,0xffd700,0xffa07a,0x7ac0a0,0xff6b8a];
  // Tier 3 - scallop border + polka dots
  for(var s3=0;s3<20;s3++){
    var s3a=s3/20*Math.PI*2;
    var s3m=new THREE.Mesh(new THREE.SphereGeometry(.026,5,5),M(0xfceae8,.55,0));
    s3m.position.set(Math.cos(s3a)*1.36,.04+Math.sin(s3*3.2)*.012,Math.sin(s3a)*1.36);
    cakeGroup.add(s3m);
  }
  for(var d3=0;d3<30;d3++){
    var d3a=Math.random()*Math.PI*2;
    var d3y=.06+Math.random()*.18;
    var dot3=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.01,5,5),M(dotCols[d3%6],.5,.05));
    dot3.position.set(Math.cos(d3a)*1.31-Math.random()*.03,d3y,Math.sin(d3a)*1.31-Math.random()*.03);
    dot3.scale.set(1,.3+Math.random()*.3,1);
    cakeGroup.add(dot3);
  }
  // Tier 2 - scallop + polka dots
  for(var s2=0;s2<16;s2++){
    var s2a=s2/16*Math.PI*2;
    var s2m=new THREE.Mesh(new THREE.SphereGeometry(.022,5,5),M(0xfceae8,.55,0));
    s2m.position.set(Math.cos(s2a)*1.08,.43+Math.sin(s2*2.8)*.01,Math.sin(s2a)*1.08);
    cakeGroup.add(s2m);
  }
  for(var d2=0;d2<22;d2++){
    var d2a=Math.random()*Math.PI*2;
    var d2y=.5+Math.random()*.18;
    var dot2=new THREE.Mesh(new THREE.SphereGeometry(.015+Math.random()*.008,5,5),M(dotCols[d2%6+1],.5,.05));
    dot2.position.set(Math.cos(d2a)*1.02-Math.random()*.025,d2y,Math.sin(d2a)*1.02-Math.random()*.025);
    dot2.scale.set(1,.3+Math.random()*.3,1);
    cakeGroup.add(dot2);
  }
  // Tier 1 - scallop + hearts on surface
  for(var s1=0;s1<12;s1++){
    var s1a=s1/12*Math.PI*2;
    var s1m=new THREE.Mesh(new THREE.SphereGeometry(.018,5,5),M(0xfceae8,.55,0));
    s1m.position.set(Math.cos(s1a)*.78,1.0+Math.sin(s1*2.5)*.008,Math.sin(s1a)*.78);
    cakeGroup.add(s1m);
  }
  function addHeart(hx,hy,hz,hs){
    var hc=M(0xff6b8a,.4,.05);
    var h1=new THREE.Mesh(new THREE.SphereGeometry(.022*hs,5,5),hc);
    h1.position.set(hx-.013*hs,hy,hz);cakeGroup.add(h1);
    var h2=new THREE.Mesh(new THREE.SphereGeometry(.022*hs,5,5),hc);
    h2.position.set(hx+.013*hs,hy,hz);cakeGroup.add(h2);
    var h3=new THREE.Mesh(new THREE.SphereGeometry(.016*hs,5,5),hc);
    h3.position.set(hx,hy-.012*hs,hz-.016*hs);cakeGroup.add(h3);
  }
  for(var ht=0;ht<5;ht++){
    var hta=ht/5*Math.PI*2+.15;
    addHeart(Math.cos(hta)*.35,1.17,Math.sin(hta)*.35,.8);
  }

  // === More decorative patterns ===
  // Star bursts on cream surfaces
  function addStar(sx,sy,sz,sc,ss){
    for(var st=0;st<5;st++){
      var sta=st/5*Math.PI*2-.3;
      var sp=new THREE.Mesh(new THREE.SphereGeometry(.022*ss,5,5),M(sc,.5,.05));
      sp.position.set(sx+Math.cos(sta)*.035*ss,sy,sz+Math.sin(sta)*.035*ss);
      sp.scale.set(1.2,.5,1);cakeGroup.add(sp);
    }
    var sc2=new THREE.Mesh(new THREE.SphereGeometry(.01*ss,5,5),M(0xffdd44,.4,.05));
    sc2.position.set(sx,sy+.003,sz);cakeGroup.add(sc2);
  }
  // Stars on tier 3
  for(var st3=0;st3<6;st3++){var sta3=st3/6*Math.PI*2;addStar(Math.cos(sta3)*.95,.315,Math.sin(sta3)*.95,0xffc8d0,.75);}
  for(var st3b=0;st3b<5;st3b++){var sta3b=st3b/5*Math.PI*2+.2;addStar(Math.cos(sta3b)*.55,.315,Math.sin(sta3b)*.55,0xf0c0e0,.6);}
  // Stars on tier 2
  for(var st2=0;st2<5;st2++){var sta2=st2/5*Math.PI*2;addStar(Math.cos(sta2)*.7,.735,Math.sin(sta2)*.7,0xffd8e0,.7);}
  // Stars on tier 1
  for(var st1=0;st1<3;st1++){var sta1=st1/3*Math.PI*2+.3;addStar(Math.cos(sta1)*.52,1.16,Math.sin(sta1)*.52,0xffe0e8,.65);}
  // More hearts on tier 2 and 3
  function addHeart2(hx,hy,hz,hs,hc){
    var h1=new THREE.Mesh(new THREE.SphereGeometry(.018*hs,5,5),hc);
    h1.position.set(hx-.01*hs,hy,hz);cakeGroup.add(h1);
    var h2=new THREE.Mesh(new THREE.SphereGeometry(.018*hs,5,5),hc);
    h2.position.set(hx+.01*hs,hy,hz);cakeGroup.add(h2);
    var h3=new THREE.Mesh(new THREE.SphereGeometry(.013*hs,5,5),hc);
    h3.position.set(hx,hy-.01*hs,hz-.013*hs);cakeGroup.add(h3);
  }
  for(var h23=0;h23<5;h23++){var h23a=h23/5*Math.PI*2+.3;
    addHeart2(Math.cos(h23a)*.45,.315,Math.sin(h23a)*.45,.7,M(0xdd88aa,.4,.05));
  }
  for(var h22=0;h22<4;h22++){var h22a=h22/4*Math.PI*2+.1;
    addHeart2(Math.cos(h22a)*.4,.735,Math.sin(h22a)*.4,.6,M(0xcc99bb,.4,.05));
  }
  // Gold fleck scatter
  for(var gf=0;gf<50;gf++){
    var gfTier=Math.floor(gf/17);
    var gfy=[.28,.72,1.14][gfTier];
    var gfR=[1.2,.9,.65][gfTier];
    var gfa=Math.random()*Math.PI*2;
    var gfr=Math.random()*.8*gfR;
    var fleck=new THREE.Mesh(new THREE.SphereGeometry(.006+Math.random()*.005,4,4),M(0xd4a56a,.3,.2));
    fleck.position.set(Math.cos(gfa)*gfr,gfy+Math.random()*.01,Math.sin(gfa)*gfr);
    cakeGroup.add(fleck);
  }
  // Concentric dot rings on cream bands between tiers
  var bandColors=[0xffc0c8,0xffd0d8,0xfce8e8];
  for(var br=0;br<2;br++){
    var by=[.4,.82][br],brad=[1.2,1.0][br];
    for(var bd=0;bd<14;bd++){
      var bda=bd/14*Math.PI*2;
      var bdot=new THREE.Mesh(new THREE.SphereGeometry(.015,5,5),M(bandColors[br],.6,0));
      bdot.position.set(Math.cos(bda)*brad,by+Math.sin(bd*4)*.01,Math.sin(bda)*brad);
      cakeGroup.add(bdot);
    }
    for(var bd2=0;bd2<10;bd2++){
      var bd2a=bd2/10*Math.PI*2+.15;
      var bdot2=new THREE.Mesh(new THREE.SphereGeometry(.012,5,5),M(bandColors[br+1],.55,0));
      bdot2.position.set(Math.cos(bd2a)*(brad-.08),by+Math.sin(bd2*3.5)*.008,Math.sin(bd2a)*(brad-.08));
      cakeGroup.add(bdot2);
    }
  }
  // Piped shell border at base of each tier
  for(var sh=0;sh<3;sh++){
    var shy=[.06,.47,.92][sh],shrad=[1.36,1.06,.78][sh];
    var shCol=M(0xfceae8,.6,0);
    for(var shi=0;shi<18;shi++){
      var sha=shi/18*Math.PI*2;
      for(var shl=0;shl<3;shl++){
        var shell=new THREE.Mesh(new THREE.SphereGeometry(.014-shl*.003,5,5),shCol);
        shell.position.set(Math.cos(sha)*(shrad-shl*.03),shy+shl*.008,Math.sin(sha)*(shrad-shl*.03));
        shell.scale.set(1,.6+shl*.2,1);cakeGroup.add(shell);
      }
    }
  }

  // Candle - realistic black wax with flame glow
  var candleMat=new THREE.MeshPhysicalMaterial({
    color:0x2a2220,roughness:.4,metalness:0,
    clearcoat:.3,clearcoatRoughness:.5,
    emissive:0,emissiveIntensity:0
  });
  // Organic candle body with subtle waist
  var candle=new THREE.Mesh(new THREE.CylinderGeometry(.13,.195,.6,28,6),candleMat);
  candle.position.y=1.47;candle.castShadow=true;
  cakeGroup.add(candle);
  // Horizontal pour rings
  for(var wr=0;wr<6;wr++){
    var wy=1.17+wr*.1;
    var wring=new THREE.Mesh(
      new THREE.TorusGeometry(.155+wr*.005,.005+Math.random()*.005,6,22),
      M(0x3a3028,.65,.03)
    );
    wring.position.y=wy;wring.rotation.x=Math.PI/2;
    cakeGroup.add(wring);
  }
  // Wax drips - varied lengths and widths
  for(var wd=0;wd<16;wd++){
    var wda=wd/16*Math.PI*2+Math.random()*.06;
    var isLong=wd%4===0;
    var dlen=isLong ? .15+Math.random()*.14 : .04+Math.random()*.12;
    var drad=.008+Math.random()*.012;
    var dbase=1.17-Math.random()*.1;
    var drip=new THREE.Mesh(
      new THREE.CylinderGeometry(drad*1.5+(isLong ? .02 : 0),drad*.7,dlen,5),
      candleMat
    );
    drip.position.set(Math.cos(wda)*.168,dbase-dlen/2,Math.sin(wda)*.168);
    drip.rotation.z=(Math.random()-.5)*.1;
    drip.rotation.x=(Math.random()-.5)*.08;
    cakeGroup.add(drip);
    var dTip=new THREE.Mesh(new THREE.SphereGeometry(drad*.6,4,4),candleMat);
    dTip.position.set(Math.cos(wda)*.168,dbase-dlen,Math.sin(wda)*.168);
    cakeGroup.add(dTip);
  }
  // Tiny wax droplets scattered near base
  for(var ws=0;ws<12;ws++){
    var wsA=Math.random()*Math.PI*2;
    var wsR=.16+Math.random()*.04;
    var droplet=new THREE.Mesh(new THREE.SphereGeometry(.005+Math.random()*.008,4,4),candleMat);
    droplet.position.set(Math.cos(wsA)*wsR,1.16+Math.random()*.02,Math.sin(wsA)*wsR);
    cakeGroup.add(droplet);
  }
  // Melted rim
  var rim=new THREE.Mesh(
    new THREE.RingGeometry(.115,.16,28),M(0x3a3030,.5,.06)
  );
  rim.position.y=1.77;rim.rotation.x=-Math.PI/2;
  cakeGroup.add(rim);
  // Wax pool with warm glow near wick
  var pool=new THREE.Mesh(
    new THREE.CircleGeometry(.125,28),
    new THREE.MeshStandardMaterial({
      color:0x2a2222,roughness:.35,metalness:0
    })
  );
  pool.position.y=1.77;pool.rotation.x=-Math.PI/2;
  cakeGroup.add(pool);
  // Warm glow on pool from flame (emissive ring)
  var warmGlow=new THREE.Mesh(
    new THREE.RingGeometry(.015,.07,20),
    new THREE.MeshBasicMaterial({
      color:0xff6622,transparent:true,opacity:.08,
      side:THREE.DoubleSide,depthWrite:false
    })
  );
  warmGlow.position.y=1.771;warmGlow.rotation.x=-Math.PI/2;
  cakeGroup.add(warmGlow);
  // Brighter inner glow
  var innerWarm=new THREE.Mesh(
    new THREE.CircleGeometry(.025,16),
    new THREE.MeshBasicMaterial({
      color:0xff8833,transparent:true,opacity:.12,
      depthWrite:false
    })
  );
  innerWarm.position.y=1.771;innerWarm.rotation.x=-Math.PI/2;
  cakeGroup.add(innerWarm);

  // Braided wick
  var wick1=new THREE.Mesh(new THREE.CylinderGeometry(.004,.006,.09,4),M(0x1a1a1a,.7,.1));
  wick1.position.set(-.003,1.81,.003);wick1.rotation.z=.06;wick1.rotation.x=.03;
  cakeGroup.add(wick1);
  var wick2=new THREE.Mesh(new THREE.CylinderGeometry(.004,.006,.09,4),M(0x2a2a2a,.6,.08));
  wick2.position.set(.003,1.81,-.003);wick2.rotation.z=.1;wick2.rotation.x=-.02;
  cakeGroup.add(wick2);
  // Ember
  var ember=new THREE.Mesh(new THREE.SphereGeometry(.01,6,6),
    new THREE.MeshStandardMaterial({color:0xff6600,roughness:.3,metalness:0,emissive:0xff4400,emissiveIntensity:.4})
  );
  ember.position.set(0,1.855,0);
  cakeGroup.add(ember);

  // Number "19" sticker - big visible
  var nc=document.createElement('canvas');
  nc.width=180;nc.height=220;
  var cx=nc.getContext('2d');
  cx.clearRect(0,0,180,220);
  // Sticker shadow
  var r=22;
  cx.beginPath();cx.moveTo(r,30);cx.quadraticCurveTo(0,30,0,50);cx.lineTo(0,170);
  cx.quadraticCurveTo(0,190,r,190);cx.lineTo(180-r,190);
  cx.quadraticCurveTo(180,190,180,170);cx.lineTo(180,50);
  cx.quadraticCurveTo(180,30,180-r,30);cx.closePath();
  cx.shadowColor='rgba(80,40,10,.35)';cx.shadowBlur=12;cx.shadowOffsetY=3;
  cx.fillStyle='#3a2818';cx.fill();
  // Inner lighter area
  cx.shadowColor='transparent';cx.shadowBlur=0;
  cx.beginPath();cx.moveTo(r,30);cx.quadraticCurveTo(0,30,0,50);cx.lineTo(0,170);
  cx.quadraticCurveTo(0,190,r,190);cx.lineTo(180-r,190);
  cx.quadraticCurveTo(180,190,180,170);cx.lineTo(180,50);
  cx.quadraticCurveTo(180,30,180-r,30);cx.closePath();
  cx.fillStyle='#5a3a20';cx.fill();
  // Gold border
  cx.strokeStyle='#d4a56a';cx.lineWidth=4;
  cx.stroke();
  cx.strokeStyle='#f0d8b0';cx.lineWidth=1.5;cx.setLineDash([5,5]);
  cx.stroke();
  // Gold inner glow behind number
  var glowGrad=cx.createRadialGradient(90,100,10,90,100,60);
  glowGrad.addColorStop(0,'rgba(212,165,100,.25)');glowGrad.addColorStop(1,'rgba(212,165,100,0)');
  cx.setLineDash([]);
  cx.fillStyle=glowGrad;cx.fillRect(30,40,120,140);
  // Decorative lines
  cx.beginPath();cx.moveTo(24,58);cx.lineTo(156,58);cx.strokeStyle='#d4a56a';cx.lineWidth=1;cx.stroke();
  cx.beginPath();cx.moveTo(24,162);cx.lineTo(156,162);cx.stroke();
  // Number "19" - large with deep shadow
  cx.textAlign='center';cx.textBaseline='middle';
  cx.shadowColor='rgba(0,0,0,.4)';cx.shadowBlur=10;cx.shadowOffsetX=1;cx.shadowOffsetY=2;
  cx.fillStyle='#ffcc66';cx.font='bold 88px "Playfair Display",serif';
  cx.fillText('19',90,110);
  cx.shadowColor='transparent';cx.shadowBlur=0;
  cx.fillStyle='#ffe088';cx.font='bold 86px "Playfair Display",serif';
  cx.fillText('19',90,110);
  cx.fillStyle='#fff5d6';cx.font='bold 84px "Playfair Display",serif';
  cx.fillText('19',90,110);
  // Small decorative diamonds
  for(var _d=0;_d<4;_d++){
    var _a=_d*Math.PI/2+Math.PI/4;
    var dx=90+Math.cos(_a)*56,dy=110+Math.sin(_a)*48;
    cx.beginPath();cx.moveTo(dx,dy-5);cx.lineTo(dx+5,dy);cx.lineTo(dx,dy+5);cx.lineTo(dx-5,dy);
    cx.closePath();cx.fillStyle='#d4a56a';cx.fill();
  }
  var nt=new THREE.CanvasTexture(nc);
  nt.needsUpdate=true;
  var nm=new THREE.MeshBasicMaterial({map:nt,transparent:true,depthWrite:false,side:THREE.DoubleSide});
  var ns=new THREE.Mesh(new THREE.PlaneGeometry(.44,.54),nm);
  ns.position.set(0,1.47,.18);
  cakeGroup.add(ns);

  // Teardrop flame - 3 layered cones
  var fGeom=new THREE.ConeGeometry(.1,.22,10);
  var fMat=M(0xff8822,.1,.05,0xff5500,.3);
  var flame=new THREE.Mesh(fGeom,fMat);
  flame.position.y=1.83;cakeGroup.add(flame);
  var fmGeom=new THREE.ConeGeometry(.06,.15,8);
  var fmMat=M(0xffcc44,.1,.05,0xffaa00,.4);
  var midFlame=new THREE.Mesh(fmGeom,fmMat);
  midFlame.position.y=1.80;cakeGroup.add(midFlame);
  var fcGeom=new THREE.ConeGeometry(.03,.1,6);
  var fcMat=M(0xffffff,.05,.05,0xffeecc,.3);
  var coreFlame=new THREE.Mesh(fcGeom,fcMat);
  coreFlame.position.y=1.775;cakeGroup.add(coreFlame);
  // Flame glow
  var glCanvas=document.createElement('canvas');
  glCanvas.width=64;glCanvas.height=80;
  var gctx=glCanvas.getContext('2d');
  var gr=gctx.createRadialGradient(32,40,0,32,40,40);
  gr.addColorStop(0,'rgba(255,180,60,.3)');gr.addColorStop(.4,'rgba(255,120,30,.12)');gr.addColorStop(1,'rgba(255,120,30,0)');
  gctx.fillStyle=gr;gctx.fillRect(0,0,64,80);
  var glTex=new THREE.CanvasTexture(glCanvas);
  var glowSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:glTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  glowSprite.position.set(0,1.86,0);glowSprite.scale.set(1.8,2.8,1);
  cakeGroup.add(glowSprite);

  // Floating sparkle particles
  var sparkles=[];
  for(var spk=0;spk<10;spk++){
    var sc=document.createElement('canvas');sc.width=12;sc.height=12;
    var sctx=sc.getContext('2d');
    var sg=sctx.createRadialGradient(6,6,0,6,6,6);
    sg.addColorStop(0,'rgba(255,230,200,.5)');sg.addColorStop(1,'rgba(255,230,200,0)');
    sctx.fillStyle=sg;sctx.fillRect(0,0,12,12);
    var st=new THREE.CanvasTexture(sc);
    var smat=new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    var spkMesh=new THREE.Sprite(smat);
    var a=Math.random()*Math.PI*2,d=1.8+Math.random()*1.8;
    spkMesh.position.set(Math.cos(a)*d,.3+Math.random()*1.8,Math.sin(a)*d);
    spkMesh.scale.set(.1,.1,1);
    spkMesh.userData={angle:a,dist:d,speed:.001+Math.random()*.003,yOff:Math.random()*2};
    sparkles.push(spkMesh);scene.add(spkMesh);
  }

  // Click to blow candle
  var blown=false;
  canvas.style.pointerEvents='auto';
  canvas.addEventListener('click',function(e){
    if(blown)return;
    var rect=canvas.getBoundingClientRect();
    var mx=((e.clientX-rect.left)/rect.width)*2-1;
    var my=-((e.clientY-rect.top)/rect.height)*2+1;
    // Raycast to check if clicking near candle
    var raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mx,my),cam);
    var intersects=raycaster.intersectObjects(cakeGroup.children,true);
    var hitCandle=false;
    for(var hi=0;hi<intersects.length;hi++){
      var obj=intersects[hi].object;
      if(obj===candle||obj===flame||obj===midFlame||obj===coreFlame||obj===wick){
        hitCandle=true;break;
      }
    }
    if(!hitCandle)return;
    blown=true;
    flame.visible=false;
    midFlame.visible=false;
    coreFlame.visible=false;
    glowSprite.visible=false;
    ember.visible=false;
    if(cdEl)cdEl.textContent='🎉 Свеча погашена! Желание сбудется!';
    // Smoke particles
    for(var j=0;j<25;j++){
      var sm=document.createElement('div');
      var sz=3+Math.random()*12;
      var rect2=canvas.getBoundingClientRect();
      sm.style.cssText='position:fixed;left:'+(rect2.left+rect2.width/2)+'px;top:'+(rect2.top+rect2.height*.4)+'px;width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:rgba(180,180,180,.15);pointer-events:none;z-index:50';
      document.body.appendChild(sm);
      var tx=(Math.random()-0.5)*50;var ty=-(20+Math.random()*60);
      sm.animate([
        {transform:'translate(0,0) scale(1)',opacity:.3},
        {transform:'translate('+tx+'px,'+ty+'px) scale(2)',opacity:0}
      ],{duration:700+Math.random()*500,fill:'forwards'});
      setTimeout(function(){if(sm.parentNode)sm.remove()},2000);
    }
    setTimeout(function(){
      burstConfetti(window.innerWidth/2,window.innerHeight/2,100);
    },400);
  });

  // Auto-rotate and animate
  var angle=0;
  function animCake(){
    requestAnimationFrame(animCake);
    angle+=.0035;
    cakeGroup.rotation.y=angle;
    // Flame flicker
    if(!blown){
      var ft=Date.now()*.012;
      flame.scale.x=.85+Math.sin(ft)*.15;
      flame.scale.z=.85+Math.cos(ft*1.3)*.12;
      flame.position.y=1.83+Math.sin(ft)*.022;
      midFlame.scale.x=.85+Math.sin(ft*.9+1)*.15;
      midFlame.scale.z=.85+Math.cos(ft*1.1+1)*.1;
      midFlame.position.y=1.80+Math.sin(ft*1.1)*.018;
      coreFlame.scale.x=.8+Math.sin(ft*.8+2)*.2;
      coreFlame.scale.z=.8+Math.cos(ft*1.2+2)*.15;
      coreFlame.position.y=1.775+Math.sin(ft*1.2)*.015;
      glowSprite.material.opacity=.4+Math.sin(Date.now()*.006)*.25;
      glowSprite.scale.x=1.1+Math.sin(Date.now()*.005)*.2;
      glowSprite.scale.y=1.6+Math.sin(Date.now()*.007)*.3;
    }
    // Sparkles float
    for(var ski=0;ski<sparkles.length;ski++){
      var sk=sparkles[ski];
      var ud=sk.userData;
      var t=Date.now()*ud.speed+ud.yOff;
      sk.position.x=Math.cos(ud.angle+t*.1)*ud.dist;
      sk.position.z=Math.sin(ud.angle+t*.1)*ud.dist;
      sk.position.y=.3+Math.sin(t)*.1+ud.yOff*.5;
      sk.material.opacity=.2+Math.sin(Date.now()*.0015+ski)*.25;
    }
    renderer.render(scene,cam);
  }
  animCake();

  window.addEventListener('resize',function(){
    resize();
    cam.aspect=canvas.width/canvas.height;
    cam.updateProjectionMatrix();
    renderer.setSize(canvas.width,canvas.height);
  });
})();

// ===== WHEEL =====
if(document.getElementById('wcv')){(function(){
  var segs=[
    {text:'Успех',color:'#e8a0b4',pred:'Большой успех в учёбе! 🎓'},
    {text:'Счастье',color:'#d4a56a',pred:'Море счастья каждый день! ☀️'},
    {text:'Творчество',color:'#c45a6c',pred:'Творческий прорыв! 🎨'},
    {text:'Дружба',color:'#f0c0c8',pred:'Крепкая дружба навеки! 🤝'},
    {text:'Здоровье',color:'#7ac0a0',pred:'Крепкое здоровье! 💪'},
    {text:'Отл. учёба',color:'#d4a0c0',pred:'Отличная учёба — ты лучшая! 📚'},
    {text:'Кофе без лим.',color:'#b080a0',pred:'Бесконечный кофе и уют! ☕'},
    {text:'Друзья',color:'#e8c8a0',pred:'Новые крутые друзья! 🌟'}
  ];
  var c=document.getElementById('wcv'),x=c.getContext('2d');
  var n=segs.length,arc=Math.PI*2/n;
  var angle=0,spinning=false;

  function draw(a){
    var cx=320,cy=320,r=300;
    x.clearRect(0,0,640,640);
    x.save();x.translate(cx,cy);x.rotate(a);
    for(var i=0;i<n;i++){
      var start=i*arc-Math.PI/2,end=start+arc;
      x.beginPath();x.moveTo(0,0);x.arc(0,0,r,start,end);x.closePath();
      x.fillStyle=segs[i].color;x.fill();
      x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.stroke();
      x.save();
      x.rotate(start+arc/2);
      x.textAlign='center';x.textBaseline='middle';
      x.fillStyle='#fff';x.font='bold 22px Nunito,sans-serif';
      x.shadowColor='rgba(0,0,0,.15)';x.shadowBlur=4;
      x.fillText(segs[i].text,r*0.58,0);
      x.shadowBlur=0;
      x.font='26px serif';
      x.fillText(['🎓','☀️','🎨','🤝','💪','📚','☕','🌟'][i],r*0.3,0);
      x.restore();
    }
    x.beginPath();x.arc(0,0,20,0,Math.PI*2);
    x.fillStyle='#fffaf7';x.fill();
    x.strokeStyle='#c45a6c';x.lineWidth=4;x.stroke();
    x.beginPath();x.arc(0,0,6,0,Math.PI*2);
    x.fillStyle='#c45a6c';x.fill();
    x.restore();
  }
  draw(0);

  window.spinWheel=function(){
    if(spinning)return;
    spinning=true;
    document.getElementById('spBtn').disabled=true;
    document.getElementById('rb').classList.remove('on');
    var targetSeg=Math.floor(Math.random()*n);
    var spins=4+Math.floor(Math.random()*4);
    var targetInCircle=Math.PI*2-targetSeg*arc-arc/2;
    var currentInCircle=((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
    var delta=targetInCircle-currentInCircle;
    if(delta<0)delta+=Math.PI*2;
    var finalAngle=angle+delta+spins*Math.PI*2;
    var duration=3000+Math.random()*1500;
    var startA=angle;
    var startT=performance.now();
    function anim(t){
      var p=Math.min((t-startT)/duration,1);
      var e=1-Math.pow(1-p,3.5);
      angle=startA+(finalAngle-startA)*e;
      draw(angle);
      if(p<1){requestAnimationFrame(anim)}else{
        angle=finalAngle;
        draw(angle);
        document.getElementById('rt').textContent=segs[targetSeg].pred;
        document.getElementById('rb').classList.add('on');
        document.getElementById('spBtn').disabled=false;
        spinning=false;
        burstConfetti(window.innerWidth/2,window.innerHeight/2,60);
      }
    }
    requestAnimationFrame(anim);
  };
})();
window.toggleWheel=function(){
  var w=document.getElementById('wov');
  if(w){
    w.classList.toggle('on');
    if(w.classList.contains('on')){
      document.body.classList.add('modal-open');
    }else{
      document.body.classList.remove('modal-open');
    }
  }
};
var wovEl=document.getElementById('wov');
if(wovEl){
  wovEl.addEventListener('click',function(e){if(e.target===this)this.classList.remove('on')});
}
var spBtn=document.getElementById('spBtn');
if(spBtn)spBtn.addEventListener('click',function(){window.spinWheel()});}

// ===== THREE.JS TOOTHLESS (GLB) =====
(function(){
  var container=document.getElementById('tlArea');
  if(!container||typeof THREE==='undefined')return;
  var w=container.offsetWidth||400;
  var h=container.offsetHeight||350;

  var scene=new THREE.Scene();
  var canvas=document.createElement('canvas');
  canvas.width=2;canvas.height=512;
  var ctx=canvas.getContext('2d');
  var grd=ctx.createLinearGradient(0,0,0,512);
  grd.addColorStop(0,'#7ab8e8');grd.addColorStop(0.25,'#9ac8ee');grd.addColorStop(0.45,'#c0d8d0');grd.addColorStop(0.6,'#8aaa7a');grd.addColorStop(1,'#4a6a3a');
  ctx.fillStyle=grd;ctx.fillRect(0,0,2,512);
  scene.background=new THREE.CanvasTexture(canvas);

  var camera=new THREE.PerspectiveCamera(30,w/h,0.1,100);
  camera.position.set(2.8,1.5,4);
  camera.lookAt(0,0.55,0);

  var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.0;
  container.insertBefore(renderer.domElement,container.firstChild);
  renderer.domElement.style.borderRadius='20px';
  renderer.domElement.style.cursor='grab';

  var ambient=new THREE.AmbientLight(0x404060,0.5);scene.add(ambient);
  var dir=new THREE.DirectionalLight(0xffeedd,1.2);dir.position.set(5,8,5);scene.add(dir);
  var fill=new THREE.DirectionalLight(0xaaccff,0.4);fill.position.set(-3,2,-4);scene.add(fill);
  var rim=new THREE.DirectionalLight(0x88bbff,0.3);rim.position.set(0,-2,5);scene.add(rim);
  var topL=new THREE.DirectionalLight(0xffffff,0.2);topL.position.set(0,10,0);scene.add(topL);

  var shadowMat=new THREE.MeshBasicMaterial({color:0x988880,transparent:true,opacity:0.2});
  var shadow=new THREE.Mesh(new THREE.CircleGeometry(2.8,24),shadowMat);
  shadow.rotation.x=-Math.PI/2;shadow.position.y=-0.05;
  scene.add(shadow);

  // Ground
  var gndMat=new THREE.MeshStandardMaterial({color:0x5a7a4a,roughness:0.9,metalness:0});
  var ground=new THREE.Mesh(new THREE.CircleGeometry(6,32),gndMat);
  ground.rotation.x=-Math.PI/2;ground.position.y=-0.02;
  scene.add(ground);
  var gnd2Mat=new THREE.MeshStandardMaterial({color:0x6a8a5a,roughness:0.95,metalness:0});
  var ground2=new THREE.Mesh(new THREE.CircleGeometry(4.5,28),gnd2Mat);
  ground2.rotation.x=-Math.PI/2;ground2.position.y=-0.01;
  scene.add(ground2);

  // Trees with variety
  function addTree(x,z,size,shade){
    var s=size||1;
    var brown=0x5a3a2a;if(shade)brown=0x4a2a1a;
    var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.02*s,0.035*s,0.15*s,6),new THREE.MeshStandardMaterial({color:brown}));
    trunk.position.set(x,0.075*s,z);scene.add(trunk);
    var green1=shade?0x2a4a2a:0x2a5a2a;
    var green2=shade?0x3a5a3a:0x3a6a3a;
    var crown=new THREE.Mesh(new THREE.ConeGeometry(0.14*s,0.22*s,7),new THREE.MeshStandardMaterial({color:green1,roughness:0.9}));
    crown.position.set(x,0.19*s+0.075*s,z);scene.add(crown);
    var crown2=new THREE.Mesh(new THREE.ConeGeometry(0.1*s,0.16*s,7),new THREE.MeshStandardMaterial({color:green2,roughness:0.9}));
    crown2.position.set(x,0.27*s+0.075*s,z);scene.add(crown2);
  }
  function addPine(x,z,size){
    var s=size||1;
    var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.015*s,0.03*s,0.18*s,6),new THREE.MeshStandardMaterial({color:0x4a2a1a}));
    trunk.position.set(x,0.09*s,z);scene.add(trunk);
    var c1=new THREE.Mesh(new THREE.ConeGeometry(0.1*s,0.14*s,6),new THREE.MeshStandardMaterial({color:0x1a3a1a,roughness:0.9}));
    c1.position.set(x,0.16*s+0.09*s,z);scene.add(c1);
    var c2=new THREE.Mesh(new THREE.ConeGeometry(0.08*s,0.12*s,6),new THREE.MeshStandardMaterial({color:0x1a4a1a,roughness:0.9}));
    c2.position.set(x,0.26*s+0.09*s,z);scene.add(c2);
    var c3=new THREE.Mesh(new THREE.ConeGeometry(0.06*s,0.1*s,6),new THREE.MeshStandardMaterial({color:0x1a5a1a,roughness:0.9}));
    c3.position.set(x,0.36*s+0.09*s,z);scene.add(c3);
  }
  function addBush(x,z,size){
    var s=size||1;
    var col=[0x2a6a2a,0x3a7a3a,0x4a6a2a][Math.floor(Math.random()*3)];
    var m=new THREE.MeshStandardMaterial({color:col,roughness:0.9});
    var b1=new THREE.Mesh(new THREE.SphereGeometry(0.06*s,6,6),m);
    b1.position.set(x,0.04*s,z);scene.add(b1);
    var b2=new THREE.Mesh(new THREE.SphereGeometry(0.05*s,6,6),m);
    b2.position.set(x+0.05*s,0.02*s,z+0.04*s);scene.add(b2);
    var b3=new THREE.Mesh(new THREE.SphereGeometry(0.05*s,6,6),m);
    b3.position.set(x-0.04*s,0.025*s,z-0.03*s);scene.add(b3);
  }
  function addFlower(x,z,color){
    var s=0.02;
    var m=new THREE.MeshStandardMaterial({color:color||0xff6b8a,roughness:0.5});
    var f=new THREE.Mesh(new THREE.SphereGeometry(s,6,6),m);
    f.position.set(x,0,z);f.scale.y=0.5;
    f.position.y=0.01;scene.add(f);
    // tiny stem
    var sm=new THREE.MeshStandardMaterial({color:0x3a6a3a});
    var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.003,0.03,4),sm);
    stem.position.set(x,-0.015,z);scene.add(stem);
  }

  // Hills (distant)
  var hillMat=new THREE.MeshStandardMaterial({color:0x3a5a3a,roughness:1,metalness:0});
  function addHill(x,z,s,w){
    var h=new THREE.Mesh(new THREE.SphereGeometry(s,12,8),hillMat);
    h.position.set(x,-0.3*w,z);h.scale.set(w,0.15,0.4);scene.add(h);
  }
  addHill(-2.5,-3.0,1.8,1.2);addHill(-0.8,-3.2,1.5,1.0);addHill(1.0,-3.3,1.6,1.1);addHill(2.8,-3.0,2.0,1.3);
  addHill(-3.0,-2.5,1.2,0.8);addHill(3.2,-2.5,1.3,0.9);

  // Forest: trees, pines, bushes
  var forest=[
    // [type, x, z, size, shade?]
    ['t',-0.8,-1.5,0.7],['t',0.8,-1.5,0.7],['t',-1.2,-1.8,0.9],['t',1.2,-1.8,0.9],
    ['t',-0.5,-2.0,1.0],['t',0.5,-2.0,1.0],['t',-1.5,-2.2,1.1],['t',1.5,-2.2,1.1],
    ['t',-0.9,-2.6,1.2],['t',0.9,-2.6,1.2],['t',-1.8,-2.8,1.3],['t',1.8,-2.8,1.3],
    ['t',-0.3,-2.4,1.1],['t',0.3,-2.4,1.1],['t',-2.0,-2.0,1.0],['t',2.0,-2.0,1.0],
    ['p',-1.1,-1.3,0.6],['p',1.1,-1.3,0.6],['p',-1.6,-1.6,0.8],['p',1.6,-1.6,0.8],
    ['p',-2.2,-2.4,1.0],['p',2.2,-2.4,1.0],['p',-1.3,-2.8,1.1],['p',1.3,-2.8,1.1],
    ['p',-2.5,-2.0,0.9],['p',2.5,-2.0,0.9],['p',-0.6,-1.2,0.5],['p',0.6,-1.2,0.5],
    ['b',-1.3,-1.1,0.5],['b',1.3,-1.1,0.5],['b',-0.7,-1.8,0.6],['b',0.7,-1.8,0.6],
    ['b',-2.2,-1.6,0.7],['b',2.2,-1.6,0.7],['b',-1.8,-2.5,0.8],['b',1.8,-2.5,0.8],
    ['b',-0.2,-1.8,0.4],['b',0.2,-1.8,0.4],['b',-2.8,-2.5,0.9],['b',2.8,-2.5,0.9],
    ['f',-1.4,-1.2,0xff6b8a],['f',1.4,-1.2,0xff8b9a],['f',-0.4,-1.6,0xffbb55],['f',0.4,-1.6,0xff6b8a],
    ['f',-2.0,-2.0,0xff8b9a],['f',2.0,-2.0,0xffbb55],['f',-1.7,-2.8,0xff6b8a],['f',1.7,-2.8,0xff8b9a],
    ['f',-2.5,-2.3,0xffbb55],['f',2.5,-2.3,0xff6b8a],
  ];
  forest.forEach(function(d){
    if(d[0]==='t')addTree(d[1],d[2],d[3]);
    else if(d[0]==='p')addPine(d[1],d[2],d[3]);
    else if(d[0]==='b')addBush(d[1],d[2],d[3]);
    else if(d[0]==='f')addFlower(d[1],d[2],d[3]);
  });

  // Rocks
  function addRock(x,z,size){
    var s=size||0.06;
    var col=[0x6a6a5a,0x7a7a6a,0x5a5a4a][Math.floor(Math.random()*3)];
    var m=new THREE.MeshStandardMaterial({color:col,roughness:0.9});
    var r=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),m);
    r.position.set(x,0,z);r.rotation.set(Math.random(),Math.random(),Math.random());scene.add(r);
  }
  [[-2.0,-1.0,0.08],[2.0,-1.0,0.06],[-1.5,-2.2,0.1],[1.5,-2.2,0.07],[-2.8,-1.8,0.09],[2.8,-1.8,0.05]].forEach(function(r){addRock(r[0],r[1],r[2]);});

  // Sun glow
  var sunMat=new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:0.15});
  var sun=new THREE.Mesh(new THREE.SphereGeometry(0.5,16,16),sunMat);
  sun.position.set(2.2,1.8,-4.0);scene.add(sun);
  var sunMat2=new THREE.MeshBasicMaterial({color:0xffdd99,transparent:true,opacity:0.08});
  var sun2=new THREE.Mesh(new THREE.SphereGeometry(0.8,16,16),sunMat2);
  sun2.position.set(2.2,1.8,-4.0);scene.add(sun2);

  // Clouds
  function addCloud(x,y,z,s){
    var g=new THREE.Group();
    var m=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:0.6,roughness:0.2,metalness:0});
    var c1=new THREE.Mesh(new THREE.SphereGeometry(0.08*s,8,8),m);c1.position.set(0,0,0);g.add(c1);
    var c2=new THREE.Mesh(new THREE.SphereGeometry(0.1*s,8,8),m);c2.position.set(0.12*s,0.02*s,0.03*s);g.add(c2);
    var c3=new THREE.Mesh(new THREE.SphereGeometry(0.09*s,8,8),m);c3.position.set(-0.1*s,0.03*s,-0.02*s);g.add(c3);
    var c4=new THREE.Mesh(new THREE.SphereGeometry(0.07*s,8,8),m);c4.position.set(0.15*s,-0.02*s,0.07*s);g.add(c4);
    var c5=new THREE.Mesh(new THREE.SphereGeometry(0.06*s,8,8),m);c5.position.set(-0.14*s,0*s,0.06*s);g.add(c5);
    g.position.set(x,y,z);scene.add(g);
  }
  addCloud(-1.0,1.2,-3.0,1.5);addCloud(0.8,0.9,-2.5,1.2);addCloud(-0.3,1.4,-3.5,1.8);addCloud(1.5,1.0,-3.2,1.3);addCloud(-1.5,0.8,-2.0,1.0);
  addCloud(-2.2,0.6,-1.5,0.9);addCloud(2.0,0.7,-1.8,1.0);addCloud(-1.8,1.5,-4.0,1.6);addCloud(1.2,1.1,-4.5,1.4);

  // Mist
  var mistMat=new THREE.MeshBasicMaterial({color:0x8aaa7a,transparent:true,opacity:0.04,depthWrite:false});
  for(var mi=0;mi<8;mi++){
    var mist=new THREE.Mesh(new THREE.PlaneGeometry(0.8+mi*0.3,0.35),mistMat);
    var ma=(mi/8)*Math.PI*2;
    mist.position.set(Math.cos(ma)*1.5,-0.05+mi*0.02,-1.5-mi*0.15);
    mist.lookAt(0,0.3,-5);scene.add(mist);
  }

  // Fireflies
  var fireflies=[],ffMat=new THREE.MeshBasicMaterial({color:0xffee88,transparent:true,opacity:0.6});
  for(var fi2=0;fi2<20;fi2++){
    var ff=new THREE.Mesh(new THREE.SphereGeometry(0.01,4,4),ffMat);
    ff.position.set((Math.random()-0.5)*5,Math.random()*0.4+0.1,-2-Math.random()*2.5);
    ff.userData={speed:0.3+Math.random()*0.5,phase:Math.random()*6.28,offX:ff.position.x,offZ:ff.position.z,rad:0.2+Math.random()*0.4};
    scene.add(ff);fireflies.push(ff);
  }

  var model=null,mixer=null,clock=new THREE.Clock(),clickR=0,idlePhase=0;
  var wingL=null,wingR=null,headB=null;
  var targetHeadY=0,mouseX=0,mouseInside=false;
  var userRotY=0,prevMouseX=0,isDragging=false,clickMoved=false;

  function ensureGLTFLoader(cb){
    if(typeof THREE.GLTFLoader!=='undefined'){cb();return}
    var s=document.createElement('script');
    s.src='https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    s.onload=function(){cb()};
    s.onerror=function(){
      container.innerHTML='<div style="padding:20px;text-align:center;color:#999;font-family:Nunito,sans-serif;font-size:14px">😔 Не удалось загрузить 3D-модуль<br><span style="font-size:11px;color:#aaa">Проверьте соединение</span></div>';
    };
    document.head.appendChild(s);
  }

  var loader;
  var loadEl=document.createElement('div');
  loadEl.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:2;pointer-events:none;background:rgba(255,255,255,.45);border-radius:20px;transition:opacity .6s;font-family:Nunito,sans-serif';
  loadEl.innerHTML='<div style="font-size:14px;color:#8b1a2b;font-weight:700;text-align:center;line-height:1.6">🐉 Беззубик<br><span style="font-size:11px;color:#c45a6c">загружается...</span></div>';
  var modelLoaded=false,loadAttempts=0;

  function startLoad(){
    if(modelLoaded)return;
    modelLoaded=true;
    container.appendChild(loadEl);
    ensureGLTFLoader(function(){
      loader=new THREE.GLTFLoader();
      var pctEl=document.getElementById('tlLoadPct');
      if(!pctEl){
        loadEl.innerHTML='<div style="font-size:14px;color:#8b1a2b;font-weight:700;text-align:center;line-height:1.6">🐉 Загрузка Беззубика...<br><span style="font-size:12px;color:#c45a6c" id="tlLoadPct">0%</span></div>';
        pctEl=document.getElementById('tlLoadPct');
      }
      var loadPct=0;
      loader.load('беззубик.glb',function(gltf){
        model=gltf.scene;
        model.scale.set(0.3,0.3,0.3);
        model.position.y=0.35;
        model.rotation.x=-0.15;
        scene.add(model);
        var eyeMats=[];
        model.traverse(function(c){
          var n=c.name?c.name.toLowerCase():'';
          if(c.isMesh&&c.material){
            var mats=Array.isArray(c.material)?c.material:[c.material];
            mats.forEach(function(m){
              if(m.emissive&&(m.emissive.r>0||m.emissive.g>0||m.emissive.b>0))eyeMats.push(m);
            });
          }
          if(n.indexOf('wing')!==-1||n.indexOf('крыл')!==-1){
            if(!wingL&&c.position.x<0)wingL=c;
            if(!wingR&&c.position.x>0)wingR=c;
          }
          if(!headB&&(n.indexOf('head')!==-1||n.indexOf('голов')!==-1))headB=c;
        });
        scene.userData.eyeMats=eyeMats;
        if(!headB&&model)headB=model;
        if(gltf.animations&&gltf.animations.length>0){
          mixer=new THREE.AnimationMixer(model);
          gltf.animations.forEach(function(clip){mixer.clipAction(clip).play();});
        }
        loadEl.style.opacity='0';
        setTimeout(function(){if(loadEl.parentNode)loadEl.remove()},600);
        modelLoaded=true;
      },function(xhr){
        if(xhr.total){
          var pct=Math.round(xhr.loaded/xhr.total*100);
          if(pct!==loadPct){
            loadPct=pct;
            if(pctEl)pctEl.textContent=pct+'%';
          }
        }
      },function(err){
        console.error('Ошибка загрузки Беззубика:',err);
        loadAttempts++;
        modelLoaded=false;
        if(loadAttempts<2){
          loadEl.innerHTML='<div style="font-size:13px;color:#c45a6c;font-weight:600;text-align:center;line-height:1.6">🐉 Повторная попытка...<br><span style="font-size:11px;color:#999">'+(loadAttempts)+'/2</span></div>';
          setTimeout(startLoad,2000);
        }else{
          loadEl.innerHTML='<div style="font-size:13px;color:#999;font-weight:600;text-align:center;line-height:1.6">😔 Не удалось загрузить<br><button onclick="location.reload()" style="margin-top:8px;padding:6px 18px;border:2px solid #c45a6c;border-radius:20px;background:transparent;color:#c45a6c;font-size:12px;cursor:pointer">🔄 Повторить</button></div>';
          loadEl.style.pointerEvents='auto';
        }
      });
    });
  }

  // Load trigger
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){startLoad();io.unobserve(container)}
      });
    },{rootMargin:'300px'});
    io.observe(container);
    // Fallback: if user doesn't scroll within 8s, load anyway
    setTimeout(function(){if(!modelLoaded){try{io.unobserve(container)}catch(ex){}startLoad()}},8000);
  }else{startLoad()}

  function animate(){
    requestAnimationFrame(animate);
    var delta=Math.min(clock.getDelta(),0.05);
    idlePhase+=delta;
    if(mixer)mixer.update(delta);
    if(model){
      // Floating idle
      model.position.y=0.35+Math.sin(idlePhase*0.9)*0.025;
      // Gentle sway — no X rotation override so flight tilt is kept
      model.rotation.z=Math.sin(idlePhase*0.4)*0.015;
      model.rotation.y=Math.PI+userRotY+Math.sin(idlePhase*0.25)*0.08;
      // Wing flutter
      if(wingL)wingL.rotation.z=-0.05+Math.sin(idlePhase*2.5)*0.04;
      if(wingR)wingR.rotation.z=0.05-Math.sin(idlePhase*2.5)*0.04;
      // Head follow mouse
      if(headB&&mouseInside){
        targetHeadY+=(mouseX*0.3-targetHeadY)*0.05;
        headB.rotation.y=targetHeadY;
      }else if(headB){
        targetHeadY+=(Math.sin(idlePhase*0.6)*0.05-targetHeadY)*0.03;
        headB.rotation.y=targetHeadY;
      }
      // Jump animation removed
    }
    if(scene.userData.eyeMats){
      scene.userData.eyeMats.forEach(function(m){m.emissiveIntensity=0.3+clickR*0.7;});
    }
    if(clickR>0){clickR-=0.015;if(clickR<0)clickR=0;}
    // Fireflies
    fireflies.forEach(function(ff,i){
      var d=ff.userData;
      ff.position.x=d.offX+Math.sin(idlePhase*d.speed+d.phase)*d.rad;
      ff.position.z=d.offZ+Math.cos(idlePhase*d.speed*0.7+d.phase*1.3)*d.rad;
      ff.position.y+=Math.sin(idlePhase*2+d.phase)*0.002;
      ff.material.opacity=0.3+Math.sin(idlePhase*1.5+d.phase)*0.3;
    });
    // Shadow follows model
    shadow.material.opacity=0.15+Math.abs(Math.sin(idlePhase*0.9))*0.1;
    renderer.render(scene,camera);
  }
  animate();

  // ---- INTERACTION ----
  var isTouchDevice='ontouchstart' in window;
  renderer.domElement.addEventListener('mouseenter',function(){if(!isTouchDevice){mouseInside=true;renderer.domElement.style.cursor='grab'}});
  renderer.domElement.addEventListener('mouseleave',function(){if(!isTouchDevice)mouseInside=false;});
  renderer.domElement.addEventListener('mousedown',function(e){
    if(isTouchDevice)return;
    prevMouseX=e.clientX;isDragging=true;clickMoved=false;
    renderer.domElement.style.cursor='grabbing';
  });
  renderer.domElement.addEventListener('mousemove',function(e){
    if(isTouchDevice)return;
    var rect=renderer.domElement.getBoundingClientRect();
    mouseX=(e.clientX-rect.left)/rect.width-0.5;
    if(isDragging){
      var dx=e.clientX-prevMouseX;
      if(Math.abs(dx)>2)clickMoved=true;
      userRotY+=dx*0.01;
      prevMouseX=e.clientX;
    }
  });
  window.addEventListener('mouseup',function(){
    if(!isDragging||isTouchDevice)return;
    isDragging=false;
    renderer.domElement.style.cursor='grab';
    if(!clickMoved){
      clickR=1;
      if(typeof burstConfetti==='function'){
        try{var rect=renderer.domElement.getBoundingClientRect();burstConfetti(rect.left+rect.width/2,rect.top+20,30);}catch(ex){}
      }
    }
  });
  // Touch events for mobile
  if(isTouchDevice){
    renderer.domElement.addEventListener('touchstart',function(e){
      var t=e.touches[0];prevMouseX=t.clientX;isDragging=true;clickMoved=false;
      mouseInside=true;
    },{passive:true});
    renderer.domElement.addEventListener('touchmove',function(e){
      var t=e.touches[0];
      var rect=renderer.domElement.getBoundingClientRect();
      mouseX=(t.clientX-rect.left)/rect.width-0.5;
      if(isDragging){
        var dx=t.clientX-prevMouseX;
        if(Math.abs(dx)>2)clickMoved=true;
        userRotY+=dx*0.01;
        prevMouseX=t.clientX;
      }
      e.preventDefault();
    },{passive:false});
    renderer.domElement.addEventListener('touchend',function(e){
      if(!isDragging)return;
      isDragging=false;mouseInside=false;
      if(!clickMoved){
        clickR=1;
        if(typeof burstConfetti==='function'){
          try{var rect=renderer.domElement.getBoundingClientRect();burstConfetti(rect.left+rect.width/2,rect.top+20,30);}catch(ex){}
        }
      }
    });
  }

  window.addEventListener('resize',function(){
    var r=container.getBoundingClientRect();
    if(r.width>0){renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
  });
})();

// ===== MUSIC BOX =====
function initMusic(){
  var audio=new Audio('Для тебя.mp3');
  window._audioEl=audio;
  audio.loop=true;document.body.appendChild(audio);
  audio.addEventListener('error',function(){mbBox.style.background='red'});
  var isPlaying=false;
  var _mbPlaying=false;
  audio.addEventListener('play',function(){_mbPlaying=true});
  audio.addEventListener('pause',function(){_mbPlaying=false});
  var mbBox=document.getElementById('mbBox');
  var mbCtrl=document.getElementById('mbCtrl');
  var mbPlayBtn=document.getElementById('mbPlayBtn');
  var mbProg=document.getElementById('mbProg');
  var mbProgF=document.getElementById('mbProgF');
  var mbTime=document.getElementById('mbTime');
  var mbVol=document.getElementById('mbVol');
  var mbVinyl=document.getElementById('mbVinyl');
  var mbNotes=document.getElementById('mbNotes');
  var musicBox=document.getElementById('musicBox');
  var giftBox=document.getElementById('giftBox');

  musicBox.classList.add('show');
  audio.volume=0.5;

  // Notes
  for(var i=0;i<5;i++){
    var note=document.createElement('div');
    note.className='mb-note';
    note.textContent=['♪','♫','♩','♬','🎵'][i];
    note.style.left=(Math.random()*20-10)+'px';
    note.style.animationDelay=(i*0.5)+'s';
    note.style.animationDuration=(2+Math.random()*1)+'s';
    mbNotes.appendChild(note);
  }

  mbBox.classList.add('open');

  // Auto-play from loading page
  if(sessionStorage.getItem('playMusic')){
    _userGestured=true;
    sessionStorage.removeItem('playMusic');
  }

  function doPlay(){
    var pp=audio.play();
    if(pp&&pp.then){
      pp.then(function(){
        isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
        fadeIn(audio,0.5,2000);
      }).catch(function(){});
    }else if(pp===undefined){
      isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
      audio.volume=0.5;
    }
  }
  function waitForTap(){
    var tapped=false;
    function onTap(){
      if(tapped)return;
      tapped=true;
      document.removeEventListener('click',onTap);
      document.removeEventListener('touchstart',onTap);
      audio.play().then(function(){
        isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
        if(audio.volume<0.4){
          (function fade(){var v=audio.volume;if(v<0.5){audio.volume=Math.min(v+0.05,0.5);setTimeout(fade,120)}})();
        }
      }).catch(function(){});
    }
    document.addEventListener('click',onTap);
    document.addEventListener('touchstart',onTap);
  }
  function retryPlay(){
    mbPlayBtn.textContent='▶';mbBox.classList.remove('playing');
    if(_userGestured){
      doPlay();
    }else{
      waitForTap();
    }
  }
  var playPromise=audio.play();
  if(playPromise!==undefined){
    playPromise.then(function(){
      isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
      fadeIn(audio,0.5,2000);
    }).catch(function(){
      mbCtrl.classList.add('show');
      mbPlayBtn.style.animation='mbPulse 1.2s ease-in-out infinite';
      // On non-touch devices, first tap anywhere starts music
      if(!('ontouchstart' in window)){
        waitForTap();
        var retryCount=0;
        var retryTimer=setInterval(function(){
          retryCount++;
          if(retryCount>30||!audio.paused){clearInterval(retryTimer);return}
          audio.play().then(function(){
            clearInterval(retryTimer);
            isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
            mbPlayBtn.style.animation='';
            fadeIn(audio,0.5,2000);
          }).catch(function(){});
        },300);
      }
    });
  }

  function fadeIn(audio,target,duration){
    var start=performance.now();
    function step(t){
      var p=Math.min((t-start)/duration,1);
      audio.volume=p*target;mbVol.value=audio.volume;updateVolSlider(audio.volume);
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function updateVolSlider(v){mbVol.style.backgroundSize=(v*100)+'% 100%';mbVol.style.backgroundRepeat='no-repeat'}
  updateVolSlider(0.5);

  var _clickLock=false;
  function togglePlay(e){
    if(_clickLock)return;
    _clickLock=true;setTimeout(function(){_clickLock=false},300);
    e.stopPropagation();
    if(!_mbPlaying){
      audio.play().then(function(){
        isPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
        mbBox.classList.add('open');
      }).catch(function(){});
    }else{
      audio.pause();_mbPlaying=false;isPlaying=false;mbPlayBtn.textContent='▶';mbBox.classList.remove('playing');
    }
  }
  mbBox.addEventListener('click',togglePlay);

  mbPlayBtn.addEventListener('click',function(e){
    e.stopPropagation();
    if(audio.paused){
      audio.play().then(function(){}).catch(function(){});
      isPlaying=true;_mbPlaying=true;mbPlayBtn.textContent='⏸';mbBox.classList.add('playing');
      mbBox.classList.add('open');
    }else{
      audio.pause();_mbPlaying=false;isPlaying=false;mbPlayBtn.textContent='▶';mbBox.classList.remove('playing');
    }
  });

  audio.addEventListener('timeupdate',function(){
    if(audio.duration){
      var pct=(audio.currentTime/audio.duration)*100;
      mbProgF.style.width=pct+'%';
      var m=Math.floor(audio.currentTime/60);var s=Math.floor(audio.currentTime%60);
      mbTime.textContent=m+':'+(s<10?'0':'')+s;
    }
  });

  mbProg.addEventListener('click',function(e){
    var r=this.getBoundingClientRect();
    audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
  });

  mbVol.addEventListener('input',function(){audio.volume=parseFloat(this.value);updateVolSlider(audio.volume)});

  var ctrlTimer;
  mbBox.addEventListener('mouseenter',function(){mbCtrl.classList.add('show');if(ctrlTimer){clearTimeout(ctrlTimer);ctrlTimer=null}});
  musicBox.addEventListener('mouseleave',function(e){
    if(e.target.closest('#mbCtrl')||e.target.closest('.mb-box'))return;
    ctrlTimer=setTimeout(function(){mbCtrl.classList.remove('show')},2000);
  });
  mbCtrl.addEventListener('mouseenter',function(){if(ctrlTimer){clearTimeout(ctrlTimer);ctrlTimer=null}});
  mbCtrl.addEventListener('mouseleave',function(){ctrlTimer=setTimeout(function(){mbCtrl.classList.remove('show')},2000)});
  // Tap music box → toggle ctrl panel
  var touchToggle=false;
  musicBox.addEventListener('click',function(e){
    if(e.target.closest('#mbCtrl'))return;
    var isOnGift=giftBox&&giftBox.classList.contains('show');
    var isOnInside=!giftBox;
    if(!isOnGift&&!isOnInside)return;
    if(!('ontouchstart' in window)){
      if(isOnGift)mbCtrl.classList.toggle('show');
      return;
    }
    if(!touchToggle){mbCtrl.classList.add('show');touchToggle=true;
      setTimeout(function(){touchToggle=false;mbCtrl.classList.remove('show')},4000);
    }else{touchToggle=false;mbCtrl.classList.remove('show')}
  });
}

// Auto-init music box on inside page (no gift box)
if(document.getElementById('musicBox')&&!document.getElementById('giftBox')){
  initMusic();
}

// ===== GLOBAL CLICK CONFETTI =====
if(document.getElementById('main')){document.addEventListener('click',function(e){
  if(!document.getElementById('main').classList.contains('show'))return;
  if(e.target.closest('.btn')||e.target.closest('.balloon')||e.target.closest('.big-candle')||
     e.target.closest('.wov')||e.target.closest('.mb-box')||e.target.closest('#mbCtrl')||
     e.target.closest('#musicBox')||e.target.closest('#pbC')||e.target.closest('.fw-overlay')||
     e.target.closest('#tlArea')||e.target.closest('canvas')||e.target.closest('.bfly'))return;
  if(Math.random()>.7)burstConfetti(e.clientX,e.clientY,10);
});}

// ===== SLIDER =====
if(document.getElementById('sslider')){(function(){
  var cont=document.getElementById('sslider');
  var stage=document.getElementById('ssliderStage');
  var cards=stage&&stage.children;
  var prevBtn=document.getElementById('snavPrev');
  var nextBtn=document.getElementById('snavNext');
  var dotsCont=document.getElementById('snavDots');
  var countEl=document.getElementById('snavCount');
  if(!cards||!cards.length)return;
  var idx=0,total=cards.length,autoTimer;
  var startX=0,deltaX=0,isDragging=false;
  var lastX=0,velocity=0,lastTime=0;
  var locked=false,startY=0;
  var mouseDown=false;

  for(var si=0;si<total;si++){
    var bg=cards[si].getAttribute('data-bg');
    if(bg)cards[si].style.background='linear-gradient(160deg,'+bg+','+bg+')';
  }

  for(var i=0;i<total;i++){
    var dot=document.createElement('button');
    dot.className='snav-dot'+(i===0?' active':'');
    dot.setAttribute('data-i',i);
    dot.addEventListener('click',function(){go(parseInt(this.getAttribute('data-i')))});
    dotsCont.appendChild(dot);
  }
  var dots=dotsCont.children;

  function updateUI(){
    for(var i=0;i<total;i++){
      var c=cards[i].classList;
      c.remove('active','prev','next');
      if(i===idx)c.add('active');
      else if(i===idx-1||(idx===0&&i===total-1))c.add('prev');
      else if(i===idx+1||(idx===total-1&&i===0))c.add('next');
    }
    for(var di=0;di<total;di++){
      if(dots[di])dots[di].className='snav-dot'+(di===idx?' active':'');
    }
    if(countEl)countEl.textContent='✦ '+(idx+1)+' / '+total+' ✦';
  }

  function go(n){
    if(n<0)n=total-1;
    if(n>=total)n=0;
    if(n===idx)return;
    idx=n;
    updateUI();
    resetAuto();
  }

  updateUI();

  if(prevBtn)prevBtn.addEventListener('click',function(){go(idx-1)});
  if(nextBtn)nextBtn.addEventListener('click',function(){go(idx+1)});

  function dragStart(e){
    var t=e.touches?e.touches[0]:e;
    startX=t.clientX;startY=t.clientY;
    deltaX=0;lastX=t.clientX;lastTime=Date.now();velocity=0;
    isDragging=true;locked=false;
  }
  function dragMove(e){
    if(!isDragging)return;
    var t=e.touches?e.touches[0]:e;
    var dx=t.clientX-startX;
    var dy=t.clientY-startY;
    if(!locked){
      if(Math.abs(dy)>Math.abs(dx)+10){isDragging=false;return}
      if(Math.abs(dx)>10)locked=true;
    }
    if(!locked)return;
    e.preventDefault();
    var now=Date.now(),dt=Math.max(now-lastTime,1);
    velocity=(t.clientX-lastX)/dt;
    lastX=t.clientX;lastTime=now;
    deltaX=dx;
  }
  function dragEnd(e){
    if(!isDragging)return;
    isDragging=false;locked=false;
    var threshold=cont.offsetWidth*0.18;
    if(Math.abs(deltaX)>threshold){
      go(deltaX<0?idx+1:idx-1);
    }else if(Math.abs(velocity)>0.45){
      go(velocity<0?idx+1:idx-1);
    }
  }

  cont.addEventListener('touchstart',dragStart,{passive:true});
  cont.addEventListener('touchmove',dragMove,{passive:false});
  cont.addEventListener('touchend',dragEnd);

  cont.addEventListener('mousedown',function(e){mouseDown=true;dragStart(e)});
  document.addEventListener('mousemove',function(e){if(!mouseDown)return;dragMove(e)});
  document.addEventListener('mouseup',function(e){if(!mouseDown)return;mouseDown=false;dragEnd(e)});

  document.addEventListener('keydown',function(e){
    if(!cont||!cont.closest||!cont.closest('#main'))return;
    if(cont.offsetParent===null)return;
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowLeft'?idx-1:idx+1)}
  });

  cont.addEventListener('mouseenter',function(){if(autoTimer)clearInterval(autoTimer);autoTimer=null});
  cont.addEventListener('mouseleave',function(){resetAuto()});
  cont.addEventListener('touchstart',function(){if(autoTimer)clearInterval(autoTimer);autoTimer=null},{passive:true});
  cont.addEventListener('touchend',function(){resetAuto()});

  function resetAuto(){
    if(autoTimer)clearInterval(autoTimer);
    autoTimer=setInterval(function(){go(idx+1)},4500);
  }
  resetAuto();
})();}
