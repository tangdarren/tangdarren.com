'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from 'react';

import { GALLERY } from '@/data/gallery';

import styles from './PhotoGallery.module.css';

export interface PhotoGalleryHandle {
  open: () => void;
}

/**
 * Full-screen "More photos" view. A native modal <dialog> gives focus
 * trapping, Escape to close, and focus return to the opening button.
 */
const PhotoGallery = forwardRef<PhotoGalleryHandle>(function PhotoGallery(_, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      document.documentElement.style.overflow = 'hidden';
    },
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Restore page scroll and stop any playing video when the gallery closes.
    const onClose = () => {
      document.documentElement.style.overflow = '';
      dialog.querySelectorAll('video').forEach((video) => video.pause());
    };
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="gallery-title">
      <div className={styles.bar}>
        {/* Focus lands on the title, not the close button, so no ring flashes on open. */}
        <h2 id="gallery-title" className={styles.title} tabIndex={-1} autoFocus>More photos</h2>
        <button
          type="button"
          className={styles.close}
          onClick={() => dialogRef.current?.close()}
          aria-label="Close photos"
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        {GALLERY.map((moment) => (
          <section key={moment.id} className={styles.moment} aria-labelledby={`gallery-${moment.id}`}>
            <h3 id={`gallery-${moment.id}`} className={styles.momentTitle}>{moment.title}</h3>
            <div className={styles.grid}>
              {moment.items.map((item) =>
                item.type === 'video' ? (
                  <video
                    key={item.src}
                    className={styles.media}
                    style={{ '--ar': item.width / item.height } as CSSProperties}
                    src={item.src}
                    poster={item.poster}
                    width={item.width}
                    height={item.height}
                    controls
                    muted
                    playsInline
                    preload="none"
                    aria-label={item.alt}
                  />
                ) : (
                  <img
                    key={item.src}
                    className={styles.media}
                    style={{ '--ar': item.width / item.height } as CSSProperties}
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </dialog>
  );
});

export default PhotoGallery;
