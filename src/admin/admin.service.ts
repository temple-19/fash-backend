import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/Admin.schema';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
var jwt = require('jsonwebtoken');

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private authService: AuthService,
  ) {}

  async createUser(createAdminDto) {
    createAdminDto.password = await this.authService.encrypt(
      createAdminDto.password,
    );
    const newUser = await new this.adminModel(createAdminDto);
    return newUser.save();
  }

  async getUserById(id: string) {
    return await this.adminModel.findById(id);
  }

  async updateUser(id: string, updateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.encrypt(
        updateUserDto.password,
      );
    }
    return await this.adminModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }
  //add query date range
  async login(body) {
    try {
      let data = await this.adminModel.findOne({ email: body.email });

      if (data) {
        let verifiedUser = await this.authService.verifyOTP(body);
        if (verifiedUser.status) {
          var token = jwt.sign(
            {
              data,
            },
            process.env.DEFAULT_SECRET,
            { expiresIn: '24h' },
          );

          return {
            status: true,
            token: token,
            data: data,
            message: 'login successfully',
          };
        } else {
          return {
            status: false,
            message: 'login failed wrong code',
          };
        }
      } else {
        return {
          status: false,
          message: 'login failed wrong email',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'login failed',
      };
    }
  }
}
