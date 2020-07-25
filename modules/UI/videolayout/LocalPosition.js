

var Utils = {
  iOS: function(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  generateId: function(){
    // not really random but good enough
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  },

  escapeHTML: function(str){
    if (!str) return "";

    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  addClass: function(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!this.hasClass(el, className)) {
      el.className += " " + className;
    }
  },

  removeClass: function(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (this.hasClass(el, className)) {
      var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      el.className = el.className.replace(reg, " ");
    }
  },

  hasClass: function(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
  },

  geometry: {
    TWO_PI: Math.PI * 2,
    shrinkRect: function(rect, shrink) {
      var twoShrink = shrink * 2;
      var newRect = {
        left: rect.left + shrink,
        top: rect.top + shrink,
        width: rect.width - twoShrink,
        height: rect.height - twoShrink
      };
      newRect.right = newRect.left + newRect.width;
      newRect.bottom = newRect.top + newRect.height;
      return newRect;
    },

    rectIntersection: function(a, b) {
      return !(b.left > a.right ||
               b.right < a.left ||
               b.top > a.bottom ||
               b.bottom < a.top);
    },

    rectCentroid: function(rect) {
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }
};



//how much can peer overlay before a collision is triggered (in percent)
var OVERLAP_TOLERANCE = 0.05;

// number of steps around circumferernce of ring to check for avaialable spot
var RING_STEPS = 10;

// number of times to increase ring size to find an available spot
var MAX_OUTER_RINGS = 3;

var debug = false;

function LocalPosition(peerEl) {
 this.peerEl = peerEl;
 this.rings = 0;
}

LocalPosition.prototype.calculate = function() {
 var rect = this.peerEl.getBoundingClientRect();
 // this method enables us to switch the `peerEl` at any time for testing
 // as oppoosed `peer:not(#local_media)`
 var peers = document.querySelectorAll('.videocontainer');
 var hit = false;
 var peerRects = [];
 var shrinkAmount = rect.width * OVERLAP_TOLERANCE;
 var peerRect;

 for (var i = 0; i < peers.length; i++) {
   if (peers[i] !== this.peerEl) {
     peerRect = peers[i].getBoundingClientRect();
     var shrunken = Utils.geometry.shrinkRect(peerRect, shrinkAmount);
     peerRects.push(shrunken);
     if (Utils.geometry.rectIntersection(rect, shrunken)) {
       hit = true;
       break;
     }
   }
 }

 this.rings = 0;
 this.lastValdLoc = null;

 // has a collision, look for avaialable location to move
 if (hit) {
   this.validLoc = null;
   this.findValidLoc(peerRect, peers, peerRects);
 }
 return this.lastValdLoc;
};

LocalPosition.prototype.findValidLoc = function(rect, peers, peerRects, nextRadius = 0) {
 // give up expanding ring after `MAX_OUTER_RINGS`
 if (this.rings > MAX_OUTER_RINGS) {
   return;
 }

 var width = window.innerWidth;
 var height = window.innerHeight;
 var centroid = Utils.geometry.rectCentroid(rect);
 var step = Utils.geometry.TWO_PI / RING_STEPS;
 var radius = nextRadius || rect.width * 0.8;
 var size = rect.width / 5;
 var halfSize = size / 2;
 var thetaOff = Math.random() * 2 * Math.PI;
 var availableSpots = [];
 var theta, x, y, orbitRect, hasAvailableLoc, isOffscreen, peerRect;

 for (var i = 0; i < RING_STEPS; i++) {
   theta = thetaOff + i * step;
   x = centroid.x + radius * Math.cos(theta) - halfSize;
   y = centroid.y + radius * Math.sin(theta) - halfSize;
   orbitRect = {
     left: x, top: y,
     right: x + size, bottom: y + size
   };
   hasAvailableLoc = true;
   isOffscreen = orbitRect.left < 0 ||
     orbitRect.top < 0 ||
     orbitRect.right > width ||
     orbitRect.bottom > height;

   if (!isOffscreen) {
     // compare points on ring to peer rects
     for (var j = 0; j < peers.length; j++) {
       // re-use existing `peerRect` values if avaialable
       if (peerRects[j] != null) {
         peerRect = peerRects[j]
       } else {
         peerRect = peerRects[j] = peers[j].getBoundingClientRect();
       }
       if (Utils.geometry.rectIntersection(orbitRect, peerRect)) {
         hasAvailableLoc = false;
         break;
       }
     }

     // no collisions so push the available location
     if (hasAvailableLoc) {
       availableSpots.push({
         x: x + size / 2 - peerRect.width / 2,
         y: y + size / 2 - peerRect.height / 2
       });
     }
   }
 }

 // no availlable spots, expand the ring
 if (availableSpots.length === 0) {
   this.rings++;
   this.findValidLoc(rect, peers, peerRect, radius * 1.5);
 } else {
   // found one or more good spots, move too a random one
   this.movePeer(availableSpots[Math.floor(Math.random() * availableSpots.length)]);
 }
};

LocalPosition.prototype.movePeer = function(validLoc) {
 var vw = (validLoc.x / window.innerWidth * 100);
 var vh = (validLoc.y / window.innerHeight * 100);
 this.lastValdLoc = {
   x: validLoc.x,
   y: validLoc.y,
   vw, vh
 };
 this.peerEl.classList.add('push_media');
 Object.assign(this.peerEl.style, {
   left: vw + 'vw',
   top: vh + 'vh'
 });
 setTimeout(() => {
   this.peerEl.classList.remove('push_media');
 }, 250);
};

export default LocalPosition;
