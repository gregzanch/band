-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "material" VARCHAR(255) NOT NULL,
    "manufacturer" VARCHAR(255),
    "description" TEXT,
    "source" TEXT,
    "tags" TEXT[],
    "frequencies" INTEGER[],
    "absorption" INTEGER[],

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);
