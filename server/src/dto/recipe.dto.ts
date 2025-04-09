import { IsString, IsArray, IsOptional, IsNumber, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

// DTO untuk bahan dalam resep
class IngredientDto {
    @IsString()
    name: string;

    @IsString()
    quantity: string;
}

// DTO untuk langkah dalam resep
class StepDto {
    @IsNumber()
    stepNumber: number; // Nomor urut langkah

    @IsString()
    description: string; // Deskripsi langkah
}

// DTO utama untuk membuat resep
export class CreateRecipeDto {
    @IsString()
    name: string; // Nama resep

    @IsOptional()
    @IsString()
    imageUrl?: string; // URL gambar (opsional)

    @IsArray()
    @ArrayMinSize(1) // Minimal 1 bahan
    ingredients: IngredientDto[]

    @IsArray()
    @ArrayMinSize(1) // Minimal 1 langkah
    @ValidateNested({ each: true })
    @Type(() => StepDto)
    steps: StepDto[]; // Daftar langkah dengan bahan yang digunakan
}

// DTO untuk memperbarui resep
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}