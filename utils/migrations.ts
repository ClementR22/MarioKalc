// migrations.ts
import { loadThingFromMemory, saveThingInMemory, deleteAllTheMemory } from "@/utils/asyncStorageOperations";
import { version as APP_VERSION } from "../package.json";

type Migration = {
  version: string;
  name: string;
  migrate: () => Promise<void>;
  changelogMessage?: string; // Message optionnel à afficher
};

const migrations: Migration[] = [
  {
    version: "0.1.6",
    name: "Restructure persistent memory",
    //  changelogMessage: "welcomeText", // Clé de traduction
    migrate: async () => {
      console.log("Migration 0.1.6: Cleaning old data structure...");
      await deleteAllTheMemory();
    },
  },
  // Autres migrations...
];

export const runMigrations = async (): Promise<string | null> => {
  const lastMigrationVersion = await loadThingFromMemory("lastMigrationVersion");
  const currentVersion = APP_VERSION;

  console.log(`Current app version: ${currentVersion}`);
  console.log(`Last migration version: ${lastMigrationVersion || "none"}`);

  // Filtrer les migrations à exécuter
  const migrationsToRun = migrations.filter((migration) => {
    return (
      compareVersions(migration.version, lastMigrationVersion) > 0 &&
      compareVersions(migration.version, currentVersion) <= 0
    );
  });

  if (migrationsToRun.length === 0) {
    console.log("No migrations to run");
    return null;
  }

  console.log(`Running ${migrationsToRun.length} migration(s)...`);

  let changelogMessage: string | null = null;

  // Exécuter les migrations dans l'ordre
  for (const migration of migrationsToRun) {
    try {
      console.log(`Running migration ${migration.version}: ${migration.name}`);
      await migration.migrate();
      console.log(`✓ Migration ${migration.version} completed`);

      // Garder le message de la dernière migration qui en a un
      if (migration.changelogMessage) {
        changelogMessage = migration.changelogMessage;
      }
    } catch (error) {
      console.error(`✗ Migration ${migration.version} failed:`, error);
      throw error;
    }
  }

  // Sauvegarder la version actuelle
  await saveThingInMemory("lastMigrationVersion", currentVersion);

  // Retourner le message changelog à afficher
  return changelogMessage;
};

function compareVersions(v1: string, v2: string): number {
  if (!v2) {
    // si lastMigrationVersion est undefined
    return 1; // alors on fait la migration
  }

  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}
