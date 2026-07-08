// ===== CONFETTI =====
function burstConfetti(cx,cy,count){
  count=count||55;
  var colors=['#e8a0b4','#c45a6c','#d4a56a','#f0c0c8','#e8c8a0','#8b1a2b','#ffd700','#ff6b8a','#fff','#7ac0a0','#ff9a5a'];
  for(var i=0;i<count;i++){
    var el=document.createElement('div');
    el.className='cp';
    var sz=2+Math.random()*9;
    var cl=colors[Math.floor(Math.random()*colors.length)];
    var ang=Math.random()*Math.PI*2;
    var dist=30+Math.random()*200;
    var tx=Math.cos(ang)*dist;
    var ty=Math.sin(ang)*dist-90;
    var shapes=['50%','2px','40% 60% 40% 60%','30% 70%'];
    var br=shapes[Math.floor(Math.random()*shapes.length)];
    el.style.cssText='left:'+cx+'px;top:'+cy+'px;width:'+sz+'px;height:'+(sz*(0.3+Math.random()))+'px;background:'+cl+';border-radius:'+br;
    document.body.appendChild(el);
    el.animate([
      {transform:'translate(0,0) rotate(0deg) scale(1)',opacity:1},
      {transform:'translate('+tx+'px,'+ty+'px) rotate('+(400+Math.random()*600)+'deg) scale('+(0.3+Math.random())+')',opacity:0}
    ],{duration:1200+Math.random()*1000,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'});
    setTimeout(function(){if(el.parentNode)el.remove()},2800);
  }
}

// ===== PAGE TRANSITION =====
(function(){
  var pt=document.getElementById('pageTransition');
  if(!pt)return;
  if(pt.classList.contains('active')){
    setTimeout(function(){pt.classList.remove('active')},80);
  }
  window.navigateTo=function(url){
    if(window._audioEl){
      try{
        sessionStorage.setItem('audioTime',window._audioEl.currentTime);
        sessionStorage.setItem('audioVolume',window._audioEl.volume);
        sessionStorage.setItem('audioPlaying',window._audioEl.paused?'0':'1');
      }catch(e){}
    }
    pt.classList.add('active');
    setTimeout(function(){window.location.href=url},420);
  };
})();
