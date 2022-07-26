/*
  Warnings:

  - You are about to drop the column `amount` on the `UsedExercise` table. All the data in the column will be lost.
  - Added the required column `reps` to the `UsedExercise` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsedExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseId" TEXT NOT NULL,
    "timed" BOOLEAN NOT NULL,
    "reps" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UsedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UsedExercise" ("exerciseId", "id", "timed", "updatedAt") SELECT "exerciseId", "id", "timed", "updatedAt" FROM "UsedExercise";
DROP TABLE "UsedExercise";
ALTER TABLE "new_UsedExercise" RENAME TO "UsedExercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
