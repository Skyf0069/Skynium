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

document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. Sélectionner le bouton
    const authBtn = document.getElementById("header-auth-btn");
    if (!authBtn) return; // Si le bouton n'est pas sur la page, on arrête

    // 2. Configuration (Même que le portail client)
    const auth0 = await createAuth0Client({
        domain: "skynium69.eu.auth0.com",
        clientId: "rPiPZ5QPi1z13hWXHIZzMAK7ED52HMQn", // <--- REMPLACE ICI
        authorizationParams: {
            redirect_uri: "https://my.skynium.fr" // On redirige toujours vers le portail
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });

    try {
        // 3. Vérifier si l'utilisateur est déjà connecté (Silencieusement)
        // Grâce à ton domaine personnalisé auth.skynium.fr, les cookies sont partagés !
        await auth0.getTokenSilently();
        
        // 4. SI SUCCÈS (Connecté) :
        // On change le texte en "Bonjour"
        authBtn.innerHTML = '<i class="fas fa-user-circle"></i> Bonjour';
        authBtn.classList.add("connected");
        
        // Le lien pointe déjà vers my.skynium.fr, donc l'utilisateur cliquera pour accéder à son espace

    } catch (e) {
        // 5. SI ÉCHEC (Pas connecté) :
        // On laisse le bouton "Connexion" par défaut
        // Pas besoin de changer le texte, il est déjà "Connexion" dans le HTML
    }

});