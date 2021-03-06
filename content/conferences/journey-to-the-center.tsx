import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import Link from 'next/link';
import React, { FC } from 'react';
import { BsArrowRight } from 'react-icons/bs';

import { CANCELLED, Conference, hasPassed } from '../../api/conferences';
import useDisplaySize from '../../common/hooks/useDisplaySize';
import generateTitleProps from '../utilities/for-content';
import { ContentSection } from '../utilities/types';

/**
 * Tallies how many conferences I have attended based on the following criteria:
 * 1) The conference was not cancelled
 * 2) The conference finished happening
 * Plus 4 for past CUWiPS.
 *
 * @param conferences the list or list of lists of Conferences to count
 */
const countConferencesAttended = (conferences: Conference[] | Conference[][]): number =>
  filter(flatten(conferences), (conference) => {
    if (conference.label === CANCELLED) return false;
    return hasPassed(conference);
  }).length + 4; // Add 4 for CUWiPs

/**
 * The content for the Journey-to-the-center section of the Conferences page
 *
 * @param props the functional component props
 * @param props.conferences array of `Conference`s to render
 */
const JourneyContent: FC<{ conferences: Conference[] }> = ({ conferences }) => {
  const [displaySize] = useDisplaySize();

  let twoColumns = true;
  let statWidth: 'small' | 'large' = 'small';
  if (displaySize === 'MOBILE' || displaySize === 'SMALL') {
    twoColumns = false;
    statWidth = 'large';
  }

  let paddingClass = '';
  switch (displaySize) {
    case 'MEDIUM':
      paddingClass = 'padding-med-left';
      break;
    case 'LARGE':
      paddingClass = 'padding-lg-left';
      break;
    case 'XLARGE':
      paddingClass = 'padding-xl-left';
      break;
    default:
      break;
  }

  return (
    <React.Fragment key="journey">
      <div className={twoColumns ? 'flex-row' : 'flex-column'}>
        <div className="flex-column" style={{ flexShrink: 2 }}>
          {/* Margin behaves differently in flex-box and margins below h3 and above
          paragraphs are not merged */}
          <h3 className="margin-0-bottom">My personal roadmap</h3>
          {/* Maintain padding between this column and the section beneath it, which
          is raised up with negative margin */}
          <p className={twoColumns ? 'padding-lg-bottom' : ''}>
            I attended my first tech conference in August of 2019. Since then, I’ve been
            documenting my personal conferences roadmap, cataloguing the conferences I
            attend, the resources I enjoy, and the challenges of navigating this space as
            a diffident introvert.
          </p>
        </div>
        <div
          className={`flex-column ${paddingClass} padding-med-bottom`}
          // Enforce minimum width but allow expansion on larger screens
          style={{ flexBasis: '50%', minWidth: 220 }}
        >
          {/* Margin behaves differently in flex-box and margins below h3 and above
          paragraphs are not merged */}
          <h3 className="margin-0-bottom">Conference stats</h3>
          <ul className="padding-0-h no-default-bullets">
            <ConferenceStat
              stat={countConferencesAttended(conferences)}
              statClass="text-raspberry"
              statLabel="attended"
              statWidth={statWidth}
            />
            <ConferenceStat
              stat={1}
              statClass="text-cheddar"
              statLabel="organized for"
              statWidth={statWidth}
            />
            <ConferenceStat
              stat={1}
              statClass="text-turquoise"
              statLabel="volunteered at"
              statWidth={statWidth}
            />
            <ConferenceStat
              stat={0}
              statClass="text-space"
              statLabel="spoken at*"
              statWidth={statWidth}
            />
          </ul>
          <span className="text-align-right xsmall">* ...yet ;)</span>
        </div>
      </div>
      {/* Raise up this section in two column orientation to cut down on whitespace */}
      <div style={{ marginTop: twoColumns ? '-2em' : undefined }}>
        <h3 className="margin-0-top">Resources and info</h3>
        {/* Arrow style needs to be global since it's nested in Link */}
        <style global jsx>
          {`
            a svg.arrow {
              transition: padding 100ms ease 0s;
            }

            a:hover svg.arrow {
              transition: padding 300ms ease 0s;
              padding-left: 1.5em;
            }

            .unavailable {
              cursor: not-allowed;
            }
          `}
        </style>
        <Link href="/conferences/why-I-love-conferences">
          <a
            className="karla flex-row flex-align-center no-box-shadow"
            title="Why do I love conferences?"
          >
            Why do I love conferences?
            <BsArrowRight className="arrow text-space padding-sm-left" />
          </a>
        </Link>
        <span className="unavailable margin-sm-top minimum-opacity flex-wrap flex-row flex-align-center">
          <a className="karla flex-row flex-1 flex-align-center flex-wrap no-box-shadow">
            <span className="karla text-space">Resources for conference-goers </span>
            <BsArrowRight className="text-space padding-sm-h" />
            <span className="karla xsmall text-space">(Coming soon!)</span>
          </a>
        </span>
      </div>
    </React.Fragment>
  );
};

type ConferenceStatProps = {
  /** The actual stat number */
  stat: number;
  /** The class (for color) to apply to the stat number */
  statClass: string;
  /** The label for the stat */
  statLabel: string;
  /** The size for the box containing the stat number, to change spacing */
  statWidth: 'small' | 'large';
};

/**
 * A component that builds an <li> for a given stat about conference
 * participation
 *
 * @param props the functional component props
 * @param props.stat the actual stat number
 * @param props.statClass the class (for color) to apply to the stat number
 * @param props.statLabel the label for the stat
 * @param props.statWidth the size for the box containing the stat number, to
 * change spacing
 */
const ConferenceStat: FC<ConferenceStatProps> = ({
  stat,
  statClass,
  statLabel,
  statWidth,
}) => (
  <li className="flex-row flex-align-center">
    <h2
      className={`${statClass} margin-0 padding-0 text-align-center yeseva-one`}
      style={{ lineHeight: '1.4em', width: statWidth === 'small' ? 40 : 80 }}
    >
      {stat}
    </h2>
    <span className="large">{statLabel}</span>
  </li>
);

/**
 * Builder for journey to the center content
 *
 * @param conferences array of `Conference`s to use to render the section content
 */
const buildJourneyToTheCenter = (
  conferences: Conference[],
): ContentSection<'Journey to the center of the community', JSX.Element> => ({
  ...generateTitleProps('Journey to the center of the community'),
  content: <JourneyContent conferences={conferences} key="journey" />,
});

export default buildJourneyToTheCenter;
