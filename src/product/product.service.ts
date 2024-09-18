import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/Product.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createUser(createProductDto) {
    const newUser = new this.productModel(createProductDto);
    return newUser.save();
  }

  getsUsers() {
    return this.productModel.find();
  }

  getUserById(id: string) {
    return this.productModel.findById(id);
  }

  updateUser(id: string, updateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  deleteUser(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
