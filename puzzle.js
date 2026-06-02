// ===== PAINTBRUSH =====
function initPaintbrush(){
  var c=document.getElementById('pbC');
  if(!c)return;
  var ctx=c.getContext('2d');
  var w,h,heartCx,heartCy,heartS;
  var pieces=[],placedCount=0,completed=false;
  var dragPiece=-1,dragOffX=0,dragOffY=0;

  // Heart parametric
  function heartXY(t,cx,cy,s){
    return {
      x:cx+16*Math.pow(Math.sin(t),3)*s,
      y:cy-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*s
    };
  }

  function initPuzzle(){
    heartS=Math.min(w,h)/32;
    heartCx=w*.48;heartCy=h*.48;
    pieces=[];
    placedCount=0;completed=false;
    var n=6,cols=['#e06080','#d05070','#e87090','#c04565','#f08098','#d06078'];
    for(var i=0;i<n;i++){
      var a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2;
      var pts=[];
      // Center point
      pts.push({x:heartCx,y:heartCy});
      // Points along heart boundary for this segment
      var segPts=12;
      for(var j=0;j<=segPts;j++){
        var t=a0+(a1-a0)*j/segPts;
        var hp=heartXY(t,0,0,1);
        // Stretch for better coverage
        pts.push({x:heartCx+hp.x*heartS,y:heartCy+hp.y*heartS});
      }
      // Scatter position in a ring around canvas
      var angle=i/n*Math.PI*2+Math.random()*.4;
      var dist=Math.min(w,h)*.28+Math.random()*Math.min(w,h)*.06;
      var sx=w*.5+Math.cos(angle)*dist;
      var sy=h*.5+Math.sin(angle)*dist*.7;
      // Clamp to canvas
      sx=Math.max(40,Math.min(w-40,sx));
      sy=Math.max(40,Math.min(h-40,sy));
      pieces.push({
        pts:pts,color:cols[i],targetIdx:i,
        cx:sx,cy:sy,placed:false,
        ox:0,oy:0,bx:0,by:0,// bounding box offset from center
        w:0,h:0
      });
      // Compute bounding box
      var minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
      for(var j=0;j<pts.length;j++){
        if(pts[j].x<minX)minX=pts[j].x;
        if(pts[j].x>maxX)maxX=pts[j].x;
        if(pts[j].y<minY)minY=pts[j].y;
        if(pts[j].y>maxY)maxY=pts[j].y;
      }
      pieces[i].ox=heartCx-minX;pieces[i].oy=heartCy-minY;
      pieces[i].w=maxX-minX;pieces[i].h=maxY-minY;
    }
    draw();
  }

  function getTargetPos(idx){
    // Target is the assembled position - the pieces are already defined with heart-relative coords
    // The target of each piece is just to return to its heart position
    return {x:heartCx,y:heartCy};
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    // Background
    var grad=ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,'#faf4f0');grad.addColorStop(1,'#f0e8e4');
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    // Grid
    ctx.strokeStyle='rgba(200,188,175,.1)';ctx.lineWidth=.5;
    for(var i=0;i<w;i+=28){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke()}
    for(var i=0;i<h;i+=28){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke()}

    // Draw target outline (faint heart)
    ctx.save();
    ctx.globalAlpha=.15;ctx.strokeStyle='#e06080';ctx.lineWidth=2;ctx.setLineDash([5,7]);
    ctx.beginPath();
    for(var t=0;t<60;t++){
      var a=t/60*Math.PI*2;
      var hp=heartXY(a,heartCx,heartCy,heartS);
      t===0?ctx.moveTo(hp.x,hp.y):ctx.lineTo(hp.x,hp.y);
    }
    ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    ctx.restore();

    // Draw placed pieces — seamless
    if(placedCount>0){
      ctx.save();
      ctx.globalAlpha=1;
      ctx.shadowColor='rgba(200,80,100,.3)';ctx.shadowBlur=12;
      for(var i=0;i<pieces.length;i++){
        if(!pieces[i].placed)continue;
        var p=pieces[i];
        ctx.beginPath();
        for(var j=0;j<p.pts.length;j++){
          j===0?ctx.moveTo(p.pts[j].x,p.pts[j].y):ctx.lineTo(p.pts[j].x,p.pts[j].y);
        }
        ctx.closePath();
        ctx.fillStyle=p.color;ctx.fill();
      }
      ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.2;
      ctx.beginPath();
      for(var i=0;i<pieces.length;i++){
        if(!pieces[i].placed)continue;
        var p=pieces[i];
        for(var j=0;j<p.pts.length;j++){
          j===0?ctx.moveTo(p.pts[j].x,p.pts[j].y):ctx.lineTo(p.pts[j].x,p.pts[j].y);
        }
        ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
    }
    // Draw unplaced pieces (except dragged piece)
    for(var i=0;i<pieces.length;i++){
      if(!pieces[i].placed&&i!==dragPiece)drawPiece(i);
    }
    // Draw dragged piece on top
    if(dragPiece>=0&&!pieces[dragPiece].placed)drawPiece(dragPiece);
  }

  function drawPiece(idx){
    var p=pieces[idx];
    if(!p||!p.pts||p.pts.length<3)return;
    ctx.save();
    ctx.globalAlpha=1;
    if(p.snapGlow){ctx.shadowColor='rgba(255,180,200,.5)';ctx.shadowBlur=30}
    else ctx.shadowColor='rgba(200,100,120,.15)';ctx.shadowBlur=8;

    ctx.beginPath();
    for(var j=0;j<p.pts.length;j++){
      var ox=p.pts[j].x-p.pts[0].x;
      var oy=p.pts[j].y-p.pts[0].y;
      j===0?ctx.moveTo(p.cx+ox,p.cy+oy):ctx.lineTo(p.cx+ox,p.cy+oy);
    }
    ctx.closePath();
    ctx.fillStyle=p.color;ctx.fill();
    ctx.shadowColor='rgba(200,80,100,.2)';ctx.shadowBlur=10;
    ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1.5;ctx.stroke();
    // Highlight dot
    ctx.shadowBlur=0;
    var cx2=p.cx-p.ox+p.w/2,cy2=p.cy-p.oy+p.h/2;
    ctx.fillStyle='rgba(255,255,255,.25)';
    ctx.beginPath();ctx.arc(cx2,cy2,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.15)';
    ctx.beginPath();ctx.arc(cx2,cy2-12,3,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function getPos(e){
    var rect=c.getBoundingClientRect();
    if(e.touches)return {x:e.touches[0].clientX-rect.left,y:e.touches[0].clientY-rect.top};
    return {x:e.clientX-rect.left,y:e.clientY-rect.top};
  }

  function hitTest(mx,my){
    for(var i=pieces.length-1;i>=0;i--){
      if(pieces[i].placed)continue;
      var p=pieces[i];
      ctx.beginPath();
      for(var j=0;j<p.pts.length;j++){
        var ox=p.pts[j].x-p.pts[0].x,oy=p.pts[j].y-p.pts[0].y;
        var px=p.cx+ox,py=p.cy+oy;
        j===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
      }
      ctx.closePath();
      if(ctx.isPointInPath(mx,my))return i;
    }
    return -1;
  }

  function startDrag(e){
    if(completed||snapAnimating)return;
    var pos=getPos(e);
    var idx=hitTest(pos.x,pos.y);
    if(idx>=0){
      dragPiece=idx;
      dragOffX=pos.x-pieces[idx].cx;
      dragOffY=pos.y-pieces[idx].cy;
      pieces[idx]._z=Date.now();
      c.classList.add('grabbing');
    }
  }

  function moveDrag(e){
    if(dragPiece<0||!pieces[dragPiece])return;
    e.preventDefault();
    var pos=getPos(e);
    var p=pieces[dragPiece];
    p.cx=pos.x-dragOffX;
    p.cy=pos.y-dragOffY;
    var dx=p.cx-heartCx,dy=p.cy-heartCy;
    p.snapGlow=Math.sqrt(dx*dx+dy*dy)<Math.min(w,h)*.18;
    draw();
  }

  function endDrag(e){
    if(dragPiece<0||snapAnimating)return;
    var idx=dragPiece;
    dragPiece=-1;
    c.classList.remove('grabbing');
    var p=pieces[idx];
    var dx=p.cx-heartCx,dy=p.cy-heartCy;
    p.snapGlow=false;
    if(Math.sqrt(dx*dx+dy*dy)<Math.min(w,h)*.12){
      snapAnimating=true;
      var startX=p.cx,startY=p.cy;
      var targetX=heartCx,targetY=heartCy;
      var startTime=performance.now(),duration=280;
      var anim=function(t){
        var el=Math.min((t-startTime)/duration,1);
        var ease=1-Math.pow(1-el,3);
        p.cx=startX+(targetX-startX)*ease;
        p.cy=startY+(targetY-startY)*ease;
        draw();
        if(el<1){requestAnimationFrame(anim)}else{
          p.cx=targetX;p.cy=targetY;
          p.placed=true;placedCount++;
          snapAnimating=false;
          draw();
          if(placedCount===pieces.length){
            completed=true;
            setTimeout(function(){showMsg('❤️ Сердце собрано! С днём рождения, Катя! ❤️');burstConfetti(window.innerWidth/2,window.innerHeight/2,60)
              var fi=0;var iv=setInterval(function(){fi++;if(fi>10){clearInterval(iv);return}
                burstConfetti(window.innerWidth/2+Math.random()*200-100,window.innerHeight/2+Math.random()*150-75,20+Math.floor(Math.random()*30))},350);
            },300);
          }else{
            if(placedCount===2){
              showMsg('🎉 2 кусочка! Почти половина!');
              burstConfetti(window.innerWidth/2,window.innerHeight/2,40);
            }else{
              showMsg('+1 кусочек! ('+placedCount+'/'+pieces.length+')');
              burstConfetti(lastCX||window.innerWidth/2,lastCY||window.innerHeight/2,15);
            }
          }
        }
      };
      requestAnimationFrame(anim);
    }else{draw()}
  }

  var msgTimeout,lastCX=0,lastCY=0,snapAnimating=false;
  function showMsg(text){
    var el=document.getElementById('pbMsg');
    if(!el)return;
    el.textContent=text;el.classList.add('show');
    if(msgTimeout)clearTimeout(msgTimeout);
    msgTimeout=setTimeout(function(){el.classList.remove('show')},2500);
  }

  function resize(){
    var rect=c.parentElement.getBoundingClientRect();
    w=c.width=Math.floor(rect.width);
    var cs=getComputedStyle(c);
    h=c.height=parseInt(cs.height)||420;
    initPuzzle();
  }

  dragPiece=-1;
  c.addEventListener('mousedown',function(e){startDrag(e)});
  c.addEventListener('mousemove',function(e){if(dragPiece>=0)e.preventDefault();moveDrag(e)});
  c.addEventListener('mouseup',function(e){endDrag(e)});
  c.addEventListener('mouseleave',function(e){if(dragPiece>=0)endDrag(e)});
  c.addEventListener('touchstart',function(e){e.preventDefault();startDrag(e)},{passive:false});
  c.addEventListener('touchmove',function(e){e.preventDefault();moveDrag(e)},{passive:false});
  c.addEventListener('touchend',function(e){endDrag(e)});
  window.addEventListener('resize',resize);
  resize();
}

// Auto-init paintbrush on inside page
if(document.getElementById('pbC')){
  setTimeout(initPaintbrush,300);
}

// ===== THREE.JS TOOTHLESS =====
