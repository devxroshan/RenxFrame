/*
  Warnings:

  - Added the required column `workspaceId` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "workspaceId" TEXT NOT NULL,
ALTER COLUMN "isActive" DROP NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
