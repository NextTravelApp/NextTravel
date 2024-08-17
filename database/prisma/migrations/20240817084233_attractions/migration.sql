/*
  Warnings:

  - You are about to drop the column `extras` on the `SearchRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SearchRequest" DROP COLUMN "extras",
ADD COLUMN     "attractions" TEXT[] DEFAULT ARRAY[]::TEXT[];
