const DOWNLOAD_IMAGE = "icde-context-download-image";
const DOWNLOAD_JPEG = "icde-context-jpeg";
const DOWNLOAD_PNG = "icde-context-png";
const COPY_DATA_URL = "icde-context-data_urls";
const COPY_DATA_URL_PNG = "icde-context-data_urls-png";
const COPY_DATA_URL_JPEG = "icde-context-data_urls-jpeg";

function copyImageDataURL(canvas, type) {
  let input = document.createElement("textarea");
  document.body.appendChild(input);
  input.value = canvas.toDataURL(type);
  input.focus();
  input.select();
  document.execCommand("Copy");
  input.remove();
}

function downloadImage(canvas, type, fileName) {
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url, filename: fileName });
  }, type);
}

function onClickHandler(info, tab) {
  let image = new Image();
  image.crossOrigin = "Anonymous";
  image.onload = function (e) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    const fileName = info.srcUrl.split("/").pop().split("#")[0].split("?")[0];

    switch (info.menuItemId) {
      case COPY_DATA_URL_JPEG:
        copyImageDataURL(canvas, "image/jpeg");
        break;
      case COPY_DATA_URL_PNG:
        copyImageDataURL(canvas, "image/png");
        break;
      case DOWNLOAD_JPEG:
        downloadImage(
          canvas,
          "image/jpeg",
          fileName.endsWith(".jpeg") ?  fileName: `${fileName}.jpeg`
        );
        break;
      case DOWNLOAD_PNG:
        downloadImage(
          canvas,
          "image/png",
          fileName.endsWith(".png") ?  fileName : `${fileName}.png`
        );
        break;
    }
  };
  image.src = info.srcUrl;
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Download Image",
    contexts: ["image"],
    id: DOWNLOAD_IMAGE,
  });

  chrome.contextMenus.create({
    title: "Download as JPEG",
    contexts: ["image"],
    parentId: DOWNLOAD_IMAGE,
    id: DOWNLOAD_JPEG,
  });

  chrome.contextMenus.create({
    title: "Download as PNG",
    contexts: ["image"],
    parentId: DOWNLOAD_IMAGE,
    id: DOWNLOAD_PNG,
  });

  chrome.contextMenus.create({
    title: "Data URLs",
    contexts: ["image"],
    id: COPY_DATA_URL,
  });

  chrome.contextMenus.create({
    title: "Copy PNG data url",
    contexts: ["image"],
    parentId: COPY_DATA_URL,
    id: COPY_DATA_URL_PNG,
  });

  chrome.contextMenus.create({
    title: "Copy JPEG data-url",
    contexts: ["image"],
    parentId: COPY_DATA_URL,
    id: COPY_DATA_URL_JPEG,
  });
});
