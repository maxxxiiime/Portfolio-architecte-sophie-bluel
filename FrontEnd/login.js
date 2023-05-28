const form = document.querySelector('.form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('message-error');

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
// Enregistre le token dans le local storage (application)
      localStorage.setItem('token', token); 

      // Rediriger vers index.html si token OK
      window.location.href = './index.html';
    } else {
      errorMsg.innerText = 'email ou mot de passe incorrect.';
    }
  } catch (error) {
    console.log('Erreur lors de la requête de connexion :', error);
  }
});
