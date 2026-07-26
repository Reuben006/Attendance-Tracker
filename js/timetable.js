const btn = document.querySelector(".btn");

const saved=JSON.parse(localStorage.getItem("timetable")) || {};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
days.forEach(day=>{
    if(saved[day]){
        document.getElementById(day).value=saved[day].join(", ");
    }
});

btn.addEventListener("click", () => {
    const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];

    let timetable={};

    for(let i=0;i<days.length;i++){
        let day=days[i];
        const value=document.getElementById(day).value;

        if(value.trim()!==""){
            timetable[day]=value.split(",").map(s => s.trim());
        }
    };

    localStorage.setItem("timetable", JSON.stringify(timetable));

    alert("Timetable Saved!");
});