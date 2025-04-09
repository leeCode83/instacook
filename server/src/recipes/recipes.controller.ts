import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from 'src/dto/recipe.dto';

@Controller('recipes')
export class RecipesController {
    constructor(private recipesService: RecipesService) {}

    @Post()
    async createRecipe(@Body() dto: CreateRecipeDto){
        return this.recipesService.createRecipe(dto);
    }

    @Get()
    async getAllRecipes(){
        return this.recipesService.getAllRecipes();
    }

    @Get('findrecipe/:recipeId')
    async getRecipeById(@Param('recipeId') recipeId: string){
        return this.recipesService.getRecipeById(recipeId);
    }

    @Get('search-ingredient')
    async seacrhRecipesByIngredients(@Query('ingredients') ingredients: string){
        const ingredientList = ingredients.split(',').map(i => i.trim());   //Proses supaya list dari Query dapat menjadi array sebelum dikirim ke service
        return this.recipesService.getAllRecipesByIngredients(ingredientList);
    }
}
