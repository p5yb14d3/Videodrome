$(document).ready(function() {
	var audio_back = document.getElementsByTagName("audio")[1];
	// STOP CONTEXTMENU
	document.oncontextmenu = function() {
		return false;
	};
	// BIND VIDEO RIGHT CLICK
	$('video').bind('contextmenu',function() { 
		audio_back.play();
		event.preventDefault();
		return false; 
	});
	// BIND DOCUMENT RIGHT CLICK
	$(document).mousedown(function(e) { 
		if (e.button == 2) {
			cue_history_back = true;
			event.preventDefault();
			return false; 
		}
		return true; 
	}); 


	// GET AND PROCESS PARAM
	var v = getURLParameter('v');
	if (v !== undefined) {
		$('video').attr('src', v);
		$('video').focus();

		$('video')[0].addEventListener('error', function(event) { $('#video_error').show(); }, true);
		$('video').last().on('error', function() {
			$('#error').text("VIDEO ERROR");
			$('#error').show();
		});
	}
});

$(window).keydown(function(e){
	if (e.which === 27) { // ESC
		var audio = document.getElementsByTagName("audio")[1];
		audio.play();
	}
});

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
	

	
/*
timerID = setInterval(checkIfVideoIsPlaying, 100);

function checkIfVideoIsPlaying()
{
  if  (!($("#video").get(0).paused)) {
	console.log("playing...");
	$("#loading").hide();
	clearInterval(timerID);
  }
  else {
	console.log("paused...");
  }
}
*/


