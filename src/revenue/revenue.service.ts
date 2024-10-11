import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revenue } from 'src/schemas/Revenue.schema';

@Injectable()
export class RevenueService {
  private readonly logger = new Logger(RevenueService.name);

  constructor(
    @InjectModel(Revenue.name)
    private readonly monthlyRevenueModel: Model<Revenue>,
  ) {}

  //   @Cron('*/5 * * * * *')
  //   handleCron() {
  //     this.logger.log('Hello'); // Logs "Hello" every 5 seconds
  //   }

  // This will run at midnight on the 1st of every month
  @Cron('0 0 1 * *')
  async resetMonthlyRevenue() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

    // Check if a record for the current month and year exists
    const existingRevenue = await this.monthlyRevenueModel.findOne({
      month: currentMonth,
      year: currentYear,
    });

    if (!existingRevenue) {
      // Create a new entry with 0 revenue if it doesn't exist
      const newRevenue = new this.monthlyRevenueModel({
        month: currentMonth,
        year: currentYear,
        revenue: 0, // Set initial revenue to zero
      });

      await newRevenue.save();
      this.logger.log(
        `New monthly revenue log created for ${currentMonth} ${currentYear}`,
      );
    } else {
      // If it already exists, do nothing (or handle it differently)
      this.logger.log(
        `Monthly revenue log for ${currentMonth} ${currentYear} already exists.`,
      );
    }
  }
}
