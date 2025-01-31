import { templates } from "../settings.js";
import Carousel from "./Carousel.js";
class Home {
  constructor(wrapper) {
    this.render(wrapper);
    this.initActions();
    this.initCarousel();
  }

  render(wrapper) {
    const generatedHTML = templates.homeWidget();
    this.dom = {};
    this.dom.wrapper = wrapper;
    this.dom.wrapper.innerHTML = generatedHTML;
    this.dom.orderBox = this.dom.wrapper.querySelector(".home-box--order");
    this.dom.bookingBox = this.dom.wrapper.querySelector(".home-box--booking");
    this.dom.carousel = this.dom.wrapper.querySelector(".carousel");
    this.dom.gallery = this.dom.wrapper.querySelector(".gallery-wrapper");

    this.renderGallery();
  }

  initActions() {
    const thisHome = this;
    thisHome.dom.orderBox.addEventListener("click", () => {
      window.location.hash = "#order";
    });

    thisHome.dom.bookingBox.addEventListener("click", () => {
      window.location.hash = "#booking";
    });
  }

  renderGallery() {
    const thisHome = this;

    const galleryImages = [
      "images/home/pizza-4.jpg",
      "images/home/pizza-5.jpg",
      "images/home/pizza-6.jpg",
      "images/home/pizza-7.jpg",
      "images/home/pizza-8.jpg",
      "images/home/pizza-9.jpg",
    ];

    galleryImages.forEach((src) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("gallery-item");

      const img = document.createElement("img");
      img.src = src;
      img.alt = "Gallery image";

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const likeIcon = document.createElement("i");
      likeIcon.classList.add("fas", "fa-heart", "like-icon");

      const shareIcon = document.createElement("i");
      shareIcon.classList.add("fas", "fa-share-alt", "share-icon");

      overlay.appendChild(likeIcon);
      overlay.appendChild(shareIcon);

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(overlay);
      thisHome.dom.gallery.appendChild(imgWrapper);
    });

    document.querySelectorAll(".like-icon").forEach((icon) => {
      icon.addEventListener("click", () => {
        icon.classList.toggle("liked");
      });
    });

    document.querySelectorAll(".share-icon").forEach((icon) => {
      icon.addEventListener("click", () => {
        alert("Udostępnianie zdjęcia...");
      });
    });
  }
  initCarousel() {
    if (this.dom.carousel) {
      new Carousel(this.dom.carousel);
    }
  }
}

export default Home;
