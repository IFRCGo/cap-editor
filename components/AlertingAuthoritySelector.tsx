import styles from "../styles/components/AlertingAuthoritySelector.module.css";
import { ArrowDown } from "@rsuite/icons";
import { Button, Dropdown } from "rsuite";
import { useAlertingAuthorityLocalStorage } from "../lib/useLocalStorageState";
import { useRouter } from "next/router";
import { classes } from "../lib/helpers.client";
import { useEffect } from "react";
import Link from "next/link";

const AlertingAuthoritySelector = ({
  alertingAuthorities = {},
  appendToQuery = false,
  fullWidth = false,
}) => {
  const router = useRouter();
  const [alertingAuthorityId, setAlertingAuthorityId] =
    useAlertingAuthorityLocalStorage();

  const alertingAuthoritiesEntries = Object.entries(alertingAuthorities);

  useEffect(() => {
    if (alertingAuthoritiesEntries.length) {
      if (!alertingAuthorityId || !alertingAuthorities[alertingAuthorityId]) {
        setAlertingAuthorityId(alertingAuthoritiesEntries[0][0]);
      }
    } else {
      setAlertingAuthorityId("");
    }
  }, []);

  return (
    <Dropdown
      block={fullWidth}
      renderToggle={(props, ref) => (
        <Button
          {...props}
          ref={ref}
          appearance="ghost"
          size="md"
          color="violet"
        >
          <i>Alerting Authority: </i>
          {!!alertingAuthorityId && (
            <span
              className={classes(
                styles.alertingAuthoritySelectorName,
                fullWidth && styles.fullWidth
              )}
            >
              {alertingAuthorities[alertingAuthorityId].name}
            </span>
          )}
          <ArrowDown />
        </Button>
      )}
    >
      {alertingAuthoritiesEntries.map(([id, details]) => {
        return (
          <Dropdown.Item
            key={`aa-selector-${id}`}
            onClick={() => {
              setAlertingAuthorityId(id);
              if (appendToQuery) {
                router.query.alertingAuthority = id;
                router.push(router);
              }
            }}
          >
            {details.name}
          </Dropdown.Item>
        );
      })}
      <Dropdown.Item>
        <Link href="/settings">Connect to new Alerting Authority?</Link>
      </Dropdown.Item>
    </Dropdown>
  );
};

export default AlertingAuthoritySelector;
