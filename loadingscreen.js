const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

var p = 0
var percentage = 0
var ready = false
window.document.addEventListener("readystatechange", function(){
    if(document.readyState == "complete"){
        p = 1
        ready = true
        show()
    }
}, false);

async function timeout_trigger() {
    while (true) {
        await sleepNow(100)
        if (ready == false) {
            p = p + 0.1 
        }

        if (p > 0.8 && ready == false ) {
            p = 0.8
        }
        percentage =  p * 208 + "px"
        px = "px"
        document.getElementById("progressbar").style.width = String(percentage);
    }
  
}
timeout_trigger();

async function show() {
   
    await sleepNow(700)
    document.getElementById("progressbar").style.transitionDuration = "0ms"
    document.getElementById("loader").style.opacity = "0"
    await sleepNow(700)
    document.getElementById("loader").style.visibility = "hidden"

}