const timetable=JSON.parse(localStorage.getItem("timetable")) || {};
const today=new Date();
const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const day=days[today.getDay()];
const date=today.toJSON().slice(0,10);
const subjects=timetable[day] || [];

document.getElementById("date").innerText=`${day}, ${date}`;

let data = {};
const table=document.getElementById("table");
if(subjects.length==0){
    table.innerHTML="<tr><td>No lectures today</td></tr>";
} 
else{
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

document.getElementById("allp").onclick=()=>all("P");
document.getElementById("alla").onclick=()=>all("A");
document.getElementById("allh").onclick=()=>all("H");
function all(val){
    for(let i=0;i<subjects.length;i++){
        let sub=subjects[i];
        const subbtn=document.querySelectorAll(`button[sub="${sub}"]`);
        for(let i=0;i<subbtn.length;i++){
            subbtn[i].classList.remove("active");
        }
        const btn=document.querySelector(`button[sub="${sub}"][val="${val}"]`);
        btn.classList.add("active");
        data[sub]=val;
    }
    summary();
}

function save(){
    let att=JSON.parse(localStorage.getItem("attendance")) || {};
    att[date]=data;
    localStorage.setItem("attendance", JSON.stringify(att));
    alert("Saved!");
};

const att=JSON.parse(localStorage.getItem("attendance")) || {};
if(att[date]){
    data=att[date];
    for(let sub in data){
        let val=data[sub];
        const btn=document.querySelector(
            `button[sub="${sub}"][val="${val}"]`
        );
        btn.classList.add("active");
    };
    summary();
}