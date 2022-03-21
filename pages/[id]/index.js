import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CryptoJS from 'crypto-js';
import Button from 'components/ui/button';
import Layout from 'components/layout';
import styles from './character-detail.module.css';

const Detail = ({ character }) => {
  const router = useRouter();
  const { name, thumbnail, description, comics } = character;
  if (!name) return null;
  return (
    <>
      <Head>
        <title>Marvel App | {name}</title>
        <meta name="description" content={`Marvel App ${name} page`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <header className={styles.header}>
          <Image
            src={`${thumbnail.path}/standard_fantastic.${thumbnail.extension}`}
            alt="logo"
            width="250"
            height="250"
            priority
            className={styles['header-image']}
            layout="responsive"
          />
          <div className={styles['back-btn-container']}>
            <Button
              title="Back"
              onClick={router.back}
              className={styles['back-btn']}
            />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.property}>
            <h2>name</h2>
            <p>{name}</p>
          </div>
          <div className={styles.property}>
            <h2>description</h2>
            <p>{description}</p>
          </div>
          <div className={styles.property}>
            <h2>comics</h2>
            <ul>
              {comics.items.map((comic, index) => {
                return <li key={index}>{comic.name}</li>;
              })}
            </ul>
          </div>
        </main>
      </Layout>
    </>
  );
};

export async function getStaticProps({ params }) {
  let character = {};
  const { id } = params;
  try {
    const ts = new Date().toISOString();
    const hash = CryptoJS.MD5(
      `${ts}${process.env.SERVICE_PRIVATE_KEY}${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}`
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/characters/${id}?ts=${ts}&apikey=${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}&hash=${hash}`
    );
    const { data } = await response.json();
    character = data.results[0];
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      character
    },
    revalidate: 60 * 60 * 1 // regenerate static files every 1 hour
  };
}

export async function getStaticPaths() {
  let characterIds = [];

  try {
    const ts = new Date().toISOString();
    const hash = CryptoJS.MD5(
      `${ts}${process.env.SERVICE_PRIVATE_KEY}${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}`
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVICE_BASE_URL}/characters?ts=${ts}&apikey=${process.env.NEXT_PUBLIC_SERVICE_PUBLIC_KEY}&hash=${hash}&limit=${process.env.NEXT_PUBLIC_SERVICE_LIMIT}`
    );
    const { data } = await response.json();
    characterIds = data.results.map(res => res.id);
  } catch (error) {
    console.error(error);
  }

  return {
    paths: characterIds.map(cId => ({ params: { id: cId.toString() } })),
    fallback: 'blocking'
  };
}

export default Detail;
