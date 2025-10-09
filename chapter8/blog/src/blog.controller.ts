import { Controller, Param, Body, Delete, Get, Post, Put } from "@nestjs/common";
import {BlogService} from "./blog.service";


@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  getAllPosts() {
    console.log('모든 게시글 가져오기')
    return this.blogService.getAllPosts();
  }

  @Post()
  async createPost(@Body() postDto) {
    console.log('게시글 작성')
    console.log(postDto);
    await this.blogService.createPost(postDto)
    return "success";
  }

  @Get("/:id")
  getPost(@Param('id') id: string) {
    console.log(`[id: ${id}] 게시글 하나 가져오기`);
    return this.blogService.getPost(id);
  }

  @Delete("/:id")
  async deletePost(@Param('id') id: string) {
    console.log('게시글 삭제');
    await this.blogService.deletePost(id);
    return "success";
  }

  @Put("/:id")
  async updatePost(@Param('id') id: string, @Body() postDto) {
    console.log(`게시글 업데이트`, id, postDto);
    return this.blogService.updatePost(id, postDto);
  }
}