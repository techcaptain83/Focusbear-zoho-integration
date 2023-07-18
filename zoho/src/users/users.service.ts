import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
  async update(id: number, user: Partial<User>): Promise<void> {
    await this.userRepository.update(id, user);
  }
}
