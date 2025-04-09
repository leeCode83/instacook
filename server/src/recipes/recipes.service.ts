import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Recipe } from '@prisma/client';
import { CreateRecipeDto, UpdateRecipeDto } from 'src/dto/recipe.dto';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaClient) {}

    private async createRecipeIngredient(dto: CreateRecipeDto, recipe: Recipe){
        await Promise.all(dto.ingredients.map(async (ing) => {
            const ingredient = await this.prisma.ingredient.upsert({    //ingredient disimpan akan digunakan untuk pencarian recipe berdasarkan bahan
                where: {name: ing.name},
                update: {},
                create: {name: ing.name}
            });
            
            await this.prisma.recipeIngredient.create({    //contoh: 100 gram gula putih
                data: {
                    recipe: { connect: { id: recipe.id } },
                    ingredient: { connect: { id: ingredient.id } },
                    quantity: ing.quantity
                }
            });
        }));
    }

    private async createRecipeSteps(dto: CreateRecipeDto, recipe: Recipe){  //Membuat data step untuk recipe dan menghubungkannya dengan recipe
        await Promise.all(dto.steps.map(async (step) => {
            await this.prisma.recipeStep.create({
                data: {
                    recipe: { connect: { id: recipe.id } }, //menghubungkan setiap step ke recipe yang sudah dibuat
                    stepNumber: step.stepNumber,
                    description: step.description
                }
            });
        }));
    }

    private async showRecipeInfo(recipeId: string){     //Jika ingin menampilkan banyak recipe pada satu waktu, gunakan function ini sebagai template returnnya
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId},
            select: {
                id: true,
                name: true,
                imageUrl: true,
                creator: true,
                createdAt: true
            }
        });
        return recipe;
    }

    async createRecipe(dto: CreateRecipeDto){
        const recipe = await this.prisma.recipe.create({
            data: {
                name: dto.name,
                imageUrl: dto.imageUrl
            }
        });

        if(!recipe){
            throw new BadRequestException("Gagal membuat recipe baru");
        }
        await this.createRecipeIngredient(dto, recipe);
        await this.createRecipeSteps(dto, recipe);

        return this.getRecipeById(recipe.id)
    }

    async getAllRecipes(){
        const allRecipes = await this.prisma.recipe.findMany({
            select:{
                id: true
            }
        });

        return Promise.all(allRecipes.map(i => this.showRecipeInfo(i.id)));
    }

    async getRecipeById(recipeId: string){
        const recipe = await this.prisma.recipe.findUnique({
            where: { id: recipeId},
            select: {
                id: true,
                name: true,
                creator: true,
                imageUrl: true,
                ingredients: true,
                steps: {
                    select: {
                        stepNumber: true,
                        description: true
                    },
                    orderBy: { stepNumber: 'asc'}
                }
            }
        });

        if(!recipe){
            throw new NotFoundException("Recipe not found");
        }

        return {    //mengembalikan objek recipe, tapi pada bagian ingredients dan steps dioveride supaya bentuknya menjadi array
            ...recipe,
            ingredients: recipe.ingredients.map(i => i.quantity),
            steps: recipe.steps.map(i => `${i.stepNumber}. ${i.description}`)
        };
    }

    async getAllRecipesByIngredients(ingredientsList: string[]){
        const recipes = await this.prisma.recipe.findMany({
            where: {
                ingredients: {
                    some: {
                        ingredient: {
                            name: { in: ingredientsList }
                        }
                    }
                }
            },
            select: {
                id: true
            }
        });

        if(recipes.length == 0){
            throw new NotFoundException("Tidak ada recipe dengan bahan-bahan tersebut")
        }

        return Promise.all(recipes.map(i => this.showRecipeInfo(i.id)));
    }
}
