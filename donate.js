const form = document.getElementById("donationForm");


/* =========================
   FORM SUBMIT
========================= */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const phoneInput =
        document.querySelector("input[name='phone']");

    const phone =
        phoneInput.value.trim();


    /* =========================
       PHONE VALIDATION
    ========================= */

    if (!/^[6-9][0-9]{9}$/.test(phone)) {

        showNotification(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        phoneInput.focus();

        return;
    }


    /* =========================
       SUCCESS MESSAGE
    ========================= */

    showNotification(
        "Donation submitted successfully! ❤️",
        "success"
    );


    /* =========================
       OPEN SUCCESS PAGE
    ========================= */

    setTimeout(function () {

        window.location.href = "success.html";

    }, 1000);

});


/* =========================
   NOTIFICATION FUNCTION
========================= */

function showNotification(message, type) {


    /* Remove old notification */

    const oldNotification =
        document.querySelector(".notification");

    if (oldNotification) {

        oldNotification.remove();

    }


    /* Create notification */

    const notification =
        document.createElement("div");


    notification.className =
        `notification ${type}`;


    /* Notification HTML */

    notification.innerHTML = `

        <div class="notification-icon">

            ${
                type === "success"

                ? '<i class="fa-solid fa-circle-check"></i>'

                : '<i class="fa-solid fa-circle-exclamation"></i>'
            }

        </div>


        <div class="notification-text">

            <strong>

                ${
                    type === "success"
                    ? "Success!"
                    : "Error!"
                }

            </strong>

            <span>
                ${message}
            </span>

        </div>


        <button
            type="button"
            class="notification-close">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    /* Add to page */

    document.body.appendChild(notification);


    /* Animation */

    setTimeout(function () {

        notification.classList.add("show");

    }, 10);


    /* Close button */

    notification
        .querySelector(".notification-close")
        .addEventListener("click", function () {

            notification.remove();

        });

}