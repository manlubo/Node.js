import { readFile, writeFile } from "node:fs/promises";
import { PostDto } from "./blog.model";
import {NotFoundError} from "rxjs";

export interface BlogRepository {
  getAllPosts(): Promise<PostDto[]>;
  createPost(postDto: PostDto): void;
  getPost(id: number): Promise<PostDto>;
  deletePost(id: number): void;
  updatePost(id: number, postDto: PostDto);
}

let idx:number = 1;

export class BlogFileRepository implements BlogRepository {
  FILE_NAME = './src/blog.data.json';

  async getAllPosts(): Promise<PostDto[]> {
    const datas = await readFile(this.FILE_NAME, 'utf8');
    const posts: PostDto[] = JSON.parse(datas);
    return posts;
  }

  async createPost(postDto: PostDto) {
    const posts = await this.getAllPosts();
    const id = idx++;
    const createPost = {...postDto, id, regDate: new Date()};
    posts.push(createPost);
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }

  async getPost(id: number): Promise<PostDto> {
    const posts = await this.getAllPosts();
    const result = posts.find(post => post.id === id);
    if(!result) {
      throw new NotFoundError("해당 게시글을 찾지 못했습니다.");
    }
    return result;
  }

  async deletePost(id: number) {
    const posts = await this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
  }

  async updatePost(id: number, postDto: PostDto) {
    const posts = await this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);

    posts[index] = { ...postDto, id, modDate: new Date() };
    await writeFile(this.FILE_NAME, JSON.stringify(posts));
  }
}