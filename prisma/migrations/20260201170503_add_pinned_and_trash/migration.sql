-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrashed" BOOLEAN NOT NULL DEFAULT false;
