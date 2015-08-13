"use strict";angular.module("webApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","restangular","angularLocalStorage","ui.bootstrap","ui.calendar","ui.utils"]).config(["$routeProvider","$locationProvider","$windowProvider",function(a,b,c){b.html5Mode(!0);var d=c.$get().appId;a.when("/",{templateUrl:"views/welcome.tpl.html",controller:"WelcomeCtrl",resolve:{layout:["$route","Layouts",function(a,b){return b.getLayout(d)}]}}).otherwise({templateUrl:"views/welcome.tpl.html",controller:"WelcomeCtrl",resolve:{layout:function(a,b){return b.getLayout(d)}}})}]),angular.module("webApp").controller("WelcomeCtrl",["$scope","$location","$window","$http","$timeout","$routeParams","$rootScope","menusService","storage","layout",function(a,b,c,d,e,f,g,h,i,j){a.PARALLAX_FACTOR=.8,a.$$parllaxBackgrounds={},a.$$parllaxItems={},a.$$parllaxImages={},a.$$hashNavigators={},a.$$layouts={},a.$$isDefaultHashSet=!1,a.$$isInHashRegion=!1,a.$$parallaxNav=null,a.detectScroll=!0,a.showPhotoViewerModal=!1,a.showMenuViewerModal=!1,a.selectedMenu=null,a.site=j.site,a.pages=j.site.pages,a.style=j.site.style,a.categories=j.site.products;var k=j.site.business,l={};if(console.log(a.site),g.metatags={title:a.site.name,description:a.site.description.join(""),robots:"index, follow",keywords:a.site.keywords},a.capitalize=function(a){return a[0].toUpperCase()+a.slice(1)},k.hours){for(var m=k.hours,n=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],o=0;o<n.length;o++){var p=m[n[o]];for(var q in p)l[p[q].text]||(l[p[q].text]=[]),l[p[q].text].push(p[q].day)}a.hours=[];for(var q in l){var n=l[q],r=n[0],s=n[n.length-1];a.hours.push({day:a.capitalize(r)+" - "+a.capitalize(s),hour:q})}}a.locations=[k],a.appId=f.appId,a.shoppingCartKey="shoppingCart-appId-"+a.appId,a.shoppingCart=i.get(a.shoppingCartKey),"object"==typeof a.shoppingCart&&a.shoppingCart||(a.shoppingCart={quantity:0,items:{},totalPrice:0}),a.$on("$viewContentLoaded",function(){angular.element(c).trigger("redraw"),c.prerenderReady=!0}),angular.element(c).bind("update_cart",function(){a.shoppingCart=h.getShoppingCart()}),a.showCart=function(){b.hash(""),b.path(a.appId+"/show-cart")},a.enableScroll=function(a){$("body").css({"overflow-y":a?"auto":"hidden","overflow-x":a?"auto":"hidden"})},a.enableScroll(!0),a.openModal=function(){a.detectScroll=!1,angular.element(c).trigger("redraw"),a.enableScroll(!1)},a.closeModal=function(){a.detectScroll=!0,a.enableScroll(!0)},a.openMenuViewerModal=function(b){a.openModal(),a.selectedMenu=b,a.showMenuViewerModal=!0},a.closeMenuViewerModal=function(){a.closeModal(),a.showMenuViewerModal=!1},a.openPhotoViewerModal=function(){a.openModal(),a.showPhotoViewerModal=!0},a.closePhotoViewerModal=function(){a.closeModal(),a.showPhotoViewerModal=!1},a.scrollTo=function(c,d){b.hash()!==d||(a.detectScroll=!1,$("html,body").animate({scrollTop:c+"px"},"slow","linear",function(){a.detectScroll=!0}))},a.navigateTo=function(b){if(a.$$parllaxItems[b]){var c=a.$$parllaxItems[b].el;if(c){var d=a.$$parllaxItems[b].id,e=parseInt(c.offset().top)+1;0===d&&(e-=$("#header").height()),a.scrollTo(e,b)}}}}]).directive("hashNavigator",["$window","$location",function(a,b){return function(c,d,e){var f=angular.element(a),g=e.hashNavigator;if(c.$$hashNavigators[g]=$(d),!c.$$isDefaultHashSet){c.$$isDefaultHashSet=!0;{b.hash()}}c.inViewPort=function(b,c){var d=a.pageYOffset;return d>b&&b+c>d},c.activeNavigator=function(a){if(c.$$parllaxItems[a]){var b=c.$$parllaxItems[a].el;if(b){var d=c.$$hashNavigators[a],e=c.$$parllaxItems[a].id,f=parseInt(b.offset().top);0===e&&(f-=$("#header").height()+1),c.inViewPort(f,b.height())?d.addClass("active"):d.removeClass("active")}}},c.activeNavigator(g),f.bind("scroll",function(){c.detectScroll&&c.activeNavigator(g)})}}]).directive("hashItem",["$window","$location",function(a,b){return function(c){var d=angular.element(a);c.updateHashItem=function(a,d,e){var f=e.urlId;if(c.$$parllaxItems&&c.$$parllaxItems[f]){var g=c.$$parllaxItems[f].el;if(g){var h=parseInt(g.offset().top);if(c.inViewPort(h,g.height())){b.hash()}}}},d.bind("scroll",function(){c.detectScroll})}}]).directive("popupLayer",function(){return{restrict:"A",replace:!0,templateUrl:"views/popup-view.tpl.html",link:function(){}}}).directive("modalViewer",function(){return{restrict:"A",replace:!0,templateUrl:"views/photo-viewer.tpl.html",link:function(){}}}).directive("menuClassicItem",function(){return function(a,b){b.css({cursor:"pointer"}),b.bind("click",function(){a.openMenuViewerModal(a.menu),a.$apply()})}}).directive("photoViewer",["$window",function(){return function(a,b,c){b.bind("click",function(){a.photoViwerImageSrc=c.src,a.openPhotoViewerModal(),a.$apply()})}}]),angular.module("webApp").controller("ShowCartCtrl",["$scope","$location","$window","$http","$routeParams","menusService","storage",function(a,b,c,d,e,f,g){a.shoppingCartKey="shoppingCart-appId-"+e.appId,a.shoppingCart=g.get(a.shoppingCartKey),a.getTotalPrice=function(a){var b=0;return angular.forEach(a,function(a){a.price=parseInt(a.quantity)*parseFloat(a.item.price),b+=parseFloat(a.price)}),b},a.getTotalQuantity=function(a){var b=0;return angular.forEach(a,function(a){b+=parseInt(a.quantity)}),b},a.updateShoppingCart=function(b){b.totalPrice=a.getTotalPrice(b.items),b.quantity=a.getTotalQuantity(b.items),g.set(a.shoppingCartKey,b)},a.removeItem=function(b){delete a.shoppingCart.items[b.item.$$hashKey],a.updateShoppingCart(a.shoppingCart)},a.checkout=function(){b.path(e.appId+"/checkout")}}]).directive("editableContent",function(){return{restrict:"A",require:"?ngModel",link:function(a,b,c,d){d&&(d.$render=function(){b.html(d.$viewValue||"")},b.on("blur keyup change",function(){var b=parseInt(d.$viewValue);b>=0?(a.item.quantity=b,a.updateShoppingCart(a.shoppingCart)):(d.$viewValue=0,d.$setViewValue(0)),a.$apply()}))}}}),angular.module("webApp").controller("PhotoViewerCtrl",["$scope","$location",function(){}]).directive("photoViewerModal",["$window",function(){return{restrict:"A",replace:!0,templateUrl:"views/photo-viewer.tpl.html",link:function(){}}}]),angular.module("webApp").controller("MenuViewerCtrl",["$scope","$location","menusService","storage",function(a,b,c,d){a.quantity=1,a.getTotalPrice=function(a){var b=0;return angular.forEach(a,function(a){a.price=parseInt(a.quantity)*parseFloat(a.item.price),b+=parseFloat(a.price)}),b},a.setItem=function(a,b,c){if(c[a.$$hashKey]){var d=c[a.$$hashKey];d&&(d.quantity+=b)}else c[a.$$hashKey]={item:a,quantity:b,price:parseFloat(a.price)}},a.addToCart=function(b,e){console.log(b.name+" x "+e+" has added to cart!!!");var f=parseInt(e);a.shoppingCart.quantity+=f,a.setItem(b,f,a.shoppingCart.items),a.shoppingCart.totalPrice=a.getTotalPrice(a.shoppingCart.items),c.updateShoppingCart(a.shoppingCart),d.set(a.shoppingCartKey,a.shoppingCart)}}]).directive("menuViewerModal",["$window",function(){return{restrict:"CA",replace:!0,templateUrl:"views/menu-viewer.tpl.html",link:function(a){a.$watch("selectedMenu",function(){a.quantity=1},!0)}}}]),angular.module("webApp").controller("CheckoutCtrl",["$scope","$location","$window","$http","$routeParams","menusService","storage",function(a,b,c,d,e,f,g){a.appId=e.appId,a.shoppingCartKey="shoppingCart-appId-"+a.appId,a.shoppingCart=g.get(a.shoppingCartKey),a.requiredFieldEmptyErrorBillingInfo=!1,a.requiredFieldEmptyErrorShippingInfo=!1,a.requiredFieldEmptyErrorCreditCard=!1,a.completedBillingInfo=!1,a.completedShippingInfo=!1,a.shippingSameAsBilling=!0,a.billingInfoContinue=function(){a.billingFirstName&&a.billingLastName&&a.billingEmail&&a.billingAddress1&&a.billingCity&&a.billingZip?(a.requiredFieldEmptyErrorBillingInfo=!1,a.completedBillingInfo=!0,a.completedShippingInfo=!0):a.requiredFieldEmptyErrorBillingInfo=!0},a.shippingInfoContinue=function(){a.shippingFirstName&&a.shippingLastName&&a.shippingAddress1&&a.shippingCity&&a.shippingZip?(a.requiredFieldEmptyErrorShippingInfo=!1,a.completedShippingInfo=!0):a.requiredFieldEmptyErrorShippingInfo=!0},a.placeOrder=function(){a.cardNumber&&a.expMonth&&a.expYear&&a.cvc?(g.set(a.shoppingCartKey,""),b.path("/"),alert("order success")):a.requiredFieldEmptyErrorCreditCard=!0},a.editBillingInfo=function(){a.completedBillingInfo=!1},a.editShippingInfo=function(){a.completedShippingInfo=!1},a.toggleShipToBilling=function(){a.shippingSameAsBilling=!a.shippingSameAsBilling,a.completedShippingInfo=a.shippingSameAsBilling},a.getTotalPrice=function(a){var b=0;return angular.forEach(a,function(a){a.price=parseInt(a.quantity)*parseFloat(a.item.price),b+=parseFloat(a.price)}),b},a.getTotalQuantity=function(a){var b=0;return angular.forEach(a,function(a){b+=parseInt(a.quantity)}),b},a.updateShoppingCart=function(b){b.totalPrice=a.getTotalPrice(b.items),b.quantity=a.getTotalQuantity(b.items),g.set("shoppingCart",b)},a.removeItem=function(b){delete a.shoppingCart.items[b.item.$$hashKey],a.updateShoppingCart(a.shoppingCart)}}]).directive("editableContent",function(){return{restrict:"A",require:"?ngModel",link:function(a,b,c,d){d&&(d.$render=function(){b.html(d.$viewValue||"")},b.on("blur keyup change",function(){var b=parseInt(d.$viewValue);b>=0?(a.item.quantity=b,a.updateShoppingCart(a.shoppingCart)):(d.$viewValue=0,d.$setViewValue(0)),a.$apply()}))}}}),angular.module("webApp").controller("BookingCtrl",["$scope","bookingApi",function(a,b){a.showBookingPage=!1,a.bookingTimeSlots={},a.bookingNumPeople={},a.bookingSucceeded=!1,a.bookingFailed=!1,a.errors={},a.errors.name=!1,a.errors.email=!1,a.errors.phoneNumber=!1;for(var c=8;24>c;c++){var d="",e="",f="AM";c>11&&(f="PM");var g=c;10>c?g="0"+c:c>12&&(g=c-12),d=g+":00 "+f,e=g+":30 "+f,a.bookingTimeSlots[3600*c]=d,a.bookingTimeSlots[3600*c+1800]=e}for(var c=1;7>c;c++){var f="People";2>c&&(f="Person"),a.bookingNumPeople[c]=c+" "+f}a.booking={},a.bookingNumPerson=1,a.bookingTime=28800,a.disabled=function(a,b){return"day"===b&&0===a.getDay()},a.today=function(){a.bookingDate=new Date},a.today(),a.clear=function(){a.bookingDate=null},a.toggleMin=function(){a.minDate=a.minDate?null:new Date},a.toggleMin(),a.maxDate=new Date,a.maxDate.setDate(a.maxDate.getDate()+14),a.open=function(b){b.preventDefault(),b.stopPropagation(),a.opened=!0},a.dateOptions={formatYear:"yy",startingDay:1},a.format="EEE MMM dd yyyy",a.findTable=function(){a.showBookingPage=!0,a.booking.number_of_person=a.bookingNumPerson,a.booking.datetime=new Date(Date.parse(a.bookingDate.toDateString()+" 00:00:00")+1e3*a.bookingTime),a.booking.gmt_offset=-60*a.booking.datetime.getTimezoneOffset()},a.hasError=function(){return a.errors.name||a.errors.email||a.errors.phoneNumber},a.closeSubmissionText=function(){a.bookingSucceeded=!1,a.bookingFailed=!1},a.joinWithBR=function(a){return a.join("<br />")},a.requestBooking=function(){var c=a.booking;console.log(a.booking),a.errors.name=null==c.first_name||null==c.last_name||""==c.first_name||""==c.last_name,a.errors.email=null==c.email||""==c.email,a.errors.phoneNumber=null==c.phone_number||""==c.phone_number,a.hasError()||b.request(a.site.id,c).then(function(){a.showBookingPage=!1,a.booking={},a.today(),a.bookingSucceeded=!0},function(b){a.bookingFailed=!1,console.log(b.data.error.message)})}}]),angular.module("webApp").service("menusService",["$window",function(a){var b=0,c={};return{updateShoppingCart:function(b){c=b,angular.element(a).trigger("update_cart")},getShoppingCart:function(){return c},setTotalPrice:function(c){b=c,angular.element(a).trigger("update_price")},getTotalPrice:function(){return b}}}]),angular.module("webApp").directive("layoutCenter",["$window",function(a){return function(b,c){var d=angular.element(a);b.alignCenter=function(a,b){b.css({top:"50%",left:"50%",transform:"translateX(-50%) translateY(-50%)"})},b.alignCenter(d,c),d.bind("resize",function(){b.alignCenter(d,c)}),d.bind("redraw",function(){b.alignCenter(d,c)})}}]).directive("layoutFill",["$window",function(a){return function(b,c,d){var e=angular.element(a);b._getLightness=function(a){return a&&a.length>0&&a.length<=7?(a=a.replace("#",""),parseInt(a,16)>8388607.5?"light":"dark"):""},b.updateNavigatorColor=function(a){var c=b._getLightness(a);$("body").removeClass("color-weight-dark").removeClass("color-weight-light").addClass("color-weight-"+c)},b.scaleToFill=function(a,b,c){c.css({height:parseInt(a.height()*b,10)})},b.scaleToFill(e,d.layoutFill,c),e.bind("resize",function(){b.scaleToFill(e,d.layoutFill,c)}),e.bind("scroll",function(){if(b.detectScroll&&c.offset().top>0&&c.data("color-suggested")){var a=b.viewPort(),d=a.y+a.height/2;c.offset().top<=d&&c.offset().top+c.height()>=d&&b.updateNavigatorColor(c.data("color-suggested"))}})}}]).directive("layoutFullscreen",["$window",function(a){return function(b,c){var d=angular.element(a);b.scaleToFill=function(b,c,d){d.css({top:a.pageYOffset,height:parseInt(b.height()*c,10)})},b.scaleToFill(d,1,c),d.bind("resize",function(){b.scaleToFill(d,1,c)}),d.bind("redraw",function(){b.scaleToFill(d,1,c)})}}]).directive("layoutRatioAspectToFit",["$window",function(a){return function(b,c){var d=angular.element(a),e=2/3,f=320;b.ratioAspectToFit=function(a,b,c){var d=c.parent(),e=d.width(),g=parseInt(e*a),h=0;if(g>d.height()&&(g=d.height(),e=parseInt(g/a),h=parseInt((d.width()-e)/2)),!(d.width()<=f&&g*a<=d.width())){var i=(g-d.height())/2;c.css({"font-size":0,top:-1*i,height:g,width:e,left:h,position:"relative"})}},b.ratioAspectToFit(e,d,c),d.bind("resize",function(){b.ratioAspectToFit(e,d,c)}),d.bind("redraw",function(){b.ratioAspectToFit(e,d,c)})}}]),angular.module("webApp").factory("Layouts",["Restangular","$q",function(a,b){var c=a.setBaseUrl("http://service-content.herokuapp.com");return c.getLayout=function(a){var c=b.defer();return this.one("sites",a).get().then(function(a){c.resolve(a)}),c.promise},c}]),angular.module("webApp").service("bookingApi",["Restangular","$q",function(a,b){var c=a.setBaseUrl("http://service-site.herokuapp.com");return c.request=function(a,c){var d=b.defer();return this.one("sites",a).post("booking",{booking:c}).then(function(a){d.resolve(a)}),d.promise},c}]),angular.module("webApp").directive("parallaxBackground",["$window",function(a){return function(b,c,d){b.$$parllaxBackgrounds[d.urlId]=c,b.region=function(a){return{x:a.offset().left,y:a.offset().top,width:a.width(),height:a.height()}},b.viewPort=function(){var b=angular.element(a);return{x:a.pageXOffset,y:a.pageYOffset,width:b.width(),height:b.height()}},b.inRegion=function(a){var c=b.viewPort();return c.y+c.height<=a.y||c.y>=a.y+a.height?!1:(c.x<=a.x&&c.x+c.width<=a.x+a.width||c.x>a.x&&c.x+c.width>a.x+a.width)&&(c.y<a.y+a.height&&c.y+c.height>a.y+a.height||c.y<=a.y&&c.y+c.height<=a.y+a.height||c.y>a.y&&c.y+c.height<a.y+a.height)};var e=angular.element(a);b.syncParallaxBackground=function(c){var d=a.pageYOffset,e=b.$$parllaxBackgrounds[c];if(b.$$parllaxItems){var f=b.$$parllaxItems[c].el;f&&(d=b.inRegion(b.region(f))?parseInt(f.offset().top-d,10):-9e3)}e&&e.css({"-webkit-transform":"translate3d(0, "+d+"px, 0)",overflow:"hidden"})},e.bind("scroll",function(){b.syncParallaxBackground(d.urlId)})}}]).directive("parallax",["$window","$timeout",function(a,b){return function(c,d,e){var f=angular.element(a),g=2/3,h=320;c.renderParallaxImage=function(b,d,e){var f=e.parent().attr("data-url-id"),g=a.pageYOffset;if(c.$$parllaxItems[f]){var h=c.$$parllaxItems[f].el;g-=h.offset().top,e.css({"-webkit-transform":"translate3d(0, "+parseInt(g*b,10)+"px, 0)",position:"relative"})}else c.$$parllaxImages[f]=e},c.ratioAspectToFit=function(a,b,c){var d=b.width(),e=parseInt(d*a),f=0;if(e<b.height()&&(e=b.height(),d=parseInt(e/a),f=(d-b.width())/2),!(b.width()<h&&e*a<=b.width())){var g=(e-b.height())/2;c.css({top:-1*g,height:e,width:d,left:parseInt(-1*f)})}};var i=function(){c.renderParallaxImage(c.PARALLAX_FACTOR,f,d,e),c.ratioAspectToFit(g,f,d)};b(i,200),f.bind("scroll",function(){c.renderParallaxImage(c.PARALLAX_FACTOR,f,d,e)}),f.bind("resize",function(){c.ratioAspectToFit(g,f,d)})}}]).directive("parallaxNav",function(){return function(a,b){a.$$parallaxNav=b}}).directive("parallaxItem",["$window","$location",function(a,b){return function(c,d,e){var f=Object.keys(c.$$parllaxItems).length;if(c.$$parllaxItems[e.urlId]={el:d,id:f},c.syncParallaxBackground(e.urlId),c.renderParallaxImage(c.PARALLAX_FACTOR,angular.element(a),d),!c.$$isInHashRegion){var g=b.hash();if(g===e.urlId){var h=parseInt(d.offset().top)+1;0===f&&(h-=$("#header").height()),c.scrollTo(h,g),c.$$isInHashRegion=!0}}}}]);