var modal = document.getElementById("modal");

if (localStorage.getItem("hiringmodal") != "closed") {
    localStorage.setItem("hiringmodal", "open");
    hiringopen = localStorage.getItem("hiringmodal");
}

if (hiringopen = open) {
    modal.classList.remove("hidden");
}



async function hiringmodalremove() {
        localStorage.setItem("hiringmodal", "closed");
        modal.classList.add("duration-500"); 
        modal.classList.add("md:duration-200");
        modal.classList.add("opacity-0");
        modal.classList.add("scale-y-0");  
        modal.classList.add("md:scale-y-100"); 
        modal.classList.add("h-0"); 
        await sleepNow(500)
        modal.classList.add("hidden");
        
}


if (localStorage.getItem("hiringmodal") == "closed") {
    modal.classList.add("hidden");
}