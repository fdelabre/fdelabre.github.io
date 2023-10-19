$(document).ready(function() {

    //////////////////////////////////////////////////

    // PARALAX
    var parallaxPower = 0.002;

    // SEARCH BAR
    const searchInput = $(".typed-text");
    const words = ["Développeur", "Musicien", "joueur de Jeux vidéo"];

    // DARK MODE
    const darkModeSwitch = $('#darkModeSwitch');
    const parallax = $('#parallax');

    // MISCELLANEOUS
    var navbar = $(".navbar-custom");
    let currentIndex = 0;

    //////////////////////////////////////////////////

    $(window).scroll(function() {
        if ($(this).scrollTop() > 0) {
            navbar.addClass("sticky");
        } else {
            navbar.removeClass("sticky");
        }
    });

    function typeWord(index) {
        const word = words[index];
        let i = 0;
        const typeEffectInterval = setInterval(function () {
            if (i <= word.length) {
                searchInput.text(word.slice(0, i));
                i++;
            } else {
                clearInterval(typeEffectInterval);
                setTimeout(function () {
                    eraseWord(index);
                }, 1000);
            }
        }, 100);
    }

    function eraseWord(index) {
        let i = words[index].length;
        const eraseEffectInterval = setInterval(function () {
            if (i >= 0) {
                searchInput.text(words[index].slice(0, i));
                i--;
            } else {
                clearInterval(eraseEffectInterval);
                currentIndex = (currentIndex + 1) % words.length;
                setTimeout(function () {
                    typeWord(currentIndex);
                }, 1000);
            }
        }, 100);
    }

    typeWord(currentIndex);
    $(document).mousemove(function(e) {
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        var mouseX = e.clientX;
        var mouseY = e.clientY;

        var depth1 = (50 - (mouseX - w) * parallaxPower) + "% " + (50 - (mouseY - h) * parallaxPower) + "%";
        var depth2 = (50 - (mouseX - w) * (2 * parallaxPower)) + "% " + (50 - (mouseY - h) * (3 * parallaxPower)) + "%";
        var depth3 = (50 - (mouseX - w) * (6 * parallaxPower)) + "% " + (50 - (mouseY - h) * (6 * parallaxPower)) + "%";
        var depth4 = (50 - (mouseX - w) * (10 * parallaxPower)) + "% " + (50 - (mouseY - h) * (10 * parallaxPower)) + "%";

        var x = depth4 + ", " + depth3 + ", " + depth2 + ", " + depth1;
        $("#parallax").css("background-position", x);
    });

    darkModeSwitch.change(function () {
        if (darkModeSwitch.is(':checked')) {
            $('body').addClass('dark-mode');
            parallax.css('background-image', 'url(./img/background3.png), url(./img/background2.png), url(./img/background1N.png), url(./img/backgroundN.png)');
        } else {
            $('body').removeClass('dark-mode');
            parallax.css('background-image', 'url(./img/background3.png), url(./img/background2.png), url(./img/background1D.png), url(./img/backgroundD.png)');
        }
    });

    $('.accordion-title').click(function() {
        var parent = $(this).parent();
        $(".accordion-section").each(function() {
            if ($(this).is(parent)) {
                $(this).addClass('active');
                parent.find('.accordion-content').slideDown();
            } else {
                $(this).removeClass('active');
                $(this).find('.accordion-content').slideUp();
            }
        });
    });
    $('.accordion-active').slideDown();

    const sections = $(".accordion-section");
    const loaderBars = $(".loader-bar");
    let currentIndexAccordion = 0;
    const animationDuration = 10000; // 5 seconds

    function openSection(index) {
      sections.eq(index).find(".accordion-title").trigger("click");
      sections.eq(index).addClass("active");
      sections.eq(index).find(".accordion-content").slideDown();
      $(".section-loader").each(function () {
        $(this).addClass("hide");
      });
      sections.eq(index).find(".section-loader").removeClass("hide");
    }

    function closeSection(index) {
      sections.eq(index).removeClass("active");
      sections.eq(index).find(".accordion-content").slideUp();
    }

    function resetAllLoader() {
      loaderBars.each(function () {
        $(this).stop().css("width", "0%");
      });
    }

    function animateLoader(index) {
      resetAllLoader();
      loaderBars.eq(index).animate(
        { width: "100%" },
        animationDuration,
        "linear",
        function () {
          setTimeout(function () {
            closeSection(index);

            if (currentIndexAccordion === sections.length - 1) {
              // If it's the last section, reset to the first section
              currentIndexAccordion = 0;
            } else {
              currentIndexAccordion++;
            }

            openSection(currentIndexAccordion);
            loaderBars.eq(currentIndexAccordion).width(0);
            animateLoader(currentIndexAccordion);
          }, 1000); // Wait 1 second before opening the next section
        }
      );
    }

    sections.on("click", function () {
      const clickedIndex = sections.index(this);

      if (clickedIndex === currentIndexAccordion) {
        // Clicked on the current section, do nothing
        return;
      }
      if (clickedIndex < currentIndexAccordion) {
        // Clicked on a previous section, close the current section and open the clicked section
        closeSection(currentIndexAccordion);
        openSection(clickedIndex);
        currentIndexAccordion = clickedIndex;
      } else {
        // Clicked on a future section, do nothing
      }

      animateLoader(currentIndexAccordion);
    });

    openSection(currentIndexAccordion);
    animateLoader(currentIndexAccordion);
});
