const usr = JSON.parse(localStorage.getItem("user")) || {};
const att = JSON.parse(localStorage.getItem("attendance")) || {};
const tt = JSON.parse(localStorage.getItem("timetable")) || {};
const editBox = document.getElementById("editBox");

function loadUser(){
    document.getElementById("nm").innerText=usr.name || "User";
    document.getElementById("roll").innerText="Roll No: " + (usr.roll || "N/A");
    document.getElementById("email").innerText="Email Id: " + (usr.email || "N/A");
}
loadUser();

function toggleEdit(){
    if(editBox.style.display==="block"){
        editBox.style.display="none";
        return;
    }
    editBox.style.display="block";
    document.getElementById("nameInp").value=usr.name || "";
    document.getElementById("rollInp").value=usr.roll || "";
    document.getElementById("emailInp").value=usr.email || "";
    document.getElementById("threshInp").value=usr.thresh || 75;
}

function saveProf(){
    const name=document.getElementById("nameInp").value.trim();
    const roll=document.getElementById("rollInp").value.trim();
    const email=document.getElementById("emailInp").value.trim();
    const thresh=Number(document.getElementById("threshInp").value) || 75;
    if(!name || !roll || !email){
        alert("Fill all fields");
        return;
    }
    if (!email.includes("@") || !email.includes(".")) {
    alert("Invalid email");
    return;
    }
    const obj={
        name:name,
        roll:roll,
        email:email,
        thresh:thresh
    };
    localStorage.setItem("user",JSON.stringify(obj));
    Object.assign(usr, obj);
    loadUser();
    editBox.style.display = "none";
    loadAlerts();
}

function getOverall(){
    let p=0,t=0;
    for(let d in att){
        for(let s in att[d]){
            if(att[d][s]!=="H") t++;
            if(att[d][s]==="P") p++;
        }
    }
    const per=t===0?0:Math.round((p/t)*100);
    return {p,t,per};
}

function getWeekly(){
    let p=0,t=0;
    const now=new Date();
    for(let d in att){
        const dt=new Date(d);
        const diff=(now-dt)/(1000*60*60*24);
        if(diff>=0 && diff<7){
            for(let s in att[d]){
                if(att[d][s]!=="H") t++;
                if(att[d][s]==="P") p++;
            }
        }
    }
    const per=t===0?0:Math.round((p/t)*100);
    return {p,t,per};
}

function loadStats(){
    const o=getOverall();
    document.getElementById("total").innerText=o.per+"%";
    document.getElementById("totalDetail").innerText=
        o.t === 0 ? "No data" : `${o.p}/${o.t} lectures`;
    const w=getWeekly();
    document.getElementById("weekly").innerText=
        w.t === 0 ? "--" : w.per + "%";
    document.getElementById("weeklyDetail").innerText =
        w.t === 0 ? "No data" : `${w.p}/${w.t} lectures`;
    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today=days[new Date().getDay()];
    document.getElementById("day").innerText=today;
    document.getElementById("todayLec").innerText =
        (tt[today] || []).join(", ") || "No lectures";
}
loadStats();

function loadAlerts(){
    const thresh=usr.thresh || 75;
    let html="";
    const todayDate=new Date().toISOString().slice(0,10);
    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today=days[new Date().getDay()];
    const todaySubs=tt[today] || [];
    if(Object.keys(tt).length===0){
        html+="<div class='alert warn'> Timetable not set</div>";
    }
    if(todaySubs.length>0 && !att[todayDate]){
        html+="<div class='alert warn'> Today's attendance not marked</div>";
    }
    let subs={};
    for(let d in att){
        for(let s in att[d]){
            if(!subs[s]){
                subs[s]={p:0, t:0};
            }
            if(att[d][s]!=="H") subs[s].t++;
            if(att[d][s]==="P") subs[s].p++;
        }
    }
    for(let s in subs){
        const pct=Math.round((subs[s].p/subs[s].t)*100);
        if(pct<thresh){
            html+=`<div class='alert bad'> ${s} below ${thresh}% (${pct}%)</div>`;
        }
    }
    if(!html){
        html="<div class='alert good'> All good</div>";
    }
    document.getElementById("alerts").innerHTML=html;
}
loadAlerts();