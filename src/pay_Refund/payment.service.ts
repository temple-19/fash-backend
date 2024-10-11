import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Order } from 'src/schemas/Order.schema';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Order.name) private orderModel?: Model<Order>) {}
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  async refund(body) {
    try {
      // Find the order reference in the database
      const refOrder = await this.orderModel.findOne({
        reference: body.reference,
      });

      if (!refOrder) {
        // If the reference does not exist, return a clear message
        return { status: false, message: 'Order not found' };
      }

      // Prepare refund request data
      const headers = {
        authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };

      const transaction = body.reference;
      const amount = body.amount * 100; // Amount in kobo (for Paystack)

      const data = {
        transaction,
        amount,
      };

      // Make refund request to Paystack
      const response = await axios.post(
        'https://api.paystack.co/refund',
        data,
        {
          headers,
        },
      );

      // Log response for debugging purposes (ensure sensitive data is not logged)
      console.log('Refund successful:', response.data);

      // Update order status to 'refunded' if successful
      refOrder.orderStatus = 'refunded';
      await refOrder.save();

      // Return success response
      return {
        status: true,
        message: 'Refund successful',
        data: response.data,
      };
    } catch (error) {
      // Enhanced error handling

      // Check for network-related errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('Refund request timed out:', error.message);
        return {
          status: false,
          message: 'Refund request timed out. Please try again later.',
        };
      }

      // Handle API errors from Paystack
      if (error.response) {
        const errorData = error.response.data;
        const statusCode = error.response.status;

        console.error(
          `Refund request failed with status ${statusCode}:`,
          errorData,
        );

        // Handle specific status codes
        if (statusCode === 400) {
          return {
            status: false,
            message:
              'Invalid refund request. Please check the details and try again.',
          };
        } else if (statusCode === 404) {
          return {
            status: false,
            message: 'Transaction not found. Please check the reference ID.',
          };
        } else if (statusCode === 500) {
          return {
            status: false,
            message: 'Paystack server error. Please try again later.',
          };
        }

        // Generic API error message
        return {
          status: false,
          message:
            errorData.message || 'Refund request failed. Try again later.',
        };
      }
    }
  }

  async getRefunds() {
    try {
      const headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post('https://api.paystack.co/refund', {
        headers,
      });

      return { status: true, message: response.data };
    } catch (error) {
      console.log(error);
    }
  }
}
