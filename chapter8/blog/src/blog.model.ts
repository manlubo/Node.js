export interface PostDto {
  id: string;
  title: string;
  content: string;
  name: string;
  regDate: Date;
  modDate?: Date;
}