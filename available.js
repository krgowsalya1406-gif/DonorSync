/* =====================================================
   DONATE SMARTER - AVAILABLE ITEMS JAVASCRIPT
   ===================================================== */


/* =====================================================
   VARIABLES
   ===================================================== */

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const locationFilter =
    document.getElementById("locationFilter");

const sortSelect =
    document.getElementById("sortSelect");

const itemsGrid =
    document.getElementById("itemsGrid");

const resultCount =
    document.getElementById("resultCount");

const totalItems =
    document.getElementById("totalItems");

const noResults =
    document.getElementById("noResults");

const clearSearch =
    document.getElementById("clearSearch");

const itemModal =
    document.getElementById("itemModal");

const toast =
    document.getElementById("toast");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");


let selectedItem = null;

let savedCount = 0;


/* =====================================================
   GET ALL ITEMS
   ===================================================== */

function getItems() {

    return Array.from(
        document.querySelectorAll(".item-card")
    );

}


/* =====================================================
   SEARCH + FILTER
   ===================================================== */

function filterItems() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categoryFilter.value;

    const location =
        locationFilter.value;

    const items =
        getItems();

    let visibleItems = [];


    items.forEach(item => {

        const name =
            item.dataset.name
                .toLowerCase();

        const itemCategory =
            item.dataset.category
                .toLowerCase();

        const itemLocation =
            item.dataset.location
                .toLowerCase();


        const matchesSearch =
            name.includes(search);

        const matchesCategory =
            category === "all" ||
            itemCategory === category;

        const matchesLocation =
            location === "all" ||
            itemLocation === location;


        if (
            matchesSearch &&
            matchesCategory &&
            matchesLocation
        ) {

            item.style.display = "";

            visibleItems.push(item);

        } else {

            item.style.display = "none";

        }

    });


    resultCount.textContent =
        visibleItems.length;

    totalItems.textContent =
        visibleItems.length;


    if (visibleItems.length === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }


    /* Search clear button */

    if (search.length > 0) {

        clearSearch.style.display =
            "block";

    } else {

        clearSearch.style.display =
            "none";

    }

}


/* =====================================================
   EVENT LISTENERS
   ===================================================== */

searchInput.addEventListener(
    "input",
    filterItems
);

categoryFilter.addEventListener(
    "change",
    filterItems
);

locationFilter.addEventListener(
    "change",
    filterItems
);


/* =====================================================
   CLEAR SEARCH
   ===================================================== */

clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        filterItems();

        searchInput.focus();

    }
);


/* =====================================================
   SORT ITEMS
   ===================================================== */

sortSelect.addEventListener(
    "change",
    function() {

        const sort =
            sortSelect.value;

        const items =
            getItems();


        if (sort === "newest") {

            items.sort(
                (a,b) =>
                    Number(b.dataset.date) -
                    Number(a.dataset.date)
            );

        }


        if (sort === "oldest") {

            items.sort(
                (a,b) =>
                    Number(a.dataset.date) -
                    Number(b.dataset.date)
            );

        }


        if (sort === "name") {

            items.sort(
                (a,b) =>
                    a.dataset.name
                        .localeCompare(
                            b.dataset.name
                        )
            );

        }


        items.forEach(item => {

            itemsGrid.appendChild(item);

        });


        filterItems();

    }
);


/* =====================================================
   FAVORITE
   ===================================================== */

function toggleFavorite(button) {

    button.classList.toggle("saved");


    const icon =
        button.querySelector("i");


    if (button.classList.contains("saved")) {

        icon.classList.remove(
            "fa-regular"
        );

        icon.classList.add(
            "fa-solid"
        );

        savedCount++;

    } else {

        icon.classList.remove(
            "fa-solid"
        );

        icon.classList.add(
            "fa-regular"
        );

        savedCount--;

    }


    document.getElementById(
        "savedItems"
    ).textContent = savedCount;


    saveFavorites();

}


/* =====================================================
   SAVE FAVORITES
   ===================================================== */

function saveFavorites() {

    const saved =
        Array.from(
            document.querySelectorAll(
                ".favorite.saved"
            )
        ).map(button => {

            return button
                .closest(".item-card")
                .dataset.name;

        });


    localStorage.setItem(
        "donateSmarterFavorites",
        JSON.stringify(saved)
    );

}


/* =====================================================
   LOAD FAVORITES
   ===================================================== */

function loadFavorites() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "donateSmarterFavorites"
            )
        ) || [];


    const items =
        getItems();


    items.forEach(item => {

        if (
            saved.includes(
                item.dataset.name
            )
        ) {

            const button =
                item.querySelector(
                    ".favorite"
                );

            button.classList.add(
                "saved"
            );


            const icon =
                button.querySelector("i");


            icon.classList.remove(
                "fa-regular"
            );

            icon.classList.add(
                "fa-solid"
            );


            savedCount++;

        }

    });


    document.getElementById(
        "savedItems"
    ).textContent = savedCount;

}


/* =====================================================
   OPEN ITEM MODAL
   ===================================================== */

function openItem(
    name,
    category,
    location,
    condition,
    description
) {

    selectedItem = name;


    document.getElementById(
        "modalTitle"
    ).textContent = name;


    document.getElementById(
        "modalCategory"
    ).textContent =
        category.toUpperCase();


    document.getElementById(
        "modalCategoryText"
    ).textContent = category;


    document.getElementById(
        "modalLocation"
    ).textContent = location;


    document.getElementById(
        "modalCondition"
    ).textContent = condition;


    document.getElementById(
        "modalDescription"
    ).textContent = description;


    itemModal.classList.add("show");


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE MODAL
   ===================================================== */

function closeModal() {

    itemModal.classList.remove("show");

    document.body.style.overflow =
        "";

}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ===================================================== */

itemModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === itemModal
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   ESCAPE KEY
   ===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   SEND REQUEST
   ===================================================== */

function sendRequest() {

    if (!selectedItem) {
        return;
    }


    /* Store request */

    let requests =
        JSON.parse(
            localStorage.getItem(
                "donateSmarterRequests"
            )
        ) || [];


    requests.push({

        item: selectedItem,

        date:
            new Date()
                .toLocaleDateString(),

        status: "Pending"

    });


    localStorage.setItem(
        "donateSmarterRequests",
        JSON.stringify(requests)
    );


    closeModal();


    showToast();

}


/* =====================================================
   SUCCESS TOAST
   ===================================================== */

function showToast() {

    toast.classList.add("show");


    setTimeout(
        closeToast,
        4000
    );

}


function closeToast() {

    toast.classList.remove("show");

}


/* =====================================================
   RESET FILTERS
   ===================================================== */

function resetFilters() {

    searchInput.value = "";

    categoryFilter.value =
        "all";

    locationFilter.value =
        "all";

    sortSelect.value =
        "newest";


    filterItems();

}


/* =====================================================
   MOBILE SIDEBAR
   ===================================================== */

mobileMenu.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =====================================================
   CLOSE SIDEBAR WHEN LINK CLICKED
   ===================================================== */

document.querySelectorAll(
    ".menu-item"
).forEach(link => {

    link.addEventListener(
        "click",
        function() {

            if (
                window.innerWidth <= 900
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

});


/* =====================================================
   INITIAL LOAD
   ===================================================== */

loadFavorites();

filterItems();