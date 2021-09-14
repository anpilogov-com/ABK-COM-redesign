let isMobile = {
   Android: () => {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: () => {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: () => {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: () => {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: () => {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: () => {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows()
      );
   },
};

let body = document.querySelector("body");

let burger = document.querySelector(".header__burger");

burger.addEventListener("click", () => {
   document.querySelector(".header__burger").classList.toggle("active");
   document.querySelector(".header__menu").classList.toggle("active");
   document.querySelector(".header__top").classList.toggle("active");
   document.querySelector(".header__bottom").classList.toggle("active");
   document.querySelector(".container").classList.toggle("active");
   document.querySelector(".header").classList.toggle("active");
});

if (isMobile.any()) {
   body.classList.add("touch");

   let arrow = document.querySelectorAll(".arrow");

   for (let index = 0; index < arrow.length; index++) {
      let thisLink = arrow[index].previousElementSibling;
      let subMenu = arrow[index].nextElementSibling;
      let thisArrow = arrow[index];

      arrow[index].addEventListener("click", () => {
         collapsed(index, arrow);
         subMenu.classList.toggle("open");
         thisArrow.classList.toggle("arrow-active");
      });

      thisLink.classList.add("parent");

      thisLink.addEventListener("click", () => {
         collapsed(index, arrow);
         subMenu.classList.toggle("open");
         thisArrow.classList.toggle("arrow-active");
      });

      burger.addEventListener("click", () => {
         if (!burger.classList.contains("active")) {
            collapsed(index, arrow);
         }
      });
   }
} else {
   body.classList.add("mouse");
}

function collapsed(index, arrow) {
   for (let i = 0; i < arrow.length; i++) {
      if (i != index) {
         arrow[i].nextElementSibling.classList.remove("open");
         arrow[i].classList.remove("arrow-active");
      }
   }
}
