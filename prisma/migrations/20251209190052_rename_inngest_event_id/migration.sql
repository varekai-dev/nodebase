/*
  Warnings:

  - You are about to drop the column `innngestEventId` on the `execution` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inngestEventId]` on the table `execution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inngestEventId` to the `execution` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."execution_innngestEventId_key";

-- AlterTable
ALTER TABLE "execution" DROP COLUMN "innngestEventId",
ADD COLUMN     "inngestEventId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "execution_inngestEventId_key" ON "execution"("inngestEventId");
