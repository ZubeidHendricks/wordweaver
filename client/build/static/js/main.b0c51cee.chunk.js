(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{64:function(e,t,a){e.exports=a(87)},87:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),o=a(48),c=a.n(o),l=a(5),i=a(27),s=a(115),m=a(107),d=a(91),u=a(108),f=a(109),g=a(119),p=a(22);var h=e=>{let{letters:t,onLetterSelect:a}=e;const n=t.length,o=(e=>Object(p.c)(e.length,{from:{opacity:0,transform:"scale(0)"},to:{opacity:1,transform:"scale(1)"},delay:200,config:{mass:1,tension:120,friction:14}}))(t);return r.a.createElement("svg",{width:300,height:300},o.map((e,o)=>{const c=o/n*2*Math.PI-Math.PI/2,l=150+105*Math.cos(c),i=150+105*Math.sin(c);return r.a.createElement(p.a.text,{key:o,x:l,y:i,textAnchor:"middle",dominantBaseline:"central",fontSize:"24",onClick:()=>a(t[o],o),style:{cursor:"pointer",...e}},t[o])}))};var E=e=>{let{words:t,completedWords:a}=e;return r.a.createElement("div",{className:"word-grid"},t.map((e,t)=>r.a.createElement("div",{key:t,className:"word ".concat(a.includes(e)?"completed":"")},e.split("").map((t,n)=>r.a.createElement("span",{key:n,className:"letter"},a.includes(e)?t:"_")))))},b=a(49),y=a.n(b);var v=e=>{let{adSlot:t}=e;return r.a.createElement(y.a.Google,{client:"ca-pub-3043747446376015",slot:t,style:{display:"block"},format:"auto",responsive:"true"})};var S=e=>{let{gameData:t,isDaily:a,user:o,showNotification:c}=e;const[l,i]=Object(n.useState)([]),[b,y]=Object(n.useState)([]),[S,w]=Object(n.useState)([]),[O,j]=Object(n.useState)(""),[k,x]=Object(n.useState)(0),[W,M]=Object(n.useState)(0),[C,L]=Object(n.useState)("ready"),[N,z]=Object(n.useState)(3),[A,I]=Object(n.useState)(!1),[G,P]=Object(n.useState)(!1);Object(n.useEffect)(()=>{o.gamesPlayed%5===0&&I(!0)},[o.gamesPlayed]),Object(n.useEffect)(()=>{t&&(i(t.letters),y(t.words),M(t.timeLimit||300),L("ready"))},[t]),Object(n.useEffect)(()=>{let e;return"playing"===C&&W>0?e=setInterval(()=>{M(e=>e-1)},1e3):0===W&&"playing"===C&&T(),()=>clearInterval(e)},[C,W]);const T=async()=>{L("finished");try{await s.a.post("/api/user/stats",{score:k,wordsGuessed:S.length,timeTaken:t.timeLimit-W,isDaily:a}),c("Game stats updated","success"),o.gamesPlayed%5===0&&I(!0)}catch(e){c("Error updating stats","error")}},R=Object(p.b)({number:k,from:{number:0}});return t?r.a.createElement(d.a,{elevation:3,style:{padding:"20px",margin:"20px 0"}},r.a.createElement(u.a,{variant:"h4"},a?"Daily Challenge":"Word Weaver"),r.a.createElement(f.a,{container:!0,spacing:3},r.a.createElement(f.a,{item:!0,xs:12,md:6},r.a.createElement(h,{letters:l,onLetterSelect:e=>{j(t=>t+e)}})),r.a.createElement(f.a,{item:!0,xs:12,md:6},r.a.createElement(E,{words:b,guessedWords:S}))),r.a.createElement(u.a,{variant:"h6"},"Score: ",r.a.createElement(p.a.span,null,R.number.to(e=>Math.floor(e)))),r.a.createElement(u.a,{variant:"h6"},"Time Left: ",W," seconds"),r.a.createElement(u.a,{variant:"h6"},"Current Word: ",O),r.a.createElement(g.a,{variant:"contained",color:"primary",onClick:()=>{if(b.includes(O)&&!S.includes(O)){const e=O.length*(a?2:1);x(t=>t+e),w(e=>[...e,O]),c('Word "'.concat(O,'" is correct! +').concat(e," points"),"success")}else S.includes(O)?c("Word already guessed","warning"):c("Not a valid word","error");j("")},disabled:"playing"!==C},"Submit Word"),r.a.createElement(g.a,{variant:"contained",color:"secondary",onClick:()=>{if(N>0){const e=b.filter(e=>!S.includes(e));if(e.length>0){const t=e[Math.floor(Math.random()*e.length)],a=t[Math.floor(Math.random()*t.length)];c('Hint: The letter "'.concat(a,'" is in one of the words'),"info"),z(e=>e-1)}}else c("No hints remaining","warning")},disabled:"playing"!==C||0===N},"Use Hint (",N," remaining)"),"ready"===C&&r.a.createElement(g.a,{variant:"contained",color:"primary",onClick:()=>{L("playing"),x(0),w([]),j("")}},"Start Game"),A&&r.a.createElement("div",{style:{margin:"20px 0"}},r.a.createElement(u.a,{variant:"subtitle1"},"Advertisement"),r.a.createElement(v,{adSlot:"5427959914"})),"finished"===C&&r.a.createElement("div",null,r.a.createElement(u.a,{variant:"h5"},"Game Over!"),r.a.createElement(u.a,{variant:"h6"},"Final Score: ",k),r.a.createElement(u.a,{variant:"h6"},"Words Guessed: ",S.length),r.a.createElement(g.a,{variant:"contained",color:"primary",onClick:()=>window.location.reload()},"Play Again"))):r.a.createElement(m.a,null)};var w=e=>{let{setUser:t}=e;const[a,o]=Object(n.useState)(!0),[c,l]=Object(n.useState)(""),[i,m]=Object(n.useState)("");return r.a.createElement("div",{className:"auth-container"},r.a.createElement("h2",null,a?"Login":"Register"),r.a.createElement("form",{onSubmit:async e=>{e.preventDefault();try{const e=a?"/api/auth/login":"/api/auth/register",{data:l}=await s.a.post(e,{username:c,password:i});localStorage.setItem("token",l.token),t(l.user)}catch(o){var n,r;console.error("Authentication error:",o),((e,t)=>{alert("".concat(t,": ").concat(e))})((null===(n=o.response)||void 0===n?void 0:null===(r=n.data)||void 0===r?void 0:r.message)||"An error occurred","error")}}},r.a.createElement("input",{type:"text",placeholder:"Username",value:c,onChange:e=>l(e.target.value)}),r.a.createElement("input",{type:"password",placeholder:"Password",value:i,onChange:e=>m(e.target.value)}),r.a.createElement("button",{type:"submit"},a?"Login":"Register")),r.a.createElement("button",{onClick:()=>o(!a)},a?"Need to register?":"Already have an account?"))};var O=()=>{const[e,t]=Object(n.useState)([]);return Object(n.useEffect)(()=>{(async()=>{try{const{data:a}=await s.a.get("/api/leaderboard");t(a)}catch(e){console.error("Error fetching leaderboard:",e)}})()},[]),r.a.createElement("div",{className:"leaderboard"},r.a.createElement("h2",null,"Leaderboard"),r.a.createElement("ol",null,e.map((e,t)=>r.a.createElement("li",{key:t},e.username,": ",e.highScore))))};var j=e=>{let{message:t,type:a}=e;return t?r.a.createElement("div",{className:"notification ".concat(a)},t):null},k=a(54),x=a(110),W=a(40),M=a(39),C=a(111),L=a(112),N=a(113),z=a(114),A=a(118);const I=Object(k.a)({palette:{primary:{main:W.a[700]},secondary:{main:M.a[500]}},typography:{fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',h1:{fontSize:"2.5rem",fontWeight:500},h2:{fontSize:"2rem",fontWeight:500},h3:{fontSize:"1.75rem",fontWeight:500},body1:{fontSize:"1rem"},button:{textTransform:"none"}},shape:{borderRadius:8},overrides:{MuiButton:{root:{padding:"8px 16px"}},MuiCard:{root:{boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"}}},props:{MuiButton:{disableElevation:!0}}});var G=()=>{const[e,t]=Object(n.useState)(null),[a,o]=Object(n.useState)({message:"",type:""});Object(n.useEffect)(()=>{const e=localStorage.getItem("token");e&&(s.a.defaults.headers.common.Authorization="Bearer ".concat(e),c())},[]);const c=async()=>{try{const{data:a}=await s.a.get("/api/user");t(a)}catch(e){console.error("Error fetching user data:",e),localStorage.removeItem("token")}},m=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"info";o({message:e,type:t}),setTimeout(()=>o({message:"",type:""}),3e3)};return r.a.createElement(x.a,{theme:I},r.a.createElement(C.a,null),r.a.createElement(i.a,null,r.a.createElement(L.a,{position:"static"},r.a.createElement(N.a,null,r.a.createElement(u.a,{variant:"h6",style:{flexGrow:1}},"Word Weaver"),r.a.createElement(g.a,{color:"inherit",component:i.b,to:"/game"},"Game"),r.a.createElement(g.a,{color:"inherit",component:i.b,to:"/leaderboard"},"Leaderboard"),e?r.a.createElement(g.a,{color:"inherit",onClick:()=>{localStorage.removeItem("token"),t(null),m("Logged out successfully","success")}},"Logout"):r.a.createElement(g.a,{color:"inherit",component:i.b,to:"/login"},"Login"))),r.a.createElement(z.a,null,r.a.createElement(j,{message:a.message,type:a.type}),r.a.createElement(l.d,null,r.a.createElement(l.b,{path:"/login",render:()=>e?r.a.createElement(l.a,{to:"/game"}):r.a.createElement(w,{setUser:t,showNotification:m})}),r.a.createElement(t=>{let{component:a,...n}=t;return r.a.createElement(l.b,Object.assign({},n,{render:t=>e?r.a.createElement(a,t):r.a.createElement(l.a,{to:"/login"})}))},{path:"/game",component:t=>r.a.createElement(S,Object.assign({},t,{user:e,showNotification:m}))}),r.a.createElement(l.b,{path:"/leaderboard",component:O}),r.a.createElement(l.a,{from:"/",to:"/game"})),r.a.createElement(A.a,{mt:4},r.a.createElement(v,{adSlot:"5427959914"})))))},P=a(116);var T=Object(P.a)({palette:{primary:{main:"#1976d2",light:"#42a5f5",dark:"#1565c0",contrastText:"#ffffff"},secondary:{main:"#dc004e",light:"#ff4081",dark:"#9a0036",contrastText:"#ffffff"},error:{main:"#f44336"},warning:{main:"#ff9800"},info:{main:"#2196f3"},success:{main:"#4caf50"},background:{default:"#ffffff",paper:"#f5f5f5"}},typography:{fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif',h1:{fontSize:"2.5rem",fontWeight:500},h2:{fontSize:"2rem",fontWeight:500},body1:{fontSize:"1rem"}},shape:{borderRadius:8},spacing:8});c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(x.a,{theme:T},r.a.createElement(G,null))),document.getElementById("root"))}},[[64,1,2]]]);
//# sourceMappingURL=main.b0c51cee.chunk.js.map