
var isTouch = 'ontouchstart' in document.documentElement;
var clickOrTouchEnd = isTouch ? 'touchend' : 'click';
var downOrTouchStart = isTouch ? 'touchstart' : 'mousedown';
var moveOrTouchMove = isTouch ? 'touchmove' : 'mousemove';
var upOrTouchEnd = isTouch ? 'touchend' : 'mouseup';


var TOP_BAR_HEIGHT = 0;
var BOTTOM_BAR_HEIGHT = 0;
var VERTICAL_PADDING = TOP_BAR_HEIGHT + BOTTOM_BAR_HEIGHT;


var MIN_SIZE = 150;
var RESIZE_ICON_SIZE = 35.0;

function touchify(e) {
  var pageX;
  var pageY;
  if (e.touches != null && e.touches.length > 0) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return { pageX: pageX, pageY: pageY };
}

function Drag(dragTarget, moveTarget, locationCallback, resizable, padding, aspectRatio) {


  //var ASPECT_W = 5;
  //var ASPECT_H = 4;
  //var ASPECT_COEF = ASPECT_H / ASPECT_W;
  this.aspectRatio = 1.0 / aspectRatio;


  this.dragTarget = dragTarget;
  this.el = moveTarget;
  this.locationCallback = locationCallback || function() {};
  this.startX;
  this.startY;
  this.down;
  this.target;
  this.x;
  this.y;
  this.clientWidth;
  this.clientHeight;
  this.resizable = resizable;
  this.padding = padding;
  ['onDown', 'onMove', 'onUp'].forEach(method => {
    this[method] = this[method].bind(this);
  });

  if (this.resizable) {
    var resizeButton = document.createElement('div');
    resizeButton.className = 'resizable';
    this.el.appendChild(resizeButton);
  }

  document.addEventListener(moveOrTouchMove, this.onMove);
  this.dragTarget.addEventListener(downOrTouchStart, this.onDown);
}

Drag.prototype.onDown = function(e) {
  var pos = touchify(e);
  this.target = this.el;
  this.clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  this.clientHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;



  this.startX = pos.pageX - parseFloat(this.target.style.left) * this.clientWidth * 0.01;
  this.startY = pos.pageY - parseFloat(this.target.style.top) * this.clientHeight * 0.01;

  this.down = true;


  this.startWidthPx = Math.max(
    parseFloat(this.target.style.width) *  this.clientWidth * 0.01,
    parseFloat(this.target.style.minWidth)
  );
  this.startHeightPx = this.startWidthPx * this.aspectRatio + this.padding * 2.0;



  const insideCorner =
    this.startX > this.startWidthPx - RESIZE_ICON_SIZE &&
    this.startY > this.startHeightPx - RESIZE_ICON_SIZE;

    console.log((insideCorner ?  'resize' : 'not resizing') + 'because starting at ' + this.startY + 'of ' + this.startHeightPx);



  this._isResizing = this.resizable && insideCorner;

  if (this._isResizing) {
  //  document.getElementById('player').style.display = 'none';
  }

  document.addEventListener(upOrTouchEnd, this.onUp);
};

Drag.prototype.onMove = function(e) {
  if (this.down) {
    var pos = touchify(e);
    this.x = pos.pageX - this.startX;
    this.y = pos.pageY - this.startY;

    this.vx = (this.x / this.clientWidth) * 100.0;
    this.vy = (this.y / this.clientHeight) * 100.0;


/*
this.dragdistanceX = (pos.pageX  - (parseFloat(this.target.style.left) * .01) * this.cw) - this.startX;
    this.dragdistanceY = (pos.pageY  - (parseFloat(this.target.style.top) * .01) * this.ch) - this.startY;
*/

    if (this._isResizing) {
      this.dragdistanceX =
        pos.pageX -
        parseFloat(this.target.style.left) *  this.clientWidth * 0.01 -
        this.startX;



      this.dragdistanceY =
        pos.pageY -
        parseFloat(this.target.style.top) *  this.clientHeight * 0.01 -
        this.startY;

      var newWidthPx = this.startWidthPx + this.dragdistanceX;
      var newWidth = newWidthPx / this.clientWidth;
      var newHeight =
        (newWidthPx * this.aspectRatio + this.padding * 2.0) / this.clientWidth;
      var newMinWidth = Math.max(
        Math.min(parseFloat(this.target.style.minWidth), newWidthPx),
        MIN_SIZE
      );
    //  console.log('liz swpx:' + this.startWidthPx + ' ddx:' + this.dragdistanceX + ' cw:' + this.clientWidth);

      this.target.style.width = newWidth * 100.0 + 'vw';
      this.target.style.height = newHeight * 100.0 + 'vw';

      this.target.style.minWidth = newMinWidth + 'px';
      this.target.style.minHeight =
        newMinWidth * this.aspectRatio + this.padding * 2.0 + 'px';

      this.target.style.paddingTop = this.padding;
      this.target.style.paddingBottom = this.padding;


    } else {




      this.target.style.left = this.vx + 'vw';
      this.target.style.top = this.vy + 'vh';
    }
  }
};

Drag.prototype.onUp = function(e) {
  if (this._isResizing) {
  //  document.getElementById('player').style.display = 'block';
    this._isResizing = false;
  }

  if (this.down) {
    this.down = false;
    this.target = null;

    this.locationCallback(this.vx, this.vy);

    document.removeEventListener(upOrTouchEnd, this.onUp);
  }
};


Drag.prototype.destroy = function(e) {
  document.removeEventListener(moveOrTouchMove, this.onMove);
  this.dragTarget.removeEventListener(downOrTouchStart, this.onDown);
};

export default Drag;
