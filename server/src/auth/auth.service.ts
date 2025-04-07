import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { LoginDto, RegisterDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaClient, private jwt: JwtService) {}

    private generateToken(user: any) {
        const payload = { sub: user.id, email: user.email };
        const secret = process.env.JWT_SECRET;
        const expireIn = process.env.JWT_EXPIRES_IN;
        const token = this.jwt.sign(payload, {secret: secret, expiresIn: expireIn});
        return token;
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if(existingUser){
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword
            }
        });

        const token = this.generateToken(newUser);

        return {token};
    }

    async login(dto: LoginDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(!user){
            throw new BadRequestException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if(!isPasswordValid){
            throw new ForbiddenException("Password wrong");
        }

        const token = this.generateToken(user);
        return { token };
    }
}
