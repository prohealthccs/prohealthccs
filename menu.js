const button = document.getElementById("menubutton")
const menu = document.getElementById("menu")
var open = "false"
async function openmenu() {
    if (open == "false") {
        menu.classList.remove("hidden")
        await sleepNow(100)
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

        await sleepNow(300)
        menu.classList.add("hidden")
        }
    }

