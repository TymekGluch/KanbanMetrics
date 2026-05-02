import { GithubSvg } from "@/assets/GithubSvg";
import { LinkedinSvg } from "@/assets/LinkedinSvg";
import { pxToRem } from "@/utils/pxToRem";
import Link from "../Link";
import styles from "./Footer.module.scss";

const GithubAuthorLink = "https://github.com/TymekGluch";
const AuthorLinkedinLink = "https://www.linkedin.com/in/tymoteusz-g%C5%82uch/";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <p className={styles.footer_copyright}>© 2026 Morphyxis. All rights reserved.</p>

        <nav className={styles.footer_nav}>
          <Link.AsAnchor
            fontSize={pxToRem(10)}
            StartIconSlot={<GithubSvg className={styles.footer_navIcon} />}
            href={GithubAuthorLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            Author&apos;s GitHub
          </Link.AsAnchor>

          <span aria-hidden className={styles.footer_navSeparator}>
            |
          </span>

          <Link.AsAnchor
            fontSize={pxToRem(10)}
            StartIconSlot={<LinkedinSvg className={styles.footer_navIcon} />}
            href={AuthorLinkedinLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            Author&apos;s Linkedin
          </Link.AsAnchor>
        </nav>

        <nav className={styles.footer_nav}>
          <Link.AsAnchor href="/terms" fontSize={pxToRem(10)} className={styles.footer_navLink}>
            Terms of Service
          </Link.AsAnchor>

          <span aria-hidden className={styles.footer_navSeparator}>
            |
          </span>

          <Link.AsAnchor href="/privacy" fontSize={pxToRem(10)} className={styles.footer_navLink}>
            Privacy Policy
          </Link.AsAnchor>
        </nav>
      </div>
    </footer>
  );
}
