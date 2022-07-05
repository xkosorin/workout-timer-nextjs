-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaURL" TEXT,
    "mediaIsImage" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Exercise" ("description", "id", "mediaURL", "title", "updatedAt") SELECT "description", "id", "mediaURL", "title", "updatedAt" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_title_key" ON "Exercise"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
