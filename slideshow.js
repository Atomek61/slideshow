// Slideshow 1.0 (c) 2022 Jan Schirrmacher
// Feel free using and copying this library. You must not
// claim it as your work - preserve my copyright.
//
// Slideshow is a simple photo viewer with inspiration from
// an example on w3schools.org.
//
// Usage: place a div in your html, give it an id and create
// a Slideshow object. You can (A) either let the Slideshow object
// let create the contents of your div or your can (B) fill it 
// with your own images.
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
//   Create a Slideshow instance and initilize it with
//   the Id of your div and a list of images with url and title.
//   let slideshow = new Slideshow("myslideshowid", [img1.jpg, "Image 1", img2.jpg, "Image 2"]);
//
// Revision History 
// V1.00 JS 2022-10-22

// helper to enable % for negative numbers
function mod(n, m) {
  return ((n % m) + m) % m;
}

// HTML templates, needed in the case of creating the DOM automatically
const SLIDESHOWTEMPLATE
  = '<div class="title"></div>\r\n'
  + '<div class="images">\r\n'
  + '%IMAGES'
  + '<a class="prev" onclick="this.slideshow.nextImage(-1)">&#10094;</a>\r\n'
  + '<a class="next" onclick="this.slideshow.nextImage(1)">&#10095;</a>\r\n'
  + '</div>\r\n'
  + '<div class="bullets">\r\n'
  + '%BULLETS'
  + '</div>\r\n';

const IMGTEMPLATE = '<img class="fade" src="%URL" data-title="%TITLE"/>\r\n';

const BULLETTEMPLATE  = '<span class="bullet" onclick="this.slideshow.showImage(%INDEX)"></span>\r\n';

// Main class - instantiate for a slide show
class Slideshow {

// containerId is the Id of a div or body
// imageList is an optional string array [url1, title1, url2, title2, .... ] with pairs url/title
// if slide show operates on an emtpy container tag, create such a list.
  constructor(containerId, imagelist = null) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.cinemaInterval = 4000;
    this.isCinema = false;
    this.cinemaIntervalId = -1;
    this.currentIndex = -1;
    this.container.classList.add("slideshow");
    if (imagelist) {
      this.container.innerHTML = ""; 
      let imageshtml = "";
      this.currentIndex = -1;
      this.imageCount = imagelist.length/2;          
      for (let i=0; i<this.imageCount; i++)
        imageshtml += IMGTEMPLATE.replace(/%URL/g, imagelist[i*2]).replace(/%TITLE/g, imagelist[i*2+1]);
      let bulletshtml = "";
      for (let i=0; i<this.imageCount; i++)
        bulletshtml += BULLETTEMPLATE.replace(/%INDEX/g, (i).toString());
      this.container.innerHTML = SLIDESHOWTEMPLATE
        .replace(/%ID/g, this.containerId)
        .replace(/%IMAGES/g, imageshtml)
        .replace(/%BULLETS/g, bulletshtml);
    }  
    let bullets = this.container.getElementsByClassName("bullet");
    for (let i=0; i<bullets.length; i++)
      bullets[i].slideshow = this;
    let images = this.container.getElementsByTagName("img");
    this.imageCount = images.length;
    let btn = this.container.querySelector(".next");
    if (btn)
      btn.slideshow = this;
    btn = this.container.querySelector(".prev");
    if (btn)
      btn.slideshow = this;
    this.showImage(0);
  }

// show a certain image by index
  showImage(index) {
    index = mod(index, this.imageCount);
    if (index!=this.currentIndex) {
      let images = this.container.getElementsByTagName("img");
      let bullets = this.container.getElementsByClassName("bullet");
      if (this.currentIndex!=-1) {
        images[this.currentIndex].style.display = "none";
        bullets[this.currentIndex].classList.remove("activeBullet");
      }              
      this.currentIndex = index;
      let title = this.container.querySelector(".title");
      title.innerHTML = images[this.currentIndex].dataset.title;
      images[this.currentIndex].style.display = "block";
      bullets[this.currentIndex].classList.add("activeBullet");
    }
  }

// for prev and next buttons
  nextImage(offset) {
    this.showImage(this.currentIndex + offset);
  }

  start() {
    if (!this.isCinema) {
      this.cinemaIntervalId = setInterval(() => {
        this.nextImage(1);
      }, this.cinemaInterval);
      this.isCinema = true;
    }
  }

  stop() {
    if (this.isCinema) {
      clearInterval(this.cinemaIntervalId);
      this.isCinema = false;
    }
  }

}
