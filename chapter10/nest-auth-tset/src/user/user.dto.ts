import {IsEmail, IsString} from "class-validator";

// 가입용 DTO
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}

// 수정용 DTO
export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}