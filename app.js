// Utilidad para cargar JSON local
async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

function setText(id, text){
  const el = document.getElementById(id);
  if(el) el.textContent = text;
}

function renderList(containerId, items){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = '';
  items.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    el.appendChild(li);
  });
}

(async function init(){
  // PERFIL
  const profile = await loadJSON('/profile.json');
  const pesoLS = localStorage.getItem('peso_actual');
  const pesoActual = pesoLS ? parseFloat(pesoLS) : profile.peso_actual;
  setText('peso-inicial', profile.peso_inicial);
  setText('peso-actual', pesoActual);
  setText('perfil-fecha', `Inicio: ${profile.fecha_inicio}`);

  const medidas = profile.medidas || {};
  const medidasEl = document.getElementById('medidas');
  medidasEl.innerHTML = '';
  Object.entries(medidas).forEach(([k,v]) => {
    const div = document.createElement('div');
    div.className = 'bg-slate-800/70 rounded px-3 py-2 flex items-center justify-between';
    div.innerHTML = `<span class="capitalize">${k.replace('_',' ')}</span><strong>${v} cm</strong>`;
    medidasEl.appendChild(div);
  });

  // Guardar peso actual en localStorage
  document.getElementById('btn-guardar-peso').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('input-peso').value);
    if(!isNaN(val)){
      localStorage.setItem('peso_actual', String(val));
      setText('peso-actual', val);
    }
  });

  // PLAN
  const plan = await loadJSON('plan.json');
  setText('plan-nombre', plan.nombre);
  renderList('plan-preparacion', plan.preparacion || []);

  // LAB
  const lab = await loadJSON('/lab.json');
  const labC = document.getElementById('lab-resultados');
  labC.innerHTML = '';
  (lab.resultados || []).forEach(r => {
    const card = document.createElement('div');
    card.className = 'rounded-xl border border-slate-800 bg-slate-800/60 p-3';
    card.innerHTML = `<p class='font-medium'>${r.nombre}</p>
      <p class='text-sm text-slate-300'>${r.valor}</p>
      <p class='text-xs text-slate-400'>${r.fecha}</p>`;
    labC.appendChild(card);
  });

  // NUTRICIÓN
  const nutrition = await loadJSON('/data/nutrition.json');
  const comidasC = document.getElementById('comidas');
  comidasC.innerHTML = '';
  (nutrition.comidas || []).forEach(c => {
    const card = document.createElement('div');
    card.className = 'rounded-xl border border-slate-800 bg-slate-800/60 p-3';
    card.innerHTML = `<p class='font-medium'>${c.titulo}</p>
      <ul class='list-disc list-inside text-sm text-slate-300'>${(c.items||[]).map(i=>`<li>${i}</li>`).join('')}</ul>`;
    comidasC.appendChild(card);
  });
  document.getElementById('pre-digestivo').textContent = nutrition.ciclo_pre_digestivo || '';
  document.getElementById('agua').textContent = nutrition.agua || '';

  // SUPLEMENTOS
  const supp = await loadJSON('/data/supplements.json');
  const supC = document.getElementById('suplementos-list');
  supC.innerHTML = '';
  function block(titulo, arr){
    const wrap = document.createElement('div');
    wrap.className = 'rounded-xl border border-slate-800 bg-slate-800/60 p-3';
    wrap.innerHTML = `<p class='font-medium mb-1'>${titulo}</p>`;
    const ul = document.createElement('ul');
    ul.className = 'list-disc list-inside text-sm text-slate-300';
    (arr||[]).forEach(x=>{ const li=document.createElement('li'); li.textContent=x; ul.appendChild(li); });
    wrap.appendChild(ul);
    return wrap;
  }
  supC.appendChild(block('Oxidantes', supp.oxidantes));
  supC.appendChild(block('Thermo oxidación', supp.thermo_oxidacion));
  supC.appendChild(block('Pre‑entreno', supp.pre_entreno));
  supC.appendChild(block('Mid‑entreno', supp.mid_entreno));
  supC.appendChild(block('Post‑entreno', supp.post_entreno));

  // RUTINAS
  const routines = await loadJSON('/data/routines.json');
  document.getElementById('ciclo-cardio').textContent = routines.ciclo_cardio || '';
  const semanal = routines.semanal || {};
  const ruC = document.getElementById('rutina-semanal');
  ruC.innerHTML = '';
  ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'].forEach(d => {
    const card = document.createElement('div');
    card.className = 'rounded-xl border border-slate-800 bg-slate-800/60 p-3';
    card.innerHTML = `<p class='font-medium capitalize'>${d}</p>
      <ul class='list-disc list-inside text-sm text-slate-300'>${(semanal[d]||[]).map(i=>`<li>${i}</li>`).join('')}</ul>`;
    ruC.appendChild(card);
  });
  document.getElementById('final-cardio').textContent = routines.final_cardio || '';

  // TIPS
  const tips = await loadJSON('/data/tips.json');
  renderList('tips-alimentacion', tips.alimentacion || []);
  renderList('tips-acondicionamiento', tips.acondicionamiento || []);
})();


