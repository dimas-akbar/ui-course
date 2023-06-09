document.addEventListener("DOMContentLoaded",
    function (event) {
        document.querySelector("#getClientName")
            .addEventListener("click", 
            function() {
             $ajaxUtils.sendGetRequest("data/name.txt",
                function (request) {
                    var name = request.responseText;

                    document.querySelector("#content")
                        .innerHTML = name;
                });
            });
    }
);