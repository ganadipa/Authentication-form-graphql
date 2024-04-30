

function signUp() {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const query = `
        mutation SignUp($username: String!, $email: String!, $password: String!) {
            signUp(username: $username, email: $email, password: $password) {
                message
                token
            }
        }
    `;

    const variables = {
        username: username,
        email: email,
        password: password
    };

    fetch('http://localhost:3055/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('SignUp data:', data)
        if (!data.errors) {
            window.location.href = '/welcome';
        }
    })
    .catch(error => console.error('SignUp error:', error));
}


function signIn() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    const query = `
        mutation SignIn($email: String!, $password: String!) {
            signIn(email: $email, password: $password) {
                message
                token
            }
        }
    `;

    const variables = {
        email: email,
        password: password
    };

    fetch('http://localhost:3055/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('SignIn data:', data)
        if (!data.errors) {
            console.log("redirecting to welcome")
            window.location.href = "/welcome"
        }
    })
}

function getCurrentUser() {

    

    const query = `
    query CurrentUser {
        currentUser {
          id
          username
          email
        }
      }
    `;

    fetch('http://localhost:3055/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(document.getElementById("userdetail").textContent)
        console.log(data)
        document.getElementById("userdetail").textContent = (data.data.currentUser.email || "Not yet logged in")
    })
    .catch(error => console.error('GetCurrentUser error:', error));
}
