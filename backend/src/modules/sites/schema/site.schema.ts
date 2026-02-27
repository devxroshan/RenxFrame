import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
    @Prop({required: true, type: String})
    owner: string; // Postgres user id

    @Prop({required: true, type: String})
    name: string;

    @Prop({required: true, type: String, unique: true})
    subdomain: string;

    @Prop({required: true, type: Boolean, default: false})
    isOnline: boolean;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
