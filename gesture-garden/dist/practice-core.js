(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PracticeCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function shuffled(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[out[i],out[j]]=[out[j],out[i]];}return out;}
function quiz(items,count=5,random=Math.random){return {tasks:shuffled(items,random).slice(0,count).map(l=>l.id),index:0,results:[]};}
function record(run,result){if(run.index>=run.tasks.length)return run;if(!['observed','reported','review'].includes(result))throw new Error('Invalid result');return {...run,index:run.index+1,results:[...run.results,{id:run.tasks[run.index],result}]};}
function summary(run){return {practiced:run.results.filter(r=>r.result!=='review').length,observed:run.results.filter(r=>r.result==='observed').length,reported:run.results.filter(r=>r.result==='reported').length,review:run.results.filter(r=>r.result==='review').map(r=>r.id)};}
return {shuffled,quiz,record,summary};
});
