document.addEventListener("DOMContentLoaded", 
    function (event) {
        
        // Response to ENTER button clicked
        function confirmationResponse(event) {
            this.textContent = "ENTERED";
            var name = document.getElementById("name").value;
    
            if(name === "hacker"){
                var title = document.querySelector("#title").textContent;
                title = "Boom. Boom. Splash.";
    
                document.querySelector("#title").textContent = title;
                var message = "<h1> We know you are a hacker. <h1>";
            } else {
                var message = "Thank you " + name + ". <br>Your inquiry is being proceed.";
            }
            // document.getElementById("content").textContent = message;
            document.getElementById("content").innerHTML = message;
        }

        function mouseMoveDisplay(event) {
            if(event.shiftKey){
                console.log("x: " + event.clientX);
                console.log("y: " + event.clientY);
            }
        }

        // This will enable us to Handle the event after DOM Content are loaded
        document.querySelector("button").addEventListener("click", confirmationResponse);

        // Example of another event such as mousemove
        document.addEventListener("mousemove", mouseMoveDisplay);

    }
);

// function confirmationResponse() {
//     var name = document.getElementById("name").value;

//     if(name === "hacker"){
//         var title = document.querySelector("#title").textContent;
//         title = "Boom. Boom. Splash.";

//         document.querySelector("#title").textContent = title;
//         var message = "<h1> We know you are a hacker. <h1>";
//     } else {
//         var message = "Thank you " + name + ". <br>Your inquiry is being proceed.";
//     }
//     // document.getElementById("content").textContent = message;
//     document.getElementById("content").innerHTML = message;
// }