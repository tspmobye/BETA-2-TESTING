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

  /* ===== CAROUSEL CONTROLS (GLOBAL SAFE) ===== */
  let startCarousel = () => {};
  let stopCarousel = () => {};

  /* ===== CAROUSEL ===== */
  if (carousel && track && prevBtn && nextBtn) {

    let cards = Array.from(track.children);
    let index = 1;
    let carouselInterval = null;

    const cardWidth = () => cards[0].offsetWidth;

    /* Clone first & last cards */
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    track.appendChild(firstClone);
    track.insertBefore(lastClone, cards[0]);

    cards = Array.from(track.children);

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

    /* Infinite loop */
    track.addEventListener("transitionend", () => {
      if (cards[index].classList.contains("clone")) {
        index = index === 0 ? cards.length - 2 : 1;
        updateCarousel(true);
      }
    });

    /* Exposed controls */
    startCarousel = () => {
      if (carouselInterval) return;
      carouselInterval = setInterval(() => {
        index++;
        updateCarousel();
      }, 5000);
    };

    stopCarousel = () => {
      clearInterval(carouselInterval);
      carouselInterval = null;
    };

    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", startCarousel);

    window.addEventListener("resize", () => {
      updateCarousel(true);
    });

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

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (id === "home") {
      startCarousel();
    } else {
      stopCarousel();
    }

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

  /* ===== SEARCH FUNCTIONALITY ===== */
  const searchResultsSection = document.getElementById("search-results");
  const noResultsSection = document.getElementById("no-results");
  const resultsTerm = document.getElementById("results-term");
  const searchTerm = document.getElementById("search-term");
  const resultsGrid = document.getElementById("results-grid");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        showSection("clubs");
        return;
      }

      const matchedClubs = Array.from(clubs).filter(club => {
        const name = club.dataset.name || club.dataset.page || "";
        return name.toLowerCase().includes(query);
      });

      resultsGrid.innerHTML = "";

      if (matchedClubs.length) {
        matchedClubs.forEach(club => {
          const clone = club.cloneNode(true);
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

});
