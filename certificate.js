
const REWARD_KEY = "donateSmarterRewards";

const defaultData = {
    xp: 0,
    donations: 0,
    streak: 0,
    lastActive: "",
    challenges: [],
    wheelDate: "",
    mysteryDate: "",
    scratchDate: "",
    badges: [],
    stamps: [],
    rewards: [],
    history: []
};

let data = {
    ...defaultData,
    ...JSON.parse(localStorage.getItem(REWARD_KEY) || "{}")
};

function saveData() {
    localStorage.setItem(REWARD_KEY, JSON.stringify(data));
    updateDashboard();
}

function addHistory(title, points) {
    data.history.unshift({
        title,
        points,
        date: new Date().toLocaleDateString("en-IN")
    });

    data.history = data.history.slice(0, 30);
}

const levels = [
    { name: "Kindness Beginner", xp: 0 },
    { name: "Kindness Helper", xp: 500 },
    { name: "Kindness Hero", xp: 1200 },
    { name: "Kindness Champion", xp: 2500 },
    { name: "Kindness Legend", xp: 5000 }
];

function getLevel() {
    let current = levels[0];

    levels.forEach(level => {
        if (data.xp >= level.xp) current = level;
    });

    return current;
}

function updateDashboard() {
    const level = getLevel();
    const index = levels.indexOf(level);
    const next = levels[index + 1];

    document.getElementById("xpValue").textContent = data.xp;
    document.getElementById("levelName").textContent = level.name;

    if (next) {
        const progress = ((data.xp - level.xp) /
            (next.xp - level.xp)) * 100;

        document.getElementById("xpProgress").style.width =
            progress + "%";

        document.getElementById("nextLevel").textContent =
            (next.xp - data.xp) + " XP to next level";
    } else {
        document.getElementById("xpProgress").style.width = "100%";
        document.getElementById("nextLevel").textContent =
            "Maximum level achieved!";
    }

    document.getElementById("streakCount").textContent =
        data.streak + " Days";

    document.getElementById("badgeCount").textContent =
        data.badges.length;

    document.getElementById("rewardCount").textContent =
        data.rewards.length;

    document.getElementById("donationCount").textContent =
        data.donations;

    document.getElementById("totalPoints").textContent =
        data.xp;

    updateTree();
    updateBadges();
    updatePassport();
    updateHistory();
}

function addXP(points, title) {
    data.xp += points;
    addHistory(title, points);
    saveData();
}

// Daily challenge
function completeChallenge(button, id, points) {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.challenges.includes(id + "-" + today)) {
        alert("You have already completed this challenge today!");
        return;
    }

    data.challenges.push(id + "-" + today);

    button.disabled = true;
    button.textContent = "Completed ✓";

    addXP(points, "Completed " + id + " challenge");
    updateStreak();

    if (id === "food") unlockStamp("food");
    if (id === "clothes") unlockStamp("clothes");
    if (id === "education") unlockStamp("education");

    alert("Challenge completed! You earned " + points + " XP.");
}

// Streak
function updateStreak() {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString = yesterday.toLocaleDateString("en-CA");

    if (data.lastActive === yesterdayString) {
        data.streak++;
    } else {
        data.streak = 1;
    }

    data.lastActive = today;

    if (data.streak >= 7) {
        unlockBadge("Consistency King");
    }

    saveData();
}

// Badges
function unlockBadge(name) {
    if (data.badges.includes(name)) return;

    data.badges.push(name);
    addHistory("Unlocked " + name + " badge", 0);

    alert("🏆 New achievement unlocked: " + name);
}

function updateBadges() {
    const achievements = document.querySelectorAll(".achievement");

    const badgeNames = [
        "First Kindness",
        "Food Hero",
        "Education Star",
        "Consistency King"
    ];

    const unlocked = [
        data.donations > 0,
        data.stamps.includes("food"),
        data.stamps.includes("education"),
        data.streak >= 7
    ];

    achievements.forEach((item, index) => {
        const status = item.querySelector("span");

        if (unlocked[index]) {
            if (!data.badges.includes(badgeNames[index])) {
                data.badges.push(badgeNames[index]);
                localStorage.setItem(REWARD_KEY, JSON.stringify(data));
            }

            status.textContent = "UNLOCKED ✓";
            status.className = "unlocked";
        } else {
            status.textContent = "LOCKED";
            status.className = "locked";
        }
    });

    document.getElementById("badgeCount").textContent =
        data.badges.length;
}

// Passport
function unlockStamp(category) {
    if (!data.stamps.includes(category)) {
        data.stamps.push(category);
        saveData();
    }
}

function updatePassport() {
    data.stamps.forEach(category => {
        const stamp = document.getElementById("stamp-" + category);

        if (stamp) {
            stamp.classList.add("collected");
            stamp.querySelector("span").textContent = "COLLECTED ✓";
        }
    });
}

// Wheel
const wheelPrizes = [
    { label: "50 XP", points: 50 },
    { label: "100 XP", points: 100 },
    { label: "20 XP", points: 20 },
    { label: "150 XP", points: 150 },
    { label: "Badge", points: 75 },
    { label: "75 XP", points: 75 }
];

function spinWheel() {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.wheelDate === today) {
        alert("Come back tomorrow for another spin!");
        return;
    }

    const button = document.getElementById("spinButton");
    const wheel = document.getElementById("wheel");

    button.disabled = true;

    const prizeIndex = Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[prizeIndex];

    const segmentCenter = prizeIndex * 60 + 30;
    const rotation = 360 * 5 + (360 - segmentCenter);

    wheel.style.transform = "rotate(" + rotation + "deg)";

    data.wheelDate = today;

    setTimeout(() => {
        addXP(prize.points, "Lucky Wheel Reward");

        if (prize.label === "Badge") {
            unlockBadge("Lucky Winner");
        }

        document.getElementById("wheelMessage").textContent =
            "Congratulations! You won " + prize.label + "!";

        button.textContent = "Come Back Tomorrow";
        saveData();

    }, 4100);
}

// Mystery box
function openMysteryBox() {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.mysteryDate === today) {
        alert("Your next mystery box will be available tomorrow!");
        return;
    }

    const rewards = [25, 50, 75, 100, 150, 200];
    const points = rewards[Math.floor(Math.random() * rewards.length)];

    data.mysteryDate = today;

    document.getElementById("giftBox").classList.add("opened");
    document.getElementById("giftBox").innerHTML =
        '<i class="fa-solid fa-gift"></i>';

    document.getElementById("mysteryMessage").textContent =
        "Amazing! You received " + points + " XP!";

    document.getElementById("mysteryButton").disabled = true;
    document.getElementById("mysteryButton").textContent =
        "Already Opened Today";

    data.rewards.push("Mystery Box");
    addXP(points, "Mystery Box Reward");
    saveData();
}

// Scratch card
function revealScratch() {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.scratchDate === today) {
        alert("You have already claimed today's scratch reward.");
        return;
    }

    const points = [50, 100, 150, 200][
        Math.floor(Math.random() * 4)
    ];

    data.scratchDate = today;

    document.getElementById("scratchReward").textContent =
        "+" + points + " XP 🎉";

    document.getElementById("scratchCover").style.transform =
        "translateY(-110%)";

    data.rewards.push("Scratch & Win");
    addXP(points, "Scratch & Win Reward");

    saveData();
}

// Kindness tree
function updateTree() {
    const donations = data.donations;

    let level = 0;
    let title = "Your Kindness Seed";
    let icon = "fa-seedling";

    if (donations >= 1) {
        level = 1;
        title = "Growing Sapling";
        icon = "fa-leaf";
    }

    if (donations >= 3) {
        level = 2;
        title = "Kindness Tree";
        icon = "fa-tree";
    }

    if (donations >= 7) {
        level = 3;
        title = "Blooming Tree";
        icon = "fa-tree";
    }

    if (donations >= 15) {
        level = 4;
        title = "Golden Kindness Forest";
        icon = "fa-tree";
    }

    document.getElementById("treeVisual").innerHTML =
        '<i class="fa-solid ' + icon + '"></i>';

    document.getElementById("treeLevel").textContent = title;

    document.getElementById("treeDescription").textContent =
        donations >= 15
        ? "You have grown a beautiful kindness forest!"
        : "Complete more donations to grow your tree.";

    const progress = Math.min((donations / 15) * 100, 100);

    document.getElementById("treeProgress").style.width =
        progress + "%";

    document.getElementById("treeCount").textContent =
        donations + " donations completed";
}

// Reward history
function updateHistory() {
    const history = document.getElementById("historyList");

    if (data.history.length === 0) {
        history.innerHTML =
            '<p class="no-history">No rewards collected yet.</p>';
        return;
    }

    history.innerHTML = "";

    data.history.forEach(item => {
        const row = document.createElement("div");
        row.className = "history-item";

        const details = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = item.title;

        const date = document.createElement("small");
        date.textContent = item.date;

        details.append(title, document.createElement("br"), date);

        const points = document.createElement("span");
        points.className = "history-points";
        points.textContent = "+" + item.points + " XP";

        row.append(details, points);
        history.appendChild(row);
    });
}

// Refresh daily challenge button states
function refreshChallenges() {
    const today = new Date().toLocaleDateString("en-CA");

    document.querySelectorAll(".challenge-card button").forEach(button => {
        const id = button.getAttribute("onclick")
            .match(/'([^']+)'/)[1];

        if (data.challenges.includes(id + "-" + today)) {
            button.disabled = true;
            button.textContent = "Completed ✓";
        }
    });
}

// Refresh daily game states
function refreshGames() {
    const today = new Date().toLocaleDateString("en-CA");

    if (data.wheelDate === today) {
        document.getElementById("spinButton").disabled = true;
        document.getElementById("spinButton").textContent =
            "Come Back Tomorrow";
    }

    if (data.mysteryDate === today) {
        document.getElementById("mysteryButton").disabled = true;
        document.getElementById("mysteryButton").textContent =
            "Already Opened Today";

        document.getElementById("mysteryMessage").textContent =
            "You have opened today's mystery box!";
    }

    if (data.scratchDate === today) {
        document.getElementById("scratchCover").style.transform =
            "translateY(-110%)";
        document.getElementById("scratchReward").textContent =
            "Reward already claimed!";
    }
}

// Demo donation action
function recordDonation() {
    data.donations++;
    addXP(100, "Completed Donation");
    unlockBadge("First Kindness");
    updateStreak();
}

// Initial dashboard
updateDashboard();
refreshChallenges();
refreshGames();
