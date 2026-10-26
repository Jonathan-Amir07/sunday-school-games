const IMAGE_WIDTH=1024, IMAGE_HEIGHT=681;
const pieces=[
  {id:'mark',name:'St. Mark the Evangelist',location:'Left outer panel',x:138,y:379,w:77,h:122,fact:'St. Mark, founder of the Church of Alexandria, has a place of honor on the left.'},
  {id:'annunciation',name:'The Annunciation',location:'Left of Mary',x:239,y:379,w:82,h:122,fact:'The Annunciation shows Gabriel bringing Mary the news of the Incarnation.'},
  {id:'mary',name:'The Theotokos',location:'Beside the Royal Door · left',x:338,y:379,w:82,h:122,fact:'Mary holding the Christ Child stands immediately left of the Royal Door as we face it.'},
  {id:'christ',name:'Christ Pantocrator',location:'Beside the Royal Door · right',x:612,y:379,w:85,h:122,fact:'Christ stands immediately right of the Royal Door as we face it.'},
  {id:'baptist',name:'St. John the Baptist',location:'Right of Christ',x:711,y:379,w:84,h:122,fact:'St. John the Baptist points toward Christ as His Forerunner and witness.'},
  {id:'george',name:'St. George',location:'Right outer panel',x:815,y:379,w:84,h:122,fact:'St. George is the patron saint shown on the outer right of this reference.'},
  {id:'apostlesLeft',name:'Six apostles · left',location:'Upper left register',x:138,y:223,w:278,h:78,fact:'The apostles flank the Last Supper, six on each side.'},
  {id:'supper',name:'The Last Supper',location:'Above the Royal Door',x:438,y:237,w:159,h:64,fact:'The Last Supper is centered directly above the Royal Door.'},
  {id:'apostlesRight',name:'Six apostles · right',location:'Upper right register',x:608,y:223,w:284,h:78,fact:'The second group of six apostles completes the upper register.'},
  {id:'golgotha',name:'The Golgotha scene',location:'At the summit',x:431,y:8,w:167,h:174,fact:'The Crucifixion is at the summit, with Mary and St. John on either side.'}
];
const byId=Object.fromEntries(pieces.map(p=>[p.id,p]));
const board=document.getElementById('board'),tray=document.getElementById('tray'),feedback=document.getElementById('feedback');
let selected=null,placed=new Set(),suppressClickUntil=0;
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function setFeedback(message,type=''){feedback.textContent=message;feedback.className='feedback '+type}
function spriteStyle(p,width){const scale=width/p.w;return {width,height:p.h*scale,backgroundSize:`${IMAGE_WIDTH*scale}px ${IMAGE_HEIGHT*scale}px`,backgroundPosition:`-${p.x*scale}px -${p.y*scale}px`}}
function render(){board.replaceChildren();tray.replaceChildren();for(const p of pieces){const slot=document.createElement('button');slot.type='button';slot.className='slot'+(p.w<100?' small':'')+(placed.has(p.id)?' placed':'');slot.dataset.id=p.id;slot.setAttribute('aria-label',`Place ${p.name}: ${p.location}`);slot.style.left=`${100*p.x/IMAGE_WIDTH}%`;slot.style.top=`${100*p.y/IMAGE_HEIGHT}%`;slot.style.width=`${100*p.w/IMAGE_WIDTH}%`;slot.style.height=`${100*p.h/IMAGE_HEIGHT}%`;if(!placed.has(p.id)){const inner=document.createElement('span');inner.className='slot-inner';inner.innerHTML=`<span class="slot-number">✣</span><span class="slot-label">PLACE HERE</span>`;slot.append(inner)}slot.addEventListener('click',()=>place(p.id));slot.addEventListener('dragover',e=>e.preventDefault());slot.addEventListener('drop',e=>{e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id){selected=id;place(p.id)}});board.append(slot)}for(const p of currentOrder){const card=document.createElement('button');card.type='button';card.className='piece'+(placed.has(p.id)?' hidden':'')+(selected===p.id?' selected':'');card.dataset.id=p.id;card.setAttribute('aria-label',`${p.name}. ${p.location}`);card.draggable=true;const art=document.createElement('span');art.className='piece-art';const maxWidth=p.w>150?160:72;const s=spriteStyle(p,maxWidth);Object.assign(art.style,{width:`${s.width}px`,height:`${s.height}px`,backgroundSize:s.backgroundSize,backgroundPosition:s.backgroundPosition});card.append(art);const name=document.createElement('span');name.className='piece-name';name.textContent=p.name;card.append(name);const loc=document.createElement('span');loc.className='piece-location';loc.textContent=p.location;card.append(loc);card.addEventListener('click',()=>select(p.id));card.addEventListener('dragstart',e=>{selected=p.id;e.dataTransfer.setData('text/plain',p.id);e.dataTransfer.effectAllowed='move'});card.addEventListener('pointerdown',e=>pointerStart(e,p.id));tray.append(card)}document.getElementById('progressText').textContent=`${placed.size} of ${pieces.length} placed`;document.getElementById('progressBar').style.width=`${placed.size/pieces.length*100}%`;document.getElementById('remainingText').textContent=`${pieces.length-placed.size} icons remaining`}
let currentOrder=shuffle(pieces);
function select(id){if(placed.has(id))return;selected=selected===id?null:id;render();if(selected)setFeedback(`Now find the place for ${byId[selected].name}.`);else setFeedback('Choose an icon to begin.')}
function place(slotId){if(!selected){setFeedback('Choose an icon from below first.');return}if(placed.has(slotId))return;if(selected!==slotId){const slot=board.querySelector(`[data-id="${slotId}"]`);slot?.classList.add('wrong');setTimeout(()=>slot?.classList.remove('wrong'),400);setFeedback('Not quite. Look at the completed picture and try another place.','error');return}const p=byId[selected];placed.add(selected);selected=null;render();setFeedback(`Correct! ${p.fact}`,'success');if(placed.size===pieces.length)setTimeout(()=>document.getElementById('winDialog').showModal(),600)}
function reset(){placed=new Set();selected=null;currentOrder=shuffle(pieces);render();setFeedback('Choose an icon to begin.');document.getElementById('winDialog').close()}
function pointerStart(e,id){
  if(e.pointerType==='mouse'||placed.has(id))return;
  const origin=e.currentTarget,sx=e.clientX,sy=e.clientY;
  const boardScroll=document.getElementById('boardScroll');
  let ghost=null,frame=0,x=sx,y=sy,moved=false;
  const edgeSpeed=(position,size)=>{
    const edge=96,maxSpeed=19;
    position=Math.max(0,Math.min(size,position));
    if(position<edge)return -maxSpeed*(1-position/edge);
    if(position>size-edge)return maxSpeed*(1-(size-position)/edge);
    return 0;
  };
  const highlight=()=>{
    const under=document.elementFromPoint(x,y)?.closest('.slot');
    board.querySelectorAll('.slot.targeted').forEach(slot=>slot.classList.remove('targeted'));
    under?.classList.add('targeted');
  };
  const autoScroll=()=>{
    if(!ghost)return;
    const vertical=edgeSpeed(y,window.innerHeight);
    if(vertical)window.scrollBy(0,vertical);
    const bounds=boardScroll.getBoundingClientRect();
    if(y>=bounds.top-24&&y<=bounds.bottom+24){
      const horizontal=edgeSpeed(x-bounds.left,bounds.width);
      if(horizontal)boardScroll.scrollLeft+=horizontal;
    }
    highlight();
    frame=requestAnimationFrame(autoScroll);
  };
  const move=ev=>{
    x=ev.clientX;y=ev.clientY;
    if(Math.hypot(x-sx,y-sy)<9&&!ghost)return;
    if(!ghost){
      moved=true;
      ghost=origin.cloneNode(true);
      ghost.classList.add('drag-ghost');
      document.body.append(ghost);
      selected=id;
      updateSelectionDock();
      origin.style.opacity='.35';
      document.documentElement.classList.add('is-dragging');
      frame=requestAnimationFrame(autoScroll);
    }
    ghost.style.left=x+'px';ghost.style.top=y+'px';
    highlight();
  };
  const end=ev=>{
    origin.removeEventListener('pointermove',move);
    origin.removeEventListener('pointerup',end);
    origin.removeEventListener('pointercancel',end);
    cancelAnimationFrame(frame);
    document.documentElement.classList.remove('is-dragging');
    board.querySelectorAll('.slot.targeted').forEach(slot=>slot.classList.remove('targeted'));
    if(moved){
      suppressClickUntil=performance.now()+350;
      ghost.remove();origin.style.opacity='';
      if(ev.type==='pointercancel'){render();return}
      const under=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.slot');
      if(under)place(under.dataset.id);else render();
    }
  };
  origin.setPointerCapture(e.pointerId);
  origin.addEventListener('pointermove',move);
  origin.addEventListener('pointerup',end);
  origin.addEventListener('pointercancel',end);
}
document.getElementById('resetButton').addEventListener('click',reset);document.getElementById('playAgainButton').addEventListener('click',reset);
const referenceDialog=document.getElementById('referenceDialog'),teacherDialog=document.getElementById('teacherDialog');
document.getElementById('referenceButton').addEventListener('click',()=>referenceDialog.showModal());document.getElementById('winReferenceButton').addEventListener('click',()=>{document.getElementById('winDialog').close();referenceDialog.showModal()});document.getElementById('teacherButton').addEventListener('click',()=>teacherDialog.showModal());document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
const gameUrl=location.origin+location.pathname;const link=document.getElementById('gameLink');link.href=gameUrl;link.textContent=gameUrl;document.getElementById('copyButton').addEventListener('click',async()=>{await navigator.clipboard.writeText(gameUrl);document.getElementById('copyButton').textContent='Copied!'});
function updateSelectionDock(){
  const dock=document.getElementById('selectionDock');
  dock.hidden=!selected;
  if(selected)document.getElementById('selectedName').textContent=byId[selected].name;
}
const baseRender=render;
render=()=>{baseRender();updateSelectionDock()};
const baseSelect=select;
select=id=>{
  if(performance.now()<suppressClickUntil)return;
  baseSelect(id);
  if(selected&&matchMedia('(max-width: 600px)').matches){
    document.getElementById('boardScroll').scrollIntoView({behavior:'smooth',block:'center'});
  }
};
document.getElementById('changeSelection').addEventListener('click',()=>{
  selected=null;
  render();
  tray.scrollIntoView({behavior:'smooth',block:'start'});
});
render();
