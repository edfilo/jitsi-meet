// @flow

import * as bodyPix from '@tensorflow-models/body-pix';

import {
    CLEAR_INTERVAL,
    INTERVAL_TIMEOUT,
    SET_INTERVAL,
    timerWorkerScript
} from './TimerWorker';

/**
 * Represents a modified MediaStream that adds blur to video background.
 * <tt>JitsiStreamBlurEffect</tt> does the processing of the original
 * video stream.
 */
export default class JitsiStreamBlurEffect {
    _bpModel: Object;
    _inputVideoElement: HTMLVideoElement;
    _onMaskFrameTimer: Function;
    _maskFrameTimerWorker: Worker;
    _maskInProgress: boolean;
    _outputCanvasElement: HTMLCanvasElement;
    _renderMask: Function;
    _segmentationData: Object;
    isEnabled: Function;
    startEffect: Function;
    stopEffect: Function;
    changeEffect: Function;

    /**
     * Represents a modified video MediaStream track.
     *
     * @class
     * @param {BodyPix} bpModel - BodyPix model.
     */
    constructor() {

      //  this._bpModel = bpModel;

        // Bind event handler so it is only bound once for every instance.
      //  this._onMaskFrameTimer = this._onMaskFrameTimer.bind(this);

        // Workaround for FF issue https://bugzilla.mozilla.org/show_bug.cgi?id=1388974
        //this._outputCanvasElement =  document.createElement('canvas');

        this._outputCanvasElement = document.getElementById('deepar-canvas');

        //createElement('canvas');

        // this causes terrible assembly crashes
        //this._ctx = this._outputCanvasElement.getContext('2d');
      //  this._outputCanvasElement.setAttribute('id','deepar-canvas');
      //  this._outputCanvasElement.className = 'deepar';

        this._inputVideoElement = document.createElement('video');


        this._effects = [

          'https://edsvbar.com/effects/aviators',
          'https://edsvbar.com/effects/beard',
          'https://edsvbar.com/effects/dumb',
          'https://edsvbar.com/effects/dalmatian',
          'https://edsvbar.com/effects/flowers',
          'https://edsvbar.com/effects/koala',
          'https://edsvbar.com/effects/lion',
          'https://edsvbar.com/effects/teddycigar'

        ];

        this._effectCounter = 0;

    }

    /**
     * EventHandler onmessage for the maskFrameTimerWorker WebWorker.
     *
     * @private
     * @param {EventHandler} response - The onmessage EventHandler parameter.
     * @returns {void}
     */

    _counter = 0;
    async _onMaskFrameTimer(response: Object) {
        if (response.data.id === INTERVAL_TIMEOUT) {
            if (!this._maskInProgress) {

              if(this._counter % 30 == 0) {
                //console.log('mask');
                //this._ctx =  this._outputCanvasElement.getContext("2d");
                // Add behind elements.
                //this._ctx.globalCompositeOperation = 'destination-over'
                // Now draw!
                //this._ctx.fillStyle = 'rgb(' + this._counter%250 + ',' + this._counter%50 + ',' + this._counter%100 + ')';
                //this._ctx.fillRect(0, 0, this._outputCanvasElement.width, this._outputCanvasElement.height);

              }

              this._counter++;

              //  await this._renderMask();
            }
        }
    }


    /**
     * Loop function to render the background mask.
     *
     * @private
     * @returns {void}
     */
     /*
    async _renderMask() {
        this._maskInProgress = true;
        this._segmentationData = await this._bpModel.segmentPerson(this._inputVideoElement, {
            internalResolution: 'medium', // resized to 0.5 times of the original resolution before inference
            maxDetections: 1, // max. number of person poses to detect per image
            segmentationThreshold: 0.7 // represents probability that a pixel belongs to a person
        });
        this._maskInProgress = false;
        bodyPix.drawBokehEffect(
            this._outputCanvasElement,
            this._inputVideoElement,
            this._segmentationData,
            12, // Constant for background blur, integer values between 0-20
            7 // Constant for edge blur, integer values between 0-20
        );
    }
*/

    /**
     * Checks if the local track supports this effect.
     *
     * @param {JitsiLocalTrack} jitsiLocalTrack - Track to apply effect.
     * @returns {boolean} - Returns true if this effect can run on the specified track
     * false otherwise.
     */
    isEnabled(jitsiLocalTrack: Object) {
        return jitsiLocalTrack.isVideoTrack() && jitsiLocalTrack.videoType === 'camera';
    }

    mixInImage() {

      const image1 = new Image();
      image1.src = 'img/image1.png';
      const ctx = this._outputCanvasElement.getContext('webgl');

      //debugger;
      ctx.drawImage(image1, 100, 100);

    }

    changeEffect() {

      console.log('CHANGE');
      this._effectCounter++;
      if(this._effectCounter >= this._effects.length) this._effectCounter = 0;

      //this.mixInImage();

        //this._deepAR.switchEffect(0, 'lion', 'https://edsvbar.com/effects/hair_segmentation', function() {
          // effect loaded
      //  });

      this._deepAR.switchEffect(0, 'slot', '/effects/dumb3', function() {
        // effect loaded
      });





      //this._deepAR.switchEffect(0, 'slot', this._effects[this._effectCounter], function() {

      //});

      return true;

    }

    /**
     * Starts loop to capture video frame and render the segmentation mask.
     *
     * @param {MediaStream} stream - Stream to be used for processing.
     * @returns {MediaStream} - The stream with the applied effect.
     */

    startEffect(stream: MediaStream) {

      //this._maskFrameTimerWorker = new Worker(timerWorkerScript, { name: 'Blur effect worker' });
      //  this._maskFrameTimerWorker.onmessage = this._onMaskFrameTimer;

        console.log('*** starting effect ****');
        const firstVideoTrack = stream.getVideoTracks()[0];
        const { height, frameRate, width }
            = firstVideoTrack.getSettings ? firstVideoTrack.getSettings() : firstVideoTrack.getConstraints();

        //this._outputCanvasElement.width = parseInt(width, 10);
        //this._outputCanvasElement.height = parseInt(height, 10);
        this._inputVideoElement.width = parseInt(width, 10);
        this._inputVideoElement.height = parseInt(height, 10);
        this._inputVideoElement.autoplay = true;
        this._inputVideoElement.srcObject = stream;
        this._inputVideoElement.onloadeddata = () => {

          //  this._maskFrameTimerWorker.postMessage({
              //  id: SET_INTERVAL,
              //  timeMs: 1000 / parseInt(frameRate, 10)
          //  });

        };

        this._deepAR = DeepAR({
                canvasWidth: 640,
                canvasHeight: 360,
                licenseKey: '0c9b0922576ac747bce897c5007ed4084cafafb6d2fee1ebb409f3d4d995513218678323828fb3a0',
                canvas: this._outputCanvasElement,
                //document.getElementById('deepar-canvas'),
                numberOfFaces: 1,
                onInitialize: function() {



                  //debugger;

                  // start video immediately after the initalization, mirror = true
                  this._deepAR.startVideo(false);
                  // or we can setup the video element externally and call deepAR.setVideoElement (see startExternalVideo function below)

                  //this._deepAR.setVideoElement(this._inputVideoElement, false);

                  this._deepAR.switchEffect(0, 'slot', '/effects/smoke', function() {
                    // effect loaded
                  });
                    //debugger;

                }.bind(this)
        });




        this._deepAR.downloadFaceTrackingModel('/deepar/models-68-extreme.bin');





        const output = this._outputCanvasElement.captureStream(parseInt(frameRate, 10));

        //this._deepAR.setVideoElement(this._inputVideoElement, true);



        return  output;
    }

    /**
     * Stops the capture and render loop.
     *
     * @returns {void}
     */
    stopEffect() {

      //  this._maskFrameTimerWorker.postMessage({
          //  id: CLEAR_INTERVAL
      //  });

      //  this._maskFrameTimerWorker.terminate();


    }
}
