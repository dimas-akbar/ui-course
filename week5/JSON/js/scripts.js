document.addEventListener("DOMContentLoaded",
    function (event) {
        document.querySelector("#getClientName")
            .addEventListener("click", 
            function() {
             $ajaxUtils.sendGetRequest("data/client.json",
                function (res) {
                    var message = res.firstName + " " + res.lastName;

                    if(res.likesChineseFood){
                        message += " likes Chinese Food"
                    }else{
                        message += " doesn't likes Chinese Food"
                    }

                    message += " and uses ";
                    message += res.numberOfDisplays;
                    message += " displays of coding."

                    document.querySelector("#content")
                        .innerHTML = message;
                });
            });
    }
);