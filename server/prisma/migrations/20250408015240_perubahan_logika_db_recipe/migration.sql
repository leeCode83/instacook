/*
  Warnings:

  - You are about to drop the column `unit` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `_RecipeIngredientToRecipeStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RecipeIngredientToRecipeStep" DROP CONSTRAINT "_RecipeIngredientToRecipeStep_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeIngredientToRecipeStep" DROP CONSTRAINT "_RecipeIngredientToRecipeStep_B_fkey";

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "unit",
ALTER COLUMN "quantity" SET DEFAULT '',
ALTER COLUMN "quantity" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_RecipeIngredientToRecipeStep";
