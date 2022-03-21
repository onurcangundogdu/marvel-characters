import styles from './title.module.css';

const Title = ({ name }) => {
  return (
    <h2 className={styles.title}>
      <span>{name}</span>
    </h2>
  );
};

export default Title;
