import { IsString, IsArray, IsOptional, IsNumber, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

// DTO untuk bahan dalam resep
class IngredientDto {
    @IsString()
    name: string; // Nama bahan (misalnya "ayam"), bukan ingredientId

    @IsNumber()
    @Min(0)
    quantity: number; // Jumlah bahan (misalnya 300)

    @IsString()
    unit: string; // Satuan (misalnya "gram")
}

// DTO untuk langkah dalam resep
class StepDto {
    @IsNumber()
    stepNumber: number; // Nomor urut langkah

    @IsString()
    description: string; // Deskripsi langkah

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[];
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
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[]; // Daftar bahan dengan jumlah dan satuan

    @IsArray()
    @ArrayMinSize(1) // Minimal 1 langkah
    @ValidateNested({ each: true })
    @Type(() => StepDto)
    steps: StepDto[]; // Daftar langkah dengan bahan yang digunakan
}

// DTO untuk memperbarui resep
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}