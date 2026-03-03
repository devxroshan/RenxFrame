import { SetMetadata } from "@nestjs/common";

export const VALIDATE_MONGO_ID = 'validate_mongo_id';

interface ValidateMongoIdFields {
    body?: string[],
    param?: string[],
    query?: string[],
}

export const ValidateMongoId = (
    {body = [], param = [], query = []}:ValidateMongoIdFields
) => SetMetadata(VALIDATE_MONGO_ID, {body, param, query})