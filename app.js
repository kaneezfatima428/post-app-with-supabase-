// // // Global State Variables (No local storage)
// // var loginForm = document.getElementById('loginForm');
// // var signupForm = document.getElementById('signupForm');
// // var showSignup = document.getElementById('showSignup');
// // var showLogin = document.getElementById('showLogin');
// // var themeToggle = document.getElementById('themeToggle');
// // var themeIcon = document.getElementById('themeIcon');

// // // Theme Management
// // themeToggle.addEventListener('click', function() {
// //     if (document.body.classList.contains('light-mode')) {
// //         document.body.classList.replace('light-mode', 'dark-mode');
// //         themeIcon.className = 'bi bi-sun-fill';
// //     } else {
// //         document.body.classList.replace('dark-mode', 'light-mode');
// //         themeIcon.className = 'bi bi-moon-fill';
// //     }
// // });

// // // View Toggles
// // showSignup.addEventListener('click', function(e) {
// //     e.preventDefault();
// //     loginForm.classList.add('d-none');
// //     signupForm.classList.remove('d-none');
// //     document.getElementById('authSubtitle').textContent = 'Create an account to start sharing';
// // });

// // showLogin.addEventListener('click', function(e) {
// //     e.preventDefault();
// //     signupForm.classList.add('d-none');
// //     loginForm.classList.remove('d-none');
// //     document.getElementById('authSubtitle').textContent = 'Log in to see what others are sharing';
// // });

// // // Signup Form Submit (Direct Redirect on creation)
// // signupForm.addEventListener('submit', function(e) {
// //     e.preventDefault();
// //     var name = document.getElementById('signupName').value.trim();
    
// //     Swal.fire({
// //         icon: 'success',
// //         title: 'Account Created!',
// //         text: 'Welcome, ' + name + '! Redirecting to dashboard...',
// //         showConfirmButton: false,
// //         timer: 1500
// //     });

// //     setTimeout(function() {
// //         // [SUPABASE NOTE]: Jab aap supabase auth lagaengi, to session sync karke redirect karegi.
// //         window.location.href = 'dash.html';
// //     }, 1500);
// // });

// // // Login Form Submit
// // loginForm.addEventListener('submit', function(e) {
// //     e.preventDefault();
// //     var email = document.getElementById('loginEmail').value.trim();

// //     if (email) {
// //         window.location.href = 'dash.html';
// //     }
// // });


// // Scope Variable Configuration via var keyword
// var loginForm = document.getElementById('loginForm');
// var signupForm = document.getElementById('signupForm');
// var showSignup = document.getElementById('showSignup');
// var showLogin = document.getElementById('showLogin');
// var themeToggle = document.getElementById('themeToggle');
// var themeIcon = document.getElementById('themeIcon');

// // Toggle control runtime rules
// themeToggle.addEventListener('click', function() {
//     if (document.body.classList.contains('light-mode')) {
//         document.body.classList.replace('light-mode', 'dark-mode');
//         themeIcon.className = 'bi bi-sun-fill';
//     } else {
//         document.body.classList.replace('dark-mode', 'light-mode');
//         themeIcon.className = 'bi bi-moon-fill';
//     }
// });

// showSignup.addEventListener('click', function(e) {
//     e.preventDefault();
//     loginForm.classList.add('d-none');
//     signupForm.classList.remove('d-none');
// });

// showLogin.addEventListener('click', function(e) {
//     e.preventDefault();
//     signupForm.classList.add('d-none');
//     loginForm.classList.remove('d-none');
// });

// signupForm.addEventListener('submit', function(e) {
//     e.preventDefault();
//     var name = document.getElementById('signupName').value.trim();
    
//     Swal.fire({
//         icon: 'success',
//         title: 'Account Configured!',
//         text: 'Welcome ' + name + ', transferring to post workbench...',
//         showConfirmButton: false,
//         timer: 1200
//     });

//     setTimeout(function() {
//         window.location.href = 'dash.html';
//     }, 1200);
// });

// loginForm.addEventListener('submit', function(e) {
//     e.preventDefault();
//     window.location.href = 'dash.html';
// });


// Scope Variable Configuration via var keyword
var loginForm = document.getElementById('loginForm');
var signupForm = document.getElementById('signupForm');
var showSignup = document.getElementById('showSignup');
var showLogin = document.getElementById('showLogin');
var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');

// Initialize Supabase Connection
var supabase = window.supabase.createClient('https://dnlqybhhohivumfgnxdz.supabase.co', 'sb_publishable_osMm75NYS71XczWSpZIYOQ_MCrF_1h2');

// Toggle control runtime rules
themeToggle.addEventListener('click', function() {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.replace('light-mode', 'dark-mode');
        themeIcon.className = 'bi bi-sun-fill';
    } else {
        document.body.classList.replace('dark-mode', 'light-mode');
        themeIcon.className = 'bi bi-moon-fill';
    }
});

showSignup.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.classList.add('d-none');
    signupForm.classList.remove('d-none');
});

showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.classList.add('d-none');
    loginForm.classList.remove('d-none');
});

// SUPABASE AUTH SIGNUP
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var email = document.getElementById('signupEmail').value.trim();
    var password = document.getElementById('signupPassword').value.trim();
    var name = document.getElementById('signupName').value.trim();
    
    if (!email || !password) {
        Swal.fire('Error', 'Please fill all required fields.', 'error');
        return;
    }

    try {
        var { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { display_name: name } // Storing username in metadata
            }
        });

        if (error) throw error;

        Swal.fire({
            icon: 'success',
            title: 'Account Configured!',
            text: 'Welcome ' + name + ', transferring to post workbench...',
            showConfirmButton: false,
            timer: 1200
        });

        setTimeout(function() {
            window.location.href = 'dash.html';
        }, 1200);

    } catch (error) {
        Swal.fire('Signup Failed', error.message, 'error');
    }
});

// SUPABASE AUTH LOGIN
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();

    try {
        var { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        window.location.href = 'dash.html';

    } catch (error) {
        Swal.fire('Login Failed', error.message, 'error');
    }
});