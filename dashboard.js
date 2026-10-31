// ================================
// Donate Smarter Dashboard
// ================================

document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // Sidebar Toggle
    // ================================
    const menuBtn = document.querySelector(".fa-bars");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("hide");
        });
    }

    // ================================
    // Active Menu
    // ================================
    const menuItems = document.querySelectorAll(".sidebar ul li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // ================================
    // Counter Animation
    // ================================
    const counters = document.querySelectorAll(".card h2");

    counters.forEach(counter => {

        const target = parseInt(counter.innerText.replace(/\D/g, "")) || 0;
        let count = 0;
        const speed = Math.max(1, Math.ceil(target / 80));

        function updateCounter() {

            if (count < target) {

                count += speed;

                if (count > target)
                    count = target;

                counter.innerText = count.toLocaleString() + "+";

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target.toLocaleString() + "+";

            }

        }

        updateCounter();

    });

    // ================================
    // Card Hover Effect
    // ================================
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.03)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
        });

    });

    // ================================
    // Donate Button
    // ================================
    const donateBtn = document.querySelector(".donate-btn");

    if (donateBtn) {

        donateBtn.addEventListener("click", () => {

            alert("❤️ Thank you for choosing Donate Smarter!");

        });

    }

    // ================================
    // Notification Badge Animation
    // ================================
    const badges = document.querySelectorAll(".sidebar span");

    if (badges.length > 0) {

        setInterval(() => {

            badges.forEach(badge => {

                badge.style.transform = "scale(1.25)";

                setTimeout(() => {

                    badge.style.transform = "scale(1)";

                }, 300);

            });

        }, 2500);

    }

    // ================================
    // Greeting
    // ================================
    const heading = document.querySelector(".hero-left h1");

    if (heading) {

        const hour = new Date().getHours();

        if (hour < 12) {

            heading.innerHTML =
                "Good Morning ☀️<br>Your Donation Can Change Lives";

        } else if (hour < 18) {

            heading.innerHTML =
                "Good Afternoon 🌤️<br>Your Donation Can Change Lives";

        } else {

            heading.innerHTML =
                "Good Evening 🌙<br>Your Donation Can Change Lives";

        }

    }

});

document.querySelector("form").addEventListener("submit", function (e) {

    const phone = document.querySelector('input[name="phone"]').value.trim();

    // Phone number validation
    if (phone.length !== 10) {
        e.preventDefault();

        showNotification(
            "Invalid Phone Number",
            "Phone number must contain 10 digits.",
            false
        );

        return;
    }

    // Stop normal form submission for the demo
    e.preventDefault();

    // Show success notification
    showNotification(
        "Donation Successful!",
        "Your item has been donated successfully.",
        true
    );
});


function showNotification(title, message, success = true) {

    const notification = document.getElementById("donationNotification");

    notification.querySelector("strong").textContent = title;
    notification.querySelector("p").textContent = message;

    const icon = notification.querySelector(".notification-icon");

    if (success) {
        icon.textContent = "✓";
        notification.style.borderLeftColor = "#16a34a";
        icon.style.background = "#16a34a";
    } else {
        icon.textContent = "!";
        notification.style.borderLeftColor = "#dc2626";
        icon.style.background = "#dc2626";
    }

    notification.classList.add("show");

    // Automatically hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove("show");
    }, 4000);
}


function closeNotification() {
    document
        .getElementById("donationNotification")
        .classList.remove("show");
}