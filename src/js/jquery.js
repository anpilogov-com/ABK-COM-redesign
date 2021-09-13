jQuery(() => {
   $(".header__burger").on("click", () => {
      $(
         ".header__burger, .header__menu, .header__top,  .header__bottom, .container, .header"
      ).toggleClass("active");
   });
});
