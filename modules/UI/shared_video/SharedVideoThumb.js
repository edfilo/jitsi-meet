/* global $ */

import Logger from 'jitsi-meet-logger';

import SmallVideo from '../videolayout/SmallVideo';

import Drag from '../videolayout/Drag';
import LocalPosition from '../videolayout/LocalPosition';

import UIEvents from '../../../service/UI/UIEvents';


const logger = Logger.getLogger(__filename);

/**
 *
 */
export default class SharedVideoThumb extends SmallVideo {
    /**
     *
     * @param {*} participant
     * @param {*} videoType
     * @param {*} VideoLayout
     */
    constructor(participant, videoType, VideoLayout) {
        super(VideoLayout);
        this.boost = 1.5;
        this.padding = 25.0;
        this.x = 40 + 20 * Math.random();
        this.y = 40 + 20 * Math.random();
        this.id = participant.id;
        this.isLocal = false;
        this.url = participant.id;
        this.videoSpanId = 'sharedVideoContainer';
        this.container = this.createContainer(this.videoSpanId);
        this.$container = $(this.container);
        this._setThumbnailSize();
        this.bindHoverHandler();
        this.isVideoMuted = true;
        this.updateDisplayName();
        this.container.onclick = this._onContainerClick;
        this.container.onmousemove = this._onMouseMove;
        this.setupUI();
        console.log('shared constructor mypadding is' + this.padding);
    }

    playlistIDFromURL(url) {
      var VID_REGEX = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var regPlaylist = /[?&]list=([^#\&\?]+)/;
      var match = url.match(regPlaylist);

      if(!match) return '';
      return match[1];
    }

    videoIDFromURL(src_url) {
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


    playPlaylist(pid) {

        /*
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
        */


          console.log('playvideo  ' + pid);
        //  APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'stop');
          this.url = pid;
          APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'startplaylist');

    }

    playVideo(url) {

      /*
      this.player.loadVideoById({
        videoId: vid,
        startSeconds: 0
      });
      */

      //console.log('playvideo  ' + url);
    //  APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'stop');


      this.url = url;
      APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'start');

    }


    toggleMenu(on){

      var el = document.getElementById('tv_bottom');
      el.className = on ? 'hide' : '';
      document.getElementById('tv_menu').style.display = on ? 'block' : 'none';
    }


    setupUI() {

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

          var pid = this.playlistIDFromURL(inputVal);
          var vid = this.videoIDFromURL(inputVal);
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

        this.toggleMenu(true);

    }


    bindHoverHandler() {

      this.$container.css('left', this.x + 'vw');
      this.$container.css('top', this.y + 'vh');
    //  this.$container.css('left', '0vw');
    //  this.$container.css('top', '50vh');
      //this.$container.css('background-color', 'red');

      this.$container.css('padding-top', this.padding + 'px');
      this.$container.css('padding-bottom', this.padding + 'px');

      var element = this.$container[0];
      this.drag = new Drag(element, element, this.onLocationChanged.bind(this), true, this.padding);
      this.position = new LocalPosition(element);
      this.element = element;



     var stuff = '<div id="tv_bottom"><button id="tv_menu_show">menu</button></div>'
      +'<div id="tv_menu">'
      +'<button id="tv_menu_done"></button>'
      +'<div id="genre_buttons">'
      +'<div id="genre_buttons_title">Playlists</div>'
      +'<button class="genre_button" id="lavalounge">80s lava lounge</button>'
      +'<button class="genre_button" id="kpop">kpop</button>'
      +'<button class="genre_button" id="dance">dance</button>'
      +'<button class="genre_button" id="vaporwave">vaporwave</button>'
      +'<button class="genre_button" id="trap">trap</button>'
      +'</div>'
      +'<input id="youtube_url" type="text" placeholder="youtube url or playlist"></input>'
      +'<button id="youtube_go">Play</button>'
      +'</div>'

      this.$container.append(stuff);

    }
    /**
     *
     */
    initializeAvatar() {} // eslint-disable-line no-empty-function

    /**
     *
     * @param {*} spanId
     */
    createContainer(spanId) {
        const container = document.createElement('span');

        container.id = spanId;
        container.className = 'videocontainer';

        // add the avatar
        /*
        const avatar = document.createElement('img');
        avatar.className = 'sharedVideoAvatar';
        avatar.src = `https://img.youtube.com/vi/${this.url}/0.jpg`;
        container.appendChild(avatar);
        */

        const youtube = document.createElement('div');
        youtube.id = 'youtube';
        //avatar.src = `https://img.youtube.com/vi/${this.url}/0.jpg`;
        container.appendChild(youtube);





        //const displayNameContainer = document.createElement('div');
        //displayNameContainer.className = 'displayNameContainer';
        //container.appendChild(displayNameContainer);

        const remoteVideosContainer
            = document.getElementById('filmstripRemoteVideosContainer');
        const localVideoContainer
            = document.getElementById('localVideoTileViewContainer');

        remoteVideosContainer.insertBefore(container, localVideoContainer);

        return container;
    }

    /**
     * Triggers re-rendering of the display name using current instance state.
     *
     * @returns {void}
     */
    updateDisplayName() {
        if (!this.container) {
            logger.warn(`Unable to set displayName - ${this.videoSpanId
            } does not exist`);

            return;
        }

        this._renderDisplayName({
            elementID: `${this.videoSpanId}_name`,
            participantID: this.id
        });
    }
}
