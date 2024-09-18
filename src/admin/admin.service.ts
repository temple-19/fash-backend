import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAdminDto } from './dto/UpdateAdmin.dto';
import { Admin } from 'src/schemas/Admin.schema';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async createUser(createAdminDto) {
    const newUser = new this.adminModel(createAdminDto);
    return newUser.save();
  }

  getUserById(id: string) {
    return this.adminModel.findById(id).populate(['settings', 'posts']);
  }

  updateUser(id: string, updateUserDto: UpdateAdminDto) {
    return this.adminModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
}
