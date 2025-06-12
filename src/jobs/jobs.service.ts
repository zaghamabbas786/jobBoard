import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const job = this.jobRepository.create(createJobDto);
    return await this.jobRepository.save(job);
  }

  async findAll() {
    return await this.jobRepository.find();
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    const updated = this.jobRepository.merge(job, updateJobDto);
    return await this.jobRepository.save(updated);
  }

  async remove(id: number) {
    const job = await this.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return await this.jobRepository.remove(job);
  }
}
