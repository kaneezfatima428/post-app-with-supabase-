// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// const SUPABASE_URL = 'https://dnlqybhhohivumfgnxdz.supabase.co';
// const SUPABASE_KEY = 'sb_publishable_osMm75NYS71XczWSpZIYOQ_MCrF_1h2';

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// // 🔐 Page Load par Admin Verification
// async function verifyAdminAccess() {
//   const { data: { user }, error } = await supabase.auth.getUser();

//   if (!user) {
//     window.location.href = "/";
//     return;
//   }

//   // Agar user admin nahi hai to access block
//   if (user.user_metadata?.role !== "admin") {
//     Swal.fire({
//       icon: 'error',
//       title: 'Access Denied',
//       text: 'You are not authorized to view the admin console.',
//       confirmButtonColor: '#3b82f6'
//     }).then(() => {
//       window.location.href = "dash.html";
//     });
//   }
// }

// // 🔀 Single Page Application (SPA) Tab Switching Router
// function switchTab(tabId, element) {
//   document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
//   document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

//   document.getElementById(`tab-${tabId}`).classList.add('active');
//   element.classList.add('active');

//   // Jis tab par click hoga, uska fresh data direct Supabase se load hoga
//   if (tabId === 'overview') loadSystemStats();
//   if (tabId === 'posts') loadAllPosts();
//   if (tabId === 'users') loadPlatformUsers();
// }

// // 📊 100% Dynamic Stats Counter (Direct from "post app table")
// async function loadSystemStats() {
//   const { data: posts, error } = await supabase.from("post app table").select("user_id");
  
//   if (error) {
//     console.error("Error loading stats:", error);
//     return;
//   }

//   if (posts) {
//     // Total posts length display
//     document.getElementById("totalPosts").innerText = posts.length;

//     // Unique Users Count (Jitne unique users ne posts ki hain unki counting)
//     const uniqueUsersList = [...new Set(posts.map(p => p.user_id))];
//     document.getElementById("totalUsers").innerText = uniqueUsersList.length;
//   }
// }

// // 📄 Fetch & Display Live Platform Posts Grid
// async function loadAllPosts() {
//   const postsContainer = document.getElementById("postsContainer");
//   postsContainer.innerHTML = `<div class="loading-state">Syncing live server content...</div>`;

//   const { data: posts, error } = await supabase
//     .from("post app table")
//     .select("*")
//     .order("id", { ascending: false });

//   if (error) {
//     postsContainer.innerHTML = `<p class="no-data">Error fetching data from Supabase.</p>`;
//     return;
//   }

//   if (!posts || posts.length === 0) {
//     postsContainer.innerHTML = `<p class="no-data">No active posts available on database.</p>`;
//     return;
//   }

//   postsContainer.innerHTML = "";
//   posts.forEach(post => {
//     const imgTag = post.img_url ? `<img src="${post.img_url}" class="post-media" alt="Post graphic"/>` : "";
//     postsContainer.innerHTML += `
//       <div class="post-glass-card">
//         ${imgTag}
//         <div class="post-details">
//           <h3>${post.title || "Untitled Post"}</h3>
//           <p>${post.description || "No description provided."}</p>
//           <button class="btn-delete-action" onclick="erasePost(${post.id})">
//             <i class="fa-solid fa-trash-can"></i> Delete Post
//           </button>
//         </div>
//       </div>
//     `;
//   });
// }

// // 🗑️ Delete Targeted Post via Supabase Row ID
// async function erasePost(id) {
//   const confirmation = await Swal.fire({
//     title: 'Are you sure?',
//     text: "This specific post will be deleted permanently from your post app table!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#ef4444',
//     cancelButtonColor: '#4b5563',
//     confirmButtonText: 'Yes, delete it!'
//   });

//   if (!confirmation.isConfirmed) return;

//   const { error } = await supabase.from("post app table").delete().eq("id", id);

//   if (error) {
//     Swal.fire('Error!', 'Could not drop row entry.', 'error');
//   } else {
//     Swal.fire('Deleted!', 'The post has been successfully removed.', 'success');
//     loadAllPosts(); // Real-time grid reload
//     loadSystemStats(); // Counters update
//   }
// }

// // 👥 View Specific User Posts in a Beautiful Modal
// async function viewUserPosts(userId) {
//   const { data: posts, error } = await supabase
//     .from("post app table")
//     .select("*")
//     .eq("user_id", userId);

//   if (error || !posts || posts.length === 0) {
//     Swal.fire('No Data', 'This specific user has not posted anything.', 'info');
//     return;
//   }

//   let postsListHtml = `<div class="modal-posts-scroller" style="max-height: 400px; overflow-y: auto; text-align: left;">`;
//   posts.forEach(p => {
//     postsListHtml += `
//       <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 0;">
//         <h4 style="color:#60a5fa;">${p.title || "Untitled"}</h4>
//         <p style="font-size:0.9rem; color:#9ca3af;">${p.description || "No description."}</p>
//       </div>
//     `;
//   });
//   postsListHtml += `</div>`;

//   Swal.fire({
//     title: `User Feed History`,
//     html: postsListHtml,
//     confirmButtonColor: '#3b82f6'
//   });
// }

// // 👥 Dynamic Users Registry Loader based on Database Activity
// // async function loadPlatformUsers() {
// //   const tbody = document.getElementById("usersTableBody");
// //   tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Fetching database user markers...</td></tr>`;

// //   // Fetching live data from your table to look for unique users
// //   const { data: posts, error } = await supabase.from("post app table").select("user_id");
  
// //   if (error || !posts || posts.length === 0) {
// //      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9ca3af;">No active users tracked via posts.</td></tr>`;
// //      return;
// //   }

// //   // Filter unique user IDs
// //   const uniqueUserIds = [...new Set(posts.map(p => p.user_id))];

// //   tbody.innerHTML = "";
// //   uniqueUserIds.forEach((uid, index) => {
// //     tbody.innerHTML += `
// //       <tr>
// //         <td>${index + 1}</td>
// //         <td><span class="mono-text">${uid.substring(0, 12)}...</span></td>
// //         <td>user-${index + 1}@registered.app</td>
// //         <td><span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">Live Node</span></td>
// //         <td class="action-buttons">
// //           <button class="btn-view" onclick="viewUserPosts('${uid}')">
// //             <i class="fa-solid fa-eye"></i> View Posts
// //           </button>
// //         </td>
// //       </tr>
// //     `;
// //   });
// // }
// // 👥 Dynamic Users Registry Loader: "post app table" se unique users nikalna
// async function loadPlatformUsers() {
//   const tbody = document.getElementById("usersTableBody");
//   tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--accent-glow);">Fetching database user markers...</td></tr>`;

//   // 1. Aapki table se user_id aur titles fetch karein
//   const { data: posts, error } = await supabase
//     .from("post app table")
//     .select("user_id, title");
  
//   if (error) {
//      console.error("Supabase Error:", error);
//      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#ef4444;">Error loading table rows.</td></tr>`;
//      return;
//   }

//   if (!posts || posts.length === 0) {
//      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9ca3af;">No active users tracked via posts.</td></tr>`;
//      return;
//   }

//   // 2. Unique User IDs ka array banayein
//   const uniqueUserIds = [...new Set(posts.map(p => p.user_id))];

//   tbody.innerHTML = "";
  
//   // 3. Loop chala kar table mein rows insert karein
//   uniqueUserIds.forEach((uid, index) => {
//     // Agar UID null ya undefined na ho tabhi add karein
//     if (uid) {
//       tbody.innerHTML += `
//         <tr>
//           <td>${index + 1}</td>
//           <td><span class="mono-text" style="color: #60a5fa;"><i class="fa-solid fa-user-tag"></i> User-${index + 1}</span></td>
//           <td><span style="font-size: 0.9rem; color: var(--text-muted);">${uid.substring(0, 15)}...</span></td>
//           <td><span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem;"><i class="fa-solid fa-circle" style="font-size: 0.5rem; margin-right: 5px;"></i> Active</span></td>
//           <td class="action-buttons">
//             <button class="btn-view" onclick="viewUserPosts('${uid}')">
//               <i class="fa-solid fa-eye"></i> View Posts
//             </button>
//           </td>
//         </tr>
//       `;
//     }
//   });
// }

// // 🚪 Logout Session Trigger
// async function logout() {
//   await supabase.auth.signOut();
//   window.location.href = "/";
// }

// // Window globally scoped hooks binding
// window.switchTab = switchTab;
// window.erasePost = erasePost;
// window.viewUserPosts = viewUserPosts;
// window.logout = logout;

// // Initializers Runtime execution
// // verifyAdminAccess();
// loadSystemStats();


import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- 🌐 SUPABASE CONNECTIONS ---

// 1. Normal Client Connection (Aapke project ki details)
const SUPABASE_URL = 'https://dnlqybhhohivumfgnxdz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_osMm75NYS71XczWSpZIYOQ_MCrF_1h2';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Admin Client Connection (Aapke project ka URL + 'service_role' Key)
// ⚠️ NOTE: Yahan 'YOUR_OWN_PROJECT_URL' aur 'YOUR_OWN_SERVICE_ROLE_KEY' paste karein!
const supabaseAdmin = createClient(
  'https://dnlqybhhohivumfgnxdz.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubHF5Ymhob2hpdnVtZmdueGR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjg5NDcxNywiZXhwIjoyMDk4NDcwNzE3fQ.ZlT49vcw-EONE7_SxYQ_k3g6vnEOp_r79VNhCHce0wg' // Jo apne Supabase API settings se nikala hai
);


// 🔐 Page Load par Admin Verification
async function verifyAdminAccess() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/";
    return;
  }

  // Agar user admin nahi hai to access block
  if (user.user_metadata?.role !== "admin") {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You are not authorized to view the admin console.',
      confirmButtonColor: '#3b82f6'
    }).then(() => {
      window.location.href = "dash.html";
    });
  }
}

// 🔀 Single Page Application (SPA) Tab Switching Router
function switchTab(tabId, element) {
  document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  document.getElementById(`tab-${tabId}`).classList.add('active');
  element.classList.add('active');

  // Jis tab par click hoga, uska fresh data direct Supabase se load hoga
  if (tabId === 'overview') loadSystemStats();
  if (tabId === 'posts') loadAllPosts();
  if (tabId === 'users') loadPlatformUsers();
}

// 📊 100% Dynamic Stats Counter (Direct from "post app table")
async function loadSystemStats() {
  const { data: posts, error } = await supabase.from("post app table").select("user_id");
  
  if (error) {
    console.error("Error loading stats:", error);
    return;
  }

  if (posts) {
    // Total posts length display
    document.getElementById("totalPosts").innerText = posts.length;

    // Unique Users Count (Jitne unique users ne posts ki hain unki counting)
    const uniqueUsersList = [...new Set(posts.map(p => p.user_id))];
    document.getElementById("totalUsers").innerText = uniqueUsersList.length;
  }
}

// 📄 Fetch & Display Live Platform Posts Grid
async function loadAllPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = `<div class="loading-state">Syncing live server content...</div>`;

  const { data: posts, error } = await supabase
    .from("post app table")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    postsContainer.innerHTML = `<p class="no-data">Error fetching data from Supabase.</p>`;
    return;
  }

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = `<p class="no-data">No active posts available on database.</p>`;
    return;
  }

  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const imgTag = post.img_url ? `<img src="${post.img_url}" class="post-media" alt="Post graphic"/>` : "";
    postsContainer.innerHTML += `
      <div class="post-glass-card">
        ${imgTag}
        <div class="post-details">
          <h3>${post.title || "Untitled Post"}</h3>
          <p>${post.description || "No description provided."}</p>
          <button class="btn-delete-action" onclick="erasePost(${post.id})">
            <i class="fa-solid fa-trash-can"></i> Delete Post
          </button>
        </div>
      </div>
    `;
  });
}

// 🗑️ Delete Targeted Post via Supabase Row ID
async function erasePost(id) {
  const confirmation = await Swal.fire({
    title: 'Are you sure?',
    text: "This specific post will be deleted permanently from your post app table!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#4b5563',
    confirmButtonText: 'Yes, delete it!'
  });

  if (!confirmation.isConfirmed) return;

  const { error } = await supabase.from("post app table").delete().eq("id", id);

  if (error) {
    Swal.fire('Error!', 'Could not drop row entry.', 'error');
  } else {
    Swal.fire('Deleted!', 'The post has been successfully removed.', 'success');
    loadAllPosts(); // Real-time grid reload
    loadSystemStats(); // Counters update
  }
}

// 👥 View Specific User Posts in a Beautiful Modal
async function viewUserPosts(userId) {
  const { data: posts, error } = await supabase
    .from("post app table")
    .select("*")
    .eq("user_id", userId);

  if (error || !posts || posts.length === 0) {
    Swal.fire('No Data', 'This specific user has not posted anything.', 'info');
    return;
  }

  let postsListHtml = `<div class="modal-posts-scroller" style="max-height: 400px; overflow-y: auto; text-align: left;">`;
  posts.forEach(p => {
    postsListHtml += `
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 0;">
        <h4 style="color:#60a5fa;">${p.title || "Untitled"}</h4>
        <p style="font-size:0.9rem; color:#9ca3af;">${p.description || "No description."}</p>
      </div>
    `;
  });
  postsListHtml += `</div>`;

  Swal.fire({
    title: `User Feed History`,
    html: postsListHtml,
    confirmButtonColor: '#3b82f6'
  });
}

// 👥 Dynamic Users Registry Loader: real Supabase Auth users list using 'supabaseAdmin'
async function loadPlatformUsers() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--accent-glow);">Fetching official auth directory...</td></tr>`;

  try {
    // 🌟 API Call using service_role to get real users list!
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;

    if (!users || users.length === 0) {
       tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9ca3af;">No users found in Authentication records.</td></tr>`;
       return;
    }

    tbody.innerHTML = "";
    
    users.forEach((user, index) => {
      // User metadata se display_name nikalna, agar na ho to standard name
      const userName = user.user_metadata?.display_name || user.user_metadata?.first_name || `User-${index + 1}`;
      const userEmail = user.email || 'N/A';
      const userPhone = user.phone || user.user_metadata?.Phone || 'No Phone';

      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td><span class="mono-text" style="color: #60a5fa;"><i class="fa-solid fa-user-tag"></i> ${userName}</span></td>
          <td><span style="font-size: 0.9rem; color: #cbd5e1;">${userEmail}</span></td>
          <td><span style="font-size: 0.9rem; color: var(--text-muted);">${userPhone}</span></td>
          <td class="action-buttons">
            <button class="btn-view" onclick="viewUserPosts('${user.id}')">
              <i class="fa-solid fa-eye"></i> View Posts
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
     console.error("Admin List Users Error:", err);
     tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#ef4444;">Could not sync authentication users directory. Ensure admin key is active.</td></tr>`;
  }
}

// 🚪 Logout Session Trigger
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/";
}

// Window globally scoped hooks binding
window.switchTab = switchTab;
window.erasePost = erasePost;
window.viewUserPosts = viewUserPosts;
window.logout = logout;

// Initializers Runtime execution
// verifyAdminAccess();
loadSystemStats();