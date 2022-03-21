import { useState, useCallback } from 'react';
import Image from 'next/image';
import LogoIcon from 'public/icn-nav-marvel.png';
import Search from 'components/search';
import Button from 'components/ui/button';
import styles from './header.module.css';

const Header = () => {
  const [isSearching, setIsSearching] = useState(false);

  const cancelHandler = useCallback(() => {
    setIsSearching(false);
  }, []);

  const headerClassNames = [
    styles.header,
    isSearching ? styles.on : styles.off
  ];

  return (
    <header className={headerClassNames.join(' ')}>
      {!isSearching && (
        <>
          <Image src={LogoIcon} alt="logo" width="90" height="40" />
          <div className={styles['search-btn-container']}>
            <Button title="Search" onClick={() => setIsSearching(true)} />
          </div>
        </>
      )}
      {isSearching && <Search onCancel={cancelHandler} />}
    </header>
  );
};

export default Header;
