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

   var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
   var menuItemsTitleHtml = "snippets/menu-items-title.html";
   var menuItemHtml = "snippets/menu-item.html";

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

   // switching class 'active' from home to menu button
   var switchMenuToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navMenuButton").className;
    if(classes.indexOf("active") == -1){
        classes += " active";
        document.querySelector("#navMenuButton").className = classes;
    }
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
            switchMenuToActive();
            $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
        };

        // Load menu items view
        dc.loadMenuItems = function (categoryShort) {
            showLoading("#main-content");
            switchMenuToActive();
            $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort + ".json",
            buildAndShowMenuItemsHtml);
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

    // Builds HTML for single category page based on the data
    // from the server
    function buildAndShowMenuItemsHtml(categoryMenuItems) {
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml, 
            function (menuItemsTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function (menuItemHtml) {
                        var menuItemsViewHtml = buildMenuItemsViewHtml(
                            categoryMenuItems,
                            menuItemsTitleHtml,
                            menuItemHtml
                        );
                        insertHtml("#main-content", menuItemsViewHtml);
                    },
                    false
                );
            },
            false
        );
    }

    // Using category and menu items data and snippets HTML
    // build menu items view HTML to be inserted into page
    function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml){
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        // Looping over menu items
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for(var j=0; j<menuItems.length; j++){
            var html = menuItemHtml;
            html = insertProperty(html, "short_name", menuItems[j].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small", menuItems[j].price_small);
            html = insertItemPortionName(html, "small_portion_name", menuItems[j].small_portion_name);
            html = insertItemPrice(html, "price_large", menuItems[j].price_large);
            html = insertItemPortionName(html, "large_portion_name", menuItems[j].large_portion_name);
            html = insertProperty(html, "name", menuItems[j].name);
            html = insertProperty(html, "description", menuItems[j].description);

            // add clearfix after every second menu item
            if (j % 2 != 0){
                html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    // Appends price with '$' if price exists
    function insertItemPrice(html, pricePropName, priceValue) {
        if(!priceValue){
            return insertProperty(html, pricePropName, "");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }

    // Appends portion name in parenthesis if it exist
    function insertItemPortionName(html, portionPropName, portionValue) {
        if(!portionValue){
            return insertProperty(html, portionPropName, "");
        }

        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }
   
   global.$dc = dc;

})(window);