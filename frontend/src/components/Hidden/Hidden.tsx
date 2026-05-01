import styles from "./Hidden.module.scss";

export function Hidden(props: React.PropsWithChildren) {
  const { children } = props;

  return <span className={styles.hidden}>{children}</span>;
}
