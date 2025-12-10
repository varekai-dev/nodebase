-- CreateTable
CREATE TABLE "execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "errorStack" TEXT,
    "innngestEventId" TEXT NOT NULL,
    "output" JSONB,

    CONSTRAINT "execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "execution_innngestEventId_key" ON "execution"("innngestEventId");

-- AddForeignKey
ALTER TABLE "execution" ADD CONSTRAINT "execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
