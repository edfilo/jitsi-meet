// @flow

import { getParticipants } from '../base/participants';

import { YOUTUBE_PARTICIPANT_NAME } from './constants';

/**
 * Returns true if there is a youtube video being shaerd in the meeting.
 *
 * @param {Object | Function} stateful - The Redux state or a function that gets resolved to the Redux state.
 * @returns {boolean}
 */
export function isYoutubeVideoPlaying(stateful: Object | Function): boolean {



  const parts = getParticipants(stateful);




    return Boolean(parts.find(p => p.isFakeParticipant && p.name === YOUTUBE_PARTICIPANT_NAME));
}
