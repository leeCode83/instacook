/*
  Warnings:

  - You are about to drop the `StepIngredient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StepIngredient" DROP CONSTRAINT "StepIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "StepIngredient" DROP CONSTRAINT "StepIngredient_stepId_fkey";

-- DropTable
DROP TABLE "StepIngredient";

-- CreateTable
CREATE TABLE "_RecipeIngredientToRecipeStep" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeIngredientToRecipeStep_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeIngredientToRecipeStep_B_index" ON "_RecipeIngredientToRecipeStep"("B");

-- AddForeignKey
ALTER TABLE "_RecipeIngredientToRecipeStep" ADD CONSTRAINT "_RecipeIngredientToRecipeStep_A_fkey" FOREIGN KEY ("A") REFERENCES "RecipeIngredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeIngredientToRecipeStep" ADD CONSTRAINT "_RecipeIngredientToRecipeStep_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
