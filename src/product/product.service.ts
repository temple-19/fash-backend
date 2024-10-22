import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Collectionn,
  Product,
  ProductQueryFilter,
} from 'src/schemas/Product.schema';
import axios from 'axios';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel?: Model<Product>,
    @InjectModel(Product.name) private collectionModel?: Model<Collectionn>,
  ) {}
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  async test(amount, email: string) {
    console.log('Email:', email); // Verify if email is being passed correctly
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      email,
      amount: amount * 100, // Convert Naira to kobo
      callback: 'www.google.com',
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        data,
        { headers },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Error initializing payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Unable to initialize payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async testv(reference: string) {
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
    };

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers },
      );

      return response.data; // Contains payment verification details
    } catch (error) {
      throw new HttpException(
        'Payment verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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

  async createColl(createCollDto) {
    try {
      const newColl = new this.collectionModel(createCollDto);

      // Validate the product creation
      if (!newColl) {
        throw new Error('Collection creation failed');
      }

      const savedProduct = await newColl.save();

      return {
        status: true,
        data: savedProduct,
        message: 'Collection created successfully',
      };
    } catch (error) {
      // Handle validation or other errors
      return {
        status: false,
        message: 'Collection creation failed',
        error: error.message || 'An error occurred during Collection creation',
      };
    }
  }

  async getCollById(id: string) {
    try {
      return await this.collectionModel.findById(id);
    } catch (error) {
      return {
        status: false,
        message: 'Could not fetch Collection',
        error: error.message || 'Could not fetch Collection',
      };
    }
  }

  async getVolume() {
    try {
      let totalSold = 0;
      let totalStock = 0;
      let products = await this.productModel.find();

      // Iterate over the products to calculate totalSold and totalStock
      products.forEach((product) => {
        totalSold += product.topProducts;
        totalStock += product.quantity;
      });

      // Return the calculated totals
      return {
        status: true,
        totalSold,
        totalStock,
      };
    } catch (error) {
      return {
        status: false,
        message: 'Could not fetch Collection',
        error: error.message || 'Could not fetch Collection',
      };
    }
  }

  async getArchived() {
    // Find all products where isArchive is true
    const archivedProducts = await this.productModel.find({ isArchive: true });
    return archivedProducts;
  }

  async getNotArchived() {
    // Find all products where isArchive is true
    const archivedProducts = await this.productModel.find({ isArchive: false });
    return archivedProducts;
  }

  async getProducts() {
    return await this.productModel.find();
  }

  async getCollections() {
    return await this.collectionModel.find();
  }

  //just 3
  async getTopProducts() {
    try {
      // Fetch all products and sort them by 'topProducts' in descending order
      const topProducts = await this.productModel
        .find()
        .sort({ topProducts: -1 }) // Sort by 'topProducts' in descending order
        .limit(3); // Limit the number of results returned (default is 10)

      // Return the sorted array of top products
      return topProducts;
    } catch (error) {}
  }

  async toggleArchived(id: string) {
    try {
      // Find the product by its ID
      const product = await this.productModel.findById(id);

      // Check if the product exists
      if (!product) {
        throw new Error('Product not found');
      }

      // Toggle the isArchived value (if true, set to false, and vice versa)
      product.isArchived = !product.isArchived;

      // Save the updated product to the database
      await product.save();

      // Return the updated product
      return product;
    } catch (error) {}
  }

  async getProductById(id: string) {
    return await this.productModel.findById(id);
  }

  async updateStock(id: string, quantity: number) {
    let product = await this.productModel.findById(id);
    product.quantity += quantity;
    await product.save;
    return { status: true, message: `${quantity} added to stock` };
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
