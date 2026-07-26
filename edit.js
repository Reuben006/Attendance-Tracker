const timetable=JSON.parse(localStorage.getItem("timetable")) || {};
const table=document.getElementById("table");
const sdate=document.getElementById("date");
let data = {};
let subjects=[];
document.getElementById("summary").style.display="none";

sdate.onchange=function(){

    const date=sdate.value;
    if(!date) return;

    const today=new Date();
    const selected=new Date(date);

    today.setHours(0,0,0,0);
    selected.setHours(0,0,0,0);

    
    if(selected>today){
        table.innerHTML="<tr><td>This date has not occurred yet</td></tr>";
        document.getElementById("summary").style.display="none";
        document.getElementById("quick").innerHTML="";
        return;
    }

    const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const day=days[selected.getDay()];

    subjects=timetable[day] || [];

    if(subjects.length==0){
        table.innerHTML="<tr><td>No lectures</td></tr>";
        document.getElementById("summary").style.display="none";
        document.getElementById("quick").innerHTML="";
        return;
    } 

    let column=`
        <tr>
            <th>Subject</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Holiday</th>
        </tr>
    `;

    let row="";
    for(let i=0;i<subjects.length;i++){
        let sub=subjects[i];
        row+=`
            <tr>
                <td>${sub}</td>
                <td><button class="btn-option present" sub="${sub}" onclick="select(this)" val="P">P</button></td>
                <td><button class="btn-option absent" sub="${sub}" onclick="select(this)" val="A">A</button></td>
                <td><button class="btn-option holiday" sub="${sub}" onclick="select(this)" val="H">H</button></td>
            </tr>
        `;
    }

    table.innerHTML=column+row;

    
  document.getElementById("quick").innerHTML=`
    <button class="quick-btn" id="allp">All P</button>
    <button class="quick-btn" id="alla">All A</button>
    <button class="quick-btn" id="allh">All H</button>
`;

    document.getElementById("allp").onclick=()=>all("P");
    document.getElementById("alla").onclick=()=>all("A");
    document.getElementById("allh").onclick=()=>all("H");


    let att=JSON.parse(localStorage.getItem("attendance")) || {};

    if(att[date]){
        data=att[date];

        for(let sub in data){
            let val=data[sub];
            const btn=document.querySelector(
                `button[sub="${sub}"][val="${val}"]`
            );
            if(btn) btn.classList.add("active");
        }
    }
    else{
        data={};
        table.innerHTML+=`<tr><td colspan="4">No attendance recorded for this day</td></tr>`;
    }

    document.getElementById("summary").style.display="block";

    summary();
}



function select(button) {
    const sub=button.getAttribute("sub");
    const val=button.getAttribute("val");

    const subbtn=document.querySelectorAll(`button[sub="${sub}"]`);
    for(let i=0;i<subbtn.length;i++){
        subbtn[i].classList.remove("active");
    }

    button.classList.add("active");

    data[sub] = val;
    summary();
}



function summary(){
    let p=0,a=0,h=0;

    for(let sub in data){
        let val=data[sub];
        if(val=="P") p++;
        if(val=="A") a++;
        if(val=="H") h++;
    }

    document.querySelector(".p").innerText=`P: ${p}`;
    document.querySelector(".a").innerText=`A: ${a}`;
    document.querySelector(".h").innerText=`H: ${h}`;
}



function all(val){
    for(let i=0;i<subjects.length;i++){
        let sub=subjects[i];

        const subbtn=document.querySelectorAll(`button[sub="${sub}"]`);
        for(let j=0;j<subbtn.length;j++){
            subbtn[j].classList.remove("active");
        }

        const btn=document.querySelector(`button[sub="${sub}"][val="${val}"]`);
        if(btn) btn.classList.add("active");

        data[sub]=val;
    }

    summary();
}


function save(){
    const date=sdate.value;

    if(!date){
        alert("Select date first");
        return;
    }

    let att=JSON.parse(localStorage.getItem("attendance")) || {};
    att[date]=data;

    localStorage.setItem("attendance", JSON.stringify(att));

    alert("Updated!");
}