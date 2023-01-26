import { Body, Controller, Post } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { AuthService } from './auth.service';
import { CreateUserDto } from './input/create.user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class usersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, retypedPassword, username, email, firstName, lastName } =
      createUserDto;
    const user = new User();

    if (password !== retypedPassword) {
      throw new BadRequestException(['Passwords do not match']);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        {
          username,
        },
        { email },
      ],
    });
    if (existingUser) {
      throw new BadRequestException(['username or email is already taken']);
    }

    user.username = username;
    user.password = await this.authService.hashpassword(password);
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }
}
