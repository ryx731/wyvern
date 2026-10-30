const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const core=require('../dist/practice-core.js');
test('quiz randomizes without repeats or mutating the curriculum',()=>{
 const lessons=Array.from({length:12},(_,i)=>({id:String(i)}));
 const original=JSON.stringify(lessons),run=core.quiz(lessons,5,()=>0);
 assert.equal(run.tasks.length,5);assert.equal(new Set(run.tasks).size,5);
 assert.notEqual(run.tasks[0],'0');assert.equal(JSON.stringify(lessons),original);
});
test('skip and completion distinguish observations from learner reports and preserve review IDs',()=>{
 let run=core.quiz([{id:'a'},{id:'b'},{id:'c'}],3,()=>.999);
 run=core.record(run,'observed');run=core.record(run,'reported');run=core.record(run,'review');
 assert.deepEqual(core.summary(run),{practiced:2,observed:1,reported:1,review:['c']});
 assert.equal(core.record(run,'observed'),run);
});
test('result transitions are immutable and reject invalid grades',()=>{
 const original=core.quiz([{id:'tap'}]);const next=core.record(original,'reported');
 assert.equal(original.index,0);assert.equal(original.results.length,0);assert.equal(next.index,1);
 assert.throws(()=>core.record(original,'mastered'));
});
test('every requested iPhone gesture has content, and platform-specific mappings stay separate',()=>{
 const scope={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/lessons.js'),'utf8'),scope);
 const lessons=scope.window.GESTURE_LESSONS;
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
 for(const id of ['single-tap','double-tap','flick-sideways','flick-vertical','two-finger-tap','magic-tap','group-swipe','read-swipe','scrub','three-finger-swipe','mute','curtain'])assert.ok(lessons.find(l=>l.id===id&&l.platforms.includes('ios')));
 assert.equal(lessons.find(l=>l.id==='curtain').gesture.taps,3);
 assert.equal(lessons.find(l=>l.id==='mute').gesture.taps,2);
 assert.ok(!lessons.find(l=>l.id==='curtain').platforms.includes('android'));
 assert.equal(lessons.find(l=>l.id==='talkback-scroll').gesture.fingers,2);
});
