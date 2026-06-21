// Toothless 3D — standalone loader
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

  var camera=new THREE.PerspectiveCamera(40,w/h,0.1,100);
  camera.position.set(0,1.2,5.5);
  camera.lookAt(0,0.6,0);

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

  var gndMat=new THREE.MeshStandardMaterial({color:0x5a7a4a,roughness:0.9,metalness:0});
  var ground=new THREE.Mesh(new THREE.CircleGeometry(6,32),gndMat);
  ground.rotation.x=-Math.PI/2;ground.position.y=-0.02;
  scene.add(ground);
  var gnd2Mat=new THREE.MeshStandardMaterial({color:0x6a8a5a,roughness:0.95,metalness:0});
  var ground2=new THREE.Mesh(new THREE.CircleGeometry(4.5,28),gnd2Mat);
  ground2.rotation.x=-Math.PI/2;ground2.position.y=-0.01;
  scene.add(ground2);

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
    var sm=new THREE.MeshStandardMaterial({color:0x3a6a3a});
    var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.003,0.03,4),sm);
    stem.position.set(x,-0.015,z);scene.add(stem);
  }

  var hillMat=new THREE.MeshStandardMaterial({color:0x3a5a3a,roughness:1,metalness:0});
  function addHill(x,z,s,w){
    var h=new THREE.Mesh(new THREE.SphereGeometry(s,12,8),hillMat);
    h.position.set(x,-0.3*w,z);h.scale.set(w,0.15,0.4);scene.add(h);
  }
  addHill(-2.5,-3.0,1.8,1.2);addHill(-0.8,-3.2,1.5,1.0);addHill(1.0,-3.3,1.6,1.1);addHill(2.8,-3.0,2.0,1.3);
  addHill(-3.0,-2.5,1.2,0.8);addHill(3.2,-2.5,1.3,0.9);

  var forest=[
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

  function addRock(x,z,size){
    var s=size||0.06;
    var col=[0x6a6a5a,0x7a7a6a,0x5a5a4a][Math.floor(Math.random()*3)];
    var m=new THREE.MeshStandardMaterial({color:col,roughness:0.9});
    var r=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),m);
    r.position.set(x,0,z);r.rotation.set(Math.random(),Math.random(),Math.random());scene.add(r);
  }
  [[-2.0,-1.0,0.08],[2.0,-1.0,0.06],[-1.5,-2.2,0.1],[1.5,-2.2,0.07],[-2.8,-1.8,0.09],[2.8,-1.8,0.05]].forEach(function(r){addRock(r[0],r[1],r[2]);});

  var sunMat=new THREE.MeshBasicMaterial({color:0xffeebb,transparent:true,opacity:0.15});
  var sun=new THREE.Mesh(new THREE.SphereGeometry(0.5,16,16),sunMat);
  sun.position.set(2.2,1.8,-4.0);scene.add(sun);
  var sunMat2=new THREE.MeshBasicMaterial({color:0xffdd99,transparent:true,opacity:0.08});
  var sun2=new THREE.Mesh(new THREE.SphereGeometry(0.8,16,16),sunMat2);
  sun2.position.set(2.2,1.8,-4.0);scene.add(sun2);

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

  var mistMat=new THREE.MeshBasicMaterial({color:0x8aaa7a,transparent:true,opacity:0.04,depthWrite:false});
  for(var mi=0;mi<8;mi++){
    var mist=new THREE.Mesh(new THREE.PlaneGeometry(0.8+mi*0.3,0.35),mistMat);
    var ma=(mi/8)*Math.PI*2;
    mist.position.set(Math.cos(ma)*1.5,-0.05+mi*0.02,-1.5-mi*0.15);
    mist.lookAt(0,0.3,-5);scene.add(mist);
  }

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
  var loadEl=document.createElement('div');
  loadEl.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;z-index:2;pointer-events:none;background:rgba(255,255,255,.45);border-radius:20px;transition:opacity .6s;font-family:Nunito,sans-serif';
  loadEl.innerHTML='<div style="font-size:14px;color:#8b1a2b;font-weight:700;text-align:center;line-height:1.6">🐉 Беззубик<br><span style="font-size:11px;color:#c45a6c">загружается...</span></div>';
  var modelLoaded=false,loadAttempts=0;
  var loadStarted=0; // timestamp when actual loading begins

  function startLoad(){
    if(modelLoaded)return;
    modelLoaded=true;
    container.appendChild(loadEl);
    ensureGLTFLoader(function(){
      var loader=new THREE.GLTFLoader();
      if(typeof THREE.DRACOLoader!=='undefined'){
        var dracoLoader=new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');
        loader.setDRACOLoader(dracoLoader);
      }
      var pctEl=document.getElementById('tlLoadPct');
      if(!pctEl){
        loadEl.innerHTML='<div style="font-size:14px;color:#8b1a2b;font-weight:700;text-align:center;line-height:1.6">🐉 Загрузка Беззубика...<br><span style="font-size:12px;color:#c45a6c" id="tlLoadPct">0%</span></div>';
        pctEl=document.getElementById('tlLoadPct');
      }
      var loadPct=0,lastLoadedKb=0;
      var stalled=false;
      loadStarted=Date.now();

      var stallTimer=setInterval(function(){
        if(model)return; // loaded successfully
        var elapsed=Math.round((Date.now()-loadStarted)/1000);
        if(loadPct===0&&elapsed>20&&!stalled){
          stalled=true;
          if(pctEl)pctEl.textContent='⏳ файл большой ('+elapsed+'c)';
        }
        if(elapsed>35&&!model){
          clearInterval(stallTimer);
          loadAttempts++;
          if(loadAttempts<2){
            if(pctEl)pctEl.textContent='🔄 повтор...';
            setTimeout(startLoad,2000);
          }else{
            loadEl.innerHTML='<div style="font-size:13px;color:#999;font-weight:600;text-align:center;line-height:1.6">😔 Не удалось загрузить<br><button onclick="location.reload()" style="margin-top:8px;padding:6px 18px;border:2px solid #c45a6c;border-radius:20px;background:transparent;color:#c45a6c;font-size:12px;cursor:pointer">🔄 Повторить</button></div>';
            loadEl.style.pointerEvents='auto';
            clearInterval(stallTimer);
          }
        }
      },2000);

      loader.load('беззубик.glb',function(gltf){
        clearInterval(stallTimer);
        model=gltf.scene;
        model.scale.set(0.38,0.38,0.38);
        model.position.y=0.4;
        model.rotation.x=-0.1;
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
      },function(xhr){
        if(xhr.total){
          var pct=Math.round(xhr.loaded/xhr.total*100);
          if(pct!==loadPct){
            loadPct=pct;
            if(pctEl)pctEl.textContent=pct+'%';
          }
        }else if(xhr.loaded>0){
          var loadedKb=Math.round(xhr.loaded/1024);
          if(loadedKb!==lastLoadedKb){
            lastLoadedKb=loadedKb;
            if(pctEl)pctEl.textContent=loadedKb+'KB';
          }
        }
      },function(err){
        console.error('Ошибка загрузки Беззубика:',err);
        clearInterval(stallTimer);
        loadAttempts++;
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

  // Start loading after a short delay so page renders first
  setTimeout(startLoad,300);

  function animate(){
    requestAnimationFrame(animate);
    var delta=Math.min(clock.getDelta(),0.05);
    idlePhase+=delta;
    if(mixer)mixer.update(delta);
    if(model){
      model.position.y=0.4+Math.sin(idlePhase*0.9)*0.025;
      model.rotation.z=Math.sin(idlePhase*0.4)*0.015;
      model.rotation.y=Math.PI+userRotY+Math.sin(idlePhase*0.25)*0.08;
      if(wingL)wingL.rotation.z=-0.05+Math.sin(idlePhase*2.5)*0.04;
      if(wingR)wingR.rotation.z=0.05-Math.sin(idlePhase*2.5)*0.04;
      if(headB&&mouseInside){
        targetHeadY+=(mouseX*0.3-targetHeadY)*0.05;
        headB.rotation.y=targetHeadY;
      }else if(headB){
        targetHeadY+=(Math.sin(idlePhase*0.6)*0.05-targetHeadY)*0.03;
        headB.rotation.y=targetHeadY;
      }
    }
    if(scene.userData.eyeMats){
      scene.userData.eyeMats.forEach(function(m){m.emissiveIntensity=0.3+clickR*0.7;});
    }
    if(clickR>0){clickR-=0.015;if(clickR<0)clickR=0;}
    fireflies.forEach(function(ff,i){
      var d=ff.userData;
      ff.position.x=d.offX+Math.sin(idlePhase*d.speed+d.phase)*d.rad;
      ff.position.z=d.offZ+Math.cos(idlePhase*d.speed*0.7+d.phase*1.3)*d.rad;
      ff.position.y+=Math.sin(idlePhase*2+d.phase)*0.002;
      ff.material.opacity=0.3+Math.sin(idlePhase*1.5+d.phase)*0.3;
    });
    shadow.material.opacity=0.15+Math.abs(Math.sin(idlePhase*0.9))*0.1;
    renderer.render(scene,camera);
  }
  animate();

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
