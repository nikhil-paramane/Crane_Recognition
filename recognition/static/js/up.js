

$(document).ready(function () {
	document.getElementById('load').style.display="none";
	var dropContainer = document.getElementById('dropzone');
	console.log(dropContainer);
	dropContainer.ondragover = function(){
		console.log("DropOver...");
		this.ClassName = 'dropzone dragover';
		return false;
	};
	dropContainer.ondragleave = function(){
		this.ClassName = 'dropzone';
		return false; 
	}  
	dropContainer.ondrop = function(e){
		console.log("In dropContainer.ondrop");
		e.preventDefault();
		this.ClassName = 'dropzone';
    	loadImg(e.dataTransfer.files[0]);
   	    document.getElementById('lblupl').style.visibility='hidden';
        document.getElementById('input_img_url').style.visibility='hidden';
        document.getElementById('upbtn').style.visibility='visible';
        document.getElementById('goBackbtn').style.visibility='visible';
	}
	$("#imgupload").change(function(){
		console.log("in browse button");
    loadImg($("#imgupload").prop("files")[0]);
    document.getElementById('lblupl').style.visibility='hidden';
    document.getElementById('dropzone').style.visibility='hidden';
    document.getElementById('input_img_url').style.visibility='hidden';
    document.getElementById('upbtn').style.visibility='visible';
    document.getElementById('goBackbtn').style.visibility='visible';
  });
	hideothers = function(element){

	}
	document.getElementById('upbtn').addEventListener('click', function(){
		document.querySelector('.bg-modal').style.display='flex';
		dismissible: false,
      $.ajax({
        type: "POST",
        url: '/recognize_image/recognize/api/',
        data: {
          'image64': $('#image-cont').attr('src')
        },
        dataType: 'text',
        success: function(data) {
          loadStats(data)
        }
      }).always(function() {
        document.querySelector('.bg-modal').style.display='none';
      });
	});

	var urldiv = document.getElementById('ipurl');
	urldiv.addEventListener("change", e=>{
		console.log("in url change");
		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.onload = function (a) {
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0);

		var dataURI = canvas.toDataURL("image/jpg");
		  
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return callback(new Blob([ia], { type: mimeString }));
	  }
	  var myimage = document.getElementById('image-cont');
	  myimage.src = urldiv.value;
	  img.src = urldiv.value;

	    document.getElementById('lblupl').style.visibility='hidden';
	    document.getElementById('dropzone').style.visibility='hidden';
	    document.getElementById('input_img_url').style.visibility='hidden';
	    document.getElementById('upbtn').style.visibility='visible';
	    document.getElementById('goBackbtn').style.visibility='visible';
	})
	});
	/*function getImageFormUrl(url, callback) {
  		var img = new Image();
  		img.setAttribute('crossOrigin', 'anonymous');
	  	img.onload = function (a) {
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0);

		var dataURI = canvas.toDataURL("image/jpg");
		  
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return callback(new Blob([ia], { type: mimeString }));
	  }
	  var myimage = document.getElementById('image-cont');
	  myimage.src = url;
	  img.src = url;
	}
});*/

loadImg = function(file) {
	console.log("In load func");
  var reader = new FileReader();
  reader.onload = function(e){
    $('#image-cont').attr('src', e.target.result);
  }
  reader.readAsDataURL(file);
}

loadStats = function(jsonData) {
  var data = JSON.parse(jsonData);
  var maxper=0;
  var tcat = '';
  if (data["success"] == true) {
    for (category in data['confidence']) {
      var percent = Math.round(parseFloat(data["confidence"][category]) * 100);
      if(percent>maxper)
      {
      	maxper = percent;
      	tcat = category;
      }

    document.getElementById('upbtn').style.visibility='hidden	';
    document.getElementById('lblupl').style.visibility='hidden';
    document.getElementById('dropzone').style.visibility='hidden';
    document.getElementById('input_img_url').style.visibility='hidden';
    document.getElementById('image-cont').style.visibility='hidden';
    }
  }
  console.log("cat: "+tcat+" "+maxper);
        var markup = `
      	<h2 class="result">Here is what we think...</h2>
		<div class="success">
       		<p style="float: right;">  Confidence    </p>
			<span class="capitalize">` + tcat + `</span>
          		<p class="per" style="float: right;"><b>` + maxper + `%</b></p>
          	<div class="progress">
            <div class="determinate" style="width: ` + maxper + `%;"></div>
        </div>
        </div>`;
      $("#stat-table").append(markup);
}
