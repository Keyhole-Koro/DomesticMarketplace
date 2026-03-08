-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "localPath" TEXT NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "internalPort" INTEGER NOT NULL DEFAULT 3000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
