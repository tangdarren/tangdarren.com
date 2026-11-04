/**
 * "More photos": moments outside the timeline. Files live in public/gallery/
 * (resized to 1600px on the long edge, EXIF and location data stripped).
 */

export type GalleryItem =
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'video'; src: string; poster: string; alt: string; width: number; height: number };

export interface GalleryMoment {
  id: string;
  title: string;
  items: GalleryItem[];
}

export const GALLERY: GalleryMoment[] = [
  {
    id: 'meta',
    title: 'Visiting Meta',
    items: [
      {
        type: 'image',
        src: '/gallery/meta-2.jpg',
        alt: 'Darren pointing up at the Meta Connect 2026 screen on the Meta campus.',
        width: 1200,
        height: 1600,
      },
      {
        type: 'image',
        src: '/gallery/meta-1.jpg',
        alt: 'A friend photographing Darren posing in front of the Meta Connect 2026 screen.',
        width: 1200,
        height: 1600,
      },
    ],
  },
  {
    id: 'tesla',
    title: 'Visiting the Tesla factory',
    items: [
      {
        type: 'image',
        src: '/gallery/tesla-2.jpg',
        alt: 'Rows of Teslas parked in front of the Tesla factory building.',
        width: 1200,
        height: 1600,
      },
      {
        type: 'image',
        src: '/gallery/tesla-1.jpg',
        alt: 'A Model Y body-in-white on display beside a red robotic arm and an Optimus robot.',
        width: 1600,
        height: 1200,
      },
    ],
  },
  {
    id: 'hiking',
    title: 'Hiking',
    items: [
      {
        type: 'image',
        src: '/gallery/hiking-1.jpg',
        alt: 'Selfie of Darren on a hillside trail above the South Bay.',
        width: 1600,
        height: 1200,
      },
      {
        type: 'image',
        src: '/gallery/hiking-2.jpg',
        alt: 'Darren smiling in front of green rolling hills under a clear sky.',
        width: 1200,
        height: 1600,
      },
    ],
  },
  {
    id: 'debate',
    title: 'Debate in high school',
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
        src: '/gallery/debate-2.jpg',
        alt: 'The debate team posing with their trophies after a tournament.',
        width: 870,
        height: 649,
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
];

export const GALLERY_COUNT = GALLERY.reduce((sum, moment) => sum + moment.items.length, 0);
