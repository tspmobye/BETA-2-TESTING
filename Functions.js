document.addEventListener("DOMContentLoaded", () => {
  // CORE
  const buttons = document.querySelectorAll(".menu button");
  const sections = document.querySelectorAll(".section");
  const clubs = document.querySelectorAll(".club");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  const resultsGrid = document.getElementById("results-grid");
  const resultsTerm = document.getElementById("results-term");
  const noResultsTerm = document.getElementById("search-term");

  // CAROUSEL
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const cards = document.querySelectorAll(".club-card");

  let carouselIndex = 0;
  let carouselInterval = null;

  function moveCarousel() {
    if (!document.getElementById("home")?.classList.contains("active")) return;
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    track.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
  }

  function startCarousel() {
    if (!track || !cards.length) return;

    stopCarousel();
    carouselInterval = setInterval(() => {
      carouselIndex = (carouselIndex + 1) % cards.length;
      moveCarousel();
    }, 5000);
  }

  function stopCarousel() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  // SECTION CONTROL
  function showSection(id) {
    sections.forEach(section => {
      section.classList.toggle("active", section.id === id);
    });

    buttons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.page === id);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (id === "home") {
      startCarousel();
      if (track) track.parentElement.style.display = "flex";
    } else {
      stopCarousel();
      if (track) track.parentElement.style.display = "none";
    }
  }

  // NAVIGATION BUTTONS
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.page);
    });
  });

  // CLUB GRID CLICKS
  clubs.forEach(club => {
    club.addEventListener("click", () => {
      showSection(club.dataset.page);
    });
  });

  // SEARCH
  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", e => {
      e.preventDefault();

      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;

      // 1️⃣ Exact section match (theatre, serviam, etc.)
      const exactSection = Array.from(sections).find(
        sec => sec.id.toLowerCase() === query
      );

      if (exactSection) {
        showSection(exactSection.id);
        searchInput.value = "";
        return;
      }

      // 2️⃣ Club name match
      const matchedClubs = Array.from(clubs).filter(club =>
        club.textContent.toLowerCase().includes(query)
      );

      if (matchedClubs.length > 0 && resultsGrid && resultsTerm) {
        resultsGrid.innerHTML = "";
        resultsTerm.textContent = query;

        matchedClubs.forEach(club => {
          const clone = club.cloneNode(true);

          clone.addEventListener("click", () => {
            showSection(club.dataset.page);
          });

          resultsGrid.appendChild(clone);
        });

        showSection("search-results");
      } else {
        // 3️⃣ No results
        if (noResultsTerm) noResultsTerm.textContent = query;
        showSection("no-results");
      }

      searchInput.value = "";
    });
  }

  // BACK BUTTONS
  document.body.addEventListener("click", e => {
    if (
      e.target.classList.contains("back-btn") ||
      e.target.classList.contains("theatre-back")
    ) {
      e.preventDefault();
      showSection("clubs");
    }
  });

  // CAROUSEL CONTROLS
  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (!document.getElementById("home").classList.contains("active")) return;
      carouselIndex = (carouselIndex - 1 + cards.length) % cards.length;
      moveCarousel();
    });

    nextBtn.addEventListener("click", () => {
      if (!document.getElementById("home").classList.contains("active")) return;
      carouselIndex = (carouselIndex + 1) % cards.length;
      moveCarousel();
    });

    window.addEventListener("resize", () => {
      if (document.getElementById("home").classList.contains("active")) {
        moveCarousel();
      }
    });
  }

  // FAQS
  document.querySelectorAll(".question").forEach(q => {
    q.addEventListener("click", () => {
      q.classList.toggle("active");
      q.nextElementSibling.classList.toggle("open");
    });
  });

  // GMAIL
  const gmailIcon = document.querySelector(".gmail-tooltip img");
  if (gmailIcon) {
    gmailIcon.addEventListener("click", () => {
      window.location.href = "mailto:club.archive@gmail.com";
    });
  }

  // INIT
  showSection("home");
});
