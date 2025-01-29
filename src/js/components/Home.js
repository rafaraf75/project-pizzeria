import { templates } from '../settings.js';




class Home {
  constructor(wrapper) {
    const thisHome = this;
    thisHome.render(wrapper);
    thisHome.initActions();
    thisHome.initCarousel();
  }

  render(wrapper) {
    const thisHome = this;
    const generatedHTML = templates.homeWidget();
    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.orderBox = thisHome.dom.wrapper.querySelector('.home-box--order');
    thisHome.dom.bookingBox = thisHome.dom.wrapper.querySelector('.home-box--booking');
    thisHome.dom.carousel = thisHome.dom.wrapper.querySelector('.carousel-track');
    thisHome.dom.gallery = thisHome.dom.wrapper.querySelector('.gallery-wrapper');

    //thisHome.dom.orderBox.style.backgroundImage = "url('images/home/pizza-1.jpg')";
    //thisHome.dom.bookingBox.style.backgroundImage = "url('images/home/pizza-2.jpg')";
    thisHome.renderCarousel();
    thisHome.renderGallery();
  }

  initActions() {
    const thisHome = this;
    thisHome.dom.orderBox.addEventListener('click', () => {
      window.location.hash = '#order';
    });

    thisHome.dom.bookingBox.addEventListener('click', () => {
      window.location.hash = '#booking';
    });
  }
  renderCarousel() {
    const thisHome = this;

    const sliderContent = [
      { text: "Best pizza in town!", author: "Anna" },
      { text: "Amazing experience!", author: "John" },
      { text: "We love Mamma Mia!", author: "Emily" },
    ];

    sliderContent.forEach(item => {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      slide.innerHTML = `<p>"${item.text}" - ${item.author}</p>`;
      thisHome.dom.carousel.appendChild(slide);
    });
  }

  renderGallery() {
    const thisHome = this;

    const galleryImages = [
      'images/home/pizza-1.jpg',
      'images/home/pizza-2.jpg',
      'images/home/pizza-3.jpg',
      'images/home/pizza-4.jpg',
      'images/home/pizza-5.jpg',
      'images/home/pizza-6.jpg',
    ];

    galleryImages.forEach(src => {
      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('gallery-item');

      const img = document.createElement('img');
      img.src = src;
      img.alt = "Gallery image";

      imgWrapper.appendChild(img);
      thisHome.dom.gallery.appendChild(imgWrapper);
    });
  }
  initCarousel() {
    const thisHome = this;


    if (!thisHome.dom.carousel) {
      console.error(" Błąd: Nie znaleziono elementu `.carousel-track`!");
      return;
    }
    const Flickity = window.Flickity;
    thisHome.flickity = new Flickity(thisHome.dom.carousel, {
      cellAlign: 'left',
      contain: true,
      autoPlay: 3000,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: true,
    });
    console.log("🎉 Flickity działa!");
  }

}

export default Home;
