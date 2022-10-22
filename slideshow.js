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
//   Create a Slideshow instance and initilize it with
//   the Id of your div and a list of pictures with url and title.
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
  + '<div class="pictures">\r\n'
  + '%IMAGES'
  + '<span class="prev symbol"></span>\r\n'
  + '<span class="next symbol"></span>\r\n'
  + '</div>\r\n'
  + '<div class="bullets">\r\n'
  + '%BULLETS'
  + '<span class="startstop symbol"></span>\r\n'
  + '</div>\r\n';

const IMGTEMPLATE = '<img class="picture" src="%URL" data-title="%TITLE"/>\r\n';

const BULLETTEMPLATE  = '<span class="bullet symbol"></span>\r\n';

// Main class - instantiate for a slide show
class Slideshow {

// containerId is the Id of a div or body
// pictureList is an optional string array [url1, title1, url2, title2, .... ] with pairs url/title
// if slide show operates on an emtpy container tag, create such a list.
  constructor(containerId, picturelist = null) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.cinemaInterval = 4000;
    this.isCinema = false;
    this.cinemaIntervalId = -1;
    this.currentIndex = -1;
    this.container.classList.add("slideshow");
    if (picturelist) {
      this.container.innerHTML = ""; 
      let pictureshtml = "";
      this.currentIndex = -1;
      this.pictureCount = picturelist.length/2;          
      for (let i=0; i<this.pictureCount; i++)
        pictureshtml += IMGTEMPLATE.replace(/%URL/g, picturelist[i*2]).replace(/%TITLE/g, picturelist[i*2+1]);
      let bulletshtml = "";
      for (let i=0; i<this.pictureCount; i++)
        bulletshtml += BULLETTEMPLATE.replace(/%INDEX/g, (i).toString());
      this.container.innerHTML = SLIDESHOWTEMPLATE
        .replace(/%ID/g, this.containerId)
        .replace(/%IMAGES/g, pictureshtml)
        .replace(/%BULLETS/g, bulletshtml);
    }  
    
    let bullets = this.container.getElementsByClassName("bullet");
    for (let i=0; i<bullets.length; i++) {
      bullets[i].slideshow = this;
      bullets[i].addEventListener("click", (event) => {
        this.stop();
        this.showPicture(i);
      });
    }
    
    let startstopButton = this.container.getElementsByClassName("startstop");
    startstopButton[0].addEventListener('click', (event)=>{
      if (this.isCinema)
        this.stop();
      else
        this.start(true);
    });
    
    let pictures = this.container.getElementsByClassName("picture");
    this.pictureCount = pictures.length;

    let btn = this.container.querySelector(".next");
    if (btn) btn.addEventListener("click", (event)=>{
      this.stop();
      this.nextPicture(1);
    });

    btn = this.container.querySelector(".prev");
    if (btn) btn.addEventListener("click", (event)=>{
      this.stop();
      this.nextPicture(-1);
    });
    this.showPicture(0);
  }

  // show a certain picture by index
  showPicture(index) {
    index = mod(index, this.pictureCount);
    if (index!=this.currentIndex) {
      let pictures = this.container.getElementsByTagName("img");
      let bullets = this.container.getElementsByClassName("bullet");
      if (this.currentIndex!=-1) {
        pictures[this.currentIndex].style.display = "none";
        bullets[this.currentIndex].style.backgroundImage = 'url("bulletoff.svg")';
      }              
      this.currentIndex = index;
      let title = this.container.querySelector(".title");
      title.innerHTML = pictures[this.currentIndex].dataset.title;
      pictures[this.currentIndex].style.display = "block";
      bullets[this.currentIndex].style.backgroundImage = 'url("bulleton.svg")';
    }
  }

  // for prev and next buttons
  nextPicture(offset) {
    this.showPicture(this.currentIndex + offset);
  }

  start(immediate = false) {
    if (!this.isCinema) {
      this.cinemaIntervalId = setInterval(() => {
        this.nextPicture(1);
      }, this.cinemaInterval);
      let startstopButtons = this.container.getElementsByClassName("startstop");
      if (startstopButtons.length>0)
        startstopButtons[0].style.backgroundImage = 'url("stop.svg")';
      if (immediate)
        this.nextPicture(1);
      this.isCinema = true;
    }
  }

  stop() {
    if (this.isCinema) {
      clearInterval(this.cinemaIntervalId);
      let startstopButtons = this.container.getElementsByClassName("startstop");
      if (startstopButtons.length>0)
        startstopButtons[0].style.backgroundImage = 'url("start.svg")';
      this.isCinema = false;
    }
  }

}
