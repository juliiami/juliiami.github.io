var classNames = [];
var model;

/*
load the class names 
*/
async function loadDict() {
  
    loc = 'model/class_names.txt'
    console.log(loc)
    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}

/*
load the class names
*/
function success(data) {
    const lst = data.split(/\n/)
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i]
        classNames[i] = symbol
    console.log(classNames)	    
    }
}
/*
get the the class names 
*/
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    console.log(outp)	
    return outp
}
/*
find predictions
*/
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show  scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}
/*
get indices of the top probs
*/
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}
function preprocess(img)
{
    const image = tf.browser.fromPixels(img).toFloat();

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = image.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, 224, 224, 3]);
    return batched

}
/*
get the prediction 
*/
function predict(imgData) {
        
        var class_names = ['NO_IDC','Contains_IDC']
        //get the prediction 
        var pred = model.predict(preprocess(imgData)).dataSync()
        console.log(pred)            
        //retreive the highest probability class label 
        const idx = tf.argMax(pred);

                
        //find the predictions 
        var indices = findIndicesOfMax(pred, 1)
        console.log(indices)
        var probs = findTopValues(pred, 1)
        var names = getClassNames(indices) 

        //set the table 
        //setTable(names, probs) 
        document.getElementById("Result").innerHTML = names
        //document.getElementById("Probability").innerHTML = probs
	console.log(names);
        console.log(document.getElementById("Result"));
    
  }

async function start(){
	//img = document.getElementById('image').files[0];
	
        
        model = await tf.loadModel('model/model.json')
        
        var status = document.getElementById('status')
      
        status.innerHTML = 'Model Loaded'
        
        //document.getElementById('status').innerHTML = 'Model Loaded';
      

        img = document.getElementById('list').firstElementChild.firstElementChild;
        //model.predict(tf.zeros([null,50,50,3]))
        
	//load the class names
        await loadDict()
        predict(img)
         
        }
   

					

					  
