const loginBtn = document.querySelector('.titleBtn');
const welcomeSection = document.querySelector('.bienvenu');
const loginForm = document.querySelector('#login-form');
const logo = document.querySelector('#logo');

// Exemple de fonction de hachage utilisant crypto.subtle
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Ajoute un écouteur d'événements pour le clic sur le bouton de connexion
loginBtn.addEventListener('click', function() {
    // Cache la section de bienvenue
    welcomeSection.style.display = 'none';
    // Affiche la zone de connexion en lui ajoutant la classe 'show'
    loginForm.classList.add('show');
});

// Ajoute un écouteur d'événements pour le clic sur le logo pour revenir à la page d'accueil
logo.addEventListener('click', function() {
    // Affiche la section de bienvenue
    welcomeSection.style.display = 'block';
    // Cache la zone de connexion
    loginForm.classList.remove('show');
});

// Ajoute un écouteur d'événements pour le formulaire de connexion
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    console.log('Form submitted');

    try {
        // Récupère les valeurs des champs
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        console.log('Username and password retrieved:', username, password);

        // Hache le mot de passe
        const hashedPassword = await hashPassword(password);
        console.log('Password hashed:', hashedPassword);

        // Envoie les données au serveur via une requête AJAX
        const response = await fetch('assets/php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: hashedPassword
            })
        });
        console.log('Response received:', response);

        const text = await response.text(); // Lire le texte brut de la réponse
        console.log('Response text:', text);

        try {
            const result = JSON.parse(text); // Essayer de parser le texte brut en JSON
            console.log('Result parsed:', result);

            if (result.success) {
                // Connexion réussie, redirige vers la page d'accueil ou tableau de bord
                window.location.href = result.redirect;
            } else {
                // Affiche un message d'erreur
                document.querySelector('#error-message').textContent = result.message;
            }
        } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            document.querySelector('#error-message').textContent = 'An error occurred while parsing the server response.';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.querySelector('#error-message').textContent = error;
    }
});
