-- CreateTable
CREATE TABLE "RoleAssigned" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,

    CONSTRAINT "RoleAssigned_pkey" PRIMARY KEY ("id")
);
