import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Admin } from 'src/schemas/Admin.schema';
const nodemailer = require('nodemailer');

@Injectable()
export class AuthService {
  constructor(@InjectModel(Admin.name) private adminModel) {}

  saltOrRounds = Number(process.env.HASH_SALT);

  async encrypt(data: string) {
    const hash = await bcrypt.hash(data, this.saltOrRounds);
    return hash;
  }

  async sendOTP(data: { email: string }) {
    try {
      // Generate OTP
      let OTP: string = this.generateOtp2(
        process.env.DEFAULT_SECRET,
        data.email,
      );
      // Send OTP via email
      await this.sendEmail(data.email, OTP);

      return {
        status: true,
        message: `OTP sent`,
      };
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  async resendOTP(data: { email: string }) {
    try {
      const OTP = this.generateOtp2(process.env.DEFAULT_SECRET, data.email);

      // Send the OTP via email
      await this.sendEmail(data.email, OTP);

      return {
        status: true,
        message: 'OTP sent',
      };
    } catch (error) {
      return {
        status: false,
        data: error,
      };
    }
  }

  //add query date range
  async verifyOTP(data: { email: string; otp: string }) {
    try {
      const validUser = this.verifyOtp(
        process.env.DEFAULT_SECRET,
        data.email,
        data.otp,
      );
      //send notifications here and for refunds
      if (validUser) {
        return {
          status: true,
          message: 'OTP is valid',
        };
      } else {
        return {
          status: false,
          message: 'Invalid or expired OTP',
        };
      }
    } catch (error) {
      return {
        status: false,
        message: 'An error occurred during verification',
        data: error,
      };
    }
  }

  verifyOtp(secret: string, email: string, token: string): boolean {
    const verified = speakeasy.totp.verify({
      secret: secret + email, // The same secret used during generation
      encoding: 'base32',
      token: token, // The OTP entered by the user
      step: 180, // Ensure step matches what was used during generation
      window: 1, // Allow one window of deviation (i.e., allow token to be valid within 2 time steps)
    });

    return verified; // Returns true if OTP is valid, false otherwise
  }

  generateOtp2(secret: string, email: string) {
    const otp = speakeasy.totp({
      secret: secret + email,
      encoding: 'base32',
      step: 180,
      digits: 6,
    });
    return otp;
  }

  async extractUserFromToken(token: string) {
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    return decoded;
  }

  extractTokenFromHeader(request: any) {
    const token = request.headers.authorization?.split(' ')[1];
    return token;
  }

  async getLoggedInUser(request: any) {
    const token = this.extractTokenFromHeader(request);
    const decoded = jwt.verify(token, process.env.DEFAULT_SECRET);
    return decoded;
  }

  async sendEmail(to: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY, // Application-specific password
      },
    });

    const mailOptions = {
      from: 'fashattire@gmail.com',
      to: to,
      subject: 'DO NOT DISCLOSE YOUR CODE.',
      text: `Your Passcode is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
