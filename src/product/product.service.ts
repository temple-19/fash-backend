import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/schemas/Product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(createProductDto) {
    const newUser = await new this.productModel(createProductDto);
    return newUser.save();
  }

  async getProducts() {
    return await this.productModel.find();
  }

  async getProductById(id: string) {
    return await this.productModel.findById(id);
  }

  async updateProduct(id: string, updateProductDto) {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async deleteProduct(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }
}
