/* ============================================ */
/* SYSTÈME D'ACCESSIBILITÉ SKYNIUM             */
/* Gestion des préférences + Cookies           */
/* Conforme RGAA 4.1 - Niveau AA               */
/* ============================================ */

(function() {
    'use strict';

    // ========================================
    // 1. CONFIGURATION ET VARIABLES GLOBALES
    // ========================================

    const COOKIE_NAME = 'skynium_accessibility_prefs';
    const COOKIE_DURATION = 365; // 1 an

    let accessibilitySettings = {
        // Modes
        'epilepsy-safe': false,
        'visually-impaired': false,
        'cognitive-disability': false,
        'adhd-friendly': false,
        'screen-reader': false,
        'dyslexia-font': false,
        'highlight-headings': false,
        'highlight-links': false,
        'high-saturation': false,
        'low-saturation': false,
        'monochrome': false,
        'highlight-cursor': false,
        'big-cursor-dark': false,
        'big-cursor-light': false,
        
        // Valeurs ajustables
        'font-size': 100,
        'line-height': 1.6,
        'letter-spacing': 0,
        'text-align': 'left',
        'contrast': 'normal'
    };

    // ========================================
    // 2. GESTION DES COOKIES
    // ========================================

    /**
     * Sauvegarder les préférences dans un cookie
     */
    function savePreferences() {
        const jsonData = JSON.stringify(accessibilitySettings);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOKIE_DURATION);
        
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(jsonData)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
        
        console.log('✅ Préférences d\'accessibilité sauvegardées');
    }

    /**
     * Charger les préférences depuis le cookie
     */
    function loadPreferences() {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${COOKIE_NAME}=`));
        
        if (cookieValue) {
            try {
                const jsonData = decodeURIComponent(cookieValue.split('=')[1]);
                const savedSettings = JSON.parse(jsonData);
                
                // Fusionner les paramètres sauvegardés avec les valeurs par défaut
                accessibilitySettings = { ...accessibilitySettings, ...savedSettings };
                
                console.log('✅ Préférences d\'accessibilité chargées');
                return true;
            } catch (e) {
                console.error('❌ Erreur lors du chargement des préférences', e);
                return false;
            }
        }
        return false;
    }

    /**
     * Supprimer les préférences (réinitialisation)
     */
    function deletePreferences() {
        document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log('🗑️ Préférences d\'accessibilité supprimées');
    }

    // ========================================
    // 3. APPLICATION DES STYLES AU <body>
    // ========================================

    /**
     * Appliquer tous les paramètres au body
     */
    /**
     * Appliquer tous les paramètres au body
     */
    function applySettings() {
        const body = document.body;
        const html = document.documentElement; // ✅ AJOUT : On cible la racine HTML
        
        // === MODES BOOLÉENS (classes CSS) ===
        Object.keys(accessibilitySettings).forEach(key => {
            if (typeof accessibilitySettings[key] === 'boolean') {
                if (accessibilitySettings[key]) {
                    body.classList.add(key);
                } else {
                    body.classList.remove(key);
                }
            }
        });

        // === TAILLE DE LA POLICE (CORRECTION ICI) ===
        // On applique sur le HTML pour que les unités 'rem' de tout le site changent
        html.style.fontSize = `${accessibilitySettings['font-size']}%`;

        // === HAUTEUR DE LIGNE ===
        body.style.lineHeight = accessibilitySettings['line-height'];

        // === ESPACEMENT DES LETTRES ===
        body.style.letterSpacing = `${accessibilitySettings['letter-spacing']}px`;

        // === ALIGNEMENT DU TEXTE ===
        body.style.textAlign = accessibilitySettings['text-align'];

        // === CONTRASTE (modes visuels) ===
        body.classList.remove('dark-mode', 'high-contrast', 'light-mode');
        
        if (accessibilitySettings['contrast'] === 'dark') {
            body.classList.add('dark-mode');
        } else if (accessibilitySettings['contrast'] === 'high') {
            body.classList.add('high-contrast');
        } else if (accessibilitySettings['contrast'] === 'light') {
            body.classList.add('light-mode');
        }

        // === MISE À JOUR DE LA MINI INTERFACE ===
        updateMiniInterface();
    }

    // ========================================
    // 4. MISE À JOUR DE LA MINI INTERFACE
    // ========================================

    /**
     * Afficher le nombre de modes actifs dans la mini interface
     */
    function updateMiniInterface() {
        const activeModesCount = Object.values(accessibilitySettings).filter(
            v => v === true
        ).length;

        const infoElement = document.getElementById('active-modes-count');
        
        if (infoElement) {
            if (activeModesCount === 0) {
                infoElement.textContent = 'Aucun';
                infoElement.style.color = '#666';
            } else {
                infoElement.textContent = `${activeModesCount} mode${activeModesCount > 1 ? 's' : ''}`;
                infoElement.style.color = 'var(--secondary-dark)';
                infoElement.style.fontWeight = 'bold';
            }
        }
    }

    // ========================================
    // 5. GESTION DES TOGGLES (SWITCHES)
    // ========================================

    /**
     * Gérer le clic sur une option toggle
     */
    function handleToggleOption(optionElement) {
        const mode = optionElement.getAttribute('data-mode');
        
        // Inverser la valeur
        accessibilitySettings[mode] = !accessibilitySettings[mode];
        
        // Mettre à jour l'affichage
        updateToggleUI(optionElement, accessibilitySettings[mode]);
        
        // Appliquer les changements
        applySettings();
        savePreferences();
        
        // Annoncer le changement aux lecteurs d'écran
        announceChange(mode, accessibilitySettings[mode]);
    }

    /**
     * Mettre à jour l'interface du toggle
     */
    function updateToggleUI(optionElement, isActive) {
        const toggleSwitch = optionElement.querySelector('.toggle-switch');
        
        if (isActive) {
            optionElement.classList.add('active');
            optionElement.setAttribute('aria-checked', 'true');
            if (toggleSwitch) toggleSwitch.classList.add('active');
        } else {
            optionElement.classList.remove('active');
            optionElement.setAttribute('aria-checked', 'false');
            if (toggleSwitch) toggleSwitch.classList.remove('active');
        }
    }

    /**
     * Initialiser tous les toggles avec les valeurs sauvegardées
     */
    function initializeToggles() {
        const toggleOptions = document.querySelectorAll('.accessibility-option[data-mode]');
        
        toggleOptions.forEach(option => {
            const mode = option.getAttribute('data-mode');
            updateToggleUI(option, accessibilitySettings[mode]);
            
            // Événements clavier et clic
            option.addEventListener('click', () => handleToggleOption(option));
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleOption(option);
                }
            });
        });
    }

    // ========================================
    // 6. GESTION DES SLIDERS
    // ========================================

    /**
     * Initialiser les sliders (taille, espacement, etc.)
     */
    function initializeSliders() {
        // === TAILLE DE LA POLICE ===
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        
        if (fontSizeSlider) {
            fontSizeSlider.value = accessibilitySettings['font-size'];
            fontSizeValue.textContent = `${accessibilitySettings['font-size']}%`;
            
            fontSizeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                accessibilitySettings['font-size'] = value;
                fontSizeValue.textContent = `${value}%`;
                e.target.setAttribute('aria-valuenow', value);
                applySettings();
            });
            
            fontSizeSlider.addEventListener('change', savePreferences);
        }

        // === HAUTEUR DE LIGNE ===
        const lineHeightSlider = document.getElementById('line-height-slider');
        const lineHeightValue = document.getElementById('line-height-value');
        
        if (lineHeightSlider) {
            lineHeightSlider.value = accessibilitySettings['line-height'];
            lineHeightValue.textContent = accessibilitySettings['line-height'];
            
            lineHeightSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                accessibilitySettings['line-height'] = value;
                lineHeightValue.textContent = value;
                applySettings();
            });
            
            lineHeightSlider.addEventListener('change', savePreferences);
        }

        // === ESPACEMENT DES LETTRES ===
        const letterSpacingSlider = document.getElementById('letter-spacing-slider');
        const letterSpacingValue = document.getElementById('letter-spacing-value');
        
        if (letterSpacingSlider) {
            letterSpacingSlider.value = accessibilitySettings['letter-spacing'];
            letterSpacingValue.textContent = `${accessibilitySettings['letter-spacing']}px`;
            
            letterSpacingSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                accessibilitySettings['letter-spacing'] = value;
                letterSpacingValue.textContent = `${value}px`;
                applySettings();
            });
            
            letterSpacingSlider.addEventListener('change', savePreferences);
        }
    }

    // ========================================
    // 7. GESTION DES BOUTONS (ALIGNEMENT, CONTRASTE)
    // ========================================

    /**
     * Initialiser les boutons d'alignement
     */
    function initializeAlignmentButtons() {
        const alignButtons = document.querySelectorAll('.align-btn');
        
        alignButtons.forEach(btn => {
            const align = btn.getAttribute('data-align');
            
            // État initial
            if (accessibilitySettings['text-align'] === align) {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            }
            
            btn.addEventListener('click', () => {
                // Retirer l'état actif de tous les boutons
                alignButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                
                // Activer le bouton cliqué
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
                
                accessibilitySettings['text-align'] = align;
                applySettings();
                savePreferences();
            });
        });
    }

    /**
     * Initialiser les boutons de contraste
     */
    function initializeContrastButtons() {
        const contrastButtons = document.querySelectorAll('.contrast-btn');
        
        contrastButtons.forEach(btn => {
            const contrast = btn.getAttribute('data-contrast');
            
            // État initial
            if (accessibilitySettings['contrast'] === contrast) {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            }
            
            btn.addEventListener('click', () => {
                // Retirer l'état actif de tous les boutons
                contrastButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-checked', 'false');
                });
                
                // Activer le bouton cliqué
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
                
                accessibilitySettings['contrast'] = contrast;
                applySettings();
                savePreferences();
            });
        });
    }

    // ========================================
    // 8. OUVERTURE/FERMETURE DU PANNEAU
    // ========================================

    /**
     * Ouvrir le panneau d'accessibilité
     */
    function openPanel() {
        const panel = document.getElementById('accessibility-panel');
        const button = document.getElementById('accessibility-button');
        
        panel.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        
        // Mettre le focus sur le bouton de fermeture
        const closeBtn = document.getElementById('close-panel-btn');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
        
        // Piéger le focus dans le panneau
        trapFocus(panel);
    }

    /**
     * Fermer le panneau d'accessibilité
     */
    function closePanel() {
        const panel = document.getElementById('accessibility-panel');
        const button = document.getElementById('accessibility-button');
        
        panel.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        
        // Remettre le focus sur le bouton d'ouverture
        button.focus();
        
        // Libérer le piège de focus
        releaseFocusTrap();
    }

    // ========================================
    // 9. PIÈGE DE FOCUS (FOCUS TRAP)
    // ========================================

    let focusTrapListener = null;

    /**
     * Piéger le focus dans un élément
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        focusTrapListener = function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else { // Tab seul
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            
            // Fermer avec Échap
            if (e.key === 'Escape') {
                closePanel();
            }
        };
        
        document.addEventListener('keydown', focusTrapListener);
    }

    /**
     * Libérer le piège de focus
     */
    function releaseFocusTrap() {
        if (focusTrapListener) {
            document.removeEventListener('keydown', focusTrapListener);
            focusTrapListener = null;
        }
    }

    // ========================================
    // 10. RÉINITIALISATION
    // ========================================

    /**
     * Réinitialiser tous les paramètres
     */
    function resetAllSettings() {
        // Réinitialiser l'objet
        Object.keys(accessibilitySettings).forEach(key => {
            if (typeof accessibilitySettings[key] === 'boolean') {
                accessibilitySettings[key] = false;
            }
        });
        
        accessibilitySettings['font-size'] = 100;
        accessibilitySettings['line-height'] = 1.6;
        accessibilitySettings['letter-spacing'] = 0;
        accessibilitySettings['text-align'] = 'left';
        accessibilitySettings['contrast'] = 'normal';
        
        // Supprimer le cookie
        deletePreferences();
        
        // Réappliquer (tout désactiver)
        applySettings();
        
        // Réinitialiser l'interface
        initializeToggles();
        initializeSliders();
        initializeAlignmentButtons();
        initializeContrastButtons();
        
        // Annoncer
        announceChange('réinitialisation', true);
        
        alert('✅ Tous les paramètres d\'accessibilité ont été réinitialisés.');
    }

    // ========================================
    // 11. ANNONCES POUR LECTEURS D'ÉCRAN
    // ========================================

    /**
     * Annoncer un changement aux lecteurs d'écran
     */
    function announceChange(mode, isActive) {
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        
        let message = '';
        
        if (mode === 'réinitialisation') {
            message = 'Tous les paramètres ont été réinitialisés';
        } else {
            const modeName = mode.replace(/-/g, ' ');
            message = `${modeName} ${isActive ? 'activé' : 'désactivé'}`;
        }
        
        announcer.textContent = message;
        document.body.appendChild(announcer);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 3000);
    }

    // ========================================
    // 12. INITIALISATION AU CHARGEMENT
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Initialisation du système d\'accessibilité Skynium');
        
        // 1. Charger les préférences depuis le cookie
        loadPreferences();
        
        // 2. Appliquer immédiatement les paramètres
        applySettings();
        
        // 3. Initialiser les contrôles
        initializeToggles();
        initializeSliders();
        initializeAlignmentButtons();
        initializeContrastButtons();
        
        // 4. Gérer l'ouverture/fermeture du panneau
        const openBtn = document.getElementById('accessibility-button');
        const closeBtn = document.getElementById('close-panel-btn');
        const resetBtn = document.getElementById('reset-accessibility-btn');
        
        if (openBtn) {
            openBtn.addEventListener('click', openPanel);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closePanel);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres d\'accessibilité ?')) {
                    resetAllSettings();
                }
            });
        }
        
        console.log('✅ Système d\'accessibilité Skynium initialisé avec succès');
    });

})();