import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collectionn, Product } from 'src/schemas/Product.schema';
import axios from 'axios';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel?: Model<Product>,
    @InjectModel(Collectionn.name) private collectionModel?: Model<Collectionn>,
  ) {}
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  async searchProductsByName(name: string) {
    try {
      // Use a regular expression to search for the product name, case-insensitive
      let regex = new RegExp(name, 'i'); // 'i' for case-insensitive
      let products = await this.productModel.find({
        name: { $regex: regex },
        isArchived: false,
      });
      if (products.length === 0) {
        return {
          status: true,
          data: products,
          message: 'There is no item with that name',
        };
      }

      return {
        status: true,
        data: products,
        message: 'Products retrieved successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: 'Failed to search products',
        error: error.message || 'An error occurred while searching products',
      };
    }
  }

  async test(amount, email: string) {
    console.log('Email:', email); // Verify if email is being passed correctly
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };

    let data = {
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
      let response = await axios.get(
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
      let newColl = new this.collectionModel(createCollDto);
      console.log(createCollDto);
      // Validate the product creation
      if (!newColl) {
        throw new Error('Collection creation Failed');
      }

      let savedProduct = await newColl.save();

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
      // Find the collection by ID
      const collection = await this.collectionModel.findById(id);

      // Check if the collection exists
      if (!collection) {
        throw new Error('Collection not found');
      }

      // Find products with a name exactly matching the collection's name
      const colProducts = await this.productModel.find({
        _collection: collection.name,
        isArchived: false, // Exact match with the collection's name
      });

      // Return the collection and its associated products
      return {
        status: true,
        message: {
          collection,
          colProducts,
        },
      };
    } catch (error) {
      // Handle the error and return a response
      return {
        status: false,
        message: 'Could not fetch Collection',
        error: error.message || 'An unexpected error occurred',
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
  async getfeatured() {
    try {
      // Find all products where isArchive is true
      const archivedProducts = await this.productModel.find({
        featured: true,
        isArchived: false,
      });
      return archivedProducts;
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

  async getArchived() {
    try {
      // Find all products where isArchive is true
      const archivedProducts = await this.productModel.find({
        isArchived: true,
      });
      return archivedProducts;
    } catch (error) {
      return {
        status: false,
        message: 'Error response',
        error: error.message || 'error response',
      };
    }
  }

  async getNotArchived() {
    try {
      // Find all products where isArchive is true
      const archivedProducts = await this.productModel.find({
        isArchived: false,
      });
      return archivedProducts;
    } catch (error) {
      return {
        status: false,
        message: 'Error response',
        error: error.message || 'error response',
      };
    }
  }

  async getProducts() {
    try {
      //admin
      return await this.productModel.find();
    } catch (error) {
      return {
        status: false,
        message: 'Error response',
        error: error.message || 'error response',
      };
    }
  }

  async getstoreProducts() {
    try {
      return await this.productModel.find({ isArchived: false });
    } catch (error) {
      return {
        status: false,
        message: 'Error response',
        error: error.message || 'error response',
      };
    }
  }

  async getCollections() {
    try {
      return await this.collectionModel.find();
    } catch (error) {
      return {
        status: false,
        message: 'Error response',
        error: error.message || 'error response',
      };
    }
  }

  //just 3
  async getTopProducts() {
    try {
      const topProducts = await this.productModel
        .find()
        .sort({ topProducts: -1 })
        .limit(3);

      return { status: true, message: topProducts };
    } catch (error) {
      return {
        status: false,
        message: 'Failed to fetch top products',
        error: error.message || 'An unexpected error occurred',
      };
    }
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
  async togglefeat(id: string) {
    try {
      // Find the product by its ID
      const product = await this.productModel.findById(id);

      // Check if the product exists
      if (!product) {
        throw new Error('Product not found');
      }

      // Toggle the featured value (if true, set to false, and vice versa)
      product.featured = !product.featured;

      // Save the updated product to the database
      await product.save();

      // Return the updated product
      return product;
    } catch (error) {
      return {
        status: false,
        message: 'Failed to fetch top products',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async getProductById(id: string) {
    try {
      return await this.productModel.findById(id);
    } catch (error) {
      return {
        status: false,
        message: 'Failed to fetch top products',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  async getAllProductsAndCategories() {
    try {
      // Fetch all products
      const products = await this.productModel.find();

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category)),
      );

      return {
        status: true,
        message: ' categories retrieved successfully.',
        data: {
          uniqueCategories,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: 'Failed to retrieve products and categories.',
        error: error.message || 'An unexpected error occurred.',
      };
    }
  }

  async updateStock(id: string, quantity: number) {
    try {
      let product = await this.productModel.findById(id);
      product.quantity += quantity;
      await product.save();
      console.log(id, quantity, product.quantity);
      return { status: true, message: `${quantity} added to stock` };
    } catch (error) {
      return {
        status: false,
        message: 'Failed to retrieve products',
        error: error.message || 'An unexpected error occurred.',
      };
    }
  }

  async updateProduct(id: string, updateProductDto) {
    try {
      return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
        new: true,
      });
    } catch (error) {
      return {
        status: false,
        message: 'Failed to retrieve products',
        error: error.message || 'An unexpected error occurred.',
      };
    }
  }

  async updateCol(id: string, updateProductDto) {
    try {
      return await this.collectionModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
        },
      );
    } catch (error) {
      return {
        status: false,
        message: 'Failed to retrieve products',
        error: error.message || 'An unexpected error occurred.',
      };
    }
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

  async deleteCol(id: string) {
    try {
      // Check if the product exists
      const product = await this.collectionModel.findById(id);
      if (!product) {
        return { status: false, message: 'Collection not found' };
      }

      // Delete the product
      await this.collectionModel.findByIdAndDelete(id);

      return { status: true, message: 'Collection successfully deleted' };
    } catch (error) {
      // Handle unexpected errors
      return {
        status: false,
        message: 'Failed to delete Collection',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
