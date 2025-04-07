import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";

export class RegisterDto{
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class LoginDto{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
