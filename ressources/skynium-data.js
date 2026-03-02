/**
 * SKYNIUM DATA - Consent Management Platform
 * Conforme aux mentions légales Skynium et lié à privacy.skynium.fr
 */

(function() {
    'use strict';

    // 1. Configuration des couleurs et du domaine
    const skyniumDataConfig = {
        primary: '#1D0469',   // Bleu Nuit Skynium
        secondary: '#FA5DFF', // Rose
        bg: '#ffffff',
        text: '#333333',
        // Le point avant skynium.fr est CRUCIAL pour partager le cookie avec privacy.skynium.fr
        domain: window.location.hostname.includes('skynium.fr') ? '.skynium.fr' : '' 
    };

    // 2. Fonctions de gestion des Cookies Partagés
    function setCookie(name, value, days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        let domainStr = skyniumDataConfig.domain ? "domain=" + skyniumDataConfig.domain + ";" : "";
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; " + domainStr + " path=/; SameSite=Lax";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    // 3. Vérifier le consentement actuel
    const consentValue = getCookie('skynium_data_consent');

    // On ne montre PAS le bandeau si on est déjà sur le site Privacy !
    const isPrivacySite = window.location.hostname.includes('privacy.skynium.fr');

    if (consentValue === 'accepted') {
        triggerTrackingScripts();
    } else if (!consentValue && !isPrivacySite) {
        // Afficher le bandeau si aucun choix n'a été fait et qu'on n'est pas sur le site Privacy
        showBanner();
    }

    // 4. Affichage dynamique du bandeau
    function showBanner() {
        // Injection du CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #sk-data-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: ${skyniumDataConfig.bg};
                box-shadow: 0 -5px 25px rgba(0,0,0,0.1);
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                padding: 20px;
                box-sizing: border-box;
                border-top: 4px solid ${skyniumDataConfig.primary};
            }
            .sk-data-container {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
                width: 100%;
            }
            .sk-data-header {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
                color: ${skyniumDataConfig.primary};
                font-size: 1.2rem;
                margin-bottom: 5px;
            }
            .sk-data-text {
                font-size: 0.95rem;
                color: ${skyniumDataConfig.text};
                line-height: 1.5;
                margin: 0;
            }
            .sk-data-text strong {
                color: ${skyniumDataConfig.primary};
            }
            .sk-data-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }
            .sk-btn {
                padding: 10px 20px;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                font-size: 0.9rem;
                text-decoration: none;
                transition: all 0.3s ease;
                display: inline-block;
                text-align: center;
            }
            .sk-btn-accept { background-color: ${skyniumDataConfig.primary}; color: white; }
            .sk-btn-accept:hover { background-color: ${skyniumDataConfig.secondary}; transform: translateY(-2px); }
            
            .sk-btn-refuse { background-color: transparent; color: ${skyniumDataConfig.text}; border: 1px solid #ccc; }
            .sk-btn-refuse:hover { background-color: #f5f5f5; }
            
            .sk-btn-manage { background-color: rgba(29, 4, 105, 0.1); color: ${skyniumDataConfig.primary}; }
            .sk-btn-manage:hover { background-color: rgba(29, 4, 105, 0.2); }
            
            @media (min-width: 768px) {
                #sk-data-banner { padding: 30px 20px; }
                .sk-data-container { flex-direction: row; align-items: center; justify-content: space-between; }
                .sk-data-content { flex: 1; margin-right: 40px; }
            }
        `;
        document.head.appendChild(style);

        // Injection du HTML (Texte mis à jour selon tes mentions légales)
        const bannerHTML = `
            <div id="sk-data-banner" role="dialog" aria-labelledby="sk-cookie-title" aria-describedby="sk-cookie-desc">
                <div class="sk-data-container">
                    <div class="sk-data-content">
                        <div class="sk-data-header" id="sk-cookie-title">
                            <i class="fas fa-shield-alt" style="color: ${skyniumDataConfig.secondary};" aria-hidden="true"></i> 
                            Skynium DATA
                        </div>
                        <p class="sk-data-text" id="sk-cookie-desc">
                            Conformément à notre politique de confidentialité, l'écosystème Skynium utilise des cookies <strong>strictement nécessaires</strong> 
                            pour mémoriser vos informations de contact et suivre la navigation technique (navigateur, pays, adresse IP). Ces cookies obligatoires 
                            ne requièrent pas de consentement. Nous proposons également des cookies optionnels pour améliorer nos services.
                        </p>
                    </div>
                    <div class="sk-data-buttons">
                        <!-- CNIL : Le bouton refus doit être aussi lisible que l'acceptation -->
                        <button id="sk-data-refuse" class="sk-btn sk-btn-refuse">Continuer sans accepter</button>
                        <!-- Lien vers le centre de confidentialité -->
                        <a href="https://privacy.skynium.fr" class="sk-btn sk-btn-manage">Gérer mes choix</a>
                        <button id="sk-data-accept" class="sk-btn sk-btn-accept">Tout accepter</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Actions des boutons
        document.getElementById('sk-data-accept').addEventListener('click', () => {
            setCookie('skynium_data_consent', 'accepted', 365); // Expire dans 1 an
            document.getElementById('sk-data-banner').style.display = 'none';
            triggerTrackingScripts();
        });

        document.getElementById('sk-data-refuse').addEventListener('click', () => {
            setCookie('skynium_data_consent', 'refused', 365);
            document.getElementById('sk-data-banner').style.display = 'none';
        });
    }

    // 5. Fonction qui charge les scripts non-obligatoires (Seulement si accepté)
    function triggerTrackingScripts() {
        console.log("✅ [Skynium DATA] Consentement actif. Les scripts optionnels sont chargés.");
        // Les outils obligatoires (Tally, FreeScout) fonctionnent déjà sans ce script.
        // C'est ici que tu mettras les futurs scripts analytiques (ex: Google Analytics) si tu en ajoutes.
    }

})();