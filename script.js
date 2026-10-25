
/* =================================
   LOGIN SETTINGS
================================= */

// Change username and password here
const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "Secure@123";

// Paste your website URL here
const SUCCESS_REDIRECT_URL = "https://realestatedm-046-048.streamlit.app/";

// Brute-force simulation settings
const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 30;

const $ = id => document.getElementById(id);

let failedAttempts = 0;
let lockedUntil = 0;
let lockTimer = null;


// Display credentials
$("shownUsername").textContent = LOGIN_USERNAME;
$("shownPassword").textContent = LOGIN_PASSWORD;
$("username").value = LOGIN_USERNAME;


// =================================
// NAVIGATION
// =================================

document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        document.querySelectorAll(".view").forEach(view => {
            view.classList.toggle(
                "active",
                view.id === button.dataset.view
            );
        });
    });
});


// =================================
// STATUS MESSAGE
// =================================

function showNotice(element, message, type) {
    element.textContent = message;
    element.className = "notice show " + type;
}


// =================================
// SHOW / HIDE PASSWORD
// =================================

$("togglePassword").addEventListener("click", () => {

    const field = $("password");
    const isHidden = field.type === "password";

    field.type = isHidden ? "text" : "password";

    $("togglePassword").textContent =
        isHidden ? "HIDE" : "SHOW";
});


// =================================
// PASSWORD STRENGTH CHECKER
// =================================

$("password").addEventListener("input", () => {

    const password = $("password").value;

    $("strengthBox").classList.toggle(
        "visible",
        password.length > 0
    );

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[a-z]/.test(password) &&
        /[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        "Very Weak",
        "Weak",
        "Fair",
        "Good",
        "Strong",
        "Very Strong"
    ];

    const colors = [
        "#e25567",
        "#e25567",
        "#e8a34c",
        "#e8c64c",
        "#54c78a",
        "#28d8a0"
    ];

    $("strengthLabel").textContent =
        password.length ? levels[score] : "Too Short";

    $("strengthFill").style.width =
        password.length
            ? Math.max(8, score * 20) + "%"
            : "0%";

    $("strengthFill").style.background = colors[score];

    $("strengthHint").textContent =
        score >= 4
            ? "Good password combination."
            : "Use 8+ characters, uppercase, lowercase, numbers and symbols.";
});


// =================================
// BRUTE-FORCE SIMULATION
// =================================

function updateAttempts() {

    $("attemptText").textContent =
        `Failed attempts: ${failedAttempts}/${MAX_ATTEMPTS}`;

    $("attemptMeter").style.width =
        (failedAttempts / MAX_ATTEMPTS * 100) + "%";
}


function remainingSeconds() {
    return Math.max(
        0,
        Math.ceil((lockedUntil - Date.now()) / 1000)
    );
}


function updateLockStatus() {

    const remaining = remainingSeconds();

    if (remaining > 0) {

        $("lockStatus").textContent = `Locked: ${remaining}s`;
        $("loginButton").disabled = true;
        $("loginButton").textContent = `Try Again in ${remaining}s`;

    } else if (lockedUntil > 0) {

        lockedUntil = 0;
        failedAttempts = 0;

        updateAttempts();

        $("lockStatus").textContent = "Ready";
        $("loginButton").disabled = false;
        $("loginButton").textContent = "Login Securely";

        showNotice(
            $("loginNotice"),
            "Lock expired. You can try again.",
            "ok"
        );

        clearInterval(lockTimer);
        lockTimer = null;
    }
}


// =================================
// LOGIN VALIDATION
// =================================

$("loginForm").addEventListener("submit", event => {

    event.preventDefault();

    if (remainingSeconds() > 0) {

        updateLockStatus();

        showNotice(
            $("loginNotice"),
            "Login is temporarily locked. Please wait.",
            "bad"
        );

        return;
    }

    const username = $("username").value.trim();
    const password = $("password").value;

    if (
        username === LOGIN_USERNAME &&
        password === LOGIN_PASSWORD
    ) {

        showNotice(
            $("loginNotice"),
            "Login successful! Opening your website...",
            "ok"
        );

        $("lockStatus").textContent = "Authenticated";
        $("loginButton").disabled = true;

        setTimeout(() => {

            if (
                SUCCESS_REDIRECT_URL !== "https://example.com" &&
                SUCCESS_REDIRECT_URL.trim() !== ""
            ) {
                window.location.href = SUCCESS_REDIRECT_URL;
            } else {
                $("loginButton").disabled = false;

                showNotice(
                    $("loginNotice"),
                    "Add your website URL in script.js first.",
                    "info"
                );
            }

        }, 700);

    } else {

        failedAttempts++;
        updateAttempts();

        if (failedAttempts >= MAX_ATTEMPTS) {

            lockedUntil = Date.now() + LOCK_SECONDS * 1000;

            showNotice(
                $("loginNotice"),
                "Too many failed attempts. Login locked for 30 seconds.",
                "bad"
            );

            if (lockTimer) clearInterval(lockTimer);

            lockTimer = setInterval(updateLockStatus, 250);

            updateLockStatus();

        } else {

            showNotice(
                $("loginNotice"),
                `Incorrect login details. ${
                    MAX_ATTEMPTS - failedAttempts
                } attempts remaining.`,
                "bad"
            );
        }
    }
});


// =================================
// SPAM ENQUIRY DETECTION
// =================================

$("enquiryForm").addEventListener("submit", event => {

    event.preventDefault();

    const name = $("enquiryName").value.trim();
    const email = $("enquiryEmail").value.trim();
    const message = $("enquiryMessage").value.trim();

    const lowerMessage = message.toLowerCase();

    const spamPhrases = [
        "buy now",
        "click here",
        "free money",
        "act now",
        "limited offer",
        "make money fast",
        "claim your prize"
    ];

    const matchedPhrases = spamPhrases.filter(phrase =>
        lowerMessage.includes(phrase)
    );

    const links = message.match(/https?:\/\/|www\./gi) || [];

    const repeatedCharacters = /(.)\1{7,}/i.test(message);

    const uppercaseCount =
        (message.match(/[A-Z]/g) || []).length;

    const excessiveUppercase =
        message.length > 20 &&
        uppercaseCount / message.length > 0.65;

    const signals = [];

    if (matchedPhrases.length) {
        signals.push("Spam phrases detected");
    }

    if (links.length >= 2) {
        signals.push("Multiple links");
    }

    if (repeatedCharacters) {
        signals.push("Repeated characters");
    }

    if (excessiveUppercase) {
        signals.push("Excessive uppercase");
    }

    if (message.length < 12) {
        signals.push("Very short message");
    }

    if (!name) {
        signals.push("Name missing");
    }

    const validEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (email && !validEmail) {
        signals.push("Invalid email format");
    }

    const isPotentialSpam =
        matchedPhrases.length > 0 ||
        links.length >= 2 ||
        repeatedCharacters ||
        excessiveUppercase;

    if (isPotentialSpam) {

        showNotice(
            $("enquiryNotice"),
            "Potential spam detected! " + signals.join(", "),
            "bad"
        );

    } else if (signals.length > 0) {

        showNotice(
            $("enquiryNotice"),
            "Please review: " + signals.join(", "),
            "info"
        );

    } else {

        showNotice(
            $("enquiryNotice"),
            "No obvious spam signals found. Review before accepting.",
            "ok"
        );
    }
});


// Initial display
updateAttempts();
