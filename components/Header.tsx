import styles from "../styles/components/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { Button, Dropdown } from "rsuite";
import { signOut, useSession } from "next-auth/react";
import { Trans } from "@lingui/macro";
import { ArrowDown } from "@rsuite/icons";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.link}>
        <h1 className={styles.header}>
          <Image src="/cap.png" width="230" height="80" alt="CAP Logo" />
          <span className={styles.text}>CAP Editor</span>
        </h1>
      </Link>

      <div>
        {session && (
          <>
            <Link href="/editor">
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                <Trans>Create alert</Trans>
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                <Trans>Settings</Trans>
              </Button>
            </Link>

            <Button
              appearance="ghost"
              color="violet"
              className={styles.button}
              onClick={() => signOut()}
            >
              <Trans>Logout</Trans>
            </Button>
          </>
        )}

        {!session && (
          <>
            <Dropdown
              renderToggle={(props, ref) => (
                <Button
                  {...props}
                  ref={ref}
                  appearance="primary"
                  size="md"
                  color="violet"
                >
                  <Trans>Language</Trans>
                  <ArrowDown />
                </Button>
              )}
            >
              <Link href="#" locale="en">
                <Dropdown.Item>English</Dropdown.Item>
              </Link>
              <Link href="#" locale="fr">
                <Dropdown.Item>Français</Dropdown.Item>
              </Link>
            </Dropdown>
            <Link href="/register" className={styles.button}>
              <Button
                appearance="primary"
                color="violet"
                className={styles.button}
              >
                <Trans>Register</Trans>
              </Button>
            </Link>
            <Link href="/login" className={styles.button}>
              <Button
                appearance="primary"
                color="violet"
                className={styles.button}
              >
                <Trans>Login</Trans>
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
