$(function(){ // This is the same as document.addEventListener("DOMContentLoaded", ...)

    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if(screenWidth < 768){
            $("#collapsable-nav").collapse('hide');
        }
    });
});

(function(global) {
   var dc = {};

   var homeHtml = "snippets/home-snippet.html";
   var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
   var categoriesTitleHtml = "snippets/categories-title-snippet.html";
   var categoryHtml = "snippets/category-snippet.html";

   // Inserting innerHTML for "selector"
   var insertHtml = function (selector, html){
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
   };

   // Showing loading icon inside element identified by 'selector'
   var showLoading = function(selector){
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector,html);
   };

   // Returning substitute of '{{propName}}' with propValue in given 'string'
   var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    // "g" is to replace all the 'propToReplace' that found with 'propValue'
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
   };

   //Before images and/or css are loaded
   document.addEventListener("DOMContentLoaded", 
   
   function (event) {
        // show loading icon
        showLoading("#main-content");
        // on first load, show home view
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(responseText) {
                document.querySelector("#main-content")
                .innerHTML = responseText;
            }, 
            false
        );

        // loading the menu categories view
        dc.loadMenuCategories = function () {
            showLoading("#main-content");  
            $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
        };

        // Build HTML for categories page based on the data from the server
        // -- categories = request.responseText = array of categories object (i.e Lunch)
        function buildAndShowCategoriesHTML(categories) {
            // Load title snippet of categories page
            $ajaxUtils.sendGetRequest(
                categoriesTitleHtml,
                function (categoriesTitleHtml){
                    $ajaxUtils.sendGetRequest(
                        categoryHtml,
                        function (categoryHtml) {
                            var categoriesViewHtml = buildCategoriesViewHtml(
                                categories, categoriesTitleHtml, categoryHtml
                            );
                            insertHtml("#main-content", categoriesViewHtml);
                        },
                        false
                    );
                },
                false
            );
        }
    });

    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop for each category
        for (var i = 0; i<categories.length;i++){
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }
   
   global.$dc = dc;

})(window);