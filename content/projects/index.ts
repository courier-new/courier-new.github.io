import { DateTime, Interval } from 'luxon';

/** Union of team size strings */
export type TeamSize = '1' | '2-5' | '5-10' | '10-15' | '15-20';

/** Type representing a project's details */
export type Project = {
  /** List of string sentences of accomplishments on the project */
  accomplishments: string[];
  /** Dates the project ran, as a form of Interval or single DateTime */
  dates:
    | Interval
    | DateTime
    | {
        /** If the project is ongoing */
        end: 'current';
        /** The start DateTime for an ongoing project */
        start: DateTime;
      };
  /** Image source (string) for project's logo */
  logo?: string;
  /** Optionally, the factor to scale the logo to normalize amongst the other
   * project logos */
  logoSizeFactor?: number;
  /** Name of the project */
  name: string;
  /** Accent color for this project */
  primaryColor: string;
  /** A sentence-length description of the project */
  shortDescription: string;
  /** List of single string tools used in the project */
  stack: string[];
  /** List of single string subject areas, high level tools, etc. as tags for
   * the project */
  tags: string[];
  /** Size of the project team */
  teamSize: TeamSize;
};

const PROJECTS: Project[] = [
  {
    accomplishments: [
      'Architected new chemical recommendations engine to scale to production-level reading processing capability',
      'Guided adoption of GraphQL APIs across all products in Sutro ecosystem',
      'Audited, overhauled, and maintained 80-page technical documentation',
      'Led refactor of app data layer, resulting in 50% fewer lines of dedicated state management code',
      'Reduced TypeScript compiler errors by 98% in large React Native codebase',
      'Rolled out command line tools to automate 90% of release tasks',
    ],
    dates: {
      end: 'current',
      start: DateTime.fromObject({ month: 7, year: 2019 }),
    },
    logo: '/images/svgs/SutroLogoIcon.svg',
    logoSizeFactor: 1.15,
    name: 'Sutro',
    primaryColor: '#005C67',
    shortDescription: 'Smart monitoring system for your pool or spa',
    stack: ['TypeScript', 'Elixir', 'GraphQL', 'React Native', 'PostgreSQL', 'AWS'],
    tags: ['IoT', 'Fullstack', 'API', 'Mobile', 'Data'],
    teamSize: '10-15',
  },
  {
    accomplishments: [
      'Transitioned more than 60% of web consumer features to new white-label mobile app',
      'Defined high level API and built out infrastructure for switching theme and data source for each sports team',
      'Delivered proof of concept system for dynamically categorized push notifications',
      'Onboarded and mentored other developers to grow team to 3x',
    ],
    dates: {
      end: 'current',
      start: DateTime.fromObject({ month: 6, year: 2018 }),
    },
    logo: '/images/svgs/RivalsLogoIcon.svg',
    logoSizeFactor: 1.3,
    name: 'Rivals',
    primaryColor: '#094EA3',
    shortDescription: 'Network for pre-professional sports news',
    stack: ['TypeScript', 'React Native', 'Redux', 'Firebase', 'Ruby on Rails'],
    tags: ['Mobile', 'Fullstack', 'Subscription'],
    teamSize: '15-20',
  },
  {
    accomplishments: [
      'Leveraged system of branded types to distinguish types of string data in app',
      'Supplied comprehensive JSDoc comments for all shared entities',
    ],
    dates: DateTime.fromObject({ month: 3, year: 2020 }),
    logo: '/images/pi.png',
    logoSizeFactor: 0.7,
    name: 'Pilon',
    primaryColor: '#ADADAD',
    shortDescription: 'Game for learning pi built for Pi Day 2020',
    stack: ['TypeScript', 'React', 'React Context', 'CSS-in-JS', 'Netlify'],
    tags: ['Personal', 'OSS'],
    teamSize: '1',
  },
  {
    accomplishments: [
      'Redesigned and built notification system API to support third-party integrations',
      'Automated invoice creation workflow with Quickbooks API',
      'Corrected inaccuracies and tricky edge cases in multiple invoice calculations',
      'Cut backlog of bugs reported by more than 80%',
    ],
    dates: Interval.fromDateTimes(
      DateTime.fromObject({ month: 11, year: 2017 }),
      DateTime.fromObject({ month: 6, year: 2018 }),
    ),
    logo: '/images/svgs/MomentLogoIcon.svg',
    logoSizeFactor: 0.75,
    name: 'Moment',
    primaryColor: '#2B4E56',
    shortDescription: 'Web app for time-keeping and invoicing',
    stack: ['Ruby on Rails', 'AngularJS', 'Sidekiq', 'Redis', 'Heroku', 'MySQL'],
    tags: ['Web', 'Fullstack', 'API'],
    teamSize: '5-10',
  },
  {
    accomplishments: [
      'Devised robust CSV upload and import tool using flexible entity-attribute-value model',
      'Incrementally converted 75% of a large React codebase to TypeScript',
      'Reconciled 50+ separate instances of modal UI components into a single modal with a unified API and global state',
    ],
    dates: Interval.fromDateTimes(
      DateTime.fromObject({ month: 1, year: 2018 }),
      DateTime.fromObject({ month: 6, year: 2018 }),
    ),
    logo: '/images/svgs/KPLogoIcon.svg',
    logoSizeFactor: 0.55,
    name: 'Kleiner-Perkins',
    primaryColor: '#000',
    shortDescription: 'Investment and client portfolio tool for identifying early growth',
    stack: [
      'Python',
      'Flask',
      'TypeScript',
      'React',
      'Redux',
      'Elasticsearch',
      'PostgreSQL',
      'Docker',
    ],
    tags: ['Web', 'Fullstack', 'Data'],
    teamSize: '5-10',
  },
  {
    accomplishments: [
      'Completed design and development of informational website 2 weeks ahead of schedule',
      'Eliminated the need for large physical schedule printouts by delivering CUWiP’s first mobile-first online schedule',
      'Facilitated meetings between the three academic host institutions and APS to solicit feedback and perform content research',
    ],
    dates: Interval.fromDateTimes(
      DateTime.fromObject({ month: 3, year: 2017 }),
      DateTime.fromObject({ month: 1, year: 2018 }),
    ),
    logo: '/images/aps.png',
    logoSizeFactor: 0.75,
    name: 'CUWiP 2018',
    primaryColor: '#7F2857',
    shortDescription: 'Website for conference for underrepresented physics students',
    stack: ['JS ES6+', 'Sass', 'Agile/Scrum', 'Mobile-First', 'Gulp'],
    tags: ['Web', 'Freelance', 'PM'],
    teamSize: '5-10',
  },
  {
    accomplishments: [
      'Led development from zero to release on web platform for internal communications and database server administration',
      "Designed and built a scalable, live dashboard interface of operational statistics of organization's physical infrastructure",
    ],
    dates: Interval.fromDateTimes(
      DateTime.fromObject({ month: 5, year: 2016 }),
      DateTime.fromObject({ month: 8, year: 2016 }),
    ),
    logo: '/images/svgs/EBayLogoIcon.svg',
    logoSizeFactor: 0.8,
    name: 'eBay',
    primaryColor: '#E63238',
    shortDescription: 'Internal monitoring tools for infrastructure services',
    stack: ['PHP', 'Wordpress', 'Agile/Scrum', 'Sass', 'AJAX', 'SSO'],
    tags: ['Web', 'PM', 'Data'],
    teamSize: '2-5',
  },
  {
    accomplishments: [
      'Designed websites, marketing materials, art pieces, infographics, and photomanipulations for diverse purposes and platforms',
      'Operated poster commission business and "Thiink" brand for a client-based design services',
    ],
    dates: Interval.fromDateTimes(
      DateTime.fromObject({ month: 6, year: 2007 }),
      DateTime.fromObject({ month: 1, year: 2018 }),
    ),
    name: 'Thiink',
    primaryColor: '#52632E',
    shortDescription: 'Freelance graphic design and custom poster service',
    stack: ['Adobe Photoshop', 'Adobe Illustrator', 'JS ES6+', 'Sass'],
    tags: ['Design', 'PM', 'Web'],
    teamSize: '1',
  },
];

export default PROJECTS;
