document.addEventListener("DOMContentLoaded", () => {

  /* ===== CORE ===== */
  const buttons = document.querySelectorAll(".menu button");
  const sections = document.querySelectorAll(".section");
  const clubs = document.querySelectorAll(".club");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  /* ===== CAROUSEL ELEMENTS ===== */
  const carousel = document.querySelector(".carousel");
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let carouselInterval = null;

  /* ===== CAROUSEL SETUP (FIXED & INFINITE) ===== */
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
        index = index === 0 ? cards.length - 2 : 1;
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

    window.scrollTo({ top: 0, behavior: "smooth" });
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
