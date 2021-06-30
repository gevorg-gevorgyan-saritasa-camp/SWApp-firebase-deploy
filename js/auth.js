const button = document.getElementById('sign_in_google');

button.addEventListener('click', () => {
  let provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
    .signInWithPopup(provider)
    .then(res => {
      console.log(res.user);
      window.location.href = 'index.html';
    })
    .catch(err => {
      alert(err);
    });
});


