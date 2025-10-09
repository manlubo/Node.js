import { PostDto } from "./blog.model";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "./blog.schema";
import {Model} from "mongoose";

export interface BlogRepository {
  getAllPosts(): Promise<Blog[]>;
  createPost(postDto: PostDto): void;
  getPost(id: string): Promise<PostDto>;
  deletePost(id: string): void;
  updatePost(id: string, postDto: PostDto): void;
}

@Injectable()
export class BlogMongoRepository implements BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  // 모든 게시글을 읽어오는 함수
  async getAllPosts(): Promise<Blog[]> {
    return this.blogModel.find();
  }

  // 게시글 작성
  async createPost(postDto: PostDto) {
    const createPost = {
      ...postDto,
      regDate: new Date(),
      modDate: new Date(),
    };
    await this.blogModel.create(createPost);
  }

  // 하나의 게시글 읽기
  async getPost(id: string): Promise<PostDto> {
    const post = await this.blogModel.findById(id);
    if (!post) {
      throw new NotFoundException("게시글을 찾을 수 없습니다.");
    }
    return post.toJSON() as PostDto;
  }

  // 하나의 게시글 삭제
  async deletePost(id: string) {
    await this.blogModel.findByIdAndDelete(id);
  }

  // 게시글 업데이트
  async updatePost(id: string, postDto: PostDto) {
    const updatePost = {...postDto, id, modDate: new Date() };
    await this.blogModel.findByIdAndUpdate(id, updatePost);
  }
}