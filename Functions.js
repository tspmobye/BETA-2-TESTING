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
  const cards = document.querySelectorAll(".club-card");

  let carouselIndex = 0;
  let carouselInterval = null;

  /* ===== CAROUSEL WIDTH ===== */
  function getCardWidth() {
    if (!cards.length) return 0;
    const card = cards[0];
    const style = getComputedStyle(card);
    return card.offsetWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight);
  }

  /* ===== MOVE CAROUSEL ===== */
  function moveCarousel() {
    if (!track || !cards.length) return;
    const width = getCardWidth();
    track.style.transform = `translateX(-${carouselIndex * width}px)`;
  }

  /* ===== AUTO CAROUSEL ===== */
  function startCarousel() {
    if (!track || !cards.length) return;
    if (carouselInterval) return;

    carouselInterval = setInterval(() => {
      carouselIndex = (carouselIndex + 1) % cards.length;
      moveCarousel();
    }, 5000);
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
