import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";


// 블로그이면서, 도큐먼트인 타입 정의
export type BlogDocument = Blog & Document ;

// 스키마임을 나타냄
@Schema({
  // timestamps 옵션을 켜서 자동으로 regDate / modDate 관리
  timestamps: { createdAt: 'regDate', updatedAt: 'modDate' },
  // __v 필드 제거
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class Blog {
  // MongoDB는 id를 자동생성.

  // 스키마의 프로퍼티임을 나타냄
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  name: string;

  @Prop()
  regDate: Date;

  @Prop()
  modDate: Date;
}

// 스키마 생성
export const BlogSchema = SchemaFactory.createForClass(Blog);
