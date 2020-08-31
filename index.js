//tf.ENV.set("WEBGL_PACK", false);
//tf.setBackend('cpu');
console.log(tf.getBackend());

const CLASSES = {
0: 'drawings',
1: 'clipart',
2: 'photo' };

let model;
async function loadModel() {
	console.log("model loading..");
	loader = document.getElementById("progress-box");
	load_button = document.getElementById("load-button");
	loader.style.display = "block";
	model = undefined;
	model = await tf.loadLayersModel('./model1/model.json');
	loader.style.display = "none";
	load_button.disabled = true;
	load_button.innerHTML = "Loaded Model";
	console.log("model loaded..");
}

async function loadFile() {
	console.log("image is in loadfile..");
	document.getElementById("select-file-box").style.display = "table-cell";
  	document.getElementById("predict-box").style.display = "table-cell";
  	document.getElementById("prediction").innerHTML = "Click predict to find my label!";
  	var fileInputElement = document.getElementById("select-file-image");
  	console.log(fileInputElement.files[0]);
    renderImage(fileInputElement.files[0]);
}

function renderImage(file) {
  var reader = new FileReader();
  console.log("image is here..");
  reader.onload = function(event) {
    img_url = event.target.result;
    console.log("image is here2..");
    document.getElementById("test-image").src = img_url;
  }
  reader.readAsDataURL(file);
}


async function predButton() {
	console.log("model loading..");

	if (model == undefined) {
		alert("Please load the model first..")
	}
	if (document.getElementById("predict-box").style.display == "none") {
		alert("Please load an image using 'Upload Image' button..")
	}
	console.log(model);
	let image  = document.getElementById("test-image");
	let tensor = preprocessImage(image); 
	
	console.log(tensor.dataSync());
	//console.log(tf.browser.fromPixels(image).toFloat().expandDims().dataSync());

	
	let predictions = await model.predict(tensor).data();
	let results = Array.from(predictions)
		.map(function (p, i) {
			return {
				probability: p,
				className: CLASSES[i]
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 3);

	document.getElementById("predict-box").style.display = "block";
	document.getElementById("prediction").innerHTML = "Prediction <br><b>" + results[0].className + "</b>";

	var ul = document.getElementById("predict-list");
	ul.innerHTML = "";
	results.forEach(function (p) {
		console.log(p.className + " " + p.probability.toFixed(6));
		var li = document.createElement("LI");
		li.innerHTML = p.className + " " + p.probability.toFixed(6);
		ul.appendChild(li);
	});

}

function preprocessImage(image) {
	let tensor = tf.browser.fromPixels(image).toFloat();

	let offset = tf.scalar(127.5);
	return tensor.sub(offset)
			.div(offset)
			.resizeBilinear([224, 224])
			.expandDims();
}


