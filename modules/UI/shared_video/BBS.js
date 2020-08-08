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
export default class BBS extends SmallVideo {
    /**
     *
     * @param {*} participant
     * @param {*} videoType
     * @param {*} VideoLayout
     */
    constructor(participant, videoType, VideoLayout) {
        super(VideoLayout);
        this.boost = 2.0;
        this.padding = 25.0;
        this.x = 10 + 20 * Math.random();
        this.y = 10 + 20 * Math.random();
        this.id = participant.id;
        this.isLocal = false;
        this.url = participant.id;
        this.videoSpanId = 'bbsContainer';
        this.container = this.createContainer(this.videoSpanId);
        this.$container = $(this.container);
        this._setThumbnailSize();
        this.bindHoverHandler();
        this.isVideoMuted = true;
      //  this.updateDisplayName();
        this.container.onclick = this._onContainerClick;
        this.container.onmousemove = this._onMouseMove;
        this.setupUI();
        console.log('shared constructor mypadding is' + this.padding);
    }


    setupUI() {


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
        youtube.id = 'bbs';

        //avatar.src = `https://img.youtube.com/vi/${this.url}/0.jpg`;

        console.log('joker comics  seting innerhtml to app.ui.bbs which is '+ APP.UI.bbs);



        youtube.innerHTML = APP.UI.bbs;

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


}
