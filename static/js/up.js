$(document).ready(function () {
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
});

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
  if (data["success"] == true) {
    for (category in data['confidence']) {
      var percent = Math.round(parseFloat(data["confidence"][category]) * 100);
      var markup = `
      <div class="card">
        <div class="card-content black-text stat-card">
          <span class="card-title capitalize">` + category + `</span>
          <p style="float: left;">Confidence</p>
          <p style="float: right;"><b>` + percent + `%</b></p>
          <div class="progress">
            <div class="determinate" style="width: ` + percent + `%;"></div>
          </div>
        </div>
      </div>`;
      $("#stat-table").append(markup);
    }
  }
}
