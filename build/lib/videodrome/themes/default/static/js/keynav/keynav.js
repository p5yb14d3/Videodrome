/*!
 * Keynav
 * http://github.com/p5yb14d3/keynav
 *
 * Copyright (c) 2018, p5yb14d3
 * Released under MIT license.
 * http://github.com/p5yb14d3/keynav/LICENSE
 *
 */
 
 // GLOBAL VARIABLES
var currentMousePos = { x_old: -1, y_old: -1, x: -1, y: -1};
var ALLOW_MOUSE_BACK = true;

// INITIALIZE KEYNAV
$(document).ready(function() {
	// DOM: ELEMENTS
	var $item = $('li');
	var audio_hover = $("audio")[0];
	var audio_click = $("audio")[1];
	var audio_back = $("audio")[2];
	var $audio_click = $("#audio_click");
	var $audio_back = $("#audio_back");
	
	// MOUSE: KEEPS TRACK OF MOUSE POSITION IN ORDER TO DETERMINE IF IT IS STATIONARY
	$(document).mousemove(function(e) {
		currentMousePos.x_old = currentMousePos.x;
        currentMousePos.y_old = currentMousePos.y;
		currentMousePos.x = e.pageX;
        currentMousePos.y = e.pageY;
	});
 
	// MOUSE: ON MOUSEOVER
    $item.mouseover(function() {
		// ALLOW MOUSE ACTIVITY ONLY IF MOUSE IS NOT STATIONARY (i.e. MOUSE NEW POSITION IS DIFFERENT FROM OLD POSITION)
		if ((currentMousePos.x < currentMousePos.x_old-2) || (currentMousePos.x > currentMousePos.x_old+2) || (currentMousePos.y < currentMousePos.y_old-2) || (currentMousePos.y > currentMousePos.y_old+2)) {
			// console.log('mouseover detected:'+currentMousePos.x+" old:"+currentMousePos.x_old+","+currentMousePos.y+" old:"+currentMousePos.y_old);
			keynav.liSelected.removeClass("selected");
			$(this).addClass("hover");
			if (typeof audio_hover !== "undefined") audio_hover.play();
			}
    });
	
	// MOUSE: ON MOUSEOUT
    $item.mouseout(function() {
		$(this).removeClass("hover");
    });

	// MOUSE: ON CLICK
    $item.click(function() {
		// UPDATES CURRENT POSITION
		var index = $(this).parent().children().index(this);
		keynav.position_current = index;
		
		// SET SELETECT LI TO CURRENT POSITION
		keynav.setLISelectedToCurrentPosition($(this));
	
		// REFRESH SCROLLING
		keynav.scrollToView();
		
		if (typeof audio_click !== "undefined") {
			// PLAY SOUND
			audio_click.play();
		}
		else {
			confirm_selection();
		}
    });
	
	// MOUSE: STOP CONTEXTMENU
	document.oncontextmenu = function() {
		if (ALLOW_MOUSE_BACK) return false; else return true;
	};
	// MOUSE: ON RIGHT CLICK
	$(document).mousedown(function(e) { 
		if ((e.button == 2) && (ALLOW_MOUSE_BACK)) {
			e.preventDefault();
			if (typeof audio_back !== "undefined") {
				audio_back.play();
			}
			else {
				history.back();
			}
			return false; 
		}
		return true; 
	}); 
	
	// AUDIO: AUDIO_CLICK ON ENDED
	$audio_click.on('ended', function() {
		confirm_selection();
	});
	
	// AUDIO: AUDIO_BACK ON ENDED
	$audio_back.on('ended', function() {
		history.back();
	});

	// KEYBOARD INIT
	keynav.init($("li"), $('#container2'));
});

// HANDLES SELECTION CONFIRMATION. THIS FUNCTION IS CALLED FROM THE ELEMENT.
function confirm_selection() {
	window.location.href = keynav.liSelected.children('div').data('href');
}

// HANDLES WINDOW RESIZE
$(window).on('resize', function(){
	keynav.init($("li"), $('#container2'));
});

// HANDLES KEYDOWN
$(window).keydown(function(e){
	if (typeof currentMousePos !== "undefined") {
		currentMousePos.x_old = currentMousePos.x;
		currentMousePos.y_old = currentMousePos.y;
		}
	
	$("li").removeClass("hover");
	
	// DOWN
	if(e.which === 40) {
		keynav.down(e);
		e.preventDefault();
		if (typeof audio_hover !== "undefined") audio_hover.play();
	}
	// UP
	else if(e.which === 38) {
		keynav.up(e);
		e.preventDefault();
		if (typeof audio_hover !== "undefined") audio_hover.play();
	}
	// RIGHT
	else if (e.which === 39) {
		keynav.right(e);
		e.preventDefault();
		if (typeof audio_hover !== "undefined") audio_hover.play();
	}
	// LEFT
	else if (e.which === 37) {
		keynav.left(e);
		e.preventDefault();
		if (typeof audio_hover !== "undefined") audio_hover.play();
	}
	// ENTER
	else if (e.which === 13) {
		if (typeof audio_click !== "undefined") audio_click.play(); else confirm_selection();
	}
	// ESCAPE
	else if (e.which === 27) { 
		if (typeof audio_hover !== "undefined") audio_back.play(); else history.back();
	}
});

// CLASS KEYNAV
var keynav = new function() {
	this.li;
	this.liSelected;
	this.container;
	this.page_offset_top;
	this.scroll_new = 0;
	this.scroll_old = 0;
	
	this.cols = 0;
    this.rows = 0;
	this.items_count = 0;
	this.col_marked = -1;
	this.position_current = 0;
	this.position_last_item = -1;
	this.position_second_last_row_last_item = 0;
	this.last_row_items_count = 0;
	
    this.init = function (list, container) {
		this.li = list;
		this.container = container;
		this.page_offset_top = this.li.eq(0).children('div').offset().top - this.container.offset().top + this.container.scrollTop();
		
		// CALCULATE VARIABLES
		this.cols = this.countCols(this.li);
		
		this.rows = Math.ceil(this.li.length/this.cols);
		this.position_second_last_row_last_item = ((this.rows-1) * this.cols)-1;
		
		this.items_count = this.li.length;
		this.position_last_item = this.items_count-1;
		
		this.last_row_items_count = this.items_count % this.cols;
		if (this.last_row_items_count == 0) this.last_row_items_count = this.cols;
		
		// HIGHLIGHT INITIAL SELECTION
		if (!this.liSelected) {
			this.liSelected = this.li.first();
			this.highlightItem();
			}
    };
	
	// COUNT NUMBER OF COLOUMS IN A ROW
	this.countCols = function (e) {
		var count = 0;
		$(e).each( function() {
			if ($(this).prev().length > 0) {
				if ($(this).position().top != $(this).prev().position().top) {
					return false;
					}
				count++;
			}
			else {
				count++;   
			}
		});
		return count;
	}
	
	// CHECK IF IS SECOND LAST ROW
	this.isSecondLastRow = function() {
		if ((this.absolutePosition() <= (this.items_count - this.last_row_items_count)) && (this.position_current >= (this.items_count - this.last_row_items_count - this.cols))) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS LAST ROW
	this.isLastRow = function() {
		if ((this.absolutePosition() <= (this.items_count)) && (this.position_current >= (this.items_count - this.last_row_items_count))) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS NOT LAST ROW
	this.isNotLastRow = function() {
		return !this.isLastRow();
	}
	
	// CHECK IF IS FIRST ROW
	this.isFirstRow = function() {
		if (this.absolutePosition() <= this.cols) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS COLOUM MARKED
	this.isColMarkedDefined = function() {
		if (this.col_marked != -1) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS LAST ITEM
	this.isLastItem = function() {
		if ((this.position_current + 1) == this.items_count) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS NOT LAST ITEM
	this.isNotLastItem = function() {
		return !this.isLastItem();
	}
	
	// CHECK IF IS FIRST ITEM
	this.isFirstItem = function() {
		if ((this.position_current) == 0) {
			return true;
		}
		else {
			return false;
		}
	}
	
	// CHECK IF IS NOT FIRST ITEM
	this.isNotFirstItem = function() {
		return !this.isFirstItem();
	}
	
	// MOVE TO FIRST ROW
	this.moveToFirstRow = function() {
		if (this.isColMarkedDefined()) {
			this.position_current = this.col_marked - 1;
		}
		else {
			this.position_current = this.currentCol()-1;
		}
	}
	
	// MOVE TO LAST ROW
	this.moveToLastRow = function() {
		var last_row_new_col = (this.currentCol() / this.cols) * this.last_row_items_count;
		this.position_current = (this.position_last_item - (this.last_row_items_count - (Math.ceil(last_row_new_col)+1)))-1;
	}
	
	// MOVE TO SECOND LAST ROW
	this.moveToSecondLastRow = function() {
		var new_col = this.currentCol() / this.cols;
		var items_per_division = Math.floor(this.cols / this.last_row_items_count);
		var last_row_half_point_measure = (this.currentCol() / this.last_row_items_count);
		var item_start_point =  ((items_per_division * this.currentCol()));
		if (last_row_half_point_measure > 0.5) {
			var position_new_col = this.position_second_last_row_last_item - (this.cols - item_start_point) - (items_per_division-1);
		}	
		else {
			var position_new_col = this.position_second_last_row_last_item - (this.cols - item_start_point);
		}
		this.position_current = position_new_col;
	}
	
	// MOVE UP
	this.moveUp = function() {
		this.position_current = this.position_current - this.cols;
		this.rememberCol();
	}
	
	// MOVE DOWN
	this.moveDown = function() {
		this.rememberCol();
		this.position_current = this.position_current + this.cols;
	}
	
	// MOVE RIGHT
	this.moveRight = function() {
		this.position_current = this.position_current + 1;
		this.rememberCol();
	}
	
	// MOVE LEFT
	this.moveLeft = function() {
		this.position_current = this.position_current - 1;
		this.rememberCol();
	}
	
	// MOVE TO FIRST ITEM
	this.moveToFirstItem = function() {
		this.container.scrollTop(0);
		this.position_current = 0;
	}
	
	// MOVE TO LAST ITEM
	this.moveToLastItem = function() {
		this.position_current = this.position_last_item;
	}
	
	// GET ABSOLUTE POSITION
	this.absolutePosition = function() {
		return this.position_current+1;
	}
	
	// GET CURRENT COLOUM
	this.currentCol = function() {
		return (this.position_current % this.cols) + 1;
	}
	
	// REMEMBER CURRENT COLOUM
	this.rememberCol = function() {
		this.col_marked = this.currentCol();
	}
	
	// DEHIGHLIGHT ITEM BY REMOVING CSS CLASS 'selected'
	this.deHighlightItem = function() {
		if (this.liSelected !== undefined) {
			this.liSelected.removeClass('selected');
		}
	}

	// HIGHLIGHT ITEM BY ADDING CSS CLASS 'selected'
	this.highlightItem = function() {
		this.liSelected.addClass('selected');
	}
	
	// SET liSelected TO CURRENT POSITION
	this.setLISelectedToCurrentPosition = function(li) {
		this.deHighlightItem();
		if (li !== undefined) { // EQUATE IT TO GIVEN PARAMETER
			this.liSelected = li;
		}
		else { // EQUATE IT TO CURRENT POSITION
			this.liSelected = this.li.eq(this.position_current);
		}
		this.highlightItem();
	}
	
	// CHECK IF ITEM IS OUT OF VIEWPORT
	this.isItemOutOfViewPort = function() {
		return (((this.liSelected.position().top + this.liSelected.height()) > window.innerHeight) || (this.liSelected.position().top < 0));
	}
	
	// SCROLL TO VIEW FOR UP AND LEFT
	this.scrollToView = function() {
		if (this.isItemOutOfViewPort()) {
			this.scroll_new = this.liSelected.children('div').offset().top - this.container.offset().top + this.container.scrollTop();
			this.container.scrollTop(this.scroll_new - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
	}
	
	// SCROLL TO VIEW FOR DOWN AND RIGHT
	this.scrollToView2 = function() {
		this.scroll_new = this.liSelected.children('div').offset().top - this.container.offset().top + this.container.scrollTop();
		if ((this.scroll_new > this.scroll_old)) {
			this.container.scrollTop(this.scroll_old - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
		else if (this.isItemOutOfViewPort()) {
			this.container.scrollTop(this.scroll_new - this.page_offset_top);
			this.scroll_old = this.scroll_new;
		}
		else {
			this.scroll_old = this.scroll_new;
		}
	}
	
	// KEYNAV DOWN
	this.down = function (e) {
		if (this.isLastRow()) {
			this.moveToFirstRow();
		}
		else if (this.isSecondLastRow()) {
			this.moveToLastRow();
		}
		else {
			this.moveDown();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView2();

	};
	
	// KEYNAV UP
	this.up = function(e) {
		if (this.isFirstRow() && this.isSecondLastRow()) {
			this.moveToLastRow();
		}
		else if (this.isFirstRow() && this.isLastRow()) {
			this.moveToLastRow();
		}
		else if (this.isLastRow()) {
			this.moveToSecondLastRow();
		}
		else if (this.isFirstRow()) {
			this.moveToLastRow();
		}
		else {
			this.moveUp();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView();
	};
	
	// KEYNAV RIGHT
	this.right = function(e) {
		if (this.isNotLastItem()) {
			this.moveRight();
		}
		else {
			this.moveToFirstItem();
		}
		
		this.setLISelectedToCurrentPosition();
		
		this.scrollToView2();
	};
	
	// KEYNAV LEFT
	this.left = function(e) {
		if(this.isNotFirstItem()){
			this.moveLeft();
		}
		else {
			this.moveToLastItem();
		}

		this.setLISelectedToCurrentPosition();
		
		this.scrollToView();
	};
}


