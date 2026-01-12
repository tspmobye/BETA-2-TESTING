document.addEventListener("DOMContentLoaded", () => {

  /* ===== CORE ===== */
  const buttons = document.querySelectorAll(".menu button");
  const sections = document.querySelectorAll(".section");
  const clubs = document.querySelectorAll(".club");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

/* ===== CAROUSEL ELEMENTS ===== */
const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let cards = Array.from(document.querySelectorAll(".club-card"));
let index = 1;
let interval = null;

/* ===== CLONE FOR INFINITE LOOP ===== */
const firstClone = cards[0].cloneNode(true);
const lastClone = cards[cards.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

track.appendChild(firstClone);
track.insertBefore(lastClone, cards[0]);

cards = Array.from(document.querySelectorAll(".club-card"));

/* ===== CARD WIDTH ===== */
function getCardWidth() {
  return cards[0].offsetWidth;
}

/* ===== POSITION ===== */
function setPosition(noAnimation = false) {
  if (noAnimation) track.style.transition = "none";
  else track.style.transition = "transform 0.5s ease-in-out";

  track.style.transform = `translateX(-${index * getCardWidth()}px)`;
}

setPosition(true);

/* ===== BUTTON CONTROLS ===== */
nextBtn.addEventListener("click", () => {
  if (index >= cards.length - 1) return;
  index++;
  setPosition();
});

prevBtn.addEventListener("click", () => {
  if (index <= 0) return;
  index--;
  setPosition();
});

/* ===== LOOP RESET ===== */
track.addEventListener("transitionend", () => {
  if (cards[index].classList.contains("clone")) {
    if (index === cards.length - 1) index = 1;
    if (index === 0) index = cards.length - 2;
    setPosition(true);
  }
});

/* ===== AUTO SLIDE ===== */
function startCarousel() {
  interval = setInterval(() => {
    index++;
    setPosition();
  }, 5000);
}

function stopCarousel() {
  clearInterval(interval);
}

startCarousel();

/* Pause on hover (optional) */
track.parentElement.addEventListener("mouseenter", stopCarousel);
track.parentElement.addEventListener("mouseleave", startCarousel);

  /* ===== SECTION CONTROL ===== */
  function showSection(id) {
    sections.forEach(section =>
      section.classList.toggle("active", section.id === id)
    );

    buttons.forEach(btn =>
      btn.classList.toggle("active", btn.dataset.page === id)
    );

    window.scrollTo({ top: 0, behavior: "smooth" });

    startCarousel();

    if (track) {
      track.parentElement.style.display = id === "home" ? "flex" : "none";
    }
  }

  /* ===== MENU NAVIGATION ===== */
  buttons.forEach(btn =>
    btn.addEventListener("click", () =>
      showSection(btn.dataset.page)
    )
  );

  /* ===== CLUB NAVIGATION ===== */
  clubs.forEach(club =>
    club.addEventListener("click", () =>
      showSection(club.dataset.page)
    )
  );

  /* ===== SEARCH ===== */
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", e => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      const found = Array.from(sections).find(sec =>
        sec.id.toLowerCase().includes(query)
      );

      if (found) showSection(found.id);

      searchInput.value = "";
    });
  }

  /* ===== BACK BUTTONS ===== */
  document.body.addEventListener("click", e => {
    if (
      e.target.classList.contains("back-btn") ||
      e.target.classList.contains("theatre-back")
    ) {
      e.preventDefault();
      showSection("clubs");
    }
  });

  /* ===== CAROUSEL BUTTONS ===== */
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      carouselIndex = (carouselIndex - 1 + cards.length) % cards.length;
      moveCarousel();
    });

    nextBtn.addEventListener("click", () => {
      carouselIndex = (carouselIndex + 1) % cards.length;
      moveCarousel();
    });
  }

  /* ===== RESIZE FIX ===== */
  window.addEventListener("resize", moveCarousel);

  /* ===== FAQ TOGGLE ===== */
  document.querySelectorAll(".question").forEach(q => {
    q.addEventListener("click", () => {
      q.classList.toggle("active");
      q.nextElementSibling.classList.toggle("open");
    });
  });

  /* ===== GMAIL LINK ===== */
  const gmailIcon = document.querySelector(".gmail-tooltip img");
  if (gmailIcon) {
    gmailIcon.addEventListener("click", () => {
      window.location.href = "mailto:example@gmail.com";
    });
  }

  /* ===== INIT ===== */
  showSection("home");
  startCarousel();

});

