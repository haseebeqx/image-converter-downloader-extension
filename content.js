
let clickedEl = null;

document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
}, true);

chrome.runtime.onMessage.addListener(function (request, sender) {
  let image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.widht = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    image.crossOrigin = 'Anonymous';
    context.drawImage(image, 0, 0, image.width, image.height);
    console.log(canvas.toDataURL());
  };
  image.src = request.srcUrl;
});
