-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "execution" ADD COLUMN     "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING';
