// On attend que toute la page soit chargée
document.addEventListener("DOMContentLoaded", () => {

    // 1. On sélectionne le bouton hamburger
    const menuIcon = document.getElementById("mobile-menu-icon");
    
    // 2. On sélectionne le menu de navigation
    const navMenu = document.getElementById("main-nav");

    // 3. On vérifie que les deux existent
    if (menuIcon && navMenu) {
        
        // 4. On ajoute un "écouteur d'événement" sur le clic
        menuIcon.addEventListener("click", () => {
        
            // 5. A chaque clic, on "bascule" (toggle) la classe ".open" sur le menu
            // Si le menu a la classe, il l'enlève.
            // Si le menu ne l'a pas, il l'ajoute.
            // C'est le CSS (ci-dessus) qui fait la magie de l'afficher.
            navMenu.classList.toggle("open");
        });
    }

});