//========================================================================
// Drag and drop image handling
//========================================================================

var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");

// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
  // prevent default behaviour
  e.preventDefault();
  e.stopPropagation();

  fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
  // handle file selecting
  var files = e.target.files || e.dataTransfer.files;
  fileDragHover(e);
  for (var i = 0, f; (f = files[i]); i++) {
    previewFile(f);
  }
}

//========================================================================
// Web page elements for functions to use
//========================================================================

var imagePreview = document.getElementById("image-preview");
var imageDisplay = document.getElementById("image-display");
var uploadCaption = document.getElementById("upload-caption");
var predResult = document.getElementById("pred-result2");
var loader = document.getElementById("loader");
var model = undefined;

//========================================================================
// Main button events
//========================================================================

tf.ENV.set("WEBGL_PACK", false);

async function initialize() {
    model = await tf.loadLayersModel('/model/model.json');
}

async function predict() {
  // action for the submit button
  if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
    window.alert("Please select an image before submit.");
    return;
  }
	let tensorImg = tf.browser.fromPixels(imagePreview)
	.resizeNearestNeighbor([224, 224])
	.toFloat();
	
	const offset = tf.scalar(127.5);
	// Normalize the image from [0, 255] to [-1, 1].
	const normalized = tensorImg.sub(offset)
      .div(offset)
	  //.resizeNearestNeighbor([224, 224])
      .expandDims();
	prediction = await model.predict(normalized).data();

	predResult.innerHTML = "drawings: " + prediction[0].toFixed(3) +";"+" clipart: " + prediction[1].toFixed(3) + ";" + " photo: " + prediction[2].toFixed(3);
	
  show(predResult)

}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  imageDisplay.src = "";
  predResult.innerHTML = "";

  hide(imagePreview);
  hide(imageDisplay);
  hide(loader);
  hide(predResult);
  show(uploadCaption);

  imageDisplay.classList.remove("loading");
}

function previewFile(file) {
  // show the preview of the image
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    hide(uploadCaption);

    // reset
    predResult.innerHTML = "";
    imageDisplay.classList.remove("loading");

    displayImage(reader.result, "image-display");
  };
}

//========================================================================
// Helper functions
//========================================================================

function displayImage(image, id) {
  // display image on given id <img> element
  let display = document.getElementById(id);
  display.src = image;
  show(display);
}

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

initialize();
