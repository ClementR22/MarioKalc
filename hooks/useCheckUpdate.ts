import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import packageJSON from "@/package.json";

export async function fetchLatestVersion(): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/repos/ClementR22/MarioKalc/releases/latest");

    if (!response.ok) return null;

    const data = await response.json();
    return data.tag_name || null; // ex: "v1.2.3"
  } catch (e) {
    return null;
  }
}

function checkIsNewVersionAvailable(latest: string | null): boolean {
  if (!latest) return false;

  const current = packageJSON.version;
  return current !== latest.replace(/^v/, ""); // supprime "v"
}

export function useCheckUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const latest = await fetchLatestVersion();
      if (checkIsNewVersionAvailable(latest)) {
        setUpdateAvailable(true);
      }
    })();
  }, []);

  function openDownloadPage() {
    Linking.openURL("https://github.com/ClementR22/MarioKalc/releases/latest");
  }

  return { updateAvailable, openDownloadPage };
}
