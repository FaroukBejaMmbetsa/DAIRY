const users = [
  { username: 'admin', password: '1234' },
  { username: 'user', password: 'pass' }
];

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username')?.value.trim() || '';
    const password = document.getElementById('password')?.value.trim() || '';

    const user = users.find(
      (account) => account.username === username && account.password === password
    );

    if (user) {
      if (message) {
        message.textContent = 'Login successful!';
        message.style.color = 'green';
      }
      console.log('Logged in as:', username);
    } else {
      if (message) {
        message.textContent = 'Invalid username or password.';
        message.style.color = 'red';
      }
      console.log('Login failed for:', username);
    }
  });
});
