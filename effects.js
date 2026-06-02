// ===== FLOATING BG ELEMENTS =====
(function(){
  var symbols=['🌸','🌺','🌷','🌹','❤️','💕','✨','⭐','🌿','🦋'];
  for(var i=0;i<14;i++){
    var el=document.createElement('div');
    el.className='float-el';
    el.textContent=symbols[i%symbols.length];
    var l=Math.random()*94+3;
    var t=Math.random()*90+5;
    var dur=8+Math.random()*10;
    el.style.cssText='left:'+l+'%;top:'+t+'%;font-size:'+(14+Math.random()*18)+'px;--d:'+dur+'s;animation-delay:'+(Math.random()*5)+'s';
    document.body.appendChild(el);
  }
})();

// ===== LOADING =====
if(document.getElementById('loading')){(function(){
  var budP=document.querySelectorAll('.bud-p');
  var lf=document.getElementById('lf');
  var lt=document.getElementById('lt');
  var sparkleC=document.getElementById('sparkles');
  var loading=document.getElementById('loading');

  // Sparkles
  for(var i=0;i<22;i++){
    var s=document.createElement('div');
    s.className='sparkle';
    var ang=Math.random()*Math.PI*2;
    var dist=60+Math.random()*140;
    var cx=180,cy=80;
    s.style.left=(cx+Math.cos(ang)*dist)+'px';
    s.style.top=(cy+Math.sin(ang)*dist)+'px';
    s.style.animationDelay=(Math.random()*2.5)+'s';
    s.style.animationDuration=(1.8+Math.random()*1.8)+'s';
    var sz=3+Math.random()*6;
    s.style.width=s.style.height=sz+'px';
    s.style.background=Math.random()>.5?'#fff8e0':'#ffe0f0';
    s.style.color=s.style.background;
    sparkleC.appendChild(s);
  }

  var msgs=['Бутон раскрывается...','Лепестки распускаются...','Цветок наполняется красками...','Ещё чуть-чуть...','Волшебный бутон расцвёл!'];
  var i=0;
  function nextBud(){
    if(i>=budP.length){
      lf.style.width='100%';
      document.querySelector('.bud-stem').style.display='none';
      [].forEach.call(document.querySelectorAll('.bud-stem-l'),function(e){e.style.display='none'});
      [].forEach.call(document.querySelectorAll('.bud-sep'),function(e){e.style.display='none'});
      [].forEach.call(document.querySelectorAll('.bud-p'),function(e){e.style.display='none'});
      sessionStorage.setItem('playMusic','1');
      setTimeout(function(){
        loading.classList.add('hidden');
        window.navigateTo('gift.html');
      },300);
      return;
    }
    budP[i].classList.add('in');
    lf.style.width=((i+1)/budP.length*100)+'%';
    lt.textContent=msgs[i]||'Бутон раскрывается...';
    i++;
    setTimeout(nextBud,220+Math.random()*140);
  }
  setTimeout(nextBud,300+Math.random()*400);
})();}

// ===== BG CANVAS =====
if(document.getElementById('bgC')){(function(){
  var c=document.getElementById('bgC');
  var x=c.getContext('2d');
  var w,h;
  function resize(){
    var r=c.parentElement.getBoundingClientRect();
    w=c.width=Math.floor(r.width);
    h=c.height=Math.floor(r.height);
  }
  resize();
  window.addEventListener('resize',resize);
  var dots=[];
  for(var i=0;i<40;i++){
    dots.push({x:Math.random()*w,y:Math.random()*h,r:1+Math.random()*2.5,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,o:.15+Math.random()*.3});
  }
  function anim(){
    x.clearRect(0,0,w,h);
    for(var i=0;i<dots.length;i++){
      var d=dots[i];
      d.x+=d.vx;d.y+=d.vy;
      if(d.x<0)d.x=w;if(d.x>w)d.x=0;
      if(d.y<0)d.y=h;if(d.y>h)d.y=0;
      x.fillStyle='rgba(200,180,170,'+d.o+')';
      x.beginPath();x.arc(d.x,d.y,d.r,0,Math.PI*2);x.fill();
    }
    requestAnimationFrame(anim);
  }
  anim();
})();}

// ===== BUTTERFLIES =====
(function(){
  var bfs=[].slice.call(document.querySelectorAll('.bfly'));
  if(!bfs.length)return;
  bfs.forEach(function(b,i){
    var dur=10+Math.random()*14;
    var x=5+Math.random()*90;
    var y=5+Math.random()*90;
    var sway=20+Math.random()*60;
    b.style.setProperty('--bx',x+'%');b.style.setProperty('--by',y+'%');
    b.style.setProperty('--sway',sway+'px');b.style.setProperty('--dur',dur+'s');
    b.style.animationDelay=(i*2+Math.random()*3)+'s';
  });
})();

// ===== FALLING STARS / SPARKLES =====
(function(){
  var cont=document.getElementById('starsContainer');
  if(!cont)return;
  var stars=[];
  var starCount=Math.floor(window.innerWidth/30)+8;
  for(var i=0;i<starCount;i++){
    var el=document.createElement('div');
    el.className='star';
    var sz=2+Math.random()*4;
    var l=Math.random()*100;
    var dur=3+Math.random()*5;
    var del=Math.random()*8;
    var drift=Math.random()*80-40;
    el.style.cssText='left:'+l+'%;width:'+sz+'px;height:'+sz+'px;animation-duration:'+dur+'s;animation-delay:'+del+'s;--drift:'+drift+'px';
    cont.appendChild(el);
    stars.push({el:el,l:l,dur:dur,del:del});
  }
})();

// ===== SCROLL PROGRESS & TOP BUTTON =====
(function(){
  var prog=document.getElementById('scrollProg');
  var topBtn=document.getElementById('scrollTop');
  if(!prog&&!topBtn)return;
  var ticking=false;
  function onScroll(){
    var scrollTop=window.pageYOffset||document.documentElement.scrollTop;
    var scrollH=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    var p=scrollH>0?Math.min(scrollTop/scrollH,1):0;
    if(prog)prog.style.transform='scaleX('+p+')';
    if(topBtn)topBtn.classList.toggle('show',scrollTop>400);
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){requestAnimationFrame(function(){onScroll();ticking=false});ticking=true}
  },{passive:true});
  if(topBtn){
    topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
  }
  onScroll();
})();

// ===== SAKURA PETALS =====
(function(){
  var cont=document.getElementById('petals');
  if(!cont)return;
  for(var i=0;i<25;i++){
    var p=document.createElement('div');
    p.className='petal';
    var size=10+Math.random()*14;
    var sway=-60+Math.random()*120;
    var spin=100+Math.random()*260;
    var dur=8+Math.random()*12;
    var del=Math.random()*20;
    var left=Math.random()*100;
    p.style.cssText='left:'+left+'%;width:'+size+'px;height:'+size+'px;--sway:'+sway+'px;--spin:'+spin+'deg;animation-duration:'+dur+'s;animation-delay:'+del+'s;';
    cont.appendChild(p);
  }
})();
