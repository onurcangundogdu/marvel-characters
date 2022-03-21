import Character from 'components/characters/character';
import styles from './characters.module.css';

const Characters = ({ characters }) => {
  return (
    <ul>
      {characters.map(char => (
        <Character key={char.id} character={char} />
      ))}
    </ul>
  );
};

export default Characters;
