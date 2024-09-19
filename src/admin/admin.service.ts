import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAdminDto } from './dto/UpdateAdmin.dto';
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
    return await this.adminModel.findById(id).populate(['settings', 'posts']);
  }

  async updateUser(id: string, updateUserDto: UpdateAdminDto) {
    return await this.adminModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async login(body) {
    try {
      let data: Admin = await this.adminModel.findOne({
        where: { email: body.email },
      });

      const passwordIsMatch = await bcrypt.compare(
        body.password,
        data.password,
      );
      if (data && passwordIsMatch) {
        const { password, ...Filterdata } = data;
        var token = jwt.sign(
          {
            data: Filterdata,
          },
          process.env.DEFAULT_SECRET,
          { expiresIn: '24h' },
        );

        return {
          status: true,
          token: token,
          data: Filterdata,
          message: 'login successfully',
        };
      } else {
        return {
          status: false,
          message: 'login failed, either email or password is wrong',
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
