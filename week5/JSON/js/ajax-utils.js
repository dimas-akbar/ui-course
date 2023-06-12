(function (global) {

    //Fake Namespace
    var ajaxUtils = {};

    //Function
    function getRequestObjects() {
        if(global.XMLHttpRequest){
            return (new XMLHttpRequest());
        }else if(global.ActiveXObject){
            return (new ActiveXObject("Microsoft.XMLHTTP"));
        }else{
            global.alert("AJAX is not supported!");
            return(null);
        }
    }

    ajaxUtils.sendGetRequest = 
        function (requestUrl, responseHandler, isJsonResponse) {
            var request = getRequestObjects();
            request.open("GET", requestUrl, true);
            request.onreadystatechange = 
                function () {
                    handleResponse(request, responseHandler, isJsonResponse);
                };
            request.send(null); //this is for POST so we doesn't need it now
        };

    function handleResponse(request, responseHandler, isJsonResponse) {
        if((request.readyState == 4) &&
           (request.status == 200)) {

            if(isJsonResponse == undefined){
                isJsonResponse = true;
            }

            if(isJsonResponse){
                responseHandler(JSON.parse(request.responseText));
            }else{
                responseHandler(request.responseText)
            }
        }
    }

    global.$ajaxUtils = ajaxUtils;
    
})(window);