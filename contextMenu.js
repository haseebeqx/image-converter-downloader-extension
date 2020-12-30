const DOWNLOAD_IMAGE = "icde-context-download-image";
const DOWNLOAD_JPEG = "icde-context-jpeg";
const DOWNLOAD_PNG = "icde-context-png";
const COPY_DATA_URL = "icde-context-data_urls";
const COPY_DATA_URL_PNG = "icde-context-data_urls-png";
const COPY_DATA_URL_JPEG = "icde-context-data_urls-jpeg";
const FAVICON = "icde-context-favicon";
const FAVICON_JPEG = "icde-context-favicon-download-jpeg";
const FAVICON_PNG = "icde-context-favicon-download-png";
const VISIBLE_PAGE = "icde-contxet-visible-page";
const VISIBLE_PAGE_PNG = "icde-contxet-visible-page-png";
const VISIBLE_PAGE_JPEG = "icde-context=visible-page-jpeg";

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

function getFileName(srcUrl, extension){
  const fileName = srcUrl.split("/").pop().split("#")[0].split("?")[0];

  if(!fileName || fileName.length > 60){
    return `capture.${extension}`
  }
  return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`
}

function captureVisiblePage(menuId){
  const format = menuId === VISIBLE_PAGE_PNG ? "png" : "jpeg";
  chrome.tabs.captureVisibleTab({format},function(data){
    chrome.downloads.download({url: data, filename: `capture.${format}`});
  })
}

function onClickHandler(info, tab) {
  if(info.menuItemId === VISIBLE_PAGE_PNG || info.menuItemId === VISIBLE_PAGE_JPEG){
    return captureVisiblePage(info.menuItemId)
  }

  let image = new Image();
  let srcUrl = "";
  image.crossOrigin = "Anonymous";
  image.onload = function (e) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);

    switch (info.menuItemId) {
      case COPY_DATA_URL_JPEG:
        copyImageDataURL(canvas, "image/jpeg");
        break;
      case COPY_DATA_URL_PNG:
        copyImageDataURL(canvas, "image/png");
        break;
      case DOWNLOAD_JPEG:
      case FAVICON_JPEG:
        downloadImage(
          canvas,
          "image/jpeg",
          getFileName(srcUrl, 'jpeg')
        );
        break;
      case DOWNLOAD_PNG:
      case FAVICON_PNG:
        downloadImage(
          canvas,
          "image/png",
          getFileName(srcUrl, 'png')
        );
        break;
    }
  };
  if (info.menuItemId === FAVICON_JPEG || info.menuItemId === FAVICON_PNG) {
    srcUrl = tab.favIconUrl;
    
  } else {
    srcUrl = info.srcUrl;
  }
  image.src = srcUrl;
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

  chrome.contextMenus.create({
    title: "Favicon",
    contexts: ["all"],
    id: FAVICON,
  });

  chrome.contextMenus.create({
    title: "download as PNG",
    contexts: ["all"],
    parentId: FAVICON,
    id: FAVICON_PNG,
  });

  chrome.contextMenus.create({
    title: "download as JPEG",
    contexts: ["all"],
    parentId: FAVICON,
    id: FAVICON_JPEG,
  });

  chrome.contextMenus.create({
    title: 'Take Screenshot',
    contexts: ["all"],
    id: VISIBLE_PAGE
  });

  chrome.contextMenus.create({
    title: "download as JPEG",
    contexts: ["all"],
    parentId: VISIBLE_PAGE,
    id: VISIBLE_PAGE_JPEG,
  });

  chrome.contextMenus.create({
    title: "download as PNG",
    contexts: ["all"],
    parentId: VISIBLE_PAGE,
    id: VISIBLE_PAGE_PNG,
  });
});
