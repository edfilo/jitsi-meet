/* global $ */

import Logger from 'jitsi-meet-logger';

import SmallVideo from '../videolayout/SmallVideo';

import Drag from '../videolayout/Drag';
import LocalPosition from '../videolayout/LocalPosition';

import UIEvents from '../../../service/UI/UIEvents';

import { ApiClient } from 'twitch';
import { ClientCredentialsAuthProvider } from 'twitch-auth';


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
        this.isTV = true;
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
        this.updateDisplayName();
        this.container.onclick = this._onContainerClick;
        this.container.onmousemove = this._onMouseMove;
        this.setupUI();
        console.log('shared constructor mypadding is' + this.padding);

        const clientId = '2pw755fu9em84t92c2jd25e3o2sbqh';
        const clientSecret = 's44pnn7utnyqq21n3n8pcp5dtqz3iv';

        const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
        const apiClient = new ApiClient({ authProvider });


        //getAllLiveStreams(page, limit)

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

    openScreenSharing(){
        APP.conference.toggleScreenSharing(true);

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

          console.log('playvideo ' + pid);
          //APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'stop');
          this.url = 'https://www.youtube.com/playlist?list='+pid;
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
        window.playlist = url;
      APP.UI.getSharedVideoManager().emitter.emit(UIEvents.UPDATE_SHARED_VIDEO, this.url, 'start');

      APP.UI.startVideo();
      window.savePlaylist(url);





    }


    toggleMenu(on){

      var el = document.getElementById('tv_bottom');
      el.className = on ? 'hide' : '';
      document.getElementById('tv_menu').style.display = on ? 'block' : 'none';
    }


    setupUI() {
      //alert('setup');

      let buttons = document.querySelectorAll('.card');


      buttons.forEach((btn) => {
        btn.addEventListener("click", (event) => {

          const url = 'twitch.tv/' + event.target.id;

          this.toggleMenu(false);

          //APP.UI.startVideo();
          this.playVideo(url);


          //savePlaylist(url);

          //debugger;

          //alert('card' + event.target.id);
          /*

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
          */
        });
      });

      /*
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

        */

        document.getElementById('youtube_url').addEventListener('mousedown', function(ev) {
          ev.stopPropagation();
        }, false);

        console.log('um');
        var closeButton = document.getElementById("tv_close");
        closeButton.addEventListener("click", (event) => {






          APP.UI.onSharedVideoStop('', {});

          //APP.UI.getSharedVideoManager().
          //alert('closing TV - doesnt work yet');

        });



        /*
        var shareButton = document.getElementById("share_desktop_button");
        shareButton.addEventListener("click", (event) => {

          this.openScreenSharing();

        });
        */

        var goButton = document.getElementById("youtube_go");
        goButton.addEventListener("click", (event) => {
          var inputVal = document.getElementById("youtube_url").value;
/*
          var pid = this.playlistIDFromURL(inputVal);
          var vid = this.videoIDFromURL(inputVal);
         if (pid) {
            this.playPlaylist(pid);
          } else if (vid) {
            this.playVideo(vid);
          } else {
            return;
          }
*/
					this.playVideo(inputVal)


          this.toggleMenu(false);
        });

        var doneButton = document.getElementById("tv_menu_done");

        //debugger;

        doneButton.addEventListener("click", (event) => {
          this.toggleMenu(false);


          //shufflePlaylist
        });



        var menuButton = document.getElementById("tv_menu_show");
        menuButton.addEventListener("click", (event) => {
          this.toggleMenu(true);
        });

        this.toggleMenu(false);

    }

    playTwitch(el) {
    //  alert(el.id);

    }

    makeLiveShows() {

      var h = '';
      window.livetwitchesfull.forEach((item, i) => {
        h += `<div style="width:20%;float:left;padding:5px;" >
        <div><img class="card" id="${item.name}" style="width:100%;" src="${item.thumb}"></div>
        <div style="font-size:10px;color:white;" class="name">${item.name}</div>
        </div>`;
      });

      return h;

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
      this.drag = new Drag(element, element, this.onLocationChanged.bind(this), true, this.padding, 16.0/9.0);
      this.position = new LocalPosition(element);
      this.element = element;



      //+'<div id="genre_buttons">'
      //+'<div id="genre_buttons_title">Playlists</div>'
      //+'<button class="genre_button" id="lavalounge">80s lava lounge</button>'
      //+'<button class="genre_button" id="kpop">kpop</button>'
      //+'<button class="genre_button" id="dance">dance</button>'
      //+'<button class="genre_button" id="vaporwave">vaporwave</button>'
      //+'<button class="genre_button" id="trap">trap</button>'
      //+'</div>'
     var stuff = `<div style="position:absolute;height:16px;width:16px;border-radius:8px;background-color:red;top:3px;left:3px;" id="tv_close"></div><div id="tv_bottom"><button style="border:solid white 0px;" id="tv_menu_show">menu</button></div>'
      <div id="tv_menu">
      <button style="border:solid white 2px;" id="tv_menu_done"></button>


      <div style="clear:both;">
        <div style="width:calc(100% - 100px);display:inline-block;"><input style="width:100%;" id="youtube_url" type="text" placeholder="youtube, twitch, mixcloud, or video link."></input></div>
        <button style="border:solid white 0px;width:80px;float:right;" id="youtube_go">Play</button>
      </div>
      <div style="color:white;font-size:16px;">Live Shows</div>
      <div style="width:100%;height:calc(100% - 100px);overflow-y: auto; ">
      ${this.makeLiveShows()}
      <div style="clear:both;"></div>
      </div>
      </div>`;

      this.$container.append(stuff);

    }

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

				//alert('tube')


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
