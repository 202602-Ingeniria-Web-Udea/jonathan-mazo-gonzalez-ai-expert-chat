-- CreateTable
CREATE TABLE "ConfiguracionAsistente" (
    "id" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionAsistente_pkey" PRIMARY KEY ("id")
);
