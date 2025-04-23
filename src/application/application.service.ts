import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JobService } from 'src/jobs/jobs.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    private mailerService: MailerService,
    private jobService: JobService,
  ) {}

  async create(dto: CreateApplicationDto, userId: number) {
    if (!userId) throw new NotFoundException('user id not found');
    const job = await this.jobService.findOne(dto.jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.applicationRepo.findOne({
      where: { job: { id: dto.jobId }, user: { id: +userId } },
    });

    if (existing) {
      throw new ConflictException('You already applied for this job');
    }

    const application = this.applicationRepo.create({
      coverLetter: dto.coverLetter,
      job: { id: dto.jobId },
      user: { id: userId },
    });

    const saved = await this.applicationRepo.save(application);
    const user = await this.applicationRepo.findOne({
      where: { id: saved.id }, // Find the saved application
      relations: ['user', 'job'], // Load the user relation (user_id reference)
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.mailerService
      .sendMail({
        to: user.user.email, // You might need to load full user info with email
        subject: 'Job Application Confirmation',
        text: `You have successfully applied to ${user.job.title} job ID: ${dto.jobId}`,
        html: `<b>You have successfully applied ${user.job.title} to job ID: ${dto.jobId}</b>`,
      })
      .then(() => console.log('email sent'))
      .catch((e) => {
        throw new InternalServerErrorException('Email sent Faild');
      });

    return saved;
  }

  async findAll() {
    return await this.applicationRepo.find({
      relations: ['user', 'job'],
      select: {
        // only select specific fields
        coverLetter: true,
        job: {
          title: true,
          description: true,
          location: true,
          salary: true,
        }, // select specific fields in the job relation
        user: { email: true, role: true }, // select specific fields in the user relation, exclude password
      },
    });
  }

  async findOne(id: number) {
    const application = await this.applicationRepo.findOne({
      where: { id },
      relations: ['user', 'job'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async update(id: number, dto: UpdateApplicationDto) {
    const application = await this.findOne(id);

    Object.assign(application, dto);

    return await this.applicationRepo.save(application);
  }

  async remove(id: number) {
    const application = await this.findOne(+id);
    return await this.applicationRepo.remove(application);
  }
}
