window.addEventListener("load", function(){
	var load_screen = document.getElementById("load_screen");
	setTimeout(function(){
         $(load_screen, '#preloader').fadeOut(1500); 
         }, 3000);
});