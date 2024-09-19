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
    try {
      const newProduct = new this.productModel(createProductDto);

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
    try {
      // Check if the product exists
      const product = await this.productModel.findById(id);
      if (!product) {
        return { status: false, message: 'Product not found' };
      }

      // Delete the product
      await this.productModel.findByIdAndDelete(id);

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
