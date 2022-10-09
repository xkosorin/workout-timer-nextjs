-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsedExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseId" TEXT NOT NULL,
    "timed" BOOLEAN NOT NULL,
    "reps" INTEGER NOT NULL,
    "pause" INTEGER NOT NULL DEFAULT 0,
    "timing" TEXT,
    "comment" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UsedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UsedExercise" ("exerciseId", "id", "reps", "timed", "updatedAt") SELECT "exerciseId", "id", "reps", "timed", "updatedAt" FROM "UsedExercise";
DROP TABLE "UsedExercise";
ALTER TABLE "new_UsedExercise" RENAME TO "UsedExercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
