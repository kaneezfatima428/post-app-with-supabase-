// // Scope Variable Configuration via var keyword
// var loginForm = document.getElementById('loginForm');
// var signupForm = document.getElementById('signupForm');
// var showSignup = document.getElementById('showSignup');
// var showLogin = document.getElementById('showLogin');
// var themeToggle = document.getElementById('themeToggle');
// var themeIcon = document.getElementById('themeIcon');

// // Initialize Supabase Connection
// var supabase = window.supabase.createClient('https://dnlqybhhohivumfgnxdz.supabase.co', 'sb_publishable_osMm75NYS71XczWSpZIYOQ_MCrF_1h2');

// // Toggle control runtime rules
// if (themeToggle) {
//     themeToggle.addEventListener('click', function() {
//         if (document.body.classList.contains('light-mode')) {
//             document.body.classList.replace('light-mode', 'dark-mode');
//             themeIcon.className = 'bi bi-sun-fill';
//         } else {
//             document.body.classList.replace('dark-mode', 'light-mode');
//             themeIcon.className = 'bi bi-moon-fill';
//         }
//     });
// }

// if (showSignup) {
//     showSignup.addEventListener('click', function(e) {
//         e.preventDefault();
//         loginForm.classList.add('d-none');
//         signupForm.classList.remove('d-none');
//     });
// }

// if (showLogin) {
//     showLogin.addEventListener('click', function(e) {
//         e.preventDefault();
//         signupForm.classList.add('d-none');
//         loginForm.classList.remove('d-none');
//     });
// }

// // SUPABASE AUTH SIGNUP
// if (signupForm) {
//     signupForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
//         var email = document.getElementById('signupEmail').value.trim();
//         var password = document.getElementById('signupPassword').value.trim();
//         var name = document.getElementById('signupName').value.trim();
        
//         if (!email || !password || !name) {
//             Swal.fire('Error', 'Please fill all required fields.', 'error');
//             return;
//         }

//         try {
//             var { data, error } = await supabase.auth.signUp({
//                 email: email,
//                 password: password,
//                 options: {
//                     data: { display_name: name } // Storing username in metadata
//                 }
//             });

//             if (error) throw error;

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Account Configured!',
//                 text: 'Welcome ' + name + ', transferring to post workbench...',
//                 showConfirmButton: false,
//                 timer: 1200
//             });

//             setTimeout(function() {
//                 window.location.href = 'dash.html';
//             }, 1200);

//         } catch (error) {
//             Swal.fire('Signup Failed', error.message, 'error');
//         }
//     });
// }

// // SUPABASE AUTH LOGIN
// if (loginForm) {
//     loginForm.addEventListener('submit', async function(e) {
//         e.preventDefault();
//         var email = document.getElementById('loginEmail').value.trim();
//         var password = document.getElementById('loginPassword').value.trim();

//         if (!email || !password) {
//             Swal.fire('Error', 'Please enter both email and password.', 'error');
//             return;
//         }

//         try {
//             var { data, error } = await supabase.auth.signInWithPassword({
//                 email: email,
//                 password: password
//             });

//             if (error) throw error;

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Login Successful!',
//                 text: 'Redirecting to your dashboard...',
//                 showConfirmButton: false,
//                 timer: 1000
//             });

//             setTimeout(function() {
//                 window.location.href = 'dash.html';
//             }, 1000);

//         } catch (error) {
//             Swal.fire('Login Failed', error.message, 'error');
//         }
//     });
// }

// async function continuewithgoogle() {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//   provider: 'google',
//   options: {
//     redirectTo: 'http://127.0.0.1:5500/dash.html'
//     // redirectTo: 'https://kaneezfatima428.github.io/post-app-with-supabase-/dash.html'
//   }
// })
// }



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
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.replace('light-mode', 'dark-mode');
            themeIcon.className = 'bi bi-sun-fill';
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            themeIcon.className = 'bi bi-moon-fill';
        }
    });
}

if (showSignup) {
    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('d-none');
        signupForm.classList.remove('d-none');
    });
}

if (showLogin) {
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
    });
}

// SUPABASE AUTH SIGNUP
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('signupEmail').value.trim();
        var password = document.getElementById('signupPassword').value.trim();
        var name = document.getElementById('signupName').value.trim();
        
        if (!email || !password || !name) {
            Swal.fire('Error', 'Please fill all required fields.', 'error');
            return;
        }

        // Secret Admin Check: Agar email ke aakhir mein '@admin.com' ho to admin role milega
        var assignedRole = email.endsWith('@admin.com') ? "admin" : "user";

        try {
            var { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { 
                        display_name: name,
                        role: assignedRole // Smart metadata injection
                    } 
                }
            });

            if (error) throw error;

            var isNewAdmin = data.user?.user_metadata?.role === "admin";

            Swal.fire({
                icon: 'success',
                title: isNewAdmin ? 'Admin Account Configured!' : 'Account Configured!',
                text: 'Welcome ' + name + ', syncing authorization status...',
                showConfirmButton: false,
                timer: 1500
            });

            setTimeout(function() {
                // Admin ko direct console par aur user ko workbench par redirect karega
                if (isNewAdmin) {
                    window.location.href = 'adminPannel.html';
                } else {
                    window.location.href = 'dash.html';
                }
            }, 1500);

        } catch (error) {
            Swal.fire('Signup Failed', error.message, 'error');
        }
    });
}

// SUPABASE AUTH LOGIN WITH DYNAMIC ROLE ROUTING
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            Swal.fire('Error', 'Please enter both email and password.', 'error');
            return;
        }

        try {
            var { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Logged-in user ka metadata check karein
            var userRole = data.user?.user_metadata?.role;

            if (userRole === "admin") {
                Swal.fire({
                    icon: 'success',
                    title: 'Access Granted: Welcome Admin!',
                    text: 'Transferring to enterprise control terminal...',
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(function() {
                    window.location.href = 'adminPannel.html'; // Admin Dashboard Link
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Opening your post feed workspace...',
                    showConfirmButton: false,
                    timer: 1200
                });

                setTimeout(function() {
                    window.location.href = 'dash.html'; // Normal User Dashboard Link
                }, 1200);
            }

        } catch (error) {
            Swal.fire('Login Failed', error.message, 'error');
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const googleBtn = document.querySelector(".googleLoginBtn");

    if (googleBtn) {
        googleBtn.addEventListener("click", async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'http://127.0.0.1:5500/dash.html',
           
                  redirectTo: 'https://kaneezfatima428.github.io/post-app-with-supabase-/dash.html'
                }
            });

            if (error) {
                console.error("Google Sign-In Error:", error.message);
                alert("Login Error: " + error.message);
            }
        });
    }
});
        
    
