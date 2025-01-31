class Carousel {
    constructor(element) {
        const thisCarousel = this;
        thisCarousel.dom = {};
        thisCarousel.dom.wrapper = element;

        if (!thisCarousel.dom.wrapper) {
            console.error(" Error: `.carousel-track` element not found!");
            return;
        }

        thisCarousel.data = [
            {
                img: "images/home/pizza-1.jpg",
                title: "DELICIOUS PIZZA!",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                author: "Ryszard Ochucki"
            },
            {
                img: "images/home/pizza-4.jpg",
                title: "GREAT ATMOSPHERE!",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                author: "John Wick"
            },
            {
                img: "images/home/pizza-3.jpg",
                title: "AMAZING SERVICE!",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                author: "Adrian Duda"
            }
        ];

        thisCarousel.renderSlides();
        thisCarousel.initPlugin();
    }

    renderSlides() {
        const thisCarousel = this;
        const track = document.createElement("div");
        track.classList.add("carousel-track");

        thisCarousel.data.forEach(item => {
            const slide = document.createElement("div");
            slide.classList.add("carousel-slide");

            slide.innerHTML = `
            <div class="carousel-content">
                <div class="carousel-image">
                    <img src="${item.img}" alt="Slider Image">
                </div>
                <div class="carousel-text">
                <h3 class="carousel-heading">${item.title}</h3>
                    <p>"${item.text}"</p>
                    <span>- ${item.author}</span>
                </div>
            </div>
            `;
            track.appendChild(slide);
        });

        thisCarousel.dom.wrapper.innerHTML = "";
        thisCarousel.dom.wrapper.appendChild(track);
    }

    initPlugin() {
        const thisCarousel = this;

        if (thisCarousel.dom.wrapper.querySelectorAll('.carousel-slide').length === 0) {
            setTimeout(() => this.initPlugin(), 100);
            return;
        }

        thisCarousel.slider = window.tns({
            container: thisCarousel.dom.wrapper.querySelector('.carousel-track'),
            items: 1,
            slideBy: "page",
            autoplay: true,
            autoplayTimeout: 3000,
            controls: false,
            nav: true,
            speed: 500,
            mouseDrag: true,
            loop: true,
            autoplayButtonOutput: false,
            navPosition: 'bottom',
        });

        setTimeout(() => {
            const nav = document.querySelector('.tns-nav');
            if (nav) {
                const sliderWrapper = document.querySelector('.carousel');
                sliderWrapper.appendChild(nav);
            }
        }, 1000);
    }
}

export default Carousel;
