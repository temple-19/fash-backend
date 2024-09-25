import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/Order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel?: Model<Order>) {}

  async createProduct(createProductDto) {
    try {
      const newProduct = new this.orderModel(createProductDto);

      // Validate the product creation
      if (!newProduct) {
        throw new Error('Product creation failed');
      }

      const savedProduct = await newProduct.save();

      return {
        status: true,
        data: savedProduct,
        message: 'Product created successfully',
      };
    } catch (error) {
      // Handle validation or other errors
      return {
        status: false,
        message: 'Product creation failed',
        error: error.message || 'An error occurred during product creation',
      };
    }
  }

  async getProducts() {
    return await this.orderModel.find();
  }

  async getProductById(id: string) {
    return await this.orderModel.findById(id);
  }

  async updateProduct(id: string, updateProductDto) {
    return await this.orderModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async deleteProduct(id: string) {
    try {
      // Check if the product exists
      const product = await this.orderModel.findById(id);
      if (!product) {
        return { status: false, message: 'Product not found' };
      }

      // Delete the product
      await this.orderModel.findByIdAndDelete(id);

      return { status: true, message: 'Product successfully deleted' };
    } catch (error) {
      // Handle unexpected errors
      return {
        status: false,
        message: 'Failed to delete product',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
