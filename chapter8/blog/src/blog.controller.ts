import { Controller, Param, Body, Delete, Get, Post, Put, ParseIntPipe } from "@nestjs/common";
import {BlogService} from "./blog.service";


@Controller('blog')
export class BlogController {
  blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  @Get()
  getAllPosts() {
    console.log('모든 게시글 가져오기')
    return this.blogService.getAllPosts();
  }

  @Post()
  createPost(@Body() postDto) {
    console.log('게시글 작성')
    this.blogService.createPost(postDto)
    return "success";
  }

  @Get("/:id")
  async getPost(@Param('id', ParseIntPipe) id: number) {
    console.log(`[id: ${id}] 게시글 하나 가져오기`);
    return this.blogService.getPost(id);
  }

  @Delete("/:id")
  deletePost(@Param('id', ParseIntPipe) id: number) {
    console.log('게시글 삭제');
    this.blogService.deletePost(id);
    return "success";
  }

  @Put("/:id")
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() postDto) {
    console.log(`게시글 업데이트`, id, postDto);
    return this.blogService.updatePost(id, postDto);
  }
}