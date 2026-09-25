window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');
  const signupForm = document.getElementById('signupForm');
  const signupMessage = document.getElementById('signupMessage');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');

  if (!form) return;

  showSignup?.addEventListener('click', () => {
    form.hidden = true;
    showSignup.hidden = true;
    signupForm.hidden = false;
  });

  showLogin?.addEventListener('click', () => {
    signupForm.hidden = true;
    form.hidden = false;
    showSignup.hidden = false;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();

      if (message) {
        message.textContent = result.message;
        message.style.color = response.ok ? 'green' : 'red';
      }
      if (response.ok) {
        window.location.href = 'customer_dashboard.html';
      }
    } catch (error) {
      if (message) {
        message.textContent = 'Unable to connect to the server.';
        message.style.color = 'red';
      }
    }
  });

  signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('signupName')?.value.trim() || '';
    const email = document.getElementById('signupEmail')?.value.trim() || '';
    const username = document.getElementById('signupUsername')?.value.trim() || '';
    const password = document.getElementById('signupPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';

    if (password !== confirmPassword) {
      signupMessage.textContent = 'Passwords do not match.';
      signupMessage.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, username, password })
      });
      const result = await response.json();

      signupMessage.textContent = result.message;
      signupMessage.style.color = response.ok ? 'green' : 'red';
      if (response.ok) {
        signupForm.reset();
        signupForm.hidden = true;
        form.hidden = false;
        showSignup.hidden = false;
      }
    } catch (error) {
      signupMessage.textContent = 'Unable to connect to the server.';
      signupMessage.style.color = 'red';
    }
  });
});
