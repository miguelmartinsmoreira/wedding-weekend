// =========================================
// WEDDING WEEKEND
// SORAIA & MIGUEL
// =========================================


// URL DO GOOGLE APPS SCRIPT

const RSVP_URL =
  "https://script.google.com/macros/s/AKfycbwkiLRxKt7FuN6g5yLrWjCBPacg4TZ37wCwcUJNrKXsuUwLil9eOTkYSzkv3dy8BGfhCA/exec";


const SUBMIT_LABEL = "Confirmar resposta →";


const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


function pad(number) {
  return String(number).padStart(2, "0");
}



// =========================================
// COUNTDOWN
// =========================================

const targetDate = new Date("2027-06-25T15:00:00+01:00").getTime();

let countdownTimer = null;


function updateCountdown() {

  const countdown = document.getElementById("countdown");

  if (!countdown) {
    return;
  }

  const distance = targetDate - Date.now();


  // O WEDDING WEEKEND JÁ COMEÇOU

  if (distance <= 0) {

    countdown.innerHTML =
      '<p class="countdown-started">O Wedding Weekend começou! 🥂</p>';

    clearInterval(countdownTimer);

    return;
  }


  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);


  const values = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };


  Object.keys(values).forEach(function (id) {

    const element = document.getElementById(id);

    if (element) {
      element.textContent = pad(values[id]);
    }

  });

}


updateCountdown();

countdownTimer = setInterval(updateCountdown, 1000);



// =========================================
// MENU MOBILE
// =========================================

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");


function setMenu(open) {

  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");

  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));

  document.body.classList.toggle("menu-open", open);

}


if (menuToggle && mobileMenu) {

  menuToggle.addEventListener("click", function () {
    setMenu(!mobileMenu.classList.contains("is-open"));
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

}



// =========================================
// SMOOTH SCROLL
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

  link.addEventListener("click", function (event) {

    const targetId = this.getAttribute("href");

    if (targetId.length < 2) {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });

  });

});



// =========================================
// GALERIA DA CASA
// =========================================

const mainGalleryImage = document.getElementById("mainGalleryImage");
const galleryMain = document.getElementById("galleryMain");
const galleryCurrent = document.getElementById("galleryCurrent");
const galleryTotal = document.getElementById("galleryTotal");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

const galleryThumbnails =
  Array.from(document.querySelectorAll(".gallery-thumbnail"));

let galleryIndex = 0;


function showGalleryImage(index) {

  if (!mainGalleryImage || galleryThumbnails.length === 0) {
    return;
  }

  const total = galleryThumbnails.length;

  galleryIndex = (index + total) % total;

  const thumbnail = galleryThumbnails[galleryIndex];
  const thumbnailImage = thumbnail.querySelector("img");


  // Fade out, troca a imagem, fade in

  mainGalleryImage.style.opacity = "0";

  setTimeout(function () {

    mainGalleryImage.src = thumbnail.dataset.image;
    mainGalleryImage.alt = thumbnailImage ? thumbnailImage.alt : "";

    mainGalleryImage.style.opacity = "1";

  }, 180);


  if (galleryCurrent) {
    galleryCurrent.textContent = pad(galleryIndex + 1);
  }


  galleryThumbnails.forEach(function (item, i) {
    item.classList.toggle("active", i === galleryIndex);
    item.setAttribute("aria-pressed", String(i === galleryIndex));
  });

}


if (mainGalleryImage && galleryThumbnails.length > 0) {

  if (galleryTotal) {
    galleryTotal.textContent = pad(galleryThumbnails.length);
  }


  // Miniaturas

  galleryThumbnails.forEach(function (thumbnail, i) {
    thumbnail.addEventListener("click", function () {
      showGalleryImage(i);
    });
  });


  // Setas

  if (galleryPrev) {
    galleryPrev.addEventListener("click", function () {
      showGalleryImage(galleryIndex - 1);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener("click", function () {
      showGalleryImage(galleryIndex + 1);
    });
  }


  // Swipe no telemóvel

  if (galleryMain) {
    addSwipe(galleryMain, function (direction) {
      showGalleryImage(galleryIndex + direction);
    });
  }


  // Pré-carregar as imagens da galeria

  galleryThumbnails.forEach(function (thumbnail) {
    const image = new Image();
    image.src = thumbnail.dataset.image;
  });

}


// Função de swipe reutilizável
// direction: 1 = seguinte, -1 = anterior

function addSwipe(element, callback) {

  let startX = 0;
  let startY = 0;

  element.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });

  element.addEventListener("touchend", function (event) {

    const deltaX = event.changedTouches[0].clientX - startX;
    const deltaY = event.changedTouches[0].clientY - startY;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      callback(deltaX < 0 ? 1 : -1);
    }

  }, { passive: true });

}



// =========================================
// MEMÓRIAS / LIGHTBOX
// =========================================

const memoryItems = Array.from(document.querySelectorAll(".memory-item"));
const memoryLightbox = document.getElementById("memoryLightbox");
const memoryLightboxImage = document.getElementById("memoryLightboxImage");
const memoryLightboxClose = document.getElementById("memoryLightboxClose");
const memoryLightboxPrev = document.getElementById("memoryLightboxPrev");
const memoryLightboxNext = document.getElementById("memoryLightboxNext");

let lightboxIndex = 0;
let lastFocusedElement = null;


function updateLightboxImage() {

  const image = memoryItems[lightboxIndex].querySelector("img");

  if (!image) {
    return;
  }

  memoryLightboxImage.src = image.currentSrc || image.src;
  memoryLightboxImage.alt = image.alt;

}


function openLightbox(index) {

  lightboxIndex = index;

  updateLightboxImage();

  lastFocusedElement = document.activeElement;

  memoryLightbox.classList.add("is-open");
  memoryLightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("lightbox-open");

  if (memoryLightboxClose) {
    memoryLightboxClose.focus();
  }

}


function closeLightbox() {

  memoryLightbox.classList.remove("is-open");
  memoryLightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("lightbox-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

}


function stepLightbox(direction) {

  const total = memoryItems.length;

  lightboxIndex = (lightboxIndex + direction + total) % total;

  updateLightboxImage();

}


if (memoryItems.length > 0 && memoryLightbox && memoryLightboxImage) {

  memoryItems.forEach(function (item, i) {

    item.addEventListener("click", function () {
      openLightbox(i);
    });

    item.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(i);
      }
    });

  });


  if (memoryLightboxClose) {
    memoryLightboxClose.addEventListener("click", closeLightbox);
  }

  if (memoryLightboxPrev) {
    memoryLightboxPrev.addEventListener("click", function () {
      stepLightbox(-1);
    });
  }

  if (memoryLightboxNext) {
    memoryLightboxNext.addEventListener("click", function () {
      stepLightbox(1);
    });
  }


  // Clicar fora da imagem fecha

  memoryLightbox.addEventListener("click", function (event) {
    if (event.target === memoryLightbox) {
      closeLightbox();
    }
  });


  // Swipe no telemóvel

  addSwipe(memoryLightbox, stepLightbox);

}



// =========================================
// TECLADO (ESC E SETAS)
// =========================================

document.addEventListener("keydown", function (event) {

  const lightboxOpen =
    memoryLightbox && memoryLightbox.classList.contains("is-open");

  const menuOpen =
    mobileMenu && mobileMenu.classList.contains("is-open");


  if (event.key === "Escape") {

    if (lightboxOpen) {
      closeLightbox();
    }

    if (menuOpen) {
      setMenu(false);
    }

  }


  if (lightboxOpen && event.key === "ArrowRight") {
    stepLightbox(1);
  }

  if (lightboxOpen && event.key === "ArrowLeft") {
    stepLightbox(-1);
  }

});



// =========================================
// ANIMAÇÕES AO FAZER SCROLL
// =========================================

const revealElements = document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window && !prefersReducedMotion) {

  const revealObserver = new IntersectionObserver(function (entries, observer) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });


  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });

} else {

  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });

}



// =========================================
// BOTÃO FLUTUANTE "CONFIRMAR PRESENÇA"
// Aparece depois do topo e esconde-se
// quando chegas ao RSVP (só no telemóvel)
// =========================================

const floatingRsvp = document.getElementById("floatingRsvp");
const heroSection = document.querySelector(".hero");
const rsvpSection = document.getElementById("rsvp");

let heroVisible = true;
let rsvpVisible = false;
let rsvpSubmitted = false;


function updateFloatingRsvp() {

  if (!floatingRsvp) {
    return;
  }

  const show = !heroVisible && !rsvpVisible && !rsvpSubmitted;

  floatingRsvp.classList.toggle("is-visible", show);
  floatingRsvp.setAttribute("aria-hidden", String(!show));
  floatingRsvp.setAttribute("tabindex", show ? "0" : "-1");

}


if (floatingRsvp && heroSection && rsvpSection && "IntersectionObserver" in window) {

  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
    updateFloatingRsvp();
  }).observe(heroSection);

  new IntersectionObserver(function (entries) {
    rsvpVisible = entries[0].isIntersecting;
    updateFloatingRsvp();
  }, { threshold: 0.1 }).observe(rsvpSection);

}



// =========================================
// ADICIONAR AO CALENDÁRIO (.ics)
// Para Apple Calendar e Outlook
// =========================================

const icsButton = document.getElementById("icsDownload");


if (icsButton) {

  icsButton.addEventListener("click", function () {

    const stamp =
      new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Soraia e Miguel//Wedding Weekend//PT",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:wedding-weekend-2027@soraia-miguel",
      "DTSTAMP:" + stamp,
      "DTSTART:20270625T140000Z",
      "DTEND:20270627T100000Z",
      "SUMMARY:Wedding Weekend — Soraia & Miguel",
      "LOCATION:Douro Villa\\, Santa Marinha do Zêzere\\, Portugal",
      "DESCRIPTION:Um fim de semana para celebrar connosco.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-weekend-soraia-miguel.ics";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

  });

}



// =========================================
// RSVP
// =========================================

const rsvpForm = document.getElementById("rsvpForm");
const rsvpExtra = document.getElementById("rsvpExtra");
const successYes = document.getElementById("successYes");
const successNo = document.getElementById("successNo");


function setError(id, message) {

  const element = document.getElementById(id);

  if (element) {
    element.textContent = message;
  }

}


function clearErrors() {

  rsvpForm.querySelectorAll(".form-error").forEach(function (element) {
    element.textContent = "";
  });

  rsvpForm.querySelectorAll(".is-invalid").forEach(function (element) {
    element.classList.remove("is-invalid");
  });

}


function getValue(id) {

  const element = document.getElementById(id);

  return element ? element.value.trim() : "";

}


if (rsvpForm) {

  const nameInput = document.getElementById("name");
  const submitButton = rsvpForm.querySelector("button[type='submit']");


  // Mostrar / esconder as perguntas extra

  rsvpForm.querySelectorAll('input[name="attendance"]').forEach(function (radio) {

    radio.addEventListener("change", function () {

      setError("attendanceError", "");

      if (rsvpExtra) {
        rsvpExtra.hidden = this.value !== "Sim";
      }

    });

  });


  // Limpar erros enquanto a pessoa preenche

  if (nameInput) {

    nameInput.addEventListener("input", function () {
      setError("nameError", "");
      nameInput.classList.remove("is-invalid");
    });

  }

  rsvpForm.querySelectorAll('input[name="nights"]').forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      setError("nightsError", "");
    });
  });


  // Submeter

  rsvpForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearErrors();


    const name = getValue("name");

    const attendanceElement =
      rsvpForm.querySelector('input[name="attendance"]:checked');

    const attendance = attendanceElement ? attendanceElement.value : "";

    const nights =
      Array.from(rsvpForm.querySelectorAll('input[name="nights"]:checked'))
        .map(function (input) { return input.value; });

    const transportElement =
      rsvpForm.querySelector('input[name="transport"]:checked');


    // Validação

    let firstInvalid = null;

    if (!name) {
      setError("nameError", "Falta o teu nome.");
      nameInput.classList.add("is-invalid");
      firstInvalid = nameInput;
    }

    if (!attendance) {
      setError("attendanceError", "Diz-nos se vens ou não.");
      firstInvalid = firstInvalid || rsvpForm.querySelector('input[name="attendance"]');
    } else if (attendance === "Sim" && nights.length === 0) {
      setError("nightsError", "Escolhe pelo menos uma noite.");
      firstInvalid = firstInvalid || rsvpForm.querySelector('input[name="nights"]');
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }


    // Dados a enviar

    const isComing = attendance === "Sim";

    const formData = {
      name: name,
      attendance: attendance,
      nights: isComing ? nights.join(", ") : "",
      transport: isComing && transportElement ? transportElement.value : "",
      dietary: isComing ? getValue("dietary") : "",
      song: isComing ? getValue("song") : ""
    };


    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "A enviar...";
    }


    try {

      await fetch(RSVP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(formData)
      });


      // Esconder formulário e mostrar a mensagem certa

      rsvpForm.hidden = true;

      const successBox = isComing ? successYes : successNo;
      const successName = document.getElementById(isComing ? "successYesName" : "successNoName");

      if (successName) {
        successName.textContent = name.split(" ")[0];
      }

      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
      }

      rsvpSubmitted = true;
      updateFloatingRsvp();

    } catch (error) {

      console.error("RSVP: erro ao enviar", error);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Tentar novamente →";
      }

      setError("submitError", "Não conseguimos enviar a tua resposta. Verifica a ligação e tenta outra vez.");

    }

  });


  // Repor o texto do botão se a pessoa mexer no formulário depois de um erro

  rsvpForm.addEventListener("input", function () {

    if (submitButton && !submitButton.disabled) {
      submitButton.textContent = SUBMIT_LABEL;
    }

  });

}