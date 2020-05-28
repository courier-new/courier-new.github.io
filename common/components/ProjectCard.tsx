import map from 'lodash/map';
import { DateTime, Interval } from 'luxon';
import React, { FC } from 'react';
import { AiFillCalendar } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';

import { Project } from '../../content/projects';
import Tag from './Tag';

const LOGO_SIZE = 70;

type ProjectCardProps = Project & {
  /** Overall size of the tags featured in this card */
  tagSize: 'small' | 'medium';
  /** String specification for spacing between tags featured in this card */
  tagSpacing: string;
};

/**
 * Formats a project date by its month and year.
 *
 * @param date the DateTime or Interval to format
 */
const formatDate = (
  date: Interval | DateTime | { end: 'current'; start: DateTime },
): string => {
  if (Interval.isInterval(date)) {
    return `${date.start.toFormat('LLL y')} - ${date.end.toFormat('LLL y')}`;
  }
  if (DateTime.isDateTime(date)) {
    return date.toFormat('LLL y');
  }
  return `${date.start.toFormat('LLL y')} - Current`;
};

/**
 * A mobile-oriented (vertical) project card block detailing info about a Project
 */
const VerticalProjectCard: FC<ProjectCardProps> = ({
  accomplishments,
  dates,
  logo,
  logoSizeFactor,
  name,
  primaryColor,
  shortDescription,
  stack,
  tagSize,
  tagSpacing,
  tags,
  teamSize,
}) => {
  const logoComponent = logo ? (
    <div className="relative width-0 height-0">
      <img
        alt={`${name} logo`}
        className="absolute"
        src={logo}
        style={{
          height: (logoSizeFactor || 1) * LOGO_SIZE,
          left: (-(logoSizeFactor || 1) * LOGO_SIZE) / 2,
          top: (-(logoSizeFactor || 1) * LOGO_SIZE) / 2,
          width: (logoSizeFactor || 1) * LOGO_SIZE,
        }}
      />
    </div>
  ) : (
    <PlaceholderLogo color={primaryColor} letter={name.charAt(0)} />
  );

  return (
    <div className="full-height full-width flex-column" key={`project-${name}`}>
      <div
        className="padding-med"
        id="project-card-heading"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Row of logo, name, and description */}
        <div className="flex-row padding-sm-bottom flex-justify-start flex-align-start">
          <div
            className="flex-row flex-align-center flex-justify-center background-white circular margin-sm-top"
            style={{ color: primaryColor, height: LOGO_SIZE, width: LOGO_SIZE }}
          >
            {logoComponent}
          </div>
          {/* Column of name and description */}
          <div className="flex-column padding-sm-left flex-1">
            <h1
              className="karla font-bold text-white"
              style={{ lineHeight: 1, margin: '0.2em 0' }}
            >
              {name}
            </h1>
            <p className="margin-0 text-white">{shortDescription}</p>
          </div>
        </div>
        {/* Rows of team and dates */}
        <div className="flex-row flex-align-center padding-xs-bottom">
          <BsFillPeopleFill className="text-white padding-xs-right" size="1.8em" />
          <span className="text-white large">{teamSize}</span>
        </div>
        <div className="flex-row flex-align-center padding-med-bottom">
          <AiFillCalendar className="text-white padding-xs-right" size="1.8em" />
          <span className="text-white large">{formatDate(dates)}</span>
        </div>
        {/* Row of tags */}
        <div className="flex-row flex-align-center flex-wrap">
          {map(tags, (tag) => (
            <Tag
              backgroundColorClass="background-high-opacity"
              key={tag}
              size={tagSize}
              spacing={tagSpacing}
            >
              <span className="karla" style={{ color: primaryColor }}>
                #{tag}
              </span>
            </Tag>
          ))}
        </div>
      </div>
      <div className="background-white padding-med flex-1">
        <h3 className="text-black margin-0 padding-sm-bottom">Stack</h3>
        <div className="flex-row flex-align-center flex-wrap padding-sm-bottom">
          {map(stack, (tool) => (
            <Tag key={tool} size={tagSize} spacing={tagSpacing}>
              {tool}
            </Tag>
          ))}
        </div>
        <h3 className="text-black margin-0 padding-sm-bottom">Accomplishments</h3>
        {map(accomplishments, (accomplishment) => (
          <p className="margin-0-top margin-sm-bottom" key={accomplishment.substr(0, 15)}>
            {accomplishment}
          </p>
        ))}
      </div>
    </div>
  );
};

type PlaceholderLogoProps = {
  /** The color of placeholder logo to show */
  color: string;
  /** The letter to display as the placeholder */
  letter: string;
};

/** A component to render for a project with no logo */
const PlaceholderLogo: FC<PlaceholderLogoProps> = ({ color, letter }) => (
  <span style={{ color, fontSize: 55, lineHeight: LOGO_SIZE }}>{letter}</span>
);

/** A project card block */
const ProjectCard: FC<ProjectCardProps & { orientation: 'vertical' | 'horizontal' }> = ({
  orientation,
  ...props
}) => (orientation === 'horizontal' ? null : <VerticalProjectCard {...props} />);

export default ProjectCard;