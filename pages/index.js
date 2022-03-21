import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import CryptoJS from 'crypto-js';
import Characters from 'components/characters';
import Layout from 'components/layout';
import Header from 'components/layout/header';
import Button from 'components/ui/button';
// import { appActions } from 'store';
import styles from './home.module.css';

const Home = ({ characters, offset }) => {
  // const dispatch = useDispatch();
  const [_offset, setOffset] = useState(offset);
  const [offsets, setOffsets] = useState([offset]);
  const [isLoading, setIsLoading] = useState(false);
  const [_characters, setCharacters] = useState(characters);

  useEffect(() => {
    if (offsets.includes(_offset)) return;
    setOffsets(prevOffsets => [...prevOffsets, _offset]);
  }, [_offset, offsets]);

  useEffect(() => {
    if (offsets.includes(_offset)) return;

    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/characters?apikey=${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}&limit=${process.env.NEXT_PUBLIC_SERVICE_LIMIT}&offset=${_offset}`
        );
        const { data } = await response.json();
        if (_offset < Math.min(...offsets)) {
          setCharacters(prevCharacters => [...data.results, ...prevCharacters]);
        } else {
          setCharacters(prevCharacters => [...prevCharacters, ...data.results]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [_offset, offset, offsets, setIsLoading]);

  const loadNextHandler = useCallback(() => {
    setOffset(
      Math.max(...offsets) + parseInt(process.env.NEXT_PUBLIC_SERVICE_LIMIT)
    );
  }, [offsets]);

  const loadPreviousHandler = useCallback(() => {
    setOffset(
      Math.min(...offsets) - parseInt(process.env.NEXT_PUBLIC_SERVICE_LIMIT)
    );
  }, [offsets]);

  return (
    <>
      <Head>
        <title>Marvel App | Characters</title>
        <meta name="description" content="Marvel App Characters page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Header />
        <main className={styles.main}>
          {!offsets.includes(0) && (
            <div className={styles['load-more-btn-container']}>
              <Button
                title={isLoading ? 'Loading...' : 'Load Previous'}
                onClick={loadPreviousHandler}
              />
            </div>
          )}
          <Characters characters={_characters} />
          <div className={styles['load-more-btn-container']}>
            <Button
              title={isLoading ? 'Loading...' : 'Load Next'}
              onClick={loadNextHandler}
            />
          </div>
        </main>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  let characters = [];

  const offset = query.offset ? parseInt(query.offset) : 0;
  try {
    const ts = new Date().toISOString();
    const hash = CryptoJS.MD5(
      `${ts}${process.env.SERVICE_PRIVATE_KEY}${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}`
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/characters?ts=${ts}&apikey=${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}&hash=${hash}&limit=${process.env.NEXT_PUBLIC_SERVICE_LIMIT}&offset=${offset}`
    );
    const { data } = await response.json();
    characters = data.results;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      characters,
      offset
    }
  };
}

export default Home;
