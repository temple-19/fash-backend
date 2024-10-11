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
    //add logic for refund here and test
    let refOrder = await this.orderModel.findOne({ reference: body.reference });
    //send refund o6mxm9djkd
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };

    let transaction = body.transaction;
    let amount = body.amount;
    let data = {
      transaction,
      amount: amount * 100, // Convert Naira to kobo
    };
    const response = await axios.post('https://api.paystack.co/refund', data, {
      headers,
    });

    //if refund valid edit reforder.orderstaus to refunded
  }

  async getRefunds() {
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post('https://api.paystack.co/refund', {
      headers,
    });

    return { status: true, message: response };
  }
}
