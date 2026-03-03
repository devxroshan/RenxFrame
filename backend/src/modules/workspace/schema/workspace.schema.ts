import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema({ timestamps: true })
export class Workspace {
    @Prop({required: true, type: String})
    owner: string;

    @Prop({required: true, type: String})
    name: string;

    @Prop({type: String, default: ""})
    logo: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
