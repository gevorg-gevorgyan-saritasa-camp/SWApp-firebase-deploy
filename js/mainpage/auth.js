const sign_in_button = document.getElementById('sign_in_google');

sign_in_button.addEventListener('click', () => {
  let provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      localStorage.setItem('username', res.user.displayName);
      localStorage.setItem('token', res.credential.idToken);
      window.location.href = 'index.html';
    })
    .catch(err => {
      alert(err);
    });
});
