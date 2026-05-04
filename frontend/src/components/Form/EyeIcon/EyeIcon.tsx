import styles from "./EyeIcon.module.scss";

export function EyeIcon(props: { isClosed: boolean }) {
  const { isClosed } = props;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={styles.toggleIcon}>
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isClosed && (
        <path
          d="M4 4 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
