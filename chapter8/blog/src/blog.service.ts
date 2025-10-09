import { PostDto } from './blog.model';

import {BlogMongoRepository} from "./blog.repository";
import {Injectable} from "@nestjs/common";



@Injectable()
export class BlogService {

  constructor(private blogRepository: BlogMongoRepository) {}

  async getAllPosts() {
    return await this.blogRepository.getAllPosts();
  }

  async createPost(postDto: PostDto) {
    await this.blogRepository.createPost(postDto);
  }

  async getPost(id:string): Promise<PostDto> {
    return await this.blogRepository.getPost(id);
  }

  async deletePost(id:string) {
    await this.blogRepository.deletePost(id);
  }

  async updatePost(id:string, postDto: PostDto) {
    await this.blogRepository.updatePost(id, postDto);
  }

}