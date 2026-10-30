(() => {
'use strict';
const $=s=>document.querySelector(s), main=$('#main'), C=window.PracticeCore, all=window.GESTURE_LESSONS;
const KEY='bism-gesture-practice-v2';
let prefs={platform:'ios',sound:false,volume:.25,large:false,contrast:false,touch:false}, history=[], run=null, current=null, cleanup=null, audio=null, mediaUrl=null;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved){for(const k of ['sound','large','contrast','touch'])if(typeof saved.prefs?.[k]==='boolean')prefs[k]=saved.prefs[k];if(['ios','android'].includes(saved.prefs?.platform))prefs.platform=saved.prefs.platform;if(Number.isFinite(saved.prefs?.volume))prefs.volume=Math.max(0,Math.min(1,saved.prefs.volume));if(Array.isArray(saved.history))history=saved.history.slice(-300);}}catch{$('#storage-note').hidden=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify({prefs,history}));$('#storage-note').hidden=true;}catch{$('#storage-note').hidden=false;}}
function escape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function available(){return all.filter(l=>l.platforms.includes(prefs.platform));}
function apply(){document.documentElement.classList.toggle('large',prefs.large);document.documentElement.classList.toggle('contrast',prefs.contrast);}
function clear(){if(cleanup){cleanup();cleanup=null;}const player=$('audio');if(player)player.pause();if(mediaUrl){URL.revokeObjectURL(mediaUrl);mediaUrl=null;}const dialog=$('dialog');if(dialog?.open)dialog.close();}
function focus(selector='h1'){const el=$(selector)||main;el.focus({preventScroll:true});window.scrollTo(0,0);}
function status(text){$('#status').textContent=text;}
function unlock(){if(!prefs.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audio=audio||new AC();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
function ding(){if(!prefs.sound)return;unlock();if(!audio)return;try{[660,880].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.13;o.frequency.value=hz;g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(Math.max(.001,prefs.volume*.15),t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.4);});}catch{}}
const heading=text=>`<h1 tabindex="-1">${escape(text)}</h1>`;
const button=(action,text,primary=false)=>`<button data-action="${action}" class="${primary?'primary':''}">${text}</button>`;
function details(text){return text?`<details><summary>More guidance</summary><p>${escape(text)}</p></details>`:'';}
function home(){main.innerHTML=heading('Choose an activity')+`<nav class="home-grid" aria-label="Activities"><a class="button" href="#tutorial">Guided Tutorial</a><a class="button" href="#lessons">Lessons</a><a class="button" href="#quiz">Quiz / Testing Area</a><a class="button" href="#settings">Settings</a></nav>`;}
function tutorialIntro(){main.innerHTML=heading('Guided Tutorial')+`<p>Keep your screen reader on.</p><p>We’ll guide you through four basic gestures. No need to choose a lesson.</p>${button('start-tutorial','Start tutorial',true)}`;}
function lessonList(){main.innerHTML=heading('Lessons')+`<label class="field" for="lesson-choice">Choose a gesture<select id="lesson-choice">${available().map(l=>`<option value="${l.id}">${escape(l.title)}</option>`).join('')}</select></label>${button('start-lesson','Start lesson',true)}`;}
function quizIntro(){main.innerHTML=heading('Quiz / Testing Area')+`<p>Five random tasks. No timer.</p><p>Use “Help me learn” whenever you need it.</p><p class="note">Some system actions can only be confirmed by you. This is practice, not a certified test.</p>${button('start-quiz','Start quiz',true)}`;}
function settings(){main.innerHTML=heading('Settings')+`<label class="field" for="platform">Phone<select id="platform"><option value="ios" ${prefs.platform==='ios'?'selected':''}>iPhone · VoiceOver</option><option value="android" ${prefs.platform==='android'?'selected':''}>Android · TalkBack</option></select></label>${[['sound','Reward sounds'],['large','Larger text'],['contrast','Black-and-white controls'],['touch','Offer touch-pad practice']].map(([key,label])=>`<label class="setting"><input type="checkbox" data-pref="${key}" ${prefs[key]?'checked':''}>${label}</label>`).join('')}<label class="field" for="volume">Reward volume<input id="volume" type="range" min="0" max="100" value="${prefs.volume*100}"></label>${button('sound-test','Test reward sound')}<details><summary>About touch-pad practice</summary><p>The screen reader may capture gestures before this page receives them. The normal exercises work with your screen reader on. Touch-pad results check movements only.</p></details><details><summary>Install on iPhone</summary><p>Open the HTTPS site in Safari. Choose Share, Add to Home Screen, then Add. Keep Open as Web App on if shown. Open online once before using offline.</p></details><details><summary>Progress and privacy</summary><p>Practice records stay on this device. The earlier Garden progress is preserved separately. No class board or account is used.</p></details><p id="offline-info" class="note"></p>`;offlineInfo();}
function start(l,flow='lesson'){clear();current={lesson:l,flow,help:false,done:false,mode:'native',kind:null};renderExercise();}
function samples(){return `<div class="sample-buttons" role="group" aria-label="Drinks"><button data-sample="Tea">Tea</button><button data-sample="Coffee">Coffee</button><button data-sample="Water">Water</button></div>`;}
function nativeExercise(l){
if(l.type==='activate')return button('activate','Play',true);
if(l.type==='adjust')return `<label class="field" for="practice-slider">Practice volume<input id="practice-slider" type="range" min="0" max="100" step="10" value="50"></label><output id="slider-value" for="practice-slider">50 percent</output>`;
if(['explore','navigate','group'].includes(l.type))return samples();
if(l.type==='read')return `<div class="sample-text"><p>The garden is quiet today.</p><p>The birds are singing.</p><p>There is time to enjoy the morning.</p></div>`;
if(l.type==='scroll')return `<div class="scroll-demo" tabindex="0" role="region" aria-label="Practice days list"><p>Monday</p><p>Tuesday</p><p>Wednesday</p><p>Thursday</p><p>Friday</p><p>Saturday</p><p>Sunday</p></div>`;
if(l.type==='dismiss')return `${button('open-alert','Open practice alert')}<dialog aria-labelledby="alert-title"><h2 id="alert-title">Practice alert</h2><p>Try the two-finger Z gesture. Or choose Close alert.</p>${button('close-alert','Close alert')}</dialog>`;
if(l.type==='media')return `<label for="practice-audio">Practice audio</label><audio id="practice-audio" controls loop aria-label="Practice audio"></audio>`;
return '<p>Practice on your phone with a trainer, then return here.</p>';
}
function renderExercise(){
clear();const s=current,l=s.lesson,testing=s.flow==='quiz'&&!s.help;
const count=s.flow==='tutorial'?`Tutorial ${run.index+1} of ${run.tasks.length}`:s.flow==='quiz'?`Task ${run.index+1} of ${run.tasks.length}`:'Lesson';
main.innerHTML=`<p class="context">${count}${s.help?' · Guided practice':''}</p>`+heading(testing?'Try this task':l.title)+`<p id="instruction" tabindex="-1">${escape(testing?l.task:l.instruction)}</p>${l.type==='system'?`<p class="note">${escape(l.note)}</p>`:''}<section class="exercise" aria-label="Practice area">${s.mode==='touch'?'<div id="touch-pad" class="touch-pad" tabindex="0" role="region" aria-label="Touch practice pad">Practice the movement here.</div>':nativeExercise(l)}</section><div id="result" class="feedback" role="status" aria-live="polite" aria-atomic="true"></div><div id="exercise-actions" class="actions">${!['activate','adjust'].includes(l.type)||s.mode==='touch'?button('report','I practiced it'):''}${testing?button('help','Help me learn'):button('repeat-instruction','Repeat instruction')}${testing?button('skip','Skip this task'):''}</div>${prefs.touch?`<div class="actions">${button('mode',s.mode==='touch'?'Use screen-reader exercise':'Use touch pad')}</div><p class="note">${s.mode==='touch'?'The pad checks movement only. The screen reader may intercept touches. “I practiced it” records your own confirmation.':'Screen-reader exercises are the default.'}</p>`:''}${l.type!=='system'?details(l.note):''}`;
if(s.mode==='touch'&&window.GestureEngine)cleanup=GestureEngine.attach($('#touch-pad'),{onGesture:r=>{if(current!==s||s.done)return;if(GestureEngine.matches(r,l.gesture))complete('observed','Touch pattern recognized. System action not checked.');else $('#result').textContent='Try again, or use the screen-reader exercise.';},onActivity:({points,active})=>{const pad=$('#touch-pad');if(!pad)return;pad.querySelectorAll('.finger').forEach(e=>e.remove());if(active)points.forEach(p=>{const dot=document.createElement('span');dot.className='finger';dot.style.left=p.x+'px';dot.style.top=p.y+'px';dot.setAttribute('aria-hidden','true');pad.append(dot);});}});
if(s.mode==='native'&&l.type==='media')$('#practice-audio').src=makeAudio();
if(s.mode==='native'&&l.type==='dismiss'){$('dialog').addEventListener('close',()=>{if(current!==s||s.done)return;$('#result').textContent='Alert closed. Confirm below if you practiced the gesture.';$('[data-action="open-alert"]')?.focus();});}
focus();
}
function complete(kind,message){
if(!current||current.done)return;current.done=true;current.kind=kind;if(cleanup){cleanup();cleanup=null;}
const modeControl=$('[data-action="mode"]');if(modeControl)modeControl.parentElement.hidden=true;
$('#result').textContent=message||'Practice recorded. You confirmed this yourself.';
if(current.help){$('#exercise-actions').innerHTML=button('retry','Try the task again',true);$('#exercise-actions button').focus({preventScroll:true});ding();return;}
history.push({lesson:current.lesson.id,platform:prefs.platform,kind,flow:current.flow,at:new Date().toISOString()});history=history.slice(-300);save();
if(current.flow==='quiz')run=C.record(run,kind);
$('#exercise-actions').innerHTML=button('next',current.flow==='lesson'?'Back to lessons':'Continue',true);
// Keep a usable focus location when replacing the confirmation controls.
$('#exercise-actions button').focus({preventScroll:true});
ding();
}
function next(){const flow=current.flow;clear();if(flow==='lesson'){location.hash='lessons';return;}if(flow==='tutorial')run.index++;if(run.index>=run.tasks.length){finish(flow);return;}start(all.find(l=>l.id===run.tasks[run.index]),flow);}
function finish(flow){clear();current=null;if(flow==='tutorial'){main.innerHTML=heading('Tutorial complete')+'<p>You practiced four basic gestures.</p><div class="actions"><a class="button primary" href="#lessons">Choose a lesson</a><a class="button" href="#home">Home</a></div>';}
else{const summary=C.summary(run);main.innerHTML=heading('Practice summary')+`<p>${summary.practiced} tasks practiced. ${summary.review.length} to review.</p><p class="note">${summary.observed} browser actions or touch patterns observed. ${summary.reported} confirmed by you. System gestures cannot be graded by this app.</p>${summary.review.length?'<h2>Review these lessons</h2><ul class="review-list">'+summary.review.map(id=>`<li><a href="#lesson/${id}">${escape(all.find(l=>l.id===id).title)}</a></li>`).join('')+'</ul>':''}<div class="actions">${button('start-quiz','Try another quiz',true)}<a class="button" href="#home">Home</a></div>`;}focus();}
function makeAudio(){const rate=16000,seconds=8,n=rate*seconds,buffer=new ArrayBuffer(44+n*2),v=new DataView(buffer);const put=(offset,text)=>[...text].forEach((c,i)=>v.setUint8(offset+i,c.charCodeAt(0)));put(0,'RIFF');v.setUint32(4,36+n*2,true);put(8,'WAVE');put(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);put(36,'data');v.setUint32(40,n*2,true);for(let i=0;i<n;i++){const t=i/rate,beat=t%1,envelope=Math.min(1,beat*30)*Math.max(0,1-beat*1.8);v.setInt16(44+i*2,Math.sin(2*Math.PI*[440,554,659,554][Math.floor(t)%4]*t)*envelope*4000,true);}mediaUrl=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));return mediaUrl;}
function route(){clear();current=null;run=null;$('#status').textContent='';const page=location.hash.slice(1)||'home';$('#home-link').hidden=page==='home';if(page==='home')home();else if(page==='tutorial')tutorialIntro();else if(page==='lessons')lessonList();else if(page==='quiz')quizIntro();else if(page==='settings')settings();else if(page.startsWith('lesson/')){const l=available().find(l=>l.id===page.slice(7));if(l){start(l);return;}lessonList();}else home();document.title=($('h1')?.textContent||'Home')+' · BISM Gesture Practice';focus();}
main.addEventListener('click',e=>{
const sample=e.target.closest('[data-sample]');if(sample&&current&&!current.done){$('#result').textContent=`${sample.dataset.sample} activated. To explore without activating, use your screen reader to select it.`;return;}
const a=e.target.closest('[data-action]')?.dataset.action;
if(a==='start-tutorial'){run={tasks:['single-tap','double-tap','flick-sideways','flick-vertical'],index:0};start(all.find(l=>l.id===run.tasks[0]),'tutorial');}
if(a==='start-lesson'){location.hash='lesson/'+$('#lesson-choice').value;}
if(a==='start-quiz'){run=C.quiz(available());start(all.find(l=>l.id===run.tasks[0]),'quiz');}
if(a==='report')complete('reported');
if(a==='activate')complete('observed','Play activated. The browser confirms activation, not finger count.');
if(a==='next')next();
if(a==='help'&&current){current.help=true;current.done=false;renderExercise();}
if(a==='retry'&&current){current.help=false;current.done=false;renderExercise();}
if(a==='skip'&&current){run=C.record(run,'review');if(run.index>=run.tasks.length)finish('quiz');else start(all.find(l=>l.id===run.tasks[run.index]),'quiz');}
if(a==='repeat-instruction'){$('#instruction').focus();}
if(a==='mode'&&current&&!current.done){current.mode=current.mode==='native'?'touch':'native';renderExercise();}
if(a==='open-alert'){$('dialog').showModal();}
if(a==='close-alert'){$('dialog').close();}
if(a==='sound-test'){if(prefs.sound){ding();status('Reward sound played.');}else status('Turn on Reward sounds first.');}
});
main.addEventListener('input',e=>{if(e.target.id==='practice-slider'){const val=Number(e.target.value);$('#slider-value').textContent=val+' percent';if(val!==50)complete('observed','Practice volume changed. The browser cannot check which gesture you used.');}if(e.target.id==='volume'){prefs.volume=Number(e.target.value)/100;save();}});
main.addEventListener('change',e=>{if(e.target.dataset.pref){prefs[e.target.dataset.pref]=e.target.checked;apply();save();if(e.target.dataset.pref==='sound'&&prefs.sound)ding();}if(e.target.id==='platform'){prefs.platform=e.target.value;save();status('Phone choice saved.');}});
$('.skip-link').addEventListener('click',e=>{e.preventDefault();focus();});
document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')unlock();});window.addEventListener('hashchange',route);window.addEventListener('pagehide',clear);
async function offlineInfo(){if(!$('#offline-info'))return;try{const reg=await navigator.serviceWorker?.getRegistration();if($('#offline-info'))$('#offline-info').textContent=reg?.active?'App saved for offline practice.':'Open online once to save offline lessons.';}catch{}}
if('serviceWorker' in navigator&&window.isSecureContext)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(reg=>{offlineInfo();reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)status('Update ready. Finish practice, close all app windows, and reopen.');});});}).catch(()=>status('Offline saving unavailable. Online exercises still work.')));
apply();route();
})();
