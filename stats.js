const data=JSON.parse(localStorage.getItem("attendance")) || {};
let subjects={};

for(let date in data){
    const day=data[date];
    for(let subject in day){
        if(!subjects[subject] && day[subject]!=="H"){
            subjects[subject]={present:0,total:0};
        }
        if(day[subject]==="P"){
            subjects[subject].present++;
        }
        if(day[subject]!=="H"){
            subjects[subject].total++;
        }
    }
}

const table=document.querySelector("table");

let pcnt=0;
let tcnt=0;

if(Object.keys(subjects).length===0){
    table.innerHTML+=`<tr><td colspan="4">No attendance data</td></tr>`;
   }

Object.keys(subjects).forEach(sub => {
    const p=subjects[sub].present;
    const t=subjects[sub].total;

    pcnt+=p;
    tcnt+=t;

    const percent=t===0?0:Math.round((p/t)*100);


    let status="";
    let cls="";
  

    if(percent<75){
        status="Low";
        cls="red";
        
    } else if(percent<85){
        status="Good";
        cls="orange";
       
    } else {
        status="Excellent";     
        cls="green";
        
    }

    const row=document.createElement("tr");

    row.innerHTML = `
        <td>${sub}</td>
        <td>${p}/${t}</td>
        <td class="${cls}">${percent}%</td>
        <td class="${cls}">${status}</td>
    `;

    table.appendChild(row);
});

const overall=tcnt===0?0:Math.round((pcnt/tcnt)*100);
if(tcnt===0){
    document.querySelector(".overall").innerText=`Overall Attendance: No data`;
}
else{
    document.querySelector(".overall").innerText=`Overall Attendance: ${overall}%`;
}