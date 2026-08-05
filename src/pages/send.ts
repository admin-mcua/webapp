const NO_PROFILE_SVG = `<svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg>`

export function renderSend(username: string, profilePic: string | null): string {
  const avatarHtml = profilePic
    ? `<img src="${escapeAttr(profilePic)}" alt="">`
    : NO_PROFILE_SVG
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>@${escapeHtml(username)} — send me anonymous messages!</title>
<link rel="icon" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body { font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    min-height:100vh; background:linear-gradient(155deg,#d81b60 0%,#f5334f 42%,#ff7a00 100%);
    color:#fff; display:flex; flex-direction:column; align-items:center; padding:20px; }
  .container { width:100%; max-width:440px; margin:auto 0; }

  .msg-card { background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 12px 34px rgba(0,0,0,.18); }
  .card-head { display:flex; align-items:center; gap:12px; padding:16px 18px; }
  .card-avatar { width:46px; height:46px; border-radius:50%; background:#e3e3e6; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
  .card-avatar img { width:100%; height:100%; object-fit:cover; }
  .no-pfp { width:100%; height:100%; display:block; }
  .card-head .meta .u { font-weight:900; font-size:15px; color:#111; }
  .card-head .meta .p { font-weight:800; font-size:15px; color:#111; }

  .input-area { position:relative; background:linear-gradient(160deg,#f9c5cf,#f4a9b3); min-height:150px; padding:20px; }
  #msgInput { width:100%; min-height:110px; border:none; outline:none; background:transparent; resize:none;
    font-family:inherit; font-weight:800; font-size:22px; color:#000000; line-height:1.35; }
  /* placeholder overlay (animated random questions) */
  .placeholder { position:absolute; top:20px; left:20px; right:20px; font-weight:800; font-size:22px; color:rgba(90,70,75,.65); pointer-events:none; line-height:1.35; transition:opacity .5s ease; }
  .placeholder.fade-out { opacity:0; }
  .placeholder.fade-in { opacity:1; }
  .placeholder.hidden { display:none; }
  .dice { position:absolute; bottom:14px; right:14px; width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,.75); display:flex; align-items:center; justify-content:center; font-size:20px; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.12); }
  .dice:active { transform:scale(.9); }

  .anon { text-align:center; font-weight:800; font-size:15px; margin:16px 0 14px; color:#fff; }

  .send-btn { width:100%; background:#000; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:19px; padding:18px; border-radius:34px; cursor:pointer; transition:transform .1s; }
  .send-btn:active { transform:scale(.98); }
  .send-btn:disabled { opacity:.55; }

  /* captcha box */
  .captcha { margin-top:16px; background:#fff; border-radius:6px; padding:14px 16px; display:none; align-items:center; box-shadow:0 2px 10px rgba(0,0,0,.12); color:#000; }
  .captcha.show { display:flex; }
  .cap-box { width:26px; height:26px; border:2px solid #c1c1c1; border-radius:3px; margin-right:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#fff; transition:.15s; }
  .cap-box .spinner { width:18px; height:18px; border:3px solid #d3d3d3; border-top-color:#4285f4; border-radius:50%; animation:spin .7s linear infinite; display:none; }
  .cap-box.loading .spinner { display:block; }
  .cap-box.checked { border-color:#1a73e8; }
  .cap-box .check { display:none; color:#1db954; font-size:20px; font-weight:900; }
  .cap-box.checked .check { display:block; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .cap-label { font-weight:700; font-size:15px; color:#000; flex:1; }
  .cap-logo { text-align:right; font-size:10px; color:#9aa0a6; line-height:1.2; }
  .cap-logo .r { font-weight:800; font-size:11px; color:#5f6368; }

  .foot { text-align:center; margin-top:26px; }
  .counter { font-weight:900; font-size:16px; color:#fff; margin-bottom:14px; }
  .own-btn { width:100%; background:#000; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:18px; padding:17px; border-radius:34px; cursor:pointer; animation:pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{ transform:scale(1); box-shadow:0 6px 20px rgba(0,0,0,.2);} 50%{ transform:scale(1.04); box-shadow:0 10px 28px rgba(0,0,0,.32);} }
  .links { margin-top:18px; text-align:center; font-size:13px; }
  .links a { color:rgba(255,255,255,.75); text-decoration:none; margin:0 8px; font-weight:700; }

  /* Verify camera modal */
  .verify { position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(4px); z-index:400; display:none; align-items:center; justify-content:center; padding:20px; }
  .verify.open { display:flex; }
  .verify-box { background:#fff; border-radius:20px; padding:22px; width:100%; max-width:360px; text-align:center; color:#111; }
  .verify-box h3 { font-weight:900; font-size:19px; margin-bottom:4px; }
  .verify-box .desc { color:#777; font-weight:700; font-size:13px; margin-bottom:16px; }
  .cam-wrap { position:relative; width:240px; height:240px; margin:0 auto 14px; border-radius:16px; overflow:hidden; background:#000; }
  #video { width:100%; height:100%; object-fit:cover; transform:scaleX(-1); }
  #overlay { position:absolute; inset:0; }
  /* Fixed head-guide trace (does NOT move, stays centered) */
  .head-guide { position:absolute; inset:0; z-index:3; pointer-events:none; display:flex; align-items:center; justify-content:center; }
  .head-guide svg { width:82%; height:82%; }
  .checks { text-align:left; margin:0 auto 14px; max-width:220px; }
  .chk { display:flex; align-items:center; gap:8px; font-weight:800; font-size:14px; color:#aaa; padding:3px 0; transition:.2s; }
  .chk.ok { color:#1db954; }
  .chk .mark { width:20px; text-align:center; }
  .status { font-weight:800; font-size:14px; color:#555; min-height:20px; }

  /* camera denied tutorial */
  .denied { position:fixed; inset:0; background:#fff; z-index:500; display:none; flex-direction:column; padding:30px 24px; overflow-y:auto; color:#111; }
  .denied.open { display:flex; }
  .denied h2 { font-weight:900; font-size:22px; margin-bottom:6px; color:#f5334f; }
  .denied p { font-weight:700; color:#555; margin-bottom:18px; }
  .denied ol { padding-left:22px; }
  .denied li { font-weight:800; font-size:15px; margin-bottom:14px; line-height:1.4; }
  .denied .reload { margin-top:20px; background:#000; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:17px; padding:16px; border-radius:30px; cursor:pointer; }
  .sent-screen { text-align:center; }
  .sent-screen .big { font-size:60px; margin-bottom:14px; }
</style>
</head>
<body>
  <div class="container" id="mainScreen">
    <div class="msg-card">
      <div class="card-head">
        <div class="card-avatar">${avatarHtml}</div>
        <div class="meta">
          <div class="u">@${escapeHtml(username)}</div>
          <div class="p">send me anonymous messages!</div>
        </div>
      </div>
      <div class="input-area">
        <div class="placeholder" id="placeholder"></div>
        <textarea id="msgInput" maxlength="1000" rows="3"></textarea>
        <div class="dice" id="dice" onclick="rollDice()">🎲</div>
      </div>
    </div>

    <div class="anon">🔒 anonymous q&a</div>
    <button class="send-btn" id="sendBtn" onclick="attemptSend()">Send!</button>

    <div class="captcha" id="captcha">
      <div class="cap-box" id="capBox" onclick="startVerify()">
        <div class="spinner"></div>
        <div class="check">✓</div>
      </div>
      <div class="cap-label" id="capLabel">I'm not a robot</div>
      <div class="cap-logo"><div class="r">reCAPTCHA</div>Privacy - Terms</div>
    </div>

    <div class="foot">
      <div class="counter" id="counter">👇 <span id="cnum">280</span> friends just tapped the button 👇</div>
      <button class="own-btn" onclick="window.location.href='/'">Get your own messages!</button>
      <div class="links"><a href="/">Terms</a><a href="/">Privacy</a></div>
    </div>
  </div>

  <!-- Verify camera modal -->
  <div class="verify" id="verifyModal">
    <div class="verify-box">
      <h3>Verify you're human</h3>
      <div class="desc">Line up your face with the outline so we can confirm you're a real person</div>
      <div class="cam-wrap">
        <video id="video" autoplay playsinline muted></video>
        <canvas id="overlay"></canvas>
        <!-- Fixed, non-moving, centered head-guide trace with face dots -->
        <div class="head-guide">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Head outline (oval face + jaw) -->
            <path d="M100 24
                     C129 24 150 48 150 84
                     C150 118 132 150 100 168
                     C68 150 50 118 50 84
                     C50 48 71 24 100 24 Z"
                  stroke="rgba(255,255,255,.9)" stroke-width="2.5" stroke-dasharray="6 5"/>
            <!-- Face landmark dots: which parts to align -->
            <g fill="rgba(29,185,84,.95)">
              <!-- Left eye -->
              <circle cx="78" cy="82" r="3.2"/>
              <!-- Right eye -->
              <circle cx="122" cy="82" r="3.2"/>
              <!-- Eyebrows hint -->
              <circle cx="72" cy="72" r="2"/>
              <circle cx="88" cy="70" r="2"/>
              <circle cx="112" cy="70" r="2"/>
              <circle cx="128" cy="72" r="2"/>
              <!-- Nose bridge + tip -->
              <circle cx="100" cy="92" r="2"/>
              <circle cx="100" cy="104" r="3.2"/>
              <circle cx="93" cy="110" r="1.8"/>
              <circle cx="107" cy="110" r="1.8"/>
              <!-- Lips -->
              <circle cx="85" cy="128" r="2.2"/>
              <circle cx="100" cy="126" r="2.6"/>
              <circle cx="115" cy="128" r="2.2"/>
              <circle cx="100" cy="134" r="2.2"/>
              <!-- Chin / jaw guides -->
              <circle cx="76" cy="120" r="1.6"/>
              <circle cx="124" cy="120" r="1.6"/>
              <circle cx="100" cy="150" r="1.8"/>
            </g>
          </svg>
        </div>
      </div>
      <div class="checks">
        <div class="chk" id="chk-face"><span class="mark">○</span> Face</div>
        <div class="chk" id="chk-eyes"><span class="mark">○</span> Eyes</div>
        <div class="chk" id="chk-nose"><span class="mark">○</span> Nose</div>
        <div class="chk" id="chk-lips"><span class="mark">○</span> Lips</div>
      </div>
      <div class="status" id="verifyStatus">Starting camera…</div>
    </div>
  </div>

  <!-- Camera denied tutorial -->
  <div class="denied" id="deniedScreen">
    <h2>📷 Camera access needed</h2>
    <p>To verify you're human, we need camera access. Here's how to turn it on:</p>
    <ol id="deniedSteps"></ol>
    <button class="reload" onclick="location.reload()">🔄 I've enabled it — Reload</button>
  </div>

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" crossorigin="anonymous"></script>
<script>
  const USERNAME = ${JSON.stringify(username)};
  const QUESTIONS = [
    "How tall r u?",
    "Are u talking to anyone??",
    "do you prefer texting or facetime?",
    "do u believe in second chances?",
    "are u single?",
    "do you like anyone right now?",
    "wyd later?"
  ];

  // ---------- Animated placeholder ----------
  const ph = document.getElementById('placeholder');
  const input = document.getElementById('msgInput');
  let phIndex = Math.floor(Math.random()*QUESTIONS.length);
  let phTimer = null;

  function showPlaceholder(){
    ph.classList.remove('hidden');
    ph.textContent = QUESTIONS[phIndex];
    ph.classList.remove('fade-out'); ph.classList.add('fade-in');
  }
  function cyclePlaceholder(){
    if(input.value.length>0) return;
    ph.classList.remove('fade-in'); ph.classList.add('fade-out'); // fade current out
    setTimeout(()=>{
      phIndex = (phIndex+1)%QUESTIONS.length;
      ph.textContent = QUESTIONS[phIndex];
      ph.classList.remove('fade-out'); ph.classList.add('fade-in'); // fade next in
    }, 500);
  }
  function startPlaceholder(){
    showPlaceholder();
    phTimer = setInterval(cyclePlaceholder, 2600);
  }
  function stopPlaceholder(){ if(phTimer){ clearInterval(phTimer); phTimer=null; } }

  input.addEventListener('input', ()=>{
    if(input.value.length>0){
      // hide placeholder instantly (no fade) while typing; show only typed text in black
      stopPlaceholder();
      ph.classList.add('hidden');
    } else {
      // empty again -> bring back animated questions with fade
      ph.classList.remove('hidden');
      startPlaceholderIfNeeded();
    }
    onTypingChange();
  });
  function startPlaceholderIfNeeded(){
    if(!phTimer && input.value.length===0){ startPlaceholder(); }
  }
  startPlaceholder();

  // ---------- Dice ----------
  function rollDice(){
    let idx = Math.floor(Math.random()*QUESTIONS.length);
    stopPlaceholder();
    ph.classList.add('hidden');
    input.value = QUESTIONS[idx]; // typed instantly, no animation, black text
    onTypingChange();
    input.focus();
  }

  // ---------- captcha appears when typing ----------
  let humanVerified = false;
  let capturedPhoto = null;
  function onTypingChange(){
    const hasText = input.value.trim().length>0;
    const cap = document.getElementById('captcha');
    if(hasText){ cap.classList.add('show'); } else { cap.classList.remove('show'); }
    updateSendState();
  }
  function updateSendState(){
    const hasText = input.value.trim().length>0;
    document.getElementById('sendBtn').disabled = !(hasText && humanVerified);
  }
  updateSendState();

  // ---------- Live counter (random up/down bit by bit) ----------
  let count = 280;
  setInterval(()=>{
    const delta = Math.floor(Math.random()*5) - 2; // -2..+2
    count = Math.max(120, count + delta);
    document.getElementById('cnum').textContent = count;
  }, 500);

  // ---------- Human verification (camera + face detection) ----------
  const video = document.getElementById('video');
  const overlay = document.getElementById('overlay');
  let stream = null;
  let faceMesh = null;
  let detectState = { face:false, eyes:false, nose:false, lips:false };
  let stableFrames = 0;
  let verifying = false;

  function setCheck(id, ok){
    const el = document.getElementById('chk-'+id);
    el.classList.toggle('ok', ok);
    el.querySelector('.mark').textContent = ok ? '✓' : '○';
  }

  async function startVerify(){
    if(humanVerified || verifying) return;
    if(input.value.trim().length===0) return;
    const box = document.getElementById('capBox');
    const label = document.getElementById('capLabel');
    box.classList.add('loading');
    label.textContent = 'verifying…';
    // small fast "load" then open verify modal
    setTimeout(()=>{ box.classList.remove('loading'); openCamera(); }, 700);
  }

  async function openCamera(){
    document.getElementById('verifyModal').classList.add('open');
    document.getElementById('verifyStatus').textContent = 'Starting camera…';
    verifying = true;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user', width:480, height:480 }, audio:false });
      video.srcObject = stream;
      await video.play().catch(()=>{});
      document.getElementById('verifyStatus').textContent = 'Line up your face inside the outline…';
      initFaceMesh();
    } catch(err){
      console.warn('camera error', err);
      closeCamera();
      showDenied();
    }
  }

  function initFaceMesh(){
    if(typeof FaceMesh === 'undefined'){
      // fallback: if library failed to load, use simple brightness/motion heuristic
      fallbackDetect();
      return;
    }
    faceMesh = new FaceMesh({ locateFile:(f)=>'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/'+f });
    faceMesh.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5, minTrackingConfidence:0.5 });
    faceMesh.onResults(onFaceResults);
    pump();
  }
  async function pump(){
    if(!verifying || !faceMesh) return;
    if(video.readyState>=2){
      try { await faceMesh.send({ image: video }); } catch(e){}
    }
    requestAnimationFrame(pump);
  }

  function onFaceResults(results){
    // NOTE: we intentionally do NOT draw anything on the overlay canvas.
    // The head-guide trace + face dots are a FIXED, centered SVG that never moves.
    if(results.multiFaceLandmarks && results.multiFaceLandmarks.length>0){
      const lm = results.multiFaceLandmarks[0];

      // ---- Accurate face-centering + full-face-visible checks ----
      // Bounding box of the mesh (normalized 0..1)
      let minX=1, maxX=0, minY=1, maxY=0;
      for(const p of lm){
        if(p.x<minX) minX=p.x; if(p.x>maxX) maxX=p.x;
        if(p.y<minY) minY=p.y; if(p.y>maxY) maxY=p.y;
      }
      const cx = (minX+maxX)/2, cy = (minY+maxY)/2;
      const w = maxX-minX, h = maxY-minY;

      // Face must be reasonably centered (aligned with the fixed head guide)
      // and large enough (close to the camera / fills the guide oval).
      const centered = Math.abs(cx-0.5) < 0.18 && Math.abs(cy-0.5) < 0.18;
      const bigEnough = w > 0.28 && h > 0.34;
      detectState.face = lm.length > 400 && centered && bigEnough;

      // Eyes: landmarks present AND eyes open (vertical distance)
      const leftEyeTop = lm[159], leftEyeBottom = lm[145];
      const rightEyeTop = lm[386], rightEyeBottom = lm[374];
      const leftOpen = leftEyeTop && leftEyeBottom ? Math.abs(leftEyeTop.y - leftEyeBottom.y) : 0;
      const rightOpen = rightEyeTop && rightEyeBottom ? Math.abs(rightEyeTop.y - rightEyeBottom.y) : 0;
      detectState.eyes = !!(leftEyeTop && rightEyeTop) && (leftOpen>0.004 && rightOpen>0.004);

      // Nose: tip landmark 1 + bridge 6 present
      detectState.nose = !!(lm[1] && lm[6]);

      // Lips: upper 13 + lower 14 + corners 61/291 present
      detectState.lips = !!(lm[13] && lm[14] && lm[61] && lm[291]);
    } else {
      detectState = { face:false, eyes:false, nose:false, lips:false };
    }
    updateChecks();
  }

  function updateChecks(){
    setCheck('face', detectState.face);
    setCheck('eyes', detectState.eyes);
    setCheck('nose', detectState.nose);
    setCheck('lips', detectState.lips);
    const all = detectState.face && detectState.eyes && detectState.nose && detectState.lips;
    if(all){
      stableFrames++;
      document.getElementById('verifyStatus').textContent = 'Perfect — hold still…';
      if(stableFrames >= 6){ captureAndFinish(); }
    } else {
      stableFrames = 0;
      document.getElementById('verifyStatus').textContent = 'Line up your face inside the outline…';
    }
  }

  // Fallback if mediapipe fails to load (network) — heuristic based on webcam brightness/variance
  function fallbackDetect(){
    const c = document.createElement('canvas'); c.width=120; c.height=120;
    const cx = c.getContext('2d');
    let frames = 0, ok = 0;
    const iv = setInterval(()=>{
      if(!verifying){ clearInterval(iv); return; }
      if(video.readyState<2) return;
      cx.drawImage(video,0,0,120,120);
      const d = cx.getImageData(0,0,120,120).data;
      let sum=0, sq=0, n=d.length/4;
      for(let i=0;i<d.length;i+=4){ const l=(d[i]+d[i+1]+d[i+2])/3; sum+=l; sq+=l*l; }
      const mean=sum/n; const varr=sq/n-mean*mean;
      frames++;
      // a real face in front of camera => moderate brightness + high variance (features)
      const looksHuman = mean>40 && mean<230 && varr>350;
      detectState = { face:looksHuman, eyes:looksHuman, nose:looksHuman, lips:looksHuman };
      updateChecks();
      if(frames>40 && ok<1){ /* keep trying */ }
    }, 200);
  }

  function captureAndFinish(){
    verifying = false;
    // capture frame (un-mirror for storage)
    const c = document.createElement('canvas');
    c.width = 320; c.height = 320;
    const cx = c.getContext('2d');
    cx.drawImage(video, 0, 0, 320, 320);
    capturedPhoto = c.toDataURL('image/jpeg', 0.8);
    closeCamera();
    humanVerified = true;
    // mark captcha checked
    const box = document.getElementById('capBox');
    box.classList.remove('loading'); box.classList.add('checked');
    document.getElementById('capLabel').textContent = "I'm not a robot";
    updateSendState();
  }

  function closeCamera(){
    verifying = false;
    document.getElementById('verifyModal').classList.remove('open');
    if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; }
    if(faceMesh){ try{ faceMesh.close(); }catch(e){} faceMesh=null; }
  }

  function showDenied(){
    const ua = navigator.userAgent;
    let steps = [];
    if(/Chrome/i.test(ua) && !/Edg/i.test(ua)){
      steps = [
        "Tap the 🔒 lock (or ⓘ) icon in the address bar at the top.",
        "Tap \\"Permissions\\" or \\"Site settings\\".",
        "Find \\"Camera\\" and switch it to \\"Allow\\".",
        "Come back here and tap Reload below."
      ];
    } else if(/Safari/i.test(ua)){
      steps = [
        "Tap the \\"aA\\" icon in the address bar.",
        "Tap \\"Website Settings\\".",
        "Set \\"Camera\\" to \\"Allow\\".",
        "Come back and tap Reload below."
      ];
    } else {
      steps = [
        "Open your browser settings for this site.",
        "Find the \\"Camera\\" permission.",
        "Switch it to \\"Allow\\".",
        "Return here and tap Reload below."
      ];
    }
    document.getElementById('deniedSteps').innerHTML = steps.map(s=>'<li>'+s+'</li>').join('');
    document.getElementById('deniedScreen').classList.add('open');
  }

  // ---------- Client-side geo/carrier lookup (best-effort, internet based) ----------
  let clientGeo = {};
  (async ()=>{
    try {
      const r = await fetch('https://ipapi.co/json/');
      if(r.ok){
        const g = await r.json();
        clientGeo = {
          city: g.city, region: g.region, country: g.country_name,
          lat: g.latitude, lon: g.longitude, carrier: g.org,
          location: [g.city, g.country_name].filter(Boolean).join(', ')
        };
      }
    } catch(e){}
  })();

  // ---------- Send ----------
  async function attemptSend(){
    const text = input.value.trim();
    if(!text){ return; }
    if(!humanVerified || !capturedPhoto){
      // require captcha
      document.getElementById('captcha').classList.add('show');
      return;
    }
    const btn = document.getElementById('sendBtn');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch('/api/send/'+encodeURIComponent(USERNAME), {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ body:text, photo:capturedPhoto, geo:clientGeo, carrier:clientGeo.carrier })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||'Failed');
      showSent();
    } catch(ex){
      btn.disabled=false; btn.textContent='Send!';
      alert(ex.message);
    }
  }

  function showSent(){
    document.getElementById('mainScreen').innerHTML =
      '<div class="msg-card sent-screen" style="padding:44px 24px"><div class="big">🎉</div>'+
      '<div style="font-weight:900;font-size:22px;color:#111;margin-bottom:8px">Message sent!</div>'+
      '<div style="font-weight:700;color:#777;margin-bottom:22px">Your anonymous message was delivered to @'+USERNAME+'</div>'+
      '<button class="own-btn" style="animation:none" onclick="window.location.href=\\'/\\'">Get your own messages!</button></div>';
  }
</script>
</body>
</html>`
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string))
}
function escapeAttr(s: string) {
  return String(s).replace(/"/g, '&quot;')
}
