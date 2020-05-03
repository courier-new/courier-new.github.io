import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import { DateTime, Interval } from 'luxon';

export const VIRTUAL = 'Virtual';
export const CANCELLED = 'Cancelled';
export const PASSED = 'Passed';
export const NOW = 'Happening Now';
export const NEXT = 'Next Up';

/** Type representing a conference's details */
export type Conference = {
  // TODO: Add location/url branded string types
  /** When the conference occurred, either as a single DateTime or an Interval */
  date: DateTime | Interval;
  /** A label about the time-based status of the conference, e.g. "Passed"; will
   * be automatically generated by addDateLabels() */
  dateLabel?: string;
  /** Any optional label about the conference, e.g. "Cancelled"; will overwrite
   * the date label in the display */
  label?: string;
  /** Where the conference occurred */
  location: string;
  /** The display name for the conference */
  name: string;
  /** The website URL for the conference */
  website: string;
};

/**
 * Returns whether or not the provided conference has passed based on the date
 * or end date, in the case of an Interval date
 *
 * @param conference the conference to check
 */
export const hasPassed = (conference: Conference): boolean => {
  if (Interval.isInterval(conference.date)) {
    return conference.date.end.startOf('day') < DateTime.local().startOf('day');
  }
  return conference.date.startOf('day') < DateTime.local().startOf('day');
};

/**
 * Returns whether or not the provided conference is currently happening based
 * on the date, or based on the start and end date, in the case of a multi-day
 * conference date Interval
 *
 * @param conference the conference to check
 */
export const isCurrentlyHappening = (conference: Conference): boolean => {
  if (Interval.isInterval(conference.date)) {
    return (
      conference.date.start.startOf('day') < DateTime.local() &&
      conference.date.end.endOf('day') > DateTime.local()
    );
  }
  return (
    conference.date.hasSame(DateTime.local(), 'day') &&
    conference.date.hasSame(DateTime.local(), 'month') &&
    conference.date.hasSame(DateTime.local(), 'year')
  );
};

/**
 * Orders a list of conferences by their dates from earliest to latest,
 * taking a conference start date in the case of multi-day conference Intervals
 *
 * @param conferences the list of conferences to sort
 */
export const sortByDate = (conferences: Conference[]): Conference[] => {
  return sortBy(conferences, (conference) => {
    if (Interval.isInterval(conference.date)) {
      return conference.date.start;
    }
    return conference.date;
  });
};

/**
 * Checks the date status of each Conference (passed, is happening now, is
 * happening next) and applies an appropriate dateLabel to it, giving priority
 * to any dateLabel already applied to the Conference
 *
 * @param conferences the list of conferences to apply labels to
 */
export const addDateLabels = (conferences: Conference[]): Conference[] => {
  return map(conferences, (conference, index) => {
    let dateLabel = '';
    const conferenceHasPassed = hasPassed(conference);
    if (conferenceHasPassed) {
      dateLabel = PASSED;
    } else if (isCurrentlyHappening(conference)) {
      dateLabel = NOW;
    } else if (
      !conferenceHasPassed &&
      index - 1 >= 0 &&
      hasPassed(conferences[index - 1])
    ) {
      dateLabel = NEXT;
    }
    return {
      // Allow the current Conference dateLabel property to overwrite this
      dateLabel,
      ...conference,
    };
  });
};
