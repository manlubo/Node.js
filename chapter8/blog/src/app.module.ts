import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import {BlogMongoRepository} from "./blog.repository";
import {MongooseModule} from "@nestjs/mongoose";
import {Blog, BlogSchema} from "./blog.schema";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
    ,
    MongooseModule.forRoot(
      `${process.env.MONGODB_URI}`, {
        dbName: 'blog'
      }
    ),
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogMongoRepository],
})
export class AppModule {}
