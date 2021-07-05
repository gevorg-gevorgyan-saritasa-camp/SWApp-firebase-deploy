const sign_in_button = document.getElementById('sign_in_google');
const sign_out_button = document.getElementById('sign_out');

if (sign_in_button) {
  sign_in_button.addEventListener('click', () => {
    let provider = new window.firebase.auth.GoogleAuthProvider();

    window.firebase.auth()
      .signInWithPopup(provider)
      .then(res => {
        localStorage.setItem('username', res.user.displayName);
        localStorage.setItem('token', res.credential.idToken);
        window.location.href = 'main.html';
      })
      .catch(err => {
        alert(err);
      });
  });
}

sign_out_button.addEventListener('click', () => {
  window.firebase.auth()
    .signOut()
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = 'main.html';
    })
    .catch(err => {
      console.log(err);
    });
});