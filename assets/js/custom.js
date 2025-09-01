(function($, window) {
  const DelhiZoo = window.DelhiZoo || {};

  DelhiZoo.showPage = {
    init: function() {
      this.initSliders();
      this.initReadMoreToggle();
      this.initMagnifier();
      this.initIconsToggle();
      this.initMasonry();
      this.initCarouselVertical();
      this.initLightboxGallery();
      this.initContactFormValidation();
  	  this.initSubscribeFormValidation();
  	  this.initTextToggle();
    },

    // ========== Variables ==========
    vars: {
      zoomLevel: 3,
    },

    // ========== Sliders ==========
    initSliders: function() {
      function initSlick(selector, settings) {
        if ($(selector).length && !$(selector).hasClass('slick-initialized')) {
          $(selector).slick(settings);
        }
      }

      initSlick('.slider', {
        dots: false,
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        lazyLoad: 'ondemand'
      });

      initSlick('.event-slider', {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        lazyLoad: 'ondemand',
        responsive: [{
          breakpoint: 768,
          settings: "unslick"
        }]
      });

      initSlick('.achievement-slider', {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        lazyLoad: 'ondemand',
        responsive: [{
          breakpoint: 768,
          settings: "unslick"
        }]
      });

      const $slider = $('.slider');
      const $currentSlide = $('#currentSlide');
      const $totalSlides = $('#totalSlides');
      if ($slider.length) {
        $totalSlides.text(('0' + $slider.slick('getSlick').slideCount).slice(-2));
        $slider.on('init reInit afterChange', function(event, slick, currentSlide) {
          let slideNumber = (currentSlide ? currentSlide + 1 : 1);
          $currentSlide.text(('0' + slideNumber).slice(-2));
        });
        $slider.trigger('init');
      }
    },
	
	  // ========== Image Magnifier ==========
    initMagnifier: function() {
      const magnify = function(imgID, zoom) {
        const img = document.getElementById(imgID);
        if (!img) return;
        const glass = document.createElement("DIV");
        glass.className = "img-magnifier-glass";
        img.parentElement.insertBefore(glass, img);

        glass.style.backgroundImage = "url('" + img.src + "')";
        glass.style.backgroundRepeat = "no-repeat";
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";

        const bw = 3;
        const w = glass.offsetWidth / 2;
        const h = glass.offsetHeight / 2;

        function moveMagnifier(e) {
          e.preventDefault();
          const pos = getCursorPos(e);
          let x = pos.x, y = pos.y;
          x = Math.max(w / zoom, Math.min(x, img.width - w / zoom));
          y = Math.max(h / zoom, Math.min(y, img.height - h / zoom));
          glass.style.left = (x - w) + "px";
          glass.style.top = (y - h) + "px";
          glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
        }

        function getCursorPos(e) {
          const a = img.getBoundingClientRect();
          let x = e.pageX - a.left - window.pageXOffset;
          let y = e.pageY - a.top - window.pageYOffset;
          return { x, y };
        }

        glass.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("mousemove", moveMagnifier);
      };

      magnify("myimage", this.vars.zoomLevel);
    },

    // ========== Read More Toggle ==========
    initReadMoreToggle: function() {
      $('.info-box .readmore a').on('click', function(e) {
        e.preventDefault();
        const parentBox = $(this).closest('.info-box');
        const paragraph = parentBox.find('p');
        const image = parentBox.find('img').first();
        const newHeight = window.innerWidth <= 768 ? '100px' : '60px';

        if (paragraph.is(':visible')) {
          paragraph.slideUp(300, () => image.animate({ height: '165px' }, 300));
          $(this).html('read more <img src="assets/images/home/read-more.png">').removeClass('rotated');
        } else {
          image.animate({ height: newHeight }, 300, () => paragraph.slideDown(300));
          $(this).html('read less <img src="assets/images/home/read-more.png">').addClass('rotated');
        }
      });
    },

    // ========== Toggle Icons Animation ==========
    initIconsToggle: function() {
      let iconsVisible = true;
      $('#right-arrow').on('click', function() {
        if (iconsVisible) {
          $('.adopt-icon, .partner-icon, .left-arrow').animate({ left: "-20%", opacity: 0 }, 500);
          $('.live-icon, .zoo-icon').animate({ right: "-200px", opacity: 0 }, 500);
        } else {
          $('.adopt-icon, .partner-icon').animate({ left: "3%", opacity: 1 }, 500);
          $('.left-arrow').animate({ left: "4.5%", opacity: 1 }, 500);
          $('.live-icon, .zoo-icon').animate({ right: "3%", opacity: 1 }, 500);
        }
        iconsVisible = !iconsVisible;
      });

      $('#left-arrow').on('click', function() {
        $('.adopt-icon, .partner-icon, .left-arrow').animate({ left: "-20%", opacity: 0 }, 500);
        $('.live-icon, .zoo-icon').animate({ right: "-200px", opacity: 0 }, 500);
        iconsVisible = false;
      });
    },

    // ========== Masonry Layout ==========
    initMasonry: function() {
      const grid = document.querySelector('.row[data-masonry]');
      if (!grid) return;
      imagesLoaded(grid, function() {
        new Masonry(grid, {
          percentPosition: true
        });
      });
    },

    // ========== Vertical Carousel ==========
    initCarouselVertical: function() {
      if ($('.vertical-carousel').length) {
        $('.vertical-carousel').slick({
          vertical: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          prevArrow: $('.slick-prev'),
          nextArrow: $('.slick-next'),
          infinite: true
        });
      }
    },


    // ========== Contact Form Validation ==========
    initContactFormValidation: function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    function setError(id, message) {
      const el = document.getElementById(id);
      if (el) el.textContent = message;
      isValid = false;
    }

    // Clear all error messages first
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const answer = form.answer.value.trim();

    // Name validation
    if (name === "") {
      setError("feedback-name", "Please enter your name.");
    } else if (name.length > 40) {
      setError("feedback-name", "Name should not have more than 40 chars.");
    }

    // Phone validation
    if (phone === "") {
      setError("feedback-phone", "Please enter your mobile number.");
    } else if (!/^\d{10}$/.test(phone)) {
      setError("feedback-phone", "Please enter a 10 digit mobile number.");
    }

    // Email validation
    // if (email === "") {
    //   setError("feedback-email", "Please enter your email.");
    // } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    //   setError("feedback-email", "Please enter a valid email.");
    // }

  

    // Message validation
    if (message === "") {
      setError("feedback-message", "This field is required.");
    } else if (message.length > 400) {
      setError("feedback-message", "Message should not exceed 400 characters.");
    }

    // Answer field (custom captcha or similar)
    if (answer === "") {
      const answerInput = document.querySelector(".answer-input");
      if (answerInput && !answerInput.querySelector(".error-message")) {
        const span = document.createElement("span");
        span.className = "error-message text-danger d-block mt-2";
        span.textContent = "This field is required.";
        answerInput.appendChild(span);
      }
      isValid = false;
    }

    // Submit if all fields are valid
    if (isValid) {
      form.submit();
    }
  });
},

	
	
	// ========== Subscribe Form Validation ==========
initSubscribeFormValidation: function() {
  const form = document.getElementById("new_subscriber");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let isValid = true;

    // Clear existing errors
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

    // Get values
    const email = form.querySelector('#subscriber_email').value.trim();
    const terms = form.querySelector('#subscriber_accept_terms_and_condition').checked;
    const answer = form.querySelector('#answer').value.trim();

    // Email Validation
    if (email === "") {
      document.getElementById("subscribe-email").textContent = "Please enter your email.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("subscribe-email").textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Terms checkbox validation
    if (!terms) {
      document.getElementById("subscribe-agree").textContent = "You must accept the terms and conditions.";
      isValid = false;
    }

    // Captcha answer validation
    if (answer === "") {
      const answerInput = form.querySelector(".answer-input");
      if (answerInput && !answerInput.querySelector(".error-message")) {
        const span = document.createElement("span");
        span.className = "error-message d-block mt-2";
        span.textContent = "This field is required.";
        answerInput.appendChild(span);
      }
      isValid = false;
    }

    // Submit if valid
    if (isValid) {
      form.submit();
    }
  });
},

	
	// ========== Read More Text Toggle ==========
    initTextToggle: function() {
      document.querySelectorAll('.readmore').forEach(toggle => {
        toggle.addEventListener('click', function () {
          const shortText = this.previousElementSibling.previousElementSibling;
          const fullText = this.previousElementSibling;

          if (fullText.style.display === 'none') {
            fullText.style.display = 'inline';
            shortText.style.display = 'none';
            this.innerHTML = 'read less <img src="assets/images/home/read-more.png">';
          } else {
            fullText.style.display = 'none';
            shortText.style.display = 'inline';
            this.innerHTML = 'read more <img src="assets/images/home/read-more.png">';
          }
        });
      });
    },

    // ========== Lightbox with Zoom ==========
    initLightboxGallery: function() {
      if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({ selector: '.glightbox' });
        lightbox.on('slide_changed', ({ slide }) => {
          const img = slide.querySelector('img');
          if (img) {
            mediumZoom(img);
          }
        });
      }

      const images = document.querySelectorAll(".gallery img");
      const lightboxModalEl = document.getElementById("lightboxModal");
      const lightboxImg = document.getElementById("lightboxImg");
      let currentIndex = 0;

      if (images.length && lightboxModalEl && lightboxImg) {
        let lightboxModal;
        try {
          lightboxModal = new bootstrap.Modal(lightboxModalEl);
        } catch (e) {
          console.warn("Bootstrap modal initialization failed:", e);
          return;
        }

        images.forEach((img, index) => {
          img.addEventListener("click", () => {
            currentIndex = index;
            lightboxImg.src = img.src;
            lightboxModal.show();
          });
        });

        document.addEventListener("keydown", function(e) {
          if (e.key === "ArrowLeft") changeSlide(-1);
          if (e.key === "ArrowRight") changeSlide(1);
        });

        function changeSlide(direction) {
          currentIndex = (currentIndex + direction + images.length) % images.length;
          lightboxImg.src = images[currentIndex].src;
        }
      }
    }
  };

  window.DelhiZoo = DelhiZoo;
  $(document).ready(() => DelhiZoo.showPage.init());
})(jQuery, window);
