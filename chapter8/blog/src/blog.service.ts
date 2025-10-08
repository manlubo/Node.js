import { PostDto } from './blog.model';

import {BlogFileRepository, BlogRepository} from "./blog.repository";

let idx:number = 1;

export class BlogService {
  // posts: PostDto[] = [];
  blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogFileRepository();
  }

  async getAllPosts() {
    return await this.blogRepository.getAllPosts();
  }

  createPost(postDto: PostDto) {
    this.blogRepository.createPost(postDto);
  }

  async getPost(id:number): Promise<PostDto> {
    return await this.blogRepository.getPost(id);
  }

  deletePost(id:number) {
    this.blogRepository.deletePost(id);
  }

  updatePost(id:number, postDto: PostDto) {
    this.blogRepository.updatePost(id, postDto);
  }

}