const expbtn=document.querySelector(".expbtn");
const impbtn=document.querySelector(".impbtn");
const restbtn=document.querySelector(".resbtn");
const expb=document.getElementById("exportb");
const impb=document.getElementById("importb");

 const data=localStorage.getItem("attendance")||"{}";
expb.value=data;

restbtn.onclick=()=>{
    const backup=localStorage.getItem("attendance_backup");
    if(!backup){
        alert("No backup found");
        return;
    }
    localStorage.setItem("attendance",backup);
    alert("Previous data restored!");
};

expbtn.onclick=()=>{
    const data=localStorage.getItem("attendance")||"{}";
    expb.value=data;
    navigator.clipboard.writeText(data);
    alert("Copied to clipboard!");
};

impbtn.onclick=()=>{
    try{
        const parsed=JSON.parse(impb.value);
        if(typeof parsed!="object" || Array.isArray(parsed)) throw"err";
        for(let date in parsed){
            const day=parsed[date];
            if(typeof day!="object") throw"err";
            for(let sub in day){
                const val=day[sub];
                if(val!="P" && val!="A" && val!="H") throw"err";
            }
        }
        const old=localStorage.getItem("attendance");
        localStorage.setItem("attendance_backup",old);
        localStorage.setItem("attendance",JSON.stringify(parsed));
        alert("Data loaded successfully! Backup saved!");
    } catch{
        alert("Invalid JSON format");
    }
};