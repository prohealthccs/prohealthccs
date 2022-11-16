const button = document.getElementById("menubutton")
const menu = document.getElementById("menu")
var open = "false"
function openmenu() {
    if (open == "false") {
        button.classList.remove("fa-bars")
        button.classList.add("fa-x")
        menu.classList.add("translate-x-0")
        menu.classList.remove("translate-x-56")
        open = "true"

    }else{
        button.classList.add("fa-bars")
        button.classList.remove("fa-x")
        menu.classList.remove("translate-x-0")
        menu.classList.add("translate-x-56")
        open = "false"
        }
    }

