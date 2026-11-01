(function(){
  'use strict';
  var lessons=window.LESSON_INTERACTIONS||{},saveTimer=null;
  function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function flow(){return window.LearningProgress.flow();}
  function save(){return window.LearningProgress.saveFlow();}
  function sectionHref(key,marker){var p=key.split('/');return '#/c/'+p[0]+'/s/'+p[1]+(marker?'/'+marker:'');}
  function findQuestion(id){for(var key in lessons){var q=lessons[key].questions.find(function(x){return x.id===id;});if(q)return {key:key,question:q};}return null;}
  function answer(id,index){var found=findQuestion(id);if(!found||!Number.isInteger(index)||index<0||index>=found.question.options.length)return;var q=found.question,correct=index===q.answer,old=flow().answers[id]||{};
    flow().answers[id]={choice:index,correct:correct,attempts:(old.attempts||0)+1,updatedAt:Date.now()};
    if(!correct){var key='check:'+id,prev=flow().reviews[key]||{};flow().reviews[key]={title:q.question,href:sectionHref(found.key,'flow~'+id),note:prev.note||q.review,source:'随堂错题',createdAt:prev.createdAt||Date.now(),reviewedAt:prev.reviewedAt||null,dueAt:Date.now()};}
    save();
  }
  function renderQuestion(q){var rec=flow().answers[q.id],selected=rec&&Number.isInteger(rec.choice)?rec.choice:-1;
    return '<article class="inline-question" data-inline-question="'+esc(q.id)+'"><h4>'+esc(q.question)+'</h4><div class="inline-options">'+q.options.map(function(option,i){return '<button type="button" data-inline-answer="'+i+'" aria-pressed="'+(selected===i)+'" class="inline-option'+(selected===i?(rec.correct?' correct':' incorrect'):'')+'">'+String.fromCharCode(65+i)+'. '+esc(option)+'</button>';}).join('')+'</div><details><summary>查看提示</summary><p>'+esc(q.hint)+'</p></details><p class="inline-feedback" role="status">'+(selected>=0?esc(q.feedback[selected])+' '+(rec.correct?'':'可再选一次，或到复习页记录易错点。'):'选择一个答案后查看解释。')+'</p></article>';
  }
  function renderSection(key){var lesson=lessons[key];if(!lesson)return '';return '<section class="inline-practice" id="lesson-interactions" data-reading-anchor aria-label="随堂练习"><div class="kicker">看完演示，试着自己判断</div><h3>随堂练习</h3><p class="muted small">选择后立即显示解析；答错的题会进入本机复习列表。</p>'+lesson.questions.map(renderQuestion).join('')+'<button class="btn ghost" type="button" data-nav="'+esc(lesson.exercise)+'">'+esc(lesson.exerciseTitle)+' →</button></section>';}
  function toggleReview(key,title,href){var records=flow().reviews;if(records[key])delete records[key];else records[key]={title:title,href:href,note:'',source:'手动加入',createdAt:Date.now(),reviewedAt:null,dueAt:Date.now()};save();}
  function saveNote(key,note){if(!flow().reviews[key])return false;flow().reviews[key].note=String(note).slice(0,500);return save();}
  function reviewed(key){var item=flow().reviews[key];if(!item)return;item.reviewedAt=Date.now();item.dueAt=item.reviewedAt+3*24*60*60*1000;save();}
  function removeReview(key){delete flow().reviews[key];save();}
  function mount(host,parts){host.querySelectorAll('[data-inline-question]').forEach(mountQuestion);
    host.querySelectorAll('[data-problem-done]').forEach(function(el){el.addEventListener('change',function(){var id=el.dataset.problemDone;if(el.checked)flow().problems[id]=true;else delete flow().problems[id];save();host.querySelectorAll('[data-problem-done="'+id+'"]').forEach(function(peer){peer.checked=el.checked;});});});
    host.querySelectorAll('[data-review-toggle]').forEach(function(b){var key=b.dataset.reviewToggle;b.setAttribute('aria-pressed',String(!!flow().reviews[key]));b.textContent=flow().reviews[key]?'✓ 已加入复习':'加入复习';b.addEventListener('click',function(){toggleReview(key,b.dataset.reviewTitle,b.dataset.reviewHref);b.setAttribute('aria-pressed',String(!!flow().reviews[key]));b.textContent=flow().reviews[key]?'✓ 已加入复习':'加入复习';});});
    var marker=parts&&parts[4];if(marker&&marker.indexOf('flow~')===0){var qid=marker.slice(5);requestAnimationFrame(function(){var el=Array.from(document.querySelectorAll('[data-inline-question]')).find(function(n){return n.dataset.inlineQuestion===qid;});if(el)el.scrollIntoView({block:'start'});});}
    if(marker&&marker.indexOf('resume~')===0){var anchor=marker.slice(7);requestAnimationFrame(function(){var el=document.getElementById(anchor);if(el){if(el.tagName==='DETAILS')el.open=true;el.scrollIntoView({block:'start'});}});}
  }
  function mountQuestion(node){node.addEventListener('click',function(e){var b=e.target.closest('[data-inline-answer]');if(!b)return;var choice=Number(b.dataset.inlineAnswer),found=findQuestion(node.dataset.inlineQuestion);answer(found.question.id,choice);var holder=document.createElement('div');holder.innerHTML=renderQuestion(found.question);var replacement=holder.firstElementChild;node.replaceWith(replacement);mountQuestion(replacement);var selected=replacement.querySelector('[data-inline-answer="'+choice+'"]');if(selected)selected.focus({preventScroll:true});});}
  window.addEventListener('scroll',function(){if(!window.LearningProgress)return;var parts=(location.hash||'#/').split('?')[0].replace(/^#\//,'').split('/');if(parts[0]!=='c'||parts[2]!=='s'||window.scrollY<180)return;var candidates=Array.from(document.querySelectorAll('[data-reading-anchor]')),visible=candidates.filter(function(el){return el.getBoundingClientRect().top<=160;});if(!visible.length)return;var id=visible[visible.length-1].id;if(!id)return;var next={section:parts[1]+'/'+parts[3],anchor:id};if(saveTimer)clearTimeout(saveTimer);saveTimer=setTimeout(function(){var old=flow().resume;if(!old||old.section!==next.section||old.anchor!==next.anchor){flow().resume=next;save();}},900);},{passive:true});
  function resumeHref(){var r=flow().resume;return r&&r.section&&r.anchor?sectionHref(r.section,'resume~'+r.anchor):null;}
  window.LearningFlow={renderSection:renderSection,mount:mount,toggleReview:toggleReview,saveNote:saveNote,reviewed:reviewed,removeReview:removeReview,resumeHref:resumeHref};
})();
