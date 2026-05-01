import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/logoMetricsLight.svg"
          alt="Next.js logo"
          width={220}
          height={54}
          priority
        />
      </main>
    </div>
  );
}
