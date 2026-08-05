export function renderLogin(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>NGL — anonymous q&a</title>
<link rel="icon" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body {
    font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    min-height:100vh;
    background:linear-gradient(150deg,#d81b60 0%,#f5334f 40%,#ff7a00 100%);
    display:flex; align-items:center; justify-content:center;
    padding:20px; color:#fff;
  }
  .wrap { width:100%; max-width:400px; text-align:center; }
  .logo { width:110px; height:110px; border-radius:26px; box-shadow:0 10px 30px rgba(0,0,0,.25); margin-bottom:22px; }
  .card {
    background:#fff; border-radius:26px; padding:28px 24px;
    box-shadow:0 16px 40px rgba(0,0,0,.18); color:#111;
  }
  h1 { font-size:22px; font-weight:900; margin-bottom:4px; color:#111; }
  .sub { color:#8a8a8a; font-size:14px; margin-bottom:22px; font-weight:600; }
  .tabs { display:flex; background:#f1f1f3; border-radius:14px; padding:5px; margin-bottom:20px; }
  .tabs button {
    flex:1; border:none; background:transparent; padding:11px; border-radius:10px;
    font-family:inherit; font-weight:800; font-size:15px; color:#8a8a8a; cursor:pointer; transition:.15s;
  }
  .tabs button.active { background:#fff; color:#111; box-shadow:0 2px 6px rgba(0,0,0,.08); }
  .field { text-align:left; margin-bottom:14px; }
  .field label { font-size:13px; font-weight:800; color:#555; display:block; margin-bottom:6px; margin-left:4px; }
  .field input {
    width:100%; padding:15px 16px; border:2px solid #ededed; border-radius:14px;
    font-family:inherit; font-size:16px; font-weight:600; background:#fafafa; outline:none; transition:.15s;
  }
  .field input:focus { border-color:#ff5e00; background:#fff; }
  .pw-wrap { position:relative; }
  .pw-wrap input { padding-right:48px; }
  .pw-toggle { position:absolute; top:50%; right:12px; transform:translateY(-50%); width:30px; height:30px; border:none; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; color:#8a8a8a; }
  .pw-toggle svg { width:22px; height:22px; }
  .btn {
    width:100%; padding:16px; border:none; border-radius:30px; background:#000; color:#fff;
    font-family:inherit; font-weight:900; font-size:17px; cursor:pointer; margin-top:6px; transition:transform .1s;
  }
  .btn:active { transform:scale(.98); }
  .btn:disabled { opacity:.6; }
  .err { color:#f5334f; font-size:13px; font-weight:700; margin-top:12px; min-height:16px; }
  .foot { margin-top:20px; font-size:12px; font-weight:700; color:rgba(255,255,255,.85); }
</style>
</head>
<body>
  <div class="wrap">
    <img src="/static/logo.png" class="logo" alt="NGL">
    <div class="card">
      <h1 id="title">welcome back</h1>
      <div class="sub">🔒 anonymous q&a</div>
      <div class="tabs">
        <button id="tab-login" class="active" onclick="switchTab('login')">Log in</button>
        <button id="tab-signup" onclick="switchTab('signup')">Sign up</button>
      </div>
      <form id="authForm" onsubmit="submitAuth(event)">
        <div class="field">
          <label>Username</label>
          <input id="username" autocomplete="username" placeholder="your username" required>
        </div>
        <div class="field">
          <label>Password</label>
          <div class="pw-wrap">
            <input id="password" type="password" autocomplete="current-password" placeholder="••••••••" required>
            <button type="button" class="pw-toggle" id="pwToggle" aria-label="Show password" onclick="togglePassword()">
              <!-- eye (visible) icon -->
              <svg id="eyeOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <!-- eye-off (hidden) icon -->
              <svg id="eyeOff" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>
        <button class="btn" id="submitBtn" type="submit">Log in</button>
        <div class="err" id="err"></div>
      </form>
    </div>
    <div class="foot">👇 280 friends just tapped the button 👇</div>
  </div>
<script>
  function togglePassword(){
    const inp = document.getElementById('password');
    const open = document.getElementById('eyeOpen');
    const off = document.getElementById('eyeOff');
    const btn = document.getElementById('pwToggle');
    if(inp.type === 'password'){
      inp.type = 'text';
      open.style.display = 'none';
      off.style.display = 'block';
      btn.setAttribute('aria-label','Hide password');
    } else {
      inp.type = 'password';
      open.style.display = 'block';
      off.style.display = 'none';
      btn.setAttribute('aria-label','Show password');
    }
  }
  let mode = 'login';
  function switchTab(m){
    mode = m;
    document.getElementById('tab-login').classList.toggle('active', m==='login');
    document.getElementById('tab-signup').classList.toggle('active', m==='signup');
    document.getElementById('title').textContent = m==='login' ? 'welcome back' : 'create account';
    document.getElementById('submitBtn').textContent = m==='login' ? 'Log in' : 'Sign up';
    document.getElementById('err').textContent = '';
  }
  async function submitAuth(e){
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const err = document.getElementById('err');
    err.textContent='';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    btn.disabled = true; btn.textContent = '...';
    try {
      const res = await fetch('/api/'+mode, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if(!res.ok){ throw new Error(data.error || 'Something went wrong'); }
      window.location.href = '/dashboard';
    } catch(ex){
      err.textContent = ex.message;
      btn.disabled = false;
      btn.textContent = mode==='login' ? 'Log in' : 'Sign up';
    }
  }
</script>
</body>
</html>`
}
