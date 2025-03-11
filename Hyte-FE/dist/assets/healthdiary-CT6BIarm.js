import{f as g}from"./fetch-CLQ4DtwB.js";import{c as E}from"./auth-C8NNvD32.js";const y=async()=>{const e=document.querySelector(".card-area"),o="http://localhost:3000/api/entries",a={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},s=await g(o,a);if(s.error){console.log("Tapahtui virhe fetch haussa!!");return}if(e.innerHTML="",s.length===0){const n=document.createElement("p");n.textContent="No entries found",e.appendChild(n);return}s.forEach(n=>{const d=document.createElement("div");d.classList.add("card");const c=document.createElement("div");c.classList.add("card-img");const i=document.createElement("div");i.id="delete-and-edit";const r=document.createElement("img");r.src="/img/delete.svg",r.alt="Delete Icon",r.setAttribute("data-id",n.entry_id),r.addEventListener("click",h=>{const l=h.target.dataset.id;b(l),y()}),i.appendChild(r);const t=document.createElement("img");t.src="/img/edit.svg",t.alt="Edit Icon",t.setAttribute("data-id",n.entry_id),t.addEventListener("click",h=>{h.target.dataset.id;const l=document.getElementById("snackbar");l.innerHTML="Ominaisuus tulossa. Tässä snackbar!",l.className="show",setTimeout(()=>{l.className=l.className.replace("show","")},3e3)}),i.appendChild(t),c.appendChild(i);const m=document.createElement("img");m.src="/img/diary.png",m.id="diary-image",m.alt="Diary Image",c.appendChild(m);const p=document.createElement("div");p.classList.add("card-diary");const v=new Date(n.entry_date).toLocaleDateString("fi-FI");p.innerHTML=`
      <p><strong>Päivämäärä:</strong> ${v}</p>
      <p><strong>Olotila:</strong> ${n.mood}</p>
      <p><strong>Paino:</strong> ${n.weight} kg</p>
      <p><strong>Uni:</strong> ${n.sleep_hours} hours</p>
      <p><strong>Kuvaus:</strong> ${n.notes}</p>
    `,d.appendChild(c),d.appendChild(p),e.appendChild(d)})},f=async()=>{console.log("Lähetetään data palvelimelle");const e=document.getElementById("add-form"),o=e.querySelector("input[name=date]").value,a=e.querySelector("input[name=mood]").value,s=e.querySelector("input[name=weight]").value,n=e.querySelector("input[name=sleep_hours]").value,d=e.querySelector("input[name=notes]").value,c={entry_date:o,mood:a,weight:s,sleep_hours:n,notes:d};console.log(c);const i="http://localhost:3000/api/entries",r={body:JSON.stringify(c),method:"POST",headers:{"Content-type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}},t=await g(i,r);if(t.error){console.log("Tapahtui virhe fetch haussa!!");return}t.message&&console.log(t.message),e.reset(),y(),console.log(t)},b=async e=>{const o=`http://localhost:3000/api/entries/${e}`,a={method:"DELETE",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},s=await g(o,a);if(s.error){console.log("Tapahtui virhe fetch haussa!!");return}s.message&&console.log(s.message)},u=document.getElementById("snackbar"),I=(e,o="")=>{u.innerText=e,u.className=`show ${o}`.trim(),setTimeout(()=>{u.className=u.className.replace("show","").trim()},3e3)},B=async e=>{e.preventDefault();const o=document.getElementById("about-me-form"),a=document.querySelector("#username-edit").value.trim(),s=document.querySelector("#password-edit").value.trim(),n=document.querySelector("#email-edit").value.trim(),d="http://localhost:3000/api/users",c={username:a,password:s,email:n},i=localStorage.getItem("token"),r={body:JSON.stringify(c),method:"PUT",headers:{Authorization:`Bearer ${i}`,"Content-type":"application/json"}};console.log(r);const t=await g(d,r);if(t.error){console.log(t.error),I("Virhe lähettämisessä, täytä kaikki vaadittavat kentät!","error");return}document.getElementById("updated-username").innerHTML=`&nbsp${a}`,t.message&&console.log(t.message),console.log(t),o.reset()};y();const k=async()=>{const e=await E();console.log(e);const o=e.username;if(document.getElementById("updated-username").innerHTML=`&nbsp${o}`,e.user_level=="admin"){const a=document.getElementById("admin-button");a.style.visibility="visible",a.addEventListener("click",()=>{window.location.href="/src/pages/adminpanel.html"})}else document.getElementById("admin-button").style.visibility="hidden"};k();const w=document.getElementById("logout-button");w.addEventListener("click",()=>{localStorage.removeItem("token"),window.location.href="/src/pages/index.html"});const L=document.getElementById("about-me-dialog"),S=document.getElementById("about-me-button");S.addEventListener("click",async()=>{const e=await E();document.getElementById("username-edit").setAttribute("value",e.username),document.getElementById("email-edit").setAttribute("value",e.email),document.getElementById("about-me-dialog").showModal()});const T=document.getElementById("add-button");T.addEventListener("click",()=>{document.getElementById("add-dialog").showModal()});const D=document.querySelectorAll(".dialog");D.forEach(e=>{window.addEventListener("click",o=>{o.target===e&&e.close()})});const $=document.querySelectorAll(".close");$.forEach(e=>{e.addEventListener("click",()=>{L.close()})});const C=document.getElementById("diary-submit");C.addEventListener("click",e=>{e.preventDefault(),console.log("diaryFormButton clicked"),f(),document.getElementById("add-dialog").close()});const q=document.getElementById("user-edit-submit");q.addEventListener("click",e=>{e.preventDefault(),console.log("userinfo updated"),B(e),document.getElementById("about-me-dialog").close()});
