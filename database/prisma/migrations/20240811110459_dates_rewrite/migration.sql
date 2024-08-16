-- AlterTable
ALTER TABLE "SearchRequest" ADD COLUMN     "accomodation" TEXT,
ADD COLUMN     "extras" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sharedWith" TEXT[] DEFAULT ARRAY[]::TEXT[];
