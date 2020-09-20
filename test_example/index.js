//tf.ENV.set("WEBGL_PACK", false);
tf.setBackend('cpu');
console.log(tf.getBackend());

const CLASSES = {
0: 'drawings',
1: 'clipart',
2: 'photo' };


// model loader

let model;
async function loadModel() {
	tf.ENV.set("WEBGL_PACK", false);
	console.log("model loading..");
	loader = document.getElementById("progress-box");
	load_button = document.getElementById("load-button");
	loader.style.display = "block";
	model = undefined;
	model = await tf.loadLayersModel('https://juliiami.github.io/mobilenet/model.json');
	loader.style.display = "none";
	load_button.disabled = true;
	load_button.innerHTML = "Loaded Model";
	console.log("model loaded..");
}


// image loader

// put the paths to your images in imageURLs[]
var imageURLs=[];  
imageURLs.push("./test/2.png");
imageURLs.push("./test/3.png");
imageURLs.push("./test/9.png");
imageURLs.push("./test/10.png");
imageURLs.push("./test/amb-1.png");
imageURLs.push("./test/bottle.png");
imageURLs.push("./test/bottle-glass.png");
imageURLs.push("./test/cappoard.png");
imageURLs.push("./test/f.png");
imageURLs.push("./test/m.png");
imageURLs.push("./test/p.png");
imageURLs.push("./test/95.png");
imageURLs.push("./test/96.png");
imageURLs.push("./test/97.png");
imageURLs.push("./test/98.png");
imageURLs.push("./test/100.png");
imageURLs.push("./test/79.png");
imageURLs.push("./test/216.png");
imageURLs.push("./test/426.png");
imageURLs.push("./test/837.png");
imageURLs.push("./test/1056.png"); /*
//imageURLs.push("./test/2970.png");
imageURLs.push("./test/7261.png");
imageURLs.push("./test/12652.png");
//imageURLs.push("./test/13694.png");
imageURLs.push("./test/25379.png"); 
imageURLs.push("./test/49336.png"); 
imageURLs.push("./test/51114.png"); */

// the loaded images will be placed in imgs[]
var imgs=[];

var imagesOK=0;
loadAllImages();

async function loadAllImages(){
    for (var i=0; i<imageURLs.length; i++) {
		
        var img = new Image();
        imgs.push(img);
        img.onload = function(){ 
            imagesOK++; 
            //if (imagesOK>=imageURLs.length ) {
            //    callback();
            //}
        };
        img.onerror=function(){alert("image load failed");} 
        img.crossOrigin="anonymous";
        img.src = imageURLs[i];
    }     
	console.log(imgs);

}


async function start(){
	tf.ENV.set("WEBGL_PACK", false);
    // the imgs[] array now holds fully loaded images
    // the imgs[] are in the same order as imageURLs[]
	
	const preds = await Promise.all(imgs.map(pred));
	//for (var i=0; i<imgs.length; i++) {
	//	preds.push(pred(imgs[i]));
	//}
	console.log(preds)
	
	var table_data = [];
	var items = [];
	
	for (var i=0; i<imageURLs.length; i++) {
		table_data.push(" <span> " + imageURLs[i] + "\t" + preds[i] + "<br> </span>");
		items.push("<figure><img src='" + imageURLs[i] + "' alt='missing' width='130' height='100' class = 'img-responsive thumbnail'/>" +
		" <figcaption> " + preds[i] + " </figcaption> </figure>");
		
		/*items.push("<img src='" + imageURLs[i] + "' alt='missing' width='130' height='100' class = 'img-responsive thumbnail'/> " +"\n" + "<p> " + preds[i] + " </p>");*/
	}
	
	$('#table_data').append(table_data.join(' '));

	$('#items').append(items.join('\n'));
}

// preprocess and predict

function preprocessImage(image) {
	let tensor = tf.browser.fromPixels(image).toFloat();

	let offset = tf.scalar(127.5);
	return tensor.sub(offset)
			.div(offset)
			.resizeBilinear([224, 224])
			.expandDims();
}

async function pred(image) {
	console.log("model loading..");

	if (model == undefined) {
		alert("Please load the model first..")
	}
	console.log(model);
	//let image  = document.getElementById("test-image");
	let tensor = preprocessImage(image); 
	
	console.log(tensor.dataSync());
	//console.log(tf.browser.fromPixels(image).toFloat().expandDims().dataSync());
	
	let predictions = await model.predict(tensor).data();
	
	console.log(predictions);
	
	let results = Array.from(predictions)
		.map(function (p, i) {
			return {
				probability: p,
				className: CLASSES[i]
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 3);
		
	console.log(results);

	/*
	document.getElementById("predict-box").style.display = "block";
	document.getElementById("prediction").innerHTML = "Prediction <br><b>" + results[0].className + " " + results[0].probability.toFixed(6) + "</b>";
	*/
	
	//var ul = document.getElementById("predict-list");
	//ul.innerHTML = "";
	results.forEach(function (p) {
		console.log(p.className + " " + p.probability.toFixed(6));
		//var li = document.createElement("LI");
		//li.innerHTML = p.className + " " + p.probability.toFixed(6);
		//ul.appendChild(li);
	});
	
	return results[0].className + "\t" + results[0].probability.toFixed(4);
}
