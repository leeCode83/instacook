import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
