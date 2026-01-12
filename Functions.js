document.addEventListener("DOMContentLoaded", () => {

  /* ===== CORE ===== */
  const buttons = document.querySelectorAll(".menu button");
  const sections = document.querySelectorAll(".section");
  const clubs = document.querySelectorAll(".club");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

/* ===== PREVENT SEARCH FORM SUBMIT ===== */
if (searchForm) {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
  });
}

/* ===== CAROUSEL ELEMENTS ===== */
const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let carouselInterval = null;

/* ===== CAROUSEL FIXED & INFINITE (MULTI-CARD) ===== */
if (carousel && track && prevBtn && nextBtn) {

  let cards = Array.from(track.children);
  let index = 1;

  /* Clone first & last cards */
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);

  firstClone.classList.add("clone");
  lastClone.classList.add("clone");

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = Array.from(track.children);

  // Calculate how many cards fit in view
  const extra = Math.ceil(carousel.offsetWidth / cards[0].offsetWidth);

  // Clone extra cards to fill last slide
  for (let i = 0; i < extra; i++) {
    const clone = cards[i].cloneNode(true);
    clone.classList.add("clone");
    track.appendChild(clone);
  }

  cards = Array.from(track.children);

  /* Update position */
  function cardWidth() {
    return cards[0].offsetWidth;
  }

  function updateCarousel(noAnim = false) {
    track.style.transition = noAnim ? "none" : "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
  }

  updateCarousel(true);

  /* Buttons */
  nextBtn.addEventListener("click", () => {
    index++;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    index--;
    updateCarousel();
  });

  /* Infinite loop reset */
  track.addEventListener("transitionend", () => {
    if (cards[index].classList.contains("clone")) {
      index = index === 0 ? cards.length - 2 - extra : 1;
      updateCarousel(true);
    }
  });

  /* Auto slide */
  function startCarousel() {
    if (carouselInterval) return;
    carouselInterval = setInterval(() => {
      index++;
      updateCarousel();
    }, 5000);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }

  carousel.addEventListener("mouseenter", stopCarousel);
  carousel.addEventListener("mouseleave", startCarousel);

  /* Resize fix */
  window.addEventListener("resize", () => updateCarousel(true));

  startCarousel();
}

  /* ===== SECTION CONTROL ===== */
  function showSection(id) {
    sections.forEach(section =>
      section.classList.toggle("active", section.id === id)
    );

    buttons.forEach(btn =>
      btn.classList.toggle("active", btn.dataset.page === id)
    );

    if (carousel) {
      carousel.style.display = id === "home" ? "flex" : "none";
    }

    window.scrollTo({ top: 0, behavior: "auto" });
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

  /* ===== SEARCH FUNCTIONALITY (FIXED) ===== */
  const searchResultsSection = document.getElementById("search-results");
  const noResultsSection = document.getElementById("no-results");
  const resultsTerm = document.getElementById("results-term");
  const searchTerm = document.getElementById("search-term");
  const resultsGrid = document.getElementById("results-grid");

  if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

      // If empty, go back to clubs
      if (!query) {
        showSection("clubs");
        return;
      }

      const matchedClubs = Array.from(clubs).filter(club => {
        const name = club.dataset.name || club.dataset.page || "";
        return name.toLowerCase().includes(query);
      });

      resultsGrid.innerHTML = "";

      if (matchedClubs.length > 0) {
        matchedClubs.forEach(club => {
          const clone = club.cloneNode(true);

          // restore click behavior
          clone.addEventListener("click", () => {
            showSection(clone.dataset.page);
          });

          resultsGrid.appendChild(clone);
        });

        resultsTerm.textContent = query;
        showSection("search-results");
      } else {
        searchTerm.textContent = query;
        showSection("no-results");
      }
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

  /* ===== FAQ TOGGLE ===== */
  document.querySelectorAll(".question").forEach(q => {
    q.addEventListener("click", () => {
      q.classList.toggle("active");
      const answer = q.nextElementSibling;

      answer.classList.toggle("open");
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













