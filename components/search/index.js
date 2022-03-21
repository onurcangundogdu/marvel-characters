import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from 'components/ui/button';
import Input from 'components/ui/input';
import styles from './search.module.css';

const Search = ({ onCancel }) => {
  const [results, setResults] = useState([]);

  const termChangeHandler = useCallback(async term => {
    if (!term) return setResults([]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/characters?apikey=${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}&limit=${process.env.NEXT_PUBLIC_SERVICE_LIMIT}&nameStartsWith=${term}`
    );
    const { data } = await response.json();
    setResults(data.results);
  }, []);

  return (
    <div className={styles.search}>
      <div className={styles.header}>
        <Input
          initialValue=""
          placeholder="Search..."
          onTermChange={termChangeHandler}
        />
        <Button title="Cancel" onClick={onCancel} />
      </div>
      <ul className={styles.results}>
        {results.map(res => (
          <li key={res.id} className={styles['result-item']}>
            <Link href={`/${res.id}`}>
              <a className={styles['result-link']}>
                <Image
                  src={`${res.thumbnail.path}/standard_medium.${res.thumbnail.extension}`}
                  alt="logo"
                  width="100"
                  height="100"
                />
                <h3>{res.name}</h3>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
