-- CreateTable
CREATE TABLE "RequestJob" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "request" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RequestJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestJob_triggerId_key" ON "RequestJob"("triggerId");

-- AddForeignKey
ALTER TABLE "RequestJob" ADD CONSTRAINT "RequestJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
