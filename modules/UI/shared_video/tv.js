import Drag from '../videolayout/Drag';

//var player;
//var playerStatus = -1;

var tv;

function playlistIDFromURL(url) {
  var VID_REGEX = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var regPlaylist = /[?&]list=([^#\&\?]+)/;
  var match = url.match(regPlaylist);

  if(!match) return '';
  return match[1];
}

function videoIDFromURL(src_url) {
  if (!src_url) {
    return '';
  }

  var youtubeID;

  if (src_url.indexOf('watch') != -1) {
    youtubeID = src_url.split('v=')[1];
    var ampersandPosition = youtubeID.indexOf('&');
    if (ampersandPosition != -1) {
      youtubeID = youtubeID.substring(0, ampersandPosition);
    }
  } else if (src_url.indexOf('embed') != -1) { // DEBUG:
    youtubeID = src_url.substring(src_url.lastIndexOf('/') + 1);
  } else if (src_url.indexOf('youtu.be') != -1) {
    var regex2 = new RegExp("youtu\.be\/([^&\/]+)", "gim");
    var regexResult2 = src_url.match(regex2);
    youtubeID = regexResult2.split("/")[1];
  } else {
    youtubeID = src_url;
  }

  return youtubeID;
}

function Tv(options) {
  this.bar = options.bar;
  this.db = options.db;
  this.peerUserId = options.bar.userId;

  var tag = document.createElement('script');
  tag.id = 'iframe-demo';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  this.playerStatus = -1;

  tv = this;

  let buttons = document.querySelectorAll('.genre_button');
  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      console.log('playlist:' + event.target.id);

      var numPl = Math.floor((Math.random() * 50) + 1);
      var genre = event.target.id;
      var pid = '';
      if (genre == 'vaporwave') pid = 'PLvMOVpwkpbUmV2GyXrXgTWctZR7CHs2HR';
      if (genre == 'trap') pid = 'PL4xqRMQ2GXakFbfcHTNq6jfKO93c4WKfS';
      if (genre == 'lavalounge') pid = 'PLfL1Hz7phkcRaoQlvh_nJ4OjcvIYAufhb';
      if (genre == 'kpop') pid = 'PLOHoVaTp8R7dfrJW5pumS0iD_dhlXKv17';
      if (genre == 'dance') pid = 'PLU3zXKb8T7TG9pKGXPkjqx6jBGrcIOgKH';

      this.playPlaylist(pid);
      this.toggleMenu(false);

    });
  });


  document.getElementById('youtube_url').addEventListener('mousedown', function(ev) {
    ev.stopPropagation();
  }, false);


  var goButton = document.getElementById("youtube_go");
  goButton.addEventListener("click", (event) => {
    var inputVal = document.getElementById("youtube_url").value;

    var pid = playlistIDFromURL(inputVal);
    var vid = videoIDFromURL(inputVal);
    if (pid) {
      this.playPlaylist(pid);
    } else if (vid) {
      this.playVideo(vid);
    } else {
      return;
    }

    this.toggleMenu(false);
  });

  var doneButton = document.getElementById("tv_menu_done");
  doneButton.addEventListener("click", (event) => {
    this.toggleMenu(false);
    //shufflePlaylist
  });

  var menuButton = document.getElementById("tv_menu_show");
  menuButton.addEventListener("click", (event) => {
    this.toggleMenu(true);
  });
}



Tv.prototype.playPlaylist = function(pid) {
  this.player.cuePlaylist({
    list: pid,
    listType: 'playlist',
    //index:numPl, dont need to do this if shuffling works....
    startSeconds: 0
  });


  setTimeout(function() {
    // your not allowed to shuffle the playlist until after cuing for some reason
    if(this.debug)console.log('shuffle next video');
    tv.player.setShuffle({
      shufflePlaylist: true
    });
    tv.player.nextVideo();
  }, 1000);


};

Tv.prototype.playVideo = function(vid) {
  this.player.loadVideoById({
    videoId: vid,
    startSeconds: 0
  });
};

Tv.prototype.toggleMenu = function(on) {
  var el = document.getElementById('tv_bottom');
  el.className = on ? 'hide' : '';
  document.getElementById('tv_menu').style.display = on ? 'block' : 'none';
}



Tv.prototype.onPlayerReady = function(event) {
  //document.getElementById('player').style.borderColor = '#FF6D00';
  //oiPA4U8HU8M


  var percentWidth = 23.0;
  var element = document.getElementById('drag_tv');
  element.style.display = 'block';
  element.style.left = `10vw`;
  element.style.top = `10vh`;
  element.style.width = percentWidth + 'vw';
  element.style.height = (percentWidth * (9.0 / 16.0)) + 'vw';


  element.style.minWidth = "360px";
  element.style.minHeight = (360 * (9.0 / 16.0) + 50.0) + "px";

  this.drag = new Drag(element, element, null, true);
  this.drag.resizable = true;

  tv.player.setVolume(25);

  tv.toggleMenu(true);
  // for some reason this is out of scope... probably because of how im assignign onplayerready as the callback
  tv.updateTitle();


  this.db.addChangeListener("tv:media", this.onMediaChange.bind(this));
  this.db.addChangeListener("tv:playback", this.onIsPlayingChange.bind(this));

  var isActive = this.db.get("tv:is_active");
  if (!isActive || !isActive.value.is_active){

    this.db.set("tv:is_active", {is_active: true});
  }

  // when you first enter the bar, we never want to play what was
  // playing in a previous browser session
  this.db.del("tv:media");

  // is the TV already playing something?
  this.db.get("tv:media", function(record){

    if(!record){
     console.log('no record');
      return;
    }

    if (record.value) {
      this.onMediaChange({detail: {record: record}});
      // can't auto play here :(
      // `Autoplay is only allowed when approved by the user, the site is activated by the user, or media is muted.`
      this.toggleMenu(false);
    }
  }.bind(this));
};


Tv.prototype.updateTitle = function() {
  // commenting this out for now because the player shows the title on hover...
  //document.getElementById("tv_title").innerText = this.player.getVideoData().title;
};

Tv.prototype.pushEvent = function(type, message) {
  this.bar.sendWebRTCDataChannelBroadcast(
    `tv:${type}`,
    Object.assign({peerUserId: this.peerUserId}, message)
  );
};

Tv.prototype.onIsPlayingChange = function(event){
  if (event.detail.record.value.is_playing !== this.isPlaying()){
    if (event.detail.record.value.is_playing){
      this.player.playVideo();
    } else {
      this.player.pauseVideo();
    }

    setTimeout(function(){
      this._seeking = true;
      this.player.seekTo(event.detail.record.value.time);
    }.bind(this), 0);
  }
};

Tv.prototype.isPlaying = function(){
  return this.playerStatus === 1;
};

Tv.prototype.onMediaChange = function(event){
  var media = event.detail.record.value;
  var currentMedia = this.player.getVideoData();
  if (currentMedia && media.video.video_id === currentMedia.video_id) {
    if(this.debug)console.log('media change:already playing ' + currentMedia.video_id);
    return;
  }

  if(this.debug)console.log('media change starting' + media.video.video_id);

  this.toggleMenu(false);

  this.player.setShuffle({
    shufflePlaylist: false
  });

  media.playlist = media.playlist || [media.video.video_id];
  if(this.debug)console.log('media change list length ' + media.playlist.length + ' index ' + media.playlist.indexOf(media.video.video_id));

  this.player.loadPlaylist(media.playlist, media.playlist.indexOf(media.video.video_id));
};

Tv.prototype.onPlayerStateChange = function(event) {
  //changeBorderColor(event.data);
  //socket.emit('player status', event.data);
  tv.playerStatus = event.data;
  tv.updateTitle();
  if(this.debug)console.log(event.data);
  switch(event.data){
  case -1: // "unstarted" generally means a new video is ready
  var currentMedia = this.player.getVideoData();


  if(this.debug)console.log("opsc:-1 so  setting tv:media video id:" + currentMedia.video_id + " playlist length:" + this.player.getPlaylist().length);

    this.db.set("tv:media", {
      playlist: this.player.getPlaylist(),
      video:    this.player.getVideoData()
    });

 case 5:
  //  player.setShuffle(true);
  //  player.playVideo();
  break;

  case 1:
    if (this._seeking === true){
      this._seeking = false;
      return;
    }

    if(this.debug)console.log("opsc 1 so setting tv:playback with time " + event.target.getCurrentTime());

    this.db.set("tv:playback", {is_playing: true, time: event.target.getCurrentTime()});
    break;
  case 3: // buffering
    if(this.debug)console.log('buffering');
    break;
  case 2:
    if(this.debug)console.log("opsc 2 so setting tv:playback with time " + event.target.getCurrentTime());

    this.db.set("tv:playback", {is_playing: false, time: event.target.getCurrentTime()});
    break;
  }
};

window.onYouTubeIframeAPIReady = function() {
  console.log('yt ready');
  // using a global object because not sure how else to accomplice this....
  tv.player = new YT.Player('player', {
    playerVars: {
      autoplay: 1,
      rel: 0,
      controls: 1,
      modestbranding:1
    },
    height: '100%',
    width: '100%',
    //listType: 'playlist',
    //list: 'PLvMOVpwkpbUmV2GyXrXgTWctZR7CHs2HR',
    videoId: 'sRE5iQCdRvE',

    events: {
      'onReady':       tv.onPlayerReady.bind(tv),
      'onStateChange': tv.onPlayerStateChange.bind(tv)
    }

  });

};

export default Tv;
