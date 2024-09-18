import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    @InjectModel(Admin.name) // Inject the User model
    private readonly adminModel: Model<Admin>,
  ) {}

  //for stricter auth guard
  //interface JwtPayload {
  // email: string;
  // You can add other properties here if needed
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: any = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    // await this.userModel.findById({});
    if (!decoded) {
      return false;
    } else {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
