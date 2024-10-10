import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/Order.schema';
import { Product } from 'src/schemas/Product.schema';

export class createOrderDto {
  amount: number; // Total price for the order
  phone_Number: number; // Customer's phone number
  orderStatus?: string; // Will be set to 'Pending' by default in the logic
  email: string; // Customer's email
  shippingAddress: {
    street: string; // Shipping address details
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string; // Product ID
    name: string; // Product name
    quantity: number; // Quantity of the product
    price: number; // Price of the product
    color: string; // Selected color for the product
    size: string; // Selected size for the product
  }[];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel?: Model<Order>,
    @InjectModel(Product.name) private productModel?: Model<Product>,
  ) {}
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  async webhook(reference: string) {
    try {
      const order = await this.orderModel.findOne({
        reference: reference,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Loop through the items in the order and reduce product quantities
      for (const item of order.items) {
        const product = await this.productModel.findOne({ id: item.id }); // Fetch the product by id
        // await this.productModel.findById(item.id);
        if (!product) {
          throw new Error(`Product with id ${item.id} not found`);
        }

        // Reduce product's quantity by the quantity in the order item
        product.quantity -= item.quantity;

        // Ensure the product quantity doesn't go below zero
        if (product.quantity < 0) {
          throw new Error(`Not enough stock for product ${item.name}`);
        }

        // Save the updated product back to the database
        await product.save();
      }

      // Update order status to 'PAID'
      order.orderStatus = 'PAID';
      await order.save();
    } catch (error) {
      throw new Error(`Order update failed: ${error.message}`);
    }
  }

  async createOrder(createOrderDto: createOrderDto) {
    try {
      const headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };

      createOrderDto.orderStatus = 'Failed';

      let email = createOrderDto.email;
      let amount = createOrderDto.amount;
      let data = {
        email,
        amount: amount * 100, // Convert Naira to kobo
        callback: 'www.google.com',
      };

      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        data,
        { headers },
      );

      console.log(response.data.data);
      // await delay(2000);

      // Check if Paystack transaction initialization was successful
      if (!response.data.data.reference) {
        throw new Error('Failed to retrieve reference from Paystack');
      }

      let newOrder = await new this.orderModel(createOrderDto);

      // Validate the product creation
      if (!newOrder) {
        throw new Error('Order creation failed');
      }

      newOrder.reference = response.data.data.reference;

      await newOrder.save();
      return response.data;
    } catch (error) {
      // Handle validation or other errors
      return {
        status: false,
        message: 'Order creation failed',
        error: error.message || 'An error occurred during Order creation',
      };
    }
  }

  async verify(createOrderDto: createOrderDto, reference: string) {
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
    };
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers },
    );

    return {
      status: true,
      data: response.data,
    };
  }

  async getOrders() {
    return await this.orderModel.find();
  }

  async getOrderById(id: string) {
    return await this.orderModel.findById(id);
  }

  async updateOrder(id: string, updateProductDto) {
    return await this.orderModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async deleteOrder(id: string) {
    try {
      // Check if the product exists
      const order = await this.orderModel.findById(id);
      if (!order) {
        return { status: false, message: 'Order not found' };
      }

      // Delete the product
      await this.orderModel.findByIdAndDelete(id);

      return { status: true, message: 'Order successfully deleted' };
    } catch (error) {
      // Handle unexpected errors
      return {
        status: false,
        message: 'Failed to delete order',
        error: error.message || 'An unexpected error occurred',
      };
    }
  }
}
