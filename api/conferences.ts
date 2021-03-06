import { gql } from 'graphql-request';
import flow from 'lodash/flow';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { QueryObserverResult, useQuery, UseQueryOptions } from 'react-query';

import request from './client';

export const CANCELLED = 'CANCELLED';
export const NOW = 'HAPPENING NOW';
export const NEXT = 'NEXT UP';

type PartialConference = {
  /** Unique id for the conference */
  _id: string;
  /** If the conference is one that I really enjoy or look forward to */
  favorite: boolean;
  /** Any optional label about the conference, e.g. "Cancelled"; will overwrite
   * the `Conference` date label in the display */
  label?: string;
  /** Where the conference occurred */
  location: string;
  /** The display name for the conference */
  name: string;
  /** The website URL for the conference */
  website: string;
};

type RawConference = PartialConference & {
  /** When the conference ended, if it spanned more than one day, in the format
   * "YYYY-MM-DD" */
  endDate: string | null;
  /** When the conference began, in the format "YYYY-MM-DD" */
  startDate: string;
};

/** Type representing a conference's details */
export type Conference = PartialConference & {
  // TODO: Add location/url branded string types
  /** A label about the time-based status of the conference, e.g. "Passed"; will
   * be automatically generated by addDateLabels() */
  dateLabel?: string;
  /** When the conference ended, if it spanned more than one day */
  endDate: DateTime | null;
  /** When the conference began */
  startDate: DateTime;
};

export const CONFERENCES_CACHE_KEYS = {
  getConferences: '@conferences/get-conferences',
};

/** Raw response type of getConferences query */
export type GetConferencesRawResponse = {
  /** Page of conferences */
  conferences: {
    /** The conferences themselves */
    data: RawConference[];
  };
};

/** Response type of getConferences query after date conversion */
export type GetConferencesResponse = {
  /** Page of conferences */
  conferences: {
    /** The conferences themselves */
    data: Conference[];
  };
};

/**
 * Transforms the query `response` dates from strings to `DateTime`s that are
 * easier to operate with
 *
 * @param response the raw query response with conferences whose dates are
 * unconverted
 */
export const convertRawDates = (
  response: GetConferencesRawResponse,
): GetConferencesResponse => ({
  ...response,
  conferences: {
    data: map(response.conferences.data, (conference) => ({
      ...conference,
      endDate: conference.endDate
        ? DateTime.fromFormat(conference.endDate, 'y-MM-dd')
        : null,
      startDate: DateTime.fromFormat(conference.startDate, 'y-MM-dd'),
    })),
  },
});

/** Query conferences I am participating in */
export const getConferences = (): Promise<GetConferencesRawResponse> =>
  request<GetConferencesRawResponse>(
    'FAUNADB',
    gql`
      query {
        conferences {
          data {
            _id
            startDate
            endDate
            label
            location
            name
            website
          }
        }
      }
    `,
  );

/**
 * Hook to query the conferences I am participating in, which is cached
 * for 24 hours
 *
 * @param options (optional) any `UseQueryOptions` to apply to this query
 */
export const useConferences = (
  options?: UseQueryOptions<GetConferencesRawResponse>,
): QueryObserverResult<GetConferencesRawResponse, unknown> =>
  useQuery(CONFERENCES_CACHE_KEYS.getConferences, getConferences, {
    cacheTime: 1000 * 60 * 60 * 24,
    // an hour
    staleTime: 0,
    ...options,
  });

/**
 * Returns whether or not the provided conference has passed based on the date
 * or end date, in the case of an Interval date
 *
 * @param conference the conference to check
 */
export const hasPassed = (conference: Conference): boolean => {
  if (conference.endDate) {
    return conference.endDate.startOf('day') < DateTime.local().startOf('day');
  }
  return conference.startDate.startOf('day') < DateTime.local().startOf('day');
};

/**
 * Returns whether or not the provided conference is currently happening based
 * on the date, or based on the start and end date, in the case of a multi-day
 * conference date Interval
 *
 * @param conference the conference to check
 */
export const isCurrentlyHappening = (conference: Conference): boolean => {
  if (conference.endDate) {
    return (
      conference.startDate.startOf('day') < DateTime.local() &&
      conference.endDate.endOf('day') > DateTime.local()
    );
  }
  return (
    conference.startDate.hasSame(DateTime.local(), 'day') &&
    conference.startDate.hasSame(DateTime.local(), 'month') &&
    conference.startDate.hasSame(DateTime.local(), 'year')
  );
};

/**
 * Orders a list of conferences by their dates from earliest to latest, taking a
 * conference start date in the case of multi-day conference Intervals
 *
 * @param conferences the list of conferences to sort
 * @param reverseDate whether to reverse sort conferences from latest to
 * earliest instead
 */
export const sortByDate = (
  conferences: Conference[],
  reverseDate = false,
): Conference[] => {
  const sorted = sortBy(conferences, 'startDate');
  if (reverseDate) return reverse(sorted);
  return sorted;
};

/**
 * Applies a label of "happening now" to any conferences that are currently
 * happening and "next up" to any conferences on or starting on the next closest
 * date
 *
 * @param conferences the list of conferences, sorted from earliest to latest
 */
export const addNextUpLabels = (conferences: Conference[]): Conference[] => {
  let nextUpDate: DateTime | null = null;
  return reduce(
    conferences,
    (acc: Conference[], conference: Conference) => {
      let dateLabel: string | undefined;

      if (isCurrentlyHappening(conference)) {
        dateLabel = NOW;
      } else if (nextUpDate && nextUpDate.equals(conference.startDate)) {
        dateLabel = NEXT;
      } else if (!nextUpDate) {
        dateLabel = NEXT;
        nextUpDate = conference.startDate;
      }
      return [
        ...acc,
        {
          // Allow the current Conference dateLabel property to overwrite this
          dateLabel,
          ...conference,
        },
      ];
    },
    [],
  );
};

type ConferencesKeyedByYear = { [year: string]: Conference[] };
type ConferencesDiscriminatedArray = { conferences: Conference[]; year: string }[];

/**
 * Groups conferences by year and returns them in an array of objects
 * distinguishable by their `year` property sorted from latest year to earliest
 * year, e.g. [{ year: 2020, conferences: [] }, { year: 2019, conferences: [] },
 * ...]
 *
 * @param conferences the list of conferences to restructure and group
 */
export const groupByYears = (
  conferences: Conference[],
): ConferencesDiscriminatedArray => {
  return flow(
    // Group conferences by date as a key
    (c: Conference[]): ConferencesKeyedByYear => groupBy(c, 'startDate.year'),
    // Restructure to array of objects with year key as an object property
    (c: ConferencesKeyedByYear): ConferencesDiscriminatedArray =>
      map(c, (conferencesForYear, year) => ({
        conferences: conferencesForYear,
        year,
      })),
    // Sort array by year from latest -> earliest
    (c: ConferencesDiscriminatedArray): ConferencesDiscriminatedArray =>
      sortBy(c, ({ year }) => -parseInt(year, 10)),
  )(conferences);
};
