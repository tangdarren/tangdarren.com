/**
 * "More photos": moments outside the timeline. Files live in public/gallery/
 * (resized to 1600px on the long edge, EXIF and location data stripped).
 */

interface GalleryMedia {
  alt: string;
  width: number;
  height: number;
  /** What stays in frame when the row crops this photo (CSS object-position). */
  position?: string;
}

export type GalleryItem =
  | (GalleryMedia & { type: 'image'; src: string })
  | (GalleryMedia & { type: 'video'; src: string; poster: string });

export interface GalleryMoment {
  id: string;
  title: string;
  /** Row width ÷ height, to make this section taller than the shared row. */
  rowAspect?: number;
  items: GalleryItem[];
}

/**
 * Ordered for a recruiter: industry, building, leadership, then personal.
 * A photo's width follows its shape, so item order sets which side the bigger
 * one lands on. Keep it alternating down the page: right, left, right, left.
 */
export const GALLERY: GalleryMoment[] = [
  {
    id: 'meta',
    title: 'Visiting Meta',
    rowAspect: 2.6,
    items: [
      {
        type: 'image',
        src: '/gallery/meta-2.jpg',
        alt: 'Darren pointing up at the Meta Connect 2026 screen on the Meta campus.',
        width: 1200,
        height: 1427,
        position: 'bottom',
      },
      {
        type: 'image',
        src: '/gallery/meta-1.jpg',
        alt: 'A friend photographing Darren posing in front of the Meta Connect 2026 screen.',
        width: 1200,
        height: 933,
        position: 'center 40%',
      },
    ],
  },
  {
    id: 'projects',
    title: 'Early experiments',
    items: [
      {
        type: 'video',
        src: '/gallery/project-physics.mp4',
        poster: '/gallery/project-physics-poster.jpg',
        alt: 'Darren testing a physics project on the sidewalk.',
        width: 960,
        height: 544,
      },
      {
        type: 'image',
        src: '/gallery/project-robot.jpg',
        alt: 'A LEGO Mindstorms EV3 robot and its parts laid out on a lab bench next to a laptop.',
        width: 1600,
        height: 1200,
      },
    ],
  },
  {
    id: 'debate',
    title: 'High school debate',
    items: [
      {
        type: 'image',
        src: '/gallery/debate-1.jpg',
        alt: 'Darren speaking in a debate round for Mission San Jose.',
        width: 1483,
        height: 832,
      },
      {
        type: 'image',
        src: '/gallery/teaching-1.jpg',
        alt: 'Volunteer coaches at the front of a classroom presenting a "Structure of Debate" slide to students with laptops.',
        width: 1600,
        height: 766,
      },
    ],
  },
  {
    id: 'volunteer',
    title: "President's Volunteer Service Award",
    items: [
      {
        type: 'image',
        src: '/gallery/volunteer-1.jpg',
        alt: "Darren's 2019 Gold certificate for the President's Volunteer Service Award, for 250 hours of service, with its medallion.",
        width: 1600,
        height: 1200,
        position: 'center 33%',
      },
      {
        type: 'image',
        src: '/gallery/volunteer-2.jpg',
        alt: "The award's White House congratulations letter, envelope addressed to Darren, certificate and medallion laid out on a table.",
        width: 1200,
        height: 1600,
      },
    ],
  },
  {
    id: 'hiking',
    title: 'Hiking',
    items: [
      {
        type: 'image',
        src: '/gallery/hiking-2.jpg',
        alt: 'Darren smiling in front of green rolling hills under a clear sky.',
        width: 1200,
        height: 1600,
      },
      {
        type: 'image',
        src: '/gallery/hiking-1.jpg',
        alt: 'Selfie of Darren and a friend on a grassy ridge, with hikers on the trail and the South Bay behind them.',
        width: 1600,
        height: 1200,
      },
    ],
  },
  {
    id: 'basketball',
    title: 'Basketball',
    items: [
      {
        type: 'image',
        src: '/gallery/basketball-1.jpg',
        alt: 'A packed Chase Center seen from the upper deck, with the court far below and the scoreboard overhead.',
        width: 1600,
        height: 1200,
      },
      {
        type: 'image',
        src: '/gallery/basketball-2.jpg',
        alt: 'Group photo at center court of a gym, with players holding a basketball and colored balls.',
        width: 1170,
        height: 1225,
      },
    ],
  },
];

export const GALLERY_COUNT = GALLERY.reduce((sum, moment) => sum + moment.items.length, 0);
