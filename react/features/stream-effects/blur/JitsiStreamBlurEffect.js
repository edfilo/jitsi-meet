// @flow

//import * as bodyPix from '@tensorflow-models/body-pix';
//import { RecordingAdapter } from './RecordingAdapter';
import { Filter } from './filter'


/**
 * Represents a modified MediaStream that adds blur to video background.
 * <tt>JitsiStreamBlurEffect</tt> does the processing of the original
 * video stream.
 */
export default class JitsiStreamBlurEffect {
    _bpModel: Object;
    _inputVideoElement: HTMLVideoElement;
    _inputVideoCanvasElement: HTMLCanvasElement;
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
    constructor(fx) {


      this.fx = fx;


      this._outputCanvasElement = document.createElement('CANVAS');   // Create a <button> element
      this._outputCanvasElement.id = 'new-deepar-canvas'


      document.getElementById('localVideoWrapper').appendChild(this._outputCanvasElement);


            this._outputCanvasElement.style.zIndex = 2;
            this._outputCanvasElement.style.width = '100%';
            this._outputCanvasElement.style.height = '100%';
            this._outputCanvasElement.style.position = 'absolute';
            this._outputCanvasElement.style.top = '0px';
            this._outputCanvasElement.style.left = '0px';
            this._outputCanvasElement.style.objectFit =  'cover';


      //  <canvas style="z-index: 1999;border-radius: 5;position:absolute;" class="deepar" id="deepar-canvas" oncontextmenu="event.preventDefault()"></canvas>


    }

    /**
     * EventHandler onmessage for the maskFrameTimerWorker WebWorker.
     *
     * @private
     * @param {EventHandler} response - The onmessage EventHandler parameter.
     * @returns {void}
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




    applyFX(fx: Array){

      this.filter.applyFX(fx);

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




        const firstVideoTrack = stream.getVideoTracks()[0];
        const { height, frameRate, width }
            = firstVideoTrack.getSettings ? firstVideoTrack.getSettings() : firstVideoTrack.getConstraints();


        this.filter = new Filter(360, 360, this._outputCanvasElement, this.fx, false);


      //  this._outputCanvasElement.setAttribute('oncontextmenu':'event.preventDefault()');

        //oncontextmenu="event.preventDefault()"

        const output = this._outputCanvasElement.captureStream(parseInt(frameRate, 10));


        return  output;
    }

    /**
     * Stops the capture and render loop.
     *
     * @returns {void}
     */
    stopEffect() {



    }
}
