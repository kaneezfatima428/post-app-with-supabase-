var supabase = window.supabase.createClient('https://dnlqybhhohivumfgnxdz.supabase.co', 'sb_publishable_osMm75NYS71XczWSpZIYOQ_MCrF_1h2');

var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var logoutBtn = document.getElementById('logoutBtn');
var postForm = document.getElementById('postForm');
var postsFeed = document.getElementById('postsFeed');
var canvasMode = document.getElementById('canvasMode');
var bgControlPanel = document.getElementById('bgControlPanel');
var submitPostBtn = document.getElementById('submitPostBtn');
var postCountBadge = document.getElementById('postCount');
var formHeaderTitle = document.getElementById('formHeaderTitle');

var galleryImagesList = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500",
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500"
];

var posts = [];
var selectedGalleryImage = galleryImagesList[0];
var currentUserEmail = "Anonymous User";
var userid;
var currentuserid;

var searchInput = document.getElementById('feedSearchInput');

searchInput.addEventListener('input', async function (e) {
    var searchText = e.target.value.toLowerCase().trim();

    if (searchText === '') {
        await renderFeed();
        return;
    }

    try {
        var { data, error } = await supabase
            .from('post app table')
            .select('*')
            .or(`title.ilike.%${searchText}%,description.ilike.%${searchText}%`)
            .order('id', { ascending: false });

        if (error) throw error;

        renderFeed(data);

    } catch (error) {
        console.error("Supabase search me error aya:", error);
    }
});

async function updateNavbarProfile() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        const avatarElem = document.getElementById('navUserAvatar');
        const emailElem = document.getElementById('navUserEmail');

        if (session && session.user && session.user.email) {
            const userEmail = session.user.email;

            currentUserEmail = userEmail;

            avatarElem.textContent = userEmail.charAt(0).toUpperCase();

            if (emailElem) {
                emailElem.textContent = userEmail;
            }
        } else {
            avatarElem.innerHTML = `<i class="bi bi-person-fill"></i>`;

            if (emailElem) {
                emailElem.textContent = "Anonymous User / Guest";
            }
        }
    } catch (err) {
        console.error("Navbar update karne me error aya:", err);
    }
}

updateNavbarProfile();


var logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.reload();
        }
    });
}

async function checkUserSession() {
    try {
        var { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
            console.warn("No active session found. Restricting access path routing...");
            window.location.href = 'index.html';
            return;
        }

        var { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
            currentUserEmail = user.email;
            userid = user.id;
            console.log(userid);

            var userBadge = document.getElementById('userBadge');
            if (userBadge) {
                userBadge.textContent = "Logged in: " + user.email;
            }
        }
    } catch (error) {
        console.error("Session Pipeline Tracking Exception Fault:", error.message);
    }
}

logoutBtn.addEventListener('click', async function () {
    try {
        var { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Signout processing routine interrupt:", error.message);
    }
});

async function renderFeed(customDataList) {
    postsFeed.innerHTML = '';

    try {
        if (!customDataList) {
            var { data, error } = await supabase
                .from('post app table')
                .select('*')
                .order('id', { ascending: false });

            if (error) throw error;
            posts = data;
        } else {
            posts = customDataList;
        }

        postCountBadge.textContent = posts.length + " posts loaded";

        if (posts.length === 0) {
            postsFeed.innerHTML = `
                <div class="text-center py-5 text-muted card border-0 shadow-sm p-4">
                    <i class="bi bi-folder2-open fs-1 mb-2 text-secondary"></i>
                    <p class="mb-0">No entries standard active in the database view.</p>
                </div>`;
            return;
        }

        var totalFeedItemsCount = posts.length;

        posts.forEach(function (post, index) {

            var postOrdinalSequenceNumber = totalFeedItemsCount - index;
            var backgroundRenderStyleCode = "";
            var btns = " ";

            if (post.bg_img && post.bg_img.startsWith('#')) {
                backgroundRenderStyleCode = "background-color: " + post.bg_img + ";";
            } else {
                backgroundRenderStyleCode = "background-image: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.25)), url('" + (post.bg_img || selectedGalleryImage) + "'); background-size: cover; background-position: center;";
            }

            if (userid && post.user_id === userid) {
                btns = `
                    <button class="btn btn-link btn-sm text-muted p-0" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                        <li><a class="dropdown-item small" href="#" onclick="editPost(${post.id})"><i class="bi bi-pencil me-2 text-warning"></i>Modify</a></li>
                        <li><a class="dropdown-item small" href="#" onclick="deletePost(${post.id})"><i class="bi bi-trash me-2 text-danger"></i>Discard</a></li>
                    </ul>
                `;
            }

            var postCreatorEmailId = post.user_email || currentUserEmail;

            var card = document.createElement('div');
            card.className = 'card post-display-card p-3 shadow-sm animation-fade-in mb-3';

            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px; font-size:14px; background-color: var(--primary-color) !important;">
                            ${postCreatorEmailId.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h6 class="m-0 fw-bold small text-dark-mode-fix">
                                ${postCreatorEmailId}
                                #<span class="ordinal-num">${postOrdinalSequenceNumber}</span>
                            </h6>

                            <small class="text-muted" style="font-size:10px; font-family: monospace;">
                                Database ID Track: ${post.id}
                            </small>
                        </div>
                    </div>

                    <div class="dropdown">
                        ${btns}
                    </div>
                </div>

                <div class="post-visual-box p-3 rounded"
                    style="${backgroundRenderStyleCode} color:${post.textColor || '#ffffff'}; min-height:120px;">

                    <h4 class="fw-bold m-0 mb-1">${post.title}</h4>

                    <p class="mb-0 small" style="white-space: pre-wrap; opacity:0.95;">
                        ${post.description}
                    </p>
                </div>
            `;

            postsFeed.appendChild(card);
        });

    } catch (error) {
        console.log(error);
    }
}

window.searchPosts = async function () {
    var searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    var queryValue = searchInput.value.trim();

    if (queryValue === "") {
        renderFeed(null);
        return;
    }

    try {
        var { data, error } = await supabase
            .from('post app table')
            .select('*')
            .or(`title.ilike.%${queryValue}%,description.ilike.%${queryValue}%`)
            .order('id', { ascending: false });

        if (error) throw error;
        renderFeed(data);

    } catch (error) {
        console.error("Data tracking search operation intercept fault logging:", error.message);
    }
};

postForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var editId = document.getElementById('editPostId').value;
    var title = document.getElementById('postTitle').value.trim();
    var description = document.getElementById('postDescription').value.trim();
    var textColor = document.getElementById('textColor').value;

    var backgroundSetupValue = "";

    if (canvasMode.value === 'solid') {
        backgroundSetupValue = document.getElementById('solidColorField').value;
    } else {
        backgroundSetupValue = selectedGalleryImage;
    }

    if (!title || !description) {
        Swal.fire({
            icon: "error",
            title: "Validation Field Alert",
            text: "Title & description fields can't be empty!",
        });
        return;
    }

    try {
        if (editId) {
            var { error } = await supabase
                .from('post app table')
                .update({
                    title: title,
                    description: description,
                    bg_img: backgroundSetupValue,
                    textColor: textColor
                })
                .eq('id', Number(editId));

            if (error) throw error;

            document.getElementById('editPostId').value = '';
            submitPostBtn.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Post Now`;
            formHeaderTitle.textContent = "Create a Post";
        } else {
            var { error } = await supabase
                .from('post app table')
                .insert({
                    id: Date.now(),
                    title: title,
                    description: description,
                    bg_img: backgroundSetupValue,
                    textColor: textColor,
                    user_email: currentUserEmail,
                    user_id: userid
                });

            if (error) throw error;
        }

        postForm.reset();
        canvasMode.value = 'solid';
        canvasMode.dispatchEvent(new Event('change'));
        renderFeed(null);

    } catch (error) {
        console.log(error);
    }
});

window.editPost = function (id) {
    var matchTargetIndex = posts.findIndex(function (p) {
        return p.id === Number(id);
    });

    if (matchTargetIndex === -1) return;

    var selectedItemDataObj = posts[matchTargetIndex];

    document.getElementById('editPostId').value = selectedItemDataObj.id;
    document.getElementById('postTitle').value = selectedItemDataObj.title;
    document.getElementById('postDescription').value = selectedItemDataObj.description;
    document.getElementById('textColor').value = selectedItemDataObj.textColor || '#ffffff';

    if (selectedItemDataObj.bg_img && selectedItemDataObj.bg_img.startsWith('#')) {
        canvasMode.value = 'solid';
        canvasMode.dispatchEvent(new Event('change'));

        var colorInput = document.getElementById('solidColorField');
        if (colorInput) colorInput.value = selectedItemDataObj.bg_img;

    } else {
        canvasMode.value = 'gallery';
        canvasMode.dispatchEvent(new Event('change'));

        selectedGalleryImage = selectedItemDataObj.bg_img;

        var targets = document.querySelectorAll('.gallery-option-thumb');

        targets.forEach(function (node) {
            var stringSlice = node.style.backgroundImage.slice(5, -2);

            if (
                stringSlice.indexOf(selectedGalleryImage) !== -1 ||
                selectedGalleryImage.indexOf(stringSlice) !== -1
            ) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });
    }

    submitPostBtn.innerHTML = `<i class="bi bi-check-all me-1"></i> Apply Modifications`;
    formHeaderTitle.textContent = "Edit Workbench Post";

    posts.splice(matchTargetIndex, 1);
    renderFeed(posts);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.deletePost = function (id) {
    Swal.fire({
        title: 'Discard entry?',
        text: "This item will be cleaned from structural cloud production storage database completely.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6C8196',
        cancelButtonColor: '#5C5C5C',
        confirmButtonText: 'Yes, remove'
    }).then(async function (result) {

        if (result.isConfirmed) {
            try {
                var { error } = await supabase
                    .from('post app table')
                    .delete()
                    .eq('id', Number(id));

                if (error) throw error;

                renderFeed(null);

            } catch (error) {
                console.error("Purging structural target stack trace error tracking:", error.message);
            }
        }
    });
};

themeToggle.addEventListener('click', function () {
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.replace('light-mode', 'dark-mode');
        themeIcon.className = 'bi bi-sun-fill';
    } else {
        document.body.classList.replace('dark-mode', 'light-mode');
        themeIcon.className = 'bi bi-moon-fill';
    }
});

canvasMode.addEventListener('change', function () {
    if (canvasMode.value === 'solid') {
        bgControlPanel.innerHTML = `
            <label class="form-label small text-muted mb-1 fw-semibold">Select Solid Color</label>
            <input type="color" id="solidColorField" class="form-control form-control-color w-100" value="#6C8196">
        `;
    } else {
        var dynamicThumbHTML = '<label class="form-label small text-muted mb-1 fw-semibold">Choose Gallery Theme Background</label><div class="gallery-grid-picker">';

        galleryImagesList.forEach(function (imgUrl, idx) {
            var activeStateClass = (idx === 0) ? 'active' : '';

            dynamicThumbHTML += '<div class="gallery-option-thumb ' + activeStateClass + '" style="background-image:url(\'' + imgUrl + '\')" onclick="selectThumbTarget(this, \'' + imgUrl + '\')"></div>';
        });

        dynamicThumbHTML += '</div>';
        bgControlPanel.innerHTML = dynamicThumbHTML;
        selectedGalleryImage = galleryImagesList[0];
    }
});

window.selectThumbTarget = function (elementNode, imgPath) {
    var siblingThumbs = document.querySelectorAll('.gallery-option-thumb');

    siblingThumbs.forEach(function (node) {
        node.classList.remove('active');
    });

    elementNode.classList.add('active');
    selectedGalleryImage = imgPath;
};

window.onload = async function () {
    await checkUserSession();
    await renderFeed(null);
};