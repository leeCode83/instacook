import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateRecipeDto, UpdateRecipeDto } from 'src/dto/recipe.dto';

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaClient) {}

    async createRecipe(dto: CreateRecipeDto){
        // Buat recipe
        const recipe = await this.prisma.recipe.create({
            data: {
                name: dto.name,
                imageUrl: dto.imageUrl
            }
        });

        // Buat ingredients untuk recipe
        await Promise.all(
            dto.ingredients.map(async (ing) => {
                const ingredient = await this.prisma.ingredient.upsert({
                    where: {name: ing.name},
                    update: {},
                    create: {name: ing.name}
                });
                
                return this.prisma.recipeIngredient.create({
                    data: {
                        recipe: { connect: { id: recipe.id } },
                        ingredient: { connect: { id: ingredient.id } },
                        quantity: ing.quantity,
                        unit: ing.unit
                    }
                });
            })
        );

        // Buat steps untuk recipe
        await Promise.all(
            dto.steps.map(async (step) => {
                // Buat step
                const recipeStep = await this.prisma.recipeStep.create({
                    data: {
                        recipe: { connect: { id: recipe.id } },
                        stepNumber: step.stepNumber,
                        description: step.description
                    }
                });

                // Buat ingredients untuk step
                await Promise.all(
                    step.ingredients.map(async (ing) => {
                        const ingredient = await this.prisma.ingredient.upsert({
                            where: {name: ing.name},
                            update: {},
                            create: {name: ing.name}
                        });

                        // Buat RecipeIngredient jika belum ada
                        const recipeIngredient = await this.prisma.recipeIngredient.upsert({
                            where: {
                                recipeId_ingredientId: {
                                    recipeId: recipe.id,
                                    ingredientId: ingredient.id
                                }
                            },
                            create: {
                                recipe: { connect: { id: recipe.id } },
                                ingredient: { connect: { id: ingredient.id } },
                                quantity: ing.quantity,
                                unit: ing.unit
                            },
                            update: {}
                        });

                        // Hubungkan RecipeIngredient dengan RecipeStep
                        await this.prisma.recipeStep.update({
                            where: { id: recipeStep.id },
                            data: {
                                ingredients: {
                                    connect: { id: recipeIngredient.id }
                                }
                            }
                        });
                    })
                );
            })
        );

        // Ambil recipe dengan semua relasinya
        const completeRecipe = await this.prisma.recipe.findUnique({
            where: { id: recipe.id },
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                steps: {
                    include: {
                        ingredients: {
                            include: {
                                ingredient: true
                            }
                        }
                    }
                }
            }
        });

        return completeRecipe;
    }

    async getAllRecipes(){
        return this.prisma.recipe.findMany({
            select:{
                id: true,
                name: true,
                creator: true,
                imageUrl: true,
                ingredients: {
                    select: {
                        ingredient: {
                            select: { name: true}
                        },
                        quantity: true,
                        unit: true
                    }
                },
                steps: {
                    select: {
                        stepNumber: true,
                        description: true
                    },
                    orderBy: { stepNumber: 'asc'}
                }
            }
        })
    }
}
