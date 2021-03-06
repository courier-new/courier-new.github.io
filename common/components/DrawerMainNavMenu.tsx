import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Slug } from '../constants/slugs';
import useOnClickOutside from '../hooks/useOnClickOutside';
import MadeByMe from './MadeByMe';
import MainNavigation from './MainNavigation';
import MenuIcon from './MenuIcon';
import ProfileImage from './ProfileImage';
import SocialLinks from './SocialLinks';

type DrawerMainNavMenuProps = {
  /** The url slug corresponding to the screen that is currently open */
  activePage: Slug;
};

/**
 * Component for primary navigation bar wrapped in a collapsible drawer for
 * mobile support
 *
 * @param props the functional component props
 * @param props.activePage the url slug corresponding to the screen that is
 * currently open
 */
const DrawerMainNavMenu: FC<DrawerMainNavMenuProps> = ({ activePage }) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawerIsOpen = useCallback(
    () => setDrawerIsOpen(!drawerIsOpen),
    [drawerIsOpen],
  );

  // Toggle drawer closed on click outside when drawer is open
  const onClickOutside = useCallback(() => {
    if (drawerIsOpen) toggleDrawerIsOpen();
  }, [drawerIsOpen, toggleDrawerIsOpen]);
  useOnClickOutside(drawerRef, onClickOutside);

  // Toggle drawer closed on route change
  const router = useRouter();
  useEffect(() => {
    /** Event handler to close the drawer */
    const closeDrawer = (): void => setDrawerIsOpen(false);
    router.events.on('routeChangeStart', closeDrawer);

    return (): void => router.events.off('routeChangeStart', closeDrawer);
  }, [router.events]);

  // TODO: Remove hard-coded colors
  const menuIconColor = drawerIsOpen ? '#fdf4fc' : '#7d94a8';

  return (
    <>
      <style jsx>
        {`
          .outer-container {
            left: -80%;
            transition: all 300ms ease-out;
            width: 80%;
          }

          .outer-container.open {
            animation: slide-in-nav 0.3s;
            left: 0;
          }

          @keyframes slide-in-nav {
            from {
              left: -80%;
            }
            to {
              left: 0;
            }
          }

          h3 {
            font-size: 6vw;
            margin-left: 1em;
          }
        `}
      </style>
      <div
        className={`
        outer-container absolute flex-row flex-align-start full-height z-index-top ${
          drawerIsOpen ? 'open' : 'width-0'
        }
      `}
        ref={drawerRef}
      >
        {/* Use space-between to split flex column to top and bottom part */}
        <div className="background-maastricht full-height full-width flex-1 flex-column flex-space-between text-magnolia non-scrollable padding-med border-box">
          {/* The top-aligned part */}
          <div>
            <Link href="/">
              <a
                className="flex-row flex-align-center"
                style={{ marginBottom: '1em' }}
                title="Index"
              >
                {/* Restrain min/max width of ProfileImage while preserving aspect
                ratio */}
                <div
                  style={{
                    maxWidth: 'max(50px, min(40%, 100px))',
                    minWidth: 'max(50px, min(40%, 100px))',
                  }}
                >
                  <ProfileImage maxSize={100} />
                </div>
                <h3 className="text-turquoise">Kelli Rockwell</h3>
              </a>
            </Link>
            <MainNavigation activePage={activePage} />
          </div>
          {/* The bottom-aligned part */}
          <div>
            <SocialLinks className="text-magnolia" size="8vw" />
            <MadeByMe className="text-magnolia xsmall" />
          </div>
        </div>
        <button
          aria-label={drawerIsOpen ? 'Close menu drawer' : 'Open menu drawer'}
          className="cursor-pointer z-index-top margin-0 padding-med-v padding-0-h border-0 background-none width-0"
          onClick={toggleDrawerIsOpen}
          type="button"
        >
          <MenuIcon color={menuIconColor} isOpen={drawerIsOpen} />
        </button>
      </div>
    </>
  );
};

export default DrawerMainNavMenu;
