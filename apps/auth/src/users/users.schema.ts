import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;
  @Prop()
  password: string;
}

export interface PasswordExcludedUserDocument extends Omit<User, 'password'> {}

export const UserSchema = SchemaFactory.createForClass(User);
