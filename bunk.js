const data=JSON.parse(localStorage.getItem("attendance"))||{};
let subs={};

for(let d in data){
    const day=data[d];
    for(let s in day){
        if(!subs[s]){
            subs[s]={p:0,t:0};
        }
        if(day[s]!=="H"){
            subs[s].t++;
        }
        if(day[s]==="P"){
            subs[s].p++;
        }
    }
}

const sel=document.getElementById("subjectdrop");

Object.keys(subs).forEach(s=>{
    const opt=document.createElement("option");
    opt.value=s;
    opt.innerText=s;
    sel.appendChild(opt);
});

document.querySelector(".btn").addEventListener("click",()=>{

    const s=sel.value;
    const f=Number(document.getElementById("upcome").value);
    const target=Number(document.getElementById("target").value);
    if(target<0 || target>100){
        document.querySelector(".result").innerText="target %age shoudl be in range [0,100]";
        return;
    }

    if(!subs[s]){
        document.querySelector(".result").innerText="No data";
        return;
    }

    if(target<=0){
        document.querySelector(".result").innerHTML=`
        <p><b>${s}</b></p>
        <p>Target is 0%</p>
        <p class="good">No attendance required</p>`;
        return;
    }

    if(target>=100){
        document.querySelector(".result").innerHTML=`
        <p><b>${s}</b></p>
        <p>Target is 100%</p>
        <p class="bad">All lectures must be attended</p>`;
        return;
    }

    const p=subs[s].p;
    const t=subs[s].t;

    const per=t===0?0:(p/t)*100;

    let diff;

    if(per>=target){
        diff=Math.floor((p/(target/100))-t);
    }else{
        diff=-Math.ceil(((target/100)*t-p)/(1-(target/100)));
    }

    let need=0;

    while(((p+need)/(t+f))*100<target){
        need++;
        if(need>f)break;
    }

    let txt;

    if(need>f){
        txt=`
        <span class="bad">
        Even if all ${f} lectures are attended,<br>
        attendance will remain below ${target}%
        </span>`;
    }else{
        txt=`
        Out of ${f} upcoming lectures,<br>
        attend <b>${need}</b>`;
    }

    document.querySelector(".result").innerHTML=`
    <p><b>${s}</b></p>
    <p>Current Attendance: ${per.toFixed(2)}%</p>
    <p>
    ${diff>100
    ?`<span class="good">Attendance far above requirement</span>`
    :diff>=0
    ?`<span class="good">Safe by ${diff} lectures</span>`
    :`<span class="bad">Short by ${Math.abs(diff)} lectures</span>`}
    </p>
    <p>${txt}</p>`;
});