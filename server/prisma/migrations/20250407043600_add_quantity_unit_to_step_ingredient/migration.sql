/*
  Warnings:

  - Added the required column `quantity` to the `StepIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `StepIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StepIngredient" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;
