// Slideshow 1.10 (c) 2022 Jan Schirrmacher
// Feel free using and copying this library. You must not
// claim it as your work - preserve my copyright.
//
// Slideshow is a simple photo viewer with inspiration from
// an example on w3schools.org.
//
// Usage: place a div in your html, give it an id and create
// a Slideshow object. You can (A) either let the Slideshow object
// let create the contents of your div or your can (B) fill it 
// with your own pictures.
//
// Insert these lines in your <head>:
//
//   <link rel="stylesheet" href="mypath/slideshow.css"/>
//   <script src="mypath/slideshow.js"></script>
//
// Example A - let slideshow nearly everything for you:
//   
//   Insert a div section in your <body> like
//   <div id="myslideshowid"></div>
//
//   Create a Slideshow instance and initialize it with
//   the Id of your div and a list of pictures with url and title.
//   let slideshow = new Slideshow("myslideshowid", [img1.jpg, "Image 1", img2.jpg, "Image 2"]);
//
// Revision History 
// V1.00 JS 2022-10-22 Initial release
// V1.10 JS 2022-10-23 Added cinema mode, renamed image to picture
// V1.20 JS 2022-10-28 Added autoStop, more properties instead of methods, css improvements, fullscreen-support

// helper to enable % for negative numbers
function mod(n, m) {
  return ((n % m) + m) % m;
}

// HTML templates, needed in the case of creating the DOM automatically
const SLIDESHOWTEMPLATE
  = '<div class="title"></div>\r\n'
  + '<div class="pictures">\r\n'
  + '  %IMAGES'
  + '</div>\r\n'
  + '<span class="prev symbol"></span>\r\n'
  + '<span class="next symbol"></span>\r\n'
  + '<div class="bullets">\r\n'
  + '  %BULLETS'+'<span class="cinema symbol"></span>\r\n'
  + '</div>\r\n';

const IMGTEMPLATE = '<img class="picture" src="%URL" data-title="%TITLE"/>\r\n';

const BULLETTEMPLATE  = '<span class="bullet symbol"></span>\r\n';

const DEFAULTCINEMAINTERVAL = 4000;
const MINCINEMAINTERVAL = 100;

// Main class - instantiate for a slide show
class Slideshow {

// container is the is the element (block) which receives the slideshow.
// pictureList is an optional string array [url1, title1, url2, title2, .... ] with pairs url/title
// if there is no pictureList, slideshow assumes img tags with data-title.
  constructor(container, picturelist = null) {
    this.container = container;
    this.imageIndex_ = -1;
    this.cinemaInterval_ = DEFAULTCINEMAINTERVAL;
    this.cinemaTimerId = -1;
    this.isCinema = false;
    this.autoStop = true;
    this.container.classList.add("container");
    if (picturelist) {
      this.container.innerHTML = ""; 
      let pictureshtml = "";
      this.pictureCount = picturelist.length/2;          
      for (let i=0; i<this.pictureCount; i++)
        pictureshtml += IMGTEMPLATE.replace(/%URL/g, picturelist[i*2]).replace(/%TITLE/g, picturelist[i*2+1]);
      let bulletshtml = "";
      for (let i=0; i<this.pictureCount; i++)
        bulletshtml += BULLETTEMPLATE.replace(/%INDEX/g, (i).toString());
      this.container.innerHTML = SLIDESHOWTEMPLATE
        .replace(/%IMAGES/g, pictureshtml)
        .replace(/%BULLETS/g, bulletshtml);
    }  
    
    let bullets = this.container.getElementsByClassName("bullet");
    for (let i=0; i<bullets.length; i++) {
      bullets[i].slideshow = this;
      bullets[i].addEventListener("click", (event) => {
        if (this.autoStop) this.stop();
        this.imageIndex = i;
      });
    }
    
    let cinemaButton = this.container.getElementsByClassName("cinema");
    cinemaButton[0].addEventListener('click', (event)=>{
      if (this.isCinema)
        this.stop();
      else
        this.start(true);
    });
    
    let pictures = this.container.getElementsByClassName("picture");
    this.pictureCount = pictures.length;

    let btn = this.container.querySelector(".next");
    if (btn) btn.addEventListener("click", (event)=>{
      if (this.autoStop) this.stop();
      this.imageIndex += 1;
    });

    btn = this.container.querySelector(".prev");
    if (btn) btn.addEventListener("click", (event)=>{
      if (this.autoStop) this.stop();
      this.imageIndex -= 1;
    });
    this.imageIndex = 0;
  }

  get imageIndex() {
    return this.imageIndex_;
  }

  set imageIndex(value) {
    value = mod(value, this.pictureCount);
    if (value!=this.imageIndex_) {
      let pictures = this.container.getElementsByTagName("img");
      let bullets = this.container.getElementsByClassName("bullet");
      if (this.imageIndex_!=-1) {
        pictures[this.imageIndex_].style.display = "none";
        bullets[this.imageIndex_].classList.remove("bullet-active");
      }              
      this.imageIndex_ = value;
      let title = this.container.querySelector(".title");
      title.innerHTML = pictures[this.imageIndex_].dataset.title;
      pictures[this.imageIndex_].style.display = "block";
      bullets[this.imageIndex_].classList.add("bullet-active");
    }
  }

  get cinemaInterval() {
    return this.cinemaInterval_;
  }

  set cinemaInterval(value) {
    if (value!=this.cinemaInterval_) {
      if (value<MINCINEMAINTERVAL) value=MINCINEMAINTERVAL;
      this.cinemaInterval_ = value;
      if (this.isCinema) {
        this.stop();
        this.start();
      }
    }
  }

  start(immediate = false) {
    if (!this.isCinema) {
      this.cinemaTimerId = setInterval(() => {
        this.imageIndex += 1;
      }, this.cinemaInterval_);
      let cinemaButtons = this.container.getElementsByClassName("cinema");
      if (cinemaButtons.length>0)
        cinemaButtons[0].classList.add("cinema-playing");
      if (immediate)
        this.imageIndex = 1;
      this.isCinema = true;
    }
  }

  stop() {
    if (this.isCinema) {
      clearInterval(this.cinemaTimerId);
      let cinemaButtons = this.container.getElementsByClassName("cinema");
      if (cinemaButtons.length>0)
        cinemaButtons[0].classList.remove("cinema-playing");
      this.isCinema = false;
    }
  }

  speed(factor = 1.5) {
    this.cinemaInterval /= factor;
  }  

}
