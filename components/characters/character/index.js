import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Title from 'components/characters/character/title';
import styles from './character.module.css';

function Character({ character }) {
  const router = useRouter();

  const {
    id,
    name,
    thumbnail: { path, extension }
  } = character;

  const linkClickHandler = useCallback(
    e => {
      e.preventDefault();
      router.push(`/${id}`);
    },
    [router, id]
  );

  return (
    <li className={styles.character}>
      <a className={styles.link} onClick={linkClickHandler}>
        <Image
          src={`${path}/detail.${extension}`}
          alt={name}
          layout="fill"
          objectFit="cover"
          objectPosition="center center"
        />
      </a>
      <Title name={name} />
    </li>
  );
}

export default Character;
