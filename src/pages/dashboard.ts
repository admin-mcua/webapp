export function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>NGL</title>
<link rel="icon" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body { font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#fff; color:#111; }
  .app { max-width:480px; margin:0 auto; min-height:100vh; position:relative; padding-bottom:90px; }

  /* Header tab bar */
  header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 8px; position:sticky; top:0; background:#fff; z-index:10; }
  .icon-btn { width:38px; height:38px; border-radius:50%; background:#f2f2f4; border:none; display:flex; align-items:center; justify-content:center; font-size:16px; color:#555; cursor:pointer; }
  .tabsnav { display:flex; gap:20px; align-items:center; }
  .tabsnav button { border:none; background:none; font-family:inherit; font-weight:900; font-size:18px; letter-spacing:.5px; color:#c7c7cc; cursor:pointer; position:relative; padding:4px 0; }
  .tabsnav button.active { color:#111; }
  .dot { width:8px; height:8px; border-radius:50%; background:#f5334f; display:inline-block; margin-left:5px; vertical-align:middle; }

  /* PLAY */
  .play-card {
    margin:24px 18px 0; border-radius:22px; overflow:hidden; position:relative;
    background:linear-gradient(135deg,#f7b9a5,#c9a0d4,#7fb0d8); min-height:250px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(0,0,0,.12);
  }
  .play-card .bgblur { position:absolute; inset:0; background-size:cover; background-position:center; filter:blur(2px) brightness(.95); }
  .play-card .overlay { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; padding:30px 20px; }
  .avatar-wrap { position:relative; width:92px; height:92px; margin-bottom:16px; }
  .avatar { width:92px; height:92px; border-radius:50%; background:#e3e3e6 center/cover no-repeat; border:3px solid #fff; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .avatar img { width:100%; height:100%; object-fit:cover; }
  .no-pfp { width:100%; height:100%; display:block; }
  .edit-pencil { position:absolute; bottom:0; right:0; width:30px; height:30px; border-radius:50%; background:#fff; border:2px solid #f0f0f0; display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.15); }
  .play-title { color:#fff; font-weight:900; font-size:24px; text-align:center; text-shadow:0 2px 8px rgba(0,0,0,.35); line-height:1.15; }
  .dice-mini { position:absolute; bottom:14px; right:14px; width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.55); display:flex; align-items:center; justify-content:center; font-size:16px; z-index:3; }

  .step-box { margin:18px 18px 0; background:#f4f4f6; border-radius:20px; padding:20px 18px; text-align:center; }
  .step-box h3 { font-size:17px; font-weight:900; margin-bottom:12px; }
  .link-text { color:#b0b0b5; font-weight:800; font-size:14px; letter-spacing:.5px; margin-bottom:14px; word-break:break-all; text-transform:uppercase; }
  .copy-btn { background:#fff; border:2px solid #f5334f; color:#f5334f; font-family:inherit; font-weight:900; font-size:15px; padding:12px 30px; border-radius:30px; cursor:pointer; transition:.15s; }
  .copy-btn:active { transform:scale(.97); }
  .copy-btn.copied { background:#f5334f; color:#fff; }
  .share-btn { width:100%; border:none; background:linear-gradient(90deg,#e91e8c,#ff7a00); color:#fff; font-family:inherit; font-weight:900; font-size:17px; padding:15px; border-radius:30px; cursor:pointer; margin-top:6px; }
  .share-btn:active { transform:scale(.98); }

  /* INBOX */
  .inbox-list { padding:8px 0; }
  .msg-item { display:flex; align-items:center; gap:14px; padding:16px 18px; border-bottom:1px solid #f0f0f0; cursor:pointer; }
  .msg-item:active { background:#fafafa; }
  .msg-icon { width:52px; height:52px; border-radius:50%; background:#f1f1f3; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
  .msg-icon.unread { background:linear-gradient(135deg,#f5334f,#ff7a00); }
  .msg-body { flex:1; min-width:0; }
  .msg-body .txt { font-weight:800; font-size:15px; color:#111; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .msg-body .txt.new { color:#f5334f; }
  .msg-body .time { font-size:13px; color:#b0b0b5; font-weight:700; margin-top:2px; }
  .chev { color:#c7c7cc; font-size:18px; }
  .empty { text-align:center; padding:60px 20px; color:#b0b0b5; font-weight:800; }

  .bottom-btn { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); width:calc(100% - 40px); max-width:440px; background:#000; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:17px; padding:17px; border-radius:34px; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,.25); z-index:20; }
  .bottom-btn:active { transform:translateX(-50%) scale(.98); }

  /* Reply/message detail modal */
  .modal { position:fixed; inset:0; background:#f4f4f4; z-index:100; display:none; flex-direction:column; overflow-y:auto; }
  .modal.open { display:flex; }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; }
  .seg { display:flex; gap:4px; background:#e2e2e4; border-radius:20px; padding:4px; }
  .seg span { width:34px; height:30px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:14px; color:#888; }
  .seg span.on { background:#c9c9cc; color:#333; }
  .reply-card { margin:auto 24px; width:calc(100% - 48px); max-width:420px; align-self:center; border-radius:32px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.12); }
  .reply-top { background:linear-gradient(90deg,#e60067,#ff5e00); color:#fff; font-weight:900; font-size:20px; padding:28px 24px; }
  .reply-bottom { background:#fff; padding:38px 24px; text-align:center; font-weight:900; font-size:20px; color:#111; word-break:break-word; }
  .reply-tools { display:flex; gap:16px; justify-content:center; margin:22px 0; }
  .reply-tools .tool { width:44px; height:44px; border-radius:50%; background:#e9e9eb; display:flex; align-items:center; justify-content:center; font-size:18px; }
  .colorwheel { background:conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red) !important; }
  .modal-actions { padding:0 24px 30px; display:flex; flex-direction:column; gap:12px; }
  .see-hints { background:#f52b44; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:17px; padding:16px; border-radius:32px; cursor:pointer; }
  .reply-btn2 { background:#000; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:17px; padding:16px; border-radius:32px; cursor:pointer; }
  .close-x { width:38px; height:38px; border-radius:50%; background:#e2e2e4; border:none; font-size:18px; color:#555; cursor:pointer; }

  /* Sender hints screen */
  .hints { position:fixed; inset:0; background:#f4f4f6; z-index:200; display:none; flex-direction:column; overflow-y:auto; }
  .hints.open { display:flex; }
  .hints-header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; position:sticky; top:0; background:#f4f4f6; }
  .hints-title { display:flex; align-items:center; gap:10px; font-weight:900; font-size:18px; color:#555; }
  .pro-badge { background:linear-gradient(90deg,#f5334f,#ff7a00); color:#fff; font-size:11px; font-weight:900; padding:3px 9px; border-radius:12px; letter-spacing:.5px; }
  .hints-body { padding:0 16px 40px; }
  .section-label { display:flex; align-items:center; gap:8px; font-weight:900; font-size:15px; color:#333; margin:20px 4px 10px; }
  .hcard { background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 1px 3px rgba(0,0,0,.05); }
  .hrow { display:flex; align-items:center; padding:15px 0; border-bottom:1px solid #f0f0f0; }
  .hrow:last-child { border-bottom:none; }
  .hrow .hicon { width:34px; height:34px; border-radius:50%; background:#f2f2f4; display:flex; align-items:center; justify-content:center; font-size:15px; margin-right:14px; flex-shrink:0; }
  .hrow .hlabel { font-weight:800; font-size:15px; color:#111; flex:1; }
  .hrow .hvalue { font-weight:700; font-size:14px; color:#666; text-align:right; }
  .map-card { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.05); }
  .map-frame { width:100%; height:180px; border:none; display:block; background:#e5e5e5; }
  .map-loc { display:flex; align-items:center; gap:10px; padding:15px 16px; font-weight:800; font-size:15px; }

  /* Profile pic upload modal */
  .pp-modal { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:300; display:none; align-items:center; justify-content:center; padding:24px; }
  .pp-modal.open { display:flex; }
  .pp-box { background:#fff; border-radius:22px; padding:26px 22px; width:100%; max-width:340px; text-align:center; }
  .pp-box h3 { font-weight:900; font-size:18px; margin-bottom:16px; }
  .pp-preview { width:120px; height:120px; border-radius:50%; margin:0 auto 18px; background:#e3e3e6 center/cover no-repeat; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .pp-preview img { width:100%; height:100%; object-fit:cover; }
  .pp-actions { display:flex; gap:10px; }
  .pp-actions button { flex:1; padding:13px; border-radius:16px; border:none; font-family:inherit; font-weight:900; font-size:15px; cursor:pointer; }
  .pp-choose { background:#f1f1f3; color:#333; }
  .pp-save { background:#000; color:#fff; }
  .toast { position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:#111; color:#fff; padding:12px 22px; border-radius:30px; font-weight:800; font-size:14px; z-index:500; opacity:0; transition:.3s; pointer-events:none; }
  .toast.show { opacity:1; }
</style>
</head>
<body>
<div class="app">
  <header>
    <button class="icon-btn" title="views">👁</button>
    <nav class="tabsnav">
      <button id="nav-play" class="active" onclick="showTab('play')">PLAY</button>
      <button id="nav-inbox" onclick="showTab('inbox')">INBOX<span class="dot" id="inboxdot" style="display:none"></span></button>
    </nav>
    <button class="icon-btn" title="settings" onclick="logout()">⚙️</button>
  </header>

  <!-- PLAY TAB -->
  <section id="tab-play">
    <div class="play-card">
      <div class="bgblur" id="cardbg"></div>
      <div class="overlay">
        <div class="avatar-wrap">
          <div class="avatar" id="playAvatar"><svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg></div>
          <div class="edit-pencil" onclick="openPP()">✏️</div>
        </div>
        <div class="play-title">send me anonymous<br>messages!</div>
      </div>
      <div class="dice-mini">🎲</div>
    </div>

    <div class="step-box">
      <h3>Step 1: Copy your link</h3>
      <div class="link-text" id="linkText">loading…</div>
      <button class="copy-btn" id="copyBtn" onclick="copyLink()">copy link</button>
    </div>

    <div class="step-box">
      <h3>Step 2: Share link on your story</h3>
      <button class="share-btn" onclick="shareLink()">Share!</button>
    </div>
  </section>

  <!-- INBOX TAB -->
  <section id="tab-inbox" style="display:none">
    <div class="inbox-list" id="inboxList"><div class="empty">Loading…</div></div>
  </section>

  <button class="bottom-btn" id="bottomBtn" onclick="onBottom()">Get messages!</button>
</div>

<!-- Message detail / reply modal -->
<div class="modal" id="msgModal">
  <div class="modal-header">
    <button class="icon-btn">⚠️</button>
    <div class="seg"><span class="on">📷</span><span>𝕏</span><span>👻</span></div>
    <button class="close-x" onclick="closeMsg()">✕</button>
  </div>
  <div class="reply-card">
    <div class="reply-top">send me anonymous messages!</div>
    <div class="reply-bottom" id="replyBody">…</div>
  </div>
  <div class="reply-tools">
    <div class="tool colorwheel"></div>
    <div class="tool">📷</div>
  </div>
  <div class="modal-actions">
    <button class="see-hints" onclick="openHints()">see hints</button>
    <button class="reply-btn2">📷 reply</button>
  </div>
</div>

<!-- Sender hints -->
<div class="hints" id="hintsScreen">
  <div class="hints-header">
    <div class="hints-title">Sender Hints <span class="pro-badge">PRO</span></div>
    <button class="close-x" onclick="closeHints()">✕</button>
  </div>
  <div class="hints-body">
    <div class="section-label">📍 Location</div>
    <div class="map-card">
      <iframe class="map-frame" id="hintMap" loading="lazy"></iframe>
      <div class="map-loc"><span>📍</span><span id="hintLoc">Unknown</span></div>
    </div>

    <div class="section-label">📱 Phone</div>
    <div class="hcard">
      <div class="hrow"><div class="hicon">⚙️</div><div class="hlabel">software</div><div class="hvalue" id="hSoftware">—</div></div>
      <div class="hrow"><div class="hicon">📶</div><div class="hlabel">carrier/isp</div><div class="hvalue" id="hCarrier">—</div></div>
      <div class="hrow"><div class="hicon">🌐</div><div class="hlabel">Sent from</div><div class="hvalue" id="hSentFrom">—</div></div>
      <div class="hrow"><div class="hicon">🕐</div><div class="hlabel">time sent</div><div class="hvalue" id="hTime">—</div></div>
    </div>
  </div>
</div>

<!-- Profile pic modal -->
<div class="pp-modal" id="ppModal">
  <div class="pp-box">
    <h3>Change profile picture</h3>
    <div class="pp-preview" id="ppPreview"><svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg></div>
    <input type="file" id="ppFile" accept="image/*" style="display:none" onchange="ppSelected(event)">
    <div class="pp-actions">
      <button class="pp-choose" onclick="document.getElementById('ppFile').click()">Choose photo</button>
      <button class="pp-save" id="ppSaveBtn" onclick="savePP()">Save</button>
    </div>
    <button style="margin-top:14px;background:none;border:none;color:#999;font-family:inherit;font-weight:800;cursor:pointer" onclick="closePP()">Cancel</button>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
  let ME = null;
  let PP_DATA = null;
  const NO_PFP = '<svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg>';

  function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
  function timeAgo(iso){
    const d = new Date(iso.replace(' ','T')+'Z');
    const s = Math.floor((Date.now()-d.getTime())/1000);
    if(s<60) return 'a few seconds ago';
    const m=Math.floor(s/60); if(m<60) return m+' minute'+(m>1?'s':'')+' ago';
    const h=Math.floor(m/60); if(h<24) return h+' hour'+(h>1?'s':'')+' ago';
    const dd=Math.floor(h/24); if(dd===1) return 'a day ago';
    return dd+' days ago';
  }
  function fmtTime(iso){
    const d=new Date(iso.replace(' ','T')+'Z');
    const p=n=>String(n).padStart(2,'0');
    return p(d.getMonth()+1)+'/'+p(d.getDate())+'/'+d.getFullYear()+' '+p(d.getHours())+':'+p(d.getMinutes());
  }

  async function init(){
    const res = await fetch('/api/me');
    if(!res.ok){ window.location.href='/'; return; }
    ME = await res.json();
    const url = window.location.origin.replace(/^https?:\\/\\//,'') + '/' + ME.username;
    document.getElementById('linkText').textContent = url;
    if(ME.profile_pic){ setAvatar(ME.profile_pic); }
    if(ME.is_admin){
      const gear = document.querySelector('header .icon-btn:last-child');
      const adminBtn = document.createElement('button');
      adminBtn.className='icon-btn'; adminBtn.textContent='🛡'; adminBtn.title='admin';
      adminBtn.onclick=()=>window.location.href='/admin';
      gear.parentNode.insertBefore(adminBtn, gear);
    }
    loadInbox();
  }
  function setAvatar(src){
    document.getElementById('playAvatar').innerHTML = '<img src="'+src+'">';
    document.getElementById('cardbg').style.backgroundImage = 'url('+src+')';
  }

  function showTab(t){
    document.getElementById('nav-play').classList.toggle('active', t==='play');
    document.getElementById('nav-inbox').classList.toggle('active', t==='inbox');
    document.getElementById('tab-play').style.display = t==='play'?'block':'none';
    document.getElementById('tab-inbox').style.display = t==='inbox'?'block':'none';
    document.getElementById('bottomBtn').textContent = t==='play' ? 'Get your own messages!' : 'Get messages!';
    if(t==='inbox') loadInbox();
  }
  function onBottom(){
    const playing = document.getElementById('tab-play').style.display !== 'none';
    if(playing){ copyLink(); } else { showTab('play'); }
  }

  function copyLink(){
    const link = window.location.origin + '/' + ME.username;
    navigator.clipboard.writeText(link).then(()=>{
      const b=document.getElementById('copyBtn'); b.textContent='✓ copied!'; b.classList.add('copied');
      setTimeout(()=>{ b.textContent='copy link'; b.classList.remove('copied'); },1500);
    }).catch(()=>toast('Copy failed'));
  }
  function shareLink(){
    const link = window.location.origin + '/' + ME.username;
    if(navigator.share){ navigator.share({title:'send me anonymous messages!',url:link}).catch(()=>{}); }
    else { navigator.clipboard.writeText(link); toast('Link copied — share it on your story!'); }
  }

  async function loadInbox(){
    const res = await fetch('/api/inbox');
    if(!res.ok) return;
    const data = await res.json();
    const list = document.getElementById('inboxList');
    const msgs = data.messages || [];
    const unread = msgs.filter(m=>!m.is_read).length;
    document.getElementById('inboxdot').style.display = unread>0?'inline-block':'none';
    if(msgs.length===0){ list.innerHTML='<div class="empty">No messages yet.<br>Share your link to get anonymous messages! 💌</div>'; return; }
    list.innerHTML = msgs.map(m=>{
      const unreadCls = m.is_read ? '' : 'unread';
      const txtCls = m.is_read ? '' : 'new';
      const label = m.is_read ? escapeHtml(m.body) : 'New Message!';
      return \`<div class="msg-item" onclick="openMsg(\${m.id})">
        <div class="msg-icon \${unreadCls}">\${m.is_read?'💌':'💌'}</div>
        <div class="msg-body"><div class="txt \${txtCls}">\${label}</div><div class="time">\${timeAgo(m.created_at)}</div></div>
        <div class="chev">›</div>
      </div>\`;
    }).join('');
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  let CURRENT_MSG = null;
  async function openMsg(id){
    const res = await fetch('/api/message/'+id);
    if(!res.ok){ toast('Could not load'); return; }
    CURRENT_MSG = await res.json();
    document.getElementById('replyBody').textContent = CURRENT_MSG.body;
    document.getElementById('msgModal').classList.add('open');
    loadInbox();
  }
  function closeMsg(){ document.getElementById('msgModal').classList.remove('open'); }

  function openHints(){
    const m = CURRENT_MSG; if(!m) return;
    document.getElementById('hSoftware').textContent = m.software || 'Unknown';
    document.getElementById('hCarrier').textContent = m.carrier || 'Unknown';
    document.getElementById('hSentFrom').textContent = m.sent_from || 'Web Browser';
    document.getElementById('hTime').textContent = fmtTime(m.created_at);
    document.getElementById('hintLoc').textContent = m.location || 'Unknown location';
    const map = document.getElementById('hintMap');
    if(m.lat!=null && m.lon!=null){
      map.src = 'https://maps.google.com/maps?q='+m.lat+','+m.lon+'&z=12&output=embed';
    } else {
      map.src = 'https://maps.google.com/maps?q='+encodeURIComponent(m.location||'')+'&z=6&output=embed';
    }
    document.getElementById('hintsScreen').classList.add('open');
  }
  function closeHints(){ document.getElementById('hintsScreen').classList.remove('open'); }

  // Profile pic
  function openPP(){ document.getElementById('ppModal').classList.add('open'); const p=document.getElementById('ppPreview'); p.innerHTML = ME.profile_pic?'<img src="'+ME.profile_pic+'">':NO_PFP; PP_DATA=null; }
  function closePP(){ document.getElementById('ppModal').classList.remove('open'); }
  function ppSelected(e){
    const file = e.target.files[0]; if(!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = ()=>{
      img.onload = ()=>{
        // resize to max 400px square
        const size=400; const canvas=document.createElement('canvas'); canvas.width=size; canvas.height=size;
        const ctx=canvas.getContext('2d');
        const scale=Math.max(size/img.width,size/img.height);
        const w=img.width*scale, h=img.height*scale;
        ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
        PP_DATA = canvas.toDataURL('image/jpeg',0.85);
        document.getElementById('ppPreview').innerHTML='<img src="'+PP_DATA+'">';
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  async function savePP(){
    if(!PP_DATA){ toast('Choose a photo first'); return; }
    const btn=document.getElementById('ppSaveBtn'); btn.disabled=true; btn.textContent='...';
    const res = await fetch('/api/profile-pic',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:PP_DATA})});
    btn.disabled=false; btn.textContent='Save';
    if(res.ok){ ME.profile_pic=PP_DATA; setAvatar(PP_DATA); closePP(); toast('Profile picture updated!'); }
    else { toast('Failed to save'); }
  }

  async function logout(){
    if(confirm('Log out?')){ await fetch('/api/logout',{method:'POST'}); window.location.href='/'; }
  }

  init();
</script>
</body>
</html>`
}
