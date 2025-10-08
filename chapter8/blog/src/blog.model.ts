export interface PostDto {
  id: number;
  title: string;
  content: string;
  name: string;
  regDate: Date;
  modDate?: Date;
}